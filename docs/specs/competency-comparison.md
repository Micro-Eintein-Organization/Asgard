# Manual skill profiles and career comparison

## Unified evidence decision, 2026-11-19

The project owner selected one evidence count, automatic resume interpretation
and supported equivalence, then approved implementation with “implement.” This
extends the two-view policy below. Job-sample skills uses published posting skills;
Roadmap skills additionally recognizes applicable linked Done topics, excluding
retired or unselected alternatives. Each skill counts once across positive reports,
exact/alias resume matches, validated interpreted wording and eligible learning.
Source labels stay distinct, and no source assigns a proficiency level.

Legacy match/report fields remain; additive `evidence_count`, per-skill learning
and interpretation signals, and interpretation-state fields drive the clearer UI.
Career numbers are removed; UI sorting uses evidence count and stable alphabetical
ties. Automatic supported-equivalence interpretation replaces the earlier ban on
unreviewed semantic mapping only within this owner-approved, source-cited feature.
Broad, related or uncertain claims remain excluded; authored identities are unchanged.
Saved derived interpretations are private, versioned, invalidated with their source
and separate from manual ratings. Failed interpretation leaves exact matching and
successful extraction available. POST triggers analysis; ordinary GET reads do not.
Technical reviewer @YakisobaNissin; human review/live validation pending. See the
[implementation guide](../features/competency-comparison.md) for bounds and evidence.

