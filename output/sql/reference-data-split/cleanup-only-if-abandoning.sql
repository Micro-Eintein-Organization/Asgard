-- Deletes only this owner's temporary upload, not imported reference data.
SELECT lo_unlink(oid) FROM (SELECT m.oid FROM pg_largeobject_metadata m WHERE obj_description(m.oid,'pg_largeobject')='asgard-reference-import:18afd51c095008cf482196d8b09bdf563c909f22e4bd7218e27d310fb65173b4' AND m.lomowner=(SELECT oid FROM pg_roles WHERE rolname=current_user)) owned;
