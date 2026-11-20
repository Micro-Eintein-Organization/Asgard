# Hosted account deletion repair

Date: 2026-11-20. Task owner/implementer: Codex.
Required technical reviewer: @YakisobaNissin, per `.github/CODEOWNERS`.
Status: investigation recorded; bounded plan awaiting review. No implementation or
hosted configuration changes have been made.

## Scope and authority

User report: confirming Delete account on the hosted app leaves an account visible
in Supabase Auth. Requirements: REQ-13, QA-01/02/09/11. Follow the approved
[architecture](../architecture.md), [deletion policy](../security-and-operations.md#retention-backups-and-deletion),
and [implementation guide](../features/account-deletion.md).
Preserve durable acceptance, immediate application access blocking, fresh password
and MFA verification, restricted maintenance, Storage cleanup, and ledger retention.
This task does not authorize a new synchronous privileged web-server deletion path,
an immediate-purge policy, or deletion of either account merely because it appears
in the screenshot.

Working branch: `codex/cabusao-ui-integration`; working tree was clean at inspection.
No branch switch, commit, push, migration, deployment or workflow dispatch performed.
This is feature repair, not Stages 1–4 foundation implementation.

## Established findings and unknowns

- Settings uses the real account-deletion API. A successful response is acceptance,
  not completed physical deletion.
- The migration makes work eligible ten minutes after acceptance. The maintenance
  workflow is scheduled hourly at minute 17 and is gated by a repository variable
  and protected environment. The worker hard-deletes the Auth user only after its
  initial Storage cleanup succeeds.
- Repository documentation still records hosted activation/acceptance as pending;
  that is historical source evidence, not proof of current deployed configuration.
- Hosted ledger stage, acceptance time, retry/failure code, maintenance heartbeat,
  workflow execution, and deployed revision have not been inspected. The screenshot
  cannot establish which account accepted deletion or whether the deadline elapsed.
- No connected Supabase/GitHub/Render tool was available in the tool inventory;
  GitHub CLI was unavailable. No hosted credentials were read or printed.

## Bounded plan for review

1. Read the hosted deletion receipt/ledger stage and sanitized failure code for the
   reported request; inspect recent Account deletion maintenance job summaries and
   deployed revisions. Do not expose credentials, personal files or unrelated rows.
2. Determine whether this is expected queue delay, missing activation, provider
   failure, or a reproducible worker defect. If evidence identifies missing setup,
   follow the existing activation gates rather than modify application architecture.
   Obtain separate publication/configuration authorization where required.
3. If a source defect is demonstrated, patch only the failing maintenance stage or
   acceptance guard within the existing contracts. Record any migration or new
   architectural requirement for separate review before dependent implementation.
4. Update `docs/features/account-deletion.md` with the demonstrated cause, changed
   behavior, actual checks, and remaining hosted acceptance limits.

Potential affected files: `backend/scripts/purge_accounts.py`,
`backend/app/modules/account_deletion.py`, `backend/tests/test_account_deletion.py`,
`.github/workflows/account-deletion.yml` only if workflow evidence requires it,
and `docs/features/account-deletion.md`. Existing API/schema contracts stay in scope
as dependencies, with no planned contract or schema changes. Other modules and
contributors' edits must be preserved.

## Verification and handoff

Reuse focused deletion tests and lint for changed Python files. Add a regression
only for the demonstrated failure, covering retry behavior and account isolation
where affected. Authentication/authorization changes require applicable session,
fresh-authentication and ownership checks. Workflow changes need focused validation.
Do not rebuild/retest the full foundation without a related reason.

Hosted manual acceptance remains required: use a disposable account at
`https://asgard-navy.vercel.app`, Settings → Account and security; confirm deletion,
verify its old session immediately loses protected application access, then verify
the due maintenance removes its Auth user, Storage objects and application records
while retaining the protected ledger and leaving another account intact. Verify a
partial failure retries. Record request ID, time, stage and sanitized error on failure.

Checks so far: read-only source/configuration inspection; clean Git status. No
application tests run because no application code changed. No real account purge
or hosted acceptance claimed. Hosted evidence and technical plan review are pending;
follow-up operator execution is unassigned.
