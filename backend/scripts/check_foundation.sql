-- Local synthetic rollback-only probe: existing supabase_admin creates fixtures;
-- owner/integrity assertions run with current_user = asgard_app and forced RLS.
-- Run only in supabase_db_asgard-foundation with ON_ERROR_STOP. No grants are changed.
BEGIN;
SET LOCAL statement_timeout = '15s';
SET LOCAL lock_timeout = '2s';

CREATE FUNCTION pg_temp.expect_sqlstate(statement text, expected text) RETURNS void
LANGUAGE plpgsql AS $$
BEGIN
  BEGIN
    EXECUTE statement;
  EXCEPTION WHEN OTHERS THEN
    IF SQLSTATE = expected THEN RETURN; END IF;
    RAISE;
  END;
  RAISE EXCEPTION 'Expected SQLSTATE %, but statement succeeded', expected;
END $$;

DO $$
DECLARE
  a uuid := gen_random_uuid(); b uuid := gen_random_uuid();
  category uuid := gen_random_uuid(); career uuid := gen_random_uuid();
  roadmap uuid := gen_random_uuid(); other_roadmap uuid := gen_random_uuid();
  milestone uuid := gen_random_uuid(); topic uuid := gen_random_uuid();
  second_topic uuid := gen_random_uuid(); group_id uuid := gen_random_uuid();
  branch uuid := gen_random_uuid(); other_branch uuid := gen_random_uuid();
  branch_topic uuid := gen_random_uuid(); release uuid := gen_random_uuid();
  questionnaire uuid := gen_random_uuid(); session_a uuid := gen_random_uuid();
  session_b uuid := gen_random_uuid(); run_a uuid := gen_random_uuid();
  run_b uuid := gen_random_uuid(); name text; count_rows integer;
