BEGIN;
CREATE TABLE asgard_catalog.esco_releases (
    id uuid PRIMARY KEY,
    version text NOT NULL CHECK (version <> ''),
    adaptations text NOT NULL CHECK (adaptations <> ''),
    sha256 text NOT NULL UNIQUE CHECK (sha256 ~ '^[0-9a-f]{64}$'),
    sealed boolean NOT NULL DEFAULT false
);
CREATE TABLE asgard_catalog.esco_concepts (
    release_id uuid REFERENCES asgard_catalog.esco_releases(id),
    uri text CHECK (uri ~ '^https?://data[.]europa[.]eu/esco/(occupation|skill)/[0-9a-f-]{36}$'),
    kind text NOT NULL CHECK (kind IN ('occupation', 'skill')),
    label text NOT NULL CHECK (label <> ''),
    alternatives text[] NOT NULL DEFAULT '{}',
    description text NOT NULL DEFAULT '',
    PRIMARY KEY (release_id, uri),
    CHECK (split_part(uri, '/', 5) = kind)
);
CREATE INDEX esco_browse_order ON asgard_catalog.esco_concepts (release_id, kind, lower(label), uri);
CREATE TABLE asgard_catalog.esco_links (
    release_id uuid,
    occupation_uri text CHECK (split_part(occupation_uri, '/', 5) = 'occupation'),
    skill_uri text CHECK (split_part(skill_uri, '/', 5) = 'skill'),
    relationship text CHECK (relationship IN ('essential', 'optional')),
    PRIMARY KEY (release_id, occupation_uri, skill_uri, relationship),
    FOREIGN KEY (release_id, occupation_uri) REFERENCES asgard_catalog.esco_concepts(release_id, uri),
    FOREIGN KEY (release_id, skill_uri) REFERENCES asgard_catalog.esco_concepts(release_id, uri)
);
CREATE INDEX esco_skill_links ON asgard_catalog.esco_links (release_id, skill_uri, occupation_uri);
CREATE TABLE asgard_catalog.esco_career_links (
    release_id uuid,
    occupation_uri text CHECK (split_part(occupation_uri, '/', 5) = 'occupation'),
    career_id uuid REFERENCES asgard_catalog.careers(id),
    PRIMARY KEY (release_id, occupation_uri, career_id),
    FOREIGN KEY (release_id, occupation_uri) REFERENCES asgard_catalog.esco_concepts(release_id, uri)
);
CREATE INDEX esco_career_lookup ON asgard_catalog.esco_career_links (release_id, career_id);
CREATE TABLE asgard_catalog.esco_active_release (
    singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
    release_id uuid NOT NULL REFERENCES asgard_catalog.esco_releases(id)
);

REVOKE ALL ON asgard_catalog.esco_releases, asgard_catalog.esco_concepts,
    asgard_catalog.esco_links, asgard_catalog.esco_career_links, asgard_catalog.esco_active_release
FROM PUBLIC, anon, authenticated, asgard_app;
GRANT SELECT ON asgard_catalog.esco_releases, asgard_catalog.esco_concepts,
    asgard_catalog.esco_links, asgard_catalog.esco_career_links, asgard_catalog.esco_active_release TO asgard_app;

ALTER TABLE asgard_catalog.esco_active_release ENABLE ROW LEVEL SECURITY;
CREATE POLICY esco_pointer_read ON asgard_catalog.esco_active_release FOR SELECT TO asgard_app USING (true);
ALTER TABLE asgard_catalog.esco_releases ENABLE ROW LEVEL SECURITY;
CREATE POLICY esco_release_read ON asgard_catalog.esco_releases FOR SELECT TO asgard_app
    USING (EXISTS (SELECT 1 FROM asgard_catalog.esco_active_release a WHERE a.release_id = id));
ALTER TABLE asgard_catalog.esco_concepts ENABLE ROW LEVEL SECURITY;
CREATE POLICY esco_concept_read ON asgard_catalog.esco_concepts FOR SELECT TO asgard_app
    USING (EXISTS (SELECT 1 FROM asgard_catalog.esco_active_release a WHERE a.release_id = esco_concepts.release_id));
