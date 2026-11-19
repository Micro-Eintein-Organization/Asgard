BEGIN READ ONLY;
SELECT jsonb_build_object(
 'tables',(SELECT jsonb_agg(to_jsonb(t)) FROM (
   SELECT n.nspname AS schema,c.relname AS name,c.relrowsecurity AS rls,
     c.relforcerowsecurity AS forced_rls,
     has_table_privilege('anon',c.oid,'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') AS anon_access,
     has_table_privilege('authenticated',c.oid,'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') AS browser_access,
     has_table_privilege('asgard_app',c.oid,'SELECT') AS app_read,
     has_table_privilege('asgard_app',c.oid,'INSERT,UPDATE,DELETE,TRUNCATE') AS app_write
   FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
   WHERE n.nspname IN ('asgard_private','asgard_catalog') AND c.relkind IN ('r','p')
   ORDER BY n.nspname,c.relname) t),
 'roles',(SELECT jsonb_agg(to_jsonb(r)) FROM (
   SELECT rolname,rolsuper,rolbypassrls,rolcreatedb,rolcreaterole,rolcanlogin
   FROM pg_roles WHERE rolname IN ('asgard_app','asgard_maintenance')) r),
 'memberships',(SELECT coalesce(jsonb_agg(to_jsonb(r)),'[]'::jsonb) FROM (
   SELECT member.rolname AS member,parent.rolname AS parent
   FROM pg_auth_members m JOIN pg_roles member ON member.oid=m.member
   JOIN pg_roles parent ON parent.oid=m.roleid
   WHERE member.rolname IN ('asgard_app','asgard_maintenance')) r),
 'column_grants',(SELECT coalesce(jsonb_agg(to_jsonb(g)),'[]'::jsonb) FROM (
   SELECT table_schema,table_name,grantee,column_name,privilege_type
   FROM information_schema.column_privileges
   WHERE table_schema IN ('asgard_private','asgard_catalog')
   AND grantee IN ('PUBLIC','anon','authenticated')) g),
 'function_security',(SELECT jsonb_agg(to_jsonb(f)) FROM (
   SELECT n.nspname AS schema,p.proname AS name,
     pg_get_function_identity_arguments(p.oid) AS signature,p.prosecdef AS security_definer,
     p.proconfig AS configuration,
     has_function_privilege('anon',p.oid,'EXECUTE') AS anon_execute,
     has_function_privilege('authenticated',p.oid,'EXECUTE') AS browser_execute,
     has_function_privilege('asgard_app',p.oid,'EXECUTE') AS app_execute
   FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
   WHERE n.nspname IN ('asgard_private','asgard_catalog') AND p.prosecdef
   ORDER BY n.nspname,p.proname) f),
 'invalid_indexes',(SELECT coalesce(jsonb_agg(c.relname),'[]'::jsonb)
   FROM pg_index i JOIN pg_class c ON c.oid=i.indexrelid
   JOIN pg_namespace n ON n.oid=c.relnamespace
   WHERE n.nspname IN ('asgard_private','asgard_catalog') AND (NOT i.indisvalid OR NOT i.indisready)),
 'unvalidated_constraints',(SELECT coalesce(jsonb_agg(c.conname),'[]'::jsonb)
   FROM pg_constraint c JOIN pg_namespace n ON n.oid=c.connamespace
   WHERE n.nspname IN ('asgard_private','asgard_catalog') AND NOT c.convalidated),
 'buckets',(SELECT coalesce(jsonb_agg(to_jsonb(b)),'[]'::jsonb) FROM (
   SELECT id,public,file_size_limit,allowed_mime_types FROM storage.buckets
   WHERE id IN ('asgard-documents','asgard-profile-photos')) b),
 'storage_browser_policies',(SELECT coalesce(jsonb_agg(to_jsonb(p)),'[]'::jsonb) FROM (
   SELECT policyname,roles,cmd,qual,with_check FROM pg_policies
   WHERE schemaname='storage' AND tablename='objects'
   AND roles && ARRAY['public','anon','authenticated']::name[]) p),
 'policy_count',(SELECT count(*) FROM pg_policies
   WHERE schemaname IN ('asgard_private','asgard_catalog')),
 'browser_schema_access',(SELECT jsonb_agg(to_jsonb(s)) FROM (
   SELECT nspname,has_schema_privilege('anon',oid,'USAGE') AS anon_usage,
   has_schema_privilege('authenticated',oid,'USAGE') AS browser_usage
   FROM pg_namespace WHERE nspname IN ('asgard_private','asgard_catalog')) s),
 'maintenance',(SELECT jsonb_build_object('recorded_runs',count(*),'last_finished_at',max(finished_at))
   FROM asgard_private.deletion_maintenance_runs)
) AS audit;
COMMIT;
