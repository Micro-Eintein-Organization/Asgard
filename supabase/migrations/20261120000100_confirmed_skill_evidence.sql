-- Concrete SQL/API review approved by @YakisobaNissin in chat, 2026-11-20.
-- Application to retained/hosted environments requires separate authorization.
-- Owner/implementer: Codex. Required reviewer: @YakisobaNissin.
-- COUN-01..03, RES-01, SKILL-01..02; prepared 2026-11-20.
BEGIN;

ALTER TABLE asgard_private.user_competencies
  ADD COLUMN evidence_confirmed boolean NOT NULL DEFAULT false;

ALTER TABLE asgard_private.analysis_attempts
  DROP CONSTRAINT analysis_attempts_operation_check;
ALTER TABLE asgard_private.analysis_attempts
  ADD CONSTRAINT analysis_attempts_operation_check CHECK (
    operation IN ('recommendation', 'pdf_analysis', 'comparison_insight',
                  'counselor_turn', 'skill_interpretation')
  );

-- Delegate session checks, lock order, revision advancement and privacy erasure
-- to the existing protected mutation. Any later failure rolls back the whole batch.
CREATE FUNCTION asgard_private.confirm_reported_skills(
  session_id uuid, assurance text, expected_version integer, selections jsonb
) RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE
  subject uuid;
  item jsonb;
  next_version integer := expected_version;
  saved_level integer;
  selected_id uuid;
BEGIN
  subject := nullif(current_setting('asgard.user_id',true),'')::uuid;
  IF subject IS NULL OR asgard_private.session_allowed(subject,session_id,assurance) IS NOT TRUE THEN
    RAISE EXCEPTION 'Session unavailable' USING ERRCODE='42501';
  END IF;
  IF expected_version IS NULL OR expected_version < 0
     OR jsonb_typeof(selections) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'Invalid skill selection' USING ERRCODE='23514';
  END IF;
  IF jsonb_array_length(selections) NOT BETWEEN 1 AND 30 THEN
    RAISE EXCEPTION 'Invalid skill selection count' USING ERRCODE='23514';
  END IF;
  IF EXISTS (SELECT 1 FROM jsonb_array_elements(selections) s
             WHERE jsonb_typeof(s) IS DISTINCT FROM 'object'
                OR NOT (s ? 'competency_id')
                OR jsonb_typeof(s->'competency_id') IS DISTINCT FROM 'string'
                OR (s - 'competency_id' - 'level') <> '{}'::jsonb)
     OR (SELECT count(DISTINCT s->>'competency_id')
         FROM jsonb_array_elements(selections) s) <> jsonb_array_length(selections) THEN
    RAISE EXCEPTION 'Invalid or duplicate skill selection' USING ERRCODE='23514';
  END IF;

  INSERT INTO asgard_private.learning_state(user_id) VALUES(subject) ON CONFLICT DO NOTHING;
  PERFORM 1 FROM asgard_private.learning_state WHERE user_id=subject FOR UPDATE;
  PERFORM pg_advisory_xact_lock(hashtextextended(subject::text,411));
  IF coalesce((SELECT version FROM asgard_private.competency_state
               WHERE user_id=subject),0) <> expected_version THEN
    RAISE EXCEPTION 'Stale skill version' USING ERRCODE='40001';
  END IF;

  FOR item IN SELECT value FROM jsonb_array_elements(selections)
              ORDER BY value->>'competency_id'
  LOOP
    selected_id := (item->>'competency_id')::uuid;
    IF item ? 'level' THEN
      IF item->'level' <> 'null'::jsonb
         AND (jsonb_typeof(item->'level') IS DISTINCT FROM 'number'
              OR (item->>'level') !~ '^[0-4]$') THEN
        RAISE EXCEPTION 'Invalid experience level' USING ERRCODE='23514';
      END IF;
      saved_level := (item->>'level')::integer;
    ELSE
      SELECT level INTO saved_level FROM asgard_private.user_competencies
       WHERE user_id=subject AND competency_id=selected_id;
    END IF;
    next_version := asgard_private.mutate_reported_skill(
      session_id,assurance,selected_id,next_version,saved_level,false);
    UPDATE asgard_private.user_competencies SET evidence_confirmed=true
     WHERE user_id=subject AND competency_id=selected_id;
  END LOOP;
  RETURN next_version;
END $$;

REVOKE ALL ON FUNCTION asgard_private.confirm_reported_skills(uuid,text,integer,jsonb)
  FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION asgard_private.confirm_reported_skills(uuid,text,integer,jsonb)
  TO asgard_app;

COMMIT;
