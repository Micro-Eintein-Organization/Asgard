# Windows One-Click Developer Onboarding

**Feature name:** Asgard Windows first-run and daily-start launchers

**Created:** 2026-10-26

**Last updated:** 2026-10-26

**Acceptance coverage:** QA-11 bootstrap support; acceptance remains partial.

**Status:** Implemented in the working tree; independent Windows onboarding review is pending.

## Purpose

Give Windows teammates a double-click path to prepare an Asgard checkout and start the local app. This automates the pinned local CLI setup and service startup after Node and Docker Desktop are installed. Docker installation remains a separate prerequisite because Windows may require administrator access, WSL setup, or a restart.

## Launchers

Both `.cmd` files are in the checkout's top-level folder, beside `README.md` and `AGENTS.md`. The checkout can be saved anywhere on your computer; open the checkout root in the filesystem.

| File | Use |
| --- | --- |
| `Setup-Asgard.cmd` | First run. Checks Node/npm/Docker, installs the locked Supabase CLI if missing, preserves local files, and guides a fresh local environment through explicit approval gates. |
| `Start-Asgard.cmd` | Daily use. Starts the existing local stack through `scripts/dev.mjs` and opens the app and local email inbox. |

The launchers automatically resolve the checkout root and use `scripts/setup-windows.mjs`. This feature guide is saved at `<checkout-root>/docs/features/windows-one-click-onboarding.md`. See the [README folder tree](../../README.md#start-asgard) and [Getting started](../../README.md#getting-started) for the teammate instructions.

Implementation files: [Setup-Asgard.cmd](../../Setup-Asgard.cmd), [Start-Asgard.cmd](../../Start-Asgard.cmd), and [setup-windows.mjs](../../scripts/setup-windows.mjs). The launchers reuse the [shared startup helper](../../scripts/dev.mjs) and [guarded credential initializer](../../scripts/provision-local-db.mjs). Setup authority and approval boundaries remain in [AGENTS.md](../../AGENTS.md#portable-local-development-and-shared-foundation) and the [development guide](../development.md#current-foundation-status-and-evidence).

The [architecture's developer setup](../architecture.md#9-reproducible-developer-setup) defines the supported runtime, and [Verification](../verification.md) owns QA-11 acceptance.

## First-run behavior

1. Check that Node.js 24.19.0 or a later Node 24 patch, npm 11, Docker Desktop, Linux containers, and a local Docker context are available.
2. Install the root locked dependencies with `npm ci` only when the pinned Supabase CLI is missing or has the wrong version.
3. Create root `.env` from `.env.example` only when `.env` does not exist. Never replace an existing `.env`.
4. When the local database credential is absent, require the teammate to confirm `INITIALIZE`. The confirmation states that initialization and credential provisioning are explicitly authorized and that this is a new local database with no existing user data. Generate a local ES256 signing key if needed, start Supabase and app services, then initialize the restricted `asgard_app` password using the existing guarded initializer.
5. Ask separately for `ENABLE AUTH` before changing the local `.env` Auth flag. If this is declined, Auth remains disabled. When approved, restart through the existing helper and open the app and local inbox.

The launcher does not reset or delete Docker data, rotate a saved database password, print credentials, copy another teammate's files, or bypass the explicit approval gates. If the checkout has partial Auth state, stop and use the recovery guidance in the README rather than guessing which secret is missing.

## Daily behavior

`Start-Asgard.cmd` runs the shared `scripts/dev.mjs start` path. It keeps using the checkout's existing `.env`, signing key, database credential, project ID and Docker data. After the helper reports `READY`, the launcher opens the configured frontend URL and the local inbox URL. Signup verification messages are captured locally; they are not delivered to real email addresses.

## Other platforms

Linux teammates use the Bash commands in [README Getting started](../../README.md#getting-started) and [Before first startup](../../README.md#before-first-startup). The Windows launchers do not run on Linux. Native Linux-host onboarding remains pending independent verification.

## Review and verification

`node --check scripts/setup-windows.mjs`, documentation target checks, and `git diff --check` passed for this implementation. The launchers have not been exercised on an independent Windows machine, and no fresh database setup or Auth activation was run as part of this change. Verify both a fresh Windows walkthrough and an already provisioned checkout before this onboarding is treated as accepted QA-11 evidence.

Manual review remains pending: use an approved fresh local environment, run `Setup-Asgard.cmd`, and confirm the expected approval prompts and successful startup. Open the website and local inbox, create a synthetic account, enter the captured verification code, sign in, save a Profile edit, and sign out. Then run `Start-Asgard.cmd` against the provisioned checkout and confirm it starts without reinitializing credentials. Report the failing step and sanitized console error in the verification record; do not share `.env`, keys, passwords or raw CLI status output. Independent Windows acceptance and native Linux verification remain pending.
