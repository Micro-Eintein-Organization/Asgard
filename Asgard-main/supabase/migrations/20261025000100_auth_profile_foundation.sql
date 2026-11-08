-- Review draft outside the CLI migrations directory. Move/apply only after owner approval.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'asgard_app') THEN
    RAISE EXCEPTION 'asgard_app already exists; review its ownership and grants before proceeding';
  END IF;
  CREATE ROLE asgard_app LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE
    NOINHERIT NOREPLICATION NOBYPASSRLS;
END
$$;

CREATE SCHEMA asgard_private;
REVOKE ALL ON SCHEMA asgard_private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA asgard_private TO asgard_app;
GRANT CONNECT ON DATABASE postgres TO asgard_app;

CREATE TABLE asgard_private.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL CHECK (
    char_length(first_name) BETWEEN 1 AND 100 AND first_name = btrim(first_name)
    AND first_name !~ '[[:cntrl:]]'
  ),
  surname text NOT NULL DEFAULT '' CHECK (
    char_length(surname) <= 100 AND surname = btrim(surname)
    AND surname !~ '[[:cntrl:]]'
  ),
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp()
);

REVOKE ALL ON asgard_private.profiles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON asgard_private.profiles TO asgard_app;
GRANT INSERT (user_id, first_name, surname) ON asgard_private.profiles TO asgard_app;
GRANT UPDATE (first_name, surname, version, updated_at) ON asgard_private.profiles TO asgard_app;
ALTER TABLE asgard_private.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE asgard_private.profiles FORCE ROW LEVEL SECURITY;

CREATE POLICY profile_owner_read ON asgard_private.profiles
  FOR SELECT TO asgard_app
  USING (user_id = nullif(current_setting('asgard.user_id', true), '')::uuid);
CREATE POLICY profile_owner_insert ON asgard_private.profiles
  FOR INSERT TO asgard_app
  WITH CHECK (user_id = nullif(current_setting('asgard.user_id', true), '')::uuid);
CREATE POLICY profile_owner_update ON asgard_private.profiles
  FOR UPDATE TO asgard_app
  USING (user_id = nullif(current_setting('asgard.user_id', true), '')::uuid)
  WITH CHECK (user_id = nullif(current_setting('asgard.user_id', true), '')::uuid);

-- The app receives only a boolean, never general SELECT access to provider Auth records.
CREATE FUNCTION asgard_private.session_allowed(subject uuid, session uuid, assurance text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users AS u
    JOIN auth.sessions AS s ON s.user_id = u.id
    WHERE u.id = subject AND s.id = session
      AND u.email_confirmed_at IS NOT NULL AND u.deleted_at IS NULL
      AND (u.banned_until IS NULL OR u.banned_until <= statement_timestamp())
      AND (
        assurance = 'aal2' OR NOT EXISTS (
          SELECT 1 FROM auth.mfa_factors AS f
          WHERE f.user_id = u.id AND f.status = 'verified'
        )
      )
  );
$$;
REVOKE ALL ON FUNCTION asgard_private.session_allowed(uuid, uuid, text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION asgard_private.session_allowed(uuid, uuid, text) TO asgard_app;

