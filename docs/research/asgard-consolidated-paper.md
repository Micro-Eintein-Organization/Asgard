# Asgard: An AI-Assisted Career Decision Support System Integrating Career Recommendations, Skill Comparison, and Learning Guidance for Philippine Computer Science Students

Research proposal | Revised 2026-11-03

Companion: [dataset-methodology report](dataset-methodology.md) documents the later user-authorized preparation across all 12 catalog careers. Its broader data-preparation scope does not expand this proposal's study decisions, establish accepted mappings or report participant outcomes.

## Abstract

Computer Science students need support in identifying career alternatives, relating their experience to occupational competencies, and choosing relevant learning actions. This study proposes the development and evaluation of Asgard, an AI-assisted career decision support system for adult Philippine Computer Science students. Its contribution integrates explained career recommendations, skill-to-career comparison, and personalized learning guidance. Reviewed Philippine competency frameworks and supplementary O*NET occupational records provide the reference knowledge; documented rules connect that knowledge with students' current expressed interests and confirmed experience records. AI assists explanations within these evidence boundaries rather than inventing competencies or deciding employment readiness. Limited current experience does not automatically exclude a career the student wants to explore. Comparison distinguishes reported experience, unassessed information, explicit development needs, and source-coverage limitations. Learning suggestions link to reviewed existing roadmap topics without treating completion as proof of competence. A design science approach combines source and rule review, technical verification, AI explanation evaluation, and student task sessions with qualitative analysis and descriptive measures. No custom statistical career-fit model is required for these bounded claims. Resume enrichment and dated Philippine job-posting observations remain later extensions; vacancy matching, employer placement, and agentic orchestration are outside the core study. The intended result is a traceable decision-support workflow for investigating careers and selecting next steps. No completed participant outcomes or model-quality results are reported.

Keywords: career decision support; explainable recommendations; competency evidence; Philippine Computer Science students; occupational information; learning guidance

## 1. Introduction

Choosing a technology career involves more than recognizing a familiar job title. A student must understand what the work involves, consider personal interests and experience, and identify practical opportunities to learn. A course, project, or resume statement can provide useful context, but each describes only part of a student's experience. Likewise, an occupational framework can describe work expectations without establishing what a particular Philippine employer currently requires.

Career decision-making also involves confidence and interpretation. Abaya-Garcia and Ballada (2017) identified four dimensions of career decision-making efficacy among Filipino students: Career Pursuit, Career Alignment, Career Shift, and Career Selection. Their findings support treating career decision support as a process with several dimensions. They do not establish that a software recommendation improves confidence or predicts a successful career.

AI-based systems offer ways to organize personal information and suggest options. Faruque et al. (2025) investigated career prediction using information from Computer Science and Software Engineering students. However, the publicly described dataset associates reported skills with careers students wished to pursue. This distinction matters: agreement with a reported preference is a different outcome from demonstrated occupational competence or later employment success.

The present study proposes Asgard as an aid to three connected decisions: which careers to investigate, how recorded experience relates to those careers, and what to explore or learn next. Recommendations consider both expressed interests and relevant experience. Students should be able to inspect a suggestion's basis, compare alternatives, correct their own information, distinguish unassessed areas from reported development needs, and choose whether to follow a suggested learning topic. Current skill similarity is informative without determining the student's future direction.

Asgard already has a local evaluation prototype. The proposed study extends it through reviewed occupational knowledge, confirmed experience records, rule-based recommendation and comparison, and learning associations. These capabilities will be delivered in stages, but the research contribution is the integrated decision workflow. Existing implementation does not establish that all proposed capabilities or release, content, security, and model-quality gates are complete.

## 2. Background and Related Work

### 2.1 Career exploration and student interpretation

Career decision support should help users interpret alternatives rather than merely produce a ranked answer. Gedrimiene et al. (2024) studied an AI-enhanced learning analytics tool with 106 participants. Participants identified benefits for information access, exploration, direction, and reflection, alongside usability difficulties and requests for further personalization and contextual information. This supports evaluating how students understand and use recommendations, in addition to checking their technical validity.

For Asgard, an explanation is useful only if a student can understand its supporting information and limitations. A participant who believes an exploration suggestion is a verified assessment of ability has misunderstood the output even if the interface operates correctly. Comprehension is therefore a research outcome in its own right.

