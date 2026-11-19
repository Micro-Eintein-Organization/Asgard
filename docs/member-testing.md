# Asgard member testing journeys and scoring rubric

Prepared by: Codex  
Created: 2026-11-18  
Last updated: 2026-11-18  
Status: Testing workbook prepared; member execution and human review pending.  
Reviewer: @YakisobaNissin, per [CODEOWNERS](../.github/CODEOWNERS).

The project owner approved this documentation-only expansion on 2026-11-18. It covers this file, requirements/reference checks and whitespace verification. It changes no application behavior or release decisions.

## How members use this form

The organizer supplies your test URL, account, files and assigned journeys. Follow the numbered steps in each assigned journey and compare the app with the expected results. **Your only written task is to enter two numbers per journey: Completeness and Usability.** Enter them in the Score column of its rubric. The organizer records your identity, environment, any blockers and follow-up issues.

Do not rate a journey you could not attempt; leave its scores blank and tell the organizer. If you try a required task and the app fails or the required control is missing, score the observed failure. A missing feature must not disappear from coverage.

### What the two ratings mean

| Score | Completeness: how much required behavior works | Usability: how independently you can use it |
| --- | --- | --- |
| **4 - Exemplary** | Every listed check assigned for this journey passes, including its validation, persistence and recovery checks. No unresolved functional failure is observed. | Complete independently with clear controls, readable content, understandable feedback and clear recovery. |
| **3 - Proficient** | The main journey works and saves correctly, but a listed secondary or recovery check fails. No observed data-loss or account-access failure. | Complete independently, with minor confusion, unnecessary steps or presentation problems. |
| **2 - Developing** | Only part of the required journey works. Important behavior is missing or unreliable; completing it requires retries or a workaround. | Need help, repeated attempts or a workaround because instructions, controls or feedback are unclear. |
| **1 - Beginning** | The main task cannot be completed, a required feature is absent, results are incorrect, or saved information is lost/corrupted. | Cannot complete independently because navigation, instructions, feedback or accessibility prevents use. |

Use the lowest applicable description for each dimension. A working but confusing feature can receive Completeness 4 and Usability 2. Missing coverage prevents Completeness 4; the organizer marks any score provisional until all listed checks are exercised. Scores describe observed testing, not production readiness. Serious account-access or data-loss failures remain blockers regardless of averages.

## Organizer preparation and coverage

Complete this section before handing the workbook to members. Members do not fill out reports or technical evidence.

| Organizer field | Value |
| --- | --- |
| Organizer / testing date | |
| Application URL / build identifier | |
| Member / assigned journey IDs | |
| Browser/version / operating system / viewport | |
| Test account A / account B identifiers, without credentials | |
| Available test fixtures / prepared states | |
| Arranged failure scenarios / scheduled date checks | |

Provide fresh and returning accounts, a saved Discovery draft, two organizer-owned accounts for isolation, roadmaps with known branches/counts, and Dashboard accounts for no-focus, active, fully Done, exhausted-with-Skipped and streak states. Supply valid/expired test links or codes, disposable MFA/deletion accounts, and synthetic document/image fixtures. Supply the actual URL rather than asking members to configure services.

Record each numbered step as **Pass, Fail, Blocked or Not tested** in the organizer log. A ticked checkbox means the action was attempted; the result belongs in that log. Default all unobserved steps to Not tested. Keep blocked/unattempted steps visible, with a reason and follow-up owner. An expected control missing from an otherwise testable build is a functional failure; an unavailable test fixture or arranged outage is a coverage blocker.

### Feature coverage register

All areas below remain in the workbook. Environment and provider gates describe current testability; they do not turn features into discretionary tests or imply activation approval.

| Area | Recorded boundary | Organizer action |
| --- | --- | --- |
| Counselor, photos and resume skill review | Configuration and dependencies affect availability. | Record the tested build's actual state; never assume success from source or flags. |
| Stored PDF analysis | Backend operations exist; current document-management presentation says “Coming later.” Temporary resume review is a separate path. | Keep the stored-analysis journey visible as an unavailable presentation gap. Do not invent a browser control or count backend existence as member acceptance. |
| Google access/linking | Google presentation is currently omitted; AUTH-C1 remains a compatibility gate. | Record the coverage gap. Exercise the enabled-build steps only on an approved testable build; do not enable it for this test. |
| Authenticator/recovery | AUTH-C2 and actual provider capabilities remain required. | Prepare supported disposable accounts; preserve existing enrolled-account enforcement. |
| Account deletion | Requires enabled backend gate and healthy maintenance. | Arrange a disposable account and approved test environment; leave unavailable stages visible. |
| Roadmap experience comparison and W07 practice/reflection | Disabled/dormant by recorded decisions. | Track as deferred, outside current member journeys; do not fail current builds for these deliberately excluded panels. |

