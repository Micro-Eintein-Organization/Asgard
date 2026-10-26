# Asgard

Asgard is a web application for exploring technology careers and following curated learning roadmaps. It connects career explanations, learning topics, and resources so users can choose a direction, track their progress, and return to their next learning step.

Users can browse careers directly or complete a five-round Discovery questionnaire for explained career suggestions. The intended audience is adults aged 18 and above, from beginners to people with technical experience.

The MVP targets desktop and laptop browsers at approximately 1280–1920 px, with keyboard access and browser zoom support. See [compatibility requirements](docs/product.md#nfr-02-desktop-compatibility-and-accessible-reflow).

## Project status

Asgard is under development. The authenticated React/FastAPI application is the single implementation of Dashboard, Discovery, career exploration, roadmaps and Settings. These feature pages retain labeled sample content and prototypes; standalone UI Preview routes have been removed. Email/password access and private Profile integration are implemented, with local-only activation recorded in the decision register; fresh environments remain disabled by default. Saved learning data, uploads and AI recommendations are not integrated yet. See the [Stage 3.5 handoff](docs/stage-3.5-handoff.md) for preservation details and pending manual acceptance.

Stage 4 adds the shared SQL foundation, 29 authenticated API contract stubs, generated TypeScript contracts and query/error conventions. The local integrity/RLS probe passed; feature operations intentionally return `501` until implemented. See the [Stage 4 handoff](docs/development.md#stage-4-shared-contracts-and-handoff) for contracts, verification and review/publication gates.

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

The backend enforces account ownership and implements private Profile persistence. Learning progress, AI-provider calls and optional PDF extraction are future feature integrations with separate module responsibilities; authored next-topic guidance belongs to Learning Progress. Secrets remain server-side, and private files belong in object storage.

See the [architecture document](docs/architecture.md) for service boundaries, deployment decisions, and verification gates.

## Getting started

Clone into any directory you own. All project commands run from your checkout root, the folder containing `AGENTS.md`, `package.json` and `compose.yaml`; no particular drive, username, sync folder or editor is required. Documentation links and Compose mounts are repository-relative. The pinned versions below are shared project requirements, not a description of one contributor's machine.

### Install prerequisites

- **Git:** install using [Git's Windows installer](https://git-scm.com/install/windows) or [Linux package instructions](https://git-scm.com/install/linux). You need access to this repository.
- **Node.js 24.19.0 and npm 11:** install the appropriate Windows installer or Linux binary from the [Node 24.19.0 release](https://nodejs.org/dist/v24.19.0/). `.node-version` pins 24.19.0; package manifests permit Node `>=24.19.0 <25` and npm `>=11 <12`. The tested npm/package-manager pin is 11.17.0. npm comes with Node; do not substitute a newer Node major or update locks as part of onboarding.
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

| Installed where | Runtime/dependencies | Repository authority |
| --- | --- | --- |
| Host | Git, Node 24, npm 11, Docker with Linux containers and Compose | `.node-version`, root `package.json`, this prerequisite section |
| Host, installed by root `npm ci` | Supabase CLI 2.122.0 | Root `package.json` and `package-lock.json` |
| Frontend container | Node 24.19.0 and frontend npm packages | `frontend/Dockerfile`, `frontend/package-lock.json` |
| Backend container | Python 3.13.17 and hashed runtime/development packages | `backend/Dockerfile`, `backend/requirements.lock`, `backend/requirements-dev.lock` |
| CLI-managed containers | Local Supabase services, including PostgreSQL 17 | Locked CLI and `supabase/config.toml` |

Windows 11/PowerShell and Linux/Bash are the documented development targets. Native Linux-host acceptance remains pending; macOS, ARM and remote Docker hosts have not been verified. The recorded Docker versions are test evidence, not a requirement to reproduce another person's workstation.

### First-time setup

Windows PowerShell, after starting Docker Desktop:

```powershell
git clone https://github.com/Micro-Eintein-Organization/Asgard.git
Set-Location Asgard
npm ci
```

Linux Bash, after starting Docker Engine and verifying user access:

```bash
git clone https://github.com/Micro-Eintein-Organization/Asgard.git
cd Asgard
npm ci
```

### Create and configure `.env`

Use **one `.env` file at the repository root**, next to `.env.example` and `compose.yaml`. Compose passes backend values to FastAPI and explicitly maps the public frontend values to Vite. Do not create `frontend/.env` or `backend/.env`, and do not export these settings into your shell profile.

After cloning and running root `npm ci`, create `.env` only if it does not already exist.

Windows PowerShell:

```powershell
if (-not (Test-Path -LiteralPath '.env')) {
  Copy-Item -LiteralPath '.env.example' -Destination '.env'
}
```

Linux Bash:

```bash
if [ ! -e .env ]; then
  cp .env.example .env
fi
```

Keep the copied defaults initially, including `ASGARD_AUTH_ENABLED=false` and an empty `ASGARD_DATABASE_URL`. Do not fill the anonymous-key fields with guesses, service-role keys or another developer's values. The variable ownership is:

| Variable | Initial value / how it is set |
| --- | --- |
| `ASGARD_PROJECT_ID` | `asgard-foundation`; the helper synchronizes it from `supabase/config.toml` |
| `FRONTEND_PORT`, `BACKEND_PORT` | Keep `5173`, `8000` for the documented workflow |
| `ASGARD_SUPABASE_URL` | Helper-generated internal Docker URL for this local project |
| `ASGARD_SUPABASE_ANON_KEY` | Leave blank initially; helper reads the running local CLI's anonymous key |
| `ASGARD_AUTH_ISSUER` | Helper-generated public local Auth issuer |
| `ASGARD_CORS_ORIGINS` | Helper-generated JSON list of local frontend origins |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Helper-generated browser-accessible local URL and anonymous key; these are public client configuration |
| `ASGARD_AUTH_ENABLED` | Keep `false` until this environment's Auth provisioning is approved and complete |
| `ASGARD_DATABASE_URL` | Keep blank until the approved local credential initializer writes the restricted `asgard_app` connection; never put this value in a `VITE_*` variable |

**Populate local connectivity values.** First satisfy the signing-key and initialization prerequisite in the next section; then, with Docker running, use these existing commands from the repository root:

```text
npx --no-install supabase start
node scripts/dev.mjs env
```

The `env` command updates the managed rows in root `.env`, preserves custom entries, and does not print credentials. Expect the message that the local `.env` was regenerated and credentials were not printed. It does not generate signing keys, create an application password, or enable application Auth. Alternatively, `node scripts/dev.mjs start` runs this environment synchronization as part of normal startup.

**Provision the local application credential only after project-lead approval for this environment.** Supabase must be running, the approved migrations must have created `asgard_app`, root `.env` must exist, and `ASGARD_DATABASE_URL` must still be empty. The existing credential-only initializer works in PowerShell and Bash:

```text
node scripts/provision-local-db.mjs --approve-local-password
```

It generates a fresh password, records the connection URL in ignored root `.env`, and sets only the existing local `asgard_app` role's password. It does not create roles, grant permissions, run migrations or enable Auth. Successful output says the least-privilege application password was initialized and no credentials were printed. If a database URL already exists, it stops: do not clear that value or rerun this as password rotation. If it fails, stop and report the sanitized error, not the connection string. This command changes local credential state; it is not a read-only check or an approval grant by itself.

Once signing keys, migrations, credentials and local Auth/session validation are approved for this environment, edit the existing line in **your own** root `.env` to:

```dotenv
ASGARD_AUTH_ENABLED=true
```

Leave the initializer-generated database URL unchanged. Then load the changed environment and run the existing connectivity verification:

```text
node scripts/dev.mjs start
```

The helper recreates the app containers through Compose and checks connectivity. Open the local app and confirm actual sign-in/Profile behavior separately; a `READY` message alone does not verify authentication. `docker compose restart` does not reload changed `.env` values.

**Existing checkout:** keep its `.env`; do not copy `.env.example` over it or reprovision its password. Normal startup refreshes managed connectivity fields while preserving its private credential and Auth flag. If `.env` has been lost for a database that already contains credentials/data, stop for credential recovery or reviewed rotation; generating connectivity values cannot recover the old application password. Do not reset the database or copy another developer's `.env`.

`.env` and `supabase/signing-keys.json` are ignored by Git. Commit only the placeholder `.env.example`, never real passwords, signing keys or CLI status dumps. Standard local setup needs no Groq key, SMTP account, hosted Supabase URL or service-role key. Those belong to separately approved integrations. If the helper reports conflicting exported shell variables, remove those overrides in your own terminal or open a clean terminal; do not change committed defaults to accommodate another person's shell setup.

### Before first startup

The current active `supabase/config.toml` references **ignored `supabase/signing-keys.json`**. For an approved fresh local environment, create that file as an empty JSON array and use the locked CLI to append a new ES256 private key. The array must exist first: the pinned CLI's append operation does not create a missing file. This command was checked in an isolated temporary folder; its generated key was removed afterward. Full fresh-machine startup/Auth acceptance has not been rerun.

Run this **once, on the new developer environment only**, from its checkout root after root `npm ci`. In Windows PowerShell:

```powershell
if (Test-Path -LiteralPath 'supabase/signing-keys.json') {
  throw 'A signing-key file already exists. Keep it; do not rerun first-time key provisioning.'
}
New-Item -Path 'supabase/signing-keys.json' -ItemType File -Value '[]' -ErrorAction Stop | Out-Null
npx --no-install supabase gen signing-key --algorithm ES256 --append
if ($LASTEXITCODE -ne 0) { throw 'Signing-key generation failed. Stop before starting Supabase.' }
```

The CLI stores the key in the path configured by `supabase/config.toml`. Keep that private JSON file local and ignored; do not print or share it. The existing CLI operation and ES256 support are described in [Supabase's CLI reference](https://supabase.com/docs/reference/cli/global-flags#supabase-gen-signing-key). On Linux, create the same new file containing `[]` with owner-only permissions, then run the same `npx` command; do not append to an already provisioned key file. The isolated generation probe used Windows; native Linux-host acceptance remains pending.

After that key file exists and database initialization is approved, perform the following in PowerShell or Bash. **Stop after any failed command**:

```text
npx --no-install supabase start
npx --no-install supabase db push --local --dry-run
node scripts/dev.mjs env
node scripts/provision-local-db.mjs --approve-local-password
```

On a genuinely new database, Supabase startup initializes the committed migrations, including the restricted application role. The migration dry-run should report up to date. If migrations remain pending, stop for review instead of continuing to credential setup. The `env` helper fills local connectivity values; the credential initializer generates the application password and saves its connection string in your root `.env`. Never substitute `postgres` or a service-role credential as the runtime connection. Keep the app Auth flag false until this environment's initialization/configuration and local Auth/session checks are approved; then set `ASGARD_AUTH_ENABLED=true` and run `node scripts/dev.mjs start` as described in the environment section.

These are two distinct secrets: the signing key signs Supabase Auth sessions, while the generated `asgard_app` password lets FastAPI connect to the database with restricted permissions. You do not choose or paste either secret manually. No cloud dashboard, Groq key or hosted service-role key is needed for this local process.

`scripts/dev.mjs` does not generate signing keys or provision the application password, and setting `ASGARD_AUTH_ENABLED=false` does not remove the CLI's signing-file requirement. Do not copy another developer's signing keys, `.env`, database password or personal data. An empty Supabase database may apply the committed migrations on initialization; obtain environment-specific initialization approval first. The manual commands are supplied here, but a single automated fresh-clone Auth-provisioning workflow and full fresh-host acceptance remain unfinished. Your already activated environment should keep its existing files and use daily startup instead.

Once that environment is provisioned and initialization is approved, start it from the repository root in either shell:

```text
node scripts/dev.mjs start
```

The shared Node helper works without shell scripts or executable-bit changes. It creates root `.env` from `.env.example` if missing, starts CLI-managed Supabase, regenerates its local anonymous key and Docker URL, checks retained-database migrations without applying them, and builds/starts the app services. It prints `READY` and the URLs only after connectivity checks pass. It stops on errors and never resets databases or stops another project. Existing custom environment entries are preserved; project ID, local Supabase URL/key and local CORS origins are regenerated. Supabase itself handles schema initialization for a new empty database.

The helper manages ordinary local connectivity values; enabling the authenticated app additionally needs the local signing-key/database credential setup described below. Do not create `frontend/.env` or `backend/.env`; Compose uses only root `.env`. Keep credentials and real user data out of Git. `READY` proves the helper's connectivity checks, not successful login, Profile saving or feature acceptance.

Fresh environments must keep `ASGARD_AUTH_ENABLED=false` until their migration, signing-key configuration and dedicated `asgard_app` database credentials are approved and provisioned. Local-only activation was separately approved and executed on 26 October 2026, as recorded in [Decisions](docs/decisions.md#authority-and-status); this does not authorize activation in another environment. The approved SQL is versioned under `supabase/migrations/`; the `.pending` Auth config remains a historical review artifact. Normal startup does not grant approval to initialize another environment. Do not substitute an administrator database credential to make Profile work. See [Stage 3 review history](docs/development.md#stage-3-authentication-and-profile-review-gate).

### Open the application

| Local URL | Purpose |
| --- | --- |
| **[http://127.0.0.1:5173](http://127.0.0.1:5173)** | **Asgard website — open this first** |
| [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) | FastAPI interactive API documentation |
| [http://127.0.0.1:55323](http://127.0.0.1:55323) | Local Supabase Studio |
| [http://127.0.0.1:5173/status](http://127.0.0.1:5173/status) | Application connectivity page |

These are the committed project ports; `127.0.0.1` and `localhost` refer to each developer's own computer, not a shared project-lead server. Additional ports and networking details are in [Development](docs/development.md#local-network-and-filesystem-boundaries). After environment-specific Auth activation, sign in to navigate the application. Career and learning pages use labeled sample content; email/password access and Profile saving use the connected services when local authentication is activated. Independent computers can use the same defaults, but two checkouts on one Docker daemon share resources when their project IDs match; coordinate an isolated configuration before running multiple checkouts.

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

After satisfying the same first-start provisioning/approval prerequisite above and creating root `.env` as described in [environment configuration](#create-and-configure-env), use this sequence on either platform, after root `npm ci`:

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

`verify` checks connectivity. `check` runs the broader container-based frontend/backend checks, schema/client drift, database lint and a migration dry-run; do not rerun that full command for documentation-only changes. Use the focused evidence/checks in the Stage 4 handoff when relevant code has changed. These commands do not require host frontend/backend packages. Windows wrappers remain available: `scripts/start-local.ps1`, `scripts/check.ps1` and `scripts/generate-api.ps1` delegate to the same helper.

If root `.env` has stale managed connectivity fields, use the sequence below. If it is missing from an already-provisioned environment, first arrange recovery of its private credential; if it came from another developer's environment, stop using those credentials and arrange approved provisioning for your own environment. These commands regenerate managed connectivity fields, not private application passwords:

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
| Missing `supabase/signing-keys.json` / Auth not configured on a fresh clone | Complete the environment-specific provisioning prerequisite above with the project lead. The helper does not generate signing keys or application DB credentials. Do not copy another developer's secrets or enable the Auth flag to bypass setup. |
| Port unavailable | The helper names the port and stops. Identify its owner and resolve it manually; do not stop unrelated containers. Defaults reserve 5173, 8000 and 55320–55324. |
| External Supabase network missing | Run Supabase first, then `node scripts/dev.mjs env`. CLI and Compose must use the same local Docker daemon/context. Do not mix a remote Docker context with a local browser or two independent Windows/WSL daemons. |
| Readiness fails / Studio cannot query | Run `docker compose logs --tail 100`, `npx --no-install supabase status` and `node scripts/dev.mjs verify`. CLI status can display local credentials; do not paste its raw output into tickets. Regenerate `.env` as above if stale. |
| Pending migrations | Startup stops after a dry-run. Have the owner review them before explicitly applying local migrations; never reset the database as a quick fix. See Development. |
| Changes do not appear | Source reload is limited to the documented bind mounts. Rerun startup for package, lock, test or configuration changes; both app dependencies are installed inside their images. |
| Linux file permission or import error | Keep the checkout owned/readable by your login user. Do not copy Windows `node_modules` to Linux. Preserve filename/import case. Contract generation writes files as the host user; see Development. |
| PowerShell blocks `.ps1` execution | Use `node scripts/dev.mjs start` directly; no execution-policy change is required. |
| Settings seem ignored | Unset shell exports such as `COMPOSE_FILE`, `COMPOSE_PROJECT_NAME` or stale `ASGARD_*`/port values that override root `.env`; the helper reports conflicts without printing values. |

The pinned CLI publishes local Supabase ports on host interfaces; use a trusted development machine/network and its firewall. This stack is not a production deployment. The shared application migrations exist; reviewed content, feature integration and the remaining account capabilities are unfinished. See the [development guide](docs/development.md) for verification limits and the [design guide](docs/design.md) before UI work.

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

Read [AGENTS.md](AGENTS.md), the product requirements, architecture, and development guide before proposing implementation changes. Keep changes focused, preserve the shared Stage 4 contracts, update affected documentation, and include the relevant verification results in a pull request. Report checks that could not be run. The confirmed project-lead reviewer is recorded in [.github/CODEOWNERS](.github/CODEOWNERS); required-review enforcement still depends on repository settings and the file reaching the PR base branch.
