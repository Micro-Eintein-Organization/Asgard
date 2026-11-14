# Guided Discovery v2

- Implementer: Codex. Created and last updated: 2026-11-09.
- Status: implemented and published in the local Asgard database. Learner comprehension and final source review are pending.
- Scope and reviewer: PM-W05 / FUT-05, `@YakisobaNissin`. See the [owner decision](../decisions.md#w05-guided-discovery-revision-scope-2026-11-09) and [review packet](../plans/discovery-v2.md).
- Requirements: [F-001-AC-01–08](../specs/discovery.md#f-001-ac-01-enter-or-bypass-the-working-sequence) and [F-002](../specs/career-recommendations.md) evidence, uncertainty and recovery boundaries.

## Implemented behavior

- The server owns the versioned four-to-six-question route, two-choice limit, general uncertainty question, and follow-up precedence. Saved drafts retain their original version. Back edits retain inactive answers for restoration and exclude them from completion and suggestion evidence.
- Results and Profile offer **Retake Discovery** after a completed attempt. It starts the entire questionnaire blank using the published default. An unfinished draft instead shows **Resume Discovery**. **View saved career suggestions** remains a separate action in Profile.
- Results reads the preference and goal from the completed Discovery session attached to the displayed run. The preference orders the existing roadmap and skill comparison actions and stays out of model input. The suggestion service still uses the published catalog and validates evidence. It omits a neutral follow-up.
- The skill action opens the existing comparison for the selected career and roadmap. It links to temporary resume review in Profile with the career selected and a link back. Manual skill reporting remains available, and resume suggestions require explicit confirmation. The flow uses the existing design system, layout, cards, buttons and dialogs. V2 choice cards wrap within the existing grid.

The [Discovery module](../../backend/app/modules/discovery/) owns routing, validation and version selection. The [wizard](../../frontend/src/components/discovery/DiscoveryWizard.tsx), [Results cards](../../frontend/src/features/recommendations/components.tsx), [Profile](../../frontend/src/screens/SettingsScreen.tsx), and [competency components](../../frontend/src/features/competencies/) implement the handoff. [OpenAPI](../../backend/openapi.json) and the [generated client](../../frontend/src/api/generated/schema.d.ts) define the wire shape. Auth, skill persistence, recommendation model selection and roadmap progress remain with their existing modules.

## Verification

- Backend: 33 focused Discovery, v1 compatibility and foundation contract tests passed. Cases include route precedence, stale and inactive writes, version selection, blank retake selection, and exclusion of inactive answers from model evidence. Scoped Ruff checks and OpenAPI drift passed.
- Frontend: 19 focused tests passed across Results, Profile, recommendation cards and skill comparison. The affected Results card file passed five cases again after button reflow adjustments. TypeScript and generated-client drift checks passed. The Windows drift command hit a temporary-path error; the same check passed in the frontend container.
- The [v2 publication SQL](../../supabase/content/20261109_discovery_v2.sql) ran twice in one rollback-only transaction. It showed nine v1 and thirteen v2 registry questions before rollback, and v1 only afterward. The approved local publication later committed and read back both versions.
- The [signed-in Chrome check](../../scripts/check-discovery-v2.mjs) passed on 2026-11-09 against the running app. It read v2 by default and v1 by ID, completed the six-step and uncertainty routes, rejected stale and cross-account writes, and confirmed blank retakes from Results and Profile, saved completion, and resume. The skill comparison opened the exact roadmap, preselected its career for resume review, and returned to the same comparison. Focus and topic progress stayed unchanged. Discovery fit at 320 and 1440 pixels. Two disposable accounts were removed. Recommendation requests and result cards used browser fixtures, with zero external provider calls.
- The browser check verifies the resume handoff, including career selection. Uploading a PDF and saving its suggested skills were outside this activation check. Learner comprehension and a human visual review remain pending.

## Local acceptance and release

The owner approved local activation on 2026-11-09. The additive publication committed and readback confirmed both v1 (nine registered questions) and v2 (thirteen registered questions). The normal local publisher now includes the v2 registry, so a future approved content setup publishes it too. Existing v1 content and source definitions remain available for saved sessions. Hosted publication was outside this task.

Use a disposable signed-in account at `http://127.0.0.1:5173/welcome`. Choose Guided Discovery, skip the optional opener, and choose **I’m not sure yet** to see a single general activity screen. In a second attempt choose Build and Data, select AI features and model training, and confirm the follow-up. Go Back, change a field, reload and resume. The new route should exclude abandoned answers and restore the saved selections when the same branch is selected again.

Open `/recommendations` and `/settings/profile#saved-discovery`. With a completed attempt and no draft, both should offer **Retake Discovery** and open the blank questionnaire. Leave midway and confirm both instead offer **Resume Discovery**. From Results, select **Compare my skills to this career**, then **Review skills from a resume**. Confirm the Profile career selection, review a synthetic selectable-text PDF if enabled, explicitly save an experience level, and return to the same comparison. Verify manual entry with PDF disabled. Check that browsing and review preserve focus and progress, and that the existing cards and controls reflow at desktop and narrow widths. Report the URL, action, expected result and actual result for failures. Do not include resume text or account credentials.

Final source review belongs to `@YakisobaNissin`. Learner walkthrough coordination remains unassigned.

## Results recovery and card layout, 2026-11-09

Codex implemented the owner's Results follow-up under F-001-AC-08 and F-002. [Owner decision](../decisions.md#w05-guided-discovery-revision-scope-2026-11-09) · [Recovery policy](../specs/career-recommendations.md#refresh-concurrency-and-recovery).

- Local diagnostics showed Groq HTTP 413 for a request with an estimated 11,968 input tokens. Recommendation requests for GPT-OSS now fit an estimated 7,600 combined input and output token budget, reserving up to 1,536 for completion. Candidate summaries are compacted and the existing budget path reduces optional occupational references. All 23 published careers stay eligible, with the same validation, deadlines, and quota guards. The budget is a conservative application estimate. [Groq error guidance](https://console.groq.com/docs/errors) · [Groq limits](https://console.groq.com/docs/rate-limits).
- [Results recovery](../../frontend/src/features/recommendations/use-recommendation-flow.ts) allows one automatic retry for an attempt initiated on the open page. It respects the existing one-minute run cooldown or a short Retry-After response. It stops on a change of account, run, or context. A provider 413 is terminal for that attempt. Ordinary visits only read saved state.
- [Results cards](../../frontend/src/features/recommendations/components.tsx) use the existing grid and smaller padding, with short reasons and skill chips. Previous results stay behind **View previous suggestions**. Full explanations, evidence, and caveats are available under **Suggestion details** outside the cards. **Retake Discovery** is above the cards, next to browsing. Existing drafts still offer **Resume Discovery**.
- Verification: 41 focused backend tests passed. The first synthetic check found the uncompressed candidate list still exceeded the reduced budget before contacting Groq. After candidate compaction, one live synthetic request succeeded against the 23-career catalog, saved three valid roadmap destinations, preserved the saved answers and learning state, and removed the disposable account.
- TypeScript and 15 focused frontend tests passed, including a single scheduled retry, Retry-After, stale context, hidden previous suggestions and explicit disclosure. The signed-in Chrome check passed at 320 and 1440 pixels without horizontal overflow, and confirmed Retake appears above the cards, full suggestion details stay collapsed, and both career actions still work. Browser results used a fixture and made zero external calls.

## Deterministic first results, 2026-11-09

Codex implemented the [W01-approved rules](../plans/discovery-deterministic-results.md). Completed v2 sessions now get up to three suggestions from active activities and the published catalog. A substantive follow-up takes precedence. When there is no specific published match, the service can offer broad exploration options with an uncertainty note. The [rule definition](../../backend/app/modules/recommendations/discovery_rules.py) uses all 23 reviewed activity destinations.

The [recommendation service](../../backend/app/modules/recommendations/service.py) saves the Discovery-only result atomically through the existing operations. The result records the completed Discovery revision, catalog release, rules version and cited active answers, with a null model ID. The service reuses a valid identical result. An earlier AI result for v2 stays available as a previous result where still eligible. Skills and documents are absent from the deterministic snapshot, and their changes alone do not invalidate it. The v1 and no-Discovery provider paths retain their existing behavior. The shared API shape and database schema are unchanged.

For local verification, complete v2 or open an older v2 Results page. The page prepares missing or outdated results automatically. Choose **Build games** to see Game Developer with a reason tied to that choice. The rules run on the local server without Groq or a provider quota reservation. Use the existing roadmap, skill comparison and retake controls. Optional AI follow-ups and free text have a [separate review packet](../plans/discovery-ai-refinement.md).

Verification: 67 scoped backend tests and one focused disabled-Groq test passed, including all 23 activity destinations, ordering, unavailable roles, uncertainty and active evidence. TypeScript, 15 focused frontend tests and OpenAPI drift passed. The signed-in Chrome check used actual saved deterministic results with two disposable accounts. It verified idempotency, cross-account isolation, zero provider reservations, Results reflow at 320 and 1440 pixels, the skill/resume handoff, and blank retakes. Removing a disposable skill report left the Discovery-only result current and reusable. Both disposable accounts were removed.

### Automatic Results follow-up, 2026-11-09

Codex updated the [Results handoff](../../frontend/src/components/discovery/DiscoveryWizard.tsx)
and [request controller](../../frontend/src/features/recommendations/use-recommendation-flow.ts).
Results prepares a missing or outdated completed v2 result when the learner
opens the page, with or without a completion navigation trigger. An eligible
saved result is reused. A transient failure can recover once. If the write
encounters a stale revision, it reloads the saved context and automatically
requests again with the current revision and a fresh key. No generation or
retry button is shown for v2. A terminal result still offers Browse careers
and retake. No API, database or provider changes were needed.

TypeScript and 19 focused frontend tests passed. The signed-in Chrome check
completed an uncertainty route through the API, opened Results directly and
verified that new suggestions appeared without a button press or provider
call. Both disposable accounts were removed. The separate AI refinement
contract remains in W01 review.

### Related career suggestions, 2026-11-09

Codex implemented the owner's [related-career follow-up](../plans/discovery-deterministic-results.md#related-careers-and-clarification-2026-11-09) under F-001-AC-02/05/06 and F-002. The [versioned rules](../../backend/app/modules/recommendations/discovery_rules.py) keep direct matches first, then fill open slots with up to two related published careers and an explicit explanation. Each related item cites the active answer that made it relevant. Retired or unrelated careers are skipped. Prior versions are refreshed automatically on Results.

The existing conditional questionnaire still asks one clarification when both activities in a reviewed pair are selected. Adding a related alternative does not cause an extra question. The optional AI proposal now also requires an unresolved choice that could change ordering.

Scoped Ruff checks and 45 backend tests passed. The 23 activity mappings each have one or two distinct alternatives that resolve to authored career guides. For local review, complete v2 with **Build games** as the only activity. Expect Game Developer first, followed by Frontend Developer and Mobile Developer labeled **Related option**, with no clarification screen. Selecting **Add AI features** and **Train models** across Build and Data still asks which to try first.

The signed-in Chrome check saved two direct matches and one related option, confirmed automatic Results preparation and reflow at 320 and 1440 pixels, and removed both disposable accounts. No provider calls were made.
