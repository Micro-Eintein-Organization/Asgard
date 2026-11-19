> Implementation record. Dated sections preserve their original evidence and limitations. For current behavior and activation status, use the [documentation baseline](../README.md) and linked owning specifications. Earlier plans do not override later recorded decisions.

# Skill profiles and career comparison

## Benchmark and learning-path views, 2026-11-19

Implementer/task owner: Codex. Created/updated: 2026-11-19. Requirements:
REQ-11 and the owner-reviewed two-view extension of Skill Matching V2.
Reviewer/data-publication reviewer: YakisobaNissin. The owner approved the bounded
plan in chat with “Please implement the plan.” This approves implementation of
two tabs, the optional basis API parameter, version-pinned benchmark reads,
offline review/publication artifacts and focused checks. It does not approve
posting records, aliases, hosted writes or deployment.

Affected modules: skill_matching routes/sources/service, settings, generated
OpenAPI/TypeScript, the skill-matching page/client, offline snapshot renderer,
review data and owning documentation. Existing account/session transactions,
competency IDs, document evidence and snapshot/posting tables are dependencies.
No migration, authentication or dependency replacement is planned. Preserve
concurrent recovery-code work. Checks: focused source/matcher/API/import tests,
frontend tab tests, TypeScript and generated-contract drift; actual restricted-role
publication/ownership and hosted acceptance remain distinct required evidence.

### Implemented behavior and focused evidence

Both tabs are implemented. `/api/v1/me/career-skill-matches` accepts optional
`basis=benchmark|learning_path`; omission preserves the previous learning-path
response. Benchmark SQL directly joins published snapshots and competencies,
pins both source and version, keeps unmapped published careers, and loads only
the matching published posting version. Resume signals and self-reports remain
account-scoped through the unchanged session-checked transaction/service.
The frontend keys cached queries by basis and preserves tab navigation during
loading/errors. Existing generic account invalidation refreshes both views after
skill/document mutations. No provider calls or writes occur during matching.

Set `ASGARD_SKILL_MATCHING_BENCHMARK_SOURCE` and
`ASGARD_SKILL_MATCHING_BENCHMARK_VERSION` on the backend only after reviewed data
is published. Blank settings preserve learning-path access and show a clear
benchmark-unavailable error. Source/version are configuration, not inferred from
version-string order. Response provenance identifies the selected snapshot;
canonical skill provenance remains separate.

Correct-checkout verification passed: 63 distinct focused backend tests
(matcher, source/API selection, private-read scoping and publisher), 20 matching
page tests, frontend TypeScript, scoped Python lint, and OpenAPI drift.
The recovery-code chat coordinated regeneration of both shared contract files
and reported frontend client drift plus the combined build passing. No recovery
operations were removed. An initial backend run used the image's cached source;
those results were discarded and rerun with `PYTHONPATH=/repo/backend` for the
mounted checkout. The initial frontend no-mapping assertion was updated for the
approved benchmark 0-of-0 display. One existing Starlette deprecation warning
remains. Full suites, live Groq, browser acceptance and actual PostgreSQL
publication/role tests were not run for this change. Earlier database test
evidence does not verify the new publication SQL.

### Data review and owner-operated rollout

#### Current technology release package, 2026-11-19

Hosted publication audit, 2026-11-19: at the owner's request Codex used the pinned
CLI for read-only catalog counts and migration history. The linked project now
has 230 published learning-path skills, 108 published benchmark technologies,
120 published snapshot mappings and 22 published postings for
`ph_postings_collected/2026-11-19-v1`. All 20 repository migrations are recorded
remotely, including recovery codes; no further migration application/history
repair was indicated. Also observed: 23 published careers and roadmaps, published
questionnaires v1/v2, content releases 1–6, and no published career lacking a
published roadmap. No draft/unpublished rows appeared in the checked publication
states. One career and three roadmaps are retired; do not reactivate them merely
to clear a publication audit. ESCO and occupational reference-release tables each
have zero releases and zero active selectors, so those separate evidence datasets
are not loaded. This does not block the PH benchmark. This audit does not verify
Render settings, authenticated app responses, source-page validity, provider
quality or all release/security gates. No hosted writes were performed by the
audit. The query artifact is `output/sql/catalog-publication-audit.sql`.

