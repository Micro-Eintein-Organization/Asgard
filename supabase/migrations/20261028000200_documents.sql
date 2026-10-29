-- Owner-authorized local document lifecycle, 2026-10-28.
CREATE TABLE asgard_private.document_state (
  user_id uuid PRIMARY KEY REFERENCES asgard_private.learning_state ON DELETE CASCADE,
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0)
);
CREATE TABLE asgard_private.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES asgard_private.learning_state ON DELETE CASCADE,
  object_key text NOT NULL UNIQUE,
  status text NOT NULL CHECK (status IN ('uploading','uploaded','analyzing','active','failed','removed')),
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  analysis_id uuid,
  analysis_key uuid,
  failure_code text,
  evidence jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(evidence) = 'array'),
  deadline_at timestamptz,
  purge_due_at timestamptz,
  purged_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  UNIQUE(user_id, id)
);
CREATE UNIQUE INDEX one_active_document ON asgard_private.documents(user_id) WHERE status = 'active';
CREATE UNIQUE INDEX one_candidate_document ON asgard_private.documents(user_id) WHERE status IN ('uploading','uploaded','analyzing');
CREATE INDEX document_cleanup ON asgard_private.documents(purge_due_at) WHERE purged_at IS NULL;
GRANT DELETE ON asgard_private.recommendation_items TO asgard_app;
ALTER TABLE asgard_private.analysis_attempts ADD COLUMN document_id uuid;
ALTER TABLE asgard_private.analysis_attempts ADD CONSTRAINT attempt_document_owner
  FOREIGN KEY(user_id, document_id) REFERENCES asgard_private.documents(user_id,id);
CREATE UNIQUE INDEX document_attempt ON asgard_private.analysis_attempts(document_id, reservation_key, attempt)
  WHERE document_id IS NOT NULL;
DO $$ DECLARE name text; BEGIN
  FOREACH name IN ARRAY ARRAY['document_state','documents'] LOOP
    EXECUTE format('REVOKE ALL ON asgard_private.%I FROM PUBLIC, anon, authenticated', name);
    EXECUTE format('ALTER TABLE asgard_private.%I ENABLE ROW LEVEL SECURITY', name);
    EXECUTE format('ALTER TABLE asgard_private.%I FORCE ROW LEVEL SECURITY', name);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE ON asgard_private.%I TO asgard_app', name);
    EXECUTE format('CREATE POLICY owner_access ON asgard_private.%I FOR ALL TO asgard_app USING '
      '(user_id = nullif(current_setting(''asgard.user_id'', true), '''')::uuid) WITH CHECK '
      '(user_id = nullif(current_setting(''asgard.user_id'', true), '''')::uuid)', name);
  END LOOP;
END $$;
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES ('asgard-documents','asgard-documents',false,10000000,ARRAY['application/pdf']);
-- Browser JWTs cannot access files directly. Only the authenticated backend gateway
-- uses this bucket; storage objects are accessed with a dedicated server credential.
-- No policy grants anon/authenticated object access.
