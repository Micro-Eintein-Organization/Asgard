BEGIN;

CREATE TABLE asgard_catalog.career_skill_posting_versions (
    source text NOT NULL CHECK (btrim(source) <> ''),
    source_version text NOT NULL CHECK (btrim(source_version) <> ''),
    input_row_count integer NOT NULL CHECK (input_row_count >= 0),
    verified_row_count integer NOT NULL CHECK (
        verified_row_count >= 0 AND verified_row_count <= input_row_count
    ),
    posting_count integer NOT NULL CHECK (
        posting_count >= 0 AND posting_count <= verified_row_count
    ),
    status text NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'retired')),
    reviewed_by text,
    reviewed_at timestamptz,
    published_at timestamptz,
    retired_at timestamptz,
    PRIMARY KEY (source, source_version),
    CHECK (
        (status = 'draft' AND reviewed_by IS NULL AND reviewed_at IS NULL
            AND published_at IS NULL AND retired_at IS NULL)
        OR
        (status = 'published' AND reviewed_by IS NOT NULL AND btrim(reviewed_by) <> ''
            AND reviewed_at IS NOT NULL AND published_at IS NOT NULL AND retired_at IS NULL
            AND input_row_count >= 15 AND verified_row_count >= 5 AND posting_count > 0)
        OR
        (status = 'retired' AND reviewed_by IS NOT NULL AND btrim(reviewed_by) <> ''
            AND reviewed_at IS NOT NULL AND published_at IS NOT NULL AND retired_at IS NOT NULL)
    )
);

CREATE UNIQUE INDEX one_published_career_skill_posting_version_per_source
    ON asgard_catalog.career_skill_posting_versions (source)
    WHERE status = 'published';

CREATE TABLE asgard_catalog.career_skill_postings (
    source text NOT NULL,
    source_version text NOT NULL,
    posting_id text NOT NULL CHECK (btrim(posting_id) <> ''),
    career_id uuid NOT NULL REFERENCES asgard_catalog.careers(id) ON DELETE RESTRICT,
    job_title text NOT NULL CHECK (btrim(job_title) <> ''),
    company text NOT NULL CHECK (btrim(company) <> ''),
    source_url text NOT NULL CHECK (source_url LIKE 'https://%'),
    retrieved_on date NOT NULL,
    skill_labels text[] NOT NULL CHECK (
        cardinality(skill_labels) >= 2
        AND array_position(skill_labels, '') IS NULL
    ),
    collected_by text NOT NULL CHECK (btrim(collected_by) <> ''),
    reviewed_by text NOT NULL CHECK (btrim(reviewed_by) <> ''),
    PRIMARY KEY (source, source_version, posting_id),
    FOREIGN KEY (source, source_version)
        REFERENCES asgard_catalog.career_skill_posting_versions(source, source_version)
        ON DELETE RESTRICT
);

CREATE INDEX career_skill_postings_career_version
    ON asgard_catalog.career_skill_postings
        (career_id, source, source_version, retrieved_on DESC, posting_id);

CREATE FUNCTION asgard_catalog.guard_career_skill_posting_version()
RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.status <> 'draft' THEN
            RAISE EXCEPTION 'Career skill posting versions must be created as drafts';
        END IF;
        RETURN NEW;
    END IF;

    IF OLD.status = 'draft' AND NEW.status IN ('draft', 'published') THEN
        RETURN NEW;
    END IF;

    IF OLD.status = 'published' AND NEW.status = 'retired'
       AND NEW.source = OLD.source
       AND NEW.source_version = OLD.source_version
       AND NEW.input_row_count = OLD.input_row_count
       AND NEW.verified_row_count = OLD.verified_row_count
       AND NEW.posting_count = OLD.posting_count
       AND NEW.reviewed_by = OLD.reviewed_by
       AND NEW.reviewed_at = OLD.reviewed_at
       AND NEW.published_at = OLD.published_at
       AND NEW.retired_at IS NOT NULL THEN
        RETURN NEW;
    END IF;

    RAISE EXCEPTION 'Career skill posting versions cannot be rewritten or republished';
END;
$$;

CREATE TRIGGER guard_career_skill_posting_version
    BEFORE INSERT OR UPDATE ON asgard_catalog.career_skill_posting_versions
    FOR EACH ROW EXECUTE FUNCTION asgard_catalog.guard_career_skill_posting_version();

CREATE FUNCTION asgard_catalog.guard_career_skill_posting_record()
RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE
    target_status text;
BEGIN
    IF TG_OP <> 'INSERT' THEN
        SELECT status INTO target_status
        FROM asgard_catalog.career_skill_posting_versions
        WHERE source = OLD.source AND source_version = OLD.source_version;
        IF target_status IS DISTINCT FROM 'draft' THEN
            RAISE EXCEPTION 'Published or retired career skill postings are immutable';
        END IF;
    END IF;

    IF TG_OP <> 'DELETE' THEN
        SELECT status INTO target_status
        FROM asgard_catalog.career_skill_posting_versions
        WHERE source = NEW.source AND source_version = NEW.source_version;
        IF target_status IS DISTINCT FROM 'draft' THEN
            RAISE EXCEPTION 'Career skill postings can only be written to draft versions';
        END IF;
        RETURN NEW;
    END IF;

    RETURN OLD;
END;
$$;

CREATE TRIGGER guard_career_skill_posting_record
    BEFORE INSERT OR UPDATE OR DELETE ON asgard_catalog.career_skill_postings
    FOR EACH ROW EXECUTE FUNCTION asgard_catalog.guard_career_skill_posting_record();

REVOKE ALL ON asgard_catalog.career_skill_posting_versions,
    asgard_catalog.career_skill_postings
    FROM PUBLIC, anon, authenticated, asgard_app;
GRANT SELECT ON asgard_catalog.career_skill_posting_versions,
    asgard_catalog.career_skill_postings TO asgard_app;

ALTER TABLE asgard_catalog.career_skill_posting_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE asgard_catalog.career_skill_postings ENABLE ROW LEVEL SECURITY;

CREATE POLICY career_skill_posting_version_read
    ON asgard_catalog.career_skill_posting_versions
    FOR SELECT TO asgard_app USING (status = 'published');

CREATE POLICY career_skill_posting_read
    ON asgard_catalog.career_skill_postings
    FOR SELECT TO asgard_app
    USING (
        EXISTS (
            SELECT 1
            FROM asgard_catalog.career_skill_posting_versions AS version
            WHERE version.source = career_skill_postings.source
              AND version.source_version = career_skill_postings.source_version
              AND version.status = 'published'
        )
    );

REVOKE ALL ON FUNCTION asgard_catalog.guard_career_skill_posting_version()
    FROM PUBLIC, anon, authenticated, asgard_app;
REVOKE ALL ON FUNCTION asgard_catalog.guard_career_skill_posting_record()
    FROM PUBLIC, anon, authenticated, asgard_app;

COMMIT;
