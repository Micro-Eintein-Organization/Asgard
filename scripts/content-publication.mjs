import { readFileSync } from "node:fs";
import { join } from "node:path";

function body(root, filename) {
  return readFileSync(join(root, "supabase/content", filename), "utf8")
    .replace(/^\uFEFF/, "").replace(/^BEGIN;\s*/, "").replace(/COMMIT;\s*$/, "");
}

export function publicationSQL(root) {
  const initial = body(root, "20261028_connected_prototype.sql");
  const latest = body(root, "20261029_data_analyst.sql")
    .replace("SELECT pg_advisory_xact_lock(72611029);", "");
  return [
    "BEGIN;",
    "SELECT pg_advisory_xact_lock(72611029);",
    `DO $versions$ BEGIN
IF EXISTS(SELECT 1 FROM asgard_catalog.releases WHERE version NOT IN (1,2)
 OR (version=1 AND id <> '0f7b64f6-6043-517d-b62d-0f1ffba721f6'::uuid)
 OR (version=2 AND id <> '36ae9af8-62dd-54c4-b8c8-9dab1f17d9cb'::uuid)) THEN
 RAISE EXCEPTION 'Unexpected release identity or version';
END IF; END $versions$;`,
    "DO $sequence$ BEGIN IF EXISTS(SELECT 1 FROM asgard_catalog.releases WHERE version=2) AND NOT EXISTS(SELECT 1 FROM asgard_catalog.releases WHERE version=1) THEN RAISE EXCEPTION 'Missing predecessor release'; END IF; END $sequence$;",
    "DO $bootstrap$ BEGIN IF NOT EXISTS(SELECT 1 FROM asgard_catalog.releases WHERE version=2) THEN",
    initial,
    "END IF; END $bootstrap$;",
    latest,
    "COMMIT;",
  ].join("\n");
}
