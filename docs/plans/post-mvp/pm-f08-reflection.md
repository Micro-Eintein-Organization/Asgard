# PM-F08: Reflection and reassessment

Created: 2026-11-03. Last updated: 2026-11-03.
Approval: proposed feature plan; documentation restructuring authorized, feature implementation not authorized.
Implementation: future additions below are not implemented by this change.
Verification: proposed checks only; no new runtime or dataset acceptance.
References: FUT-03; PM-W07 reflection deliverable; REQ-09 context.

## Outcome and current behavior

Reversible topic states and activity summaries exist; they do not demonstrate ability.

Proposed outcome: Add optional reflections after an activity and explicit reassessment. Keep user feedback separate from topic completion and recommendation generation.

## Data and dependencies

Use reviewed prompts and interpretation cases. Occupational data is needed only when reflection explicitly references skill identities or career evidence.

Prompt/content preparation can proceed independently. Persistence needs ownership/retention review; downstream recommendation use requires PM-F04 approval.

Use the [shared dataset plan](datasets.md) for acquisition and evidence readiness and the [roadmap](../../post-mvp-roadmap.md) for package mapping. Existing [product requirements](../../product.md), [architecture](../../architecture.md), [decisions](../../decisions.md) and owning specifications retain authority.

## Acceptance and evaluation

Verify optional participation, correction/removal, isolation, progress preservation and absence of automatic proficiency or preference inference.

Apply [PM-W12 evaluation](../../post-mvp-roadmap.md#pm-w12-evaluation-and-research-record) from planning onward and retain applicable [verification gates](../../verification.md). Technical tests do not establish participant usefulness or career outcomes.

## Open decisions and next action

Questions, timing, storage/retention, interpretation and any downstream use remain unresolved.

Next action: Draft a bounded reflection proposal with explicit evidence-use limits.

Before implementation, record the bounded reviewed plan, affected contracts and applicable checks. When behavior is implemented, create or update its implementation guide under docs/features/ with actual evidence and manual steps.
