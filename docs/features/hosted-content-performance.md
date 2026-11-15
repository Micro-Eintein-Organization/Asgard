# Hosted content performance

Implementer: Codex. Created/updated: 2026-11-15. Requirements: QA-09, A-09,
REQ-02/03. Status: implemented; architecture review by @YakisobaNissin and
hosted/security acceptance pending. Owner approved the performance plan in chat.
See [architecture](../architecture.md), [verification](../verification.md) and
[implementation plan](../plans/hosting-account-demo.md).

## Implemented behavior

The catalog requests one account-scoped progress batch for displayed roadmap IDs,
not progress and summary separately for every card. The additive GET
`/api/v1/me/roadmaps/catalog-progress` accepts 1–100 repeated roadmap_ids UUIDs,
deduplicates them, rejects unavailable IDs and returns typed badge data.
Seven collection queries load lightweight summary inputs regardless of card count.
Unstarted cards continue to withhold their percentage.

GET `/api/v1/me/roadmaps/{roadmap_id}/view` returns existing roadmap, progress,
summary, branches and learning_state objects in one session-checked transaction.
The page uses this query; summary calculation reuses its content/state. Standalone
summaries use lightweight metadata without resources. Existing endpoints remain.
Existing read-committed transaction semantics remain; this is not a new snapshot
isolation guarantee. No schema, grant, pool size, provider or AI generation change.

Core read signals have a 90-second timeout; the new reads, catalog and Discovery
forward cancellation. Legacy core methods that ignore their signal are not covered
by that bound. Discovery waits for state before selecting a questionnaire version.
Loading panels show an extended-delay message after five seconds. Existing error
panels provide explicit retry; mutations are not automatically replayed.
Account-scoped invalidation refreshes the new queries after mutations.

Backend sources: api/foundation.py, modules/progress/{schemas,service}.py,
modules/profiles/repository.py, core/database_metrics.py and main.py. SQLAlchemy
metrics log query count, execution duration and acquisition duration, never SQL
text, parameters or credentials. Acquisition includes connection validation/setup;
query count covers successful cursor operations, not a server query profiler.
Frontend sources: catalog/RoleCatalog, roadmaps/page, core/data, DiscoveryWizard,
shared loading panels. Generated OpenAPI/TypeScript remain wire-contract authority.

## Verification

- 59 focused backend checks passed: batching, summary semantics, token validation,
  anonymous rejection, input limits, recommendation repair/evidence and operations.
- 10 frontend catalog/roadmap/suggestion-cache checks passed.
- TypeScript, production build and API synchronization passed. Existing ~577 kB
  main-bundle advisory remains. Final changed frontend implementation ESLint and
  backend F/I lint passed; full backend lint retains unrelated pre-existing debt.
- A read-only probe against the existing local migrated database successfully ran
  batch SQL for 26 roadmap IDs; no account or data changes were made.
- Initial security-test run inherited local photo enablement; isolating the flag
  resolved the unrelated fixture assertion. Import sorting issues corrected.
- Not run: isolated live two-account/revoked-session/MFA database integration,
  synthetic 20-user load benchmark, hosted timings, inbox/browser journeys or
  live AI calls. No isolated authenticated load fixture was provisioned for this
  run. Unit token/account-filter checks do not substitute for those release gates.

## Owner rollout and manual acceptance

Review and publish backend first, then frontend. Keep the prior deployment for
rollback. No database migration or secret changes are required. Do not call the
performance target met until hosted evidence exists.

At https://asgard-navy.vercel.app, sign in, browse careers, open a roadmap, return
and open another. Change progress and a branch choice, refresh, and confirm saved
values, badge percentages and next-topic suggestions. Sign out/in and verify that
account data is isolated. Check Discovery restore and questionnaire version.
Report URL, expected/actual behavior, request ID and safe timing fields only.
In Render Logs compare warm route timings, query counts and acquisition durations.
Record cold startup separately. Acceptance target remains warm API p95 <=2 seconds
under 20 active users; single-user success does not establish that target.

No guarantee of live AI correctness follows from mocked recommendation tests.
AI remains disabled for this hosted demo. Provider quotas, cross-region latency,
connection waits and further feature-specific slow queries remain possible.


## Singapore follow-up, 2026-11-15

Implementer: Codex; required reviewer/operator: @YakisobaNissin. Status: local
implementation, checks and hosted acceptance pending. Owner logs from Singapore
show /careers at 52 queries/3890 ms, PATCH /me/learning at 916 ms, and unrelated
post-save reads producing acquisition waits up to 1610 ms. Evidence is hosted
request telemetry, not offline benchmark results.

The local follow-up batches career page records and published-roadmap IDs instead
of two extra reads per career. Confirmed roadmap selection updates cached learning
state from the mutation response after canceling superseded reads; it does not
wait for unrelated refetches. Dashboard/recommendations are marked stale for the
next consumer. Topic/branch edits invalidate only dependent query families.
Dashboard reuses the existing combined view cache. Existing learning-state reads
no longer take a write lock; first-use initialization and mutation locks remain.
Recommendation reads retain their lock because they include expiry cleanup; do
not remove it without reviewing that write behavior. AI generation is unchanged.

