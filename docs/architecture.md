# Asgard: Architecture v1.1

**Status:** Approved foundational architecture by project lead (25 October 2026); owner-delegated product/operations policy is recorded in the linked specifications; provider compatibility and implementation evidence remain required. **Scope:** MVP and extensible foundation. **Implementation status:** Design only; no runtime has been created or verified.

## 1. Architectural decision

Use a **modular monolith**: one React single-page frontend, one FastAPI backend, one PostgreSQL database hosted by Supabase, and a server-side LLM provider adapter. The backend owns application business logic and protected data access. Deploy the frontend to Vercel Hobby and the backend to Render Free for the MVP. Use Docker for reproducible local development. Keep deployment providers replaceable.

This supersedes the older `docs/development.md` proposals for Next.js and native-only development. The existing product and feature specifications continue to define **what** Asgard does; this document defines **how** it is structured. Owner-delegated product defaults now live in the feature/page specifications; this foundation does not certify catalog content, encoded prompts or runtime behavior.

## 2. Approved stack

| Layer | Choice |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling/components | Tailwind CSS, shadcn/ui |
| Routing | React Router |
| Remote server state | TanStack Query |
| Forms | React Hook Form + Zod |
| Backend | Python, FastAPI, Pydantic |
| Persistence | PostgreSQL on Supabase, SQLAlchemy 2.x |
| Schema migrations | Supabase CLI and versioned SQL migrations; **no Alembic** |
| Authentication | Supabase Auth, including optional TOTP MFA |
| Object storage | Supabase Storage, private buckets when required |
| API contract | FastAPI OpenAPI, generated TypeScript client |
| AI | Groq Free as initial provider; `openai/gpt-oss-120b` evaluation candidate; backend-only provider adapter; strict structured outputs and catalog validation |
| Local development | Docker Compose for app services; Supabase CLI for local Supabase stack |
| Testing | Pytest, Vitest, Playwright |
| CI | GitHub Actions |
| Frontend deployment | Vercel Hobby |
| Backend deployment | Render Free (MVP; replaceable) |
| Cloud data | Supabase Free (subject to quotas, inactivity, and backup limitations) |

Lock dependency versions and runtimes. Prefer stable, broadly supported releases at implementation time rather than hard-coding unverified version numbers now.

## 3. Runtime boundaries

```text
Browser
  |-- React/Vite SPA served by Vercel
  |-- Supabase Auth client: login, refresh, TOTP enrollment/challenge
  `-- HTTPS Bearer access token --> FastAPI on Render
                                     |-- verify token issuer/signature/audience/expiry
                                     |-- enforce user ownership and privileges
                                     |-- profiles, discovery, catalog, roadmaps, progress
                                     |-- recommendations -> provider adapter -> LLM API
                                     |-- SQLAlchemy -> Supabase PostgreSQL
                                     `-- approved private-file operations -> Supabase Storage
```

**Rules:** Browser never receives database passwords, Supabase service-role keys, or LLM API keys. Browser does not write protected application tables directly. Backend is stateless and does not persist user files on its local filesystem. Every user-owned resource must be scoped to the authenticated account.

## 4. Auth and authorization design

- Supabase Auth is the identity provider; browser uses its official client for session handling, Google OAuth subject to AUTH-C1 compatibility, and TOTP MFA.
- FastAPI verifies Supabase-issued JWTs using supported key discovery/signature verification, checks token claims, and authorizes each operation against the resource owner. Never trust a user ID submitted in the request body as authority.
- **Approved access model:** FastAPI uses SQLAlchemy with a least-privilege application database role for normal business queries, with explicit per-resource ownership and role checks. Supabase SQL migrations provision grants and RLS policies as defense-in-depth. SQLAlchemy connections do **not** automatically carry the end-user Supabase JWT or make RLS act as that user; RLS behavior for the chosen DB role must be tested. Avoid routine use of `postgres`, `service_role`, or other bypass-RLS credentials. Any exceptional privileged operation requires a narrowly scoped and reviewed path.
- **Hosted database connection:** Start with Supabase shared **session pooler** (port 5432) for Render IPv4 connectivity; TLS required, small bounded SQLAlchemy pool, connection pre-ping and recycle, and short transactions. Verify network, role grants, SSL, and pool behavior in an integration spike. For migrations and dumps use the Supabase CLI-supported connection/workflow rather than the runtime application role.
- **Authorization test matrix:** test anonymous, owner, other user, and admin access for every protected resource, including direct database role permissions where relevant.
- TOTP enrollment is supported, initially optional for ordinary accounts. Sensitive operations that require MFA must verify `aal2` and recent authentication as appropriate. **Recovery/lifecycle policy is selected** in [Security and operations](security-and-operations.md). Use provider-managed recovery, subject to AUTH-C1/C2 gates; upstream support does not prove hosted availability. Do not implement custom MFA or silently permit automatic linking against product policy.
- Authentication email delivery must use an appropriate external SMTP service before broader public testing; Supabase's default mail service is not a production onboarding solution.
- All secrets are stored in environment variables or host secret stores; `.env.example` contains placeholders only.

