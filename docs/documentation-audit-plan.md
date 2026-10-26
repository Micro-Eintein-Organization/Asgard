# Documentation audit and cleanup plan

26 October 2026. Status: audit complete; cleanup plan awaiting project-lead review. This record does not approve product, architecture, security or feature changes.

## Task and boundaries

The project owner requested a review of all project documentation, removal of personal-machine dependencies, alignment with the latest foundation implementation, and further planning. The documentation contributor for this task owns the audit and proposed edits. The project lead is the required product/architecture reviewer; the repository account mapping belongs in [CODEOWNERS](../.github/CODEOWNERS).

The inspected checkout is `foundation` at `442d15e`. Pre-existing edits in [AGENTS.md](../AGENTS.md) and [Development](development.md) establish the owner-confirmed foundation branch workflow and are preserved. The index is empty. Local `main` at `c3ca40d` was inspected read-only for its additional Stage 5 task list. No remote refresh was performed, so this record describes available local source rather than the current server state.

Scope is documentation correction and navigation. Existing application behavior, dependencies, migrations, API contracts, credentials, Auth settings, reference source, design assets and Git history remain outside the cleanup. The new plan is the only file added by this audit; existing documents have not yet been rewritten. No services were started or stopped.

Dependencies are the approved [architecture](architecture.md), recorded [decisions](decisions.md), existing implementation and [Stage 4 contracts/handoff](development.md#stage-4-shared-contracts-and-handoff). Requirement coverage is NFR-09 and documentation support for QA-11, A-06/A-07/A-11, with related feature IDs retained in their owning documents. Feature acceptance is not part of this documentation task.

| Task acceptance ID | Required result |
| --- | --- |
| DOC-01 | All tracked project prose uses checkout-relative references or clearly explained local defaults; no personal filesystem links or external personal archive is needed to follow it. |
| DOC-02 | Current instructions use contributor/reviewer/operator roles and canonical ownership references. Actual approval attribution, CODEOWNERS entries and third-party license notices retain their meaning. |
| DOC-03 | Foundation implementation status matches source. Implemented scaffolding, recorded execution evidence, pending human review and unfinished feature/release acceptance are distinguishable. |
| DOC-04 | Local links/anchors and existing requirement, acceptance and decision IDs remain valid. Historical findings remain identifiable as historical. |
| DOC-05 | The handoff identifies changes, checks, unresolved decisions and follow-up ownership without inventing approvals, results, assignments or commands. |

## Audit results

The audit covered all 18 tracked Markdown files on `foundation`, the reference provenance manifest, and the additional Stage 5 document available only on local `main`. It checked personal-path patterns across README, AGENTS, `docs/` text and `.github/`. Static Figma images were checked as link targets, not visually re-reviewed. Historical source files were checked against their manifest rather than modified.

| Check | Observed result |
| --- | --- |
| Personal filesystem references | Passed: no drive-qualified paths, file/editor URIs, personal home-directory paths or the checkout owner's username/sync-folder references found in the scanned text. No current PC link needs deletion. |
| Relative Markdown links/anchors | Passed: all 159 inline local links/anchors in the 18 foundation documents resolve. This does not check external websites. |
| Reference provenance | Passed: all five copied frontend files match the SHA-256 values in [source-manifest.csv](design/ui-reference/source-manifest.csv). |
| API inventory | Confirmed statically: committed OpenAPI contains 33 operations, including 29 tagged foundation-contract operations. The route implementation deliberately raises `501 not_implemented` for those feature operations. |
| Existing edits | Inspected and preserved: only AGENTS.md and development.md were modified before this audit; nothing was staged. |
| Runtime/security/browser acceptance | Not run: audit and planning only. Prior results retain their original environment, date and scope. |
| Hosted CI, repository protection and remote freshness | Not checked; no claim that the local workflow file has passed remotely or that review enforcement is configured. |

### Findings requiring correction or an explicit decision

| ID | Finding and evidence | Proposed treatment |
| --- | --- | --- |
| AUD-01 | [Architecture decision status](architecture.md#13-decision-status-and-open-work) still says local SQL/Auth execution awaits approval and tooling/contracts need creation. Later decision/handoff records and source contain activated local foundations, exact pins, two migrations and generated contracts. | Update implementation progress for A-01/A-05/A-06/A-10/A-11 using existing records. Keep hosted pooler, human technical review, authored content and final acceptance gates open. Local activation approval remains environment-specific. |
| AUD-02 | Architecture section 11's general branch rule does not point to the later owner-approved `foundation` exception. The Stage 3.5 handoff names its old branch without a current-workflow pointer. | Link to the existing foundation workflow and label old branches as historical. Preserve the owner-approved workflow and all Git-operation approval restrictions. |
| AUD-03 | [Decisions](decisions.md) still lists foundation creation, patch pinning and contract encoding broadly as future work. F-001/F-002 and security prose likewise omit the Stage 4 storage/schema work. | Link to actual migrations, schema modules and the generated contract. Separate generic answer envelopes from unauthored questionnaire content, validators from live generation, and quota storage from quota enforcement. Preserve draft status and pending technical review. |
| AUD-04 | [Product's demo boundaries](product.md#build-now-boundaries) says question controls/branching still need decisions. [Journeys](user-journeys.md) also refers to eventual controls, unresolved launch inventory and graph design, despite selected F-001 controls, seven launch roles and milestone-list presentation. | Replace obsolete planning statements with references to the selected policies. Keep comprehension, authored curricula, design approval and runtime evidence pending. A mobile-specific topic-panel instruction in Pages must be qualified against the recorded desktop-only scope. |
| AUD-05 | Development mixes current setup/handoff with earlier pre-activation statements, superseded branch records, stale worktree counts and task-relative phrases. Its final archive-location reference points to information no longer present in root README. | Put current facts first; clearly label historical evidence and link to the in-repository reference README/manifest. Retain dated test results and earlier boundaries without presenting them as current actions or rerun results. Preserve the existing workflow edits. |
| AUD-06 | [Stage 3.5 manual checks](stage-3.5-handoff.md#manual-navigation-checklist-pending) assume the earlier task's already activated local stack. README repeats provisioning steps and refers to setup described below when it is above. | Make the checklist usable in each contributor's own approved environment and link to README prerequisites. Consolidate duplicated setup explanations without adding unverified commands or broadening activation approval. Keep clean-host and native Linux evidence pending. |
| AUD-07 | The historical reference audit still proposes Next.js, unresolved results actions and an unimplemented extraction sequence. The reference README repeats old unresolved questionnaire/results claims. | Add current-status/supersession notes linking to architecture, F-001/F-002, design and Stage 3.5. Preserve original findings and the five checksum-verified source files; do not rewrite history as current approval. |
| AUD-08 | Security requires a 15-character password minimum, while [active Supabase config](../supabase/config.toml), the pending config, [frontend validation](../frontend/src/auth/password.ts), its tests and registration error copy use 8. Development's historical candidate description says 15. | Record the discrepancy explicitly in Decisions and Security with links to implementation. Preserve the selected policy until the responsible owner resolves it; do not silently lower the requirement or edit Auth behavior as documentation cleanup. Security acceptance remains open. |
| AUD-09 | The Stage 5 document exists only at `main:docs/Asgard-Stage-5-Team-Task-List.md`. Assignment A requests conditional branching, clearing inactive answers and changed stopping rules, conflicting with the selected five independent rounds/no conditional branching in F-001 and the Stage 4 handoff. | Flag the conflicting assignment for project-owner resolution before dependent Discovery work or integration. Preserve the task document on main; do not import it, switch branches or change approved Discovery behavior during this cleanup. |
| AUD-10 | Product, Journeys and feature-spec metadata refer to `BRIEF`, but no tracked canonical document with that ID exists in this checkout. Many approvals cite a prior chat/task without a durable repository review reference. | Record missing provenance explicitly. Ask the project lead to supply the source/review reference or confirm its archival status. Retain stable IDs and recorded approvals; do not fabricate links or infer broader approval. |
| AUD-11 | Architecture lists CI migration/browser verification as required, while [checks.yml](../.github/workflows/checks.yml) currently performs helper/source/unit/contract/build checks. The live Auth test header also describes an isolated-only boundary while its fixture includes a separately gated foundation-project option. Active config still starts with a review-candidate comment. | Describe current CI coverage and the missing evidence separately. Flag stale configuration/test comments for an optional comment-only follow-up reviewed by their owners; no workflow, test gate or config change belongs to the Markdown cleanup. |

### Current foundation facts to carry into the docs

- The approved application remains React/Vite/TypeScript plus FastAPI/Python and Supabase. Runtime pins are Node 24.19.0, npm 11.17.0, Python 3.13.17 in Docker and local Supabase CLI 2.122.0. Existing manifests, Dockerfiles and locks remain the pin authorities.
- Root `.env`, local signing keys and restricted-role credentials belong to each developer's environment. The helper provides startup/connectivity operations; it does not provision either secret. Loopback URLs describe each developer's own host. Default ports, project IDs and container DNS names come from committed configuration and must be identified as defaults rather than removed as personal references.
- Canonical protected screens and email/password/Profile source are implemented. `/status` is a connectivity page. Career, Discovery, recommendation and progress pages still use labeled fixtures/local presentation; standalone `/preview/...` routes are removed. Manual Stage 3.5 acceptance is pending.
- Versioned SQL defines Auth/Profile and shared catalog, Discovery, progress, preferences, recommendation and budget storage. The Stage 4 handoff records a passed local rollback-only integrity/RLS probe. This audit did not rerun that probe or independently certify runtime grants or live sessions.
- Generated OpenAPI/TypeScript contracts and recommendation structure/catalog/evidence validators exist. The 29 shared feature operations remain authenticated stubs. Published curricula/questionnaire content, feature services, live AI/PDF processing, quota enforcement and persisted learning workflows remain unfinished.
- Hosted Auth/provider compatibility, session-pooler access, external mail, abuse controls, retention/deletion, backups, model quality, hosting, protected review and the remaining browser/accessibility checks keep their existing evidence gates.

## Document-by-document edit map

| Document | Bounded action after plan review |
| --- | --- |
| [README](../README.md) | Simplify setup sequencing and status pointers; keep per-environment provisioning, local defaults and fresh-host limitations explicit. |
| [Root AGENTS](../AGENTS.md) | Preserve current workflow edits; use the ownership mapping for ongoing reviewer references; replace obsolete warnings about proposals no longer present with precise historical/current pointers. |
| [Architecture](architecture.md) | Refresh implementation status/A-items and link the later branch-workflow exception; leave approved stack, policies and evidence gates intact. |
| [Development](development.md) | Preserve existing changes; distinguish current workflow/contracts from dated execution records, repair archive prose and clarify actual CI coverage. Keep useful existing anchors. |
| [Decisions](decisions.md) | Reconcile progress with the local foundation; record unresolved password, assignment and provenance findings without inventing resolutions. |
| [Design](design.md) | Keep implemented presentation authoritative for source reuse. Qualify Stage 3.5's statement about not introducing Stage 4 contracts as that historical task's scope; link the later shared foundation. |
| [Product](product.md) | Remove obsolete unresolved-control wording and link implementation status separately from draft requirements, scope and acceptance. |
| [Pages and interactions](pages-and-interactions.md) | Clarify intended versus implemented/prototype states and desktop-scope references. Retain logical screen IDs and frame-gap meaning. |
| [User journeys](user-journeys.md) | Update stale controls/inventory/graph caveats; retain journeys as intended behavior rather than evidence of working services. |
| [Discovery spec](specs/discovery.md) | Link the existing generic saved-answer/session contract and identity registry while keeping content authoring, service semantics and comprehension evidence open. |
| [Recommendation spec](specs/career-recommendations.md) | Point to existing validators, persisted run structures and generated API scaffolding; retain provider/prompt/evaluation/PDF lifecycle work as pending. |
| [Security and operations](security-and-operations.md) | Separate selected security policy from current local implementation; record password divergence and distinguish existing budget storage from unenforced quotas. |
| [Verification](verification.md) | Add concise pointers to bounded foundation evidence and current CI coverage; leave final QA-01 through QA-12 acceptance requirements unchanged. |
| [Stage 3.5 handoff](stage-3.5-handoff.md) | Mark original branch/task context as historical; make pending manual checks portable through README prerequisites. Preserve recorded checks and outcomes. |
| [Reference README](design/ui-reference/README.md) | Link current decisions/design/contracts instead of presenting old unresolved choices as current; retain portable archive-name provenance. |
| [Reference audit](design/ui-reference/audit.md) | Add a clear superseded-planning note and current-document pointers; preserve historical observations. |
| [Reference AGENTS](design/ui-reference/AGENTS.md) | No substantive change expected; retain the snapshot boundary and verify links. |
| [UI primitive license](../frontend/src/components/ui/LICENSE.md) | No change; attribution and license terms must remain intact. |

The local-main Stage 5 task list needs a separate reviewed correction/integration after AUD-09 is resolved. Its existence is recorded here without creating a broken checkout-relative link. Config/example/test comment findings in AUD-11 likewise remain a separate bounded follow-up rather than expanding this task into Auth or infrastructure work.

## Execution and verification plan

1. Have the project lead review this bounded scope and the existing overlapping AGENTS/development edits. Record the review date, reviewer and reference when supplied. Plan review does not resolve AUD-08/AUD-09 or authorize runtime/Git mutations.
2. Correct the README, AGENTS, Architecture and Development status/navigation first. Use CODEOWNERS for active account mapping and role names for general instructions. Keep dated evidence and approval attribution identifiable.
3. Reconcile Decisions, Product, Journeys, Pages and feature specs with those current facts. Link canonical requirements/contracts rather than copying new DTOs or maintaining another schema inventory. Add unresolved findings to the relevant owning documents without changing selected behavior.
4. Update historical handoff/reference context with supersession notes and portable manual-check prerequisites. Do not change the reference snapshot, manifest hashes, images or third-party license.
5. Recheck tracked documentation and related prose for personal paths, broken relative links/anchors, missing ID references, stale active instructions, unintended approval claims and commands not supported by source. Verify any moved headings' incoming links. Preserve existing stable IDs.
6. Compare each implementation claim with its source and each test claim with its dated evidence. Check runtime pins against manifests/locks/Dockerfiles; recount foundation operations from OpenAPI only if its description changes. Recheck the five manifest hashes and preservation of the starting edits. Run `git diff --check` on the final diff.
7. Deliver a focused document/file handoff with DOC-01 through DOC-05 results and unresolved owner decisions. Required reviewer remains the project lead. No commit, push, branch switch or integration is included.

No application test suite, browser automation, image rebuild, dependency installation, database operation, credential provisioning or environment activation is needed for these prose edits. External provider claims are not being refreshed by this local audit; any later change to such claims must verify its primary source. Fresh-host, native Linux, live Auth and manual UI checks require their existing environments/approvals and remain separately pending.

## Follow-up ownership and integration order

| Follow-up | Responsible role / current assignment | Dependency |
| --- | --- | --- |
| Review/apply documentation plan | Documentation contributor; project lead reviews | Plan review before cleanup implementation. |
| Resolve password-policy divergence | Project owner for policy; designated architecture/security reviewer for implementation; implementation owner unassigned | Required before claiming password-policy/security acceptance. Independent factual documentation work may continue. |
| Resolve Stage 5 Discovery conflict | Project owner and technical reviewer; assignment-document editor unassigned | Before conditional-branching work or integration of that assignment. Preserve F-001 behavior meanwhile. |
| Supply BRIEF/review provenance | Project lead | Before asserting those references are available or approvals have a durable review link. Missing provenance does not erase recorded decisions. |
| Native Linux/clean-host and Stage 3.5 manual review | Linux verification owner unassigned; project lead owns the existing UI review handoff | Existing environment-specific prerequisites apply; no fabricated rerun results. |
| Shared contract review/common-base publication | Project lead and eligible human reviewer; current mapping in CODEOWNERS | Before independent feature-agent implementation. Publication/Git operations require separate explicit approval. |
| Security/operations/hosted delivery work | Implementation owners still need assignment under the existing development/security gates | Before affected external/real-user use; no schedule or capacity invented here. |

After the shared-foundation/team gate, retain the existing feature boundaries: Catalog authors/publishes reviewed identities/content, Discovery owns accepted answer context, Progress owns focus/history/calculations, and Recommendations consumes their contracts. Dashboard composes summaries. Coordinate shared registration and regenerated contracts through the required reviewer. This is the existing dependency model, not a new team assignment or permission to begin unresolved work.

The main-only task document and `.gitignore` overlap remain for a separately authorized integration. Documentation cleanup must not merge branches or discard either side's work to make those issues disappear.
