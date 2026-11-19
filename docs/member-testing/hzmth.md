# Hzmth — Asgard testing

Batch: **Discovery, recommendations and Counselor**  
Assigned member: **Hzmth**  
Prepared by: Codex on 2026-11-18  
Status: Member testing and human review pending.

## Your job

Follow the steps below in order. Each step already tells you what to do and what should happen. **Only enter two numbers per journey: Completeness and Usability**, in that journey's Score column. There is no written report for you to complete. The organizer records environment details, issues and coverage.

If you cannot attempt a stage, leave the affected score blank and tell the organizer. If you can attempt it and a required action fails or its control is missing, rate the observed failure. Tell the organizer immediately about lost saved data or another account's private information. Do not include credentials or private contents in evidence.

Use the individual journey rubrics as your score submission. The summary at the end is an organizer transcription sheet; do not fill in the same numbers twice.

## Before starting — organizer supplies

- Test URL, build and browser/viewport assignment, plus account credentials through the agreed private channel.
- New and returning accounts, a saved Discovery draft, known answers and uncertain/mixed-answer fixtures. Arrange a Counselor/provider failure without disabling independent core services.

**Current coverage:** Completed Discovery v2 prepares deterministic first suggestions; these do not require an AI provider. Counselor and provider-backed refresh have their own configuration gates. Missing controls and unavailable stages remain coverage gaps. Do not invent recommendation evidence.

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

### MT-03: Guided Discovery and resuming answers

Coverage: REQ-04; F-001-AC-01/02/03/06/07; QA-03.

1. **Action:** From new-user entry choose Browse careers; later explicitly open Guided Discovery. **Expected:** Browsing works without answering Discovery or completing Profile.
2. **Action:** Follow the authored questions. Try more than two interests/activities; choose uncertainty alongside another answer. **Expected:** Selection limits and exclusive uncertainty are enforced with clear feedback.
3. **Action:** Use Back to change a field so a follow-up changes; return to the earlier route. **Expected:** Inactive answers do not influence the active route/results; restoration follows the saved questionnaire.
4. **Action:** Save at a checkpoint, leave, sign out/in and explicitly resume. Separately try leaving with unsaved edits. **Expected:** Saved answers return; unsaved-exit protection is truthful; returning login does not force the questionnaire open.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Browse bypass, route rules, checkpoint persistence and deliberate resume work. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Questions, limits, Back, save feedback and resume are understandable without help. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-04: Suggestions, evidence and retakes

Coverage: REQ-04/05; F-001-AC-04/05/08; F-002-AC-01/02/04/08/09.

1. **Action:** Complete Discovery with known answers and read every suggestion and reason. **Expected:** Up to three distinct published careers appear with reasons supported by active answers; no invented skills or fit percentages.
2. **Action:** Using a separate fresh attempt, choose uncertainty/mixed interests and complete it. **Expected:** Suggestions acknowledge their limited basis and support broad exploration rather than infer ability.
3. **Action:** Revisit unchanged results, open a suggested roadmap, then start a full retake from Results or Profile. **Expected:** Eligible results are reused; retake starts blank; opening/retaking does not change focus or progress.
4. **Action:** Where provider-backed Update suggestions is exposed, change relevant saved context and refresh explicitly. **Expected:** Outdated context is distinguished; refresh follows the documented policy, without automatic progress changes.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Supported results, uncertainty, reuse and blank retake preserve learning state. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | The member understands why results appear and how to explore or retake. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-10: Contextual AI Counselor

Coverage: REQ-12; NFR-07; QA-08.

1. **Action:** Ask about the currently viewed career, then the next authored learning step. **Expected:** Answers use relevant available context and do not invent skills, competence or readiness.
2. **Action:** Expand Sources and follow the answer's career/topic destinations. **Expected:** Sources can be inspected and destinations resolve to valid authored content.
3. **Action:** Ask the Counselor to mark a topic Done or change the current roadmap; inspect saved state afterward. **Expected:** The Counselor remains read-only and does not mutate progress/focus.
4. **Action:** During an organizer-arranged provider failure, ask a question, then browse careers and update progress. **Expected:** Failure is visible; independent browsing/progress remain usable when their services are healthy.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Grounded answers, valid sources, read-only behavior and failure isolation work. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Answers and their limits are clear; the member can inspect sources and recover from failure. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

## Try to break it

After each normal journey, try its related variations below. **Apply each variation only to your assigned journey IDs:** MT-03, MT-04, MT-10. The source lists related IDs across members to help the organizer coordinate. These checks contribute to the same journey scores; they do not require another report or another set of ratings.

| Check | Related journeys | Action | Required outcome |
| --- | --- | --- | --- |
| BR-02 | MT-01/04/07/09 | Double-click Verify, Submit, Update suggestions or Save during a normal pending operation; use only a few clicks. | No duplicate accepted work/calendar credit; truthful pending feedback and bounded requests. |
| BR-03 | MT-03/04 | Choose uncertainty, go Back and change fields/activities so the route changes. | Exclusive limits hold; inactive answers do not leak into current evidence. |
| BR-04 | MT-03/09/12 | Navigate away or refresh while edits are dirty and while a save is pending; return after reconnecting. | Dirty protection and honest reconciliation; no invented success or silent loss of an acknowledged save. |
| BR-08 | MT-10/12/13/22 | Use an organizer-arranged slow/failed provider while browsing careers and saving progress. | Recoverable failure; independent core features remain usable; previous eligible state is preserved. |
| BR-11 | MT-10/13/22 | Use a sample containing harmless instructions to invent a skill or change progress. | Text remains data; unsupported facts are not accepted and AI cannot mutate learning state. |

## Score summary — organizer use

Transcribe each journey's two numbers here when collecting results. Leave unattempted work blank and retain its coverage gap; do not average away critical or blocked behavior.

| Journey | Completeness 1–4 | Usability 1–4 |
| --- | --- | --- |
| MT-03 | | |
| MT-04 | | |
| MT-10 | | |

## Organizer handoff

Record each numbered step and break check as Pass, Fail, Blocked or Not tested, with build/date, evidence, issue owner and retest status. Engineering security, provider, load, lifecycle and release checks remain separate; member scores do not certify them. No test results are prefilled.

Source: the owner-supplied member-testing.md workbook, with original MT/BR IDs, steps, expected outcomes and rubrics preserved. Assignments follow the owner's latest direction: YakisobaNissin handles accounts/security and Lamb-OH handles Profile/documents.

See the [assignment index](README.md) and [complete workbook](../member-testing.md). Requirements remain in [Product](../product.md), [Discovery](../specs/discovery.md), [Recommendations](../specs/career-recommendations.md), [Security](../security-and-operations.md) and [Verification](../verification.md).
