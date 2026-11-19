> Implementation record. Dated sections preserve their original evidence and limitations. For current behavior and activation status, use the [documentation baseline](../README.md) and linked owning specifications. Earlier plans do not override later recorded decisions.

# Account deletion

MFA-RECOVERY-01 follow-up, 2026-11-19 (Codex): application backup codes authorize
[authenticator replacement](application-recovery-codes.md). Recover the lost
authenticator before deletion; direct backup-code substitution is rejected by the
backend. Pending recovery blocks normal deletion acceptance and all app data.
The older provider-code acceptance steps below retain their original scope.

2026-11-19 follow-up (Codex): failed availability requests now show a retry action,
separately from a confirmed disabled result. Backend acceptance, maintenance gates
and deployment flags are unchanged. See [account access fixes](account-access-fixes.md)
for checks and the operator activation checklist. Required reviewer remains
@YakisobaNissin; hosted activation and destructive acceptance remain pending.

Implementer: Codex. Created: 2026-11-16. Last updated: 2026-11-17.
Status: implemented locally; architecture-owner review and hosted acceptance pending.
Owner/reviewer: @YakisobaNissin. Scope: REQ-13, QA-01/02/09/11.
The owner approved implementation in chat; this does not record a completed PR review.

## Authority and behavior

See the [implementation plan](../plans/account-deletion.md),
[architecture](../architecture.md), and the retention and maintenance policies in
[Security and operations](../security-and-operations.md). Those documents own policy.

Settings → Account and security offers deletion only when the backend flag is on
and the latest successful maintenance heartbeat is less than three hours old.
The user supplies a fresh password, a second factor when enrolled, and types DELETE.
The server verifies the password and factor with Supabase, checks the authenticated
subject, and revokes the temporary verification session. Five persisted attempts per
15 minutes bound password verification requests. Credentials remain out of database
records, query caches and application logs.

A 202 response means a durable intent and access block committed together. Every
protected repository transaction checks the block. Shared advisory account locks
serialize acceptance against active protected writes; external AI/upload responses
must pass the guard again before saving. A matching request key can retrieve its
receipt after acceptance. The frontend clears private state, ends its local session
and redirects to sign-in with a deletion-in-progress message. A network error never
claims that deletion succeeded or that the account is unchanged.

The hourly worker waits at least ten minutes after acceptance to allow bounded
in-flight uploads to finish. It removes account-prefixed objects from the two private
buckets through the Storage API, hard-deletes the Auth user, sweeps Storage again,
and verifies application-owned records disappeared through existing cascades.
Leases and persisted stages resume partial work without reactivating accounts.
Failures retry with bounded backoff; missed seven-day deadlines fail health checks.
The minimal ledger has no Auth foreign key and survives Auth deletion.

## Source map

- `backend/app/modules/account_deletion.py`: availability, verification and acceptance.
- `backend/app/modules/profiles/repository.py`: shared/exclusive account guard.
- `supabase/migrations/20261116000100_account_deletion.sql`: ledger, attempts,
  restricted maintenance grants, session block and heartbeat.
- `backend/scripts/purge_accounts.py`: Storage/Auth purge, verification, health and retention.
- `.github/workflows/account-deletion.yml`, `backend/Dockerfile`: bounded maintenance execution.
- `frontend/src/features/auth/account-deletion.tsx`: confirmation dialog.
- `frontend/src/auth/transport.ts`, `frontend/src/auth/supabase.ts`: local access teardown.
- `frontend/src/features/auth/connected-page.tsx`: accepted-deletion message.
- `backend/openapi.json`, `frontend/src/api/generated/schema.d.ts`: generated wire contract.

## Hosted activation order

Do these after reviewing the migration and code. Do not enable the Render flag first.

1. Apply the versioned migration using the established reviewed migration procedure.
   It creates `asgard_maintenance` without a password. Provision a unique password
   through an administrator session; use a password prompt instead of repository SQL
   or shell history. Keep the application connected as `asgard_app`.
2. Create the protected GitHub environment `account-maintenance`. Restrict deployment
   branches to the reviewed integration branch. Configure these environment secrets:

   | Name | Value |
   | --- | --- |
   | `ASGARD_MAINTENANCE_DATABASE_URL` | SQLAlchemy `postgresql+psycopg://` URL for `asgard_maintenance` (pooler login includes the project suffix), with `sslmode=verify-full` and `sslrootcert=/etc/secrets/supabase-root.crt` |
   | `ASGARD_AUTH_ADMIN_KEY` | Backend-only Supabase service-role JWT compatible with Auth admin and Storage APIs |
   | `ASGARD_SUPABASE_URL` | This project's HTTPS Supabase origin |
   | `ASGARD_DATABASE_CA_PEM` | Supabase database CA certificate contents |

   This admin key is separate from Groq. Never use it in a `VITE_` variable or grant
   it to the web application just for deletion. The maintenance SQL credential has
   no authority to invent deletion requests. The provider key is privileged; protect
   workflow changes and environment access accordingly.
