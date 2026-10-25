# Asgard UI reference audit

25 October 2026 · Read-only source audit · Integration proposal for review

Packaging note: this is a copy of the audit originally prepared outside both projects, now retained with the frontend reference at the user's request. Backend descriptions below explain the inspected experiment; no backend source is included. The statements about unchanged projects and report location describe the original audit phase, before this reference folder was created. This report does not authorize its proposed integration steps.

## Scope and evidence

Reviewed `docs/design/figma/` (all 14 PNG exports) and `docs/pages-and-interactions.md` first, then the archived prototype at `C:/Users/saave/OneDrive/Documents/Projects/AI-CAREER-DSS-NEW-docs-archive/mvp-one-day-experiment`. This is the prototype identified in the preceding discussion; no separate AsgardUI source directory was identified in the inspected project locations.

Source evidence: `components/prototype.tsx`, `components/career-roadmap.tsx`, `components/activity-calendar.tsx`, `app/ui.css`, application entry/error files, `lib/catalog.ts`, `lib/db.ts`, `lib/recommendations.ts`, `app/api/state/route.ts`, migration, package manifest, DESIGN.md and IMPLEMENTATION.md. Current product, Discovery, recommendation, decision and development documents supply requirement boundaries.

The page guide and requirements retain draft status. The guide explicitly says static exports do not establish approval. Therefore this report compares against supplied Figma references and recorded behavior, without certifying an approved design baseline. Attached screenshot instructions are illustrative context, not authority to copy sources, migrate code, or create a new application.

Neither application was modified. No install, build, database operation, provider call, browser walkthrough, screenshot capture, automated test, or accessibility audit was performed. Visual comparisons are between inspected exports and source-declared composition/styles, not rendered pixel comparisons. Historical build claims were not reverified. This report is saved outside both projects.

## 1. Implemented pages and navigation

There is one Next.js application page (`app/page.tsx`), rendering `Prototype`. Seven logical views are switched through query parameters and client state, not separate framework pages. Career/topic query parameters make individual views addressable; compatibility with the eventual route contract is unresolved.

| View / address | Implemented navigation |
| --- | --- |
| Welcome `/?view=welcome` | Guided/Browse selection; Continue saves entry then opens Discovery/catalog; conditional Resume Discovery. |
| Discovery `/?view=discovery` | Five question steps within one view. Back saves then moves a step, or returns to Welcome; Skip saves then opens catalog; final confirmation opens results. |
| Results `/?view=results` | Automatic generation when completed/configured and results absent or stale; explicit retry/refresh; Retake resets step/completed flag and opens Discovery; selected result opens career detail, otherwise catalog; optional profile link opens Settings. |
| Catalog `/?view=catalog` | Local search/category filtering and card selection; action opens selected career; current-roadmap shortcut. No catalog Back control is rendered. Search/category/selection are local state and reset on remount. |
| Career `/?view=career&career=frontend` | Back/Change Profession open catalog; explicit Set as current; milestone expansion, hide Done; topic selection appends `&topic=...`; resources open new tabs; status controls persist changes. Backend is preview-only. |
| Dashboard `/?view=dashboard` | Role edit opens catalog; Continue opens active/next topic; topic rows open career/topic; profile helper opens Settings; Discovery link opens results or questions; calendar month/day selection. |
| Settings `/?view=settings` | Profile form, preferred category, Discovery retake, Gemini configuration instructions/status refresh; section anchors `#profile` and `#gemini`. |

Shared header: Dashboard → dashboard; Roadmap → catalog; Settings → settings; brand → dashboard. Account menu uses ordinary links to Settings/Edit profile and Discovery; no logout. Browser Back/Forward is handled using `popstate`. A topic query on a non-career view can open the older modal topic panel. Active-topic conflicts open a resolution dialog rather than another page.

Absent: public Landing, registration/login, email verification, recovery, 2FA, dedicated optional-profile screen, PDF/photo management and account deletion/linking. Their absence is consistent with the experiment's reduced scope, but leaves final-product gaps.

## 2. Component inventory and reuse classification