Documentation baseline: 2026-11-17. Current [decisions](../decisions.md#current-resolutions) supersede earlier delivery sequencing and fixed catalog counts. Profile skill editing, confirmed resume review, and career-to-career comparison are implemented; roadmap experience comparison is disabled. Occupational reference entries require authored roadmaps and reviewed publication before becoming recommendation candidates. Hosted activation and unrun quality/privacy acceptance remain separate. Dated increment details below retain their original scope.


## Benchmark and learning-path comparison decision, 2026-11-19

Owner/technical reviewer: YakisobaNissin. Review reference: the 2026-11-19 chat
selection of “Show both separately,” “Two tabs,” and “I will review,” followed by
approval of the bounded implementation plan. The Career skill matches page has
separate Benchmark sample and Learning-path skills tabs; Benchmark sample opens
first. This extends the historical V2 proposal rather than treating that plan as
standalone implementation authority. Posting/alias content approval is separate.

Benchmark rankings/counts use only distinct canonical skills mapped in one
explicitly configured published source/version. Every published career is shown;
careers without mappings display 0 of 0. Learning-path counts retain published
career-linked coverage. Neither comparison asserts employer requirements or
proficiency. Posting frequency does not weight ranking. Both preserve positive
report OR exact resume skill-evidence precedence, saved unknown/zero distinctions,
and deterministic count/title/ID ordering. Work experience is not a proficiency
signal. Missing benchmark configuration/publication shows an explained unavailable
state with the learning-path tab still available; there is no implicit substitution.

The existing endpoint gains optional `basis=benchmark|learning_path`, defaulting
to learning_path for old callers. Generated OpenAPI remains contract authority.
No public version picker or new database schema is included. The owner reviews
posting provenance and exact aliases before publication. Unmapped/ambiguous terms
remain excluded; no inferred semantic mapping is authorized. See the
[implementation and evidence](../features/competency-comparison.md#benchmark-and-learning-path-views-2026-11-19).

### Benchmark reference granularity resolution, 2026-11-19

YakisobaNissin selected “Add separate technology skills for the benchmark;
preserve the existing 230 learning-path skills” in the implementation chat.
Approval scope: prepare a separate benchmark reference vocabulary in the existing
competencies table, using stable new identities and the posting labels themselves
instead of equating broad technologies with narrower curriculum tasks. Keep the
existing learning-path records/links unchanged. This requires content/importer
preparation, not a new database table or migration. Publication remains a separate
reviewable operator action; source-verification status must not be fabricated.

## Planned W03 resume-assisted Profile review, 2026-11-06

The owner selected an optional resume-assisted path within Profile. Manual skill
selection and skip remain available. A selectable-text PDF may produce skill
suggestions with source passages; the learner reviews each suggestion and
provides their own experience report before it enters the profile. This is a
local feature guarded by a default-off flag. Asgard reads the PDF with its
isolated backend parser and keeps the file and extracted text in memory only.
Ending or replacing the review discards its suggestions. Only skill reports
explicitly saved by the learner persist. OCR and other formats remain deferred
under FUT-09. See the [W03 roadmap](../post-mvp-roadmap.md#pm-w03-user-confirmed-competency-profile).

## Learner journey extension, 2026-11-05

The owner selected [career-first experience and two-career comparison](career-exploration-comparison.md). That specification owns the new learner flow, shortlist and private notes; this document continues to own self-report identities, levels and privacy behavior. “Compare my skills” is relabeled “Review your experience”; raw occupational details move to a secondary page.


Author: Codex. Created: 2026-11-04. Updated: 2026-11-05.
Status: owner-authorized implementation proposal; source implemented; independent review pending.
Authority: [session decisions](../plans/competency-comparison-2026-11-04.md),
[architecture](../architecture.md), [security](../security-and-operations.md).
Technical reviewer: @YakisobaNissin. Content reviewer: unassigned.

## Selected behavior

Use published, reviewed career mappings; the original increment covered twelve careers. These describe learning-path coverage, not validated employer requirements.
Published catalog labels and draft curriculum source are not evidence of independent
competency review. The ESCO reference and occupational-evidence extensions are implemented separately; their provenance/reuse review remains required.

Users choose canonical skills, save self-reports, edit them and remove records.
No free-text skill creation, rating history, numerical gap score, readiness percentage, or automatic learning updates are included in the manual-profile slice. Resume/PDF review is a separately gated implemented extension and requires confirmation for saved skills.

| Saved value | Meaning |
| --- | --- |
| null | Experience unknown or not rated |
| 0 | No experience, explicitly self-reported |
| 1 | Familiar with concepts |
| 2 | Basic tasks with guidance |
| 3 | Ordinary tasks independently |
| 4 | Advanced tasks/troubleshooting |

An absent record is unassessed, distinct from a saved record with an unknown
rating. Skill presence does not assert mastery. Comparisons show the source,
user-record presence, reported level and available topic links independently.
No occupational target level is established. Missing mappings disclose limited
coverage. Opening a comparison/topic never changes focus, branches or progress.
Skills do not affect AI recommendations in this increment.

## Proposed persistence and API for technical review

Use a new competencies domain with existing authenticated restricted-role
transactions. Reference records retain stable UUIDs, canonical keys, labels and
aliases, source/version and review status. Career and topic associations reference
existing IDs. Explicit mappings resolve equivalent labels; no inferred semantic merge.
Draft data must not become published content automatically.

Private state has one account revision plus current competency records containing
owner, competency ID, a server-selected label snapshot, nullable strict integer level
0–4 and update time. The snapshot permits read/removal after reference retirement. Keep the
revision after removing records to prevent stale requests matching a recreated
record. Derive ownership from the session. No submitted user IDs or history store.
Use additive SQL, least-privilege grants and owner RLS; preserve existing tables.

All routes below use `/api/v1`, current errors/pagination and generated clients:

| Method/path | Responsibility |
| --- | --- |
| GET `/competencies` | Search published reference skills with q, optional career_id, limit and offset |
| GET `/me/competencies` | Current own records and account version; version 0 before first write |
| PATCH `/me/competencies/{competency_id}` | Create/update with expected_version and nullable level |
| POST `/me/competencies/{competency_id}/remove` | Remove with expected_version |
| GET `/me/careers/{career_id}/competency-comparison` | Consistent read of career mappings and own records, including account/content versions |

Successful mutations atomically advance the account version and return current
state. A stale or replayed mutation returns 409 with explicit reload/reconciliation;
the client must not blindly retry. Reject invalid levels/extra fields and unsupported
reference IDs. Removal deletes the rating, retaining only the account revision.
Comparison is computed, not a persistent snapshot. Invalidate account-scoped skill
and comparison queries after writes and clear state on account changes.

## Presentation constraints

Reuse the implemented [design system](../design.md). Add one Skills card below
Career background in Profile and one outline Compare my skills action in the
roadmap action area opening the existing Dialog component. Keep existing card
order otherwise, sidebar, roadmap columns/topic panel, typography and tokens.
Scope styles to new components. No global redesign or new visual assets.

Saves are independent of names/preferences and report actual persistence.
Dirty/pending edits participate in navigation/logout protection. Include loading,
empty, error, conflict and unavailable-mapping states. Dialogs have an accessible
name, keyboard operation, bounded scrolling and focus restoration.

## Acceptance and limits

PM-I1-01–12 apply with current-only records, Asgard source labels and all-12-career
coverage. Required checks include actual restricted-role isolation/session denial,
unknown versus zero, stale writes/removal/recreation, reference integrity,
publication repeat/conflict preservation, generated contracts, save/readback and
account switches. Human mapping/technical review remains required.

Broader acceptance is deferred per the session record. Hosting, additional account
controls, changed eligibility, counselor, PDF, photos, recommendation integration
and historical ratings are separate work. This specification records a proposal
for technical contracts, not approval to apply migrations to a retained environment or publish content.
