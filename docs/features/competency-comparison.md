# Skill profiles and career comparison

## Local resume skill matching, 2026-11-09

Codex implemented the approved PM-W03 / FUT-13 matcher update for local use.
Technical reviewer `@YakisobaNissin`. Local signed-in acceptance passed.

The [local matcher](../../backend/app/modules/documents/resume_review.py)
treats punctuation in names such as C++ and C# as part of the skill and skips
direct negative phrases immediately before a match. Later positive mentions
can still qualify. The learner sees the original page and passage and chooses
which skills and experience levels to save. The negation rules cover explicit
phrases such as “no experience with,” “never used,” and “not familiar with.”

Focused tests passed for punctuation, negation, contrast, later positive
mentions, and the existing no-store PDF review endpoint. Local Chrome verified
that a synthetic PDF yielded the positive skill only and that the disposable
learner saved it by choosing an experience level and confirming. The learner was
removed after the check.

To repeat, open `http://127.0.0.1:5173/settings/profile`, select a career in
resume review, and upload a synthetic selectable-text PDF with one positive and
one directly negated mention of two skills linked to that career. Expect only
the positive skill in the suggestions. Choose an experience level, save it, and
check that it appears under Skills. Report the career, phrases, and result.

## Profile layout and compact skill entry, 2026-11-06

The owner requested separate Profile and Account and security tabs and a PDF
selector closer to the Settings reference. Codex restored the account tab and
gave temporary resume selection a file card with choose, replace and remove
actions. A selected filename describes the current review only. Browser
verification and tests were deferred at the owner's request.

Codex updated [Settings](../../frontend/src/screens/SettingsScreen.tsx) and
[Profile Skills](../../frontend/src/features/competencies/profile-skills.tsx)
for W03 using the owner's Settings reference. Profile and Account and security
share one page. Skill search opens on demand, with an optional learning path
filter, short result pages and the existing versioned editor. Saved skills and
resume review open independently. No tests ran at the owner's request. For
manual review, open Settings, select Add a skill, search for a skill, and check
that selecting it opens its experience editor.

## Temporary resume review, 2026-11-06

Codex implemented the W03 / FUT-13 resume review in
[Profile](../../frontend/src/features/competencies/resume-skill-review.tsx)
using the existing [Documents router](../../backend/app/modules/documents/routes.py)
and skill editor. Upload, matching and review are temporary. Explicit skill
saves use the existing versioned write. Technical reviewer is @YakisobaNissin.
The flag `ASGARD_RESUME_SKILL_REVIEW_ENABLED` defaults to off. The owner enabled
local use for the school project and deferred formal privacy and extraction
acceptance. Codex confirmed the running local backend loaded the enabled flag.

Verification passed for two focused backend tests, twelve existing PDF checks,
the late-response UI test, two existing skill editor tests, frontend type
checking and OpenAPI synchronization. The endpoint test used synthetic PDFs
with a substituted identity and database boundary.

For manual acceptance in an authorized synthetic local environment, open
`http://127.0.0.1:5173/settings/profile`, expand **Review skills from a resume**,
select a career, and review a selectable text fixture. Confirm the page and
passage, dismiss a suggestion, save a level for a different suggestion, and
confirm manual selection still works. End the review and reload Profile to
confirm only the saved skill remains. The manual walkthrough is pending.

## Learner journey extension, 2026-11-05

The experience dialog is now Review your experience, with optional inline add/edit/removal and descriptive labels. Profile groups reports by canonical career context. Full occupational browsing moves to Sources and limitations. True two-career comparison is a separate route. See [implementation and acceptance status](career-comparison-and-shortlist.md); existing rating identities, privacy erasure and learning state remain unchanged.


Implementer: Codex. Created: 2026-11-04. Last updated: 2026-11-05.
Status: implemented, isolated runtime checks passed, normal local-test activation
authorized/applied; independent content/code review pending. Requirements: PM-I1-01–12 from the
[specification](../specs/competency-comparison.md). Technical reviewer:
@YakisobaNissin; independent code review pending. Content reviewer: unassigned.
Owner authorization: explicit “during, and i approve” reply after the migration/API
review prerequisite was presented, followed by “antislop mode during”. This records
approval to proceed, not completed independent code/content review.

## Behavior and source

