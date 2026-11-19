# Application recovery codes

Implementer: Codex. Created: 2026-11-19. Last updated: 2026-11-19.
Task: MFA-RECOVERY-01. Requirements: REQ-01/13, QA-01/02/09/11, A-03, AUTH-C2.
Owner/required reviewer: @YakisobaNissin. Status: implemented locally; focused
automated checks passed; owner-authorized activation override recorded below;
actual hosted activation and manual/provider acceptance remain unverified.
The owner approved the bounded implementation and identified themselves as the
codeowner in chat. See the [ADR](../adr/2026-11-19-application-recovery-codes.md)
and [plan](../plans/application-recovery-codes.md). This guide is implementation
evidence, not approval to deploy or a claim that provider acceptance passed.

## Implemented behavior

The backend generates ten independent 128-bit backup codes, formatted in groups
of four hexadecimal characters. Only account-bound SHA-256 digests are stored.
Issuance, replacement and removal require a signed AAL2 session whose primary
password and TOTP authentication are both within five minutes. The frontend
displays each issued set once in memory, with copy/download. Rotation is atomic;
an ambiguous lost response requires checking status and authenticated replacement.
Old codes are also bound to the provider factor IDs and cannot recover a later,
independently reenrolled authenticator.

After normal password sign-in, **Use a recovery code** requests password
confirmation and a backup code. The backend verifies the password with Supabase,
atomically consumes the code and records a durable application-data block. It
returns a random ten-minute recovery capability, stored only as a hash server-side
and in component memory client-side. Each recovery stage has a persisted limit
of five attempts per account per fifteen minutes.

The backend removes old factors through the official Auth admin API, which also
revokes sessions when removing a verified factor, and asks Supabase to enroll the
replacement TOTP. The user scans its QR/manual key and submits their password and
new authenticator code. The backend verifies that specific factor with Supabase,
checks the actual AAL2 response, revokes other sessions and replaces the backup
code set before clearing the block. The browser adopts the real provider session
and shows the new codes. Passwords, seeds, capabilities and plaintext codes are
not written to application tables, query caches or logs. Auth session persistence
uses the existing SDK behavior after recovery succeeds.

Recovery never changes application access to accept AAL1 as completed MFA. The
pending block survives expiry, server restart, provider failure and feature
disablement. Retrying setup may replace an unverified setup. A lost capability
requires signing in again and another unused code. Completion invalidates every
prior backup code. Losing all backup codes and the authenticator has no bypass;
losing both the primary password and authenticator is outside this workflow.
The original sign-in token can expire before the capability's ten-minute limit;
start recovery from a fresh password sign-in. Existing provider-issued backup
codes are not imported: enrolled accounts must issue application codes using
their working authenticator before depending on this workflow.

Email password-reset and deletion require the recovered authenticator first.
Their retained legacy boolean recovery parameter rejects direct substitution
instead of calling the disabled provider-code API. Google is unaffected.

## Sources and contracts

- `backend/app/modules/recovery_codes.py`: provider adapter, recovery workflow,
  generation, fresh-auth checks, attempt limits and restricted transactions.
- `supabase/migrations/20261119000100_application_recovery_codes.sql`: private
  hashed-code/attempt/pending tables, role policies and shared session guard.
- `backend/app/core/config.py`, `backend/app/main.py`, `backend/openapi.json`,
  `frontend/src/api/generated/schema.d.ts`: activation, registration and contracts.
- `frontend/src/auth/recovery-codes.ts`, `frontend/src/auth/mfa.ts`,
  `frontend/src/features/auth/mfa-page.tsx`,
  `frontend/src/features/auth/recover-authenticator.tsx`: uncached
  API operations, assurance and management/recovery UI.
- Existing password-recovery/deletion modules retain their owning flows with the
  updated authenticator-first guidance.

The generated contract exposes account-scoped status, issuance/removal and
begin/prepare/finish under `/api/v1/me/recovery-codes`. No endpoint accepts an
account ID as authority. Ordinary queries retain the restricted `asgard_app`
role. Narrow recovery operations require a cryptographically verified subject,
active eligible account, and the stage's additional proof, even while normal
session access is blocked or the provider has deliberately revoked that session.

## Setup and deployment order

The following original sequence remains the default for other environments. The
owner's later override for the existing hosted environment is recorded below.

1. Review the ADR, migration and credential access. Apply the new migration through
   the existing administrative migration workflow before deploying the new backend
   or frontend. Do not apply it using the runtime database role.
2. Deploy backend and frontend together with `ASGARD_RECOVERY_CODES_ENABLED=false`.
   The frontend now requires backend recovery-state availability to finish its
   assurance check; an unavailable database/schema fails closed.
3. Provision `ASGARD_RECOVERY_AUTH_ADMIN_KEY` in the backend secret store only.
   Use this project's Auth-admin-compatible service-role JWT and verify its
   compatibility with the provider admin API. An anon/publishable key is insufficient. Never expose
   it in Vercel `VITE_` variables or reuse the runtime database credential. The
   adapter only calls configured-project factor deletion/user lookup operations;
   the credential itself has broader provider privileges and must be protected.
