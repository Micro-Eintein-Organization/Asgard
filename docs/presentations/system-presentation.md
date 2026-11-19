# Asgard: An AI Career Decision Support System

Presentation draft prepared by Codex on 2026-11-19. Last updated: 2026-11-19.

Status: Ready for group review; presenter details and demonstration rehearsal remain pending. Presentation framing follows the project owner's stated original title and goal. This document is presentation material, not a replacement for requirements, architecture, or acceptance records.

Scope: Revise the presentation wording only. No application, contract, dependency, or product-scope changes. Relevant requirements: REQ-04/05 (Discovery and suggestions), REQ-06 (career exploration/comparison), REQ-07/08/09/10 (roadmaps and progress), REQ-11 (profile and skills), and REQ-12 (guidance). Content reviewer: project owner; technical reviewer mapping: [CODEOWNERS](../../.github/CODEOWNERS). Review is pending.

## How to use this draft

- Present Slides 1-9, then switch directly to the live system demonstration and Q&A.
- Keep Slides 10-13 in reserve after the Q&A slide. Open them if the professor asks for supporting details.
- Copy only the **Slide bullets** into PowerPoint. Use **Presenter notes** as speaking guidance.
- Replace all bracketed placeholders with actual group information. Do not invent dates, costs, test results, or member contributions.
- Rehearse the AI features in the actual demonstration environment before promising to show them.

## Slide 1 - Project Title

### Slide bullets

- **Asgard: An AI Career Decision Support System**
- A web-based system that helps users explore technology careers, consider a career shift, and identify a practical next learning step.
- Combines guided Discovery, career comparison, skill matching, AI guidance, and learning roadmaps.
- Presented by: **[Group name and members]**
- **[Course and section] | [Instructor] | [Presentation date]**

### Presenter notes

“Our original goal is to help users make informed decisions about technology careers. Asgard brings together information about career options, guidance for understanding those options, and learning paths for pursuing a chosen direction. The user remains responsible for the final decision.”

## Slide 2 - Project Background and Problem

### Slide bullets

- Students and beginners may be interested in technology but unsure which field to choose or where to start.
- People considering a career shift may need help understanding how their existing skills relate to a new role and what to learn next.
- Even experienced learners may be unsure which skills to develop next as their interests and career goals change.
- Career descriptions and course lists can leave users uncertain about how to connect their interests, current experience, and learning choices.
- The central problem is deciding which direction to explore, which skills to learn or strengthen, and which resources to use.
- Asgard connects career exploration, skill comparison, AI guidance, and curated learning resources to support that next-step decision.

### Presenter notes

“A beginner may ask, ‘Which technology field should I explore?’ Someone shifting careers may ask, ‘How do my current skills relate to this role, and what should I learn?’ A person with experience may ask, ‘What should I study next for the direction I want to pursue?’ These users have different starting points, but each needs help connecting a career direction to a practical learning step.”

“Asgard lets users explore and compare careers, review reported skills, ask questions, and use curated roadmaps and resources. It supports learning decisions without claiming to measure a person's ability or automatically determine their best career.”

These points explain the project's rationale. Describe them as survey or interview findings only if the group has supporting research.

Background framing draws on Sections 1-3 and 6.4 of the [general-audience draft paper](../research/asgard-general-audience-paper.md). This is a research proposal with no participant findings. Its dated feature inventory does not replace current implementation records.

## Slide 3 - Project Goal and Objectives

### Slide bullets

- **General goal:** Develop an AI career decision support system that helps users choose or reconsider a technology career direction and identify practical next learning steps.
- Gather users' stated interests, activities, and goals through guided Discovery, with optional profile skills and resume background.
- Present career suggestions with reasons that users can understand and review.
- Help users compare career responsibilities, skills, and example work.
- Show how saved skills or resume skill mentions relate to the skills listed for different careers.
- Provide AI-supported explanations and contextual answers to career and learning questions.
- Connect a chosen career direction to a curated roadmap and tools for tracking learning activity.

### Presenter notes

“The intended result is that a user can explain which career they want to explore, why it interests them, and what they can study next. Evaluating whether the system improves decision quality requires user evaluation; feature completion alone does not prove that outcome.”

## Slide 4 - Target Users and Stakeholders

### Slide bullets

