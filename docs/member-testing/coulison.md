# Coulison — Asgard testing

Batch: **Careers, roadmaps and accessibility**  
Assigned member: **Coulison**  
Prepared by: Codex on 2026-11-18  
Status: Member testing and human review pending.

## Your job

Follow the steps below in order. Each step already tells you what to do and what should happen. **Only enter two numbers per journey: Completeness and Usability**, in that journey's Score column. There is no written report for you to complete. The organizer records environment details, issues and coverage.

If you cannot attempt a stage, leave the affected score blank and tell the organizer. If you can attempt it and a required action fails or its control is missing, rate the observed failure. Tell the organizer immediately about lost saved data or another account's private information. Do not include credentials or private contents in evidence.

Use the individual journey rubrics as your score submission. The summary at the end is an organizer transcription sheet; do not fill in the same numbers twice.

## Before starting — organizer supplies

- Test URL, build and browser/viewport assignment, plus account credentials through the agreed private channel.
- Signed-in account; published roles with searchable skills, two-career comparison, authored roadmaps/branches and resource links. Organizer assigns browser/version, viewport, zoom and any screen-reader coverage.

**Current coverage:** Roadmap experience comparison and W07 practice/reflection panels are deferred and are not current member tasks. Two-career comparison remains in scope. Keyboard checks do not establish screen-reader acceptance.

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

### MT-02: Navigation and direct URLs

Coverage: REQ-01, REQ-02, REQ-03; NFR-01/02.

1. **Action:** Use the header and account menu to reach Dashboard, Careers/Roadmaps, Profile and Settings. **Expected:** Each control opens its named destination.
2. **Action:** Open a career roadmap, copy its URL, refresh, then open that URL in another signed-in tab. **Expected:** The dedicated roadmap page remains reachable with the correct content.
3. **Action:** Use browser Back and Forward; close and reopen the account menu. **Expected:** Navigation and menus remain usable without accidental focus or progress changes.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Named destinations, direct URLs, refresh and history navigation work. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | The member can locate pages and predict where navigation controls lead. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-05: Career search, filters and comparison

Coverage: REQ-02/06; QA-04.

1. **Action:** Search a published role title, then an associated skill. Apply a category filter. **Expected:** Relevant role entries are returned without requiring Discovery.
2. **Action:** Search a nonsense phrase, then clear the query and reset filters. **Expected:** An honest no-match state appears and the catalog can be restored.
3. **Action:** Open the two-career comparison and choose two different published roles; change one selection. **Expected:** The comparison shows the selected roles, differences, skills and work examples using available authored information.
4. **Action:** Return to the catalog and inspect current focus. **Expected:** Searching and comparing have not changed focus or learning states.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Search, no-match recovery, filtering and two-role comparison show correct content. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Search/reset controls and career differences are clear enough to choose what to inspect. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-06: Roadmap content, milestones and resources

Coverage: REQ-03/07; QA-04.

1. **Action:** Open a roadmap, expand/collapse Read more, and expand multiple milestones. **Expected:** Role details and milestone content appear without selecting current focus or changing progress.
2. **Action:** Open a topic and inspect its explanation, outcome, tools and curated resources. **Expected:** The selected topic's content is complete enough to begin; each topic has at least one free resource, with access/cost labels where relevant.
3. **Action:** Follow a resource, return, then close the topic panel using its close control and keyboard. **Expected:** The resource destination works; milestone context and keyboard focus are retained appropriately.
4. **Action:** Inspect any authored alternative paths before choosing one. **Expected:** Choices are explicit; no silent default or misleading full-path percentage appears.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Role content, topic details, free resources, context retention and explicit alternatives work. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Learning order, topic controls and resource access are understandable. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-11: Keyboard, zoom and desktop compatibility

Coverage: NFR-01/02; QA-12.

1. **Action:** Walk account entry, Discovery, catalog, roadmap, Dashboard and Settings using Tab/Shift+Tab, Enter, Space and Escape as appropriate. **Expected:** All essential actions are reachable; focus is visible; dialogs retain/return focus and milestone buttons expose expansion.
2. **Action:** Repeat at 200% and 400% browser zoom and an organizer-prepared 320 CSS-pixel reflow view. **Expected:** Essential content and actions remain reachable with appropriate scrolling; no clipping hides controls.
3. **Action:** Use organizer-assigned Chrome, Edge or Firefox on Windows, or Safari on macOS, at 1280×800, 1440×900 or 1920×1080. **Expected:** Core journeys remain readable and operable; record actual browser/version in the organizer cover sheet.
4. **Action:** Inspect errors and topic statuses without relying on color; use the assigned screen reader where provided. **Expected:** Labels, status text and feedback communicate meaning; screen-reader coverage is not inferred from keyboard use alone.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Assigned browser, viewport, keyboard, zoom and assistive-technology checks pass. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Reading order, focus, labels and reflow allow independent operation. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

## Try to break it

After each normal journey, try its related variations below. **Apply each variation only to your assigned journey IDs:** MT-02, MT-05, MT-06, MT-11. The source lists related IDs across members to help the organizer coordinate. These checks contribute to the same journey scores; they do not require another report or another set of ratings.

| Check | Related journeys | Action | Required outcome |
| --- | --- | --- | --- |
| BR-15 | MT-02/06/11/24 | Open menus/dialogs, press Escape, use browser Back, zoom to 400%, and revisit direct URLs. | Navigation, focus and essential controls remain usable; viewing does not alter progress. |

## Score summary — organizer use

Transcribe each journey's two numbers here when collecting results. Leave unattempted work blank and retain its coverage gap; do not average away critical or blocked behavior.

| Journey | Completeness 1–4 | Usability 1–4 |
| --- | --- | --- |
| MT-02 | | |
| MT-05 | | |
| MT-06 | | |
| MT-11 | | |

## Organizer handoff

Record each numbered step and break check as Pass, Fail, Blocked or Not tested, with build/date, evidence, issue owner and retest status. Engineering security, provider, load, lifecycle and release checks remain separate; member scores do not certify them. No test results are prefilled.

Source: the owner-supplied member-testing.md workbook, with original MT/BR IDs, steps, expected outcomes and rubrics preserved. Assignments follow the owner's latest direction: YakisobaNissin handles accounts/security and Lamb-OH handles Profile/documents.

See the [assignment index](README.md) and [complete workbook](../member-testing.md). Requirements remain in [Product](../product.md), [Discovery](../specs/discovery.md), [Recommendations](../specs/career-recommendations.md), [Security](../security-and-operations.md) and [Verification](../verification.md).
