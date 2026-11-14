# Optional two-factor authentication and hosted account demo

2026-11-14 Render Free correction: the owner encountered Blueprint rejection of
`maxShutdownDelaySeconds`. Codex removed that unsupported override and shortened
Uvicorn shutdown from 40 to 20 seconds to fit the host's default 30-second window.
The existing startup check now guards that bound. This is a hosting compatibility
fix under the approved plan; no provider/plan, API or database change. Required
reviewer remains @YakisobaNissin. Focused verification on 2026-11-14: six existing
startup/port tests passed in the existing Docker image with no network and a
read-only source mount; scoped whitespace checks passed. The existing
Starlette/httpx deprecation warning remains. Hosted Blueprint revalidation and
shutdown acceptance remain pending publication.

2026-11-14 setup follow-up: the owner's reported hosted migration application,
verified-TLS restricted-role login and Gmail SMTP/template configuration are
recorded in the [deployment progress](../deployment-account-demo.md#setup-progress-2026-11-14).
Content application, hosting and manual/provider security acceptance remain pending.
The source checks below are unchanged; this follow-up does not claim new execution
of the hosted authorization or MFA matrix.

Implementer: Codex. Created: 2026-11-13. Last updated: 2026-11-13.
Status: source implemented; hosted capability, technical review and manual acceptance pending.
Required reviewer/operator: @YakisobaNissin. Requirements: REQ-01/13,
QA-01/02/09/11, A-01/02/09, AUTH-C2.

The owner approved implementation of the [bounded plan](../plans/hosting-account-demo.md)
in this chat, selected the current app branch and retained built-in email for their
eligible address. The later direction requests a team-wide Vercel-link demo with
real persistence. This approval does not establish provider capabilities or test results.
Owning requirements remain [Product](../product.md),
[Security and operations](../security-and-operations.md) and
[Architecture](../architecture.md). Follow the [operator setup checklist](../deployment-account-demo.md).

## Implemented behavior

Verified signup opens `/set-up-2fa?welcome=1` before Welcome. Setup is strongly
recommended and offers **Skip for now**. Settings links to the same management
page once this environment's enablement gate passes. Setup is optional; already
enrolled accounts must complete `/verify-2fa` before accessing protected pages.
Existing MFA sign-in and recovery verification remain available with enrollment disabled.

AuthProvider checks the current provider factor state with the session JWT,
rather than trusting cached user factor metadata. Protected routes wait for that
check; errors fail closed. Auth checks run outside Supabase's session callback
lock. Generation guards discard responses from earlier sessions. Shared guidance
and Counselor queries are not mounted while MFA is checking or required.

Setup requires password confirmation, provider QR/manual-secret enrollment and an
explicit TOTP verification within five minutes. Reopening interrupted setup
requires password confirmation before clearing unverified TOTP factors. Verified
factors are never cleared by this recovery path. Recovery codes come from
Supabase's experimental SDK API and are displayed once in component memory, with
explicit copy/download and acknowledgment. They are not written to browser
storage, application tables, logs or query caches.

Recovery generation/rotation and disablement require fresh password authentication
and a current authenticator or unused recovery code. Disablement requires explicit
confirmation, removes recovery material/authenticators and globally signs out.
Partial failures and lost rotation responses instruct the user to recheck provider
status; no automatic retry claims that previous codes are still usable. Lost-all-factor
recovery has no email or administrator bypass in this implementation.

The existing SQL `session_allowed` guard and restricted-role transactions continue
to enforce confirmed, active sessions and AAL2 for accounts with verified factors.
No SQL, API schema or dependency change was made. Browser reauthentication is a UX
control: it does not prove fresh-auth restrictions at direct provider endpoints.
The receiving-service fresh-auth and notification behavior must pass AUTH-C2 before
`VITE_MFA_ENROLLMENT_APPROVED=true`; the default is false. An unavailable provider
capability blocks enablement, without replacing Supabase or weakening the policy.

Email errors distinguish the demo sending quota, ineligible recipients and request
throttling, without exposing raw provider errors or automatically retrying sends.

## Source modules

- `frontend/src/auth/`: session assurance, provider SDK configuration, route guard,
  email errors and focused regression tests.
- `frontend/src/features/auth/`: account entry, setup/challenge/recovery UI and tests.
- `frontend/src/app/`: route registration, assurance-aware shared UI and status copy.
- `frontend/src/screens/SettingsScreen.tsx`: existing account card integration.
- `render.yaml`, `compose.yaml`, environment examples: disabled optional hosted
  processing and explicit MFA enablement gate.
- `backend/tests/test_auth_profiles.py`: corrected the old response expectation
  to include the existing `photo_enabled` field; runtime backend code is unchanged.

## Verification

Executed on 2026-11-13 in the current Windows checkout:

| Check | Result and limits |
| --- | --- |
| Focused frontend suite | **Pass: 36 tests across nine files.** Covers MFA routing, skip, explicit setup verification, recovery rotation, confirmed disablement/global sign-out, partial removal failure, restored sessions, stale-response rejection, email errors and existing transport/Settings/hosted configuration. Provider operations are mocked; this is not hosted capability evidence. |
| Backend auth/configuration/operations | **Pass: 39 tests** in the existing Python 3.13 Docker image, no network, read-only source mount. Verifies JWT rejection/identity, anonymous access, forged ownership inputs, configuration fail-closed behavior, health/readiness and sanitized logs. Existing Starlette/httpx deprecation warning remains. |
| TypeScript | **Pass**, including production build typechecking. |
| Changed-source ESLint | **Pass**, auth files, changed account entry/Settings/routes/shell/status. |
| Backend changed-test Ruff | **Pass** with cache disabled for the read-only source mount. |
| Repository-wide ESLint | **Failed outside this change:** pre-existing set-state-in-effect errors in resume-skill-review, profile-photo and use-recommendation-flow, plus the existing AI-guidance fast-refresh warning. Preserved those unrelated sources. |
| Hosted-mode build | **Pass**, staging configuration with synthetic public origins/key, Auth enabled and enrollment gate false. Main bundle ~576 kB triggers the existing 500 kB advisory; no warning threshold was suppressed. |
| Configuration | **Pass:** Compose validation; content-publication SQL generated in memory (5,663,168 characters). No database publication occurred. |
| Documentation | **Pass:** 22 local links/anchors across the new guides and edited sections, whitespace checks in six documents, and scoped `git diff --check`. An initial wider scan found a pre-existing stale W08 anchor in Future development; it was outside the edited section and left unchanged. |
| Actual hosted pooler/RLS, revocation/isolation, SMTP, MFA/recovery/fresh-auth and health | **Not run:** no hosted project, origins, credentials or server capability were provisioned. Mocked tests do not establish live DB/RLS or provider behavior. |
| Browser journeys, inbox delivery and appearance | **Not run:** assigned to the owner by explicit instruction. |

The first backend run had one stale Profile response expectation; it was corrected
to include the existing `photo_enabled` field and the affected group passed its
retry. The first CLI-help attempt hit sandbox telemetry permissions; the permitted
retry verified `db push --linked --dry-run` without linking or modifying a project.
No browser journeys, inbox checks, hosted migrations or live MFA calls are claimed. Existing dated foundation
evidence is linked in [Development](../development.md#current-foundation-status-and-evidence);
it does not establish this hosted environment or the new MFA behavior.

## Owner manual acceptance

Use the actual frontend origin recorded during setup. On the local app the
corresponding starting address is `http://127.0.0.1:5173/create-account`.

1. Register with your eligible organization email, receive the real code and verify.
   Wrong/expired codes should leave a recoverable error. Respect the shared send quota.
2. Choose **Skip for now**. Welcome should open and normal non-MFA login should work.
3. After AUTH-C2 passes and the gate is enabled, open `/settings/account`, then
   manage the authenticator. Confirm the password, scan QR or enter the setup key,
   verify a current code and save recovery codes privately.
4. Log out and in. Dashboard and direct protected URLs must wait for authenticator
   verification. Wrong codes must not open protected data; refresh must preserve enforcement.
5. Use one recovery code. Reusing it must fail. Authenticated rotation must replace
   the old set. Verify lost-response behavior and disablement/session revocation.
6. Check normal navigation, saved data, keyboard/focus, appearance and cold starts.

Report route, step, expected/actual outcome and a safe request ID. Never send
passwords, tokens, QR/setup secrets or recovery codes. Manual acceptance belongs
to the owner, by explicit request. It is pending until reported.

## Limitations and release boundary

This is a noncommercial team demo with synthetic profile/learning data and a real
owner email. Custom SMTP remains the selected prerequisite for ordinary-user
signup; team members do not receive organization privileges merely for email.
Google, reset-password implementation, deletion, hosted AI/uploads/photo processing
and real-user operational acceptance remain outside this increment. Vercel sharing
does not make Render or Supabase private. No live site, custom SMTP, backup schedule,
restore evidence or provider setting has been created by these source edits.
