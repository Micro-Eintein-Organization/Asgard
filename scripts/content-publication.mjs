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
  const guides = body(root, "20261102_guide_v4.sql").replace("SELECT pg_advisory_xact_lock(72611029);", "");
  const guideChecks = body(root, "20261102_guide_catalog_checks.sql").replace("SELECT pg_advisory_xact_lock(72611029);", "");
  const resources = body(root, "20261102_topic_resources.sql").replace("SELECT pg_advisory_xact_lock(72611029);", "");
  const expansion = body(root, "20261104_guide_expansion_11_careers.sql").replace("SELECT pg_advisory_xact_lock(72611029);", "");
  const resourceFixes = body(root, "20261108_expansion_resources.sql");
  const discovery = body(root, "20261109_discovery_v2.sql")
    .replace("SELECT pg_advisory_xact_lock(72611029);", "");
  return [
    "BEGIN;",
    "SELECT pg_advisory_xact_lock(72611029);",
    `DO $versions$ BEGIN
IF EXISTS(SELECT 1 FROM asgard_catalog.releases WHERE version NOT IN (1,2,3,4,5,6)
 OR (version=1 AND id <> '0f7b64f6-6043-517d-b62d-0f1ffba721f6'::uuid)
 OR (version=2 AND id <> '36ae9af8-62dd-54c4-b8c8-9dab1f17d9cb'::uuid)
 OR (version=3 AND id <> '4b9b7a97-b1e3-5984-8a1e-35a1ac6948a3'::uuid)
 OR (version=4 AND id <> '7918d1fe-d121-5c74-8516-6cc10b9a988c'::uuid)
 OR (version=5 AND id <> '72436ab3-9846-5393-b0ae-4c576a14337a'::uuid)
 OR (version=6 AND id <> '3463d194-1b73-55b0-972f-c9584a118a6f'::uuid)) THEN
 RAISE EXCEPTION 'Unexpected release identity or version';
END IF; END $versions$;`,
    "DO $sequence$ BEGIN IF EXISTS(SELECT 1 FROM asgard_catalog.releases WHERE version=2) AND NOT EXISTS(SELECT 1 FROM asgard_catalog.releases WHERE version=1) THEN RAISE EXCEPTION 'Missing predecessor release'; END IF; END $sequence$;",
    "DO $predecessors$ BEGIN IF EXISTS(SELECT 1 FROM asgard_catalog.releases WHERE version=3) AND (SELECT count(*) FROM asgard_catalog.releases WHERE version IN (1,2)) <> 2 THEN RAISE EXCEPTION 'Missing guide predecessor'; END IF; END $predecessors$;",
    "DO $prior$ BEGIN IF NOT EXISTS(SELECT 1 FROM asgard_catalog.releases WHERE version=3) THEN",
    "DO $bootstrap$ BEGIN IF NOT EXISTS(SELECT 1 FROM asgard_catalog.releases WHERE version=2) THEN",
    initial,
    "END IF; END $bootstrap$;",
    latest,
    "END IF; END $prior$;",
    "DO $resource_sequence$ BEGIN IF EXISTS(SELECT 1 FROM asgard_catalog.releases WHERE version=4) AND NOT EXISTS(SELECT 1 FROM asgard_catalog.releases WHERE version=3) THEN RAISE EXCEPTION 'Missing release 3'; END IF; END $resource_sequence$;",
    "DO $guide_validation$ BEGIN IF EXISTS(SELECT 1 FROM asgard_catalog.releases WHERE version=4) THEN",
    guideChecks,
    "ELSE",
    guides,
    "END IF; END $guide_validation$;",
    resources,
    "DO $expansion_sequence$ BEGIN IF EXISTS(SELECT 1 FROM asgard_catalog.releases WHERE version=5) AND NOT EXISTS(SELECT 1 FROM asgard_catalog.releases WHERE version=4) THEN RAISE EXCEPTION 'Missing release 4'; END IF; END $expansion_sequence$;",
    expansion,
    resourceFixes,
    discovery,
    body(root, "20261120_discovery_v3.sql"),
    body(root, "20261120_discovery_v4.sql"),
    "COMMIT;",
  ].join("\n");
}