BEGIN
  IF current_database() <> 'postgres' OR current_user <> 'supabase_admin'
    OR NOT pg_has_role(current_user, 'asgard_app', 'SET')
    OR NOT EXISTS (SELECT 1 FROM supabase_migrations.schema_migrations
      WHERE version = '20261026000100') THEN
    RAISE EXCEPTION 'Run on migrated local Asgard using the existing fixture administrator';
  END IF;
  INSERT INTO auth.users(id) VALUES (a), (b);
  INSERT INTO asgard_catalog.categories(id, slug, title, description, position)
    VALUES (category, 'probe-' || category, 'Synthetic probe', '', 1000000);
  INSERT INTO asgard_catalog.careers(id, category_id, slug, title, description,
      status, editor, source_license, reviewed_by, reviewed_at)
    VALUES (career, category, 'probe-' || career, 'Synthetic probe', '',
      'published', 'Synthetic probe', 'Synthetic', 'Synthetic probe', now());
  INSERT INTO asgard_catalog.releases(id, version) VALUES (release, 1000000);
  INSERT INTO asgard_catalog.roadmaps(id, career_id, title, description, status)
    VALUES (roadmap, career, 'Synthetic probe', '', 'published'),
      (other_roadmap, career, 'Synthetic alternative', '', 'published');
  INSERT INTO asgard_catalog.milestones(id, roadmap_id, title, description, position)
    VALUES (milestone, roadmap, 'Synthetic probe', '', 0);
  INSERT INTO asgard_catalog.branch_groups(id, roadmap_id, milestone_id, title, explanation, position)
    VALUES (group_id, roadmap, milestone, 'Synthetic choice', 'Choose explicitly', 0);
  INSERT INTO asgard_catalog.branches(id, roadmap_id, milestone_id, group_id, title, position)
    VALUES (branch, roadmap, milestone, group_id, 'Synthetic A', 0),
      (other_branch, roadmap, milestone, group_id, 'Synthetic B', 1);
  INSERT INTO asgard_catalog.topics(id, roadmap_id, milestone_id, title, explanation, position)
    VALUES (topic, roadmap, milestone, 'Synthetic topic', 'Synthetic explanation', 0),
      (second_topic, roadmap, milestone, 'Synthetic second', 'Synthetic explanation', 1);
  INSERT INTO asgard_catalog.topics(id, roadmap_id, milestone_id, branch_id,
      title, explanation, position)
    VALUES (branch_topic, roadmap, milestone, branch, 'Synthetic branch topic', 'Synthetic', 0);
  INSERT INTO asgard_catalog.questionnaires(id, version, published_at)
    VALUES (questionnaire, 1000000, now());
  INSERT INTO asgard_catalog.questions(questionnaire_id, id, position)
    VALUES (questionnaire, 'probe-question', 0);
  INSERT INTO asgard_private.learning_state(user_id, current_roadmap_id)
    VALUES (a, roadmap), (b, roadmap);
  INSERT INTO asgard_private.preferences(user_id) VALUES (a), (b);
  INSERT INTO asgard_private.discovery_sessions(id, user_id, questionnaire_id)
    VALUES (session_a, a, questionnaire), (session_b, b, questionnaire);
  INSERT INTO asgard_private.discovery_answers(user_id, session_id, questionnaire_id,
      question_id, option_ids)
    VALUES (a, session_a, questionnaire, 'probe-question', ARRAY['probe-option']),
      (b, session_b, questionnaire, 'probe-question', ARRAY['probe-option']);
  UPDATE asgard_private.discovery_sessions SET status = 'completed', completed_at = now()
    WHERE id IN (session_a, session_b);
  INSERT INTO asgard_private.branch_choices(user_id, roadmap_id, group_id, branch_id)
    VALUES (a, roadmap, group_id, branch), (b, roadmap, group_id, branch);
  INSERT INTO asgard_private.topic_progress(user_id, roadmap_id, topic_id, status)
    VALUES (a, roadmap, topic, 'done'), (b, roadmap, topic, 'done');
  INSERT INTO asgard_private.progress_events(user_id, roadmap_id, topic_id, from_status, to_status)
    VALUES (a, roadmap, topic, 'not_started', 'done'), (b, roadmap, topic, 'not_started', 'done');
  INSERT INTO asgard_private.completion_activity(user_id, roadmap_id, topic_id, local_date, timezone)
    VALUES (a, roadmap, topic, DATE '2026-10-26', 'Asia/Manila'),
      (b, roadmap, topic, DATE '2026-10-26', 'Asia/Manila');
  INSERT INTO asgard_private.recommendation_runs(id, user_id, discovery_session_id,
      discovery_revision, context_revision, catalog_release_id, prompt_version,
      schema_version, idempotency_key, context_snapshot, deadline_at)
    SELECT run_a, a, session_a, 1, context_revision, release, 'probe', '1', gen_random_uuid(),
      '{}', statement_timestamp() + interval '30 seconds'
      FROM asgard_private.learning_state WHERE user_id = a;
  INSERT INTO asgard_private.recommendation_runs(id, user_id, context_revision,
      catalog_release_id, prompt_version, schema_version, idempotency_key, context_snapshot, deadline_at)
    SELECT run_b, b, context_revision, release, 'probe', '1', gen_random_uuid(), '{}',
      statement_timestamp() + interval '30 seconds'
      FROM asgard_private.learning_state WHERE user_id = b;
  INSERT INTO asgard_private.recommendation_items(user_id, run_id, position, career_id,
      roadmap_id, starting_topic_id, reason, evidence_fact_ids)
    VALUES (a, run_a, 0, career, roadmap, topic, 'Synthetic explanation', ARRAY['fact:1']),
      (b, run_b, 0, career, roadmap, topic, 'Synthetic explanation', ARRAY['fact:1']);
  INSERT INTO asgard_private.analysis_attempts(user_id, recommendation_run_id, operation,
      attempt, reservation_key)
    VALUES (a, run_a, 'recommendation', 1, gen_random_uuid()),
      (b, run_b, 'recommendation', 1, gen_random_uuid());

  EXECUTE 'SET LOCAL ROLE anon';
  PERFORM pg_temp.expect_sqlstate('SELECT * FROM asgard_private.learning_state', '42501');
  PERFORM pg_temp.expect_sqlstate('SELECT * FROM asgard_catalog.careers', '42501');
  EXECUTE 'RESET ROLE';
  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM pg_temp.expect_sqlstate('SELECT * FROM asgard_private.learning_state', '42501');
  EXECUTE 'RESET ROLE';
  EXECUTE 'SET LOCAL ROLE asgard_app';
  IF EXISTS (SELECT 1 FROM asgard_private.learning_state) THEN
    RAISE EXCEPTION 'Missing identity must expose no private rows';
  END IF;
  PERFORM set_config('asgard.user_id', a::text, true);
  FOREACH name IN ARRAY ARRAY['learning_state', 'preferences', 'discovery_sessions',
    'discovery_answers', 'branch_choices', 'topic_progress', 'progress_events',
    'completion_activity', 'recommendation_runs', 'recommendation_items', 'analysis_attempts']
  LOOP
    EXECUTE format('SELECT count(*) FROM asgard_private.%I WHERE user_id = $1', name)
      INTO count_rows USING b;
    IF count_rows <> 0 THEN RAISE EXCEPTION 'Cross-account read in %', name; END IF;
    EXECUTE format('SELECT count(*) FROM asgard_private.%I WHERE user_id = $1', name)
      INTO count_rows USING a;
    IF count_rows <> 1 THEN RAISE EXCEPTION 'Owner fixture missing in %', name; END IF;
  END LOOP;
  UPDATE asgard_private.preferences SET timezone = 'UTC' WHERE user_id = b;
  GET DIAGNOSTICS count_rows = ROW_COUNT;
  IF count_rows <> 0 THEN RAISE EXCEPTION 'Cross-account update succeeded'; END IF;
  PERFORM pg_temp.expect_sqlstate(format(
    'INSERT INTO asgard_private.preferences(user_id) VALUES (%L)', b), '42501');
  PERFORM pg_temp.expect_sqlstate(format(
    'INSERT INTO asgard_catalog.releases(version) VALUES (1000001)'), '42501');
  PERFORM pg_temp.expect_sqlstate(format(
    'UPDATE asgard_private.discovery_answers SET option_ids = ARRAY[''changed''] WHERE session_id = %L',
    session_a), '23514');
  PERFORM pg_temp.expect_sqlstate(format(
    'INSERT INTO asgard_private.topic_progress(user_id, roadmap_id, topic_id, status)
      VALUES (%L, %L, %L, ''done'')', a, other_roadmap, second_topic), '23503');
  PERFORM pg_temp.expect_sqlstate(format(
    'INSERT INTO asgard_private.completion_activity(user_id, roadmap_id, topic_id, local_date, timezone)
      VALUES (%L, %L, %L, ''2026-10-26'', ''Asia/Manila'')', a, roadmap, topic), '23505');
  INSERT INTO asgard_private.topic_progress(user_id, roadmap_id, topic_id, status)
    VALUES (a, roadmap, branch_topic, 'learning');
  PERFORM pg_temp.expect_sqlstate(format(
    'INSERT INTO asgard_private.topic_progress(user_id, roadmap_id, topic_id, status)
      VALUES (%L, %L, %L, ''learning'')', a, roadmap, second_topic), '23505');
  PERFORM pg_temp.expect_sqlstate(format(
    'UPDATE asgard_private.learning_state SET current_roadmap_id = %L WHERE user_id = %L',
    other_roadmap, a), '23514');
  PERFORM pg_temp.expect_sqlstate(format(
    'UPDATE asgard_private.branch_choices SET branch_id = %L WHERE user_id = %L',
    other_branch, a), '23514');
  PERFORM pg_temp.expect_sqlstate(format(
    'INSERT INTO asgard_private.recommendation_items(user_id, run_id, position, career_id,
      reason, evidence_fact_ids) VALUES (%L, %L, 1, %L, ''Synthetic'', ARRAY[''fact:1''])',
    a, run_a, career), '23505');
  PERFORM pg_temp.expect_sqlstate(format(
    'INSERT INTO asgard_private.recommendation_items(user_id, run_id, position, career_id,
      reason, evidence_fact_ids) VALUES (%L, %L, 3, %L, ''Synthetic'', ARRAY[''fact:1''])',
    a, run_a, career), '23514');
  PERFORM pg_temp.expect_sqlstate(format(
    'INSERT INTO asgard_private.recommendation_runs(user_id, context_revision, catalog_release_id,
      prompt_version, schema_version, idempotency_key, context_snapshot, deadline_at)
      VALUES (%L, 1, %L, ''probe'', ''1'', gen_random_uuid(), ''{}'', now()+interval ''30 seconds'')',
    a, release), '23505');
  PERFORM pg_temp.expect_sqlstate(format(
    'UPDATE asgard_private.recommendation_runs SET status = ''completed'', finished_at = now()
      WHERE id = %L', run_a), '23514');
  PERFORM set_config('asgard.user_id', b::text, true);
  UPDATE asgard_private.recommendation_runs SET status = 'completed', finished_at = now()
    WHERE id = run_b;
  PERFORM pg_temp.expect_sqlstate(format(
    'UPDATE asgard_private.recommendation_runs SET context_snapshot = ''{"changed":true}''
      WHERE id = %L', run_b), '23514');
  EXECUTE 'RESET ROLE';
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'asgard_app'
      AND (rolsuper OR rolbypassrls OR rolcreaterole OR rolcreatedb)) THEN
    RAISE EXCEPTION 'Unsafe application role';
  END IF;
  RAISE NOTICE 'PASS: owner/other/anonymous/browser roles; composite FKs; immutable Discovery/results; Learning/focus/branch guards; activity deduplication; recommendation bounds, pending uniqueness and stale completion';
END $$;
ROLLBACK;
