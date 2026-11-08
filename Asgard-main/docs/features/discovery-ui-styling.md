# Discovery, Roadmap and Shared UI Styling

Historical Cabusao source record. The [current integration](cabusao-ui-integration.md)
adapts presentation to account-backed services; original sample behavior and named
review assignments below do not govern the integration or establish acceptance.

**Feature name:** Discovery, Roadmap and shared UI styling
**Implemented by:** AI assistant using Copilot SDK in VS Code
**Created:** 2026-10-31
**Last updated:** 2026-11-02
**Implementation/review status:** Implemented locally; human review pending
**Acceptance IDs:** UI-1a, UI-1b, UI-2, UI-3, UI-4, UI-5, UI-6, UI-7, UI-8, UI-9, UI-10–UI-16 (task-local IDs; not product-specification IDs)
**Required reviewer:** `@YakisobaNissin` per [CODEOWNERS](../../.github/CODEOWNERS)

## Implemented behavior

- UI-1a: The first Discovery question's Return link uses the shared pill Button styling while continuing to navigate to Welcome.
- UI-1b: The footer is hidden on Welcome, every Discovery question, and sample Results; other routes retain it.
- UI-2: The footer uses a black background and white text and link typography without changing its content or layout.
- UI-3: Shared buttons use the existing pill radius, have no decorative borders, retain visible keyboard focus, and black buttons hover to `#3F8AC8`.
- UI-4: Every Discovery question keeps its Return control and arrow visible and aligned after step changes. The first Return remains a link to Welcome; question order, destinations, and handlers are unchanged. The visible question/topic line is removed; the progressbar exposes its current question as accessible value text.
- UI-5: Roadmap eye controls hide and restore tasks with fade-and-slide transitions. Hidden tasks are inert; their data and completion state are preserved, and reduced-motion preferences disable the transitions.
- UI-6: Desktop Roadmap topic details stay sticky below the fixed header with internal scrolling. The mobile panel remains in normal flow and selected details scroll below the header.
- UI-7: A completed Roadmap task displays a check mark; incomplete tasks use the not-completed icon. The displayed icon follows the task's current status and remains correct when a task is hidden and restored.
- UI-8: The browser-native search-field clear and the separate labeled app clear button are both available while a query is present. Either clears only the query and retains the selected category. The app button is keyboard-operable; Escape clears the focused search input for keyboard users.
- UI-9: Discovery options and recommendation cards share a blue selected-card treatment with a white check in a circle, visible keyboard focus, and lift-on-hover/selection motion. Recommendation cards enter with a staggered fade/slide, use native single-select radio semantics, and have no individual View roadmap action. Set as Career stays disabled until selection, then navigates to the selected career's existing roadmap route; Retake Discovery restores navigation-state drafts.
- UI-10: With no selected learning topic, Dashboard keeps its empty-state card and Choose a topic action while hiding the heading block, calendar and streak summary. These return when a topic is selected.
- UI-11: Dashboard status groups display accessible counts that update with topic state. In progress uses yellow, Not started grey, and Complete green fills with dark text; count circles have no outline. Status triggers do not underline on hover or focus and retain visible focus styling.
- UI-12: The Current roadmap card uses matte black with white text, a compact grey label, a SquarePen icon beside Edit, and a pill Open roadmap control. Its hover treatment is a 10% white overlay with a lighter outline and no underline; focus remains visible.
- UI-13: The Skip-to-careers confirmation uses the requested prompt and Confirm/Stay labels only for the Careers destination. Other blocked Discovery exits keep their existing copy. Staying or pressing Escape preserves answers; the dialog retains focus trapping and returns focus to its trigger.
- UI-14: Recommendation cards use the shared 16 px radius token and a light idle border; selected cards retain the blue fill without a border. The existing disabled Set as Career action is verified to ignore click, Enter and Space with no selection. The landing note explains that a career can be changed later.
- UI-15: Career cards show a rounded, labeled completion meter only when saved topic state exists for that career. Progress is completed saved topics divided by curriculum topics, rounded to the nearest percent. Only Frontend Developer has sample curriculum data; other careers show no meter.
- UI-16: The global custom mint `::selection` colors were removed. Normal text selection remains enabled, and interactive focus rings are unchanged.

The footer is hidden on Welcome, every Discovery question, and sample Results; where displayed, it spans the viewport and the flex page shell keeps it flush with the page bottom without a fixed-height workaround. These changes do not alter Discovery question logic, answer state, Roadmap task data/status, or existing navigation destinations. All seven catalog career IDs use the existing `/roadmaps/:careerId` route; only Frontend Developer currently has sample milestone content, while other career routes show the available career overview and unpublished-curriculum state. Product and design authority remain in the [Discovery specification](../specs/discovery.md), [pages and interactions](../pages-and-interactions.md), and [implemented design system](../design.md).

## Relevant source and tests

