-- Verify the complete upload, then atomically apply the reviewed release.
DO $$ DECLARE target oid; body bytea; BEGIN
 target:=(SELECT m.oid FROM pg_largeobject_metadata m WHERE obj_description(m.oid,'pg_largeobject')='asgard-reference-import:18afd51c095008cf482196d8b09bdf563c909f22e4bd7218e27d310fb65173b4' AND m.lomowner=(SELECT oid FROM pg_roles WHERE rolname=current_user));
 IF target IS NULL THEN RAISE EXCEPTION 'Reference upload is missing'; END IF;
 body:=lo_get(target);
 IF encode(sha256(body),'hex')<>'18afd51c095008cf482196d8b09bdf563c909f22e4bd7218e27d310fb65173b4' THEN
  RAISE EXCEPTION 'Reference upload is incomplete or changed; rerun the upload chunks';
 END IF;
 EXECUTE convert_from(body,'UTF8');
 PERFORM lo_unlink(target);
END $$;