Sources: [Product](product.md), [Journeys](user-journeys.md), [Pages and interactions](pages-and-interactions.md), [Decisions](decisions.md), [Future development](future-development.md), [PDF paths and current presentation](features/pdf-reading.md). Existing requirement and acceptance IDs remain authoritative; MT and BR IDs identify this workbook only.

## Journey rubrics

Each journey has exact actions and expected outcomes, followed by the rubric to score. For an unavailable stage, tell the organizer and continue independent assigned journeys. Use the designated accounts; account deletion permanently ends that test account's access.

### MT-01: Registration, email verification, login and logout

Coverage: REQ-01, REQ-13; QA-01.

1. [ ] **Action:** Open Landing while signed out. Try opening Dashboard directly. **Expected:** Landing explains the app; a protected page requires sign-in.
2. [ ] **Action:** Register with the organizer's unused test email. Try a password shorter than 8 characters, then a valid password and matching confirmation. **Expected:** Invalid input is rejected; valid submission reaches email verification without granting premature access.
3. [ ] **Action:** Enter an invalid code, then the valid emailed code. Check that entering the last digit alone does not submit; select Verify. Test Resend once after the displayed cooldown. **Expected:** Errors are recoverable; verification requires the explicit action; resend feedback is truthful.
4. [ ] **Action:** Sign in with incorrect then correct credentials. Log out and reopen the protected URL. **Expected:** Invalid credentials fail; correct credentials work; logout ends private access.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Registration, explicit verification, login and logout all work; private pages stay protected. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | The member can understand each account state and recover from an invalid entry. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-02: Navigation and direct URLs

Coverage: REQ-01, REQ-02, REQ-03; NFR-01/02.

1. [ ] **Action:** Use the header and account menu to reach Dashboard, Careers/Roadmaps, Profile and Settings. **Expected:** Each control opens its named destination.
2. [ ] **Action:** Open a career roadmap, copy its URL, refresh, then open that URL in another signed-in tab. **Expected:** The dedicated roadmap page remains reachable with the correct content.
3. [ ] **Action:** Use browser Back and Forward; close and reopen the account menu. **Expected:** Navigation and menus remain usable without accidental focus or progress changes.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Named destinations, direct URLs, refresh and history navigation work. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | The member can locate pages and predict where navigation controls lead. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-03: Guided Discovery and resuming answers

Coverage: REQ-04; F-001-AC-01/02/03/06/07; QA-03.

1. [ ] **Action:** From new-user entry choose Browse careers; later explicitly open Guided Discovery. **Expected:** Browsing works without answering Discovery or completing Profile.
2. [ ] **Action:** Follow the authored questions. Try more than two interests/activities; choose uncertainty alongside another answer. **Expected:** Selection limits and exclusive uncertainty are enforced with clear feedback.
3. [ ] **Action:** Use Back to change a field so a follow-up changes; return to the earlier route. **Expected:** Inactive answers do not influence the active route/results; restoration follows the saved questionnaire.
4. [ ] **Action:** Save at a checkpoint, leave, sign out/in and explicitly resume. Separately try leaving with unsaved edits. **Expected:** Saved answers return; unsaved-exit protection is truthful; returning login does not force the questionnaire open.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Browse bypass, route rules, checkpoint persistence and deliberate resume work. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Questions, limits, Back, save feedback and resume are understandable without help. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-04: Suggestions, evidence and retakes

Coverage: REQ-04/05; F-001-AC-04/05/08; F-002-AC-01/02/04/08/09.

1. [ ] **Action:** Complete Discovery with known answers and read every suggestion and reason. **Expected:** Up to three distinct published careers appear with reasons supported by active answers; no invented skills or fit percentages.
2. [ ] **Action:** Using a separate fresh attempt, choose uncertainty/mixed interests and complete it. **Expected:** Suggestions acknowledge their limited basis and support broad exploration rather than infer ability.
3. [ ] **Action:** Revisit unchanged results, open a suggested roadmap, then start a full retake from Results or Profile. **Expected:** Eligible results are reused; retake starts blank; opening/retaking does not change focus or progress.
4. [ ] **Action:** Where provider-backed Update suggestions is exposed, change relevant saved context and refresh explicitly. **Expected:** Outdated context is distinguished; refresh follows the documented policy, without automatic progress changes.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Supported results, uncertainty, reuse and blank retake preserve learning state. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | The member understands why results appear and how to explore or retake. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-05: Career search, filters and comparison

