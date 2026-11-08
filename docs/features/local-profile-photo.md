# Local profile photos

Codex implemented FUT-10 and Settings decision S1 on 2026-11-06. The
architecture owner approved the [bounded plan](../plans/local-profile-photo.md)
in chat. The migration and feature flag are active on the local Asgard stack.

Settings previews the selected photo and saves replacement or removal with the
name through the existing versioned editor. The Profile API validates and
re-encodes still JPEG, PNG and WebP images and strips metadata. The private
Storage bucket holds the resulting JPEG. A migration adds the active photo
pointer and an owner-scoped cleanup queue. Replacement and removal retire the
old object, and later photo saves retry queued cleanup.

- [Profile photo control](../../frontend/src/features/profile/profile-photo.tsx)
- [Profile API](../../backend/app/modules/profiles/routes.py)
- [Local migration](../../supabase/migrations/20261106000100_profile_photos.sql)

Local verification passed with two disposable signed-in accounts. It covered
authentication, cross-account and public access denial, malformed images,
metadata stripping, version conflicts, replacement, removal and Storage
cleanup. Backend lint and frontend type checking passed. OpenAPI and TypeScript
contracts were regenerated. The browser layout, storage failure recovery and
hosted operation remain unverified. Queued cleanup depends on a later local
photo save. An unattended cleanup job is future work.

To review in the [local app](http://127.0.0.1:5173/settings/profile), select
**Change photo**, choose an image, and check the preview. Choose **Save profile**
and refresh. Select **Remove photo**, save again, and confirm the placeholder
returns.