Implementer/task owner: Codex. Reviewer/approver: YakisobaNissin. Requirements:
REQ-11 and the two-view benchmark extension. Approval references: the owner's
“ok i approve” after the posting worksheet handoff and subsequent selection of
separate technology references, preserving the 230 learning-path skills. The
owner then reported the deployed benchmark-unconfigured screen; this follow-up
completes the previously missing content package. Approval authorizes the sample
publication, not a claim that Codex independently verified the linked job pages
or that those vacancies remain active.

The [technology renderer](../../backend/scripts/render_technology_benchmark.py)
prepares 108 distinct normalized posting-skill references with stable UUIDs and
`benchmark-technology/` keys, 120 career-skill mappings and 22 posting records.
It preserves existing learning-path records/links and user reports. Equal labels
share a reference across careers; fuzzy synonyms are not merged. Old narrower
learning-task reports therefore do not automatically become technology reports.
Resume exact skill evidence and newly saved technology reports can match them.

The prepared local file is `output/sql/benchmark-technology-publication.sql`.
It records the named owner approval, creates the separate references, imports the
snapshot/postings and publishes both in one transaction. No new schema migration
or API change is required. Input pending CSV statuses remain unchanged; the
explicit approving-reviewer and approval-reference arguments authorize the
release's in-memory approved copy. Rejected records remain excluded. Publication
does not bypass career resolution, distinct reviewer/collector, minimum sample,
foreign-key, identity-conflict or immutable-posting safeguards.

Executed offline command, using the pinned backend runtime:

```text
python scripts/render_technology_benchmark.py ../docs/data/ph_postings_collected.csv --source ph_postings_collected --source-version 2026-11-19-v1 --reviewer YakisobaNissin --approval-reference "2026-11-19 owner chat approval and separate technology vocabulary selection" --output ../output/sql/benchmark-technology-publication.sql
```

The command runs from `backend/`, writes a fresh file without overwriting existing
artifacts, and never connects to a database. The offline validator correctly
warns that the source CSV remains pending; the output explicitly records the
owner-authorized release instead of silently changing collected-source history.

Verification: four focused renderer tests and scoped Ruff passed. A disposable,
network-isolated PostgreSQL 17 check applied the actual snapshot/posting migrations
over minimal catalog prerequisites, then executed the complete generated release.
It verified 108 technologies, 120 mappings, 22 published postings, preservation of
230 synthetic baseline learning references, restricted-role SELECT and absence
of INSERT privileges. Repeating the release was rejected by the existing posting
immutability guard; counts remained 230/108/120/22 after rollback. The disposable
container was removed. This checks generated SQL and catalog grants, not a full
Supabase schema rebuild, hosted Auth/provider/session acceptance, actual hosted
content or source-URL validity. No frontend behavior changed, so frontend tests
were not rerun. The owner subsequently published the package, as confirmed by the
audit above; Render configuration and browser acceptance remain pending.

Owner next steps:

1. In the intended hosted Supabase SQL Editor, execute the complete
   `output/sql/benchmark-technology-publication.sql` once. Do not rerun the older
   schema migrations, learning-path publication or empty benchmark drafts.
2. In Render backend environment set
   `ASGARD_SKILL_MATCHING_BENCHMARK_SOURCE=ph_postings_collected` and
   `ASGARD_SKILL_MATCHING_BENCHMARK_VERSION=2026-11-19-v1`; save and redeploy.
   The deployed two-tab code already reads these settings.
3. Refresh `/career-skill-matches`. Benchmark sample should load the configured
   version and reviewed sample; Learning-path skills should retain its original
   coverage. No user evidence means zero matches, not an application failure.
   Careers absent from the sample show 0 of 0. Analyze a synthetic resume with
   exact sample terms, check matches, then remove its background and recheck.

After publication, expected catalog totals are 338 overall, 230 existing
learning-path references and 108 new benchmark references. CSS search can now
return the narrower learning task and the separate CSS technology. Verify the
sample counts with the read-only queries below. Report SQL/configuration errors
without rerunning or deleting existing records. This section supersedes the
original alias-based publication workflow below for this technology release.

Subsequent owner decision, 2026-11-19: use separate benchmark technology/skill
references rather than alias broad posting terms to narrow learning tasks.
The initial worksheet found 0 exact mappings across 154 mentions, demonstrating
the vocabulary mismatch. Existing 230 learning-path identities and links must
remain unchanged. The separate reference vocabulary and publication package are
now prepared by the technology renderer above; the original importer continues
to target career-qualified learning-path references. Do not apply the earlier alias-based publication instructions below
to manufacture equivalence. They describe the original implementation and need
revision with the concrete separate-vocabulary release.

