# Documentation audit and cleanup plan

26 October 2026. Status: documentation cleanup implemented; verification and handoff recorded below. The project owner approved the plan and selected an eight-character password minimum. Human change review/integration and unrelated feature/release gates remain separate.

## Task and boundaries

The project owner requested a review of all project documentation, removal of personal-machine dependencies, alignment with the latest foundation implementation, and further planning. The documentation contributor for this task owns the audit and proposed edits. The project lead is the required product/architecture reviewer; the repository account mapping belongs in [CODEOWNERS](../.github/CODEOWNERS).

The initial audit inspected `foundation` at `442d15e` with pre-existing AGENTS/development edits. Those edits and the initial plan were subsequently present in local commit `b512d02`; implementation began on `foundation` at that commit with a clean worktree and empty index. The owner-confirmed branch workflow is preserved. Local `main` at `c3ca40d` was inspected read-only for its additional Stage 5 task list. No remote refresh was performed, so this record describes available local source rather than the current server state.

Scope is documentation correction and navigation, plus recording the owner's password-policy resolution. Runtime behavior, dependencies, migrations, API contracts, credentials, Auth settings, reference source, design assets and Git history remain outside the cleanup. The document map below identifies edited guides and preserved references. No services were started or stopped.

Plan review: approved by the project owner on 26 October 2026. Review reference: the reply to this plan, “implement and 8 is the new required.” This authorizes the bounded documentation edits and resolves AUD-08; it does not resolve AUD-09, grant technical acceptance of shared contracts or authorize Git publication. [PASSWORD-01](decisions.md#password-minimum-resolution) records the policy in the decision register; Security owns the full requirement.

Dependencies are the approved [architecture](architecture.md), recorded [decisions](decisions.md), existing implementation and [Stage 4 contracts/handoff](development.md#stage-4-shared-contracts-and-handoff). Requirement coverage is NFR-09 and documentation support for QA-11, A-06/A-07/A-11, with related feature IDs retained in their owning documents. Feature acceptance is not part of this documentation task.

| Task acceptance ID | Required result |
| --- | --- |
| DOC-01 | All tracked project prose uses checkout-relative references or clearly explained local defaults; no personal filesystem links or external personal archive is needed to follow it. |
| DOC-02 | Current instructions use contributor/reviewer/operator roles and canonical ownership references. Actual approval attribution, CODEOWNERS entries and third-party license notices retain their meaning. |
| DOC-03 | Foundation implementation status matches source. Implemented scaffolding, recorded execution evidence, pending human review and unfinished feature/release acceptance are distinguishable. |
| DOC-04 | Local links/anchors and existing requirement, acceptance and decision IDs remain valid. Historical findings remain identifiable as historical. |
| DOC-05 | The handoff identifies changes, checks, unresolved decisions and follow-up ownership without inventing approvals, results, assignments or commands. |

## Audit results

The initial audit covered all 18 project Markdown files then present, the reference provenance manifest, and the additional Stage 5 document available only on local `main`. The plan itself is the nineteenth tracked Markdown file. The audit checked personal-path patterns across README, AGENTS, `docs/` text and `.github/`. Static Figma images were checked as link targets, not visually re-reviewed. Historical source files were checked against their manifest rather than modified. The following results retain the initial audit's scope/counts; final cleanup checks are recorded in the handoff below.

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

The finding descriptions below preserve the pre-cleanup audit. Current status is in the disposition column and owning documents; they must not be read as remaining defects where marked corrected.

| ID | Finding and evidence | Cleanup disposition |
| --- | --- | --- |
| AUD-01 | [Architecture decision status](architecture.md#13-decision-status-and-open-work) said local SQL/Auth execution awaited approval and tooling/contracts needed creation despite later source/records. | Corrected: A-01/A-05/A-06/A-10/A-11 distinguish existing source/local evidence from hosted pooler, technical review, authored content and acceptance gates. Activation approval remains environment-specific. |
| AUD-02 | Architecture's general branch rule and the Stage 3.5 handoff lacked current-workflow pointers. | Corrected: both link the owner-approved foundation workflow; old branches are historical and Git-operation restrictions remain. |
| AUD-03 | Decisions, F-001/F-002 and Security omitted existing foundation/pinning/contract/storage work. | Corrected: current migrations/schemas/contracts are linked, generic envelopes are distinguished from authored content, and validators/storage from services/enforcement. Draft status and technical review remain explicit. |
| AUD-04 | Product/Journeys retained unresolved-control/inventory/graph wording; Pages contained an unqualified mobile-specific topic-panel instruction. | Corrected: selected five-round controls, seven-role inventory, milestone-list presentation and desktop scope are reflected. Comprehension, content/design review and runtime acceptance remain pending. |
| AUD-05 | Development mixed current workflow with earlier source/evidence snapshots and a stale archive-location reference. | Corrected: current status/CI coverage lead the guide, historical reviews/counts are labeled, stale activation proposals point to README, and the reference README/manifest resolve inside the checkout. Prior workflow edits and dated evidence are preserved. |
| AUD-06 | Stage 3.5 manual checks assumed an already activated stack; README duplicated setup and contained an incorrect directional reference. | Corrected: review uses each contributor's approved environment/defaults, duplicate provisioning blocks are consolidated, and existing commands/prerequisites remain. No setup command was added or executed; fresh-host/Linux evidence remains pending. |
| AUD-07 | The historical audit/reference README retained superseded proposals as potentially current guidance. | Corrected: supersession notes link current architecture/specs/design/handoffs; historical observations and all five reference source files are preserved. |
| AUD-08 | Security originally required 15 characters while Supabase configs, frontend validation/tests and registration feedback used 8. | Resolved by the owner's explicit eight-character requirement, recorded in PASSWORD-01 and Security and linked from current guides. Runtime/config already match; no Auth change or hosted-acceptance claim was made. |
| AUD-09 | The main-only Stage 5 assignment requests conditional Discovery branching/inactive-answer clearing, conflicting with F-001. | Open and recorded in Decisions. Project owner must resolve the assignment before dependent work/integration. The main document and selected F-001 behavior are preserved. |
| AUD-10 | BRIEF is absent from the checkout; earlier conversation approvals lack supplied durable external review references. | Open provenance follow-up recorded in Decisions and linked from affected specs. Project lead owns supplying/confirming sources. IDs and recorded approval scope are retained; no source or approval was fabricated. |
| AUD-11 | Required CI coverage exceeded the workflow; config/test comments contained historical scope labels. | Documentation corrected: actual source/unit/contract/build workflow and missing migration/browser/hosted evidence are separate. Development describes the existing opt-in live-test guards accurately. Runtime-file comment cleanup remains a separately owned follow-up; workflow/config/tests are unchanged by this task. |

### Current foundation facts to carry into the docs

- The approved application remains React/Vite/TypeScript plus FastAPI/Python and Supabase. Runtime pins are Node 24.19.0, npm 11.17.0, Python 3.13.17 in Docker and local Supabase CLI 2.122.0. Existing manifests, Dockerfiles and locks remain the pin authorities.
- Root `.env`, local signing keys and restricted-role credentials belong to each developer's environment. The helper provides startup/connectivity operations; it does not provision either secret. Loopback URLs describe each developer's own host. Default ports, project IDs and container DNS names come from committed configuration and must be identified as defaults rather than removed as personal references.
- Canonical protected screens and email/password/Profile source are implemented. `/status` is a connectivity page. Career, Discovery, recommendation and progress pages still use labeled fixtures/local presentation; standalone `/preview/...` routes are removed. Manual Stage 3.5 acceptance is pending.
- Versioned SQL defines Auth/Profile and shared catalog, Discovery, progress, preferences, recommendation and budget storage. The Stage 4 handoff records a passed local rollback-only integrity/RLS probe. This audit did not rerun that probe or independently certify runtime grants or live sessions.
- Generated OpenAPI/TypeScript contracts and recommendation structure/catalog/evidence validators exist. The 29 shared feature operations remain authenticated stubs. Published curricula/questionnaire content, feature services, live AI/PDF processing, quota enforcement and persisted learning workflows remain unfinished.
- Hosted Auth/provider compatibility, session-pooler access, external mail, abuse controls, retention/deletion, backups, model quality, hosting, protected review and the remaining browser/accessibility checks keep their existing evidence gates.

## Document-by-document edit map

| Document | Reviewed action, implemented except where explicitly deferred |
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

1. Project-lead plan review is recorded above. The same owner reply resolves AUD-08 to eight characters; AUD-09 and runtime/Git-operation approvals remain separate.
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
| Review documentation changes | Documentation contributor implemented; project lead reviews final diff | Plan approval is recorded; change review before integration remains required. |
| Verify password enforcement | Project owner resolved policy; hosted/security verification owner unassigned | Local static configuration/validator agreement checked; hosted receiving-service acceptance remains separate. |
| Resolve Stage 5 Discovery conflict | Project owner and technical reviewer; assignment-document editor unassigned | Before conditional-branching work or integration of that assignment. Preserve F-001 behavior meanwhile. |
| Supply BRIEF/review provenance | Project lead | Before asserting those references are available or approvals have a durable review link. Missing provenance does not erase recorded decisions. |
| Native Linux/clean-host and Stage 3.5 manual review | Linux verification owner unassigned; project lead owns the existing UI review handoff | Existing environment-specific prerequisites apply; no fabricated rerun results. |
| Shared contract review/common-base publication | Project lead and eligible human reviewer; current mapping in CODEOWNERS | Before independent feature-agent implementation. Publication/Git operations require separate explicit approval. |
| Security/operations/hosted delivery work | Implementation owners still need assignment under the existing development/security gates | Before affected external/real-user use; no schedule or capacity invented here. |

After the shared-foundation/team gate, retain the existing feature boundaries: Catalog authors/publishes reviewed identities/content, Discovery owns accepted answer context, Progress owns focus/history/calculations, and Recommendations consumes their contracts. Dashboard composes summaries. Coordinate shared registration and regenerated contracts through the required reviewer. This is the existing dependency model, not a new team assignment or permission to begin unresolved work.

The main-only task document and `.gitignore` overlap remain for a separately authorized integration. Documentation cleanup must not merge branches or discard either side's work to make those issues disappear.

## Implementation handoff

26 October 2026. The documentation contributor implemented the owner-approved plan on `foundation`. Changed 17 Markdown files: AGENTS.md, README.md, this audit/plan, architecture, decisions, development, design, product, pages-and-interactions, user-journeys, security-and-operations, verification, both feature specifications, the Stage 3.5 handoff, and the reference README/audit. The edit map above records their scope. The reference AGENTS, third-party license, provenance manifest, five reference source files and Figma assets are preserved.

| Acceptance/check | Result and evidence |
| --- | --- |
| DOC-01 portability | Passed: no personal drive/home paths, file/editor URIs, checkout-owner username or sync-folder references in the scanned project prose/reference text. Setup uses each contributor's checkout and environment; local ports/project IDs remain documented defaults. |
| DOC-02 role-based instructions | Passed: active reviewer guidance points to CODEOWNERS; existing code-owner mapping, approval attribution and third-party license are preserved. |
| DOC-03 foundation alignment | Passed for static documentation scope: runtime pins match manifests/images; source has two SQL migrations and 33 OpenAPI operations including 29 foundation stubs. Docs distinguish source/storage/validators from services, hosted controls and feature acceptance. |
| Password resolution | Passed for static agreement: Security requires 8; active/pending Supabase configs, frontend validator, existing test expectation and registration feedback use 8. No Auth code/config was changed or executed. Hosted enforcement remains pending. |
| DOC-04 links and stable references | Passed: 257 local inline links/anchors across all 19 tracked Markdown files resolve. No pre-existing heading anchor was removed; requirement/acceptance frontmatter is unchanged. BRIEF's missing provenance remains explicitly recorded rather than supplied or silently dropped. |
| Preserved reference material | Passed: all five source-file SHA-256 values match the manifest; reference AGENTS, license and manifest have no Git content diff. The first raw-byte manifest comparison detected checkout CRLF versus Git LF; a focused normalized-content/Git-diff check confirmed no edit. No file correction was needed. |
| Setup syntax and whitespace | Passed: all five PowerShell code blocks parse without execution; Markdown diff whitespace check passes. Existing setup commands were consolidated, not run or expanded. |
| DOC-05 handoff and remaining ownership | Passed: changed scope, approval reference, checks, open decisions and follow-up roles are recorded here and in their owning guides. Required final change reviewer remains the project lead; no merge readiness is inferred. |
| Application/runtime/browser/hosted checks | Not run for this documentation-only task. Prior evidence retains its date/environment/scope; Stage 3.5 manual navigation and other release gates remain pending. External website links/provider claims were not refreshed. |

Concurrent frontend logout refactoring appeared during the cleanup in `frontend/src/app/logout.tsx`, `shell.tsx`, `logout-boundary.tsx` and `logout-context.ts`. Those edits were inspected read-only for overlap and preserved; they are not part of this documentation implementation or its verification claims. The separate local commit `7d48de2` subsequently included that refactor; it was not created by this documentation task. The final 17-file documentation diff remains uncommitted above that commit. Its application's implementation/review evidence belongs to the separate change; no reviewer assignment or acceptance is inferred here.

No commit, push, branch switch, merge, service operation, dependency installation, schema/client regeneration or secret/configuration change was performed by this documentation task. AUD-08 is resolved by PASSWORD-01. AUD-09's Stage 5 branching conflict and AUD-10's BRIEF/earlier-review provenance remain open; AUD-11's runtime-file comment cleanup is deferred to its owners. None requires inventing a policy or weakening the existing foundation gates to complete this bounded cleanup. Human review of the final documentation diff is the next integration step.
