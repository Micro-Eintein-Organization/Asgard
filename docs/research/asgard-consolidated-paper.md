> Research material. This is not current implementation or release authority. Use the [documentation index](../README.md) and owning specifications; any dated approvals retain their recorded scope.

# Asgard: An AI-Assisted Career Decision Support System Integrating Career Recommendations, Skill Comparison, and Learning Guidance for Philippine Computer Science Students

Research proposal | CS-student study edition | Reconstructed and updated 2026-11-05 | Draft for team and adviser review

## Abstract

People exploring or reconsidering technology careers need to understand the work, relate their interests and experience to possible directions, and identify a practical learning step. A career suggestion alone does not explain this transition, while a list of courses can leave the career decision unresolved. This study proposes Asgard, an AI-assisted career decision support system that integrates explained career recommendations, skill-to-career comparison, comparison of career alternatives, and guidance through curated learning paths. The proposed initial evaluation concerns adult Philippine Computer Science students, while the application itself remains available to adults across educational and employment backgrounds. Occupational coverage is bounded by the available technology-career catalog. The method separates interests, self-reported experience, occupational references, and learning activity. Versioned source relationships and explicit rules structure the comparison; bounded AI assistance selects and explains existing career options using supplied evidence. A lack of experience does not disqualify a career that interests the user. Native occupational scales remain separate from personal ratings, and missing information remains unknown. The study will evaluate traceability, rule consistency, explanation quality, user understanding, and support for comparing alternatives through content review, synthetic cases, and task-based participant sessions. It does not propose employment prediction or matching to particular vacancies. This paper presents a research design; no participant findings or validated career-fit accuracy are reported.

Keywords: career decision support, technology careers, competency frameworks, self-reported experience, explainable AI, learning guidance, Philippines

## 1. Introduction

Choosing a career direction requires several connected judgments: what work a person wants to explore, what relevant experience they can currently describe, and what they would need to investigate or learn next. These judgments can change over time. A person with experience in web development may become interested in cybersecurity. Someone outside a computing degree may wish to explore data analysis. A useful system must accommodate these possibilities without treating previous experience as a permanent boundary on future choice.

Asgard addresses this decision process through an integrated web application. Users can explore technology careers, provide interests and background, describe their experience, compare alternatives, and follow curated learning resources. The research contribution is the connection among these activities: an explanation of why a career is worth investigating, a traceable account of how reported experience relates to it, and a visible route from that comparison to a chosen learning action.

The proposed decision model is knowledge-based and rule-governed. Occupational descriptions and competency references supply a basis for discussing work and skills. They do not establish that every person needs the same proficiency, or that a catalog label is equivalent to a particular source occupation. AI assistance operates within the available catalog and evidence. The user retains responsibility for choosing a direction.

The system is intended for people across educational and employment backgrounds. This audience expansion concerns who may use the application; it does not establish coverage of every profession. The current project centers on twelve technology careers. Broader occupational coverage would require additional source acquisition, content review, mappings, and evaluation.

## 2. Background and Related Work

### 2.1 Career decisions and user interpretation

Abaya-Garcia and Ballada (2017) examined career decision-making self-efficacy among Filipino college students and reported a four-factor structure involving career pursuit, alignment, shift, and selection. Their work supports treating career decision-making as a contextual process. It does not demonstrate that a software recommendation improves confidence or predicts an individual's correct career. The population in that study also differs from the broader audience proposed here.

Gedrimiene et al. (2024) studied users' experiences of an AI-enhanced learning analytics tool for career decisions. Their analysis of responses from 106 participants identified perceived benefits such as information, exploration, direction, and reflection, alongside usability and contextual-information needs. This motivates evaluating what people understand and can do with Asgard's explanations. Favorable perceptions alone would not establish occupational suitability or employment outcomes.

### 2.2 Decision support as the organizing framework

Watson (2018) revisits the dialog, data, and models framework for decision support systems. In Asgard, the dialog comprises profile review, Discovery, career exploration, comparisons, and explicit user choices. Data comprise published career descriptions, source references, curriculum relationships, user reports, and saved context. Models comprise the rules that distinguish evidence types, construct comparisons, constrain recommendations, and connect a selected direction to learning topics.

