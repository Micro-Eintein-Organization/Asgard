CREATE TABLE asgard_private.account_deletions (
 user_id uuid PRIMARY KEY, request_id uuid NOT NULL UNIQUE,
 accepted_at timestamptz NOT NULL DEFAULT statement_timestamp(),
 deadline_at timestamptz NOT NULL DEFAULT statement_timestamp()+interval '7 days',
 next_attempt_at timestamptz NOT NULL DEFAULT statement_timestamp()+interval '10 minutes',
 stage text NOT NULL DEFAULT 'storage' CHECK(stage IN ('storage','auth','verify','completed')),
 attempts integer NOT NULL DEFAULT 0, lease_id uuid, lease_until timestamptz,
 failure_code text, completed_at timestamptz
);
ALTER TABLE asgard_private.account_deletions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON asgard_private.account_deletions FROM PUBLIC,anon,authenticated;
GRANT SELECT ON asgard_private.account_deletions TO asgard_app;
GRANT INSERT(user_id,request_id) ON asgard_private.account_deletions TO asgard_app;
CREATE POLICY deletion_owner_read ON asgard_private.account_deletions FOR SELECT TO asgard_app
 USING(user_id=nullif(current_setting('asgard.user_id',true),'')::uuid);
CREATE POLICY deletion_owner_insert ON asgard_private.account_deletions FOR INSERT TO asgard_app
 WITH CHECK(user_id=nullif(current_setting('asgard.user_id',true),'')::uuid);
CREATE OR REPLACE FUNCTION asgard_private.session_allowed(subject uuid, session uuid, assurance text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT NOT EXISTS(SELECT 1 FROM asgard_private.account_deletions d WHERE d.user_id=subject)
 AND EXISTS(SELECT 1 FROM auth.users u JOIN auth.sessions s ON s.user_id=u.id
 WHERE u.id=subject AND s.id=session AND u.email_confirmed_at IS NOT NULL
 AND u.deleted_at IS NULL AND (u.banned_until IS NULL OR u.banned_until<=statement_timestamp())
 AND (assurance='aal2' OR NOT EXISTS(SELECT 1 FROM auth.mfa_factors f
 WHERE f.user_id=u.id AND f.status='verified')));
$$;
REVOKE ALL ON FUNCTION asgard_private.session_allowed(uuid,uuid,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION asgard_private.session_allowed(uuid,uuid,text) TO asgard_app;
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='asgard_maintenance') THEN
 CREATE ROLE asgard_maintenance LOGIN NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE NOINHERIT;
 END IF;
END $$;
GRANT USAGE ON SCHEMA asgard_private TO asgard_maintenance;
GRANT SELECT,DELETE ON asgard_private.account_deletions TO asgard_maintenance;
GRANT UPDATE(stage,attempts,lease_id,lease_until,failure_code,next_attempt_at,completed_at)
 ON asgard_private.account_deletions TO asgard_maintenance;
CREATE POLICY deletion_worker_read ON asgard_private.account_deletions FOR SELECT TO asgard_maintenance USING(true);
CREATE POLICY deletion_worker_update ON asgard_private.account_deletions FOR UPDATE TO asgard_maintenance USING(true) WITH CHECK(true);
CREATE POLICY deletion_worker_prune ON asgard_private.account_deletions FOR DELETE TO asgard_maintenance
 USING(stage='completed' AND completed_at<statement_timestamp()-interval '7 days');
CREATE TABLE asgard_private.account_deletion_attempts (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 id uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
 PRIMARY KEY(user_id,id)
);
ALTER TABLE asgard_private.account_deletion_attempts ENABLE ROW LEVEL SECURITY;
GRANT SELECT,INSERT ON asgard_private.account_deletion_attempts TO asgard_app;
CREATE POLICY deletion_attempt_owner ON asgard_private.account_deletion_attempts TO asgard_app
 USING(user_id=nullif(current_setting('asgard.user_id',true),'')::uuid)
 WITH CHECK(user_id=nullif(current_setting('asgard.user_id',true),'')::uuid);
DO $$ DECLARE item record; BEGIN
 FOR item IN SELECT table_name FROM information_schema.columns
 WHERE table_schema='asgard_private' AND column_name='user_id'
 AND table_name <> 'account_deletions' LOOP
 EXECUTE format('GRANT SELECT(user_id) ON asgard_private.%I TO asgard_maintenance',item.table_name);
 EXECUTE format('CREATE POLICY deletion_worker_count ON asgard_private.%I FOR SELECT TO asgard_maintenance USING (user_id=nullif(current_setting(''asgard.user_id'',true),'''')::uuid)',item.table_name);
 END LOOP;
END $$;

CREATE TABLE asgard_private.deletion_maintenance_runs (
 id uuid PRIMARY KEY, finished_at timestamptz NOT NULL DEFAULT statement_timestamp(),
 processed integer NOT NULL, failed integer NOT NULL
);
ALTER TABLE asgard_private.deletion_maintenance_runs ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON asgard_private.deletion_maintenance_runs TO asgard_app,asgard_maintenance;
GRANT INSERT ON asgard_private.deletion_maintenance_runs TO asgard_maintenance;
CREATE POLICY deletion_heartbeat_read ON asgard_private.deletion_maintenance_runs FOR SELECT
 TO asgard_app,asgard_maintenance USING(true);
CREATE POLICY deletion_heartbeat_write ON asgard_private.deletion_maintenance_runs FOR INSERT
 TO asgard_maintenance WITH CHECK(true);

GRANT DELETE ON asgard_private.deletion_maintenance_runs TO asgard_maintenance;
CREATE POLICY deletion_heartbeat_retention ON asgard_private.deletion_maintenance_runs FOR DELETE
 TO asgard_maintenance USING(finished_at<statement_timestamp()-interval '30 days');
GRANT DELETE ON asgard_private.account_deletion_attempts TO asgard_maintenance;
GRANT SELECT(id,created_at) ON asgard_private.account_deletion_attempts TO asgard_maintenance;
CREATE POLICY deletion_attempt_retention_read ON asgard_private.account_deletion_attempts FOR SELECT
 TO asgard_maintenance USING(created_at<statement_timestamp()-interval '30 days');
CREATE POLICY deletion_attempt_retention_delete ON asgard_private.account_deletion_attempts FOR DELETE
 TO asgard_maintenance USING(created_at<statement_timestamp()-interval '30 days');
