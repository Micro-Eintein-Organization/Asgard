# Connected prototype

The owner subsequently directed blank retakes from Settings; the copied-answer
description below is historical. See [Discovery and catalog refresh](discovery-catalog-refresh.md).

The subsequent [MVP backend handoff](mvp-backend-handoff.md) records PDF lifecycle,
Career navigation, guidance, broader local evidence and outstanding acceptance.

- Implementer/task owner: Codex
- Created: 2026-10-28
- Last updated: 2026-10-28
- Status: source implementation and additive local publication completed; focused recommendation repair checks passed as detailed below; broad prototype acceptance remains pending
- Required reviewer: `@YakisobaNissin`, per [CODEOWNERS](../../.github/CODEOWNERS)
- Authorization/review reference: this task's owner identification as `@YakisobaNissin`, followed by “PLEASE IMPLEMENT THIS PLAN: Connected prototype with saved Discovery and Groq recommendations”, 2026-10-28.
- Branch: `codex/connected-prototype`, from the merged persisted-core baseline; preserve existing implementation. No commits, pushes or merges are authorized.
- Acceptance: F-001-AC-01–08, F-002-AC-01–06/08–10 as applicable to this local prototype; REQ-01/04/05/07/08/09/10/13. PDF and public-release acceptance remain outside this task.

## Approved bounded implementation

Implement the owner's complete plan: authored conditional activities stage with four single-interest variants and a mixed/uncertain general variant; versioned private checkpoints/completion/retakes; retained inactive answers; original Discovery/result layouts; backend-only Groq recommendations with persisted snapshots/idempotency/quotas/failures; three short published careers/roadmaps; real Dashboard/Settings integration. New-user answers start blank and retakes copy prior completed answers. All saved learning state remains independent from recommendation generation.

