# Hosted account-demo setup progress

Historical operator report; environment identifiers generalized during the 2026-11-17 documentation cleanup. This is not current acceptance.

## Setup progress, 2026-11-14

Owner-reported in the recorded deployment task: the hosted project `<project-ref>` has no Auth
users; all 16 migrations through `20261108000100_expand_occupational_catalog.sql`
applied successfully. The owner confirmed ECC P-256 signing, password minimum 8,
six-digit OTP/600-second expiry and signup/email confirmation enabled. Template
editing required custom SMTP on this new Free project, so the owner configured
Gmail SMTP with a private App Password and saved the confirmation-code template.
This supersedes the built-in-sender steps below for this demo only; actual email
delivery and broader SMTP acceptance have not been demonstrated.

The downloaded CA is `prod-ca-2021.crt`. The owner connected through
the configured session-pooler endpoint using verified TLS, set a private
`asgard_app` password with psql, then reconnected as that role and reported
`SELECT current_user` returned `asgard_app`. This verifies the reported role login;
it does not establish the full hosted RLS/session/isolation matrix.

Codex generated the existing publisher's transactional content bundle at ignored
`.local/hosting/content-release.sql` (5,663,849 bytes, SHA256
`676859da4fed7db21d154a7470f6a2f04c24305fcd12a021b2d62c7a621c4694`).
The owner then ran the bundle with psql `ON_ERROR_STOP=1` and reported a final
`COMMIT`, indicating successful transaction completion. Hosted content/readback
and application journeys remain to be verified. Backend/frontend hosting, final configuration, MFA enablement and
manual acceptance remain pending. No passwords or tokens are recorded here.

Updated: 2026-11-13. Implementer: Codex. Operator/reviewer: @YakisobaNissin.
Status: instructions prepared; provider setup and manual acceptance pending.
Use with the [deployment runbook](../../deployment.md) and
[MFA implementation guide](../../features/optional-two-factor-authentication.md).