4. On an approved disposable environment, enable `ASGARD_RECOVERY_CODES_ENABLED`
   and execute provider/security/manual acceptance below. Configuration refuses
   enablement without its admin credential. Root `.env.example` documents local
   variables; Compose reads them from the developer's ignored `.env`.
5. Enable new enrollment only after the revised AUTH-C2 lifecycle checks pass.
   No provider settings, private credentials, hosted schema or services have been
   changed by this source implementation.

## Owner activation override, 2026-11-19

The owner/codeowner explicitly requested "enable it now. override. tell me what
to do for enable". This authorizes activation on the existing hosted Asgard
environment before the live/manual acceptance record is complete. It does not
mark those checks passed or relax runtime protections. `render.yaml` now sets
`ASGARD_RECOVERY_CODES_ENABLED=true` and declares the admin credential with
`sync: false`; generic runtime and local-example defaults stay disabled.

Operator sequence:

1. In the checkout linked to the intended hosted Supabase project, inspect pending
   migrations with `npx --no-install supabase db push --linked --dry-run`. Review
   the pending set, including `20261119000100_application_recovery_codes.sql` and
   its prerequisites; then apply the reviewed set with
   `npx --no-install supabase db push --linked`. Keep the migration ledger current;
   do not paste the file into SQL Editor separately and then replay it with the CLI.
2. Publish the reviewed recovery source to the branch used by Render and Vercel.
   These source changes are local/uncommitted at this record's creation. An
   environment-variable change cannot add this feature to an old deployment.
   No Git operation was performed or inferred from the activation request.
3. From the same Supabase project's Settings > API Keys, obtain its Auth-admin-
   compatible legacy `service_role` JWT. Enter it directly into Render's backend
   Environment as `ASGARD_RECOVERY_AUTH_ADMIN_KEY`. Never enter it in frontend
   variables, source control or chat. Retain the existing restricted database role.
4. Set Render backend Environment `ASGARD_RECOVERY_CODES_ENABLED=true`, save,
   rebuild and deploy the updated backend source. Confirm the deploy and existing
   health/readiness checks succeed.
5. In Vercel, set `VITE_MFA_ENROLLMENT_APPROVED=true` in the environment actually
   used by this site, then deploy the updated frontend source. The admin key stays
   exclusively on Render.
6. Open Settings > Account and security > Manage authenticator and recovery codes.
   Enter the password and current authenticator code; generate and privately save
   the issued codes. First exercise replacement on a disposable account: sign
   in, use a backup code, verify a replacement authenticator, and confirm old
   sessions/codes fail. Record any failed step without assuming recovery succeeded.

No native Supabase recovery-code enrollment setting is needed by this application
workflow. This record and the enabled Blueprint do not establish that the operator
has applied the migration, entered a valid secret or deployed the current code.

### Existing hosted schema and missing migration history, 2026-11-19

The owner encountered `account_deletions already exists` while applying migration
`20261116000100`. Codex read the linked project's migration history and schema;
no hosted schema, application data or migration-history row was changed by this
investigation. The other authorized chat reported successful manual SQL Editor
application of both November 18 schema migrations; this was independently checked
against the hosted catalog metadata rather than assumed from table existence.

Verified: the three deletion tables and three career-skill snapshot/posting tables
exist with the expected columns/defaults, keys/checks/foreign keys, valid indexes,
enabled RLS and expected policies/grants. Effective browser table and column
privileges are absent. The deletion maintenance role has the expected restricted
attributes, schema usage, account-count policies/grants and no parent roles.
The session guard and both posting guard function bodies match the versioned
SQL after whitespace normalization; their expected execute restrictions and
the posting triggers are present. These are schema/history reconciliation checks,
not provider, content-review or deletion-worker acceptance.

The remote ledger lacks `20261116000100`, `20261118000100` and
`20261118000200` even though their SQL is already present. Recovery migration
`20261119000100` is also missing from history, and its three tables are absent.
The canonical-skill content publication is a separate operation; it must not be
marked as a schema migration or republished to repair this mismatch.

Operator correction, for the same linked project that was audited:

```powershell
npx --no-install supabase migration repair 20261116000100 20261118000100 20261118000200 --status applied --linked
npx --no-install supabase db push --linked --dry-run
```

Review the target and prompts. Repair records the three verified migrations in
history without rerunning their SQL. The dry run should then list only
`20261119000100_application_recovery_codes.sql`. If it lists something else,
reconcile that difference before applying. Once the pending set matches:

```powershell
npx --no-install supabase db push --linked
```

Do not reset, drop existing tables, rewrite the historical migration or blanket-
mark the recovery migration applied. CLI help for the repository-pinned version
confirmed the multi-version repair and linked-query syntax. The first read-only
history attempt was blocked by the sandbox's CLI telemetry-file write; the
permitted retry and the read-only schema queries succeeded. History repair and
the recovery migration remain operator actions, not recorded completed checks.

