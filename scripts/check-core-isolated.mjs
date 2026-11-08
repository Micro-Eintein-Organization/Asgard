import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import { updateEnvironment, localConfig } from "./dev-config.mjs";
import { publicationSQL } from "./content-publication.mjs";
import { competencyAcceptance } from "./competency-acceptance.mjs";
import { publicationAcceptance } from "./publication-acceptance.mjs";
import { careerEvidenceAcceptance } from "./career-evidence-acceptance.mjs";

if (process.argv[2] !== "--run-local")
  throw new Error("Use --run-local to explicitly create isolated local acceptance resources.");
const careerEvidence = process.argv.includes("--career-evidence");
const competenciesOnly = process.argv.includes("--competencies") || careerEvidence;
const migrationName = "20261104000100_competencies.sql";
const deferredMigrations = [migrationName, "20261104000200_occupational_releases.sql", "20261104000300_skill_recommendation_privacy.sql"];
const source = fileURLToPath(new URL("../", import.meta.url));
mkdirSync(join(source, "tmp"), { recursive: true });
const root = mkdtempSync(join(source, "tmp/core-acceptance-"));
const project = "asgard-stage3-test-core-" + root.split(/[/\\]/).at(-1).slice(-6).toLowerCase();
const cli = join(source, "node_modules/supabase/dist/supabase.js");
const base = Number(process.env.ASGARD_CORE_PORT_BASE ?? 57320);
if (!Number.isInteger(base) || base < 1024 || base > 65000) throw new Error("Invalid test port base.");
let stage = "copy";
let started = false;
function run(command, args, input, cwd = root) {
  const result = spawnSync(command, args, {
    cwd, input, encoding: "utf8", maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env, ASGARD_BROWSER_PROJECT_ROOT: root },
  });
  if (result.status !== 0 || result.error) {
    writeFileSync(join(root, "failure.log"), (result.stdout ?? "") + (result.stderr ?? ""), { mode: 0o600 });
    throw new Error(stage + " failed; inspect the private isolated failure.log.");
  }
  return result.stdout ?? "";
}
function docker(args, input) { return run("docker", args, input); }
function sql(content) {
  return docker(["exec", "-i", "supabase_db_" + project, "psql", "-U", "postgres",
    "-d", "postgres", "-v", "ON_ERROR_STOP=1", "-b", "-Atq"], content);
}
try {
  for (const name of ["backend", "frontend", "scripts", "supabase"])
    cpSync(join(source, name), join(root, name), { recursive: true, filter: path =>
      !/(^|[/\\])(node_modules|dist|\.ruff_cache|__pycache__|\.temp)([/\\]|$)/.test(path) &&
      !/[/\\](\.env|signing-keys\.json)$/.test(path) &&
      !(competenciesOnly && deferredMigrations.some(name => path.endsWith(name))),
    });
  for (const name of ["compose.yaml", ".env.example"])
    cpSync(join(source, name), join(root, name));
  if (careerEvidence) {
    const compose = readFileSync(join(root, "compose.yaml"), "utf8")
      .replace('      - ./backend/app:/workspace/app', '      - ./:/checkout:ro\n      - ./backend/app:/workspace/app')
      .replace('      - "127.0.0.1:${BACKEND_PORT:-8000}:8000"',
        '      - "127.0.0.1:${BACKEND_PORT:-8000}:8000"\n      - "127.0.0.1:' + (base + 7) + ':8001"');
    writeFileSync(join(root, "compose.yaml"), compose);
  }
  let configText = readFileSync(join(root, "supabase/config.toml"), "utf8")
    .replace(/^project_id = .*/m, 'project_id = "' + project + '"')
    .replace(/55320/g, String(base)).replace(/55321/g, String(base + 1))
    .replace(/55322/g, String(base + 2)).replace(/55323/g, String(base + 3))
    .replace(/55324/g, String(base + 4)).replace(/55329/g, String(base + 9))
    .replace(/5173/g, String(base + 5));
  writeFileSync(join(root, "supabase/config.toml"), configText);
  writeFileSync(join(root, "supabase/signing-keys.json"), "[]\n", { mode: 0o600 });
  stage = "new signing key";
  console.log(stage);
  run(process.execPath, [cli, "gen", "signing-key", "--algorithm", "ES256", "--append"]);
  stage = "isolated Supabase startup and migrations";
  console.log(stage);
  started = true;
  run(process.execPath, [cli, "start"]);
  const config = JSON.parse(run(process.execPath, [cli, "status", "--output", "json"]));
  let environment = readFileSync(join(root, ".env.example"), "utf8")
    .replace(/^FRONTEND_PORT=.*/m, "FRONTEND_PORT=" + (base + 5))
    .replace(/^BACKEND_PORT=.*/m, "BACKEND_PORT=" + (base + 6))
    .replace(/^ASGARD_AUTH_ENABLED=.*/m, "ASGARD_AUTH_ENABLED=true");
  environment = updateEnvironment(environment, localConfig(configText), config.ANON_KEY);
  writeFileSync(join(root, ".env"), environment, { mode: 0o600 });
  stage = "new restricted-role credential";
  console.log(stage);
  run(process.execPath, [join(root, "scripts/provision-local-db.mjs"), "--approve-local-password"]);
  stage = competenciesOnly ? "current catalog publication" : "release 1 publication";
  sql(competenciesOnly ? publicationSQL(root) : readFileSync(join(root, "supabase/content/20261028_connected_prototype.sql"), "utf8"));
  stage = "isolated application build";
  console.log(stage);
  docker(["compose", "build"]);
  docker(["compose", "up", "-d", "--wait"]);
  if (competenciesOnly) {
    stage = "competency migration, publication, authorization and browser acceptance";
    console.log(stage);
    await competencyAcceptance({ root, source, project, config, sql, docker,
      backend: "http://127.0.0.1:" + (base + 6),
      applyMigration: () => {
        cpSync(join(source, "supabase/migrations", migrationName), join(root, "supabase/migrations", migrationName));
        run(process.execPath, [cli, "db", "push", "--local"]);
      },
    });
    if (careerEvidence) {
      stage = "career evidence integrated acceptance";
      await careerEvidenceAcceptance({ root, source, project, config, sql, docker, base });
    }
  } else {
    stage = "publication and saved-state acceptance";
    console.log(stage);
    await publicationAcceptance({ root, project, config,
      backend: "http://127.0.0.1:" + (base + 6),
      publish: () => sql(publicationSQL(root)),
    });
    stage = "browser registration and core journey";
    console.log(stage);
    // Browser dependencies come from the installed checkout; runtime/config use only the isolated root.
    const browser = run(process.execPath, [join(source, "scripts/check-browser-local.mjs")]);
    console.log(browser.trim());
  }
  const finalEnv = parseEnv(readFileSync(join(root, ".env"), "utf8"));
  if (!finalEnv.ASGARD_DATABASE_URL.includes("supabase_db_" + project))
    throw new Error("Isolated credentials lost their project boundary.");
  console.log("Isolated core acceptance passed. No normal-stack credentials were copied.");
} catch (error) {
  console.error("Core acceptance failed at " + stage + ": " + error.message);
  process.exitCode = 1;
} finally {
  // Only this newly allocated project is stopped; retained data is never reset.
  if (started) {
    spawnSync("docker", ["compose", "down"], { cwd: root, encoding: "utf8" });
    spawnSync(process.execPath, [cli, "stop"], { cwd: root, encoding: "utf8" });
  }
  console.log("Isolated work directory: " + root);
}
