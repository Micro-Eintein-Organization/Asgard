ALTER TABLE asgard_private.documents ADD CONSTRAINT document_object_identity
  CHECK (object_key = user_id::text || '/' || id::text || '.pdf');

CREATE FUNCTION asgard_private.guard_result_erasure() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF current_user = 'asgard_app' AND NOT EXISTS (
    SELECT 1 FROM asgard_private.recommendation_runs r
      JOIN asgard_private.documents d ON d.user_id = r.user_id
        AND d.id = (r.context_snapshot->'context'->'document'->>'document_id')::uuid
      WHERE r.id = OLD.run_id AND r.user_id = OLD.user_id AND d.status = 'removed'
  ) THEN
    RAISE EXCEPTION 'Result erasure requires removed document provenance' USING ERRCODE = '23514';
  END IF;
  RETURN OLD;
END $$;
CREATE TRIGGER recommendation_item_erasure_guard
  BEFORE DELETE ON asgard_private.recommendation_items
  FOR EACH ROW EXECUTE FUNCTION asgard_private.guard_result_erasure();
