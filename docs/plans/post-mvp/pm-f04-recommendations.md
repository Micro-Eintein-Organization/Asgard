# PM-F04: Recommendations

Created: 2026-11-03. Last updated: 2026-11-03.
Approval: proposed feature plan; documentation restructuring authorized, feature implementation not authorized.
Implementation: future additions below are not implemented by this change.
Verification: proposed checks only; no new runtime or dataset acceptance.
References: PM-W04 recommendation integration, PM-W09; F-002 / REQ-05.

## Outcome and current behavior

Saved Groq generations use validated published candidates, evidence snapshots, quotas and explicit refresh controls.

Proposed outcome: Integrate approved competency or assessment evidence later; retrieve a bounded candidate set and clearly label the basis of suggestions. Keep manual comparison delivery independent.

## Data and dependencies

Use accepted occupation relationships and explicit eligible user evidence. A larger taxonomy needs retrieval evaluation; adding every occupation to the prompt is insufficient.

Depends on reviewed evidence contracts and PM-F03. Competency enrichment also depends on PM-F02. Official assessment requires the separate PM-F01 assessment increment.

Use the [shared dataset plan](datasets.md) for acquisition and evidence readiness and the [roadmap](../../post-mvp-roadmap.md) for package mapping. Existing [product requirements](../../product.md), [architecture](../../architecture.md), [decisions](../../decisions.md) and owning specifications retain authority.

## Acceptance and evaluation

Check retrieved-candidate coverage, supported explanations, stale corrections/removal, idempotency, quota/failure behavior and compatibility with F-002 quality evaluation.

Apply [PM-W12 evaluation](../../post-mvp-roadmap.md#pm-w12-evaluation-and-research-record) from planning onward and retain applicable [verification gates](../../verification.md). Technical tests do not establish participant usefulness or career outcomes.

## Open decisions and next action

Retrieval method, eligible evidence, invalidation policy and revised quality fixtures require approval. No automatic recommendation changes are authorized by saving a skill.

Next action: Design retrieval/evidence evaluation fixtures after pilot inspection; preserve the current recommendation context meanwhile.

Before implementation, record the bounded reviewed plan, affected contracts and applicable checks. When behavior is implemented, create or update its implementation guide under docs/features/ with actual evidence and manual steps.

Owning specification: [F-002 recommendations](../../specs/career-recommendations.md).
