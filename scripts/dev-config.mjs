import { parseEnv } from "node:util";

export function localConfig(source) {
  const text = source.replaceAll("\r\n", "\n");
  const project = text.match(/^project_id\s*=\s*"([a-zA-Z0-9_-]+)"\s*$/m)?.[1];
  if (!project)
    throw new Error(
      "Missing or unsupported project_id in supabase/config.toml.",
    );
  function port(section, field = "port") {
    const lines = text.split("\n");
    const start = lines.findIndex((line) => line.trim() === `[${section}]`);
    const body = [];
    for (let i = start + 1; start >= 0 && i < lines.length; i++) {
      if (lines[i].trim().startsWith("[")) break;
      body.push(lines[i]);
    }
    const value = Number(
      body
        .join("\n")
        .match(new RegExp(`^${field}\\s*=\\s*(\\d+)\\s*$`, "m"))?.[1],
    );
    return checkedPort(value, `${section}.${field}`);
  }
  return {
    project,
    api: port("api"),
    db: port("db"),
    shadow: port("db", "shadow_port"),
    studio: port("studio"),
    mail: port("local_smtp"),
  };
}

export function checkedPort(value, label) {
  if (
    !/^\d+$/.test(String(value)) ||
    Number(value) < 1024 ||
    Number(value) > 65535
  )
    throw new Error(
      `${label} must be an unprivileged port between 1024 and 65535.`,
    );
  return Number(value);
}

export function updateEnvironment(source, config, key) {
  if (typeof key !== "string" || !/^[A-Za-z0-9_.-]+$/.test(key))
    throw new Error(
      "Supabase did not return a valid local anonymous key. Environment left unchanged.",
    );
  const parsed = parseEnv(source);
  const frontend = checkedPort(parsed.FRONTEND_PORT ?? 5173, "FRONTEND_PORT");
  const backend = checkedPort(parsed.BACKEND_PORT ?? 8000, "BACKEND_PORT");
  const ports = [
    frontend,
    backend,
    config.api,
    config.db,
    config.shadow,
    config.studio,
    config.mail,
  ];
  if (new Set(ports).size !== ports.length)
    throw new Error("Local service ports must be distinct.");
  const managed = {
    ASGARD_PROJECT_ID: config.project,
    ASGARD_SUPABASE_URL: `http://supabase_kong_${config.project}:8000`,
    ASGARD_SUPABASE_ANON_KEY: key,
    ASGARD_CORS_ORIGINS: JSON.stringify([
      `http://localhost:${frontend}`,
      `http://127.0.0.1:${frontend}`,
    ]),
  };
  let text = source.replaceAll("\r\n", "\n");
  for (const [name, value] of Object.entries(managed)) {
    const pattern = new RegExp(`^(?:export\\s+)?${name}\\s*=[^\\n]*`, "gm");
    const matches = [...text.matchAll(pattern)];
    if (matches.length > 1)
      throw new Error(`Duplicate ${name} in .env; resolve it manually.`);
    text = matches.length
      ? text.replace(pattern, () => `${name}=${value}`)
      : `${text.trimEnd()}\n${name}=${value}\n`;
  }
  return text;
}
