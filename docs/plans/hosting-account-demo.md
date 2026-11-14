# Hosted account demo implementation plan

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
