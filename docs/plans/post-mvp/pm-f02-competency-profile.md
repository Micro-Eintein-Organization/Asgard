# PM-F02: Competency profile

Created: 2026-11-03. Last updated: 2026-11-03.
Approval: proposed feature plan; documentation restructuring authorized, feature implementation not authorized.
Implementation: future additions below are not implemented by this change.
Verification: proposed checks only; no new runtime or dataset acceptance.
References: FUT-01, FUT-13; PM-W03, PM-W10; REQ-11.

## Outcome and current behavior

Profile stores names and preferences; document processing is disabled. No normalized editable competency profile is accepted.

Proposed outcome: Add manual selection of reviewed skills, confirmation, nullable self-report, correction and removal. PDF extraction later produces candidates for confirmation under a separately approved lifecycle.

## Data and dependencies

Received-source update, 2026-11-03: [source preparation](source-readiness.md) now includes Philippine framework level/task examples and O*NET fixtures. Review their native definitions before selecting self-report inputs; no 0-4 conversion or adequacy method is accepted.

Use accepted skill identities and aliases from the pilot. Keep confirmation, self-report, evidence and provenance distinct; a confirmed record need not have a level.

Depends on PM-F03 pilot evidence and reviewed ownership/revision/retention contracts. PDF additionally needs privacy/provider activation and replacement/removal decisions.

Use the [shared dataset plan](datasets.md) for acquisition and evidence readiness and the [roadmap](../../post-mvp-roadmap.md) for package mapping. Existing [product requirements](../../product.md), [architecture](../../architecture.md), [decisions](../../decisions.md) and owning specifications retain authority.

## Acceptance and evaluation

Test account isolation, revoked sessions, invalid values, unknown versus explicit zero if approved, duplicate/stale writes and account-switch cache clearing.

Apply [PM-W12 evaluation](../../post-mvp-roadmap.md#pm-w12-evaluation-and-research-record) from planning onward and retain applicable [verification gates](../../verification.md). Technical tests do not establish participant usefulness or career outcomes.

First-increment criteria owned here (proposed, not passed):

| ID | Required result | Verification |
| --- | --- | --- |
| PM-I1-03 | Anonymous and other accounts cannot read or mutate user competency records | API/session and actual restricted-role isolation tests |
| PM-I1-04 | Unknown and 0 remain distinct; invalid levels fail; confirmed presence does not assert mastery | Schema and persistence cases |
| PM-I1-05 | Duplicate/stale writes cannot overwrite newer state | Concurrency, revision and retry tests |
| PM-I1-10 | Save, refresh, revisit, empty/error states and account switch work | Browser/manual acceptance and relevant UI tests |

## Open decisions and next action

The 0-4 rubric, retention/history, UI entry point and PDF confirmation/removal semantics remain proposed. Current 18+ eligibility continues.

Next action: Review the pilot skill vocabulary before proposing the manual editor and its contracts.

Before implementation, record the bounded reviewed plan, affected contracts and applicable checks. When behavior is implemented, create or update its implementation guide under docs/features/ with actual evidence and manual steps.