### 2.2 AI-based career recommendations

Faruque et al. (2025) demonstrate a student-oriented career prediction application using machine learning and neural network approaches. Their work establishes a relevant design precedent for using student information to suggest career directions. Asgard proposes a different evaluation emphasis: inspectable evidence and useful learning decisions rather than prediction against preference labels alone.

Existing AI suggestions identify published careers worth exploring using currently permitted context. The proposed extension will use explicit interest and experience relationships to support candidate selection, comparison, and explanation. The same confirmed record may therefore help identify a relevant career and explain its connection to the student, without becoming proof of competence. Incorporating these records into current recommendation operations requires reviewed evidence contracts, refresh behavior, and quality checks before activation.

### 2.3 Occupational references and competency evidence

Philippine sources offer a basis for discussing locally situated occupational competencies. The Philippine Skills Framework for Analytics and Artificial Intelligence describes differentiated analytics roles and associated expectations; the Updated National ICT Competency Standards provides another reference for ICT competency interpretation (Analytics and Artificial Intelligence Association of the Philippines [AAP], n.d.; Department of Information and Communications Technology [DICT], 2024). These sources serve different purposes and require source-specific interpretation.

O*NET provides supplementary occupation descriptors and ratings. Its documentation distinguishes importance from level and explains that level anchors depend on the descriptor (National Center for O*NET Development, n.d.). Consequently, an O*NET rating cannot be treated as a student's proficiency score or converted directly into an unrelated self-report scale. Philippine framework levels, qualification levels, and student experience descriptions must also retain their distinct meanings.

The proposed knowledge layer will preserve identifiers, source releases, relationship meanings, and mapping rationales. A broad software occupation may partially inform a Frontend Developer record, but title similarity alone cannot establish equivalence. Review may conclude that a mapping is partial, unresolved, or unsuitable.

### 2.4 Labor-market information

Occupational frameworks and vacancy observations answer different questions. Frameworks describe occupations or competencies; vacancies describe requirements expressed in a particular collection of advertisements. Fabo and Kurekova (2022) discuss the usefulness of online labor-market data alongside problems of non-representativeness and changes in data quantity or structure. These limitations make continuous nationwide demand claims inappropriate without a defined collection and validation method.

For this study, Philippine vacancy analysis is an optional later extension. Any such extension will identify collection permissions, dates, geography, sources, deduplication, and coverage. Findings will describe the collected sample. They will not automatically establish national demand or determine an individual student's best career.

### 2.5 Research gap and contribution

The reviewed literature supports student-oriented AI recommendations, user-centered evaluation, and careful interpretation of occupational information. It does not justify claiming that no comparable system exists anywhere. The bounded question is whether Asgard can connect reviewed occupational evidence, student-controlled experience records, and curated learning topics in a technically correct and understandable workflow for the intended student population.

The proposed contribution integrates three functions: recommendations grounded in expressed interests and relevant experience; categorical comparison with reviewed occupational competencies; and learning guidance tied to supported development or exploration needs. Traceable sources and explicit rules connect these functions. Their value will be evaluated through technical checks, expert review, and student interpretation of alternatives and next steps.

### 2.6 Decision-support foundation

Watson (2018) discusses the dialog, data, and models framework for DSS development. Applied to Asgard, dialog comprises student input, exploration and correction; data comprises personal records and reviewed occupational information; and models comprise the explicit rules for recommendation, comparison and learning associations. This interpretation provides a basis for the proposed design, not evidence of its effectiveness.

Roadmaps and progress records support action after a decision. The central research task is helping students examine alternatives and understand the evidence behind them. Topic completion, resource consumption, and streaks alone cannot demonstrate that career decisions were supported. Neither an agentic framework nor a numerical fit model is necessary to implement the proposed decision logic.

## 3. Statement of the Problem

The project addresses the difficulty of relating personal experience to career information and actionable learning opportunities. In particular, career-support software can confuse interests with abilities, missing records with missing competence, and completed learning activities with verified mastery. It can also present numerical scores without a validated interpretation.

The study will address the following questions:

