-- Owner-reviewed plan: PM-W06, learner journey and saved alternatives.
-- Apply only after the concrete normal-environment migration review.
BEGIN;
CREATE TABLE asgard_private.career_shortlist_state (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 version integer NOT NULL CHECK(version>0)
);
CREATE TABLE asgard_private.career_shortlist (
 user_id uuid NOT NULL REFERENCES asgard_private.career_shortlist_state ON DELETE CASCADE,
 career_id uuid NOT NULL REFERENCES asgard_catalog.careers ON DELETE RESTRICT,
 title text NOT NULL CHECK(btrim(title)<>''),
 note text NOT NULL DEFAULT '' CHECK(char_length(note)<=500),
 updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
 PRIMARY KEY(user_id,career_id)
);
DO $$ DECLARE name text; BEGIN
 FOREACH name IN ARRAY ARRAY['career_shortlist_state','career_shortlist'] LOOP
  EXECUTE format('REVOKE ALL ON asgard_private.%I FROM PUBLIC,anon,authenticated',name);
  EXECUTE format('ALTER TABLE asgard_private.%I ENABLE ROW LEVEL SECURITY',name);
  EXECUTE format('ALTER TABLE asgard_private.%I FORCE ROW LEVEL SECURITY',name);
  EXECUTE format('GRANT SELECT,INSERT,UPDATE ON asgard_private.%I TO asgard_app',name);
  EXECUTE format($policy$CREATE POLICY owner_access ON asgard_private.%I FOR ALL TO asgard_app
    USING(user_id=nullif(current_setting('asgard.user_id',true),'')::uuid)
    WITH CHECK(user_id=nullif(current_setting('asgard.user_id',true),'')::uuid)$policy$,name);
 END LOOP;
END $$;
GRANT DELETE ON asgard_private.career_shortlist TO asgard_app;
COMMIT;
