# Adaptive Discovery v4

Implementer: Codex. Created/updated: 2026-11-20. Owner/reviewer: @YakisobaNissin.
Status: activated locally on 2026-11-20 following the owner's explicit “apply it now”.
The combined upgrade committed locally; migration history and all 47 v4 registry
questions were verified. Hosted application remains pending. REQ-04/05/11; F-001/F-002.

## Implementation

### Technology-backed experience, 2026-11-20

Implementer: Codex; reviewer: @YakisobaNissin. Owner approved the
[bounded evidence plan/table](../plans/roadmap-technology-evidence.md).
REQ-11, F-002, RES-01, SKILL-01/02. Implemented locally; final review and
hosted/manual acceptance pending. Discovery experience shares roadmap technology
terms; recommendation resume connections now retain direct positive evidence
when interpretation failed, while rechecking active owner/analysis/revision.
Connections cite matched wording and the original PDF fact. Technology evidence
does not establish task completion/proficiency or trigger the performed-task quote
shortcut. No document writes were added to reads. Strategy v4.1 (v3.2 for v3)
marks previous runs outdated without rewriting saved answers or explanations.

167 focused backend cases passed, including source removal, strategy staleness
and new-run explanation persistence with failed interpretation; OpenAPI drift
passed. Scoped lint retains the pre-existing matcher enum-style finding recorded
in the plan. No new infrastructure or provider calls. Manual check pending:
at `http://127.0.0.1:5173/discovery`, use the existing synthetic resume, choose
With experience and complete/request new suggestions. Compare a supported career's
Experience connections/source passage with Roadmap skills. Old saved runs need a
new request; ordinary reads do not rewrite them. Report run/career/request IDs for
discrepancies. Hosted acceptance requires reviewed backend deployment.

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


## Insufficient-information results, 2026-11-21

Implementer: Codex. Created/updated: 2026-11-21. Reviewer: @YakisobaNissin.
Owner/codeowner approved the bounded implementation plan in chat and requested
implementation. Final code review and live acceptance remain pending.
Requirements: REQ-04/05/11; F-001-AC-02/03/04/05/08; F-002 evidence/refresh policy.

Scope: Recommendations, existing account-scoped experience services, Results,
recommendation cards and automatic preparation. No wire contract, SQL migration,
dependency, authentication or learning-state change. Existing branch retained.

No active selected interest/activity means no career direction. Results shows
“We don’t have enough information to recommend a career reliably yet.” Browse
careers stays primary, with Profile links for résumé upload and skills. Skip opens
the catalog without completing Discovery. All saved v1–v4 versions and accounts
without completed Discovery are supported; actual choices retain existing rules.

Successfully analyzed current résumé passages and positive career-linked reports
automatically supply deterministic suggestions when Results opens or is revisited.
No extra generation button, retake or recommendation provider request. Positive
reports require level above zero or confirmed evidence with no assigned level;
level zero is excluded. Sources count once per skill. At most three supported
published careers are selected with actual input citations, without padding.
Existing résumé source ownership/revision checks and payload-erasure guards remain.

Strategy `experience-fallback-1` binds cached outcomes to account context, catalog
and completion. Empty outcomes are reused; revision changes trigger one automatic
request per page scope. Old broad uncertainty-only results become outdated without
rewriting history. No completed Discovery and no experience renders an empty state
without creating a run. Current roadmap/progress never supplies experience here.

Sources: `backend/app/modules/recommendations/insufficient_context.py`, recommendation
service, `frontend/src/features/recommendations/direction.ts`, recommendation cards,
and `frontend/src/components/discovery/DiscoveryWizard.tsx`.

Verification: 75 distinct focused backend cases and 21 frontend cases passed. TypeScript,
production frontend build, scoped frontend/backend lint and generated-client drift passed.
Backend OpenAPI export was not run successfully: the host verification env lacks
Pillow (PIL), and Docker was unavailable. No public schema models changed.
The pre-existing provider-regression test file retains one long-line and two
loop-lambda lint findings outside this change; scoped production/new-test lint passed.
Backend checks used
the existing host Python 3.14.7 environment, not pinned container Python. Windows
sandbox asyncio socket setup hung before coroutine execution; the same mocked
suite passed outside the sandbox. API drift passed using a workspace-local temp
directory after the sandbox temp path caused EISDIR. Docker was unavailable.
Database/session isolation and browser/manual acceptance remain pending. No live
provider, deployment, hosted SQL or Git publication occurred.

Manual checks: start the supported local stack and open
`http://127.0.0.1:5173/discovery`. Choose uncertainty for every interest/activity
and finish; Results must show the honest message and Browse careers. In Profile,
save a positive linked skill or successfully analyze a synthetic résumé. Return to
`/recommendations`: supported suggestions must appear automatically and cite the
saved inputs. Remove/correct the evidence and return; affected results must disappear.
Repeat without completed Discovery, with a legacy completion, two accounts and
an evidence revision changed in another tab. Skip must still open `/careers` and
focus/progress must stay unchanged. Report route, input version, expected/actual
result and sanitized request ID. Restricted-role/session, multi-tab deletion,
keyboard/browser and hosted checks remain pending; source completion is not
production acceptance.


### Docker and local acceptance follow-up, 2026-11-21

Codex resumed the approved checks after the owner started Docker. Existing local
app containers were started without rebuilding; no migration or content activation
was performed. All 75 focused backend cases passed in the pinned backend container,
and backend OpenAPI export/check passed. This resolves the host-Pillow/container
verification blockers above for this feature's focused checks.

A live synthetic-account run passed through the configured restricted-role HTTP
services: completed v4 with entirely uncertain work answers, saved empty outcome,
new-key reuse of the unchanged empty run, positive skill recommendations without
completed Discovery, actual skill citations, null model/provider metadata, and
cross-account 404 denial for both empty and successful runs. Headless Chrome
verified the honest empty state and Browse careers link, automatic generation after
adding a skill and revisiting Results, removal of affected cards after removing
the skill, unchanged learning focus, and no horizontal overflow at 375/1440 pixels.
Both disposable accounts were deleted after each run. The first browser test had
an over-specific link-count assertion; the corrected check verifies the required
Browse careers link exists. No application correction was needed.

Remaining acceptance: real synthetic résumé upload/extraction/interpretation through
the configured provider, legacy v1–v3 live browser journeys, actual multi-tab source
changes without reload, expired/revoked-session lifecycle checks, keyboard and
assistive-technology review, human code review and hosted deployment/smoke checks.
Existing focused tests cover version-aware direction checks and current résumé
provenance, but do not establish those remaining end-to-end scenarios. No known
additional implementation defect was found in this local pass. No commit, push,
provider call or hosted change occurred.
