# Post-MVP first-increment integration plan

Current scope, 2026-11-02: use the [local MVP resolution](decisions.md#local-evaluation-mvp-resolution-2026-11-02) and [consolidated implementation/evidence](development.md#current-local-mvp-status-2026-11-02). Earlier inventories and proposed work below retain their dates; existing implemented core and the 12-path release must not be treated as new implementation assignments. Pending review, future proposals and hosted gates remain separate.

Created: 2026-10-30. Last updated: 2026-11-03.
Status: proposed; planning authorized, implementation not authorized.


## Feature ownership and readiness

All-career preparation update, 2026-11-03: the user authorized a [curated research release](../data/post-mvp/releases/curated-v0.1/README.md) covering all 12 current careers, with a [methodology paper](research/dataset-methodology.md). This expands data preparation beyond the initial pilot, not implementation/student-study acceptance. Review [remaining source and methodology findings](research/dataset-review.md) before dependent contract finalization.

Source preparation update, 2026-11-03: the [received-source plan](plans/post-mvp/source-readiness.md) records hashes, structural inspection, candidate coverage and a provisional pilot from supplied Philippine sources and O*NET. ESCO remains unavailable as reported by the user. The next gate is review of the evidence and comparison interpretation; no source selection or shared-contract acceptance is inferred from these fixtures.

Approved planning sequence: [reviewed dataset pilot](plans/post-mvp/datasets.md) -> [occupational knowledge](plans/post-mvp/pm-f03-occupational-knowledge.md) -> [manual competency records](plans/post-mvp/pm-f02-competency-profile.md) -> [deterministic comparison](plans/post-mvp/pm-f05-skill-comparison.md) -> [reviewed topic links](plans/post-mvp/pm-f07-learning-guidance.md). Feature plans own their acceptance definitions; this document owns the combined journey and PM-I1-12 handoff criterion. All feature acceptance remains pending.

Inspect actual data before finalizing dependent contracts. Counselor architecture belongs to PM-W08; recommendation integration is a later PM-W04 deliverable. Neither blocks the manual pilot. Contract proposals below are conceptual responsibilities, not approved interfaces. Current AI recommendations retain their current eligible context.

## Decision summary

The [post-MVP roadmap](post-mvp-roadmap.md) is technically feasible as staged
extensions of the React/FastAPI/Supabase application. The first implementation
should establish reviewed occupational competencies, account-owned self-assessment
and a working comparison journey. No new agent framework is necessary for this
increment. Use the November 2 local MVP scope and current source evidence as the baseline. Before shared changes, review the affected contracts and plan focused preservation checks; unrelated hosted and provider gates do not block this increment.

This document records the recorded request for a comprehensive review and a first
implementation plan. It is a documentation deliverable, not an architecture
approval, schema specification or instruction to begin coding. It supplements
the roadmap and [future-development register](future-development.md).

## Latest proposed direction

The resolution specifies the intended post-MVP audience as all ages and skill levels,
and inputs as either manual information or a resume PDF. Record this as product
direction; it changes the current 18+ eligibility boundary. Operational decisions
for younger users, account eligibility, consent, research participation and provider
processing remain unresolved. Do not silently change existing eligibility during
foundation work. Local synthetic testing can proceed after technical approval;
broader user rollout depends on the resolved policy in the owning documents.

The pasted plan proposes self-report levels 0-4: no experience, familiar with
concepts, basic tasks with guidance, ordinary tasks independently, and advanced
tasks/troubleshooting. Unknown is separate. The rubric remains proposed; it has not been accepted or validated.

The intended comparison identifies relevant occupational skills, reported
experience, unassessed areas and supported development opportunities. It does not
produce a universal fit percentage. Manual and PDF input are both in the broader
direction; the proposed first coding increment implements manual input first.
That sequencing needs scope review and does not remove PDF from the roadmap.

## Comprehensive feasibility assessment

| Area | Finding | Required treatment |
| --- | --- | --- |
| Existing application | Authenticated services, restricted-role transactions, generated client, content publication and progress can be reused | Extend existing boundaries; avoid a second backend |
| Discovery | Saved conditional questionnaire exists; proposed 8-10 questions are new authored content | Version content and preserve existing sessions; separate from first increment |
| Competency profiling | Existing Profile primarily manages names; career skills are text labels | Add normalized identities and account-owned records; preserve current fields |
| Occupational evidence | Catalog has provenance/publication metadata, but no complete reviewed competency graph | Import a bounded reviewed subset with versioned mappings |
| Skill comparisons | Set membership and categorical presentation are straightforward | Data validity and unknown-state handling are the main dependencies |
| Proficiency targets | No approved compatible targets established | Defer numerical gaps; a self-report scale alone cannot supply role targets |
| Recommendations | Evidence snapshots and validation exist | New evidence types require contract review; scale candidate retrieval before broad imports |
| Career comparison | Existing reads can support basic side-by-side comparison | Saved alternatives and competency enrichment are separate additions |
| Roadmaps/progress | Existing IDs, publication and concurrency rules are reusable | New skill links must not rewrite content, unlock prerequisites or auto-complete topics |
| PDF | Private extraction/lifecycle source exists; processing is deferred | Confirmation-first records, removal semantics and privacy activation need decisions |
| Counselor | Bounded tools over existing services are feasible | New orchestration and authorization tests; keep writes as a later bounded step |
| LangChain/LangGraph | Optional integration tools, not prerequisites | Adopt only after measured need and architecture/dependency approval |
| Official assessment | O*NET provides integration options | Preserve official administration/scoring and reviewed occupational mappings |
| Philippine market data | A bounded dated observation pipeline is feasible | Source access, review, refresh ownership and coverage determine feasibility |
| Research | Technical and user-usefulness evaluation is feasible | Design cases and protocol before coding; no career-success claims from technical tests |
| Hosting/team delivery | Existing preparation is reusable, but new workloads are unmeasured | No cost, calendar or production-capacity guarantee; confirm actual assignments |

External integration checks and official references are retained in the roadmap.
In particular, Groq's documented tool-use/Structured Outputs incompatibility means
the future counselor may need separate tool and finalization stages. Current
recommendation requests include catalog candidates and reject bodies above 12,000
bytes; a larger catalog requires retrieval rather than merely raising that limit.

The supplied plan's strongest choices are human confirmation, explicit unknowns,
separate interest and competency interpretation, curated learning content, limited
AI authority, and capability-specific publication. Its main weaknesses are vague
first-release scope, undocumented "KEEP/approved" assumptions, data review scheduled
after dependent features, and evaluation presented too late in the delivery sequence.

The referenced external v0.x specifications were not found in this checkout.
Before approval, reconcile them with the actual product/architecture documents.
Do not treat this absence as authority to invent their decisions. PM-Fxx identifiers
remain distinct from existing F-001/F-002 requirement namespaces.

## First increment: competency evidence and comparison foundation

Proposed outcome: a user selects a reviewed skill, records experience or leaves
proficiency unknown, saves and refreshes, selects a supported career, sees a truthful
comparison, and opens a reviewed existing roadmap topic where coverage exists.

This integration uses the initial deliverables of PM-W01-W04 with minimal UI; it does not complete every deliverable of those packages. It supplies real
services for later features rather than contract stubs. Evaluation preparation from
PM-W12 runs alongside it. It is not a broad UI redesign or a completion claim for
all ten post-MVP features.

### Scope

Include stable competency IDs and aliases; source/version/review metadata; reviewed
occupation-to-competency relationships; manual user confirmation; proposed nullable
self-report level; revision-safe edits/removal; authenticated reads/writes; generated
client integration; deterministic comparisons; and curated links to existing topics.

Select one existing career for the initial end-to-end acceptance fixture. Data
Analyst is a candidate because detailed local content has recorded evidence, but
the data reviewer must confirm a suitable occupational mapping. Do not hardcode
that career or the fixture size as an application limit. Use a second reviewed
case before declaring multi-career support accepted.

Exclude from this increment: live PDF processing, official assessments, altered
Discovery routing, recommendation-provider changes, counselor/tool loops, employment
readiness scores, market ingestion, autonomous writes and public deployment.

### User behavior and interpretation

- A skill can be confirmed while its proficiency remains unknown.
- Relevant skills absent from the profile appear as unassessed, not absent abilities.
- Level 0, if the rubric is approved, is an explicit self-report of no experience.
- A reported low level can invite learning; without a reviewed compatible target,
  the system must not claim the user is below an occupational threshold.
- Essential/optional labels retain their source meaning and do not imply every
  employer requires that skill.
- Missing topic mappings show a coverage limitation. Topic links do not change
  focus, branches or progress. Existing focus-switch behavior remains authoritative.

## Contract proposal for review

These are logical responsibilities, not final table or route names. SQL migrations
remain schema authority; Pydantic/OpenAPI and generated TypeScript remain wire authority.

| Record/capability | Minimum responsibility |
| --- | --- |
| Competency reference | Stable internal identity, labels/aliases, lifecycle and external identifiers |
| Source release and mapping | Source version, provenance, reviewed mapping type and publication status |
| Career competency relationship | Existing career ID, competency ID, source classification and version |
| User competency | Authenticated owner, confirmation, nullable self-report, revision and timestamp |
| User change history | Reviewed correction/removal/retention policy; no indefinite private-text archive |
| Topic association | Existing roadmap/topic IDs, reviewed learning relationship and source version |
| Comparison response | Career/source/profile revisions and independently represented evidence states |

Proposed operations: search reviewed competencies; read own profile competencies;
create/update/remove an own record; read a career's competency evidence; and compare
own records with a selected career. Use current pagination and error conventions.
Derive user identity from the authenticated context, not submitted user IDs.

Reuse current create-only/version-check patterns. Define duplicate creation,
stale updates, replayed requests and removal explicitly. Return conflict rather
than overwriting newer user edits. A comparison should use a consistent read of
published mappings and account state, and expose their versions. For this increment,
prefer computed comparisons over a new persistent snapshot subsystem; revisitable
historical comparisons need their own approved lifecycle.

Current AI recommendations should continue using their current eligible context
until competency integration is separately approved. The UI must not imply that a
saved skill has already affected AI suggestions. Evidence corrections must update
comparison readback immediately and invalidate relevant frontend cached queries.

## Implementation sequence and integration boundaries

| Step | Concrete deliverable | Exit gate |
| --- | --- | --- |
| 0: baseline and evidence needs | Current local MVP reference, ownership, bounded scope and required evidence | Planning review; no final contract approval before data inspection |
| 1: dataset pilot and contracts | Source inspection, 12-career coverage assessment, two-career pilot and expected comparisons; then dependent contract design | Data/content review followed by product/architecture review of affected contracts |
| 2: persistence and services | Additive migrations, grants/RLS, domain operations and deterministic comparisons | Migration, ownership, session and data-integrity checks pass |
| 3: frontend connection | Generated types, account-scoped hooks, minimal editor/comparison UI | Real save/refresh/readback; useful empty/error states |
| 4: acceptance and handoff | Existing MVP preservation checks, focused journey and implementation guide | Human review and all first-increment acceptance IDs satisfied |

Do not allocate dependent feature tasks after Step 0 alone. They should start
against the accepted, working services produced by Steps 2-4. Detailed contract
design is preparatory work; placeholder 501 responses are not foundation readiness.

Keep MVP content IDs, text skill labels and publication semantics compatible.
Add reviewed mappings alongside authored content. Existing careers must continue
working when they have no competency enrichment. The current publication helper
recognizes releases 1 through 4; any new content release sequence must be coordinated
through coordinated content review rather than overlapping edits.

Use isolated approved test resources for new migrations. A separate checkout does
not isolate Supabase when the project ID is shared. Do not reset or reprovision the
team's retained database. Define failed-migration recovery and preserve existing
data; turning off UI exposure is not a database rollback strategy.

## Expected affected modules

| Area | Existing integration point / proposed work |
| --- | --- |
| Domain | New competency/evidence module paths to be selected during contract review; reuse [storage boundary](../backend/app/modules/storage.py) |
| Auth/session | Reuse [repository transaction](../backend/app/modules/profiles/repository.py); no new identity provider or administrator runtime role |
| Catalog | Extend via relationships to [existing catalog](../backend/app/modules/careers/service.py); preserve MVP response compatibility |
| Contracts | Reuse [shared conventions](../backend/app/api/contracts.py); update approved OpenAPI and generated client together |
| Database | New versioned migration under existing migrations directory; restricted grants and ownership policies reviewed |
| Frontend | New feature component/hooks using [current API conventions](../frontend/src/features/core/data.ts); coordinate Profile/catalog entry points with owners |
| Content | Reviewed associations and manifests; coordinate with [content authoring workflow](content-authoring.md) |
| Documentation | Owning product/specification/decision updates plus a new implementation guide at docs/features/competency-comparison.md when implemented |

## Acceptance and focused verification

The following are proposed first-increment acceptance IDs. They are not passed tests.

| ID | Required result | Verification |
| --- | --- | --- |
| PM-I1-01 | [Owning feature: PM-F03](plans/post-mvp/pm-f03-occupational-knowledge.md#acceptance-and-evaluation) | Required in the combined journey; see owner for definition and evidence |
| PM-I1-02 | [Owning feature: PM-F03](plans/post-mvp/pm-f03-occupational-knowledge.md#acceptance-and-evaluation) | Required in the combined journey; see owner for definition and evidence |
| PM-I1-03 | [Owning feature: PM-F02](plans/post-mvp/pm-f02-competency-profile.md#acceptance-and-evaluation) | Required in the combined journey; see owner for definition and evidence |
| PM-I1-04 | [Owning feature: PM-F02](plans/post-mvp/pm-f02-competency-profile.md#acceptance-and-evaluation) | Required in the combined journey; see owner for definition and evidence |
| PM-I1-05 | [Owning feature: PM-F02](plans/post-mvp/pm-f02-competency-profile.md#acceptance-and-evaluation) | Required in the combined journey; see owner for definition and evidence |
| PM-I1-06 | [Owning feature: PM-F05](plans/post-mvp/pm-f05-skill-comparison.md#acceptance-and-evaluation) | Required in the combined journey; see owner for definition and evidence |
| PM-I1-07 | [Owning feature: PM-F05](plans/post-mvp/pm-f05-skill-comparison.md#acceptance-and-evaluation) | Required in the combined journey; see owner for definition and evidence |
| PM-I1-08 | [Owning feature: PM-F07](plans/post-mvp/pm-f07-learning-guidance.md#acceptance-and-evaluation) | Required in the combined journey; see owner for definition and evidence |
| PM-I1-09 | [Owning feature: PM-F03](plans/post-mvp/pm-f03-occupational-knowledge.md#acceptance-and-evaluation) | Required in the combined journey; see owner for definition and evidence |
| PM-I1-10 | [Owning feature: PM-F02](plans/post-mvp/pm-f02-competency-profile.md#acceptance-and-evaluation) | Required in the combined journey; see owner for definition and evidence |
| PM-I1-11 | [Owning feature: PM-F05](plans/post-mvp/pm-f05-skill-comparison.md#acceptance-and-evaluation) | Required in the combined journey; see owner for definition and evidence |
| PM-I1-12 | Feature guide, evidence, limitations and integration ownership are complete | Handoff review |

Proposed manual journey at the existing local app: sign in with a synthetic account,
open the new competency entry point (route to be decided), save one unknown and one
self-assessed skill, refresh, compare a supported career, inspect provenance and
coverage limitations, open a topic, then correct/remove a record and repeat.
Use a second account to verify isolation. Exact navigation and expected copy belong
in the implementation guide once designed; these steps are not current functionality.

Use existing pytest/frontend/contract tooling. Add tests for meaningful new security,
comparison and concurrency behavior. Do not rerun every foundation check or install
a new test harness solely for this proposal. Actual schema/auth changes will require
their applicable security checks even if prior MVP evidence exists.

## Decisions before implementation

| Decision | Proposed default / unresolved boundary | Required review area |
| --- | --- | --- |
| First increment | Manual competency comparison first; PDF follows as a separate package | Product review |
| Audience | All ages/levels requested; deployment eligibility and younger-user policies unresolved | Privacy/research review |
| Rubric | Nullable 0-4 self-report proposed; no numeric career readiness | Research review |
| Dataset | One reviewed source subset first; ESCO candidate; O*NET only where capability needs it | Data review pending |
| Role mapping | Existing career identity preserved; publish reviewed relationship scope | Content/data review pending |
| Private history | Retention and correction/removal effects must be selected | Architecture/privacy review |
| UI | Minimal editor and comparison; exact entry points reviewed for this increment | Product/UI review |
| Technical contracts | Additive schema, ownership, revisions and generated APIs | Architecture review |
| Work assignment | Shared foundation, content review, UI integration and accepted baseline | Integration review |

Missing decisions block dependent implementation, not continued research and
planning. Do not request or infer blanket approval for all post-MVP features.

## Review conclusion and evidence limits

Proceed with planning this increment. The current stack can support it without
an architectural rewrite, agent framework or vector database. The largest risks
are occupational mapping quality, semantic confusion about proficiency, and changes
to shared contracts while the MVP team is still working.

This assessment uses source inspection, the supplied plan, recorded scope clarifications,
and the prior official-source checks linked in the roadmap. Existing local runtime
evidence is owned by the [acceptance guide](features/deployment-preparation.md).
No new runtime, provider, migration, performance or participant checks were executed
for this documentation change. No implementation estimate is established without
owners, dataset scope and the reviewed affected-contract baseline.

2026-10-30 change record: created at the recorded request for comprehensive review
and first implementation planning. Human review
pending; no changes to application code, dependencies, schemas, APIs or eligibility.

2026-11-03 change record: documentation restructuring implements the user-reviewed feature-based, dataset-first planning plan (PM-DOC-01 through PM-DOC-04). Feature acceptance definitions now live in their owning plans; PM-I1-12 remains the integration handoff criterion. No source acquisition, runtime changes or new acceptance evidence.
