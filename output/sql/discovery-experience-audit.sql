-- Read-only diagnostic: the five latest completed Discovery recommendation runs.
-- Returns metadata/counts only, without resume passages or user identifiers.
SELECT r.id AS run_id, r.created_at, r.prompt_version,
       a.option_ids AS saved_experience_choice,
       r.context_snapshot #>> '{context,document,document_id}' IS NOT NULL
           AS saved_resume_reference,
       (SELECT count(*) FROM jsonb_array_elements(
           coalesce(r.context_snapshot #> '{context,facts}', '[]'::jsonb)) AS fact
        WHERE fact->>'source' = 'pdf_analysis') AS saved_resume_fact_count,
       (SELECT count(*) FROM jsonb_array_elements(
           coalesce(r.context_snapshot #> '{context,facts}', '[]'::jsonb)) AS fact
        WHERE fact->>'source' = 'reported_skill') AS saved_reported_skill_count,
       (SELECT coalesce(sum(jsonb_array_length(
           coalesce(explanation.value->'experience_connections', '[]'::jsonb))), 0)
        FROM jsonb_each(coalesce(
           r.context_snapshot #> '{context,explanations}', '{}'::jsonb)) AS explanation)
           AS saved_experience_connection_count
FROM asgard_private.recommendation_runs AS r
LEFT JOIN asgard_private.discovery_answers AS a
  ON a.user_id = r.user_id AND a.session_id = r.discovery_session_id
 AND a.question_id = 'experience_preference'
WHERE r.status = 'completed' AND r.discovery_session_id IS NOT NULL
ORDER BY r.created_at DESC, r.id DESC
LIMIT 5;
