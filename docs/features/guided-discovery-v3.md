# Guided Discovery v3

Hosted rollout and unresolved integration work:
[combined Discovery and counselor checklist](../deployment-discovery-and-counselor.md).

Implementer: Codex. Created: 2026-11-20. Last updated: 2026-11-20.
Owner/reviewer: @YakisobaNissin; owner approved end-to-end scope and implementation
in chat. Status: source implemented; final human review and live acceptance pending.
Requirements: REQ-04, REQ-05, REQ-11; F-001-AC-01–08, F-002-AC-01–09.

## Behavior

### Repeated questions and resume-backed reasons, 2026-11-20

Owner requested distinct follow-ups and visible experience-based explanations.
Codex replaced the generated “Go deeper”/repeated activity copy with 23 authored
situations. Cloud now asks about a traffic spike, for example. Existing option IDs
retain their activity meanings and the same routes/registries remain valid.

The recommendation service now reuses current validated saved resume equivalence
mappings, in addition to exact published skill wording. Each relationship requires
the active account/document/analysis revision, a current interpretation fingerprint,
a published career/skill relationship and a quote resolving to the supplied PDF
fact. Unavailable/stale interpretations contribute no inferred connection. No model
call is made while reading/preparing deterministic results.

Supported resume background (or saved reported skills) appears first in the main
reason, followed by chosen work and authored introductory topics. Source passages
remain available in the details. The frontend displays the full reason rather than
only its first sentence. Rules identity is `discovery-rules-3.1`, so older saved
deterministic results become outdated and refresh through the existing flow.

Sources: `discovery/follow_ups.py`, `discovery/v3.py`, recommendation rules/service,
`recommendations/resume_connections.py`, and recommendation card presentation.
Verification: 22 focused copy/route/evidence cases passed, including unsupported
quotes, unrelated skill IDs, stale revisions and removed/account-scoped documents;
TypeScript and scoped lint passed. The existing local signed-in journey passed
result generation/reuse/rendering and ownership/removal checks with disposable
accounts cleaned up. It exercised reported skills, not an actual resume upload;
resume connections were verified with structured synthetic evidence. Semantic
preview was unavailable in that run and the exact task fallback worked.

Manual acceptance: after deploying compatible backend/frontend source, retake
Discovery to review the new situation copy. Use a successfully analyzed synthetic
resume, finish with Use my experience, and inspect refreshed Results: applicable
background should be visible in the main reason, with its original passage in
the details. An unrelated or removed resume must not produce a claimed connection.
No new SQL/schema/registry publication is required for this copy/evidence correction.

### Owner-requested card/progress correction, 2026-11-20

Codex adapted the owner's supplied earlier design: a centered Discovery title,
readable four-column maximum grid, semantic lucide icons, descriptions, and green
outlined selection with a visible Selected label. Cards keep their geometry when
selected and wrap to two columns/tablet and one column/mobile. No placeholder
illustrations or new assets were introduced. The CSS overrides are scoped to the
questionnaire rather than changing catalog/entry cards.

Progress now uses the actual editor index and active route length. Segments use
the same column count as the route and advance/reverse with Next/Return. The count
can change when saved answers activate additional questions. The stale stage label
was removed. Existing checkpoint and branching services were not changed.

Sources: DiscoveryHeader/DiscoveryWizard, `features/discovery/choice-presentation.ts`
and scoped rules in `styles.css`. TypeScript passed. One short local signed-in
browser check passed: four-card row cap, readable widths, unchanged selected card
height/position, 375 px reflow, progress 1→2→3→4→3 and dynamic paired-interest routing.
Desktop/mobile screenshots were visually inspected. Its disposable account was
removed. The first temporary check failed to import its helper; correcting the
temporary relative import resolved the harness issue before the successful run.
No broad tests, provider checks, backend or database changes were needed.

Manual review: open `/discovery` with a new attempt/retake, select Basics, then two
interests. Confirm readable wrapped cards and Selected labels, then advance through
the bridge/activities and use Return. The question number and segment count must
match the active question/route; verify native keyboard selection/focus and narrow
layout. Report route, viewport and expected/actual appearance for visual feedback.

New published v3 attempts use field scenarios, all fifteen paired-field bridges,
and follow-ups activated by selected activities. Routes contain at most ten
questions and may finish sooner when uncertain. The old goal question is omitted.
Existing drafts and completions retain their questionnaire version.

Use my experience opens skills/resume intake. The browser and backend require a
confirmed skill, positive self-report, or active analyzed resume with usable
evidence. Uploaded candidates do not qualify. Basics remains available. Natural
language preview/confirmation reuses the concurrent competency implementation;
manual selection and the existing PDF service remain available.