This interpretation makes the decision process central. Roadmaps and progress records support a chosen direction, while the decision functions help users examine alternatives and reconsider that direction. Course completion or a dashboard alone would not demonstrate the proposed contribution. Evaluation must include career comparison, explanation interpretation, and the user's ability to identify an informed next step.

### 2.3 Occupational and competency references

The Philippine Skills Framework for Analytics and Artificial Intelligence provides a locally relevant example of organizing roles and competencies (Analytics Association of the Philippines, n.d.). Its scope is domain-specific. The project must establish which source roles and competency descriptions are applicable to each supported career rather than applying an analytics framework indiscriminately to the entire catalog.

Other Philippine occupational and competency documents may supplement this foundation when their provenance, reuse conditions, and semantic applicability are reviewed. O*NET can provide supplementary occupational descriptions, subject to an explicit jurisdictional limitation. An occupational reference is a description of work within a source's scope, not evidence that a particular Philippine employer currently requires a skill.

O*NET distinguishes scale meanings, including importance and level, and uses descriptor-specific anchors (National Center for O*NET Development, n.d.). Accordingly, the system will preserve source scale identities and definitions. Converting an occupational observation to the application's personal 0-4 experience scale, or subtracting the two, would require a separate validated measurement model that this proposal does not supply.

### 2.4 Research focus

The study investigates an integrated, traceable decision workflow within a bounded career catalog. It does not claim that career guidance systems, competency frameworks, or learning roadmaps are individually novel. It also does not assert that no comparable system exists worldwide. The contribution to be evaluated is whether this particular combination of source-grounded comparison, interest-sensitive recommendations, and learning guidance supports understandable career exploration in the selected setting.

## 3. Research Problem and Questions

The design problem is how to help people relate changing interests and reported experience to technology-career alternatives without presenting unsupported suitability judgments. The system must explain the relevance and limitations of its evidence and connect a user's chosen direction to available learning content.

The study asks:

1. How can occupational references, self-reported experience, and interests be represented so their meanings and limitations remain distinct?
2. Can explicit comparison rules and bounded AI assistance produce traceable career exploration explanations that preserve options beyond a user's current experience?
3. Can users understand the differences between interest, reported experience, occupational information, and learning activity when comparing career alternatives?
4. Can users identify a justified next learning or exploration step from the available career and curriculum information?

These questions concern system reasoning and decision support. They do not ask the system to discover a person's objectively best career or predict hiring success.

## 4. Objectives

The general objective is to design and evaluate an AI-assisted career DSS that integrates explained recommendations, skill-to-career comparison, and learning guidance, with an initial study involving adult Philippine Computer Science students.

The specific objectives are:

1. Represent user interests, goals, background, and self-reported experience with explicit provenance and uncertainty.
2. Organize applicable occupational references and career-to-learning relationships using stable identities, versions, source locators, and documented review status.
3. Provide traceable comparisons between reported experience and the skills or activities associated with a supported career, without inventing assessed proficiency or target levels.
4. Produce explained exploration recommendations that consider both interests and experience while keeping supported careers available for independent browsing.
5. Support comparison of two career alternatives and connect a user's selected direction to relevant curated learning topics and resources.
6. Evaluate evidence validity, rule consistency, explanation usefulness, and users' understanding of the decision workflow.

## 5. Scope and Delimitations

### 5.1 Audience and evaluation population

The intended audience includes students in any discipline, people entering work, employed or unemployed adults, and people considering a career change. A computing degree or technology job is not required. Current application eligibility is adults aged 18 and above. Any future younger-user access requires separate consent, privacy, provider-processing, and usability decisions.

The proposed initial participant population is Philippine Computer Science students aged 18 and above, with varied year levels, technology experience, employment situations, and career certainty. This is a research-sample boundary, not a restriction on the broader application audience. Recruitment sites, sample justification, consent materials, and institutional review must be settled before recruitment. Findings from CS students cannot establish usability or effectiveness for nonstudents, other disciplines, minors, or all career changers.

### 5.2 Included capabilities

