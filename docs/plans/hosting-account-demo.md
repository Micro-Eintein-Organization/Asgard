# Hosted account demo implementation plan

## Hosted content latency correction, 2026-11-15

Owner/implementer: Codex; reviewer/operator: @YakisobaNissin. QA-09, A-09.
Owner runtime logs show concurrent roadmap reads taking 27–41 seconds, pool
timeouts and readiness failures. Existing roadmap assembly queries each topic's
details, prerequisites and resources separately. Batch those catalog reads by
roadmap in backend/app/modules/roadmaps/service.py, preserving ordering, missing
roadmap errors, response fields, retired content and existing authorization.
In frontend/src/components/catalog/RoleCatalog.tsx, defer summary requests until
the existing progress query confirms saved rows. Cards without saved progress
already render no meter; preserve that behavior and account-scoped query keys.
No schema, shared HTTP contract, pool-size or permission change. Add focused
assembly/query-count regression coverage; run relevant progress/catalog tests,
changed-file lint and whitespace. Hosted timings remain an owner verification step.

## Readiness diagnostics, 2026-11-14

Follow-up within the same approved hosting scope: the hosted diagnostic shows the
database passes but the REST OpenAPI root returns 401. Replace that privileged
schema-discovery probe with the public-key-compatible Auth settings endpoint.
Preserve the response contract, database gate and credential privileges. Verify
the probe URL/header in focused operations tests; reviewer remains @YakisobaNissin.

Owner/implementer: Codex; required reviewer/operator: @YakisobaNissin.
Within the approved hosting troubleshooting scope (QA-09/11), add sanitized
server-side readiness failure categories in backend/app/api/health.py and focused
coverage in backend/tests/test_hosted_config.py. Preserve the HTTP response,
authorization, TLS verification and readiness gates. Never log exception messages,
credentials or connection URLs. Check focused hosted/operations tests and whitespace.
Publication and hosted verification remain separate owner steps.

Created/updated: 2026-11-13. Implementer: Codex. Required technical reviewer and
operator: @YakisobaNissin. Status: owner requested implementation of the reviewed
chat plan; executed checks and hosted acceptance are recorded separately.

Requirements: REQ-01/13, QA-01/02/09/11, A-01/02/09 and AUTH-C2. Owning sources:
[architecture](../architecture.md), [security policy](../security-and-operations.md),
[deployment](../deployment.md). Current branch: codex/cabusao-ui-integration,
selected by owner. Preserve pre-existing edits; no Git publication authorized.

Scope: optional Supabase TOTP/recovery UI, assurance-aware route/session handling,
hosted account-demo configuration and operator handoff. No SQL, shared HTTP
contract, provider replacement or dependency upgrade. Reuse existing database
session/ownership guard. Modules: frontend auth/router/Settings, Render blueprint,
public environment examples and deployment guides. Enrollment defaults disabled
until hosted AUTH-C2 capability/fresh-auth evidence is reviewed by the owner.

Checks: focused frontend auth tests, TypeScript/lint/build, backend auth and hosted
configuration tests, documentation references and whitespace. No browser journeys
or broad foundation rerun. Real email, user journeys and provider dashboards belong
to the owner; hosted technical probes require provisioned access. Record unrun
checks explicitly. Technical review remains pending; plan approval is not evidence.

Owner steering: team-wide demo through a Vercel link, with real persistence and
operational account flows. A link is not an access control; document deployment
protection and separate API/Auth boundaries. Built-in email only supports eligible
organization addresses. The owner explicitly retained built-in email and signup
with their eligible address; teammate signup/custom SMTP remains deferred.
Do not grant organization permissions just to enable email.

## Render Free validation correction, 2026-11-14

Owner: Codex; reviewer/operator: @YakisobaNissin. Within the approved hosting
preparation scope, correct the provider rejection observed during Blueprint setup:
remove the unsupported Free-plan shutdown-delay override and shorten Uvicorn's
shutdown budget below Render's default 30-second window. Affected modules:
render.yaml, backend startup, its existing runtime-argument check and deployment
guides. Check the relevant startup tests and whitespace; no application build,
live deployment or database change is needed. Git publication remains an operator
step unless separately authorized.

## Performance implementation, 2026-11-15

Owner: Codex; reviewer/operator: @YakisobaNissin. Owner approved the chat plan,
including additive batch contracts. QA-09/A-09. Implement catalog-progress and
combined roadmap view using existing restricted transactions, lightweight batched
summary metadata, account-scoped cancellable frontend reads and sanitized database
metrics. Preserve existing routes and security gates. Focused unit, contract,
authorization and SQL checks; hosted load and manual journeys require owner access.
No migration, dependency, pool expansion or Git publication.

## Singapore measured follow-up, 2026-11-15

Owner: Codex; reviewer/operator: @YakisobaNissin. Approved correction plan in chat.
Hosted evidence: selection write 916 ms, catalog 52 queries/3890 ms, subsequent
account-wide refreshes cause acquisition waits up to 1610 ms. Replace catalog N+1
reads, confirm selection from its response, narrow learning mutation invalidation,
reuse roadmap view on Dashboard, remove write locks from established learning
reads while preserving first-use initialization. Recommendation GET includes
expiry cleanup and retains its existing lock until separately reviewed. No AI,
schema, contract, pool or permission changes. Only focused correctness checks;
hosted owner logs alone establish performance improvement.

## Coordinated read/cache redesign, 2026-11-15

Owner approved chat plan: Codex implements; @YakisobaNissin reviews/deploys and
provides hosted acceptance. QA-09/A-09. Add 30-second bounded published-content
cache behind live session enforcement, catalog summary and Dashboard view
contracts, explicit mutation refresh policies and selective preloading. Keep
private account state out of shared caches. Preserve existing local edits.
Minimal correctness/contract checks only; no offline performance claim.

## Learning conflict resolution, 2026-11-16

Owner requested actionable conflict warning after hosted 409s. Codex implements;
@YakisobaNissin reviews. Use existing Dashboard view to identify active topic and
existing versioned progress mutation to clear it, explicitly labeled. Never mark
Done or replay the blocked selection automatically. Improve stale-state reload,
preserve account/session guards, no API/schema change. TypeScript and focused
roadmap interaction check only; hosted performance uses owner logs.


## Approved round-trip reduction, 2026-11-16
Owner/reviewer: @YakisobaNissin; implementer: Codex. Chat approval: implement the proposed optimization plan. Requirements QA-09, A-09, REQ-02/03. Scope: repository transaction setup, query metrics, published content cache, roadmap/Dashboard reads and frontend scheduling. Preserve contracts, authorization and write guards. Focused security/cache/progress tests and TypeScript/build checks; hosted timings and 20-user acceptance remain operator checks. No commit or deployment authorized.


## Hosted feature activation, 2026-11-16
Owner/reviewer @YakisobaNissin approved hosted photos/PDF processing and Groq processing in chat. Implementer Codex. Scope FUT-10/FUT-13, REQ-12, QA-09: dependency checks, bounded parser, private storage lifecycle, recommendation batching and page scheduling. Preserve APIs, ownership, versions and filtering. Focused security/configuration/document/photo tests plus frontend checks; hosted operator acceptance remains required. No publication operation included.
