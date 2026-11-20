# Adaptive Discovery v4

Implementer: Codex. Created/updated: 2026-11-20. Owner/reviewer: @YakisobaNissin.
Status: activated locally on 2026-11-20 following the owner's explicit “apply it now”.
The combined upgrade committed locally; migration history and all 47 v4 registry
questions were verified. Hosted application remains pending. REQ-04/05/11; F-001/F-002.

## Implementation

V4 retains the existing card design and v1â€“v3 handlers. New published attempts use
one situation per interest, then at most two applicable clarifications. A single
clear direction finishes early. Two consecutive uncertain work answers stop probing.
Clarifications require competing selected activities or represented experience
conflicts; authored option IDs identify supported role distinctions.

Private flow metadata stores only planner version, source-version hash, generic
route IDs and work-slot budget. It stores no resume text, skill claims, quotes,
or document IDs. Removed evidence is reread through the owning services and cannot
be reconstructed from the hash. Changed experience pauses draft writes until the
user explicitly refreshes or switches to Basics. Completed attempts stay immutable.

The frontend uses question-ID cursors and server phase progress; inactive local
edits are excluded from final v4 batch saves. Four fixed phase segments fill as
checkpoints advance, with no changing overall question denominator. Resume defaults
to the first unanswered active question; Back edits preserve inactive saved answers.

Experience support is assembled before selection from confirmed positive reports,
current validated resume mappings and literal canonical task matches. Canonical IDs
deduplicate sources. Tier order is clarification preference, interest+experience,
interest alone, experience within the selected direction. Field coverage is retained.
At most one outside-field alternative can occupy the third slot: two skills or a
validated mapped task quote describing actual work are required. The task predicate
uses explicit work verbs; broad technology names alone do not qualify.

Main reasons describe role responsibilities and supplied background, with authored
starting topics. Existing evidence disclosures retain original supporting facts.
Optional Counselor expansion does not rerank. Focus/progress remain unchanged.

## Sources and rollout

Source: backend Discovery v4/experience planner, discovery service/schemas,
recommendation v4 rules and frontend Discovery editor/header. Wire authority remains
generated OpenAPI/TypeScript. The additive migration is
`supabase/migrations/20261120000200_discovery_flow_plan.sql`; registry publication is
`supabase/content/20261120_discovery_v4.sql`.

Use the [operator steps](../deployment-discovery-v4.md). The v4 migration and content
were applied only to local Supabase; no hosted deployment or Git publication occurred.

## Verification

Encoding correction, 2026-11-20 (Codex): the owner reported a garbled legacy v2
uncertainty label. An encoding error introduced during source edits had damaged
apostrophes/ellipsis text in the shared definition and wizard. Restored readable
plain text without changing question/option IDs or saved-answer meanings. A
focused regression checks questionnaire text across v1–v4. Legacy draft versions
remain intact; this correction does not convert them to v4. No SQL is needed.

43 focused v4/legacy/copy/evidence regressions passed. TypeScript, scoped lint,
OpenAPI drift and rollback-only SQL validation passed. The rollback-only validation preceded the separately authorized local application
recorded above. Hosted SQL remains unapplied by Codex. No full foundation suite or browser matrix was run.
One short authenticated local v4 browser journey passed: Basics intake, Data and
Security, their initial situations, early finish without redundant follow-ups,
advancing phase progress, 100 on accepted completion and saved v4 recommendations.
The disposable account was removed. This pass did not cover real resume processing
or the full experience-change/conflict journey. Human review of authored
clarifications and recommendation usefulness remains required.

Manual acceptance after application: at `/discovery`, choose experience, save a
skill or analyze a synthetic resume, choose two interests and answer the work
situations. Verify meaningful clarification/early finish and fixed phase progress.
Go Back, change fields, reload/resume, and change/remove supporting experience in
another tab. Continue must offer refresh/Basics, keep answers and exclude abandoned
branches. At `/recommendations`, check experience changes the shortlist, outside
alternatives are labeled, cited evidence is current, and focus stays unchanged.
Report route, expected/actual outcome and sanitized request IDs.

## Completion and navigation correction, 2026-11-20

Implementer: Codex. Required reviewer: @YakisobaNissin. Owner approved the bounded
[implementation plan](../plans/discovery-v3.md#completionnavigation-correction-2026-11-20)
in chat. REQ-04/05; F-001-AC-06/07/08. Implemented locally; human review and hosted
activation remain pending.

The previous browser decided whether to finish from the route before saving.
Saving could activate more questions, despite a final-step label. All versions now
checkpoint active edits in route order and use the returned next_question_id.
Earlier edits are saved before dependent answers; retired branch input stays local
and is excluded from submission. A final successful checkpoint completes Discovery
in the same interaction. See suggestions appears only when the server reports no
unanswered questions, active input matches saved answers, and experience is current.
Saving answers and finishing Discovery have separate pending labels. Existing
Results loading/error handling prepares suggestions without reopening Discovery.

Failures retain the question/input; completion retries reuse the saved revision.
A failed experience-recovery read preserves the original error and local input.
Duplicate submissions are guarded. Legacy versions use fixed version-bounded
progress capacity (v1: 5, v2: 6, v3: 10) and a current question number without a
changing denominator. Their bars never fill completely inside the questionnaire.
V4 keeps server-owned four-phase progress and reaches 100 only on Results after
accepted completion. Question/option meanings, authored routes, selection rules,
API contracts and schema are unchanged by this correction.

Changed source: `frontend/src/features/discovery/use-discovery-editor.ts`, its
focused test file, `DiscoveryWizard.tsx` and `DiscoveryHeader.tsx`. Prior uncommitted
Discovery, recommendation and new-account-entry work remains preserved.

Verification: 10 focused frontend regressions passed, including expanding routes
across v1-v4, early finish, completed-draft resume, failed saves/stale-revision
feedback, completion retry, duplicate clicks, abandoned edits and experience pause.
TypeScript and scoped lint passed. One authenticated local browser walkthrough
passed with a disposable account: Basics, Data + Security, two competing Data
activities, a clarification before completion, no premature final-action label,
progress below 100 until completion, then saved v4 recommendation cards and 100.
The fixture account was deleted. Existing authorization/selection checks were not
rerun because those paths/contracts did not change. No full suite or browser matrix.

Manual review at `http://localhost:5173/discovery`: start/retake, select Basics,
Data + Security, and two Data activities. Continue should reveal the useful
clarification before finishing. Answer it; Results should open directly. Go Back
before finishing and change an interest; only the new active route should be used.
For a saved fully answered draft, See suggestions should complete without new
questions. Failed saves should keep your input and offer reload/retry. Report the
question text, saved questionnaire version and expected/actual behavior if this
fails. Real multi-tab conflicts and assistive-technology acceptance remain guided
manual checks; hosted behavior has not been verified.

Rollout: publish the reviewed combined change and redeploy the Vercel frontend.
This correction adds no SQL or backend changes; earlier v4 activation prerequisites
still apply to hosts that have not received them. Use the existing
[deployment checklist](../deployment-discovery-v4.md), then verify the deployed
revision and saved question version. No commit, push or hosted deployment occurred.