Coverage: REQ-02/06; QA-04.

1. [ ] **Action:** Search a published role title, then an associated skill. Apply a category filter. **Expected:** Relevant role entries are returned without requiring Discovery.
2. [ ] **Action:** Search a nonsense phrase, then clear the query and reset filters. **Expected:** An honest no-match state appears and the catalog can be restored.
3. [ ] **Action:** Open the two-career comparison and choose two different published roles; change one selection. **Expected:** The comparison shows the selected roles, differences, skills and work examples using available authored information.
4. [ ] **Action:** Return to the catalog and inspect current focus. **Expected:** Searching and comparing have not changed focus or learning states.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Search, no-match recovery, filtering and two-role comparison show correct content. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Search/reset controls and career differences are clear enough to choose what to inspect. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-06: Roadmap content, milestones and resources

Coverage: REQ-03/07; QA-04.

1. [ ] **Action:** Open a roadmap, expand/collapse Read more, and expand multiple milestones. **Expected:** Role details and milestone content appear without selecting current focus or changing progress.
2. [ ] **Action:** Open a topic and inspect its explanation, outcome, tools and curated resources. **Expected:** The selected topic's content is complete enough to begin; each topic has at least one free resource, with access/cost labels where relevant.
3. [ ] **Action:** Follow a resource, return, then close the topic panel using its close control and keyboard. **Expected:** The resource destination works; milestone context and keyboard focus are retained appropriately.
4. [ ] **Action:** Inspect any authored alternative paths before choosing one. **Expected:** Choices are explicit; no silent default or misleading full-path percentage appears.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Role content, topic details, free resources, context retention and explicit alternatives work. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Learning order, topic controls and resource access are understandable. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-07: Focus, branches and reversible progress

Coverage: REQ-08/09; QA-05.

1. [ ] **Action:** Open a roadmap without setting it current, then explicitly set it current. **Expected:** Only the explicit action changes focus.
2. [ ] **Action:** On a topic, exercise Learning, Done, Skipped and Clear/Not started; refresh after acknowledged saves. **Expected:** Every state persists; merely reading changes no status; Done removes the topic from Learning.
3. [ ] **Action:** With a Learning topic active, try a conflicting topic, branch or roadmap; first cancel the resolution, then complete the supported resolution. **Expected:** Cancellation preserves prior state; confirmation resolves the conflict; only one topic remains Learning.
4. [ ] **Action:** Revisit a previous roadmap/branch and sign out/in. **Expected:** Saved history is retained; unselected branches do not inflate progress.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Explicit focus, all statuses, conflict resolution, cancellation and retained history work. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Status meanings and the consequences of switching focus/branches are clear. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-08: Dashboard and continuation

Coverage: REQ-10; QA-06.

1. [ ] **Action:** Use a fresh account without focus, then set a roadmap with no progress. **Expected:** The first state offers roadmap selection; the second offers an authored starting action without fabricated progress.
2. [ ] **Action:** Mark a topic Learning and use Dashboard Resume/Continue learning and View milestone. **Expected:** Controls open the correct topic/milestone in the current roadmap.
3. [ ] **Action:** Mark topics Done and Skipped; open suggested next topics without changing their status. **Expected:** Suggestions follow authored order and branch, bypass Done/Skipped, and opening does not mark Learning.
4. [ ] **Action:** Using organizer-prepared accounts, inspect fully Done and exhausted-with-Skipped roadmaps. **Expected:** Only all-Done is full completion; exhausted suggestions preserve actual percentages and offer revisiting Skipped topics.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Empty, start, active, fully completed and exhausted Dashboard states are correct. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | The member can identify current work and the next action without mistaking activity for mastery. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-09: Profile and preferences

Coverage: REQ-10/11; QA-07.

1. [ ] **Action:** Save a first name containing valid Unicode characters; test empty and 101-character first names and a surname over 100 characters. **Expected:** First name requires 1–100 characters; surname allows 0–100; errors preserve editable input.
2. [ ] **Action:** Change Profile and preference values, saving each with its own control; reload. **Expected:** Each independent save persists the intended data and reports success only after confirmation.
3. [ ] **Action:** Make edits, switch Profile tabs, then try leaving; choose stay before testing discard. **Expected:** Tab changes retain edits and navigation warns before discarding unsaved work.
4. [ ] **Action:** Save the name and inspect Profile enrichment guidance on Dashboard; dismiss shared guidance and revisit pages. **Expected:** Name completion updates the relevant guidance; dismissal persists; browsing remains available and name/photo edits do not claim better recommendations.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Field limits, separate saves, dirty edits and guidance state follow requirements. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Labels, save controls, validation and unsaved-change choices are understandable. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-10: Contextual AI Counselor

