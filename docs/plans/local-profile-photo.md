# Local profile photos

Date 2026-11-06. FUT-10 and Settings decision S1. Implementation owner Codex.
Architecture reviewer @YakisobaNissin. The owner approved the migration,
Profile API change and pinned Pillow dependency in chat on 2026-11-06.
See the [implementation record](../features/local-profile-photo.md).

- Add photo preview, replacement and removal to Settings. Save profile commits
  the name and photo together. Cancel and failed saves preserve the saved photo.
- Add a local opt-in and an owner-only photo read through the existing
  authenticated Profile backend. Use a private Supabase Storage bucket without
  browser access. Serve images with no-store and no public object URL.
- Extend the versioned Profile save contract with an optional photo change.
  Omission keeps the current photo. Validate and bound the request before
  decoding. Add pinned Pillow to decode and re-encode static JPEG, PNG and WebP,
  enforce the existing 2 MB and 4096-pixel limits, and strip metadata. Regenerate
  OpenAPI and the frontend client.
- Add a migration for the bucket, the profile photo pointer and a private
  cleanup queue. Reserve each new object key before uploading. Commit the
  pointer and name in the same version-checked database transaction, and queue
  the previous object for deletion. Keep abandoned keys recoverable for cleanup
  after failed saves or interrupted requests. Reads only serve the active key
  for the signed-in account.
- Verify owner isolation, malformed and oversized images, metadata removal,
  stale saves, storage failure, replacement and cleanup. Apply the migration
  to local Supabase after review and verify the Settings flow.

Affected areas are Profile, backend dependencies and generated API contracts,
and local Supabase migrations. The security baseline and Settings specification
own the image limits and save behavior.
