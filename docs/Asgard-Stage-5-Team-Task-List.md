# Stage 5 — Team Task List

Use the existing application UI and approved Stage 4 contracts. Prepare the tasks now; start dependent implementation when its contract is ready.

## Assignment A — Discovery, Dashboard and Profile

- [ ] Complete the Discovery questions and answer choices.
- [ ] Define and implement branching based on earlier answers.
- [ ] Cover mixed interests, uncertainty and browsing without Discovery.
- [ ] Handle Back navigation and update affected questions when answers change.
- [ ] Save, resume and retake Discovery without losing previous successful results.
- [ ] Handle unsaved answers, failed saves and conflicting updates.
- [ ] Connect submission to Assignment C’s recommendation service; prevent duplicate requests.
- [ ] Display Discovery results, errors and retry actions without a mandatory answer-review screen.
- [ ] Replace Dashboard samples with saved focus, milestones, topic groups and recent activity.
- [ ] Connect Continue learning, next topics, calendar and streak using Assignment D’s data.
- [ ] Handle empty, loading, failed, completed and exhausted-path states.
- [ ] Complete Profile name/photo saving and separate preferred-category saving.
- [ ] Connect saved Discovery context, Retake Discovery and Profile navigation.
- [ ] Save shared guidance dismissals across visits and devices.

**Done when:** users can complete or resume branching Discovery and return to a Dashboard showing their saved learning activity. Recommendations appear in Discovery results and Careers.

## Assignment B — Career Catalog and Roadmaps

- [ ] Complete and obtain review for all seven launch roadmaps:
  - Frontend Developer
  - Machine Learning Engineer
  - UX Designer
  - Data Analyst
  - Cybersecurity Analyst
  - Embedded Systems Developer
  - Network Engineer
- [ ] Add career explanations, skills, milestones, topics and practical learning outcomes.
- [ ] Give every topic an explanation and at least one free learning resource.
- [ ] Define topic order, alternative branches and advisory prerequisites.
- [ ] Record content sources, licenses, review dates and versions.
- [ ] Load reviewed content through the approved database/API structure.
- [ ] Connect category browsing, role/skill search, filters and clear-filter actions.
- [ ] Complete dedicated roadmap pages, role explanations and expandable milestones.
- [ ] Complete topic panels, resource links and keyboard navigation.
- [ ] Connect current-roadmap, branch and topic-state controls to Assignment D.
- [ ] Handle missing, updated and retired content without losing learning history.
- [ ] Supply reviewed career information for Assignment C’s recommendations.

**Done when:** all seven reviewed roadmaps are usable, searchable and connected to saved learning controls.

## Assignment C — AI Recommendations and PDF Analysis

- [ ] Implement the backend AI-provider connection.
- [ ] Use applicable Discovery answers, selected roadmap, progress and optional PDF context.
- [ ] Return up to three published careers with supported explanations.
- [ ] Validate career references and evidence; reject invented facts and match scores.
- [ ] Save generation status, result versions and previous eligible successful results.
- [ ] Implement persisted quotas, duplicate-request protection, timeouts and bounded retries.
- [ ] Reuse unchanged results; offer explicit refresh when relevant context changes.
- [ ] Prevent outdated responses from replacing newer results.
- [ ] Connect recommendations to Discovery results and Careers.
- [ ] Implement private PDF upload, validation and explicit Analyze PDF.
- [ ] Extract supported background with checked page/text evidence.
- [ ] Implement PDF replacement and removal without losing previous context on failure.
- [ ] Prevent removed documents or late analysis from restoring old context.
- [ ] Connect PDF states and actions in Profile.
- [ ] Verify provider privacy settings and run the recommendation/PDF quality checks.

**Done when:** recommendations and optional PDF analysis work safely, explain failures and preserve eligible previous results.

## Assignment D — Learning Progress and Activity

- [ ] Save Not started, Learning, Done and Skipped states per roadmap topic.
- [ ] Implement Clear and reversible status changes.
- [ ] Enforce one Learning topic across the account, including concurrent requests.
- [ ] Save the explicitly selected current roadmap.
- [ ] Save alternative branch choices while preserving both branches’ histories.
- [ ] Resolve existing Learning work before conflicting topic, roadmap or branch changes.
- [ ] Handle cancellation, failed saves, stale updates and partially completed actions.
- [ ] Calculate completion using Done topics and the applicable branch.
- [ ] Implement authored next-topic and current-milestone selection.
- [ ] Distinguish full completion from paths exhausted by Done/Skipped topics.
- [ ] Record Done activity, prevent duplicate credit and handle undo.
- [ ] Calculate calendar counts and streaks using the approved timezone rules.
- [ ] Preserve progress and activity history when content changes.
- [ ] Supply consistent learning summaries to Dashboard and Roadmaps.

**Done when:** saved progress remains consistent across sessions, tabs, Dashboard and Roadmaps.

## Project Lead — Shared Foundation and Release Tasks

Assign an implementation owner for each shared task.

- [ ] Accept Stage 3.5’s UI/navigation review.
- [ ] Finalize Stage 4 contracts, including branching Discovery.
- [ ] Resolve the password-policy mismatch.
- [ ] Establish task owners, reviewers and protected PR integration.
- [ ] Complete password recovery, external email delivery and abuse protection.
- [ ] Verify Google linking and MFA before enabling them.
- [ ] Implement verified account deletion with immediate access blocking.
- [ ] Complete file cleanup, retention, encrypted backups and restore testing.
- [ ] Verify hosted configuration, database access, monitoring and operator access.
- [ ] Complete CI, migration checks and independent Windows/Linux setup verification.
- [ ] Verify account isolation, concurrency and failure recovery across features.
- [ ] Complete desktop-browser, keyboard, screen-reader and zoom checks.
- [ ] Test the complete user journey, performance and local demo fallback.

## Team Completion Checklist

- [ ] Real data replaces samples only where integration is complete.
- [ ] Saved actions survive refresh and later sessions.
- [ ] Failed actions never appear successful.
- [ ] Accounts cannot access one another’s private data.
- [ ] Existing authentication and approved UI remain intact.
- [ ] Relevant checks pass and manual acceptance is recorded.
- [ ] Required documents are updated and changes receive review.
