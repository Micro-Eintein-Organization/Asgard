# PM-F05: Skill comparison

Created: 2026-11-03. Last updated: 2026-11-03.
Approval: proposed feature plan; documentation restructuring authorized, feature implementation not authorized.
Implementation: future additions below are not implemented by this change.
Verification: proposed checks only; no new runtime or dataset acceptance.
References: FUT-01; PM-W04 comparison deliverable; REQ-05 context only.

## Outcome and current behavior

Current recommendations exclude fit/readiness scores. A deterministic skill comparison is new behavior.

Proposed outcome: Compare reviewed occupational relationships with explicit user records. Show unassessed information, reported experience and coverage limitations; expose compatible source/profile versions.

## Data and dependencies

Received-source update, 2026-11-03: [pilot evidence and comparison cases](source-readiness.md#proposed-review-cases-and-acceptance) support reviewing current-skill coverage, career transitions and source-update interpretation. Cases are proposed; no application execution or proficiency methodology acceptance is claimed.

Use reviewed pilot relationships and expected cases. Without compatible reviewed occupational targets, show categorical evidence and no numeric gap.

Depends on PM-F03 and PM-F02 plus reviewed consistent-read contracts. Does not require AI recommendation integration, PDF or a counselor.

Use the [shared dataset plan](datasets.md) for acquisition and evidence readiness and the [roadmap](../../post-mvp-roadmap.md) for package mapping. Existing [product requirements](../../product.md), [architecture](../../architecture.md), [decisions](../../decisions.md) and owning specifications retain authority.

## Acceptance and evaluation

Check exact expected cases, unknown versus zero, missing targets, stale mappings and correction/removal readback. Topic links must preserve focus, branches and progress.

Apply [PM-W12 evaluation](../../post-mvp-roadmap.md#pm-w12-evaluation-and-research-record) from planning onward and retain applicable [verification gates](../../verification.md). Technical tests do not establish participant usefulness or career outcomes.

First-increment criteria owned here (proposed, not passed):

| ID | Required result | Verification |
| --- | --- | --- |
| PM-I1-06 | Comparison matches reviewed cases, including missing profile information and missing targets | Deterministic service fixtures reviewed by humans |
| PM-I1-07 | Removal/correction updates comparison and clears stale account caches | Service and frontend interaction tests |
| PM-I1-11 | No unsupported suitability/readiness claims; source and uncertainty are understandable | Human content/comprehension review |

## Open decisions and next action

Rubric compatibility, wording and treatment of retired or changed mappings require review. A low self-report alone is not proof of an occupational deficit.

Next action: Prepare categorical expected comparisons from the accepted pilot.

Before implementation, record the bounded reviewed plan, affected contracts and applicable checks. When behavior is implemented, create or update its implementation guide under docs/features/ with actual evidence and manual steps.
