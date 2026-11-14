# Core acceptance and deployment preparation

## Account-demo follow-up, 2026-11-13

Codex prepared optional MFA source and the
[owner's hosted setup checklist](../deployment-account-demo.md) under the approved
[account-demo plan](../plans/hosting-account-demo.md). Reviewer/operator:
@YakisobaNissin. The [MFA guide](optional-two-factor-authentication.md) owns this
increment's implementation, technical results and pending manual acceptance.
The existing production runtime and database/session guard are reused. Built-in
email is an owner-selected demo exception; hosting, SMTP/operations acceptance and
AUTH-C2 are not established by source checks. Historical evidence below describes
the earlier preparation and does not certify the current hosted app.

Implementer: Codex. Created: 2026-10-29. Updated: 2026-10-29.
Status: implementation and local acceptance complete; hosted gates not run.
Required reviewer: @YakisobaNissin; human review deferred by owner.

## Approved implementation record

The owner approved the complete core-acceptance/deployment-preparation plan in
this chat on 2026-10-29. Owner: Codex for implementation. Requirements: QA-01–QA-12
as applicable, A-01/A-02/A-04/A-06/A-08/A-09/A-11; the
[architecture](../architecture.md) and [verification](../verification.md) remain
authoritative. Work stays on the owner-selected connected-prototype branch.

Scope: isolated migrations and content upgrade/preservation checks, browser
registration/verification, configuration and publication hardening, CI coverage,
hosting configuration and runbooks. Existing generated API contracts and locked
dependencies are reused. No hosted resource creation, deployment, Git publication,
live model evaluation or completed human review is included.

Affected modules: content publication/renderers, deployment configuration, runtime
startup/settings, local acceptance helpers and CI. Checks: isolated content and
Auth/account acceptance, source/unit/contract checks, production build and browser
journey with external provider calls blocked. Preserve all existing account data.

## Evidence

Executed on 2026-10-29 on this Windows/Docker host:

- The isolated runner applied all committed migrations with a new signing key,
  fresh restricted-role password and independent Supabase project/ports.
- Release-1 synthetic focus, branch, Done status and activity survived release 2
  and repeat publication exactly. The upgraded path had five milestones, 24
  authored topics and 20 applicable topics; one Done topic produced 5%.
- A conflicting content title was rejected and its transaction rolled back.
  All three career roadmap destinations returned successfully.
- Browser registration, local email-code verification, no-focus catalog routing,
  blank Discovery, saved results/provider outage, explicit focus, Profile refresh,
  keyboard dropdown, logout/login and 320px reflow passed in that isolated stack.
- The extended browser run against the normal local app additionally passed
  checkpoint refresh/resume, Data Analyst branch/topic Learning/Done readback and
  blank Settings retake/resume. Temporary accounts were removed.
- No live provider calls were made; browser generation was intercepted with an
  explicit unavailable response. These checks establish integration, not model quality.
- Backend regression: 82 passed, four opt-in cases skipped. After adding hosted
  database-readiness cases, the affected hosted-config/operations tests passed
  (24 cases). The four opt-in Auth tests retain their earlier separately recorded
  evidence; they were not silently counted as passed in this run.
- Production Docker image built and passed platform-port/liveness, uid 10001,
  absence of development helpers and graceful-shutdown checks.
- Final frontend TypeScript, ESLint, 21 unit tests, OpenAPI/client drift and hosted-mode
  production build passed using synthetic public environment values. The Auth-enabled
  build reports a main chunk above Vite's 500kB advisory threshold; hosted performance
  remains to be measured. No warning limit was suppressed.
- Backend OpenAPI drift and full Ruff checks passed. The hosted configuration
  tests verify explicit HTTPS origins, issuer consistency, restricted-role/TLS
  settings, disabled PDF processing, valid ports and database-aware readiness.
- Source CI now defines isolated migration/publication/browser and production
  runtime checks. It has not been pushed or executed on GitHub.

The first isolated harness attempt used an overlong project name that the CLI
truncated; a shorter unique name corrected that environment failure. A subsequent
content check exposed an old roadmap metadata expectation; the verifier now checks
the intended release-2 metadata and untouched release-1 records. The final isolated
run passed. Test resources were stopped with their data retained in ignored tmp
directories; no normal-stack credentials were copied or rotated.

## Architecture trace and corrections

Normal data requests enter authenticated FastAPI routes, then the session-checked
restricted-role repository and account-scoped module services. Catalog publication
uses a separate administrative transaction. SQL migrations remain schema authority;
OpenAPI and generated TypeScript remain wire authority. Groq calls remain bounded,
backend-only and outside account transactions. No new dependency, agent framework,
queue, worker platform or hosting provider was introduced.

Corrections prepared here: atomic ordered content publication with release identity
and conflict checks; shared guidance write payloads; clearly labelled backend
progress summaries and inactive-branch history; production Docker stage/startup;
explicit hosted configuration validation; database-aware hosted readiness; and
Vercel deep-link fallback. Local Docker names remain only in local tooling/defaults;
hosted mode rejects them for its service/database configuration.

## Repeating local acceptance

From the checkout root with the pinned Node/CLI, Docker and installed frontend
dependencies: `node scripts/check-core-isolated.mjs --run-local`.
This explicitly creates independent local resources, applies migrations, provisions
fresh credentials, builds the app and stops only its own project afterward. It
never resets the normal database. Default ports are 57320–57326 and 57329; use
`ASGARD_CORE_PORT_BASE` to choose another free contiguous test range.

The runner uses installed Chrome by default. CI installs the pinned Playwright
Chromium and sets `ASGARD_BROWSER_CHANNEL=chromium`. Browser dependencies come from
the checkout; isolated application dependencies are installed through Docker locks.
Failure details stay in an ignored isolated failure.log, which may contain private
setup output and must not be uploaded as an ordinary CI artifact.

## Manual review and remaining gates

At `http://127.0.0.1:5173` (or the configured frontend port), register/verify, save and refresh one Discovery answer,
finish results, browse Data Analyst and explicitly select it. Choose a tool,
mark a topic Learning then Done, refresh, and confirm Dashboard/roadmap counts.
Change the tool and inspect retained history. Save Profile/preferences, dismiss
guidance, refresh and log out/in. Retake only from Settings and confirm blank
answers with previous learning retained. Report route, expected/actual behavior
and safe request ID; never include credentials or private documents.

Human visual/content review and model-quality evaluation remain pending. Native
Linux/hosted CI execution and actual hosted TLS/pooler, SMTP, abuse controls,
backup/restore, maintenance-alerting and cold-start gates are not established by
local acceptance. Follow the [deployment runbook](../deployment.md); actual
deployment still requires its separate authorization. No Git publication occurred.
