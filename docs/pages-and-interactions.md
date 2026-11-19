---
id: DESIGN
kind: design
status: consolidated
requires: [PRD]
---

# Asgard: Pages and interactions

Documentation baseline: 2026-11-17. This describes current presentation and recorded behavior. [Product](product.md) owns requirements, [Design](design.md) owns components/tokens, and feature guides own dated verification. Configuration-gated controls do not imply active hosted integrations.

## Shared behavior

Protected pages require a valid account session. Preserve private query isolation, loading/error/empty states, accessible names, keyboard focus, and dirty-form recovery. Opening a career never selects learning focus. Do not report saves or deletion success before the server confirms them. Desktop/laptop layouts target 1280–1920 px with accessible reflow and zoom checks.

## Landing and account entry

Public routes include Landing, login, registration, email verification, password recovery, service status, Licenses, Credits, and Terms. Supabase owns identity operations. Returning learners reach Dashboard; new-account entry offers discovery or browsing. Do not automatically reopen unfinished Discovery. Provider configuration controls unavailable Auth, optional MFA enrollment, and recovery. Google remains subject to AUTH-C1.

MFA-RECOVERY-01 uses the existing authenticator management and challenge pages for
application backup codes. Issuance shows a one-time copy/download set. Recovery
requires the current password and an unused code, then a replacement QR/manual
key and explicit verification. Protected app access stays blocked until completion;
email reset and deletion direct users to recover the authenticator first. Follow
the [recovery guide](features/application-recovery-codes.md) and AUTH-C2 activation gate.

## Discovery and Results

Entry offers Guided Discovery and Browse careers. V2 uses the server-authored four-to-six-question route, up to two interests/activities, uncertainty and at most one follow-up. Checkpoint saves preserve revisions and inactive-answer rules. Resume continues a draft; Retake in Results/Profile starts blank. [Discovery](specs/discovery.md) owns exact behavior.

Results automatically prepares missing/outdated deterministic v2 suggestions and reuses eligible saved results. Cards explain published careers with supporting evidence and direct roadmap navigation. Previous results and failures remain distinguishable. No fit score or automatic current-roadmap change. Roadmap experience-comparison links are disabled.

## Dashboard

Show current roadmap/milestone, active or next authored topic, progress, activity calendar, current and longest streaks, and context-appropriate guidance. Resume learning opens the topic; View milestone opens its roadmap landmark. New learners without focus are asked to choose a roadmap. No inferred mastery, readiness, or fabricated progress.

## Careers and comparison

Career skill matches now labels the views Job-sample skills and Roadmap skills.
It displays one evidence count with source labels for reports, direct resume
matches, AI-interpreted equivalent wording and applicable completed lessons
(Roadmap skills only). Source passages remain inspectable; no proficiency is
assigned. Automatic post-analysis interpretation and explicit Update resume matches
operate separately from ordinary reads. Removed/stale sources cannot remain current.
See [skill evidence](features/competency-comparison.md) for review/activation limits.

Catalog supports search and category/preferences filters with compact career cards. Compare careers opens a dedicated two-career view for differences, skills, work examples, and available source-backed explanations. The saved-careers filter and ESCO catalog shortcut were removed from the main catalog controls; retained data/routes do not imply visible controls. Occupational references are separate from roadmap-backed career candidates. [Comparison guide](features/career-comparison-and-shortlist.md).

## Roadmaps and topics

Use expandable milestones and a topic detail panel with authored overview, outcome, tools, resources, and completion content. Branch choices remain explicit. Set current roadmap is an intentional action in detail. Resolve conflicting active Learning topics before changing focus/branch. Status choices are Not started, Learning, Done, and Skipped; reversible updates retain history and revision guards. Authored alternatives determine applicable topic counts.

The experience-comparison dialog and W07 practice/reflection panels are disabled/dormant. Do not reintroduce them through this specification. Existing Profile skills, career comparison, APIs, and records remain separate.

## Profile and preferences

A successful new resume analysis automatically requests supported-equivalence
career-skill interpretation as a separate bounded operation. Its failure does
not undo saved extraction. Existing resumes can use Update resume matches on
Career skill matches. Private results are invalidated on removal/replacement;
source explanations never assign manual experience ratings.

