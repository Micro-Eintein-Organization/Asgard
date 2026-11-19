-- Derived matches do not create or change reported experience.
CREATE TABLE asgard_private.document_skill_interpretations (
  user_id uuid NOT NULL,
  document_id uuid NOT NULL,
  run_id uuid NOT NULL,
  analysis_id uuid NOT NULL,
  catalog_fingerprint text NOT NULL,
  model text NOT NULL,
  prompt_version text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending','completed','failed')),
  mappings jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(mappings) = 'array'),
  failure_code text,
  deadline_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  PRIMARY KEY (user_id, document_id),
  FOREIGN KEY (user_id, document_id)
    REFERENCES asgard_private.documents(user_id, id) ON DELETE CASCADE
);
REVOKE ALL ON asgard_private.document_skill_interpretations FROM PUBLIC, anon, authenticated;
ALTER TABLE asgard_private.document_skill_interpretations ENABLE ROW LEVEL SECURITY;
ALTER TABLE asgard_private.document_skill_interpretations FORCE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON asgard_private.document_skill_interpretations TO asgard_app;
CREATE POLICY owner_access ON asgard_private.document_skill_interpretations
  FOR ALL TO asgard_app
  USING (user_id = nullif(current_setting('asgard.user_id', true), '')::uuid)
  WITH CHECK (user_id = nullif(current_setting('asgard.user_id', true), '')::uuid);
GRANT SELECT, DELETE ON asgard_private.document_skill_interpretations TO asgard_maintenance;
CREATE POLICY maintenance_read ON asgard_private.document_skill_interpretations
  FOR SELECT TO asgard_maintenance USING (true);
CREATE POLICY maintenance_delete ON asgard_private.document_skill_interpretations
  FOR DELETE TO asgard_maintenance USING (true);

CREATE FUNCTION asgard_private.clear_document_skill_interpretations()
RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog AS $$
BEGIN
  IF NEW.status <> 'active' OR NEW.analysis_id IS DISTINCT FROM OLD.analysis_id
     OR NEW.evidence IS DISTINCT FROM OLD.evidence THEN
    DELETE FROM asgard_private.document_skill_interpretations
      WHERE user_id = NEW.user_id AND document_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION asgard_private.clear_document_skill_interpretations()
  FROM PUBLIC, anon, authenticated;
CREATE TRIGGER clear_document_skill_interpretations
AFTER UPDATE OF status, analysis_id, evidence ON asgard_private.documents
FOR EACH ROW EXECUTE FUNCTION asgard_private.clear_document_skill_interpretations();
