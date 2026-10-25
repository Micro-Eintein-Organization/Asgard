# Asgard: Development context

25 October 2026. Follow the approved [architecture](architecture.md), selected [product baseline](product.md) and [decision register](decisions.md). The technical scaffold and Stage C UI previews are locally implemented. Project-lead review remains pending; product services are not integrated.

## Workspace

The repository contains `frontend/`, `backend/`, app-service Compose configuration, CLI-managed Supabase configuration, and a cross-platform Node helper with PowerShell compatibility wrappers in `scripts/`. Public entry is at `/`, UI fixtures are isolated under `/preview/...`, and real service connectivity remains at `/status`. Historical frontend files in design/ui-reference remain unchanged references, not an executable application or approved API; no prototype backend/state behavior has been imported.

## Local workflow

[README](../README.md#getting-started) is the teammate onboarding entry point: prerequisite installation links, separate PowerShell/Bash first-time commands, daily startup, shutdown and troubleshooting. Run root `npm ci` to install the locked local CLI, then `node scripts/dev.mjs start`. Application dependencies are installed by Docker builds, not host npm/pip. No cloud credentials or manual local environment values are needed. The commands below were executed on Windows; their shared Node implementation and Linux-container checks do not establish native Linux-host acceptance.

Windows verification used Node 24.19.0, npm 11.17.0, Docker Engine 29.8.2 and Compose 5.5.1. The backend remains Python **3.13.17** in Docker; host Python 3.14 is not used. Image digests, root/frontend npm locks, and exact hashed backend locks are preserved. No dependency or runtime upgrade was introduced by hardening.

The helper checks Docker's Linux server, CLI version and port availability; creates a missing root `.env`; starts CLI-managed Supabase; regenerates local project ID, URL, anonymous key and CORS; performs a migration dry-run; starts app services with Compose health waits; and verifies connectivity. It does not print credentials, apply migrations to an existing database, reset data or stop other projects. It exits on the first failure. Existing custom environment entries survive regeneration; conflicting shell overrides are rejected. First startup may download images.

These commands use the same helper in PowerShell or Bash:

```text
node scripts/dev.mjs start
node scripts/dev.mjs env
node scripts/dev.mjs verify
node scripts/dev.mjs check
node scripts/dev.mjs generate-api
node --test scripts/dev-config.test.mjs
```

The `env` action requires this checkout's Supabase to be running. It recreates a missing root `.env` from its template and refreshes CLI-derived values. Recreate app containers afterward using the README sequence. Root `.env` is the only Compose environment file. Backend/frontend templates are references for optional host-run experiments, not additional onboarding prerequisites. The supported backend runs in Docker.

PowerShell wrappers remain for existing users. They delegate to Node and propagate failure; use Node directly when PowerShell script policy blocks a wrapper. The shared helper does not require executable permissions or Bash/PowerShell syntax on the other OS.

## Local network and filesystem boundaries

| Address / port | Purpose |
| --- | --- |
| `http://127.0.0.1:5173` | Asgard website |
| `http://127.0.0.1:5173/status` | Connectivity page |
| `http://127.0.0.1:8000/docs` | FastAPI documentation |
| `http://127.0.0.1:8000/health` / `/ready` | Liveness / Supabase REST readiness |
| `http://127.0.0.1:55321` | Supabase API gateway |
| `127.0.0.1:55322` | Local PostgreSQL host port |
| `http://127.0.0.1:55323` | Supabase Studio |
| `http://127.0.0.1:55324` | Local email inspection |
| `55320` | Reserved shadow database port |

Compose and CLI project IDs default to `asgard-foundation`. The helper reads `supabase/config.toml` and puts its project ID into root `.env`; Compose uses that value for its own name and external network. A second checkout with the same ID shares local resources: it is not an isolated environment. Do not rename IDs to resolve a port conflict without an owner-reviewed local configuration change. The isolated verification copy used its own ID and ports explicitly to avoid touching the normal stack.

The frontend talks to `backend:8000` over Compose's default network. Only the backend additionally joins `supabase_network_asgard-foundation`, created by the CLI. Its local Supabase URL is `http://supabase_kong_asgard-foundation:8000`; PostgreSQL is reachable as `supabase_db_asgard-foundation:5432`. This uses Docker DNS and container ports on the same local daemon on either target host, avoiding `host.docker.internal`, host gateway routes and OS-specific bridge addresses. Supabase must start before Compose; stop Compose before Supabase. CLI project/network/container naming is tied to pinned CLI 2.122.0 and must be reverified on upgrades. Remote Docker contexts, independently configured WSL daemons, rootless engines and ARM hosts are not verified targets of this evidence.

App ports bind to loopback. The pinned CLI publishes Supabase ports on host interfaces; use the local development stack on a trusted machine/network with appropriate firewall access. This is not a hosting configuration. No Supabase services are duplicated in Compose.

Bind paths are repository-relative, with no user path or drive letter. Frontend source/index and backend app/tests/scripts/schema are mounted; dependencies, build output and caches stay in the images/container workspace. Vite polls source for Windows mounts. App processes run as non-root users. On Linux, the checkout must be readable by those users; do not run npm or the helper with sudo. A checkout owned by another user or overly restrictive directory permissions may require its owner/admin to correct access. Code/file permissions are not automatically changed. Shared source/config changes outside mounts require rebuilding. Dockerfiles and scripts use consistent filename case; `.gitattributes` enforces LF for Node helpers and Dockerfiles.

## Contracts and migrations

`node scripts/dev.mjs generate-api` exports schema/types through stdout and writes them as the host user, avoiding container UID ownership problems on bind-mounted files. Review `backend/openapi.json` and `frontend/src/api/generated/schema.d.ts` together after approved contract changes. Generated client drift is checked without changing source. Only operational health/readiness contracts exist; this setup does not define Stage 3 product DTOs.

Supabase SQL migrations remain the only schema authority. There are currently no application SQL migrations, and `seed.sql` inserts no rows. The CLI initializes a fresh local stack; retained local databases are never reset by the helper. Existing-database migration changes require explicit review and application. Startup checks the pinned CLI's dry-run result and stops when migrations are pending; it does not run a migration-apply command. CLI warnings about skipping `.gitkeep` in the empty migration directory are expected.

The following read-only commands were executed:

```text
npx --no-install supabase migration list --local
npx --no-install supabase db push --local --dry-run
npx --no-install supabase db lint --local --level error
```

After owner review, migration application belongs to the CLI's explicit local push workflow. Do not use database reset, migration-history repair or seed reapplication as onboarding fixes. No database application role, grants/RLS, session-pooler or product auth workflow is established by this infrastructure check. Auth health is a reachability probe only; PostgreSQL negotiation is not authenticated SQL access from FastAPI.

For optional browser checks, the already verified host workflow remains:

```powershell
Set-Location frontend
npm ci
npx playwright install chromium
npx playwright test --reporter=line
```

In Bash, use `cd frontend` instead of `Set-Location`. Host frontend packages and browser installation are needed only for these optional Playwright checks, not for app startup or `node scripts/dev.mjs check`. A native Linux Playwright installation/system-library setup has not been exercised here.

## Stage 2 hardening evidence

25 October 2026. Task owner: Codex; required reviewer: project lead, who approved the bounded hardening plan in this chat. Scope: onboarding scripts/environment, local Docker networking, setup documentation and verification; partial A-06/A-11 and QA-11 evidence. Shared product contracts, dependencies, UI, database schema and auth behavior are unchanged. Project-lead review remains required before integration.

| Check | Result / limit |
| --- | --- |
| Original Windows checkout | Pass: helper startup/build/health and connectivity on the committed default ports |
| Isolated candidate-copy startup | Pass: separate project `asgard-onboarding-check`, ports 5183/8010/55420–55424, directory name containing spaces, no `.env`, Supabase temporary state or host frontend/backend packages; root `npm ci` only |
| Environment recreation | Pass: renamed the isolated `.env`, regenerated from its template/CLI status, recreated app services and repeated verification |
| Lifecycle and isolation | Pass: documented Compose-down / CLI-stop / CLI-start / Compose-build sequence; original and isolated PostgreSQL system identifiers were preserved; normal project stayed healthy |
| Connectivity | Pass: website HTTP, browser-to-frontend/proxy smoke, FastAPI health/docs, backend-to-Supabase REST/Auth health, backend-to-PostgreSQL wire negotiation, Studio-to-database read-only `SELECT 1` |
| Safety | Pass: an unrelated occupied port stops startup before service mutation; a pending local `SELECT 1` test migration stops at dry-run both while running and after a retained-database restart, without recording a migration or changing database identity; remote endpoints, unrelated Compose overrides, stale identity and credential overrides are rejected; no reset/delete/stop-all commands used |
| Helper configuration tests | Pass: all 4 final tests on Windows and inside Linux; environment preservation, invalid/duplicate/exported entries, port conflicts and CRLF handling |
| Container checks | Pass on the normal checkout: Ruff, 8 pytest, 4 Vitest, typecheck, ESLint, build, OpenAPI/client drift, database lint and migration dry-run |
| Browser smoke | Pass: 2 desktop Chromium checks against the isolated frontend/proxy, plus 2 passing repeats on the main stack after Docker recovery |
| Host-owned contract generation | Pass: shared helper writes schema/types without container ownership changes |
| Native Linux host / fresh OS installation / remote clean clone / hosted CI | Not run; requires a Linux teammate/runner and reviewed candidate files available in Git |

The isolated copy was made from the current tracked and non-ignored candidate files because the foundation is still uncommitted and must not be pushed automatically. It is not a clean clone of the remote branch. Only its local project ID and ports were changed for isolation; it used the same application source, Dockerfiles and dependency locks. Existing Docker image/layer caches were available. This establishes no dependence on the developer's `.env` or host app packages, but not an uncached first download or an independent teammate walkthrough.

The isolated check initially exposed a backend CORS unit test that inherited local environment while expecting port 5173. Its fixture now specifies test settings explicitly; the isolated rerun passed all 8 pytest tests, 4 Vitest tests, source/build/drift checks and database checks. The only remaining pytest warning is the previously recorded upstream Starlette/httpx deprecation. No UI or application feature behavior was changed.

Linux follow-up owner is unassigned: on a native x86-64 Linux machine, clone the reviewed files, install prerequisites using upstream OS instructions, run both documented startup paths and shutdown, verify all four connectivity directions, run `node scripts/dev.mjs check`, and confirm source/env ownership plus hot reload. The Linux-container helper tests and builds do not substitute for that gate. Rootless Docker, ARM, remote daemons and mixed Windows/WSL installations are outside tested coverage. Windows onboarding is reasonable for a teammate with prerequisites installed; complete cross-platform acceptance remains pending native Linux execution and a human walkthrough.

Final verification after Docker recovery: the final helper successfully started both normal and isolated stacks and passed all connectivity probes. Host-owned contract generation and the full container check suite passed again. Five negative guard cases rejected remote endpoints, unrelated Compose project/file overrides, stale environment identity and credential overrides; secret values were not printed. The retained-database/pending-migration repeat passed, including unchanged database identity and no applied migration (a fresh database may have no migration-history table yet).

The isolated verification stack was stopped with Compose down followed by CLI stop; its containers are gone and its database/storage volumes are retained. The normal stack remains ready on the documented default URLs, and the original database identity is unchanged. Docker's temporary outage is resolved. Final syntax, local-link/anchor and diff-whitespace checks passed. No commit, push, merge, deployment, database reset or volume deletion was performed. Available-environment hardening is ready for project-lead review; native Linux-host acceptance and an independent clean-clone walkthrough remain outstanding, with follow-up ownership unassigned.

## Historical foundation evidence

Local Stage B evidence, 25 October 2026: clean npm install; frontend build/typecheck/ESLint; 2 Vitest tests; Ruff; 8 pytest tests; Compose validation/build/startup; local Supabase startup/database lint; schema/client generation/drift checks; and 4 Chromium browser checks passed. Browser checks cover real proxy connectivity, explicit rechecks, missing-route recovery and overflow at 1440×900 and 360×800. The diagnostic page was inspected at both sizes; this is not a product-screen design-fidelity or accessibility pass. Pytest reports an upstream Starlette warning about its future httpx test-transport replacement.

The GitHub Actions workflow adds source/contract checks and container builds; hosted CI has not run. Project-lead review is pending. This is partial A-06/A-11 and QA-11 evidence, not a QA-11 release pass. Independent teammate bootstrap, application-role/pooler/RLS evidence, auth/ownership, real schema migrations, backup/restore, protected code ownership and hosted verification remain outstanding.

## Stage C UI review

The owner approved continuation and Anti Slop during implementation in this chat on 25 October 2026. The [design guide](design.md) records the implemented system and heuristic findings. Frontend feature directories isolate auth presentation, Dashboard, Discovery, catalog, recommendations, roadmaps and Profile. `/preview/components` links to the screen previews and shared state examples. Fixtures are never persisted; backend actions are disabled. This is presentation coverage for REQ-01–05, REQ-07–11/13 and partial NFR-01/02 / QA-12 evidence, not functional acceptance of those features.

The initial Stage C browser suite covered 1440×900, 768×1024, 360×800 and 320×800. This historical evidence predates the desktop-only scope resolution below. It inspects 14 screens for rendering, overflow, browser errors, unexpected feature-service requests and axe WCAG-tagged findings. Interaction checks exercise catalog context, selection rules, topic focus, menu/dialog Escape and focus return, discard protection, tabs, calendar layout navigation, filter clearing and unavailable actions. Screenshots are local ignored outputs in `frontend/test-results/`. See [UI tests](../frontend/tests/ui.spec.ts) and [navigation checks](../frontend/tests/navigation.spec.ts). Actual screen-reader use, real browser 200%/400% zoom, touch keyboards and Safari/Firefox/Edge remain not run.

shadcn source components were installed through its documented manual registry workflow after its CLI encountered npm EALLOWSCRIPTS. No npm script policy was relaxed, and the incompatible CLI was removed. Component license and provenance are preserved. New dependencies are locked; source checks and the Docker build remain the reproducibility gate. No hosting, auth, migration, API or infrastructure contract changed during UI implementation.

Initial Stage C local record, 25 October 2026 (Chromium 156.0.8078.4 / Playwright 1.64.1; project-lead review pending):

| Check | Result |
| --- | --- |
| Frontend TypeScript, ESLint and production build | Pass, including the rebuilt Linux container; feature bundles are split and no chunk-size warning remains |
| Vitest | Pass, 4 tests including Unicode name limits and connectivity states |
| Browser suite | Pass, 88 checks across four viewports; affected Profile/Account checks were repeated after final corrections |
| Automated accessibility and errors | Pass for the 14 tested screens at all four widths; no axe findings, horizontal overflow, page errors or feature API calls in that scan |
| Container checks and backend regression | Pass: Compose rebuild/health, Ruff, 8 pytest tests, OpenAPI and generated-client drift |
| Semantic contrast / documentation links | Pass: nine text/control pairings and changed-document local links |
| Hosted CI, real zoom, screen readers and other browser engines | Not run; not substituted by Chromium/axe results |

Rendered desktop/mobile captures are in ignored `.local/ui-review/`; test-run screenshots remain disposable. The [design guide](design.md) records reference comparison, controlled deviations, reuse and heuristic limits. No unresolved automated-check failures remain. Visual approval and feature/content integration are still separate gates owned by the project lead and designated feature owners; none is inferred from this record.

Tailwind source detection is explicitly limited to `frontend/src` so existing build output cannot affect the next build. Two consecutive container production builds produced identical CSS SHA-256 values.

## Desktop presentation refinement

25 October 2026 — task owner: Codex; scope and review owner: project lead, by the desktop-only and Figma refinement request in this chat. Acceptance coverage: NFR-01/02 and partial QA-12. Affected modules: shared frontend styles, entry composition, component examples, browser viewport configuration, and owning product/design/verification documentation. Dependencies and shared API/data contracts are unchanged.

The current browser configuration covers 1280×800, 1440×900 and 1920×1080 desktop/laptop layouts, plus 320×800 CSS reflow for accessibility. It no longer targets phone/tablet optimization. Existing smaller-width code and the historical evidence above remain. The reflow check does not establish actual 200%/400% browser zoom support; real zoom, screen readers and other desktop browser engines still require manual review.

Primary actions now use black pills, supporting surfaces use neutral gray, and selection/progress retain accessible green accents. Dashboard context is wider; entry cards use centered desktop composition and a full-width Continue action. Disabled service actions remain gray and explained. Figma files and historical reference code are unchanged. Visual approval remains pending.

Refinement verification: 88 Chromium checks passed at the current four viewports, followed by 8 passing repeats for the final desktop/laptop Dashboard, entry and Discovery changes. The 14-screen scans reported no axe findings, horizontal overflow, browser errors or feature-service calls. TypeScript, ESLint, 4 Vitest tests, production builds on Windows and in the Linux container, and generated API-client drift checks passed. Eight semantic contrast pairings and 84 local documentation links passed. The first sandbox browser attempt could not locate the installed Chromium; rerunning with access to the existing installation passed without a dependency change. Rendered comparisons, including the selected entry state, are preserved in ignored `.local/ui-refinement/`. Backend code is unchanged; its prior 8-test evidence above was not rerun for this presentation change. No commit, push, merge or deployment was performed.

## Selected development baseline

- React/TypeScript/Vite, Tailwind/shadcn, React Router, TanStack Query, React Hook Form/Zod.
- FastAPI/Python/Pydantic backend; SQLAlchemy 2.x to Supabase PostgreSQL through the session pooler. Supabase Auth/Storage; versioned Supabase SQL migrations are the sole schema authority, not Alembic or create_all.
- Docker Compose for app services and Supabase CLI for its local stack; support Windows with Docker Desktop/WSL2. Do not duplicate Supabase containers in Compose.
- Node.js 24 LTS and Python 3.13 are the supported lines; verified patches are recorded above. [Node release policy](https://nodejs.org/en/about/previous-releases), [Python lifecycle](https://devguide.python.org/versions/).
- Use npm/package-lock.json for frontend and pip with exact, hashed runtime/development locks for backend. ESLint/TypeScript and Ruff/Pytest handle source checks; Vitest and Playwright cover frontend behavior. TypeScript 5.9.3 satisfies the pinned API generator's TypeScript 5 peer requirement; do not force an incompatible compiler upgrade.
- Vercel Hobby serves the SPA; Render Free runs FastAPI. Groq is the analysis adapter, with candidate-model comparison before release. Hosting is an evaluated-demo baseline, not an always-on production commitment.
- Resend SMTP is the selected initial mail provider, through Supabase custom SMTP with a verified sending domain. Domain, account, quota and deliverability are provisioning gates, not assumed resources. [Resend integration](https://resend.com/docs/send-with-supabase-smtp).

## Work order and ownership

The project lead is the initial product/content approver, architecture reviewer and deployment owner; record real operator/contact access before external testing and name a backup operator. These role assignments do not invent a teammate or delivery date. Contributors use reviewed branches/PRs after Git setup; no direct agent merge to main.

1. Foundation: repository, pinned lockfiles/images, Compose/Supabase bootstrap, secrets template, least-privilege grants/RLS/pooler spike, generated OpenAPI client, CI and read-only health checks.
2. Safe account entry: implement verified email/password access, verification/recovery, receiving-service CAPTCHA/rate limits and account authorization first. Investigate Google linking in a separate AUTH-C1 spike; its blocker does not block the email/password foundation. Keep TOTP in the approved architecture, but leave enrollment disabled until AUTH-C2 proves enrollment, recovery, rotation, disablement and fresh-auth behavior.
3. Curated catalog/roadmap content and explicit focus/topic persistence with concurrency and branch rules.
4. Dashboard continuation/progress/calendar and explicit Profile/preferences saves with shared guidance.
5. Discovery controls and saved drafts, then evaluated recommendation generation and optional PDF analysis using selected quotas/privacy controls.
6. Security, browser/accessibility, backup/restore, cold-start, hosted smoke tests and the local fallback demo.

This is a dependency order, not a one-day completion estimate. Final MVP requires all scoped features; any working-demo exception must be explicit in Product scope.

Google and MFA gates apply to their integrations, not the whole application. In an interim email/password build, omit Google entry/linking controls and disable MFA enrollment rather than display actions that cannot work safely. Preserve any existing MFA enforcement; a feature flag must never bypass enrolled factors. Label the build as incomplete against final-MVP account scope until both gates pass or the owner approves a scope change.

## Scheduled and manual operations

Render Free serves bounded web requests; it is not the scheduler. Use separately triggered GitHub Actions maintenance workflows, already within the approved CI platform, for cleanup and backups. These are future repository workflows, not Codex chat automations; none is created by this document update. See the [execution matrix](security-and-operations.md#maintenance-execution-matrix) for cadence, ownership, failure handling and manual fallback.

Before real-user use, demonstrate runner/network access to Supabase, least-privilege maintenance credentials, an external encrypted-backup destination, repository minutes/storage budgets, alert delivery and a manual dispatch. Run the maintenance entry points directly from the runner rather than exposing unauthenticated cron routes or waking Render to keep it alive. Do not put plaintext backups or private files into ordinary CI logs/artifacts.

## Before each implementation

Read AGENTS.md, architecture, affected requirements/journeys/page interactions and feature spec. Inspect actual implementation added by later tasks. Name affected contracts and files, owner and acceptance IDs. Define Pydantic/OpenAPI contracts and migrations through technical review; documentation refinement is not authorization to alter deployed auth/schema/API behavior.

Provide one checked bootstrap script for local Supabase, app services, migration/seed and readiness. Record actual commands only after the files exist and are executed. Commit placeholders in .env.example; keep real credentials outside source and browser bundles. Regenerate TypeScript clients from FastAPI OpenAPI and fail CI on drift.

Use separate local/QA/production data and explicit CORS/Auth redirect allowlists. If account/project quotas do not permit isolated hosted QA, use local QA plus controlled staging; never substitute destructive testing on production. Verify Hobby plan ownership/collaboration terms before release. No automatic paid upgrades or quota circumvention.

## Security and analysis

[Security and operations](security-and-operations.md) owns controls, budgets, retention, deletion, monitoring and incident response. [F-002](specs/career-recommendations.md) owns logical recommendation/extraction policies; [F-001](specs/discovery.md) owns controls/save behavior. Encode and review their concrete API/data implementations without duplicating DTOs or adding custom MFA.

Keep independent recommendation, PDF extraction and authored next-topic guidance modules. Do not introduce a queue/Redis/multi-agent framework to fill a documentation gap. Synchronous calls must still persist operation identity, deadlines and revision guards and avoid open DB transactions during provider work.

## Completion evidence

Run [verification gates](verification.md) applicable to each change and report Pass/Fail/Not run with evidence. For documentation changes check local links/anchors, requirement/acceptance references, ownership of contracts and contradictory defaults. No build/runtime/security claim follows from editing a plan. Real provider settings, auth compatibility, reviewed curricula, model quality, restore ability and actual commands remain delivery evidence.

Historical files and cleanup manifests remain at the archive location in README. Do not rewrite the historical snapshot to make it look like current implementation.
