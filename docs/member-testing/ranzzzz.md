# Ranzzzz — Asgard testing

Batch: **Progress, Dashboard and concurrent updates**  
Assigned member: **Ranzzzz**  
Prepared by: Codex on 2026-11-18  
Status: Member testing and human review pending.

## Your job

Follow the steps below in order. Each step already tells you what to do and what should happen. **Only enter two numbers per journey: Completeness and Usability**, in that journey's Score column. There is no written report for you to complete. The organizer records environment details, issues and coverage.

If you cannot attempt a stage, leave the affected score blank and tell the organizer. If you can attempt it and a required action fails or its control is missing, rate the observed failure. Tell the organizer immediately about lost saved data or another account's private information. Do not include credentials or private contents in evidence.

Use the individual journey rubrics as your score submission. The summary at the end is an organizer transcription sheet; do not fill in the same numbers twice.

## Before starting — organizer supplies

- Test URL, build and browser/viewport assignment, plus account credentials through the agreed private channel.
- Two signed-in tabs and organizer-owned A/B accounts; roadmaps with known branch membership/counts; no-focus, active, all-Done, exhausted-with-Skipped, and streak fixtures. Organizer prepares date-boundary/timezone testing without asking members to change operating-system clocks.

**Current coverage:** Use only designated accounts for cross-account transitions. Coordinate account-isolation findings with YakisobaNissin. Unexercised date-boundary and concurrent scenarios stay pending; do not infer their results from a normal save.

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

### MT-07: Focus, branches and reversible progress

Coverage: REQ-08/09; QA-05.

1. **Action:** Open a roadmap without setting it current, then explicitly set it current. **Expected:** Only the explicit action changes focus.
2. **Action:** On a topic, exercise Learning, Done, Skipped and Clear/Not started; refresh after acknowledged saves. **Expected:** Every state persists; merely reading changes no status; Done removes the topic from Learning.
3. **Action:** With a Learning topic active, try a conflicting topic, branch or roadmap; first cancel the resolution, then complete the supported resolution. **Expected:** Cancellation preserves prior state; confirmation resolves the conflict; only one topic remains Learning.
4. **Action:** Revisit a previous roadmap/branch and sign out/in. **Expected:** Saved history is retained; unselected branches do not inflate progress.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Explicit focus, all statuses, conflict resolution, cancellation and retained history work. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Status meanings and the consequences of switching focus/branches are clear. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-08: Dashboard and continuation

Coverage: REQ-10; QA-06.

1. **Action:** Use a fresh account without focus, then set a roadmap with no progress. **Expected:** The first state offers roadmap selection; the second offers an authored starting action without fabricated progress.
2. **Action:** Mark a topic Learning and use Dashboard Resume/Continue learning and View milestone. **Expected:** Controls open the correct topic/milestone in the current roadmap.
3. **Action:** Mark topics Done and Skipped; open suggested next topics without changing their status. **Expected:** Suggestions follow authored order and branch, bypass Done/Skipped, and opening does not mark Learning.
4. **Action:** Using organizer-prepared accounts, inspect fully Done and exhausted-with-Skipped roadmaps. **Expected:** Only all-Done is full completion; exhausted suggestions preserve actual percentages and offer revisiting Skipped topics.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Empty, start, active, fully completed and exhausted Dashboard states are correct. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | The member can identify current work and the next action without mistaking activity for mastery. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-20: Progress counts, calendar and streaks

Coverage: REQ-09/10; QA-05/06.