The bounded system includes guided Discovery, browsing of published careers, an editable experience profile, source-aware career information, explained suggestions, comparison of exactly two careers, and links to curated learning paths. Saved alternatives and private notes support later reflection. Self-reported learning activity can be recorded, but completion states do not establish mastery.

As of 2026-11-05, project documents record local activation of experience comparison, occupational-evidence integration, and the shortlist/comparison increment. These records establish the documented local implementation status only. Independent content review, live model quality, broader participant validation, and hosted acceptance remain separate. This paper does not rerun or certify the recorded application checks.

### 5.3 Coverage and exclusions

Audience breadth is distinct from supported career coverage. The current catalog contains twelve technology careers. Missing or partial mappings must be visible; unsupported occupations cannot receive fabricated personalized comparisons. Extending to other fields is future work requiring additional content and validation.

The study excludes matching a person to a particular job advertisement, employer recruitment, placement, automated applications, and employment-outcome prediction. Continuous job-posting ingestion and labor-market demand estimation are not required inputs. Market observations may be studied later if reliable access, sampling, deduplication, and interpretation can be established.

The system does not promise an agentic or multi-agent framework, autonomous career planning, a user-facing counselor, generated replacement curricula, a validated personality test, or numerical career-fit/readiness scores. Optional document enrichment is a separate staged capability; resume or transcript extraction and OCR are not prerequisites for the core evaluation.

## 6. Conceptual and Methodological Framework

### 6.1 Evidence categories

The method maintains separate categories for declared interests, goals, self-reported experience, document-supported statements if later enabled, occupational observations, curriculum associations, and learning activity. Each category supports different conclusions. A resume statement supports that the statement appears in the document; it does not prove practical competence. A reported level describes the user's judgment, while a completed topic records activity.

Current personal experience values distinguish unknown from explicit no experience. The remaining levels describe familiarity with concepts, basic tasks with guidance, ordinary tasks independently, and advanced tasks or troubleshooting. These labels are descriptive self-report anchors. They are not validated psychometric intervals. An absent record, an unknown rating, and an explicit zero must remain distinguishable in storage, comparisons, and explanations.

Occupational records retain their original source role, concept, scale, value, locator, version, and limitations where available. Curriculum relationships record whether a topic directly addresses, partly supports, or merely relates to a concept. A related learning topic must not transfer a personal rating to a broader occupational competency.

### 6.2 Knowledge preparation and review

The team will maintain a reproducible source inventory and explicit career-to-source relationships. Review must examine role scope, definitions, ambiguous titles, native levels, reuse conditions, and the difference between source evidence and Asgard-authored interpretation. Exact, partial, related, disputed, and unresolved relationships must not be silently merged.

The current project records verified originals for a twenty-file occupational packet and a twelve-career local-test release. Byte verification and agent-assisted review support provenance and preparation; they do not substitute for independent semantic or reuse approval. The study must identify a content reviewer and record accepted, rejected, and unresolved relationships before presenting the knowledge base as independently reviewed.

Each evaluated result must be reproducible against a frozen catalog, occupational release, mapping version, prompt, schema, and user-context snapshot. Review changes after evaluation require a new version and a clear account of which conclusions remain applicable.

### 6.3 Decision rules

The comparison component applies explicit rules to the saved facts. When interests and relevant experience support an option, the explanation identifies both. When a career interests the user but experience is limited or unknown, the career remains available and guidance identifies introductory exploration or learning. When experience relates to a career but interest is unknown, the explanation describes relevant experience without claiming enjoyment or preference.

An explicit lack of interest must not become a positive preference. Uncertain answers must remain uncertain. No evidence about a skill means unassessed information, not a deficit or inability. A source occupation with only a partial relationship to a catalog career must carry that limitation into the comparison. Where no defensible mapping exists, the system reports unavailable coverage.

These are validity constraints, not a hidden weighted suitability formula. The deterministic comparison can report a user's saved experience alongside a documented career relationship without calculating a gap. Terms such as development opportunity refer to material worth exploring in relation to a selected goal; they do not establish a measured shortage against an employer standard.

