import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  closeSync,
  fsyncSync,
  openSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import { localConfig } from "./dev-config.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function atomicWrite(path, content) {
  const temp = `${path}.${process.pid}.tmp`;
  const descriptor = openSync(temp, "wx", 0o600);
  try {
    writeFileSync(descriptor, content, "utf8");
    fsyncSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
  try {
    renameSync(temp, path);
    if (process.platform !== "win32") chmodSync(path, 0o600);
  } catch (error) {
    try {
      unlinkSync(temp);
    } catch {}
    throw error;
  }
}

try {
  if (
    process.argv[2] !== "--approve-local-password" ||
    process.argv.length !== 3
  )
    throw new Error(
      "This credential-only action requires explicit owner approval: --approve-local-password.",
    );
  const endpointResult = spawnSync(
    "docker",
    ["context", "inspect", "--format", '{{(index .Endpoints "docker").Host}}'],
    { encoding: "utf8" },
  );
  const endpoint = process.env.DOCKER_HOST || endpointResult.stdout.trim();
  if (endpointResult.status !== 0 || !/^(unix:\/\/|npipe:\/\/)/.test(endpoint))
    throw new Error(
      "Local credential setup requires a local Docker socket/context.",
    );
  const config = localConfig(
    readFileSync(join(root, "supabase/config.toml"), "utf8"),
  );
  const envPath = join(root, ".env");
  const original = readFileSync(envPath, "utf8");
  const pattern = /^(?:export\s+)?ASGARD_DATABASE_URL\s*=[^\r\n]*/gm;
  const matches = [...original.matchAll(pattern)];
  if (matches.length > 1)
    throw new Error(
      "Resolve duplicate ASGARD_DATABASE_URL entries before provisioning.",
    );
  if (parseEnv(original).ASGARD_DATABASE_URL)
    throw new Error(
      "A database credential already exists. Password rotation needs a separate review.",
    );
  const password = randomBytes(32).toString("hex");
  const sql = `DO $$ BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='asgard_app'
  AND rolcanlogin AND NOT rolsuper AND NOT rolbypassrls AND NOT rolcreaterole
  AND NOT rolcreatedb AND NOT rolinherit AND NOT rolreplication)
THEN RAISE EXCEPTION 'Approved application role is missing or unsafe'; END IF;
ALTER ROLE asgard_app PASSWORD '${password}'; END $$;`;
  const value = `ASGARD_DATABASE_URL=postgresql+psycopg://asgard_app:${password}@supabase_db_${config.project}:5432/postgres`;
  const updated = matches.length
    ? original.replace(pattern, () => value)
    : original.trimEnd() + "\n" + value + "\n";
  // Persist the only recovery copy before changing the database role. If this
  // fails, no database credential has been changed.
  atomicWrite(envPath, updated);
  console.log(
    "Local application password recorded in ignored .env before database provisioning. Credentials were not printed.",
  );
  const result = spawnSync(
    "docker",
    [
      "exec",
      "-i",
      `supabase_db_${config.project}`,
      "psql",
      "-U",
      "postgres",
      "-d",
      "postgres",
      "-v",
      "ON_ERROR_STOP=1",
    ],
    {
      cwd: root,
      input: sql,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    },
  );
  if (result.status !== 0) {
    try {
      atomicWrite(envPath, original);
    } catch {
      throw new Error(
        "Database provisioning failed and .env rollback failed. The generated credential remains only in ignored .env; inspect the local role before removing it.",
      );
    }
    throw new Error(
      "Database provisioning failed. The original .env was restored; no credential was printed.",
    );
  }
  console.log(
    "Least-privilege application password initialized. No role privileges or schema were changed; Auth remains disabled until separately activated.",
  );
} catch (error) {
  console.error(`STOPPED: ${error.message}`);
  process.exitCode = 1;
}
