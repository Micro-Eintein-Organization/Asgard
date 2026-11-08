BEGIN;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('asgard-profile-photos', 'asgard-profile-photos', false, 2000000, ARRAY['image/jpeg']);

ALTER TABLE asgard_private.profiles ADD COLUMN photo_id uuid;
GRANT INSERT (photo_id), UPDATE (photo_id) ON asgard_private.profiles TO asgard_app;

CREATE TABLE asgard_private.profile_photo_cleanup (
    user_id uuid NOT NULL,
    photo_id uuid NOT NULL,
    ready_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, photo_id)
);
REVOKE ALL ON asgard_private.profile_photo_cleanup FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, DELETE ON asgard_private.profile_photo_cleanup TO asgard_app;
ALTER TABLE asgard_private.profile_photo_cleanup ENABLE ROW LEVEL SECURITY;
ALTER TABLE asgard_private.profile_photo_cleanup FORCE ROW LEVEL SECURITY;
CREATE POLICY own_profile_photo_cleanup ON asgard_private.profile_photo_cleanup
    FOR ALL TO asgard_app
    USING (user_id = nullif(current_setting('asgard.user_id', true), '')::uuid)
    WITH CHECK (user_id = nullif(current_setting('asgard.user_id', true), '')::uuid);
COMMIT;