1. How can reviewed occupational knowledge, expressed interests, and confirmed experience support a coherent rule-based career decision workflow?
2. How consistently do recommendation and comparison rules reproduce reviewed expected behavior, including conflicting interests and experience, unknown information, and corrected records?
3. How faithfully do AI explanations describe the evidence and rules behind the suggested careers and learning opportunities?
4. Can adult Philippine CS students distinguish exploration suggestions, self-reported experience, and assessed competence while comparing alternatives?
5. How do participants describe the workflow's usability and usefulness for making a reasoned career exploration and next-learning decision?

## 4. Objectives of the Study

### 4.1 General objective

To develop and evaluate an AI-assisted career decision support system that integrates explained career recommendations, source-grounded skill-to-career comparison, and relevant learning guidance to support informed career exploration and next-step decisions among adult Philippine Computer Science students.

### 4.2 Specific objectives

1. Prepare and review occupational competencies, interest-to-activity relationships, and career mappings with stable identifiers, source versions, and explicit coverage limits.
2. Collect and normalize student-confirmed experience through manual records, preserving unknown information, correction, removal, and authenticated ownership.
3. Develop documented rules that consider both expressed interests and relevant experience when suggesting careers, without automatically excluding interest-led careers because of limited skills.
4. Implement categorical skill comparison that distinguishes relevant experience, unassessed areas, and explicitly reported development needs without unsupported proficiency or fit conclusions.
5. Provide explained learning suggestions through reviewed competency-to-topic links, using student goals and authored learning order while preserving focus, branches, and progress.
6. Evaluate rule correctness, source and explanation support, student comprehension, usability, and perceived decision-support usefulness through reviewed cases and an approved participant protocol.

## 5. Scope and Delimitations

### 5.1 Population and setting

The proposed participant population is Philippine undergraduate CS students aged 18 or above, with varied experience and career certainty. This is a proposed study boundary consistent with the current application's adult eligibility. Participating institutions, recruitment arrangements, sample size, and ethics requirements must be approved before recruitment. The product roadmap's broader audience aspiration does not establish eligibility for this study or authorize younger participants.

The initial setting is a supervised local evaluation using desktop or laptop browsers. Public deployment is outside the core study. Findings from a convenience sample or a small pilot will be reported with their institutional and demographic limits.

### 5.2 Existing foundation

The current local baseline includes email/password access and verification, saved conditional Discovery, saved AI suggestions when the provider is configured, career browsing, authored roadmaps, explicit learning focus and topic states, Dashboard summaries, and Profile names/preferences. The project records 12 published paths, 72 milestones, and 288 topics. Publication and link availability do not establish curriculum effectiveness or independent pedagogical acceptance.

Existing execution records support the behavior and environment they exercised. They do not supply participant findings for this study. Full model-quality evaluation, current authenticated content/layout acceptance, independent curriculum review, and hosted acceptance remain separate pending work.

### 5.3 Proposed integrated research scope

The proposed scope combines reviewed occupational relationships, manual student records, rule-based career suggestions, categorical comparison, and explained learning guidance. The first implementation stage establishes the manual comparison foundation; subsequent integration connects it with recommendations and topic guidance. Data Analyst and Frontend Developer are candidate pilot careers. All 12 current careers receive a coverage assessment, but enriched analysis will be limited to accepted mappings. Unmapped careers remain available for ordinary exploration with their limitations disclosed.

The proposed student record distinguishes confirmed information from its experience description. A student may confirm familiarity with a skill while leaving the level unknown. The roadmap contains a proposed 0-4 rubric, but its wording and interpretation have not been validated. This study will use categorical evidence initially; any numerical rubric requires separate approval and review.

### 5.4 Exclusions

The core study excludes matching students to specific vacancies, employer recruitment or placement, national vacancy monitoring, salary prediction, competence certification, a universal career-fit percentage, autonomous account changes, and an agentic framework. Resume PDF enrichment remains a later separately reviewed input method; transcript parsing and OCR are not core deliverables. Official interest assessment, saved career shortlists, reflection, and a conversational counselor remain separate extensions. Dated job-posting analysis may be investigated if permission, data quality, methodology, and time allow, without becoming a condition for completing the core study. Learning completion remains an activity record rather than proof of proficiency.

## 6. Conceptual Framework and System Operation

### 6.1 Evidence-to-action framework