ALTER TABLE asgard_catalog.esco_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY esco_link_read ON asgard_catalog.esco_links FOR SELECT TO asgard_app
    USING (EXISTS (SELECT 1 FROM asgard_catalog.esco_active_release a WHERE a.release_id = esco_links.release_id));
ALTER TABLE asgard_catalog.esco_career_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY esco_career_link_read ON asgard_catalog.esco_career_links FOR SELECT TO asgard_app
    USING (EXISTS (SELECT 1 FROM asgard_catalog.esco_active_release a WHERE a.release_id = esco_career_links.release_id));

CREATE FUNCTION asgard_catalog.guard_esco_release() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
    IF OLD.sealed THEN
        RAISE EXCEPTION 'Sealed ESCO release is immutable';
    END IF;
    IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
    RETURN NEW;
END $$;
CREATE TRIGGER esco_release_immutable BEFORE UPDATE OR DELETE ON asgard_catalog.esco_releases
    FOR EACH ROW EXECUTE FUNCTION asgard_catalog.guard_esco_release();

CREATE FUNCTION asgard_catalog.guard_esco_entry() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE target uuid;
BEGIN
    IF TG_OP <> 'INSERT' THEN
        SELECT id INTO target FROM asgard_catalog.esco_releases
            WHERE id = OLD.release_id AND NOT sealed FOR UPDATE;
        IF target IS NULL THEN RAISE EXCEPTION 'Sealed ESCO release is immutable'; END IF;
    END IF;
    IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
    SELECT id INTO target FROM asgard_catalog.esco_releases
        WHERE id = NEW.release_id AND NOT sealed FOR UPDATE;
    IF target IS NULL THEN RAISE EXCEPTION 'Sealed ESCO release is immutable'; END IF;
    RETURN NEW;
END $$;
CREATE TRIGGER esco_concept_immutable BEFORE INSERT OR UPDATE OR DELETE ON asgard_catalog.esco_concepts
    FOR EACH ROW EXECUTE FUNCTION asgard_catalog.guard_esco_entry();
CREATE TRIGGER esco_link_immutable BEFORE INSERT OR UPDATE OR DELETE ON asgard_catalog.esco_links
    FOR EACH ROW EXECUTE FUNCTION asgard_catalog.guard_esco_entry();
CREATE TRIGGER esco_career_link_immutable BEFORE INSERT OR UPDATE OR DELETE ON asgard_catalog.esco_career_links
    FOR EACH ROW EXECUTE FUNCTION asgard_catalog.guard_esco_entry();

CREATE FUNCTION asgard_catalog.lock_esco_release() RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE target uuid;
BEGIN
    PERFORM pg_catalog.pg_advisory_xact_lock_shared(411, 3);
    SELECT release_id INTO target FROM asgard_catalog.esco_active_release;
    RETURN target;
END $$;
REVOKE ALL ON FUNCTION asgard_catalog.lock_esco_release() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION asgard_catalog.lock_esco_release() TO asgard_app;

CREATE FUNCTION asgard_catalog.activate_esco_release(target uuid) RETURNS void
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
    PERFORM pg_catalog.pg_advisory_xact_lock(411, 3);
    PERFORM id FROM asgard_catalog.esco_releases WHERE id = target FOR UPDATE;
    IF NOT EXISTS (SELECT 1 FROM asgard_catalog.esco_concepts
        WHERE release_id = target AND kind = 'occupation') THEN
        RAISE EXCEPTION 'ESCO release has no occupations';
    END IF;
    UPDATE asgard_catalog.esco_releases SET sealed = true WHERE id = target AND NOT sealed;
    INSERT INTO asgard_catalog.esco_active_release(singleton, release_id) VALUES (true, target)
        ON CONFLICT (singleton) DO UPDATE SET release_id = excluded.release_id;
END $$;
REVOKE ALL ON FUNCTION asgard_catalog.activate_esco_release(uuid)
    FROM PUBLIC, anon, authenticated, asgard_app;
COMMIT;
