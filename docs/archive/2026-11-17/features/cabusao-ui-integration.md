> Historical record archived 2026-11-17. Dated scope and test evidence are retained; use the [current documentation](../../../README.md). This record does not grant new activation, implementation, or publication authority.

# Cabusao UI integration

Created: 2026-11-03. Last updated: 2026-11-03.

Status: the scoped presentation corrections are implemented and locally verified
on `codex/cabusao-ui-integration`, after merge commit `03fd2e1`. Changes remain
uncommitted. Required human technical/visual review by @YakisobaNissin is pending;
local checks do not establish full reference fidelity or teammate-machine acceptance.

Renewed review, 2026-11-03: the owner reported missing parts. The
[gap review](../../../plans/cabusao-ui-gap-review-2026-11-03.md) recorded JSX composition
omissions, especially Settings and roadmap details. The completion below resolves
those scoped findings. Earlier sections remain implementation history. The
requested [compact catalog/sidebar correction](../../../features/career-catalog.md#compact-cards-and-sidebar-correction-2026-11-03)
has focused local evidence.

## Agreed UI completion, 2026-11-03

Implementer: Codex. Created/updated: 2026-11-03. Implementation and focused local
verification complete; human review pending. Required reviewer: @YakisobaNissin.
Owner authorization: “implement the ui from cabusao integration as it's the agreed
designs.” The [bounded plan](../../../plans/cabusao-ui-completion-2026-11-03.md) records
scope and review ownership before implementation. Reference: Cabusao-Changes at
`74015f31e6146ce60844680a8d6741aa130a8b40`.

Acceptance: REQ-02/03/05/09/10/11, NFR-02, F-001-AC-05–08 and applicable F-002
recovery/provenance behavior. Owning [architecture](../../../architecture.md),
[design](../../../design.md), [Discovery](../../../specs/discovery.md) and
[recommendation specification](../../../specs/career-recommendations.md) retain authority.

Implemented behavior:

- Settings now uses the shared SettingsLayout, ProfileDetailsCard, name fields
  and reference card composition: personal details, career background, saved
  suggestions and preferences. Account/security has its separate card view using
  the existing anchor route. Profile/preferences saves retain independent version
  guards; dirty values survive tab changes and guarded navigation. Existing
  document removal/cancellation and logout protection remain. Unsupported photo,
  PDF, Google, authenticator and deletion controls stay visibly disabled.
- Roadmaps restore numbered/spaced milestones, topic status badges, milestone
  context, the empty detail panel and Overview, Learning outcome, Tools and setup,
  Links and resources, and Completion sections. The formatter reads labels already
  emitted into published explanation text by `convert_guide_v4.py`; it does not
  import draft curriculum or change the API. Older free-form topics keep their
  full explanation and honest missing-section messages. Representative work in
  published career text appears as Example project. The first, selected or linked
  milestone opens initially; other milestones remain expandable.
- Dashboard's View milestone opens and focuses the corresponding roadmap landmark
  after data loads. Continue learning retains its topic destination. Longest streak
  is shown as Not available because the current API cannot establish that value.
- Results restore category labels, Back to Discovery, guarded Retake Discovery,
  keyboard selection and roadmap context. Descriptions and skill previews share
  the compact catalog treatment. Actual recommendation reasons, uncertainty and
  evidence remain available. Browsing never implicitly changes roadmap focus.

Affected source: `SettingsScreen.tsx`, shared profile layout/documents,
`DashboardScreen.tsx`, `features/roadmaps/page.tsx` and `topic-presentation.ts`,
recommendation components, DiscoveryWizard, `lib/career-summary.ts`, catalog import
and scoped stylesheet rules. Existing backend, startup and other uncommitted edits
were preserved. This completion introduces no backend, schema, Auth capability,
dependency or generated contract changes. Deferred feature scope is unchanged.

Verification on this Windows checkout:

- PASS: 27 focused tests in 10 files (Settings, profile documents, roadmap
  visibility/landmark/content formatter, Dashboard, recommendations, Discovery
  results and both catalog suites).
- PASS: frontend production build, including TypeScript; ESLint with zero warnings;
  generated frontend API drift check. Documentation verification found no missing
  targets/anchors in 53 local links across the four updated guides/records;
  working-tree whitespace check passed.
- PASS: `node scripts/check-discovery-repair.mjs --cabusao-ui` in local Chrome.
  Real temporary-account registration/email verification, new-account Dashboard,
  catalog, profile/preferences save/readback, dirty dialog, tab preservation,
  roadmap focus/progress readback, Dashboard milestone navigation and blank
  Discovery retake passed. The script removed its synthetic account afterward.
- Results used an explicitly labeled visual-only response fixture for three real
  published careers. One initial generation request was intercepted with a
  synthetic failure; no external provider calls occurred. This checks presentation
  and navigation, not model quality or saved-result persistence. The earlier
  bounded [live Groq evidence](../../../features/connected-prototype.md#request-budget-repair-2026-11-03)
  remains separate.
- Profile geometry was checked at 1280/1440/1920 and 320 CSS px. Inspected local
  screenshots: profile at 1440/320, account, Dashboard, roadmap topic and settled
  selected Results, under ignored `tmp/discovery-repair/cabusao-*.png`.
  A late-data milestone focus bug and account-heading anchor clipping found during
  verification were corrected and covered by the final passing checks.
- A stale frontend dev-server CSS response required restarting only the frontend
  container; computed styles then reflected the checked source. No rebuild or
  data reset was needed for this UI-only completion.

Manual review at `http://127.0.0.1:5173`:

1. Open Settings → Profile; edit/save a name and preferences, then refresh to see
   saved values. With unsaved edits, attempt to leave and choose Stay. Switch to
   Account and security and back; expect the draft to remain.
2. Browse careers → Data Analyst → set current roadmap explicitly. Open a topic;
   scroll its details through guidance/resources/Completion and change status.
   Return to Dashboard; View milestone must reach the matching milestone.
3. Finish Guided Discovery with See suggestions. Expect loading followed by saved
   cards or a truthful retry state. Use keyboard selection, view the selected
   roadmap and Retake Discovery through Settings. Retake starts a blank draft.
4. Repeat at desktop sizes and actual browser zoom 200%/400%; test keyboard-only
   navigation and screen reader announcements. Report the URL/step, viewport/zoom
   and sanitized error/request ID, without credentials or private answers.

Pending: human reference/current visual acceptance, actual browser zoom, screen
readers, other browser engines and an independent teammate Windows walkthrough.
The unavailable capabilities above remain unavailable. No commits/pushes/merges.

### Scoped UI delivery gate

Direction: existing Asgard/Cabusao light theme, ENERGY 1 / RHYTHM 2 / MOTION 1.
The dark milestone surface prioritizes continuation; neutral cards group editable
data; blue marks selected choices; functional icons identify topics, files and
navigation. No assets or navigation structure were invented. This gate covers
the changed presentation, not a whole-app accessibility certification.

- Hard gate PASS: reviewed source/screenshots contain no new decorative copy,
  fabricated metrics/testimonials/security claims or unlabeled sample runtime data.
  Longest streak is explicitly unavailable; visual fixture text is test-only.
- Layout PASS: measured profile reflow at 320/1280/1440/1920 and inspected 320/1440;
  no horizontal overflow or escaped labels in those checks.
- Actions/states PASS: focused tests plus Chrome exercised saves, discard/Stay,
  preferences, account/profile tabs, progress, milestone, selection and retake.
  Unimplemented controls are disabled with visible reasons. Loading/error/empty
  states remain; existing retry tests passed.
- Keyboard/focus PASS: Enter selection and milestone focus checked in Chrome;
  delayed-data focus regression passed. Native controls and shared visible focus
  retained. Real zoom/screen-reader review remains pending.
- Contrast PASS for changed text treatments: retained white on #286b9f selection,
  #60646c on white, and #007a53 focus on white meet their normal-text/focus ratios
  by the earlier luminance check. Settled selection screenshot inspected.
- Purpose/liveliness PASS: reference title/card/sidebar rhythm and branded shell
  retained; badges communicate saved status, card spacing separates real tasks,
  and gradients only prioritize the current milestone. No decorative asset added.
- Craft/consistency PASS: shared components/tokens, authored published guidance and
  specific action labels used; 27 interaction tests, build/lint and authenticated
  Chrome walkthrough passed. Light-only scope follows the approved design.

## Discovery flow repair, 2026-11-03

Implementer: Codex. Created/updated: 2026-11-03. Status: implementation and focused
checks complete; human visual review remains pending. Reviewer: @YakisobaNissin.
Owner reference: explicit implementation of the [repair plan](../../../plans/discovery-startup-repair-2026-11-03.md).
Acceptance: NFR-02, F-001-AC-05–08 and F-002 generation/recovery behavior.

DiscoveryWizard uses a dedicated question grid and current option count to place
all choices in one desktop row, including uncertainty. Welcome stays separate.
Narrower CSS widths wrap without clipping; native input semantics, exclusions,
keyboard focus and existing selected/hover motion remain. Reading: desktop career
exploration in Asgard's existing visual language, ENERGY 1 / RHYTHM 1 / MOTION 1.
Equal option cards communicate equal answer status; blue communicates selection.

The last action is **See suggestions**. Completion/save precedes one automatic
request; the handoff waits for the matching saved session and refreshed query
state. Matching existing runs are reused on remount. Results has no initial
Prepare suggestions button, but failures retain Try again and outdated results
retain Update suggestions. Cooldown errors no longer hide the saved failure.
Cabusao's sample results and browser-wide state were not imported.

Sources: DiscoveryWizard, recommendation cards and questionnaire styles.
Tests: nine focused frontend cases passed across Results, recommendation cards
and the existing Dashboard regression. TypeScript, lint, production build and
frontend/backend API drift checks passed. Broader pre-existing UI edits and
their original pending review remain outside this repair's acceptance.

Focused Chrome acceptance passed on the existing local Windows checkout:
registration/local-email verification, new-account Dashboard/catalog, one row at
1280/1440/1920, keyboard selection with visible focus, 320/640 CSS reflow, saved
final submission, exactly one automatic request, explicit retry, no generation on
refresh, roadmap/focus save and logout/login into a populated Dashboard.
The browser intercepted generation with a synthetic provider failure; it made
zero external calls. Real generation/persistence has the separate one-call
[live evidence](../../../features/connected-prototype.md#request-budget-repair-2026-11-03).
The temporary browser account was removed. Screenshots in ignored
`tmp/discovery-repair/` were inspected at 1280/1440 and for recovery presentation;
1920 geometry was checked automatically. Initial harness failures came from hover
transforms, keyboard-modality detection, hidden-input click targets and a stale
catalog selector. Correcting the checks required no UI bypass or forced click.

Focused UI delivery gate: layout/reflow PASS (measured and screenshot inspected);
keyboard/focus PASS (Space changes the native choice and visible outline checked);
purpose/craft PASS (existing brand/tokens and equally weighted answer controls);
behavior/states PASS (save, pending/error/retry and no revisit generation checked).
White on the retained #286b9f selection fill and #60646c on white pass normal-text
AA by the WCAG luminance calculation; focus #007a53 on white passes 3:1.
This bounded gate does not certify the whole application or real browser zoom.

Human visual review, actual 200%/400% browser zoom, screen readers and other browser
engines remain pending. At `http://127.0.0.1:5173`, follow Welcome → Guided Discovery,
verify one row at desktop width, choose with Tab/Space, and use See suggestions on
the last question. Expect loading then saved cards or a truthful retry state.
Refresh results to confirm no new request. Report the step, viewport/zoom and
sanitized error/request ID; never send credentials or saved answers.

## Presentation correction, 2026-11-03

The Dashboard now uses Cabusao's actual shared Card, title/Edit grouping,
dashboard layout, milestone hero, Progress, calendar, support card and Accordion
structure. Data is still account-backed; topic groups retain applicable-roadmap
scope rather than the reference's sample-milestone scope. Calendar dates remain
account-timezone based and longest streak stays omitted because no API exposes it.

Welcome uses reference radio cards and icons. Discovery removes the oversized
decorative-circle layout and restores question headings, progress, choice markup
and right-aligned actions. Results restores visible explanations/skills and card
hierarchy with evidence retained. Catalog restores reference grid/card/sidebar
structure while keeping live grouping, filters, badges and destinations. Settings
uses the reference layout classes around existing saved fields and security
sections. Optional setup retains its newer functionality; its buttons already
follow the shared pill/neutral-card system. Roadmap retains reference sticky
details and hide/reveal, with newer resources/path/history and status commands.

Removed superseded entry/card CSS overrides. Shared image assets, Career dropdown,
saved-focus routing, API contracts and auth are unchanged. Results and Welcome
regressions were updated for visible explanations and native radio semantics.

Visual evidence is not yet complete: the existing container's Playwright Chromium
executable is absent. No browser/dependency installation, synthetic success claim,
or authentication bypass was used. Reference/current screenshots, authenticated
save/readback, keyboard, zoom and reduced-motion walkthroughs remain pending.
The steps below still apply; the implementation must not be called visually
accepted until this evidence exists.

Corrective verification: all 32 frontend tests passed, including a new Dashboard
test for the actual reference Card/title/Edit hierarchy, saved destination,
accessible milestone percentage and status accordions. The test exposed a real
shared Progress defect: the numeric value was used visually but not forwarded to
the Radix root; this is corrected and the regression passed. The two registration
tests initially expected button cards; their native-radio expectations were
updated and both paths passed. TypeScript and lint passed. API drift check passed.
The 33 isolated backend tests covering progress summaries, Discovery, contracts,
recommendation repair and document deferral passed (one existing TestClient
deprecation warning). Production build passed with the existing large-chunk
advisory. These checks do not replace the pending browser acceptance.

Boundary checks: no backend, content releases, migrations, auth transport,
generated client, core API hooks or Career destination code changed in this
correction. No sample catalog or browser-local learning-store imports occur in
the active corrected screens. No dependency or lockfile change was introduced.

## Reviewed requirements and boundaries

Acceptance IDs: task-local NAV-01 (saved Career destination), UI-01 (Cabusao
presentation), UI-02 (Dashboard), UI-03 (roadmap visibility), UI-04 (Discovery
and results), UI-05 (catalog), SAFE-01 (retain account-backed state).
The user approved the bounded integration plan in this chat on 2026-11-03.
Source: main `5f794b4`, Cabusao `74015f3`. Preserve the existing Career dropdown,
saved-focus resolver and newer feature behavior; use Cabusao as visual reference.

Owning sources: [architecture](../../../architecture.md), [design](../../../design.md),
[decisions](../../../decisions.md), [current feature handoff](../../../features/mvp-backend-handoff.md).
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

The following 31-test record describes the initial integration before the
presentation correction; current corrective evidence is recorded above.

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
