BEGIN;
SELECT pg_advisory_xact_lock(72611029);

DO $publication$
DECLARE
    questionnaire uuid := '44c29b75-2b89-5a8a-96de-afda2e3fed2f';
    question_ids text[] := ARRAY['experience_preference', 'interests', 'activities_general', 'activities_build', 'scenario_web', 'scenario_backend', 'scenario_full_stack', 'scenario_mobile', 'scenario_games', 'scenario_ai_features', 'activities_data', 'scenario_analyze', 'scenario_dashboards', 'scenario_pipelines', 'scenario_statistics', 'scenario_train_models', 'activities_security', 'scenario_test_security', 'scenario_respond', 'scenario_cloud_security', 'activities_design', 'scenario_layouts', 'scenario_research', 'activities_infrastructure', 'scenario_networks', 'scenario_servers', 'scenario_cloud', 'scenario_releases', 'activities_devices', 'scenario_circuits', 'scenario_embedded', 'scenario_linux', 'bridge_build_data', 'bridge_build_security', 'bridge_build_design', 'bridge_build_infrastructure', 'bridge_build_devices', 'bridge_data_security', 'bridge_data_design', 'bridge_data_infrastructure', 'bridge_data_devices', 'bridge_security_design', 'bridge_security_infrastructure', 'bridge_security_devices', 'bridge_design_infrastructure', 'bridge_design_devices', 'bridge_infrastructure_devices'];
BEGIN
    INSERT INTO asgard_catalog.questionnaires (id, version, published_at)
    VALUES (questionnaire, 3, statement_timestamp())
    ON CONFLICT (id) DO NOTHING;

    IF NOT EXISTS (
        SELECT 1 FROM asgard_catalog.questionnaires
        WHERE id = questionnaire AND version = 3 AND published_at IS NOT NULL
    ) THEN
        RAISE EXCEPTION 'Discovery v3 questionnaire identity conflicts with publication';
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
        RAISE EXCEPTION 'Discovery v3 question registry conflicts with the authored route';
    END IF;
END $publication$;

COMMIT;
