# Deployment preparation and release gates

For the combined 2026-11-20 features, use the
[Discovery v3 and contextual counselor activation checklist](deployment-discovery-and-counselor.md)
for exact artifacts, dependency checks, operator ownership and outstanding acceptance.

Documentation baseline: 2026-11-17. This is the operational runbook, not proof of deployment acceptance. Optional hosted photos/PDF/Groq support is implemented; see [hosted activation](features/hosted-feature-activation.md). Account deletion has separate [maintenance and activation gates](features/account-deletion.md). Earlier preparation evidence retains its dated scope.

2026-11-13 account-demo update: use the
[owner setup checklist](deployment-account-demo.md) for the zero-cost, protected
Vercel preview demo. The owner selected built-in email to their eligible organization
address; this is a bounded nonproduction exception, not external SMTP acceptance.
Optional MFA source and its disabled-by-default AUTH-C2 gate are recorded in the
[implementation guide](features/optional-two-factor-authentication.md). Provider
setup, hosted checks and owner manual acceptance remain pending.

Updated 2026-10-29. Implementer: Codex. Operator/reviewer: @YakisobaNissin
(human review deferred, not recorded as completed).

This is the preparation runbook for the approved
[architecture](architecture.md). No hosted project, domain, SMTP account,
deployment or secret has been provisioned by these changes. Local evidence lives
in [deployment preparation](features/deployment-preparation.md).

## Environment ownership

Use separate local and hosted QA resources before production. Do not copy local
signing keys, database passwords or the local Storage service credential to hosting.
The owner must supply the actual project identities, domains, credentials and a
backup operator/contact. Do not enable automatic deployments until the review and
release gates are satisfied.

### Vercel frontend

Set the Vercel project root to `frontend`; its committed `vercel.json` uses Vite,
`npm run build`, output `dist`, and the SPA deep-link fallback. Existing static
assets must remain fetchable; verify a direct roadmap URL and refresh after hosting.
Set these **public build variables** and rebuild when they change:

| Variable | Required value |
| --- | --- |
| VITE_DEPLOYMENT_ENVIRONMENT | staging, then production for the production project |
| VITE_API_BASE_URL | Exact HTTPS Render/custom API origin; no /api suffix |
| VITE_AUTH_ENABLED | true |
| VITE_SUPABASE_URL | Exact HTTPS hosted Supabase project origin |
| VITE_SUPABASE_ANON_KEY | That project's browser-safe anonymous/publishable key |

Never use a service-role key, database credential or Groq key in VITE variables.
Hosted builds reject missing API configuration instead of relying on the local
Vite proxy. `frontend/.env.production.example` describes the expected names.

### Render backend

The root `render.yaml` prepares a Docker web service with automatic deployment
off, runtime `python -m app.start` and readiness check `/ready`. The Dockerfile
ends in the non-root production stage; Compose explicitly uses development.
The runtime binds 0.0.0.0 to the platform PORT (8000 locally), uses exec for
signal delivery and allows 20 seconds for graceful shutdown, leaving headroom
within Render's default 30-second shutdown window. The Free Blueprint omits
`maxShutdownDelaySeconds`: Render rejects this override on Free services. Verify
actual shutdown and cold-start behavior on the host.

| Variable | Configuration and ownership |
| --- | --- |
| ASGARD_DEPLOYMENT_ENVIRONMENT | staging or production; activates startup validation |
| ASGARD_CORS_ORIGINS | JSON array containing only the exact HTTPS frontend origin(s), no trailing slash, wildcard or preview-domain glob |
| ASGARD_SUPABASE_URL | Hosted project HTTPS origin |
| ASGARD_SUPABASE_ANON_KEY | Same project's public key, backend configuration |
| ASGARD_AUTH_ENABLED | true |
| ASGARD_AUTH_ISSUER | Supabase origin followed by /auth/v1; verify actual issuer |
| ASGARD_DATABASE_URL | Secret SQLAlchemy psycopg URL for asgard_app, session pooler and verified TLS |
| ASGARD_GROQ_ENABLED | false until provider/quality gates permit recommendations |
| ASGARD_GROQ_API_KEY | Backend secret only; supply privately when enabled |
| ASGARD_GROQ_MODEL / MAX_COMPLETION_TOKENS | Existing bounded candidate configuration; token setting uses ASGARD_GROQ_MAX_COMPLETION_TOKENS |
| ASGARD_DOCUMENTS_PROCESSING_ENABLED | false by default; enable only with the dependencies and approval in the hosted activation guide |
| ASGARD_DOCUMENTS_REAL_DATA_APPROVED | false |
| ASGARD_DOCUMENTS_ENABLED / STORAGE_SERVICE_KEY | Configure only if this environment needs removal/cleanup of existing private files; server-side secrets |

Database URL shape:
`postgresql+psycopg://asgard_app.PROJECT:ENCODED_PASSWORD@SESSION_POOLER:5432/postgres?sslmode=verify-full&sslrootcert=/etc/secrets/supabase-root.crt`.
Use the actual provider-supported custom-role username; direct connections may
use asgard_app without the project suffix. Privately install the project's trusted
CA using the host secret-file mechanism. Never disable certificate verification.
The pool is bounded to three connections, no overflow, pre-ping/recycle and bounded
connect/statement/lock waits. Confirm actual role, pooler compatibility, TLS
hostname/chain, reconnection and concurrency on the hosted project.

