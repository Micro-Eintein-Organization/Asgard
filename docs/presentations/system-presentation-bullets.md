# Asgard: An AI Career Decision Support System

## Slide 1 - Project Title

- **Asgard: An AI Career Decision Support System**
- A web-based system that helps users explore technology careers, consider a career shift, and identify a practical next learning step.
- Combines guided Discovery, career comparison, skill matching, AI guidance, and learning roadmaps.
- Presented by: **[Group name and members]**
- **[Course and section] | [Instructor] | [Presentation date]**

## Slide 2 - Project Background and Problem

- Students and beginners may be interested in technology but unsure which field to choose or where to start.
- People considering a career shift may need help understanding how their existing skills relate to a new role and what to learn next.
- Even experienced learners may be unsure which skills to develop next as their interests and career goals change.
- Career descriptions and course lists can leave users uncertain about how to connect their interests, current experience, and learning choices.
- The central problem is deciding which direction to explore, which skills to learn or strengthen, and which resources to use.
- Asgard connects career exploration, skill comparison, AI guidance, and curated learning resources to support that next-step decision.

## Slide 3 - Project Goal and Objectives

- **General goal:** Develop an AI career decision support system that helps users choose or reconsider a technology career direction and identify practical next learning steps.
- Gather users' stated interests, activities, and goals through guided Discovery, with optional profile skills and resume background.
- Present career suggestions with reasons that users can understand and review.
- Help users compare career responsibilities, skills, and example work.
- Show how saved skills or resume skill mentions relate to the skills listed for different careers.
- Provide AI-supported explanations and contextual answers to career and learning questions.
- Connect a chosen career direction to a curated roadmap and tools for tracking learning activity.

## Slide 4 - Target Users and Stakeholders

- **Students aged 18 and above:** Explore technology careers before choosing a learning or professional direction.
- **Beginning learners:** Understand career options and starting points without requiring prior technical experience.
- **Career shifters:** Compare possible roles and identify learning paths for a new direction.
- **Experienced learners and professionals:** Explore changing interests, identify topics to study or strengthen, and organize continued learning.
- **Project team and content reviewers:** Maintain the system, review career information, and improve its guidance.

## Slide 5 - Scope and Limitations

- Serves adults aged 18 and above exploring technology careers in software, design, data, cybersecurity, hardware, and networking.
- Includes guided Discovery, career suggestions, career browsing and comparison, and AI-supported guidance.
- Includes profile skills, career skill matching, curated roadmaps, learning resources, and progress tracking; resume PDF analysis is optional when available.
- Uses available user context and published career information to support exploration; the user chooses the career and roadmap.
- Suggestions do not establish aptitude, certify skills, or guarantee employment or career success.
- AI can produce inaccurate or incomplete answers and depends on available services; user evaluation and release checks remain pending.

## Slide 6 - Decision Support Process

- **Provide context:** Sign in and complete guided Discovery, or proceed directly to career browsing.
- **Explore options:** Review career suggestions and the reasons connected to the user's answers.
- **Compare alternatives:** Examine work and skill differences; optionally review matches from saved skills or a resume.
- **Clarify questions:** Use the AI Counselor to ask about careers or the learning content being viewed.
- **Choose a direction:** Select a career roadmap based on the user's own interests and judgment.
- **Plan the next step:** Review topics and resources, update learning activity, and continue through the Dashboard.

## Slide 7 - Main Features Supporting Career Decisions

- **Guided Discovery:** Collects interests and preferences and provides explained career suggestions.
- **Career Catalog:** Search and explore technology roles, responsibilities, skills, and example work.
- **Career Comparison:** Helps users examine similarities and differences between two roles.
- **Career Skill Matches:** Shows matched, unknown, and missing records using saved skills or resume skill mentions; matches do not certify ability.
- **AI Counselor:** Answers contextual career and learning questions when the service is enabled.
- **Roadmaps and Dashboard:** Organize learning topics and resources, track reported progress, and show the next learning step and activity streaks.

## Slide 8 - AI Role and Technical Overview

- **AI guidance:** Explains career differences and answers career and learning questions through the Counselor.
- **Optional resume analysis:** Extracts skills, work experience, education, and projects from a readable-text PDF when available.
- **Matching:** Discovery first suggestions and career skill matches use defined rules; resume mentions do not establish proficiency.
- **Frontend:** React and TypeScript provide the screens, navigation, and user interactions.
- **Backend:** Python and FastAPI process application requests, enforce access rules, and call AI services through Groq.
- **Data and accounts:** Supabase PostgreSQL stores application records; Supabase Auth handles account identity.