1. **Action:** On a known milestone, mark one applicable topic Done, another Skipped and another Learning; inspect progress. **Expected:** Only Done increases completion; Skipped stays in the denominator; unselected branches do not contribute.
2. **Action:** Mark the same topic Done more than once on the same local day, then undo Done. **Expected:** No duplicate daily credit; undo removes the contribution and recalculates affected summaries.
3. **Action:** Use prepared zero-activity, yesterday-active, broken-streak and longest-streak accounts; navigate calendar months. **Expected:** Current/longest streaks and daily counts match the recorded dates; month navigation does not change their scope.
4. **Action:** With the organizer, exercise a real date boundary and timezone change using the approved fixture procedure. **Expected:** Yesterday's streak survives pending today; a full inactive day breaks it; historical dates remain unchanged and future activity uses the new local timezone.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Done-only counts, deduplication, undo, streaks and exercised date rules are correct. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | The member can distinguish completion, skipped work, daily activity and streaks. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-21: Concurrent tabs and account transitions

Coverage: NFR-04/05; F-001-AC-07; QA-03/05/09.

1. **Action:** Open the same Profile/Discovery draft in two signed-in tabs. Save different edits in the first, then save stale edits in the second. **Expected:** Stale revisions do not silently overwrite the newer saved record; recovery is visible.
2. **Action:** Try setting different topics Learning in the two tabs; refresh both. **Expected:** The account retains a single active Learning topic with conflict handling.
3. **Action:** On one browser, sign out of account A and sign into organizer-owned account B while an A request is pending. **Expected:** No A profile, suggestions, document or progress data appears in B; late work does not overwrite B's context.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Revision conflicts, single-Learning enforcement and account transitions preserve isolation. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Conflicts explain what happened and how to continue without guessing which state was saved. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

## Try to break it

After each normal journey, try its related variations below. **Apply each variation only to your assigned journey IDs:** MT-07, MT-08, MT-20, MT-21. The source lists related IDs across members to help the organizer coordinate. These checks contribute to the same journey scores; they do not require another report or another set of ratings.

| Check | Related journeys | Action | Required outcome |
| --- | --- | --- | --- |
| BR-02 | MT-01/04/07/09 | Double-click Verify, Submit, Update suggestions or Save during a normal pending operation; use only a few clicks. | No duplicate accepted work/calendar credit; truthful pending feedback and bounded requests. |
| BR-05 | MT-07/20/21 | Rapidly change topic statuses and try different Learning topics in two tabs. | Single-Learning invariant holds; Done counts and current saved states reconcile without duplicate credit. |
| BR-06 | MT-07 | Cancel a focus/branch conflict resolution; repeat during an organizer-arranged failed save. | Prior focus/branch/status remains truthful; a failed/canceled switch is not shown as completed. |
| BR-07 | MT-09/21 | Save conflicting profile/preferences or Discovery drafts from two tabs. | Revision conflict is visible; a stale tab cannot silently overwrite newer accepted data. |
| BR-12 | MT-01/21/23 | Log out or switch from A to B with a private page/request open, then use Back. | A's private content is not exposed to B; late results cannot cross account ownership. |
| BR-16 | MT-20 | Repeat Done on one local date, undo it, and exercise prepared date/timezone boundaries. | Deduplicated calendar credit and recalculated streaks; historical dates are preserved. |

## Score summary — organizer use

Transcribe each journey's two numbers here when collecting results. Leave unattempted work blank and retain its coverage gap; do not average away critical or blocked behavior.

| Journey | Completeness 1–4 | Usability 1–4 |
| --- | --- | --- |
| MT-07 | | |
| MT-08 | | |
| MT-20 | | |
| MT-21 | | |

## Organizer handoff

Record each numbered step and break check as Pass, Fail, Blocked or Not tested, with build/date, evidence, issue owner and retest status. Engineering security, provider, load, lifecycle and release checks remain separate; member scores do not certify them. No test results are prefilled.

Source: the owner-supplied member-testing.md workbook, with original MT/BR IDs, steps, expected outcomes and rubrics preserved. Assignments follow the owner's latest direction: YakisobaNissin handles accounts/security and Lamb-OH handles Profile/documents.

See the [assignment index](README.md) and [complete workbook](../member-testing.md). Requirements remain in [Product](../product.md), [Discovery](../specs/discovery.md), [Recommendations](../specs/career-recommendations.md), [Security](../security-and-operations.md) and [Verification](../verification.md).