The AI selection step remains distinct from this deterministic comparison. The provider may choose a small set of published careers and explain them from bounded user facts and career-specific references. Application validation checks identities, evidence membership, source relationships, revision consistency, and prohibited claims. Schema validity does not prove that a recommendation is useful; human evaluation must examine its reasoning.

The full selection instructions, treatment of competing interests, weak-evidence cases, ordering, and result-count policy must be frozen before model evaluation. The current one-to-three result limit is an interface and catalog policy, not an empirically optimal number or a ranking of every possible occupation. Full browsing provides alternatives beyond the displayed suggestions. The paper does not replace current implementation policy with an unevaluated numerical algorithm.

### 6.4 Learning guidance

Learning guidance follows the user's selected direction and available reviewed curriculum relationships. Authored topic order, relevant introductory material, and explicit prerequisites can guide a next step. Partial topic coverage and absent resources must be disclosed. Guidance must not claim that a topic closes a measured gap unless a compatible assessment and target have actually been established.

Users can inspect resources and compare careers before selecting a learning focus. Opening a topic, receiving a recommendation, or saving a note must not change progress or the active roadmap automatically. Interests can change, and a revised direction should prompt reflection without erasing prior learning activity or reinterpreting it as a stable preference.

### 6.5 Operational flow and example

The conceptual sequence is: user-provided interests and experience; validation and versioned context capture; retrieval of applicable career/source relationships; deterministic comparison and bounded recommendation generation; validation of explanations; career exploration and two-career comparison; explicit choice of direction; curated learning guidance and optional progress recording. Relevant input changes make saved recommendations outdated and require an explicit refresh. Removal of contributing private evidence must invalidate or erase affected payloads under the owning privacy rules.

For example, a user reports basic web-development experience and a new interest in cybersecurity. The system can show web development as a familiar direction and cybersecurity as an interest-led option. It explains which experience is documented or self-reported, shows applicable security work descriptions, and links introductory networking or security topics only where mappings support them. It must not infer security competence from programming experience or exclude cybersecurity because its concepts are unassessed. The user can compare the alternatives and choose a direction independently of suggestion order. This example illustrates expected reasoning, not a measured result.

## 7. Research Methodology

### 7.1 Design and development approach

The study adopts an iterative artifact-development and evaluation approach: define the decision problem; specify evidence categories and rules; prepare the bounded knowledge base; construct the integrated workflow; demonstrate expected cases; evaluate technical reasoning and participant interpretation; and revise with a documented change record. Requirements, mappings, prompts, and evaluation artifacts will be versioned. The adviser must approve the final protocol before recruitment.

The artifact uses the approved modular architecture: React and TypeScript for the interface, FastAPI for protected application services, PostgreSQL through Supabase, and a backend provider adapter for AI. This architecture does not require an agent framework. The paper's research method does not authorize changes to shared application contracts or deployment policy.

### 7.2 Content and rule evaluation

A named content reviewer will inspect occupational applicability, scale interpretation, and curriculum associations. The review record will distinguish factual source transcription from the team's interpretation. Technical review will examine evidence constraints, unknown-versus-zero handling, revisions, authorization, and correction/removal behavior. The current absence of independent content approval is a study dependency, not evidence of accepted correctness.

Synthetic cases will define expected outputs before evaluation. Cases include interest without experience, experience without declared interest, competing interests, explicit dislike, absent and unknown ratings, explicit zero, partial source mappings, missing curriculum links, unsupported careers, changed interests, and removed contributing evidence. Expected results should specify permissible and prohibited conclusions rather than demand identical prose from the AI.

### 7.3 AI quality evaluation

The project already specifies comparison of the two architecture-approved candidate models using thirty synthetic profiles and three runs per profile per model. Two reviewers use written support and usefulness rubrics. The recorded gate requires at least 90 percent of valid recommendations to reach support of at least 4 and usefulness of at least 3 on the respective 1-5 rubrics, and at least 90 percent valid completion within the configured budget. Accepted outputs must contain none of the specified invalid identities, ownership leaks, invented competencies, numeric suitability claims, or instruction overrides.

These thresholds are engineering acceptance criteria. They are not career-fit accuracy and do not become evidence until the evaluation is executed and recorded. Profile cases and rubrics must be updated for the frozen evidence-integrated version. Report attempts, valid outputs, rejected outputs, reviewer disagreement, latency, and budget failures so rejected generations cannot conceal poor reliability. A later document feature retains its separate synthetic-document and privacy gates.