Coverage: REQ-12; NFR-07; QA-08.

1. [ ] **Action:** Ask about the currently viewed career, then the next authored learning step. **Expected:** Answers use relevant available context and do not invent skills, competence or readiness.
2. [ ] **Action:** Expand Sources and follow the answer's career/topic destinations. **Expected:** Sources can be inspected and destinations resolve to valid authored content.
3. [ ] **Action:** Ask the Counselor to mark a topic Done or change the current roadmap; inspect saved state afterward. **Expected:** The Counselor remains read-only and does not mutate progress/focus.
4. [ ] **Action:** During an organizer-arranged provider failure, ask a question, then browse careers and update progress. **Expected:** Failure is visible; independent browsing/progress remain usable when their services are healthy.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Grounded answers, valid sources, read-only behavior and failure isolation work. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Answers and their limits are clear; the member can inspect sources and recover from failure. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-11: Keyboard, zoom and desktop compatibility

Coverage: NFR-01/02; QA-12.

1. [ ] **Action:** Walk account entry, Discovery, catalog, roadmap, Dashboard and Settings using Tab/Shift+Tab, Enter, Space and Escape as appropriate. **Expected:** All essential actions are reachable; focus is visible; dialogs retain/return focus and milestone buttons expose expansion.
2. [ ] **Action:** Repeat at 200% and 400% browser zoom and an organizer-prepared 320 CSS-pixel reflow view. **Expected:** Essential content and actions remain reachable with appropriate scrolling; no clipping hides controls.
3. [ ] **Action:** Use organizer-assigned Chrome, Edge or Firefox on Windows, or Safari on macOS, at 1280×800, 1440×900 or 1920×1080. **Expected:** Core journeys remain readable and operable; record actual browser/version in the organizer cover sheet.
4. [ ] **Action:** Inspect errors and topic statuses without relying on color; use the assigned screen reader where provided. **Expected:** Labels, status text and feedback communicate meaning; screen-reader coverage is not inferred from keyboard use alone.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Assigned browser, viewport, keyboard, zoom and assistive-technology checks pass. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Reading order, focus, labels and reflow allow independent operation. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-12: Speed, pending feedback and network recovery

Coverage: NFR-03/04/07; QA-12.

1. [ ] **Action:** On an already awake app, open Careers and save Profile/progress; watch pending feedback. **Expected:** Pending feedback appears within the documented 1-second target; the UI remains responsive.
2. [ ] **Action:** On your own device, briefly disconnect during a save, then reconnect and reload before retrying. **Expected:** An uncertain save is not falsely reported successful; confirmed server state is reconciled and input remains recoverable.
3. [ ] **Action:** During an organizer-arranged cold start, open the app and wait through its startup handling. **Expected:** Startup feedback is explicit; the separate 90-second budget ends in usable content or recoverable failure.
4. [ ] **Action:** During arranged recommendation/PDF delays, use independent career navigation. **Expected:** Long-running work has truthful pending/error states; browsing does not wait for AI when core services are healthy.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Pending, interrupted saves, cold-start recovery and independent navigation work. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Waiting, uncertainty and next recovery actions are clear without repeated guessing. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-13: PDF resume review and stored analysis

Coverage: REQ-11; F-002-AC-07/11; QA-08.

1. [ ] **Action:** In Profile, expand Review skills from a resume, select a career and upload the organizer's selectable-text PDF; select Review resume. **Expected:** Suggested skills show supporting page/passage; review alone saves no skill reports.
2. [ ] **Action:** Dismiss one suggestion; explicitly save another with a self-reported level. End review and reload. **Expected:** Only confirmed reports persist; ending review does not undo reports already saved.
3. [ ] **Action:** Inspect stored document management separately. Where available, upload a sample and explicitly select Analyze PDF. **Expected:** Upload and analysis are distinct; validated supported document context applies automatically, separately from confirmed skill reports.
4. [ ] **Action:** Replace/remove stored context and request later guidance; exercise removal during analysis with the organizer. **Expected:** Removed context is excluded and late work cannot restore it; progress/focus remain intact.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Temporary review, confirmation and available stored-document lifecycle behave distinctly and correctly. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | The member understands review versus analysis, what will be saved, and what removal affects. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-14: Google sign-in and linking

