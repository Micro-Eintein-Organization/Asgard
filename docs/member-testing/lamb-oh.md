# Lamb-OH — Asgard testing

Batch: **Profile, documents and shared reliability**  
Assigned member: **Lamb-OH**  
Prepared by: Codex on 2026-11-18  
Status: Member testing and human review pending.

## Your job

Follow the steps below in order. Each step already tells you what to do and what should happen. **Only enter two numbers per journey: Completeness and Usability**, in that journey's Score column. There is no written report for you to complete. The organizer records environment details, issues and coverage.

If you cannot attempt a stage, leave the affected score blank and tell the organizer. If you can attempt it and a required action fails or its control is missing, rate the observed failure. Tell the organizer immediately about lost saved data or another account's private information. Do not include credentials or private contents in evidence.

Use the individual journey rubrics as your score submission. The summary at the end is an organizer transcription sheet; do not fill in the same numbers twice.

## Before starting — organizer supplies

- Test URL, build and browser/viewport assignment, plus account credentials through the agreed private channel.
- Profile/preferences account, a career with published skills, synthetic selectable-text PDFs, malformed/encrypted/image-only and over-limit PDF fixtures, valid/unsupported/over-limit image fixtures. Arrange provider delay, interrupted saves and cold-start checks on the test environment.

**Current coverage:** Temporary resume review and stored PDF analysis are separate paths. Current stored-document presentation says “Coming later”; backend existence is not a completed member journey. Resume suggestions require explicit confirmation; valid stored analysis applies context automatically. Photos and processing depend on environment configuration; retain unavailable stages as coverage gaps.

Use synthetic files and designated accounts. Do not flood services, change provider settings, bypass security, or delete an ordinary member account. The organizer, rather than the member, arranges controlled outages and special fixtures.

## Rating guide

| Score | Completeness: how much required behavior works | Usability: how independently you can use it |
| --- | --- | --- |
| **4 - Exemplary** | Every listed check assigned for this journey passes, including its validation, persistence and recovery checks. No unresolved functional failure is observed. | Complete independently with clear controls, readable content, understandable feedback and clear recovery. |
| **3 - Proficient** | The main journey works and saves correctly, but a listed secondary or recovery check fails. No observed data-loss or account-access failure. | Complete independently, with minor confusion, unnecessary steps or presentation problems. |
| **2 - Developing** | Only part of the required journey works. Important behavior is missing or unreliable; completing it requires retries or a workaround. | Need help, repeated attempts or a workaround because instructions, controls or feedback are unclear. |
| **1 - Beginning** | The main task cannot be completed, a required feature is absent, results are incorrect, or saved information is lost/corrupted. | Cannot complete independently because navigation, instructions, feedback or accessibility prevents use. |

Use the lowest applicable description for each dimension. A working but confusing feature can receive Completeness 4 and Usability 2. Missing coverage prevents Completeness 4; the organizer marks any score provisional until all listed checks are exercised. Scores describe observed testing, not production readiness. Serious account-access or data-loss failures remain blockers regardless of averages.

## Your assigned journeys

### MT-09: Profile and preferences

Coverage: REQ-10/11; QA-07.

1. **Action:** Save a first name containing valid Unicode characters; test empty and 101-character first names and a surname over 100 characters. **Expected:** First name requires 1–100 characters; surname allows 0–100; errors preserve editable input.
2. **Action:** Change Profile and preference values, saving each with its own control; reload. **Expected:** Each independent save persists the intended data and reports success only after confirmation.
3. **Action:** Make edits, switch Profile tabs, then try leaving; choose stay before testing discard. **Expected:** Tab changes retain edits and navigation warns before discarding unsaved work.
4. **Action:** Save the name and inspect Profile enrichment guidance on Dashboard; dismiss shared guidance and revisit pages. **Expected:** Name completion updates the relevant guidance; dismissal persists; browsing remains available and name/photo edits do not claim better recommendations.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Field limits, separate saves, dirty edits and guidance state follow requirements. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Labels, save controls, validation and unsaved-change choices are understandable. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-12: Speed, pending feedback and network recovery

Coverage: NFR-03/04/07; QA-12.

