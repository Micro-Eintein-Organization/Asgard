# Asgard DSS scope review and paper revision plan

Created/last updated: 2026-11-03. Status: user-clarified research direction; proposed paper revisions and delivery sequence. No feature implementation authorized or acceptance claimed.

Latest methodology proposal: [rule-based methodology and evaluation plan](rule-based-methodology-plan.md). A custom numerical/statistical career model is not required for the proposed bounded decision-support claims. Its discussion of necessary versus conditional evidence governs interpretation of the optional aggregation and ablation proposals below; existing project quality gates remain unchanged. The rule method and selection policy still require review.

## User clarification and boundaries

The user clarified that the main contribution should combine career recommendations, skill-to-career comparison, and learning guidance. Matching students to specific vacancies and employer recruitment/placement are excluded. Philippine job-posting analysis is optional future work if time, a defensible methodology, and suitable data permit. The application should support career decisions; learning delivery and completion tracking must not become the primary research contribution.

This clarification supersedes the earlier editorial recommendation to center the entire paper on the manual comparison increment. That increment remains a sensible implementation stage. It does not define the full research contribution. Follow-up on 2026-11-03: the [paper](asgard-consolidated-paper.md) and PDF have now been revised; the [original-paper review](original-paper-alignment-review.md) and [verification](verification.md) describe the final revision and its limits.

Planning scope: review the combined decision workflow, map current and proposed capabilities, specify paper changes, dependencies, and evaluation. Implementation, new schemas/APIs, source mappings, scoring methods, research recruitment, and publication retain their existing review gates. This record does not promote deferred features to implemented/accepted status. The product, [decisions](../decisions.md), [architecture](../architecture.md), and owning specifications remain authoritative.

## Assessment: how Asgard can function as a DSS

The relevant decisions are: which careers should I investigate; how do alternatives differ; what does my recorded experience tell me and leave uncertain; and which learning action would help me explore or prepare further? A DSS contribution can be built around those questions without actual vacancy matching, a multi-agent framework, or an overall fit percentage.

Watson's discussion of Sprague's DSS framework identifies dialog, data, and models as a useful structure. Applied here, the dialog is the student's exploration and correction of inputs; data comprises permitted personal records and reviewed career/competency information; models comprise bounded recommendation and explicit comparison rules. This is a design interpretation, not proof that the present implementation has demonstrated decision effectiveness. [Watson (2018)](https://aisel.aisnet.org/cais/vol42/iss1/13/).

EDUCAUSE describes an LMS in terms of course administration, analytics, and delivery. Asgard's roadmaps and progress records overlap with some learning-support functions, but those functions alone do not settle its research identity. The distinction should be demonstrated by the supported decisions and evaluation outcomes. There is no need to remove useful progress tracking or add agents simply to justify the DSS label. [EDUCAUSE LMS overview](https://library.educause.edu/topics/teaching-and-learning/learning-management-systems-lms).

The practical risk is that students only receive a path and check off topics. To make the proposed DSS contribution convincing, they should also be able to examine alternatives, inspect reasons and limitations, correct personal evidence, and make an informed choice about a next action. A learning action may be a small exploratory activity; it need not commit the student to a career or imply remediation of a measured deficit.

## Core contribution and terminology

Proposed central contribution: an integrated career decision-support workflow that combines explained career recommendations, reviewed skill-to-career comparisons, and relevant learning guidance while preserving student choice and uncertainty.

| Capability | Decision supported | Scope/status |
| --- | --- | --- |
| Explained career recommendations | Which careers are worth investigating, and why? | Core contribution; existing local suggestions, quality evaluation pending; competency enrichment proposed |
| Skill-to-career comparison | What reported experience is relevant, what is unassessed, and what information is unavailable? | Core contribution; new reviewed records/mappings/comparison needed |
| Learning guidance | Which activity or topic should I consider next, and why is it relevant? | Core contribution; existing curricula, reviewed competency links/personal suggestions proposed |
| Career-to-career comparison | How do alternative careers differ in work and learning implications? | Proposed supporting decision task; minimal presentation to review, saved shortlist not required initially |
| Roadmaps and progress | Where can I act on a choice and resume? | Supporting existing capability; completion does not establish mastery |
| Job-posting observations | What appeared in a dated, bounded Philippine sample? | Optional extension only; methodology/data/permissions not established |
| Vacancy matching | Which specific advertisement should this student apply to? | Excluded |
| Recruitment/placement | Which candidate should an employer select or place? | Excluded |
| Agentic counselor or specialist agents | Conversational or delegated assistance | Separate future proposal; no core dependency or implementation promise |

