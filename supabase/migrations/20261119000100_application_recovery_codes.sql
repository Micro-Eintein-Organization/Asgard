-- MFA-RECOVERY-01: account recovery must block data before provider factors change.
CREATE TABLE asgard_private.recovery_codes (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 digest text NOT NULL CHECK (digest ~ '^[0-9a-f]{64}$'),
 set_id uuid NOT NULL, factor_ids uuid[] NOT NULL,
 created_at timestamptz NOT NULL DEFAULT statement_timestamp(), used_at timestamptz,
 PRIMARY KEY(user_id,digest)
);
CREATE TABLE asgard_private.recovery_pending (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 token_digest text NOT NULL CHECK (token_digest ~ '^[0-9a-f]{64}$'),
 set_id uuid NOT NULL, expires_at timestamptz NOT NULL,
 factor_id uuid, started_at timestamptz NOT NULL DEFAULT statement_timestamp()
);
CREATE TABLE asgard_private.recovery_attempts (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 id uuid PRIMARY KEY, action text NOT NULL CHECK(action IN ('begin','prepare','finish')),
 created_at timestamptz NOT NULL DEFAULT statement_timestamp()
);
CREATE INDEX recovery_attempts_account_time ON asgard_private.recovery_attempts(user_id,created_at);
DO $$ DECLARE name text; BEGIN
 FOREACH name IN ARRAY ARRAY['recovery_codes','recovery_pending','recovery_attempts'] LOOP
 EXECUTE format('ALTER TABLE asgard_private.%I ENABLE ROW LEVEL SECURITY',name);
 EXECUTE format('REVOKE ALL ON asgard_private.%I FROM PUBLIC,anon,authenticated',name);
 EXECUTE format('GRANT SELECT,INSERT,UPDATE,DELETE ON asgard_private.%I TO asgard_app',name);
 EXECUTE format('CREATE POLICY recovery_owner ON asgard_private.%I TO asgard_app '
 'USING(user_id=nullif(current_setting(''asgard.user_id'',true),'''')::uuid) '
 'WITH CHECK(user_id=nullif(current_setting(''asgard.user_id'',true),'''')::uuid)',name);
 -- Preserve the deletion worker's account-scoped completeness checks for new tables.
 EXECUTE format('GRANT SELECT(user_id) ON asgard_private.%I TO asgard_maintenance',name);
 EXECUTE format('CREATE POLICY deletion_worker_count ON asgard_private.%I FOR SELECT '
 'TO asgard_maintenance USING(user_id=nullif(current_setting(''asgard.user_id'',true),'''')::uuid)',name);
 END LOOP;
END $$;

CREATE FUNCTION asgard_private.recovery_identity_allowed(subject uuid, session uuid, live boolean)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog AS $$
 SELECT NOT EXISTS(SELECT 1 FROM asgard_private.account_deletions d WHERE d.user_id=subject)
 AND EXISTS(SELECT 1 FROM auth.users u WHERE u.id=subject
 AND u.email_confirmed_at IS NOT NULL AND u.deleted_at IS NULL
 AND (u.banned_until IS NULL OR u.banned_until<=statement_timestamp())
 AND (NOT live OR EXISTS(SELECT 1 FROM auth.sessions s WHERE s.id=session AND s.user_id=u.id)));
$$;
REVOKE ALL ON FUNCTION asgard_private.recovery_identity_allowed(uuid,uuid,boolean)
 FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION asgard_private.recovery_identity_allowed(uuid,uuid,boolean) TO asgard_app;

CREATE FUNCTION asgard_private.recovery_factor_ids(subject uuid)
RETURNS uuid[] LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog AS $$
 SELECT coalesce(array_agg(f.id ORDER BY f.id),'{}'::uuid[]) FROM auth.mfa_factors f
 WHERE f.user_id=subject AND f.status='verified' AND f.factor_type='totp';
$$;
REVOKE ALL ON FUNCTION asgard_private.recovery_factor_ids(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION asgard_private.recovery_factor_ids(uuid) TO asgard_app;

CREATE OR REPLACE FUNCTION asgard_private.session_allowed(subject uuid, session uuid, assurance text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog AS $$
 SELECT asgard_private.recovery_identity_allowed(subject,session,true)
 AND NOT EXISTS(SELECT 1 FROM asgard_private.recovery_pending p WHERE p.user_id=subject)
 AND (assurance='aal2' OR NOT EXISTS(SELECT 1 FROM auth.mfa_factors f
 WHERE f.user_id=subject AND f.status='verified'));
$$;
REVOKE ALL ON FUNCTION asgard_private.session_allowed(uuid,uuid,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION asgard_private.session_allowed(uuid,uuid,text) TO asgard_app;