“Reuse directly” means the small presentation fragment has no material application-service coupling; normal integration and accessibility verification still apply. Names in parentheses describe inline markup, not existing standalone components.

| Existing component or fragment | Classification | Reason / prerequisite |
| --- | --- | --- |
| `Prototype` orchestrator | Visual reference only | Combines screen routing, fetching, global busy/error state, state ownership, conflicts and page rendering around the local experiment. |
| Header/account menu/footer markup | Refactor before reuse | Useful geometry and active states; query navigation, local-account copy and footer counts are experiment-specific. |
| `Welcome` | Refactor before reuse | Retain choice-card layout; separate `enter` persistence and navigation; defaults/entry interaction need review. |
| `Discovery` | Refactor before reuse | Retain question/card presentation and focus-on-step behavior; whole-state dependency, saves on Back, fixed questions and selection rules must be separated. |
| `StepIndicator` | Refactor before reuse | Simple visual primitive, but hardcodes six segments. Accessible description should distinguish five questions plus results. |
| `Results` | Refactor before reuse | Retain selectable result/reason/skill presentation; remove provider setup coupling, generation effect and fixed result assumptions; destination requires resolution. |
| `Catalog` | Refactor before reuse | Useful search/filter/card layout; imports static catalog, loses browsing context on remount, lacks Back and explained suggestions. |
| `Dashboard` | Refactor before reuse | Keep supporting column/milestone/topic groups; extracts progress and next-topic rules inline from full app state. |
| `CareerRoadmap` (active) | Refactor before reuse | Useful milestone/detail layout and local expansion controls; hardcoded Frontend objectives/category and global catalog lookups; no graph/branches or panel close. |
| `RoadmapTopicDetails` | Refactor before reuse | Useful overview/resources/actions; uses full state and string action dispatcher; skill tags are career-wide rather than topic-specific. |
| `ActivityCalendar` | Refactor before reuse | Keep grid/month/day UI; separate activity aggregation and streak calculations. Current timezone conversion does not preserve historical dates. |
| `Settings` | Refactor before reuse | Keep form/section composition; local provider setup, deferred-feature panels and profile/save rules are not final contracts. |
| `Modal` | Refactor before reuse | Uses native dialog and close/cancel handling; verify focus restoration, initial focus and click-outside behavior before adoption. |
| `TopicPanel` (older modal) | Refactor before reuse | Resource/status rendering overlaps the active detail panel; choose canonical presentation only after design review. |
| `CareerDetail` (older implementation) | Visual reference only | Defined but not called by the screen renderer; superseded by `CareerRoadmap`. Do not import as a second roadmap implementation. |
| `StatusIcon` | Reuse directly | Small status-to-icon presentation with no persistence dependency; retain accompanying text. |
| Resource-link markup, skill chips, progress markup | Reuse directly | Native links/progress and simple spans can carry forward with supplied content and meaningful labels. Not standalone components today. |
| Button/input, selected/focus/disabled styles | Reuse directly | Useful CSS fragments; applying global selectors across a new application needs scope review. |
| Alerts/toast/loading/empty-state markup | Refactor before reuse | Useful presentation; tied to global busy/error/notice state and local setup messages. |
| `RootLayout`, `Page`, `ErrorPage` | Visual reference only | Generic experiment entry wiring; error copy assumes local database and asserts saved-data safety without confirming operation outcome. |
| CSS foundations/layout rules | Refactor before reuse | Valuable starting stylesheet; mix global selectors, legacy and current screen styles, literals and tokens. Not an approved design system. |

Duplicated code: `CareerDetail` versus active `CareerRoadmap`; `TopicPanel` versus `RoadmapTopicDetails`; status-label maps and icon rendering across files; progress/topic flattening and filtering across Dashboard and roadmaps; parallel selectable-card/resource-link markup. CSS retains `.roadmap-*` rules for the older implementation alongside active `.profession-*` rules. Buttons and inputs are styled native elements, not a packaged component library. Consolidation is proposed, not performed.

## 3. Design token and styling inventory

Observed CSS values, not approved Figma variables:

