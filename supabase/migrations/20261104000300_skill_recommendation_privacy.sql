-- Apply with the completed occupational integration, after isolated acceptance.
BEGIN;
ALTER TABLE asgard_private.recommendation_runs ADD COLUMN payload_erased_at timestamptz;
ALTER TABLE asgard_private.recommendation_items
  ADD COLUMN source_reference_ids uuid[] NOT NULL DEFAULT '{}';

CREATE TABLE asgard_private.recommendation_skill_inputs (
  user_id uuid NOT NULL,
  run_id uuid NOT NULL,
  competency_id uuid NOT NULL,
  PRIMARY KEY (user_id,run_id,competency_id),
  FOREIGN KEY (user_id,run_id) REFERENCES asgard_private.recommendation_runs(user_id,id)
    ON DELETE CASCADE
);
CREATE INDEX recommendation_skill_lookup
 ON asgard_private.recommendation_skill_inputs(user_id,competency_id,run_id);
ALTER TABLE asgard_private.recommendation_skill_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE asgard_private.recommendation_skill_inputs FORCE ROW LEVEL SECURITY;
REVOKE ALL ON asgard_private.recommendation_skill_inputs FROM PUBLIC,anon,authenticated,asgard_app;
GRANT SELECT ON asgard_private.recommendation_skill_inputs TO asgard_app;
CREATE POLICY owned_skill_inputs ON asgard_private.recommendation_skill_inputs
 FOR SELECT TO asgard_app USING
 (user_id=nullif(current_setting('asgard.user_id',true),'')::uuid);

CREATE TABLE asgard_private.skill_erasure_authorizations (
 user_id uuid NOT NULL, run_id uuid NOT NULL, transaction_id bigint NOT NULL,
 PRIMARY KEY(user_id,run_id,transaction_id)
);
REVOKE ALL ON asgard_private.skill_erasure_authorizations FROM PUBLIC,anon,authenticated,asgard_app;

CREATE FUNCTION asgard_private.skill_erasure_allowed(subject uuid,target uuid) RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path='' AS $$
 SELECT subject=nullif(current_setting('asgard.user_id',true),'')::uuid AND EXISTS (
  SELECT 1 FROM asgard_private.skill_erasure_authorizations a
  WHERE a.user_id=subject AND a.run_id=target AND a.transaction_id=txid_current()
 )
$$;
REVOKE ALL ON FUNCTION asgard_private.skill_erasure_allowed(uuid,uuid)
 FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION asgard_private.skill_erasure_allowed(uuid,uuid) TO asgard_app;

CREATE FUNCTION asgard_private.capture_recommendation_skills() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE expected_version integer; actual_version integer;
BEGIN
 IF NEW.context_snapshot->'context'->>'schema_version'='2' THEN
  IF NEW.user_id IS DISTINCT FROM nullif(current_setting('asgard.user_id',true),'')::uuid THEN
   RAISE EXCEPTION 'Input ownership mismatch' USING ERRCODE='23514';
  END IF;
  expected_version:=(NEW.context_snapshot->'context'->>'skill_profile_version')::integer;
  SELECT coalesce((SELECT version FROM asgard_private.competency_state
    WHERE user_id=NEW.user_id),0) INTO actual_version;
  IF expected_version IS DISTINCT FROM actual_version THEN
   RAISE EXCEPTION 'Stale skill snapshot' USING ERRCODE='23514';
  END IF;
  INSERT INTO asgard_private.recommendation_skill_inputs(user_id,run_id,competency_id)
   SELECT NEW.user_id,NEW.id,(f->>'source_id')::uuid
   FROM jsonb_array_elements(NEW.context_snapshot->'context'->'facts') f
   WHERE f->>'source'='reported_skill';
  IF EXISTS (
   (SELECT competency_id FROM asgard_private.user_competencies WHERE user_id=NEW.user_id
    EXCEPT SELECT competency_id FROM asgard_private.recommendation_skill_inputs
      WHERE user_id=NEW.user_id AND run_id=NEW.id)
   UNION ALL
   (SELECT competency_id FROM asgard_private.recommendation_skill_inputs
      WHERE user_id=NEW.user_id AND run_id=NEW.id
    EXCEPT SELECT competency_id FROM asgard_private.user_competencies WHERE user_id=NEW.user_id)
  ) THEN RAISE EXCEPTION 'Incomplete skill snapshot' USING ERRCODE='23514'; END IF;
 END IF;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION asgard_private.capture_recommendation_skills() FROM PUBLIC;
