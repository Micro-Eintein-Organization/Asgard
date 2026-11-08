# Asgard: Post-MVP roadmap and repository assessment

## Learner journey simplification direction, 2026-11-05

The owner selected a staged presentation cleanup. Keep the current Discovery
flow; schedule its redesign (W05) as the final improvement after the other app
journeys are settled. Keep two-career comparison (W06), but center its screen on
the differences between the selected careers and make shortlist and notes
secondary. Rework W07 presentation: remove its added practice and reflection
surfaces from Roadmap and Dashboard, returning Roadmap to authored milestones,
topics, focus and progress. Preserve the W07 API, migration and stored data
dormantly; this is a UI plan, not a data deletion or completed code change.
See the dated [W07 implementation guide](features/learning-guidance-and-reflection.md#owner-directed-presentation-rework-2026-11-05).

## Beginner exploration update, 2026-11-05

The owner selected career choice first across all twelve careers. Use concrete work, outputs, checks and one beginner activity per career, with optional task-based experience questions on the existing 120 skills. The typed local content package is implemented without database or recommendation changes. [Implementation and focused evidence](features/career-comparison-and-shortlist.md#beginner-exploration-2026-11-05). Independent comprehension/content review remains pending; PDF, hosting and additional account controls remain deferred.

## Learner journey and career comparison, 2026-11-05

Activation update: the owner approved the concrete one-migration shortlist bundle. It is now applied locally; original-data checks and the focused learner journey passed. See [final evidence](features/career-comparison-and-shortlist.md#normal-activation-and-learner-journey-2026-11-05).

The owner selected PM-F06 / W06 and the experience-flow repair. Source now includes direct career actions, exactly-two comparison, private notes/shortlist and secondary sources. Types/contracts, scoped lint and focused persistence/isolation/stale-write checks passed. Normal shortlist activation and guided acceptance await the concrete review; this is not completed hosted acceptance. [Implementation guide](features/career-comparison-and-shortlist.md) and [owning specification](specs/career-exploration-comparison.md).






## Twelve-career agent review packet, 2026-11-04

The owner requested the bounded twelve-career evidence review. Codex prepared an
inactive policy-assisted review covering all inherited records, existing skills and
learning topics, preserving native scales and private rating identities. This is
agent-proposed scope/partial-coverage evidence, not independent expert approval.
Disputed ratings remain withheld and publication/inference flags remain false.
See [review method, results and limits](features/career-evidence-recommendations.md#twelve-career-policy-assisted-agent-review-2026-11-04).
Runtime recommendation integration and content-review assignment remain pending.

## Occupational originals verified, 2026-11-04

The owner supplied the original research files; all 20 match the recorded SHA-256
and byte sizes. This resolves the missing-originals issue for this packet, without
establishing independent semantic approval. Two original PDF ambiguities were
inspected and recorded conservatively. The packet remains inactive pending full
review and shared-contract approval. See
[source verification](features/career-evidence-recommendations.md#original-source-verification-2026-11-04).

## Full occupational evidence preparation, 2026-11-04

The owner requested the full twelve-career evidence/recommendation plan: full
applicable source profiles, grouped reference levels, interests plus experience,
one release activation, and erasure of obsolete skill-derived result payloads.
Codex prepared a durable inactive research packet and structural validator. No
semantic approval, source-original hash verification or recommendation integration
is claimed. Shared contract review and independent content approval remain pending;
existing local-test behavior is unchanged. See the
[implementation status](features/career-evidence-recommendations.md) and
[technical proposal](specs/career-evidence-integration.md).

## Owner-authorized local testing, 2026-11-04

After setup stopped on the new pending migration, the owner explicitly requested
applying it and implementing all required local activation so they could test.
The single competency migration and 120 Asgard-authored mappings are now installed
in the normal local environment, preserving all pre-existing private-table digests.
This is a local-test publication exception with independent content/code review
still pending; it does not approve hosted use or claim validated occupational
requirements. See [activation evidence](features/competency-comparison.md#normal-local-test-activation-2026-11-04).

## Docker verification follow-up, 2026-11-04

The resumed competency checks passed the isolated migration/private-state upgrade,
draft/repeat/conflict publication, 21 pinned-container unit/Auth integration cases,
and scoped Chrome persistence/comparison/removal/layout/focus checks. SQL policy
quoting, readback ordering and comparison-trigger contrast were corrected. Normal
migration/activation, real content approval and independent human review remain
pending. See [dated execution evidence](features/competency-comparison.md#resumed-docker-acceptance-2026-11-04).
This does not change final-MVP or hosted release gates.

## Implementation follow-up, 2026-11-04

The owner subsequently approved proceeding with the proposed migration/API scope
and selected Anti Slop during. Skill-profile/comparison source and generated clients
are now implemented. Independent review, database activation, content publication
and end-to-end acceptance remain pending; earlier preparation-only status below is
historical. See [implementation evidence and limitations](features/competency-comparison.md).
No final-MVP release gate is marked complete by this update.


## Bounded implementation request, 2026-11-04

The [2026-11-05 scope resolution](decisions.md#esco-integration-scope-resolution-2026-11-05) supersedes the ESCO deferral in this historical record.

The owner selected the manual skill-profile/comparison increment for all 12 current
careers with Asgard-authored source content, unknown or self-reported levels 0–4,
current records only and existing Profile/roadmap entry points. ESCO download/import,
hosting and additional account controls are deferred from the immediate sequence.
The owner requested end-to-end implementation; migration/shared-contract technical
review and content publication approval remain pending. This resolution supersedes
the accepted-MVP-first prerequisite and external-dataset-first assumption only
for this increment; the remaining packages below stay proposed. See
[session decisions](plans/competency-comparison-2026-11-04.md),
[specification](specs/competency-comparison.md) and
[actual status](features/competency-comparison.md). Historical three-path inventory
and 12,000-byte request-budget descriptions below are not current implementation
status; later content/repair guides own those facts.


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
| PM-F02 Competency profile | Profile ownership/revision patterns; document evidence | Editable normalized competencies, optional resume-assisted review, confirmation and self-report | FUT-01, FUT-13; W02, W03 |
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
and open relevant existing roadmap topics.** Manual skill selection remains
available; W03 also plans optional resume assistance, subject to privacy and
extraction review.

| Increment | Packages | Result |
| --- | --- | --- |
| A: evidence and comparison | W01-W04 | Reviewed source subset, user-managed skills with optional resume assistance, and trustworthy comparisons |
| B: learner journeys | W06-W07, selected individually | Focused career comparison and personal learning guidance |
| C: optional integrations | W09, W11, selected individually | Official assessment and market observations |
| D: final-stage improvements | W05 and W08, after core flows settle | Discovery redesign and one optional bounded counselor |
| Evaluation throughout | W12 | Defined expected results before coding, then technical and participant evidence |

Dependency outline:

```text
W01 shared decisions/contracts
  -> W02 reviewed occupational evidence -> W03 Profile -> W04 comparisons
  -> W05 Discovery revision (owner-scheduled final-stage improvement)
  -> W06 career comparison (basic comparison can precede competency enrichment)
W04 -> W07 development-aware learning guidance
Existing domain reads + W01 tool boundaries -> W08 bounded counselor
W02 reviewed occupation mappings -> W09 official assessment integration
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

- **Roster boundary:** Keep the current twelve Asgard careers with roadmaps as the
  recommendation candidates. Keep broader ESCO occupations and skills in the
  separate reference catalog. An additional occupation becomes an Asgard career
  only through future work that provides an authored roadmap and reviewed mapping.
- The current local reference data already includes a cleared ESCO subset and
  selected O*NET and Philippine source records for the twelve occupational
  profiles. Continue with reproducible imports/manifests, source versions,
  competency records and reviewed occupation relationships; this does not mean
  the full O*NET database is imported or every staged record is cleared.
- Depends on W01. Select future source expansions with the owner and data reviewer.
  Reuse catalog identity and publication.
- Preserve ESCO and O*NET identifiers separately from internal IDs. Crosswalks
  may be one-to-many or unresolved; never equate occupations by title alone.
- Expose capabilities independently: browsing, interest matching, skill comparison,
  roadmap availability and reviewed local evidence. Occupations without roadmaps
  need explicit UI behavior and revised recommendation eligibility.
- Exit checks: repeat import, duplicate/conflict rejection, reference integrity,
  reproducible source versions and human-reviewed mappings. Fixtures are labelled.

### PM-W03: User-confirmed competency profile

- Depends on W01/W02. Profile owns manual competency management, correction and
  removal using the existing account/session/revision boundary. Keep absent,
  unknown and explicitly reported no experience distinct.
- Offer an optional selectable-text PDF resume route alongside manual skill
  selection and skip. Extracted skills appear as suggestions with their source
  passages; the learner confirms or dismisses each and provides their own skill
  report. Resume text alone does not set experience levels.
- Preserve the existing private document lifecycle. Resolve consent, extraction
  method/provider, retention, replacement, deletion and cleanup of derived text
  before implementation. Keep OCR and other file formats in FUT-09.
- Use the existing 0-4 scale with clear self-report labels; it is not a validated
  certification. Unknown must remain distinct from explicitly reported Level 0.
- Store presence/confirmation, proficiency, evidence and target availability as
  separate attributes. They cannot be represented by one exclusive status enum.
- Exit checks: owner/other-user/anonymous access, stale writes, unknown readback,
  corrections and removal; extraction quality and source passages; replacement
  races, failed cleanup, cross-account denial and invalidation of dependent
  outputs. Preserve profile history consistent with retention policy.
- Manual reporting works without resume upload. Neither extracted text nor job
  titles, institutions or Done status set experience levels automatically.

### PM-W04: Skill comparison and recommendation integration

The core twelve-career occupational database and skills-aware recommendation
integration are already active locally. The ESCO-backed recommendation release
is staged. On 2026-11-06 the owner directed that W04 include its local activation
without the two-model quality evaluation. Record that evaluation as waived/not
run, not passed; this does not authorize hosted publication or establish quality.

Show durable recommendation results on the existing Recommendations page.
The owner removed the Dashboard shortcut on 2026-11-06. Do not add a
notification screen. Keep Roadmap focused on the authored learning path, with no
skill-comparison panel. Show W04 skill comparisons only through each result's
“Why this was suggested” and expandable “Evidence used” sections. Keep W06's
two-career comparison on its separate page. The Round 1 presentation cleanup is
implemented in source and manual acceptance is pending.

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

The current Discovery flow remains available. Schedule this redesign as the
final improvement after the other learner journeys and their presentation have
settled. This defers only revised questions or interaction design, not the
existing Discovery feature.

- Depends on approved content and W01 where contracts change. Preserve existing
  five-theme conditional sessions; the proposed 8-10-question route is new content.
- Review wording, branches, ambiguity, inactive answers and old-session support
  before publishing a new questionnaire version. Do not mutate saved meanings.
- Exit checks: blank entry, conditional Back/edit, save/resume, version compatibility,
  explicit retakes and exclusion of inactive answers from recommendation context.
- Official assessment is W09, not a score inferred from informal Discovery answers.

### PM-W06: Career comparison and saved alternatives

The owner selected a focused two-career comparison. Make career differences the
primary content; keep saved careers and private notes available as secondary
actions. The current implementation still needs a presentation pass to match
this direction.

- Depends on catalog reads; W03/W04 are needed only for competency enrichment.
- Begin with source-backed career activities, learning coverage and user priorities.
  Add saved alternatives through reviewed account-owned contracts.
- Preserve current focus/progress when viewing, comparing or shortlisting careers.
- Exit checks: actual records, unavailable capabilities, saved-state isolation,
  refresh persistence and manual comprehension of compare versus select focus.

### PM-W07: Personal learning guidance and reflection

The persistence and API are active locally, but the owner directed that the
added W07 practice and reflection UI be removed from Roadmap and Dashboard for
now. Restore the simpler authored-roadmap presentation while preserving the
existing API and learner records for a later redesign. The Round 1 UI cleanup
is implemented in source and manual acceptance is pending. [Implementation, verification and rework direction](features/learning-guidance-and-reflection.md)

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

The owner advanced W08 source implementation on 2026-11-06. Review and local
activation remain pending. See the [current implementation record](features/ai-guidance.md).

The owner chose to keep W08 as a final-stage optional improvement after the core
app flows are settled. It is not required for the current delivery. W01's
architecture decision remains a prerequisite before implementation.

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

The owner moved selectable-text resume reading into W03 Profile on 2026-11-06.
W10 remains as a roadmap identifier for traceability, with no separate delivery
package. Its consent, confirmation, retention, replacement, removal and cleanup
requirements are included in W03. OCR and additional document formats remain in
FUT-09.

### PM-W11: Philippine labor-market observations

The owner kept W11 optional on 2026-11-06. DICT/NICS and Philippine Skills
Framework material already present in Asgard describes occupational competencies;
it does not supply current job-listing observations. W11 is a separate future
option and no collection is authorized by this plan decision.

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

The owner selected practical product evidence as the current scope. Record which
checks and guided user-facing acceptance were completed, what was not checked,
and known limits. The two-model research evaluation, participant study,
psychological outcome claims and research paper are deferred unless the owner
later selects a research goal. Do not label unrun checks as passed.

- For a future research goal, assign a research owner, reviewers, participants
  and institutional requirements before collecting participant evidence.
- Define expected technical results for normalization, comparison, retrieval,
  explanation support, uncertainty, permissions and removal when those behaviors
  are being implemented or materially changed.
- Keep technical correctness, usability and decision-support usefulness distinct.
  A browser walkthrough does not establish a psychological or employment outcome.
- Report failures, reviewer disagreements, latency and resource use when those
  measures are part of a selected evaluation.
- Current exit: a reproducible product record that matches the work actually
  completed. A research paper is not required for product delivery.

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
