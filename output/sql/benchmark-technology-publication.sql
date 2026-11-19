-- Owner approval: 2026-11-19 owner chat approval and separate technology vocabulary selection
-- Reviewer: YakisobaNissin
-- Preserves all existing learning-path skill records and links.
BEGIN;

SELECT pg_advisory_xact_lock(411, 4);
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='73513c38-7b43-5271-ab34-2f273f836d9d'::uuid OR canonical_key='benchmark-technology/fe1dd45c-ae96-5cff-8254-e0f4f7575a9b') AND
   (id<>'73513c38-7b43-5271-ab34-2f273f836d9d'::uuid OR canonical_key<>'benchmark-technology/fe1dd45c-ae96-5cff-8254-e0f4f7575a9b' OR label<>'ISO 27001'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('73513c38-7b43-5271-ab34-2f273f836d9d'::uuid,'benchmark-technology/fe1dd45c-ae96-5cff-8254-e0f4f7575a9b','ISO 27001','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='73513c38-7b43-5271-ab34-2f273f836d9d'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='031cbc80-49d4-596b-a803-76c2a0fd5e51'::uuid OR canonical_key='benchmark-technology/0988b1a0-6b0d-56b4-a653-33aa99f1129f') AND
   (id<>'031cbc80-49d4-596b-a803-76c2a0fd5e51'::uuid OR canonical_key<>'benchmark-technology/0988b1a0-6b0d-56b4-a653-33aa99f1129f' OR label<>'Vulnerability Management'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('031cbc80-49d4-596b-a803-76c2a0fd5e51'::uuid,'benchmark-technology/0988b1a0-6b0d-56b4-a653-33aa99f1129f','Vulnerability Management','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='031cbc80-49d4-596b-a803-76c2a0fd5e51'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='877033e2-8b2a-5b2f-a758-185ad77c0bf7'::uuid OR canonical_key='benchmark-technology/d60a4fd1-87b9-5da1-a0d6-894ad66a8711') AND
   (id<>'877033e2-8b2a-5b2f-a758-185ad77c0bf7'::uuid OR canonical_key<>'benchmark-technology/d60a4fd1-87b9-5da1-a0d6-894ad66a8711' OR label<>'Penetration Testing'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('877033e2-8b2a-5b2f-a758-185ad77c0bf7'::uuid,'benchmark-technology/d60a4fd1-87b9-5da1-a0d6-894ad66a8711','Penetration Testing','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='877033e2-8b2a-5b2f-a758-185ad77c0bf7'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='89312844-3c5b-5a77-8b56-5143fef42ab0'::uuid OR canonical_key='benchmark-technology/dd7261f1-4531-5376-9bee-2c5d473074e2') AND
   (id<>'89312844-3c5b-5a77-8b56-5143fef42ab0'::uuid OR canonical_key<>'benchmark-technology/dd7261f1-4531-5376-9bee-2c5d473074e2' OR label<>'Linux'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('89312844-3c5b-5a77-8b56-5143fef42ab0'::uuid,'benchmark-technology/dd7261f1-4531-5376-9bee-2c5d473074e2','Linux','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='89312844-3c5b-5a77-8b56-5143fef42ab0'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='a21b86ec-27dd-5052-8d00-8cb22ddd911f'::uuid OR canonical_key='benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d') AND
   (id<>'a21b86ec-27dd-5052-8d00-8cb22ddd911f'::uuid OR canonical_key<>'benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d' OR label<>'Python'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('a21b86ec-27dd-5052-8d00-8cb22ddd911f'::uuid,'benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d','Python','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='a21b86ec-27dd-5052-8d00-8cb22ddd911f'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='8cfb009e-0b06-53b8-8fd6-62492cd06f58'::uuid OR canonical_key='benchmark-technology/773ef2b5-601c-5fac-abd9-5e50a2349f71') AND
   (id<>'8cfb009e-0b06-53b8-8fd6-62492cd06f58'::uuid OR canonical_key<>'benchmark-technology/773ef2b5-601c-5fac-abd9-5e50a2349f71' OR label<>'Microsoft 365'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('8cfb009e-0b06-53b8-8fd6-62492cd06f58'::uuid,'benchmark-technology/773ef2b5-601c-5fac-abd9-5e50a2349f71','Microsoft 365','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='8cfb009e-0b06-53b8-8fd6-62492cd06f58'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='96207ebe-229e-5a92-96b2-19efe5869be3'::uuid OR canonical_key='benchmark-technology/98cac714-dc4f-5d8e-9368-b4d2f5033835') AND
   (id<>'96207ebe-229e-5a92-96b2-19efe5869be3'::uuid OR canonical_key<>'benchmark-technology/98cac714-dc4f-5d8e-9368-b4d2f5033835' OR label<>'Vulnerability Assessment'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('96207ebe-229e-5a92-96b2-19efe5869be3'::uuid,'benchmark-technology/98cac714-dc4f-5d8e-9368-b4d2f5033835','Vulnerability Assessment','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='96207ebe-229e-5a92-96b2-19efe5869be3'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='9a117fad-2098-50ae-ac23-f00e2d9d4ee8'::uuid OR canonical_key='benchmark-technology/25579676-9e77-5039-baca-19f1efd23455') AND
   (id<>'9a117fad-2098-50ae-ac23-f00e2d9d4ee8'::uuid OR canonical_key<>'benchmark-technology/25579676-9e77-5039-baca-19f1efd23455' OR label<>'OWASP Top 10'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('9a117fad-2098-50ae-ac23-f00e2d9d4ee8'::uuid,'benchmark-technology/25579676-9e77-5039-baca-19f1efd23455','OWASP Top 10','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='9a117fad-2098-50ae-ac23-f00e2d9d4ee8'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='6b501200-c77a-5d84-8e5b-64e8fae053b8'::uuid OR canonical_key='benchmark-technology/5baab1ed-24bb-59b6-8375-d4ac20be8d44') AND
   (id<>'6b501200-c77a-5d84-8e5b-64e8fae053b8'::uuid OR canonical_key<>'benchmark-technology/5baab1ed-24bb-59b6-8375-d4ac20be8d44' OR label<>'Security Testing'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('6b501200-c77a-5d84-8e5b-64e8fae053b8'::uuid,'benchmark-technology/5baab1ed-24bb-59b6-8375-d4ac20be8d44','Security Testing','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='6b501200-c77a-5d84-8e5b-64e8fae053b8'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='9241462f-b7d0-5bda-b6ae-b4de921bd9b1'::uuid OR canonical_key='benchmark-technology/9f644a14-8e75-5600-8a23-81c32d9f82aa') AND
   (id<>'9241462f-b7d0-5bda-b6ae-b4de921bd9b1'::uuid OR canonical_key<>'benchmark-technology/9f644a14-8e75-5600-8a23-81c32d9f82aa' OR label<>'Scripting'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('9241462f-b7d0-5bda-b6ae-b4de921bd9b1'::uuid,'benchmark-technology/9f644a14-8e75-5600-8a23-81c32d9f82aa','Scripting','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='9241462f-b7d0-5bda-b6ae-b4de921bd9b1'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='586f2f8b-ed94-569d-9b7b-f90ba19b02b2'::uuid OR canonical_key='benchmark-technology/e3ab3aca-bfa6-5da8-aa03-608606c5b92e') AND
   (id<>'586f2f8b-ed94-569d-9b7b-f90ba19b02b2'::uuid OR canonical_key<>'benchmark-technology/e3ab3aca-bfa6-5da8-aa03-608606c5b92e' OR label<>'Cloud Security'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('586f2f8b-ed94-569d-9b7b-f90ba19b02b2'::uuid,'benchmark-technology/e3ab3aca-bfa6-5da8-aa03-608606c5b92e','Cloud Security','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='586f2f8b-ed94-569d-9b7b-f90ba19b02b2'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='79badede-779f-545e-ac31-81b1f1f94f39'::uuid OR canonical_key='benchmark-technology/aeda3f31-1acb-5a5d-bab0-2674db85951b') AND
   (id<>'79badede-779f-545e-ac31-81b1f1f94f39'::uuid OR canonical_key<>'benchmark-technology/aeda3f31-1acb-5a5d-bab0-2674db85951b' OR label<>'Cisco Networking'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('79badede-779f-545e-ac31-81b1f1f94f39'::uuid,'benchmark-technology/aeda3f31-1acb-5a5d-bab0-2674db85951b','Cisco Networking','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='79badede-779f-545e-ac31-81b1f1f94f39'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='6c06e16d-0d4c-564f-a7c9-5aa898f16733'::uuid OR canonical_key='benchmark-technology/cb1d1a5d-3ba2-56ec-8c1e-d1d7fd179202') AND
   (id<>'6c06e16d-0d4c-564f-a7c9-5aa898f16733'::uuid OR canonical_key<>'benchmark-technology/cb1d1a5d-3ba2-56ec-8c1e-d1d7fd179202' OR label<>'Routing and Switching'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('6c06e16d-0d4c-564f-a7c9-5aa898f16733'::uuid,'benchmark-technology/cb1d1a5d-3ba2-56ec-8c1e-d1d7fd179202','Routing and Switching','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='6c06e16d-0d4c-564f-a7c9-5aa898f16733'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='3812e539-9abd-51cf-a0c9-d42526c04db6'::uuid OR canonical_key='benchmark-technology/4d559fb4-41db-5f39-aaf6-b952dfbefce1') AND
   (id<>'3812e539-9abd-51cf-a0c9-d42526c04db6'::uuid OR canonical_key<>'benchmark-technology/4d559fb4-41db-5f39-aaf6-b952dfbefce1' OR label<>'VLAN'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('3812e539-9abd-51cf-a0c9-d42526c04db6'::uuid,'benchmark-technology/4d559fb4-41db-5f39-aaf6-b952dfbefce1','VLAN','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='3812e539-9abd-51cf-a0c9-d42526c04db6'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='dc656cc9-cc18-5693-929b-e67e0e2b787c'::uuid OR canonical_key='benchmark-technology/a0335f3f-9e83-5ce0-8d0f-4a4421ce7d2b') AND
   (id<>'dc656cc9-cc18-5693-929b-e67e0e2b787c'::uuid OR canonical_key<>'benchmark-technology/a0335f3f-9e83-5ce0-8d0f-4a4421ce7d2b' OR label<>'OSPF'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('dc656cc9-cc18-5693-929b-e67e0e2b787c'::uuid,'benchmark-technology/a0335f3f-9e83-5ce0-8d0f-4a4421ce7d2b','OSPF','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='dc656cc9-cc18-5693-929b-e67e0e2b787c'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='e47d297d-3588-5e6c-864d-53a63bee04ef'::uuid OR canonical_key='benchmark-technology/f6ca09ae-4d9d-550e-a7e4-44208f108194') AND
   (id<>'e47d297d-3588-5e6c-864d-53a63bee04ef'::uuid OR canonical_key<>'benchmark-technology/f6ca09ae-4d9d-550e-a7e4-44208f108194' OR label<>'BGP'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('e47d297d-3588-5e6c-864d-53a63bee04ef'::uuid,'benchmark-technology/f6ca09ae-4d9d-550e-a7e4-44208f108194','BGP','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='e47d297d-3588-5e6c-864d-53a63bee04ef'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='46f8d808-d2ad-5219-8aa6-6e1d9e817ad1'::uuid OR canonical_key='benchmark-technology/ef8aa0f9-f68f-5ef8-b7e6-5a0c3bba824a') AND
   (id<>'46f8d808-d2ad-5219-8aa6-6e1d9e817ad1'::uuid OR canonical_key<>'benchmark-technology/ef8aa0f9-f68f-5ef8-b7e6-5a0c3bba824a' OR label<>'Cisco Firewalls'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('46f8d808-d2ad-5219-8aa6-6e1d9e817ad1'::uuid,'benchmark-technology/ef8aa0f9-f68f-5ef8-b7e6-5a0c3bba824a','Cisco Firewalls','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='46f8d808-d2ad-5219-8aa6-6e1d9e817ad1'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='33f92755-fd7d-5afa-91c3-32316b20c851'::uuid OR canonical_key='benchmark-technology/9fb24cc9-6254-5539-a492-24a1f7494c63') AND
   (id<>'33f92755-fd7d-5afa-91c3-32316b20c851'::uuid OR canonical_key<>'benchmark-technology/9fb24cc9-6254-5539-a492-24a1f7494c63' OR label<>'VPN'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('33f92755-fd7d-5afa-91c3-32316b20c851'::uuid,'benchmark-technology/9fb24cc9-6254-5539-a492-24a1f7494c63','VPN','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='33f92755-fd7d-5afa-91c3-32316b20c851'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='0762774a-7dc3-5143-880c-77b0136f0c46'::uuid OR canonical_key='benchmark-technology/0220c67d-1683-57d6-8dbd-6280e6f6ce95') AND
   (id<>'0762774a-7dc3-5143-880c-77b0136f0c46'::uuid OR canonical_key<>'benchmark-technology/0220c67d-1683-57d6-8dbd-6280e6f6ce95' OR label<>'Network Security'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('0762774a-7dc3-5143-880c-77b0136f0c46'::uuid,'benchmark-technology/0220c67d-1683-57d6-8dbd-6280e6f6ce95','Network Security','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='0762774a-7dc3-5143-880c-77b0136f0c46'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='8557c733-ee47-5406-a17c-2ef15601b0a2'::uuid OR canonical_key='benchmark-technology/3b3e082d-616b-5423-b54d-197887b82a9c') AND
   (id<>'8557c733-ee47-5406-a17c-2ef15601b0a2'::uuid OR canonical_key<>'benchmark-technology/3b3e082d-616b-5423-b54d-197887b82a9c' OR label<>'SolarWinds'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('8557c733-ee47-5406-a17c-2ef15601b0a2'::uuid,'benchmark-technology/3b3e082d-616b-5423-b54d-197887b82a9c','SolarWinds','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='8557c733-ee47-5406-a17c-2ef15601b0a2'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='311cd6da-35d5-5524-9812-fb1f7f1de3cc'::uuid OR canonical_key='benchmark-technology/f5fa4836-4f79-51fc-9a0b-f4b70c12e16b') AND
   (id<>'311cd6da-35d5-5524-9812-fb1f7f1de3cc'::uuid OR canonical_key<>'benchmark-technology/f5fa4836-4f79-51fc-9a0b-f4b70c12e16b' OR label<>'ServiceNow'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('311cd6da-35d5-5524-9812-fb1f7f1de3cc'::uuid,'benchmark-technology/f5fa4836-4f79-51fc-9a0b-f4b70c12e16b','ServiceNow','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='311cd6da-35d5-5524-9812-fb1f7f1de3cc'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='3405ab8d-bdeb-5c04-ae3b-e2e330dbc42d'::uuid OR canonical_key='benchmark-technology/86c89d95-1605-5db2-a8d1-b3c2f4b27a4a') AND
   (id<>'3405ab8d-bdeb-5c04-ae3b-e2e330dbc42d'::uuid OR canonical_key<>'benchmark-technology/86c89d95-1605-5db2-a8d1-b3c2f4b27a4a' OR label<>'TCP/IP'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('3405ab8d-bdeb-5c04-ae3b-e2e330dbc42d'::uuid,'benchmark-technology/86c89d95-1605-5db2-a8d1-b3c2f4b27a4a','TCP/IP','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='3405ab8d-bdeb-5c04-ae3b-e2e330dbc42d'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='46c5cdbd-a3c8-5e66-a131-469e96c17a15'::uuid OR canonical_key='benchmark-technology/acbe996d-d3d8-5c5e-b72a-64cfbc1fd3cf') AND
   (id<>'46c5cdbd-a3c8-5e66-a131-469e96c17a15'::uuid OR canonical_key<>'benchmark-technology/acbe996d-d3d8-5c5e-b72a-64cfbc1fd3cf' OR label<>'DNS'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('46c5cdbd-a3c8-5e66-a131-469e96c17a15'::uuid,'benchmark-technology/acbe996d-d3d8-5c5e-b72a-64cfbc1fd3cf','DNS','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='46c5cdbd-a3c8-5e66-a131-469e96c17a15'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='ec65399e-2af2-54de-a477-fbec97ff1c63'::uuid OR canonical_key='benchmark-technology/e607b1f9-0a8e-504a-a86e-6b700c40af40') AND
   (id<>'ec65399e-2af2-54de-a477-fbec97ff1c63'::uuid OR canonical_key<>'benchmark-technology/e607b1f9-0a8e-504a-a86e-6b700c40af40' OR label<>'DHCP'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('ec65399e-2af2-54de-a477-fbec97ff1c63'::uuid,'benchmark-technology/e607b1f9-0a8e-504a-a86e-6b700c40af40','DHCP','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='ec65399e-2af2-54de-a477-fbec97ff1c63'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='48d61850-d325-5051-b94d-8e948e454c77'::uuid OR canonical_key='benchmark-technology/be93acfc-7fbf-5b76-b207-ac01ae98425b') AND
   (id<>'48d61850-d325-5051-b94d-8e948e454c77'::uuid OR canonical_key<>'benchmark-technology/be93acfc-7fbf-5b76-b207-ac01ae98425b' OR label<>'Network Monitoring'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('48d61850-d325-5051-b94d-8e948e454c77'::uuid,'benchmark-technology/be93acfc-7fbf-5b76-b207-ac01ae98425b','Network Monitoring','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='48d61850-d325-5051-b94d-8e948e454c77'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='eba1fe18-96aa-5fec-a085-c245b50e8e47'::uuid OR canonical_key='benchmark-technology/275269a6-bfac-5e6d-b4d5-56d62c18a670') AND
   (id<>'eba1fe18-96aa-5fec-a085-c245b50e8e47'::uuid OR canonical_key<>'benchmark-technology/275269a6-bfac-5e6d-b4d5-56d62c18a670' OR label<>'Windows Server'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('eba1fe18-96aa-5fec-a085-c245b50e8e47'::uuid,'benchmark-technology/275269a6-bfac-5e6d-b4d5-56d62c18a670','Windows Server','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='eba1fe18-96aa-5fec-a085-c245b50e8e47'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='02669ca1-b1ad-5e40-bff0-31f403d5bb88'::uuid OR canonical_key='benchmark-technology/1f3dd628-5803-5e87-8fdf-daaeb9fd5d2c') AND
   (id<>'02669ca1-b1ad-5e40-bff0-31f403d5bb88'::uuid OR canonical_key<>'benchmark-technology/1f3dd628-5803-5e87-8fdf-daaeb9fd5d2c' OR label<>'Networking'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('02669ca1-b1ad-5e40-bff0-31f403d5bb88'::uuid,'benchmark-technology/1f3dd628-5803-5e87-8fdf-daaeb9fd5d2c','Networking','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='02669ca1-b1ad-5e40-bff0-31f403d5bb88'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='2a5b13c1-3055-5c2d-bb8f-a5d27f45c142'::uuid OR canonical_key='benchmark-technology/9114466d-51e4-5ba2-a526-3b73bee23c35') AND
   (id<>'2a5b13c1-3055-5c2d-bb8f-a5d27f45c142'::uuid OR canonical_key<>'benchmark-technology/9114466d-51e4-5ba2-a526-3b73bee23c35' OR label<>'Jenkins'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('2a5b13c1-3055-5c2d-bb8f-a5d27f45c142'::uuid,'benchmark-technology/9114466d-51e4-5ba2-a526-3b73bee23c35','Jenkins','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='2a5b13c1-3055-5c2d-bb8f-a5d27f45c142'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='7be62c32-93f8-5183-8a00-b4f7fbe2ea5f'::uuid OR canonical_key='benchmark-technology/eddcc0a5-b4b4-57f0-bcbc-bc841b43ca7f') AND
   (id<>'7be62c32-93f8-5183-8a00-b4f7fbe2ea5f'::uuid OR canonical_key<>'benchmark-technology/eddcc0a5-b4b4-57f0-bcbc-bc841b43ca7f' OR label<>'CI/CD'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('7be62c32-93f8-5183-8a00-b4f7fbe2ea5f'::uuid,'benchmark-technology/eddcc0a5-b4b4-57f0-bcbc-bc841b43ca7f','CI/CD','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='7be62c32-93f8-5183-8a00-b4f7fbe2ea5f'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='8f9cf2dd-bfe1-5b3b-a38f-819cb9cb79ca'::uuid OR canonical_key='benchmark-technology/1894a26d-5eab-5d34-abd3-a475fa3f1b97') AND
   (id<>'8f9cf2dd-bfe1-5b3b-a38f-819cb9cb79ca'::uuid OR canonical_key<>'benchmark-technology/1894a26d-5eab-5d34-abd3-a475fa3f1b97' OR label<>'Bash'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('8f9cf2dd-bfe1-5b3b-a38f-819cb9cb79ca'::uuid,'benchmark-technology/1894a26d-5eab-5d34-abd3-a475fa3f1b97','Bash','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='8f9cf2dd-bfe1-5b3b-a38f-819cb9cb79ca'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='e5040f19-52b7-559c-8a9a-82b8f8d66a86'::uuid OR canonical_key='benchmark-technology/6f78319d-0781-59c6-ac9c-e1532ebc8ffb') AND
   (id<>'e5040f19-52b7-559c-8a9a-82b8f8d66a86'::uuid OR canonical_key<>'benchmark-technology/6f78319d-0781-59c6-ac9c-e1532ebc8ffb' OR label<>'Cloud Infrastructure'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('e5040f19-52b7-559c-8a9a-82b8f8d66a86'::uuid,'benchmark-technology/6f78319d-0781-59c6-ac9c-e1532ebc8ffb','Cloud Infrastructure','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='e5040f19-52b7-559c-8a9a-82b8f8d66a86'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='f119c3e7-e9a8-549d-af31-805ab246ca23'::uuid OR canonical_key='benchmark-technology/6d15c51b-daa4-51fb-8fb8-97546675c319') AND
   (id<>'f119c3e7-e9a8-549d-af31-805ab246ca23'::uuid OR canonical_key<>'benchmark-technology/6d15c51b-daa4-51fb-8fb8-97546675c319' OR label<>'Terraform'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('f119c3e7-e9a8-549d-af31-805ab246ca23'::uuid,'benchmark-technology/6d15c51b-daa4-51fb-8fb8-97546675c319','Terraform','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='f119c3e7-e9a8-549d-af31-805ab246ca23'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='4a389ba5-11b3-5b07-989d-7dc4df9f1ef6'::uuid OR canonical_key='benchmark-technology/ec0aa230-fca3-5863-9029-d8628e8d86db') AND
   (id<>'4a389ba5-11b3-5b07-989d-7dc4df9f1ef6'::uuid OR canonical_key<>'benchmark-technology/ec0aa230-fca3-5863-9029-d8628e8d86db' OR label<>'Kubernetes'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('4a389ba5-11b3-5b07-989d-7dc4df9f1ef6'::uuid,'benchmark-technology/ec0aa230-fca3-5863-9029-d8628e8d86db','Kubernetes','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='4a389ba5-11b3-5b07-989d-7dc4df9f1ef6'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='4bca9a39-e646-5562-b77b-d60c3624a909'::uuid OR canonical_key='benchmark-technology/30a7354e-bcd7-510f-a3ec-cae5bf4e0302') AND
   (id<>'4bca9a39-e646-5562-b77b-d60c3624a909'::uuid OR canonical_key<>'benchmark-technology/30a7354e-bcd7-510f-a3ec-cae5bf4e0302' OR label<>'AWS'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('4bca9a39-e646-5562-b77b-d60c3624a909'::uuid,'benchmark-technology/30a7354e-bcd7-510f-a3ec-cae5bf4e0302','AWS','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='4bca9a39-e646-5562-b77b-d60c3624a909'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='6918f0b2-4ac8-5c5f-a7b4-9e22dcd9cf9b'::uuid OR canonical_key='benchmark-technology/2ff23fbf-9e19-5985-b55a-8ff0c0004be5') AND
   (id<>'6918f0b2-4ac8-5c5f-a7b4-9e22dcd9cf9b'::uuid OR canonical_key<>'benchmark-technology/2ff23fbf-9e19-5985-b55a-8ff0c0004be5' OR label<>'GCP'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('6918f0b2-4ac8-5c5f-a7b4-9e22dcd9cf9b'::uuid,'benchmark-technology/2ff23fbf-9e19-5985-b55a-8ff0c0004be5','GCP','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='6918f0b2-4ac8-5c5f-a7b4-9e22dcd9cf9b'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='81c07f1e-6aa9-5735-b3f0-9bcb28f4557a'::uuid OR canonical_key='benchmark-technology/724f1cf6-cbf5-5cce-9aa3-03fe7079e10b') AND
   (id<>'81c07f1e-6aa9-5735-b3f0-9bcb28f4557a'::uuid OR canonical_key<>'benchmark-technology/724f1cf6-cbf5-5cce-9aa3-03fe7079e10b' OR label<>'Infrastructure as Code'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('81c07f1e-6aa9-5735-b3f0-9bcb28f4557a'::uuid,'benchmark-technology/724f1cf6-cbf5-5cce-9aa3-03fe7079e10b','Infrastructure as Code','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='81c07f1e-6aa9-5735-b3f0-9bcb28f4557a'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='94c26596-83a4-5187-898a-032a4fa2e5c7'::uuid OR canonical_key='benchmark-technology/1513447c-e4e9-5b10-bc04-36f9b8ab702b') AND
   (id<>'94c26596-83a4-5187-898a-032a4fa2e5c7'::uuid OR canonical_key<>'benchmark-technology/1513447c-e4e9-5b10-bc04-36f9b8ab702b' OR label<>'Docker'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('94c26596-83a4-5187-898a-032a4fa2e5c7'::uuid,'benchmark-technology/1513447c-e4e9-5b10-bc04-36f9b8ab702b','Docker','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='94c26596-83a4-5187-898a-032a4fa2e5c7'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='723e7b7e-59b5-55cc-9deb-14c55b77cc74'::uuid OR canonical_key='benchmark-technology/2ca6d403-37f9-5c1c-9e9d-d28d92660982') AND
   (id<>'723e7b7e-59b5-55cc-9deb-14c55b77cc74'::uuid OR canonical_key<>'benchmark-technology/2ca6d403-37f9-5c1c-9e9d-d28d92660982' OR label<>'Monitoring'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('723e7b7e-59b5-55cc-9deb-14c55b77cc74'::uuid,'benchmark-technology/2ca6d403-37f9-5c1c-9e9d-d28d92660982','Monitoring','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='723e7b7e-59b5-55cc-9deb-14c55b77cc74'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='f6649a94-3b8b-574f-9df7-1a22c6e410f3'::uuid OR canonical_key='benchmark-technology/bfc31ea8-5cd0-5a70-9a1e-39422a5a06c9') AND
   (id<>'f6649a94-3b8b-574f-9df7-1a22c6e410f3'::uuid OR canonical_key<>'benchmark-technology/bfc31ea8-5cd0-5a70-9a1e-39422a5a06c9' OR label<>'Data Collection'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('f6649a94-3b8b-574f-9df7-1a22c6e410f3'::uuid,'benchmark-technology/bfc31ea8-5cd0-5a70-9a1e-39422a5a06c9','Data Collection','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='f6649a94-3b8b-574f-9df7-1a22c6e410f3'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='3ef96afe-0397-546d-9199-e27059cd85d0'::uuid OR canonical_key='benchmark-technology/61264cb0-7dd5-5650-9956-c67164338ba8') AND
   (id<>'3ef96afe-0397-546d-9199-e27059cd85d0'::uuid OR canonical_key<>'benchmark-technology/61264cb0-7dd5-5650-9956-c67164338ba8' OR label<>'Data Validation'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('3ef96afe-0397-546d-9199-e27059cd85d0'::uuid,'benchmark-technology/61264cb0-7dd5-5650-9956-c67164338ba8','Data Validation','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='3ef96afe-0397-546d-9199-e27059cd85d0'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='6673223b-ddf5-5b33-9239-2d95483e3773'::uuid OR canonical_key='benchmark-technology/4459f154-4794-5a1d-a6e0-be59feef910a') AND
   (id<>'6673223b-ddf5-5b33-9239-2d95483e3773'::uuid OR canonical_key<>'benchmark-technology/4459f154-4794-5a1d-a6e0-be59feef910a' OR label<>'Data Analysis'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('6673223b-ddf5-5b33-9239-2d95483e3773'::uuid,'benchmark-technology/4459f154-4794-5a1d-a6e0-be59feef910a','Data Analysis','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='6673223b-ddf5-5b33-9239-2d95483e3773'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='b76c36da-4dc8-5c47-aa18-58e6fb23bb0a'::uuid OR canonical_key='benchmark-technology/ece87f9e-8e39-5183-965e-23b8ba314fd3') AND
   (id<>'b76c36da-4dc8-5c47-aa18-58e6fb23bb0a'::uuid OR canonical_key<>'benchmark-technology/ece87f9e-8e39-5183-965e-23b8ba314fd3' OR label<>'Root Cause Analysis'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('b76c36da-4dc8-5c47-aa18-58e6fb23bb0a'::uuid,'benchmark-technology/ece87f9e-8e39-5183-965e-23b8ba314fd3','Root Cause Analysis','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='b76c36da-4dc8-5c47-aa18-58e6fb23bb0a'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='8b05cadd-64de-5f56-a6b1-e9753b681bc2'::uuid OR canonical_key='benchmark-technology/df3f037c-c6e1-5b12-b7ed-f1fa91be621e') AND
   (id<>'8b05cadd-64de-5f56-a6b1-e9753b681bc2'::uuid OR canonical_key<>'benchmark-technology/df3f037c-c6e1-5b12-b7ed-f1fa91be621e' OR label<>'MS Office'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('8b05cadd-64de-5f56-a6b1-e9753b681bc2'::uuid,'benchmark-technology/df3f037c-c6e1-5b12-b7ed-f1fa91be621e','MS Office','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='8b05cadd-64de-5f56-a6b1-e9753b681bc2'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='0db068d0-4103-59ef-9b68-166d74a5f3ba'::uuid OR canonical_key='benchmark-technology/f02aed85-3ddb-5ded-b34e-a96bc7781177') AND
   (id<>'0db068d0-4103-59ef-9b68-166d74a5f3ba'::uuid OR canonical_key<>'benchmark-technology/f02aed85-3ddb-5ded-b34e-a96bc7781177' OR label<>'Data Quality'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('0db068d0-4103-59ef-9b68-166d74a5f3ba'::uuid,'benchmark-technology/f02aed85-3ddb-5ded-b34e-a96bc7781177','Data Quality','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='0db068d0-4103-59ef-9b68-166d74a5f3ba'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='22ce239b-1228-51d3-8222-b3f01e228224'::uuid OR canonical_key='benchmark-technology/b71a600e-0f56-533a-a21a-7a97661fda3a') AND
   (id<>'22ce239b-1228-51d3-8222-b3f01e228224'::uuid OR canonical_key<>'benchmark-technology/b71a600e-0f56-533a-a21a-7a97661fda3a' OR label<>'Excel'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('22ce239b-1228-51d3-8222-b3f01e228224'::uuid,'benchmark-technology/b71a600e-0f56-533a-a21a-7a97661fda3a','Excel','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='22ce239b-1228-51d3-8222-b3f01e228224'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='2ac81ac0-ee31-5507-9a8f-e4708c46bc22'::uuid OR canonical_key='benchmark-technology/e0f7a7f7-7940-5da4-a136-2afc4037db54') AND
   (id<>'2ac81ac0-ee31-5507-9a8f-e4708c46bc22'::uuid OR canonical_key<>'benchmark-technology/e0f7a7f7-7940-5da4-a136-2afc4037db54' OR label<>'Pricing Analysis'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('2ac81ac0-ee31-5507-9a8f-e4708c46bc22'::uuid,'benchmark-technology/e0f7a7f7-7940-5da4-a136-2afc4037db54','Pricing Analysis','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='2ac81ac0-ee31-5507-9a8f-e4708c46bc22'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='57b21f70-3f36-587e-9c48-fcde514c9d3c'::uuid OR canonical_key='benchmark-technology/bf9a8743-40df-5622-afae-833de0d53651') AND
   (id<>'57b21f70-3f36-587e-9c48-fcde514c9d3c'::uuid OR canonical_key<>'benchmark-technology/bf9a8743-40df-5622-afae-833de0d53651' OR label<>'ERP'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('57b21f70-3f36-587e-9c48-fcde514c9d3c'::uuid,'benchmark-technology/bf9a8743-40df-5622-afae-833de0d53651','ERP','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='57b21f70-3f36-587e-9c48-fcde514c9d3c'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='0702da7b-1629-5dbc-9ca8-35eedbdc4403'::uuid OR canonical_key='benchmark-technology/c904898e-08f4-5b07-8ed2-224708de7e47') AND
   (id<>'0702da7b-1629-5dbc-9ca8-35eedbdc4403'::uuid OR canonical_key<>'benchmark-technology/c904898e-08f4-5b07-8ed2-224708de7e47' OR label<>'Data Auditing'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('0702da7b-1629-5dbc-9ca8-35eedbdc4403'::uuid,'benchmark-technology/c904898e-08f4-5b07-8ed2-224708de7e47','Data Auditing','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='0702da7b-1629-5dbc-9ca8-35eedbdc4403'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='88a1c37f-fa0b-5d67-b87e-5942b56c9966'::uuid OR canonical_key='benchmark-technology/6f9ad0cb-b868-5a4b-bbeb-77a0158c1795') AND
   (id<>'88a1c37f-fa0b-5d67-b87e-5942b56c9966'::uuid OR canonical_key<>'benchmark-technology/6f9ad0cb-b868-5a4b-bbeb-77a0158c1795' OR label<>'Reporting'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('88a1c37f-fa0b-5d67-b87e-5942b56c9966'::uuid,'benchmark-technology/6f9ad0cb-b868-5a4b-bbeb-77a0158c1795','Reporting','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='88a1c37f-fa0b-5d67-b87e-5942b56c9966'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='31291888-b848-5153-884c-8fbaa619060e'::uuid OR canonical_key='benchmark-technology/9451272d-a996-54fa-a3db-118551abb542') AND
   (id<>'31291888-b848-5153-884c-8fbaa619060e'::uuid OR canonical_key<>'benchmark-technology/9451272d-a996-54fa-a3db-118551abb542' OR label<>'Margin Analysis'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('31291888-b848-5153-884c-8fbaa619060e'::uuid,'benchmark-technology/9451272d-a996-54fa-a3db-118551abb542','Margin Analysis','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='31291888-b848-5153-884c-8fbaa619060e'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='0d9d3d95-0be3-50fb-be44-384d350e5b08'::uuid OR canonical_key='benchmark-technology/e41a2620-39fe-5250-9d48-4235fdffdcab') AND
   (id<>'0d9d3d95-0be3-50fb-be44-384d350e5b08'::uuid OR canonical_key<>'benchmark-technology/e41a2620-39fe-5250-9d48-4235fdffdcab' OR label<>'SQL'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('0d9d3d95-0be3-50fb-be44-384d350e5b08'::uuid,'benchmark-technology/e41a2620-39fe-5250-9d48-4235fdffdcab','SQL','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='0d9d3d95-0be3-50fb-be44-384d350e5b08'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='48730e5f-0df2-5cbd-96bc-677041a79667'::uuid OR canonical_key='benchmark-technology/9b2e4783-4055-5310-8a75-72b2dc64ca12') AND
   (id<>'48730e5f-0df2-5cbd-96bc-677041a79667'::uuid OR canonical_key<>'benchmark-technology/9b2e4783-4055-5310-8a75-72b2dc64ca12' OR label<>'Power BI'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('48730e5f-0df2-5cbd-96bc-677041a79667'::uuid,'benchmark-technology/9b2e4783-4055-5310-8a75-72b2dc64ca12','Power BI','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='48730e5f-0df2-5cbd-96bc-677041a79667'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='55eb04a5-d235-55fd-93cd-4f330be4854d'::uuid OR canonical_key='benchmark-technology/6877ba8f-b710-5c0c-a2d6-9ec3ac325618') AND
   (id<>'55eb04a5-d235-55fd-93cd-4f330be4854d'::uuid OR canonical_key<>'benchmark-technology/6877ba8f-b710-5c0c-a2d6-9ec3ac325618' OR label<>'Dashboard Development'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('55eb04a5-d235-55fd-93cd-4f330be4854d'::uuid,'benchmark-technology/6877ba8f-b710-5c0c-a2d6-9ec3ac325618','Dashboard Development','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='55eb04a5-d235-55fd-93cd-4f330be4854d'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='6c2aed79-f376-5729-8dcd-73cb568c663f'::uuid OR canonical_key='benchmark-technology/73be98ee-8172-52fa-b0b1-b4c3d4f4c287') AND
   (id<>'6c2aed79-f376-5729-8dcd-73cb568c663f'::uuid OR canonical_key<>'benchmark-technology/73be98ee-8172-52fa-b0b1-b4c3d4f4c287' OR label<>'Data Reporting'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('6c2aed79-f376-5729-8dcd-73cb568c663f'::uuid,'benchmark-technology/73be98ee-8172-52fa-b0b1-b4c3d4f4c287','Data Reporting','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='6c2aed79-f376-5729-8dcd-73cb568c663f'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='00c7438c-dcc6-5615-95a9-4741c3e2e307'::uuid OR canonical_key='benchmark-technology/015c2b95-2088-56ec-b098-d19898427752') AND
   (id<>'00c7438c-dcc6-5615-95a9-4741c3e2e307'::uuid OR canonical_key<>'benchmark-technology/015c2b95-2088-56ec-b098-d19898427752' OR label<>'Process Improvement'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('00c7438c-dcc6-5615-95a9-4741c3e2e307'::uuid,'benchmark-technology/015c2b95-2088-56ec-b098-d19898427752','Process Improvement','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='00c7438c-dcc6-5615-95a9-4741c3e2e307'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='2ed2a48b-a7eb-50ee-937d-018824d6fac5'::uuid OR canonical_key='benchmark-technology/6262f1f9-9ccd-52d7-8ae7-7fc73ae08354') AND
   (id<>'2ed2a48b-a7eb-50ee-937d-018824d6fac5'::uuid OR canonical_key<>'benchmark-technology/6262f1f9-9ccd-52d7-8ae7-7fc73ae08354' OR label<>'Data Interpretation'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('2ed2a48b-a7eb-50ee-937d-018824d6fac5'::uuid,'benchmark-technology/6262f1f9-9ccd-52d7-8ae7-7fc73ae08354','Data Interpretation','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='2ed2a48b-a7eb-50ee-937d-018824d6fac5'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='85e01c30-e307-5d70-801d-4996c2bf9b58'::uuid OR canonical_key='benchmark-technology/78380cd0-89ef-54a0-b12f-27dafb1b6bf0') AND
   (id<>'85e01c30-e307-5d70-801d-4996c2bf9b58'::uuid OR canonical_key<>'benchmark-technology/78380cd0-89ef-54a0-b12f-27dafb1b6bf0' OR label<>'ETL/ELT'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('85e01c30-e307-5d70-801d-4996c2bf9b58'::uuid,'benchmark-technology/78380cd0-89ef-54a0-b12f-27dafb1b6bf0','ETL/ELT','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='85e01c30-e307-5d70-801d-4996c2bf9b58'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='a9b403ac-ec44-5848-a589-ac56db7aa13f'::uuid OR canonical_key='benchmark-technology/cfdce0b2-a1e4-5166-aa51-895c550a06a1') AND
   (id<>'a9b403ac-ec44-5848-a589-ac56db7aa13f'::uuid OR canonical_key<>'benchmark-technology/cfdce0b2-a1e4-5166-aa51-895c550a06a1' OR label<>'Data Pipelines'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('a9b403ac-ec44-5848-a589-ac56db7aa13f'::uuid,'benchmark-technology/cfdce0b2-a1e4-5166-aa51-895c550a06a1','Data Pipelines','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='a9b403ac-ec44-5848-a589-ac56db7aa13f'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='6608a314-3435-560b-9dfb-bd96654dcbdb'::uuid OR canonical_key='benchmark-technology/a8aa8acd-8d45-5138-a046-e5c0c38dfb55') AND
   (id<>'6608a314-3435-560b-9dfb-bd96654dcbdb'::uuid OR canonical_key<>'benchmark-technology/a8aa8acd-8d45-5138-a046-e5c0c38dfb55' OR label<>'Google Cloud'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('6608a314-3435-560b-9dfb-bd96654dcbdb'::uuid,'benchmark-technology/a8aa8acd-8d45-5138-a046-e5c0c38dfb55','Google Cloud','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='6608a314-3435-560b-9dfb-bd96654dcbdb'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='930dc1ac-af28-5c28-b476-a6bda720513e'::uuid OR canonical_key='benchmark-technology/27a295ae-fa71-5811-944d-7f0fcbbea2de') AND
   (id<>'930dc1ac-af28-5c28-b476-a6bda720513e'::uuid OR canonical_key<>'benchmark-technology/27a295ae-fa71-5811-944d-7f0fcbbea2de' OR label<>'Git'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('930dc1ac-af28-5c28-b476-a6bda720513e'::uuid,'benchmark-technology/27a295ae-fa71-5811-944d-7f0fcbbea2de','Git','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='930dc1ac-af28-5c28-b476-a6bda720513e'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='618963ad-5091-544e-841a-f91e3db286fe'::uuid OR canonical_key='benchmark-technology/740d8b16-14a7-5a1c-a05a-ca999a55a3dc') AND
   (id<>'618963ad-5091-544e-841a-f91e3db286fe'::uuid OR canonical_key<>'benchmark-technology/740d8b16-14a7-5a1c-a05a-ca999a55a3dc' OR label<>'Airflow'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('618963ad-5091-544e-841a-f91e3db286fe'::uuid,'benchmark-technology/740d8b16-14a7-5a1c-a05a-ca999a55a3dc','Airflow','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='618963ad-5091-544e-841a-f91e3db286fe'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='15d597d8-a2cb-5675-9a8c-9caf3a89d8a0'::uuid OR canonical_key='benchmark-technology/9482e3df-984d-52fa-aa35-9cb37f55ed1b') AND
   (id<>'15d597d8-a2cb-5675-9a8c-9caf3a89d8a0'::uuid OR canonical_key<>'benchmark-technology/9482e3df-984d-52fa-aa35-9cb37f55ed1b' OR label<>'Data Integration'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('15d597d8-a2cb-5675-9a8c-9caf3a89d8a0'::uuid,'benchmark-technology/9482e3df-984d-52fa-aa35-9cb37f55ed1b','Data Integration','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='15d597d8-a2cb-5675-9a8c-9caf3a89d8a0'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='a94769dd-8ccc-5f0c-9b81-9cab313ada3b'::uuid OR canonical_key='benchmark-technology/6534bb89-90b6-5f35-bacf-08a13872efcb') AND
   (id<>'a94769dd-8ccc-5f0c-9b81-9cab313ada3b'::uuid OR canonical_key<>'benchmark-technology/6534bb89-90b6-5f35-bacf-08a13872efcb' OR label<>'Data Warehousing'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('a94769dd-8ccc-5f0c-9b81-9cab313ada3b'::uuid,'benchmark-technology/6534bb89-90b6-5f35-bacf-08a13872efcb','Data Warehousing','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='a94769dd-8ccc-5f0c-9b81-9cab313ada3b'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='23bc3914-8003-5ee7-83f4-981471dba343'::uuid OR canonical_key='benchmark-technology/7bd220f2-5ac2-5242-8f6a-dfbe392cceb4') AND
   (id<>'23bc3914-8003-5ee7-83f4-981471dba343'::uuid OR canonical_key<>'benchmark-technology/7bd220f2-5ac2-5242-8f6a-dfbe392cceb4' OR label<>'Apache Airflow'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('23bc3914-8003-5ee7-83f4-981471dba343'::uuid,'benchmark-technology/7bd220f2-5ac2-5242-8f6a-dfbe392cceb4','Apache Airflow','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='23bc3914-8003-5ee7-83f4-981471dba343'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='a1e6b5f9-8721-599b-b1c4-51ecd0f05cb3'::uuid OR canonical_key='benchmark-technology/c5c71509-7144-5d99-bd10-1681b42c4283') AND
   (id<>'a1e6b5f9-8721-599b-b1c4-51ecd0f05cb3'::uuid OR canonical_key<>'benchmark-technology/c5c71509-7144-5d99-bd10-1681b42c4283' OR label<>'Machine Learning'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('a1e6b5f9-8721-599b-b1c4-51ecd0f05cb3'::uuid,'benchmark-technology/c5c71509-7144-5d99-bd10-1681b42c4283','Machine Learning','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='a1e6b5f9-8721-599b-b1c4-51ecd0f05cb3'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='057d42ca-671e-503f-a079-cb2aa4f81110'::uuid OR canonical_key='benchmark-technology/c2e6e967-6077-5054-aef5-ae59b60eb1c4') AND
   (id<>'057d42ca-671e-503f-a079-cb2aa4f81110'::uuid OR canonical_key<>'benchmark-technology/c2e6e967-6077-5054-aef5-ae59b60eb1c4' OR label<>'Predictive Modeling'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('057d42ca-671e-503f-a079-cb2aa4f81110'::uuid,'benchmark-technology/c2e6e967-6077-5054-aef5-ae59b60eb1c4','Predictive Modeling','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='057d42ca-671e-503f-a079-cb2aa4f81110'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='c2508a32-87a2-5fa8-8c00-0e6e46c97f86'::uuid OR canonical_key='benchmark-technology/24d34c35-9178-5569-bd52-f69bdc646000') AND
   (id<>'c2508a32-87a2-5fa8-8c00-0e6e46c97f86'::uuid OR canonical_key<>'benchmark-technology/24d34c35-9178-5569-bd52-f69bdc646000' OR label<>'Statistical Modeling'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('c2508a32-87a2-5fa8-8c00-0e6e46c97f86'::uuid,'benchmark-technology/24d34c35-9178-5569-bd52-f69bdc646000','Statistical Modeling','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='c2508a32-87a2-5fa8-8c00-0e6e46c97f86'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='88ab3ea9-3b54-5597-9609-ba7122c85191'::uuid OR canonical_key='benchmark-technology/f8836040-ddd3-5721-96ea-a6c3b2529e15') AND
   (id<>'88ab3ea9-3b54-5597-9609-ba7122c85191'::uuid OR canonical_key<>'benchmark-technology/f8836040-ddd3-5721-96ea-a6c3b2529e15' OR label<>'Model Evaluation'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('88ab3ea9-3b54-5597-9609-ba7122c85191'::uuid,'benchmark-technology/f8836040-ddd3-5721-96ea-a6c3b2529e15','Model Evaluation','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='88ab3ea9-3b54-5597-9609-ba7122c85191'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='8a22c8fe-4fa7-5502-ba39-3ebf52e0cb86'::uuid OR canonical_key='benchmark-technology/8796a229-1a74-5183-8d9e-2180e2fb697b') AND
   (id<>'8a22c8fe-4fa7-5502-ba39-3ebf52e0cb86'::uuid OR canonical_key<>'benchmark-technology/8796a229-1a74-5183-8d9e-2180e2fb697b' OR label<>'Data Preparation'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('8a22c8fe-4fa7-5502-ba39-3ebf52e0cb86'::uuid,'benchmark-technology/8796a229-1a74-5183-8d9e-2180e2fb697b','Data Preparation','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='8a22c8fe-4fa7-5502-ba39-3ebf52e0cb86'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='665572b9-ce74-5cbe-b458-a2e15f46572e'::uuid OR canonical_key='benchmark-technology/17183ef9-5ad9-57cf-828d-46aac94f63e0') AND
   (id<>'665572b9-ce74-5cbe-b458-a2e15f46572e'::uuid OR canonical_key<>'benchmark-technology/17183ef9-5ad9-57cf-828d-46aac94f63e0' OR label<>'Exploratory Data Analysis'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('665572b9-ce74-5cbe-b458-a2e15f46572e'::uuid,'benchmark-technology/17183ef9-5ad9-57cf-828d-46aac94f63e0','Exploratory Data Analysis','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='665572b9-ce74-5cbe-b458-a2e15f46572e'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='727c5e9a-db12-51f9-8b87-1479cd7b854e'::uuid OR canonical_key='benchmark-technology/be6d1d57-0e91-5e0a-a006-8a6de57bd976') AND
   (id<>'727c5e9a-db12-51f9-8b87-1479cd7b854e'::uuid OR canonical_key<>'benchmark-technology/be6d1d57-0e91-5e0a-a006-8a6de57bd976' OR label<>'HTML'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('727c5e9a-db12-51f9-8b87-1479cd7b854e'::uuid,'benchmark-technology/be6d1d57-0e91-5e0a-a006-8a6de57bd976','HTML','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='727c5e9a-db12-51f9-8b87-1479cd7b854e'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='67c40507-ea06-5a43-8b00-86f06f6f239e'::uuid OR canonical_key='benchmark-technology/e9b5619f-7fba-573c-823d-ae48d0cd9b1d') AND
   (id<>'67c40507-ea06-5a43-8b00-86f06f6f239e'::uuid OR canonical_key<>'benchmark-technology/e9b5619f-7fba-573c-823d-ae48d0cd9b1d' OR label<>'CSS'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('67c40507-ea06-5a43-8b00-86f06f6f239e'::uuid,'benchmark-technology/e9b5619f-7fba-573c-823d-ae48d0cd9b1d','CSS','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='67c40507-ea06-5a43-8b00-86f06f6f239e'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='f0432537-7c0b-5dce-b242-0a1ddfa31600'::uuid OR canonical_key='benchmark-technology/e8ebcf16-888e-5cc6-a186-ceb9f420cb70') AND
   (id<>'f0432537-7c0b-5dce-b242-0a1ddfa31600'::uuid OR canonical_key<>'benchmark-technology/e8ebcf16-888e-5cc6-a186-ceb9f420cb70' OR label<>'JavaScript'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('f0432537-7c0b-5dce-b242-0a1ddfa31600'::uuid,'benchmark-technology/e8ebcf16-888e-5cc6-a186-ceb9f420cb70','JavaScript','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='f0432537-7c0b-5dce-b242-0a1ddfa31600'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='a2ccb1c1-ce18-567f-b652-f36640dab875'::uuid OR canonical_key='benchmark-technology/e23d4cf9-4e09-5431-87e5-2e3cf1c652d0') AND
   (id<>'a2ccb1c1-ce18-567f-b652-f36640dab875'::uuid OR canonical_key<>'benchmark-technology/e23d4cf9-4e09-5431-87e5-2e3cf1c652d0' OR label<>'React'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('a2ccb1c1-ce18-567f-b652-f36640dab875'::uuid,'benchmark-technology/e23d4cf9-4e09-5431-87e5-2e3cf1c652d0','React','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='a2ccb1c1-ce18-567f-b652-f36640dab875'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='9d7f5b27-7cc5-504d-86ff-a3b0d4fb6fb1'::uuid OR canonical_key='benchmark-technology/4e7ccaa5-a34e-5d33-96c4-ee4819af9ee5') AND
   (id<>'9d7f5b27-7cc5-504d-86ff-a3b0d4fb6fb1'::uuid OR canonical_key<>'benchmark-technology/4e7ccaa5-a34e-5d33-96c4-ee4819af9ee5' OR label<>'API Integration'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('9d7f5b27-7cc5-504d-86ff-a3b0d4fb6fb1'::uuid,'benchmark-technology/4e7ccaa5-a34e-5d33-96c4-ee4819af9ee5','API Integration','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='9d7f5b27-7cc5-504d-86ff-a3b0d4fb6fb1'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='c710bf2f-f407-5f82-9b67-360d080634a0'::uuid OR canonical_key='benchmark-technology/e1d085a0-e709-5bd4-a69a-23d42378a08b') AND
   (id<>'c710bf2f-f407-5f82-9b67-360d080634a0'::uuid OR canonical_key<>'benchmark-technology/e1d085a0-e709-5bd4-a69a-23d42378a08b' OR label<>'Responsive Design'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('c710bf2f-f407-5f82-9b67-360d080634a0'::uuid,'benchmark-technology/e1d085a0-e709-5bd4-a69a-23d42378a08b','Responsive Design','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='c710bf2f-f407-5f82-9b67-360d080634a0'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='53941661-63ba-5ea3-b2b1-d92491d2c136'::uuid OR canonical_key='benchmark-technology/5dfc5f19-24f7-5909-82ac-b8e031c95268') AND
   (id<>'53941661-63ba-5ea3-b2b1-d92491d2c136'::uuid OR canonical_key<>'benchmark-technology/5dfc5f19-24f7-5909-82ac-b8e031c95268' OR label<>'Web Development'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('53941661-63ba-5ea3-b2b1-d92491d2c136'::uuid,'benchmark-technology/5dfc5f19-24f7-5909-82ac-b8e031c95268','Web Development','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='53941661-63ba-5ea3-b2b1-d92491d2c136'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='eec32265-d7c3-59db-af0d-83db7dfa2667'::uuid OR canonical_key='benchmark-technology/7d9c1caf-faec-57a1-8828-59d50e7238fa') AND
   (id<>'eec32265-d7c3-59db-af0d-83db7dfa2667'::uuid OR canonical_key<>'benchmark-technology/7d9c1caf-faec-57a1-8828-59d50e7238fa' OR label<>'UI Implementation'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('eec32265-d7c3-59db-af0d-83db7dfa2667'::uuid,'benchmark-technology/7d9c1caf-faec-57a1-8828-59d50e7238fa','UI Implementation','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='eec32265-d7c3-59db-af0d-83db7dfa2667'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='c95dc5f3-0a1d-5cd4-b7b6-27afe3783c8e'::uuid OR canonical_key='benchmark-technology/f923e7dc-ff6f-5359-8c2b-999fd3eedc55') AND
   (id<>'c95dc5f3-0a1d-5cd4-b7b6-27afe3783c8e'::uuid OR canonical_key<>'benchmark-technology/f923e7dc-ff6f-5359-8c2b-999fd3eedc55' OR label<>'Debugging'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('c95dc5f3-0a1d-5cd4-b7b6-27afe3783c8e'::uuid,'benchmark-technology/f923e7dc-ff6f-5359-8c2b-999fd3eedc55','Debugging','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='c95dc5f3-0a1d-5cd4-b7b6-27afe3783c8e'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='f1906e20-8e0b-52db-8a98-6515655b0997'::uuid OR canonical_key='benchmark-technology/5fcd34d5-4b5b-5665-8d23-5485d0bd11b6') AND
   (id<>'f1906e20-8e0b-52db-8a98-6515655b0997'::uuid OR canonical_key<>'benchmark-technology/5fcd34d5-4b5b-5665-8d23-5485d0bd11b6' OR label<>'Cross-Browser Compatibility'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('f1906e20-8e0b-52db-8a98-6515655b0997'::uuid,'benchmark-technology/5fcd34d5-4b5b-5665-8d23-5485d0bd11b6','Cross-Browser Compatibility','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='f1906e20-8e0b-52db-8a98-6515655b0997'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='64907ae5-994d-5c10-ae96-4e1502671863'::uuid OR canonical_key='benchmark-technology/8e99d77c-6b39-53f7-9cf2-eb7c16890dab') AND
   (id<>'64907ae5-994d-5c10-ae96-4e1502671863'::uuid OR canonical_key<>'benchmark-technology/8e99d77c-6b39-53f7-9cf2-eb7c16890dab' OR label<>'Code Reviews'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('64907ae5-994d-5c10-ae96-4e1502671863'::uuid,'benchmark-technology/8e99d77c-6b39-53f7-9cf2-eb7c16890dab','Code Reviews','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='64907ae5-994d-5c10-ae96-4e1502671863'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='57d53acd-ddf8-5f05-ba14-8f63fb19bcc7'::uuid OR canonical_key='benchmark-technology/a578bd57-b9f8-5a1c-abe2-70473901eea0') AND
   (id<>'57d53acd-ddf8-5f05-ba14-8f63fb19bcc7'::uuid OR canonical_key<>'benchmark-technology/a578bd57-b9f8-5a1c-abe2-70473901eea0' OR label<>'Embedded C/C++'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('57d53acd-ddf8-5f05-ba14-8f63fb19bcc7'::uuid,'benchmark-technology/a578bd57-b9f8-5a1c-abe2-70473901eea0','Embedded C/C++','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='57d53acd-ddf8-5f05-ba14-8f63fb19bcc7'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='934ebe13-79fa-5d3f-b63f-dea6dc7c7041'::uuid OR canonical_key='benchmark-technology/3581d0d2-bee4-588b-9b2a-0ab4564b1738') AND
   (id<>'934ebe13-79fa-5d3f-b63f-dea6dc7c7041'::uuid OR canonical_key<>'benchmark-technology/3581d0d2-bee4-588b-9b2a-0ab4564b1738' OR label<>'Software Debugging'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('934ebe13-79fa-5d3f-b63f-dea6dc7c7041'::uuid,'benchmark-technology/3581d0d2-bee4-588b-9b2a-0ab4564b1738','Software Debugging','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='934ebe13-79fa-5d3f-b63f-dea6dc7c7041'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='92cf91b6-6c16-539a-87df-2f5c02394071'::uuid OR canonical_key='benchmark-technology/490a8563-fa33-5057-8379-3e40dc2c04c6') AND
   (id<>'92cf91b6-6c16-539a-87df-2f5c02394071'::uuid OR canonical_key<>'benchmark-technology/490a8563-fa33-5057-8379-3e40dc2c04c6' OR label<>'Version Control'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('92cf91b6-6c16-539a-87df-2f5c02394071'::uuid,'benchmark-technology/490a8563-fa33-5057-8379-3e40dc2c04c6','Version Control','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='92cf91b6-6c16-539a-87df-2f5c02394071'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='fa75af33-9603-5e71-9ab5-90db80584c42'::uuid OR canonical_key='benchmark-technology/032c9bf5-c07e-5883-ba9f-fab2abb86d20') AND
   (id<>'fa75af33-9603-5e71-9ab5-90db80584c42'::uuid OR canonical_key<>'benchmark-technology/032c9bf5-c07e-5883-ba9f-fab2abb86d20' OR label<>'Hardware Integration'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('fa75af33-9603-5e71-9ab5-90db80584c42'::uuid,'benchmark-technology/032c9bf5-c07e-5883-ba9f-fab2abb86d20','Hardware Integration','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='fa75af33-9603-5e71-9ab5-90db80584c42'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='722d57be-d631-5644-b68b-13a04287d658'::uuid OR canonical_key='benchmark-technology/6ee8e350-c187-5382-bdb0-5aec139630cb') AND
   (id<>'722d57be-d631-5644-b68b-13a04287d658'::uuid OR canonical_key<>'benchmark-technology/6ee8e350-c187-5382-bdb0-5aec139630cb' OR label<>'Code Optimization'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('722d57be-d631-5644-b68b-13a04287d658'::uuid,'benchmark-technology/6ee8e350-c187-5382-bdb0-5aec139630cb','Code Optimization','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='722d57be-d631-5644-b68b-13a04287d658'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='1b23db7b-43ee-5a73-bb9c-1ce04dd036a4'::uuid OR canonical_key='benchmark-technology/7276a5a2-03dd-5db3-902a-714704441917') AND
   (id<>'1b23db7b-43ee-5a73-bb9c-1ce04dd036a4'::uuid OR canonical_key<>'benchmark-technology/7276a5a2-03dd-5db3-902a-714704441917' OR label<>'Software Testing'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('1b23db7b-43ee-5a73-bb9c-1ce04dd036a4'::uuid,'benchmark-technology/7276a5a2-03dd-5db3-902a-714704441917','Software Testing','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='1b23db7b-43ee-5a73-bb9c-1ce04dd036a4'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='60dfe229-0cb6-53de-98ac-df968f8101ef'::uuid OR canonical_key='benchmark-technology/7689afa2-1aa1-5263-ab5b-cb4b12972403') AND
   (id<>'60dfe229-0cb6-53de-98ac-df968f8101ef'::uuid OR canonical_key<>'benchmark-technology/7689afa2-1aa1-5263-ab5b-cb4b12972403' OR label<>'User Research'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('60dfe229-0cb6-53de-98ac-df968f8101ef'::uuid,'benchmark-technology/7689afa2-1aa1-5263-ab5b-cb4b12972403','User Research','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='60dfe229-0cb6-53de-98ac-df968f8101ef'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='ca22002b-9a65-5feb-b4fe-8cd10502b68a'::uuid OR canonical_key='benchmark-technology/419bdec5-97db-5a9a-8faa-60e7d6348aa9') AND
   (id<>'ca22002b-9a65-5feb-b4fe-8cd10502b68a'::uuid OR canonical_key<>'benchmark-technology/419bdec5-97db-5a9a-8faa-60e7d6348aa9' OR label<>'User Interviews'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('ca22002b-9a65-5feb-b4fe-8cd10502b68a'::uuid,'benchmark-technology/419bdec5-97db-5a9a-8faa-60e7d6348aa9','User Interviews','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='ca22002b-9a65-5feb-b4fe-8cd10502b68a'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='e0dd5678-2c5c-5706-bc34-05561782e1df'::uuid OR canonical_key='benchmark-technology/0aac9c2c-5213-5104-a813-5043fa46a8d1') AND
   (id<>'e0dd5678-2c5c-5706-bc34-05561782e1df'::uuid OR canonical_key<>'benchmark-technology/0aac9c2c-5213-5104-a813-5043fa46a8d1' OR label<>'Usability Testing'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('e0dd5678-2c5c-5706-bc34-05561782e1df'::uuid,'benchmark-technology/0aac9c2c-5213-5104-a813-5043fa46a8d1','Usability Testing','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='e0dd5678-2c5c-5706-bc34-05561782e1df'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='1dda9114-8657-56d5-85e4-7d2d0b9f6e31'::uuid OR canonical_key='benchmark-technology/1a80f4c6-5221-59d2-9b32-64100fd4e791') AND
   (id<>'1dda9114-8657-56d5-85e4-7d2d0b9f6e31'::uuid OR canonical_key<>'benchmark-technology/1a80f4c6-5221-59d2-9b32-64100fd4e791' OR label<>'User Journeys'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('1dda9114-8657-56d5-85e4-7d2d0b9f6e31'::uuid,'benchmark-technology/1a80f4c6-5221-59d2-9b32-64100fd4e791','User Journeys','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='1dda9114-8657-56d5-85e4-7d2d0b9f6e31'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='63756559-e0e3-5a8c-b857-75dbae24a858'::uuid OR canonical_key='benchmark-technology/f59d5514-05b6-54ce-9221-61368aac065a') AND
   (id<>'63756559-e0e3-5a8c-b857-75dbae24a858'::uuid OR canonical_key<>'benchmark-technology/f59d5514-05b6-54ce-9221-61368aac065a' OR label<>'Information Architecture'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('63756559-e0e3-5a8c-b857-75dbae24a858'::uuid,'benchmark-technology/f59d5514-05b6-54ce-9221-61368aac065a','Information Architecture','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='63756559-e0e3-5a8c-b857-75dbae24a858'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='9ea0d407-10ca-53a8-8292-aecd45319e77'::uuid OR canonical_key='benchmark-technology/1bc9e6b2-8deb-5c50-82a3-2cea17a4c6af') AND
   (id<>'9ea0d407-10ca-53a8-8292-aecd45319e77'::uuid OR canonical_key<>'benchmark-technology/1bc9e6b2-8deb-5c50-82a3-2cea17a4c6af' OR label<>'Interaction Design'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('9ea0d407-10ca-53a8-8292-aecd45319e77'::uuid,'benchmark-technology/1bc9e6b2-8deb-5c50-82a3-2cea17a4c6af','Interaction Design','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='9ea0d407-10ca-53a8-8292-aecd45319e77'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='b5f1bd9b-c58a-5dc9-b9b1-9e2fa0230224'::uuid OR canonical_key='benchmark-technology/56378905-9fa0-57f0-81fd-c91f06221dea') AND
   (id<>'b5f1bd9b-c58a-5dc9-b9b1-9e2fa0230224'::uuid OR canonical_key<>'benchmark-technology/56378905-9fa0-57f0-81fd-c91f06221dea' OR label<>'Prototyping'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('b5f1bd9b-c58a-5dc9-b9b1-9e2fa0230224'::uuid,'benchmark-technology/56378905-9fa0-57f0-81fd-c91f06221dea','Prototyping','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='b5f1bd9b-c58a-5dc9-b9b1-9e2fa0230224'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='c8e321a9-5fae-546e-b83b-4d5391b99a5c'::uuid OR canonical_key='benchmark-technology/12d0fca9-c1cc-5995-a40c-caaa6734aa7e') AND
   (id<>'c8e321a9-5fae-546e-b83b-4d5391b99a5c'::uuid OR canonical_key<>'benchmark-technology/12d0fca9-c1cc-5995-a40c-caaa6734aa7e' OR label<>'Design Systems'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('c8e321a9-5fae-546e-b83b-4d5391b99a5c'::uuid,'benchmark-technology/12d0fca9-c1cc-5995-a40c-caaa6734aa7e','Design Systems','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='c8e321a9-5fae-546e-b83b-4d5391b99a5c'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='b851e04e-420c-51e7-aef6-e886e725dd7f'::uuid OR canonical_key='benchmark-technology/71bcd1e8-6316-5e28-a580-953514b4577b') AND
   (id<>'b851e04e-420c-51e7-aef6-e886e725dd7f'::uuid OR canonical_key<>'benchmark-technology/71bcd1e8-6316-5e28-a580-953514b4577b' OR label<>'Data Architecture'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('b851e04e-420c-51e7-aef6-e886e725dd7f'::uuid,'benchmark-technology/71bcd1e8-6316-5e28-a580-953514b4577b','Data Architecture','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='b851e04e-420c-51e7-aef6-e886e725dd7f'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='ed93c1f8-6549-5a40-80bf-88ccc2463c73'::uuid OR canonical_key='benchmark-technology/fbdf3faa-87d6-56a0-8bc0-5e45eb45bb2a') AND
   (id<>'ed93c1f8-6549-5a40-80bf-88ccc2463c73'::uuid OR canonical_key<>'benchmark-technology/fbdf3faa-87d6-56a0-8bc0-5e45eb45bb2a' OR label<>'Relational Databases'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('ed93c1f8-6549-5a40-80bf-88ccc2463c73'::uuid,'benchmark-technology/fbdf3faa-87d6-56a0-8bc0-5e45eb45bb2a','Relational Databases','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='ed93c1f8-6549-5a40-80bf-88ccc2463c73'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='cedd19f0-c88e-5387-8f4b-c50681fd0632'::uuid OR canonical_key='benchmark-technology/91081d06-a82d-5300-bc66-59a3def45aab') AND
   (id<>'cedd19f0-c88e-5387-8f4b-c50681fd0632'::uuid OR canonical_key<>'benchmark-technology/91081d06-a82d-5300-bc66-59a3def45aab' OR label<>'NoSQL'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('cedd19f0-c88e-5387-8f4b-c50681fd0632'::uuid,'benchmark-technology/91081d06-a82d-5300-bc66-59a3def45aab','NoSQL','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='cedd19f0-c88e-5387-8f4b-c50681fd0632'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='598942ba-f155-54af-ae5d-4fe4129ad850'::uuid OR canonical_key='benchmark-technology/1406f5c4-396b-5760-89a7-b084aa303462') AND
   (id<>'598942ba-f155-54af-ae5d-4fe4129ad850'::uuid OR canonical_key<>'benchmark-technology/1406f5c4-396b-5760-89a7-b084aa303462' OR label<>'AI Orchestration'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('598942ba-f155-54af-ae5d-4fe4129ad850'::uuid,'benchmark-technology/1406f5c4-396b-5760-89a7-b084aa303462','AI Orchestration','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='598942ba-f155-54af-ae5d-4fe4129ad850'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='91c422a6-5a69-5202-ae97-542e859a2e34'::uuid OR canonical_key='benchmark-technology/e8df9d5b-3714-562b-82f3-9e4f9b1ce7f1') AND
   (id<>'91c422a6-5a69-5202-ae97-542e859a2e34'::uuid OR canonical_key<>'benchmark-technology/e8df9d5b-3714-562b-82f3-9e4f9b1ce7f1' OR label<>'Web Application Security'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('91c422a6-5a69-5202-ae97-542e859a2e34'::uuid,'benchmark-technology/e8df9d5b-3714-562b-82f3-9e4f9b1ce7f1','Web Application Security','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='91c422a6-5a69-5202-ae97-542e859a2e34'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='0bad9f77-0d48-5855-908e-b495dd81e459'::uuid OR canonical_key='benchmark-technology/f8f5359e-1b72-5d0a-a40f-70dc7f7815c8') AND
   (id<>'0bad9f77-0d48-5855-908e-b495dd81e459'::uuid OR canonical_key<>'benchmark-technology/f8f5359e-1b72-5d0a-a40f-70dc7f7815c8' OR label<>'TensorFlow'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('0bad9f77-0d48-5855-908e-b495dd81e459'::uuid,'benchmark-technology/f8f5359e-1b72-5d0a-a40f-70dc7f7815c8','TensorFlow','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='0bad9f77-0d48-5855-908e-b495dd81e459'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='ab3d9113-97de-5524-908e-6734ecabc81c'::uuid OR canonical_key='benchmark-technology/4167a417-4d3f-52fa-9953-ce69429c0f71') AND
   (id<>'ab3d9113-97de-5524-908e-6734ecabc81c'::uuid OR canonical_key<>'benchmark-technology/4167a417-4d3f-52fa-9953-ce69429c0f71' OR label<>'PyTorch'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('ab3d9113-97de-5524-908e-6734ecabc81c'::uuid,'benchmark-technology/4167a417-4d3f-52fa-9953-ce69429c0f71','PyTorch','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='ab3d9113-97de-5524-908e-6734ecabc81c'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='e5354c4c-a970-53b8-a92e-0c1bd791370e'::uuid OR canonical_key='benchmark-technology/6580da18-51a6-51de-be84-aee1d2cac123') AND
   (id<>'e5354c4c-a970-53b8-a92e-0c1bd791370e'::uuid OR canonical_key<>'benchmark-technology/6580da18-51a6-51de-be84-aee1d2cac123' OR label<>'Feature Engineering'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('e5354c4c-a970-53b8-a92e-0c1bd791370e'::uuid,'benchmark-technology/6580da18-51a6-51de-be84-aee1d2cac123','Feature Engineering','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='e5354c4c-a970-53b8-a92e-0c1bd791370e'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='9ba31277-fff1-5cd7-aaa9-109d7b369f37'::uuid OR canonical_key='benchmark-technology/c0ed3983-2785-5bce-ad72-7d1d0e365ea5') AND
   (id<>'9ba31277-fff1-5cd7-aaa9-109d7b369f37'::uuid OR canonical_key<>'benchmark-technology/c0ed3983-2785-5bce-ad72-7d1d0e365ea5' OR label<>'Model Deployment'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('9ba31277-fff1-5cd7-aaa9-109d7b369f37'::uuid,'benchmark-technology/c0ed3983-2785-5bce-ad72-7d1d0e365ea5','Model Deployment','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='9ba31277-fff1-5cd7-aaa9-109d7b369f37'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='ca3050f5-8e86-53c6-a957-b3a2b9c95785'::uuid OR canonical_key='benchmark-technology/ba722672-28fb-54b7-abc8-53c6e3c1a584') AND
   (id<>'ca3050f5-8e86-53c6-a957-b3a2b9c95785'::uuid OR canonical_key<>'benchmark-technology/ba722672-28fb-54b7-abc8-53c6e3c1a584' OR label<>'Deep Learning'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('ca3050f5-8e86-53c6-a957-b3a2b9c95785'::uuid,'benchmark-technology/ba722672-28fb-54b7-abc8-53c6e3c1a584','Deep Learning','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='ca3050f5-8e86-53c6-a957-b3a2b9c95785'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='82500b37-5914-51cb-b1cb-f1eeae138f1d'::uuid OR canonical_key='benchmark-technology/e7e2bc6e-85e2-541b-b410-9fbc5648098c') AND
   (id<>'82500b37-5914-51cb-b1cb-f1eeae138f1d'::uuid OR canonical_key<>'benchmark-technology/e7e2bc6e-85e2-541b-b410-9fbc5648098c' OR label<>'Microservices'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('82500b37-5914-51cb-b1cb-f1eeae138f1d'::uuid,'benchmark-technology/e7e2bc6e-85e2-541b-b410-9fbc5648098c','Microservices','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='82500b37-5914-51cb-b1cb-f1eeae138f1d'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='6dfb7e3d-dc84-55a0-ba0d-bd825f52ac4a'::uuid OR canonical_key='benchmark-technology/e0846eb8-0d8c-553d-b285-8b9f68b69fba') AND
   (id<>'6dfb7e3d-dc84-55a0-ba0d-bd825f52ac4a'::uuid OR canonical_key<>'benchmark-technology/e0846eb8-0d8c-553d-b285-8b9f68b69fba' OR label<>'Embedded Software Validation'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('6dfb7e3d-dc84-55a0-ba0d-bd825f52ac4a'::uuid,'benchmark-technology/e0846eb8-0d8c-553d-b285-8b9f68b69fba','Embedded Software Validation','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='6dfb7e3d-dc84-55a0-ba0d-bd825f52ac4a'::uuid AND NOT published;
DO $reference_guard$BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id='eb8c7b34-4568-5dc9-8682-84f1d62939ec'::uuid OR canonical_key='benchmark-technology/8db76dd7-878e-5a68-a528-634afb69649e') AND
   (id<>'eb8c7b34-4568-5dc9-8682-84f1d62939ec'::uuid OR canonical_key<>'benchmark-technology/8db76dd7-878e-5a68-a528-634afb69649e' OR label<>'Regression Testing'
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END$reference_guard$;
INSERT INTO asgard_catalog.competencies (id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) VALUES ('eb8c7b34-4568-5dc9-8682-84f1d62939ec'::uuid,'benchmark-technology/8db76dd7-878e-5a68-a528-634afb69649e','Regression Testing','posting-technology-vocabulary','v1',true,'YakisobaNissin',statement_timestamp()) ON CONFLICT (id) DO NOTHING;
UPDATE asgard_catalog.competencies SET published=true, reviewed_by='YakisobaNissin',reviewed_at=statement_timestamp() WHERE id='eb8c7b34-4568-5dc9-8682-84f1d62939ec'::uuid AND NOT published;


SELECT pg_advisory_xact_lock(411, 4);
DO $snapshot_guard$
BEGIN
    IF EXISTS (
        SELECT 1 FROM (VALUES
        ('cybersecurity-analyst', 'benchmark-technology/0988b1a0-6b0d-56b4-a653-33aa99f1129f'),
        ('cybersecurity-analyst', 'benchmark-technology/773ef2b5-601c-5fac-abd9-5e50a2349f71'),
        ('cybersecurity-analyst', 'benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d'),
        ('cybersecurity-analyst', 'benchmark-technology/d60a4fd1-87b9-5da1-a0d6-894ad66a8711'),
        ('cybersecurity-analyst', 'benchmark-technology/dd7261f1-4531-5376-9bee-2c5d473074e2'),
        ('cybersecurity-analyst', 'benchmark-technology/fe1dd45c-ae96-5cff-8254-e0f4f7575a9b'),
        ('data-analyst', 'benchmark-technology/015c2b95-2088-56ec-b098-d19898427752'),
        ('data-analyst', 'benchmark-technology/4459f154-4794-5a1d-a6e0-be59feef910a'),
        ('data-analyst', 'benchmark-technology/61264cb0-7dd5-5650-9956-c67164338ba8'),
        ('data-analyst', 'benchmark-technology/6262f1f9-9ccd-52d7-8ae7-7fc73ae08354'),
        ('data-analyst', 'benchmark-technology/6877ba8f-b710-5c0c-a2d6-9ec3ac325618'),
        ('data-analyst', 'benchmark-technology/6f9ad0cb-b868-5a4b-bbeb-77a0158c1795'),
        ('data-analyst', 'benchmark-technology/73be98ee-8172-52fa-b0b1-b4c3d4f4c287'),
        ('data-analyst', 'benchmark-technology/9451272d-a996-54fa-a3db-118551abb542'),
        ('data-analyst', 'benchmark-technology/9b2e4783-4055-5310-8a75-72b2dc64ca12'),
        ('data-analyst', 'benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d'),
        ('data-analyst', 'benchmark-technology/b71a600e-0f56-533a-a21a-7a97661fda3a'),
        ('data-analyst', 'benchmark-technology/bf9a8743-40df-5622-afae-833de0d53651'),
        ('data-analyst', 'benchmark-technology/bfc31ea8-5cd0-5a70-9a1e-39422a5a06c9'),
        ('data-analyst', 'benchmark-technology/c904898e-08f4-5b07-8ed2-224708de7e47'),
        ('data-analyst', 'benchmark-technology/df3f037c-c6e1-5b12-b7ed-f1fa91be621e'),
        ('data-analyst', 'benchmark-technology/e0f7a7f7-7940-5da4-a136-2afc4037db54'),
        ('data-analyst', 'benchmark-technology/e41a2620-39fe-5250-9d48-4235fdffdcab'),
        ('data-analyst', 'benchmark-technology/ece87f9e-8e39-5183-965e-23b8ba314fd3'),
        ('data-analyst', 'benchmark-technology/f02aed85-3ddb-5ded-b34e-a96bc7781177'),
        ('data-engineer', 'benchmark-technology/1406f5c4-396b-5760-89a7-b084aa303462'),
        ('data-engineer', 'benchmark-technology/27a295ae-fa71-5811-944d-7f0fcbbea2de'),
        ('data-engineer', 'benchmark-technology/30a7354e-bcd7-510f-a3ec-cae5bf4e0302'),
        ('data-engineer', 'benchmark-technology/6534bb89-90b6-5f35-bacf-08a13872efcb'),
        ('data-engineer', 'benchmark-technology/71bcd1e8-6316-5e28-a580-953514b4577b'),
        ('data-engineer', 'benchmark-technology/740d8b16-14a7-5a1c-a05a-ca999a55a3dc'),
        ('data-engineer', 'benchmark-technology/78380cd0-89ef-54a0-b12f-27dafb1b6bf0'),
        ('data-engineer', 'benchmark-technology/7bd220f2-5ac2-5242-8f6a-dfbe392cceb4'),
        ('data-engineer', 'benchmark-technology/91081d06-a82d-5300-bc66-59a3def45aab'),
        ('data-engineer', 'benchmark-technology/9482e3df-984d-52fa-aa35-9cb37f55ed1b'),
        ('data-engineer', 'benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d'),
        ('data-engineer', 'benchmark-technology/a8aa8acd-8d45-5138-a046-e5c0c38dfb55'),
        ('data-engineer', 'benchmark-technology/cfdce0b2-a1e4-5166-aa51-895c550a06a1'),
        ('data-engineer', 'benchmark-technology/e41a2620-39fe-5250-9d48-4235fdffdcab'),
        ('data-engineer', 'benchmark-technology/f02aed85-3ddb-5ded-b34e-a96bc7781177'),
        ('data-engineer', 'benchmark-technology/fbdf3faa-87d6-56a0-8bc0-5e45eb45bb2a'),
        ('devops-engineer', 'benchmark-technology/1513447c-e4e9-5b10-bc04-36f9b8ab702b'),
        ('devops-engineer', 'benchmark-technology/1894a26d-5eab-5d34-abd3-a475fa3f1b97'),
        ('devops-engineer', 'benchmark-technology/1f3dd628-5803-5e87-8fdf-daaeb9fd5d2c'),
        ('devops-engineer', 'benchmark-technology/275269a6-bfac-5e6d-b4d5-56d62c18a670'),
        ('devops-engineer', 'benchmark-technology/2ca6d403-37f9-5c1c-9e9d-d28d92660982'),
        ('devops-engineer', 'benchmark-technology/2ff23fbf-9e19-5985-b55a-8ff0c0004be5'),
        ('devops-engineer', 'benchmark-technology/30a7354e-bcd7-510f-a3ec-cae5bf4e0302'),
        ('devops-engineer', 'benchmark-technology/6d15c51b-daa4-51fb-8fb8-97546675c319'),
        ('devops-engineer', 'benchmark-technology/6f78319d-0781-59c6-ac9c-e1532ebc8ffb'),
        ('devops-engineer', 'benchmark-technology/724f1cf6-cbf5-5cce-9aa3-03fe7079e10b'),
        ('devops-engineer', 'benchmark-technology/9114466d-51e4-5ba2-a526-3b73bee23c35'),
        ('devops-engineer', 'benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d'),
        ('devops-engineer', 'benchmark-technology/dd7261f1-4531-5376-9bee-2c5d473074e2'),
        ('devops-engineer', 'benchmark-technology/ec0aa230-fca3-5863-9029-d8628e8d86db'),
        ('devops-engineer', 'benchmark-technology/eddcc0a5-b4b4-57f0-bcbc-bc841b43ca7f'),
        ('embedded-systems-developer', 'benchmark-technology/032c9bf5-c07e-5883-ba9f-fab2abb86d20'),
        ('embedded-systems-developer', 'benchmark-technology/3581d0d2-bee4-588b-9b2a-0ab4564b1738'),
        ('embedded-systems-developer', 'benchmark-technology/490a8563-fa33-5057-8379-3e40dc2c04c6'),
        ('embedded-systems-developer', 'benchmark-technology/5baab1ed-24bb-59b6-8375-d4ac20be8d44'),
        ('embedded-systems-developer', 'benchmark-technology/6ee8e350-c187-5382-bdb0-5aec139630cb'),
        ('embedded-systems-developer', 'benchmark-technology/7276a5a2-03dd-5db3-902a-714704441917'),
        ('embedded-systems-developer', 'benchmark-technology/8db76dd7-878e-5a68-a528-634afb69649e'),
        ('embedded-systems-developer', 'benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d'),
        ('embedded-systems-developer', 'benchmark-technology/a578bd57-b9f8-5a1c-abe2-70473901eea0'),
        ('embedded-systems-developer', 'benchmark-technology/e0846eb8-0d8c-553d-b285-8b9f68b69fba'),
        ('frontend', 'benchmark-technology/4e7ccaa5-a34e-5d33-96c4-ee4819af9ee5'),
        ('frontend', 'benchmark-technology/5dfc5f19-24f7-5909-82ac-b8e031c95268'),
        ('frontend', 'benchmark-technology/5fcd34d5-4b5b-5665-8d23-5485d0bd11b6'),
        ('frontend', 'benchmark-technology/7d9c1caf-faec-57a1-8828-59d50e7238fa'),
        ('frontend', 'benchmark-technology/8e99d77c-6b39-53f7-9cf2-eb7c16890dab'),
        ('frontend', 'benchmark-technology/be6d1d57-0e91-5e0a-a006-8a6de57bd976'),
        ('frontend', 'benchmark-technology/e1d085a0-e709-5bd4-a69a-23d42378a08b'),
        ('frontend', 'benchmark-technology/e23d4cf9-4e09-5431-87e5-2e3cf1c652d0'),
        ('frontend', 'benchmark-technology/e8ebcf16-888e-5cc6-a186-ceb9f420cb70'),
        ('frontend', 'benchmark-technology/e9b5619f-7fba-573c-823d-ae48d0cd9b1d'),
        ('frontend', 'benchmark-technology/f923e7dc-ff6f-5359-8c2b-999fd3eedc55'),
        ('machine-learning-engineer', 'benchmark-technology/17183ef9-5ad9-57cf-828d-46aac94f63e0'),
        ('machine-learning-engineer', 'benchmark-technology/24d34c35-9178-5569-bd52-f69bdc646000'),
        ('machine-learning-engineer', 'benchmark-technology/4167a417-4d3f-52fa-9953-ce69429c0f71'),
        ('machine-learning-engineer', 'benchmark-technology/6580da18-51a6-51de-be84-aee1d2cac123'),
        ('machine-learning-engineer', 'benchmark-technology/8796a229-1a74-5183-8d9e-2180e2fb697b'),
        ('machine-learning-engineer', 'benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d'),
        ('machine-learning-engineer', 'benchmark-technology/ba722672-28fb-54b7-abc8-53c6e3c1a584'),
        ('machine-learning-engineer', 'benchmark-technology/c0ed3983-2785-5bce-ad72-7d1d0e365ea5'),
        ('machine-learning-engineer', 'benchmark-technology/c2e6e967-6077-5054-aef5-ae59b60eb1c4'),
        ('machine-learning-engineer', 'benchmark-technology/c5c71509-7144-5d99-bd10-1681b42c4283'),
        ('machine-learning-engineer', 'benchmark-technology/e7e2bc6e-85e2-541b-b410-9fbc5648098c'),
        ('machine-learning-engineer', 'benchmark-technology/f8836040-ddd3-5721-96ea-a6c3b2529e15'),
        ('machine-learning-engineer', 'benchmark-technology/f8f5359e-1b72-5d0a-a40f-70dc7f7815c8'),
        ('network-engineer', 'benchmark-technology/0220c67d-1683-57d6-8dbd-6280e6f6ce95'),
        ('network-engineer', 'benchmark-technology/3b3e082d-616b-5423-b54d-197887b82a9c'),
        ('network-engineer', 'benchmark-technology/4d559fb4-41db-5f39-aaf6-b952dfbefce1'),
        ('network-engineer', 'benchmark-technology/86c89d95-1605-5db2-a8d1-b3c2f4b27a4a'),
        ('network-engineer', 'benchmark-technology/9fb24cc9-6254-5539-a492-24a1f7494c63'),
        ('network-engineer', 'benchmark-technology/a0335f3f-9e83-5ce0-8d0f-4a4421ce7d2b'),
        ('network-engineer', 'benchmark-technology/acbe996d-d3d8-5c5e-b72a-64cfbc1fd3cf'),
        ('network-engineer', 'benchmark-technology/aeda3f31-1acb-5a5d-bab0-2674db85951b'),
        ('network-engineer', 'benchmark-technology/be93acfc-7fbf-5b76-b207-ac01ae98425b'),
        ('network-engineer', 'benchmark-technology/cb1d1a5d-3ba2-56ec-8c1e-d1d7fd179202'),
        ('network-engineer', 'benchmark-technology/e607b1f9-0a8e-504a-a86e-6b700c40af40'),
        ('network-engineer', 'benchmark-technology/ef8aa0f9-f68f-5ef8-b7e6-5a0c3bba824a'),
        ('network-engineer', 'benchmark-technology/f5fa4836-4f79-51fc-9a0b-f4b70c12e16b'),
        ('network-engineer', 'benchmark-technology/f6ca09ae-4d9d-550e-a7e4-44208f108194'),
        ('penetration-tester', 'benchmark-technology/0220c67d-1683-57d6-8dbd-6280e6f6ce95'),
        ('penetration-tester', 'benchmark-technology/25579676-9e77-5039-baca-19f1efd23455'),
        ('penetration-tester', 'benchmark-technology/5baab1ed-24bb-59b6-8375-d4ac20be8d44'),
        ('penetration-tester', 'benchmark-technology/98cac714-dc4f-5d8e-9368-b4d2f5033835'),
        ('penetration-tester', 'benchmark-technology/9f644a14-8e75-5600-8a23-81c32d9f82aa'),
        ('penetration-tester', 'benchmark-technology/d60a4fd1-87b9-5da1-a0d6-894ad66a8711'),
        ('penetration-tester', 'benchmark-technology/e3ab3aca-bfa6-5da8-aa03-608606c5b92e'),
        ('penetration-tester', 'benchmark-technology/e8df9d5b-3714-562b-82f3-9e4f9b1ce7f1'),
        ('ux-designer', 'benchmark-technology/0aac9c2c-5213-5104-a813-5043fa46a8d1'),
        ('ux-designer', 'benchmark-technology/12d0fca9-c1cc-5995-a40c-caaa6734aa7e'),
        ('ux-designer', 'benchmark-technology/1a80f4c6-5221-59d2-9b32-64100fd4e791'),
        ('ux-designer', 'benchmark-technology/1bc9e6b2-8deb-5c50-82a3-2cea17a4c6af'),
        ('ux-designer', 'benchmark-technology/419bdec5-97db-5a9a-8faa-60e7d6348aa9'),
        ('ux-designer', 'benchmark-technology/56378905-9fa0-57f0-81fd-c91f06221dea'),
        ('ux-designer', 'benchmark-technology/7689afa2-1aa1-5263-ab5b-cb4b12972403'),
        ('ux-designer', 'benchmark-technology/f59d5514-05b6-54ce-9221-61368aac065a')) AS input(career_key, competency_key)
        LEFT JOIN asgard_catalog.careers AS career ON career.slug = input.career_key
        LEFT JOIN asgard_catalog.competencies AS competency ON competency.canonical_key = input.competency_key
        WHERE career.id IS NULL OR competency.id IS NULL OR NOT competency.published
          OR career.status <> 'published'
    ) THEN
        RAISE EXCEPTION 'Career skill snapshot contains unresolved career or competency keys';
    END IF;
END
$snapshot_guard$;
WITH input(snapshot_id, career_key, competency_key, posting_count, total_postings, source, source_version) AS (
    VALUES
        ('07062701-5ab3-5a4f-b6f5-6856e7c3846d'::uuid, 'cybersecurity-analyst', 'benchmark-technology/0988b1a0-6b0d-56b4-a653-33aa99f1129f', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('101428c7-cf26-5af2-8a1f-2aabfb6c04f4'::uuid, 'cybersecurity-analyst', 'benchmark-technology/773ef2b5-601c-5fac-abd9-5e50a2349f71', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('743699e9-1883-52cf-9b77-8e15e6ca258b'::uuid, 'cybersecurity-analyst', 'benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('7dca225b-f176-57ce-add4-ef97c8ff5689'::uuid, 'cybersecurity-analyst', 'benchmark-technology/d60a4fd1-87b9-5da1-a0d6-894ad66a8711', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('a4687032-ef79-5f29-b6a3-98be9a6be443'::uuid, 'cybersecurity-analyst', 'benchmark-technology/dd7261f1-4531-5376-9bee-2c5d473074e2', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('be26ddda-b3fc-558e-a2e5-a67913e4634a'::uuid, 'cybersecurity-analyst', 'benchmark-technology/fe1dd45c-ae96-5cff-8254-e0f4f7575a9b', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('92c7bd32-8cc7-5623-a89f-f216287c04c6'::uuid, 'data-analyst', 'benchmark-technology/015c2b95-2088-56ec-b098-d19898427752', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('6b6c87f4-92d4-5a0f-8ed9-b743877f6465'::uuid, 'data-analyst', 'benchmark-technology/4459f154-4794-5a1d-a6e0-be59feef910a', 4, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('9ce97cc4-e888-51f8-ab9e-8486c282ab08'::uuid, 'data-analyst', 'benchmark-technology/61264cb0-7dd5-5650-9956-c67164338ba8', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('73b4bfcf-3346-55ab-84cf-e07fc2f50468'::uuid, 'data-analyst', 'benchmark-technology/6262f1f9-9ccd-52d7-8ae7-7fc73ae08354', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('fff3a0fc-cee5-5b8d-82fb-e072d30d74c0'::uuid, 'data-analyst', 'benchmark-technology/6877ba8f-b710-5c0c-a2d6-9ec3ac325618', 2, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('6b16b141-aa54-5bee-bf8b-df98b0763c5d'::uuid, 'data-analyst', 'benchmark-technology/6f9ad0cb-b868-5a4b-bbeb-77a0158c1795', 2, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('69cdef41-7e88-5749-b4c5-f10b57c87e12'::uuid, 'data-analyst', 'benchmark-technology/73be98ee-8172-52fa-b0b1-b4c3d4f4c287', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('e1b11915-2a81-5389-9006-57ac5d3f0c1c'::uuid, 'data-analyst', 'benchmark-technology/9451272d-a996-54fa-a3db-118551abb542', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('51f2f6a3-d50e-58f7-a6b4-933c9f5f461c'::uuid, 'data-analyst', 'benchmark-technology/9b2e4783-4055-5310-8a75-72b2dc64ca12', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('260f95b5-c586-5e08-8553-1bf05a55b405'::uuid, 'data-analyst', 'benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('8766174e-d0ca-526f-96d4-aa5002afee2f'::uuid, 'data-analyst', 'benchmark-technology/b71a600e-0f56-533a-a21a-7a97661fda3a', 3, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('2504ab8c-c2bf-594b-8f45-99a2121c270b'::uuid, 'data-analyst', 'benchmark-technology/bf9a8743-40df-5622-afae-833de0d53651', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('623fbaa1-0285-5609-9172-e3da31aec104'::uuid, 'data-analyst', 'benchmark-technology/bfc31ea8-5cd0-5a70-9a1e-39422a5a06c9', 2, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('567d5627-e1e5-588b-acea-ba52d36a1af8'::uuid, 'data-analyst', 'benchmark-technology/c904898e-08f4-5b07-8ed2-224708de7e47', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('07edae9c-6a77-5e92-acd0-5685c4440cea'::uuid, 'data-analyst', 'benchmark-technology/df3f037c-c6e1-5b12-b7ed-f1fa91be621e', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('ad3d2612-f924-51bd-94e5-eca465ca42e3'::uuid, 'data-analyst', 'benchmark-technology/e0f7a7f7-7940-5da4-a136-2afc4037db54', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('6c25c7a3-1c22-5d41-8aa3-f05fee5ee25c'::uuid, 'data-analyst', 'benchmark-technology/e41a2620-39fe-5250-9d48-4235fdffdcab', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('66c394bc-5abc-5819-8997-117052f603c5'::uuid, 'data-analyst', 'benchmark-technology/ece87f9e-8e39-5183-965e-23b8ba314fd3', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('baa1b442-fd42-59b2-b8fe-173f58fc19d4'::uuid, 'data-analyst', 'benchmark-technology/f02aed85-3ddb-5ded-b34e-a96bc7781177', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('e97ebf6c-72ec-59fd-b7a0-e04cf7316a5d'::uuid, 'data-engineer', 'benchmark-technology/1406f5c4-396b-5760-89a7-b084aa303462', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('caed5459-6f1e-5798-9129-05486ebef793'::uuid, 'data-engineer', 'benchmark-technology/27a295ae-fa71-5811-944d-7f0fcbbea2de', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('541bb523-cbc5-57e5-94d1-d0f12bf9a9f8'::uuid, 'data-engineer', 'benchmark-technology/30a7354e-bcd7-510f-a3ec-cae5bf4e0302', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('c15fc7d1-7117-57a9-a5e7-21fa029f76ee'::uuid, 'data-engineer', 'benchmark-technology/6534bb89-90b6-5f35-bacf-08a13872efcb', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('2518c343-a345-5c0c-be4f-757865a7d08b'::uuid, 'data-engineer', 'benchmark-technology/71bcd1e8-6316-5e28-a580-953514b4577b', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('9544a35f-799a-5351-bfc2-ec5c370547a2'::uuid, 'data-engineer', 'benchmark-technology/740d8b16-14a7-5a1c-a05a-ca999a55a3dc', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('562bdb43-5bae-5b39-a61e-516d74a2b6f6'::uuid, 'data-engineer', 'benchmark-technology/78380cd0-89ef-54a0-b12f-27dafb1b6bf0', 3, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('bd24ca9f-42ab-5197-8b6d-6f9af68e42a8'::uuid, 'data-engineer', 'benchmark-technology/7bd220f2-5ac2-5242-8f6a-dfbe392cceb4', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('ed0131f1-5455-57f1-8dd0-b1ea2be1ffb3'::uuid, 'data-engineer', 'benchmark-technology/91081d06-a82d-5300-bc66-59a3def45aab', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('a0d34527-64fc-565e-8cd0-5abbfe52770a'::uuid, 'data-engineer', 'benchmark-technology/9482e3df-984d-52fa-aa35-9cb37f55ed1b', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('464df130-6de6-5951-bba0-501c70ddb38f'::uuid, 'data-engineer', 'benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d', 3, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('1101096b-b849-510f-946c-fb76e4830f14'::uuid, 'data-engineer', 'benchmark-technology/a8aa8acd-8d45-5138-a046-e5c0c38dfb55', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('c8030eef-2e28-53d4-abf1-54bcf2a172a2'::uuid, 'data-engineer', 'benchmark-technology/cfdce0b2-a1e4-5166-aa51-895c550a06a1', 3, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('9acc3ca6-3dcb-50ce-a850-67071a6a6e49'::uuid, 'data-engineer', 'benchmark-technology/e41a2620-39fe-5250-9d48-4235fdffdcab', 3, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('c56c3e6b-7676-5be7-9013-d3ebe2544118'::uuid, 'data-engineer', 'benchmark-technology/f02aed85-3ddb-5ded-b34e-a96bc7781177', 2, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('a1801357-657b-5e3f-ac61-e78fdf3ec3fd'::uuid, 'data-engineer', 'benchmark-technology/fbdf3faa-87d6-56a0-8bc0-5e45eb45bb2a', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('ce14af4f-f60c-5576-8b1a-f9b72a4e0f32'::uuid, 'devops-engineer', 'benchmark-technology/1513447c-e4e9-5b10-bc04-36f9b8ab702b', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('8a554361-bd75-5931-b6a1-40777d048da0'::uuid, 'devops-engineer', 'benchmark-technology/1894a26d-5eab-5d34-abd3-a475fa3f1b97', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('9f15c29e-ed5e-5ba0-879e-add16c319487'::uuid, 'devops-engineer', 'benchmark-technology/1f3dd628-5803-5e87-8fdf-daaeb9fd5d2c', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('1c3db797-ec1f-5fe0-b041-3a1df6553c28'::uuid, 'devops-engineer', 'benchmark-technology/275269a6-bfac-5e6d-b4d5-56d62c18a670', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('94c50c95-0796-551b-bff6-f9a39ba716a3'::uuid, 'devops-engineer', 'benchmark-technology/2ca6d403-37f9-5c1c-9e9d-d28d92660982', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('06d89fcf-beac-5139-a7d0-9673b66c32c1'::uuid, 'devops-engineer', 'benchmark-technology/2ff23fbf-9e19-5985-b55a-8ff0c0004be5', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('7fd69b7f-ecf4-535b-bec7-95767daf0bd1'::uuid, 'devops-engineer', 'benchmark-technology/30a7354e-bcd7-510f-a3ec-cae5bf4e0302', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('7fe02615-3e46-5d4a-ad53-652459806002'::uuid, 'devops-engineer', 'benchmark-technology/6d15c51b-daa4-51fb-8fb8-97546675c319', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('12e03ecd-4706-5985-9e0b-0b14a71154c6'::uuid, 'devops-engineer', 'benchmark-technology/6f78319d-0781-59c6-ac9c-e1532ebc8ffb', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('ddbb3877-724d-539e-8d76-39b749602292'::uuid, 'devops-engineer', 'benchmark-technology/724f1cf6-cbf5-5cce-9aa3-03fe7079e10b', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('1af466fa-7eac-5093-93f7-52ec58541574'::uuid, 'devops-engineer', 'benchmark-technology/9114466d-51e4-5ba2-a526-3b73bee23c35', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('f4e603a9-679d-52db-930f-75d86fa99491'::uuid, 'devops-engineer', 'benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('37db7367-2e67-538b-b7af-a5b7133c6e9d'::uuid, 'devops-engineer', 'benchmark-technology/dd7261f1-4531-5376-9bee-2c5d473074e2', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('b2dbf418-9411-5bde-8325-edeb29a5063a'::uuid, 'devops-engineer', 'benchmark-technology/ec0aa230-fca3-5863-9029-d8628e8d86db', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('79857b7d-8de9-507f-b4c6-7c9ef7ca0b1d'::uuid, 'devops-engineer', 'benchmark-technology/eddcc0a5-b4b4-57f0-bcbc-bc841b43ca7f', 2, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('6b4df4a8-fd0c-5a44-8871-8c2535fb6271'::uuid, 'embedded-systems-developer', 'benchmark-technology/032c9bf5-c07e-5883-ba9f-fab2abb86d20', 2, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('57580be5-034f-582f-927a-b2fa80496252'::uuid, 'embedded-systems-developer', 'benchmark-technology/3581d0d2-bee4-588b-9b2a-0ab4564b1738', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('b438c372-5e6b-55e6-b5ad-f8082fcf23e7'::uuid, 'embedded-systems-developer', 'benchmark-technology/490a8563-fa33-5057-8379-3e40dc2c04c6', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('ea258dc2-6442-5c8e-b0ae-f66e219f3a96'::uuid, 'embedded-systems-developer', 'benchmark-technology/5baab1ed-24bb-59b6-8375-d4ac20be8d44', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('3fd9bf0d-b6d2-5c42-8e72-1014b646e3c5'::uuid, 'embedded-systems-developer', 'benchmark-technology/6ee8e350-c187-5382-bdb0-5aec139630cb', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('1d095c16-2859-5f2d-b5a8-ed4e3e0b6062'::uuid, 'embedded-systems-developer', 'benchmark-technology/7276a5a2-03dd-5db3-902a-714704441917', 2, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('4bda6c68-b240-516f-8534-c99d9f96d7b8'::uuid, 'embedded-systems-developer', 'benchmark-technology/8db76dd7-878e-5a68-a528-634afb69649e', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('568383d3-e6aa-597c-a374-e186f795a860'::uuid, 'embedded-systems-developer', 'benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('bee82573-6423-5271-ab65-23cabde7abe6'::uuid, 'embedded-systems-developer', 'benchmark-technology/a578bd57-b9f8-5a1c-abe2-70473901eea0', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('37d81a31-f4a3-5da5-b27a-2e0539ade5a7'::uuid, 'embedded-systems-developer', 'benchmark-technology/e0846eb8-0d8c-553d-b285-8b9f68b69fba', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('291ecd04-ae02-53bd-95ab-6ebfcb4b92d9'::uuid, 'frontend', 'benchmark-technology/4e7ccaa5-a34e-5d33-96c4-ee4819af9ee5', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('158dabf5-9dc4-5390-9cde-945a3e82ec20'::uuid, 'frontend', 'benchmark-technology/5dfc5f19-24f7-5909-82ac-b8e031c95268', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('6524be35-53ff-5c15-8c7c-0c28f7916028'::uuid, 'frontend', 'benchmark-technology/5fcd34d5-4b5b-5665-8d23-5485d0bd11b6', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('302de0ba-df4a-5bc9-b0ab-9354f696322a'::uuid, 'frontend', 'benchmark-technology/7d9c1caf-faec-57a1-8828-59d50e7238fa', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('0efd8d09-bda1-5f76-b6a8-7185b367c081'::uuid, 'frontend', 'benchmark-technology/8e99d77c-6b39-53f7-9cf2-eb7c16890dab', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('c863eb7f-e992-5c84-9f4c-c4038e3f08eb'::uuid, 'frontend', 'benchmark-technology/be6d1d57-0e91-5e0a-a006-8a6de57bd976', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('86075176-9511-5363-a95e-131d3328b6e0'::uuid, 'frontend', 'benchmark-technology/e1d085a0-e709-5bd4-a69a-23d42378a08b', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('6614d538-72f4-5eb0-bfe0-1919451054e6'::uuid, 'frontend', 'benchmark-technology/e23d4cf9-4e09-5431-87e5-2e3cf1c652d0', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('76c1e272-b82f-50bd-97c9-a8b656544d84'::uuid, 'frontend', 'benchmark-technology/e8ebcf16-888e-5cc6-a186-ceb9f420cb70', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('03b4e32d-2c8a-503c-a3a4-46a3b43a6b87'::uuid, 'frontend', 'benchmark-technology/e9b5619f-7fba-573c-823d-ae48d0cd9b1d', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('4081801d-2f1d-51d8-8bd0-1a17d193c3f1'::uuid, 'frontend', 'benchmark-technology/f923e7dc-ff6f-5359-8c2b-999fd3eedc55', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('6677efaf-9329-55a3-af81-1cc765ff0fc7'::uuid, 'machine-learning-engineer', 'benchmark-technology/17183ef9-5ad9-57cf-828d-46aac94f63e0', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('367d1801-6f78-5258-9d5f-800a55f37375'::uuid, 'machine-learning-engineer', 'benchmark-technology/24d34c35-9178-5569-bd52-f69bdc646000', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('09400c6b-7aef-5eaf-9f45-2fd90d363ec5'::uuid, 'machine-learning-engineer', 'benchmark-technology/4167a417-4d3f-52fa-9953-ce69429c0f71', 2, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('95c83883-7f0f-5204-a7b1-ec8b5e9a96bb'::uuid, 'machine-learning-engineer', 'benchmark-technology/6580da18-51a6-51de-be84-aee1d2cac123', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('1e15cbb1-1741-5dfe-991e-9a663cbbf2a1'::uuid, 'machine-learning-engineer', 'benchmark-technology/8796a229-1a74-5183-8d9e-2180e2fb697b', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('4036d86c-4b90-5a76-a522-2e4b56c87a23'::uuid, 'machine-learning-engineer', 'benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d', 3, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('5ef2bf0a-a13b-5f40-8d37-612c176b560b'::uuid, 'machine-learning-engineer', 'benchmark-technology/ba722672-28fb-54b7-abc8-53c6e3c1a584', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('95a6cd47-efda-5411-82dd-2a34d144e1d5'::uuid, 'machine-learning-engineer', 'benchmark-technology/c0ed3983-2785-5bce-ad72-7d1d0e365ea5', 2, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('af2b581a-d40f-5348-886a-52a90dfcb7e6'::uuid, 'machine-learning-engineer', 'benchmark-technology/c2e6e967-6077-5054-aef5-ae59b60eb1c4', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('16271fbf-57f1-503f-a9df-781bcf429da9'::uuid, 'machine-learning-engineer', 'benchmark-technology/c5c71509-7144-5d99-bd10-1681b42c4283', 3, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('5c375afc-e9e7-5625-95ec-95d0ac90870d'::uuid, 'machine-learning-engineer', 'benchmark-technology/e7e2bc6e-85e2-541b-b410-9fbc5648098c', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('79b5ab30-1a31-571a-9f57-5a1c2b7016a3'::uuid, 'machine-learning-engineer', 'benchmark-technology/f8836040-ddd3-5721-96ea-a6c3b2529e15', 2, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('6a205d33-6f08-5a45-8ef8-cc8b861d911f'::uuid, 'machine-learning-engineer', 'benchmark-technology/f8f5359e-1b72-5d0a-a40f-70dc7f7815c8', 2, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('16d186d3-e4d5-5350-876e-ba8cb48b2394'::uuid, 'network-engineer', 'benchmark-technology/0220c67d-1683-57d6-8dbd-6280e6f6ce95', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('fd5d98e7-c12a-5315-b5ce-e55a9a03fa4a'::uuid, 'network-engineer', 'benchmark-technology/3b3e082d-616b-5423-b54d-197887b82a9c', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('182c6892-baa3-5856-aa1d-e4faaf170142'::uuid, 'network-engineer', 'benchmark-technology/4d559fb4-41db-5f39-aaf6-b952dfbefce1', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('e6327e18-0cbe-5f2c-9dc0-7f602f5d341c'::uuid, 'network-engineer', 'benchmark-technology/86c89d95-1605-5db2-a8d1-b3c2f4b27a4a', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('97e70ffa-3c40-5ebc-966e-f7b19c9996ed'::uuid, 'network-engineer', 'benchmark-technology/9fb24cc9-6254-5539-a492-24a1f7494c63', 2, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('c2c08a68-eebf-570d-8c39-6ce4a3ca6dda'::uuid, 'network-engineer', 'benchmark-technology/a0335f3f-9e83-5ce0-8d0f-4a4421ce7d2b', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('0c3b902c-9acf-5f16-a75d-b35b89baae66'::uuid, 'network-engineer', 'benchmark-technology/acbe996d-d3d8-5c5e-b72a-64cfbc1fd3cf', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('a977500b-71fa-58db-9a24-885d4c40fe83'::uuid, 'network-engineer', 'benchmark-technology/aeda3f31-1acb-5a5d-bab0-2674db85951b', 2, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('17fd1f76-13af-59d5-aca9-bf7effce5b3b'::uuid, 'network-engineer', 'benchmark-technology/be93acfc-7fbf-5b76-b207-ac01ae98425b', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('742ed532-b960-5ac0-a0dd-57cb1524a254'::uuid, 'network-engineer', 'benchmark-technology/cb1d1a5d-3ba2-56ec-8c1e-d1d7fd179202', 2, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('24aa5266-d63f-5191-a899-4c637e1fb4e9'::uuid, 'network-engineer', 'benchmark-technology/e607b1f9-0a8e-504a-a86e-6b700c40af40', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('f3edd11c-b49c-5a14-9b6d-6f80a01ff836'::uuid, 'network-engineer', 'benchmark-technology/ef8aa0f9-f68f-5ef8-b7e6-5a0c3bba824a', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('45411134-7b76-509a-ac34-de78d36a61e7'::uuid, 'network-engineer', 'benchmark-technology/f5fa4836-4f79-51fc-9a0b-f4b70c12e16b', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('f9c51f4d-8cf6-599f-bc9e-f698cb37c552'::uuid, 'network-engineer', 'benchmark-technology/f6ca09ae-4d9d-550e-a7e4-44208f108194', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('0f1089af-7b34-5c1b-9104-f28eeee07fb8'::uuid, 'penetration-tester', 'benchmark-technology/0220c67d-1683-57d6-8dbd-6280e6f6ce95', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('e8227e84-c7a2-5559-82f1-e9965089a889'::uuid, 'penetration-tester', 'benchmark-technology/25579676-9e77-5039-baca-19f1efd23455', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('6d02772c-b4b0-586b-84e3-177d31974b2f'::uuid, 'penetration-tester', 'benchmark-technology/5baab1ed-24bb-59b6-8375-d4ac20be8d44', 2, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('8cfdd377-30dd-543e-8e4c-ae0d8f60f498'::uuid, 'penetration-tester', 'benchmark-technology/98cac714-dc4f-5d8e-9368-b4d2f5033835', 2, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('b1e35d8d-05fa-57cf-a919-0b2a28256f69'::uuid, 'penetration-tester', 'benchmark-technology/9f644a14-8e75-5600-8a23-81c32d9f82aa', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('06caa4ce-0acd-53a4-89ba-17701bee7d87'::uuid, 'penetration-tester', 'benchmark-technology/d60a4fd1-87b9-5da1-a0d6-894ad66a8711', 2, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('f843bb0a-c321-5945-9e7e-5eacdec1163f'::uuid, 'penetration-tester', 'benchmark-technology/e3ab3aca-bfa6-5da8-aa03-608606c5b92e', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('c8cca24e-9540-5485-a9f0-30d0848fd904'::uuid, 'penetration-tester', 'benchmark-technology/e8df9d5b-3714-562b-82f3-9e4f9b1ce7f1', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('3c41d7e7-fc7c-5b53-a5c9-ac47347b9fe9'::uuid, 'ux-designer', 'benchmark-technology/0aac9c2c-5213-5104-a813-5043fa46a8d1', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('e2e0d629-b21f-560d-a7d7-d8d3bf4a4714'::uuid, 'ux-designer', 'benchmark-technology/12d0fca9-c1cc-5995-a40c-caaa6734aa7e', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('b5f88d86-e15c-5718-b9a4-ab105ec0dac7'::uuid, 'ux-designer', 'benchmark-technology/1a80f4c6-5221-59d2-9b32-64100fd4e791', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('765ce222-700d-5f2b-b1d9-6b6201e7009c'::uuid, 'ux-designer', 'benchmark-technology/1bc9e6b2-8deb-5c50-82a3-2cea17a4c6af', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('1ca0aaa2-40f7-530d-98ec-f56d44ff688a'::uuid, 'ux-designer', 'benchmark-technology/419bdec5-97db-5a9a-8faa-60e7d6348aa9', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('70958bfe-87ab-54e0-addc-d0923a6a53ad'::uuid, 'ux-designer', 'benchmark-technology/56378905-9fa0-57f0-81fd-c91f06221dea', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('6e2e0241-d03c-5b17-8724-a50f70099299'::uuid, 'ux-designer', 'benchmark-technology/7689afa2-1aa1-5263-ab5b-cb4b12972403', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('20be453b-a1b1-5b3d-885b-bb65f95c039b'::uuid, 'ux-designer', 'benchmark-technology/f59d5514-05b6-54ce-9221-61368aac065a', 1, 1, 'ph_postings_collected', '2026-11-19-v1')
)
INSERT INTO asgard_catalog.career_skill_snapshot
    (id, career_id, competency_id, posting_count, total_postings, source, source_version,
     published, reviewed_by, reviewed_at)
SELECT input.snapshot_id, career.id, competency.id, input.posting_count, input.total_postings,
       input.source, input.source_version, false, NULL, NULL
FROM input
JOIN asgard_catalog.careers AS career ON career.slug = input.career_key
JOIN asgard_catalog.competencies AS competency ON competency.canonical_key = input.competency_key
ON CONFLICT (career_id, competency_id, source_version) DO UPDATE
SET posting_count = EXCLUDED.posting_count,
    total_postings = EXCLUDED.total_postings,
    source = EXCLUDED.source
WHERE asgard_catalog.career_skill_snapshot.published = false;
DO $import_count$ BEGIN
 IF (SELECT count(*) FROM asgard_catalog.career_skill_snapshot
     WHERE source='ph_postings_collected' AND source_version='2026-11-19-v1') <> 120 THEN
  RAISE EXCEPTION 'Snapshot import count differs from reviewed input';
 END IF;
 IF (SELECT count(*) FROM (VALUES
        ('07062701-5ab3-5a4f-b6f5-6856e7c3846d'::uuid, 'cybersecurity-analyst', 'benchmark-technology/0988b1a0-6b0d-56b4-a653-33aa99f1129f', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('101428c7-cf26-5af2-8a1f-2aabfb6c04f4'::uuid, 'cybersecurity-analyst', 'benchmark-technology/773ef2b5-601c-5fac-abd9-5e50a2349f71', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('743699e9-1883-52cf-9b77-8e15e6ca258b'::uuid, 'cybersecurity-analyst', 'benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('7dca225b-f176-57ce-add4-ef97c8ff5689'::uuid, 'cybersecurity-analyst', 'benchmark-technology/d60a4fd1-87b9-5da1-a0d6-894ad66a8711', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('a4687032-ef79-5f29-b6a3-98be9a6be443'::uuid, 'cybersecurity-analyst', 'benchmark-technology/dd7261f1-4531-5376-9bee-2c5d473074e2', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('be26ddda-b3fc-558e-a2e5-a67913e4634a'::uuid, 'cybersecurity-analyst', 'benchmark-technology/fe1dd45c-ae96-5cff-8254-e0f4f7575a9b', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('92c7bd32-8cc7-5623-a89f-f216287c04c6'::uuid, 'data-analyst', 'benchmark-technology/015c2b95-2088-56ec-b098-d19898427752', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('6b6c87f4-92d4-5a0f-8ed9-b743877f6465'::uuid, 'data-analyst', 'benchmark-technology/4459f154-4794-5a1d-a6e0-be59feef910a', 4, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('9ce97cc4-e888-51f8-ab9e-8486c282ab08'::uuid, 'data-analyst', 'benchmark-technology/61264cb0-7dd5-5650-9956-c67164338ba8', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('73b4bfcf-3346-55ab-84cf-e07fc2f50468'::uuid, 'data-analyst', 'benchmark-technology/6262f1f9-9ccd-52d7-8ae7-7fc73ae08354', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('fff3a0fc-cee5-5b8d-82fb-e072d30d74c0'::uuid, 'data-analyst', 'benchmark-technology/6877ba8f-b710-5c0c-a2d6-9ec3ac325618', 2, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('6b16b141-aa54-5bee-bf8b-df98b0763c5d'::uuid, 'data-analyst', 'benchmark-technology/6f9ad0cb-b868-5a4b-bbeb-77a0158c1795', 2, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('69cdef41-7e88-5749-b4c5-f10b57c87e12'::uuid, 'data-analyst', 'benchmark-technology/73be98ee-8172-52fa-b0b1-b4c3d4f4c287', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('e1b11915-2a81-5389-9006-57ac5d3f0c1c'::uuid, 'data-analyst', 'benchmark-technology/9451272d-a996-54fa-a3db-118551abb542', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('51f2f6a3-d50e-58f7-a6b4-933c9f5f461c'::uuid, 'data-analyst', 'benchmark-technology/9b2e4783-4055-5310-8a75-72b2dc64ca12', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('260f95b5-c586-5e08-8553-1bf05a55b405'::uuid, 'data-analyst', 'benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('8766174e-d0ca-526f-96d4-aa5002afee2f'::uuid, 'data-analyst', 'benchmark-technology/b71a600e-0f56-533a-a21a-7a97661fda3a', 3, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('2504ab8c-c2bf-594b-8f45-99a2121c270b'::uuid, 'data-analyst', 'benchmark-technology/bf9a8743-40df-5622-afae-833de0d53651', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('623fbaa1-0285-5609-9172-e3da31aec104'::uuid, 'data-analyst', 'benchmark-technology/bfc31ea8-5cd0-5a70-9a1e-39422a5a06c9', 2, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('567d5627-e1e5-588b-acea-ba52d36a1af8'::uuid, 'data-analyst', 'benchmark-technology/c904898e-08f4-5b07-8ed2-224708de7e47', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('07edae9c-6a77-5e92-acd0-5685c4440cea'::uuid, 'data-analyst', 'benchmark-technology/df3f037c-c6e1-5b12-b7ed-f1fa91be621e', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('ad3d2612-f924-51bd-94e5-eca465ca42e3'::uuid, 'data-analyst', 'benchmark-technology/e0f7a7f7-7940-5da4-a136-2afc4037db54', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('6c25c7a3-1c22-5d41-8aa3-f05fee5ee25c'::uuid, 'data-analyst', 'benchmark-technology/e41a2620-39fe-5250-9d48-4235fdffdcab', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('66c394bc-5abc-5819-8997-117052f603c5'::uuid, 'data-analyst', 'benchmark-technology/ece87f9e-8e39-5183-965e-23b8ba314fd3', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('baa1b442-fd42-59b2-b8fe-173f58fc19d4'::uuid, 'data-analyst', 'benchmark-technology/f02aed85-3ddb-5ded-b34e-a96bc7781177', 1, 4, 'ph_postings_collected', '2026-11-19-v1'),
        ('e97ebf6c-72ec-59fd-b7a0-e04cf7316a5d'::uuid, 'data-engineer', 'benchmark-technology/1406f5c4-396b-5760-89a7-b084aa303462', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('caed5459-6f1e-5798-9129-05486ebef793'::uuid, 'data-engineer', 'benchmark-technology/27a295ae-fa71-5811-944d-7f0fcbbea2de', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('541bb523-cbc5-57e5-94d1-d0f12bf9a9f8'::uuid, 'data-engineer', 'benchmark-technology/30a7354e-bcd7-510f-a3ec-cae5bf4e0302', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('c15fc7d1-7117-57a9-a5e7-21fa029f76ee'::uuid, 'data-engineer', 'benchmark-technology/6534bb89-90b6-5f35-bacf-08a13872efcb', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('2518c343-a345-5c0c-be4f-757865a7d08b'::uuid, 'data-engineer', 'benchmark-technology/71bcd1e8-6316-5e28-a580-953514b4577b', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('9544a35f-799a-5351-bfc2-ec5c370547a2'::uuid, 'data-engineer', 'benchmark-technology/740d8b16-14a7-5a1c-a05a-ca999a55a3dc', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('562bdb43-5bae-5b39-a61e-516d74a2b6f6'::uuid, 'data-engineer', 'benchmark-technology/78380cd0-89ef-54a0-b12f-27dafb1b6bf0', 3, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('bd24ca9f-42ab-5197-8b6d-6f9af68e42a8'::uuid, 'data-engineer', 'benchmark-technology/7bd220f2-5ac2-5242-8f6a-dfbe392cceb4', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('ed0131f1-5455-57f1-8dd0-b1ea2be1ffb3'::uuid, 'data-engineer', 'benchmark-technology/91081d06-a82d-5300-bc66-59a3def45aab', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('a0d34527-64fc-565e-8cd0-5abbfe52770a'::uuid, 'data-engineer', 'benchmark-technology/9482e3df-984d-52fa-aa35-9cb37f55ed1b', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('464df130-6de6-5951-bba0-501c70ddb38f'::uuid, 'data-engineer', 'benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d', 3, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('1101096b-b849-510f-946c-fb76e4830f14'::uuid, 'data-engineer', 'benchmark-technology/a8aa8acd-8d45-5138-a046-e5c0c38dfb55', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('c8030eef-2e28-53d4-abf1-54bcf2a172a2'::uuid, 'data-engineer', 'benchmark-technology/cfdce0b2-a1e4-5166-aa51-895c550a06a1', 3, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('9acc3ca6-3dcb-50ce-a850-67071a6a6e49'::uuid, 'data-engineer', 'benchmark-technology/e41a2620-39fe-5250-9d48-4235fdffdcab', 3, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('c56c3e6b-7676-5be7-9013-d3ebe2544118'::uuid, 'data-engineer', 'benchmark-technology/f02aed85-3ddb-5ded-b34e-a96bc7781177', 2, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('a1801357-657b-5e3f-ac61-e78fdf3ec3fd'::uuid, 'data-engineer', 'benchmark-technology/fbdf3faa-87d6-56a0-8bc0-5e45eb45bb2a', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('ce14af4f-f60c-5576-8b1a-f9b72a4e0f32'::uuid, 'devops-engineer', 'benchmark-technology/1513447c-e4e9-5b10-bc04-36f9b8ab702b', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('8a554361-bd75-5931-b6a1-40777d048da0'::uuid, 'devops-engineer', 'benchmark-technology/1894a26d-5eab-5d34-abd3-a475fa3f1b97', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('9f15c29e-ed5e-5ba0-879e-add16c319487'::uuid, 'devops-engineer', 'benchmark-technology/1f3dd628-5803-5e87-8fdf-daaeb9fd5d2c', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('1c3db797-ec1f-5fe0-b041-3a1df6553c28'::uuid, 'devops-engineer', 'benchmark-technology/275269a6-bfac-5e6d-b4d5-56d62c18a670', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('94c50c95-0796-551b-bff6-f9a39ba716a3'::uuid, 'devops-engineer', 'benchmark-technology/2ca6d403-37f9-5c1c-9e9d-d28d92660982', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('06d89fcf-beac-5139-a7d0-9673b66c32c1'::uuid, 'devops-engineer', 'benchmark-technology/2ff23fbf-9e19-5985-b55a-8ff0c0004be5', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('7fd69b7f-ecf4-535b-bec7-95767daf0bd1'::uuid, 'devops-engineer', 'benchmark-technology/30a7354e-bcd7-510f-a3ec-cae5bf4e0302', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('7fe02615-3e46-5d4a-ad53-652459806002'::uuid, 'devops-engineer', 'benchmark-technology/6d15c51b-daa4-51fb-8fb8-97546675c319', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('12e03ecd-4706-5985-9e0b-0b14a71154c6'::uuid, 'devops-engineer', 'benchmark-technology/6f78319d-0781-59c6-ac9c-e1532ebc8ffb', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('ddbb3877-724d-539e-8d76-39b749602292'::uuid, 'devops-engineer', 'benchmark-technology/724f1cf6-cbf5-5cce-9aa3-03fe7079e10b', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('1af466fa-7eac-5093-93f7-52ec58541574'::uuid, 'devops-engineer', 'benchmark-technology/9114466d-51e4-5ba2-a526-3b73bee23c35', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('f4e603a9-679d-52db-930f-75d86fa99491'::uuid, 'devops-engineer', 'benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('37db7367-2e67-538b-b7af-a5b7133c6e9d'::uuid, 'devops-engineer', 'benchmark-technology/dd7261f1-4531-5376-9bee-2c5d473074e2', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('b2dbf418-9411-5bde-8325-edeb29a5063a'::uuid, 'devops-engineer', 'benchmark-technology/ec0aa230-fca3-5863-9029-d8628e8d86db', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('79857b7d-8de9-507f-b4c6-7c9ef7ca0b1d'::uuid, 'devops-engineer', 'benchmark-technology/eddcc0a5-b4b4-57f0-bcbc-bc841b43ca7f', 2, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('6b4df4a8-fd0c-5a44-8871-8c2535fb6271'::uuid, 'embedded-systems-developer', 'benchmark-technology/032c9bf5-c07e-5883-ba9f-fab2abb86d20', 2, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('57580be5-034f-582f-927a-b2fa80496252'::uuid, 'embedded-systems-developer', 'benchmark-technology/3581d0d2-bee4-588b-9b2a-0ab4564b1738', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('b438c372-5e6b-55e6-b5ad-f8082fcf23e7'::uuid, 'embedded-systems-developer', 'benchmark-technology/490a8563-fa33-5057-8379-3e40dc2c04c6', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('ea258dc2-6442-5c8e-b0ae-f66e219f3a96'::uuid, 'embedded-systems-developer', 'benchmark-technology/5baab1ed-24bb-59b6-8375-d4ac20be8d44', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('3fd9bf0d-b6d2-5c42-8e72-1014b646e3c5'::uuid, 'embedded-systems-developer', 'benchmark-technology/6ee8e350-c187-5382-bdb0-5aec139630cb', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('1d095c16-2859-5f2d-b5a8-ed4e3e0b6062'::uuid, 'embedded-systems-developer', 'benchmark-technology/7276a5a2-03dd-5db3-902a-714704441917', 2, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('4bda6c68-b240-516f-8534-c99d9f96d7b8'::uuid, 'embedded-systems-developer', 'benchmark-technology/8db76dd7-878e-5a68-a528-634afb69649e', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('568383d3-e6aa-597c-a374-e186f795a860'::uuid, 'embedded-systems-developer', 'benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('bee82573-6423-5271-ab65-23cabde7abe6'::uuid, 'embedded-systems-developer', 'benchmark-technology/a578bd57-b9f8-5a1c-abe2-70473901eea0', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('37d81a31-f4a3-5da5-b27a-2e0539ade5a7'::uuid, 'embedded-systems-developer', 'benchmark-technology/e0846eb8-0d8c-553d-b285-8b9f68b69fba', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('291ecd04-ae02-53bd-95ab-6ebfcb4b92d9'::uuid, 'frontend', 'benchmark-technology/4e7ccaa5-a34e-5d33-96c4-ee4819af9ee5', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('158dabf5-9dc4-5390-9cde-945a3e82ec20'::uuid, 'frontend', 'benchmark-technology/5dfc5f19-24f7-5909-82ac-b8e031c95268', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('6524be35-53ff-5c15-8c7c-0c28f7916028'::uuid, 'frontend', 'benchmark-technology/5fcd34d5-4b5b-5665-8d23-5485d0bd11b6', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('302de0ba-df4a-5bc9-b0ab-9354f696322a'::uuid, 'frontend', 'benchmark-technology/7d9c1caf-faec-57a1-8828-59d50e7238fa', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('0efd8d09-bda1-5f76-b6a8-7185b367c081'::uuid, 'frontend', 'benchmark-technology/8e99d77c-6b39-53f7-9cf2-eb7c16890dab', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('c863eb7f-e992-5c84-9f4c-c4038e3f08eb'::uuid, 'frontend', 'benchmark-technology/be6d1d57-0e91-5e0a-a006-8a6de57bd976', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('86075176-9511-5363-a95e-131d3328b6e0'::uuid, 'frontend', 'benchmark-technology/e1d085a0-e709-5bd4-a69a-23d42378a08b', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('6614d538-72f4-5eb0-bfe0-1919451054e6'::uuid, 'frontend', 'benchmark-technology/e23d4cf9-4e09-5431-87e5-2e3cf1c652d0', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('76c1e272-b82f-50bd-97c9-a8b656544d84'::uuid, 'frontend', 'benchmark-technology/e8ebcf16-888e-5cc6-a186-ceb9f420cb70', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('03b4e32d-2c8a-503c-a3a4-46a3b43a6b87'::uuid, 'frontend', 'benchmark-technology/e9b5619f-7fba-573c-823d-ae48d0cd9b1d', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('4081801d-2f1d-51d8-8bd0-1a17d193c3f1'::uuid, 'frontend', 'benchmark-technology/f923e7dc-ff6f-5359-8c2b-999fd3eedc55', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('6677efaf-9329-55a3-af81-1cc765ff0fc7'::uuid, 'machine-learning-engineer', 'benchmark-technology/17183ef9-5ad9-57cf-828d-46aac94f63e0', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('367d1801-6f78-5258-9d5f-800a55f37375'::uuid, 'machine-learning-engineer', 'benchmark-technology/24d34c35-9178-5569-bd52-f69bdc646000', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('09400c6b-7aef-5eaf-9f45-2fd90d363ec5'::uuid, 'machine-learning-engineer', 'benchmark-technology/4167a417-4d3f-52fa-9953-ce69429c0f71', 2, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('95c83883-7f0f-5204-a7b1-ec8b5e9a96bb'::uuid, 'machine-learning-engineer', 'benchmark-technology/6580da18-51a6-51de-be84-aee1d2cac123', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('1e15cbb1-1741-5dfe-991e-9a663cbbf2a1'::uuid, 'machine-learning-engineer', 'benchmark-technology/8796a229-1a74-5183-8d9e-2180e2fb697b', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('4036d86c-4b90-5a76-a522-2e4b56c87a23'::uuid, 'machine-learning-engineer', 'benchmark-technology/a2f29ebf-e4df-5929-b3a9-853264eb013d', 3, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('5ef2bf0a-a13b-5f40-8d37-612c176b560b'::uuid, 'machine-learning-engineer', 'benchmark-technology/ba722672-28fb-54b7-abc8-53c6e3c1a584', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('95a6cd47-efda-5411-82dd-2a34d144e1d5'::uuid, 'machine-learning-engineer', 'benchmark-technology/c0ed3983-2785-5bce-ad72-7d1d0e365ea5', 2, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('af2b581a-d40f-5348-886a-52a90dfcb7e6'::uuid, 'machine-learning-engineer', 'benchmark-technology/c2e6e967-6077-5054-aef5-ae59b60eb1c4', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('16271fbf-57f1-503f-a9df-781bcf429da9'::uuid, 'machine-learning-engineer', 'benchmark-technology/c5c71509-7144-5d99-bd10-1681b42c4283', 3, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('5c375afc-e9e7-5625-95ec-95d0ac90870d'::uuid, 'machine-learning-engineer', 'benchmark-technology/e7e2bc6e-85e2-541b-b410-9fbc5648098c', 1, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('79b5ab30-1a31-571a-9f57-5a1c2b7016a3'::uuid, 'machine-learning-engineer', 'benchmark-technology/f8836040-ddd3-5721-96ea-a6c3b2529e15', 2, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('6a205d33-6f08-5a45-8ef8-cc8b861d911f'::uuid, 'machine-learning-engineer', 'benchmark-technology/f8f5359e-1b72-5d0a-a40f-70dc7f7815c8', 2, 3, 'ph_postings_collected', '2026-11-19-v1'),
        ('16d186d3-e4d5-5350-876e-ba8cb48b2394'::uuid, 'network-engineer', 'benchmark-technology/0220c67d-1683-57d6-8dbd-6280e6f6ce95', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('fd5d98e7-c12a-5315-b5ce-e55a9a03fa4a'::uuid, 'network-engineer', 'benchmark-technology/3b3e082d-616b-5423-b54d-197887b82a9c', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('182c6892-baa3-5856-aa1d-e4faaf170142'::uuid, 'network-engineer', 'benchmark-technology/4d559fb4-41db-5f39-aaf6-b952dfbefce1', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('e6327e18-0cbe-5f2c-9dc0-7f602f5d341c'::uuid, 'network-engineer', 'benchmark-technology/86c89d95-1605-5db2-a8d1-b3c2f4b27a4a', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('97e70ffa-3c40-5ebc-966e-f7b19c9996ed'::uuid, 'network-engineer', 'benchmark-technology/9fb24cc9-6254-5539-a492-24a1f7494c63', 2, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('c2c08a68-eebf-570d-8c39-6ce4a3ca6dda'::uuid, 'network-engineer', 'benchmark-technology/a0335f3f-9e83-5ce0-8d0f-4a4421ce7d2b', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('0c3b902c-9acf-5f16-a75d-b35b89baae66'::uuid, 'network-engineer', 'benchmark-technology/acbe996d-d3d8-5c5e-b72a-64cfbc1fd3cf', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('a977500b-71fa-58db-9a24-885d4c40fe83'::uuid, 'network-engineer', 'benchmark-technology/aeda3f31-1acb-5a5d-bab0-2674db85951b', 2, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('17fd1f76-13af-59d5-aca9-bf7effce5b3b'::uuid, 'network-engineer', 'benchmark-technology/be93acfc-7fbf-5b76-b207-ac01ae98425b', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('742ed532-b960-5ac0-a0dd-57cb1524a254'::uuid, 'network-engineer', 'benchmark-technology/cb1d1a5d-3ba2-56ec-8c1e-d1d7fd179202', 2, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('24aa5266-d63f-5191-a899-4c637e1fb4e9'::uuid, 'network-engineer', 'benchmark-technology/e607b1f9-0a8e-504a-a86e-6b700c40af40', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('f3edd11c-b49c-5a14-9b6d-6f80a01ff836'::uuid, 'network-engineer', 'benchmark-technology/ef8aa0f9-f68f-5ef8-b7e6-5a0c3bba824a', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('45411134-7b76-509a-ac34-de78d36a61e7'::uuid, 'network-engineer', 'benchmark-technology/f5fa4836-4f79-51fc-9a0b-f4b70c12e16b', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('f9c51f4d-8cf6-599f-bc9e-f698cb37c552'::uuid, 'network-engineer', 'benchmark-technology/f6ca09ae-4d9d-550e-a7e4-44208f108194', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('0f1089af-7b34-5c1b-9104-f28eeee07fb8'::uuid, 'penetration-tester', 'benchmark-technology/0220c67d-1683-57d6-8dbd-6280e6f6ce95', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('e8227e84-c7a2-5559-82f1-e9965089a889'::uuid, 'penetration-tester', 'benchmark-technology/25579676-9e77-5039-baca-19f1efd23455', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('6d02772c-b4b0-586b-84e3-177d31974b2f'::uuid, 'penetration-tester', 'benchmark-technology/5baab1ed-24bb-59b6-8375-d4ac20be8d44', 2, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('8cfdd377-30dd-543e-8e4c-ae0d8f60f498'::uuid, 'penetration-tester', 'benchmark-technology/98cac714-dc4f-5d8e-9368-b4d2f5033835', 2, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('b1e35d8d-05fa-57cf-a919-0b2a28256f69'::uuid, 'penetration-tester', 'benchmark-technology/9f644a14-8e75-5600-8a23-81c32d9f82aa', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('06caa4ce-0acd-53a4-89ba-17701bee7d87'::uuid, 'penetration-tester', 'benchmark-technology/d60a4fd1-87b9-5da1-a0d6-894ad66a8711', 2, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('f843bb0a-c321-5945-9e7e-5eacdec1163f'::uuid, 'penetration-tester', 'benchmark-technology/e3ab3aca-bfa6-5da8-aa03-608606c5b92e', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('c8cca24e-9540-5485-a9f0-30d0848fd904'::uuid, 'penetration-tester', 'benchmark-technology/e8df9d5b-3714-562b-82f3-9e4f9b1ce7f1', 1, 2, 'ph_postings_collected', '2026-11-19-v1'),
        ('3c41d7e7-fc7c-5b53-a5c9-ac47347b9fe9'::uuid, 'ux-designer', 'benchmark-technology/0aac9c2c-5213-5104-a813-5043fa46a8d1', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('e2e0d629-b21f-560d-a7d7-d8d3bf4a4714'::uuid, 'ux-designer', 'benchmark-technology/12d0fca9-c1cc-5995-a40c-caaa6734aa7e', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('b5f88d86-e15c-5718-b9a4-ab105ec0dac7'::uuid, 'ux-designer', 'benchmark-technology/1a80f4c6-5221-59d2-9b32-64100fd4e791', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('765ce222-700d-5f2b-b1d9-6b6201e7009c'::uuid, 'ux-designer', 'benchmark-technology/1bc9e6b2-8deb-5c50-82a3-2cea17a4c6af', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('1ca0aaa2-40f7-530d-98ec-f56d44ff688a'::uuid, 'ux-designer', 'benchmark-technology/419bdec5-97db-5a9a-8faa-60e7d6348aa9', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('70958bfe-87ab-54e0-addc-d0923a6a53ad'::uuid, 'ux-designer', 'benchmark-technology/56378905-9fa0-57f0-81fd-c91f06221dea', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('6e2e0241-d03c-5b17-8724-a50f70099299'::uuid, 'ux-designer', 'benchmark-technology/7689afa2-1aa1-5263-ab5b-cb4b12972403', 1, 1, 'ph_postings_collected', '2026-11-19-v1'),
        ('20be453b-a1b1-5b3d-885b-bb65f95c039b'::uuid, 'ux-designer', 'benchmark-technology/f59d5514-05b6-54ce-9221-61368aac065a', 1, 1, 'ph_postings_collected', '2026-11-19-v1')) AS input(snapshot_id, career_key, competency_key,
       posting_count, total_postings, source, source_version)
     JOIN asgard_catalog.career_skill_snapshot actual ON actual.id=input.snapshot_id
       AND actual.source=input.source AND actual.source_version=input.source_version
       AND actual.posting_count=input.posting_count
       AND actual.total_postings=input.total_postings) <> 120 THEN
  RAISE EXCEPTION 'Snapshot contents conflict with reviewed input';
 END IF;
END $import_count$;


SELECT pg_advisory_xact_lock(hashtextextended('asgard:career-skill-postings:ph_postings_collected', 411));
DO $posting_draft_guard$
BEGIN
    IF EXISTS (
        SELECT 1 FROM asgard_catalog.career_skill_posting_versions
        WHERE source = 'ph_postings_collected'
          AND source_version = '2026-11-19-v1'
          AND status <> 'draft'
    ) THEN
        RAISE EXCEPTION 'Published or retired posting versions cannot be replaced by a draft';
    END IF;
    IF EXISTS (
        SELECT 1 FROM (VALUES
        ('ph_001', 'cybersecurity-analyst'),
        ('ph_002', 'penetration-tester'),
        ('ph_003', 'network-engineer'),
        ('ph_004', 'network-engineer'),
        ('ph_005', 'devops-engineer'),
        ('ph_006', 'devops-engineer'),
        ('ph_007', 'data-analyst'),
        ('ph_008', 'data-analyst'),
        ('ph_009', 'data-analyst'),
        ('ph_010', 'data-analyst'),
        ('ph_011', 'data-engineer'),
        ('ph_012', 'data-engineer'),
        ('ph_013', 'machine-learning-engineer'),
        ('ph_014', 'frontend'),
        ('ph_015', 'frontend'),
        ('ph_016', 'embedded-systems-developer'),
        ('ph_017', 'ux-designer'),
        ('ph_018', 'data-engineer'),
        ('ph_019', 'penetration-tester'),
        ('ph_020', 'machine-learning-engineer'),
        ('ph_021', 'machine-learning-engineer'),
        ('ph_022', 'embedded-systems-developer')) AS input(posting_id, career_key)
        LEFT JOIN asgard_catalog.careers AS career ON career.slug = input.career_key
        WHERE career.id IS NULL
    ) THEN
        RAISE EXCEPTION 'Career postings contain an unresolved career key';
    END IF;
END
$posting_draft_guard$;
INSERT INTO asgard_catalog.career_skill_posting_versions
    (source, source_version, input_row_count, verified_row_count, posting_count, status)
VALUES (
    'ph_postings_collected', '2026-11-19-v1', 22,
    22, 22, 'draft'
)
ON CONFLICT (source, source_version) DO UPDATE
SET input_row_count = EXCLUDED.input_row_count,
    verified_row_count = EXCLUDED.verified_row_count,
    posting_count = EXCLUDED.posting_count
WHERE asgard_catalog.career_skill_posting_versions.status = 'draft';
DELETE FROM asgard_catalog.career_skill_postings
WHERE source = 'ph_postings_collected'
  AND source_version = '2026-11-19-v1';
WITH input(source, source_version, posting_id, career_key, job_title, company,
           source_url, retrieved_on, skill_labels, collected_by, record_reviewed_by) AS (
    VALUES
        ('ph_postings_collected', '2026-11-19-v1', 'ph_001', 'cybersecurity-analyst', 'Junior Cybersecurity Analyst', 'Lanturn', 'https://ph.linkedin.com/jobs/view/junior-cybersecurity-analyst-at-lanturn-4490269198', '2026-11-18'::date, ARRAY['ISO 27001', 'Vulnerability Management', 'Penetration Testing', 'Linux', 'Python', 'Microsoft 365']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_002', 'penetration-tester', 'Penetration Tester', 'Willis Towers Watson', 'https://ph.jobstreet.com/job/89180303', '2026-11-18'::date, ARRAY['Penetration Testing', 'Vulnerability Assessment', 'OWASP Top 10', 'Security Testing', 'Scripting', 'Cloud Security']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_003', 'network-engineer', 'Network Engineer', 'IBEX Global Solutions (Philippines) Inc.', 'https://ph.jobstreet.com/job/95954371', '2026-11-18'::date, ARRAY['Cisco Networking', 'Routing and Switching', 'VLAN', 'OSPF', 'BGP', 'Cisco Firewalls', 'VPN', 'Network Security']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_004', 'network-engineer', 'Network Engineer', 'Rising Tide Digital Inc.', 'https://ph.jobstreet.com/job/95892679', '2026-11-18'::date, ARRAY['Cisco Networking', 'Routing and Switching', 'SolarWinds', 'ServiceNow', 'TCP/IP', 'DNS', 'DHCP', 'VPN', 'Network Monitoring']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_005', 'devops-engineer', 'Infrastructure/DevOps Trainee', 'Questronix Corporation', 'https://apply.workable.com/questronix-corporation-2/j/C212082A67/', '2026-11-18'::date, ARRAY['Linux', 'Windows Server', 'Networking', 'Jenkins', 'CI/CD', 'Bash', 'Python', 'Cloud Infrastructure']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_006', 'devops-engineer', 'DevOps Engineer', 'Thoughtgears Bali', 'https://ph.jobstreet.com/job/95925114', '2026-11-18'::date, ARRAY['Terraform', 'Kubernetes', 'CI/CD', 'AWS', 'GCP', 'Infrastructure as Code', 'Docker', 'Monitoring']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_007', 'data-analyst', 'Junior Data Analyst - Governance Data', 'ISS STOXX', 'https://issgovernance.wd1.myworkdayjobs.com/en-US/ISScareers/job/Junior-Data-Analyst---Governance-Data--Open-to-Fresh-Graduates-_JR_10327', '2026-11-18'::date, ARRAY['Data Collection', 'Data Validation', 'Data Analysis', 'Root Cause Analysis', 'MS Office', 'Data Quality']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_008', 'data-analyst', 'Data Analyst (Pricing)', 'Hammerjack', 'https://ph.jobstreet.com/job/95956588', '2026-11-18'::date, ARRAY['Excel', 'Pricing Analysis', 'Data Analysis', 'ERP', 'Data Auditing', 'Reporting', 'Margin Analysis']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_009', 'data-analyst', 'Data Analyst', 'KM ACE Towing Services', 'https://ph.jobstreet.com/job/95932122', '2026-11-18'::date, ARRAY['SQL', 'Excel', 'Power BI', 'Data Analysis', 'Dashboard Development', 'Data Reporting', 'Python']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_010', 'data-analyst', 'Business Intelligence / Reporting / Data Analyst', 'iOPEX Tech', 'https://ph.jobstreet.com/job/95893659', '2026-11-18'::date, ARRAY['Data Analysis', 'Data Collection', 'Dashboard Development', 'Reporting', 'Process Improvement', 'Data Interpretation', 'Excel']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_011', 'data-engineer', 'Junior Data Engineer', 'Angkas', 'https://www.metaintro.com/job/junior-data-engineer-at-angkas-d8f391f9-a595-5d71-951f-93ad11f0a111', '2026-11-18'::date, ARRAY['SQL', 'Python', 'ETL/ELT', 'Data Pipelines', 'Data Quality', 'Google Cloud', 'Git', 'Airflow']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_012', 'data-engineer', 'Jr-Mid AWS Data Engineer', 'Ascendion', 'https://ph.jobstreet.com/job/95773436', '2026-11-18'::date, ARRAY['Python', 'SQL', 'AWS', 'ETL/ELT', 'Data Pipelines', 'Data Integration', 'Data Warehousing', 'Data Quality', 'Apache Airflow']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_013', 'machine-learning-engineer', 'Junior Data Scientist', 'COPIAS DataTech Solutions', 'https://ph.linkedin.com/jobs/view/junior-data-scientist-at-copias-datatech-solutions-cdts-4484822135', '2026-11-18'::date, ARRAY['Python', 'Machine Learning', 'Predictive Modeling', 'Statistical Modeling', 'Model Evaluation', 'Data Preparation', 'Exploratory Data Analysis']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_014', 'frontend', 'Junior IT/AI Specialist (Frontend Developer / UI-UX Designer)', 'Discover Group of Travel Services Inc.', 'https://ph.jobstreet.com/job/95882023', '2026-11-18'::date, ARRAY['HTML', 'CSS', 'JavaScript', 'React', 'API Integration', 'Responsive Design']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_015', 'frontend', 'Junior Front-End Developer', 'Webforest Digital Solutions', 'https://ph.jobstreet.com/job/95849981', '2026-11-18'::date, ARRAY['Web Development', 'UI Implementation', 'Debugging', 'Cross-Browser Compatibility', 'Code Reviews']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_016', 'embedded-systems-developer', 'Associate Engineer Embedded Software', 'Analog Devices', 'https://semiconductor.cv/jobs/analog-devices-associate-engineer-embedded-software-bonifacio-global-city-975561', '2026-11-18'::date, ARRAY['Embedded C/C++', 'Software Debugging', 'Version Control', 'Hardware Integration', 'Code Optimization', 'Software Testing']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_017', 'ux-designer', 'Platforms Designer (UI/UX)', 'STARBREAKER CORP', 'https://ph.jobstreet.com/job/95693102', '2026-11-18'::date, ARRAY['User Research', 'User Interviews', 'Usability Testing', 'User Journeys', 'Information Architecture', 'Interaction Design', 'Prototyping', 'Design Systems']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_018', 'data-engineer', 'Data Engineer', 'Viventis Search Asia', 'https://ph.jobstreet.com/job/95536874', '2026-11-18'::date, ARRAY['Python', 'SQL', 'ETL/ELT', 'Data Pipelines', 'Data Architecture', 'Relational Databases', 'NoSQL', 'AI Orchestration']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_019', 'penetration-tester', 'Cybersecurity Penetration Tester', 'SD Solutions I.T. Outsourcing Inc.', 'https://ph.jobstreet.com/job/95411868', '2026-11-18'::date, ARRAY['Penetration Testing', 'Vulnerability Assessment', 'Security Testing', 'Network Security', 'Web Application Security']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_020', 'machine-learning-engineer', 'Machine Learning Engineer', 'OmniQuest Inc.', 'https://ph.jobstreet.com/job/95517752', '2026-11-18'::date, ARRAY['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Feature Engineering', 'Model Evaluation', 'Model Deployment']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_021', 'machine-learning-engineer', 'Machine Learning Engineer', 'Ubiquity', 'https://ph.jobstreet.com/job/95696374', '2026-11-18'::date, ARRAY['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Model Deployment', 'Microservices']::text[], 'SKyle', 'YakisobaNissin'),
        ('ph_postings_collected', '2026-11-19-v1', 'ph_022', 'embedded-systems-developer', 'Embedded Software Test Engineer', 'Emerson Electric (Asia) Limited - ROHQ', 'https://ph.jobstreet.com/job/95801969', '2026-11-18'::date, ARRAY['Software Testing', 'Embedded Software Validation', 'Regression Testing', 'Security Testing', 'Python', 'Hardware Integration']::text[], 'SKyle', 'YakisobaNissin')
)
INSERT INTO asgard_catalog.career_skill_postings
    (source, source_version, posting_id, career_id, job_title, company, source_url,
     retrieved_on, skill_labels, collected_by, reviewed_by)
SELECT input.source, input.source_version, input.posting_id, career.id,
       input.job_title, input.company, input.source_url, input.retrieved_on,
       input.skill_labels, input.collected_by, input.record_reviewed_by
FROM input
JOIN asgard_catalog.careers AS career ON career.slug = input.career_key;


SELECT pg_advisory_xact_lock(411, 4);
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM asgard_catalog.career_skill_snapshot
   WHERE source='ph_postings_collected' AND source_version='2026-11-19-v1') THEN
  RAISE EXCEPTION 'Cannot publish an empty benchmark snapshot';
 END IF;
END $$;
UPDATE asgard_catalog.career_skill_snapshot
SET published = true, reviewed_by = 'YakisobaNissin', reviewed_at = now()
WHERE source = 'ph_postings_collected'
  AND source_version = '2026-11-19-v1'
  AND NOT published;


SELECT pg_advisory_xact_lock(hashtextextended('asgard:career-skill-postings:ph_postings_collected', 411));
DO $posting_publish_guard$
DECLARE target asgard_catalog.career_skill_posting_versions%ROWTYPE;
        actual_posting_count integer;
BEGIN
    SELECT * INTO target
    FROM asgard_catalog.career_skill_posting_versions
    WHERE source = 'ph_postings_collected'
      AND source_version = '2026-11-19-v1'
    FOR UPDATE;
    IF NOT FOUND OR target.status <> 'draft' THEN
        RAISE EXCEPTION 'Target career posting version is not an unpublished draft';
    END IF;
    IF target.input_row_count < 15 OR target.verified_row_count < 5
       OR target.posting_count < 1 THEN
        RAISE EXCEPTION 'Career posting version does not meet publication requirements';
    END IF;
    SELECT count(*) INTO actual_posting_count
    FROM asgard_catalog.career_skill_postings
    WHERE source = target.source AND source_version = target.source_version;
    IF actual_posting_count <> target.posting_count THEN
        RAISE EXCEPTION 'Career posting draft row count does not match its manifest';
    END IF;
END
$posting_publish_guard$;
UPDATE asgard_catalog.career_skill_posting_versions
SET status = 'retired', retired_at = now()
WHERE source = 'ph_postings_collected' AND status = 'published';
UPDATE asgard_catalog.career_skill_posting_versions
SET status = 'published', reviewed_by = 'YakisobaNissin',
    reviewed_at = now(), published_at = now()
WHERE source = 'ph_postings_collected'
  AND source_version = '2026-11-19-v1'
  AND status = 'draft';

COMMIT;