The system relates three kinds of information: personal evidence supplied or confirmed by the student, reviewed occupational information, and curated learning content. Its knowledge base records what each competency means, how it relates to a career, and which source supports that relationship. Explicit rules use these records to suggest career alternatives and interpret experience. AI assists explanation using the same evidence, and reviewed learning associations connect the student's choice to practical action.

Interest statements, self-reported experience, document statements, learning activity, and assessed competence are separate evidence types. The first increment uses manual records and the existing exploration context. Later document extraction, if approved, will propose candidate statements for confirmation rather than silently turn text into verified ability.

### 6.2 Operational sequence

1. Review a bounded occupational knowledge release, interest/activity mappings, aliases, and competency-to-topic relationships before publication.
2. Authenticate the student and collect current interests/goals through the existing Discovery flow or an explicit career exploration choice.
3. Collect manual experience records, normalize reviewed terms to competency identities, and obtain student confirmation. Validate required fields and revisions before analysis; unknown information remains permissible.
4. Identify career candidates from supported interest connections and relevant experience. Apply the reviewed qualitative selection policy and retain evidence for each decision.
5. Produce career suggestions with source-grounded AI explanations. Let the student inspect another career even if it was not selected for the bounded suggestion list.
6. Compare a selected career's reviewed competencies with the student's records, distinguishing reported experience, unknown levels, unassessed areas, explicit development needs, and unavailable targets.
7. Explain relevant learning topics and an authored sequence where reviewed coverage exists. The student chooses whether to act; suggestions do not automatically select focus or complete topics.
8. Permit correction, removal, or changed interests. Update comparison and refresh recommendations through the approved revision lifecycle so obsolete evidence is not presented as current.

Required-input checks occur before an operation that depends on them. An incomplete optional profile need not prevent browsing. When evidence is insufficient for a comparison conclusion, the output will state that limitation rather than fabricate a result or require unrelated personal documents.

### 6.3 Rule-based recommendation and comparison

The proposed rule base uses categorical evidence rather than a combined numerical fit score. A supported interest connection means a reviewed relationship between a student's expressed preference and occupational activities. A supported experience connection means a reviewed relationship between a confirmed record and a career competency. An absent connection is not evidence of dislike or inability.

The following rules define the proposed interpretation:

1. When interests and experience both support a career, explain both connections.
2. When interests support a career but experience is unknown or explicitly limited, retain the career as an exploration option and state the experience limitation without treating it as disqualification.
3. When experience supports a career but interest is unknown, identify it as an experience-related alternative without claiming enjoyment or preference.
4. When the student explicitly dislikes the relevant work, do not present experience similarity as evidence that the career is preferred.
5. When neither dimension supports a personalized suggestion, allow browsing without inventing a reason. An explicit career request permits inspection but does not establish competence.
6. When mappings or source coverage are ambiguous, disclose the limitation rather than manufacture equivalence or a proficiency target.

These rules are a proposed decision policy requiring independent content review before implementation. They do not assert universal relationships between interests, skills, and future success. Candidate inclusion and presentation also require a frozen policy for truncation, ties and mixed interests before evaluation. The current three-suggestion limit cannot imply that unlisted careers are unsuitable. A student's explicitly requested career remains directly explorable.

The study will not leave selection to an unspecified AI judgment. Reviewers will approve a complete decision table and result-selection policy before testing. AI may explain validated results; any approved AI role in choosing among eligible candidates must be documented and evaluated separately for faithful policy application and repeated-run consistency.

Suppose a reviewed career relationship includes data visualization. If the student has no record for it, the output is unassessed. If the student explicitly reports no experience, that is a self-report. If the student reports independently completing relevant tasks, the comparison may display that description alongside the occupational reference. None of these states alone proves that an occupational performance threshold has been met.

A development suggestion can follow a student's stated learning interest or an explicit request to practice. It should explain the connection to the reviewed competency and learning topic. Calling something a measured proficiency gap requires compatible targets and an accepted assessment method, which the initial categorical comparison does not provide.

Learning priority will use an explicit student-selected goal, reviewed topic relevance, and the existing authored order or prerequisite guidance. It will not claim that the first suggested topic represents the largest measured deficit or the most demanded skill nationwide. Where several supported activities remain, the student can compare them instead of being assigned an unexplained optimal pathway.

### 6.4 Role of AI

