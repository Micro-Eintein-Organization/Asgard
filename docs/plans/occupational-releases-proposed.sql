-- Proposed additive migration, verified in isolation; not in startup's migration set.
-- Move into versioned migrations with runtime integration, before reviewed activation.
BEGIN;
CREATE TABLE asgard_catalog.occupational_releases (
  id uuid PRIMARY KEY,
  sha256 text NOT NULL UNIQUE CHECK (sha256 ~ '^[0-9a-f]{64}$'),
  canonical_payload text NOT NULL,
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CHECK (coalesce(jsonb_typeof(payload->'profiles') = 'array',false)),
  CHECK (jsonb_array_length(payload->'profiles') = 12),
  CHECK (payload=canonical_payload::jsonb),
  CHECK (sha256=encode(sha256(convert_to(canonical_payload,'UTF8')),'hex'))
);

CREATE TABLE asgard_catalog.occupational_active_release (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  release_id uuid NOT NULL REFERENCES asgard_catalog.occupational_releases(id)
);

CREATE FUNCTION asgard_catalog.guard_occupational_release() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  RAISE EXCEPTION 'Occupational releases are immutable' USING ERRCODE = '23514';
END $$;
CREATE TRIGGER occupational_release_immutable
  BEFORE UPDATE OR DELETE ON asgard_catalog.occupational_releases
  FOR EACH ROW EXECUTE FUNCTION asgard_catalog.guard_occupational_release();

REVOKE ALL ON asgard_catalog.occupational_releases,
  asgard_catalog.occupational_active_release FROM PUBLIC, anon, authenticated, asgard_app;
GRANT SELECT ON asgard_catalog.occupational_releases,
  asgard_catalog.occupational_active_release TO asgard_app;
ALTER TABLE asgard_catalog.occupational_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE asgard_catalog.occupational_active_release ENABLE ROW LEVEL SECURITY;
CREATE POLICY occupational_active_read ON asgard_catalog.occupational_active_release
  FOR SELECT TO asgard_app USING (true);
CREATE POLICY occupational_release_read ON asgard_catalog.occupational_releases
  FOR SELECT TO asgard_app USING (EXISTS (
    SELECT 1 FROM asgard_catalog.occupational_active_release a WHERE a.release_id = id
  ));

CREATE FUNCTION asgard_catalog.validate_occupational_payload(body jsonb) RETURNS void
LANGUAGE plpgsql SET search_path='' AS $$
DECLARE p jsonb; r jsonb; field text; career uuid;
BEGIN
 IF jsonb_typeof(body->'sources') IS DISTINCT FROM 'array'
  OR jsonb_typeof(body->'overlay'->'eligible_record_proposals') IS DISTINCT FROM 'array'
  OR jsonb_typeof(body->'profiles') IS DISTINCT FROM 'array' THEN
  RAISE EXCEPTION 'Missing reference fields' USING ERRCODE='23514'; END IF;
 IF (SELECT count(DISTINCT x->'career'->>'career_id')
  FROM jsonb_array_elements(body->'profiles') x)<>12 THEN
  RAISE EXCEPTION 'Twelve distinct careers required' USING ERRCODE='23514'; END IF;
 FOR p IN SELECT value FROM jsonb_array_elements(body->'profiles') LOOP
  career:=(p->'career'->>'career_id')::uuid;
  IF NOT EXISTS(SELECT 1 FROM asgard_catalog.careers WHERE id=career AND status='published') THEN
   RAISE EXCEPTION 'Unknown published career' USING ERRCODE='23514'; END IF;
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
CREATE FUNCTION asgard_catalog.validate_occupational_insert() RETURNS trigger
LANGUAGE plpgsql SET search_path='' AS $$ BEGIN
 PERFORM asgard_catalog.validate_occupational_payload(NEW.payload); RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION asgard_catalog.validate_occupational_insert() FROM PUBLIC;
CREATE TRIGGER validate_occupational_snapshot BEFORE INSERT
 ON asgard_catalog.occupational_releases FOR EACH ROW
 EXECUTE FUNCTION asgard_catalog.validate_occupational_insert();
CREATE FUNCTION asgard_catalog.activate_occupational_release(target uuid) RETURNS void
LANGUAGE plpgsql SET search_path='' AS $$
DECLARE body jsonb;
BEGIN
 PERFORM pg_advisory_xact_lock(411,2);
 SELECT payload INTO STRICT body FROM asgard_catalog.occupational_releases WHERE id=target;
 PERFORM asgard_catalog.validate_occupational_payload(body);
 INSERT INTO asgard_catalog.occupational_active_release(singleton,release_id) VALUES(true,target)
  ON CONFLICT(singleton) DO UPDATE SET release_id=excluded.release_id;
END $$;
REVOKE ALL ON FUNCTION asgard_catalog.activate_occupational_release(uuid)
 FROM PUBLIC,anon,authenticated,asgard_app;

-- FOR SHARE needs privileges beyond SELECT; expose only this fixed pointer read/lock.
CREATE FUNCTION asgard_catalog.lock_occupational_release() RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE target uuid;
BEGIN
 PERFORM pg_advisory_xact_lock_shared(411,2);
 SELECT release_id INTO target FROM asgard_catalog.occupational_active_release
  WHERE singleton FOR SHARE;
 RETURN target;
END $$;
REVOKE ALL ON FUNCTION asgard_catalog.lock_occupational_release() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION asgard_catalog.lock_occupational_release() TO asgard_app;
COMMIT;
