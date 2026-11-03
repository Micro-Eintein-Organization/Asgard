# Asgard: Post-MVP roadmap and repository assessment

Current scope, 2026-11-02: use the [local MVP resolution](decisions.md#local-evaluation-mvp-resolution-2026-11-02) and [consolidated implementation/evidence](development.md#current-local-mvp-status-2026-11-02). Earlier inventories and proposed work below retain their dates; existing implemented core and the 12-path release must not be treated as new implementation assignments. Pending review, future proposals and hosted gates remain separate.

Created: 2026-10-29. Last updated: 2026-11-03.
Version: 1.0. Status: proposed roadmap; feature implementation is not authorized.
Follow-up: [feasibility review and first implementation plan](post-mvp-first-implementation.md)
records later audience/input clarifications and a proposed bounded
competency-comparison increment. Shared implementation requires review of affected contracts and focused preservation checks against the November 2 local baseline. Planning and reviewed data preparation may proceed independently of unrelated hosted gates.

## Purpose and how to use this document

This is a durable, repository-specific interpretation of the supplied
"ASGARD - Post-MVP Methodology, Architecture & Feature Change Plan", version 1.0,
dated 2026-10-29, and the subsequent feasibility review. It records proposed
direction, implementation comments and bounded work packages. It is not a claim
that the supplied plan, earlier papers or missing specifications are approved.

The documented scope covers this document in the dated planning record on 2026-10-29. That request
authorizes writing this roadmap and navigation links, not implementing its features.

Documentation scope: this roadmap, README navigation and the future-development cross-reference. Acceptance: PM-DOC-01
(separate proposals from current behavior), PM-DOC-02 (map features to existing
modules and backlog), PM-DOC-03 (record dependencies, decisions and checks), and
PM-DOC-04 (portable, resolving local references). No application contracts change.

**The features are separated into work packages within one application.** They do
not require ten applications, ten services or ten agents. Shared evidence and
identity contracts are reviewed first; each package has explicit scope,
bounded plan, acceptance evidence and implementation guide.

When returning to this document:

1. Read the current baseline and the package status before assigning work.
2. Select one package and resolve only its dependencies and approval gates.
3. Record a bounded plan and obtain the applicable review before coding.
4. Update the owning specification and decision record for approved changes.
5. After implementation, link its guide and evidence here and update the backlog.

## Authority and current baseline

The [product requirements](product.md), [architecture](architecture.md),
[decisions](decisions.md), [development workflow](development.md),
[security baseline](security-and-operations.md) and
[verification requirements](verification.md) retain their existing authority.
This roadmap does not supersede them. It does not certify that the MVP has shipped.

Historical inspection baseline (2026-10-29): local branch `codex/connected-prototype`, commit `6a10653`,
clean working tree before this documentation change. The development guide records
the recorded selection of this feature branch. Remote state and protected-review
enforcement were not verified. Do not switch branches or apply the historical
foundation workflow to future work without checking the current approved scope.
Commits, pushes, merges and other restricted Git operations require their separate
explicit authorization under [AGENTS.md](../AGENTS.md).

Historical inspection, 2026-10-29: source included authenticated React/FastAPI workflows for Profile, saved
conditional Discovery, catalog exploration, Groq recommendations, preferences,
roadmaps, focus and reversible learning progress. At that inspection, three starter careers were
recorded as published locally; the broader seven-role MVP inventory is not an
architectural maximum. PDF extraction/storage code exists, but processing is
deferred and disabled by default.

The [core handoff](features/mvp-backend-handoff.md) and
[local acceptance record](features/deployment-preparation.md) own execution
evidence. Local acceptance does not establish model quality, completed human
review, independent-host acceptance or hosted release readiness. Docker was
unavailable during that historical review; no new runtime acceptance is claimed.
Existing hosted and account-provider gates remain independent work.

## Proposed direction and scope changes

Build an evidence-grounded career decision-support system using reviewed
occupational information, user-controlled records, deterministic comparisons and
bounded AI guidance. Keep the existing React, FastAPI, Supabase and provider-adapter
foundation. Technical feasibility is supported by the current module boundaries;
delivery dates and operating capacity have not been established.

| Earlier proposal | Proposed treatment | Repository comment |
| --- | --- | --- |
| Mandatory weighted career-fit percentage | Omit as the production default; distinguish official interest matching from exploratory suggestions | Current Asgard already excludes suitability percentages; there is no current score to remove |
| Document statements prove competence | Repurpose extraction into candidate evidence and optional confirmed competency records | Confirmation-first profiling would change current derived-context policy and needs an explicit decision |
| Missing skill means inability | Report unassessed information separately from explicitly reported development needs | Preserve unknown; neither a missing resume phrase nor Done proves competence |
| Generated remediation curriculum | Preserve curated roadmaps; store personal suggestions separately | Existing roadmap publication and user progress should remain authoritative |
| Existing multi-agent framework | Replace the assumption with a proposed single counselor; defer specialist orchestration | The repository has a modular monolith and bounded provider calls, not an agent platform |
| Continuous nationwide market coverage | Replan as permitted, dated observations with explicit coverage | Source access and evidence quality remain external dependencies |
| Full ESCO/O*NET import before useful work | Use capability-specific reviewed subsets | Expandable storage does not imply every occupation has every capability |

**Engineering assessment:** this is a functional expansion as well as a methodology
revision. It can extend current code, but several capabilities need new data
models, contracts and screens. A broad framework installation is not the first
implementation step.

## Feature map

Use `PM-Fxx` and `PM-Wxx` only as roadmap references. Do not rename existing
`REQ-*`, `F-001`, `F-002`, `QA-*` or `FUT-*` identifiers. In particular, the supplied
plan's Feature 2 means profiling, while repository F-002 means recommendations.
New acceptance IDs must be assigned in the owning specification when approved.

| Roadmap feature | Reuse | Proposed addition or change | Backlog / packages |
| --- | --- | --- | --- |
| [PM-F01 Discovery and assessment](plans/post-mvp/pm-f01-discovery-assessment.md) | Versioned conditional questionnaire, saved answers, resume/retake | Reviewed revised questions; optional official interest assessment | FUT-05; W05, W09 |
| [PM-F02 Competency profile](plans/post-mvp/pm-f02-competency-profile.md) | Profile ownership/revision patterns; document evidence | Editable normalized competencies, confirmation, self-report and history | FUT-01, FUT-13; W02, W03, W10 |
| [PM-F03 Occupational knowledge](plans/post-mvp/pm-f03-occupational-knowledge.md) | Catalog identities, publication and review metadata | Versioned source imports, competency relationships and mappings | FUT-01, FUT-07; W01, W02 |
| [PM-F04 Recommendations](plans/post-mvp/pm-f04-recommendations.md) | Saved context, candidate validation, quotas and explanations | Retrieved candidates, new evidence types, distinct method labels | REQ-05 / F-002; W04, W09 |
| [PM-F05 Skill comparison](plans/post-mvp/pm-f05-skill-comparison.md) | Existing account and transaction boundary | Deterministic evidence comparison and reviewed topic links | FUT-01; W04 |
| [PM-F06 Career comparison](plans/post-mvp/pm-f06-career-comparison.md) | Career details and roadmap reads | Side-by-side alternatives, saved shortlist/decisions and priorities | FUT-02; W06 |
| [PM-F07 Personal learning guidance](plans/post-mvp/pm-f07-learning-guidance.md) | Curated roadmaps, branches, topic resources | Separate personal suggestions linked to development needs | FUT-06, FUT-07; W07 |
| [PM-F08 Progress and reflection](plans/post-mvp/pm-f08-reflection.md) | Persisted reversible states, activity and concurrency guards | Optional reflection and explicit reassessment | FUT-03; W07 |
| [PM-F09 AI counselor](plans/post-mvp/pm-f09-ai-counselor.md) | Groq transport patterns and domain services | Bounded authorized tools, contextual guidance and optional confirmed writes | FUT-04; W08 |
| [PM-F10 Philippine market context](plans/post-mvp/pm-f10-market-context.md) | Catalog destinations and evidence presentation patterns | Permitted observations, extraction, deduplication and freshness | FUT-08; W11 |

Wxx in the table means PM-Wxx below. Backlog entries remain deferred unless their
owning approval/status is explicitly changed. Google/MFA, photos, OCR and hosted
operations retain their separate FUT entries; this plan does not remove them.

## Delivery increments and dependencies

Recommended next action: review the [all-career curated dataset and methodology findings](research/dataset-review.md) through the [shared acquisition plan](plans/post-mvp/datasets.md). The user expanded data preparation to all 12 careers; the [paper](research/dataset-methodology.md) records selection and limitations. This does not expand study decisions or waive feature gates. No source mapping or proficiency methodology has been accepted. ESCO is not supplied and does not block independent work on the received sources.

First integrated journey: reviewed pilot -> PM-F03 occupational knowledge -> PM-F02 manual records -> PM-F05 categorical comparison -> PM-F07 reviewed topic links. See the [integration plan](post-mvp-first-implementation.md) for the combined checklist. This delivers only the initial portions of W01-W04 and topic-link coverage, not full recommendation integration or all personal guidance.

| Feature path | Actual prerequisites | Independent preparation |
| --- | --- | --- |
| Occupational knowledge, manual profile, comparison | Source inspection, accepted pilot evidence, then reviewed affected contracts | Source research and evaluation cases |
| Informal Discovery | Reviewed content and session compatibility; contract review where changed | Wording and comprehension study |
| Career comparison | Reviewed current catalog; ownership contracts for saved alternatives | Basic comparison without skill enrichment |
| Learning guidance | Accepted comparison evidence and reviewed topic associations | Current curriculum coverage review |
| Reflection | Reviewed prompts, interpretation and retention | Content design independent of occupational imports |
| Recommendations | Accepted evidence and retrieval/context contracts; competency services only for that enrichment | Retrieval and quality evaluation design |
| Read-only counselor | Its own architecture/tool review and available domain services | Existing read-only services; new tools wait for their owning features |
| Official assessment | Instrument access, faithful scoring and reviewed occupation mappings | Separate acquisition/research proposal |
| Philippine market context | Permitted sources, reviewed mappings, coverage and refresh responsibility | Source-access research |

These paths replace the A/B/C grouping as scheduling guidance. They do not waive feature-specific review. PM-W12 evaluation begins during planning for every feature. PDF enrichment remains a later PM-F02 increment with its own privacy/removal gates. Current 18+ eligibility remains; broader audience policy, rubric and retention are unresolved decisions.

## Bounded work packages

All packages below are **proposed**. Implementation is not authorized.
Product and architecture review are required; data and research review must complete before dependent publication or study.

### PM-W01: Reconcile scope and shared contracts

Owning plans: [dataset readiness](plans/post-mvp/datasets.md), [occupational knowledge](plans/post-mvp/pm-f03-occupational-knowledge.md) and the [integration plan](post-mvp-first-implementation.md).

Define initial evidence needs and bounded scope before acquisition. Finalize only affected contracts after source inspection and pilot review. Counselor architecture is gated under W08, not here. Feature behavior, decisions and acceptance live in the linked plans; this package records coordination and integration boundaries.

### PM-W02: Reviewed occupational evidence

Owning plans: [occupational knowledge](plans/post-mvp/pm-f03-occupational-knowledge.md) and [shared datasets](plans/post-mvp/datasets.md).

Separate source inspection/pilot review from later application ingestion/publication. Inspection precedes final W01 contracts; publication follows contract and data review. Feature behavior, decisions and acceptance live in the linked plans; this package records coordination and integration boundaries.

### PM-W03: User-confirmed competency profile

Owning plans: [competency profile](plans/post-mvp/pm-f02-competency-profile.md).

Manual records depend on reviewed skill identities and ownership/revision/retention contracts; PDF activation is a later increment. Feature behavior, decisions and acceptance live in the linked plans; this package records coordination and integration boundaries.

### PM-W04: Skill comparison and recommendation integration

Owning plans: [skill comparison](plans/post-mvp/pm-f05-skill-comparison.md) and [recommendations](plans/post-mvp/pm-f04-recommendations.md).

Comparison is the initial deliverable. Retrieval, new AI evidence and recommendation invalidation are later, separately reviewed deliverables. Comparison completion never means all W04 work is complete. Feature behavior, decisions and acceptance live in the linked plans; this package records coordination and integration boundaries.

### PM-W05: Discovery revision

Owning plans: [Discovery and assessment](plans/post-mvp/pm-f01-discovery-assessment.md).

Informal content revision is separate from W09 official instrument integration. Feature behavior, decisions and acceptance live in the linked plans; this package records coordination and integration boundaries.

### PM-W06: Career comparison and saved alternatives

Owning plans: [career comparison](plans/post-mvp/pm-f06-career-comparison.md).

Basic catalog comparison can precede skill enrichment. Saved alternatives need reviewed account-owned contracts. Feature behavior, decisions and acceptance live in the linked plans; this package records coordination and integration boundaries.

### PM-W07: Personal learning guidance and reflection

Owning plans: [learning guidance](plans/post-mvp/pm-f07-learning-guidance.md) and [reflection](plans/post-mvp/pm-f08-reflection.md).

These are separate deliverables: competency-linked guidance depends on reviewed comparisons/topic mappings; optional reflection has its own content and retention review. Neither auto-completes learning or proves proficiency. Feature behavior, decisions and acceptance live in the linked plans; this package records coordination and integration boundaries.

### PM-W08: One bounded AI counselor

Owning plans: [AI counselor](plans/post-mvp/pm-f09-ai-counselor.md).

Own the counselor/tool-boundary architecture decision here, including any required ADR and architecture/development/AGENTS updates. Read-only access precedes separately reviewed confirmed writes. Feature behavior, decisions and acceptance live in the linked plans; this package records coordination and integration boundaries.

### PM-W09: Optional official interest assessment

Owning plans: [Discovery and assessment](plans/post-mvp/pm-f01-discovery-assessment.md).

Require separate instrument acquisition, administration/scoring and mapping review. It is not an informal Discovery score. Feature behavior, decisions and acceptance live in the linked plans; this package records coordination and integration boundaries.

### PM-W10: Document enrichment and confirmation

Owning plans: [competency profile](plans/post-mvp/pm-f02-competency-profile.md).

Resolve confirmation, privacy/provider activation, retention and replacement/removal before PDF enrichment. Existing cleanup remains required. Feature behavior, decisions and acceptance live in the linked plans; this package records coordination and integration boundaries.

### PM-W11: Philippine labor-market observations

Owning plans: [Philippine market context](plans/post-mvp/pm-f10-market-context.md).

Separate permitted local observations from general occupational classifications; review coverage and ongoing refresh ownership before publication. Feature behavior, decisions and acceptance live in the linked plans; this package records coordination and integration boundaries.

### PM-W12: Evaluation and research record

- Begins before dependent coding and continues throughout. Assign the research
  owner, expert reviewers, target respondents and institutional requirements.
- Define annotated cases and expected results for normalization, comparison,
  retrieval, explanation support, uncertainty, tool permissions and removal.
- Preserve applicable existing verification gates. A revised study protocol must
  explicitly reconcile existing model-quality thresholds rather than erase them.
- Measure technical correctness separately from usability and decision-support
  usefulness. Career confidence requires a justified measure and study design;
  a successful browser journey does not demonstrate a psychological outcome.
- Compare simpler service workflows with the counselor; test specialists only if
  selected. Report failures, reviewer disagreements, latency and resource usage.
- Exit: reproducible records and a paper whose claims match delivered evidence.
  A small pilot cannot establish nationwide suitability or employment effectiveness.

## Existing source map and implementation comments

These are integration points, not instructions to edit every listed file.

| Existing source | Reuse and limitation |
| --- | --- |
| [Discovery definition](../backend/app/modules/discovery/definition.py) and [service](../backend/app/modules/discovery/service.py) | Versioned authored routing and persistence; changes require session compatibility |
| [Profile schemas](../backend/app/modules/profiles/schemas.py) | Current names/version contract; a competency profile is a new domain capability |
| [Catalog service](../backend/app/modules/careers/service.py) | Published catalog reads and pagination; skills are currently labels, not normalized assessment records |
| [Shared foundation SQL](../supabase/migrations/20261026000100_shared_foundation.sql) | Existing identities, relationships and ownership foundation; use reviewed additive migrations |
| [Recommendation service](../backend/app/modules/recommendations/service.py), [selection](../backend/app/modules/recommendations/selection.py) and [provider](../backend/app/modules/recommendations/provider.py) | Snapshots, evidence/candidate validation and bounded calls; current candidate construction requires published roadmap destinations |
| [Document service](../backend/app/modules/documents/service.py) | Private evidence lifecycle; processing remains deferred |
| [Progress service](../backend/app/modules/progress/service.py) | Existing transactional progress/focus invariants; preserve during personalization |
| [Storage boundary](../backend/app/modules/storage.py) | Reuse session-checked transactions; tool calls must preserve authorization outside the model |
| [Frontend API integration](../frontend/src/features/core/data.ts) and [generated types](../frontend/src/api/generated/schema.d.ts) | Reuse account-scoped queries and generated contracts; regenerate after approved API changes |
| [Design system](design.md) | Reuse implemented components/tokens for new screens; this roadmap specifies no replacement visual design |

## External dependencies and feasibility notes

Official documentation was checked during the feasibility review on 2026-10-29;
recheck model support, terms and release versions before implementation.

- [Groq tool calling](https://console.groq.com/docs/tool-use/overview) supports
  tool use for the configured GPT-OSS candidate. The existing adapter does not yet
  implement an agent loop. [Structured Outputs](https://console.groq.com/docs/structured-outputs)
  currently documents a tool-use incompatibility: design separate tool execution
  and structured finalization stages where needed, with backend validation.
- [O*NET Interest Profiler services](https://services.onetcenter.org/ip) offers
  integration paths including the 30-question Mini-IP. Instrument access does not
  supply an approved Asgard crosswalk or validate a local research population.
- [ESCO downloads](https://esco.ec.europa.eu/en/use-esco/download) provides
  classifications in selectable packages/formats. Inspect actual archives,
  licenses, identifiers and versions; do not invent expected fields or targets.
- Source access, data review time and content coverage are delivery dependencies.
  They are not resolved by choosing a model or installing a framework.
- Existing hosting preparation is not a capacity result for conversational loops,
  larger imports or scheduled collection. Measure a bounded workload before making
  cost, latency or free-tier capacity commitments. No calendar estimate is established.

## Approval, assignment and completion rules

Before promoting a package, record its scope, technical review requirements, requirement/acceptance IDs,
affected modules, shared contracts, dependencies, verification and integration order.
The lead may assign separate contributors after shared boundaries are reviewed;
this document does not authorize parallel agents or assign people by job title.

Product decisions belong in owning specifications; architecture replacements
need the required ADR and related updates; recorded approvals belong in the
decision register. Proposed conceptual entities and JSON examples are not schema
authority. Versioned SQL and generated OpenAPI/TypeScript retain their authority.

Every implemented feature needs its internal guide under `docs/features/`, with
dates, status, IDs, behavior, sources, verification, manual steps and limits
as required by AGENTS.md. This planning-only change creates no feature guide
because it changes no feature behavior.

Use focused existing checks appropriate to each package. New authorization,
contract, data-integrity and security behavior needs corresponding evidence;
unchanged foundation evidence may be reused within its recorded limits. Manual
checks must identify the actual local route, steps, expected result and failure
reporting details once the implemented UI is available.

Human review is required before integration. Report passed, failed and not-run
checks separately. Never mark a package completed because its code exists alone.

## Planning status and change record

| Item | Status on 2026-10-29 |
| --- | --- |
| Repository feasibility review | Source and official-documentation review completed; no new runtime/load acceptance |
| This roadmap | Planning record; independent review pending |
| PM-W01 through PM-W12 | Proposed; implementation owners and package approval references unassigned |
| Existing FUT entries | Deferred; roadmap links do not promote them |
| Hosted operation, PDF activation and specialist agents | No new authorization |

2026-10-29: The record captures the supplied revision and repository assessment as
separate proposed packages, with dependencies, source links and approval gates.
Reference: the recorded request in the decision record to create a durable post-MVP document
with repository-aware comments. No application, dependency, SQL or API changes.
Local documentation verification is recorded in the task handoff.

Update this document when scope, package status or integration evidence changes.
Keep it a roadmap: link to approved detailed specifications and implementation
guides instead of creating a competing copy of their contracts.

## Planning restructuring record (2026-11-03)

The user approved the bounded documentation plan: separate PM-F01-PM-F10 plans, a shared dataset plan, a two-career pilot after a 12-career coverage assessment, linked acceptance ownership and independent dependency paths. Scope: this roadmap, planning documents, README navigation and future-development cross-references. Acceptance: PM-DOC-01 through PM-DOC-04. This is approval of documentation restructuring, not feature implementation, source selection, mappings, schema/API changes or publication.

Approval status: feature packages remain proposed; affected FUT entries remain deferred. Implementation status: documentation reorganized; future capabilities unchanged. Verification status: document checks belong in the task handoff; no new runtime, source acquisition or participant acceptance is claimed. No implementation guide is added because this change implements no feature behavior. Human review remains required before integration.
