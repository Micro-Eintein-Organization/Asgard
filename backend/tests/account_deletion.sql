-- Run after the migration inside a rollback-only local transaction.
INSERT INTO auth.users(id,aud,role,email,email_confirmed_at) VALUES
 ('10000000-0000-4000-8000-000000000001','authenticated','authenticated','delete-a@example.invalid',now()),
 ('10000000-0000-4000-8000-000000000002','authenticated','authenticated','delete-b@example.invalid',now());
INSERT INTO auth.sessions(id,user_id,created_at,updated_at) VALUES
 ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001',now(),now());
SET LOCAL ROLE asgard_app;
SELECT set_config('asgard.user_id','10000000-0000-4000-8000-000000000001',true);
DO $$ BEGIN
 IF NOT asgard_private.session_allowed('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','aal1') THEN
 RAISE EXCEPTION 'valid fixture session rejected'; END IF;
END $$;
INSERT INTO asgard_private.account_deletions(user_id,request_id)
 VALUES('10000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001');
DO $$ BEGIN
 IF asgard_private.session_allowed('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','aal1') THEN
 RAISE EXCEPTION 'deletion did not block existing session'; END IF;
 BEGIN
 INSERT INTO asgard_private.account_deletions(user_id,request_id)
 VALUES('10000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000002');
 RAISE EXCEPTION 'cross-account insertion succeeded';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
SELECT set_config('asgard.user_id','10000000-0000-4000-8000-000000000002',true);
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM asgard_private.account_deletions) THEN
 RAISE EXCEPTION 'cross-account ledger read succeeded'; END IF;
END $$;
RESET ROLE;
DELETE FROM auth.users WHERE id='10000000-0000-4000-8000-000000000001';
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM asgard_private.account_deletions WHERE user_id='10000000-0000-4000-8000-000000000001') THEN
 RAISE EXCEPTION 'Auth deletion erased the ledger'; END IF;
END $$;
SET LOCAL ROLE asgard_maintenance;
INSERT INTO asgard_private.deletion_maintenance_runs(id,processed,failed)
 VALUES('40000000-0000-4000-8000-000000000001',0,0);
SELECT count(*) AS maintenance_ledger_count FROM asgard_private.account_deletions;
DO $$ BEGIN
 BEGIN
 INSERT INTO asgard_private.account_deletions(user_id,request_id)
 VALUES('10000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000002');
 RAISE EXCEPTION 'maintenance invented a deletion request';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
 UPDATE asgard_private.account_deletions SET accepted_at=now();
 RAISE EXCEPTION 'maintenance changed immutable acceptance';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 DELETE FROM asgard_private.account_deletions;
 IF NOT EXISTS(SELECT 1 FROM asgard_private.account_deletions) THEN
 RAISE EXCEPTION 'maintenance pruned an incomplete deletion'; END IF;
END $$;
RESET ROLE;
