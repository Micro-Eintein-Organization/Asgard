> Implementation record. Dated sections preserve their original evidence and limitations. For current behavior and activation status, use the [documentation baseline](../README.md) and linked owning specifications. Earlier plans do not override later recorded decisions.

# Full career evidence and skills-aware recommendations

## Hosted restoration prepared, 2026-11-19

Owner requested an end-to-end Supabase audit after verifying that the hosted
ESCO and occupational release tables are empty. Codex preserved the exact earlier
23-career local release in portable, hashed repository assets and prepared a
repeat-safe SQL import/activation package. The isolated PostgreSQL validation
passed with real reference migrations and restricted-role reads. Hosted content
approval, application, and authenticated acceptance remain pending; earlier
local-only review waivers are not expanded by this record. See the
[audit and exact repair order](supabase-hosted-audit.md). The historical local
activation evidence below remains unchanged.

## Learner-facing exploration update, 2026-11-05

The owner-selected [career exploration and comparison feature](career-comparison-and-shortlist.md) is active locally after concrete shortlist migration approval. Suggestion cards now use direct Explore career / Compare actions; their saved evidence disclosures remain typed and historical. Experience review is inline and full occupational records are on a secondary Sources and limitations page. No provider selection, evidence eligibility, erasure or reference-release policy was changed by this UI/shortlist increment.

## Owner-directed W04 display, 2026-11-06

