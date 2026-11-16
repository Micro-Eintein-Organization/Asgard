# UI refinement and motion

Implementer: Codex. Created: 2026-11-16. Last updated: 2026-11-16.
Status: implemented; focused checks recorded below; human review pending.
Required reviewer: @YakisobaNissin. Owner authorization: reviewed proposal and
implementation request in chat on 2026-11-16. Requirements: NFR-01–03 in
[Product](../product.md#nfr-01-accessibility-and-usability).
Task acceptance: consistent controls, quiet interruptible motion, reduced-motion
support and preserved layout/state. See the [reviewed plan](../plans/ui-refinement-and-motion.md),
[design baseline](../design.md) and [architecture](../architecture.md).

## Branded loading and Counselor follow-up, 2026-11-16

Owner approved the loading/comparison-removal plan and requested the Counselor
composer refinements in subsequent screenshot feedback. Codex implemented these
on the existing branch, preserving the preceding uncommitted changes. Requirements
remain NFR-01–03, with owner-requested presentation changes to REQ-12/FUT-10.

`components/loading-indicator.tsx` reuses the existing standalone snowflake. Its
decorative image is 32 px for StatePanel and 16 px inline, hidden from accessible
names. CSS reserves its footprint, reveals it after 150 ms, and rotates clockwise
every 2.4 seconds only under no-preference. Reduced motion renders a still image
immediately. Existing loading text remains immediate; skeletons remain static.
Discovery saves, Profile/setup saves, preference saves, preparing recommendations
and Counselor answers use the compact indicator. The clock icon is replaced;
existing slow-service messages, labels, validation and pending guards remain.
Existing Profile/preference success messages fade once with the 180 ms preset;
no fabricated progress, minimum waiting time or new success state was introduced.

Roadmaps no longer mount SkillComparison, including for `reviewSkills=1`. Saved
suggestions no longer offer its action; their ordinary roadmap action stays.
The comparison implementation and URL helper remain dormant for reactivation.
Profile skills, resume review, career-to-career comparison, backend and stored
records remain unchanged. See the [disabled scope](competency-comparison.md#roadmap-experience-comparison-disabled-2026-11-16).

Counselor now sends the existing page-context identifiers automatically, retaining
the current scoped payload and provider disclosure. Visible context labels and
opt-out UI are removed by the owner's later request; the separate web-source
opt-in remains. The textarea's focus is indicated by the enclosing composer's
neutral dark border/ring, and its send button is a centered 44 px circle. Other
keyboard focus indicators remain unchanged. The [contextual guide](contextual-counselor-profile.md#composer-refinement-2026-11-16)
records the superseded UI behaviour.

Follow-up verification: TypeScript, production build and scoped ESLint passed.
Twelve focused tests across loading feedback, recommendations, roadmaps and page
motion passed. The loading tests cover accessible status text, delayed-service
copy, indicator removal on completion and pending-button names/disabled state.
The roadmap test includes a legacy reviewSkills URL and verifies no comparison
action/dialog while preserving task operations. Recommendation tests verify
the normal destination and absent comparison link.

The added Counselor regression test also passes (13 focused tests total): the
context controls are absent, requests retain automatic scoped page identifiers,
web search defaults off, and pending status/disabled-send behaviour is preserved.
Final build/typecheck pass after the composer changes. Counselor ESLint reports
zero errors and its pre-existing refresh-export warning; the other changed
components/tests pass strict scoped lint. Earlier full-lint/Settings-harness
failures recorded below remain outside this follow-up.

Live browser: a naturally occurring account-security loading state measured
32 px, asgard-loading-turn / 2.4 s / 0.15 s delay; loading completed with zero
remaining indicators. Roadmap comparison action/dialog was absent. Counselor
contained only New conversation in the former context toolbar; its textarea
had no green outline, its focused composer border was rgb(23,23,23), and send
measured 44 by 44 px. No horizontal overflow appeared in the inspected viewport.
No question/provider request, save, retake or upload was performed in the real
account. Loading lifecycle/long wait are covered by controlled unit-test timing.

Pending: rendered reduced-motion preference, controlled slow-response browser
checks, saved-success browser walkthrough and desktop/zoom/accessibility review.
The browser has no documented media-emulation capability; CSS motion is guarded
by no-preference and the existing reduced-motion override. Do not treat static
CSS inspection or unit tests as completed visual reduced-motion acceptance.

Manual follow-up: load Dashboard/roadmap, inspect a snowflake during a pending
read, then confirm it disappears on completion. In Settings save a permitted
test edit and verify the existing confirmation fades once. Open Counselor, Tab
to the textbox/send action, check the neutral composer focus and submit on an
approved test account; expect Preparing your answer with compact snowflake and
the unchanged disabled send guard. Repeat with reduced motion enabled; expect
the still logo and immediately readable text. Report route, viewport, motion
preference and steps if anything sticks, overflows or loses keyboard focus.

## Implemented behaviour

Existing compositions, content, branding, routing, service calls and persistence
are preserved. No dependency, API, backend or database changes were introduced.
Native main-content selects/textareas share input borders, 8 px corners, 16 px
text and 46 px minimum height. Textareas retain their multi-line sizing. Optional
profile setup reuses Input/Button and the existing name-save controller.

`frontend/src/motion.css` defines 120 ms feedback/exit, 180 ms standard entry and
220 ms panel entry tokens. Radix data-state selectors apply dialog scale/fade,
menu fade/4 px offset, accordion expansion and Counselor fade/8 px offset.
Tab primitives receive the same fade; no tabs or tables were added to pages.
The compact navigation animates on entry; its existing immediate close remains.
`frontend/src/styles.css` retains current card layouts, selection lift and topic
collapse, sharing timing tokens and explicit transition properties. Recommendations
use the common fade instead of the separate 16 px entrance. The existing universal
reduced-motion rule remains; new CSS animations run only with no-preference.

`frontend/src/components/page-motion.tsx`, mounted beside Outlet inside Suspense
in the shell, fades the existing main container without adding a layout wrapper
or remounting forms. Query/hash updates do not replay it. Cleanup cancels the
animation; live reduced-motion changes cancel it immediately. Unsupported Web
Animations gracefully leaves content visible. CSS is the single timing source.
The Counselor overlay now uses the existing Radix Overlay so exit presence matches
the panel. Focus trapping and restoration remain owned by Radix.

## Verification

- PASS: frontend TypeScript check and production build using installed locked
  host dependencies. Docker status was unavailable due to named-pipe permissions;
  no service restart, installation or environment changes were made.
- PASS: focused ESLint on shell, page motion/test, setup and changed UI primitives.
- Focused Vitest: 16 passed, 4 failed across five files. New page-motion tests
  pass for pathname-only entry, stable content identity, cancellation and reduced
  motion. Dashboard, catalog and Discovery results tests pass. All four Settings
  tests fail in unchanged ProfilePhoto because the existing test harness provides
  no QueryClientProvider; this is not an animation assertion failure.
- Full lint FAIL: existing set-state-in-effect errors in resume-skill-review,
  profile-photo and recommendation flow; existing refresh export warnings in
  ai-guidance, counselor-context and identity. The Counselor change touches only
  its overlay; no export changes were made. These remain outside this scope.
- Browser PASS at the available approximately 515 px viewport: menu computed
  animation is asgard-menu-in / 0.18 s; Counselor panel/overlay use their presets;
  Escape finishes dismissal and restores launcher focus. Resume selector measures
  46 px, 16 px text, 8 px radius. Setup inputs render with shared styling. Profile
  and Dashboard showed no horizontal overflow during these checks. No saves,
  retakes, provider requests or uploads were performed.
- Browser PASS: standard roadmap review dialog uses asgard-dialog-in with the
  fading backdrop; Escape removes it and restores its trigger. Repeated
  open/close/open/close completes without a stuck dialog. Setup inputs measure
  46 px / 16 px text / 8 px radius with no horizontal overflow.
- Pending: full desktop 1280/1440/1920 comparison, actual reduced-motion browser
  walkthrough, zoom, remaining dialog variants and complete keyboard/
  assistive technology review. Browser viewport override did not take effect in
  the preceding audit; this evidence is narrow-viewport only. No Web Vitals or
  complete accessibility/release acceptance is claimed.

## Guided manual review

At http://127.0.0.1:5173/dashboard, open/close the account menu repeatedly and
expand topic accordions. Expect short feedback without stuck content. Open a
roadmap and Review your experience; close with Escape and confirm trigger focus.
Open/close Counselor and confirm its backdrop disappears with the panel.

Visit Settings and verify the resume career selector matches the name fields.
Open saved suggestions, then optional profile setup; inspect the larger input
text and shared buttons without submitting. Navigate Back and confirm the page
fade does not delay navigation. Change catalog filters and roadmap topic/hash
links; these must not replay the page fade or reset drafts.

Repeat at the desktop widths above, at 200%/400% zoom, and with the operating
system reduced-motion preference enabled (including switching it mid-animation).
Expect visible content immediately, no motion with reduced motion, readable
controls and visible keyboard focus. Report failures with route, viewport/zoom,
motion preference, steps and expected/actual result; omit account secrets.

## Handoff and limitations

Human technical/visual review is pending with @YakisobaNissin. Full-lint and
Settings harness follow-up ownership is unassigned. No commits or publication
were performed. Deferred feature scope is unchanged, so future-development needs
no update. The Anti Slop scoped checks preserve existing identity and layout;
automated/build and focused runtime checks support this change, while the broader
accessibility and browser delivery gates above remain pending, not certified.
