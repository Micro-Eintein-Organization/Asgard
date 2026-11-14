# Guided Discovery v2 review packet

## Results recovery and presentation follow-up, 2026-11-09

Owner request: automatically retry temporary failures, keep previous suggestions
out of the main view, make the full retake easy to find, and restore compact
cards. Owner: Codex. Reviewer: `@YakisobaNissin`. F-001-AC-08 and F-002
recovery, provenance and quota checks apply. Keep the existing request and retry
operations, candidate eligibility and validation. The observed HTTP 413 follows
a roughly 12,000-token input; fit GPT-OSS recommendation requests within the
provider budget using the existing optional-evidence compaction. Allow one
automatic recovery for an explicitly requested Results attempt, honoring short
cooldowns and canceling on navigation or context change. Keep older runs and
evidence behind separate disclosure controls. Check the provider budget,
transient recovery, Results layout and retake placement.

Prepared by Codex on 2026-11-09 for PM-W05 / FUT-05. The project owner approved the four-to-six-question scope in the 2026-11-09 task message beginning “PLEASE IMPLEMENT THIS PLAN: # Asgard Guided Discovery redesign.” Implementation owner: Codex. Product and W01 technical reviewer: `@YakisobaNissin`, per [CODEOWNERS](../../.github/CODEOWNERS). The owner approved the bounded W01 proposal in the follow-up asking for a full retake and saying “please approve and implement.” See [decisions](../decisions.md#w05-guided-discovery-revision-scope-2026-11-09) and the [implementation guide](../features/guided-discovery-v2.md). Learner comprehension remains pending before release.

