# Shared Learning Topic on Dashboard

Historical Cabusao source record. The [current integration](cabusao-ui-integration.md)
excludes the browser-local learning store and uses saved account state. Original
tests below describe the older sample build, not current acceptance.

**Feature name:** Shared learning topic selection and Dashboard state

**Created:** 2026-10-31

**Last updated:** 2026-10-31

**Implemented by:** AI assistant using Copilot SDK in VS Code

**Acceptance coverage:** RUN 1a–1d

**Required reviewer:** `@YakisobaNissin` per [CODEOWNERS](../../.github/CODEOWNERS)

**Status:** Implemented locally; review and manual acceptance are pending.

## Implemented behavior

- Removed the shared demo banner and its dedicated styling.
- Choosing a topic on the Frontend roadmap stores its topic ID in browser local storage. Same-tab subscribers update immediately; the selection survives reloads.
- Dashboard now displays the selected topic, its fixture status, and progress calculated from that topic's sample milestone. Missing and invalid saved topic values render Empty and Error panels.
- Careers renders Empty for a real no-results search and Error for an invalid category filter. The Dashboard and Careers review-state controls are removed. Lazy page loading continues to use the app's Suspense loading panel; these pages do not fetch feature data.
- Added an application-level route error panel. Results-to-Discovery Back navigation restores the local question step and answers; retaking Discovery still starts a fresh draft.
- Kept navigation behavior within the currently documented paths. No conditional Discovery route map was added.

Statuses and progress still come from presentation fixtures; topic selection is local to this browser and is not saved to an account or backend.

## Relevant implementation

- [Dashboard](../../frontend/src/features/dashboard/page.tsx)
- [Roadmaps](../../frontend/src/features/roadmaps/page.tsx)
- [Local topic state](../../frontend/src/lib/learning-state.ts)
- [Careers](../../frontend/src/features/catalog/page.tsx)
- [Shared state panels](../../frontend/src/components/preview-states.tsx)
- [Routes and error fallback](../../frontend/src/app/router.tsx)
- [Discovery and sample-results return](../../frontend/src/features/discovery/page.tsx) and [Results](../../frontend/src/features/recommendations/page.tsx)
- [Focused flow tests](../../frontend/tests/learning-flow.test.tsx)

Product and architecture sources remain authoritative: [architecture](../architecture.md), [Discovery specification](../specs/discovery.md), [decisions](../decisions.md), and [pages and interactions](../pages-and-interactions.md).

## Verification

- `npm run build` from `frontend/`: passed.
- `npm test -- tests/learning-flow.test.tsx` from `frontend/`: passed, 7 tests.
- Targeted ESLint on changed frontend files: passed.
- `npm run lint` from `frontend/`: blocked by lint errors and warnings in the pre-existing, untracked `frontend/src/lib/learning-context.tsx`. That file was not modified.
- Full-stack browser tests and manual browser acceptance: not run; no services were started.
- `git diff --check`: passed.

The focused tests cover the Guided Discovery and Browse careers entry choices, Discovery Back/Skip, Results Back with answers restored, catalog-search preservation on roadmap Back, same-tab topic updates and reload persistence, Dashboard topic/status/progress, and invalid/empty states.

## Manual verification and limitations

When an already-approved local app is available:

1. Open `/roadmaps/frontend`, select a topic, then open `/dashboard`; confirm the topic title, status, and milestone progress match.
2. Reload `/dashboard` and confirm the topic remains selected.
3. Use the Dashboard empty state to choose a topic when no selection exists.
4. Search Careers for a term with no matches and confirm the Empty state; open an invalid category URL and confirm the Error state.
5. From `/welcome`, follow both entry choices. In Discovery, verify Back and Skip. Open the sample results layout, use Back to Discovery, and confirm the last question and answers return. From a filtered catalog, open a roadmap and use Back to confirm the search is retained.

Feature APIs remain unconnected, so sample result generation and saved progress/status are not implemented. The final Discovery submission remains unavailable; only the explicitly labeled sample results layout can be opened. Conditional question branches remain pending the reviewed route map described in [Discovery](../specs/discovery.md). Manual acceptance and required human review remain outstanding.
