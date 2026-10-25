# Asgard

Asgard is a web application for exploring technology careers and following curated learning roadmaps. It connects career explanations, learning topics, and resources so users can choose a direction, track their progress, and return to their next learning step.

Users can browse careers directly or complete a five-round Discovery questionnaire for explained career suggestions. The intended audience is adults aged 18 and above, from beginners to people with technical experience.

The MVP targets desktop and laptop browsers at approximately 1280–1920 px, with keyboard access and browser zoom support. See [compatibility requirements](docs/product.md#nfr-02-desktop-compatibility-and-accessible-reflow).

## Project status

Asgard is under development. The repository includes a working local React/FastAPI scaffold and navigable UI previews for account entry, Discovery, career exploration, roadmaps, Dashboard, and Settings. The previews use clearly labeled sample content. Authentication, saved learning data, uploads, and AI recommendations are not integrated yet.

Local runtime and UI checks cover only part of the required evidence. Provider compatibility, reviewed roadmap content, feature integration and release verification remain prerequisites for the final MVP. Planned hosting below is not a claim of deployment.

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

The runtime baseline is Node.js 24 LTS and Python 3.13 in Docker, with pinned image digests and dependency locks. Free hosting is the evaluation baseline; it does not establish an always-on availability commitment.

## Architecture

Asgard uses a modular monolith with a React single-page frontend, a FastAPI backend, and one PostgreSQL database. The browser uses Supabase Auth for identity and calls FastAPI for application data and business operations.

The backend enforces account ownership, saves learning progress, and calls AI providers through a server-side adapter. Recommendations, optional PDF extraction, and authored next-topic guidance have separate responsibilities. Secrets remain server-side, and private files belong in object storage.

See the [architecture document](docs/architecture.md) for service boundaries, deployment decisions, and verification gates.

## Getting started

### Install prerequisites

- **Git:** install using [Git's Windows installer](https://git-scm.com/install/windows) or [Linux package instructions](https://git-scm.com/install/linux). You need access to this repository.
- **Node.js 24.19.0 and npm 11:** install the appropriate Windows installer or Linux binary from the [Node 24.19.0 release](https://nodejs.org/dist/v24.19.0/). Keep the Node 24 line recorded in `.node-version`; do not substitute a newer major version. npm comes with Node. The tested npm version is 11.17.0.
- **Windows 11:** install [Docker Desktop with WSL2](https://docs.docker.com/desktop/setup/install/windows-install/), complete its WSL setup/reboot if requested, then start Docker Desktop in Linux-container mode. Use PowerShell from the Windows checkout.
- **Linux:** install [Docker Engine and its Compose plugin](https://docs.docker.com/engine/install/) for your distribution. Use Bash. Start the Docker daemon and follow Docker's [user-access setup](https://docs.docker.com/engine/install/linux-postinstall/) so `docker info` succeeds as your login user. Docker-group access grants root-level privileges; obtain your machine administrator's approval where required. Do not run the project helper or npm with `sudo`.

Use the upstream installation procedures above for your OS; prerequisite installation on a fresh OS was not exercised here. Verify the installed tools in either shell:

```text
git --version
node --version
npm --version
docker info
docker compose version
```

Docker must report a Linux server. Windows verification used Docker Engine 29.8.2 / Compose 5.5.1. Native Linux-host onboarding remains a verification gate; see [tested scope](docs/development.md#stage-2-hardening-evidence).

You do **not** need host Python, pip, frontend packages, a global Supabase CLI, a cloud Supabase project, or cloud API keys. Docker installs frontend/backend dependencies from the committed locks. Root `npm ci` installs only the pinned local CLI. Initial setup needs internet access for packages/images and adequate Docker resources.

### First-time setup

Windows PowerShell, after starting Docker Desktop:

```powershell
git clone https://github.com/Micro-Eintein-Organization/Asgard.git
Set-Location Asgard
npm ci
node scripts/dev.mjs start
```

Linux Bash, after starting Docker Engine and verifying user access:

```bash
git clone https://github.com/Micro-Eintein-Organization/Asgard.git
cd Asgard
npm ci
node scripts/dev.mjs start
```

Run project commands from the repository root. The shared Node helper works without shell scripts or executable-bit changes. It creates root `.env` from `.env.example` if missing, starts CLI-managed Supabase, regenerates its local anonymous key and Docker URL, checks migrations without applying them, and builds/starts the app services. It prints `READY` and the URLs only after connectivity checks pass. It stops on errors and never resets databases or stops another project. Existing custom environment entries are preserved; project ID, local Supabase URL/key and local CORS origins are regenerated.

No environment value needs manual setup for the standard local workflow. Do not create `frontend/.env` or `backend/.env`; Compose uses only root `.env`. Keep credentials and real user data out of Git.

### Open the application

| Local URL | Purpose |
| --- | --- |
| **[http://127.0.0.1:5173](http://127.0.0.1:5173)** | **Asgard website — open this first** |
| [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) | FastAPI interactive API documentation |
| [http://127.0.0.1:55323](http://127.0.0.1:55323) | Local Supabase Studio |
| [http://127.0.0.1:5173/status](http://127.0.0.1:5173/status) | Application connectivity page |

These are the actual committed ports, not Supabase defaults. Additional ports and networking details are in [Development](docs/development.md#local-network-and-filesystem-boundaries). UI previews are sample content; account and learning features are not connected yet.

### Daily startup and shutdown

Start Docker Desktop (Windows) or Docker Engine (Linux), then run from the repository root in either shell:

```text
node scripts/dev.mjs start
```

After pulling a changed root lockfile, run `npm ci` first. The helper rebuilds app images, so changed application dependencies do not require host package installation. Source hot reload covers `frontend/src`, `frontend/index.html` and backend app code; rerun startup for dependency/configuration changes.

To stop **this checkout's project** while preserving Supabase data:

```text
docker compose down
npx --no-install supabase stop
```

Keep this order: the backend must disconnect before the CLI removes its network. Do not add `--all`, `--no-backup`, volume-removal flags, or a database reset to routine shutdown. Run shutdown from the checkout you intend to stop.

### Explicit startup sequence

For first-time setup without the all-in-one helper, initialize root `.env` once:

```powershell
# Windows PowerShell; only when .env does not exist
Copy-Item .env.example .env
```

```bash
# Linux Bash; only when .env does not exist
cp .env.example .env
```

Then use the same sequence on either platform, after root `npm ci`:

```text
npx --no-install supabase start
node scripts/dev.mjs env
docker compose up --build
```

The app command stays in the foreground; use another terminal at the repository root to run `node scripts/dev.mjs verify`. The helper uses detached Compose with health waits instead. Supabase's CLI owns all database/Auth/Studio services; Compose owns only frontend/backend. Do not run `supabase init`, link a cloud project, or supply a service-role/database password for this stage.

### Checks and environment regeneration

With the stack running, these commands work in both shells:

```text
node --test scripts/dev-config.test.mjs
node scripts/dev.mjs verify
node scripts/dev.mjs check
```

`check` runs container-based frontend/backend checks, schema/client drift, database lint and a migration dry-run. It does not require host frontend/backend packages. Windows wrappers remain available: `scripts/start-local.ps1`, `scripts/check.ps1` and `scripts/generate-api.ps1` delegate to the same helper.

If root `.env` is missing, stale, or belongs to another checkout, start local Supabase and regenerate its managed values:

```text
npx --no-install supabase start
node scripts/dev.mjs env
docker compose up --build --detach --wait --wait-timeout 180
node scripts/dev.mjs verify
```

The `env` command reads the CLI's current local values without printing credentials. It recreates a missing file from the template. On Linux it restricts the file to the current user. Recreating containers is necessary after environment changes; `docker compose restart` does not load changed environment values. See [Development](docs/development.md#contracts-and-migrations) for contract generation and migration rules.

### Troubleshooting

| Symptom | Action |
| --- | --- |
| Docker unavailable / permission denied | Start Docker Desktop with Linux containers or start the Linux daemon. Check `docker info` in the same shell. On Linux, complete the upstream user-access procedure and log in again; do not use `sudo npm` or loosen socket permissions. |
| Node/CLI missing or wrong version | Check `.node-version`, install Node 24 with npm 11, and run root `npm ci`. Do not install the latest global CLI. |
| Port unavailable | The helper names the port and stops. Identify its owner and resolve it manually; do not stop unrelated containers. Defaults reserve 5173, 8000 and 55320–55324. |
| External Supabase network missing | Run Supabase first, then `node scripts/dev.mjs env`. CLI and Compose must use the same local Docker daemon/context. Do not mix a remote Docker context with a local browser or two independent Windows/WSL daemons. |
| Readiness fails / Studio cannot query | Run `docker compose logs --tail 100`, `npx --no-install supabase status` and `node scripts/dev.mjs verify`. CLI status can display local credentials; do not paste its raw output into tickets. Regenerate `.env` as above if stale. |
| Pending migrations | Startup stops after a dry-run. Have the owner review them before explicitly applying local migrations; never reset the database as a quick fix. See Development. |
| Changes do not appear | Source reload is limited to the documented bind mounts. Rerun startup for package, lock, test or configuration changes; both app dependencies are installed inside their images. |
| Linux file permission or import error | Keep the checkout owned/readable by your login user. Do not copy Windows `node_modules` to Linux. Preserve filename/import case. Contract generation writes files as the host user; see Development. |
| PowerShell blocks `.ps1` execution | Use `node scripts/dev.mjs start` directly; no execution-policy change is required. |
| Settings seem ignored | Unset shell exports such as `COMPOSE_FILE`, `COMPOSE_PROJECT_NAME` or stale `ASGARD_*`/port values that override root `.env`; the helper reports conflicts without printing values. |

The pinned CLI publishes local Supabase ports on host interfaces; use a trusted development machine/network and its firewall. This stack is not a production deployment. Application migrations, reviewed content and account integrations remain future work. See the [development guide](docs/development.md) for verification limits and the [design guide](docs/design.md) before UI work.

## Documentation

| Document | Contents |
| --- | --- |
| [Product requirements](docs/product.md) | Product purpose, audience, MVP scope, and acceptance criteria |
| [User journeys](docs/user-journeys.md) | End-to-end flows and recovery paths |
| [Pages and interactions](docs/pages-and-interactions.md) | Page content, controls, and interface states |
| [Architecture](docs/architecture.md) | Stack, service boundaries, data access, and deployment |
| [Development](docs/development.md) | Local environment, implementation order, and checks |
| [Design system](docs/design.md) | Implemented visual tokens, components, responsive layouts, and UI maintenance rules |
| [Discovery specification](docs/specs/discovery.md) | Five-round questionnaire, copy, and interaction rules |
| [Recommendation specification](docs/specs/career-recommendations.md) | Catalog-grounded recommendations and optional PDF extraction |
| [Security and operations](docs/security-and-operations.md) | Account security, privacy, retention, backups, and operational controls |
| [Verification](docs/verification.md) | Functional, accessibility, AI quality, and release checks |
| [Decision register](docs/decisions.md) | Recorded decisions, compatibility blockers, and remaining evidence |

Static design exports are in [docs/design/figma](docs/design/figma/). The [historical frontend reference](docs/design/ui-reference/README.md) provides design context and reuse notes; it is not the current application.

## Contributing

Read the product requirements, architecture, and development guide before proposing implementation changes. Keep changes focused, update affected documentation, and include the relevant verification results in a pull request. Report checks that could not be run.
