# Career comparison: Philippine salary and organization

Created: 2026-11-20. Last updated: 2026-11-20.
Owner/implementer: Codex. Status: owner-approved in chat with “implement” on
2026-11-20; implemented locally, independent technical/content review pending.
Required technical reviewer: @YakisobaNissin, per [CODEOWNERS](../../.github/CODEOWNERS).

## Scope and authority

Owner request: “comparison - add ph salary comparison” and “improve organization,
add icons too if possible.” Existing acceptance: CEJ-04 in the
[comparison specification](../specs/career-exploration-comparison.md), REQ-06 and
PM-W06. Proposed bounded acceptance for this increment:

- PH-SALARY-01: Show salary context for the two submitted careers in PHP per
  month, with the source role, geographic scope, statistic or seniority band,
  source link and retrieval date visible. Distinguish an unavailable reference
  from zero salary. Preserve broader source role names rather than imply exact
  occupational equivalence. Do not calculate national or entry-level estimates
  from differently scoped figures.
- COMPARE-ORG-01: Group work, pay, shared skills/practice, starting learning,
  reported experience and saved notes into clearly labeled sections. Retain
  matched career order and narrow-screen stacked pairs. Reuse existing Lucide
  icons with visible labels; decorative icons are hidden from assistive tools.
- COMPARE-PRESERVE-01: Retain URL-backed selections, loading/retry behavior,
  existing AI explanation behavior, source disclosures, saved notes and learning
  navigation. Salary does not change recommendations or learning state.

The previous specification excluded new datasets, and FUT-08 had no selected
salary feed. The owner's explicit implementation approval authorizes this
bounded salary reference addition and its owning-record updates. No live feed
is selected or authorized.

Approval obtained as recorded above. Source selection: Sweldex's explicit
[CC BY 4.0 reuse permission](https://sweldex.com/press) supports an attributed
snapshot of Philippine-employer medians for five role groups, covering six
current career IDs. Source pages returned September or October 2026 figures;
retain those periods per card, rather than combine them into one current-period
comparison. Missing careers remain unavailable. UI/UX is explicitly combined.
The commercial candidates below were not copied because their reuse terms
restrict republication. PSA offered licensed government data, but its broad
occupation/industry rows do not establish salaries for all supported roles.
See [source provenance](../../licenses/ph-salary.md).

## Implementation boundary

Use an attributed, dated local salary reference snapshot with explicit career
identity mappings and source metadata. Prefer a consistent primary publisher
and statistic across both careers; never silently mix average, median and
seniority ranges. Show source-specific labels wherever coverage differs.
Research exact-role coverage before recording figures. No fabricated values,
automatic collection, external browser requests at runtime, or live-feed claim.
Source reuse/attribution must be checked; any unresolved reuse restriction blocks
copying its figures, while source links and unavailable states remain usable.

Candidate primary references researched on 2026-11-20:

- [Jobstreet Philippines salary insights](https://ph.jobstreet.com/career-advice/explore-careers):
  employer-disclosed full-time job-ad salaries; benefit inclusion varies. Role
  salary pages may not expose numeric figures in retrieved text.
- [A7 Recruitment 2026 guide](https://a7recruitment.com/philippines-salary-guide-2026/):
  monthly gross PHP ranges for Metro Manila, split by years of experience;
  several rows combine roles. These are not nationwide estimates.
- [Indeed Philippines salaries](https://ph.indeed.com/career/data-analyst/salaries):
  potential exact-role monthly averages; verify coverage, dates and methodology
  before selecting or using figures.

Keep the current branch `codex/cabusao-ui-integration`. This is comparison feature
work, not Stages 1–4 foundation work. No branch switch or Git publication.
Existing Discovery, Auth, shared API/client, design and stylesheet edits belong
to other work and must be preserved. The comparison page is currently unmodified.

Planned files/modules:

- `frontend/src/features/careers/comparison-page.tsx`: section organization and icons.
- New salary reference data/component within `frontend/src/features/careers/`.
- `docs/specs/career-exploration-comparison.md`: approved increment boundaries.
- `docs/features/career-comparison-and-shortlist.md`: behavior, evidence and manual steps.
- `docs/future-development.md`: narrowly update FUT-08 without overwriting unrelated edits.
- This plan: approval and check status when actually obtained.
- Attribution notice if source reuse requires one.

Dependencies/contracts: existing `lucide-react`, existing generated comparison
response and canonical career identities. No new dependencies, migrations,
authentication changes, shared API changes or provider calls.

Design read: preserve the documented light surfaces, restrained accent and shared
controls. ENERGY 1 / RHYTHM 2 / MOTION 2 from [Design](../design.md). Section spacing
separates decisions; paired columns support direct comparison. Icons identify
section content. No added animation is necessary for this increment.

## Verification and handoff

Run the established frontend TypeScript check and scoped ESLint on changed code;
check whitespace and changed documentation links/anchors. Add focused coverage
only for meaningful salary mapping, formatting or missing-data regressions.
Do not rerun foundation/container/security suites for this read-only UI increment.

Guided browser acceptance at `http://127.0.0.1:5173/careers/compare`: compare two
covered roles, inspect salary units/source/date and matching left/right order;
reverse the pair; check unavailable coverage; expand sources; follow a learning
link; confirm notes and URL selections retain their existing behavior. Check
desktop and 390 px reflow and keyboard navigation. Record performed checks and
pending human checks separately. No live AI call is needed just to review layout.

Completion requires the updated feature guide and explicit verification status.
Independent technical/content review remains pending until performed; no commit,
push, merge, deployment or hosted activation is authorized by this plan.

## Implementation handoff, 2026-11-20

Owner clarification, 2026-11-20: “cant you search online on the general? it
doesnt need to be accurate jsut a gist on average starting” authorizes broader
researched, approximate starting-pay guidance. This supersedes the initial
exact-reference-only choice. Codex owns this same bounded frontend increment;
@YakisobaNissin remains the reviewer. PH-SALARY-01 now permits explicitly authored
role-family estimates for the full current published catalog, with source links and an
explanation that these are rough ranges rather than measured starting averages.
Keep unknown future IDs unavailable. Replace the misleading-for-this-purpose
mixed-seniority medians; do not relabel those figures as starting pay. Reuse the
existing salary modules, update their focused regressions and owning docs, run
TypeScript/scoped lint/tests and local documentation checks. No shared contracts,
database, dependency or global-style changes. Owner performs Chrome acceptance.

Catalog correction: the old occupational reference CSV covers twelve careers;
the current publication adds eleven more. The owner flagged the stale assumption,
and the implementation now covers all 23, using canonical expansion IDs. The
coverage regression reads the expansion publication as well as the original IDs.
This corrects the task inventory, not the application's approved roster.

Starting-pay follow-up verification: TypeScript, scoped ESLint, four focused
regressions (including all 23 publication IDs), 51 local documentation
links/anchors and whitespace passed. The initial test's browser-URL filesystem
resolution failed; the focused harness correction and retry passed. Owner Chrome
acceptance and independent technical/content review remain pending.

Initial snapshot evidence (before starting-pay follow-up): frontend TypeScript,
scoped ESLint, three salary regressions, six canonical-ID mapping checks, 40 local
documentation links/anchors and whitespace. The owner selected self-verification
in Chrome after browser access was unavailable; manual acceptance remains pending.
No other browser harness or infrastructure was added. The
[feature guide](../features/career-comparison-and-shortlist.md#philippine-salary-and-organization-2026-11-20)
records the concrete scope, files, evidence, limitations and manual steps.
