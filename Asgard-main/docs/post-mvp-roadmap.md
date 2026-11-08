# Asgard: Post-MVP roadmap and repository assessment

Author: Codex. Created: 2026-10-29. Last updated: 2026-10-30.
Version: 1.0. Status: proposed roadmap; feature implementation is not authorized.
Follow-up: [feasibility review and first implementation plan](post-mvp-first-implementation.md)
records the owner's later audience/input clarifications and a proposed bounded
competency-comparison increment. Shared implementation waits for an accepted MVP
baseline; planning and reviewed data preparation may proceed now.
Required product/architecture reviewer: project lead, currently @YakisobaNissin
under [CODEOWNERS](../.github/CODEOWNERS). Human review remains pending.

## Purpose and how to use this document

This is a durable, repository-specific interpretation of the owner-supplied
"ASGARD - Post-MVP Methodology, Architecture & Feature Change Plan", version 1.0,
dated 2026-10-29, and the subsequent feasibility review. It records proposed
direction, implementation comments and bounded work packages. It is not a claim
that the supplied plan, earlier papers or missing specifications are approved.

The owner requested this document in the current chat on 2026-10-29. That request
authorizes writing this roadmap and navigation links, not implementing its features.
Documentation owner: Codex. Scope: this file, the README documentation index and
the future-development cross-reference. Documentation acceptance: PM-DOC-01
(separate proposals from current behavior), PM-DOC-02 (map features to existing
modules and backlog), PM-DOC-03 (record dependencies, decisions and checks), and
PM-DOC-04 (portable, resolving local references). No application contracts change.

**The features are separated into work packages within one application.** They do
not require ten applications, ten services or ten agents. Shared evidence and
identity contracts are reviewed first; each package then has its own owner,
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

Inspection baseline: local branch `codex/connected-prototype`, commit `6a10653`,
clean working tree before this documentation task. The development guide records
the owner's selection of this feature branch. Remote state and protected-review
enforcement were not verified. Do not switch branches or apply the historical
foundation workflow to future work without checking the current approved scope.
Commits, pushes, merges and other restricted Git operations require their separate
owner authorization under [AGENTS.md](../AGENTS.md).

Current source includes authenticated React/FastAPI workflows for Profile, saved
conditional Discovery, catalog exploration, Groq recommendations, preferences,
roadmaps, focus and reversible learning progress. Three starter careers are
recorded as published locally; the broader seven-role MVP inventory is not an
architectural maximum. PDF extraction/storage code exists, but processing is
deferred and disabled by default.

The [core handoff](features/mvp-backend-handoff.md) and
[local acceptance record](features/deployment-preparation.md) own execution
evidence. Local acceptance does not establish model quality, completed human
review, independent-host acceptance or hosted release readiness. Docker was
unavailable during the current-state review; no new runtime acceptance is claimed.
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

**Codex assessment:** this is a functional expansion as well as a methodology
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
| PM-F01 Discovery and assessment | Versioned conditional questionnaire, saved answers, resume/retake | Reviewed revised questions; optional official interest assessment | FUT-05; W05, W09 |
| PM-F02 Competency profile | Profile ownership/revision patterns; document evidence | Editable normalized competencies, confirmation, self-report and history | FUT-01, FUT-13; W02, W03, W10 |
| PM-F03 Occupational knowledge | Catalog identities, publication and review metadata | Versioned source imports, competency relationships and mappings | FUT-01, FUT-07; W01, W02 |
| PM-F04 Recommendations | Saved context, candidate validation, quotas and explanations | Retrieved candidates, new evidence types, distinct method labels | REQ-05 / F-002; W04, W09 |
| PM-F05 Skill comparison | Existing account and transaction boundary | Deterministic evidence comparison and reviewed topic links | FUT-01; W04 |
| PM-F06 Career comparison | Career details and roadmap reads | Side-by-side alternatives, saved shortlist/decisions and priorities | FUT-02; W06 |
| PM-F07 Personal learning guidance | Curated roadmaps, branches, topic resources | Separate personal suggestions linked to development needs | FUT-06, FUT-07; W07 |
| PM-F08 Progress and reflection | Persisted reversible states, activity and concurrency guards | Optional reflection and explicit reassessment | FUT-03; W07 |
| PM-F09 AI counselor | Groq transport patterns and domain services | Bounded authorized tools, contextual guidance and optional confirmed writes | FUT-04; W08 |
| PM-F10 Philippine market context | Catalog destinations and evidence presentation patterns | Permitted observations, extraction, deduplication and freshness | FUT-08; W11 |

Wxx in the table means PM-Wxx below. Backlog entries remain deferred unless their
owning approval/status is explicitly changed. Google/MFA, photos, OCR and hosted
operations retain their separate FUT entries; this plan does not remove them.

## Delivery increments and dependencies

Recommended first usable increment: **a user can record confirmed skills, compare
them with a small reviewed occupation profile, distinguish unknown information,
and open relevant existing roadmap topics.** It needs no agent or resume upload.

