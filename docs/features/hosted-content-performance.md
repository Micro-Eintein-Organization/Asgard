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