Focused correctness checks attempted on this follow-up did not run because Docker
Desktop's daemon was unavailable. No performance improvement is claimed. The
previous passing checks above describe earlier source, not this follow-up.
Dashboard activity-calendar decoupling and further query reduction remain pending.
No new server cache or speculative preloading has been introduced.

Owner acceptance: once correctness checks and review are complete, deploy backend
then frontend to Singapore and repeat catalog load, set-current, Dashboard and
progress-save actions. Compare route durations, query count and post-save request
fan-out with the supplied baseline. Save confirmation must follow the successful
PATCH response rather than unrelated refresh completion. Verify failure/409 and
account-switch paths preserve the last confirmed state. Hosted results remain
pending and cannot be substituted by offline tests.


## Coordinated delivery redesign, 2026-11-16

Implementer: Codex. Reviewer/operator: @YakisobaNissin. Owner approved the chat
plan. Status: implemented locally; hosted acceptance and live security checks pending.

Published content uses an engine-scoped 30-second absolute-TTL LRU, limited to
32 MiB serialized data. Concurrent misses coalesce; failures/expired entries are
not served as fresh. Copies prevent mutation of shared entries. Live authorization
precedes cache use; only GET transactions enable it. Mutations still validate
live data. Private account state is never stored in this shared cache. Revision
fields remain in cached payloads; TTL, not a publication webhook, bounds refresh.

The new catalog summary returns categories, counts and release identity without
loading every career. Career pages batch membership reads. Dashboard view returns
existing state/current view/career/active roadmap and reuses its summary. Calendar
loading and errors are independent. Existing routes remain. No schema migration,
new dependency, AI-generation, privilege or pool-size change.

Explicit learning-change policies replace save-function identity checks. Confirmed
selection updates learning/view caches after canceling superseded reads, without
waiting for background refresh. Topic/branch responses patch confirmed rows and
refresh dependent totals with explicit updating feedback. Totals remain computed
by the backend rather than a second client algorithm. Unrelated catalog/profile/
Discovery reads are not invalidated by these mutations. Recommendation context
invalidation remains. Failure preserves confirmed state; writes are not replayed.

Visible published-content queries refresh every 30 seconds. Focus/hover intent
preloads at most one roadmap after 200 ms; Save-Data suppresses preloads and
obsolete intent cancels them. There is no all-roadmap preload or persistent cache.
Sources: core/content_cache.py, modules/careers/service.py, api/foundation.py,
modules/progress/service.py, core/data.ts, RoleCatalog and DashboardScreen.

Minimal checks: 10 backend cache/contract/progress cases and 9 frontend catalog/
Dashboard/suggestion-state cases passed. TypeScript, production build, API sync,
changed frontend implementation lint and backend F/I checks passed. Build initially
found non-UTF-8 inserted punctuation in two screens; corrected before retry.
The existing main-bundle advisory remains. These results establish correctness
only, not hosted performance. No offline load benchmark or browser automation.

Not run: hosted cache publication freshness, cache-hit revoked-session/MFA matrix,
20-user capacity, hosted save timing or live AI calls. Owner publishes reviewed
backend first, frontend second to Singapore; no secrets/migrations change. Repeat
catalog, roadmap, selection, progress and Dashboard actions ten times warm. Compare
hosted query counts, request durations and connection waits with the supplied
baseline. Verify saves after refresh and account switch. The p95 <=2-second target
is pending, and no hosted improvement is claimed before those results arrive.


## Actionable Learning conflict, 2026-11-16

Implementer: Codex; reviewer @YakisobaNissin; owner requested in chat. Local UI
implementation: a learning_resolution_required response explains the one-Learning-
topic restriction, loads the active topic using the authenticated Dashboard view,
and offers Clear active lesson. This calls the existing versioned progress write
with not_started, never marks Done and never automatically retries the blocked
roadmap selection. Failed clear reloads active state and displays its error.
Other 409s retain server messages and Reload saved state. No API/schema change.
Source: frontend/src/features/roadmaps/page.tsx. Owner manual acceptance pending:
start a lesson on roadmap A, attempt roadmap B, use Clear active lesson, then
explicitly select B. Confirm A retains other progress and is no longer Learning;
refresh to verify. Stale-version failures must require reload rather than blind
write replay. See handoff for minimal TypeScript/lint/interaction results.

Owner's new hosted logs show catalog 7 queries/859 ms, warm roadmap view 782 ms
and Dashboard view 1481-2289 ms. This is improvement evidence for that sample,
not p95 or 20-user acceptance. Repeated writes returned 409; request logs alone
cannot distinguish learning-resolution guards from version conflicts. Further
Dashboard query reduction and hosted tail-latency acceptance remain pending.


## Round-trip reduction, 2026-11-16