Rules consider active scenarios, preserve supported field coverage and use
confirmed career-linked skill evidence as a tie-breaker. Results carry answer
references, exact resume wording connections where supported, published roadmap
descriptions and first topic titles. Optional Counselor explanations are explicit
requests scoped to a saved run/career. No focus, progress or curriculum is changed.
Experience-dependent runs become outdated on context changes; existing privacy
erasure clears the context containing structured explanations.

## Sources and authority

See [Discovery](../specs/discovery.md), [recommendations](../specs/career-recommendations.md),
[architecture](../architecture.md) and [implementation plan](../plans/discovery-v3.md).
Source modules: `backend/app/modules/discovery`, `backend/app/modules/recommendations`,
`frontend/src/features/discovery`, `frontend/src/features/recommendations` and
`frontend/src/components/discovery`. Registry publication is
`supabase/content/20261120_discovery_v3.sql`; generated OpenAPI/TypeScript remain
wire authority. Content publication retains prior registries.

## Verification and limitations

Focused backend run: 64 passed across v3, v2 and deterministic rules.
Existing Results/card frontend run: 15 passed. Final TypeScript passed.
An additional focused run of v3 plus skill recommendation evidence/privacy tests
passed 24 cases. OpenAPI drift passed. No full suite,
container build, live provider evaluation or full browser matrix was run.
The registry passed two applications in one rollback transaction and was then
published locally on 2026-11-20. Scoped frontend/backend lint and final TypeScript
passed. Database-backed experience/privacy acceptance and authenticated browser
acceptance remain pending. On 2026-11-20 the owner explicitly authorized local
migration application. Migration `20261120000100` passed rollback validation,
was applied with its exact source recorded atomically in local migration history,
and column/default and execution grants were verified. The restricted runtime
rejected a nonexistent session and has no direct confirmation-column write grant.
Only this migration was applied; older pending migrations remain pending.
Source tests and these database checks do not establish
these gates. No hosted changes or Git publication were performed.

Resume connections currently use exact published skill wording; semantic resume
equivalence stays owned by the existing resume interpretation capability. Paired
questions share a consistent comparison layout; the data/security bridge has a
specific suspicious-activity scenario. Some pairs finish below six questions.

## Guided manual acceptance

### Local integration follow-up, 2026-11-20

Owner requested completion of remaining local work. Required reviewed schema
dependencies are now applied and tracked locally. Recovery-state reads required
the recovery schema even with issuance disabled. The local admin-created recovery
helpers were assigned to `postgres`, matching the pre-existing session guard owner;
otherwise that guard could not execute the helpers. Runtime role grants were not
broadened. Deletion/recovery features remain disabled.

The existing approved job-sample technology publication was applied locally and
its source/version selected in ignored local configuration. No new dataset was
collected. The local backend/frontend are running from existing images and mounted
source, with no image rebuild or hosted change.

`node scripts/check-discovery-v3.mjs` passed a focused authenticated/browser journey:
experience-gate enforcement, explicit task preview and unrated confirmation, stale
save denial, owner/other-account isolation, Data + Security completion, deterministic
result reuse, evidence removal, unchanged learning focus, expanded Results at 375
and 1440 pixels, blank retake, blocked experience Next, Basics and paired-interest
browser routing. Disposable accounts were removed. Source lint and helper syntax
passed. The check initially used ambiguous generic SQL wording; it now supplies an
explicit published SQL task. It does not certify semantic paraphrase accuracy.

The walkthrough also corrected first-topic ordering to follow non-retired milestones
then topics, excluding branch-specific starters. Navigation save feedback no longer
claims that a newly displayed unanswered question was already saved.

Semantic interpretation returned unavailable; exact fallback worked. A bounded
Groq model-list check returned 200 with the configured model present. Completion
failure diagnosis and human-reviewed semantic/Counselor quality remain pending.
PDF processing remains disabled in this local configuration; real resume processing
acceptance is not claimed. Hosted rollout and human final review remain separate.

After the existing local setup and reviewed v3 content publication, open
`http://127.0.0.1:5173/discovery` with a disposable account and a new attempt.
Select Use my experience: Next stays unavailable until a skill is saved or a
synthetic resume successfully analyzes. Check manual fallback, switching input
methods and Basics. Select Data and Security; verify the suspicious-activity
bridge, both fields, and selected-activity follow-ups. Change fields with Back;
abandoned answers must not appear in result evidence. Reload and resume.

At `/recommendations`, expand reasoning, inspect actual answers/experience and
introductory topics, and open the roadmap. Current focus/progress must stay
unchanged. Request a deeper explanation if the existing provider is enabled.
Remove a supporting skill/resume and verify affected explanations are suppressed
or outdated. Repeat the main flow with keyboard navigation and a narrow viewport.
Report route, action, expected/actual result and sanitized request ID; no resume
text or credentials. Live walkthrough coordination remains unassigned.
