# PM-F07: Personal learning guidance

Created: 2026-11-03. Last updated: 2026-11-03.
Approval: proposed feature plan; documentation restructuring authorized, feature implementation not authorized.
Implementation: future additions below are not implemented by this change.
Verification: proposed checks only; no new runtime or dataset acceptance.
References: FUT-06, FUT-07; PM-W07 learning deliverable; REQ-07 / REQ-09.

## Outcome and current behavior

Authored order, branch choices, next-topic behavior and account-wide single-Learning guard exist.

Proposed outcome: Offer personal learning suggestions linked to supported development needs. Keep them separate from canonical curricula; never auto-complete topics from skill records.

## Data and dependencies

Require reviewed competency-to-topic associations and disclose missing coverage. Existing resources need independent content review; HTTP availability is not pedagogical approval.

Depends on PM-F05 for development-aware suggestions, reviewed topic mappings and current progress invariants.

Use the [shared dataset plan](datasets.md) for acquisition and evidence readiness and the [roadmap](../../post-mvp-roadmap.md) for package mapping. Existing [product requirements](../../product.md), [architecture](../../architecture.md), [decisions](../../decisions.md) and owning specifications retain authority.

## Acceptance and evaluation

Verify progress preservation across content changes, focus/branch guards, unsupported links and that Done never changes proficiency.

Apply [PM-W12 evaluation](../../post-mvp-roadmap.md#pm-w12-evaluation-and-research-record) from planning onward and retain applicable [verification gates](../../verification.md). Technical tests do not establish participant usefulness or career outcomes.

First-increment criteria owned here (proposed, not passed):

| ID | Required result | Verification |
| --- | --- | --- |
| PM-I1-08 | Topic links resolve and never change progress automatically | Integration and guided manual journey |

## Open decisions and next action

Mapping review criteria, suggestion lifecycle and refresh rules require approval; prerequisites remain advisory.

Next action: Review pilot skill-to-topic coverage and its limitations before proposing personalized suggestions.

Before implementation, record the bounded reviewed plan, affected contracts and applicable checks. When behavior is implemented, create or update its implementation guide under docs/features/ with actual evidence and manual steps.
