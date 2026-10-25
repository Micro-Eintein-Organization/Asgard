import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { localConfig, updateEnvironment } from "./dev-config.mjs";

const config = localConfig(
  readFileSync(new URL("../supabase/config.toml", import.meta.url), "utf8"),
);
const template = readFileSync(
  new URL("../.env.example", import.meta.url),
  "utf8",
);
test("regeneration preserves custom values and derives project networking/CORS without duplicating credentials", () => {
  const source =
    template.replace("FRONTEND_PORT=5173", "FRONTEND_PORT=5183") +
    "CUSTOM_VALUE=keep-me\r\n";
  const updated = updateEnvironment(source, config, "local.test-key");
  const env = parseEnv(updated);
  assert.equal(env.CUSTOM_VALUE, "keep-me");
  assert.equal(
    env.ASGARD_SUPABASE_URL,
    `http://supabase_kong_${config.project}:8000`,
  );
  assert.deepEqual(JSON.parse(env.ASGARD_CORS_ORIGINS), [
    "http://localhost:5183",
    "http://127.0.0.1:5183",
  ]);
  assert.equal(updateEnvironment(updated, config, "local.test-key"), updated);
  assert.equal((updated.match(/^ASGARD_SUPABASE_ANON_KEY=/gm) ?? []).length, 1);
});
test("reject invalid credentials, duplicate managed keys and conflicting ports before writing", () => {
  assert.throws(
    () => updateEnvironment(template, config, "key\nINJECTED=value"),
    /valid local/,
  );
  assert.throws(
    () =>
      updateEnvironment(
        template + "ASGARD_SUPABASE_ANON_KEY=other\n",
        config,
        "key",
      ),
    /Duplicate/,
  );
  assert.throws(
    () =>
      updateEnvironment(
        template.replace("BACKEND_PORT=8000", "BACKEND_PORT=5173"),
        config,
        "key",
      ),
    /distinct/,
  );
  assert.throws(
    () =>
      updateEnvironment(
        template.replace("FRONTEND_PORT=5173", "FRONTEND_PORT=80"),
        config,
        "key",
      ),
    /unprivileged/,
  );
});
test("normalize exported/spaced managed entries without leaving duplicate secrets", () => {
  const source = template.replace(
    "ASGARD_SUPABASE_ANON_KEY=",
    "export ASGARD_SUPABASE_ANON_KEY = old-key",
  );
  const updated = updateEnvironment(source, config, "fresh-key");
  assert.equal(parseEnv(updated).ASGARD_SUPABASE_ANON_KEY, "fresh-key");
  assert.ok(!updated.includes("old-key"));
  assert.throws(
    () =>
      updateEnvironment(
        source + "\nASGARD_SUPABASE_ANON_KEY=other\n",
        config,
        "fresh-key",
      ),
    /Duplicate/,
  );
});

test("parse committed TOML on either host and reject incomplete configuration", () => {
  const text = readFileSync(
    new URL("../supabase/config.toml", import.meta.url),
    "utf8",
  );
  assert.deepEqual(
    localConfig(text.replaceAll("\n", "\r\n")),
    localConfig(text),
  );
  assert.throws(
    () => localConfig(text.replace("[studio]", "[other]")),
    /studio.port/,
  );
});