Use “career recommendation” for exploration suggestions and “skill-to-career comparison” for competency evidence. Avoid “job matching,” which can imply specific vacancies or employer selection. Use “skill gap” only with a stated meaning. The initial method identifies unassessed areas and self-reported learning needs; a measured proficiency shortfall requires compatible reviewed targets and an assessment method.

## Review against current plans

The [roadmap](../post-mvp-roadmap.md) already contains all three core areas, but its staged delivery must not be mistaken for the research contribution being only the first stage.

- [PM-F01 Discovery](../plans/post-mvp/pm-f01-discovery-assessment.md) supports interests/context. An official instrument remains separate; informal responses are not assessed competence.
- [PM-F02 manual records](../plans/post-mvp/pm-f02-competency-profile.md) and [PM-F03 occupational knowledge](../plans/post-mvp/pm-f03-occupational-knowledge.md) supply the reviewed evidence foundation. PDF is a later input method, not an agentic dependency.
- [PM-F04 recommendations](../plans/post-mvp/pm-f04-recommendations.md) is a core research pillar. Current eligible context must remain unchanged until competency integration, retrieval, and invalidation rules are reviewed.
- [PM-F05 comparison](../plans/post-mvp/pm-f05-skill-comparison.md) makes personal evidence inspectable without unsupported numeric suitability.
- [PM-F06 career comparison](../plans/post-mvp/pm-f06-career-comparison.md) can strengthen alternatives analysis. Review a minimal comparison using existing fields before adding shortlist persistence or weighted ranking.
- [PM-F07 learning guidance](../plans/post-mvp/pm-f07-learning-guidance.md) connects a decision to a practical next step. Curated topics remain authoritative; guidance must explain relevance and missing coverage.
- [PM-F08 reflection](../plans/post-mvp/pm-f08-reflection.md) can later support reconsideration, but optional reflections must not silently become proficiency or preference evidence.
- [PM-F09 counselor](../plans/post-mvp/pm-f09-ai-counselor.md) is separate future architecture. Its absence does not prevent recommendations, comparison, or learning guidance.
- [PM-F10 market context](../plans/post-mvp/pm-f10-market-context.md) remains optional and descriptive. It supplies no existing permission or methodology for vacancy matching.

The existing [first-increment plan](../post-mvp-first-implementation.md) remains compatible as the first implementation stage: evidence pilot -> occupational relationships -> manual records -> categorical comparison -> reviewed topic links. PM-I1-01 through PM-I1-12 cover that stage, not the whole integrated DSS or successful student outcomes. No new feature acceptance IDs are assigned by this research record.

## Delivery and research sequence

### Stage 1: Review the evidence and decision tasks

Complete the existing two-career pilot review and assess coverage across all 12 current careers. Data Analyst and Frontend Developer remain candidates, not accepted equivalences. Preserve unresolved mappings and differences in source scales. Define expected cases for recommendations, comparisons, learning relevance, and student interpretation before coding. Use the [dataset plan](../plans/post-mvp/datasets.md) and [source-readiness record](../plans/post-mvp/source-readiness.md).

Exit: accepted pilot relationships and task scenarios, explicit limits, proposed topic associations, and bounded contract/implementation plans reviewed in the appropriate areas. No document may claim nationwide employer requirements from these references.

### Stage 2: Deliver the comparison foundation

Implement the reviewed manual comparison journey through the existing PM-I1 criteria. Preserve ownership, correction/removal, revisions, catalog identities, and learning state. Link accepted relevant topics without automatically changing focus or completion. Existing recommendations continue using their existing permitted inputs at this stage.

Exit: focused service/security/contract and guided UI checks, reviewed content, and the required feature implementation guide. This is an intermediate technical deliverable, not completion of the combined research contribution.

### Stage 3: Connect and evaluate the full decision workflow

