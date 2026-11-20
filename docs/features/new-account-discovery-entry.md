# New-account Discovery entry

2026-11-20 follow-up (Codex, REQ-01/11/13): owner approved the
[account-entry repair plan](../plans/account-entry-ui-repair.md) in chat. `/start`
now routes the existing new-learner branch through `/set-up-2fa?welcome=1` before
Welcome, covering external email confirmation followed by sign-in. Provider factor
lookup excludes accounts with verified authenticators from this enrollment offer;
unverified factors do not count as enabled. Lookup errors retain explicit retry.
Returning learners and account-scoped explicit entry choices still reach Dashboard.
Skip for now opens Welcome directly, avoiding a setup redirect loop. Enrollment and
recovery capability gates remain enforced. Source: `frontend/src/features/auth/entry-destination.tsx`;
existing destination tests now cover enrollment, provider lookup and Skip navigation.
No persistent onboarding/security contract changed. Human/hosted acceptance pending.

Follow-up verification: all nine destination tests passed, plus existing signup,
header, session and MFA suites (60 distinct passing cases across seven suites).
TypeScript and scoped lint passed. One stale MFA test destination was corrected;
all eight MFA UI tests then passed. Browser connection timed out before visual
inspection. With a disposable verified account without saved learning/Discovery or
a browser entry choice, open `http://127.0.0.1:5173/sign-in`; expect Protect your
account before Welcome. Skip must open Welcome without a loop. Existing enrollment
flags may disable setup with an explanation; they must not silently skip the page.
An enrolled account must complete its required challenge; a new learner already
enrolled then reaches Welcome. Returning/chosen accounts must retain Dashboard.
Report the failing route/step without passwords, tokens or recovery codes.

Implementer: Codex. Created/updated: 2026-11-20. Reviewer: @YakisobaNissin.
Requirements: REQ-01/04; F-001-AC-01. Owner reported hosted accounts missing the
Discovery entry. Scope: post-sign-in navigation and welcome choice only; preserve
all existing verification/session/MFA checks, APIs and schemas. Existing edits
remain intact. Plan/checks: common protected entry destination, existing saved
context, browser/account-scoped explicit choice, focused route/verification tests
and TypeScript. Final human review and hosted acceptance pending.

## Behavior

Password sign-in and authenticated landing previously always navigated directly
to Dashboard. Only the in-app signup verification flow reached optional security
setup and Welcome; external confirmation followed by sign-in could skip the choice.

The initial correction made sign-in, authenticated Landing and successful MFA challenge use protected
`/start`. Existing Discovery draft/completion or current roadmap identifies a
returning learner. Otherwise Welcome offers Guided Discovery or Browse careers.
An explicit choice is remembered by account in local browser storage, so deliberate
browsing does not repeatedly prompt in that browser. This is a navigation preference,
not an access-control signal. Saved server context is still used on other devices.
A browser-only explorer with no saved context may see the optional choice again
on another browser/device; no new persistent onboarding contract is introduced.

Context failures show retry and an explicit Welcome link rather than silently
opening Dashboard. Private queries remain account-scoped through the existing
query helper; `/start` remains under ProtectedRoute after verified email/MFA.

Sources: auth entry destination/connected page/pages/MFA navigation; Discovery
container; router/routes and shell. No backend, auth-provider, migration or new
dependency change. This is a frontend deployment correction for Vercel.

## Verification and manual acceptance

14 focused route/verification tests passed; TypeScript passed. A short local browser
check with two disposable verified accounts passed: fresh sign-in → Welcome,
Browse → catalog, remembered choice → Dashboard, and another account → Guided
Discovery. Both disposable accounts were removed. Scoped lint passed after moving
the noncomponent browser-storage helpers into their own module for Fast Refresh.
Hosted behavior remains unverified until the updated frontend is deployed.

At `http://127.0.0.1:5173/sign-in`, sign in with a fresh verified disposable account.
Expect Welcome with both paths, not Dashboard. Choose Browse careers and verify
the catalog; sign out/in and expect Dashboard in that browser. A second fresh
account must see Welcome. Returning accounts with saved Discovery or learning
context should reach Dashboard. Verify the existing signup-code/security-setup
path still offers both choices. Report the route, chosen path and expected/actual
destination without passwords or tokens.
