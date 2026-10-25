import { spawnSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
  chmodSync,
} from "node:fs";
import { createServer } from "node:net";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import { localConfig, checkedPort, updateEnvironment } from "./dev-config.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const config = localConfig(
  readFileSync(join(root, "supabase/config.toml"), "utf8"),
);
const envPath = join(root, ".env");
const cliPath = join(root, "node_modules/supabase/dist/supabase.js");
const action = process.argv[2] ?? "start";

function run(command, args, { capture = false, privateOutput = false } = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: capture || privateOutput ? "pipe" : "inherit",
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    if (privateOutput)
      throw new Error(
        "Supabase command failed. Run npx --no-install supabase start/status locally to inspect it; its output can contain local credentials.",
      );
    throw new Error(
      `${command} ${args.slice(0, 4).join(" ")} failed. ${result.error?.message ?? result.stderr ?? ""}`,
    );
  }
  return result.stdout?.trim() ?? "";
}
const docker = (args, options) => run("docker", args, options);
const cli = (args, options) =>
  run(process.execPath, [cliPath, ...args], options);
const compose = (args) => docker(["compose", ...args]);

function preflight() {
  const [major, minor] = process.versions.node.split(".").map(Number);
  if (major !== 24 || minor < 19)
    throw new Error(
      "Use Node 24.19.0 or a later Node 24 patch; see .node-version.",
    );
  const endpoint =
    process.env.DOCKER_HOST ||
    docker(
      [
        "context",
        "inspect",
        "--format",
        '{{(index .Endpoints "docker").Host}}',
      ],
      {
        capture: true,
      },
    );
  if (!/^(unix:\/\/|npipe:\/\/)/.test(endpoint))
    throw new Error(
      "Use a local Docker socket/context; remote Docker endpoints are outside this helper’s scope.",
    );
  const os = docker(["info", "--format", "{{.OSType}}"], { capture: true });
  if (os !== "linux")
    throw new Error(
      "Start a Linux-container Docker daemon. On Linux, verify docker info works as your login user; on Windows, start Docker Desktop/WSL2.",
    );
  docker(["compose", "version"], { capture: true });
  if (!existsSync(cliPath))
    throw new Error(
      "Run npm ci at the repository root to install the locked Supabase CLI.",
    );
  if (cli(["--version"], { capture: true }) !== "2.122.0")
    throw new Error(
      "Supabase CLI must match the root lockfile (2.122.0). Run npm ci.",
    );
}

function environment() {
  if (!existsSync(envPath)) copyFileSync(join(root, ".env.example"), envPath);
  return parseEnv(readFileSync(envPath, "utf8"));
}

function assertShellEnvironment(values) {
  for (const name of [
    "ASGARD_PROJECT_ID",
    "FRONTEND_PORT",
    "BACKEND_PORT",
    "ASGARD_SUPABASE_URL",
    "ASGARD_SUPABASE_ANON_KEY",
    "ASGARD_CORS_ORIGINS",
  ]) {
    if (process.env[name] !== undefined && process.env[name] !== values[name])
      throw new Error(
        `Shell variable ${name} overrides .env. Unset it before continuing; its value was not printed.`,
      );
  }
  if (
    process.env.COMPOSE_PROJECT_NAME &&
    process.env.COMPOSE_PROJECT_NAME !== config.project
  )
    throw new Error(
      "Unset COMPOSE_PROJECT_NAME; this checkout uses the Supabase project_id.",
    );
  if (process.env.COMPOSE_FILE)
    throw new Error("Unset COMPOSE_FILE before using this local helper.");
}

function assertLocalEnvironment() {
  const values = environment();
  assertShellEnvironment(values);
  if (
    values.ASGARD_PROJECT_ID !== config.project ||
    values.ASGARD_SUPABASE_URL !==
      `http://supabase_kong_${config.project}:8000` ||
    !values.ASGARD_SUPABASE_ANON_KEY
  )
    throw new Error(
      "Local .env is missing/stale. Start this checkout’s Supabase and run node scripts/dev.mjs env.",
    );
}

async function checkPorts() {
  const env = environment();
  const ports = [
    checkedPort(env.FRONTEND_PORT ?? 5173, "FRONTEND_PORT"),
    checkedPort(env.BACKEND_PORT ?? 8000, "BACKEND_PORT"),
    config.api,
    config.db,
    config.shadow,
    config.studio,
    config.mail,
  ];
  if (new Set(ports).size !== ports.length)
    throw new Error("Local service ports must be distinct.");
  const running = docker(["ps", "--format", "{{json .}}"], { capture: true })
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  for (const port of ports) {
    const owned = running.some(
      (row) =>
        (row.Names.endsWith(`_${config.project}`) ||
          row.Names.startsWith(`${config.project}-`)) &&
        row.Ports.includes(`:${port}->`),
    );
    if (owned) continue;
    await new Promise((resolve, reject) => {
      const server = createServer();
      server.once("error", () =>
        reject(
          new Error(
            `Port ${port} is unavailable. Resolve the conflict manually; no containers were stopped.`,
          ),
        ),
      );
      server.listen({ host: "127.0.0.1", port, exclusive: true }, () =>
        server.close(resolve),
      );
    });
  }
}

function syncEnvironment() {
  environment();
  const status = JSON.parse(
    cli(["status", "--output", "json"], { privateOutput: true }),
  );
  if (new URL(status.API_URL).port !== String(config.api))
    throw new Error(
      "Supabase status does not match this checkout configuration.",
    );
  docker(["network", "inspect", `supabase_network_${config.project}`], {
    capture: true,
  });
  const text = updateEnvironment(
    readFileSync(envPath, "utf8"),
    config,
    status.ANON_KEY,
  );
  assertShellEnvironment(parseEnv(text));
  writeFileSync(envPath, text, { mode: 0o600 });
  if (process.platform !== "win32") chmodSync(envPath, 0o600);
  console.log(
    "Local .env regenerated from the template/current file and this project’s CLI status. Credentials were not printed.",
  );
}