The offline renderer generated a 154-row skill-level worksheet covering all 22
pending postings at `.local/career-skill-snapshot/ph_postings_collected.snapshot.review.csv`.
It includes source URLs, proposed careers, exact mappings and up to three lexical
candidate keys/labels, plus blank mapping-reviewer fields. Suggestions do not
assert equivalence or verify a source. The CSV and alias file remain unapproved;
no review status was promoted and no publishable release was generated.

1. YakisobaNissin reviews provenance/terms, proposed careers and extracted posting
   skills against the sources. Record actual decisions in
   `docs/data/ph_postings_collected.csv`; only verified records receive the real
   reviewer identity. Collector and reviewer must differ. Review worksheet
   annotations are aids, not the import's authority.
2. For approved exact equivalences, populate `docs/data/competency_aliases.csv`
   with the existing career_slug,competency_key,alias,reviewed_by format.
   Do not map broad terms to narrow competencies merely to increase coverage.
   Unmapped and ambiguous terms stay excluded from N.
3. Run the existing renderer in the pinned backend runtime with the reviewed CSV,
   explicit source/version, `--publish-reviewed --reviewer YakisobaNissin`.
   The exercised draft command used source `ph_postings_collected` and proposed
   version `2026-11-19-v1`; use that pair for this first release. Rerendering an
   existing output requires explicit `--force` after preserving reviewer edits.
   At least 15 input records, 5 verified records, one mapped skill and resolution
   of every verified posting's career are required.
4. Review the generated `.release.sql`. It combines additive alias application,
   snapshot import, posting import and both publications in one transaction.
   Runtime matching and importing use the same approved aliases. Alias SQL
   preserves existing values and rejects same-career collisions or missing
   published canonical skills. Snapshot SQL validates expected counts/contents;
   publication rejects empty snapshots. Source/foreign-key/content conflicts
   roll back the transaction. Other sources and old immutable posting versions
   remain separate. Repeat release application is rejected by existing published
   posting-version guards rather than rewriting history.
5. Before hosted application, run the applicable isolated PostgreSQL integrity,
   rollback and restricted-role tests against the candidate release. Then the
   owner runs the reviewed complete release in Supabase SQL Editor. Existing
   snapshot/posting migrations are prerequisites; this is content publication,
   not a new schema migration. Do not run the empty draft artifacts generated
   while all records are pending.
6. Configure the two backend settings to the published pair, deploy backend before
   frontend, and verify authenticated `/career-skill-matches`. No hosted setting,
   database, commit, push or deployment was performed by this implementation.

Read-only verification after an authorized release:

```sql
SELECT source, source_version, count(*) AS mapped_skills
FROM asgard_catalog.career_skill_snapshot
WHERE published
GROUP BY source, source_version;

SELECT source, source_version, status, posting_count
FROM asgard_catalog.career_skill_posting_versions;
```

At `/career-skill-matches`, check Benchmark sample opens first and reports the
configured version; switch to Learning-path skills and confirm counts are
independent. With synthetic data, add a positive, unknown and zero report,
analyze a resume with a reviewed exact alias, refresh, and remove its background.
Verify statuses, source evidence, stable ordering, empty-career 0 of 0 and no
learning-state changes. Repeat under another account. Report URL, basis,
expected/actual count and sanitized request ID without private evidence text.
Pending: owner data/alias review, PostgreSQL publication/security acceptance,
human code/UI review, hosted configuration/deployment and manual acceptance.

## Resume saving and hosted schema repair, 2026-11-19

Implementer: Codex. Created: 2026-11-19. Last updated: 2026-11-19.
Requirements: REQ-11, PM-W03/FUT-13 and the existing career skill-matching scope.
Owner: Codex; required technical reviewer: @YakisobaNissin.
Status: owner approved the bounded implementation plan in chat; human technical
review and hosted migration/application acceptance remain pending.

The reviewed scope covers the resume review component, Profile skill actions,
their focused tests, and these implementation/PDF guides. Existing document
review and versioned skill-save APIs are reused without contract, dependency,
ranking or schema changes. Resume suggestions now offer **Add [skill]** or
**Edit [skill]**, followed by the existing experience editor and explicit
**Save skill**. Existing saved reports show their saved experience. Review
prerequisites are explained beside the button. Changing careers cancels the old
request and discards suggestions while retaining the selected PDF. Failed reviews
retain that PDF for retry; Remove, End review and leaving the active view clear it.

