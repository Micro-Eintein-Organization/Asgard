# Password recovery implementation

2026-11-17. Implementer: Codex. Owner/reviewer: @YakisobaNissin.
The owner approved the preceding recovery plan in chat with “implement the local change”.
Scope: REQ-01/11/13, QA-01/02/09; public email request, isolated PKCE recovery,
new-password form, preserved MFA, global refresh-session revocation and sign-in.
Authority: [security policy](../security-and-operations.md#account-access-and-recovery),
[architecture](../architecture.md), [design](../design.md).

Affected modules: frontend auth, auth pages/routes, callback response headers,
local Supabase recovery email template, focused tests and feature guide.
No backend API, SQL migration, dependency, Google or MFA-enrollment change.
Use the existing Supabase SDK and shared form components. The recovery client has
an isolated in-memory session; only the SDK PKCE verifier survives the email round
trip in browser storage. Requesting recovery must not change the application session.
Callback validation and subsequent writes must retain the same verified subject.

Checks: focused recovery/MFA/session tests, TypeScript, scoped ESLint and build;
document hosted SMTP/redirect/template/notification, abuse controls and actual
email/MFA acceptance separately. Preserve existing documentation-baseline edits.
No commit, push, deployment, hosted configuration or real password reset authorized.

Source implementation, local evidence and pending operator acceptance are recorded
in the [feature guide](../features/password-recovery.md). Public-abuse controls,
real provider/session behavior and hosted email delivery are not inferred from mocks.
