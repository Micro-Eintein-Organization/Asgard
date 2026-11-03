# Research consolidation and feasibility review

Created/last updated: 2026-11-03. Status: completed document review; proposed research scope, human/adviser review pending. No feature implementation or approval-status change.

Deliverable: [consolidated paper](asgard-consolidated-paper.md). This review records editorial choices, source limits, and the relationship to project plans. It does not supersede them.

Revision completed, 2026-11-03: the [paper](asgard-consolidated-paper.md) now reflects the user's combined contribution of career recommendations, skill-to-career comparison, and learning guidance, using source-grounded rules and bounded AI assistance. The [original-paper alignment review](original-paper-alignment-review.md) records retained aims, agent/vacancy exclusions and additional agreed changes. The [rule-based methodology plan](rule-based-methodology-plan.md) supersedes this initial review's narrower editorial recommendation; historical draft assessments below describe the first consolidation. Final artifact evidence is in [verification](verification.md).

## Review scope and approach

Task: compare three supplied team drafts with the current project baseline and all ten post-MVP feature plans, assess feasibility, and produce a consolidated paper. Acceptance for this document task: retain the team's career-support purpose; distinguish delivered capabilities from proposals; map all ten plans; qualify citations; supply a research method without fabricated results; check references and document rendering. No existing task/acceptance IDs have been renamed or marked passed.

Work was limited to new research artifacts. The active branch was `codex/connected-prototype`; this is research documentation, not Stages 1-4 foundation implementation. Numerous existing documentation edits and the source-preparation folder were present and left unchanged. No service, database, dependency, shared contract, commit, or publication operation belongs to this task.