| Group | Declared values / conventions |
| --- | --- |
| Text | `--ink #181c19`; `--muted #58635d`; `--subtle #69746e`. |
| Borders/surfaces | `--line #d8dfda`; `--edge #89958e`; `--surface #f4f6f4`; `--surface-hover #edf2ee`; white canvas. |
| Accents | `--green #086545`; `--mint #edf8f1`; `--blue #285ab8`. Green selected/progress states, blue enrichment helper; literal blues/oranges and dark gradients also occur in screen styles. |
| Feedback literals | Error background `#fff4f1`, text `#8c291d`, border `#cb9b91`; validation `#982c20`; toast `#183f2b`. Not all semantic colors are tokenized. |
| Font | Arial, Helvetica, sans-serif; body line-height 1.55; weights primarily 400/500/600/700. No custom font dependency. |
| Type scale | Caption .75rem; small .875rem; body .9375rem; section 1.125rem; panel 1.375rem; page `clamp(1.75rem,2.4vw,2rem)`. Additional literal sizes and negative letter spacing occur. |
| Geometry | Control/card/dialog radii 8/12/16px; controls 44px, compact controls 36px; header 64px desktop, mobile token 104px. Actual small controls vary. |
| Layout/spacing | Content width 1200px, 1280px at wide screens; gutter 32px → 24px → 20px, 40px wide; page gap 32px → 24px. Common literal spacing 4/8/12/16/20/24/32/48/64px; no complete spacing-token scale. |
| Responsive | Wide ≥1500px; changes ≤1000, ≤800, ≤600 and ≤359px. Discovery 4→2→1 columns, last transition only below 360px; Dashboard/roadmap and Settings stack; sticky detail panel becomes static. |
| States/motion | 3px green focus outline, selected inset border, native `aria-pressed`/`aria-current`, .48 disabled opacity; .14s button transitions; 1s loading spinner; reduced-motion override. |

Conventions: CSS custom properties plus global element rules, classes and descendant selectors; Grid/Flex layouts; Lucide icons; native `<details>`, `<dialog>`, `<progress>`; sticky header and desktop detail panel. Some compact sizes and long card minimum heights warrant mobile review. Contrast, focus order, overflow and keyboard operation remain unverified.

## 4. Fixtures, APIs and placeholder interactions

| Item | Observed implementation / implication |
| --- | --- |
| Catalog and questionnaire | `lib/catalog.ts`: four fixed category labels, two software careers, only one six-topic/three-milestone Frontend roadmap, five fixed questions/options and sample learning content/links. Draft seed material, not launch coverage or approved taxonomy. |
| Hardcoded rendering | Frontend-specific objectives, Software and AI heading, category/default-career values, fixed six-step indicator, frontend-versus-backend icon choice, two-preview footer. Catalog topic count uses global `allTopics.length`, which would become misleading with additional roadmaps. |
| Local account | Fixed UUID and `prototype_profiles` JSON state, default local database connection. No authenticated user session. Host/origin checks restrict the local API; they do not establish account authentication. |
| API | `/api/state` GET/POST is real server code, Zod validation and PostgreSQL transactions/version checks. Not a fake API. All experiment actions share this endpoint; it is not an approved final API contract. |
| AI | Real server-side Gemini fetch when configured. No fabricated successful results were found. Configuration presence is not provider validation; successful generation/quality remain unverified. |
| Unimplemented features | PDF analysis and account/security are disclosed as deferred text; avatar is an icon, not an upload control. No simulated login/logout/upload success. |
| Navigation approximations | Optional profile opens general Settings instead of a dedicated setup/return flow. Results open selected career directly. Role “edit” opens catalog rather than editing a role. |
| Decorative placeholders | Discovery illustration circles are empty decorative areas; icon avatars and generic prototype copy remain. Export filler text, offensive copy and unrelated links are not adopted as functional content. |
| Derived metrics | Completion/calendar/streak use saved state rather than screenshot sample 25%/67. They are not fake counters, but lack final branch, roadmap-specific topic identity and historical timezone contracts. |

