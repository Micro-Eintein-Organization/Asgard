# PM-F01: Discovery and assessment

Created: 2026-11-03. Last updated: 2026-11-03.
Approval: proposed feature plan; documentation restructuring authorized, feature implementation not authorized.
Implementation: future additions below are not implemented by this change.
Verification: proposed checks only; no new runtime or dataset acceptance.
References: FUT-05; PM-W05, PM-W09; F-001 / REQ-04.

## Outcome and current behavior

Saved conditional Discovery, inactive-answer retention and blank retakes already exist.

Proposed outcome: Version reviewed wording and branches while preserving old-session meanings. Treat an official interest instrument as a separate increment with faithful questions, scoring, attribution and occupation mappings.

## Data and dependencies

Authored questions and comprehension cases support informal Discovery. Official assessment needs instrument access, reference scoring cases and reviewed mappings; occupational taxonomy alone does not provide these.

Informal content review can proceed independently of the competency pilot. Official assessment waits for its own source/access and mapping review.

Use the [shared dataset plan](datasets.md) for acquisition and evidence readiness and the [roadmap](../../post-mvp-roadmap.md) for package mapping. Existing [product requirements](../../product.md), [architecture](../../architecture.md), [decisions](../../decisions.md) and owning specifications retain authority.

## Acceptance and evaluation

Exercise blank entry, Back/edit, resume, inactive-answer exclusion and old versions. For an official instrument, verify reference scores, persistence and outage fallback.

Apply [PM-W12 evaluation](../../post-mvp-roadmap.md#pm-w12-evaluation-and-research-record) from planning onward and retain applicable [verification gates](../../verification.md). Technical tests do not establish participant usefulness or career outcomes.

## Open decisions and next action

Question content, instrument choice, target population and study protocol remain open.

Next action: Prepare a bounded questionnaire-content proposal; keep official instrument acquisition separately gated.

Before implementation, record the bounded reviewed plan, affected contracts and applicable checks. When behavior is implemented, create or update its implementation guide under docs/features/ with actual evidence and manual steps.

Owning specification: [F-001 Discovery](../../specs/discovery.md).
