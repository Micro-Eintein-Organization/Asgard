---
id: F-001
kind: spec
status: consolidated
requires: [BRIEF, PRD]
requirements: [REQ-01, REQ-04, REQ-05, REQ-11, REQ-13]
acceptance: [F-001-AC-01, F-001-AC-02, F-001-AC-03, F-001-AC-04, F-001-AC-05, F-001-AC-06, F-001-AC-07, F-001-AC-08]
---

# Asgard: Discovery

Documentation baseline: 2026-11-17. Consolidated from the recorded [v2 decision](../decisions.md#current-resolutions) and [implementation guide](../features/guided-discovery-v2.md). Editorial consolidation does not certify learner comprehension or release acceptance. Original BRIEF provenance remains open under AUD-10.

## Purpose

Help authenticated learners explore published careers without claiming assessed ability, job readiness, or guaranteed fit. Browsing careers skips Discovery; it does not bypass authentication on protected pages.

## Screen sequence

Completion consistency resolution, 2026-11-20 (owner-approved plan): all saved
versions use the checkpoint response's next_question_id for forward navigation.
Continue may reveal a newly applicable question; See suggestions is reserved for
a fully saved route with no unanswered questions and current experience. A final
checkpoint with no remaining question completes immediately. Failed completion
keeps the saved draft for retry. Legacy progress uses stable version-bounded
capacity and the current question number; v4 retains fixed phases. Neither reaches
completion before submission succeeds. This changes navigation/presentation, not
historical question meanings or authored routing. See the
[correction evidence](../features/guided-discovery-v4.md#completion-and-navigation-correction-2026-11-20).

V4 prepared, 2026-11-20: the owner approved the consistent adaptive-flow plan.
After its separate migration/publication, new attempts use bounded meaningful
clarifications, early stopping, source-change acknowledgement and fixed-phase
progress. Existing attempts retain their version. See [v4 implementation and
verification limits](../features/guided-discovery-v4.md). Earlier v3 descriptions
remain applicable to existing v3 sessions until the v4 rollout.

Owner-approved overhaul, 2026-11-20: new published attempts and retakes use v3.
V1/v2 drafts retain their saved version. V3 removes the goals question and uses
field scenarios, paired-interest bridges and selected-activity follow-ups, capped
at ten questions. Use my experience requires saved usable experience before
continuing; Basics remains available without enrichment. This qualifies AC-03:
documents/employment history remain optional, with manual skills as an alternative.
See [v3 implementation and acceptance](../features/guided-discovery-v3.md).

The v2 description below remains applicable to saved v2 attempts.

2026-11-20 copy correction: v3 follow-ups use distinct authored situations instead
of repeating selected activity labels. Existing question/option identities, their
activity meanings and route limits are preserved; see the v3 implementation guide.

Entry offers Guided Discovery or Browse careers. New sessions and full retakes use the published v2 questionnaire. Existing drafts resume their saved version. The server owns the route, question IDs, choices, limits, and validation in [definition.py](../../backend/app/modules/discovery/definition.py); [generated contracts](../../backend/openapi.json) own the wire shape.

V2 presents four to six questions: optional experience preference, interests, activities for the chosen fields (or general activities for uncertainty), at most one applicable follow-up, and goals. Field and activity selections allow up to two choices. An uncertainty choice is exclusive. Experience preference and goal affect the Results handoff and are not evidence of ability.

## Entry, exit and persistence

Save valid answers at explicit checkpoints with truthful pending, saved, failed, and revision-conflict states. Back edits retain inactive answers for restoration but exclude them from completion and recommendation evidence. Resume continues the existing draft. Retake from Results or Profile creates a blank attempt; it does not copy earlier answers, erase learning progress, or discard an eligible previous result.

Protect unsaved changes during navigation. A failed save must retain the local draft and offer recovery. A stale tab cannot silently overwrite a newer revision. Accepted completed sessions remain immutable.

## Insufficient-information resolution, 2026-11-21

Owner/codeowner @YakisobaNissin approved the bounded plan in chat. Entirely uncertain
active interests/activities do not produce broad placeholder suggestions. Results
offers Browse careers and optional Profile résumé/skills links. Saved usable
experience supports suggestions automatically, without a retake or extra button,
across v1–v4 and without completed Discovery. Skip still opens the catalog.
[F-002](career-recommendations.md#insufficient-direction-resolution-2026-11-21)
owns evidence/refresh behavior; [implementation and checks](../features/guided-discovery-v4.md#insufficient-information-results-2026-11-21)
records verification and pending acceptance.

## Results and recommendations

Completed v2 automatically prepares deterministic first suggestions from active answers and published careers, without a provider request or provider quota reservation. Reuse eligible saved results; bounded recovery handles transient failures. Direct activity matches appear before supported related careers, up to three total. Ask a clarification only when it can resolve an actual activity choice. No match percentages or invented skill claims.

Opening Results, retaking Discovery, or opening a career never changes the current roadmap or topic states. Browsing remains available after uncertainty or failure. Provider-backed and optional refinement boundaries belong to [F-002](career-recommendations.md).

## States and recovery

Support unavailable questionnaire/catalog, interrupted checkpoints, validation errors, changed revisions, saved drafts, empty/uncertain context, pending Results, and recoverable preparation errors. Preserve prior eligible results and exclude removed-document-dependent evidence. Do not display an invented successful recommendation.

## Acceptance scenarios

| ID | Required behavior |
| --- | --- |
| F-001-AC-01 | Explicit entry choice; Guided Discovery follows its authored route and Browse careers opens the catalog |
| F-001-AC-02 | Uncertainty and self-reported background never imply ability or dislike |
| F-001-AC-03 | No photo, PDF, employment history, or optional enrichment is required to explore |
| F-001-AC-04 | Results and retakes do not change learning focus or topic states |
| F-001-AC-05 | Suggestions reference published careers with supported reasons; failures preserve exploration |
| F-001-AC-06 | Route-dependent limits, exclusive uncertainty, inactive-answer exclusion, and accessible errors |
| F-001-AC-07 | Checkpoints and dirty-exit recovery are truthful; concurrent drafts do not overwrite silently |
| F-001-AC-08 | Results offer career/roadmap navigation without automatic focus; refresh obeys F-002 |

## Remaining evidence

The feature guide records focused checks and local publication. Learner comprehension, content review, and remaining hosted/browser acceptance are pending where not explicitly recorded as passed. The earlier five-round copy tables and proposed route assignments are archived; they no longer supply new-session copy or route authority.

## Earlier section references

The following links locate superseded wording in the dated archive. Current behavior is described above.

<a id="discovery-copy-draft"></a>

[Discovery copy draft](../archive/2026-11-17/discovery.md#discovery-copy-draft).

<a id="source-and-writing-rules"></a>

[Source and writing rules](../archive/2026-11-17/discovery.md#source-and-writing-rules).

<a id="entry-and-shared-labels"></a>

[Entry and shared labels](../archive/2026-11-17/discovery.md#entry-and-shared-labels).

<a id="round-1-your-interests"></a>

[Round 1: Your interests](../archive/2026-11-17/discovery.md#round-1-your-interests).

<a id="round-2-activities-you-might-enjoy"></a>

[Round 2: Activities you might enjoy](../archive/2026-11-17/discovery.md#round-2-activities-you-might-enjoy).

<a id="round-3-how-you-approach-problems"></a>

[Round 3: How you approach problems](../archive/2026-11-17/discovery.md#round-3-how-you-approach-problems).

<a id="round-4-your-background"></a>

[Round 4: Your background](../archive/2026-11-17/discovery.md#round-4-your-background).

<a id="round-5-your-goal"></a>

[Round 5: Your goal](../archive/2026-11-17/discovery.md#round-5-your-goal).

<a id="results-and-supporting-messages"></a>

[Results and supporting messages](../archive/2026-11-17/discovery.md#results-and-supporting-messages).

<a id="research-basis-and-comprehension-review"></a>

[Research basis and comprehension review](../archive/2026-11-17/discovery.md#research-basis-and-comprehension-review).

<a id="question-and-interpretation-boundaries"></a>

[Question and interpretation boundaries](../archive/2026-11-17/discovery.md#question-and-interpretation-boundaries).

<a id="draft-acceptance-scenarios"></a>

[Draft acceptance scenarios](../archive/2026-11-17/discovery.md#draft-acceptance-scenarios).

<a id="f-001-ac-01-enter-or-bypass-the-working-sequence"></a>

[F-001-AC-01: Enter or bypass the working sequence](../archive/2026-11-17/discovery.md#f-001-ac-01-enter-or-bypass-the-working-sequence).

<a id="f-001-ac-02-represent-uncertainty-without-invented-ability"></a>

[F-001-AC-02: Represent uncertainty without invented ability](../archive/2026-11-17/discovery.md#f-001-ac-02-represent-uncertainty-without-invented-ability).

<a id="f-001-ac-03-work-without-optional-enrichment"></a>

[F-001-AC-03: Work without optional enrichment](../archive/2026-11-17/discovery.md#f-001-ac-03-work-without-optional-enrichment).

<a id="f-001-ac-04-keep-guidance-separate-from-learning-focus"></a>

[F-001-AC-04: Keep guidance separate from learning focus](../archive/2026-11-17/discovery.md#f-001-ac-04-keep-guidance-separate-from-learning-focus).

<a id="f-001-ac-05-ground-results-and-recover-honestly"></a>

[F-001-AC-05: Ground results and recover honestly](../archive/2026-11-17/discovery.md#f-001-ac-05-ground-results-and-recover-honestly).

<a id="selected-controls-and-persistence"></a>

[Selected controls and persistence](../archive/2026-11-17/discovery.md#selected-controls-and-persistence).

<a id="additional-acceptance-scenarios"></a>

[Additional acceptance scenarios](../archive/2026-11-17/discovery.md#additional-acceptance-scenarios).
