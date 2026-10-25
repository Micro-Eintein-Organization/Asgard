# Asgard

Asgard is a web application for exploring technology careers and following curated learning roadmaps. It connects career explanations, learning topics, and resources so users can choose a direction, track their progress, and return to their next learning step.

Users can browse careers directly or complete a five-round Discovery questionnaire for explained career suggestions. The intended audience is adults aged 18 and above, from beginners to people with technical experience.

## Project status

Asgard is in the planning and engineering preparation stage. The repository contains product requirements, architecture, feature specifications, and design references. The application scaffold, deployment configuration, and automated checks have not been implemented or verified yet.

The stack below is the selected architecture, not a claim that these services are already running. Provider compatibility checks, reviewed roadmap content, and implementation verification remain prerequisites for the final MVP.

## Planned features

- **Career exploration:** browse and search careers across software and AI, design and UX, data and analytics, cybersecurity, hardware and embedded systems, and networking and infrastructure.
- **Guided Discovery:** answer five rounds of questions about interests, activities, work approach, background, and goals to receive explained career suggestions.
- **Interactive roadmaps:** explore curated milestones, topics, learning resources, and tool guidance.
- **Learning progress:** explicitly choose a current roadmap and record reversible topic states: Not started, Learning, Done, and Skipped.
- **Dashboard:** continue learning, view milestone progress, and review activity and streaks.
- **Profile and account settings:** manage preferences, retake Discovery, and optionally upload a PDF containing relevant background for analysis.
- **Account access:** verified email/password and planned Google sign-in, password recovery, optional authenticator-based two-factor authentication, and account deletion. Google linking and MFA recovery remain subject to provider compatibility verification.

Career suggestions support exploration. They do not assess competence or guarantee career suitability or job readiness. Recorded completion represents the user's reported activity.

## Technology stack

| Area | Selected technology |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| UI | Tailwind CSS, shadcn/ui |
| Routing and server state | React Router, TanStack Query |
| Forms and validation | React Hook Form, Zod |
| Backend | Python, FastAPI, Pydantic |
| Database and data access | Supabase PostgreSQL, SQLAlchemy 2.x |
| Authentication and file storage | Supabase Auth, Supabase Storage |
| Database migrations | Supabase CLI with versioned SQL migrations |
| API contracts | FastAPI OpenAPI with a generated TypeScript client |
| AI provider | Groq; GPT-OSS 120B and 20B are evaluation candidates |
| Local development | Docker Compose, Supabase CLI |
| Testing and CI | Pytest, Vitest, Playwright, GitHub Actions |
| Planned hosting | Vercel Hobby for the frontend; Render Free for the backend; Supabase Free for data services |

The initial runtime baseline is Node.js 24 LTS and Python 3.13. Exact dependency versions will be pinned during scaffolding. Free hosting is the evaluation baseline; it does not establish an always-on availability commitment.

## Architecture

Asgard uses a modular monolith with a React single-page frontend, a FastAPI backend, and one PostgreSQL database. The browser uses Supabase Auth for identity and calls FastAPI for application data and business operations.

The backend enforces account ownership, saves learning progress, and calls AI providers through a server-side adapter. Recommendations, optional PDF extraction, and authored next-topic guidance have separate responsibilities. Secrets remain server-side, and private files belong in object storage.

See the [architecture document](docs/architecture.md) for service boundaries, deployment decisions, and verification gates.

## Getting started

There are no verified install, start, build, or test commands yet because the application scaffold is not present.

The planned local workflow uses Docker Compose for the frontend and backend, plus the Supabase CLI for local database, authentication, and storage services. Windows development will support Docker Desktop with WSL2. Configuration templates, lockfiles, migrations, seed data, and a checked bootstrap workflow will be added with the scaffold.

See the [development guide](docs/development.md) for the selected tooling and implementation order. Never commit credentials or real user data.

## Documentation

| Document | Contents |
| --- | --- |
| [Product requirements](docs/product.md) | Product purpose, audience, MVP scope, and acceptance criteria |
| [User journeys](docs/user-journeys.md) | End-to-end flows and recovery paths |
| [Pages and interactions](docs/pages-and-interactions.md) | Page content, controls, and interface states |
| [Architecture](docs/architecture.md) | Stack, service boundaries, data access, and deployment |
| [Development](docs/development.md) | Local environment, implementation order, and checks |
| [Discovery specification](docs/specs/discovery.md) | Five-round questionnaire, copy, and interaction rules |
| [Recommendation specification](docs/specs/career-recommendations.md) | Catalog-grounded recommendations and optional PDF extraction |
| [Security and operations](docs/security-and-operations.md) | Account security, privacy, retention, backups, and operational controls |
| [Verification](docs/verification.md) | Functional, accessibility, AI quality, and release checks |
| [Decision register](docs/decisions.md) | Recorded decisions, compatibility blockers, and remaining evidence |

Static design exports are in [docs/design/figma](docs/design/figma/). The [historical frontend reference](docs/design/ui-reference/README.md) provides design context and reuse notes; it is not the current application.

## Contributing

Read the product requirements, architecture, and development guide before proposing implementation changes. Keep changes focused, update affected documentation, and include the relevant verification results in a pull request. Report checks that could not be run.