CREATE TRIGGER capture_recommendation_skill_inputs AFTER INSERT
 ON asgard_private.recommendation_runs FOR EACH ROW
 EXECUTE FUNCTION asgard_private.capture_recommendation_skills();

CREATE FUNCTION asgard_private.mutate_reported_skill(
 session_id uuid,assurance text,skill_id uuid,expected_version integer,
 reported_level integer,remove_record boolean
) RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE subject uuid; current_version integer; saved_label text; existed boolean; target uuid;
BEGIN
 subject:=nullif(current_setting('asgard.user_id',true),'')::uuid;
 IF subject IS NULL OR NOT asgard_private.session_allowed(subject,session_id,assurance) THEN
  RAISE EXCEPTION 'Session unavailable' USING ERRCODE='42501';
 END IF;
 IF remove_record IS NULL OR expected_version IS NULL OR expected_version<0 OR
    (reported_level IS NOT NULL AND reported_level NOT BETWEEN 0 AND 4) THEN
  RAISE EXCEPTION 'Invalid skill mutation' USING ERRCODE='23514';
 END IF;
 INSERT INTO asgard_private.learning_state(user_id) VALUES(subject) ON CONFLICT DO NOTHING;
 PERFORM 1 FROM asgard_private.learning_state WHERE user_id=subject FOR UPDATE;
 PERFORM pg_advisory_xact_lock(hashtextextended(subject::text,411));
 SELECT coalesce((SELECT version FROM asgard_private.competency_state
  WHERE user_id=subject),0) INTO current_version;
 IF current_version<>expected_version THEN
  RAISE EXCEPTION 'Stale skill version' USING ERRCODE='40001';
 END IF;
 SELECT EXISTS(SELECT 1 FROM asgard_private.user_competencies
  WHERE user_id=subject AND competency_id=skill_id) INTO existed;
 IF remove_record AND NOT existed THEN
  RAISE EXCEPTION 'Skill not recorded' USING ERRCODE='23514';
 END IF;
 IF NOT remove_record THEN
  SELECT label INTO saved_label FROM asgard_catalog.competencies WHERE id=skill_id AND published;
  IF NOT FOUND THEN RAISE EXCEPTION 'Skill unavailable' USING ERRCODE='23514'; END IF;
 END IF;
 IF existed THEN
  FOR target IN SELECT r.id FROM asgard_private.recommendation_runs r
   WHERE r.user_id=subject AND r.payload_erased_at IS NULL AND EXISTS (
    SELECT 1 FROM asgard_private.recommendation_skill_inputs i
     WHERE i.user_id=subject AND i.run_id=r.id AND i.competency_id=skill_id
   ) ORDER BY r.id FOR UPDATE
  LOOP
   INSERT INTO asgard_private.skill_erasure_authorizations VALUES(subject,target,txid_current());
   DELETE FROM asgard_private.recommendation_items WHERE user_id=subject AND run_id=target;
   UPDATE asgard_private.recommendation_runs SET context_snapshot='{}'::jsonb,
    discovery_session_id=NULL,discovery_revision=NULL,status='failed',failure_code='context_outdated',
    finished_at=coalesce(finished_at,statement_timestamp()),payload_erased_at=statement_timestamp()
    WHERE user_id=subject AND id=target;
   DELETE FROM asgard_private.recommendation_skill_inputs WHERE user_id=subject AND run_id=target;
   DELETE FROM asgard_private.skill_erasure_authorizations
    WHERE user_id=subject AND run_id=target AND transaction_id=txid_current();
  END LOOP;
 END IF;
 INSERT INTO asgard_private.competency_state(user_id,version) VALUES(subject,current_version+1)
  ON CONFLICT(user_id) DO UPDATE SET version=excluded.version;
 IF remove_record THEN
  DELETE FROM asgard_private.user_competencies WHERE user_id=subject AND competency_id=skill_id;
 ELSE
  INSERT INTO asgard_private.user_competencies(user_id,competency_id,label,level)
   VALUES(subject,skill_id,saved_label,reported_level) ON CONFLICT(user_id,competency_id)
   DO UPDATE SET label=excluded.label,level=excluded.level,updated_at=statement_timestamp();
 END IF;
 UPDATE asgard_private.learning_state SET context_revision=context_revision+1 WHERE user_id=subject;
 RETURN current_version+1;
