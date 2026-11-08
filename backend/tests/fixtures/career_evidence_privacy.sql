-- Disposable fixture only: requires synthetic Auth metadata, current migrations,
-- published catalog/skills and both proposed occupational/privacy migrations.
BEGIN;
INSERT INTO auth.users(id,email_confirmed_at) VALUES
 ('10000000-0000-4000-8000-000000000001',statement_timestamp()),
 ('10000000-0000-4000-8000-000000000002',statement_timestamp());
INSERT INTO auth.sessions(id,user_id) VALUES
 ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001'),
 ('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002');
SET LOCAL ROLE asgard_app;
SELECT set_config('asgard.user_id','10000000-0000-4000-8000-000000000001',true);
DO $$
DECLARE skill uuid; career uuid; roadmap uuid; release uuid; target uuid; pending uuid; revision bigint;
BEGIN
 SELECT c.id,l.career_id,l.roadmap_id INTO skill,career,roadmap
 FROM asgard_catalog.competencies c JOIN asgard_catalog.competency_links l ON l.competency_id=c.id
 ORDER BY c.id LIMIT 1;
 SELECT id INTO release FROM asgard_catalog.releases ORDER BY version DESC LIMIT 1;
 IF asgard_private.mutate_reported_skill('20000000-0000-4000-8000-000000000001',
  'aal1',skill,0,0,false)<>1 THEN RAISE EXCEPTION 'Initial version mismatch'; END IF;
 SELECT context_revision INTO revision FROM asgard_private.learning_state
  WHERE user_id='10000000-0000-4000-8000-000000000001';
 INSERT INTO asgard_private.recommendation_runs(user_id,context_revision,catalog_release_id,
  prompt_version,schema_version,idempotency_key,context_snapshot,deadline_at)
 VALUES('10000000-0000-4000-8000-000000000001',revision,release,'fixture','fixture',gen_random_uuid(),
  jsonb_build_object('context',jsonb_build_object('schema_version','2','skill_profile_version',1,
    'occupational_release_id',NULL,'facts',jsonb_build_array(jsonb_build_object(
      'source','reported_skill','source_id',skill)))),statement_timestamp()+interval '30 seconds')
 RETURNING id INTO target;
 INSERT INTO asgard_private.recommendation_items(user_id,run_id,position,career_id,roadmap_id,
  reason,evidence_fact_ids) VALUES('10000000-0000-4000-8000-000000000001',target,0,career,roadmap,
  'Synthetic result cites a different fact; input skill is deliberately uncited.',ARRAY['other-fact']);
 UPDATE asgard_private.recommendation_runs SET status='completed',finished_at=statement_timestamp()
  WHERE id=target;
 INSERT INTO asgard_private.recommendation_runs(user_id,context_revision,catalog_release_id,
  prompt_version,schema_version,idempotency_key,context_snapshot,deadline_at)
 VALUES('10000000-0000-4000-8000-000000000001',revision,release,'fixture','fixture',gen_random_uuid(),
  jsonb_build_object('context',jsonb_build_object('schema_version','2','skill_profile_version',1,
    'occupational_release_id',NULL,'facts',jsonb_build_array(jsonb_build_object(
      'source','reported_skill','source_id',skill)))),statement_timestamp()+interval '30 seconds')
 RETURNING id INTO pending;
 PERFORM asgard_private.mutate_reported_skill('20000000-0000-4000-8000-000000000001',
  'aal1',skill,1,1,false);
 IF EXISTS(SELECT 1 FROM asgard_private.recommendation_items WHERE run_id=target)
  OR EXISTS(SELECT 1 FROM asgard_private.recommendation_skill_inputs WHERE run_id=target)
  OR NOT EXISTS(SELECT 1 FROM asgard_private.recommendation_runs WHERE id=target
    AND payload_erased_at IS NOT NULL AND context_snapshot='{}'::jsonb AND status='failed') THEN
  RAISE EXCEPTION 'Uncited skill payload was not erased';
 END IF;
 IF NOT EXISTS(SELECT 1 FROM asgard_private.recommendation_runs WHERE id=pending
  AND payload_erased_at IS NOT NULL AND status='failed' AND context_snapshot='{}'::jsonb) THEN
  RAISE EXCEPTION 'Pending generation was not erased'; END IF;
 BEGIN
  INSERT INTO asgard_private.recommendation_items(user_id,run_id,position,career_id,roadmap_id,
   reason,evidence_fact_ids) VALUES('10000000-0000-4000-8000-000000000001',pending,0,career,roadmap,
    'Late provider completion must not restore this result',ARRAY['other-fact']);
  RAISE EXCEPTION 'Late completion restored an erased pending result';
 EXCEPTION WHEN check_violation THEN NULL; END;
 BEGIN
  UPDATE asgard_private.recommendation_runs SET payload_erased_at=NULL WHERE id=target;
  RAISE EXCEPTION 'Erasure marker was mutable';
 EXCEPTION WHEN check_violation THEN NULL; END;
 BEGIN
  INSERT INTO asgard_private.skill_erasure_authorizations
   VALUES('10000000-0000-4000-8000-000000000001',target,txid_current());
  RAISE EXCEPTION 'Runtime manufactured erasure authorization';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  PERFORM asgard_private.mutate_reported_skill('20000000-0000-4000-8000-000000000002',
    'aal1',skill,2,2,false);
  RAISE EXCEPTION 'Another account session was accepted';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  PERFORM asgard_private.mutate_reported_skill('20000000-0000-4000-8000-000000000001',
    'aal1',skill,1,2,false);
  RAISE EXCEPTION 'Stale skill write was accepted';
 EXCEPTION WHEN serialization_failure THEN NULL; END;
 PERFORM asgard_private.mutate_reported_skill('20000000-0000-4000-8000-000000000001',
  'aal1',skill,2,NULL,true);
 PERFORM asgard_private.mutate_reported_skill('20000000-0000-4000-8000-000000000001',
  'aal1',skill,3,NULL,false);
 IF EXISTS(SELECT 1 FROM asgard_private.recommendation_runs WHERE id=target
    AND (context_snapshot<>'{}'::jsonb OR payload_erased_at IS NULL)) THEN
  RAISE EXCEPTION 'Re-addition restored erased context'; END IF;
END $$;
ROLLBACK;
