# Cabusao UI integration

Created: 2026-11-03. Last updated: 2026-11-03.

Status: implemented on `codex/cabusao-ui-integration`; no commit, push or integration
into main. Human and authenticated visual acceptance pending.

## Reviewed requirements and boundaries

Acceptance IDs: task-local NAV-01 (saved Career destination), UI-01 (Cabusao
presentation), UI-02 (Dashboard), UI-03 (roadmap visibility), UI-04 (Discovery
and results), UI-05 (catalog), SAFE-01 (retain account-backed state).
The user approved the bounded integration plan in this chat on 2026-11-03.
Source: main `5f794b4`, Cabusao `74015f3`. Preserve the existing Career dropdown,
saved-focus resolver and newer feature behavior; use Cabusao as visual reference.

Owning sources: [architecture](../architecture.md), [design](../design.md),
[decisions](../decisions.md), [current feature handoff](mvp-backend-handoff.md).
These documents and generated contracts retain authority over behavior.

## Implementation

The fixed header, full-width black footer, pill controls and selection treatments
reuse Cabusao's stylesheet. Selection blue is darkened to `#286b9f` for readable
white text. Settings, optional setup, authentication and guarded saves retain their
current controllers. Existing branding assets are retained.

Career retains Current roadmap, Career catalog and Discovery results. Its main
action resolves saved focus without opening catalog while loading; absent focus
opens catalog and errors expose retry plus explicit browsing.

Dashboard uses actual saved focus, status counts, Skipped links, empty messages,
calendar arrows/today marker, current streak and a dark roadmap card. Topic and
milestone summaries remain branch-aware. No longest streak is invented.

Roadmap eye controls hide/reveal local presentation only, preserve status and
restore focus. Hidden rows are inert; reduced motion is respected. Details use
Cabusao sticky scrolling. Existing path choices, retirement/history handling,
resources and reversible versioned progress commands remain.

Discovery uses selected cards/checks and five progress segments with existing
conditional questionnaire/checkpoints. Results retain run-keyed selection,
explanation/evidence disclosure and View selected roadmap semantics. Catalog clear
and Escape preserve category; app clear restores search focus. Badges use the
linked roadmap's API summary and omit unresolved percentages.

No database, API, auth or dependency changes. Old browser-local learning state
and its fixture-only tests are excluded. Retake still creates a saved blank draft.
Configuration remains the existing Docker/Node workflow, without new flags.

## Verification and manual acceptance

Final TypeScript, lint, production build and all 31 frontend tests passed in the
running Docker frontend. Ten new focused cases cover saved-focus routing (six),
catalog search/badge destination (three), and task visibility/focus (one).
One invalid test-only query option was corrected after TypeScript caught it;
the retry passed. Vite reports a non-blocking large-chunk advisory; dependency and
bundle restructuring is outside this change. Git conflict and whitespace checks
passed after removing inherited Markdown trailing whitespace. Backend source is unchanged; the pre-integration 18 isolated
backend tests passed and do not certify visual integration.

Manual acceptance pending at http://127.0.0.1:5173:

1. Sign in with an approved local test account. Career with no focus opens Careers;
   save a roadmap and verify Career/Current roadmap directly reopen it after reload.
2. From `/careers`, search/filter, clear by button/Escape and verify the category
   survives. Open each card and compare its percentage to that exact roadmap.
3. On `/roadmaps`, hide/reveal a topic, verify unchanged status and restored focus;
   complete/clear/skip topics, choose tool paths, and check Dashboard readback.
4. Complete and resume `/discovery`; test invalid answers, save failure and retake.
   Results must show actual saved explanations and selected destination.
5. Check keyboard, visible focus, zoom, reduced motion and long topic details at
   desktop 1280 and 1440 widths. Verify sticky details clear the header and footer.
6. Switch accounts and confirm saved focus/progress and suggestions are isolated.

Report failures with route, steps, viewport, expected/actual outcome and whether
the operation was saved. Do not share credentials. Hosted CI and protected PR
review remain unrun; no deployment or release acceptance is claimed.
