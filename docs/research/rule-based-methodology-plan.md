# Proposed rule-based methodology and evaluation plan

Created/last updated: 2026-11-03. Status: research/implementation proposal for review; no application changes or new acceptance claimed.

## Recommendation and scope

Develop Asgard as a knowledge-based career DSS using reviewed qualitative decision rules, occupational mappings, bounded AI assistance, and curated learning links. A custom statistical predictor, weighted career-fit model, or quantitative proficiency-gap calculation is not necessary for the current decision-support claims. Complexity is not the selection criterion; justified input meanings, rules and evidence are.

This proposal refines the [DSS scope and revision plan](dss-scope-and-revision-plan.md). Its earlier discussion of numerical aggregation and baseline ablations identifies possible research extensions, not prerequisites. The user requested a logically sound method without unnecessary numerical modeling. The combined contribution remains career recommendations, skill-to-career comparison, and learning guidance. Vacancy matching, recruitment/placement, and agentic orchestration remain outside the core.

The recommendation concerns the app's decision method. It does not waive existing quantitative quality checks or imply that qualitative evidence alone proves predictive accuracy, comparative superiority, or population-level outcomes. Product/architecture, data/content, security and research reviews still apply before implementation or recruitment.

## Proposed decision method

### 1. Define admissible evidence and reviewed relationships

Use current expressed interests/goals and explicitly confirmed experience records. Treat both as changeable personal information, not validated aptitude or proof of mastery. Use reviewed occupational activities/competencies and source versions. Define aliases and relationship meanings before comparing them. Source-native numerical ratings may remain as reference metadata; they need not become user scores or calculated deficits.

Review the existing two-career pilot and interest-to-activity mappings first. Informal Discovery can support statements such as “you expressed interest in these activities” without claiming a psychometrically measured interest strength. Occupational mappings must disclose partial and unsupported coverage.

### 2. Specify a qualitative decision table

The table below proposes interpretation, not an approved catalog of rules. “Supported interest connection” and “supported experience connection” require actual reviewed relationships, not an LLM's unexplained impression. Lack of supporting evidence does not establish explicit dislike or inability.

| Evidence situation | Proposed interpretation/action |
| --- | --- |
| Interest and experience both support a career | Offer it as an exploration option and show both connections |
| Interest supports a career; experience is unassessed | Offer exploration with the experience limitation stated; do not claim a skill deficit |
| Interest supports a career; user explicitly reports limited experience | Preserve the exploration option and show supported development opportunities |
| Experience supports a career; interest is unknown | Offer it as an experience-related option with no claim that the student enjoys the work |
| Experience supports a career; user explicitly dislikes relevant work | Do not present it as a preferred-interest recommendation; disclose the conflict if comparing it |
| Neither dimension supplies a supported connection | Permit ordinary browsing; do not fabricate a personalized reason |
| Student explicitly requests a career | Allow inspection/comparison where supported, including limitations; the request is not evidence of skill |
| Evidence conflicts, is ambiguous, or coverage is incomplete | State the limitation or ask a relevant clarification; do not convert it to a favorable score |

These are policy choices grounded in the intended exploratory purpose and need expert/content review. They are not universal laws about career success. Refine cases for mixed interests, broad skills and partial mappings without inventing artificial certainty.

### 3. Define candidate selection and presentation

Both interests and relevant recorded experience may qualify exploration candidates. No skill-only cutoff disqualifies an interest-led option. Keep careers available for direct exploration when recommendation evidence is insufficient.

Before coding, the rule specification must also settle which candidates appear when more qualify than the current three-result limit, treatment of explicit dislikes, ties, and whether display order communicates preference. Qualitative rules still need these decisions; they cannot be left to accidental database ordering or unexplained LLM choice. Review an unranked presentation with disclosed reasons versus a documented qualitative priority policy. This plan does not declare either accepted.

The full method must state where AI participates. Recommended boundary: reviewed rules govern eligibility, evidence interpretation, and learning links; AI expresses explanations from permitted facts and may assist selection only under the specified policy. If AI chooses among eligible careers, model/prompt/schema versions and repeatability are part of evaluation. Bounded output and valid IDs alone do not establish relevance.

### 4. Connect the choice to learning

Use accepted competency-to-topic relationships to explain relevant learning opportunities. A student's reported development interest can support a suggestion without a calculated occupational deficit. Missing mappings show missing coverage. Curated content, focus, branches and progress retain their current authority; completion does not prove competence or change interests.

### 5. Support correction and reconsideration