Profile contains personal details, career background, skills, saved suggestions, and preferences. Profile and preference saves remain independent and revision-guarded. Keep pending edits across tabs and warn before leaving. Optional private photos and document upload/analysis/resume review depend on backend flags and credentials. Resume-extracted skill suggestions require user confirmation; optional files never gate browsing or learning. Replace/Remove must preserve lifecycle and stale-response protections.

## Account and security

Password/recovery and optional authenticator controls follow provider capability and fresh-auth requirements. Account deletion is offered only when enabled and maintenance is healthy. The learner reauthenticates and confirms DELETE. A durable server receipt blocks application access; purge is asynchronous. See [account deletion](features/account-deletion.md) and [MFA](features/optional-two-factor-authentication.md).

## Counselor

The optional Counselor uses bounded current-route/account context and validated destinations. It may guide the next authored learning step but cannot mutate progress or assess competence. Conversation continuity is in memory under the current implementation. Provider/network failures remain visible. [Context and privacy boundaries](features/contextual-counselor-profile.md).

## Footer and service status

The footer links Licenses, Credits, Terms, and Service status outside focused onboarding where applicable. Status reports current API/data checks, last-check time, and retry; it does not claim historical uptime. [Implementation evidence](features/footer-information-and-service-status.md).

## Verification boundary

The earlier Missing lists described gaps in static reference frames, not an accurate current feature inventory. They remain in the archive. Use [Verification](verification.md) and dated feature guides for pending manual browser/accessibility and release checks.

## Earlier section references

The following links locate superseded wording in the dated archive. Current behavior is described above.

<a id="career-exploration-extension-2026-11-05"></a>

