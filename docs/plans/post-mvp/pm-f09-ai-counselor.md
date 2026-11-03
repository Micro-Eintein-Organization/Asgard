# PM-F09: AI counselor

Created: 2026-11-03. Last updated: 2026-11-03.
Approval: proposed feature plan; documentation restructuring authorized, feature implementation not authorized.
Implementation: future additions below are not implemented by this change.
Verification: proposed checks only; no new runtime or dataset acceptance.
References: FUT-04; PM-W08.

## Outcome and current behavior

The current provider adapter performs bounded recommendation calls; no counselor/tool loop exists.

Proposed outcome: Begin with read-only authorized tools over available services. Consider confirmed writes separately with action/revision binding, replay protection and idempotency.

## Data and dependencies

Use published domain records and validated references. Retrieved or uploaded text is untrusted data; unavailable evidence must be disclosed.

Requires its own architecture/tool-boundary review and available services. It can use existing reads without waiting for every future feature; competency tools wait for those services.

Use the [shared dataset plan](datasets.md) for acquisition and evidence readiness and the [roadmap](../../post-mvp-roadmap.md) for package mapping. Existing [product requirements](../../product.md), [architecture](../../architecture.md), [decisions](../../decisions.md) and owning specifications retain authority.

## Acceptance and evaluation

Evaluate prompt injection, cross-account tool access, unsupported claims, removal, outages, budgets, cancellation, latency and usefulness against a non-agent baseline. Test stale/replayed confirmations before writes.

Apply [PM-W12 evaluation](../../post-mvp-roadmap.md#pm-w12-evaluation-and-research-record) from planning onward and retain applicable [verification gates](../../verification.md). Technical tests do not establish participant usefulness or career outcomes.

## Open decisions and next action

Tool inventory, retention, consent, interaction budgets and recovery require decisions. Frameworks/vector storage are optional dependencies requiring justification.

Next action: Prepare the bounded read-only tool proposal and evaluation cases; keep counselor ADR requirements here rather than blocking the manual pilot.

Before implementation, record the bounded reviewed plan, affected contracts and applicable checks. When behavior is implemented, create or update its implementation guide under docs/features/ with actual evidence and manual steps.