On 2026-11-19 the pinned CLI's linked migration-history read reported
`20261116000100`, `20261118000100` and `20261118000200` as unapplied.
This is history evidence, not direct proof that tables were never created manually.
The career matcher requires the snapshot and posting tables. The two November 18
migrations are independent of the pending account-deletion migration; a general
database push would include that unrelated security/lifecycle change.

### Operator steps in hosted Supabase

Use the project serving the hosted backend. After technical review and explicit
owner approval for the hosted writes, open **SQL Editor**. First run this read-only
check:

```sql
SELECT name, to_regclass(name) IS NOT NULL AS installed,
       has_table_privilege('asgard_app', to_regclass(name), 'SELECT') AS runtime_can_read
FROM (VALUES
  ('asgard_catalog.career_skill_snapshot'),
  ('asgard_catalog.career_skill_posting_versions'),
  ('asgard_catalog.career_skill_postings')
) AS required(name);
```

For absent tables, run the complete contents of these versioned files separately,
in this order:

1. [Snapshot migration](../../supabase/migrations/20261118000100_career_skill_snapshot.sql).
2. [Posting migration](../../supabase/migrations/20261118000200_career_skill_postings.sql).

Both files include their own transactions, SELECT grants and published-only RLS.
If some tables already exist or a run fails, stop and report the error; do not
drop tables, reset the database or rerun CREATE statements over existing objects.
Repeat the read-only query: all three installed/access values should be true.
These migrations create empty tables; reviewed posting publication is separate.
Core career-linked matching does not require posting sample rows.

SQL Editor execution does not register CLI migration history. An authorized
operator must reconcile the two versions as applied using the pinned CLI's
`migration repair` only after verifying successful complete application, then
repeat `migration list --linked`. Leave `20261116000100_account_deletion.sql`
for its separately reviewed rollout. Never mark unapplied SQL as applied.

### Focused verification and manual acceptance

Frontend TypeScript checking passed. Matching-page and suggestion-cache tests
passed (20 tests); the two affected resume/Profile suites passed (10 tests) after
correcting a test hook that accidentally returned a mock function. The old resume
test's removed-details and outdated file-label selectors were repaired. These
were test-harness failures, not observed application failures. `git diff --check`
passed. No full frontend suite, build or browser matrix was run, following the
owner's request to limit verification. No backend source or contracts changed. Docker was unavailable
during investigation; backend/database checks and hosted ownership acceptance
remain pending. Earlier dated database evidence does not verify this hosted project.

At the hosted app, open `/settings/profile`, choose a career and a synthetic
selectable-text PDF mentioning a linked skill, then select **Review resume**.
Select **Add [skill]**, choose experience, and **Save skill**. Refresh and confirm
the saved experience. Open `/career-skill-matches` and confirm successful loading;
a positive experience report should match, while unknown and zero retain their
existing meanings. Repeat selection in reverse order, change careers, and end a
review. Verify old suggestions disappear and only explicitly saved skills persist.
Use a second account to confirm private saved skills are isolated. Report route,
action, expected/actual result and sanitized request ID, without PDF contents or
credentials. Manual/browser and hosted acceptance are pending; no commit,
deployment or hosted schema write was performed by this change.

## Curated job-posting benchmark, 2026-11-19

Implementer: Codex. Created: 2026-11-19. Last updated: 2026-11-19.
Status: Stages A–C implementation is present; the Stage D PostgreSQL
integration and Skill Matching backend test suites passed on 2026-11-19. The
requirements are the curated-postings and resume-phrase-indicator scope from
the feature implementation review; no separate acceptance ID was assigned.
Technical review by `@YakisobaNissin` is required for migration and
shared-contract changes. Manual UI acceptance and publication of a reviewed
posting version remain pending.

### What the page shows

The Skill Matching page keeps its existing career order, matched counts,
saved-skill statuses, and proficiency levels. Under a career with published
posting records, it shows each posting's title, company, `retrieved_on` date,
original source URL, and collected skill labels. `retrieved_on` is the date
viewed/collected from the hand-collected CSV. A career without published
postings has no empty posting section.

The page labels this material **Curated benchmark sample** and explains that
the postings are curated references, not necessarily active vacancies or a
comprehensive list of employer requirements. These postings are a sample, not
an employer-defined requirement set.