Coverage: REQ-01/13; QA-01; AUTH-C1.

1. [ ] **Action:** Inspect the account-entry page for Google access against the organizer's declared build coverage. **Expected:** Current omitted presentation is recorded as a coverage gap; no control or successful authentication is assumed.
2. [ ] **Action:** On an approved enabled build, use the designated Google account to sign in, then repeat and cancel consent. **Expected:** Success reaches the correct account; cancellation leaves usable entry.
3. [ ] **Action:** With the organizer's existing-account fixture, follow explicit linking and prove access to that existing account. **Expected:** Matching email alone does not merge accounts; profile/history are preserved after approved linking.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | On a build where this journey is testable, Google entry, cancellation and explicit linking preserve identity/history. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Google entry, cancellation and the proof needed for linking are understandable. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-15: Authenticator and recovery

Coverage: REQ-11/13; QA-02; AUTH-C2.

1. [ ] **Action:** On the organizer's disposable account, start authenticator enrollment and enter an incorrect then correct setup code. **Expected:** Enrollment activates only after valid verification; errors do not enable the factor.
2. [ ] **Action:** Sign out/in and supply an invalid then valid authenticator code. **Expected:** An invalid factor cannot grant protected access; a valid one completes the intended flow.
3. [ ] **Action:** Use one designated recovery code, then try that consumed code again; follow the supported regeneration flow. **Expected:** Recovery codes are single-use; regenerated codes invalidate old ones according to provider-managed behavior.
4. [ ] **Action:** Follow fresh-auth disablement and the organizer's lost-factor fixture. **Expected:** No email-only bypass silently removes MFA; unavailable recovery is explained.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Enrollment, factor enforcement, single-use recovery and fresh-auth lifecycle work. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Setup, recovery-code handling and failed-factor recovery are clearly explained. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-16: Password recovery and password changes

Coverage: REQ-01/11/13; QA-01/02.

1. [ ] **Action:** Request recovery for the organizer's known and unknown test addresses; attempt one resend during cooldown. **Expected:** Acknowledgment does not reveal account existence; cooldown is explained; requesting reset does not end a normal session.
2. [ ] **Action:** Open the valid email link in the same browser/origin; try a short password and mismatched confirmation, then a valid matching password. **Expected:** Proof is required and validation enforces the 8-character minimum and confirmation.
3. [ ] **Action:** Try an expired link, a used link and a link opened in a browser without the original proof. **Expected:** Invalid proof fails recoverably without unlocking password editing.
4. [ ] **Action:** Complete recovery, then sign in with the old and new passwords; use the organizer's enrolled-MFA fixture. **Expected:** New password works, old password fails; MFA remains required; refresh-session revocation and any partial-success state are reported truthfully.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Neutral requests, valid/invalid proof, password validation and preserved MFA work. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | The member understands how to request a new link, correct input and return to sign-in. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-17: Account deletion

Coverage: REQ-11/13; NFR-06; QA-09.

1. [ ] **Action:** On the organizer-designated disposable account, open deletion; cancel once. **Expected:** Cancellation retains the account and saved data.
2. [ ] **Action:** Try incorrect identity verification and incorrect confirmation, then use valid fresh verification and DELETE. **Expected:** Invalid attempts cannot delete; accepted deletion requires the documented proof and confirmation.
3. [ ] **Action:** After a confirmed receipt, attempt sign-in/private-page access; use organizer-prepared interruption during another deletion attempt. **Expected:** Accepted deletion blocks access and says purge is in progress; network uncertainty never fabricates success or guarantees no change.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Cancel, proof, confirmation, durable acceptance and immediate access block work. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Deletion consequences, confirmation and uncertain/in-progress states are understandable. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-18: Manual skill reports

Coverage: REQ-11; QA-07/08.

1. [ ] **Action:** Open Profile skills, add an available skill and explicitly choose a self-reported experience level. **Expected:** Only deliberate reports are saved; interest/activity is not presented as assessed competence.
2. [ ] **Action:** Edit the level, remove a report through supported controls, then refresh and sign out/in. **Expected:** Acknowledged changes persist and removed reports stay removed.
3. [ ] **Action:** Compare manual skills with a temporary resume review and visit career comparison. **Expected:** Unconfirmed resume suggestions do not become reports; comparison and skill editing do not silently change learning progress.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Explicit skill addition, edits, removal and separation from suggestions persist. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Skill labels, self-report levels and save/remove consequences are clear. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-19: Profile photos

