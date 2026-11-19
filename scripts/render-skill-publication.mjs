import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const body = name => readFileSync(join(root, "supabase/content", name), "utf8")
  .replace(/^\uFEFF/, "").replace(/^BEGIN;\s*/, "").replace(/COMMIT;\s*$/, "");
const base = body("20261104_competencies_draft.sql");
const expansion = body("20261108_expansion_skills.sql")
  .replace(/reviewed_by='[^']*'/g, "reviewed_by=current_setting('asgard.skill_catalog_reviewer')")
  .replace(/reviewed_at='[^']*'/g, "reviewed_at=statement_timestamp()");
const ids = [...new Set([...`${base}\n${expansion}`.matchAll(
  /INSERT INTO asgard_catalog\.competencies\s*\([^)]*\) VALUES \('([0-9a-f-]+)'/g,
)].map(match => match[1]))];
if (ids.length !== 230) throw new Error(`Expected 230 stable skill identities; found ${ids.length}.`);
const sql = `-- Generated from the existing base and expansion skill definitions.
-- Review the definitions, then replace REPLACE_AFTER_REVIEW with your reviewer name.
-- Run the complete file in the hosted project's SQL Editor; all changes are atomic.
BEGIN;
SELECT set_config('asgard.skill_catalog_reviewer', 'REPLACE_AFTER_REVIEW', true);
DO $$ BEGIN
 IF btrim(current_setting('asgard.skill_catalog_reviewer')) IN ('', 'REPLACE_AFTER_REVIEW') THEN
  RAISE EXCEPTION 'Review this skill publication and enter the approving reviewer name first';
 END IF;
END $$;
SELECT pg_advisory_xact_lock(411, 1);
${base}
UPDATE asgard_catalog.competencies SET published=true,
 reviewed_by=current_setting('asgard.skill_catalog_reviewer'), reviewed_at=statement_timestamp()
 WHERE source_version='guide-v4-2026-11-04' AND NOT published;
${expansion}
DO $$ BEGIN
 IF (SELECT count(*) FROM asgard_catalog.competencies
     WHERE published AND id=ANY(ARRAY[${ids.map(id => `'${id}'`).join(",")} ]::uuid[])) <> 230 THEN
  RAISE EXCEPTION 'Skill publication did not produce the expected 230 published identities';
 END IF;
END $$;
COMMIT;
`;
if (process.argv[2]) {
  const output = join(root, process.argv[2]);
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, sql, "utf8");
} else process.stdout.write(sql);
