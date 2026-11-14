BEGIN;
SELECT pg_advisory_xact_lock(72611029);

DO $publication$
DECLARE
    questionnaire uuid := '69842b82-9a9b-5e76-9d8e-75f02bd0a4c1';
    question_ids text[] := ARRAY[
        'experience_preference', 'interests', 'activities_build', 'activities_data',
        'activities_design', 'activities_security', 'activities_infrastructure',
        'activities_devices', 'activities_general', 'prefer_ai_ml', 'prefer_ui_ux',
        'prefer_cloud_devops', 'goals'
    ];
BEGIN
    INSERT INTO asgard_catalog.questionnaires (id, version, published_at)
    VALUES (questionnaire, 2, statement_timestamp())
    ON CONFLICT (id) DO NOTHING;

    IF NOT EXISTS (
        SELECT 1 FROM asgard_catalog.questionnaires
        WHERE id = questionnaire AND version = 2 AND published_at IS NOT NULL
    ) THEN
        RAISE EXCEPTION 'Discovery v2 questionnaire identity conflicts with publication';
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
        RAISE EXCEPTION 'Discovery v2 question registry conflicts with the authored route';
    END IF;
END $publication$;

COMMIT;