Local integration activated, 2026-11-05: the owner approved the concrete bundle;
all twelve occupational profiles and skills-aware context are now active locally.
Startup, normal authenticated save/removal and preservation checks passed. The
existing design/learning state is preserved. See
[activation evidence](career-evidence-recommendations.md#normal-activation-completed-2026-11-05).

Integration update, 2026-11-04: the optional occupational/skills-aware extension is
implemented and verified in isolation; normal activation awaits the concrete SQL
review. When its migration is installed, skill mutations affect suggestion context
and erase affected payloads on edits/removal. Without that migration this manual
feature retains its existing behavior. See the
[integrated evidence and limits](career-evidence-recommendations.md#integrated-local-release-acceptance-2026-11-04).

The [session record](../plans/competency-comparison-2026-11-04.md) retains the owner's
choices, deferrals and reported ESCO failure. No ESCO data was imported.

- [Competencies module](../../backend/app/modules/competencies/) provides authenticated
  search, current-record save/read/removal and deterministic per-career comparison.
  Reuses session-checked restricted-role transactions and account-scoped queries.
- [Additive migration](../../supabase/migrations/20261104000100_competencies.sql)
  supplies reference skills/topic links, private current records, owner RLS and
  persistent account revisions. A server-selected label snapshot keeps existing
  records readable/removable after reference retirement. Removal retains no rating
  history; the account counter survives removal/recreation. Comparisons use one SQL
  read for consistent reference/profile versions, serialized against own edits.
- [Content renderer](../../backend/scripts/render_competencies.py) produces
  [draft SQL](../../supabase/content/20261104_competencies_draft.sql) for 120 skill
  assignments/topic links across 12 careers. Career-qualified stable keys avoid
  inferring equivalence across careers. Reordering/relabeling an existing key causes
  reference conflict rather than rewriting published meaning. SQL is transactional;
  runtime credentials have no reference publication rights.
- [Profile editor](../../frontend/src/features/competencies/profile-skills.tsx)
  adds one Skills card below Career background. Search/pagination, explicit saves,
  unknown versus levels 0–4, editing/removal, reload and dirty/pending guards are
  connected through generated API types. Other Settings saves remain independent.
- [Comparison dialog](../../frontend/src/features/competencies/comparison.tsx)
  opens from the roadmap action row, showing unassessed, unknown or self-reported
  experience and exact topic links. Existing focus/progress/recommendation services
  are unchanged. No readiness score, inferred targets or model calls were added.

OpenAPI and generated TypeScript were regenerated. Shared components/tokens remain;
no global styles, navigation redesign, assets, dependency versions, locks or
runtime configuration were changed. Retained databases were not modified.

## Normal local-test activation, 2026-11-04

The owner reported that setup now stopped on a pending migration. A read-only dry
run confirmed only `20261104000100_competencies.sql` was pending. In reply to the
specific request to apply it to the normal database and rerun setup, the owner
said "yea implement all so i can test". This authorizes normal local migration
and testing activation as supplied; it does not establish independent content
approval or hosted release authorization.

The single migration was applied to `asgard-foundation`; 120 Asgard-authored skills
were enabled for local testing. Publication metadata explicitly records project-owner
local-test authorization and pending independent review, rather than inventing a
completed content review. Digests of every pre-existing private table were unchanged
across migration and publication. The subsequent migration dry run was up to date.
No reset, credential rotation or deletion of existing records occurred. Standard
`node scripts/dev.mjs start` completed successfully, reported migrations up to date,
built healthy app containers and printed READY at `http://127.0.0.1:5173`. An
authenticated frontend-proxy smoke check confirmed 120 available skills, an empty
own skill profile for a new synthetic account, and ten comparison items for each
of the 12 careers. The temporary account was removed; no provider calls were made.

The following activation/pending descriptions retain their earlier checkpoint;
this dated local-test authorization supersedes their normal-activation blocker.

## Activation and content review

The initial interruption was caused by Docker being unavailable. On resumption,
the migration, reference publication and browser flow were verified in isolated
resources as recorded below. The normal environment has not received the migration
or skill publication. Coordinate its separate activation and actual content review;
test-fixture publication does not approve real content.

Apply reference content only after the existing catalog releases and new schema
are present. The checked-in SQL leaves every skill unpublished. Default execution
of `python backend/scripts/render_competencies.py` renders that draft to stdout;
this authoring command was verified here and adds no host-Python setup prerequisite.
The established container runtime should be used when available.

After named content review is actually recorded, the renderer's explicit
`--publish-reviewed --reviewer NAME` option emits the publication metadata and
updates within the same transaction. This option was tested with a synthetic name;
no actual approval was invented or publication executed. Review/apply the SQL as
an authorized administrator, not asgard_app. The ordinary content publisher is
unchanged; these skills are a separate bounded publication. Without publication,
search/comparison shows an honest mapping-unavailable state.

## Verification on 2026-11-04

Passed:

- 31 backend unit tests: competencies plus existing Auth/Profile JWT/session tests.
  Covers allowed/rejected levels, submitted-owner rejection, stale-write prevention,
  three distinct evidence states, anonymous denial, deterministic draft rendering
  and explicit reviewer requirement. These are not actual-role database tests.
- Four new skill UI tests and six existing Settings/roadmap tests passed. Covers
  zero versus unknown, captured revision/dirty guards, failed edit retention,
  exact topic links and existing save/navigation behavior.
- The final combined frontend run passed all 10 cases in four files.
- Frontend TypeScript and production build, scoped ESLint, scoped backend Ruff,
  backend OpenAPI drift and frontend generated-client drift passed.
- Preparation validated 12 careers, 120 unique draft assignments, source hashes,
  120 exact source-topic matches and 39 initial local links/anchors. Final guide/
  specification/session checks resolved 17 local references; all existing OpenAPI
  paths are unchanged, with five new paths added.

Environment limits: existing hash-pinned packages were installed into ignored
`tmp/competency-verify` for source checks, using host Python 3.14; this does not
replace pinned Python 3.13/container acceptance. The Linux-oriented lock's Windows
colorama transitive resolution prevented a normal install; installing only the
explicit hash-pinned packages succeeded without changing locks. Sandboxed asyncio
stalled; the synthetic tests passed outside that sandbox. The existing Starlette/
httpx deprecation warning remains. The client checker initially hit an environment
TEMP-path error; using a workspace-local temporary directory passed without changing
its script. No new application dependency or live provider request was introduced.

At the interrupted source-only checkpoint, the pending checks were migration
execution, repeat/conflict database publication checks,
actual restricted-role isolation/session checks, save/refresh against the running
stack, screenshots/visual geometry, browser keyboard/focus/zoom checks and independent
human review. The added opt-in case in
[existing Auth integration tests](../../backend/tests/integration/test_local_auth.py)
checks actual-role isolation, owner writes, stale revisions, removal/recreation and
unchanged learning state. It requires the migrated isolated stack and a reviewed
published skill fixture; no runtime assertion is replaced with a silent skip.
The resumed checks below supersede that runtime blocker. Content approval and
independent human review remain open; broader cases outside the checked flow are
not silently accepted.

## Resumed Docker acceptance, 2026-11-04

At the owner's request to resume interrupted work after Docker became available,
the existing [isolated runner](../../scripts/check-core-isolated.mjs) gained a
`--competencies` mode with [focused acceptance](../../scripts/competency-acceptance.mjs).
Verified invocation: `node scripts/check-core-isolated.mjs --run-local --competencies`
with `ASGARD_CORE_PORT_BASE=60320` for the independent port range. This mode omits
the new migration during initial bootstrap, seeds saved state, then applies that
migration through the pinned CLI. It does not run the complete foundation suite.

Passed across the initial upgrade and focused retained-stack resumption:

- Saved synthetic Profile, current focus and Done-topic readback survived the new
  migration exactly. Digests of all pre-existing private tables were unchanged.
- Default draft publication and repeat publication created 120 unpublished skills
  and topic links without runtime search exposure. A synthetic publication fixture
  exposed all 120 skills; each of the 12 careers returned ten mapped skills/topics.
  Repeat publication preserved prior private state. Fixture review metadata is
  explicitly synthetic and is not independent content approval.
- A conflicting reference was rejected and its transaction rolled back; no conflicting
  label was visible afterward and private-table digests remained unchanged.
- Pinned Python 3.13 container: 21 tests passed, comprising 16 competency unit cases
  and all five opt-in Auth integration cases. Actual `asgard_app` RLS denied another
  account's reads/writes; save/refresh, stale mutation, removal/recreation versions,
  verification, logout token rejection and refresh restoration passed. No opt-in
  Auth case was counted as passed without execution.
- Actual installed Chrome passed sign-in, skill level-0 save/refresh, unknown
  save/refresh, roadmap comparison, an exact topic destination, removal/refresh,
  Enter/Escape and dialog focus return. Profile/focus/progress remained unchanged.
- Profile overflow checks passed at 1280/1440/1920/320 CSS px. Local screenshots of
  Profile at 1440/320 and roadmap/comparison at 1440 were inspected. Existing Profile
  composition and roadmap columns remain; this is scoped acceptance, not whole-app
  reference-fidelity or accessibility certification.
- Screenshot inspection found inherited white text on the new outline comparison
  trigger. The trigger now uses the existing foreground token; the dialog header
  reserves close-control space. The affected Chrome flow was rerun and passed,
  including measured trigger contrast at least 4.5:1. Backend checks were reused.
- Scoped backend Ruff and OpenAPI drift passed inside the pinned container during
  the resumed browser run, replacing the earlier host-only verification limit for
  those checks. The known Starlette/httpx deprecation warning remains.
- After the presentation correction, the four focused frontend cases, scoped
  ESLint and TypeScript passed. All 24 local references in the current feature
  documents and latest status sections resolved; whitespace and Node syntax checks
  passed. Final Docker inventory contained only the normal Supabase services.

Corrections and verification limits: the first migration attempt exposed malformed
quoting in the dynamic ownership policy; dollar-quoted SQL corrected it before the
successful upgrade. Source inspection also corrected an obsolete alias in skill
readback ordering, exercised by the successful database tests. The first conflict
probe replaced only an ignored INSERT value; changing both that value and its
expected assertion corrected the verifier. The failed isolated stacks were stopped
with data retained. Later steps resumed the retained successful-upgrade stack without
rebuilding images or reprovisioning credentials. No normal database was reset or
migrated, no real content approval was fabricated and no provider calls were made.

Evidence is local/ignored under `tmp/core-acceptance-dXlUTs/`, including
`skills-profile-{1280,1440,1920,320}.png`, `skills-roadmap-1440.png` and
`skills-comparison-1440.png`. Private failure logs may include setup/SQL output and
must not be published as ordinary artifacts. Temporary accounts were removed;
isolated app/Supabase services were stopped with retained data. At the end of that isolated run, normal Supabase
services remained running and normal application services remained stopped; the
later normal local-test activation above supersedes that application status.

Remaining: named content review/publication, normal-environment migration/activation,
independent technical/visual review, screen readers/actual zoom/other browser engines,
comprehensive concurrency permutations and the previously deferred release work.

## Guided manual verification (ready for local testing)

At `http://127.0.0.1:5173/settings/profile`, add unknown, level-0 and level-3 skills;
save/refresh and verify distinct readback. Edit/remove and revisit. From `/careers`,
open a roadmap, choose Compare my skills, inspect provenance/unknown states and
open a linked topic. Confirm focus, branches and progress remain unchanged.
Repeat with a second account and stale two-tab edits. Check Profile/roadmap at
1280/1440/1920 px and narrow reflow, existing card composition, keyboard dialog
operation, Escape and focus return. Report URL, step, expected/actual behavior and
sanitized request ID without personal information.

## Anti Slop delivery gate

Mode: during, explicit session override. Direction: existing Asgard/Cabusao light
UI, ENERGY 1 / RHYTHM 2 / MOTION 1. Card grouping separates an independent account
edit; the outline action preserves roadmap focus as primary; the dialog presents
optional comparison without changing the roadmap columns. Existing typography,
colors and spacing come from shared components; no new palette or assets.

Source review found no fabricated metrics, proficiency targets or decorative copy.
Functional state checks and exact-link tests passed. Shared semantic Dialog controls,
focus behavior and tokens are reused. The resumed Chrome checks establish scoped layout, comparison-trigger contrast and
Enter/Escape/focus behavior, with inspected screenshots. Screen-reader, actual zoom,
other-engine and independent visual acceptance remain pending. The gate is complete
only for the explicitly exercised scope, not whole-app accessibility.

## Deferred work

Normal local-test activation is complete. Independent content/code review and
nonlocal release/publication remain gated.
Hosting/account controls, PDF/photos, counselor, external datasets, rating history,
AI integration, broad regression/browser matrices, model-quality/research work and
independent-host acceptance remain outside this increment. No commits, pushes,
merges or deployment were performed.

## Expanded local skill mappings, 2026-11-08

Codex implemented the owner-authorized local expansion for PM-I1 and REQ-02/03. The [expansion profiles](../../backend/app/content/career-exploration/v1/expansion-profiles.json) document 110 career-qualified skills and their topic links, with the exercises that support each association. The [skill SQL](../../supabase/content/20261108_expansion_skills.sql) publishes them through the existing reference tables. The original 120 skill identities and user ratings carry forward. [Shared-practice data](../../frontend/src/features/careers/shared-practice-data.json) connects each new career to another through explicit examples and independent skill identities.

The disposable database passed all 230 skill identities, ten visible mapped skills per career, repeat publication, preserved skill reports, and restricted-role owner isolation. In Profile → Skills, add a Backend Developer skill and save an experience level. Reload and compare Backend Developer with Full Stack Developer from Careers. Both sides should show topic links and the shared web-request practice. Related practice does not transfer the learner's rating.

Normal local publication confirmed 230 searchable reference skills. The signed-in smoke check saved and reloaded a Backend Developer skill, then verified an existing/new career comparison and its shared web-request practice in a separate disposable session. The focused competency checks passed using the pinned backend container.