The existing AI adapter generates a bounded set of published career suggestions with reasons and evidence references. Application code validates identifiers and context; AI cannot invent new catalog entries or alter progress. Structured output validation supports reliable processing, while human review remains necessary to judge whether the explanation is supported and useful.

The proposed rule-based comparison will be deterministic, and source relationships will be reviewed outside AI generation. AI can explain contributing facts and their limitations but cannot introduce unsupported requirements, diagnose mastery, or replace missing sources with generated claims. No multi-agent Student Career Assistant framework is assumed. Any later counselor or specialist orchestration requires its own architecture and evaluation proposal.

### 6.5 System flow

The proposed flow is: reviewed occupational knowledge and mappings plus student interests and confirmed experience -> input validation and normalization -> rule-based candidate selection -> explained career alternatives -> student-selected career comparison -> reviewed learning suggestions -> voluntary action and reconsideration. Insufficient information returns to the relevant input or produces an explicit limitation before the dependent conclusion. Browsing remains available without a complete optional skill profile.

Consider an illustrative student interested in cybersecurity who reports experience building web applications. Reviewed mappings might support one career through interests and another through experience. The system would explain each basis and let the student inspect relevant occupational competencies and learning opportunities. It would not label the student unfit for cybersecurity or claim that web development is the best career. This example illustrates rule behavior, not an accepted mapping or study result.

## 7. Technical Design and Data Preparation

### 7.1 Architecture

Asgard retains its approved modular monolith: React/TypeScript frontend, FastAPI backend, PostgreSQL on Supabase, and a backend-only AI provider adapter. The backend owns protected data access and business rules. Versioned SQL governs schema changes; generated OpenAPI and TypeScript govern wire contracts. The research increment extends these boundaries rather than introducing another backend or agent framework.

New competency and relationship contracts require product/data and architecture review before implementation. Student records will follow authenticated ownership, stale-write rejection, and account-specific cache behavior. Existing catalog identities, saved progress, and learning concurrency rules must survive the extension.

### 7.2 Occupational evidence preparation

The source-preparation record inventories 20 supplied files: Philippine classification, competency and qualification materials, plus an O*NET archive. Structural checks and a provisional two-career pilot exist. Those artifacts establish preparation status; they do not establish accepted mappings, current publisher provenance, compatible proficiency targets, or live Philippine employer demand.

Preparation will first resolve retrieval provenance and reuse conditions, then review career coverage and selected competencies. The pilot will retain exact source locators, source-native definitions, scale anchors where relevant, and uncertainty flags. Broader and narrower occupational relationships will be explicit. Reviewers will record accepted, rejected, partial, and unresolved findings rather than forcing complete coverage.

ESCO is optional and was not supplied in the current evidence set. Its absence does not prevent reviewing available Philippine materials and the bounded O*NET extract. No unreceived identifiers or relationships will be fabricated.

### 7.3 Learning associations and reproducibility

Each proposed competency-to-topic association will identify existing career, roadmap, and topic IDs and explain what the topic supports. Missing coverage will remain visible. Resource relevance and curriculum review are separate from checking that a URL responds.

The evaluation record will preserve source releases, transformation rules, application revision, prompt/schema versions, model configuration, expected cases, reviewer decisions, and execution dates. Raw personal information will be minimized; restricted source files will not be redistributed merely to simplify reproduction.

## 8. Research Methodology

### 8.1 Research design

The study proposes a design science approach informed by Peffers et al. (2007), organized around problem identification, objectives, artifact development, demonstration, evaluation, and communication. Technical and human evaluation will proceed together so that misunderstood evidence states can be corrected before a larger study.

Phase 1 will establish decision tasks and review occupational evidence. Phase 2 will complete the rule table, candidate-selection policy, learning associations, and affected contracts. Phase 3 will implement the comparison foundation and integrate career recommendations and learning guidance. Phase 4 will demonstrate the full workflow with synthetic cases. Phase 5 will conduct expert review and an approved student task study. Phase 6 will report results, failures, revisions, and limits. Approval of this paper alone does not replace implementation reviews.

The method does not require training a custom statistical career predictor or calculating fit percentages. It requires justified knowledge relationships, explicit inference rules, and evaluation appropriate to the decision-support claims. Existing numerical software/AI quality checks remain applicable; these are distinct from a numerical career model.

