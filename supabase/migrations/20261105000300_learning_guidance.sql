BEGIN;
CREATE TABLE asgard_private.guidance_state (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    roadmap_id uuid REFERENCES asgard_catalog.roadmaps(id),
    version integer NOT NULL CHECK (version > 0),
    PRIMARY KEY (user_id, roadmap_id)
);
CREATE TABLE asgard_private.guidance_practice (
    user_id uuid,
    roadmap_id uuid,
    topic_id uuid,
    PRIMARY KEY (user_id, roadmap_id, topic_id),
    FOREIGN KEY (user_id, roadmap_id) REFERENCES asgard_private.guidance_state ON DELETE CASCADE,
    FOREIGN KEY (roadmap_id, topic_id) REFERENCES asgard_catalog.topics(roadmap_id, id)
);
CREATE TABLE asgard_private.guidance_reflections (
    user_id uuid,
    roadmap_id uuid,
    milestone_id uuid,
    understood text NOT NULL CHECK (char_length(understood) <= 1000),
    practise text NOT NULL CHECK (char_length(practise) <= 1000),
    CHECK (btrim(understood) <> '' OR btrim(practise) <> ''),
    PRIMARY KEY (user_id, roadmap_id, milestone_id),
    FOREIGN KEY (user_id, roadmap_id) REFERENCES asgard_private.guidance_state ON DELETE CASCADE,
    FOREIGN KEY (roadmap_id, milestone_id) REFERENCES asgard_catalog.milestones(roadmap_id, id)
);
DO $$ DECLARE name text; BEGIN
    FOREACH name IN ARRAY ARRAY['guidance_state', 'guidance_practice', 'guidance_reflections'] LOOP
        EXECUTE format('REVOKE ALL ON asgard_private.%I FROM PUBLIC, anon, authenticated', name);
        EXECUTE format('ALTER TABLE asgard_private.%I ENABLE ROW LEVEL SECURITY', name);
        EXECUTE format('ALTER TABLE asgard_private.%I FORCE ROW LEVEL SECURITY', name);
        EXECUTE format('GRANT SELECT, INSERT, UPDATE ON asgard_private.%I TO asgard_app', name);
        EXECUTE format($policy$CREATE POLICY owner_access ON asgard_private.%I TO asgard_app
            USING (user_id = nullif(current_setting('asgard.user_id', true), '')::uuid)
            WITH CHECK (user_id = nullif(current_setting('asgard.user_id', true), '')::uuid)$policy$, name);
    END LOOP;
END $$;
GRANT DELETE ON asgard_private.guidance_practice, asgard_private.guidance_reflections TO asgard_app;
COMMIT;