Coverage: REQ-11; NFR-05/06; QA-07.

1. [ ] **Action:** Select an organizer-provided JPEG/PNG/WebP within 2 MB and 4096 pixels per side; save Profile and reload. **Expected:** The saved photo appears for the correct account after confirmed save.
2. [ ] **Action:** Try an over-limit image, SVG and animated file from the fixture pack. **Expected:** Unsupported input is rejected with recoverable feedback; the previous saved photo remains usable.
3. [ ] **Action:** Choose another photo then discard; separately remove and save, then reload. **Expected:** Discard does not replace the saved image; confirmed removal persists and does not change suggestions/focus.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Valid photo save, invalid-file rejection, discard and removal preserve correct state. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | File restrictions, preview versus saved state and removal feedback are clear. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-20: Progress counts, calendar and streaks

Coverage: REQ-09/10; QA-05/06.

1. [ ] **Action:** On a known milestone, mark one applicable topic Done, another Skipped and another Learning; inspect progress. **Expected:** Only Done increases completion; Skipped stays in the denominator; unselected branches do not contribute.
2. [ ] **Action:** Mark the same topic Done more than once on the same local day, then undo Done. **Expected:** No duplicate daily credit; undo removes the contribution and recalculates affected summaries.
3. [ ] **Action:** Use prepared zero-activity, yesterday-active, broken-streak and longest-streak accounts; navigate calendar months. **Expected:** Current/longest streaks and daily counts match the recorded dates; month navigation does not change their scope.
4. [ ] **Action:** With the organizer, exercise a real date boundary and timezone change using the approved fixture procedure. **Expected:** Yesterday's streak survives pending today; a full inactive day breaks it; historical dates remain unchanged and future activity uses the new local timezone.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Done-only counts, deduplication, undo, streaks and exercised date rules are correct. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | The member can distinguish completion, skipped work, daily activity and streaks. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-21: Concurrent tabs and account transitions

Coverage: NFR-04/05; F-001-AC-07; QA-03/05/09.

1. [ ] **Action:** Open the same Profile/Discovery draft in two signed-in tabs. Save different edits in the first, then save stale edits in the second. **Expected:** Stale revisions do not silently overwrite the newer saved record; recovery is visible.
2. [ ] **Action:** Try setting different topics Learning in the two tabs; refresh both. **Expected:** The account retains a single active Learning topic with conflict handling.
3. [ ] **Action:** On one browser, sign out of account A and sign into organizer-owned account B while an A request is pending. **Expected:** No A profile, suggestions, document or progress data appears in B; late work does not overwrite B's context.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Revision conflicts, single-Learning enforcement and account transitions preserve isolation. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Conflicts explain what happened and how to continue without guessing which state was saved. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-22: Invalid files and analysis integrity

Coverage: REQ-05/11; NFR-05/07; F-002-AC-07/11.

1. [ ] **Action:** Use supplied wrong-type/renamed, malformed, encrypted, image-only and over-10,000,000-byte PDFs in the applicable review/analysis flow. **Expected:** Unsupported inputs fail recoverably without replacing prior successful data.
2. [ ] **Action:** Use supplied stored-analysis fixtures over 50 pages or 100,000 extracted characters; review sparse/irrelevant text. **Expected:** Limits are enforced; missing evidence is not invented.
3. [ ] **Action:** Use a sample containing a harmless instruction to ignore rules and claim an invented skill. **Expected:** Document text cannot override application rules; accepted facts require supporting source evidence.
4. [ ] **Action:** During organizer-arranged analysis delay, replace/remove context and wait for the old response. **Expected:** Late responses cannot restore excluded context or erase newer valid state.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Invalid documents, absent evidence, embedded instructions and stale results are handled safely. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | The member understands rejection, unsupported content and the state of earlier successful work. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-23: Private-account boundaries

Coverage: REQ-13; NFR-05/06; QA-09.

1. [ ] **Action:** With organizer-owned A and B accounts, save different profiles, progress and suggestions. Switch between them. **Expected:** Each account sees only its own saved state.
2. [ ] **Action:** Copy an A private record/document URL supplied by the organizer and open it while signed out, then as B. **Expected:** Access is denied without exposing A's content; an opaque identifier is not authorization.
3. [ ] **Action:** Log A out and use browser history and a previously opened private page. **Expected:** Private content is not retained as usable authenticated access after logout; sign-in recovery is available.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Observed private pages, copied links and account switching preserve ownership. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Access denial and session recovery explain the next action without exposing private details. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-24: Public information and service status

