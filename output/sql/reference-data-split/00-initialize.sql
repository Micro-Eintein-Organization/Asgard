-- Temporary upload only; no application tables are changed.
DO $$ DECLARE target oid; BEGIN
 target:=(SELECT m.oid FROM pg_largeobject_metadata m WHERE obj_description(m.oid,'pg_largeobject')='asgard-reference-import:18afd51c095008cf482196d8b09bdf563c909f22e4bd7218e27d310fb65173b4' AND m.lomowner=(SELECT oid FROM pg_roles WHERE rolname=current_user));
 IF target IS NULL THEN
  target:=lo_create(0);
  EXECUTE format('COMMENT ON LARGE OBJECT %s IS %L',target,'asgard-reference-import:18afd51c095008cf482196d8b09bdf563c909f22e4bd7218e27d310fb65173b4');
 END IF;
 EXECUTE format('REVOKE ALL ON LARGE OBJECT %s FROM PUBLIC,anon,authenticated,asgard_app,asgard_maintenance',target);
END $$;
