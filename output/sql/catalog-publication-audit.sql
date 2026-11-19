BEGIN READ ONLY;
WITH states AS (
SELECT 'careers' AS dataset, status AS state, count(*) AS records
FROM asgard_catalog.careers GROUP BY status
UNION ALL
SELECT 'roadmaps',status,count(*) FROM asgard_catalog.roadmaps GROUP BY status
UNION ALL
SELECT 'skills: ' || source,CASE WHEN published THEN 'published' ELSE 'unpublished' END,count(*)
FROM asgard_catalog.competencies GROUP BY source,published
UNION ALL
SELECT 'snapshot: ' || source || '/' || source_version,
 CASE WHEN published THEN 'published' ELSE 'unpublished' END,count(*)
FROM asgard_catalog.career_skill_snapshot GROUP BY source,source_version,published
UNION ALL
SELECT 'postings: ' || p.source || '/' || p.source_version,v.status,count(*)
FROM asgard_catalog.career_skill_postings p
JOIN asgard_catalog.career_skill_posting_versions v USING(source,source_version)
GROUP BY p.source,p.source_version,v.status
UNION ALL
SELECT 'questionnaire v' || version,
 CASE WHEN published_at IS NULL THEN 'unpublished' ELSE 'published' END,count(*)
FROM asgard_catalog.questionnaires GROUP BY version,published_at
UNION ALL
SELECT 'ESCO releases','total',count(*) FROM asgard_catalog.esco_releases
UNION ALL
SELECT 'ESCO releases','active',count(*) FROM asgard_catalog.esco_active_release
UNION ALL
SELECT 'occupational releases','total',count(*) FROM asgard_catalog.occupational_releases
UNION ALL
SELECT 'occupational releases','active',count(*) FROM asgard_catalog.occupational_active_release
UNION ALL
SELECT 'topics','retired',count(*) FROM asgard_catalog.topics WHERE retired_at IS NOT NULL
ORDER BY dataset,state
)
SELECT jsonb_build_object(
 'publication_states',(SELECT jsonb_agg(to_jsonb(s)) FROM states s),
 'posting_versions',(SELECT jsonb_agg(to_jsonb(v)) FROM (
   SELECT source,source_version,status,input_row_count,verified_row_count,posting_count
   FROM asgard_catalog.career_skill_posting_versions ORDER BY source,source_version) v),
 'content_versions',(SELECT jsonb_agg(version ORDER BY version) FROM asgard_catalog.releases),
 'careers_without_published_roadmaps',(SELECT coalesce(jsonb_agg(c.slug),'[]'::jsonb)
   FROM asgard_catalog.careers c WHERE c.status='published'
   AND NOT EXISTS (SELECT 1 FROM asgard_catalog.roadmaps r
     WHERE r.career_id=c.id AND r.status='published'))
) AS audit;
COMMIT;