The owner selected the existing Recommendations page as the durable result view.
The Dashboard shortcut was removed on 2026-11-06. Show W04 skill comparison only in the recommendation
reason and expandable evidence details. Roadmap stays focused on learning, with
no comparison panel. W06 career-to-career comparison stays on its separate page.
Codex removed the standalone skill comparison from Roadmap and the two-career
comparison page on 2026-11-06. The latter still shows reported experience for
each career. Manual acceptance is pending in the
[Round 1 walkthrough](learning-guidance-and-reflection.md#owner-directed-presentation-rework-2026-11-05).

Implementer: Codex. Created: 2026-11-04. Updated: 2026-11-05.
Status: implemented, integrated isolated acceptance passed, owner-approved local
activation applied and normal startup/authenticated smoke passed. Independent
content review and broader release acceptance remain pending.
Requirements: the owner's supplied four-part implementation plan in the recorded task;
PM-W02/W03/W04/W07 and existing PM-I1 acceptance boundaries where applicable.
Technical reviewer: @YakisobaNissin. Independent content reviewer: unassigned.

## Normal activation completed, 2026-11-05

The owner explicitly answered **Approve local activation** to the concrete bundle
review. Applied the two hash-verified versioned migrations
[reference storage](../../supabase/migrations/20261104000200_occupational_releases.sql)
and [owned privacy](../../supabase/migrations/20261104000300_skill_recommendation_privacy.sql),
then the reviewed deterministic publication transaction. All twelve careers are
active. All original private-column digests and the existing skill catalog matched
before/after; no ratings, focus, branches or progress were reset or rewritten.

Docker was initially off, so preflight stopped before database writes. Started the
installed Docker Desktop via its CLI, reused the existing Supabase project and
completed the approved operation. The supported `node scripts/dev.mjs start`
reported up-to-date migrations and READY. No provider configuration change occurred.

Normal authenticated smoke passed: twelve-career catalog, evidence and comparison
release identity, reported zero save/removal, recommendation-context readiness,
frontend/backend health, temporary-account cleanup and private-data preservation.
No generation request was made on the normal provider. The isolated synthetic
provider journey remains the generation/erasure/replacement evidence.

Final targeted frontend checks: 15 passed across five affected files. A focused
legacy-context regression passed, ensuring old context is outdated after activation
even if its prompt version already matches. TypeScript, Ruff, generated contracts
and whitespace checks passed. The broader viewport/network-timing matrix remains
deferred as recorded below; independent content/live-quality/hosted acceptance is
not inferred. Earlier activation-pending notes are historical.

Local test URLs: [Profile skills](http://127.0.0.1:5173/settings/profile#profile-skills),
[suggestions](http://127.0.0.1:5173/recommendations). Save experience, explicitly prepare
or update suggestions, and open Evidence used. On a roadmap, Compare my skills
contains occupational references. Editing/removing an input erases affected saved
results; explicit replacement generation uses the current profile and existing
quota rules. Report a failure with navigation/action, expected/actual behavior and
the request ID if shown; do not include tokens or private configuration.

## Activation review prepared, 2026-11-05

Resumed the interrupted final checks. The three activation SQL hashes match the
manifest and current source drafts. The ignored bundle includes numbered migrations,
publication SQL and an operation/recovery README. Normal `asgard-foundation`
activation remains unapplied pending the concrete review required by the approved
plan. No normal data, credentials or provider configuration were changed.

## Integrated local-release acceptance, 2026-11-04

This section supersedes earlier incomplete-integration status below. The owner
requested faster verification; passing evidence was reused and no broader matrix
or new dependency was introduced. Normal database activation is still not claimed.

Implemented: context v2 self-reports and occupational release identity; up to six
eligible observations per career; candidate-specific citation validation; token
budget reduction that retains personal facts; self-contained source title/version/
hash citations; skills-only explicit generation; old-run read compatibility; and
release-aware reuse/retry/completion. Native scales remain distinct from ratings.

Owned skill mutation now serializes learning/competency state and advances both
revisions atomically. Protected transaction-scoped erasure authorization removes
affected input/result payloads and membership, including uncited inputs and pending
runs. Tombstones reject restoration/re-addition. Runtime direct skill writes are
replaced by the session-checked mutation function. Reference writes remain denied;
a narrowly scoped read/lock function obtains the pointer lock without granting UPDATE.

The existing comparison dialog now browses grouped/paginated source roles, native
observations, source locators and partial topic links. Existing suggestion cards
show cited reports/references and coverage limits. Skill edits clear cached results
and cancel in-flight reads. Composition, shared components, tokens and learning
navigation remain intact. OpenAPI and TypeScript are synchronized.

Verification evidence:

- PASS: 48 focused backend tests (host verification environment), including context
  discrimination, citation membership, budget preservation and existing regressions.
- PASS: 21 pinned-container competency/Auth checks, actual restricted-role/session
  isolation and existing Chrome save/readback/comparison/removal acceptance.
- PASS: fresh isolated migration checks preserved all pre-existing private columns;
  the fixture included profile, reported zero, focus and a Done topic.
- PASS: complete twelve-career publication and repeat activation, authenticated
  pagination/source-role filters and stale-release conflicts.
- PASS: integrated Chrome journey with the isolated synthetic provider: explicit
  generation, citations, comparison pagination, skill-edit erasure after refresh and
  explicit replacement generation. No live provider request was made.
- PASS: actual restricted-role SQL checks for uncited/pending erasure, late-result
  insertion rejection, forged authorization denial, wrong-session rejection,
  tombstone immutability and removal/re-addition.
- PASS: two concurrent restricted-role mutations produced one success, one stale
  rejection and one revision advance.
- PASS: missing/duplicate profile rejection, disputed-input rejection, canonical
  hash mismatch rejection, runtime publication denial and restricted pointer locking.
- PASS: focused frontend interaction/cache tests; TypeScript, Ruff and contract checks.
- INSPECTED: 1440px suggestion/comparison screenshots from the isolated journey.

The combined check uses `node scripts/check-core-isolated.mjs --run-local --career-evidence`.
Execution resumed the retained fixture after correcting a validator alias, a row-lock
privilege mismatch and an explicit select-label association; the passing foundation
checks were not repeated. A copied-fixture policy dependency was corrected for the
final negative integrity checks. These were recorded failures, not bypassed gates.

Remaining review boundaries: normal activation and startup checks; independent
content approval; live model-quality evaluation; hosted acceptance. The complete
new viewport/zoom matrix and every network-timing interleaving were not rerun under
the owner's fast-track instruction. Actual transactional rejection and cache races
were checked. No commit, push, deployment or normal provider configuration change.

Concrete activation artifacts are generated under ignored `tmp/career-evidence-activation/`:
two numbered SQL migrations, deterministic publication SQL and a SHA-256 manifest.
They target only local `asgard-foundation`. They remain outside startup's migration
set until the owner's concrete review. The publication includes twelve careers,
120 existing skill identities, 138 eligible observations and 261 partial topic
associations; original review/provenance limitations remain explicit.

Manual normal-environment path after approval: start Asgard, sign in, open
`http://127.0.0.1:5173/settings/profile#profile-skills`, save a report, then explicitly
prepare/update at `/recommendations`. Inspect Evidence used and the roadmap's
Compare my skills > Occupational references disclosure. Editing/removing an input
must erase affected saved results after refresh; browsing topic links must preserve
focus/progress. Normal generation still requires the existing provider configuration;
the recorded automated journey used the synthetic isolated provider only.

## Deterministic recommendation evidence helpers, 2026-11-04

Added `backend/app/modules/recommendations/occupational_context.py` with tested pure
helpers for reported-skill facts and bounded career-specific source retrieval.
Unknown, explicit zero and missing reports remain distinct. Source selection uses
only the overlay's eligible observations, rejects disputed/suppressed/context-only
or mandatory records, prioritizes partial links to reported skills, and selects at
most six references using stable identities. It emits coverage counts and does not
transfer personal proficiency or send native values as user targets.

PASS: four focused tests for unknown/zero/missing, deterministic bounded retrieval
across all twelve profiles, disputed-overlay injection and proficiency-transfer
rejection. These helpers are not yet wired into runtime recommendation snapshots:
doing so before mutation-backed erasure is implemented would expose an incomplete
privacy contract. Existing suggestions and skill saves therefore retain their
current behavior. No migration or normal activation occurred.

The requested end-to-end milestone remains unfinished: database-owned erasure and
membership, snapshot/provider/result integration, reference API coverage extensions,
UI wiring, integrated isolation/race/browser acceptance and reviewed activation.

## Paginated evidence API implementation, 2026-11-04

Added authenticated `GET /api/v1/careers/{career_id}/evidence` in the existing
competency router, with typed Pydantic output and synchronized OpenAPI/TypeScript.
The owning reader is `backend/app/modules/competencies/evidence.py`.
It checks published career availability and selects one profile and bounded record
page in PostgreSQL, ordered by occupation/type/record identity. Query parameters
support limit/offset, source-role filtering and expected-release identity. A changed
release requires reload; an unrelated source role is rejected. Missing reference
migration or inactive publication returns an explicit unavailable empty page.

Source-native levels, observation dates, suppression flags, decisions, rationales
and original locators remain separate from personal skill ratings. Disputed records
remain visibly disputed and outside local-test eligibility; returning a reference
record does not promote it into a requirement. This API currently exposes record
and role provenance, not the planned topic-coverage/source-detail UI.

PASS: three focused reader tests covering missing storage, changed release and
disputed native zero without eligibility; scoped Ruff, frontend TypeScript and
OpenAPI drift check. Host asyncio stalled inside the Windows sandbox; the synthetic
tests passed outside it, without app database/provider access. Actual PostgreSQL
queries returned two records per page with correct full counts for all twelve
profiles in a disposable network-disabled fixture. The first fixture container
could not restart because its entrypoint repeated initdb; a replacement used a
restart-safe conditional initialization. No normal database change was made.

Pending: authenticated HTTP/session acceptance for this endpoint, role-filter and
multi-page release-change integration checks, source/topic coverage response
extensions, current comparison metadata, recommendation integration, privacy erasure,
UI/browser checks, finalized migrations and local activation. The end-to-end feature
is not complete. Current Skills copy correctly retains existing behavior until the
recommendation integration actually changes it.

## Scope and actual delivery

## Local-test integration preparation, 2026-11-04

The owner selected skills-only exploration suggestions and a usable local test
release covering all twelve careers. The user subsequently identified themselves
as YakisobaNissin and explicitly approved the integration plan in chat. This records
technical contract/plan approval; it does not invent independent content approval,
review of future code or authorization to apply unreviewed normal-environment SQL.

Implemented the separate hash-bound local-test overlay: 138 eligible observation
proposals and 261 partial topic proposals. Only agent-supported core-function
records qualify; topic links must reach a qualifying concept in that career.
All original dispositions remain intact, including the disputed PDF observations.
The overlay remains a proposal and does not activate runtime inference.

Tools: `backend/scripts/prepare_occupational_local_test.py` builds/checks the overlay;
`backend/scripts/render_occupational_release.py` renders deterministic transaction SQL
for a full immutable snapshot, including all 9,922 dispositions, original native
values, roles, source records, definitions and topic/skill associations. The renderer
does not activate it. A [proposed additive migration](../plans/occupational-releases-proposed.sql)
defines immutable JSON reference snapshots, a separate active-release pointer and
runtime read-only grants/RLS. It stays outside startup's migration directory while
runtime integration is unfinished, so this preparation adds no pending startup migration.

Verification: 22 focused packet/review/overlay/render tests passed across targeted
runs; scoped Ruff passed. Three packet tests initially failed to create sandbox
temporary directories and passed using a unique workspace-local base directory.
New checks reject changed source hashes, injected record IDs, proficiency transfer
and inferred activation; deterministic repeat rendering and preservation of native
levels/disputed records passed.

Actual SQL checks ran in a dedicated network-disabled PostgreSQL container using
the already-installed image: proposed DDL applied, publication twice left one release,
runtime saw zero inactive releases and could not INSERT references, activating the
fixture exposed one twelve-career release, and UPDATE immutability rejected mutation.
These are isolated reference-storage checks, not full migration-upgrade, account/session
or recommendation privacy acceptance. Normal app data and current UI were untouched.

Remaining implementation: career evidence API and generated clients, recommendation
context/retrieval/citation validation, skill invalidation and payload erasure,
comparison/suggestion UI extensions and their security/race/browser checks. Normal
activation remains pending the complete implementation and concrete publication review.
Independent content reviewer remains unassigned. No live provider request was made.

## Original packet delivery

The owner selected full applicable profiles for all twelve current careers,
source roles/levels grouped within each career, interests plus experience in
suggestions, one complete release activation, and erasure of affected suggestion
payloads after skill corrections/removal. Existing skills, ratings, UI and learning
state must remain intact. Independent approval is not inferred from this assignment.

Prepared [occupational v1](../../backend/app/content/occupational/v1/README.md) from
the ignored research curation. The manifest records 20 sources, 41 occupations,
1,185 competencies, 5,518 native rating records, 246 tasks, 59 proposed crosswalks,
12 proposed learning associations, 96 proposed comparison cases and existing
extraction dispositions. Profiles include all linked records without a skill-count
cap. These counts describe research material, not independently accepted content.

[The preparation/validation tool](../../backend/scripts/prepare_occupational_release.py)
checks frozen artifact hashes, duplicate identities, cross-table references,
crosswalk endpoints and exact current career/roadmap/topic identities. Normal check
mode reads only durable files and current source, without depending on ignored caches.
It refuses changed identities, unsupported topics and altered artifacts. Native
IM/LV, technology-example and Philippine functional levels remain separate.

No original PDFs, spreadsheets, archives or complete cached page-text dumps were
copied. This does not independently settle extracted records' reuse rights.
No new dataset, dependency, database change, provider request or Git publication
was made. The working local-test skill feature remains active and unchanged.

## Twelve-career policy-assisted agent review, 2026-11-04

At the owner's explicit request, Codex completed a conservative review ledger for
all twelve careers. [Review summary](../../backend/app/content/occupational/v1/review-summary.md),
explicit scope/topic policy and complete JSON dispositions are in the inactive
release. The method is transparent: agent-authored career scope and topic pairings
plus deterministic per-record classifications, not a claim that every raw record
received individual expert validation. Independent approval remains pending.

The ledger covers 9,922 career-specific task/rating inheritances, all 59 crosswalks,
all 1,185 source definitions, 120 existing skill identities, 288 topic identities
and the twelve prior learning proposals. Broad occupations remain broader/related
references; no occupational equivalence is accepted. Technologies are examples,
not mandatory requirements. Suppressed/not-relevant observations are excluded;
conflicting repeated levels remain disputed. All inference eligibility stays false.
Source records, levels and original extraction dispositions remain available unchanged.

All 288 topics have agent-proposed partial associations with exact definition
locators. They do not imply occupational coverage or mastery. Existing personal
skill UUIDs are preserved; no rating transfer is allowed. Unlinked source concepts
are listed per career, including broad context and technology examples: these are
not presented as required learning gaps. Former generic links not supported by the
explicit pairing are retained in the rejection history rather than silently reused.

The [review builder/validator](../../backend/scripts/review_occupational_release.py)
checks complete/unique record coverage, current topic and skill identities,
career-specific competency membership, source conflict/suppression handling,
non-mandatory/inactive flags and prohibition of proficiency transfer. Review output,
policy and summary hashes are frozen in the manifest. The existing packet check
also verifies them. Verified commands from checkout root:

```text
python backend/scripts/review_occupational_release.py
python backend/scripts/prepare_occupational_release.py
```

Fifteen focused tests passed (seven packet tests and eight review tests), including
negative cases for missing dispositions, unsupported competencies, technology
requirements, disputed evidence entering inference, accepted conflicting values,
proficiency transfer and changed saved-skill identities. Scoped Ruff passed.
These are structural/guardrail checks, not independent semantic acceptance or the
execution of the 96 proposed product comparison cases. No runtime/API/database,
provider, UI, dependency or active publication changes were made in this step.

Handoff: the package is ready for content-review feedback, with disputed claims,
unlinked concepts and source-specific role limits visible. Independent content
reviewer remains unassigned; technical reviewer remains @YakisobaNissin. The next
runtime integration milestone stays gated by those required reviews. No live
provider, browser or database checks were needed for this inactive data-only step.

## Verification

- PASS: preparation and standalone validation of the complete packet.
- PASS: five focused tests: valid/inactive packet, broken source reference,
  mismatched application identity, unsupported topic and artifact tampering.
- PASS: scoped Ruff on the new tool/tests.
- Initial test run: four passes and one temporary-directory setup error in the
  Windows sandbox. A new workspace-local test directory corrected that harness
  failure; the affected run passed. Existing locked host verification dependencies
  were reused; pinned-container application checks were not needed for this packet.

Not run: semantic acceptance of the 1,185 records; independent content review;
recommendation integration; new SQL/RLS/privacy-erasure tests; model-quality or
browser acceptance for this increment. The 96 comparison cases remain proposed.

## Original-source verification, 2026-11-04

The owner supplied the original dataset folder after the missing-originals report.
All 20 original archives/documents matched recorded SHA-256 and byte sizes. The
manifest now records observed digests/size and verification scope without storing
the absolute input path. `--verify-originals DIRECTORY` validates all files before
writing the verification record; mismatch/missing files fail. Originals were read
in place and were not copied into the repository. This resolves the earlier missing
source-file blocker. Exact retrieval dates/URLs, semantic and reuse review are
separate questions and remain unknown/pending where not established.

Fresh renders of original SRC-13 pages 65 and 70 were visually inspected using the
PDF skill. Findings are recorded in the manifest: page 65's right skill table is
headed Security Architect, so its levels are withheld from Security Analyst; the
proposed practitioner label is not established by that page. Page 70 confirms two
Security Threat Research rows at levels 4 and 6 within the analyst table; both
observations are retained, with no unique proficiency target accepted. These are
agent source findings, not independent content approval or completed review of
all remaining records. Temporary page images remain in ignored tmp storage.

Seven focused tests passed after extending the validator: the previous five plus
original-byte verification/tamper rejection and missing-original rejection.
Scoped Ruff passed. The durable packet remains inactive and the running application
is unchanged.

The earlier blocker descriptions below are historical for original-file availability;
semantic, review-assignment and shared-contract gates remain outstanding.

## Blocking dependencies and next work

No original source files were supplied to the portable preparation, so their
recorded checksums cannot be independently verified. Some dates/retrieval/reuse
metadata remain unknown. Cache hashes and earlier agent inspection labels do not
resolve that gap. Recover the corresponding original files or record an explicit
bounded source-verification resolution before affected publication claims.

All current crosswalks remain proposed; individual competency/task semantics and
source ambiguities still need review. Cybersecurity role-header association,
conflicting penetration-testing levels and broader DevOps/ML role mappings cannot
be silently promoted into equivalent occupations or numerical proficiency targets.
Only twelve learning associations exist; expansion is not claimed as completed.

The [concrete integration proposal](../specs/career-evidence-integration.md) is ready
for technical review. AGENTS.md requires that review before dependent migration/API
coding. Assign content approval before approved publication; no reviewer identity
or completed review was invented. Keep this packet inactive until its gates pass.

Manual review now: run the structural check, inspect each manifest profile against
its source rows, and record accepted/rejected/disputed relationships with evidence.
There is no new runtime page for this packet; current Profile/roadmap functionality
remains the previously implemented local-test feature.

## Expanded local reference release, 2026-11-08

Codex implemented the owner-authorized local rollout for PM-W02 and PM-W04. YakisobaNissin waived formal reviewer sign-off and the full two-model evaluation for this local release. The [mapping record](../../backend/app/content/career-exploration/v1/esco-expansion-mappings.json) identifies 32 new ESCO v1.2.1 relationships across 11 careers. Source locators and partial-coverage rationale accompany the mappings. Newly reused fields are preferred labels and native relationship types. The [ESCO notice](../../licenses/esco.md) records attribution and adaptation.

The [migration](../../supabase/migrations/20261108000100_expand_occupational_catalog.sql) keeps historical 12-profile releases readable and validates the exact 23-career roster and ESCO membership for expanded releases. Reference release IDs are ESCO `8e4deef5-ac7a-5960-b937-8a98e34803a6` and occupational `b6ff93ae-3210-5bbe-8410-a3f6d989962a`. Existing evidence was carried forward. The [recommendation bridge](../../backend/app/modules/recommendations/occupational_runtime.py) interleaves careers within the existing total cap.

The disposable database upgrade and activation passed. Deterministic validation accepted a citation for a new career and rejected a cross-career citation. For the app check, open Backend Developer → Sources and limitations and confirm the related ESCO role and attribution.

Normal local publication activated both reference release IDs above. A signed-in smoke check opened the new career's source view and confirmed the related ESCO role and attribution. The frozen occupational packet checks passed against the original guide roster. The hash-recorded source import and transaction bundle are in the checkout's ignored rollout directory, `tmp/catalog23-rollout/`.