Implementer: Codex. Reviewer/operator: @YakisobaNissin. Requirements QA-09,
A-09, REQ-02/03. Owner approved implementation in chat. Status: implementation
and focused local checks complete; review and hosted acceptance pending.

Authorization now checks the restricted role, live session/MFA and conditional
transaction-local user context in one guarded statement on every transaction.
Pre-ping, pool size three, verify-full TLS and no write replay remain. Unsafe
roles fail with the existing 503 and denied sessions with the existing 401.
Published roadmap and catalog page/summary bundles use individual SQL statements,
so each bundle has one statement snapshot. Internal editorial metadata is filtered
from API responses. No schema or wire contract changes.

Roadmap views batch progress and branch choices. Dashboard reuses learning state,
batches preferences/guidance/active/recent/recommendation context and derives its
core milestone from the loaded roadmap. Recommendations avoid an unconditional
account lock; expired pending runs still take the lock and transition to failed.
Further recommendation query consolidation and the five-feature-query target
remain pending hosted statement evidence; no new indexes or write-guard rewrites.

Shared content entries now contain typed serialized JSON bytes. The 32 MiB bound
covers payload bytes, not total process memory. UUID/date/datetime values survive
cache hits. TTL remains 30 seconds; failures are not cached. Followers recover
from leader cancellation using their own request connection, with bounded retries.
Private data and AI results are never stored in this cache.

Frontend removes blanket polling. Pure content has 30-second staleTime; combined
private views revalidate on revisit/focus/reconnect. Progress saves patch confirmed
rows, mark dependents stale and refetch the displayed roadmap only. Speculative
preload is suppressed during foreground requests/mutations, hidden tabs and
Save-Data. Existing single-target delay/cancellation and account scoping remain.

Safe statement logs contain a hash, phase, occurrence, elapsed time and failure
flag; no SQL text or parameters. Connection establishment is logged separately
when a new connection opens. Acquisition still includes checkout/pre-ping and
cannot be described as pure pool wait. SQL timings include network/driver time.
Use the existing backend container to run `python scripts/measure_database.py`
for ten SELECT 1 samples (acquisition, SELECT, and total including cleanup).
This command was syntax/lint checked; hosted execution is pending.

Verification: 45 focused backend checks passed, including four new guarded-role/
session and typed-cache/cancelled-leader checks; TypeScript, changed frontend lint
and production build passed. Six existing frontend catalog/Dashboard/suggestion-cache
tests passed. Existing auth fixture initially inherited local
photo enablement; rerun with ASGARD_PROFILE_PHOTOS_ENABLED=false passed. Local
read-only SQL exercised all 26 roadmap bundles, catalog summary and a 20-item
catalog page. EXPLAIN without ANALYZE planned Dashboard/private-state aggregates;
it did not execute their writes or establish actual query-plan performance.

Pending: real pooled revoked-session/MFA/account-isolation integration, concurrent
expiry/save acceptance, publication freshness, save-to-screen timing and 20-user
hosted p95. These are release gates, not established by mocked/local checks.
AI provider code/prompts are unchanged; live AI acceptance remains pending.

Rollout: review backend first, then frontend. Keep existing deployments available.
At https://asgard-navy.vercel.app, browse catalog, open two roadmaps, select current,
change topic state, return to Dashboard and refresh. Verify confirmed state,
percentages and next topic. Resolve Learning conflicts explicitly. Switch accounts
and confirm isolation. Report safe request IDs, expected/actual outcome and timings.
Compare ten warm journeys against previous Render logs; record cold start separately.
Run the approved 20-user hosted scenario before claiming p95 <=2 seconds. Keep
Supabase migration separate. Revert the reviewed change to roll back; no database
migration is needed.

Operator SQL evidence: in Supabase SQL Editor, inspect pg_stat_statements columns
queryid/calls/total_exec_time/mean_exec_time/rows ordered by total_exec_time and
mean_exec_time (LIMIT 20), using the installed extension schema. Keep raw query
text private. Match EXPLAIN (ANALYZE, BUFFERS) to identified slow SELECTs only;
do not execute ANALYZE on mutations without a reviewed rollback procedure.


## Authorization parameter correction, 2026-11-16

Implementer: Codex; reviewer/operator @YakisobaNissin; requirements QA-09/A-09.
Owner supplied hosted failures after commit 5a16630: all database routes failed
on the first authorization statement. Reproduced locally with the actual driver:
PostgreSQL inferred the reused uid parameter as UUID and rejected
set_config(unknown, uuid, boolean). Added CAST(:uid AS text) specifically at
set_config; live role/session checks and transaction context scope remain.
The real restricted-role query now returns the intended 401 for unknown sessions.
Four focused guard/cache checks passed. Added an opt-in real-database regression
that exercises initial and reused connections with invalid sessions. Previous
mock tests did not establish SQL parameter compatibility. Hosted valid-session
acceptance is pending deployment of this backend-only correction; frontend does
not need rebuilding. No migration, credential change or feature disablement needed.