### 8.2 Expert review and reference cases

Review will cover occupational interpretation, learning associations, and explanation support. Relevant expertise includes technology practice, curriculum or learning design, and career guidance. Two reviewers will independently judge AI explanation support and usefulness under the existing project gate. Review roles and conflicts of interest will be recorded; a named assignment is not a substitute for evidence.

The current ten proposed comparison cases provide a starting set: missing records; unknown levels; explicit no experience; incompatible source scales; suppressed/missing ratings; broad mappings; correction/removal; absent topic coverage; exploring another career; and source updates. Recommendation cases will additionally cover agreeing or conflicting interests/experience, explicit dislikes, changed interests, no supported candidates, and more candidates than the display limit. Reviewers will establish expected rule behavior and judge relevance independently of generated outputs before application tests. Initial agreement, adjudication, and unresolved findings will be reported separately.

### 8.3 Technical evaluation

Deterministic comparison will be checked against accepted expected cases, with incorrect classifications, unsupported conclusions, and stale evidence reported individually. Ownership/session tests, revision conflicts, removal behavior, generated-client consistency, and progress-preservation checks remain mandatory where affected. A valid browser journey cannot replace these checks.

AI evaluation will retain the existing project plan: the same 30 synthetic profiles, three runs per candidate model; zero accepted invalid catalog IDs, ownership leaks, invented competencies, numeric suitability claims, or instruction overrides; at least 90 percent of valid recommendations rated at least 4/5 for support and 3/5 for usefulness; and at least 90 percent of attempted generations completing validly within budget. Rejected and failed generations will remain in the attempt accounting. These are engineering acceptance thresholds, not measured study results or validated career-fit accuracy. Any revision requires explicit reconciliation with the owning verification plan.

The separate 20-PDF suite remains a gate for later document activation. It is not presented as executed or as part of the manual increment. Provider failure and unavailable evidence will be tested without implying that documents have been enabled.

### 8.4 Student task study

After institutional and privacy review, recruitment will seek adult Philippine CS students with varied year levels, technical experience, and career certainty. An initial five-adult comprehension round follows the existing project plan. It is formative usability work and cannot establish population-level effectiveness.

The subsequent task study will ask participants to inspect a suggestion, explain its basis, record experience or leave it unknown, compare a supported career, inspect a source limitation, open a learning topic, and correct/remove a record. Some tasks may use synthetic profiles to isolate interpretation from reluctance to disclose personal experience. Task versions will be documented.

The primary participant design is a task-based qualitative evaluation of the integrated DSS. Students will explain why careers were suggested, compare conflicting interest/experience evidence, choose a next step, and describe whether the information helped their decision. Interview prompts will investigate both useful aspects and difficulties. Final recruitment and sample justification will follow the approved qualitative research purpose and institutional requirements; no arbitrary statistical sample promise is made. A controlled comparison with another workflow is optional and would require a separate analysis plan before claims of superiority.

### 8.5 Measures and analysis

Technical measures will include exact agreement with expected cases, invalid/stale output counts, unauthorized-access outcomes, valid-generation completion, and latency under recorded conditions. AI ratings will be reported with denominators and reviewer disagreements.

Human measures will include task completion, critical errors, observed requests for assistance, comprehension questions, and perceived usefulness of sources, comparisons, and learning links. A short questionnaire may examine ease of use and usefulness, with wording and scoring reviewed before use. An established instrument may be added after its exact version and administration requirements are checked. Researcher-authored items will not be described as a validated psychometric scale.

Qualitative content analysis will identify patterns in participants' explanations, reasoning, usefulness judgments, and difficulties. Coding definitions and evidence excerpts will be recorded, with independent review of interpretation and disagreements. Descriptive counts will summarize tasks, errors, and recurring issues with denominators stated. Repeated model runs and repeated tasks from one person will not be counted as independent participants. Negative cases and incomplete tasks will be retained. Gedrimiene et al. (2024) provide relevant precedent for open-ended responses and content analysis in career-support evaluation, without establishing findings for Asgard.

Statistical hypothesis testing, numerical optimization, and baseline ablations are not mandatory for these bounded qualitative and technical claims. Claims of predictive accuracy, quantitative superiority, or population-level improvement would require a suitably expanded design. Source familiarity, a valid output schema, or favorable comments alone cannot establish that the rules are sound.

