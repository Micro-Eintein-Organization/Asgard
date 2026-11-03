# Discovery and catalog refresh

Historical implementation/evidence record: later source, explicit deferrals and current acceptance limits are consolidated in [Development](../development.md#current-local-mvp-status-2026-11-02). Preserve dated results below; earlier three-path, copied-retake or unverified descriptions do not override that current status.

Created: 2026-10-28. Updated: 2026-10-29.
Status: source changes made; human review and visual acceptance pending.
Requirements: REQ-04, REQ-05, REQ-07, REQ-09; F-001 and F-002.

The implementation uses the supplied Figma exports for Discovery and the catalog, with
saved suggestions visible in the catalog, and requested the previously discussed
handoff plan. The five server-defined questions and conditional activities remain
authoritative. First-time choices and new retakes start blank; Settings starts the
retake and existing drafts remain resumable. Published content, saved suggestions,
roadmap destinations and explicit learning focus remain separate.

Affected source: `frontend/src/components/discovery/`, `frontend/src/components/catalog/`,
`frontend/src/features/recommendations/`, `frontend/src/screens/SettingsScreen.tsx`,
`frontend/src/screens/DashboardScreen.tsx`, `frontend/src/app/guidance.tsx`, and the
Discovery/progress services. Existing generated API contracts are reused.

The Figma cards guide layout, spacing and selection treatment. Placeholder art and
percentage-match values do not represent real catalog data or assessed suitability.
Gray shapes remain decorative reference placeholders; the live role names, choices,
explanations and saved status come from existing APIs. Existing design tokens,
native input controls and responsive grids retain keyboard and reflow behavior.

Verification: frontend TypeScript and lint; 28 existing focused backend tests;
full backend lint after the approved formatting cleanup. Backend changes still
require the focused database and session checks in the handoff plan.
The requested testing scope is minimal; manual visual and full flow acceptance are pending.
Use `/welcome`, select Guided Discovery, answer/skip questions and open the results;
choose a suggestion and view its roadmap. Open `/careers`, search, filter and select
a suggested or other published career. In Settings, start a retake and confirm that
the initial answers are blank. Check banner dismissal and Dashboard branch states.

On 2026-10-29 the progress response was extended with roadmap-level applicable and
Done counts, a percentage and explicit state; the roadmap page uses that summary.
The generated OpenAPI and TypeScript client were regenerated. A focused unit test
passes for unresolved and selected branches, skipped work and completion. Mocked
synthetic-account database acceptance passed for retake and progress readback;
full browser acceptance remains pending. Selecting a
suggested catalog role now retains its published roadmap destination. Document
selection and pending operations participate in the Settings navigation guard.

The Data Analyst detailed release was published locally on 2026-10-29 and passed
repeat publication and mocked synthetic-account persistence acceptance. Frontend
type checking, lint and production build passed. The local browser journey passed
login, blank Discovery, saved results/provider outage, explicit focus, Career
resume, Profile refresh, keyboard dropdown, logout/login and 320px reflow.
Registration verification and fresh-install/upgrade testing of release 2 subsequently
passed in the isolated local [acceptance run](deployment-preparation.md).
Human visual/content review remains deferred. PDF processing is deferred with
server-side denial and retained removal/cleanup. See
[handoff](mvp-backend-handoff.md).