Present recommendations, career information, skill comparisons, and learning guidance as related decision activities. Review a minimal way to inspect alternatives, reusing catalog information where possible. This might initially use existing navigation; it does not automatically require new saved comparisons or a redesigned interface.

Consultation follow-up: the intended direction is to consider both interests and recorded experience without disqualifying an interest-led career solely for limited current skills. The methodological review below supersedes the earlier suggestion to keep skills out of candidate selection merely for simplicity. Use PM-F04's reviewed evidence/retrieval/invalidation work before implementing that direction. Do not imply that saving a skill has changed a suggestion when it has not. Exact candidate selection, preference/trade-off rules, and evaluation remain proposals requiring review.

Exit: students can inspect options and reasons, distinguish personal statements from occupational references, choose a useful next action, and revise an input or choice without corrupting progress. Integration checks and human task evidence must support this claim.

### Stage 4: Conduct the approved student study

Evaluate the complete decision workflow after applicable technical and protocol gates. Existing five-person comprehension work can identify failures before a larger study; it cannot establish general effectiveness. Sample size, institution, measures, and comparative design remain research decisions.

Use tasks such as: explain why two careers are worth exploring; identify a relevant difference; distinguish an unassessed skill from explicitly reported no experience; choose a topic and justify its connection to a career; correct a record and interpret the updated comparison. Include cases where the appropriate response is to seek more information or decline a recommendation.

Completion counts, streaks, time on site, and course consumption can be secondary observations. Primary outcomes should address evidence-supported explanations, comparison correctness, understanding of alternatives/uncertainty, and usefulness for making a reasoned choice. Do not define success as agreement with the system's first suggestion.

### Optional later market study

Only propose a bounded Philippine posting sample after identifying permitted sources, a collection period, role/geographic coverage, extraction and deduplication rules, annotation/review, and responsible maintenance. Report results as sample observations. Time alone does not resolve these dependencies. This extension must not become an implicit requirement for completing the core DSS paper, and it must not silently reintroduce vacancy matching.

## Paper revision plan

Proposed title: **Asgard: Design and Evaluation of an AI-Assisted Career Decision Support System Integrating Career Recommendations, Skill Comparison, and Learning Guidance**. Retain proposal language in the manuscript until evaluation has actually occurred. Population wording can remain Philippine CS students; research eligibility remains subject to the current adult boundary and protocol review.

| Paper section | Revision |
| --- | --- |
| Abstract/introduction | Give the three core functions equal prominence and state the actual career decisions supported |
| Related work | Add a primary-verified DSS foundation and explain the role of learning support; retain verified prior career-support research without agentic promises |
| Problem/research questions | Ask whether the combined workflow supports understandable, reasoned career and learning choices; retain technical comparison/explanation questions |
| Objectives | Include career suggestions and their evidence, skill comparison, and relevant learning actions as substantive outputs; treat data preparation as an enabling objective |
| Scope | Exclude vacancy matching and recruitment/placement; describe posting observations as optional future research; distinguish current build from proposed additions |
| Conceptual framework | Show personal information plus occupational evidence feeding recommendations/comparison, followed by student judgment and optional learning action/reconsideration |
| Methodology | Evaluate the integrated journey and its individual components; do not equate valid JSON, progress saves, or satisfaction with decision effectiveness |
| Expected contribution | State the combined DSS contribution; distinguish implementation stages from research contribution |
| Limitations/future work | Retain uncertain self-report, coverage and assessment limits; place agents, PDF activation and posting analysis in their appropriate separately reviewed extensions |

Proposed revised general objective: To develop and evaluate an AI-assisted career decision support system that integrates explained career recommendations, source-backed skill-to-career comparison, and relevant learning guidance to support informed career exploration and next-step decisions among adult Philippine Computer Science students.

The revised paper should give one worked example across the three functions without inventing an accepted source mapping or study result. Use an explicitly illustrative case until reviewed pilot data can support it. Explain that a student's correction may update comparison immediately while recommendation refresh follows the approved context rules.

## Decisions still requiring consultation or review