### 7.4 Participant evaluation

After institutional, consent, privacy, and content-review prerequisites are met, participants will complete guided tasks: explore an unfamiliar career; review their reported experience; interpret a suggestion with its limitations; compare two alternatives; and identify a learning or exploration step. Include a scenario in which interest extends beyond present experience. Participants should be able to explain why the system showed an option and what the evidence does not establish.

Observation, think-aloud comments, task outcomes, and short interviews will capture misunderstandings, usefulness, missing information, and perceived freedom to reconsider. The team will use a documented coding procedure, retain examples supporting interpretations, and review disagreements between analysts. Descriptive counts can summarize task outcomes and recurring issues. Recruitment and sample justification must match this bounded qualitative design and the variation needed across the selected CS-student backgrounds. Results must remain specific to this study population.

No inferential statistical model is required to implement the stated knowledge-based method. Quantitative checks remain necessary for software reliability, data integrity, and the selected AI quality gate. Stronger claims, such as superiority over another method, improvement in career confidence, or predictive accuracy, would require suitable measurements, comparison conditions, sampling, and statistical analysis. The present protocol does not claim those outcomes.

## 8. Ethics, Privacy, and Limitations

Participants must understand that suggestions support exploration and do not assess employability or guarantee success. Consent will identify collected data, any provider processing, access controls, retention, and withdrawal procedures. Synthetic profiles should precede real participant processing. Optional document analysis requires separate privacy activation and disclosure. A withdrawal process must be operational before recruitment rather than assumed from unfinished account controls.

Private experience reports, notes, and saved results require account isolation. Notes are for the user's reflection and are not automatically recommendation inputs. Edits, removal, account changes, and in-flight generation must not restore obsolete private context. The study will document these behaviors and reuse recorded technical evidence only where the evaluated implementation and environment remain applicable.

The main limitations are self-report bias, bounded occupational coverage, incomplete mappings, differences between Philippine and supplementary foreign sources, source age, provider variability, and a limited CS-student participant sample. Independently reviewed occupational information is still a general reference rather than a requirement for every employer. Participant satisfaction cannot establish employment outcomes. Source-grounded explanations can be traceable and still require review for incomplete reasoning or omitted alternatives.

## 9. Expected Contribution and Study Status

The expected artifact connects career information, interests, reported experience, comparison of alternatives, and curated learning guidance within one decision workflow. Its methodological contribution is an explicit separation of evidence meanings and a testable set of constraints on both deterministic comparisons and AI explanations. The intended practical value is helping users understand options and choose an informed next step while preserving room for changing interests.

The project contains locally implemented increments, but the research evaluation remains proposed. This paper reports no completed participant study, demonstrated improvement, validated occupational targets, or measured predictive accuracy. Final research conclusions depend on frozen methods, independent review, executed evaluation, and transparent reporting of failures and limitations.

## References

Abaya-Garcia, A. L., & Ballada, C. J. A. (2017). Exploring the factor structure of career decision-making efficacy among Filipino students. Philippine Journal of Counseling Psychology, 19(1). https://www.ejournals.ph/article.php?id=17308

Analytics Association of the Philippines. (n.d.). Philippine Skills Framework for Analytics & AI. https://www.aap.ph/philippine-skills-framework-for-analytics-and-ai

Gedrimiene, E., Celik, I., Kaasila, A., Makitalo, K., & Muukkonen, H. (2024). Artificial Intelligence (AI)-enhanced learning analytics (LA) for supporting career decisions: Advantages and challenges from user perspective. Education and Information Technologies, 29, 297-322. https://doi.org/10.1007/s10639-023-12277-4

National Center for O*NET Development. (n.d.). O*NET OnLine help: Scales, ratings, and standardized scores. https://www.onetonline.org/help/online/scales

Watson, H. J. (2018). Revisiting Ralph Sprague's framework for developing decision support systems. Communications of the Association for Information Systems, 42, Article 13. https://doi.org/10.17705/1CAIS.04213
