> Historical record archived 2026-11-17. Dated scope and test evidence are retained; use the [current documentation](../../../README.md). This record does not grant new activation, implementation, or publication authority.

# Footer information and service status

Created: 2026-11-16. Task owner/implementer: Codex.
Required product and technical reviewer: @YakisobaNissin, per CODEOWNERS and
the owner's identity confirmation in chat. Status: plan approved by
@YakisobaNissin on 2026-11-16: “approved. implement end to end”. The owner also
confirmed the useful status overview with separate checks, time and retry.
See the [implementation guide](../../../features/footer-information-and-service-status.md).
Human implementation/content review remains pending; this scope approval does
not authorize publication or establish final Terms approval.

## Scope and acceptance

- FOOT-01: add working public footer links to Licenses, Credits, and Terms and
  conditions, alongside Service status. Preserve the existing black footer,
  supplied branding, focused-onboarding exclusions, and accessible reflow.
- FOOT-02: provide readable information pages using existing typography,
  spacing, components and tokens. Licenses use verified local notices and
  recorded content provenance; credits identify only documented contributions.
  Do not grant a new license to Asgard or imply a complete dependency audit.
- FOOT-03: provide a clearly labeled draft Terms and conditions page for owner
  review. Limit copy to documented service purpose, audience, recommendation
  limitations, account responsibility and availability limitations. Do not invent
  jurisdiction, operator contact, liability exclusions, consent enforcement,
  retention rules, or effective legal approval. Final legal wording remains
  pending owner review.
- STAT-01: simplify `/status` to a prominent current availability summary,
  compact component checks, last-check feedback and an explicit refresh action.
  Reuse existing health/readiness requests. Distinguish checking, successful,
  failed and refreshing states; label the limited scope of connectivity checks.
  Never display an invented uptime percentage or claim that AI, email delivery,
  account access or every application feature has been checked.

Related requirements: NFR-01/02 presentation, accessibility and reflow in
[Product](../../../product.md); existing [design system](../../../design.md);
[architecture](../../../architecture.md), especially A-09 and free-tier availability.
The new task-local IDs above are acceptance criteria from the owner's request,
not claims of pre-existing product approval.

## Implementation boundary

Work on the existing `codex/cabusao-ui-integration` feature branch. This is a
frontend feature follow-up, not Stages 1–4 foundation work. No branch changes,
commits, pushes, deployment, dependency additions, authentication, database or
shared API contract changes.

Affected files: `frontend/src/app/shell.tsx`, `frontend/src/app/router.tsx`,
`frontend/src/lib/routes.ts`, `frontend/src/app/status.tsx`, its existing test,
a new public information-page module and focused tests, and narrowly scoped
footer/information/status styles in `frontend/src/styles.css`.
Update `docs/design.md` and create
`docs/features/footer-information-and-service-status.md` with results and manual
steps. No deferred-feature scope changes are proposed.

Existing uncommitted work in MFA, Settings, its feature guide, and styles is
outside this task. Preserve those edits; add only task-specific CSS rules.
Dependencies: existing router, query client, generated health/readiness response
types, locally retained license notices and documented contribution provenance.
Shared contracts remain unchanged. No additional agent is assigned.

## Verification and handoff

Use existing status tests to cover successful, pending, partial-failure and
retry behavior, including rejection of false success. Add focused public-page
navigation coverage where existing test infrastructure supports it. Run
frontend TypeScript and scoped ESLint, then relevant tests. Check documentation
links and whitespace. Reuse foundation evidence for unchanged backend/auth paths;
do not start infrastructure or rerun the foundation suite.

Inspect available local rendering for footer wrapping, readable status and
information pages, and keyboard navigation. Record checks actually performed;
give exact local URLs and expected results for remaining manual checks. Human
presentation/content review and final Terms approval remain explicit gates.