Coverage: REQ-01; NFR-01/08/10; pages-and-interactions.md.

1. [ ] **Action:** Open footer Licenses, Credits, Terms and Service status while signed out. **Expected:** Public pages and their links are reachable and show their intended content.
2. [ ] **Action:** Repeat with a confirmed ready session and return through application navigation. **Expected:** The appropriate application navigation is available without changing progress.
3. [ ] **Action:** Open Service status and select Retry; use an organizer-arranged API/data failure. **Expected:** Current checks, last-check time and failure/retry are truthful; no historical uptime is invented.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Public pages, session-aware navigation and current service-status retry work. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Public information and current service limitations are easy to find and interpret. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

## Try to break it: recovery and consistency checklist

Run these controlled variations after the normal journeys, using the organizer's test fixtures. They contribute to the related journey ratings; members do not write separate reports. Do not flood shared services, modify operating-system clocks, change provider settings, or delete ordinary member accounts.

| Check | Related journeys | Action | Required outcome |
| --- | --- | --- | --- |
| BR-01 | MT-01/09/16 | Submit empty fields, then invalid email, short password, mismatched confirmation and over-length names. | Specific recoverable validation; no false save, authentication or erased valid input. |
| BR-02 | MT-01/04/07/09 | Double-click Verify, Submit, Update suggestions or Save during a normal pending operation; use only a few clicks. | No duplicate accepted work/calendar credit; truthful pending feedback and bounded requests. |
| BR-03 | MT-03/04 | Choose uncertainty, go Back and change fields/activities so the route changes. | Exclusive limits hold; inactive answers do not leak into current evidence. |
| BR-04 | MT-03/09/12 | Navigate away or refresh while edits are dirty and while a save is pending; return after reconnecting. | Dirty protection and honest reconciliation; no invented success or silent loss of an acknowledged save. |
| BR-05 | MT-07/20/21 | Rapidly change topic statuses and try different Learning topics in two tabs. | Single-Learning invariant holds; Done counts and current saved states reconcile without duplicate credit. |
| BR-06 | MT-07 | Cancel a focus/branch conflict resolution; repeat during an organizer-arranged failed save. | Prior focus/branch/status remains truthful; a failed/canceled switch is not shown as completed. |
| BR-07 | MT-09/21 | Save conflicting profile/preferences or Discovery drafts from two tabs. | Revision conflict is visible; a stale tab cannot silently overwrite newer accepted data. |
| BR-08 | MT-10/12/13/22 | Use an organizer-arranged slow/failed provider while browsing careers and saving progress. | Recoverable failure; independent core features remain usable; previous eligible state is preserved. |
| BR-09 | MT-13/22 | Submit unsupported or over-limit sample files; retry using a valid sample. | Specific rejection; earlier saved state survives; a later valid attempt works. |
| BR-10 | MT-13/22 | Remove/replace a stored PDF while its analysis is pending; allow the old result to arrive. | Excluded context stays excluded; stale output cannot overwrite the new valid state. |
| BR-11 | MT-10/13/22 | Use a sample containing harmless instructions to invent a skill or change progress. | Text remains data; unsupported facts are not accepted and AI cannot mutate learning state. |
| BR-12 | MT-01/21/23 | Log out or switch from A to B with a private page/request open, then use Back. | A's private content is not exposed to B; late results cannot cross account ownership. |
| BR-13 | MT-01/15/16 | Use invalid/expired verification proof and a consumed recovery code/link. | No unauthorized entry or password change; recovery is clear without bypassing MFA. |
| BR-14 | MT-17 | Cancel deletion; on another disposable account, interrupt the network during acceptance. | Cancel preserves access; uncertain network outcome is reported honestly; confirmed acceptance blocks access. |
| BR-15 | MT-02/06/11/24 | Open menus/dialogs, press Escape, use browser Back, zoom to 400%, and revisit direct URLs. | Navigation, focus and essential controls remain usable; viewing does not alter progress. |
| BR-16 | MT-20 | Repeat Done on one local date, undo it, and exercise prepared date/timezone boundaries. | Deduplicated calendar credit and recalculated streaks; historical dates are preserved. |

## Engineering checks retained outside member scoring

The organizer assigns these to a technical reviewer. Member numbers cannot certify them; keep an evidence reference or an explicit pending status.