[Career exploration extension, 2026-11-05](archive/2026-11-17/pages-and-interactions.md#career-exploration-extension-2026-11-05).

<a id="screen-references-and-requirement-coverage"></a>

[Screen references and requirement coverage](archive/2026-11-17/pages-and-interactions.md#screen-references-and-requirement-coverage).

<a id="navigation-and-terminology"></a>

[Navigation and terminology](archive/2026-11-17/pages-and-interactions.md#navigation-and-terminology).

<a id="shared-contextual-guidance"></a>

[Shared contextual guidance](archive/2026-11-17/pages-and-interactions.md#shared-contextual-guidance).

<a id="persistence-and-feedback"></a>

[Persistence and feedback](archive/2026-11-17/pages-and-interactions.md#persistence-and-feedback).

<a id="1-landing--account-entry"></a>

[1. Landing / Account Entry](archive/2026-11-17/pages-and-interactions.md#1-landing--account-entry).

<a id="landing-page"></a>

[Landing Page](archive/2026-11-17/pages-and-interactions.md#landing-page).

<a id="create-an-account"></a>

[Create an Account](archive/2026-11-17/pages-and-interactions.md#create-an-account).

<a id="check-your-email"></a>

[Check Your Email](archive/2026-11-17/pages-and-interactions.md#check-your-email).

<a id="login"></a>

[Login](archive/2026-11-17/pages-and-interactions.md#login).

<a id="password-recovery"></a>

[Password Recovery](archive/2026-11-17/pages-and-interactions.md#password-recovery).

<a id="authenticator-verification"></a>

[Authenticator Verification](archive/2026-11-17/pages-and-interactions.md#authenticator-verification).

<a id="account-entry-destinations"></a>

[Account-Entry Destinations](archive/2026-11-17/pages-and-interactions.md#account-entry-destinations).

<a id="page-states"></a>

[Page States](archive/2026-11-17/pages-and-interactions.md#page-states).

<a id="recorded-design-decisions"></a>

[Recorded design decisions](archive/2026-11-17/pages-and-interactions.md#recorded-design-decisions).

<a id="missing"></a>

[Missing:](archive/2026-11-17/pages-and-interactions.md#missing).

<a id="account-entry-constraints"></a>

[Account-entry constraints](archive/2026-11-17/pages-and-interactions.md#account-entry-constraints).

<a id="selected-account-access-policy"></a>

[Selected account-access policy](archive/2026-11-17/pages-and-interactions.md#selected-account-access-policy).

<a id="2-discovery--setup"></a>

[2. Discovery / Setup](archive/2026-11-17/pages-and-interactions.md#2-discovery--setup).

<a id="entry-choice"></a>

[Entry Choice](archive/2026-11-17/pages-and-interactions.md#entry-choice).

<a id="question-screens-and-conditional-route"></a>

[Question screens and conditional route](archive/2026-11-17/pages-and-interactions.md#question-screens-and-conditional-route).

<a id="final-round-discovery-results"></a>

[Final Round: Discovery Results](archive/2026-11-17/pages-and-interactions.md#final-round-discovery-results).

<a id="optional-profile-setup"></a>

[Optional Profile Setup](archive/2026-11-17/pages-and-interactions.md#optional-profile-setup).

<a id="3-main-dashboard--home"></a>

[3. Main Dashboard / Home](archive/2026-11-17/pages-and-interactions.md#3-main-dashboard--home).

<a id="header"></a>

[Header](archive/2026-11-17/pages-and-interactions.md#header).

<a id="content-area"></a>

[Content Area](archive/2026-11-17/pages-and-interactions.md#content-area).

<a id="supporting-area"></a>

[Supporting Area](archive/2026-11-17/pages-and-interactions.md#supporting-area).

<a id="account-menu"></a>

[Account Menu](archive/2026-11-17/pages-and-interactions.md#account-menu).

<a id="progress-calendar-and-streak-rules"></a>

[Progress, calendar, and streak rules](archive/2026-11-17/pages-and-interactions.md#progress-calendar-and-streak-rules).

<a id="4-careers--roadmaps"></a>

[4. Careers / Roadmaps](archive/2026-11-17/pages-and-interactions.md#4-careers--roadmaps).

<a id="role-catalog"></a>

[Role Catalog](archive/2026-11-17/pages-and-interactions.md#role-catalog).

<a id="opened-roadmap-roadmap-detail"></a>

[Opened roadmap: ROADMAP-DETAIL](archive/2026-11-17/pages-and-interactions.md#opened-roadmap-roadmap-detail).

<a id="topic-resources-topic-panel"></a>

[Topic resources: TOPIC-PANEL](archive/2026-11-17/pages-and-interactions.md#topic-resources-topic-panel).

<a id="resolve-active-learning-resolve-learning"></a>

[Resolve active learning: RESOLVE-LEARNING](archive/2026-11-17/pages-and-interactions.md#resolve-active-learning-resolve-learning).

<a id="5-settings"></a>

[5. Settings](archive/2026-11-17/pages-and-interactions.md#5-settings).

<a id="navigation"></a>

[Navigation](archive/2026-11-17/pages-and-interactions.md#navigation).

<a id="profile"></a>

[Profile](archive/2026-11-17/pages-and-interactions.md#profile).

<a id="profile-validation-and-unsaved-edits"></a>

[Profile validation and unsaved edits](archive/2026-11-17/pages-and-interactions.md#profile-validation-and-unsaved-edits).

<a id="academic-profile-and-document-management"></a>

[Academic Profile and Document Management](archive/2026-11-17/pages-and-interactions.md#academic-profile-and-document-management).

<a id="document-and-account-lifecycle-constraints"></a>

[Document and account lifecycle constraints](archive/2026-11-17/pages-and-interactions.md#document-and-account-lifecycle-constraints).

<a id="shared-design-coverage"></a>

[Shared Design Coverage](archive/2026-11-17/pages-and-interactions.md#shared-design-coverage).

<a id="quality-coverage"></a>

[Quality coverage](archive/2026-11-17/pages-and-interactions.md#quality-coverage).

<a id="counselor-personalization-decision-2026-11-16"></a>

[Counselor personalization decision, 2026-11-16](archive/2026-11-17/pages-and-interactions.md#counselor-personalization-decision-2026-11-16).

2026-11-17 follow-up: footer pages remain public but show application navigation
for confirmed, MFA-ready sessions. Counselor answer Sources start collapsed and
expand on request; availability warnings remain visible.