For each posting skill, the page shows a positive resume indicator only when
the existing exact phrase matcher finds it in the user's most recent active
resume evidence. The indicator includes the matched phrase and page number(s).
The matcher uses the existing normalized phrase and boundary behavior. No
indicator is shown for an unmatched posting skill. These indicators do not
infer proficiency and do not alter career ranking, matched-skill counts,
saved-skill status, or reported levels. See the
[Skill Matching API source](../../backend/app/modules/skill_matching/service.py),
[career data source](../../backend/app/modules/skill_matching/sources.py),
[matcher](../../backend/app/modules/skill_matching/matcher.py), and
[Skill Matching page](../../frontend/src/features/skill-matching/page.tsx).

### Posting version lifecycle

Posting records live separately from the aggregate
`career_skill_snapshot` table. The migration creates a version manifest and
posting records keyed by `(source, source_version)` and
`(source, source_version, posting_id)`. Each source can have at most one
published version, enforced by a partial unique index. Draft versions are
inserted first; publication changes the prior published version for the same
source to `retired` and the target draft to `published` in one transaction.
The renderer uses a source-specific transaction advisory lock. A failure in
that transaction rolls back both state changes. Other sources are independent;
version names are not ordered to determine which version is current.

The database permits draft-to-published and published-to-retired transitions.
It does not permit rewriting or republishing a published/retired version.
Posting rows can only be written while their parent version is a draft;
published and retired posting records cannot be updated or deleted. The
runtime role `asgard_app` has SELECT grants only, with row-level policies
exposing published versions and postings for published versions. The runtime
source also explicitly joins versions with `status = 'published'`; it does
not select a version by sorting version strings. See
[posting migration](../../supabase/migrations/20261118000200_career_skill_postings.sql),
[posting renderer](../../backend/scripts/render_career_skill_snapshot.py),
and [runtime posting query](../../backend/app/modules/skill_matching/sources.py).

### Preparing and reviewing a version

From the repository root, the offline renderer accepts a validated CSV path
plus required source identifiers. Its command shape is:

```text
python backend/scripts/render_career_skill_snapshot.py <csv-path> --source <source> --source-version <version>
```

The renderer validates the CSV and writes draft SQL and an unmapped report
under `.local/career-skill-snapshot/`. It keeps only rows marked `verified`
for posting records and reports ignored pending/rejected rows. Review the
input CSV, unmapped report, and generated SQL before any authorized database
operation. Publication generation uses the renderer's explicit
`--publish-reviewed --reviewer <name>` options; it refuses fewer than 15 CSV
rows or fewer than 5 verified rows. This produces a separate
`.postings-publish.sql` file, and does not connect to or write to PostgreSQL.
The CLI also emits aggregate snapshot artifacts; those remain a separate,
unchanged lifecycle and are not the posting records described here.

The repository contains no documented command or script for applying the
generated posting SQL. Therefore this guide does not prescribe an apply
command or database credential. An authorized operator must use an approved
database-administration procedure after reviewing the generated artifacts;
the exact procedure remains undocumented and is a release blocker until
recorded. The `asgard_app` runtime role cannot perform publication.

Rollback of a failed publication transaction is automatic: PostgreSQL keeps
the previous version published and the target in draft. To replace a version,
generate and review another draft for the same source, then use its generated
publication transaction. Publishing one source does not retire another
source's active version. Published history remains immutable; rollback by
editing or deleting posting data is not supported by the migration.

### Verification and pending acceptance

On 2026-11-19, the PostgreSQL integration suite passed: 10 passed, 0 failed.
It exercises the PostgreSQL index, triggers, transactional
replacement/rollback, source-specific locking, runtime source filtering, and
`asgard_app` privileges. The existing backend Skill Matching suites also
passed: `tests/test_skill_matching.py` and
`tests/test_skill_matching_api.py`, 30 passed, 0 failed. Both suites were run
through Docker Compose from PowerShell. The backend run emitted one
non-blocking Starlette deprecation warning. These results do not establish a
shared/production migration or posting-version publication. The tests require
an explicitly opted-in, uniquely named isolated local PostgreSQL project with
the posting migration already installed; they do not create databases, apply
migrations, or clean up rows. Do not point them at a shared development,
staging, or production database. Manual UI acceptance and publication of a
reviewed posting version remain pending.

## Roadmap experience comparison disabled, 2026-11-16

Owner requested disabling this specific feature in chat; Codex removed the
roadmap trigger/mount and recommendation comparison links. `reviewSkills=1`
URLs open ordinary roadmaps. The implementation is retained but unreachable
from application UI. Profile skill editing, resume review, career-to-career
comparison, stored records and backend contracts remain unchanged. Focused
recommendation and roadmap regression tests pass. Human review by
@YakisobaNissin remains pending. See [refinement evidence](ui-refinement-and-motion.md).

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
