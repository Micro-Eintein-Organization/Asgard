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
