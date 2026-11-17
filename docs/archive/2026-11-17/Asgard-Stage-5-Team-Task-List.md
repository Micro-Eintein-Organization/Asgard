> Historical record archived 2026-11-17. Dated scope and test evidence are retained; use the [current documentation](../../README.md). This record does not grant new activation, implementation, or publication authority.

# Stage 5 — Team Task List

## Ownership

- Each feature owner designs and implements their feature end-to-end: UI, interactions, backend logic, persistence, integration and tests.
- Assignment A owns Discovery questions and branching rules. The project lead reviews the proposal; they do not have to write the questions or logic.
- The Stage 4 implementation owner builds the shared database/API foundation. Feature owners propose any missing contract needs for technical review.
- Feature owners can prepare designs, content and tests now. Implementation that depends on an unfinished contract waits for that contract.
- Keep the existing application UI and authentication. Changes to shared contracts, migrations or security require the designated technical review.

## Assignment A — Discovery, Dashboard and Profile

- [ ] Write the Discovery questions, choices and explanations.
- [ ] Design, propose for review, implement and test the branching rules.
- [ ] Define routes for mixed interests and uncertainty, question requirements and stopping rules.
- [ ] Handle Back navigation and changed earlier answers; exclude inactive answers from recommendations.
- [ ] Define and implement how affected answers are retained, revisited or cleared.
- [ ] Save, resume and retake Discovery; handle failed saves, unsaved input and conflicting drafts.
- [ ] Submit valid answers once to Assignment C’s service.
- [ ] Own the Discovery results page: display C’s results, processing, errors and retry actions.
- [ ] Keep browsing available without Discovery; add no mandatory answer-review or Profile setup screen.
- [ ] Replace Dashboard samples with saved learning summaries from Assignment D.
- [ ] Connect Continue learning, next topics, groups, recent completions, calendar and streak.
- [ ] Handle no focus, no progress, loading, failure, full completion and exhausted-path states.
- [ ] Implement Profile name/photo saves and a separate preferred-category save.
- [ ] Display saved Discovery context and connect Retake Discovery.
- [ ] Own shared guidance eligibility and saved dismissals across pages, visits and devices.
- [ ] Integrate C’s document component into Profile without duplicating its upload or analysis logic.

**Done when:** branching Discovery saves and resumes correctly, Profile saves work, and Dashboard shows the account’s actual learning activity. Recommendations remain in Discovery results and Careers.

## Assignment B — Career Catalog and Roadmaps

- [ ] Author and submit these seven career explanations and introductory roadmaps for content review:
  - Frontend Developer
  - Machine Learning Engineer
  - UX Designer
  - Data Analyst
  - Cybersecurity Analyst
  - Embedded Systems Developer
  - Network Engineer
- [ ] Add milestones, topic explanations, starter tools, practical outcomes and free resources.
- [ ] Define topic order, common paths, alternative branches and advisory prerequisites.
- [ ] Record content sources, licenses, reviewer, dates and versions.
- [ ] Implement catalog/roadmap content loading and publication checks using approved contracts.
- [ ] Connect categories, role/skill search, filters and clear-filter actions.
- [ ] Own catalog and roadmap pages, including dedicated URLs and career explanations.
- [ ] Complete expandable milestones, topic panels, resource links and keyboard navigation.
- [ ] Integrate D’s focus, branch and topic-state controls into Roadmaps.
- [ ] Integrate C’s recommendation component and A’s guidance into Careers.
- [ ] Implement content-update/retirement handling with D so saved history remains intact.
- [ ] Supply reviewed career descriptions and relevance information to C.

**Done when:** all seven reviewed roadmaps are usable and searchable, with working resources and saved learning controls.

## Assignment C — AI Recommendations and PDF Analysis

