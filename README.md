# Asgard

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="frontend/src/assets/Logo_Snowflake%2BASGARD_darkmode.png">
  <source media="(prefers-color-scheme: light)" srcset="frontend/src/assets/Logo_Snowflake%2BASGARD_lightmode.png">
  <img src="frontend/src/assets/Logo_Snowflake%2BASGARD_lightmode.png" alt="Asgard logo" width="325">
</picture>

Asgard is a career exploration and learning platform for people pursuing technology careers. It brings together guided Discovery, career comparisons, curated roadmaps, and learning progress to help learners choose a direction and follow their next step.

## Features

- Explore technology careers by category, search the catalog, and compare roles, skills, and example work.
- Complete guided Discovery, save career suggestions, and revisit the evidence behind each recommendation.
- Follow career roadmaps with milestones, topics, tool paths, and curated learning resources.
- Choose a current roadmap and track topics as Not started, Learning, Done, or Skipped.
- Return to learning through a Dashboard with progress, activity, and streaks.
- Ask the AI Counselor for contextual guidance linked to careers and authored learning content.
- Manage profile details, career preferences, skills, and account security.

Career suggestions support exploration; they do not assess competence or guarantee career suitability or job readiness. Progress records reflect the learner's reported activity. AI, document processing, profile photos, and optional authentication capabilities depend on the environment's enabled integrations.

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Interface | Tailwind CSS, shadcn/ui, Radix UI |
| Routing and server state | React Router, TanStack Query |
| Forms and validation | React Hook Form, Zod |
| Backend | Python, FastAPI, Pydantic |
| Database | Supabase PostgreSQL, SQLAlchemy |
| Authentication and storage | Supabase Auth, Supabase Storage |
| AI provider | Groq through a backend provider adapter |
| Local development | Docker Compose, Supabase CLI |
| Testing and CI | Pytest, Vitest, Playwright, GitHub Actions |

Runtime versions and dependencies are pinned in the repository's version files, manifests, lockfiles, and Dockerfiles.

## Architecture

Asgard uses a modular monolith: a React single-page application, a FastAPI backend, and one PostgreSQL database. The browser uses Supabase Auth for identity and calls FastAPI for application data. The backend owns business logic, account authorization, database access, and AI-provider requests.

Versioned SQL migrations define the database schema. FastAPI OpenAPI and the generated TypeScript client define the API contract. Database credentials, provider keys, and other private configuration remain server-side.

See the [architecture](docs/architecture.md) for service boundaries and engineering decisions.

## Repository structure

```text
Asgard/
├── frontend/              React application and frontend tests
├── backend/               FastAPI application, API schema, and backend tests
├── supabase/              Database migrations and Supabase configuration
├── scripts/               Development, content publication, and verification tools
├── docs/                  Specifications, implementation guides, and runbooks
├── licenses/              Third-party data attribution and reuse notices
├── .github/               CI workflows and code ownership
├── compose.yaml           Local application services
└── render.yaml            Backend hosting configuration
```

## Getting started

See the [local development and onboarding guide](docs/getting-started.md) for prerequisites, environment configuration, startup, and troubleshooting. The [development guide](docs/development.md) covers shared contracts, migrations, focused checks, and contributor workflow.

## Documentation

See the [documentation index](docs/README.md) for current guides, implementation records, and the historical archive.

| Document | Purpose |
| --- | --- |
| [Product requirements](docs/product.md) | Product scope and acceptance criteria |
| [User journeys](docs/user-journeys.md) | User flows and recovery paths |
| [Pages and interactions](docs/pages-and-interactions.md) | Page behavior and interface states |
| [Design system](docs/design.md) | Shared components, tokens, and layout conventions |
| [Discovery specification](docs/specs/discovery.md) | Questionnaire behavior and versioning |
| [Recommendation specification](docs/specs/career-recommendations.md) | Recommendation evidence and validation |
| [Implementation guides](docs/features/) | Feature behavior, source references, and verification records |
| [Content authoring](docs/content-authoring.md) | Career and roadmap content maintenance |
| [Deployment](docs/deployment.md) | Hosting configuration, publication, and operational gates |
| [Security and operations](docs/security-and-operations.md) | Account security, privacy, retention, and recovery |
| [Verification](docs/verification.md) | Functional, accessibility, AI, and release checks |
| [Decision register](docs/decisions.md) | Approved decisions and unresolved questions |
| [Future development](docs/future-development.md) | Deferred scope and follow-up work |

## Project status

The core application is implemented, with verification and review status recorded in the feature guides. Hosted acceptance, provider compatibility, content review, and release checks remain subject to their documented gates. Repository source and local test evidence do not establish production readiness.

## Contributing

Read [AGENTS.md](AGENTS.md), the relevant specifications, and the architecture before making changes. Keep changes focused, preserve module ownership and shared contracts, update affected documentation, and include verification results in the review handoff. Feature changes require an implementation guide under [docs/features/](docs/features/).

Code ownership is recorded in [CODEOWNERS](.github/CODEOWNERS). Changes require human review before integration; commits, pushes, and merges require explicit owner approval.

## Third-party notices

See [licenses/README.md](licenses/README.md) for data-source attribution and reuse terms.
