import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import { checkedPort, localConfig } from "./dev-config.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const envPath = join(root, ".env");
const keyPath = join(root, "supabase/signing-keys.json");
const cliPath = join(root, "node_modules/supabase/dist/supabase.js");
const config = localConfig(
  readFileSync(join(root, "supabase/config.toml"), "utf8"),
);

function run(command, args, { capture = false } = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: capture ? "pipe" : "inherit",
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    const detail = capture ? "" : ` ${result.error?.message ?? ""}`;
    throw new Error(`${command} ${args.slice(0, 2).join(" ")} failed.${detail}`);
  }
  return result.stdout?.trim() ?? "";
}

function runNode(args) {
  run(process.execPath, args);
}

function runNpm(args, options) {
  const command = `npm ${args.join(" ")}`;
  const result = spawnSync("cmd.exe", ["/d", "/s", "/c", command], {
    cwd: root,
    encoding: "utf8",
    stdio: options?.capture ? "pipe" : "inherit",
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.error || result.status !== 0)
    throw new Error(`npm ${args[0]} failed. ${options?.capture ? "" : result.error?.message ?? ""}`);
  return result.stdout?.trim() ?? "";
}

function checkPrerequisites() {
  if (process.platform !== "win32")
    throw new Error("Setup-Asgard.cmd is for Windows. On Linux, use the Bash steps in README.md.");

  const [major, minor] = process.versions.node.split(".").map(Number);
  if (major !== 24 || minor < 19)
    throw new Error("Install Node.js 24.19.0 or a later Node 24 patch, then run Setup-Asgard.cmd again.");

  const npmVersion = runNpm(["--version"], { capture: true });
  if (Number(npmVersion.split(".")[0]) !== 11)
    throw new Error("This project requires npm 11. Reinstall the pinned Node 24 release and try again.");

  let dockerOs;
  try {
    const endpoint =
      process.env.DOCKER_HOST ||
      run(
        "docker",
        [
          "context",
          "inspect",
          "--format",
          '{{(index .Endpoints "docker").Host}}',
        ],
        { capture: true },
      );
    if (!/^(unix:\/\/|npipe:\/\/)/.test(endpoint))
      throw new Error("Remote Docker contexts are not supported.");
    dockerOs = run("docker", ["info", "--format", "{{.OSType}}"], {
      capture: true,
    });
    run("docker", ["compose", "version"], { capture: true });
  } catch {
    throw new Error("Install Docker Desktop with WSL2 if needed, start it with Linux containers, then run the launcher again.");
  }
  if (dockerOs !== "linux")
    throw new Error("Switch Docker Desktop to Linux containers, then run Setup-Asgard.cmd again.");
}

function installLockedCli() {
  let installedVersion;
  try {
    installedVersion = JSON.parse(
      readFileSync(join(root, "node_modules/supabase/package.json"), "utf8"),
    ).version;
  } catch {}
  if (installedVersion !== "2.122.0") {
    console.log("Installing the repository's locked local tools with npm ci...");
    runNpm(["ci"]);
  }
  if (!existsSync(cliPath))
    throw new Error("The locked Supabase CLI is missing. Run npm ci from the repository root and retry.");
}

function readEnvironment() {
  if (!existsSync(envPath)) {
    copyFileSync(join(root, ".env.example"), envPath);
    console.log("Created the local .env from .env.example. Keep it private and do not commit it.");
  }
  return parseEnv(readFileSync(envPath, "utf8"));
}

function checkShellOverrides(values) {
  const names = [
    "ASGARD_PROJECT_ID",
    "FRONTEND_PORT",
    "BACKEND_PORT",
    "ASGARD_SUPABASE_URL",
    "ASGARD_SUPABASE_ANON_KEY",
    "ASGARD_CORS_ORIGINS",
    "ASGARD_AUTH_ENABLED",
    "ASGARD_AUTH_ISSUER",
    "ASGARD_DATABASE_URL",
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY",
  ];
  for (const name of names) {
    if (process.env[name] !== undefined && process.env[name] !== values[name])
      throw new Error(`Shell variable ${name} overrides .env. Clear it in this terminal before continuing.`);
  }
  if (
    process.env.COMPOSE_PROJECT_NAME &&
    process.env.COMPOSE_PROJECT_NAME !== config.project
  )
    throw new Error("Clear COMPOSE_PROJECT_NAME in this terminal before continuing.");
  if (process.env.COMPOSE_FILE)
    throw new Error("Clear COMPOSE_FILE in this terminal before continuing.");
}

async function confirm(rl, question, requiredText) {
  console.log(`\n${question}`);
  const answer = (await rl.question(`Type ${requiredText} to continue: `)).trim();
  return answer === requiredText;
}

function createSigningKey() {
  if (existsSync(keyPath))
    throw new Error("The signing-key file appeared during setup. Keep it and inspect the environment before continuing.");
  writeFileSync(keyPath, "[]\n", { flag: "wx", mode: 0o600 });
  try {
    run(
      process.execPath,
      [
        cliPath,
        "gen",
        "signing-key",
        "--algorithm",
        "ES256",
        "--append",
      ],
      { capture: true },
    );
  } catch (error) {
    if (readFileSync(keyPath, "utf8") === "[]\n") unlinkSync(keyPath);
    throw new Error(`Signing-key generation stopped. No key was printed. ${error.message}`);
  }
}

function enableLocalAuth() {
  const source = readFileSync(envPath, "utf8");
  const matches = [...source.matchAll(/^(?:export\s+)?ASGARD_AUTH_ENABLED\s*=[^\r\n]*/gm)];
  if (matches.length !== 1)
    throw new Error("Expected exactly one ASGARD_AUTH_ENABLED entry in .env. Review it manually; no setting was changed.");
  if (parseEnv(source).ASGARD_AUTH_ENABLED === "true") return;
  const updated = source.replace(
    /^(?:export\s+)?ASGARD_AUTH_ENABLED\s*=[^\r\n]*/m,
    "ASGARD_AUTH_ENABLED=true",
  );
  writeFileSync(envPath, updated);
}

function openLocalPages() {
  const values = readEnvironment();
  const frontendPort = checkedPort(
    values.FRONTEND_PORT ?? 5173,
    "FRONTEND_PORT",
  );
  for (const url of [
    `http://127.0.0.1:${frontendPort}`,
    `http://127.0.0.1:${config.mail}`,
  ]) {
    const result = spawnSync("cmd.exe", ["/c", "start", "", url], {
      cwd: root,
      stdio: "ignore",
      windowsHide: true,
    });
    if (result.error || result.status !== 0)
      console.log(`Open this address in your browser: ${url}`);
  }
  if (values.ASGARD_AUTH_ENABLED === "true")
    console.log("\nVerification codes are in the local inbox. They are not sent to real email addresses.");
  else
    console.log("\nLocal Auth is disabled. The inbox will not receive signup codes until the project lead approves Auth activation.");
}

async function main() {
  const mode = process.argv[2] ?? "setup";
  if (process.argv.length > 3 || !["setup", "start"].includes(mode))
    throw new Error("Usage: node scripts/setup-windows.mjs [setup|start]");
  checkPrerequisites();
  installLockedCli();
  let values = readEnvironment();
  checkShellOverrides(values);
  if (mode === "start") {
    runNode([join(root, "scripts/dev.mjs"), "start"]);
    openLocalPages();
    return;
  }

  const hasKey = existsSync(keyPath);
  const hasDatabaseCredential = Boolean(values.ASGARD_DATABASE_URL);
  const rl = createInterface({ input: stdin, output: stdout });

  try {
    if (!hasDatabaseCredential) {
      console.log(
        "\nFresh local setup will keep or generate this checkout's private signing key, start Supabase (which may initialize the committed migrations), and create a restricted local database password. It will not reset or delete Docker data.",
      );
      const approved = await confirm(
        rl,
        "Continue only if this is a brand-new local database, or the same fresh setup previously started by this script with no user data, and the project lead approved initialization and credential provisioning. If this Docker project may contain existing data, stop and ask the project lead.",
        "INITIALIZE",
      );
      if (!approved) {
        console.log("Stopped without initializing Supabase or changing database credentials.");
        process.exitCode = 1;
        return;
      }
      if (!hasKey) createSigningKey();
      runNode([join(root, "scripts/dev.mjs"), "start"]);
      runNode([
        join(root, "scripts/provision-local-db.mjs"),
        "--approve-local-password",
      ]);
      values = readEnvironment();
    } else if (hasKey !== hasDatabaseCredential) {
      throw new Error(
        "This checkout has partial local Auth state (only a signing key or only a database credential). Do not initialize or replace either one-click. Follow README.md's recovery instructions or ask the project lead.",
      );
    }

    if (values.ASGARD_AUTH_ENABLED !== "true") {
      const approved = await confirm(
        rl,
        "Has the project lead approved enabling local email/password Auth for this environment? The script will save that setting in your ignored .env, then start the app for your manual signup, verification, sign-in, and Profile checks.",
        "ENABLE AUTH",
      );
      if (approved) enableLocalAuth();
      else console.log("Auth remains disabled. The local stack will start without app sign-in.");
    }
  } finally {
    rl.close();
  }

  runNode([join(root, "scripts/dev.mjs"), "start"]);
  openLocalPages();
}

main().catch((error) => {
  console.error(`\nSetup stopped: ${error.message}`);
  console.error("No Docker data was reset or deleted. See README.md > Getting started for recovery steps.");
  process.exitCode = 1;
});