| Increment | Packages | Result |
| --- | --- | --- |
| A: evidence and comparison | W01-W04 | Reviewed source subset, competency management and trustworthy comparisons |
| B: exploration and guidance | W05-W08, selected individually | Better exploration, career comparison, personal suggestions and a counselor |
| C: optional integrations | W09-W11, selected individually | Official assessment, confirmation-based document enrichment and market observations |
| Evaluation throughout | W12 | Defined expected results before coding, then technical and participant evidence |

Dependency outline:

```text
W01 shared decisions/contracts
  -> W02 reviewed occupational evidence -> W03 user competencies -> W04 comparisons
  -> W05 Discovery revision (independent content work can begin earlier)
  -> W06 career comparison (basic comparison can precede competency enrichment)
W04 -> W07 development-aware learning guidance
Existing domain reads + W01 tool boundaries -> W08 bounded counselor
W02 reviewed occupation mappings -> W09 official assessment integration
W03 + document/privacy decisions -> W10 document enrichment
W02 + permitted source access -> W11 market observations
W12 evaluation design starts with W01 and accompanies every package
```

Source acquisition and evaluation design must precede dependent claims. The
counselor can begin with existing read-only services before all new features
exist; unavailable capabilities must be explicit. It must not become the only
way to use Discovery, catalog, comparisons, roadmaps or progress.

## Bounded work packages

All packages below are **proposed**. Implementation owners are unassigned.
The project lead is the required product/architecture reviewer; named data and
research reviewers must be assigned before their dependent publication or study.

### PM-W01: Reconcile scope and shared contracts

- Decide the first increment, target population and research contribution.
- Reconcile the supplied v0.x document references, which were not found in the
  checkout. Do not describe an undocumented rubric or approval as existing.
- Approve stable competency identity, evidence types, source versions, mapping
  multiplicity, correction/removal effects and context invalidation.
- Record the architecture change for the counselor/tool boundary through the
  required ADR and architecture/development/AGENTS updates before dependent work.
- Resolve affected SQL/OpenAPI/generated-client changes through architecture review.
- Exit: bounded reviewed contracts, package owners, acceptance IDs and evaluation
  fixtures. This package does not create speculative tables for all future features.

### PM-W02: Reviewed occupational evidence

- Depends on W01. Start with a bounded subset selected by the owner/data reviewer.
- Reuse catalog identity and publication. Add reproducible imports/manifests,
  source versions, competency records and reviewed occupation relationships.
- Preserve ESCO and O*NET identifiers separately from internal IDs. Crosswalks
  may be one-to-many or unresolved; never equate occupations by title alone.
- Expose capabilities independently: browsing, interest matching, skill comparison,
  roadmap availability and reviewed local evidence. Occupations without roadmaps
  need explicit UI behavior and revised recommendation eligibility.
- Exit checks: repeat import, duplicate/conflict rejection, reference integrity,
  reproducible source versions and human-reviewed mappings. Fixtures are labelled.

### PM-W03: User-confirmed competency profile

- Depends on W01/W02. Add manual competency management, evidence links, correction
  and history using the existing account/session/revision boundary.
- The proposed 0-4 rubric requires product approval and clear self-report labels;
  it is not a validated certification. Unknown must remain distinct from Level 0.
- Store presence/confirmation, proficiency, evidence and target availability as
  separate attributes. They cannot be represented by one exclusive status enum.
- Exit checks: owner/other-user/anonymous access, stale writes, unknown readback,
  corrections and removal, and profile history consistent with retention policy.
- Does not depend on PDF activation or infer levels from titles, institutions or Done.

### PM-W04: Skill comparison and recommendation integration

- Depends on W02/W03. Compare reviewed occupation relationships with confirmed
  user records. Missing profile entries mean needs assessment, not inability.
- Begin with categorical comparisons. Numerical differences on an ordinal rubric
  must not imply equal distances or validated readiness. Target levels need an
  approved compatible rubric, occupational context, version and reviewer.
- Reuse recommendation snapshots and explicit generation controls. New context
  types require reviewed contract evolution and invalidation on corrections.
- Retrieve a bounded candidate set before AI generation. Current recommendation
  code includes the candidate catalog in the request and rejects bodies above
  12,000 bytes; importing many occupations without changing retrieval will not scale.
- Exit checks: exact expected comparisons, unknown/target-unavailable cases,
  stale evidence, valid references, provider failure and no accidental progress writes.

### PM-W05: Discovery revision

- Depends on approved content and W01 where contracts change. Preserve existing
  five-theme conditional sessions; the proposed 8-10-question route is new content.
- Review wording, branches, ambiguity, inactive answers and old-session support
  before publishing a new questionnaire version. Do not mutate saved meanings.
- Exit checks: blank entry, conditional Back/edit, save/resume, version compatibility,
  explicit retakes and exclusion of inactive answers from recommendation context.
- Official assessment is W09, not a score inferred from informal Discovery answers.

### PM-W06: Career comparison and saved alternatives

- Depends on catalog reads; W03/W04 are needed only for competency enrichment.
- Begin with source-backed career activities, learning coverage and user priorities.
  Add saved alternatives through reviewed account-owned contracts.
