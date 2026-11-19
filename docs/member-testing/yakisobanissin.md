# YakisobaNissin — Asgard testing

Batch: **Accounts and security**  
Assigned member: **YakisobaNissin**  
Prepared by: Codex on 2026-11-18  
Status: Member testing and human review pending.

## Your job

Follow the steps below in order. Each step already tells you what to do and what should happen. **Only enter two numbers per journey: Completeness and Usability**, in that journey's Score column. There is no written report for you to complete. The organizer records environment details, issues and coverage.

If you cannot attempt a stage, leave the affected score blank and tell the organizer. If you can attempt it and a required action fails or its control is missing, rate the observed failure. Tell the organizer immediately about lost saved data or another account's private information. Do not include credentials or private contents in evidence.

Use the individual journey rubrics as your score submission. The summary at the end is an organizer transcription sheet; do not fill in the same numbers twice.

## Before starting — organizer supplies

- Test URL, build and browser/viewport assignment, plus account credentials through the agreed private channel.
- Unused email account and mailbox; known/unknown recovery addresses; expired and used proof fixtures; two organizer-owned accounts; disposable authenticator and deletion accounts. Arrange the Google/provider and deletion test environment before those stages.

**Current coverage:** Google presentation is currently omitted and AUTH-C1 remains open. Authenticator recovery depends on AUTH-C2/provider capability. Deletion requires an enabled gate and healthy maintenance. Keep unavailable stages visible; do not enable services or bypass security for a test.

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

### MT-01: Registration, email verification, login and logout

Coverage: REQ-01, REQ-13; QA-01.

1. **Action:** Open Landing while signed out. Try opening Dashboard directly. **Expected:** Landing explains the app; a protected page requires sign-in.
2. **Action:** Register with the organizer's unused test email. Try a password shorter than 8 characters, then a valid password and matching confirmation. **Expected:** Invalid input is rejected; valid submission reaches email verification without granting premature access.
3. **Action:** Enter an invalid code, then the valid emailed code. Check that entering the last digit alone does not submit; select Verify. Test Resend once after the displayed cooldown. **Expected:** Errors are recoverable; verification requires the explicit action; resend feedback is truthful.
4. **Action:** Sign in with incorrect then correct credentials. Log out and reopen the protected URL. **Expected:** Invalid credentials fail; correct credentials work; logout ends private access.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Registration, explicit verification, login and logout all work; private pages stay protected. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | The member can understand each account state and recover from an invalid entry. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-14: Google sign-in and linking

Coverage: REQ-01/13; QA-01; AUTH-C1.

1. **Action:** Inspect the account-entry page for Google access against the organizer's declared build coverage. **Expected:** Current omitted presentation is recorded as a coverage gap; no control or successful authentication is assumed.
2. **Action:** On an approved enabled build, use the designated Google account to sign in, then repeat and cancel consent. **Expected:** Success reaches the correct account; cancellation leaves usable entry.
3. **Action:** With the organizer's existing-account fixture, follow explicit linking and prove access to that existing account. **Expected:** Matching email alone does not merge accounts; profile/history are preserved after approved linking.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | On a build where this journey is testable, Google entry, cancellation and explicit linking preserve identity/history. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Google entry, cancellation and the proof needed for linking are understandable. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-15: Authenticator and recovery

Coverage: REQ-11/13; QA-02; AUTH-C2.

1. **Action:** On the organizer's disposable account, start authenticator enrollment and enter an incorrect then correct setup code. **Expected:** Enrollment activates only after valid verification; errors do not enable the factor.
2. **Action:** Sign out/in and supply an invalid then valid authenticator code. **Expected:** An invalid factor cannot grant protected access; a valid one completes the intended flow.
3. **Action:** Use one designated recovery code, then try that consumed code again; follow the supported regeneration flow. **Expected:** Recovery codes are single-use; regenerated codes invalidate old ones according to provider-managed behavior.
4. **Action:** Follow fresh-auth disablement and the organizer's lost-factor fixture. **Expected:** No email-only bypass silently removes MFA; unavailable recovery is explained.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Enrollment, factor enforcement, single-use recovery and fresh-auth lifecycle work. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Setup, recovery-code handling and failed-factor recovery are clearly explained. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-16: Password recovery and password changes

Coverage: REQ-01/11/13; QA-01/02.

1. **Action:** Request recovery for the organizer's known and unknown test addresses; attempt one resend during cooldown. **Expected:** Acknowledgment does not reveal account existence; cooldown is explained; requesting reset does not end a normal session.
2. **Action:** Open the valid email link in the same browser/origin; try a short password and mismatched confirmation, then a valid matching password. **Expected:** Proof is required and validation enforces the 8-character minimum and confirmation.
3. **Action:** Try an expired link, a used link and a link opened in a browser without the original proof. **Expected:** Invalid proof fails recoverably without unlocking password editing.
4. **Action:** Complete recovery, then sign in with the old and new passwords; use the organizer's enrolled-MFA fixture. **Expected:** New password works, old password fails; MFA remains required; refresh-session revocation and any partial-success state are reported truthfully.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Neutral requests, valid/invalid proof, password validation and preserved MFA work. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | The member understands how to request a new link, correct input and return to sign-in. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-17: Account deletion