1. **Action:** On an already awake app, open Careers and save Profile/progress; watch pending feedback. **Expected:** Pending feedback appears within the documented 1-second target; the UI remains responsive.
2. **Action:** On your own device, briefly disconnect during a save, then reconnect and reload before retrying. **Expected:** An uncertain save is not falsely reported successful; confirmed server state is reconciled and input remains recoverable.
3. **Action:** During an organizer-arranged cold start, open the app and wait through its startup handling. **Expected:** Startup feedback is explicit; the separate 90-second budget ends in usable content or recoverable failure.
4. **Action:** During arranged recommendation/PDF delays, use independent career navigation. **Expected:** Long-running work has truthful pending/error states; browsing does not wait for AI when core services are healthy.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Pending, interrupted saves, cold-start recovery and independent navigation work. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Waiting, uncertainty and next recovery actions are clear without repeated guessing. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-13: PDF resume review and stored analysis

Coverage: REQ-11; F-002-AC-07/11; QA-08.

1. **Action:** In Profile, expand Review skills from a resume, select a career and upload the organizer's selectable-text PDF; select Review resume. **Expected:** Suggested skills show supporting page/passage; review alone saves no skill reports.
2. **Action:** Dismiss one suggestion; explicitly save another with a self-reported level. End review and reload. **Expected:** Only confirmed reports persist; ending review does not undo reports already saved.
3. **Action:** Inspect stored document management separately. Where available, upload a sample and explicitly select Analyze PDF. **Expected:** Upload and analysis are distinct; validated supported document context applies automatically, separately from confirmed skill reports.
4. **Action:** Replace/remove stored context and request later guidance; exercise removal during analysis with the organizer. **Expected:** Removed context is excluded and late work cannot restore it; progress/focus remain intact.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Temporary review, confirmation and available stored-document lifecycle behave distinctly and correctly. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | The member understands review versus analysis, what will be saved, and what removal affects. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-18: Manual skill reports

Coverage: REQ-11; QA-07/08.

1. **Action:** Open Profile skills, add an available skill and explicitly choose a self-reported experience level. **Expected:** Only deliberate reports are saved; interest/activity is not presented as assessed competence.
2. **Action:** Edit the level, remove a report through supported controls, then refresh and sign out/in. **Expected:** Acknowledged changes persist and removed reports stay removed.
3. **Action:** Compare manual skills with a temporary resume review and visit career comparison. **Expected:** Unconfirmed resume suggestions do not become reports; comparison and skill editing do not silently change learning progress.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Explicit skill addition, edits, removal and separation from suggestions persist. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Skill labels, self-report levels and save/remove consequences are clear. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-19: Profile photos

Coverage: REQ-11; NFR-05/06; QA-07.

1. **Action:** Select an organizer-provided JPEG/PNG/WebP within 2 MB and 4096 pixels per side; save Profile and reload. **Expected:** The saved photo appears for the correct account after confirmed save.
2. **Action:** Try an over-limit image, SVG and animated file from the fixture pack. **Expected:** Unsupported input is rejected with recoverable feedback; the previous saved photo remains usable.
3. **Action:** Choose another photo then discard; separately remove and save, then reload. **Expected:** Discard does not replace the saved image; confirmed removal persists and does not change suggestions/focus.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Valid photo save, invalid-file rejection, discard and removal preserve correct state. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | File restrictions, preview versus saved state and removal feedback are clear. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-22: Invalid files and analysis integrity

Coverage: REQ-05/11; NFR-05/07; F-002-AC-07/11.

1. **Action:** Use supplied wrong-type/renamed, malformed, encrypted, image-only and over-10,000,000-byte PDFs in the applicable review/analysis flow. **Expected:** Unsupported inputs fail recoverably without replacing prior successful data.
2. **Action:** Use supplied stored-analysis fixtures over 50 pages or 100,000 extracted characters; review sparse/irrelevant text. **Expected:** Limits are enforced; missing evidence is not invented.
3. **Action:** Use a sample containing a harmless instruction to ignore rules and claim an invented skill. **Expected:** Document text cannot override application rules; accepted facts require supporting source evidence.
4. **Action:** During organizer-arranged analysis delay, replace/remove context and wait for the old response. **Expected:** Late responses cannot restore excluded context or erase newer valid state.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Invalid documents, absent evidence, embedded instructions and stale results are handled safely. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | The member understands rejection, unsupported content and the state of earlier successful work. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-24: Public information and service status