The user has settled the combined contribution and vacancy/placement exclusions, and expressed the direction that skills should inform similarity while interests remain meaningful even when experience differs. Remaining choices are how the two criteria influence candidate selection and ordering; whether existing navigation sufficiently supports comparing alternatives; the experience-input wording and any validated target interpretation; and final study measures, recruitment, sample justification, and ethics. None requires inventing an agent architecture or collecting vacancies first.

Recommended direction for the next paper revision: describe all three core functions, retain staged delivery, and develop the multi-criteria methodology below. Avoid promising validated personalized ranking until its method and evidence are established. Saved shortlists, official assessments, and conversational counseling remain separately scoped. Numerical aggregation is neither required nor rejected solely on complexity; current project restrictions on suitability percentages still apply.

## Methodological re-review: logical soundness

Consultation date: 2026-11-03. The user asked to judge logical soundness independently of simplicity or complexity. Earlier conversational recommendations that interests alone should select careers, or that separating dimensions makes the method valid, were not sufficiently justified. This section replaces those recommendations with an explicit research-method proposal. It is not an approved feature contract or a validated algorithm.

### Define the claim before the algorithm

The proposed decision objective is to identify careers worth exploring given the student's current expressed interests and reported experience, and explain relevant development opportunities. This is not prediction of the student's objectively best career, current readiness, or future employment success. Those outcomes would need different measurements, labels and longitudinal evidence.

Interest alignment means a supported relationship between expressed preferences and occupational activities. Skill similarity means a supported relationship between recorded experience and reviewed career competencies. Neither implies the other. O*NET itself treats occupational interests, skills and their rating scales as distinct descriptors; its documentation does not authorize converting Asgard's informal Discovery or proposed self-report rubric into an equivalent assessment. [O*NET scale documentation](https://www.onetonline.org/help/online/scales).

### Recommended model family

