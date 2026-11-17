# Windows One-Click Developer Onboarding

**Feature name:** Asgard Windows first-run and daily-start launchers

**Created:** 2026-10-26

**Last updated:** 2026-11-03

**Implemented by:** Codex

**Acceptance coverage:** QA-11 bootstrap support; acceptance remains partial.

**Required reviewer:** Project lead

**Status:** Implemented in the working tree; independent Windows onboarding review is pending.

## Purpose

Give Windows teammates a double-click path to prepare an Asgard checkout and start the local app. This automates the pinned local CLI setup and service startup after Node and Docker Desktop are installed. Docker installation remains a separate prerequisite because Windows may require administrator access, WSL setup, or a restart.

## Launchers

Both `.cmd` files are in the checkout's top-level folder, beside `README.md` and `AGENTS.md`. The checkout can be saved anywhere on your computer; open its local folder in File Explorer through GitHub Desktop.

| File | Use |
| --- | --- |
| `Setup-Asgard.cmd` | First run. Checks Node/npm/Docker, installs the locked Supabase CLI if missing, preserves local files, and guides a fresh local environment through explicit approval gates. |
| `Start-Asgard.cmd` | Daily use. Starts the existing local stack through `scripts/dev.mjs` and opens the app and local email inbox. |

The launchers automatically resolve the checkout root and use `scripts/setup-windows.mjs`. This feature guide is saved at `<checkout-root>/docs/features/windows-one-click-onboarding.md`. See the [onboarding folder tree](../getting-started.md#start-asgard) and [Getting started](../getting-started.md#getting-started) for the teammate instructions.

Implementation files: [Setup-Asgard.cmd](../../Setup-Asgard.cmd), [Start-Asgard.cmd](../../Start-Asgard.cmd), and [setup-windows.mjs](../../scripts/setup-windows.mjs). The launchers reuse the [shared startup helper](../../scripts/dev.mjs) and [guarded credential initializer](../../scripts/provision-local-db.mjs). Setup authority and approval boundaries remain in [AGENTS.md](../../AGENTS.md#portable-local-development-and-shared-foundation) and the [development guide](../development.md#current-foundation-status-and-evidence).

The [architecture's developer setup](../architecture.md#9-reproducible-developer-setup) defines the supported runtime, and [Verification](../verification.md) owns QA-11 acceptance.

## First-run behavior

1. Check that Node.js 24.19.0 or a later Node 24 patch, npm 11, Docker Desktop, Linux containers, and a local Docker context are available.
2. Install the root locked dependencies with `npm ci` only when the pinned Supabase CLI is missing or has the wrong version.
3. Create root `.env` from `.env.example` only when `.env` does not exist. Never replace an existing `.env`.
4. When the local database credential is absent, require the teammate to confirm `INITIALIZE`. The confirmation states that the project lead approved initialization and credential provisioning and that this is a new local database with no existing user data. Generate a local ES256 signing key if needed, bootstrap Supabase, then initialize the restricted `asgard_app` password using the existing guarded initializer. Bootstrap does not start or certify the application.
5. Ask separately for `ENABLE AUTH` before changing the local `.env` Auth flag. If this is declined, Auth remains disabled. When approved, restart through the existing helper and open the app and local inbox.
6. Offer `PUBLISH CONTENT` to run the existing local publisher after Supabase is available. It preserves account state and rejects unexpected content conflicts. Only open the app/inbox after application readiness passes.

The launcher does not reset or delete Docker data, rotate a saved database password, print credentials, copy another teammate's files, or bypass the project-lead approval gates. If the checkout has partial Auth state, stop and use the recovery guidance in the README rather than guessing which secret is missing.

## Daily behavior

`Start-Asgard.cmd` runs the shared `scripts/dev.mjs start` path. It keeps using the checkout's existing `.env`, signing key, database credential, project ID and Docker data. After the helper reports `READY`, the launcher opens the configured frontend URL and the local inbox URL. Signup verification messages are captured locally; they are not delivered to real email addresses.

## Application readiness and publication repair, 2026-11-03

Implementer: Codex. Created/updated: 2026-11-03. Required reviewer:
@YakisobaNissin. Status: implemented and verified on the existing Windows checkout;
independent fresh Windows acceptance remains pending. Owner reference: explicit
implementation of the [repair plan](../plans/discovery-startup-repair-2026-11-03.md).
Acceptance: QA-11 and local prerequisites for F-001/F-002.

Source: setup-windows/dev/local-readiness helpers and backend
`scripts/check_local_readiness.py`. The new `dev.mjs bootstrap` action starts only
Supabase, synchronizes local networking and checks migration status. Setup uses it
before credential provisioning and before content publication on existing setups.
It never applies pending migrations or replaces existing keys/passwords.

Daily startup/verify now checks Auth configuration and health, actual restricted
application-role connectivity/grants and the expected version-4 catalog predecessor
with published careers, roadmaps and active topics. Missing setup prints distinct
recovery instructions and fails before `READY` or automatic browser opening.
Groq configuration is separate and optional for core learning. Readiness checks
read only catalog/role metadata; they do not log secrets or claim session/RLS
acceptance. Public `/ready` response contracts are unchanged.

Twelve Node setup/configuration tests passed, covering declined initialization,
separate declined Auth/publication confirmations, preservation of existing secrets,
partial state, pending-migration failure propagation, publication conflicts and
optional Groq. The affected hashed backend Docker build passed. Daily startup
passed on the existing local environment: migrations current, Auth reachable,
restricted role usable, expected content present and website/proxy ready.
Three backend probe tests also passed: missing credentials, remote database hosts
and administrator usernames never initiate a connection. The live read-only probe
also verified Profile/learning table access without reading account records.
The focused existing-machine Chrome walkthrough also passed registration and
local inbox verification, new-account Dashboard/catalog, Discovery, roadmap/focus
save and logout/login into the populated Dashboard. Generation was intercepted
in that browser check; the separate synthetic live check is in
[recommendation evidence](connected-prototype.md#request-budget-repair-2026-11-03).

Independent manual acceptance is pending, with follow-up owner unassigned. On an
approved fresh Windows machine, run Setup-Asgard.cmd; confirm only approved setup
prompts, create a synthetic account, verify using the local inbox, sign in, open
Dashboard, browse a career and explicitly save its roadmap as current. Complete
Discovery, view results, log out/in, then run Start-Asgard.cmd and verify existing
state remains. A new account should see Choose your first roadmap; this is a
valid empty state. Missing content or failed account reads must be reported as
setup/service failures. Record the failing step and sanitized message; do not
share .env, private keys, passwords or raw CLI status.

## Other platforms

Linux teammates use the Bash commands in [onboarding Getting started](../getting-started.md#getting-started) and [Before first startup](../getting-started.md#before-first-startup). The Windows launchers do not run on Linux. Native Linux-host onboarding remains pending independent verification.

## Original review and verification, 2026-10-26

`node --check scripts/setup-windows.mjs`, documentation target checks, and `git diff --check` passed for this implementation. The launchers have not been exercised on an independent Windows machine, and no fresh database setup or Auth activation was run as part of this change. The project lead should review a fresh Windows walkthrough and an already provisioned checkout before this onboarding is treated as accepted QA-11 evidence.

Manual review remains pending: use an approved fresh local environment, run `Setup-Asgard.cmd`, and confirm the expected approval prompts and successful startup. Open the website and local inbox, create a synthetic account, enter the captured verification code, sign in, save a Profile edit, and sign out. Then run `Start-Asgard.cmd` against the provisioned checkout and confirm it starts without reinitializing credentials. Report the failing step and sanitized console error to the project lead; do not share `.env`, keys, passwords or raw CLI status output. An independent Windows reviewer and native Linux follow-up owner remain unassigned.
