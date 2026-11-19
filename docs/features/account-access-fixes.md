# Account access fixes

Implementer: Codex. Created: 2026-11-19. Last updated: 2026-11-19.
Status: implemented; owner/reviewer approved the changes in chat on 2026-11-19;
manual and hosted acceptance pending.
Owner/reviewer: @YakisobaNissin. Requirements: REQ-01/11/13, QA-01/02/09/11.
Authority: owner-selected, reviewed chat plan and ACCOUNT-ACCESS-01 in the
[decision register](../decisions.md); [architecture](../architecture.md) and
[security policy](../security-and-operations.md#account-access-and-recovery).

Approval record, 2026-11-19: the project owner identified themselves as the
CODEOWNERS reviewer @YakisobaNissin and approved these changes in this chat
("im yakisobanssin i approve"). The owner requested no extensive additional tests.
This records approval of this bounded change, not a completed hosted acceptance,
GitHub PR approval, or authorization to commit, push, merge or enable deletion.

## Behavior and source

- Auth registration handles duplicate error codes and empty provider identity lists
  before storing a pending signup or navigating to verification. Sign-in and recovery
  links remain available. No privileged lookup or provider setting changes.
- The shared header uses session readiness on authenticator and recovery pages;
  pending/error/MFA states do not show signed-out registration prompts.
- Account and security sends the existing isolated provider recovery flow to the
  signed-in account email, with shared cooldown and delivery feedback. Requesting
  an email does not end the application session. Existing proof, MFA, subject checks
  and global refresh-session revocation remain in the recovery implementation.
- Shared password validation bounds sign-in/signup/reset; shared email validation
  covers forms, resend and recovery requests. Names retain existing inclusive rules
  in the form, backend and SQL, including control-character rejection.
- Deletion availability failures offer retry; confirmed disabled availability remains
  disabled. No deployment flag, API contract, schema or dependency changes.

Source modules: `frontend/src/auth/` (password, email, recovery),
`frontend/src/features/auth/` (connected page, change password, reset, deletion),
`frontend/src/app/shell.tsx`, and `frontend/src/screens/SettingsScreen.tsx`.

## Verification and manual acceptance

Verification on 2026-11-19: TypeScript, scoped source/test ESLint, production build,
and all 49 tests in nine focused auth/header/profile suites passed. The initial
password-mismatch copy assertion was corrected by preserving the existing wording.
Deletion retry and authenticator-page restricted navigation are included.
Existing profile
validation tests cover required first name, optional surname, 100 Unicode characters,
overlong input and controls. Backend/SQL rules are unchanged.

Backend checks were not rerun: the changed behavior is frontend-only, and the local
Docker API probe returned permission denied. Browser click-through, hosted provider
acceptance and the antislop interaction/layout gate remain pending; build and unit
evidence do not establish visual or real-provider acceptance.

Manual acceptance pending at `http://127.0.0.1:5173`:

1. At `/create-account`, try a confirmed existing account. Expect duplicate feedback
   with sign-in/recovery links, without navigating to code verification. New accounts
   must still receive and verify their code. Test an unconfirmed account separately.
2. Try short and oversized passwords and invalid/oversized emails on auth forms.
   Expect field errors. Test 72 ASCII bytes, 73 bytes and multibyte characters.
3. Sign in, open `/set-up-2fa`, and confirm account navigation replaces public prompts.
   Test loading, session errors and an enrolled account's required challenge.
4. At `/settings/account`, send a reset email. Expect cooldown and delivery feedback
   while the normal session stays usable. Open the email in the same browser/origin,
   complete MFA if enrolled, change password, and verify sign-in, old-password
   rejection, notification and prior refresh-session revocation. Another account
   must remain unaffected. Existing access JWTs retain their bounded expiry.
5. At `/settings/profile`, test long names, controls, Unicode, apostrophes, hyphens
   and an empty optional surname. Invalid submissions must not save.
6. Deletion stays disabled until activation gates pass. A failed availability request
   offers Try again. Report failing route/step, timestamp and sanitized error only.

## Operator setup and limits

Password recovery: in Supabase allow the exact hosted `/reset-password` callback,
retain `{{ .ConfirmationURL }}` in Reset Password email, confirm working SMTP,
eight-character receiving-service minimum and password-change notifications.
See [password recovery](password-recovery.md#hosted-setup-after-publication).

Deletion requires this order; the repository's Render flag is currently false:

1. Review/apply the deletion migration and provision `asgard_maintenance` credentials.
2. Create protected GitHub environment `account-maintenance` with secrets
   `ASGARD_MAINTENANCE_DATABASE_URL`, `ASGARD_AUTH_ADMIN_KEY`, `ASGARD_SUPABASE_URL`,
   and `ASGARD_DATABASE_CA_PEM`. Keep privileged credentials server-side.
3. Publish the reviewed maintenance workflow to the default branch, set repository
   variable `ASGARD_DELETION_MAINTENANCE_ENABLED=true`, and manually run Account
   deletion maintenance. Confirm a successful run before enabling acceptance.
4. Establish independent health alerts and encrypted deletion-ledger preservation,
   including the isolated restore procedure.
5. Set Render `ASGARD_ACCOUNT_DELETION_ENABLED=true`, redeploy and verify with a
   disposable account. A successful heartbeat less than three hours old is required.

Use the [complete activation procedure](account-deletion.md#hosted-activation-order)
for credential formats, monitor checks and destructive acceptance. No Vercel deletion
toggle is needed. No hosted settings or real accounts were changed by this task.
Provider-specific duplicate response compatibility, real email/MFA acceptance and
deletion operations remain pending reviewer/operator work. No new public endpoint
or account enumeration service was introduced.