- **Students aged 18 and above:** Explore technology careers before choosing a learning or professional direction.
- **Beginning learners:** Understand career options and starting points without requiring prior technical experience.
- **Career shifters:** Compare possible roles and identify learning paths for a new direction.
- **Experienced learners and professionals:** Explore changing interests, identify topics to study or strengthen, and organize continued learning.
- **Project team and content reviewers:** Maintain the system, review career information, and improve its guidance.

### Presenter notes

“The platform is intended for adults across experience levels, with initial design evaluation focused on students. Users can complete guided Discovery or browse careers directly after signing in. Prior work experience and a resume are optional.”

## Slide 5 - Scope and Limitations

### Slide bullets

- Serves adults aged 18 and above exploring technology careers in software, design, data, cybersecurity, hardware, and networking.
- Includes guided Discovery, career suggestions, career browsing and comparison, and AI-supported guidance.
- Includes profile skills, career skill matching, curated roadmaps, learning resources, and progress tracking; resume PDF analysis is optional when available.
- Uses available user context and published career information to support exploration; the user chooses the career and roadmap.
- Suggestions do not establish aptitude, certify skills, or guarantee employment or career success.
- AI can produce inaccurate or incomplete answers and depends on available services; user evaluation and release checks remain pending.

### Presenter notes

“Our scope is career exploration and decision support within technology. Progress records describe the learning activity users report. A completed topic is not a verified competency assessment. Roadmap content is curated, while configured AI services help explain careers and answer questions.”

## Slide 6 - Decision Support Process

### Slide bullets

- **Provide context:** Sign in and complete guided Discovery, or proceed directly to career browsing.
- **Explore options:** Review career suggestions and the reasons connected to the user's answers.
- **Compare alternatives:** Examine work and skill differences; optionally review matches from saved skills or a resume.
- **Clarify questions:** Use the AI Counselor to ask about careers or the learning content being viewed.
- **Choose a direction:** Select a career roadmap based on the user's own interests and judgment.
- **Plan the next step:** Review topics and resources, update learning activity, and continue through the Dashboard.

### Suggested visual

**User context → Career options → Comparison and clarification → User choice → Learning plan**

### Presenter notes

“This is how the system supports a decision. It gathers context, presents options, and helps the user examine them. The roadmap then connects the chosen direction to practical learning steps. Users can revisit other careers without the system automatically changing their learning focus.”

## Slide 7 - Main Features Supporting Career Decisions

### Slide bullets

- **Guided Discovery:** Collects interests and preferences and provides explained career suggestions.
- **Career Catalog:** Search and explore technology roles, responsibilities, skills, and example work.
- **Career Comparison:** Helps users examine similarities and differences between two roles.
- **Career Skill Matches:** Shows matched, unknown, and missing records using saved skills or resume skill mentions; matches do not certify ability.
- **AI Counselor:** Answers contextual career and learning questions when the service is enabled.
- **Roadmaps and Dashboard:** Organize learning topics and resources, track reported progress, and show the next learning step and activity streaks.

### Presenter notes

Use actual screenshots of Discovery, career comparison, and a roadmap. Connect each screenshot to the decision it helps the user make. Explain the Dashboard as support for following through on a choice.

## Slide 8 - AI Role and Technical Overview

### Slide bullets

- **AI guidance:** Explains career differences and answers career and learning questions through the Counselor.
- **Optional resume analysis:** Extracts skills, work experience, education, and projects from a readable-text PDF when available.
- **Matching:** Discovery first suggestions and career skill matches use defined rules; resume mentions do not establish proficiency.
- **Frontend:** React and TypeScript provide the screens, navigation, and user interactions.
- **Backend:** Python and FastAPI process application requests, enforce access rules, and call AI services through Groq.
- **Data and accounts:** Supabase PostgreSQL stores application records; Supabase Auth handles account identity.

### Suggested visual

```text
User ↔ React interface ↔ FastAPI backend ↔ PostgreSQL database
           ↕                   ↕
      Supabase Auth        Groq AI service
```

### Presenter notes

“The system combines rule-based matching, curated content, and AI-supported guidance. Current Discovery results can be prepared without an AI-provider call. AI is used in separate configured features to explain options and answer questions. This distinction helps us describe the actual implementation accurately.”