function checkMigrations() {
  const result = JSON.parse(
    cli(["db", "push", "--local", "--dry-run"], { privateOutput: true }),
  );
  if (!result.upToDate)
    throw new Error(
      "Pending local migrations. Review npx --no-install supabase db push --local --dry-run, then explicitly apply reviewed migrations with --local. Startup did not modify the database.",
    );
  console.log(
    "Local migration dry-run: up to date; no migration/reset was executed.",
  );
}

async function get(url, options) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
    ...options,
  });
  if (!response.ok)
    throw new Error(
      `Connectivity failed: ${new URL(url).pathname} returned HTTP ${response.status}.`,
    );
  return response;
}

async function verify() {
  const env = environment();
  assertShellEnvironment(env);
  const frontend = `http://127.0.0.1:${checkedPort(env.FRONTEND_PORT, "FRONTEND_PORT")}`;
  const backend = `http://127.0.0.1:${checkedPort(env.BACKEND_PORT, "BACKEND_PORT")}`;
  await get(frontend);
  if ((await (await get(`${frontend}/api/v1/health`)).json()).status !== "ok")
    throw new Error("Frontend API proxy health check failed.");
  if ((await (await get(`${frontend}/api/v1/ready`)).json()).status !== "ready")
    throw new Error("Backend Supabase REST readiness check failed.");
  await get(`${backend}/docs`);
  await get(`http://127.0.0.1:${config.studio}`);
  const rows = await (
    await get(
      `http://127.0.0.1:${config.studio}/api/platform/pg-meta/default/query`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: "select 1 as onboarding_probe;" }),
      },
    )
  ).json();
  if (!Array.isArray(rows) || rows[0]?.onboarding_probe !== 1)
    throw new Error("Studio database read-only query failed.");
  const probe = `import os,socket,struct,httpx
url=os.environ['ASGARD_SUPABASE_URL']
key=os.environ['ASGARD_SUPABASE_ANON_KEY']
r=httpx.get(url+'/auth/v1/health',headers={'apikey':key},timeout=5)
assert r.status_code==200, 'Supabase Auth health failed'
with socket.create_connection(('supabase_db_${config.project}',5432),timeout=5) as s:
 s.sendall(struct.pack('!II',8,80877103))
 assert s.recv(1) in (b'S',b'N'), 'PostgreSQL protocol probe failed'
print('Backend -> Supabase Auth health and PostgreSQL protocol: PASS')`;
  compose(["exec", "-T", "backend", "python", "-c", probe]);
  console.log(
    "Frontend, proxy -> FastAPI, FastAPI -> Supabase REST, and Studio -> database SELECT 1: PASS",
  );
  console.log(
    `READY\nAsgard website: ${frontend}\nFastAPI docs:   ${backend}/docs\nSupabase Studio: http://127.0.0.1:${config.studio}\nConnectivity:   ${frontend}/status`,
  );
  console.log(
    "Database probe verifies reachability/protocol, not an application DB role, grants or RLS. No product auth workflow is enabled.",
  );
}

function check() {
  compose(["config", "--quiet"]);
  compose(["exec", "-T", "backend", "ruff", "check", "."]);
  compose(["exec", "-T", "backend", "pytest", "-q", "-p", "no:cacheprovider"]);
  compose([
    "exec",
    "-T",
    "backend",
    "python",
    "scripts/export_openapi.py",
    "--check",
  ]);
  for (const command of ["typecheck", "lint", "test", "build", "check:api"])
    compose(["exec", "-T", "frontend", "npm", "run", command]);
  cli(["db", "lint", "--local", "--level", "error"]);
  checkMigrations();
}

function generate() {
  const schema = docker(
    [
      "compose",
      "exec",
      "-T",
      "backend",
      "python",
      "scripts/export_openapi.py",
      "--stdout",
    ],
    { capture: true },
  );
  JSON.parse(schema);
  writeFileSync(join(root, "backend/openapi.json"), `${schema}\n`);
  const types = docker(
    [
      "compose",
      "exec",
      "-T",
      "frontend",
      "node",
      "node_modules/openapi-typescript/bin/cli.js",
      "/backend/openapi.json",
    ],
    { capture: true },
  );
  writeFileSync(
    join(root, "frontend/src/api/generated/schema.d.ts"),
    `${types}\n`,
  );
  console.log(
    "OpenAPI and TypeScript definitions regenerated as the host user.",
  );
}

try {
  if (
    !["start", "env", "verify", "check", "generate-api"].includes(action) ||
    process.argv.length > 3
  )
    throw new Error(
      "Usage: node scripts/dev.mjs [start|env|verify|check|generate-api]",
    );
  preflight();
  if (action === "start") {
    await checkPorts();
    console.log(
      "Starting CLI-managed Supabase (first run may download images).",
    );
    cli(["start"], { privateOutput: true });
    syncEnvironment();
    checkMigrations();
    compose(["config", "--quiet"]);
    compose(["up", "--build", "--detach", "--wait", "--wait-timeout", "180"]);
    await verify();
  } else if (action === "env") syncEnvironment();
  else {
    assertLocalEnvironment();
    if (action === "verify") await verify();
    else if (action === "check") check();
    else generate();
  }
} catch (error) {
  console.error(`STOPPED: ${error.message}`);
  console.error(
    "Existing containers/data were not reset or deleted. See README.md troubleshooting.",
  );
  process.exitCode = 1;
}
