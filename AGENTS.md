# Asgard — AI Engineering Instructions

These instructions apply to human contributors and AI agents. Read this file at the start of a task and follow any applicable instructions in the affected subtree.

## Project authority

- The approved PRD defines product requirements.
- Approved engineering documents define architecture, APIs, and data contracts.
- Approved UI specifications and Figma frames define intended presentation.
- Historical drafts, reviews, and generated outputs are not implementation authority.
- A task assignment does not override project-wide architectural restrictions.
- Read [architecture](docs/architecture.md) before implementation. It records the approved foundation; historical Next.js and native-only proposals are superseded. Its open decisions and verification gates still apply.
- Product documents remain drafts except for specifically recorded resolutions. Architecture approval does not approve unresolved product behavior or grant permission to change shared contracts.
- Use each document for the subject it owns. Link to requirements, decisions, and contracts rather than maintaining competing copies. A newer date alone does not establish approval or precedence.

## Before implementation

1. Read the assigned task and only the relevant project documentation, specifications, contracts, and affected source; include architecture and applicable open decisions.
2. Inspect the existing implementation before proposing changes.
3. Identify affected components, contracts, dependencies, and the smallest suitable verification for the risk.
4. Confirm that the task is within approved scope.
5. If a required decision is missing or contradictory, stop and report it. Do not invent a product or architectural decision.
6. Record and have the bounded implementation plan reviewed before coding. Unrelated parked decisions do not block independent work with approved boundaries.

## Team coordination