## Slide 9 - Project Planning and Team Responsibilities

- **Requirements and scope:** Defined the career decision problem, intended users, objectives, and feature boundaries.
- **Design and planning:** Organized user journeys, interface designs, architecture, and development tasks.
- **Implementation:** Connected career exploration, Discovery, comparison, AI guidance, roadmaps, and progress features.
- **Verification and refinement:** Recorded focused checks and prepared member-testing journeys; final user evaluation and demo rehearsal remain pending.
- **Team responsibilities:** **[Member - actual responsibility]**, **[Member - actual responsibility]**, **[Member - actual responsibility]**.
- **Schedule and current status:** **[Insert actual milestone dates and identify completed and pending work]**.

## Live Demonstration - After Slide 9

- Scenario: A student explores technology careers, compares options, and chooses a learning direction.
- Sign in and show the Guided Discovery and Browse Careers choices.
- Complete Discovery and explain how one suggestion relates to the submitted answers.
- Open a career and review its responsibilities, skills, and example work.
- Compare two careers and identify a meaningful similarity and difference.
- Optionally show career skill matches using prepared profile skills or synthetic resume evidence, if available.
- Ask the AI Counselor a specific career question, if the service is enabled.
- Select a roadmap and inspect its milestones, topics, and resources.
- Update a topic status and show the saved learning focus and progress on the Dashboard.

## Q&A

- Questions and Discussion
- Asgard: An AI Career Decision Support System

## Reserve Slide 10 - Resources, Costs, and Risks

- **People:** Team members contribute to planning, design, development, content preparation, testing, and documentation.
- **Tools and services:** Development computers, internet access, GitHub, Docker, and configured hosting, database, and AI services.
- **Actual costs:** **[Itemized expenses and total]**; identify free-tier services and separate estimates from actual spending.
- **Service risk:** Connection problems, provider limits, and hosting delays may interrupt demonstrations; prepare a tested fallback.
- **Guidance risk:** AI can produce incomplete or inaccurate explanations; review outputs and communicate limitations.
- **Scope and schedule risk:** Prioritize the core decision-support flow and record deferred work separately.

## Reserve Slide 11 - Testing and Verification

- Recorded Discovery checks cover saved answers, conditional questions, retakes, direct and related suggestions, and reuse of saved results.
- Focused account-isolation checks cover selected unauthorized reads or changes to another account's records.
- Recorded comparison checks cover selected role pairs, explanation display, source presentation, and reversed selection order.
- Recorded profile and resume checks cover selected extraction displays, removal behavior, and separation from self-reported skill levels.
- Focused career skill matching checks cover matching rules and the two comparison views; member-testing completion is not yet established.
- These checks verify selected behaviors; learner comprehension, live AI quality, and broader release acceptance still require evaluation.
- **Final demo rehearsal:** **[Date, environment, scenarios checked, results, and remaining issues]**.

## Reserve Slide 12 - Example Decision Support Scenario

- **Starting situation:** A learner enjoys working with data but is unsure which technology role to explore.
- **Discovery:** The learner provides interests and receives career options with explanations based on the actual submitted answers.
- **Comparison:** The learner reviews Data Analyst and Data Engineer responsibilities, skills, and example work.
- **Optional skills review:** The learner checks how saved skills or resume mentions relate to career skills, without treating matches as proof of competence.
- **AI clarification:** When available, the learner asks a focused question about the differences between the roles.
- **User decision:** The learner selects a career direction and inspects the associated roadmap.
- **Next action:** The learner chooses a topic, reviews resources, and records learning activity.

## Reserve Slide 13 - Accomplishments and Next Steps

- Implemented a connected application for exploring careers, reviewing suggestions, comparing alternatives, and planning learning.
- Added AI-supported guidance to help users ask questions and understand career and learning content.
- Implemented profile skills, optional resume analysis, and career skill matching; live availability still needs confirmation for the demo.
- Connected career choice to curated roadmaps and account-based tracking of reported learning activity.
- Remaining evaluation includes student walkthroughs, content review, and live AI answer-quality assessment.
- Remaining release work includes applicable hosted security, accessibility, and operational checks.
- Next priority: Evaluate whether users understand the suggestions and can explain their selected career direction and next learning step.
