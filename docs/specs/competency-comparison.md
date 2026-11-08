# Manual skill profiles and career comparison

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

Support the 12 current published careers using versioned Asgard-authored skill
mappings. These describe learning-path coverage, not validated employer requirements.
Published catalog labels and draft curriculum source are not evidence of independent
competency review. ESCO import and occupational crosswalks are deferred.

Users choose canonical skills, save self-reports, edit them and remove records.
No free-text skill creation, PDF extraction, rating history, numerical gap score,
readiness percentage or automatic learning updates are included.

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