- [ ] Implement the backend AI-provider adapter and recommendation service.
- [ ] Consume applicable answers from A, published careers from B and saved learning context from D.
- [ ] Return up to three published careers with supported explanations.
- [ ] Validate career IDs and evidence; reject invented facts and match scores.
- [ ] Save operation status, result versions and eligible previous successful results.
- [ ] Implement persisted analysis quotas, duplicate protection, timeouts and bounded retries.
- [ ] Reuse unchanged results and expose explicit refresh when relevant context changes.
- [ ] Reject late results and suppress results based on removed document context.
- [ ] Own reusable recommendation display/refresh components; A and B integrate them into their pages.
- [ ] Own the PDF service and Profile document component: upload, Analyze, Replace, Remove and feedback.
- [ ] Validate and store PDFs privately; verify file ownership and provider privacy settings.
- [ ] Extract supported background and check each accepted fact against its page/text evidence.
- [ ] Preserve previous context until replacement analysis succeeds; prevent removed or superseded work from applying.
- [ ] Record document/result cleanup work for the maintenance owner.
- [ ] Run and document the required recommendation-model and synthetic-PDF quality checks.

**Done when:** recommendations and optional-to-user PDF analysis work within approved privacy and processing limits, with truthful recovery after failures.

## Assignment D — Learning Progress and Activity

- [ ] Own the learning-state service and reusable focus, branch and topic-state controls.
- [ ] Save Not started, Learning, Done and Skipped per roadmap topic; Clear restores Not started.
- [ ] Enforce one Learning topic across the account, including concurrent requests.
- [ ] Save current-roadmap selection only after an explicit user action.
- [ ] Save branch choices while preserving progress in both branches.
- [ ] Implement the shared Done / Skip / Clear / Cancel resolution flow for conflicting changes.
- [ ] Handle stale requests, failed saves and partial outcomes accurately.
- [ ] Own completion calculations: Done topics divided by applicable common/selected-branch topics.
- [ ] Withhold full-path percentages until required branch choices are made.
- [ ] Implement next-topic and current-milestone selection from B’s authored content, independently of AI.
- [ ] Distinguish fully Done roadmaps from paths exhausted by Done/Skipped topics.
- [ ] Record deduplicated Done activity, handle undo and calculate calendar counts/streaks.
- [ ] Apply the reviewed timezone rules without changing historical activity dates.
- [ ] Preserve learning history when B updates or retires content.
- [ ] Supply learning summaries to A and saved-state interfaces to B; those owners integrate them into their pages.

**Done when:** learning rules and saved summaries remain consistent across sessions, tabs, Dashboard and Roadmaps.

## Project Lead — Review and Coordination

The project lead approves scope and coordinates delivery. They are not automatically the implementation owner.

- [ ] Assign a named owner and reviewer to every feature and shared task.
- [ ] Review A’s branching proposal and B’s authored content.
- [ ] Coordinate review of contract needs proposed by A–D with the Stage 4 owner.
- [ ] Record product decisions, including the password-policy mismatch.
- [ ] Arrange Stage 3.5 manual acceptance and review shared-security/release evidence.
- [ ] Coordinate integration order and approve release readiness.

## Shared Security and Operations — Assign Owners Before Starting

These tasks are not implicitly assigned to the project lead or any of A–D. The project lead must name an implementation owner and reviewer for each group.

| Task group | Implementation work |
| --- | --- |
| Repository and CI | Protected PR review, required checks, migration verification and independent Windows/Linux setup. |
| Account access | Resolve the approved password policy; implement password recovery, external email and receiving-service abuse controls. |
| Google and MFA | Verify provider compatibility, then implement and test approved linking and MFA lifecycle flows. |
| Account deletion | Implement verified deletion, immediate access blocking and durable purge requests. |
| Maintenance and recovery | Process C’s document/result cleanup and account purge work; enforce retention, encrypted backups and tested restoration. |
| Hosting and monitoring | Verify hosted database access, environment configuration, operator access, alerts and missed-job detection. |
| Release verification | Coordinate cross-feature isolation/concurrency checks, desktop accessibility/browser checks, performance and the local fallback. Feature owners fix failures in their areas. |

## Team Completion Checklist

- [ ] Each feature owner tests their logic, persistence, authorization and failure handling.
- [ ] A–D verify their interfaces together; no duplicate recommendation or learning-calculation services.
- [ ] Real data replaces samples only where integration is complete.
- [ ] Successfully saved actions survive refresh and later sessions; failed actions never appear saved.
- [ ] Accounts cannot access one another’s private records or files.
- [ ] The complete journey passes: sign in → Discovery or browsing → roadmap → saved progress → Dashboard continuation.
- [ ] Required checks, manual acceptance, documentation and human review are complete.
