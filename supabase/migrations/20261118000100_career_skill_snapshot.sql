BEGIN;

CREATE TABLE asgard_catalog.career_skill_snapshot (
    id uuid PRIMARY KEY,
    career_id uuid NOT NULL REFERENCES asgard_catalog.careers ON DELETE RESTRICT,
    competency_id uuid NOT NULL REFERENCES asgard_catalog.competencies ON DELETE RESTRICT,
    posting_count integer NOT NULL,
    total_postings integer NOT NULL,
    source text NOT NULL CHECK (btrim(source) <> ''),
    source_version text NOT NULL CHECK (btrim(source_version) <> ''),
    published boolean NOT NULL DEFAULT false,
    reviewed_by text,
    reviewed_at timestamptz,
    CHECK (total_postings > 0),
    CHECK (posting_count >= 1),
    CHECK (posting_count <= total_postings),
    CHECK (
        NOT published
        OR (
            reviewed_by IS NOT NULL
            AND btrim(reviewed_by) <> ''
            AND reviewed_at IS NOT NULL
        )
    ),
    UNIQUE (career_id, competency_id, source_version)
);

CREATE INDEX career_skill_snapshot_published_version_career
    ON asgard_catalog.career_skill_snapshot (source_version, career_id)
    WHERE published;

REVOKE ALL ON asgard_catalog.career_skill_snapshot
    FROM PUBLIC, anon, authenticated;
ALTER TABLE asgard_catalog.career_skill_snapshot ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON asgard_catalog.career_skill_snapshot TO asgard_app;
CREATE POLICY reference_read
    ON asgard_catalog.career_skill_snapshot
    FOR SELECT TO asgard_app
    USING (published);

COMMIT;