| Coverage | Required engineering evidence |
| --- | --- |
| QA-01/02/09 | Direct API ownership/session/AAL enforcement, provider-boundary linking, expired-session handling, once-only recovery under concurrency, and deleted-account denial with still-unexpired JWTs. |
| QA-08/09 | Structured-output/reference validation, stale-response guards, receiving-service file validation, private storage/log/secret review and document lifecycle evidence. |
| QA-10 | Controlled nonproduction CAPTCHA, receiving-service cooldowns/quotas, persisted limits, shared-IP behavior and bounded budget/failure tests. No live flood test. |
| QA-11 | Supported setup, schema/contracts, encrypted backup/private-object restore, retention/deletion ledger, maintenance while the app sleeps, independent missed-run alerts and catch-up. |
| QA-12 | Measured performance and complete browser/accessibility evidence. Member impressions do not establish p95, Web Vitals or WCAG conformance. |
| AI/content review | Recorded model/PDF quality suite and authored content review, as required by Verification; member ratings do not replace the separate model evaluation rubric. |

Keep performance targets distinct from observed results: warm API p95 ≤2 seconds under the documented 20-user workload; LCP ≤2.5 seconds, INP ≤200 ms and CLS ≤0.1 under the stated measurement conditions; pending feedback ≤1 second; cold-start feedback/recovery budget 90 seconds; recommendations 30 seconds and stored PDF processing 120 seconds. Members observe the assigned journey; the organizer supplies measurements for claims about these targets.

## Organizer result and issue log

Duplicate rows as needed. Members only supply the two numbers in the journey rubrics and tell the organizer when they encounter trouble. Do not put passwords, recovery/verification codes, tokens or private document contents in evidence.

| Member/build | Journey + step or BR ID | Result: Pass/Fail/Blocked/Not tested | Expected vs actual / reproduction | Evidence | Issue ID / severity | Owner / retest date / result |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

Severity: **Critical** = unauthorized access or lost/corrupted acknowledged data; **Major** = blocked main task or unreliable important behavior; **Minor** = independently usable with a limited clarity/presentation issue. Stop the affected test and notify the organizer immediately for Critical findings. Further investigation belongs to the designated reviewer.

| Journey | Completeness 1–4 | Usability 1–4 | Passed / failed / blocked / not tested steps | Missing coverage / provisional? | Unresolved issue IDs |
| --- | --- | --- | --- | --- | --- |
| MT-01 | | | | | |
| MT-02 | | | | | |
| MT-03 | | | | | |
| MT-04 | | | | | |
| MT-05 | | | | | |
| MT-06 | | | | | |
| MT-07 | | | | | |
| MT-08 | | | | | |
| MT-09 | | | | | |
| MT-10 | | | | | |
| MT-11 | | | | | |
| MT-12 | | | | | |
| MT-13 | | | | | |
| MT-14 | | | | | |
| MT-15 | | | | | |
| MT-16 | | | | | |
| MT-17 | | | | | |
| MT-18 | | | | | |
| MT-19 | | | | | |
| MT-20 | | | | | |
| MT-21 | | | | | |
| MT-22 | | | | | |
| MT-23 | | | | | |
| MT-24 | | | | | |

Report completeness and usability separately, with the number of ratings and step coverage for each area. Exclude blanks from numeric averages, but retain their coverage gaps. Do not invent scores for blocked/unattempted journeys, combine the two dimensions into one approval score, or allow an average to hide a critical/major failure. A journey reaches completeness 4 only after all its listed checks have passed.

Human review, member execution, scheduled date-boundary checks and engineering gates remain pending until evidence is recorded. This workbook supports testing against existing documentation; it does not approve missing behavior or establish release readiness.

## Reference map and document verification

- [Product requirements and NFRs](product.md): functional outcomes, field rules, state/counting behavior and performance objectives.
- [Discovery specification](specs/discovery.md): F-001-AC-01–08.
- [Recommendation specification](specs/career-recommendations.md): F-002-AC-01–12.
- [Verification](verification.md): QA-01–12, browser/viewport matrix and the separate AI quality rubric.
- [Security and operations](security-and-operations.md): recovery, uploads, quotas, privacy and lifecycle policy.
- [Password recovery](features/password-recovery.md), [account deletion](features/account-deletion.md) and [PDF reading](features/pdf-reading.md): current implementation and limitations.

Document verification on 2026-11-18: local file links resolve; requirement/acceptance references were checked against owning documents; 24 unique journey IDs, 88 steps, 16 unique break-check IDs, table columns and whitespace passed checks. No fragment links were introduced. These checks verify the document only. Application tests were not run for this documentation-only change; member execution and human review remain pending, with no results prefilled.