3. Set repository variable `ASGARD_DELETION_MAINTENANCE_ENABLED=true`. Once the reviewed
   workflow is published on the default branch, manually run **Account deletion
   maintenance** from GitHub Actions. Confirm its sanitized summary succeeds with
   zero jobs before enabling acceptance. Do not print secret values to troubleshoot.
4. Provision an independent monitor using the same image with `--check-health` and
   the restricted database credential. This command needs no provider-admin key.
   A nonzero exit means the latest run failed, is older than three hours, or a purge
   is overdue. Configure a real operator alert outside this workflow and test a
   missed schedule. A local manual health check alone is not an independent monitor.
5. Establish encrypted, off-database preservation of the minimal deletion ledger,
   including accepted requests newer than a restored snapshot. Before restoring
   service, reapply that latest ledger and complete pending removals in an isolated
   restore. The worker does not implement backup export or restore orchestration.
   Keep ledger identifiers until every relevant seven-day backup has expired and
   verification is recorded. `--prune-reviewed-ledger-before YYYY-MM-DD` is an
   explicit operator operation after that review; the worker never prunes it automatically.
6. Set `ASGARD_ACCOUNT_DELETION_ENABLED=true` on the active Render API and redeploy.
   No frontend deletion flag or additional Vercel secret is needed. Leave the flag
   false if maintenance, monitoring or restore requirements cannot be satisfied.
7. Use a disposable developer account for the manual acceptance below. Verify a real
   partial provider failure and recovery before releasing to outside users.

Scheduling does not itself guarantee the seven-day deadline. The worker handles at
most three accounts per run and bounds each job to 150 seconds. Monitor backlog and
dispatch catch-up runs when necessary. Never increase concurrency against the same
ledger without reviewing lease and provider limits. Future tables/buckets must add
appropriate cascade/count grants or purge handling in their own migration.

## Verification and manual acceptance

Focused verification, 2026-11-17:

- Backend: 13 tests passed; one opt-in restricted-role session test skipped because
  that test's explicit activation variable was not set. Ruff passed on the new
  endpoint, worker and affected tests; OpenAPI drift validation passed.
- Rollback-only local SQL: migration, immediate session block, cross-account
  isolation, ledger survival after synthetic Auth deletion, and maintenance
  restrictions passed. The transaction ended with ROLLBACK; no real account changed.
- Frontend: three dialog tests, scoped ESLint, TypeScript, production build and
  generated TypeScript API drift check passed. The Windows API-check subprocess
  required process-local TEMP/TMP under the ignored `.local` directory to avoid
  its sandbox temporary-path error; the check script and dependencies were unchanged.

These checks do not establish hosted provider performance or prove a real account
has been purged. They also do not constitute completion of QA-09, QA-11 or OPS-C1.

Manual checks are pending. On the deployed app (currently
`https://asgard-navy.vercel.app`), navigate to Settings → Account and security:

1. With the flag off or stale heartbeat, deletion stays unavailable.
2. With healthy maintenance, open the dialog. Cancel; reopen and confirm credentials
   are empty. DELETE and password are required. A wrong password/code leaves the
   account usable and produces an error. Test enrolled TOTP and a disposable recovery code.
3. On a disposable account with saved progress, a PDF and profile photo, confirm
   deletion once. Expect sign-in and an in-progress message. Reusing its old token
   against protected application APIs must fail immediately, including another tab.
4. After the grace period, dispatch maintenance. Verify Storage objects, Auth user
   and private application records are gone while the protected ledger remains.
   Interrupt a provider stage, rerun and confirm it resumes without premature completion.
5. Check a separate account still works and its data is unchanged. Verify missed-run
   detection, catch-up and isolated restoration with a ledger newer than the snapshot.

Report the stage, UTC timestamp, request ID and sanitized error code on failure;
never share passwords, recovery codes, admin keys or document contents.

Known limits: hosted operations and restore acceptance are pending; existing signed
object links may remain valid until their bounded expiry; data already sent to an
external AI provider follows that provider's retention policy. Acceptance immediately
blocks new protected application work, not external copies or provider retention.
