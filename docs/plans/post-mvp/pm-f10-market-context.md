# PM-F10: Philippine market context

Created: 2026-11-03. Last updated: 2026-11-03.
Approval: proposed feature plan; documentation restructuring authorized, feature implementation not authorized.
Implementation: future additions below are not implemented by this change.
Verification: proposed checks only; no new runtime or dataset acceptance.
References: FUT-08; PM-W11.

## Outcome and current behavior

No reviewed national market observation pipeline is accepted. Catalog resources are not labor-market evidence.

Proposed outcome: Present dated descriptive observations with source, geography, counts, deduplication and coverage limits. Begin with a reviewed batch before automation.

## Data and dependencies

Needs separately permitted Philippine sources and occupation mappings. ESCO/O*NET occupational references do not establish Philippine demand, salary or nationwide coverage.

Source-access research can proceed independently. Publication needs source permission, mapping/data review and a refresh/maintenance owner.

Use the [shared dataset plan](datasets.md) for acquisition and evidence readiness and the [roadmap](../../post-mvp-roadmap.md) for package mapping. Existing [product requirements](../../product.md), [architecture](../../architecture.md), [decisions](../../decisions.md) and owning specifications retain authority.

## Acceptance and evaluation

Check provenance, extraction samples, duplicates, stale/missing evidence and rejection of unsupported demand/salary generalizations.

Apply [PM-W12 evaluation](../../post-mvp-roadmap.md#pm-w12-evaluation-and-research-record) from planning onward and retain applicable [verification gates](../../verification.md). Technical tests do not establish participant usefulness or career outcomes.

## Open decisions and next action

Source selection, collection scope, refresh cadence, operator and permissible claims remain unresolved.

Next action: Identify permitted candidate sources and a bounded collection proposal; do not begin scraping through this documentation task.

Before implementation, record the bounded reviewed plan, affected contracts and applicable checks. When behavior is implemented, create or update its implementation guide under docs/features/ with actual evidence and manual steps.