Develop an evidence-grounded multi-criteria recommender with explicit handling of unknown evidence and interest/experience conflicts. Both criteria may contribute to candidate discovery and recommendation reasons. Maintain separately interpretable evidence before any aggregation. This is a methodological recommendation for Asgard, not a claim that one model family is universally superior. Multi-objective recommender research documents the need to define competing goals and evaluation rather than assuming a single accuracy objective. [Research overview](https://arxiv.org/abs/2210.10309).

Proposed processing responsibilities:

1. Create reviewed mappings from permitted interest statements to occupational activities and from confirmed experience records to career competencies. Mere text similarity is not evidence of equivalent meaning or competence.
2. Form candidates from careers supported by interest evidence, experience evidence, or an explicit student exploration request. For the bounded catalog, evaluate all supported careers where practical; if retrieval is used, test that it does not lose relevant candidates before ranking. Explicit exploration does not manufacture favorable evidence or override missing mappings.
3. For each supported career, retain the interest evidence, experience evidence, unassessed information, mapping coverage, and source/profile versions independently. Missing records are not zero skill or negative preference. Where numerical comparison is not justified, keep the source-native/categorical result.
4. Apply a reviewed recommendation policy to choose and, if needed, order suggestions. Skills can influence this decision; interests cannot be silently overridden by a skill-only rule. A low-experience career can remain an exploration candidate with supported learning implications.
5. Present reasons tied to actual contributing evidence and retrieve reviewed learning links. AI explanation must describe the actual selection policy; plausible post-hoc prose is insufficient. If an LLM participates in selection, its prompt/model/schema and observed variability form part of the method and must be evaluated.
6. Recompute affected results under the approved revision/refresh protocol when students change interests or experience. Do not infer changed interests from topic completion, and do not assume future interests from the fact that interests can change.

Candidate eligibility and final selection are distinct. With the current maximum of three AI suggestions, keeping a career eligible does not ensure it appears in the displayed list. The policy must specify truncation, ties, contradictory evidence and catalog coverage; an explicitly selected career must remain explorable without needing to win the recommendation ranking. A broad interest label also does not justify recommending every career in its category.

### Resolve trade-offs rather than conceal them

An interest-aligned career with little recorded experience and an experience-aligned career with weak expressed interest have different strengths. Neither is automatically superior for this exploration objective. The system must expose that conflict and use a documented decision rule for any preference it expresses.

Possible rules include user-elicited priorities, a reviewed noncompensatory policy, or a justified aggregate utility model. These are alternatives to assess, not three additional features to promise. A weighted sum is not inherently illogical: it requires defensible criterion meanings, scale properties, trade-off assumptions and weights. Arbitrary weights or min-max normalization do not supply those justifications. A score may express a defined preference model without being a probability of career success; current Asgard policy still prohibits presenting suitability percentages.

Likewise, a Pareto comparison can identify trade-offs among comparably measured criteria but does not select a unique best career or solve missing data. A deterministic rule can consistently reproduce a bad policy. A complex model can be logically coherent but empirically unsupported. The review must examine assumptions and evidence for either.

Recommended next methodological deliverable: a decision table for agreement/conflict/missing-evidence cases, plus one proposed selection rule and its rationale. Choose that rule through product/research review, then freeze it before evaluation. Do not keep the core selection mechanism as unspecified “AI matching.”

### Current substantive gaps

| Gap | Why it affects validity | Evidence needed |
| --- | --- | --- |
| Discovery is informal, not a validated interest instrument | Numeric interest affinity cannot be assumed from a handful of authored categories | Reviewed statement/activity mappings and comprehension/content evidence, or separately approved faithful instrument integration |
| Occupational mappings are provisional | A correct algorithm can compare the wrong career or source breadth | Accepted role/competency mappings and coverage limits from the pilot |
| Experience descriptions and source targets are not calibrated | Numerical subtraction or mastery conclusions could be meaningless | Reviewed categorical semantics; compatible assessment/target method before proficiency gaps |
| Recommendation trade-offs and truncation are unspecified | Relevant interest-led careers may disappear before the student sees them | Explicit candidate/selection/tie/missing-data policy and reviewer cases |
| No objective best-career labels exist in current evidence | Preference labels, expert judgments and employment outcomes measure different things | Predefined relevance rubric and task outcomes; appropriate longitudinal design only if outcome prediction is claimed |
| Learning links are not yet accepted | Recommending a topic does not establish that it addresses the identified need | Reviewed competency-to-topic rationale and coverage |

### Evaluation needed to defend the model

Test logical behavior with reviewed cases: aligned interests/experience; strong interest with explicitly low experience; strong experience with explicitly low interest; unknown interests; unknown skills; conflicting or broad mappings; corrected/removed records; changed interests; no supported career; and more relevant candidates than the display limit. Record exact expected behavior before execution. The policy that low skills alone do not veto an interest-led career comes from the user's intended decision objective; it is a design constraint, not an empirically proven law of career counseling.

Evaluate candidate coverage separately from selection relevance, evidence correctness, explanation faithfulness and learning-link relevance. Compare the proposed combined method against interest-only and experience-only baselines on the same cases. This ablation tests whether combining evidence helps or introduces harmful suppression; it does not presume that the combined method must win. Include reviewers who assess relevance independently rather than defining the ground truth as the method's own outputs.

If weights or thresholds are adopted, inspect sensitivity and rank reversals under plausible variations. Record missing-data behavior and source-coverage effects. Check repeated model runs for material inconsistency, and confirm whether changes follow actual inputs. Existing F-002 structural/security/quality gates remain necessary but do not validate a new interest/skill model by themselves.

Human evaluation should examine whether students understand trade-offs and can justify exploration and learning choices. Expert relevance, user preference, self-report, competence and later outcomes remain distinct. Do not claim a single career-fit accuracy number without a defined reference target and evidence that it measures the intended construct.

### Review conclusion

The combined DSS concept is logically defensible. The current repository and paper do not yet specify or validate a complete combined recommendation model. The missing work is criterion/mapping validity, explicit trade-off and uncertainty handling, a fully specified selection method, and evaluation against alternatives. Complexity is not the deciding factor. No feature behavior or acceptance status is changed by this conclusion.

## Verification and handoff

This plan and its follow-up change research documentation only. The paper/PDF revision is now recorded in the linked alignment review and verification record. No change to feature status, architecture, backlog deferrals, runtime, dependencies, schema, or API is authorized by the plan. No application tests or participant study were run.

Historical planning checks passed for the then-current artifacts. The subsequent revised paper/PDF and current research-document links are checked in the linked verification record. These checks validate artifacts, not the proposed DSS behavior. Any later feature work requires its owning specification/decision updates and implementation guide.