## 5. Data and migrations

- **One source of truth:** `supabase/migrations/*.sql` controls tables, constraints, indexes, database roles, RLS policies, and database functions. SQLAlchemy mappings reflect the schema; never run `create_all()` against shared environments.
- Local developer databases are independent and reproducible using the Supabase CLI, versioned migrations, and non-sensitive seed data.
- Use UUID identifiers, UTC timestamps, foreign keys, unique constraints, and transactional updates where appropriate.
- Enforce business invariants (e.g., account-wide active Learning topic) transactionally, not only through UI checks.
- Keep a separate staging and production Supabase project where the free plan permits. Never test destructive migrations against production.
- Backups must be scheduled and restore-tested before real user data matters; the free tier lacks managed backups.
- Keep uploaded PDFs and other large files out of PostgreSQL; use private object storage and an explicit retention/deletion policy for the scoped optional PDF feature.

## 6. API contract

- Version HTTP routes under `/api/v1` and define request/response models with Pydantic.
- Generate the frontend TypeScript API client from the committed or CI-exported OpenAPI schema. Do not hand-maintain duplicate DTO definitions.
- Standardize error responses, pagination, authentication failures, request IDs, and validation messages.
- Configure CORS for explicitly allowed development, staging, and production frontend origins; never combine unrestricted origins with credentials.
- Breaking API changes require coordinated approval, schema regeneration, and integration tests.

## 7. Backend modular monolith

```text
backend/app/
  main.py
  core/                 # config, security, database, errors, logging
  modules/
    profiles/
    discovery/
    careers/
    roadmaps/
    recommendations/
  integrations/
    llm/                # provider adapter and implementations
    storage/
  api/                  # route registration / shared API conventions
```

Each module owns its routes, schemas, service logic, and repository interfaces. Modules may share approved core primitives but must not bypass another module's business invariants through direct table manipulation. Keep asynchronous background infrastructure out of MVP until actual workloads require it.

## 8. AI recommendations

- **Initial provider:** Groq Free. **Initial candidate model:** `openai/gpt-oss-120b` (not yet validated as the final model); compare against `openai/gpt-oss-20b` using a representative test set. Provider/model changes are configuration plus reviewed evaluation, not frontend changes.
- Only FastAPI calls LLM providers; provider keys never enter the frontend.
- Use a thin interface for provider selection, bounded request timeouts, strict JSON-schema structured responses when supported, errors, and usage limits. Groq documents strict structured outputs for both candidate models. No streaming or tool calling is required in the MVP recommendation request.
- Implement per-user throttling, per-session idempotency, token/request budgeting, and 429 backoff honoring provider headers. Never use unlimited retries or automatically regenerate on Dashboard visits. The current account-level quota must be verified in the Groq console rather than hard-coded from a marketing table.
- Give the model only the relevant user-provided context and allowed curated catalog entries.
- Validate response structure, permitted career IDs, rationale, and limits with Pydantic before saving. Never treat LLM text as authority over the catalog or user permissions.
- Record prompt/schema version and provider metadata sufficient for debugging, while minimizing sensitive data retention.
- Persist recommendation generation records with `pending`, `completed`, and `failed` states; store result IDs, catalog version, model ID, prompt/schema version, timestamps, and bounded diagnostic metadata. Synchronous execution is acceptable for the MVP, but avoid holding an open database transaction during the provider call. Failed or timed-out generations must not overwrite the last successful result. Use idempotency/duplicate-request handling for costly operations.
- Minimize user profile content sent to Groq; do not send names, contact details, or uploaded documents unless explicitly necessary, approved, and covered by the privacy notice. Keep raw prompts/responses out of ordinary logs.
- Do not introduce a multi-agent framework, queue, Redis, or local GPU serving for the MVP. Add these behind module interfaces if requirements emerge.

## 9. Reproducible developer setup