- Preserve current focus/progress when viewing, comparing or shortlisting careers.
- Exit checks: actual records, unavailable capabilities, saved-state isolation,
  refresh persistence and manual comprehension of compare versus select focus.

### PM-W07: Personal learning guidance and reflection

- Reuse authored sequence, selected branches, resources, next-topic behavior and
  the account-wide single-Learning-topic invariant. Prerequisites remain advisory
  unless the owner explicitly changes that policy.
- W04 enables development-aware suggestions. Store personal plans separately;
  do not rewrite canonical roadmaps or mark topics complete from known skills.
- Add optional reflection/reassessment with a separately reviewed lifecycle.
  Never generate recommendations merely because a page was opened.
- Exit checks: progress survives content revisions, branch/focus guards hold,
  unsupported skill-to-topic mappings are disclosed, and Done never increases proficiency.

### PM-W08: One bounded AI counselor

- Depends on the W01 architecture decision and available domain services. Begin
  with read-only tools over existing capabilities; add confirmed writes separately.
- Extend the provider boundary instead of duplicating domain logic. LangChain,
  LangGraph, pgvector and tracing platforms are optional, separately justified dependencies.
- Derive account context server-side. Validate arguments and returned evidence;
  treat uploaded/retrieved text as untrusted data. No arbitrary SQL or unrestricted tools.
- Bind write confirmation to the exact proposed action and revision. Require
  replay protection, idempotency and stale-state rejection, not a generic chat approval.
- Bound calls, bytes/tokens, runtime and retry budgets across the whole interaction.
  Specify recovery, cancellation, trace redaction and retention before persistent memory.
- Exit checks: tool authorization, prompt injection, stale/replayed confirmations,
  context removal, outages, task success, latency and cost against a non-agent baseline.
- Specialist agents remain deferred until measured benefit justifies them.

### PM-W09: Optional official interest assessment

- Depends on selected official instrument/integration, access terms and reviewed
  mappings to Asgard occupations. Keep assessment results separate from Quick Discovery.
- Preserve official questions, response options, scoring, attribution and version.
  Do not claim that faithful integration establishes Philippine population validity.
- Exit checks: official reference cases, result persistence, mapping ambiguity,
  service outage and continued catalog access without taking the assessment.

### PM-W10: Document enrichment and confirmation

- Depends on W03 and explicit decisions about confirmation, consent and retention.
  Reuse the existing private document lifecycle rather than adding another uploader.
- Resolve the change from current derived-context policy to candidate/confirmed
  competencies. Define rejected extraction, independent self-report and removal
  semantics before migration. Source deletion must not leave hidden quoted content.
- Existing PDF/provider privacy gates remain. This package does not activate real
  personal-document processing, add OCR or broaden file formats automatically.
- Exit checks: extraction/reference quality, replacement/removal races, failed
  cleanup, cross-account denial and invalidation of dependent outputs.

### PM-W11: Philippine labor-market observations

- Depends on permitted source access, W02 mappings, a collection scope and an
  assigned data reviewer. Start with a bounded dated batch before automation.
- Record source, observation date, geography, employer/listing counts, duplicates,
  extraction quality and coverage. Separate observed advertisements from general
  occupational relationships; neither automatically defines proficiency targets.
- Scope covers descriptive evidence. Job application/placement or employer tools
  are not authorized by a mention of job discovery in the supplied plan.
- Exit checks: permission record, provenance, deduplication, extraction samples,
  stale/missing evidence behavior and rejection of unsupported market generalizations.
- Ongoing refresh needs an operator and maintenance design, not a process timer
  assumed reliable on the current free hosting plan.

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

Before promoting a package, record its owner, reviewer, requirement/acceptance IDs,
affected modules, shared contracts, dependencies, verification and integration order.
The lead may assign separate contributors after shared boundaries are reviewed;
this document does not authorize parallel agents or assign people by job title.

Product decisions belong in owning specifications; architecture replacements
need the required ADR and related updates; recorded approvals belong in the
decision register. Proposed conceptual entities and JSON examples are not schema
authority. Versioned SQL and generated OpenAPI/TypeScript retain their authority.

Every implemented feature needs its internal guide under `docs/features/`, with
author/dates, status, IDs, behavior, sources, verification, manual steps and limits
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
| This roadmap | Written at owner's request; pending human review |
| PM-W01 through PM-W12 | Proposed; implementation owners and package approval references unassigned |
| Existing FUT entries | Deferred; roadmap links do not promote them |
| Hosted operation, PDF activation and specialist agents | No new authorization |

2026-10-29: Codex recorded the supplied revision and repository assessment as
separate proposed packages, with dependencies, source links and approval gates.
Reference: the owner's request in this chat to create a durable post-MVP document
with repository-aware comments. No application, dependency, SQL or API changes.
Local documentation verification is recorded in the task handoff.

Update this document when scope, package status or integration evidence changes.
Keep it a roadmap: link to approved detailed specifications and implementation
guides instead of creating a competing copy of their contracts.
