# Asgard — AI Engineering Instructions

These instructions apply to human contributors and AI agents. Read this file at the start of a task and follow any applicable instructions in the affected subtree.

## Project authority

- The approved PRD defines product requirements.
- Approved engineering documents define architecture, APIs, and data contracts.
- Approved UI specifications and Figma frames define intended presentation.
- Historical drafts, reviews, and generated outputs are not implementation authority.
- A task assignment does not override project-wide architectural restrictions.
- Read [architecture](docs/architecture.md) before implementation. It records the approved foundation and explicitly supersedes the older Next.js and native-only proposals in the development guide. Its open decisions and verification gates still apply.
- Product documents remain drafts except for specifically recorded resolutions. Architecture approval does not approve unresolved product behavior or grant permission to change shared contracts.
- Use each document for the subject it owns. Link to requirements, decisions, and contracts rather than maintaining competing copies. A newer date alone does not establish approval or precedence.

## Before implementation

1. Read the relevant project documentation and assigned task, including architecture and applicable open decisions.
2. Inspect the existing implementation before proposing changes.
3. Identify affected components, contracts, and dependencies.
4. Confirm that the task is within approved scope.
5. If a required decision is missing or contradictory, stop and report it. Do not invent a product or architectural decision.
6. Have the bounded implementation plan reviewed before coding. Unrelated parked decisions do not block independent work with approved boundaries.

## Team coordination

- Before implementation, record the task owner, scope, requirement/acceptance IDs, affected files or modules, dependencies, shared contracts, planned checks, and required reviewer in the task or implementation plan.
- Check for existing edits and overlapping assignments before changing files. Coordinate overlapping work with the contributor and reviewer; preserve edits that are outside the task.
- Once the application Git repository exists, use a separate branch or isolated worktree per contributor or agent. Agents must not commit directly to `main`. Agree on integration order for dependent changes.
- Auth, migrations, shared API contracts, cross-module invariants, infrastructure, and core dependency changes require architecture-owner review. Follow the architecture's requirement to establish code ownership and protected PR review before independent coding agents implement features.
- Product/scope decisions belong to the project owner. Technical approvals belong to the designated architecture reviewer. If the required reviewer is unassigned, report the missing assignment before dependent implementation; do not assume approval authority.

## Change boundaries

- Do not change database schemas, API contracts, authentication, or shared architecture without explicit approval.
- Do not install new dependencies without justification and approval where required.
- Do not modify unrelated files.
- Do not replace existing implementations solely because an alternative seems cleaner.
- Do not change another contributor's work without coordination.

## Implementation standards

- Follow existing conventions and approved design patterns.
- Reuse established components and utilities.
- Keep changes small and focused.
- Preserve existing behavior unless the task explicitly authorizes a change.
- Add or update relevant verification for modified behavior.
- Routine implementation choices within reviewed scope and approved patterns may proceed without a new product or architecture decision. Escalate choices that change those boundaries.

## Documentation and change records

- Update affected documentation in the same change or PR as the behavior, contract, setup, or architecture change. If no documentation update is needed, explain why in the handoff or PR.
- Keep requirements in the product/feature documents, architecture in the architecture document, and decision status in the relevant decision register or ADR. Record approval date, approver, scope, and a review reference when approval is given. Do not infer or backfill approval.
- Replacements of approved foundation choices require an ADR and updates to architecture, the development guide, and this file, as required by the architecture change policy.
- Record significant changes with their date, affected documents/features, and decision or review reference. Use the task/PR record until a project changelog is established; use the changelog's Unreleased section once it exists. Keep proposals distinct from approved changes and do not log every edit.
- A changelog summarizes history; it does not replace owning documents, approval evidence, task assignments, or verification. Generated entries must be checked against the actual change before review.
- For documentation changes, verify local links/anchors, stable IDs, cross-document references, and consistency with recorded decisions. Do not claim application behavior from documentation or static exports.
- Add setup and check commands only after they have been established and verified. Do not invent runnable commands or create empty documentation templates.

## Completion requirements

- Run applicable checks and report their results.
- Distinguish passed, failed, and not-run checks; include reasons for checks that could not run.
- Summarize changed files and their purpose.
- Report unresolved assumptions and integration risks.
- Do not claim completion when acceptance criteria have not been verified.
- Submit changes for human review before merging.
- Include a handoff with the task/acceptance IDs, changed files, verification evidence, documentation updates, remaining blockers, and any integration order or follow-up owner needed. Leave unassigned follow-up ownership explicit.

## Conflict handling

When instructions disagree, do not silently select one. Identify the conflicting sources, preserve existing approved behavior, and request a decision from the responsible owner.

Where an approved document explicitly supersedes older guidance, follow that stated boundary and report the stale reference. Otherwise, pause only the work that depends on the conflict and continue independent authorized work. Record the owner's resolution in the owning document and update affected references before resuming dependent work.

## Document map

Before changing frontend components or layouts, consult the [implemented design system](docs/design.md) and reuse its shared components and tokens.

Start with [README.md](README.md). Use [product requirements and scope](docs/product.md), [user journeys](docs/user-journeys.md), and [pages and interactions](docs/pages-and-interactions.md) for product context. Check [decisions](docs/decisions.md) and [development context](docs/development.md) for blockers; read the relevant [Discovery](docs/specs/discovery.md) or [recommendation](docs/specs/career-recommendations.md) specification for feature work.

Read [architecture](docs/architecture.md) for the approved stack, runtime/data/API boundaries, team guardrails, and A-01 through A-11 follow-up items. The development guide and recommendation spec contain older implementation wording identified by architecture; do not adopt that wording over the approved foundation. Consult [frontend reference instructions](docs/design/ui-reference/AGENTS.md) before using the historical UI snapshot.

Drafts and historical material do not establish implementation approval. Static Figma exports do not verify working behavior. Legacy starter instructions apply to that kit, not automatically to Asgard.