## 5. Comparison with supplied Figma references

| Reference | Source-level comparison |
| --- | --- |
| `Entry Choice.png` | Two selectable cards and Continue retained. Prototype adds shared header/icons, smaller declared geometry and uses Free Browsing instead of Advanced. No initial selection; frame shows one but does not define a default. |
| Five question exports | Centered title, six segments, four main cards, gray illustration areas and green selection retained. Prototype adds explicit uncertainty to early rounds, changes wording/options and allows multiple answers in the first three rounds; exact rules remain under review. |
| `Rounds 1–5_6.png` (actual results) | Result cards, skills, retake and continuation retained. Prototype supports one/two results rather than pictured three; adds reasons and request feedback; omits match badges as required by current product direction. Direct-to-detail action conflicts with the current guide's catalog handoff and needs owner review. |
| `Final Round_ Discovery Results.png` (actually catalog) | Search/chips/selectable cards retained. Prototype contains only two roles, adds All fields/category descriptions/current shortcut, lacks pictured Back and repeated card groups. Repeated export cards are fixtures, not launch inventory. |
| `Dashboard.png` | Supporting column, calendar, dark milestone, progress and topic groups retained. Prototype substitutes actual role/topic data, neutral helper wording and calculated activity; adds resume/completion/empty states. Menu lacks frame's logout because authentication is absent. |
| `Roadmaps.png` (actual detail) | Blue change banner, dark hero, milestone cards, hide-completed and side resources panel retained. Prototype replaces filler with Frontend content, uses restrained shared sizes, adds explicit focus/status controls. No authored graph, branches, pan/zoom or panel-close behavior. |
| `Optional Profile Setup.png` | Dedicated upload/profile composition is absent; partial name fields exist in Settings. Photo/PDF interactions and return-to-results flow are absent. Student-only wording is not current product scope. |
| Login, registration, email verification exports | No matching implemented screens. These are design references only; additional recovery/security states remain required by documents. |

No standalone Settings export exists in the requested folder, and no mobile/tablet frames were supplied there. Settings cannot be certified against a matching frame. Pixel accuracy, responsive behavior and interactive accessibility cannot be concluded from this source comparison.

## 6. Architecture compatibility and proposed integration plan

The reference UI uses React/TypeScript, plain CSS and Lucide, so adapting presentation to the proposed Next.js/TypeScript direction appears feasible. Supabase/Vercel direction does not make its fixed account, global AppState, privileged local connection or query-string dispatcher an approved production architecture. Complete architecture/contracts remain open. Most page components require refactoring before reuse; immediate value lies in visual markup/styles and a few small fragments.

Proposed sequence, subject to review; no step has been implemented:

1. Confirm which Figma frames and visual tokens are approved, and resolve the results destination, questionnaire rules and optional-profile flow. Keep unresolved security/data/graph requirements visible.
2. Agree a bounded UI extraction task, target location, framework/runtime and required component interfaces. Do not choose a database/API schema as part of visual extraction.
3. In that later authorized task, carry over reviewed CSS foundations and small presentation fragments first. Separate screen rendering from supplied data, navigation and named action callbacks; retain harmless local presentation state.
4. Adapt one agreed screen at a time, using reviewed fixtures only in development. Compare rendered desktop/mobile states to the accepted references; verify keyboard/focus, long content, empty/loading/error and failed-save behavior.
5. Connect screens only after their owning authentication, catalog, progress, recommendation and document contracts are approved. Verify account isolation and concurrent/stale requests at those integration boundaries.
6. Submit the bounded changes with acceptance evidence for human review. Do not migrate experiment records or retire either implementation without separate authorization.

Decisions requiring review: design approval/provenance and token direction; final route and return/context behavior; questionnaire content/limits/dependencies; results count/actions/refresh; graph/branch/topic-panel design and accessible navigation; catalog IDs and roadmap-specific topic identity; profile save interaction/photo validation; auth/RLS and private document lifecycle; provider/model/evaluation/spend limits; browser/viewport/accessibility verification matrix. This audit selects none of these decisions.
