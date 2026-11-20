-- Discovery v4 only. Review against versioned migration and content SQL before applying.
BEGIN;
DO $flow_guard$ BEGIN
IF EXISTS(SELECT 1 FROM supabase_migrations.schema_migrations WHERE version='20261120000200')
AND NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='asgard_private' AND table_name='discovery_sessions' AND column_name='flow_plan') THEN
RAISE EXCEPTION 'Migration history exists but flow_plan is missing'; END IF;
IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='asgard_private' AND table_name='discovery_sessions' AND column_name='flow_plan') THEN

ALTER TABLE asgard_private.discovery_sessions
  ADD COLUMN flow_plan jsonb NOT NULL DEFAULT '{}'::jsonb
  CHECK (jsonb_typeof(flow_plan) = 'object');

END IF;
IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='asgard_private' AND table_name='discovery_sessions' AND column_name='flow_plan' AND data_type='jsonb' AND is_nullable='NO') THEN RAISE EXCEPTION 'Conflicting flow_plan column'; END IF;
END $flow_guard$;
INSERT INTO supabase_migrations.schema_migrations(version,name,statements) VALUES ('20261120000200','discovery_flow_plan',ARRAY[$migration_source$
ALTER TABLE asgard_private.discovery_sessions
  ADD COLUMN flow_plan jsonb NOT NULL DEFAULT '{}'::jsonb
  CHECK (jsonb_typeof(flow_plan) = 'object');
$migration_source$]) ON CONFLICT(version) DO NOTHING;

SELECT pg_advisory_xact_lock(72611029);

DO $publication$
DECLARE
    questionnaire uuid := '87de8afe-ed6f-5821-b7ab-88c8b1c5c9bd';
    question_ids text[] := ARRAY['experience_preference', 'interests', 'activities_general', 'activities_build', 'scenario_web', 'scenario_backend', 'scenario_full_stack', 'scenario_mobile', 'scenario_games', 'scenario_ai_features', 'activities_data', 'scenario_analyze', 'scenario_dashboards', 'scenario_pipelines', 'scenario_statistics', 'scenario_train_models', 'activities_security', 'scenario_test_security', 'scenario_respond', 'scenario_cloud_security', 'activities_design', 'scenario_layouts', 'scenario_research', 'activities_infrastructure', 'scenario_networks', 'scenario_servers', 'scenario_cloud', 'scenario_releases', 'activities_devices', 'scenario_circuits', 'scenario_embedded', 'scenario_linux', 'bridge_build_data', 'bridge_build_security', 'bridge_build_design', 'bridge_build_infrastructure', 'bridge_build_devices', 'bridge_data_security', 'bridge_data_design', 'bridge_data_infrastructure', 'bridge_data_devices', 'bridge_security_design', 'bridge_security_infrastructure', 'bridge_security_devices', 'bridge_design_infrastructure', 'bridge_design_devices', 'bridge_infrastructure_devices'];
BEGIN
    INSERT INTO asgard_catalog.questionnaires (id, version, published_at)
    VALUES (questionnaire, 4, statement_timestamp())
    ON CONFLICT (id) DO NOTHING;

    IF NOT EXISTS (
        SELECT 1 FROM asgard_catalog.questionnaires
        WHERE id = questionnaire AND version = 4 AND published_at IS NOT NULL
    ) THEN
        RAISE EXCEPTION 'Discovery v4 questionnaire identity conflicts with publication';
    END IF;

    INSERT INTO asgard_catalog.questions (questionnaire_id, id, position)
    SELECT questionnaire, question_id, (ordinality - 1)::integer
    FROM unnest(question_ids) WITH ORDINALITY AS expected(question_id, ordinality)
    ON CONFLICT (questionnaire_id, id) DO NOTHING;

    IF EXISTS (
        SELECT 1
        FROM unnest(question_ids) WITH ORDINALITY AS expected(question_id, ordinality)
        FULL JOIN (
            SELECT id, position FROM asgard_catalog.questions
            WHERE questionnaire_id = questionnaire
        ) AS actual ON actual.id = expected.question_id
        WHERE actual.position IS DISTINCT FROM (expected.ordinality - 1)::integer
    ) THEN
        RAISE EXCEPTION 'Discovery v4 question registry conflicts with the authored route';
    END IF;
END $publication$;


COMMIT;
