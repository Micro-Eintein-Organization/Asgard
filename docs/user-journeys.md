---
id: JOURNEYS
kind: user-journeys
status: consolidated
requires: [BRIEF, PRD]
---

# User journeys

Documentation baseline: 2026-11-17. These journeys describe current intended user behavior, not observed user research or completed acceptance. [Pages](pages-and-interactions.md) owns interaction details; [Verification](verification.md) owns evidence. Optional capabilities require the environment's activation gates.

## J-01: Sign in and browse directly

Register and verify email or sign in through Supabase. Returning learners reach Dashboard. New learners may choose Browse careers without completing Discovery or Profile. Search/filter careers, open a roadmap, and return without changing focus. Unavailable Auth/configuration offers truthful recovery rather than a simulated session.

## J-02: Complete or leave guided Discovery

Choose Guided Discovery, follow the versioned conditional questions, and save at checkpoints. Back edits exclude inactive answers without destroying restoration data. Resume continues the draft. Completed v2 automatically prepares saved deterministic suggestions. Read supported reasons or browse all careers. Failure preserves saved answers and browsing. No ability or fit score is inferred.

## J-03: Select focus, study a topic, or change paths

Open a roadmap, choose any required tool path, and explicitly set current focus. Select a topic, read authored content/resources, and record Not started, Learning, Done, or Skipped. Conflicting active Learning state must be resolved before focus or branch changes. Cancel/failure leaves truthful state; history survives reversible updates and content revisions.

## J-04: Return and continue from Dashboard

Dashboard uses saved focus/progress for Resume learning and milestone navigation. Review activity and current/longest streaks. A new account has no fabricated progress. The next authored topic and current Learning topic are distinct from AI advice or assessed competence.

## J-05: Retake Discovery or adjust catalog preferences

Results and Profile offer a blank full retake after completion or Resume for an unfinished draft. Existing progress and eligible prior suggestions remain. Preference saves have their own revision/error handling. V2 reuses eligible deterministic results and prepares missing/outdated results under F-002; provider-backed refresh remains separately bounded.

## J-06: Optionally enrich Profile and manage a PDF

Save names, career preferences, and self-reported skills. If enabled, add a private photo or selectable-text PDF. Explicitly analyze documents or review extracted skill candidates; confirm skill reports before they enter Profile. Replace/Remove excludes dependent context and schedules required cleanup. Unsupported files or provider failures preserve usable prior state. File upload is optional.

## J-07: Protect or end account access

Use provider-managed password/recovery and optional MFA when enabled and verified. Logout clears private state. Enabled account deletion requires fresh verification, confirmation, and healthy maintenance. An accepted receipt blocks access immediately while asynchronous purge completes; network failure must not imply success. Google and MFA retain AUTH-C1/C2 gates.

## Cross-journey constraints

Career comparison and optional Counselor guidance support exploration without automatically changing focus, topic status, or confirmed skills. Disabled roadmap experience comparison and dormant W07 panels are excluded from the current journey. Self-report, interests, document evidence, learning activity, and assessed competence remain distinct.

## Review boundaries

Remaining learner comprehension, content/privacy review, provider compatibility, hosted lifecycle, and browser/accessibility checks stay pending unless a dated feature record explicitly reports them passed. Earlier student examples and flow diagrams are archived illustrations, not additional product requirements.

## Earlier section references

The following links locate superseded wording in the dated archive. Current behavior is described above.

<a id="navigation-flow"></a>

[Navigation flow](archive/2026-11-17/user-journeys.md#navigation-flow).

<a id="student-example"></a>

[Student example](archive/2026-11-17/user-journeys.md#student-example).

<a id="entry-and-exploration"></a>

[Entry and exploration](archive/2026-11-17/user-journeys.md#entry-and-exploration).

<a id="inspect-a-roadmap-and-begin-learning"></a>

[Inspect a roadmap and begin learning](archive/2026-11-17/user-journeys.md#inspect-a-roadmap-and-begin-learning).

<a id="optional-profile-and-account-detour"></a>

[Optional Profile and account detour](archive/2026-11-17/user-journeys.md#optional-profile-and-account-detour).

<a id="recovery-and-completion-states"></a>

[Recovery and completion states](archive/2026-11-17/user-journeys.md#recovery-and-completion-states).
