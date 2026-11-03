# PM-F03: Occupational knowledge

Created: 2026-11-03. Last updated: 2026-11-03.
Approval: proposed feature plan; documentation restructuring authorized, feature implementation not authorized.
Implementation: future additions below are not implemented by this change.
Verification: proposed checks only; no new runtime or dataset acceptance.
References: FUT-01, FUT-07; PM-W01, PM-W02; REQ-02 / REQ-07.

## Outcome and current behavior

Twelve published career paths have authored text skill labels and content provenance. These are not a reviewed occupational competency graph.

Proposed outcome: Add stable competency identities, versioned occupational relationships, aliases and reviewed mappings alongside existing career IDs. Publish capabilities independently rather than assuming every occupation supports every feature.

## Data and dependencies

Received-source update, 2026-11-03: the [source preparation record](source-readiness.md) includes a 20-file manifest, structural checks and a 12-career candidate matrix. Next review the provisional mappings and complete pilot semantics. Philippine sources and O*NET can proceed without the unavailable ESCO download; no crosswalk is accepted yet.

Inspect and review official source files through the shared dataset plan. Preserve source IDs separately from internal IDs and retain unresolved or one-to-many mappings.

Source inspection precedes dependent contract finalization. Database publication follows architecture/data review and reproducible additive ingestion design.

Use the [shared dataset plan](datasets.md) for acquisition and evidence readiness and the [roadmap](../../post-mvp-roadmap.md) for package mapping. Existing [product requirements](../../product.md), [architecture](../../architecture.md), [decisions](../../decisions.md) and owning specifications retain authority.

## Acceptance and evaluation

Check identity/reference integrity, duplicate/conflict rejection, repeat import, source versions, missing mappings and preservation of existing career/topic/progress IDs.

Apply [PM-W12 evaluation](../../post-mvp-roadmap.md#pm-w12-evaluation-and-research-record) from planning onward and retain applicable [verification gates](../../verification.md). Technical tests do not establish participant usefulness or career outcomes.

First-increment criteria owned here (proposed, not passed):

| ID | Required result | Verification |
| --- | --- | --- |
| PM-I1-01 | Stable reviewed identifiers; repeat import does not duplicate or rewrite published meaning | Import/reference tests and data review |
| PM-I1-02 | Existing careers and roadmaps work without mappings; existing content IDs/progress survive | Focused content upgrade/preservation check |
| PM-I1-09 | Generated API/client agree; existing MVP contracts remain compatible | Existing drift/type checks and affected regression checks |

## Open decisions and next action

Source selection, coverage, mapping policy, release lifecycle and behavior for occupations without roadmaps require review. Existing roadmap eligibility remains until explicitly revised.

Next action: Assess coverage of all 12 careers and prepare the two-career evidence pilot.

Before implementation, record the bounded reviewed plan, affected contracts and applicable checks. When behavior is implemented, create or update its implementation guide under docs/features/ with actual evidence and manual steps.