- Docker Compose runs frontend and backend with hot reload, health checks, environment configuration, and deterministic dependencies.
- Supabase CLI starts the local Supabase stack using Docker. Provide a single documented developer bootstrap sequence or script that orchestrates both tools; avoid duplicating Supabase's containers in Compose.
- Commit `.env.example`, lockfiles, migrations, seed fixtures, Dockerfiles, and startup scripts. Never commit secrets or real user data.
- Windows + Docker Desktop/WSL2 is a supported development environment; document volume-mount and networking differences.
- CI runs frontend lint/type checks/tests, backend lint/tests, OpenAPI contract generation verification, and migration checks. Playwright covers critical sign-in, Discovery, recommendation, and roadmap flows.

## 10. Deployment and free-tier constraints

- Vercel Hobby serves the built static frontend. Configure frontend environment variables with the backend URL and public Supabase project settings only.
- Render Free runs the FastAPI container. Expect sleep/cold starts (Render documents spin-down after 15 minutes idle), limited memory/CPU, usage caps, and ephemeral storage. Add `/health` (process liveness) and `/ready` (dependency readiness), visible startup/loading behavior, bounded retries only for safe/idempotent requests, and a pre-demo warm-up checklist. Avoid periodic keep-alive traffic designed to defeat free-plan idling.
- Required cleanup/backups run through external GitHub Actions maintenance workflows, not Render process timers. Quota reservations and deletion access blocks remain in the request path. The security baseline's maintenance matrix assigns scheduled and manual work; OPS-C1 requires actual plan/quota, storage, alert and missed-run recovery evidence before real-user use. No background worker or paid Render Cron service is added by this plan.
- Use structured JSON logs, correlation/request IDs, sanitized error messages, and lightweight metrics (latency, 5xx, DB connection failures, Groq 429/timeout). Keep secrets and sensitive student answers out of logs.
- CI verifies contract generation, tests, migration reproducibility, and Docker build. Deploy staging before production when feasible; limit production deployment permissions to designated operators.
- Supabase Free can pause after inactivity and does not provide managed database backups. Use external SMTP for public signup testing and respect quota limits.
- Do not promise always-on uptime or zero cold-start latency on these free plans. Prepare a fully tested local Docker demo fallback.
- Keep configuration provider-neutral so backend deployment can migrate to a paid container host or Cloud Run without restructuring the app.

## 11. Team and AI-agent guardrails

- Every feature task names its owner, scope, relevant acceptance criteria, files/modules, API contracts, and checks.
- Use branches or isolated worktrees per contributor/agent. No agent commits directly to `main`.
- Changes to auth, migrations, shared API contracts, cross-module invariants, infrastructure, and core dependencies require architecture-owner review.
- Prefer generated API clients over manually invented frontend types. CI and PR review are merge gates.
- Agents must read `AGENTS.md`, this architecture document, relevant product spec, and actual source code. If an implementation decision conflicts with an approved document, stop and escalate.

## 12. Repository outline

```text
asgard/
  AGENTS.md
  README.md
  compose.yaml
  .env.example
  frontend/
    src/app/
    src/features/
    src/components/
    src/api/generated/
    Dockerfile
  backend/
    app/core/
    app/modules/
    app/integrations/
    tests/
    Dockerfile
  supabase/
    config.toml
    migrations/
    seed.sql
  docs/
    architecture.md
    product.md
    user-journeys.md
    pages-and-interactions.md
    decisions.md
    specs/
  .github/workflows/
```

## 13. Decision status and open work

### Approved architectural decisions (25 October 2026)

- Modular monolith: React/Vite/TypeScript frontend, FastAPI/Python backend, Supabase PostgreSQL/Auth, Docker Compose + local Supabase.
- SQLAlchemy data access, least-privilege role, explicit backend authorization, RLS defense-in-depth, and **Supabase SQL migrations as sole migration authority**.
- Supabase Auth with optional TOTP MFA; no custom password or 2FA implementation.
- Groq Free as initial LLM provider; `openai/gpt-oss-120b` is the first **candidate**, not a quality-approved final model. Strict structured output, Pydantic/catalog validation, saved results, and quota-aware execution.
- Vercel Hobby frontend, Render Free backend; stateless container, cold-start handling, local demo fallback.
- Timeouts, bounded retries, structured logs, health checks, and future extensibility via provider adapters and optional workers without deploying workers now.

### Selected policy and required evidence