## Verification

Executed on 2026-11-19 in the current Windows checkout:

| Check | Result and limits |
| --- | --- |
| Backend focused suite | **64 passed**: recovery entropy/digests, fresh-auth bounds, anonymous requests/log scrubbing, existing JWT/ownership/deletion/config checks and eight database scenarios. After adding four account-restriction cases, only the database file was rerun: **12 passed**. The added direct-deletion-substitution regression and its unit file then passed **12 tests**. There are **69 distinct passing backend cases** across these runs. |
| Database/migration | **Pass:** final new migration applied from clean state in a disposable PostgreSQL 17 container with minimal Auth prerequisite tables; actual restricted runtime role, RLS, concurrent consumption, stale factor IDs, rotation, durable pending block, provider outage, expired capability, banned/deleted/unconfirmed/deletion-pending accounts and revoked/other-account sessions exercised. Provider responses are mocked with matching session/factor effects. This is not a full Supabase schema rebuild or live-provider acceptance. |
| Frontend focused suite | **43 passed across nine files**: recovery/MFA, replacement UI, email reset, deletion, session provider, protected routes and transport. After adding the backend-capability enrollment guard regression, the two affected UI files passed **11 tests**; **44 distinct frontend cases** passed across these runs. Includes setup retry without another code and rejection of stale completion after unmount. |
| TypeScript and production build | **Pass:** `npm run typecheck` and `npm run build`. |
| Scoped frontend/backend lint | **Pass** on changed auth files, new recovery module/tests, shared registration and deletion module. A wider initial configuration-file lint exposed existing unrelated long-line violations; preserved those lines. |
| API synchronization | **Pass:** generated OpenAPI/TypeScript, backend `export_openapi.py --check`, and `npm run check:api`. Frontend drift check's normal host temp path initially caused a Windows `EISDIR` harness error; its successful retry used a task-local temp directory without changing the script. |
| Live provider and manual browser matrix | **Not run:** admin credential provisioning, actual Auth factor/session/notification behavior, direct-provider races, hosted migration and visual/keyboard/manual acceptance remain operator gates. |

An initial test invocation used a nonexistent configuration-test filename; no
tests ran in that attempt. The corrected focused suite passed. Initial frontend
failures were stale provider-code mocks and a missing declared 422 error model;
both were corrected before the passing run. Existing Starlette/httpx deprecation
warning remains; no dependencies or warning thresholds were changed. Shared
resume/Profile edits appearing during this task were preserved.

Shared-contract coordination: with the owner's explicit permission, coordinated
generation with the **Fix skill matching and PDF skill entry** chat. Its cached
image import initially overwrote the shared contracts without either current
feature's additions. That chat acknowledged the handoff; regeneration now uses
the mounted backend as PYTHONPATH and preserves recovery plus the skill-matching
`basis` parameter. No skill-matching implementation was edited by this task.
The source owner fixed the resulting query-error type narrowing in its own file;
the final combined production build and both contract drift checks passed.

Documentation checks passed for 25 added/changed local links and anchors, scoped
`git diff --check`, and trailing whitespace in all ten new source/test/record files.
The disposable database container and its network were removed after testing.

## Guided manual/provider acceptance (pending)

Use the actual approved frontend origin; local paths start at
`http://127.0.0.1:5173/set-up-2fa` and `/verify-2fa`. Use disposable accounts only.

1. Set up TOTP; verify its current code. Save codes privately. Reopen Settings:
   only remaining-count metadata is displayed. Confirm copy/download and keyboard
   operation at desktop and 390px widths. Old code sets fail after rotation.
2. Sign out/in. Use a backup code with the correct password. Wrong password/code
   must not remove factors. Reusing the same code, including concurrent requests,
   must have at most one successful start; the other request must fail safely.
3. After a valid start, direct protected API requests with old AAL2 tokens and
   password-only sessions must fail. Direct provider enrollment/verification by
   another session must not clear the pending application-data block.
4. Scan the replacement QR, then verify password plus a current code. Wrong TOTP,
   expired/wrong capability, interrupted provider calls and forced response loss
   must not restore data access. Retry setup; sign in again and use another unused
   code if the page/capability is lost. Expiry never unblocks the account.
5. On success verify other sessions/refresh tokens are revoked, provider AAL2 is
   real, only the intended factor remains, every old backup code fails, and the
   new codes appear once. Confirm provider factor-change notification delivery.
6. Recover the authenticator before testing email-password reset or deletion.
   Email-only reset must never clear the pending block. Check banned, unconfirmed,
   deleted and other-account access as well as anonymous requests.

Report route, step, expected/actual result, HTTP status and safe request ID. Never
share passwords, codes, setup secrets, tokens or admin keys. Hosted/operator
acceptance remains owned by @YakisobaNissin; no unassigned acceptance is implied.