“The AI provider receives requests through the backend. Provider credentials stay server-side. Responses for structured recommendation operations are checked against the expected format and permitted career entries; these checks do not guarantee that every explanation is correct.”

Avoid presenting the system as a trained aptitude predictor, claiming that all suggestions are AI-generated, or assigning an accuracy percentage without a completed evaluation.

## Slide 9 - Project Planning and Team Responsibilities

### Slide bullets

- **Requirements and scope:** Defined the career decision problem, intended users, objectives, and feature boundaries.
- **Design and planning:** Organized user journeys, interface designs, architecture, and development tasks.
- **Implementation:** Connected career exploration, Discovery, comparison, AI guidance, roadmaps, and progress features.
- **Verification and refinement:** Recorded focused checks and prepared member-testing journeys; final user evaluation and demo rehearsal remain pending.
- **Team responsibilities:** **[Member - actual responsibility]**, **[Member - actual responsibility]**, **[Member - actual responsibility]**.
- **Schedule and current status:** **[Insert actual milestone dates and identify completed and pending work]**.

### Presenter notes

Show a compact timeline or Gantt chart with actual dates. Explain who handled the main deliverables and what remains pending. Name a formal project methodology only if the group actually used it.

Suggested timeline labels, to be filled from the group's records: requirements → design → application foundation → feature integration → verification → presentation preparation.

## Live Demonstration - After Slide 9

For the full feature-by-feature order, actions, narration, and expected results, use the [full system demonstration guide](system-demo-guide.md).

### Opening scenario

“A student is interested in technology but is unsure which career to explore. We will show how Asgard helps the student review options, compare them, ask questions, and choose a learning direction.”

### Demonstration sequence

1. **Enter the application:** Sign in with a prepared demonstration account. Point out the Guided Discovery and Browse Careers choices.
2. **Complete Discovery:** Use a rehearsed set of answers. Explain one career suggestion and its connection to those answers.
3. **Inspect a career:** Show its responsibilities, skills, and example work.
4. **Compare two careers:** Explain one meaningful similarity and one difference. Use a pair available in the demonstrated catalog.
   Optionally show **Career skill matches** with prepared profile skills or synthetic resume evidence. Use only a view confirmed to work in the presentation environment; the sample-based view still has a recorded setup/acceptance follow-up.
5. **Show AI support:** If enabled and rehearsed, ask the Counselor a specific question, such as “How does the day-to-day work of a Data Analyst differ from a Data Engineer?” Review the response and any displayed sources or limitations.
6. **Choose a roadmap:** Show milestones, a learning topic, and its resources.
7. **Record activity:** Update a topic status and return to the Dashboard to show the saved learning focus and progress.

### Demonstration preparation

- Confirm account access, catalog content, saved-state behavior, and AI service availability in the presentation environment.
- Prepare screenshots or a recording of the same flow and an already-tested local fallback if available.
- If live AI is unavailable, explain the failure and use a clearly labeled recorded example. Do not present a recorded response as a live result.
- Finish with: “This demonstrates how the system connects career exploration, informed user choice, and a practical learning plan.”

## Q&A Slide

- **Questions and Discussion**
- **Asgard: An AI Career Decision Support System**

Keep the system open and the following slides available for questions.

## Reserve Slide 10 - Resources, Costs, and Risks

### Slide bullets

- **People:** Team members contribute to planning, design, development, content preparation, testing, and documentation.
- **Tools and services:** Development computers, internet access, GitHub, Docker, and configured hosting, database, and AI services.
- **Actual costs:** **[Itemized expenses and total]**; identify free-tier services and separate estimates from actual spending.
- **Service risk:** Connection problems, provider limits, and hosting delays may interrupt demonstrations; prepare a tested fallback.
- **Guidance risk:** AI can produce incomplete or inaccurate explanations; review outputs and communicate limitations.
- **Scope and schedule risk:** Prioritize the core decision-support flow and record deferred work separately.

### Presenter notes

Discuss risks the group actually encountered and the actions taken. Free-tier use does not prove that the project has no operating costs or can support unlimited users.

## Reserve Slide 11 - Testing and Verification

### Slide bullets