END $$;
REVOKE ALL ON FUNCTION asgard_private.mutate_reported_skill(uuid,text,uuid,integer,integer,boolean)
 FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION asgard_private.mutate_reported_skill(uuid,text,uuid,integer,integer,boolean)
 TO asgard_app;
REVOKE INSERT,UPDATE,DELETE ON asgard_private.user_competencies,
 asgard_private.competency_state FROM asgard_app;

-- Permit only exact privacy erasure after owned document removal; all other provenance remains immutable.
CREATE OR REPLACE FUNCTION asgard_private.guard_recommendation_change() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE run asgard_private.recommendation_runs;
BEGIN
  IF TG_TABLE_NAME = 'recommendation_runs' AND TG_OP = 'UPDATE' THEN
    IF OLD.payload_erased_at IS NOT NULL THEN
      RAISE EXCEPTION 'Erased recommendation is immutable' USING ERRCODE='23514';
    END IF;
    IF asgard_private.skill_erasure_allowed(OLD.user_id,OLD.id)
      AND NEW.payload_erased_at IS NOT NULL AND NEW.context_snapshot='{}'::jsonb
      AND NEW.discovery_session_id IS NULL AND NEW.discovery_revision IS NULL
      AND NEW.status='failed' AND NEW.failure_code='context_outdated'
      AND NEW.finished_at IS NOT NULL
      AND (to_jsonb(NEW)-ARRAY['context_snapshot','discovery_session_id','discovery_revision',
        'status','failure_code','finished_at','payload_erased_at'])
        = (to_jsonb(OLD)-ARRAY['context_snapshot','discovery_session_id','discovery_revision',
        'status','failure_code','finished_at','payload_erased_at']) THEN
      RETURN NEW;
    END IF;
    IF NEW.payload_erased_at IS DISTINCT FROM OLD.payload_erased_at THEN
      RAISE EXCEPTION 'Erasure requires owned skill mutation' USING ERRCODE='23514';
    END IF;
  END IF;
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
      IF NEW.context_snapshot->'context'->>'schema_version'='2' AND
        (NEW.context_snapshot->'context'->>'occupational_release_id')::uuid IS DISTINCT FROM
        (SELECT release_id FROM asgard_catalog.occupational_active_release WHERE singleton) THEN
        RAISE EXCEPTION 'Occupational release changed' USING ERRCODE='23514';
      END IF;
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

CREATE OR REPLACE FUNCTION asgard_private.guard_result_erasure() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF current_user = 'asgard_app' AND NOT asgard_private.skill_erasure_allowed(OLD.user_id,OLD.run_id) AND NOT EXISTS (
    SELECT 1 FROM asgard_private.recommendation_runs r
      JOIN asgard_private.documents d ON d.user_id = r.user_id
        AND d.id = (r.context_snapshot->'context'->'document'->>'document_id')::uuid
      WHERE r.id = OLD.run_id AND r.user_id = OLD.user_id AND d.status = 'removed'
  ) THEN
    RAISE EXCEPTION 'Result erasure requires removed document provenance' USING ERRCODE = '23514';
  END IF;
  RETURN OLD;
END $$;
COMMIT;
