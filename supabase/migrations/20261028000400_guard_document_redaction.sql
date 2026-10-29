-- Permit only exact privacy erasure after owned document removal; all other provenance remains immutable.
CREATE OR REPLACE FUNCTION asgard_private.guard_recommendation_change() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE run asgard_private.recommendation_runs;
BEGIN
  IF TG_TABLE_NAME = 'recommendation_runs' THEN
  IF TG_OP = 'UPDATE' THEN
  IF true
    AND OLD.context_snapshot->'context'->>'document' IS NOT NULL
    AND NEW.context_snapshot = jsonb_set(OLD.context_snapshot, '{context}', '{}'::jsonb)
    AND NEW.status = 'failed' AND NEW.failure_code = 'context_outdated'
    AND (to_jsonb(NEW) - ARRAY['context_snapshot','status','failure_code','finished_at'])
      = (to_jsonb(OLD) - ARRAY['context_snapshot','status','failure_code','finished_at'])
    AND EXISTS (SELECT 1 FROM asgard_private.documents d WHERE d.user_id = OLD.user_id
      AND d.id = (OLD.context_snapshot->'context'->'document'->>'document_id')::uuid
      AND d.status = 'removed') THEN
    RETURN NEW;
  END IF;
  END IF;
  END IF;
  IF TG_TABLE_NAME = 'recommendation_runs' THEN
    IF TG_OP = 'UPDATE' THEN
      IF OLD.status <> 'pending' OR
        (NEW.user_id, NEW.id, NEW.context_revision, NEW.catalog_release_id, NEW.prompt_version,
         NEW.schema_version, NEW.idempotency_key, NEW.context_snapshot,
         NEW.discovery_session_id, NEW.discovery_revision, NEW.created_at, NEW.deadline_at)
        IS DISTINCT FROM
        (OLD.user_id, OLD.id, OLD.context_revision, OLD.catalog_release_id, OLD.prompt_version,
         OLD.schema_version, OLD.idempotency_key, OLD.context_snapshot,
         OLD.discovery_session_id, OLD.discovery_revision, OLD.created_at, OLD.deadline_at) THEN
        RAISE EXCEPTION 'Recommendation provenance is immutable' USING ERRCODE = '23514';
      END IF;
    ELSIF NEW.status <> 'pending' THEN
      RAISE EXCEPTION 'A run starts pending' USING ERRCODE = '23514';
    END IF;
    IF NEW.discovery_session_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM asgard_private.discovery_sessions WHERE id = NEW.discovery_session_id
        AND user_id = NEW.user_id AND status = 'completed' AND revision = NEW.discovery_revision
    ) THEN RAISE EXCEPTION 'Recommendations require completed Discovery' USING ERRCODE = '23514'; END IF;
    IF NEW.status = 'completed' THEN
      PERFORM 1 FROM asgard_private.learning_state WHERE user_id = NEW.user_id
        AND context_revision = NEW.context_revision FOR UPDATE;
      IF NOT FOUND OR statement_timestamp() > NEW.deadline_at OR
        NOT EXISTS (SELECT 1 FROM asgard_private.recommendation_items WHERE run_id = NEW.id) THEN
        RAISE EXCEPTION 'Cannot complete stale, expired or empty recommendations' USING ERRCODE = '23514';
      END IF;
    END IF;
  ELSE
    SELECT * INTO run FROM asgard_private.recommendation_runs
      WHERE id = NEW.run_id AND user_id = NEW.user_id FOR UPDATE;
    IF run.status IS DISTINCT FROM 'pending' THEN
      RAISE EXCEPTION 'Only pending runs accept results' USING ERRCODE = '23514';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM asgard_catalog.careers WHERE id = NEW.career_id AND status = 'published')
      OR (NEW.roadmap_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM asgard_catalog.roadmaps WHERE id = NEW.roadmap_id AND status = 'published'))
      OR (NEW.starting_topic_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM asgard_catalog.topics WHERE id = NEW.starting_topic_id AND retired_at IS NULL)) THEN
      RAISE EXCEPTION 'Results require published catalog references' USING ERRCODE = '23514';
    END IF;
  END IF;
  RETURN NEW;
END $$;