- Before implementation, record the task owner, scope, requirement/acceptance IDs, affected files or modules, dependencies, shared contracts, planned checks, and required reviewer in the task or implementation plan.
- Check for existing edits and overlapping assignments before changing files. Coordinate overlapping work with the contributor and reviewer; preserve edits that are outside the task.
- For the project owner's Stages 1–4 foundation work, use the existing `foundation` development branch until its pull request is accepted. `main` is the stable integration branch and receives foundation work only through a reviewed PR with base `main`, compare `foundation`. Do not create `codex/...` or other task branches automatically for this work. This owner-approved workflow (26 October 2026) supersedes the earlier per-agent branch rule for the owner's foundation work; it does not change the approved application architecture.
- Check the active branch before editing. If it is not `foundation` for the owner's foundation work, explain the discrepancy and wait for direction; never silently switch branches. Teammates may use their own feature branches from the agreed reviewed baseline. Coordinate overlapping work and integration order.
- Do not merge, rebase, cherry-pick, reset, force-push, delete branches, rewrite history, create commits or push without explicit owner approval for the specific operation. Approval to edit files is not approval to commit or publish. Never redirect foundation development into `main` or change this workflow without explicit owner approval. See the [foundation Git workflow](docs/development.md#foundation-git-workflow).
- Auth, migrations, shared API contracts, cross-module invariants, infrastructure, and core dependency changes require architecture-owner review. Follow the architecture's requirement to establish code ownership and protected PR review before independent coding agents implement features.
- Product/scope decisions belong to the project owner. Technical approvals belong to the designated architecture reviewer. If the required reviewer is unassigned, report the missing assignment before dependent implementation; do not assume approval authority.
- The project lead confirmed the reviewer assignment on 26 October 2026; use [.github/CODEOWNERS](.github/CODEOWNERS) for the current repository account mapping. This assignment does not establish completed review, remote enforcement or permission to self-approve a PR. Check the current review/publication gates in [Development](docs/development.md#stage-4-parallel-readiness-and-publication).

## Portable local development and shared foundation

- Use [README getting started](README.md#getting-started) for the supported workflow and prerequisite boundaries. Resolve paths from the actual checkout root; never depend on a contributor's username, absolute home path, drive letter, sync folder, editor, global packages, or access to an external historical archive.
- Read runtime/dependency pins from `.node-version`, package manifests/locks and Dockerfiles. Use root `npm ci` for the locked Supabase CLI and Docker for application dependencies. Host Python or a global Supabase CLI is not required by this workflow. Do not upgrade versions or regenerate locks merely to match the current machine.
- Each developer uses local resources and their own approved credentials. Loopback URLs refer to that developer's computer; project IDs refer to that Docker daemon's resources. Multiple checkouts/worktrees with the same project ID are not isolated; coordinate before starting or stopping shared local services.
- Fresh-clone setup is not fully automated: the active Supabase config needs ignored local signing keys, and authenticated operation needs separately provisioned restricted-role credentials and environment approval. Do not copy another developer's `.env`/private keys, assume prior activation approval applies elsewhere, replace the runtime role with an administrator, or report connectivity as authenticated acceptance.
- Read the [Stage 4 shared contracts/handoff](docs/development.md#stage-4-shared-contracts-and-handoff) before feature implementation. Versioned SQL is schema authority; generated OpenAPI/TypeScript is wire-contract authority. The scaffold's `501` responses and labeled sample fixtures are intentional until feature owners implement the corresponding behavior.
- Keep feature logic in its owning module. Coordinate shared route registration, migrations and regenerated clients; preserve cross-feature ownership, context revisions and concurrency guards. Follow the recorded review gates before independent feature-agent implementation.

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
- Follow the standard workflow: implement within agreed scope, run the smallest appropriate automated verification, fix directly related failures, provide guided manual verification for user-facing functionality, and report evidence and outstanding risks.
- Add or update relevant verification for modified behavior. Preserve valuable regression tests and required CI/release checks; do not add elaborate test harnesses without a demonstrated need.
- Use risk-based verification defaults:
  - UI or navigation: TypeScript checks and guided manual browser verification.
  - Forms or interactions: relevant unit tests and guided manual verification.
  - Backend APIs: targeted pytest tests and schema validation.
  - Database or migrations: migration validation and focused database integrity checks.
  - Authentication or authorization: mandatory applicable security checks, including ownership isolation and session validation.
  - AI features: structured-output validation and representative manually reviewed results.
  - Shared API contracts: OpenAPI generation, TypeScript client synchronization, and representative contract tests.
  - Cross-feature changes: relevant integration tests.
  - Major merges or releases: complete required regression and security verification.
- Manual verification does not replace essential authorization, security, or data-integrity checks. For interactive user-facing changes, give the exact local URL or navigation path, steps, expected outcomes, and how to report a failure. Prefer guided manual checks to complex browser automation for straightforward interactions.
- Reuse existing tests, scripts, fixtures, and infrastructure. Do not repeat passing checks when relevant code has not changed, rebuild Docker images or restart services without need, or create elaborate harnesses without a demonstrated need. Retest focused changes and distinguish application failures from environment or test-harness failures. Efficiency never justifies reduced security or correctness.
- When a check fails, identify whether the cause is application behavior, configuration, or verification infrastructure. If understood, make one focused correction and retry only the affected check. If the same blocker persists, stop and report it rather than entering repeated debugging loops. Request approval before expanding scope or adding infrastructure. Never bypass a mandatory check silently or report an unrun check as passed.
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
- For interactive functionality, report manual checks as completed or pending. Give guided steps when user verification remains.
- Concisely summarize files/components changed, functionality implemented, verification evidence, remaining blockers and risks, and readiness for review or integration.
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

Read [architecture](docs/architecture.md) for the approved stack, runtime/data/API boundaries, team guardrails, and A-01 through A-11 follow-up items. [Development](docs/development.md#current-foundation-status-and-evidence) separates current source from dated execution records. The [password minimum resolution](docs/decisions.md#password-minimum-resolution) records the owner's eight-character requirement. Consult [frontend reference instructions](docs/design/ui-reference/AGENTS.md) before using the historical UI snapshot.

Drafts and historical material do not establish implementation approval. Static Figma exports do not verify working behavior. Legacy starter instructions apply to that kit, not automatically to Asgard.