Supabase Auth must publish compatible ES256/P-256 signing keys. Keep the hosted
issuer and JWKS project consistent. Set the Auth site URL to the exact frontend
origin and explicit redirect allowlists for implemented callbacks; remove local
and wildcard production entries. Configure the selected external SMTP provider
with a verified sending domain and verify delivery, expiry/resend and abuse controls.
Local Mailpit success does not verify SMTP.

## Administrative migrations and content

### Content publication inventory

Migrations create storage structures; they do not populate all application data.
Audit each enabled content layer separately after a hosted setup:

| Layer | Publication authority/tooling |
| --- | --- |
| Careers, roadmaps, resources, Discovery | `scripts/render-publication.mjs`, releases 1–6 |
| Learning-path skills | Existing skill definitions and `scripts/render-skill-publication.mjs` |
| PH benchmark technologies/postings | `backend/scripts/render_technology_benchmark.py`; configure the selected source/version in Render |
| ESCO/occupational evidence | Preserved reference assets and `backend/scripts/render_reference_restore.py`, after explicit hosted-content review |

Do not treat the first publisher as a complete optional-feature seed. Existing
content should be checked before rerunning any import. The
[2026-11-19 hosted audit and repair guide](features/supabase-hosted-audit.md)
records live evidence, exact missing layers and safe repair order. Never use a
whole local Supabase config push to repair a single hosted Auth setting.

Use a separately authorized administrator through the supported Supabase CLI
workflow. The app must continue to use asgard_app. Inspect an existing role before
running the initial role migration; it deliberately refuses an unexplained conflict.
Use the reviewed migration files, not ad hoc schema generation.

With an operator-linked nonproduction project, inspect the pending changes using
`supabase db push --linked --dry-run`; review before separately running the
non-dry command. Use the repository-pinned CLI, an approved operator identity and
private credential delivery. Never use db reset against hosted/shared data.

`node scripts/render-publication.mjs` emits one transaction containing ordered
content releases, an advisory lock, expected release identities and conflict checks.
It requires no Docker hostname. Capture it to a reviewed SQL file, verify generation
exit status, then apply with an operator-owned PostgreSQL client:
`psql "service=asgard_admin" -v ON_ERROR_STOP=1 -f release.sql`.
The service profile/credential and verified TLS configuration belong outside the
repository. This command requires psql on the administrative workstation; it is
not an application-runtime dependency. Repeat publication must pass; unknown or
conflicting releases fail atomically. Never grant catalog writes to asgard_app.

## Release and rollback

1. Finish isolated local migrations/publication, account isolation and browser checks.
2. Pass hosted database, SMTP/Auth, provider/privacy and operations gates below.
3. Obtain the deferred human review and any separately required Git/deploy approval.
4. Apply additive migrations, publish reviewed content, then release the compatible
   backend and frontend with their environment-specific configuration.
5. Check /health, /ready, registration/verification, saved-state journey, direct URLs,
   cold start, failure recovery and sanitized logs. Record environment/version/date.

Rollback app images/builds to the last compatible version without reversing schema
or deleting user data. Retire incorrect learning content through a corrective
reviewed release; preserve topic IDs, progress and branch history. Do not lower
release numbers, replace published IDs or automatically clear focus. Before a
database restore, isolate the environment and follow the verified restore/deletion
ledger procedure; restore is an operator action, not an automatic deploy fallback.

## External-use gates (not yet passed)

| Gate | Required evidence |
| --- | --- |
| Hosted DB / A-01 | Restricted role, TLS/session pooler, RLS, invalid sessions, cross-account denial, reconnect and connection limits |
| SMTP / A-02 | Actual domain/account, successful signup mail and verification, redirect allowlists, receiving-service rate/CAPTCHA protections |
| AI / A-04 | Existing documented model comparison and human-rated evidence quality, actual quota/settings; no new live calls authorized here |
| Recovery / A-08 | External encrypted backup destination, daily retention/deletion policy, isolated restore of DB and required Storage, deletion-ledger reconciliation |
| Maintenance / OPS-C1 | External runner with least-privilege access, missed-run alert, manual catch-up and purge retries while Render is stopped |
| Runtime / A-09 | Hosted health/readiness, warm/cold timings, shutdown, direct URLs, persistence and local fallback |
| Ownership / A-07 | Real operator/contact, backup owner, permissions, protected review and CI evidence |

Prepare external backup/cleanup scheduling only after credentials, destination,
retention and alert routing are configured and a manual run/restore is demonstrated.
No ordinary CI artifact or log may contain plaintext backups or private documents.
The source CI job provides local reproducibility evidence, not these operations
gates. Google linking/MFA enrollment remain disabled pending AUTH-C1/C2; preserve
enforcement for any already-enrolled account.

## Provider documentation

Configuration references checked during preparation:
[Vercel Vite/SPAs](https://vercel.com/docs/frameworks/frontend/vite),
[Render port binding](https://render.com/docs/web-services#port-binding) and
[Render health checks](https://render.com/docs/health-checks).
Verify current account-specific capability and plan terms before releasing.


## Content performance rollout, 2026-11-15

Owner-approved additive read contracts and frontend batching are documented in
[hosted content performance](features/hosted-content-performance.md). Review and
deploy backend before frontend; retain the previous deployment for rollback.
Schema and secrets are unchanged. Hosted warm/cold timings and isolated live
security/load acceptance remain pending; local tests are not deployment acceptance.

2026-11-16: coordinated content cache/page reads implemented locally; backend-first rollout and hosted performance/security acceptance remain pending. See [performance evidence](features/hosted-content-performance.md).
