BEGIN;
ALTER TABLE asgard_catalog.occupational_releases
 DROP CONSTRAINT occupational_releases_payload_check2,
 ADD CONSTRAINT occupational_releases_profile_count CHECK (
   jsonb_array_length(payload->'profiles') =
     CASE WHEN payload->>'catalog_scope' = 'asgard-v4-23' THEN 23 ELSE 12 END
 );

CREATE OR REPLACE FUNCTION asgard_catalog.validate_occupational_payload(body jsonb) RETURNS void
LANGUAGE plpgsql SET search_path='' AS $$
DECLARE p jsonb; r jsonb; field text; career uuid;
BEGIN
 IF jsonb_typeof(body->'sources') IS DISTINCT FROM 'array'
  OR jsonb_typeof(body->'overlay'->'eligible_record_proposals') IS DISTINCT FROM 'array'
  OR jsonb_typeof(body->'profiles') IS DISTINCT FROM 'array' THEN
  RAISE EXCEPTION 'Missing reference fields' USING ERRCODE='23514'; END IF;
 IF body->>'catalog_scope' = 'asgard-v4-23' THEN
  IF jsonb_array_length(body->'profiles')<>23 OR
    (SELECT array_agg(x->'career'->>'career_id' ORDER BY x->'career'->>'career_id')
      FROM jsonb_array_elements(body->'profiles') x)
    IS DISTINCT FROM (SELECT array_agg(id ORDER BY id) FROM unnest(ARRAY[
      '79cfc498-d637-5dee-a28a-6544a3f9c5a0',
      '0f8f854e-4b87-5c2c-9d99-5a557fe304de',
      '467303dd-7d03-5c1a-bd44-3b5fdb996cc3',
      'dbd9109d-1d9c-53e2-840f-b91c3f860dfe',
      'a4e54446-2b44-5716-bd3e-5cebb6253d9b',
      '88ac4df4-45e5-5f6f-9e9c-5f5b35db1aa9',
      '505b7463-bb7b-5b0d-915d-1765aa364500',
      '5bd57e28-f4bd-5380-8d2f-6d8927d33b9b',
      'f1756a96-98af-5abe-8439-423486b168d1',
      '8cac2720-79c7-54d4-a2f4-2f0082568b12',
      '3f53351f-851f-5aec-9ece-12f22220174f',
      '24068b09-7695-5744-88ca-9e678a40e06b',
      'fe9ab18e-e5fe-5a27-9f57-8c92ec4613b2',
      'cced74bd-db5a-51e2-9306-1209dd41dec7',
      '12a912b3-a9f2-5acc-b397-814a61a5ccfd',
      'd5da6f7f-acfb-5fce-a703-3ee858526264',
      'e57a6553-a0b1-5512-ba66-4037c27886dc',
      'c93df31e-9fe9-5ca2-95da-b7b6307d1ab8',
      '1c5a1b58-47c2-569c-9f18-77486cc9d829',
      'c5259752-baf4-59ce-9682-596375a5cc7f',
      'bc160707-e98f-5f72-b9dc-b77a5c02083e',
      '3556bbb7-ac30-5aec-ac42-46c277abf825',
      'e46a121b-b0b8-5e62-bedd-ebd9303f2eca'
    ]) id) THEN
   RAISE EXCEPTION 'Expanded release requires the exact 23-career roster' USING ERRCODE='23514';
  END IF;
 ELSIF body->>'catalog_scope' IS NOT NULL
  OR jsonb_array_length(body->'profiles')<>12
  OR (SELECT count(DISTINCT x->'career'->>'career_id') FROM jsonb_array_elements(body->'profiles') x)<>12 THEN
   RAISE EXCEPTION 'Legacy release requires twelve distinct careers' USING ERRCODE='23514';
 END IF;
 FOR p IN SELECT value FROM jsonb_array_elements(body->'profiles') LOOP
  career:=(p->'career'->>'career_id')::uuid;
  IF NOT EXISTS(SELECT 1 FROM asgard_catalog.careers WHERE id=career AND status='published') THEN
   RAISE EXCEPTION 'Unknown published career' USING ERRCODE='23514'; END IF;
  IF body->>'catalog_scope' = 'asgard-v4-23' THEN
   IF jsonb_typeof(p->'esco_references') IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'ESCO references required' USING ERRCODE='23514';
   END IF;
   IF jsonb_array_length(p->'esco_references') NOT BETWEEN 1 AND 6 OR
      (SELECT count(DISTINCT x->>'record_id') FROM jsonb_array_elements(p->'esco_references') x)
      <> jsonb_array_length(p->'esco_references') THEN
    RAISE EXCEPTION 'Expected one to six distinct ESCO references' USING ERRCODE='23514';
   END IF;
   FOR r IN SELECT value FROM jsonb_array_elements(p->'esco_references') LOOP
    IF r->>'career_id' IS DISTINCT FROM career::text
     OR r->>'evidence_type' IS DISTINCT FROM 'esco_occupation_skill'
     OR r->>'relationship' IS DISTINCT FROM 'source_reference'
     OR r->'related_skill_ids' IS DISTINCT FROM '[]'::jsonb
     OR NOT EXISTS(SELECT 1 FROM asgard_catalog.esco_career_links m
       JOIN asgard_catalog.esco_links l ON l.release_id=m.release_id AND l.occupation_uri=m.occupation_uri
       WHERE m.release_id=(body->>'esco_release_id')::uuid AND m.career_id=career
         AND m.occupation_uri='http://data.europa.eu/esco/occupation/' || (r->>'occupation_id')
         AND l.skill_uri='http://data.europa.eu/esco/skill/' || (r->>'competency_id')
         AND l.relationship=r->>'source_relationship') THEN
      RAISE EXCEPTION 'Uncleared ESCO career reference' USING ERRCODE='23514';
    END IF;
   END LOOP;
  END IF;
  FOREACH field IN ARRAY ARRAY['source_roles','relationships','records','competencies',
    'topics','skills','eligible_records'] LOOP
   IF jsonb_typeof(p->field) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'Missing profile array' USING ERRCODE='23514'; END IF;
  END LOOP;
  IF EXISTS(SELECT 1 FROM jsonb_array_elements(p->'topics') t WHERE
   t->>'career_id' IS DISTINCT FROM career::text
   OR (t->>'transfers_proficiency')::boolean IS DISTINCT FROM false
   OR NOT EXISTS(SELECT 1 FROM asgard_catalog.topics topic
     JOIN asgard_catalog.roadmaps path ON path.id=topic.roadmap_id
     WHERE topic.id=(t->>'topic_id')::uuid AND path.career_id=career)) THEN
   RAISE EXCEPTION 'Invalid career learning association' USING ERRCODE='23514'; END IF;
  FOR r IN SELECT value FROM jsonb_array_elements(p->'records') LOOP
   IF r->'review'->>'career_id' IS DISTINCT FROM career::text
    OR coalesce(r->'native'->>'locator','')=''
    OR NOT EXISTS(SELECT 1 FROM jsonb_array_elements(p->'source_roles') role
     WHERE role->>'occupation_id'=r->'native'->>'occupation_id') THEN
    RAISE EXCEPTION 'Invalid career source record' USING ERRCODE='23514'; END IF;
   IF p->'eligible_records' ? (r->'review'->>'record_id') THEN
    IF r->'review'->>'decision' IS DISTINCT FROM 'agent_supported'
     OR r->'review'->>'classification' IS DISTINCT FROM 'core_function'
     OR r->'review'->>'record_type' IS DISTINCT FROM 'expectation'
     OR (r->'review'->>'mandatory_requirement')::boolean IS DISTINCT FROM false
     OR upper(r->'native'->>'suppression') IN ('Y','YES','TRUE')
     OR upper(r->'native'->>'not_relevant') IN ('Y','YES','TRUE')
     OR NOT EXISTS(SELECT 1 FROM jsonb_array_elements(body->'overlay'->'eligible_record_proposals') e
      WHERE e->>'career_id'=career::text AND e->>'record_id'=r->'review'->>'record_id'
       AND e->>'competency_id'=r->'native'->>'competency_id') THEN
     RAISE EXCEPTION 'Ineligible reference record' USING ERRCODE='23514'; END IF;
   END IF;
  END LOOP;
  IF EXISTS(SELECT 1 FROM jsonb_array_elements_text(p->'eligible_records') id
    WHERE NOT EXISTS(SELECT 1 FROM jsonb_array_elements(p->'records') entry
      WHERE entry->'review'->>'record_id'=id)) THEN
   RAISE EXCEPTION 'Dangling eligible record' USING ERRCODE='23514'; END IF;
 END LOOP;
END $$;
REVOKE ALL ON FUNCTION asgard_catalog.validate_occupational_payload(jsonb) FROM PUBLIC;
COMMIT;
