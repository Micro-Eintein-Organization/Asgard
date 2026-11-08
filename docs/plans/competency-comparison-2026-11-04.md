# Skill profiles and comparison: session record and implementation plan

Author: Codex. Created: 2026-11-04. Updated: 2026-11-04.
Status: owner authorized proceeding; source implemented; isolated runtime evidence recorded.
Implementation owner: Codex. Technical reviewer: @YakisobaNissin per
[CODEOWNERS](../../.github/CODEOWNERS). Content reviewer: unassigned; the owner
explicitly deferred that assignment. No completed technical/content review is inferred.

## Session history and decisions

This record summarizes the conversation that began with the owner's request to
read AGENTS.md and identify remaining MVP and post-MVP work. It is a decision
summary, not a verbatim transcript or a new source of architecture authority.

1. Repository/source review found the connected local learning journey implemented,
   alongside unfinished account controls, release operations and acceptance gates.
   Later guides record 12 careers and 288 topics; earlier three-path descriptions
   are historical. No new runtime tests were performed during that assessment.
2. The owner chose to defer hosting and additional account controls and prioritize
   feature implementation. This changes the immediate sequence, not the final-MVP
   requirements or permission for external use. Password recovery, Google/linking,
   MFA, deletion and hosted operations are not silently declared complete.
3. The owner preferred testing later. Broad acceptance work is deferred; mandatory
   focused authorization, integrity and contract checks in AGENTS.md still apply.
4. The owner selected manual skill profiles and career-skill comparison as the
   first increment, covering all 12 current careers and unknown or levels 0–4.
5. ESCO was investigated using the official [download guidance](https://esco.ec.europa.eu/en/use-esco/download)
   and [package structure](https://esco.ec.europa.eu/en/structure-esco-downloadable-datasets).
   The recommendation was Classification v1.2.1, English, CSV; the separate
   semantic-model download was optional. Screenshots showed download selectors.
6. The owner reported website download errors and asked to skip ESCO. The failure
   was not independently reproduced. No ESCO archive was downloaded or imported.
   The owner accepted using Asgard-authored content with external integration deferred.
7. The owner chose current records only, without a rating-history feature, and
   Settings/Profile plus roadmap entry points. Content review assignment was
   explicitly deferred with “anyone, dont think about it for now”.
8. The owner required preservation of the existing UI/design and asked to document
   the conversation. A bounded plan was presented, followed by explicit requests
   to implement it end to end using the Anti Slop plugin.
9. The plan retains architecture-owner review before dependent migration/API coding.
   Implementation requests do not establish that review occurred. Anti Slop mode
   selection is also unresolved; no saved mode was found in the Windows settings
   location inspected. No new UI has been designed or changed in this preparation.

## Implementation authorization and follow-up

On 2026-11-04, after presentation of the pre-coding migration/API review prerequisite,
the owner replied "during, and i approve" and explicitly selected Anti Slop during.
This authorizes proceeding with the proposed implementation; it does not establish
completed independent code review or content approval. Source, checks and limits
are in the implementation guide. Docker was unavailable at that checkpoint. The later Docker resumption verified
isolated migration/publication, actual-role security and Chrome acceptance; normal
activation and real content publication remain pending. This resolves the preparation
blockers in item 9 above without rewriting that historical conversation. Content
reviewer assignment remains deferred.

## Normal activation authorization, 2026-11-04

After the owner reported the setup migration stop, a dry run identified only the
new competency migration. The owner explicitly approved applying it to the normal
local database and enabling local testing with "yea implement all so i can test".
The migration and 120 mappings were installed with unchanged pre-existing private
state. This supersedes the earlier prohibition on retained local migration for
this specific operation only. Independent content/code review and external release
gates remain. The implementation guide records startup/smoke evidence.

## Bounded implementation

Requirements and behavior belong to the [feature specification](../specs/competency-comparison.md).
Acceptance uses PM-I1-01–12 from the [first-increment proposal](../post-mvp-first-implementation.md),
with the source, coverage and history adjustments recorded in this session.
The [implementation guide](../features/competency-comparison.md) records actual status.

Sequence after required technical review:

1. Finalize canonical skill identities and reviewed source/topic mappings for all
   12 careers. Prepare draft data independently; publish only with assigned review.
2. Implement the competencies module, additive migration, restricted grants/RLS,
   account revision guard and authenticated operations described in the specification.
3. Generate OpenAPI/TypeScript, then connect the Profile Skills card and roadmap
   comparison dialog through account-scoped queries and existing save/error patterns.
4. Run focused authorization, integrity, concurrency, contract and UI checks;
   supply guided local verification and report broader checks as deferred.

Affected modules: new competencies domain and reference content; shared route
registration; additive SQL/content publication; generated clients; core API hooks;
Profile skill editing/dirty guards; roadmap comparison action/dialog. Reuse current
Auth/session transactions, components and tokens. No new dependency is planned.

## Review and publication boundaries

The checkout was clean on `codex/cabusao-ui-integration` at preparation start.
No branch switch, commit, push, merge, deployment or retained-database migration
application is authorized by this record. No application behavior is claimed from
documentation or the draft data. No full MVP acceptance prerequisite is imposed
on this increment, superseding the older proposal's delivery sequence only.

Independent technical code review remains assigned to @YakisobaNissin and pending.
Mapping review remains unassigned and blocks content publication/acceptance.
Use isolated approved resources for migration checks; preserve retained data.
Existing audience eligibility, recommendations, focus, progress, PDF gating and
account controls retain their current behavior.

## Preparation evidence

Documentation and draft-data validation results are recorded in the implementation
guide. The initial preparation had no application implementation. The later implementation
guide supersedes that status and separates passed source checks from pending
runtime/security acceptance.
Broad regression, browser/accessibility matrices, research, model evaluation,
independent-host acceptance and hosting remain deferred, not passed.
