# Application recovery codes

Created and updated: 2026-11-19. Task: MFA-RECOVERY-01. Implementer: Codex.
Owner and required architecture reviewer: @YakisobaNissin (CODEOWNERS).
Requirements: REQ-01/13, QA-01/02/09/11, A-03, AUTH-C2.

The owner requested a simple secure application-managed implementation after their
hosted project returned `mfa_recovery_codes_enroll_not_enabled`. In this chat the
owner approved the bounded password-plus-backup-code recovery/replacement approach
and identified themselves as the codeowner. This authorizes local implementation
and the architecture exception below, not hosted activation or Git publication.

Later owner direction, 2026-11-19: the explicit activation override expands this
approval to enabling the existing hosted Asgard environment before live/manual
acceptance is recorded. See the [activation instructions](../features/application-recovery-codes.md#owner-activation-override-2026-11-19).
No actual hosting change, completed provider check, commit or push is implied.

## Bounded implementation

- Keep Supabase passwords, TOTP verification and signed AAL2 sessions. A backup
  code authorizes authenticator replacement, never a fabricated AAL2 token.
- Generate ten independent 128-bit codes with the backend cryptographic random
  generator. Store account-bound SHA-256 digests in private, RLS-protected tables;
  display plaintext once with copy/download. Require a signed AAL2 session with
  primary password and factor authentication within five minutes for issuance,
  rotation and removal. Replace old sets atomically.
- Require a valid account session, fresh server-verified password and an unused
  code to begin recovery. Atomically consume the code and durably block account
  application-data access before removing any provider factor. Use persisted
  account attempt limits and an expiring random recovery capability, stored only
  as a digest; no caller-supplied account ID is authority.
- Recovery is restricted to replacement setup. A backend-only Auth admin adapter
  removes lost factors; Supabase enrolls/verifies the replacement. Clear the
  account block only after verifying that specific replacement factor to AAL2,
  removing unexpected factors and revoking other sessions. Partial failures leave
  the block in place and allow authenticated retry. Never automatically clear an
  expired recovery block. A lost capability requires another unused code.
- Keep recovery capabilities, passwords, QR seeds, issued codes and returned
  sessions out of logs, persistent browser state and query caches. Responses use
  no-store. Retain the existing UI components and session/account-change guards.
- Existing deletion and password-reset flows require the authenticator; direct
  substitution of application codes there is replaced by guidance to recover the
  authenticator first. Email reset alone still cannot remove MFA.
- Add a disabled-by-default backend gate and separately provisioned Auth admin
  credential. No new packages, identity-provider replacement, ordinary privileged
  database queries, automatic migration, deployment or Git operation.

## Components and integration

Affected: backend recovery module, shared route registration/configuration and
session guard; versioned SQL for private recovery storage/attempts/pending state;
generated OpenAPI/TypeScript; frontend MFA setup/challenge and recovery/deletion
guidance; security/product/decision/setup records and feature implementation guide.
Preserve current branch `codex/cabusao-ui-integration`; this is feature work, not
Stages 1-4 foundation implementation. Initial worktree inspection was clean.

## Verification and release boundary

Reuse focused auth, recovery, deletion and transport tests. Add meaningful coverage
for anonymous/other-account/forged identity, wrong password/code, single use and
concurrent reuse, replacement/rotation, expired capabilities, attempt throttling,
provider failure at each destructive step and stale/revoked sessions. Exercise the
migration and restricted-role/RLS/session guard against an isolated database.
Run scoped backend lint/tests, API synchronization/drift, frontend TypeScript,
scoped ESLint and focused UI tests. Document guided manual checks.

Actual provider factor deletion, reenrollment, revocation and direct-provider race
behavior must pass on disposable accounts before hosted enablement. Mocks alone
do not pass AUTH-C2. Docker was stopped at initial inspection; no database or
provider check is recorded as passed. Stop on a persistent verification blocker.

Owning authority: [architecture](../architecture.md),
[security policy](../security-and-operations.md#account-access-and-recovery),
[product](../product.md), [development](../development.md),
and [CODEOWNERS](../../.github/CODEOWNERS).