Acceptance: [F-001-AC-01–08](../specs/discovery.md#f-001-ac-01-enter-or-bypass-the-working-sequence), [F-002](../specs/career-recommendations.md) for active evidence, uncertainty, saved results and failure recovery. Keep the existing recommendation provider, catalog eligibility, learner-confirmed skill reports and authored roadmap order. The welcome screen still offers Guided Discovery or Browse careers. The active branch at review was `codex/cabusao-ui-integration`; this is post-MVP feature work. The working tree already contained edits in AI guidance, resume matching, Progress, and associated tests and guides. Coordinate any future overlap and preserve those edits.

## Content and route review

The approved questionnaire order is optional experience preference → fields → one activity question per selected field, or one general activity question → at most one follow-up → goal. The opening asks whether the learner wants to build on existing experience. **Use my experience** puts skill comparison first on Results; **Start with the basics**, uncertainty and Skip put the roadmap first. The opening is distinct from the goal question and supplies no recommendation evidence. The goal choices retain their current wording. Skip on the opening records its uncertainty choice and advances; the existing exit to Careers remains a separate action.

The table lists the approved activity copy and the authored example checked in the [23 career guides](../../backend/app/content/guide_v4/). The first activity in each field also appears in the general question, in the same order. These associations are review expectations, not weights or a runtime filter.

| Field | Activity | Career and guide evidence |
| --- | --- | --- |
| Build apps, websites, or games | Build pages people interact with | Frontend Developer builds an interactive website. |
| | Build the services behind an app | Backend Developer builds a REST API with persistence. |
| | Build both the screens and services | Full Stack Developer builds a web interface and server API together. |
| | Build phone apps | Mobile Developer builds a cross-platform mobile app. |
| | Build games | Game Developer builds a playable game. |
| | Add AI features to a product | AI Engineer builds an assistant using model and search tools. |
| Find answers in data | Investigate questions using data | Data Analyst answers a question in a short analysis report. |
| | Build dashboards people use regularly | Business Intelligence (BI) Analyst builds a KPI dashboard. |
| | Move and prepare data for others to use | Data Engineer builds a repeatable data pipeline. |
| | Test ideas and make predictions with statistics | Data Scientist tests hypotheses and evaluates predictions. |
| | Train models and improve how they perform | Machine Learning Engineer trains and evaluates a reproducible model. |
| Design how products look and work | Design screen layouts and visuals | UI Designer produces a component library and screen prototype. |
| | Research how people use a product and improve their experience | UX Designer studies and tests a user flow. |
| Find and fix security weaknesses | Test for weaknesses with permission | Penetration Tester tests an authorized lab and reports findings. |
| | Spot and respond to security incidents | Cybersecurity Analyst investigates a simulated incident. |
| | Protect services running in the cloud | Cloud Security Engineer secures cloud access, storage and networks. |
| Keep networks and services running | Connect devices and troubleshoot networks | Network Engineer builds and inspects a simulated network. |
| | Manage servers and user accounts | System Administrator configures a Linux server and account privileges. |
| | Set up cloud services | Cloud Engineer provisions network, compute and managed data services. |
| | Automate software releases | DevOps Engineer builds automated checks and deployment steps. |
| Work with devices and electronics | Design and test circuits | Hardware Engineer designs and simulates a circuit. |
| | Write software that runs inside a device | Embedded Systems Developer builds a sensor and output project. |
| | Work on how Linux runs underneath applications | Linux Systems Engineer builds system-level code and inspects kernel behavior. |

Keep the two-choice ceiling for fields and activities. Explicit uncertainty excludes other choices. After the active activity questions are answered, show one follow-up only when both options of a pair were selected: AI feature/model training first, screen design/user research second, cloud setup/release automation third. Use a different saved question ID per pair so changing which pair applies never reuses a different preference. The follow-up asks which activity the learner would rather try first. **Both or I’m not sure** adds no preference. The six general choices contain no complete pair, so that route never asks a follow-up.

## Concrete proposal for W01 review

- [Discovery definitions, schemas and service](../../backend/app/modules/discovery/) own question IDs, constraints, route calculation and publication matching. Register a new v2 definition and its ordered question identities additively in the existing questionnaire registry. Keep the v1 definition and its data readable. Dispatch route computation, answer validation and evidence from the saved questionnaire identity. Choose v2 for default new sessions and blank retakes only once its registry is published and complete; use v1 before activation. Preserve the current account ownership, one-draft constraint and revision checks. If there is an existing draft, offer Resume on its original version. The source-session foreign key binds the same account and permits a retake on a different questionnaire version.
- Add optional `max_selections` to the existing `QuestionReference` response and an optional `kind` with values `experience_preference` and `activity_follow_up` for the two special presentations. Reuse `background` and `activities` stage values respectively so the existing stage enumeration stays compatible. Absence of either field keeps v1 behavior. Keep stable option IDs and the existing answer representation; opening Skip uses the existing uncertainty answer shape. Raise the checkpoint batch limit from five to six distinct answers so an atomic save can represent a full six-question route. Continue validating every submitted answer against the active route and selected question's limits. No new endpoint, database table, grant or dependency is proposed. Regenerate OpenAPI and the TypeScript client after W01 review.
- In the [Discovery editor and wizard](../../frontend/src/features/discovery/), enforce the server's selection limit with accessible feedback and resolve navigation from the current question ID in the returned route, including when a follow-up changes. Use the existing save/leave, dirty and stale-revision recovery. The [design system](../design.md) remains the presentation reference; allow choice cards to wrap when v2 has more options than fit on one row.
- Keep the [recommendation service](../../backend/app/modules/recommendations/service.py) and its validated published candidates, quotas, idempotency and saved-run behavior. Omit the opening and neutral follow-up from evidence. For a substantive follow-up, label the choice as a preference between the two already selected activities. Keep v1 evidence and saved-result eligibility behavior. Results read experience and goal from the completed session associated with the displayed result so older saved suggestions do not inherit a newer session's actions or copy.
- Results link each exact published career/roadmap pair to the authored roadmap and to its existing skill comparison. The comparison offers manual entry immediately and links to existing [Profile resume review](../../frontend/src/features/competencies/resume-skill-review.tsx) with the career preselected. Construct the return link from the validated career/roadmap identifiers. The existing temporary PDF review, source passages, explicit skill confirmation, and unknown states remain the authority. Treat a disabled or unavailable PDF review as an optional unavailable path and leave manual entry usable. Browsing, comparison and PDF selection do not change focus or progress.

## Review fixtures and verification

Walk through one case per field using, respectively: Build games → Game Developer; Move and prepare data → Data Engineer; Research how people use a product → UX Designer; Spot and respond to security incidents → Cybersecurity Analyst; Automate software releases → DevOps Engineer; Write software inside a device → Embedded Systems Developer. These are evidence expectations for reviewed examples, not promises of exact model rankings. Additional cases:

| Case | Expected behavior |
| --- | --- |
| Unsure beginner | Opening Skip advances; field uncertainty opens one general question; Still not sure and goal complete a four-question route. Suggestions are broad, with caveats and varied categories where supported. |
| Mixed interests | Build and Data with AI features and model training triggers the AI/ML preference after both activity questions. Use both preferences unless the learner chooses one first. |
| Competing follow-ups | Selecting both Design activities and both Run pair activities shows only the Design follow-up. |
| Career shifter with skills | Use my experience puts comparison first; choose a career, review optional PDF evidence, explicitly save a skill level, and return to the same comparison. Try manual entry with PDF disabled. |
| Back edit | Replace Build with Devices after a saved activity or split; the abandoned answers remain stored and absent from evidence. Restore Build and confirm the same applicable answers return. |
| Existing account | A v1 draft resumes as v1; v1 completed results remain readable. An explicit retake with no draft starts blank on published v2. A stale write is rejected, and a second account cannot read or change the session. |
| Recommendation failure | Completion remains saved; the existing retry, prior eligible results and Careers actions stay available. |

The owner directed source implementation to proceed. Before release, ask learners to explain AI versus ML, UI versus UX and cloud versus DevOps in their own words. Include an unsure beginner and an experienced or career-changing learner. Record misunderstandings and reviewed corrections here. Codex's catalog cross-check does not establish learner comprehension. Follow-up coordination for those walkthroughs is unassigned.

After approval, run focused route, persistence, authorization, generated-contract and frontend checks. Use mocked provider results for evidence, uncertainty and failure recovery. Guided local browser acceptance covers registration or resume, Back/edit, Results and the skill/PDF round trip with a synthetic document. Confirm focus and progress stay unchanged. Record the results in `docs/features/guided-discovery-v2.md` with the implementation. Deployment or normal-environment publication remains subject to the reviewed release gate.
