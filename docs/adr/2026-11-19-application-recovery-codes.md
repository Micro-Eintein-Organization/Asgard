# ADR: application-managed backup codes for authenticator replacement

Date: 2026-11-19. Decision: MFA-RECOVERY-01. Status: approved for local
implementation by the project owner and codeowner @YakisobaNissin in this chat
("i approved. im the codeowner"). Hosted activation and implementation acceptance
remain separate gates. Implementer: Codex.

Activation amendment, 2026-11-19: the owner/codeowner subsequently requested
"enable it now. override. tell me what to do for enable". This authorizes
enablement for the existing hosted Asgard environment before live/manual
acceptance is recorded. The feature guide records the operator steps. Actual
activation and unrun checks are not inferred from this approval; migration,
credential validation and all runtime protections remain mandatory. The earlier
local-only publication boundary below describes the original approval; this
amendment expands only the activation authorization and does not authorize Git
commits or pushes.

## Context

The owner supplied a hosted Supabase response with HTTP 422 and
`mfa_recovery_codes_enroll_not_enabled`. Their project MFA settings expose TOTP
and SMS controls but no recovery-code setting. The owner requested a simple,
secure application-managed alternative to the unavailable provider-code feature.

## Decision and bounds

Permit backend-generated, high-entropy, single-use backup codes stored as
account-bound hashes in private database tables. Password plus an unused code
authorizes a restricted authenticator-replacement workflow. Supabase still owns
passwords, TOTP seeds/verification and signed sessions. The application never
asserts that its code verification creates provider AAL2.

Commit an account-wide application-data block before any Auth admin factor
removal. Require an expiring recovery capability and fresh password for replacement
operations. Verify the specific replacement factor with Supabase, remove
unexpected factors and revoke other sessions before clearing that block. Expiry,
provider failure, lost browser state and disabled configuration never clear the
block. Another unused code and password can restart an interrupted recovery.

Issue or rotate codes only under fresh primary-password and TOTP authentication.
All previous codes are invalidated when replacement finishes. Codes are not a
direct substitute for TOTP in email-password reset or account deletion; recover
the authenticator first. Email-only recovery and loss of both password and
authenticator remain unsupported. No changes to Google linking are authorized.

This is a bounded exception to the former provider-managed-only recovery rule
(L3, A-03/AUTH-C2), not permission for custom passwords, general MFA bypasses,
provider replacement or normal application queries under privileged credentials.
The separately provisioned Auth admin key stays backend-only behind the disabled
feature gate. Its provider permissions are broader than the adapter's allowlisted
operations; provisioning and access review are required before activation.

## Consequences and acceptance

New private tables, a shared session-guard change, backend endpoints and generated
wire contracts require focused authorization, single-use concurrency, RLS and
failure/retry tests. Direct provider enrollment during recovery must not restore
application access. Actual provider deletion/reenrollment/revocation and account
notification behavior must pass on disposable accounts before enabling hosting.
Mocked provider tests do not close AUTH-C2. There is no automatic deployment,
migration application, commit or push in this approval.

See the [bounded plan](../plans/application-recovery-codes.md),
[implementation guide](../features/application-recovery-codes.md),
[architecture](../architecture.md), and
[security policy](../security-and-operations.md#mfa-lifecycle-and-provider-compatibility).
