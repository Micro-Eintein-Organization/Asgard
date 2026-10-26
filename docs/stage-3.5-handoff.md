# Stage 3.5: canonical application UI

26 October 2026. Owner: Codex. Required reviewer: project lead (product and architecture reviewer). Review reference: this task's consolidation plan, approved by the owner's “implement” reply. Branch: `codex/stage35-canonical-ui`. No commit, push or merge is authorized.

## Reviewed scope

Remove the standalone UI Preview after preserving its useful presentation in the authenticated application. Coverage: REQ-01–05, REQ-07–11/13, NFR-01/02/09 and the owner's seven cleanup requirements. New verified accounts retain Welcome's Browse careers / Guided Discovery choice; returning sign-ins retain Dashboard. Profile setup remains optional.

Affected modules: frontend routing, shell, page links, auth presentation, Profile presentation, prototype copy and existing affected test references. Update README, design guidance, page guidance and the decision record. Dependencies, backend, database, generated contracts, Supabase session handling, protected-route checks and logout implementation stay unchanged. No Stage 4 contracts or Stage 5 business logic.

## Preservation comparison

| Page | Source comparison and required action |
| --- | --- |
| Dashboard | Both route trees already render DashboardPage, including activity calendar, milestones, supporting cards, sample progress and state controls. Retain it. |
| Entry and Discovery | Both render WelcomePage / DiscoveryPage. Retain both entry choices, all five rounds, selection rules, back navigation and unsaved-input protection. |
| Careers, recommendations and roadmap | Both render CatalogPage / ResultsPage / RoadmapPage. Retain fixtures, filters, shared career cards, topic/resource panels, focus handling and sample states. |
| Profile | Retain the real Profile editor. Move the Preview-only career-background, saved-suggestions and preference sections into it as explicit prototypes before deleting the disconnected editor. Preserve local preference selection without persisting it. |
| Account and security | Retain the existing cards and unavailable-action explanations; remove Preview mode. |
| Account entry | Retain connected forms and their validation/provider calls. Carry over useful password presentation, account-entry navigation and honest unavailable states before deleting disconnected duplicate forms. |
| Component gallery | Remove the standalone showcase and its route/navigation; retain shared primitives, styles, license and design assets. |

This source comparison establishes reuse, not rendered parity or visual approval. Manual review is required before final acceptance.

## Verification and review handoff

Planned: frontend typechecking and directly affected existing Vitest tests only; static route/reference and documentation-link checks. Adapt useful existing browser checks to authenticated destinations without running Playwright or adding infrastructure. No full suite, Docker rebuilds or dependency changes.

| Check | Result |
| --- | --- |
| `npm run typecheck` in `frontend/` | Passed after application and existing browser-test updates. Includes source, Vitest tests and browser-spec TypeScript. |
| `npm test -- src/features/auth/connected-page.test.tsx src/features/profile/validation.test.ts` in `frontend/` | Passed: 2 files, 8 tests. Covers existing verification/resend failure feedback and name validation, plus successful verified-registration entry to both Browse careers and Guided Discovery, and unavailable recovery without provider calls. |
| Rendered comparison and live manual navigation | Pending project-lead review. Source reuse is confirmed; visual parity, live authentication and interactive acceptance are not claimed from these checks. |
| Browser regressions | Existing useful Preview checks now target canonical authenticated pages in the existing Auth-enabled spec, using its existing mocked session/Profile pattern. Public entry and retired-address checks remain in navigation.spec.ts. Removed gallery-only dialog/tab examples; real Profile dialog and account-menu checks remain. Not run, per the owner's verification scope. |
| Static boundaries / whitespace | Passed: no standalone Preview destinations or mode helpers remain in application source; protected routes remain under ProtectedRoute. No diff in backend, Supabase, Auth provider/transport, generated API, Profile API, logout helper, dependency locks or design assets. `git diff --check` passed. |
| Documentation links and anchors | Passed: 70 local links/anchors across the six affected Markdown documents after correcting the historical migration reference. |
| Full suite, Playwright, backend/security/provider tests, Docker builds | Not run: no backend, Auth provider, protected-route, logout helper, API, schema, dependency or infrastructure changes. No new test infrastructure or service restarts. |
| Follow-up email-verification flow | Passed: `npm run typecheck` and the existing `src/features/auth/connected-page.test.tsx` (7 tests). Direct verification without pending registration returns to account creation; successful verification retains both new-account destinations. The focused test caught and verified the fix for a redirect race during successful confirmation. |

Removed: public Preview route tree/constants, mode-dependent routing helper and shell branches, Preview entry/exit/gallery links, the component-gallery page and its unused showcase CSS, the disconnected Profile editor and duplicated disconnected account-entry forms. Retained: canonical populated screens, sample fixtures/state controls, calendar, filters, roadmap/topic/resource interactions, shared primitives/styles/license, all approved/reference design assets, real Supabase session handling and protected routes, FastAPI Profile integration and logout. The Profile prototype preference selection joins the existing dirty-input guard; it is never sent to the Profile API. The account/security cards are retained in account-page.tsx. The remaining preview-named shared state/guard modules are used inside the application and do not expose a separate experience.

Documentation updated: README, design.md, pages-and-interactions.md, decisions.md and development.md. A pre-existing broken development-guide link to the former SQL-review location was detected during link checking; it now points to the existing versioned migration, with the pre-activation scope explicitly preserved. Historical verification records retain their original scope. This handoff records the source comparison, changes and current evidence for REQ-01–05, REQ-07–11/13 and NFR-01/02/09; it does not claim completed MVP acceptance.

## Manual navigation checklist (pending)

Use the existing locally activated stack at <http://127.0.0.1:5173>. Do not activate or rebuild another environment for this cleanup.

1. Open `/check-email` directly without a pending signup; expect a redirect to `/create-account`. Create a synthetic account and submit registration; expect the check-email step to show the signup address as read-only, then verify its emailed code. Confirm `/welcome` asks “How would you like to begin?” with Continue disabled until a choice is made. Browse careers must open `/careers`; Guided Discovery must open `/discovery` at Question 1 of 5. Profile setup remains optional.
2. Sign in through `/sign-in` with an existing account: expect `/dashboard`. Refresh to confirm session restoration. Navigate Dashboard, Careers, a roadmap/topic/resource, Discovery, `/recommendations`, Profile and Account/security. Confirm the retained layouts/content and nearby sample/prototype labels. Try sample/empty/loading/error selectors; do not interpret them as service outcomes.
3. At `/settings/profile`, save a synthetic name and refresh to confirm persistence. Confirm the background-document, saved-suggestions and preference sections remain visible; uploads/preference saves stay unavailable. Select a prototype preference and confirm it is local only. Check Stay, Discard and Save-and-leave for dirty name edits, and confirm preference selections are not presented as saved.
4. Open the account menu and Log out: expect `/`. Check dirty-edit confirmation first when applicable. Revisit `/dashboard` or `/settings/profile`: expect sign-in. Check `/preview`, `/preview/dashboard`, `/preview/settings/profile` and `/preview/components`: expect Page unavailable, with no Preview navigation links.

Report failures in this task with the URL, action, expected/actual result and viewport; omit passwords, tokens and private profile data. Human review is required before integration. No dependent integration order; follow-up manual acceptance belongs to the project lead. No commit, push or merge was performed.
