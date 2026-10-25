# Asgard: Development context

25 October 2026. Follow the approved [architecture](architecture.md), selected [product baseline](product.md) and [decision register](decisions.md). This document specifies preparation; it does not claim a runnable scaffold.

## Workspace

The active workspace contains documentation and static Figma references. No application package, Git repository, runtime, build, or test commands have been established. Historical frontend files in design/ui-reference are source references, not an executable application or approved API. Preserve them without treating their behavior as authority.

## Selected development baseline

- React/TypeScript/Vite, Tailwind/shadcn, React Router, TanStack Query, React Hook Form/Zod.
- FastAPI/Python/Pydantic backend; SQLAlchemy 2.x to Supabase PostgreSQL through the session pooler. Supabase Auth/Storage; versioned Supabase SQL migrations are the sole schema authority, not Alembic or create_all.
- Docker Compose for app services and Supabase CLI for its local stack; support Windows with Docker Desktop/WSL2. Do not duplicate Supabase containers in Compose.
- Node.js 24 LTS and Python 3.13 are the initial supported lines. Choose the latest compatible security patch and pin images/runtime/tools during scaffold, recording exact versions and lockfiles. This choice does not claim installed dependencies or tested compatibility. [Node release policy](https://nodejs.org/en/about/previous-releases), [Python lifecycle](https://devguide.python.org/versions/).
- Use npm/package-lock.json for frontend and pip with an exact, hashed requirements lock for backend. ESLint/TypeScript and Ruff/Pytest handle source checks; Vitest and Playwright cover frontend behavior. No packages are installed by this document review.
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