- Recorded Discovery checks cover saved answers, conditional questions, retakes, direct and related suggestions, and reuse of saved results.
- Focused account-isolation checks cover selected unauthorized reads or changes to another account's records.
- Recorded comparison checks cover selected role pairs, explanation display, source presentation, and reversed selection order.
- Recorded profile and resume checks cover selected extraction displays, removal behavior, and separation from self-reported skill levels.
- Focused career skill matching checks cover matching rules and the two comparison views; member-testing completion is not yet established.
- These checks verify selected behaviors; learner comprehension, live AI quality, and broader release acceptance still require evaluation.
- **Final demo rehearsal:** **[Date, environment, scenarios checked, results, and remaining issues]**.

### Presenter notes

These bullets summarize dated project evidence, not a fresh test run. Some browser checks used simulated provider responses. Report the scope and date if asked; avoid claiming a system-wide pass rate or proven improvement in career decisions.

Evidence: [Discovery verification](../features/guided-discovery-v2.md), [career comparison](../features/career-comparison-and-shortlist.md), and [Counselor implementation and limits](../features/contextual-counselor-profile.md).

## Reserve Slide 12 - Example Decision Support Scenario

### Slide bullets

- **Starting situation:** A learner enjoys working with data but is unsure which technology role to explore.
- **Discovery:** The learner provides interests and receives career options with explanations based on the actual submitted answers.
- **Comparison:** The learner reviews Data Analyst and Data Engineer responsibilities, skills, and example work.
- **Optional skills review:** The learner checks how saved skills or resume mentions relate to career skills, without treating matches as proof of competence.
- **AI clarification:** When available, the learner asks a focused question about the differences between the roles.
- **User decision:** The learner selects a career direction and inspects the associated roadmap.
- **Next action:** The learner chooses a topic, reviews resources, and records learning activity.

### Presenter notes

This is an illustrative scenario, not a claim about an evaluated participant or a guaranteed Discovery output. Rehearse the exact answers and choose a supported comparison pair before presenting.

## Reserve Slide 13 - Accomplishments and Next Steps

### Slide bullets

- Implemented a connected application for exploring careers, reviewing suggestions, comparing alternatives, and planning learning.
- Added AI-supported guidance to help users ask questions and understand career and learning content.
- Implemented profile skills, optional resume analysis, and career skill matching; live availability still needs confirmation for the demo.
- Connected career choice to curated roadmaps and account-based tracking of reported learning activity.
- Remaining evaluation includes student walkthroughs, content review, and live AI answer-quality assessment.
- Remaining release work includes applicable hosted security, accessibility, and operational checks.
- Next priority: Evaluate whether users understand the suggestions and can explain their selected career direction and next learning step.

### Presenter notes

Separate implemented functionality from demonstrated usefulness and production readiness. The group can show the decision-support workflow; claims that it improves decision confidence or accuracy need supporting evaluation.

## Likely Defense Question - Why Is It Called an AI Career Decision Support System?

“Asgard supports career decisions by combining user-provided context, published career information, comparison tools, and AI-supported explanations. AI helps users ask follow-up questions and understand their options. Current Discovery first suggestions use defined matching rules. Users remain in control of the final choice, and curated roadmaps help them act on that choice.”

## Source References and Review Checklist

The presentation title follows the owner's request on 2026-11-19. Current behavior and limitations were checked against:

- [Project overview](../../README.md)
- [Product requirements and scope](../product.md)
- [Approved architecture](../architecture.md)
- [Current implementation](../development.md#current-implementation)
- [Career recommendation rules and boundaries](../specs/career-recommendations.md)
- [Guided Discovery implementation and recorded verification](../features/guided-discovery-v2.md)
- [Contextual Counselor implementation](../features/contextual-counselor-profile.md)
- [Remaining work and release acceptance](../future-development.md)
- [Presentation accuracy review](presentation-accuracy-review.md)

Review before transferring to PowerPoint:

- [ ] Confirm the exact title, group names, course, instructor, and presentation date.
- [ ] Fill in actual team responsibilities, timeline, and costs.
- [ ] Select current application screenshots and rehearse the exact demonstration scenario.
- [ ] Confirm that the AI functions described are enabled in the presentation environment.
- [ ] Record the rehearsal outcome without treating historical checks as a new test run.
- [ ] Have the project owner review the wording and remaining limitations.

This is a documentation-only presentation draft. It changes no feature behavior, so no feature implementation guide or application test run is required. Local reference and whitespace checks apply; application acceptance and manual demonstration remain separate.