Reviewed authority and context: [README](../../README.md), [architecture](../architecture.md), [product](../product.md), [decisions](../decisions.md#local-evaluation-mvp-resolution-2026-11-02), [development](../development.md#current-local-mvp-status-2026-11-02), [journeys](../user-journeys.md), [pages](../pages-and-interactions.md), [Discovery](../specs/discovery.md), [recommendations](../specs/career-recommendations.md), [verification](../verification.md#ai-quality-gate), [future development](../future-development.md), [roadmap](../post-mvp-roadmap.md), [first increment](../post-mvp-first-implementation.md), [datasets](../plans/post-mvp/datasets.md), and [source readiness](../plans/post-mvp/source-readiness.md). Current-status sections govern historical inventories. Source inspection included recommendation schemas and module locations; no new runtime acceptance was attempted.

## Overall assessment

The team has a viable research direction, but the fullest draft promises more than current plans support. Its strongest elements are explainability, personal context, occupational information, and actionable learning guidance. The latest plans make these defensible through human confirmation, explicit uncertainty, deterministic comparison, source review, and curated topic links.

Two studies are possible. A study of current exploration, recommendation explanations, and roadmap usability can use the existing local build after its applicable checks. The consolidated paper proposes a development-and-evaluation study of the next manual competency-comparison increment. That study requires implementation and acceptance before participant claims can be made. It cannot be submitted as a completed experiment with the evidence currently available.

The paper narrows the research population to adult Philippine CS students. This is an editorial proposal matching the drafts and current 18+ eligibility, not an approved change to the wider product audience. The all-ages aspiration, younger-user consent, and broader career-shifter population remain unresolved or separate product/research decisions.

## Treatment of the three supplied drafts

| Draft | Retained contribution | Necessary correction |
| --- | --- | --- |
| A: AI Career DSS for Philippine CS students | Local context, occupational evidence, explainability, learning actions | Remove assumed existing multi-agent architecture; distinguish occupational references from market observations; replace unsupported percentage alignment; qualify continuous collection; add a research design |
| B: Career confidence and AI guidance | Filipino decision-efficacy context, usability, usefulness, user interpretation | Confidence is an outcome requiring a suitable measure/design; classifier accuracy is not career success; do not treat a short task study as psychological validation |
| C: Resume parsing, gaps, and roadmaps | Practical connection between experience and learning; correction-worthy evidence chain | Resume parsing is deferred, not the current main input; missing terms do not prove missing ability; exclude unsupported accuracy claims, broader populations, and unchecked citations |

The drafts' background sections overlap heavily. The consolidated paper uses one argument: students need inspectable connections between personal information, occupations, and learning. It avoids asserting that counseling generally fails or that no comparable system exists worldwide. The research contribution is a bounded evaluated workflow, not an unsupported first-ever claim.

## Feature-by-feature reconciliation

| Current plan | Evidence/status | Feasible treatment in the paper |
| --- | --- | --- |
| [PM-F01 Discovery](../plans/post-mvp/pm-f01-discovery-assessment.md) | Saved conditional Discovery exists; revised content/official assessment proposed | Reuse current Discovery. New wording needs version/comprehension review; official assessment is separate from informal questions |
| [PM-F02 Competency profile](../plans/post-mvp/pm-f02-competency-profile.md) | Names/preferences exist; manual normalized records proposed; PDF disabled | Core increment: manual confirmed records, unknown experience, correction/removal. Rubric and lifecycle need review. PDF follows separately |
| [PM-F03 Occupational knowledge](../plans/post-mvp/pm-f03-occupational-knowledge.md) | Authored labels and provisional source pilot exist; accepted mappings absent | Core prerequisite: review source releases, stable identities and relationships before dependent contracts |
| [PM-F04 Recommendations](../plans/post-mvp/pm-f04-recommendations.md) | Bounded saved AI lifecycle exists; full quality corpus pending | Evaluate current explanations. New competency input, retrieval, and invalidation remain later reviewed additions |
| [PM-F05 Skill comparison](../plans/post-mvp/pm-f05-skill-comparison.md) | New deterministic behavior; proposed cases not passed tests | Central research increment: categorical evidence, source/profile versions, unknown states, stale-removal behavior; no readiness percentage |
| [PM-F06 Career comparison](../plans/post-mvp/pm-f06-career-comparison.md) | Catalog reads reusable; shortlist/side-by-side behavior proposed | Basic content comparison can be prepared independently; saved alternatives are outside the core increment |
| [PM-F07 Learning guidance](../plans/post-mvp/pm-f07-learning-guidance.md) | Curated topics/progress exist; reviewed competency links proposed | Core increment includes reviewed topic links only. Full personal suggestion lifecycle and generated pathways are separate |
| [PM-F08 Reflection](../plans/post-mvp/pm-f08-reflection.md) | Progress exists; reflection/reassessment proposed | Optional later study. Does not infer proficiency or trigger recommendations automatically |
| [PM-F09 Counselor](../plans/post-mvp/pm-f09-ai-counselor.md) | No counselor/tool loop exists | Later bounded read-only tool proposal with architecture and adversarial evaluation; no multi-agent dependency |
| [PM-F10 Market context](../plans/post-mvp/pm-f10-market-context.md) | No accepted national observation pipeline | Later permitted, dated batch observations; O*NET/PSF do not demonstrate current Philippine vacancy demand |

This covers all ten plans, not every historical sentence or every artifact in the repository. The [Stage 5 task list](../Asgard-Stage-5-Team-Task-List.md#current-assignment-status--2026-11-02) retains current assignment/review status; this paper assigns no teammate and claims no integration approval.

## What is possible and what blocks it

### Current-build evaluation

Students can potentially evaluate career browsing, current Discovery, supported suggestion explanations, roadmap navigation, and learning saves in a controlled local setting. Before recruitment, resolve protocol/privacy needs, applicable current browser/content acceptance, and AI quality checks for any provider outputs shown. Existing technical records cannot be substituted for study observations.

### Recommended core study

Follow the existing sequence: reviewed two-career evidence pilot, occupational relationships, manual records, deterministic comparison, reviewed topic links. Assess source coverage across all 12 current careers, but do not imply all 12 support enriched comparison. Data Analyst has an exact local role candidate; Frontend currently has a broader software-role candidate needing review. An unresolved mapping is a legitimate finding, not a reason to silently import unrelated requirements.

Dependencies are provenance/rights review; accepted mapping and comparison interpretation; reviewed product/rubric/lifecycle choices; affected schema/API and ownership review; implementation; focused technical/security checks; content/comprehension review; then the participant study. PM-I1-01 through PM-I1-12 remain proposed acceptance criteria in their owning plans. They have not passed through this document work.

### Separate extensions

PDF extraction requires privacy/provider activation, confirmation/removal semantics, and its synthetic document suite. Transcript parsing and OCR add format/interpretation work and are not included by mentioning resumes. Official interest assessment needs a selected instrument, faithful scoring, and mappings. A counselor needs a reviewed tool inventory and baseline comparison. Philippine observations need permitted sources and collection/freshness ownership. None is a prerequisite to the manual pilot. No delivery date, cost, or capacity estimate can be substantiated from the present evidence.

## Claims corrected in the consolidated paper

| Earlier claim or implication | Consolidated treatment |
| --- | --- |
| Existing Student Career Assistant multi-agent system | Actual foundation is a modular monolith with bounded provider calls |
| 57 percent aligned means career fit | No validated denominator, weighting, target scale, or interpretation; excluded |
| Documented skill proves competence | Document text is a statement; later confirmation is still not assessment |
| Missing skill means deficit | Unassessed, explicitly no experience, and unavailable target remain distinct |
| Source level 3 equals student level 3 | Different frameworks/scales retain meanings; crosswalk not accepted |
| O*NET describes Philippine employer demand | Supplementary occupational information, not national observations |
| Completion means mastery | Activity records remain separate from competence |
| AI generates a replacement curriculum | Reviewed existing topics remain canonical; personal guidance is separate |
| Confidence/anxiety improves | Proposed outcome only with a justified measure/design; no causal result claimed |
| No system already addresses this problem | No exhaustive systematic search establishes that claim; bounded contribution instead |
| Flow checks completeness after ranking and bypasses ranking on retry | Validate operation-specific inputs before dependent processing; preserve browsing and uncertainty |

## Literature and citation review

Verification below means the accessible primary record supported the limited statement used. It does not mean every full paper was read. The review was targeted, not a systematic literature review. Access limitations are not evidence that a source is false.

| Supplied reference/group | Finding and treatment |
| --- | --- |
| Abaya-Garcia and Ballada (2017) | Journal abstract and DLSU repository record verified. Four factors supported. Repository citation format differs; paper follows journal author display and repository volume/pages. No software-effect claim imported |
| Faruque et al. (2025) | Publisher abstract/metadata and data-availability description verified. Career labels are desired fields, not observed employment outcomes. Full subscription text not examined; paper restricts claims accordingly |
| Gedrimiene et al. (2024) | Publisher primary page verified: online publication 2023, journal volume year 2024, 106 participants. Use 2024 consistently; benefits and difficulties retained without claiming Asgard outcomes |
| Fabo and Kurekova (2022) | ILO primary publication verified. Replace draft's generic ILO Research Repository attribution with named authors. Coverage/bias caution retained |
| Peffers et al. (2007) | Added research-method reference; publisher metadata/abstract verified. Journal year is 2007 despite later online page date |
| O*NET scale guidance | Official documentation verified. Importance, level, descriptor-specific anchors and suppressed information require distinct interpretation |
| Philippine frameworks | AAP primary framework page, TESDA hosting of Analytics/AI framework, and official DICT NICS PDF located. Local copies are separately inventoried; new web verification does not resolve their exact acquisition provenance or accept mappings |
| Rashid et al. (2022) | DOI supplied, direct primary retrieval unavailable in this session. Retain as a follow-up candidate; omit specific algorithm/limitation claims from final paper until primary text verified. Duplicate draft entry removed |
| Petrican et al. (2017); Paudel and Shakya (2017); Celsi et al. (2022) | Potentially relevant skill-matching/normalization work; full primary verification not completed. Not relied on in the consolidated paper |
| Bringula et al. (2016); Austria (2025) | Local employability/curriculum evidence candidates; methods, findings and publication status not verified here. ResearchGate DOI alone does not establish peer review. Excluded as claim support pending verification |
| DOLE (2024); DOLE-ILS (2022); IMF (2025); generic ILO AI exposure claim | Draft lacks sufficient exact report/title/page detail. No unsupported report claim carried forward |
| Al-Otaibi (2012); de Ruijt and Bhulai (2021); Escudero et al. (2024) | Relevant review/method candidates; not needed for the bounded argument and not fully verified. Correct the malformed author entry containing “Nl” before reuse |
| Toheed et al.; Mullarkey and Edwards | Primary chapter content not retrieved. Toheed year inconsistent within draft and secondary records; exact author/year need primary confirmation. No ten-agent implementation/effectiveness claim retained |
| Nandi et al. (2025); Fawaid et al. (2025) | Supplied IEEE identifiers not enough to verify described method/results in this review. Higher-education staff career management is also a different population/use case. Excluded pending primary review |
| Nguyen et al. (2024), DOI 10.7717/peerj-cs.1786 | Primary page access blocked. Secondary search suggests title “Intelligent search system for resume and labor law”; does not verify every paraphrased skill-graph claim. Candidate only, excluded from final support |
| Kulkarni and Joshi; Sharma et al.; Verma et al. | Supplied claims/authorship not independently verified. A project showcase is not automatically peer-reviewed research. Excluded |
| Deshmukh and Bhosale (2024) | Supplied PDF identifier contains 2507, requiring a year/metadata check; this alone does not establish the correct date. Excluded pending verification |
| Thorat and Patil; Shinde et al. | Supplied links point to Google search results instead of primary articles. Do not cite these as verified publications |

The first consolidated paper included eight references whose accessible primary records supported its restricted claims. The revised version adds Watson's DSS framework discussion as its ninth reference. A thesis may require a larger literature review; add primary-verified studies with methods, populations, outcomes, and limitations rather than padding the reference count.

## Research decisions still needed

The adviser/research team must settle institutional format, author/affiliation details, ethics route, recruitment institution, participant criteria, final outcome measures, sample justification, and analysis plan. The proposed counterbalanced task comparison is a research option, not a recorded approved protocol. A validated confidence instrument, if selected, needs exact-version/access and suitability review. The paper therefore contains no sample-size promise or completed-results section.

The research-data withdrawal procedure needs explicit review because app account deletion is deferred. A study must not promise a working deletion feature or collect sensitive documents merely because storage code exists. Applicable privacy/ownership checks and provider approval precede real-data transmission.

## Verification and handoff

This task creates research documents only. No feature guide is required because no application behavior changed. The backlog and source plans are unchanged: their statuses and scope remain authoritative. The paper is for human/adviser review, not integration or release acceptance.

Final artifact checks and PDF inspection are recorded in [verification record](verification.md). Application tests, live services, provider evaluation, participant tasks, and dataset semantic acceptance were not run in this task. Historical evidence is cited through owning documents rather than reported as newly passed.

Recommended handoff: review the paper's population and questions; accept/revise the two-career evidence interpretation; complete the bounded implementation reviews; deliver and verify the manual comparison journey; approve the participant protocol; collect and analyze results; then replace proposal language with evidence-supported findings.