| ID | Topic | Required resolution / acceptance evidence | Timing |
|---|---|---|---|
| A-01 | Database role and pooler | Test least-privilege SQL role through Supabase session pooler on Render; verify grants, RLS behavior, TLS, connection limits, and SQLAlchemy reconnect behavior | Foundation spike, before feature writes |
| A-02 | SMTP | Resend via Supabase custom SMTP selected; provision verified domain/account and test delivery, redirects and limits | Before external testers |
| A-03 | MFA recovery and linking | Security policy selected; prove provider-managed recovery/fresh-auth and resolve automatic-linking conflict under AUTH-C1/C2 | Before Google/MFA rollout |
| A-04 | AI model evaluation | F-002 and verification.md select 30 synthetic profiles, three runs/model and quality thresholds; execute comparison | Before releasing recommendations |
| A-05 | AI behavior/product contract | F-001/F-002 select controls, count, interpretation and refresh; encode/review Pydantic/OpenAPI and persistence | Before feature implementation |
| A-06 | Runtime and tooling | development.md selects Node 24/Python 3.13 and tools; pin patches/locks/images and execute bootstrap/CI | During scaffold |
| A-07 | Operations ownership | Project lead owns initial review/deploy/content; record real contact and backup operator, access and branch protections | Before external use/team work |
| A-08 | Data protection | Security baseline selects retention/deletion, daily backup/7-day expiry and RPO/RTO; configure and restore-test including Storage | Before real user data |
| A-09 | Reliability targets | Verification selects warm/cold budgets, no free-tier uptime promise and local fallback; execute hosted smoke tests | Before hosted demo |
| A-10 | Catalog and roadmap model | Product selects membership/revision policy; author seven reviewed curricula and encode/test technical relationships | Before roadmap publication/persistence |
| A-11 | Backend integration contract | F-002 now names FastAPI/Python; define/review generated OpenAPI client and verify drift | Before parallel implementation |

Product choices delegated on 25 October 2026 are recorded in their owning specs and decision register. Provider incompatibilities, technical contract review and unrun evidence are not resolved by choosing defaults. Screenshots are not implementation authority.

## 13a. Owner-delegated planning addendum

The foundation stack above is unchanged. [Development](development.md), [Security and operations](security-and-operations.md) and [Verification](verification.md) resolve the former planning caveats. Shared persisted quota reservations and deletion-access checks are required behavior; SQL/API implementation still requires technical review. Verify limits on every public origin, not only Vercel; do not add an unauthenticated FastAPI password-reset proxy by default.

The explicit-linking product rule conflicts with documented Supabase automatic linking. Preserve that rule and stop the affected Google integration until AUTH-C1 is resolved by evidence or an explicit owner exception. AUTH-C2 similarly gates hosted recovery availability. This addendum does not authorize a provider replacement or custom MFA.

Start the foundation with verified email/password access. Google investigation and MFA verification are independent integration tasks; keep new MFA enrollment disabled until its full lifecycle passes, without weakening enforcement for already-enrolled accounts. Interim builds must state that final-MVP account acceptance is incomplete.

## 14. Foundation verification gates

1. **Local bootstrap:** a new Windows developer can clone, configure placeholder secrets, start local Supabase and Compose, run migrations, and access the app through one documented workflow.
2. **Auth + ownership:** frontend logs in through Supabase; FastAPI verifies JWT; protected endpoint denies cross-account reads/writes; optional TOTP flow is separately verified before enablement.
3. **Database:** least-privilege role works with session pooler on Render; schema can be rebuilt from committed migrations; rollback/restore procedure is documented.
4. **Contract:** OpenAPI schema generates TypeScript client and CI fails when client/contracts drift.
5. **LLM:** a mock adapter works in CI; live Groq integration yields validated catalog-only recommendations, handles quota errors and timeouts, and preserves previous successful results.
6. **Hosting:** Vercel frontend calls Render backend; CORS, HTTPS, environment secrets, cold starts, health checks and local demo fallback are exercised.
7. **Team:** code owners and protected PR workflow exist before independent coding agents implement features.

## 15. References and compatibility notes

- [Supabase Postgres connection methods](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Supabase SQLAlchemy notes](https://supabase.com/kb/troubleshooting/using-sqlalchemy-with-supabase-FUqebT)
- [Groq strict structured outputs](https://console.groq.com/docs/structured-outputs)
- [Groq rate limits](https://console.groq.com/docs/rate-limits)
- [Render Free limits](https://render.com/docs/free)

**Change policy:** Record replacements of approved foundation choices in an ADR and update this file, `docs/development.md`, and `AGENTS.md`. No coding agent may silently reinterpret approved stack decisions.

