# Discovery, Roadmap and Shared UI Styling

**Feature name:** Discovery, Roadmap and shared UI styling  
**Implemented by:** AI assistant using Copilot SDK in VS Code  
**Created:** 2026-10-31  
**Last updated:** 2026-10-31  
**Implementation/review status:** Implemented locally; human review pending  
**Acceptance IDs:** UI-1a, UI-1b, UI-2, UI-3, UI-4, UI-5, UI-6, UI-7, UI-8 (task-local IDs; not product-specification IDs)  
**Required reviewer:** `@YakisobaNissin` per [CODEOWNERS](../../.github/CODEOWNERS)

## Implemented behavior

- UI-1a: The first Discovery question's Back link uses the shared ghost Button styling while continuing to navigate to Welcome.
- UI-1b: The footer is hidden on Welcome, every Discovery question, and sample Results; other routes retain it.
- UI-2: The footer uses a black background and white text and link typography without changing its content or layout.
- UI-3: Shared buttons use the existing pill radius, have no decorative borders, retain visible keyboard focus, and black buttons hover to `#3F8AC8`.
- UI-4: Every Discovery question keeps its Back control and arrow visible and aligned after step changes. The first Back remains a link to Welcome; question order, destinations, and handlers are unchanged.
- UI-5: Roadmap eye controls hide and restore tasks with fade-and-slide transitions. Hidden tasks are inert; their data and completion state are preserved, and reduced-motion preferences disable the transitions.
- UI-6: Desktop Roadmap topic details stay sticky below the fixed header with internal scrolling. The mobile panel remains in normal flow and selected details scroll below the header.
- UI-7: A completed Roadmap task displays a check mark; incomplete tasks use the not-completed icon. The displayed icon follows the task's current status and remains correct when a task is hidden and restored.
- UI-8: The browser-native search-field clear and the separate labeled app clear button are both available while a query is present. Either clears only the query and retains the selected category. The app button is keyboard-operable; Escape clears the focused search input for keyboard users.

The footer is hidden on Welcome, every Discovery question, and sample Results; where displayed, it spans the viewport and the flex page shell keeps it flush with the page bottom without a fixed-height workaround. These changes do not alter Discovery question logic, answer state, Roadmap task data/status, or navigation destinations. Product and design authority remain in the [Discovery specification](../specs/discovery.md), [pages and interactions](../pages-and-interactions.md), and [implemented design system](../design.md).

## Relevant source and tests

- [App shell](../../frontend/src/app/shell.tsx)
- [Route presentation configuration](../../frontend/src/lib/routes.ts)
- [Shared Button](../../frontend/src/components/ui/button.tsx)
- [Discovery page](../../frontend/src/features/discovery/page.tsx)
- [Catalog page](../../frontend/src/features/catalog/page.tsx)
- [Roadmap page](../../frontend/src/features/roadmaps/page.tsx)
- [Shared styles](../../frontend/src/styles.css)
- [Route tests](../../frontend/tests/navbar.test.ts)
- [Discovery flow tests](../../frontend/tests/learning-flow.test.tsx)
- [Browser UI regression test](../../frontend/tests/auth-ui.spec.ts)

## Verification

- `npm test` from `frontend/`: passed, 8 files and 47 tests.
- `npm run lint` from `frontend/`: passed with zero warnings.
- `npm run build` from `frontend/`: passed, including TypeScript build checks.
- Integrated-browser checks used the local UI session at desktop (1440×900 and 1280×720) and mobile (390×844): all five Discovery steps had a visible Back control and arrow with no footer; Roadmap hide/reveal produced intermediate opacity/slide/height states while retaining the `Done` status; reduced motion computed zero transition duration; sticky details remained 24 px below the header through the page end without clipped ancestors; and selected mobile details appeared below the header. Footer geometry/color and no horizontal overflow were also checked.
- The task row's `Done`-conditional check icon and the not-Done circle passed focused component tests and were confirmed in the integrated browser DOM at desktop (1440×900) and mobile (390×844). Hide/restore assertions and browser DOM checks confirm the completed check remains after restoring the task.
- The app clear button is separately labeled “Clear search query.” In the visible integrated browser, pointer activation cleared `q` and preserved the selected Design & UX category. A Playwright mouse event targeted the browser-native search clear X; it cleared `q`, preserved the category and removed the separate app button. Keyboard activation of the app button cleared the query and preserved the category; its keyboard focus showed a 3 px solid green outline. Escape clears the focused search query and preserves the category.
- The native pseudo-element X is not a separate keyboard-focusable control; keyboard users can clear the focused search through Escape. Visible-browser interactions were performed at desktop width. The earlier hidden-browser checks at desktop and mobile remain computed DOM/style evidence rather than screenshot-based visual review.
- The Playwright CLI browser tests could not launch because the configured Chromium headless executable is not installed. No dependency or browser installation was performed.
- `git diff --check`: passed.

## Manual verification and limitations

The integrated-browser check used a synthetic local UI session and a mocked Profile response; no authentication configuration or credentials were changed. Playwright CLI browser-matrix verification remains pending an environment with its configured Chromium executable. `@YakisobaNissin` review is pending.
