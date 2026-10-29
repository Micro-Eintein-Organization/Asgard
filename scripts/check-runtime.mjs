import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";

const name = "asgard-runtime-check-" + randomUUID().slice(0, 8);
const port = Number(process.env.ASGARD_RUNTIME_TEST_PORT ?? 58326);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error("Invalid test port.");
function docker(args) {
  const result = spawnSync("docker", args, { encoding: "utf8" });
  if (result.status !== 0 || result.error) throw new Error("Runtime check failed: " + args[0]);
  return result.stdout.trim();
}
let created = false;
try {
  docker(["run", "-d", "--name", name, "-p", "127.0.0.1:" + port + ":10000",
    "-e", "PORT=10000", "asgard-production-preparation"]);
  created = true;
  let healthy = false;
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const response = await fetch("http://127.0.0.1:" + port + "/health",
        { signal: AbortSignal.timeout(1000) });
      if (response.ok) { healthy = true; break; }
    } catch { /* Startup is bounded below. */ }
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  if (!healthy) throw new Error("Production runtime did not become live.");
  if (docker(["exec", name, "id", "-u"]) !== "10001") throw new Error("Runtime is not non-root.");
  docker(["exec", name, "python", "-c",
    "from pathlib import Path; assert not Path('/workspace/tests').exists(); assert not Path('/workspace/scripts').exists()"]);
  docker(["stop", "--time", "60", name]);
  if (docker(["inspect", "--format", "{{.State.ExitCode}}", name]) !== "0")
    throw new Error("Runtime did not shut down gracefully.");
  console.log("Production image passed: platform PORT, liveness, non-root, no development helpers, graceful shutdown.");
} finally {
  if (created) {
    spawnSync("docker", ["stop", "--time", "60", name], { encoding: "utf8" });
    spawnSync("docker", ["rm", name], { encoding: "utf8" });
  }
}