Coverage: REQ-11/13; NFR-06; QA-09.

1. **Action:** On the organizer-designated disposable account, open deletion; cancel once. **Expected:** Cancellation retains the account and saved data.
2. **Action:** Try incorrect identity verification and incorrect confirmation, then use valid fresh verification and DELETE. **Expected:** Invalid attempts cannot delete; accepted deletion requires the documented proof and confirmation.
3. **Action:** After a confirmed receipt, attempt sign-in/private-page access; use organizer-prepared interruption during another deletion attempt. **Expected:** Accepted deletion blocks access and says purge is in progress; network uncertainty never fabricates success or guarantees no change.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Cancel, proof, confirmation, durable acceptance and immediate access block work. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Deletion consequences, confirmation and uncertain/in-progress states are understandable. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

### MT-23: Private-account boundaries

Coverage: REQ-13; NFR-05/06; QA-09.

1. **Action:** With organizer-owned A and B accounts, save different profiles, progress and suggestions. Switch between them. **Expected:** Each account sees only its own saved state.
2. **Action:** Copy an A private record/document URL supplied by the organizer and open it while signed out, then as B. **Expected:** Access is denied without exposing A's content; an opaque identifier is not authorization.
3. **Action:** Log A out and use browser history and a previously opened private page. **Expected:** Private content is not retained as usable authenticated access after logout; sign-in recovery is available.

| Criterion | 4 - Exemplary | 3 - Proficient | 2 - Developing | 1 - Beginning | Score (1–4) |
| --- | --- | --- | --- | --- | --- |
| Completeness | Observed private pages, copied links and account switching preserve ownership. All listed checks pass. | Main journey works and saves correctly; a secondary/recovery check fails, without data loss or unauthorized access. | Parts work, but an important listed behavior is missing/unreliable or needs a workaround. | Main task fails, required capability is absent, results are wrong, or saved data is lost/corrupted. | |
| Usability | Access denial and session recovery explain the next action without exposing private details. Complete independently with clear feedback. | Complete independently with minor confusion or presentation issues. | Need help, repeated attempts or a workaround to understand controls, feedback or recovery. | Cannot complete independently because controls, instructions, feedback or access are unusable. | |

## Try to break it

After each normal journey, try its related variations below. **Apply each variation only to your assigned journey IDs:** MT-01, MT-14, MT-15, MT-16, MT-17, MT-23. The source lists related IDs across members to help the organizer coordinate. These checks contribute to the same journey scores; they do not require another report or another set of ratings.

| Check | Related journeys | Action | Required outcome |
| --- | --- | --- | --- |
| BR-01 | MT-01/09/16 | Submit empty fields, then invalid email, short password, mismatched confirmation and over-length names. | Specific recoverable validation; no false save, authentication or erased valid input. |
| BR-02 | MT-01/04/07/09 | Double-click Verify, Submit, Update suggestions or Save during a normal pending operation; use only a few clicks. | No duplicate accepted work/calendar credit; truthful pending feedback and bounded requests. |
| BR-12 | MT-01/21/23 | Log out or switch from A to B with a private page/request open, then use Back. | A's private content is not exposed to B; late results cannot cross account ownership. |
| BR-13 | MT-01/15/16 | Use invalid/expired verification proof and a consumed recovery code/link. | No unauthorized entry or password change; recovery is clear without bypassing MFA. |
| BR-14 | MT-17 | Cancel deletion; on another disposable account, interrupt the network during acceptance. | Cancel preserves access; uncertain network outcome is reported honestly; confirmed acceptance blocks access. |

## Score summary — organizer use

Transcribe each journey's two numbers here when collecting results. Leave unattempted work blank and retain its coverage gap; do not average away critical or blocked behavior.

| Journey | Completeness 1–4 | Usability 1–4 |
| --- | --- | --- |
| MT-01 | | |
| MT-14 | | |
| MT-15 | | |
| MT-16 | | |
| MT-17 | | |
| MT-23 | | |

## Organizer handoff

Record each numbered step and break check as Pass, Fail, Blocked or Not tested, with build/date, evidence, issue owner and retest status. Engineering security, provider, load, lifecycle and release checks remain separate; member scores do not certify them. No test results are prefilled.

Source: the owner-supplied member-testing.md workbook, with original MT/BR IDs, steps, expected outcomes and rubrics preserved. Assignments follow the owner's latest direction: YakisobaNissin handles accounts/security and Lamb-OH handles Profile/documents.

See the [assignment index](README.md) and [complete workbook](../member-testing.md). Requirements remain in [Product](../product.md), [Discovery](../specs/discovery.md), [Recommendations](../specs/career-recommendations.md), [Security](../security-and-operations.md) and [Verification](../verification.md).