Owning references: [architecture](../architecture.md), [Discovery](../specs/discovery.md), [recommendations](../specs/career-recommendations.md), [decisions](../decisions.md), [design](../design.md) and [shared handoff](../development.md#stage-4-shared-contracts-and-handoff). This owner-approved map resolves the previously missing bounded route proposal; it does not certify a psychometric assessment or completed quality review.

Affected modules: Discovery and recommendation schemas/services, registered FastAPI handlers, progress Dashboard summaries, backend configuration/lifespan, generated OpenAPI/TypeScript; original frontend Discovery/results, core API adapters, Dashboard/Settings/catalog actions; additive SQL constraints, local content publication, Docker content packaging and implementation guides. Existing auth, Profile contracts, dependencies and foundational tables are reused.

Implementation order: (1) definitions/contracts and Discovery persistence; (2) recommendation lifecycle/provider adapter; (3) starter content and additive publication; (4) frontend flow and saved-state integration; (5) contract generation, source formatting, documentation and prepared regression coverage. Review and publication stay bounded to the approved local prototype. No database reset or hosted deployment.

## Verification boundary

The owner explicitly deferred testing to a separate turn. Do not run tests, builds, type/lint checks, browser verification, live provider probes or integrity probes. Source formatting, generated contract writing and approved additive local publication are implementation operations, not evidence of verified readiness. Record all checks as not run. Existing foundation evidence retains its original scope.

## Deferred work

### Approved recommendation repair, 2026-10-28

Owner/task reviewer: `@YakisobaNissin`; implementer Codex. Review reference: this task's “PLEASE IMPLEMENT THIS PLAN: Repair Groq validation and select from published roadmaps.” Preserve the existing branch and uncommitted work. Read-only diagnosis found 3 published candidates, two `invalid_output` runs and a reconstructed 6,371-byte request below the 12,000-byte guard. Exact historical rejection stage was not recorded.

Implement safe stage/finish/token diagnostics; a private candidate-key output schema resolved through a saved published catalog snapshot; the approved closest-available policy with caveats; configurable 4,096 total completion tokens; current prompt/provider-schema versioning; and clean single-error/cooldown recovery. Public recommendation fields and database schema remain unchanged. Preserve explicit focus, saved answers, quotas, deadline and idempotency. Run targeted backend tests, frontend type/contract checks and one bounded live synthetic-account request using the actual catalog and existing local Auth helpers. This narrow verification supersedes the earlier testing deferral for this issue only. Do not send the owner's answers, run broad regression or make repeated live attempts. No commits, pushes or merges.

Deep curricula and additional careers; branching beyond activities; PDF/photo and MFA; LLM-generated questions/curricula/tutoring; questionnaire comprehension and full model-quality studies; public deployment/operational acceptance. A local Groq key belongs only in ignored server configuration; missing credentials must not block Discovery or learning saves.

## Implemented source

- [Discovery definition](../../backend/app/modules/discovery/definition.py), [schemas](../../backend/app/modules/discovery/schemas.py) and [service](../../backend/app/modules/discovery/service.py) supply the pinned questionnaire, option descriptions/exclusions, published-registry validation, authenticated drafts, server-derived active routes, explicit checkpoints, CAS conflicts, completion and copied retakes. Completed rows remain immutable under existing SQL guards. Inactive answers remain stored but are excluded from completion and provider facts. No answer-table DELETE grant is added.
- [Recommendation service](../../backend/app/modules/recommendations/service.py), [provider adapter](../../backend/app/modules/recommendations/provider.py) and [schemas](../../backend/app/modules/recommendations/schemas.py) supply saved context/catalog snapshots, model/prompt/schema provenance, duplicate reuse, expired-pending recovery, bounded quotas and run outcomes. All 29 registered feature operations now have handlers; [foundation routes](../../backend/app/api/foundation.py) no longer return intentional 501 stubs.
- Groq requests use the existing HTTP client and strict JSON schema. The default candidate is `openai/gpt-oss-120b`; only backend configuration holds its key. The provider sees authored fact IDs/descriptions/revisions and allowed catalog entries, not account identity, names, contacts, private Discovery-session IDs or inactive answers. Model output is checked against catalog/evidence and prohibited score/competence claims before saving. Structural validation is not demonstrated semantic quality.
- Run execution is synchronous within the existing API request, outside database transactions, with a persisted 30-second deadline and no new worker/queue. One pending run/account, initial-run spacing of one minute, at most 10 provider attempts/day/account and 100/day/application are enforced transactionally; a retry needs its own reservation. At most one transient retry fits within the deadline and provider backoff. Quotas fail closed. Pending runs surviving interruption expire on subsequent state reads.
- [Frontend Discovery](../../frontend/src/components/discovery/DiscoveryWizard.tsx) and its [editor controller](../../frontend/src/features/discovery/use-discovery-editor.ts) restore the original question-card/grid/header composition with accessible native selections, a blank draft on first entry, frozen save revisions, checkpoint feedback, dirty/pending exit protection and conflict reload. Retakes open the copied answers from the beginning. Invalid unfinished answers can be revisited in the open tab but are not reported saved.
- [Recommendation cards](../../frontend/src/features/recommendations/components.tsx) and their [controller](../../frontend/src/features/recommendations/use-recommendation-flow.ts) retain the original card/skills arrangement with actual saved reasons, uncertainty notes, individual roadmap links and previous/outdated result labels. Final Discovery submission carries a one-time generation action; page revisits only read saved state. Pending runs poll bounded server state; retries and Update suggestions are explicit. Catalog gaps show a limited-catalog explanation without invented success.
- [Core adapters](../../frontend/src/features/core/data.ts), [Dashboard](../../frontend/src/screens/DashboardScreen.tsx), [Settings](../../frontend/src/screens/SettingsScreen.tsx) and [catalog](../../frontend/src/components/catalog/RoleCatalog.tsx) link the saved workflows. Existing name/preferences/focus/topic/branch/activity services remain. Profile setup returns Save/Skip/Back to results. Results and browsing never set focus automatically.
- [OpenAPI](../../backend/openapi.json) and [generated TypeScript](../../frontend/src/api/generated/schema.d.ts) were regenerated as implementation artifacts. Required option flags/exclusions, active-route IDs/resume question, recommendation availability/context metadata and the catalog-gap failure code are typed. The error envelope remains unchanged; 429 responses expose Retry-After and the UI applies a retry cooldown.

## Content, review and local publication

[Authored content](../../backend/app/content/prototype_v1.py) contains 3 careers, 3 roadmaps, 6 milestones, 16 topics and a Data Analyst Spreadsheet/SQL branch group. All topic resources are link-only, publicly readable primary documentation. Original Asgard summaries are not copied source articles. Codex performed source/access/license review during this task; this is recorded as agent review within owner-approved prototype scope, not fabricated human curriculum approval or learner acceptance.

Resource evidence reviewed 2026-10-28: [MDN licensing](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Attrib_copyright_license), [MDN web-development learning material](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website), [LibreOffice Calc Help and its MPL 2.0 notice](https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html), [SQLite SELECT](https://www.sqlite.org/lang_select.html) and [public-domain dedication](https://www.sqlite.org/copyright.html), [GOV.UK user needs](https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs), [prototypes](https://www.gov.uk/service-manual/design/making-prototypes) and [usability testing](https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing), with their Open Government Licence footer. Links are not downloaded or redistributed. Resource review is content-authoring evidence, not an application/browser test. Availability can change later.

The [renderer](../../backend/scripts/render_prototype.py) writes an additive publication using stable IDs and refuses conflicting existing values. Its [generated SQL](../../supabase/content/20261028_connected_prototype.sql) includes the careers/paths/resources and questionnaire registry. It is separate from automatic database reset/seed behavior. The old Frontend-only draft/renderer remains historical source and is not an additional runtime curriculum.

Local implementation actions completed, without testing:

1. Started the existing Docker application images with `docker compose up -d --no-build` after the owner opened Docker. No image builds were run.
2. Applied only [20261028000100_connected_prototype.sql](../../supabase/migrations/20261028000100_connected_prototype.sql) using the pinned CLI: `npx.cmd --no-install supabase db push --local --yes`. Output reported this one applied migration. It adds the catalog-gap failure code; existing migrations and RLS/grants are unchanged.
3. Generated the publication using `docker compose exec -T backend python scripts/render_prototype.py --output /workspace/scripts/connected-prototype.sql`, then moved the generated file to its repository content location.
4. Applied that SQL to the existing local `supabase_db_asgard-foundation` through administrative `psql` with ON_ERROR_STOP. Output reached COMMIT. No database reset, private-data export or runtime-role privilege elevation occurred.
5. Regenerated API artifacts and formatted changed sources. These operations do not establish endpoint/type/runtime correctness.

For another local checkout, review the same additive migration/publication against that checkout's actual Supabase project. The container name above records this execution only; do not assume that resource identity or this environment's credentials/activation elsewhere. The equivalent approved administrative publication must resolve the local project rather than embedding a contributor path.

## Groq setup

Root [.env.example](../../.env.example) documents `ASGARD_GROQ_ENABLED`, `ASGARD_GROQ_API_KEY` and `ASGARD_GROQ_MODEL`. Set the enable flag to true and supply your own valid key in ignored root `.env`; the model defaults to `openai/gpt-oss-120b`. Recreate the backend with the existing image to load changed environment (`docker compose up -d --no-build --force-recreate backend`, then start frontend if required). The backend reads those settings at startup; changing `.env` alone does not update an existing container's environment. No key was requested in chat, fabricated, copied from another developer or put into frontend configuration. Missing configuration leaves recommendations unavailable while independent saves remain usable. No live Groq call or console/privacy configuration acceptance was performed.

## Verification, handoff and remaining limits

The deferral and not-run list below records the original implementation handoff. The subsequently authorized focused repair has its own [execution evidence](#recommendation-repair-evidence-2026-10-28); it does not certify the broader application or full model-quality gate.

**Not run, by owner instruction:** tests, builds, type/lint checks, API drift checks, browser/visual/keyboard checks, save/readback/ownership/session/concurrency checks, migration integrity probes, live Groq calls and model-quality evaluation. The publication COMMIT and code generation are implementation evidence only. No save flow or local readiness is certified. No commits, pushes or merges were made.

[Prepared tests](../../backend/tests/test_connected_prototype.py) cover interest variants, retained inactive branches, server selection exclusions, accepted catalog gaps, strict provider output, invalid-output no-retry and reservation-before-retry. [Foundation contract tests](../../backend/tests/test_foundation_contracts.py) now expect authenticated fail-closed storage behavior rather than obsolete 501 stubs, and allow an empty untrusted selection for catalog-gap handling. They were edited, not executed. Database/API lifecycle and frontend acceptance still require the next authorized verification turn; unit cases do not establish those properties.

Guided manual acceptance, still pending at `http://127.0.0.1:5173`:

1. Register/verify a synthetic local account; choose Guided Discovery. Expect no app navigation and no selected answers. Follow each single-interest branch and the mixed/uncertain branch.
2. Save an answer, leave, refresh and log back in. Resume explicitly from Dashboard. Change interests and switch back; expect the saved inactive answer restored. Use a second tab to exercise a stale revision and explicit reload.
3. Complete the current route. Expect saved completion independently of Groq success; with configured Groq, expect actual catalog-only cards or an explained catalog gap. Refresh results and confirm no new generation. Exercise timeout/quota/invalid-output cases with mocks before a bounded live call.
4. Browse each career and roadmap. Explicitly set a focus. In Data Analyst choose Spreadsheet or SQL. Mark topics Learning/Done/Skipped/Clear, refresh, and compare Dashboard progress and local-date activity. Resolving Learning is required before conflicting focus/branch changes.
5. Save names/category/timezone in Settings, refresh/relogin, retake Discovery and confirm copied answers without erased learning. Profile setup Save/Skip/Back must return to results. Use a second account and invalid/revoked sessions to verify isolation before claiming readiness.

Report failures with URL/action, expected versus actual behavior and safe request ID; do not share credentials, keys or private answer payloads. Start the next turn with focused type/contract checks and targeted tests, then ownership/concurrency/readback and guided UI acceptance. Broaden only for relevant failures or required release gates.

Still missing later: deeper curricula, more than three careers, richer branching, PDF/photo/MFA, LLM-authored questions/curricula/tutoring, comprehension studies, full candidate-model evaluation and public deployment/operations acceptance. The model cannot validate career fit; reason/evidence semantic quality remains a manually reviewed gate. No production-readiness claim is made.

## Recommendation repair evidence, 2026-10-28

Owner/reviewer: `@YakisobaNissin`; implementer: Codex. Approval is this task's explicit repair-plan implementation request. This supersedes testing deferral only for the focused repair. Earlier empty-catalog-gap output policy is superseded for new generations by closest-available published paths with honest caveats. Historical runs are preserved.

### Diagnosis and repair

Read-only database inspection confirmed three published paths and three candidates in each of two failed snapshots. Reconstruction of the earlier request produced 6,371 bytes, below the 12,000-byte guard. Both original outcomes were `invalid_output`; their exact rejection stages cannot be recovered because no safe stage/finish/usage diagnostics existed then. Do not claim the historical failures were proven token truncation or missing content.

[Private selection models](../../backend/app/modules/recommendations/selection.py) now constrain candidate/evidence keys to the request snapshot. The backend, not Groq, supplies saved career/roadmap UUIDs and resource destinations. Reasons remain bounded to 500 characters; each selection requires a caveat and explicit weak-connection flag. Mapping checks unknown keys, duplicate evidence/careers and relationships before normal application validation. Only published database careers with published roadmaps form the input candidates.

[Provider](../../backend/app/modules/recommendations/provider.py) prompt `discovery-exploration-2` and provider-schema `3` implement the approved closest-available policy. Strict JSON output chooses 1–3 candidates. Names, contacts, private session IDs and inactive answers remain excluded. Total completion budget defaults to 4,096 through `ASGARD_GROQ_MAX_COMPLETION_TOKENS`, bounded 1,024–8,192 in [configuration](../../backend/app/core/config.py). Low reasoning effort, 30-second deadline, persistent quotas, idempotency and explicit retries remain. Neither public OpenAPI nor database schema changed in this repair.

Safe diagnostic events distinguish input budget, oversized response, invalid envelope/JSON/schema, truncation, refusal, candidate/evidence rejection, missing caveat/uncertainty, prohibited claims and successful selection validation. They record generated run/request IDs, model ID, HTTP status, finish reason and numeric token usage, without raw prompts, answers, provider responses, exception values, keys or reasoning text. The pre-existing records remain generic; no fake diagnostic history was backfilled.

The [frontend controller](../../frontend/src/features/recommendations/use-recommendation-flow.ts) clears the opposite mutation's stale error when starting and clears error/cooldown after success. Successful explicit reload clears stale errors while preserving a genuinely active rate-limit cooldown unless a completed result is loaded. Cards display the current retry error instead of simultaneously showing the prior validation failure. Card markup and public destinations are preserved.

### Focused checks

- Backend: `pytest -q -p no:cacheprovider tests/test_recommendation_repair.py tests/test_connected_prototype.py tests/test_foundation_contracts.py` — **30 passed**. After adding a distinct missing-caveat diagnostic case, the affected `tests/test_recommendation_repair.py` rerun passed **15 cases**. Cases cover key/ID/evidence mapping, weak-match notes, schema constraints, safe diagnostics, truncation/refusal/malformed output, missing explanations, no validation retry, reservation-before-retry, idempotency and failed-run input preservation, plus the existing route/contract cases.
- The first run had 29 passes and one harness failure: a no-storage test inherited the runtime database URL and received session rejection. Explicitly setting `database_url=""` isolated the fixture; the focused rerun passed. This was not an application auth bypass or a reason to weaken session checks.
- Frontend: `npm run test -- src/features/recommendations/components.test.tsx` — final affected rerun **3 passed**. Verified exact career/roadmap link, single-error/cooldown display and removal of the old failure while a new request is pending.
- Frontend `npm run typecheck` — **passed**, including the new UI cases.
- Backend `python scripts/export_openapi.py --check` and frontend `npm run check:api` — **passed**, public contract/types unchanged.
- Focused Python import/source hygiene (`ruff check --select F,I,UP`) and source formatting were applied to repair files. This is not a full-repository lint/build claim.

### One live call and the persistence correction

[Opt-in local check](../../backend/scripts/check_recommendations_live.py) uses the existing local confirmed-account Auth lifecycle, the real restricted application role and synthetic Discovery answers. Local admin Auth credentials enter private stdin JSON from the pinned CLI status; they are never printed, saved or installed in application configuration. It has a hard one-provider-request transport limit and removes only its newly created synthetic account.

The one live Groq request returned HTTP **200**, `finish_reason=stop`, **1,292 prompt tokens**, **322 completion tokens**, including **111 reasoning tokens**. Strict parsing and candidate/evidence selection passed. Request size was **6,015 bytes**. No saved owner answers were transmitted. The live check then found a storage **503** during final persistence. PostgreSQL reported `permission denied for table roadmaps`: a catalog `FOR SHARE` lock added during repair required privileges intentionally absent from the read-only catalog role.

The focused correction removed that catalog row lock while retaining published-pair validation, foreign keys, the existing database publication guards and account locks. No grant or migration was added. No second live Groq call was made.

The same local check was then run in **mocked replay** mode through real Auth/session validation and restricted-role API persistence. It passed: 3 published candidates; completed saved result; 1 exact roadmap destination returned 200; same-key replay and same-context reuse returned the same run; saved answers were preserved; learning state was unchanged; zero external provider calls. The replay also exercises final persistence with the read-only catalog permissions that caused the live-check failure. Both temporary accounts were successfully removed. The aggregate daily AI budget retains normal reservation accounting for these checks; no production quota was bypassed or reset.

Evidence limit: live provider parsing/selection passed, and corrected persistence/reuse/link behavior passed with a mocked provider response. A second fully live end-to-end generation after the SQL correction was deliberately not performed because the approved live-call budget was one. The browser-level rendered flow, broad regression, full session/concurrency matrix and model-quality study remain pending. The existing Starlette/httpx TestClient deprecation warning remains; no dependency was changed.

Manual follow-up: refresh `/recommendations` and choose **Update suggestions** so the stored older prompt/schema run is replaced under the new policy. Respect any actual cooldown. Existing Discovery answers need not be re-entered and no learning focus is changed automatically. Report a persistent failure using the safe run/request reference, not a key or answer payload. No commits, pushes or merges were made.
