-- Additive skill records. Reference publication is a separate reviewed operation.
CREATE TABLE asgard_catalog.competencies (
 id uuid PRIMARY KEY, canonical_key text NOT NULL UNIQUE, label text NOT NULL CHECK (btrim(label) <> ''),
 aliases text[] NOT NULL DEFAULT '{}', source text NOT NULL, source_version text NOT NULL,
 published boolean NOT NULL DEFAULT false, reviewed_by text, reviewed_at timestamptz,
 CHECK (NOT published OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL))
);
CREATE TABLE asgard_catalog.competency_links (
 competency_id uuid NOT NULL REFERENCES asgard_catalog.competencies ON DELETE RESTRICT,
 career_id uuid NOT NULL REFERENCES asgard_catalog.careers ON DELETE RESTRICT,
 roadmap_id uuid NOT NULL,
 topic_id uuid NOT NULL,
 FOREIGN KEY(career_id,roadmap_id) REFERENCES asgard_catalog.roadmaps(career_id,id) ON DELETE RESTRICT,
 FOREIGN KEY(roadmap_id,topic_id) REFERENCES asgard_catalog.topics(roadmap_id,id) ON DELETE RESTRICT,
 PRIMARY KEY (competency_id, career_id, topic_id)
);
CREATE TABLE asgard_private.competency_state (
 user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
 version integer NOT NULL CHECK (version >= 1)
);
CREATE TABLE asgard_private.user_competencies (
 user_id uuid NOT NULL REFERENCES asgard_private.competency_state ON DELETE CASCADE,
 competency_id uuid NOT NULL REFERENCES asgard_catalog.competencies ON DELETE RESTRICT,
 label text NOT NULL CHECK (btrim(label) <> ''),
 level integer CHECK (level BETWEEN 0 AND 4), updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
 PRIMARY KEY(user_id, competency_id)
);
DO $$
DECLARE name text;
BEGIN
 FOREACH name IN ARRAY ARRAY['competency_state','user_competencies'] LOOP
  EXECUTE format('REVOKE ALL ON asgard_private.%I FROM PUBLIC, anon, authenticated', name);
  EXECUTE format('ALTER TABLE asgard_private.%I ENABLE ROW LEVEL SECURITY', name);
  EXECUTE format('ALTER TABLE asgard_private.%I FORCE ROW LEVEL SECURITY', name);
  EXECUTE format('GRANT SELECT, INSERT, UPDATE ON asgard_private.%I TO asgard_app', name);
  EXECUTE format($policy$
    CREATE POLICY owner_access ON asgard_private.%I FOR ALL TO asgard_app
    USING (user_id = nullif(current_setting('asgard.user_id', true), '')::uuid)
    WITH CHECK (user_id = nullif(current_setting('asgard.user_id', true), '')::uuid)
  $policy$, name);
 END LOOP;
 GRANT DELETE ON asgard_private.user_competencies TO asgard_app;
 FOREACH name IN ARRAY ARRAY['competencies','competency_links'] LOOP
  EXECUTE format('REVOKE ALL ON asgard_catalog.%I FROM PUBLIC, anon, authenticated', name);
  EXECUTE format('ALTER TABLE asgard_catalog.%I ENABLE ROW LEVEL SECURITY', name);
  EXECUTE format('GRANT SELECT ON asgard_catalog.%I TO asgard_app', name);
 END LOOP;
END $$;
CREATE POLICY reference_read ON asgard_catalog.competencies FOR SELECT TO asgard_app USING (published);
CREATE POLICY reference_read ON asgard_catalog.competency_links FOR SELECT TO asgard_app
 USING (EXISTS (SELECT 1 FROM asgard_catalog.competencies c WHERE c.id=competency_id)
 AND EXISTS (SELECT 1 FROM asgard_catalog.topics t JOIN asgard_catalog.roadmaps r ON r.id=t.roadmap_id
 WHERE t.id=topic_id AND r.career_id=competency_links.career_id AND r.status='published' AND t.retired_at IS NULL));
