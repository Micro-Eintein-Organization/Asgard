# Revised paper versus supplied original

Date: 2026-11-03. Status: document comparison complete; human/adviser review and proposed feature acceptance pending.

Compared: the user-supplied text beginning “AI Career Decision Support System for Philippine Computer Science Students” attached on 2026-11-03, and the [revised paper](asgard-consolidated-paper.md). This is a claim-by-claim scope review, not a similarity score or verification of implemented behavior. The original attachment is preserved unchanged. Its introduction, six objectives, background, operations, scope boundary, pipeline/flow description, and references were considered.

## Verdict

The revision matches the original's central purpose: help Philippine CS students relate personal experience to technology careers, understand relevant development needs, and choose useful learning actions through explainable AI-assisted decision support. It retains skill normalization, skill-to-career matching/comparison, career suggestions and personalized guidance as connected functions. It now explicitly considers interests so that current skills do not determine the student's future options.

It is not the original with only two phrases deleted. Further changes follow the consultation and current project boundaries: no unsupported fit percentage or proficiency subtraction; occupational frameworks replace a promised continuous market pipeline; document extraction is staged; curated topics underpin personal guidance; and evaluation claims remain proposals. These differences are necessary to describe what the team actually intends and can defend.

## Original objective coverage

| Original objective/promise | Revised treatment | Alignment finding |
| --- | --- | --- |
| Connect documented competencies to Philippine technology work and give guidance | Connect confirmed experience and interests with reviewed Philippine occupational/competency sources, supplemented by O*NET | Purpose preserved; framework evidence is not live employer demand |
| Extract and normalize skills from resumes, transcripts, self-assessments | Manual confirmed records and reviewed normalization in core; resume PDF enrichment later; transcripts/OCR not core | Normalization preserved; automatic document extraction explicitly staged, not claimed delivered |
| Continuously source Philippine job/LMI data | Reviewed versioned occupational knowledge in core; permitted dated posting observations optional | Core data methodology deliberately changed |
| Compute numerical career alignment and rank roles | Explained career alternatives using documented interest/experience rules; no universal fit percentage | Recommendation purpose preserved; numerical scoring/ranking promise replaced |
| Identify and rank missing/underdeveloped skills | Distinguish relevant experience, unassessed areas and explicit development needs; learning priority uses chosen goals and authored order | Actionable comparison preserved; measured deficit/market-importance claims removed |
| Generate a personalized learning pathway through existing agents | Suggest reviewed topics/resources relevant to the selected career and reported needs; preserve canonical curricula/progress | Personal guidance preserved; agents and generated replacement curriculum removed |
| Explain every score and recommendation | Trace reasons to actual user evidence, reviewed relationships and decision rules | Explainability strengthened; unsupported score eliminated |

## Original pipeline and conceptual coverage

| Original stage | Revised location and behavior |
| --- | --- |
| Input collection | Sections 5 and 6: interests/goals and confirmed manual experience plus reviewed occupational knowledge |
| Skill extraction | Manual structured collection now; document-derived candidate statements only in a later reviewed extension |
| Skill normalization | Sections 4, 6.2 and 7: aliases and stable source-linked competency identities; no unsupported synonym equivalence |
| Skill matching | Section 6.3: explicit career/competency relationships and categorical experience comparison |
| Skill-gap analysis | Section 6.3: development opportunities and uncertainty; a missing record does not prove inability |
| Career ranking | Sections 6.2-6.3: bounded recommendations, explicit selection-policy review, no validated universal ranking asserted |
| Completeness check | Section 6.2: validate before the dependent conclusion; incomplete optional information does not prevent browsing |
| Learning-path generation | Sections 6.2-6.4: explained suggestions from reviewed topics and authored sequence; student controls action |
| Student outputs | Sections 6 and 9: career alternatives/reasons, skill comparison/limitations, relevant learning guidance, correction and reconsideration |
| System flowchart | Section 6.5 gives an explicit textual flow and illustrative scenario; a graphical flowchart is not included |

The recommendation and comparison functions remain distinct but connected: interests and experience can support suggestions, and the student can inspect a career beyond the suggestion list. The research contribution is the integrated DSS, not simply adding a profile editor or completing roadmap topics.

## Agentic framework and vacancy matching

The original repeatedly assumes an existing multi-agent Student Career Assistant architecture, while also saying it does not build one from scratch. That premise does not match Asgard's current modular-monolith/provider-adapter foundation. The revision removes it as an implementation or research dependency and does not use agentic literature to imply existing capability.

The original scope boundary already states that direct job application, matching, placement and employer-facing tools are excluded. Therefore “remove job matching” is partly a clarification of the original rather than a newly removed original deliverable. The revision makes specific-advertisement matching explicitly out of scope and removes mandatory posting ingestion that could otherwise create that expectation. Occupational skill matching remains included and must not be described as vacancy matching.

## Literature treatment

The revised paper retains the previously checked references for limited claims and adds Watson's primary-published DSS framework discussion, giving nine references. It does not carry forward unverified DOLE/IMF report claims, specific unverified matching algorithms, claims that no comparable system exists, or unverified agentic implementation/effectiveness details. The [earlier citation review](consolidation-review.md#literature-and-citation-review) records those limits. This pass reuses that source evidence rather than claiming full-text review of every supplied citation.

The paper uses verified sources to justify occupational reference meanings, decision-support structure, prior student-oriented AI work, and qualitative evaluation. A framework's authority does not automatically validate Asgard's mappings or rules. Those still require content review and focused evaluation.

## Remaining limitations and readiness

The paper is ready for adviser review as a revised research proposal, not a completed or technically accepted system study. The proposed model is a knowledge-based/rule-based DSS with bounded AI assistance; it does not require a custom statistical career predictor. Existing AI reliability counts, reviewer ratings, security and quality gates remain necessary.

Outstanding methodological details are stated rather than hidden: accepted occupational/interest/topic mappings; a complete decision table; selection/truncation/tie policy for the bounded suggestion list; experience wording; and recruitment/protocol approval. The paper defines the evidence flow and rule semantics but does not claim a fully accepted final algorithm. Numerical fit, measured competence gaps, comparative superiority, psychological improvement and employment success are not promised.

No runtime, source mappings, feature implementation, schema/API, dependencies or backlog statuses changed in this task. No application or participant checks were run. Artifact checks and final PDF visual inspection are reported in [verification](verification.md).