Career decision confidence may be explored through a separately justified instrument and protocol. A short session or favorable satisfaction rating cannot demonstrate lasting confidence improvement, reduced anxiety, employment readiness, or successful career placement.

### 8.6 Ethics and data handling

Participation will be voluntary and separate from course grading. Recruitment will explain study tasks, recording, retention, withdrawal limits, and the advisory nature of outputs. Students will not be required to submit transcripts or resumes for the core study. Research records will use pseudonymous identifiers and restricted access, with a reviewed retention schedule.

Synthetic data will be used before any approved real-data provider processing. External AI transmission, document activation, and public hosting each retain their separate privacy/security gates. Current account-deletion deferral must be disclosed during protocol review; the research team must establish an approved withdrawal and research-data removal procedure before collecting participant records. No unimplemented deletion control will be promised.

## 9. Expected Outputs and Study Limits

Expected outputs are a reviewed occupational evidence set, a documented qualitative rule base, an integrated recommendation/comparison/learning-guidance workflow, traceable topic associations, technical verification records, and student task findings on decision-support usefulness. A useful result may include rejected mappings, missing learning coverage, rule conflicts, or explanations that fail the review rubric. Such findings identify where the system cannot support a claim.

The initial study will not establish national labor-market validity, predict future employment, certify skill, or prove long-term learning gains. Self-report is subject to interpretation and response bias. Occupational frameworks may be broader than the available student-facing career labels. A two-career pilot cannot demonstrate equal performance across all technology careers. Local supervised use cannot establish hosted reliability or accessibility across every environment.

## 10. Conclusion

Asgard proposes an integrated DSS for career recommendations, skill-to-career comparison, and learning guidance grounded in reviewed occupational knowledge. Its rules consider interests and reported experience while preserving opportunities to explore a new direction. AI helps explain supported evidence; it does not supply invented competencies or a claim of objectively correct career fit. The study will evaluate the logic, source interpretation, explanations, and usefulness of the full decision workflow. Learning resources support the student's choices, while vacancy matching and agentic orchestration remain outside the core contribution.

## References

Abaya-Garcia, A. L., & Ballada, C. J. A. (2017). Exploring the factor structure of career decision-making efficacy among Filipino students. Philippine Journal of Counseling Psychology, 19(1), 110-123. https://www.ejournals.ph/article.php?id=17308

Analytics and Artificial Intelligence Association of the Philippines. (n.d.). Philippine Skills Framework for Analytics & AI. https://www.aap.ph/philippine-skills-framework-for-analytics-and-ai

Department of Information and Communications Technology. (2024, March). Updated National ICT Competency Standards. https://cms-cdn.e.gov.ph/DICT/pdf/DICT_Updated%20NICS.pdf

Fabo, B., & Kurekova, L. M. (2022). Methodological issues related to the use of online labour market data (ILO Working Paper No. 68). International Labour Organization. https://doi.org/10.54394/ZZBC8484

Faruque, S. H., Khushbu, S. A., & Akter, S. (2025). Decision support system to reveal future career over students' survey using explainable AI. Education and Information Technologies, 30, 14471-14509. https://doi.org/10.1007/s10639-025-13361-7

Gedrimiene, E., Celik, I., Kaasila, A., Makitalo, K., & Muukkonen, H. (2024). Artificial Intelligence (AI)-enhanced learning analytics (LA) for supporting Career decisions: advantages and challenges from user perspective. Education and Information Technologies, 29, 297-322. https://doi.org/10.1007/s10639-023-12277-4

National Center for O*NET Development. (n.d.). O*NET OnLine help: Scales, ratings, and standardized scores. https://www.onetonline.org/help/online/scales

Peffers, K., Tuunanen, T., Rothenberger, M. A., & Chatterjee, S. (2007). A design science research methodology for information systems research. Journal of Management Information Systems, 24(3), 45-77. https://doi.org/10.2753/MIS0742-1222240302

Watson, H. J. (2018). Revisiting Ralph Sprague's framework for developing decision support systems. Communications of the Association for Information Systems, 42, Article 13. https://doi.org/10.17705/1CAIS.04213