Coverage: REQ-01; NFR-01/08/10; pages-and-interactions.md.

1. **Action:** Open footer Licenses, Credits, Terms and Service status while signed out. **Expected:** Public pages and their links are reachable and show their intended content.
2. **Action:** Repeat with a confirmed ready session and return through application navigation. **Expected:** The appropriate application navigation is available without changing progress.
3. **Action:** Open Service status and select Retry; use an organizer-arranged API/data failure. **Expected:** Current checks, last-check time and failure/retry are truthful; no historical uptime is invented.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Public pages, session-aware navigation and current service-status retry work. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Public information and current service limitations are easy to find and interpret. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

## Try to break it

After each normal journey, try its related variations below. **Apply each variation only to your assigned journey IDs:** MT-09, MT-12, MT-13, MT-18, MT-19, MT-22, MT-24. The source lists related IDs across members to help the organizer coordinate. These checks contribute to the same journey scores; they do not require another report or another set of ratings.

| Check | Related journeys | Action | Required outcome |
| --- | --- | --- | --- |
| BR-01 | MT-01/09/16 | Submit empty fields, then invalid email, short password, mismatched confirmation and over-length names. | Specific recoverable validation; no false save, authentication or erased valid input. |
| BR-02 | MT-01/04/07/09 | Double-click Verify, Submit, Update suggestions or Save during a normal pending operation; use only a few clicks. | No duplicate accepted work/calendar credit; truthful pending feedback and bounded requests. |
| BR-04 | MT-03/09/12 | Navigate away or refresh while edits are dirty and while a save is pending; return after reconnecting. | Dirty protection and honest reconciliation; no invented success or silent loss of an acknowledged save. |
| BR-07 | MT-09/21 | Save conflicting profile/preferences or Discovery drafts from two tabs. | Revision conflict is visible; a stale tab cannot silently overwrite newer accepted data. |
| BR-08 | MT-10/12/13/22 | Use an organizer-arranged slow/failed provider while browsing careers and saving progress. | Recoverable failure; independent core features remain usable; previous eligible state is preserved. |
| BR-09 | MT-13/22 | Submit unsupported or over-limit sample files; retry using a valid sample. | Specific rejection; earlier saved state survives; a later valid attempt works. |
| BR-10 | MT-13/22 | Remove/replace a stored PDF while its analysis is pending; allow the old result to arrive. | Excluded context stays excluded; stale output cannot overwrite the new valid state. |
| BR-11 | MT-10/13/22 | Use a sample containing harmless instructions to invent a skill or change progress. | Text remains data; unsupported facts are not accepted and AI cannot mutate learning state. |
| BR-15 | MT-02/06/11/24 | Open menus/dialogs, press Escape, use browser Back, zoom to 400%, and revisit direct URLs. | Navigation, focus and essential controls remain usable; viewing does not alter progress. |

## Score summary — organizer use

Transcribe each journey's two numbers here when collecting results. Leave unattempted work blank and retain its coverage gap; do not average away critical or blocked behavior.

| Journey | Completeness 1–4 | Usability 1–4 |
| --- | --- | --- |
| MT-09 | | |
| MT-12 | | |
| MT-13 | | |
| MT-18 | | |
| MT-19 | | |
| MT-22 | | |
| MT-24 | | |

## Organizer handoff

Record each numbered step and break check as Pass, Fail, Blocked or Not tested, with build/date, evidence, issue owner and retest status. Engineering security, provider, load, lifecycle and release checks remain separate; member scores do not certify them. No test results are prefilled.

Source: the owner-supplied member-testing.md workbook, with original MT/BR IDs, steps, expected outcomes and rubrics preserved. Assignments follow the owner's latest direction: YakisobaNissin handles accounts/security and Lamb-OH handles Profile/documents.

See the [assignment index](README.md) and [complete workbook](../member-testing.md). Requirements remain in [Product](../product.md), [Discovery](../specs/discovery.md), [Recommendations](../specs/career-recommendations.md), [Security](../security-and-operations.md) and [Verification](../verification.md).
