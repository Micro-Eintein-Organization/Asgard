# Post-MVP feasibility review and first implementation plan

Author: Codex. Created and updated: 2026-10-30.
Status: proposed; planning authorized, implementation not authorized.
Required product/architecture reviewer: @YakisobaNissin per
[CODEOWNERS](../.github/CODEOWNERS). Implementation and data-review owners: unassigned.

## Decision summary

The [post-MVP roadmap](post-mvp-roadmap.md) is technically feasible as staged
extensions of the React/FastAPI/Supabase application. The first implementation
should establish reviewed occupational competencies, account-owned self-assessment
and a working comparison journey. No new agent framework is necessary for this
increment. Complete and accept the team's MVP baseline before shared code changes.

This document records the owner's request for a comprehensive review and a first
implementation plan. It is a documentation deliverable, not an architecture
approval, schema specification or instruction to begin coding. It supplements
the roadmap and [future-development register](future-development.md).

## Latest owner direction

The owner clarified the intended post-MVP audience as all ages and skill levels,
and inputs as either manual information or a resume PDF. Record this as product
direction; it changes the current 18+ eligibility boundary. Operational decisions
for younger users, account eligibility, consent, research participation and provider
processing remain unresolved. Do not silently change existing eligibility during
foundation work. Local synthetic testing can proceed after technical approval;
broader user rollout depends on the resolved policy in the owning documents.

The pasted plan proposes self-report levels 0-4: no experience, familiar with
concepts, basic tasks with guidance, ordinary tasks independently, and advanced
tasks/troubleshooting. Unknown is separate. The owner asked what the plan specified
but did not explicitly approve this rubric in the subsequent discussion. Preserve
it as a proposal, not a validated scale or completed decision.

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

This is one vertical implementation of PM-W01-W04 with minimal UI. It supplies real
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
| 0: baseline and decisions | Accepted MVP reference, actual ownership map, reviewed scope/rubric/data source/contracts | Product and architecture approval recorded; branch selected by owner |
| 1: evidence fixture | Reviewed occupation/competency subset, import manifest and expected comparisons | Data reviewer accepts provenance and mappings |
| 2: persistence and services | Additive migrations, grants/RLS, domain operations and deterministic comparisons | Migration, ownership, session and data-integrity checks pass |
| 3: frontend connection | Generated types, account-scoped hooks, minimal editor/comparison UI | Real save/refresh/readback; useful empty/error states |
| 4: acceptance and handoff | Existing MVP preservation checks, focused journey and implementation guide | Human review and all first-increment acceptance IDs satisfied |

Do not allocate dependent feature tasks after Step 0 alone. They should start
against the accepted, working services produced by Steps 2-4. Detailed contract
design is preparatory work; placeholder 501 responses are not foundation readiness.

Keep MVP content IDs, text skill labels and publication semantics compatible.
Add reviewed mappings alongside authored content. Existing careers must continue
working when they have no competency enrichment. The current publication helper
recognizes releases 1 and 2; any new content release sequence must be coordinated
with the content owner rather than edited independently by multiple contributors.

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
| PM-I1-01 | Stable reviewed identifiers; repeat import does not duplicate or rewrite published meaning | Import/reference tests and data review |
| PM-I1-02 | Existing careers and roadmaps work without mappings; existing content IDs/progress survive | Focused content upgrade/preservation check |
| PM-I1-03 | Anonymous and other accounts cannot read or mutate user competency records | API/session and actual restricted-role isolation tests |
| PM-I1-04 | Unknown and 0 remain distinct; invalid levels fail; confirmed presence does not assert mastery | Schema and persistence cases |
| PM-I1-05 | Duplicate/stale writes cannot overwrite newer state | Concurrency, revision and retry tests |
| PM-I1-06 | Comparison matches reviewed cases, including missing profile information and missing targets | Deterministic service fixtures reviewed by humans |
| PM-I1-07 | Removal/correction updates comparison and clears stale account caches | Service and frontend interaction tests |
| PM-I1-08 | Topic links resolve and never change progress automatically | Integration and guided manual journey |
| PM-I1-09 | Generated API/client agree; existing MVP contracts remain compatible | Existing drift/type checks and affected regression checks |
| PM-I1-10 | Save, refresh, revisit, empty/error states and account switch work | Browser/manual acceptance and relevant UI tests |
| PM-I1-11 | No unsupported suitability/readiness claims; source and uncertainty are understandable | Human content/comprehension review |
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

| Decision | Proposed default / unresolved boundary | Responsible reviewer |
| --- | --- | --- |
| First increment | Manual competency comparison first; PDF follows as a separate package | Project owner |
| Audience | All ages/levels requested; deployment eligibility and younger-user policies unresolved | Project owner and designated privacy/research reviewers |
| Rubric | Nullable 0-4 self-report proposed; no numeric career readiness | Project owner and research reviewer |
| Dataset | One reviewed source subset first; ESCO candidate; O*NET only where capability needs it | Data reviewer, unassigned |
| Role mapping | Existing career identity preserved; publish reviewed relationship scope | Content/data reviewer, unassigned |
| Private history | Retention and correction/removal effects must be selected | Architecture/privacy reviewers |
| UI | Minimal editor and comparison; exact entry points coordinated after MVP acceptance | Existing frontend owners and project owner |
| Technical contracts | Additive schema, ownership, revisions and generated APIs | Architecture reviewer |
| Work assignment | Foundation owner, content reviewer, UI integrator and accepted branch baseline | Project lead |

Missing decisions block dependent implementation, not continued research and
planning. Do not request or infer blanket approval for all post-MVP features.

## Review conclusion and evidence limits

Proceed with planning this increment. The current stack can support it without
an architectural rewrite, agent framework or vector database. The largest risks
are occupational mapping quality, semantic confusion about proficiency, and changes
to shared contracts while the MVP team is still working.

This assessment uses source inspection, the supplied plan, owner clarifications,
and the prior official-source checks linked in the roadmap. Existing local runtime
evidence is owned by the [acceptance guide](features/deployment-preparation.md).
No new runtime, provider, migration, performance or participant checks were executed
for this documentation task. No implementation estimate is established without
owners, dataset scope and the accepted MVP baseline.

2026-10-30 change record: created at the owner's request for comprehensive review
and first implementation planning. Documentation author: Codex. Human review
pending; no changes to application code, dependencies, schemas, APIs or eligibility.