- [App shell](../../frontend/src/app/shell.tsx)
- [Route presentation configuration](../../frontend/src/lib/routes.ts)
- [Shared Button](../../frontend/src/components/ui/button.tsx)
- [Dashboard](../../frontend/src/features/dashboard/page.tsx)
- [Discovery page](../../frontend/src/features/discovery/page.tsx)
- [Unsaved Discovery dialog](../../frontend/src/components/unsaved-preview-dialog.tsx)
- [Recommendations page](../../frontend/src/features/recommendations/page.tsx)
- [Catalog page](../../frontend/src/features/catalog/page.tsx)
- [Career card](../../frontend/src/components/career-card.tsx)
- [Learning state](../../frontend/src/lib/learning-state.ts)
- [Roadmap page](../../frontend/src/features/roadmaps/page.tsx)
- [Shared styles](../../frontend/src/styles.css)
- [Route tests](../../frontend/tests/navbar.test.ts)
- [Discovery flow tests](../../frontend/tests/learning-flow.test.tsx)
- [Browser UI regression test](../../frontend/tests/auth-ui.spec.ts)

## Verification

- `npm test` from `frontend/`: passed, 8 files and 50 tests.
- `npm run lint` from `frontend/`: passed with zero warnings.
- `npm run build` from `frontend/`: passed, including TypeScript build checks.
- 2026-11-02 polish update: the frontend build, all 50 tests, lint, and `git diff --check` passed.
- 2026-11-02 Dashboard/Discovery/recommendations/catalog update: `npm run build` passed; `npm test` passed (8 files, 55 tests); `npm run lint` passed with zero warnings; `git diff --check` passed.
- Focused component tests verify empty Dashboard visibility and restoration, live status counts, Skip-only copy and unchanged other-exit copy, dialog Escape/focus return and answer retention, recommendation notice and disabled action keyboard behavior, and persisted curriculum progress/absence on other careers. CSS assertions confirm no custom `::selection` rule and a contrast ratio of at least 4.5:1 for all status-count fills.
- A local browser opened `/dashboard` but rendered “Account setup awaits approval” because local authentication is not activated. No feature UI, hover/focus rendering, or 390 px overflow check could be performed; auth setup was left unchanged. Reduced-motion support remains governed by the existing global `prefers-reduced-motion` rule and was not rechecked in a browser.
- The integrated browser reached `/recommendations` but rendered the local "Account setup awaits approval" gate. No Discovery/Recommendations browser interactions, 390 px visual check, or feature DOM/style inspection could be performed; authentication configuration was not changed.
- Integrated-browser checks used the local UI session at desktop (1440×900 and 1280×720) and mobile (390×844): all five Discovery steps had a visible Back control and arrow with no footer; Roadmap hide/reveal produced intermediate opacity/slide/height states while retaining the `Done` status; reduced motion computed zero transition duration; sticky details remained 24 px below the header through the page end without clipped ancestors; and selected mobile details appeared below the header. Footer geometry/color and no horizontal overflow were also checked.
- The task row's `Done`-conditional check icon and the not-Done circle passed focused component tests and were confirmed in the integrated browser DOM at desktop (1440×900) and mobile (390×844). Hide/restore assertions and browser DOM checks confirm the completed check remains after restoring the task.
- The app clear button is separately labeled “Clear search query.” In the visible integrated browser, pointer activation cleared `q` and preserved the selected Design & UX category. A Playwright mouse event targeted the browser-native search clear X; it cleared `q`, preserved the category and removed the separate app button. Keyboard activation of the app button cleared the query and preserved the category; its keyboard focus showed a 3 px solid green outline. Escape clears the focused search query and preserves the category.
- The native pseudo-element X is not a separate keyboard-focusable control; keyboard users can clear the focused search through Escape. Visible-browser interactions were performed at desktop width. The earlier hidden-browser checks at desktop and mobile remain computed DOM/style evidence rather than screenshot-based visual review.
- The Playwright CLI browser tests could not launch because the configured Chromium headless executable is not installed. No dependency or browser installation was performed.
- `git diff --check`: passed.

## Manual verification and limitations

The integrated-browser check used a synthetic local UI session and a mocked Profile response; no authentication configuration or credentials were changed. Playwright CLI browser-matrix verification remains pending an environment with its configured Chromium executable. `@YakisobaNissin` review is pending.

For manual review of the refinements, open `/dashboard` with no topic selected, choose a topic through its existing roadmap action, and confirm the heading/calendar return with the topic. Mark a topic complete and verify the Dashboard counts change. Inspect the roadmap card's idle, hover and keyboard-focus states. On `/discovery`, answer a question, use Skip, verify Stay/Escape keep the answer and focus, and Confirm opens `/careers`; use Return to verify the other-exit wording is unchanged. On `/recommendations`, verify Set as Career cannot be activated before selecting a card, then verify the notice and card styling. On `/careers`, mark a Frontend topic complete before opening the catalog and verify only Frontend Developer shows a percentage. Repeat at 390 px and with reduced motion enabled.
