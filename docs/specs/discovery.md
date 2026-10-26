---
id: F-001
kind: spec
status: draft
requires: [BRIEF, PRD]
requirements: [REQ-01, REQ-04, REQ-05, REQ-11, REQ-13]
acceptance: [F-001-AC-01, F-001-AC-02, F-001-AC-03, F-001-AC-04, F-001-AC-05, F-001-AC-06, F-001-AC-07, F-001-AC-08]
---

# Asgard: Discovery

**Version 0.2 · 23 October 2026 · Status: Draft for review**

Implementation pointers updated 26 October 2026. Stage 4 provides [Discovery schemas](../../backend/app/modules/discovery/schemas.py), generic saved-session/answer envelopes, a versioned identity registry and generated API scaffolding. The [shared handoff](../development.md#stage-4-shared-contracts-and-handoff) defines ownership/revision boundaries; feature handlers still return 501. Authored question/option publication, service-level meaning/exclusion validation and persisted UI integration remain unfinished. Local selection screens do not establish saved Discovery acceptance. The BRIEF provenance gap is recorded in [Decisions](../decisions.md#documentation-authority-and-unresolved-integration-records).

This specification follows [Product](../product.md), [pages](../pages-and-interactions.md), and [journeys](../user-journeys.md). The five existing themes and wording areas remain the content baseline; the owner clarified on 26 October 2026 that later question or choice sets may depend on earlier answers. The current UI is an unfinished skeleton, not the route authority. Assignment A must propose a reviewed route map before branch-dependent implementation. Controls and persistence below are baseline policies, subject to that route map; comprehension/evaluation are required evidence, not completed work. Earlier short/expanded questionnaires remain historical, not additional app modes.

## Purpose

Help authenticated users find catalog-grounded careers and learning paths worth exploring. Suggestions are advisory rather than assessed competence, career fit, or employment readiness. Free Browsing skips Discovery; it does not permit anonymous access to protected pages.

## Screen sequence

Use the existing themes as the question-content baseline: general interests, activities and motivations, work approach, experience and background, and goals. Earlier answers may determine which later question or choice set is shown; the final route and question count depend on the reviewed route map. Results follow the applicable route and are not an answer-review round. See [Discovery pages and interactions](../pages-and-interactions.md#2-discovery--setup) for entry choice, screen behavior, and missing design states. [J-02](../user-journeys.md#j-02-complete-or-leave-guided-discovery) owns the end-to-end route. No A/B selector, separate answer-review page, or mandatory completion/profile screen is introduced.

## Discovery copy draft

### Source and writing rules

The owner requested simpler wording while retaining the five existing themes as the content baseline. The baseline exports show five questions followed by results; they do not settle the conditional route map. The historical frontend snapshot has different question choices and does not supply questionnaire authority. Tables below pair each original card title with revised copy so the meaning can be reviewed. These titles are editorial references, not answer identifiers or a data contract.

- Use familiar words with specific descriptions of the activity. Keep meaningful distinctions such as software logic, data handling, and security; do not replace every option with a vague phrase such as solving problems.
- Address adults with different experience levels. Avoid slang, personality types, skill rankings, and language suggesting that prior technical experience is necessary.
- Use sentence case. Keep each question separate from its short subject label. Do not repeat the round number inside the question.
- Keep interest separate from experience. A preferred activity or approach does not demonstrate ability, and uncertainty does not imply dislike.
- Use the existing required uncertainty option with the wording below wherever it applies. Adding it to frames that lack it completes documented uncertainty support.
- Show Choose all that apply for rounds 1–4 and Choose one for round 5. Use the controls policy below, including exclusive uncertainty and background exclusions. Selected-card artwork does not change these rules.
- Preserve answer identity and reviewed meaning when implementation contracts are defined. A label change does not authorize a new interpretation, mapping, branch, or stored-answer migration. Conditional routes and their answer identities require explicit authored definitions.

### Entry and shared labels

| Location | Copy |
| --- | --- |
| Entry heading | How would you like to begin? |
| Guided path | Guided Discovery |
| Guided description | Answer questions about your interests, experience, and goals to get career suggestions. |
| Direct browsing path | Browse careers |
| Direct browsing description | Explore careers and learning roadmaps without answering the questions. |
| Entry action | Continue |
| Question flow title | Discovery |
| Question progress | Show the current question and progress through the applicable route; do not assume a fixed total until routes are authored |
| Earlier question action | Next |
| Final question action | See suggestions |
| Previous question action | Back |
| Exit questions | Skip questions and browse careers |
| Selected answer indicator | Selected |
| Resume action | Resume Discovery |

Browse careers is the visible label for the existing Free Browsing path. These labels preserve existing actions and destinations. Generic card badges such as Domain, Focus, Style, and Skill base are not questionnaire answers; where retained in a design, use Interest, Activity, Approach, and Background respectively. Do not replace the Selected state with a subject label. Results use Results rather than Question 6 of 6.

### Round 1: Your interests

**Question:** What kinds of work interest you?

**Helper:** Think about what sounds interesting, even if you have never tried it.

| Original card | Revised label | Description |
| --- | --- | --- |
| Creating useful tools | Creating useful tools | Create something that helps people complete a task. |
| Designing experiences | Designing how people use technology | Plan how websites, apps, or devices look and work for the people using them. |
| Investigating problems | Investigating problems | Look for patterns, find causes, or identify weaknesses. |
| Working with devices and systems | Working with devices and systems | Set up, connect, repair, or improve devices and computer systems. |

**Uncertainty label:** I'm not sure yet

**Description:** I would like to explore different kinds of work.

### Round 2: Activities you might enjoy

**Question:** What would you enjoy working on?

**Helper:** Think about activities that interest you. You do not need experience with them.

| Original card | Revised label | Description |
| --- | --- | --- |
| Building complex logic & algorithms | Building software logic | Create the rules, steps, and calculations that make software work. |
| Crafting intuitive visual experiences | Designing screens and interactions | Plan how screens look and how people use menus, buttons, and other controls. |
| Optimizing data models & pipelines | Organizing and processing data | Plan how data is organized, move it between tools, and improve how it is processed. |
| Securing systems & cloud networks | Protecting systems and networks | Find security risks and help protect computers, connected services, and information. |

**Uncertainty label:** I'm not sure yet

**Description:** I would like to learn what these activities involve.

These descriptions preserve the four pictured activity areas. They do not add new AI, hardware, or infrastructure choices or make any interest exclusive to one career. Review catalog coverage and recommendation interpretation separately; copy alone does not establish balanced coverage of the seven launch roles.

### Round 3: How you approach problems

**Question:** How do you like to approach a problem?

**Helper:** Think about what helps you get started. Your approach may change with the situation.

| Original card | Revised label | Description |
| --- | --- | --- |
| Independent Deep Focus | Working on my own | Focus on a problem with few interruptions. |
| Collaborative & Cross-Functional | Working with others | Discuss ideas and solve problems with people who bring different skills. |
| Rapid Prototyping | Trying out ideas | Build a small version, test it, and improve it as you learn. |
| Methodical & Structured | Following a clear plan | Break the problem into steps and work through them carefully. |

**Uncertainty label:** I'm not sure yet

**Description:** My approach varies, or I have not found a preference.

Working alone/with others and trying ideas/following a plan describe different dimensions. Round 3 therefore allows multiple choices. These answers provide descriptive context, never a personality/ability classification or a career exclusion.

### Round 4: Your background

**Question:** Which best describes your background?

**Helper:** Think about learning, projects, or work you have done. You do not need a qualification or a job in technology.

| Original card | Revised label | Description |
| --- | --- | --- |
| I'm new to tech | I'm new to technology | I would like help understanding the options and where to begin. |
| Technical or related experience | I have experience with technology | I have learned about technology, worked with it, or used it in projects. |
| Experience outside tech | I have experience in another field | I would like to explore how my experience could help me in technology. |
| Not sure which fits me | I'm not sure which fits | I would like to continue without choosing a background description. |

Experience may come from independent learning, education, projects, or work. This round does not assign a skill level. Background descriptions can overlap; use the explicit exclusions in the controls policy below.

### Round 5: Your goal

**Question:** What would you like help with right now?

**Helper:** Think about what you want from Asgard. You can change direction as you explore.

| Original card | Revised label | Description |
| --- | --- | --- |
| Start learning | Start learning | Find a useful first step in an area that interests me. |
| Explore possible careers | Explore career options | Understand different careers before deciding what to learn. |
| Change career direction | Explore a career change | Find out what learning could help me move into a different kind of work. |
| I'm not sure yet | I'm not sure yet | I would like to see the options before choosing a goal. |

### Results and supporting messages

| Location | Copy |
| --- | --- |
| Results heading | Careers to explore |
| Results introduction | These suggestions are starting points based on your answers. You can explore any career in the catalog. |
| Explanation heading on each result | Why this was suggested |
| Curated skill list heading | Skills used in this career |
| Catalog action | Browse careers |
| Retake action | Retake Discovery |
| Optional profile action | Set up your profile (optional) |
| Processing | Preparing your career suggestions... |
| Request failure | We could not prepare new suggestions. Your answers are still here. Try again or browse careers. |
| Failure while retaining earlier results | These are your previous suggestions. We could not update them. Try again or browse careers. |
| No usable result | We could not find suggestions from your answers. Try again or browse careers. |
| Retry action | Try again |

Use saved-answer wording only when answers remain available; if persistence failed, report that failure instead. Explain actual supported inputs in each result rather than inventing a reason. Keep official curated career names and explain unfamiliar skill terms beside them. Skill labels describe the career, not skills the user is assumed to have. Results follow the recommendation policy: up to three roles, individual View roadmap actions, and Browse careers for the full catalog; no result must be selected first.

### Research basis and comprehension review

The wording is an editorial application of the following guidance, not a validated questionnaire or proof that every reader understands it:

- [GOV.UK: Writing for user interfaces](https://www.gov.uk/service-manual/design/writing-for-user-interfaces): use short, direct text and consistent familiar language, including for specialist audiences.
- [W3C: Use clear words](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o3p01-clear-words/): use common meanings and explain unfamiliar vocabulary. This is supplemental cognitive-accessibility guidance, not a conformance test.
- [ONS: Question design guidelines](https://www.ons.gov.uk/file?uri=/aboutus/whatwedo/paidservices/opinions/omnibusservicequestiondesignguidelines.pdf): avoid jargon and complicated questions; make room for uncertainty. This informs wording, not a claim that Asgard's questions measure career fit.

Before releasing the copy, ask beginners and experienced technical readers to explain each question and option in their own words. Check whether they can distinguish designing interactions from implementing software logic, data handling from security, and background from assessed skill. Include readers who use English as an additional language. Check whether the uncertainty labels let them answer honestly. Record misunderstood terms and revise them; readability scores alone do not establish comprehension. No comprehension sessions have been run for this draft.

## Entry, exit and persistence

- A verified new account reaches the entry choice. Guided Discovery opens the questions; Browse careers opens the catalog.
- Returning sign-in reaches Dashboard. Unfinished saved answers support an optional Resume Discovery action; the questions do not reopen automatically.
- Back retains answers. Skip questions and browse careers opens the catalog without fabricating responses.
- Profile / Active Discovery Results provides a Retake Discovery action and displays available successful context. Its empty state does not fabricate a result.
- Preserve saved answers where applicable on resume/retake and recoverable input after request failure. Save each valid round on Next or Back before navigation; explicit Skip questions saves valid pending answers first, or offers Leave without saving if persistence fails. The concurrency policy below applies.
- Failed retakes preserve previous successful recommendations. Successful updates do not reset current roadmap or topic progress.

## Question and interpretation boundaries

- Support explicit uncertainty and accessible choices with explanations under the selected controls policy below.
- Do not require technical experience, employment history, a profile image, a PDF or additional optional background to use Discovery.
- Do not interpret uncertainty as dislike or low ability. A profession, qualification or activity preference does not establish unreported competence.
- Software interest is not necessarily AI interest; automation does not necessarily use AI. Broad interest in building software does not establish a precise frontend/backend preference.
- Later question or choice sets may depend on earlier answers. Editing an earlier answer recomputes the active route; recommendations use only answers active on that route. Assignment A must propose whether inactive answers are retained for possible restoration, revisited, or cleared, and define save/resume and Back behavior before implementation. Do not silently clear or remap answers.
- Preserve the five themes and their intended order where applicable. Comprehension tests and reviewed catalog relevance attributes are release evidence; they do not replace the owner-reviewed route proposal.

## Results and recommendations

- Successful suggestions reference available catalog items and explain the relevant supported inputs in plain language. Validate references rather than invent roles, skills or resources.
- Do not display match percentages, assessed proficiency, job-readiness scores or guaranteed career suitability.
- Browse careers opens the full catalog. Inspecting/selecting a suggestion, completing Discovery or entering a category never sets the current roadmap. Only explicit Set as current roadmap inside detail does so.
- Users without Discovery can still receive guidance from an explicitly chosen roadmap and recorded topic progress. Optional successful PDF analysis supplies documented context under REQ-11.
- The recommendation specification owns the selected up-to-three result count, evidence-based explanations, context invalidation, explicit refresh and prior-result policy. It does not promise different results on every visit.
- Preferred Primary Field changes the catalog default category only, not recommendation context by itself.
- User-reported Done is not proof of mastery or career preference. Work approach is not an ability test.
- The updated MVP direction on 24 October 2026 is LLM-based recommendations grounded in curated careers, with separate optional PDF extraction. The [recommendation specification](career-recommendations.md) owns those policies and future agent / PDF-reviewer boundaries. Stage 4 encodes recommendation structures and validators; service/prompt integration, technical review and evaluation remain required. Historical work-preferences research informs discussion rather than validating this custom instrument; see [decisions](../decisions.md).

## States and recovery

| State | Required direction |
| --- | --- |
| Uncertain/mixed context | Permit exploration without invented category or negative suitability claims. |
| Back/resume | Retain saved answers; do not automatically reopen incomplete setup on sign-in. |
| Processing/failure | Honest feedback, retained answers, retry or full browsing. |
| Invalid/unavailable catalog references | Reject fabricated results and preserve exploration options. |
| Failed retake | Retain earlier successful recommendation context. |
| No successful Discovery | Appropriate Profile/catalog empty state; browsing and learning remain available. |

## Draft acceptance scenarios

These are intended outcomes, not executed tests. The selected controls above/below apply alongside these retained acceptance IDs.

### F-001-AC-01: Enter or bypass the working sequence

Given a verified new user reaches ENTRY-CHOICE, Guided Discovery opens the authored conditional question route and Browse careers opens the catalog. There is no A/B selector, mandatory profile form or separate answer-review page. Returning users reach Dashboard and may explicitly resume unfinished saved Discovery.

### F-001-AC-02: Represent uncertainty without invented ability

Given the user expresses uncertainty or describes a background, the system supports continued exploration and does not infer low ability, dislike or unreported technical strengths. Controls follow the selected policy; mapping must use reviewed catalog attributes without ability inferences.

### F-001-AC-03: Work without optional enrichment

Given no photo, PDF, employment history or optional background is supplied, the user can complete the required selections or uncertainty responses and reach Careers. Dashboard enrichment remains an optional later action.

### F-001-AC-04: Keep guidance separate from learning focus

Given the user submits Discovery, views results, retakes, or opens a suggestion, the full catalog stays available and neither current roadmap nor topic states change automatically. Browse careers opens the catalog without an added mandatory completion screen.

### F-001-AC-05: Ground results and recover honestly

Given successful results, each reference is available curated content with an explanation supported by relevant supplied inputs, without match/readiness percentages. Given failure, preserve answers and prior successful results rather than showing invented success; retry or browsing remains available.

## Selected controls and persistence

| Stage | Control | Rule |
| --- | --- | --- |
| Entry | Two radio cards, no initial selection | Continue requires an explicit path; show inline error and focus its summary if absent. Remove the duplicate Start Assessment action |
| Rounds 1–3 | Checkbox cards | One or more substantive options, up to all four, or exclusive I'm not sure yet. Selecting uncertainty clears substantive choices; selecting a substantive choice clears uncertainty |
| Round 4 | Checkbox cards | Technology experience and experience in another field may coexist. I'm new to technology excludes technology experience but may coexist with experience in another field. Uncertainty excludes all substantive options. Explain any cleared conflicting selection accessibly |
| Round 5 | Radio cards | Exactly one goal, including I'm not sure yet; no initial selection |
| Results | Individual View roadmap and full Browse careers | No selected-result state or shared selection button; opening detail does not set current focus |

Require an answer or uncertainty in each round only to submit Discovery; Browse careers remains available at every step. These controls follow the multiple-choice/single-choice distinction in [GOV.UK checkboxes](https://design-system.service.gov.uk/components/checkboxes/) and [radios](https://design-system.service.gov.uk/components/radios/). The specific combinations are Asgard product decisions, not validated psychometric rules.

No optional free-text fields are introduced. Conditional questions and choice sets must be defined in the reviewed route map. The background theme includes independent learning/projects as experience and must not imply that work or qualifications are required. Baseline checkbox/radio and uncertainty rules apply to the existing themes, subject to the route map. Keep the existing wording tables as the content baseline; no new answer meanings are inferred.

Save valid answers at explicit Next/Back/Skip checkpoints, with pending/success/failure feedback; do not autosave every click. Invalid current-round answers may return via Back without discarding earlier saved rounds; preserve the current local draft while the tab stays open. Closing an unsaved draft or navigating elsewhere offers Save and leave (if valid), Leave without saving, or Stay. Do not claim unsubmitted changes survived a closed tab. Warn on unsaved browser exit where supported, without relying on that warning as persistence.

Use a versioned saved draft. A stale tab must not overwrite a newer revision; show that answers changed elsewhere and offer Reload saved answers or an explicit reviewed overwrite after seeing both versions. No silent last-write-wins. Retake starts from the last successful answer set in a separate draft; the previous successful result remains until eligible replacement. Final submission atomically accepts the answer revision before generation; generation failure preserves it for explicit retry.

## Additional acceptance scenarios

- **F-001-AC-06:** Entry starts unselected; the authored conditional route enforces applicable controls, exclusive uncertainty and accessible errors. Earlier answers determine the active later questions/choice sets; inactive answers are excluded from recommendations. Route changes and inactive-answer retention/clearing follow the reviewed route policy.
- **F-001-AC-07:** Next/Back/Skip saves valid answers; failed save and dirty exit offer truthful recovery. Concurrent drafts cannot silently overwrite newer revisions.
- **F-001-AC-08:** Results offer direct View roadmap and Browse careers without selection or automatic current focus. Editing answers invalidates old context and obeys F-002 refresh policy.

## Remaining evidence

Run the comprehension cases in [verification](../verification.md), author/review catalog relevance attributes and versioned questionnaire/option content, review the existing generic answer/session contract, and implement/test persistence and concurrency. Product choices above are selected; no comprehension sessions or complete Discovery runtime acceptance tests are recorded.