Apply the approved profile/source revisions and explicit recommendation-refresh lifecycle. Corrected or removed evidence must cease supporting current conclusions. Explain that changing interests can lead to different exploration options; do not predict how interests will change. Preserve the distinction between updated comparisons and saved recommendations awaiting refresh.

## Development-and-evaluation sequence

1. Review sources/mappings and write the complete decision table, including result-limit and conflict cases.
2. Have independent reviewers assess the rules and expected outputs for relevance, faithful interpretation, and unsupported inferences. Preserve disagreements and resulting revisions.
3. Obtain affected product/contract/architecture review; implement through PM-F02/03/04/05/07 and applicable PM-I1 acceptance. Preserve current recommendation inputs until approved integration. Create the required feature guide when behavior changes.
4. Run targeted deterministic, ownership, revision, removal and contract checks. Evaluate AI explanations under the existing quality gate.
5. Conduct approved student task sessions. Ask students to explain options, identify uncertainty, compare alternatives, choose a next step, and revise a record. Analyze observed difficulties and open-ended answers systematically, including cases that contradict the intended benefit.
6. Report the method, exact environment, checks, reviewer evidence, participant observations and limitations. Revise the paper/PDF together after methodology review; do not insert fictional results.

Decision-support research can investigate users' interpretation through qualitative methods: Gedrimiene et al. used open-ended questions and content analysis in an AI-enhanced career-support study. That is relevant methodological precedent, not a sample-size prescription or validation of Asgard. [Primary paper](https://link.springer.com/article/10.1007/s10639-023-12277-4).

## Quantitative work: necessary versus conditional

| Claim or obligation | Appropriate evidence |
| --- | --- |
| Rules behave as specified | Reviewed expected cases, executable checks, recorded failures; no statistical model required |
| Occupational/learning relationships are defensible | Traceable source evidence and independent content review; counts alone cannot validate meaning |
| AI outputs satisfy current project acceptance | Existing synthetic-case runs, failure counts, reviewer ratings and thresholds remain required |
| Participants understood and used the workflow | Observed tasks and systematic qualitative analysis; descriptive counts can clarify how often issues occurred |
| The combined method outperforms interest-only or skill-only methods | Comparative evaluation and suitable quantitative analysis needed for a numerical/general superiority claim; optional if no such claim is made |
| The system improves confidence or decision quality across students | A justified measure, study design and sufficient evidence for the claimed change; statistical analysis is needed for quantitative population/inferential claims |
| A fit score predicts readiness or career success | Additional construct/criterion validation, suitable reference outcomes and calibration; excluded from the present proposal |

The [existing AI quality gate](../verification.md#ai-quality-gate) requires 30 synthetic profiles, three runs per candidate model, two reviewers, zero specified prohibited outputs, and the recorded support/usefulness/completion thresholds. These are real numerical evaluation obligations already in the project. This proposal neither waives them nor requires inventing a numerical career model to satisfy them. PDF-specific tests remain separate while processing is deferred.

Statistical hypothesis testing, trained predictive models, fit percentages, and numeric utility optimization are not default requirements for demonstrating this artifact's rule correctness and bounded usability. They become relevant when the proposed claims demand that evidence. Institutional/adviser requirements may add a specific evaluation format; none has been established here. Researcher-written survey items must not be presented as a validated instrument.

## Bounded claims for the revised paper

Propose design/development and evaluation of a rule-based, AI-assisted DSS that considers both interests and recorded experience, explains career alternatives, and links supported learning opportunities. Describe empirical findings only after evaluation. Limit student findings to the actual study and sampling conditions.

Do not promise objectively best careers, measured employment readiness, validated psychological improvement, superior prediction, or nationwide employer validity. Choosing narrower claims is not a substitute for correctness: semantic review, security, faithful explanations, negative cases and essential technical checks still matter.

## Handoff and verification

This is a research-document plan. No runtime, dependencies, API/schema, operational state, feature deferrals or Git publication were changed. No feature implementation guide is required yet. Follow-up on 2026-11-03: the paper/PDF have been revised to this direction; the [alignment review](original-paper-alignment-review.md) records the comparison with the original. Artifact verification does not establish acceptance of the proposed rules or application behavior.

Document verification: local paths/anchors and whitespace checked; owning plan/verification references retained. Application tests, new AI evaluations, expert review, and participant sessions were not run because this pass proposes methodology only. Remaining gates: source/rule/selection-policy review, implementation reviews and checks, and institutional research protocol approval.
