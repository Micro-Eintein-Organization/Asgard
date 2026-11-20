# Account entry UI repair

Recorded: 2026-11-20. Task owner/implementer: Codex.
Required reviewer: @YakisobaNissin, per [CODEOWNERS](../../.github/CODEOWNERS).
Status: owner approved the combined repair in chat ("implement") on 2026-11-20;
source implementation and focused checks complete. Final human review, visual
and hosted acceptance remain pending; see the linked feature guides for evidence.
Requirements: REQ-01/11/13; preserve existing QA-01/02/09/11 security boundaries.

## Report and findings

The owner reports broken registration/login UI and a missing Sign in again button.
The supplied current screenshot shows Sign in again as plain header text beside
the logo, above the normal login form. Source inspection establishes:

- The header renders that text only when AuthContext has an error. It is a bare
  link outside the public navigation/action wrappers used to align other controls.
- ConnectedAuthPage displays submission errors but does not display AuthContext's
  session restoration/security error. The header can therefore indicate an error
  while the form gives no explanation.
- Signup-code verification routes to optional authenticator setup. Ordinary
  sign-in uses /start and can bypass that offer after external email confirmation.
  This is a separate navigation gap, not proof of a disabled hosted enrollment flag.

The actual provider failure and deployed frontend/backend flags remain unverified.
The working tree was clean on codex/cabusao-ui-integration at inspection. This is
feature repair, not Stages 1–4 foundation work; preserve the branch and Git history.

## Bounded implementation proposed for review

1. Render the existing session-error sign-in action using the shared header action
   alignment and Button component. Preserve state-specific public/account navigation.
2. Show the existing session-error message in the account-entry card. Preserve the
   usable login form and its existing credential submission, loading and MFA guards.
3. Restore the optional 2FA offer for the new-learner branch of /start, including
   external email confirmation followed by sign-in. Reuse the existing returning-
   learner/context and account-scoped entry-choice checks; reuse provider factor
   status to avoid offering enrollment to already-enrolled accounts. Keep
   /set-up-2fa?welcome=1, Skip for now and continuation to Welcome. Never redirect
   that continuation back through /start into a setup loop. Preserve enrollment
   and backend recovery gates, explaining unavailable setup rather than bypassing
   them. Existing returning-account and required-MFA challenge behavior stays intact.
4. Check login, registration, verification and recovery layout using existing design
   tokens; correct only reproduced alignment/visibility problems. No page redesign.
5. Update the [account access guide](../features/account-access-fixes.md),
   [entry guide](../features/new-account-discovery-entry.md) and
   [2FA guide](../features/optional-two-factor-authentication.md) with the
   reviewed scope, source changes, evidence and remaining manual/hosted acceptance.

Affected modules: frontend/src/app/shell.tsx and its existing tests;
frontend/src/features/auth/connected-page.tsx and its existing tests;
frontend/src/features/auth/entry-destination.tsx and its existing tests;
frontend/src/features/auth/mfa-page.tsx and its existing tests if necessary;
frontend/src/styles.css only if a reproduced layout issue requires it;
the implementation guides above and this plan.

Dependencies/contracts: existing AuthContext, React Router, shared Button and auth
form. No new dependency, provider configuration, schema or API change is proposed.
The owner explicitly added the missing optional 2FA offer to this repair on
2026-11-20. Existing context/entry-choice checks identify the onboarding branch;
they do not establish a new persisted onboarding-completion or security contract.

## Verification and handoff

Extend existing focused tests for error-state header action, visible session-error
feedback and preserved signed-out/loading/MFA navigation. Run affected auth/header
and entry-destination tests, frontend TypeScript and scoped lint using the
supported local workflow. Include new-learner sign-in to setup, Skip for now to
Welcome without a loop, returning/chosen-account routing, already-enrolled factor
handling, and existing required-MFA guards. Keep existing setup-capability tests.
Inspect /sign-in, /create-account, /check-email and /password-recovery at desktop
width and narrower reflow, including keyboard access and visible control states.
Use disposable accounts for any real provider checks. Report source checks and
browser/hosted acceptance separately; no hosted behavior has been verified yet.

Approval requested: designated reviewer review of this plan before implementation,
as required by [AGENTS.md](../../AGENTS.md). No commit or publication is included.
