# Asgard: Development context

## Current local MVP status (2026-11-02)

The [scope decision](decisions.md#local-evaluation-mvp-resolution-2026-11-02) defines the current local evaluation baseline. This section supersedes older current-status summaries and foundation-only inventories below; dated execution records remain historical evidence.

| Area | Current source and recorded evidence | Pending/deferred |
| --- | --- | --- |
| Account/Profile | Email/password, verification, session checks, names and preferences; October local account/isolation acceptance in [handoff](features/mvp-backend-handoff.md) | Photos, recovery, Google, new MFA lifecycle and deletion deferred; hosted security gates open |
| Discovery/recommendations | Conditional activities, retained inactive answers, blank retakes, saved Groq lifecycle/quotas; [Discovery evidence](features/discovery-catalog-refresh.md) | Comprehension, full model corpus and failure/concurrency permutations |
| Learning/Dashboard | Explicit focus, branch and topic states, one-Learning guard, summaries, calendar/streak and undo; [local acceptance](features/deployment-preparation.md) | Shared resolution dialog, richer Profile/recent-completion views deferred; cross-device/full concurrency acceptance pending |
| Catalog/roadmaps | 12 published paths, 72 milestones, 288 topics/resources; release upgrade/repeat/rollback and preservation checks in [expansion guide](features/roadmap-content-expansion.md) | Independent curriculum/license review and authenticated November browser/keyboard/zoom acceptance |
| Documents | Processing disabled; retained removal/cleanup | Upload/analysis deferred; privacy/provider activation gates unchanged |
| Runtime/release | Existing Windows/Docker local and isolated-directory acceptance; source/contract/build evidence in linked guides | Independent host/Linux, full accessibility/browser matrix, protected review, hosted SMTP/pooler/backups/operations and deployment |

October browser evidence applies to the source exercised then, not November layouts/content. Technical review remains required; independent content/operations owners remain unassigned unless recorded separately.

Updated 2026-11-02. Current local implementation and evidence are consolidated above. Historical foundation records below retain their original scope.

## Workspace

Current follow-up, 2026-10-29: saved core features and both content releases have
local acceptance evidence in [deployment preparation](features/deployment-preparation.md).
The presentation decision selects `codex/connected-prototype` for this feature work.
The [deployment runbook](deployment.md) prepares hosting configuration without
deploying or waiving the remaining hosted gates. Older scaffold-only status below
is historical; current scope and evidence are in the feature guides.

The repository contains `frontend/`, `backend/`, app-service Compose configuration, CLI-managed Supabase configuration, and a cross-platform Node helper. Windows has `Setup-Asgard.cmd` for first-run setup and `Start-Asgard.cmd` for daily startup; Linux uses the documented Bash commands. The [Windows one-click onboarding guide](features/windows-one-click-onboarding.md) records launcher behavior and its review gate. Public entry is at `/`, historical sample fixtures remain in `frontend/src/fixtures/catalog.ts` but the current application screens use APIs or explicit unavailable states, and real service connectivity remains at `/status`. Standalone `/preview/...` routes have been removed; historical evidence below describes their earlier implementation. Historical frontend files in design/ui-reference remain unchanged references, not an executable application or approved API; no prototype backend/state behavior has been imported. The [Stage 3.5 handoff](stage-3.5-handoff.md) records the consolidation and pending manual review.

## Current foundation status and evidence

The original foundation evidence was reviewed on 2026-10-26; later source, local acceptance and catalog releases are summarized in [current local status](#current-local-mvp-status-2026-11-02). Dated records below describe their execution environments, not services every reader has running. Original branch names, counts and activation gates are historical snapshots. Human review, protected-PR enforcement and hosted gates remain pending.

### Current CI coverage

[checks.yml](../.github/workflows/checks.yml) runs on pull requests and pushes to `foundation`/`main`. Source checks include helper, frontend, backend, OpenAPI/client drift and container builds. The added isolated-core job starts an independent Supabase project with fresh credentials, applies migrations, verifies content-upgrade preservation/conflict rollback, and runs browser registration/verification and core flows with provider calls blocked. The production image also has a local port/non-root/shutdown check. Opt-in Auth/RLS tests retain their explicit environment gate. No hosted CI execution, native Linux run, hosted provider acceptance or backup scheduling is claimed by this source change.

## Foundation Git workflow

Accepted workflow, 26 October 2026: `foundation` is the development branch for completed Stages 1–4 until the foundation PR is accepted. `main` is the stable branch; the PR must use **base `main`, compare `foundation`**. Teammates use their own feature branches from the agreed reviewed baseline. Follow [AGENTS.md](../AGENTS.md#team-coordination) before editing or performing Git operations. Do not create additional task branches for the recorded foundation work or silently switch branches.

Historical consolidation record, 26 October 2026. The accepted plan was to fast-forward the existing branch to the inspected handoff commit, update only AGENTS.md and this guide, and verify content/history and publication scope without application changes or broad tests. `foundation` advanced from `ccadec0` to `442d15e7545fd2b9ec71529ee7f91038a217981f` using `git merge --ff-only`. This preserves its complete ancestry and incorporates the existing 56-file handoff without a duplicate or merge commit. `codex/gitignore-hygiene` points to that same handoff; `codex/stage35-canonical-ui` remains an older checkpoint. These branches were not deleted. No content from `main` was imported, and no new commit or push was made during consolidation. The documentation edits required their own reviewed commit and publication approval; later local documentation commits do not grant further publication approval.

Content inspection confirmed the Docker/configuration and Auth/Profile foundations, canonical UI/navigation, both versioned SQL migrations, the shared database probe, 29 authenticated contract stubs, generated OpenAPI/TypeScript, recommendation validation schemas, and handoff documentation on `foundation`. This establishes accumulated source presence, not completed feature or security acceptance. Intentional 501 feature responses and the existing manual UI, fresh-host, provider and hosted-security gates remain unchanged.

The local `main` inspected during consolidation was `c3ca40d`; it separately contained a broader `.gitignore` and `docs/Asgard-Stage-5-Team-Task-List.md`. Preserve both sets of ignore protections and that task document during any separately approved integration. Both histories independently added `.gitignore`, so its add/add conflict must be resolved before the PR can merge. Do not merge `main` or replace either file wholesale merely to clear the conflict. Remote freshness/protections remain unverified because the read-only Git remote request failed; cached `origin/*` refs are not current server evidence.

Publication procedure, requiring separate approval for each mutation:

1. Confirm the active branch is `foundation`, inspect the worktree/index, and refresh/compare the remote state before publishing. Stop if unexpected edits or divergent remote work appear.
2. Review the focused workflow-documentation diff, then commit only the approved files if explicitly authorized. Existing application work is already in handoff commit `442d15e`; do not recreate the old Stage 3.5/4 commits.
3. Inspect the proposed `foundation` versus `main` changes and any new secret-scan findings. Resolve the `.gitignore` overlap through a separately approved integration operation, preserving `main`'s task document. Request a decision for ambiguous conflicts.
4. After explicit push approval and confirming the remote branch has not diverged, push `foundation` normally. Do not force-push or change `main` directly.
5. Open the PR with base `main`, compare `foundation`; include the existing verification evidence and outstanding gates. Obtain the required eligible human review and hosted CI evidence before any separately approved merge. Remote protection must be verified separately.

Historical consolidation verification: at that inspection, the committed `foundation` tree exactly matched the inspected source branch at `442d15e`; `main` remains at `c3ca40d`. At that inspection, only AGENTS.md and this guide had uncommitted changes, and the index was empty. All 51 local links/anchors in those two documents resolve, obsolete publication commands are removed, and whitespace checks pass. The heuristic secret scan found no matches in 166 current text files or 293 historical text blobs across ten locally referenced commits, including exact comparisons against two local secret values without printing them. No currently tracked file matches the ignore rules. The verification script initially failed while reading UTF-8 through the host's default encoding; explicitly reading UTF-8 corrected that check without an application change. Broad tests, database/browser checks and remote refresh were not repeated during this history/documentation-only operation; previous acceptance limits remain in force. At that inspection, the local branch was one existing commit ahead of cached `origin/foundation`, not yet pushed. This is a historical comparison, not current remote evidence.

The branch workflow is recorded under the recorded explicit authorization; technical review, commit/push permission and PR approval are separate. Historical branch names and verification records below describe earlier work, not current instructions. Do not execute superseded publication sequences or delete checkpoint/team branches as part of this consolidation.

## Local workflow

[README](../README.md#getting-started) is the teammate onboarding entry point: prerequisite installation links, separate PowerShell/Bash first-time commands, daily startup, shutdown and troubleshooting. Run root `npm ci` to install the locked local CLI; after the first-start provisioning prerequisite in README is satisfied, use `node scripts/dev.mjs start`. Application dependencies are installed by Docker builds, not host npm/pip. No cloud credentials are needed; the helper manages ordinary local URL/anonymous-key values, while local signing-key and authenticated application credentials need separate provisioning. The commands below were executed on Windows; their shared Node implementation and Linux-container checks do not establish native Linux-host acceptance.

Windows verification used Node 24.19.0, npm 11.17.0, Docker Engine 29.8.2 and Compose 5.5.1. The backend remains Python **3.13.17** in Docker; host Python 3.14 is not used. Image digests, root/frontend npm locks, and exact hashed backend locks are preserved. No dependency or runtime upgrade was introduced by hardening.

The helper checks Docker's Linux server, CLI version and port availability; creates a missing root `.env`; starts CLI-managed Supabase; regenerates local project ID, URL, anonymous key and CORS; performs a migration dry-run; starts app services with Compose health waits; and verifies connectivity. It does not print credentials, apply migrations to an existing database, reset data or stop other projects. Supabase itself can initialize an empty database with the committed migrations during first startup; that initialization needs approval before invoking startup. The active Auth config references ignored `supabase/signing-keys.json`; neither this file nor an application database credential is generated by `scripts/dev.mjs`. A completely fresh checkout therefore has a provisioning prerequisite, even with application Auth disabled. It exits on the first failure. Existing custom environment entries survive regeneration; conflicting shell overrides are rejected. First startup may download images.

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

Compose and CLI project IDs default to `asgard-foundation`. The helper reads `supabase/config.toml` and puts its project ID into root `.env`; Compose uses that value for its own name and external network. A second checkout with the same ID shares local resources: it is not an isolated environment. Do not rename IDs to resolve a port conflict without an reviewed local configuration change. The isolated verification copy used its own ID and ports explicitly to avoid touching the normal stack.

The frontend talks to `backend:8000` over Compose's default network. Only the backend additionally joins `supabase_network_asgard-foundation`, created by the CLI. Its local Supabase URL is `http://supabase_kong_asgard-foundation:8000`; PostgreSQL is reachable as `supabase_db_asgard-foundation:5432`. This uses Docker DNS and container ports on the same local daemon on either target host, avoiding `host.docker.internal`, host gateway routes and OS-specific bridge addresses. Supabase must start before Compose; stop Compose before Supabase. CLI project/network/container naming is tied to pinned CLI 2.122.0 and must be reverified on upgrades. Remote Docker contexts, independently configured WSL daemons, rootless engines and ARM hosts are not verified targets of this evidence.

App ports bind to loopback. The pinned CLI publishes Supabase ports on host interfaces; use the local development stack on a trusted machine/network with appropriate firewall access. This is not a hosting configuration. No Supabase services are duplicated in Compose.

Bind paths are repository-relative, with no user path or drive letter. Frontend source/index and backend app/tests/scripts/schema are mounted; dependencies, build output and caches stay in the images/container workspace. Vite polls source for Windows mounts. App processes run as non-root users. On Linux, the checkout must be readable by those users; do not run npm or the helper with sudo. A checkout owned by another user or overly restrictive directory permissions may require its owner/admin to correct access. Code/file permissions are not automatically changed. Shared source/config changes outside mounts require rebuilding. Dockerfiles and scripts use consistent filename case; `.gitattributes` enforces LF for Node helpers and Dockerfiles.

## Contracts and migrations

`node scripts/dev.mjs generate-api` exports schema/types through stdout and writes them as the host user, avoiding container UID ownership problems on bind-mounted files. Review `backend/openapi.json` and `frontend/src/api/generated/schema.d.ts` together after approved contract changes. Generated client drift is checked without changing source. Health/readiness and the working Profile API are joined by the Stage 4 contract scaffolding described below. A generated operation does not establish implemented feature behavior.

Supabase SQL migrations remain the only schema authority. The Auth/Profile migration and additive Stage 4 migration are versioned in `supabase/migrations`; `seed.sql` inserts no rows. The CLI initializes a fresh local stack; retained local databases are never reset by the helper. Existing-database migration changes require explicit review and application. Startup checks the pinned CLI's dry-run result and stops when migrations are pending; it does not run a migration-apply command. CLI warnings about skipping `.gitkeep` are expected.

The following read-only commands were executed:

```text
npx --no-install supabase migration list --local
npx --no-install supabase db push --local --dry-run
npx --no-install supabase db lint --local --level error
```

After review, migration application belongs to the CLI's explicit local push workflow. Do not use database reset, migration-history repair or seed reapplication as onboarding fixes. The historical infrastructure checks above did not establish application-role/RLS, session-pooler or product-auth acceptance. Stage 3 and Stage 4 evidence have their own boundaries below. Auth health is a reachability probe only; PostgreSQL negotiation is not authenticated SQL access from FastAPI.

### Stage 4 shared contracts and handoff

Closure verification, 26 October 2026. Bounded plan: inspect runtime-role metadata/membership read-only; adapt only the existing local rollback probe to an already-authorized fixture login; run the focused ownership/integrity check once with at most one correction/retry; review the four workstream boundaries and changed-file publication scope; record evidence here. Requirement coverage remains REQ-02–05/07–11/13 and A-05/10/11. No production grants, authentication architecture, feature behavior, dependency or migration changes are planned. Existing Stage 3.5 edits remain outside the verification fix.

26 October 2026; execution reference and owner/reviewer are in the [bounded record](#stage-4-bounded-execution-record). This is foundation support for the listed requirements, not acceptance of feature workflows. The local database verification blocker is resolved; technical review and the team/publication gate remain outstanding.

**Persistence.** [20261026000100_shared_foundation.sql](../supabase/migrations/20261026000100_shared_foundation.sql) is additive and was applied locally through the existing CLI. Auth/Profile data and migration `20261025000100` were preserved. No content was seeded.

| Owner | Entities and shared relationships |
| --- | --- |
| Catalog | `asgard_catalog.releases`, `categories`, `careers`, `roadmaps`, `milestones`, `branch_groups`, `branches`, `topics`, `topic_prerequisites`, `resources`. UUID identities; career→roadmaps→milestones/topics; composite FKs keep topic/branch/prerequisite references in their authored roadmap/milestone. Positions distinguish common topics from explicit alternatives. Resources record free access, source license and review date. |
| Discovery | Published `questionnaires`/`questions` register versioned identities without questionnaire content. Private `discovery_sessions` and `discovery_answers` retain drafts/completions and same-owner retake sources. One draft/account; accepted sessions/answers are immutable. The selected flow supports conditional later questions/choice sets; route publication, active-answer validation, and inactive-answer persistence behavior need an approved implementation contract. |
| Learning Progress | Private `learning_state` stores explicit current roadmap, optimistic version and recommendation context revision; `topic_progress`, `branch_choices`, append-only `progress_events`, and reversible `completion_activity` preserve independent roadmap histories. One Learning topic/account; unique topic/local-date contribution. Stored local dates remain stable when preferences change timezone. |
| Preferences | Private `preferences` stores preferred category, IANA timezone, dismissed guidance IDs and optimistic version. It does not change learning focus or recommendation context. |
| Recommendations | Private `recommendation_runs` and immutable `recommendation_items`: same-owner completed Discovery reference, context/catalog/prompt/schema revisions, immutable versioned fact snapshot, idempotency key, deadline, safe failure codes and optional catalog destinations. One pending run/account, at most three distinct careers, relational career→roadmap→topic checks, nonempty/current/nonexpired completion guard. |
| Analysis budget | Private `analysis_attempts` persists each reserved provider attempt (including retries); `analysis_daily_budget` stores only aggregate UTC-day counts, with no account identities. This supports a future atomic cross-account budget without exposing other accounts' private attempt rows. No quotas are claimed enforced yet. |

Both schemas remain outside the PostgREST exposed schemas. `anon` and browser `authenticated` receive no access. Catalog is read-only to `asgard_app`, with drafts hidden; published and retired references remain readable for history. New private tables force owner RLS using the existing transaction-local verified identity. Runtime grants permit only needed operations: event/item/attempt records have no UPDATE/DELETE; branch-choice and activity DELETE support explicit choice clearing and undo. Ordinary app access cannot delete catalog/history. Auth deletion cascades private account rows; catalog foreign keys restrict destructive removal. Retire content instead of deleting referenced identities. Materially changed outcomes get new topic IDs; corrections increment revisions and retain identities. Content editing/publication is outside this stage.

**Concurrency protocol.** Feature owners must reuse the existing restricted-role/session validation transaction pattern, apply explicit `user_id` predicates, and compare `expected_version`/`expected_revision` before writing. Zero version means insert-if-absent, never overwrite. Lock `learning_state` before learning/focus/branch changes; SQL guards serialize these mutations on that row and prohibit focus/branch switches excluding unresolved Learning. Only explicit Done/Skip/Clear resolves Learning. Update record versions/timestamps in the same transaction. Discovery saves lock the session and increment its revision once per accepted checkpoint; final acceptance atomically completes that exact revision before requesting generation. SQL rejects edits to completed answers; questionnaire option validity, exclusions and five-answer completeness remain Discovery service responsibilities. Initialize `learning_state` without a focus before creating its dependent records; this is not automatic roadmap selection.

Recommendation snapshots contain versioned permitted facts and catalog release identity, never raw provider output. Before future provider calls, the Recommendations service must reserve quota atomically (shared daily counter plus owner attempts), reuse eligible identical context/catalog/prompt/schema results, resolve duplicate idempotency requests, and expire abandoned pending runs. Successful persistence must recheck account/session, relevant revisions, published catalog membership and provenance; SQL adds pending uniqueness and stale/expired-completion defense. Generation/retry and quota enforcement remain unimplemented. No transaction may span a provider call. The existing session gate remains mandatory for every protected operation, including Catalog.

**API inventory.** [FastAPI route scaffolding](../backend/app/api/foundation.py) registers every operation below under `/api/v1`. All 29 operations require Bearer identity via the existing verifier. The original scaffold returned `501 not_implemented` for all operations. The 27 October [persisted-core source follow-up](features/persisted-core.md) supplies 18 core handlers using unchanged contracts; the connected-prototype follow-up subsequently supplies all seven Discovery and four recommendation handlers. No new handler is runtime-verified. Auth-disabled requests still return 503; invalid/missing sessions return 401. Profile routes are unchanged. Common error envelope: `code`, safe `message`, `request_id`; HTTP `X-Request-ID` is preserved and private responses use `Cache-Control: no-store`. Future handlers use 404 for unknown or nonowned IDs, 409 for revision/Learning/context conflicts, 422 for invalid input, 429 with Retry-After for owned quotas, and 503 for unavailable dependencies. Do not reveal another account's resource existence.

| Method and relative path | Request → response schema |
| --- | --- |
| GET `/discovery/questionnaire` | Current published identity registry → `Questionnaire` (content authored separately) |
| GET `/me/discovery` | → `DiscoveryState` (draft and latest completion, both nullable) |
| POST `/me/discovery` | `StartDiscovery` → `DiscoverySession` (create/resume compatible draft) |
| GET `/me/discovery/{session_id}` | → `DiscoverySession`, including saved answers |
| PATCH `/me/discovery/{session_id}/answers` | `SaveDiscovery` → `DiscoverySession`; upsert supplied round answers only, preserve other rounds |
| POST `/me/discovery/{session_id}/complete` | `CompleteDiscovery` → `DiscoverySession` |
| POST `/me/discovery/retake` | `RetakeDiscovery` → separate draft `DiscoverySession` copied from same-owner completion |
| GET `/me/dashboard` | → `Dashboard` |
| GET, PATCH `/me/preferences` | Read / `SavePreferences` → `Preferences` |
| GET `/categories` | → `Category[]`, authored position order |
| GET `/careers` | Optional `q`, `category_id`, `limit`, `offset` → `CareerPage`, including `catalog_release_id` |
| GET `/careers/{career_id}` | → `Career` |
| GET `/roadmaps/{roadmap_id}` | → nested `Roadmap` |
| GET `/roadmaps/{roadmap_id}/milestones` | → `Milestone[]` |
| GET `/roadmaps/{roadmap_id}/topics/{topic_id}` | → `Topic` |
| GET `/roadmaps/{roadmap_id}/topics/{topic_id}/resources` | → `Resource[]` |
| GET `/me/recommendations` | → `RecommendationState`, with nullable current and previous eligible success |
| POST `/me/recommendations` | `RequestRecommendations` → 202 `RecommendationRun`; explicit update uses this same operation |
| GET `/me/recommendations/{run_id}` | → `RecommendationRun`, including generation status |
| POST `/me/recommendations/{run_id}/retry` | `RetryRecommendations` → 202 `RecommendationRun`; explicit retry of failed work with current revisions |
| GET, PATCH `/me/learning` | Read / `SelectRoadmap` → `LearningState` |
| GET `/me/roadmaps/{roadmap_id}/progress` | → `TopicProgress[]` |
| PATCH `/me/roadmaps/{roadmap_id}/topics/{topic_id}` | `SaveTopicProgress` → `TopicProgress`; Clear uses `not_started` |
| GET `/me/roadmaps/{roadmap_id}/branches` | → `BranchChoice[]` |
| PATCH `/me/roadmaps/{roadmap_id}/branches/{group_id}` | `SaveBranchChoice` → `BranchChoice` |
| GET `/me/roadmaps/{roadmap_id}/summary` | → `ProgressSummary`, authored next topics and branch-aware counts |
| GET `/me/activity` | Required `month=YYYY-MM` → `ActivityMonth` |

Shared schema primitives live in [api/contracts.py](../backend/app/api/contracts.py); feature DTOs live in each new `backend/app/modules/{discovery,careers,roadmaps,progress,recommendations}/schemas.py`. IDs are UUIDs except versioned question/option/fact/message identifiers. Unknown body fields, including owner IDs, are rejected. Versions are positive strict integers (expected version can be zero). Bounded answer/identifier fields and unique submitted questions/options are validated; authored option meanings/exclusions are not invented. Timezones use IANA names. Career search matches titles and skills, case-insensitively; category filters intersect the search. Pagination is offset-based (`offset >= 0`, default 0; `1 <= limit <= 100`, default 20), with filtered `total`; deterministic title then UUID ordering. Lists return published entries; direct historical references can return retired entries with notices. Resources/topics use authored positions; empty lists mean actual empty data, not a stand-in for backend failure.

**Recommendation trust boundary.** [recommendations/schemas.py](../backend/app/modules/recommendations/schemas.py) separates `UntrustedRecommendationOutput` from `ValidatedRecommendationItem` and API `RecommendationRun`. The backend alone constructs `RecommendationContext` from immutable completed Discovery and relevant learning facts. Fact IDs resolve within the exact snapshot/revision. Optional document/analysis reference types reserve provenance only; extraction, active-document validation/removal suppression and their persistence remain the future PDF feature's responsibility. No PDF API/processing/storage was added. `validate_recommendations` rejects unknown careers, mismatched roadmap/topic relationships and unsupported evidence IDs using backend-supplied published catalog membership. No scores or extra model fields are permitted, and results contain one to three distinct careers. Safe failure/status combinations are validated. Human-readable explanation accuracy, prohibited competence/readiness claims, uncertainty/diversity policy, publication/revision/account rechecks and document suppression require service validation and the F-002 quality gate; schema validity alone does not prove them. No model calls or prompts exist. Optional starting-topic destinations are reserved contract fields; AI starting-topic advice is not enabled or approved as baseline behavior under REQ-08. Authored next-topic guidance belongs to Progress.

**Frontend conventions.** [Generated schema.d.ts](../frontend/src/api/generated/schema.d.ts) is consumed by the existing typed [openapi-fetch client](../frontend/src/api/client.ts); do not duplicate DTOs. [query-keys.ts](../frontend/src/api/query-keys.ts) prefixes future feature keys with account UUID and includes every search/page dimension. Invalidate the `learning` prefix plus Dashboard/recommendations after accepted learning mutations; Discovery updates invalidate Discovery/recommendations/Dashboard; preferences only invalidate preferences/catalog defaults. These are conventions, not feature hooks. Existing Profile keys and behavior are preserved to avoid overlapping Stage 3.5 edits. AuthProvider already cancels and clears the entire QueryClient on logout/account changes, while auth transport aborts previous-account requests; retain `isCurrentAccount` guards before applying mutation results. Do not persist private query caches to browser storage.

Use existing no-retry defaults for mutations and no automatic provider generation on visits/refetch. Future read adapters use TanStack's abort signal, generated error bodies and [APIRequestError](../frontend/src/api/errors.ts) to preserve status/code/request ID. Render initial loading separately from actual empty data; failed writes retain local input and never show saved state. 409 requires explicit reload/resolution, 429 respects Retry-After, and 501 shows unavailable functionality without retry loops or invented content. Render explanation strings as text. Current feature screens use shared loading/error/empty panels and account API reads; they do not fall back to historical fixtures. This source integration has no new verification evidence.

**Integration boundaries.** Discovery owns accepted answer context; Catalog owns published identity/membership and authored ordering; Recommendations owns validated saved explanations/status; Progress owns focus, branch/status history, activity and calculated summaries. Dashboard composes those contracts rather than maintaining duplicate progress/recommendation rules. Profile/preference changes do not imply learning changes. Retakes/failures preserve previous eligible successful recommendations and all learning history. Document-dependent fallback results must be suppressed after removal by the future lifecycle service. No team assignments, feature schedule or additional infrastructure were created.

**Verification and remaining gates.** The local additive migration applied once without reset. Initially the rollback-only [SQL probe](../backend/scripts/check_foundation.sql) failed before its RLS/integrity assertions because its `postgres` login could not assume `asgard_app`; the original correction/retry was stopped and all fixtures rolled back. The recorded separate final-verification request authorized the targeted closure below.

Read-only closure inspection confirmed that FastAPI's configured connection actually logs in as `asgard_app` (`current_user = session_user = asgard_app`, superuser/bypass-RLS both false). Repository code checks that role, validates the account/session and sets transaction-local identity; it does not assume a browser Supabase role. `asgard_app` exists and can log in. `postgres` is a member but its membership has `set_option = false`, and `pg_has_role(..., 'SET')` is false. This was a verification-login mismatch, not missing application credentials or a need to elevate the application role. The existing local `supabase_admin` is already authorized to assume the restricted role. The sole probe fix uses that existing login for synthetic fixtures, then `SET LOCAL ROLE asgard_app` for ownership/integrity assertions; anonymous/browser denial checks use their actual roles. No role, grant, RLS policy, migration, password or application configuration was changed.

The corrected probe passed on its first closure run and printed `PASS` followed by `ROLLBACK`. Verified: owner visibility and other-account invisibility across all 11 new account-owned tables; other-account preference update/insert denial; no-identity private access denial; anonymous private/catalog denial and browser-authenticated private denial; application catalog-write denial; mismatched roadmap/topic FK rejection; immutable completed Discovery answers; one Learning topic/account; focus/branch resolution guards; topic/local-date activity uniqueness; distinct/bounded recommendation items; one pending run/account; stale-result completion rejection and completed-result immutability. Read-only metadata also confirmed ENABLE/FORCE RLS on all 24 new tables and the existing Profile table. The aggregate daily budget deliberately contains no account data and has a backend-only policy. Administrator setup exercised the allowed fixture path; all fixtures and the temporary helper were rolled back. These are database-role/constraint assertions, not new end-to-end Auth/session tests or a simultaneous-request timing/load test. Existing DB unique indexes and common-row locking provide the tested invariant mechanisms; feature services still must follow the documented transaction protocol.

The following PowerShell check was executed successfully from the repository root. It uses the existing local administrator only inside this rollback fixture probe, never as the application's runtime connection. Stop on any error; do not grant role membership to make it pass.

```powershell
Get-Content -Raw backend/scripts/check_foundation.sql |
  docker exec -i supabase_db_asgard-foundation psql -X -U supabase_admin -d postgres --set ON_ERROR_STOP=1
```

Final focused checks passed: Ruff for changed Python modules/tests; `pytest -q -p no:cacheprovider tests/test_foundation_contracts.py` (3 passed); `node scripts/dev.mjs generate-api`; backend `python scripts/export_openapi.py --check`; frontend `npm run check:api` and `npm run typecheck`. The same narrow checks were repeated only after contract refinements; the line-length corrections passed their affected Ruff rerun. The existing Starlette/httpx deprecation warning remains; no dependency change was made. All 29 local links/anchors in this guide resolved, and the changed tracked foundation files passed `git diff --check`. The targeted tests verify authenticated stub/error behavior, strict mutation inputs, distinct/catalog-linked AI output and evidence references. No full regression suite, browser automation, Docker rebuild/restart, provider calls or extensive UI verification was run. UI/Auth preservation is supported by unchanged source boundaries and typechecking; rendered parity and prior Stage 3.5 manual acceptance remain pending, not re-certified here. No design/product specification update was needed because this stage changes shared technical contracts without changing their approved behavior or presentation.

Feature business services/repositories, catalog/questionnaire authoring/publication (including graph/resource quality), quota enforcement, recommendation generation/reuse/retry, PDF lifecycle, completion/streak calculations and real feature fetching are intentionally unfinished. Hosted pooler/operations/privacy/Auth-provider gates remain scoped to their existing owners. No commit, push, merge, reset or discard was performed.

### Stage 4 parallel readiness and publication

Readiness: **Yes with restrictions**. The database closure passes, and no additional shared architectural redesign was identified for the four requested workstreams. Discovery/Dashboard has stable questionnaire/session/revision identities and composable summary contracts; Catalog/Roadmaps has stable authored career/path/topic relationships; Recommendations consumes accepted Discovery and published Catalog identities with persisted provenance; Progress owns learning focus/history/calculations and supplies Dashboard/roadmap summaries. Every stream uses the same generated TypeScript contracts, authenticated account identity and explicit ownership/session transaction pattern. The 29 scaffolding operations intentionally remain 501. Future feature acceptance and real-user/hosted gates are separate from foundation readiness.

Feature logic belongs in its owning module. Coordinate edits to the shared route registration/scaffolding, migrations and generated schema/client through technical review; do not overwrite other streams' registrations or independently hand-edit generated DTOs. This is an integration boundary, not a new feature assignment.

Before independent feature implementation, review SQL/shared contracts, establish a reviewed common base and verify protected PR checks. Any contributor may independently review; there is no repository-wide named assignment. Remote branch/ruleset inspection previously returned 404, so remote protection remains **unverified**. Removing the local assignment does not change remote rules. Require eligible independent PR approval and passing CI before an explicitly authorized merge. Existing remote feature branches do not prove that they contain the reviewed baseline; earlier visual/manual acceptance retains its own evidence limits.

Publication review found 48 existing changed-file candidates (three additional tracked deletions), with no matches for current local database credential values or common private-key/provider-token patterns and no accidental build/cache/test-output files. This is a bounded candidate-file scan, not a repository-history secret audit. `.env` and `supabase/signing-keys.json` are ignored and are not commit candidates. `backend/openapi.json` and `frontend/src/api/generated/schema.d.ts` are required generated contracts, not accidental output; the new SQL migration is present. Other application/UI edits predate Stage 4 and are preserved as Stage 3.5 scope.

Closure documentation checks passed: all 30 local links/anchors resolve; the two publication manifests cover all 51 changed paths exactly once (30 Stage 3.5, 21 Stage 4); the PowerShell publication block parses without executing it; changed tracked documentation passed whitespace checks. Previously passing Python/frontend/OpenAPI checks were not repeated because no corresponding implementation changed. Only the SQL probe and this guide changed during closure; the migration and generated contracts remain intact.

Portability follow-up, 26 October 2026. Scope: A-07 code ownership and portable documentation/publication instructions (QA-11 support); affected files are `historical named review assignment (removed 2026-11-02)`, this guide, and the historical UI reference README/audit provenance paragraphs. Replace personal checkout paths with a repository-root precondition and external-archive names, preserve historical findings and reference source, keep relative documentation links, and check owner syntax, links, publication manifests and PowerShell syntax. No application, database, dependency or remote-setting changes are authorized by this follow-up. Localhost URLs refer to each developer's own running stack; Docker service/project names are the shared configured defaults, not personal-machine identifiers. Native Linux-host onboarding still requires its separately recorded evidence.

Follow-up checks passed: owner-file syntax/content, all 43 local links/anchors across the three edited Markdown files, publication PowerShell syntax (parsed only), whitespace, and exact manifest coverage of 54 changed paths (30 Stage 3.5, 24 Stage 4/follow-up). A repository Markdown scan found no remaining absolute personal filesystem paths. Database/source/browser checks were not repeated for these ownership/documentation-only edits; the Stage 3.5 handoff's manual navigation checklist remains pending.

Final README/AGENTS handoff pass, 26 October 2026: authorized by the recorded request in the decision record. Scope: portable README prerequisites/startup descriptions, AGENTS contributor guidance and this cumulative publication record (A-07/A-11 and QA-11 documentation support). The instructions were compared with `.node-version`, package manifests/locks, Dockerfiles, Compose, `.env.example`, active Supabase config and existing scripts. No runtime, dependency, migration, Auth configuration or service change was made. README now distinguishes host tools from container packages and first-start provisioning from ordinary startup. The active config's ignored signing-key requirement is an actual fresh-clone prerequisite not fulfilled by `scripts/dev.mjs`; its CLI generation capability was checked through help only, without generating keys. The helper also does not initialize the restricted application's password. Therefore authenticated fresh-host onboarding remains incomplete until environment-specific approved provisioning; existing local Stage 4 database verification is still valid and was not rerun. Native Linux-host acceptance and the manual Stage 3.5 navigation checklist remain pending. This pass does not authorize a new setup service or silently grant new-environment activation.

Historical pre-handoff branch: `codex/stage35-canonical-ui`; the current owner workflow is [foundation Git workflow](#foundation-git-workflow). Stage 4 and its ownership/portability/documentation follow-ups covered the following **26 files** (directory entries below each contain only `__init__.py` and `schemas.py`):

```text
historical named review assignment (removed 2026-11-02)
AGENTS.md
README.md
backend/app/main.py
backend/app/api/contracts.py
backend/app/api/foundation.py
backend/app/modules/careers/{__init__.py,schemas.py}
backend/app/modules/discovery/{__init__.py,schemas.py}
backend/app/modules/progress/{__init__.py,schemas.py}
backend/app/modules/recommendations/{__init__.py,schemas.py}
backend/app/modules/roadmaps/{__init__.py,schemas.py}
backend/openapi.json
backend/scripts/check_foundation.sql
backend/tests/test_foundation_contracts.py
docs/development.md
docs/design/ui-reference/README.md
docs/design/ui-reference/audit.md
frontend/src/api/generated/schema.d.ts
frontend/src/api/errors.ts
frontend/src/api/query-keys.ts
supabase/migrations/20261026000100_shared_foundation.sql
```

`docs/development.md` and README also contain preserved Stage 3.5 context/corrections. These cumulative changes are now included in handoff commit `442d15e` on `foundation`. The former Stage 3.5 manifest covered 29 presentation/documentation paths, including three intentional deletions. Review that scope through the [Stage 3.5 handoff](stage-3.5-handoff.md) before publication. Do not treat those changes as verification fixes. No dependency lockfile, Auth provider/transport, Profile repository/API, existing migration, infrastructure file or design asset was modified by the historical closure.

A separate `.gitignore` modification appeared during the final README/AGENTS review. That historical task inspected it read-only and excluded it from its two manifests. The combined 55 manifest paths and the additional `.gitignore` change were subsequently committed together in `442d15e` (56 changed paths), now incorporated into `foundation`. Those counts describe the historical handoff, not the current worktree. Review its ignore rules alongside the separately changed `main` version before integration.

Final documentation checks passed: 85 local links/anchors across README, AGENTS and the three affected guides; runtime pins matched the repository manifests/Dockerfiles; no absolute personal filesystem paths remained in the Markdown scan; publication syntax and whitespace checks passed. The manifests cover the 55 intended paths without duplicates, with only the separately preserved `.gitignore` edit excluded. No fresh-host installation, application regression rerun, browser walkthrough, database recheck, commit or push was performed for this documentation pass.

README environment-instruction follow-up, 26 October 2026: scope accepted. Scope is README's root `.env` creation, variable ownership, managed-value refresh, existing approved credential-initializer command and activation/recovery boundaries. Source authority: `.env.example`, Compose, `scripts/dev.mjs`, `scripts/dev-config.mjs` and `scripts/provision-local-db.mjs`. Existing commands are documented without running provisioning, changing any secret, overwriting `.env`, enabling Auth or starting/restarting services. Preserve the first-start signing-key prerequisite; do not imply that editing `.env` completes fresh-host Auth validation. Documentation links, command syntax and variable coverage are the appropriate checks for this prose-only change.

Environment-instruction checks passed: all 11 `.env.example` variables are documented, the seven helper-managed variables match source, referenced scripts exist, 86 local links/anchors resolve across the five affected guides, both README PowerShell blocks parse, and diff whitespace checks pass. No secret values were read for these checks; no setup/provisioning command was executed. The separate `.gitignore` edit and existing application changes remain preserved.

Signing-key explanation follow-up, 26 October 2026: scope accepted. The locked CLI's `gen signing-key --algorithm ES256 --append` was probed in an isolated temporary directory, with no Supabase services or application environment activated. Appending with a missing file failed; one focused correction created a new empty JSON array first, and the retry produced exactly one valid ES256 private JWK in the configured file. No private key was printed, and the temporary key/directory were removed. Current Asgard keys, `.env` and database credentials were not modified. README now documents guarded first-time PowerShell key creation, the existing local credential-initializer sequence, and the stop conditions. This proves the isolated key-file command, not fresh-host Auth/session or native Linux onboarding acceptance. No application, migration, dependency or security-model change was made.

Windows onboarding and task-planning follow-up, 26 October 2026: requested and implementation plan approved by independent review in the decision record. Scope: QA-11 bootstrap support and teammate instructions. Files: `Setup-Asgard.cmd`, `Start-Asgard.cmd`, `scripts/setup-windows.mjs`, README and this guide. The setup launcher checks Node/Docker, installs the locked CLI when missing, offers a confirmation-gated fresh local initialization and Auth activation, then opens the app and local email inbox. It never resets/deletes Docker data, overwrites existing local credentials, or activates Auth without a second confirmation. Daily startup uses the existing helper. Linux remains on the documented Bash flow. Dependencies, schemas, API contracts and feature behavior are unchanged. README now describes tool-neutral implementation task preparation. Syntax/whitespace/link checks are reported with this handoff; the launchers have not been exercised on an independent fresh Windows machine. Native Linux acceptance remains pending.

Feature documentation policy, 26 October 2026: accepted as a documentation policy. Every feature implementation now creates or updates a named, dated guide under `docs/features/`, with behavior, source references, acceptance coverage, verification and remaining limitations. AGENTS owns this requirement and requires a guide link in the review handoff. The Windows onboarding guide is the first entry. README now highlights the two launchers and links their instructions near the top. This follow-up changes documentation only; independent launcher acceptance remains pending.

The former two-commit publication sequence targeted `codex/stage35-canonical-ui` and is superseded by the [foundation Git workflow](#foundation-git-workflow). Its changes already exist in `442d15e`; do not repeat its staging/commit operations or publish that obsolete branch as the foundation baseline. Share the reviewed common `foundation` commit with teammates after the publication and review gates are satisfied. This documentation update does not publish the branch or approve integration.

For optional browser checks, the already verified host workflow remains:

```powershell
Set-Location frontend
npm ci
npx playwright install chromium
npx playwright test --reporter=line
```

In Bash, use `cd frontend` instead of `Set-Location`. Host frontend packages and browser installation are needed only for these optional Playwright checks, not for app startup or `node scripts/dev.mjs check`. A native Linux Playwright installation/system-library setup has not been exercised here.

## Stage 2 hardening evidence

Startup correction, 25 October 2026: the user reported `Unexpected token 'L'` when running the PowerShell helper. The migration dry-run parsed the CLI's default output as JSON without explicitly requesting JSON. It now passes `--output-format json`. Verified against pinned CLI 2.122.0 with both `--agent no` and `--agent yes`; both returned valid dry-run JSON. The exact `scripts/start-local.ps1` startup then reached READY with all connectivity probes passing, and all 4 helper configuration tests passed. No migration was applied or database reset performed. This focused fix awaits technical review.

25 October 2026. Scope: onboarding scripts/environment, local Docker networking, setup documentation and verification; partial A-06/A-11 and QA-11 evidence. Shared product contracts, dependencies, UI, database schema and auth behavior are unchanged. Technical review remains required before integration.

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

The isolated verification stack was stopped with Compose down followed by CLI stop; its containers are gone and its database/storage volumes are retained. The normal stack remains ready on the documented default URLs, and the original database identity is unchanged. Docker's temporary outage is resolved. Final syntax, local-link/anchor and diff-whitespace checks passed. No commit, push, merge, deployment, database reset or volume deletion was performed. Available-environment hardening is ready for technical review; native Linux-host acceptance and an independent clean-clone walkthrough remain outstanding, with follow-up ownership unassigned.

## Stage 3 authentication and Profile review gate

Historical source-review record, 25 October 2026. The pre-activation statements and check results in this section describe that review only. Subsequent local-only activation is recorded in [Decisions](decisions.md#authority-and-status); the [current status](#current-foundation-status-and-evidence) and README govern new work and environment setup. These records do not transfer activation approval between environments.

25 October 2026 — source implementation authorized through recorded acceptance to the bounded Stage 3 plan. Coverage: REQ-01/13 and the name-only part of REQ-11; partial QA-01/07/09/11. The two pre-existing startup-format corrections are preserved. This remains on `foundation`; no commit or push was performed.

Historical pre-activation status, 25 October 2026: the second approval gate was closed. The SQL draft, [now versioned after local activation](../supabase/migrations/20261025000100_auth_profile_foundation.sql), was outside the active CLI migrations directory; the [Auth configuration candidate](../supabase/config.auth.toml.pending) was not the active config file. Neither could execute through normal startup at that review. Moving the SQL and activating the Auth settings required separate approval. Signup was disabled, and no signing key or application DB password had been provisioned at that point. Subsequent local-only approval and execution on 26 October are recorded in [Decisions](decisions.md#authority-and-status). `ASGARD_AUTH_ENABLED` still defaults to false in fresh environments. Building/testing source does not authorize activation elsewhere or a database reset. The evidence below retains its pre-activation scope.

The credential initializer now writes the random password to ignored `.env` atomically before changing the local database role, then restores the prior `.env` if role provisioning fails. It refuses to replace an existing database URL and requires the explicit approval flag. This ordering ensures a failed `.env` write cannot leave the database role with a new password that was never saved locally.

### Implemented source boundaries

- Official Supabase browser SDK owns password/OTP/session operations. Connected forms support registration, explicit code verification, resend feedback, login, SDK restoration/refresh and current-session logout. The Stage 3 source then retained disconnected preview forms when Auth was disabled; Stage 3.5 replaced them with the canonical account-entry implementation and unavailable-configuration states. Google, TOTP enrollment, recovery, deletion, uploads, preferences, careers and learning persistence are not implemented by this slice.
- At Stage 3, `/settings/profile` was the protected, temporary post-authentication destination and `/preview/...` displayed isolated fixtures. Stage 3.5 supersedes those destinations: verified registration opens `/welcome`, login opens `/dashboard`, and the standalone Preview routes are removed. Query caches and request tokens remain separated by account; account changes abort old requests, and an old response cannot sign a newer account out. Browser session state is not a backend authorization boundary.
- FastAPI verifies ES256 signature, issuer, authenticated audience/role, expiry, issued-at, UUID subject/session and assurance claims through a bounded trusted JWKS fetch/cache. No symmetric fallback, unverified JWT decoding for authorization, token-supplied key URL or custom password store is introduced. The public issuer differs from the internal Docker URL used to fetch keys. At that pre-activation review, actual local ES256 issuance/JWKS integration awaited activation testing; this historical statement does not override the later local activation record.
- Profile API: `GET /api/v1/me/profile` returns `{profile: null}` before first save; `PATCH` creates or updates only the authenticated owner's names. The request contains `first_name`, optional `surname` and `expected_version` (zero on creation). The successful PATCH response requires a non-null profile. Updates use a version condition; stale saves return 409, preserving recoverable edits. Client-supplied ownership fields are rejected. The generated OpenAPI/types remain the contract authority.
- Names follow the existing 1–100/0–100 Unicode-code-point rules with trimmed whitespace and rejected control characters. Protected responses have no-store headers. Errors use code/message/request ID without echoing submitted values. CORS permits the explicit origins, Bearer header and PATCH without credentialed wildcards.

### SQL and credential proposal for review

The migration creates one `asgard_private.profiles` table, a dedicated `asgard_app` login with no password yet, and forced RLS policies. The schema is outside the Data API's exposed schemas. Runtime privileges are SELECT, column-limited INSERT/UPDATE, schema usage and execution of one boolean account/session check. There is no DELETE, schema creation, superuser, role creation, inherited role access or RLS bypass grant.

Each backend operation uses a bounded SQLAlchemy async transaction, checks the runtime role, validates provider account/session state through the narrow function and sets verified user identity transaction-locally. Queries also include an explicit owner condition. The security-definer function has a fixed empty search path and no PUBLIC execution; it returns only whether the supplied user/session is confirmed, active and meets existing MFA assurance. The app does not receive general SELECT access to Auth tables. This is defense in depth for a trusted backend role, not protection against a compromised backend credential deliberately impersonating another user.

At the pre-activation review, the [credential initializer](../scripts/provision-local-db.mjs) was prepared but not executed: it requires an explicit approval flag, a local Docker context and the already-migrated restricted role. It atomically writes a generated credential into ignored root `.env` before changing only that role's password using SQL on stdin. It neither creates roles nor grants privileges and refuses automatic rotation. Structural changes remain solely in versioned Supabase SQL. Database credentials and signing keys never become Vite variables.

The historical Auth proposal described local email/password signup, six-digit confirmation, 600-second code expiry, 60-second resend spacing and 900-second JWT expiry, with an ignored signing-key file and committed confirmation template. Its former 15-character password description is superseded by the [owner's eight-character resolution](decisions.md#password-minimum-resolution), which matches both current config files and frontend validation. At that pre-activation review, CLI key generation had been checked through help only; the later isolated generation probe is recorded above. Local SMTP is the testing destination; no external delivery or public-registration readiness is claimed.

At the pre-activation review, the proposed activation sequence required a backup/state check, reviewed SQL application without reset, signing-key and credential provisioning, Auth configuration and affected-service restart. The later local-only approval did not authorize another environment. Use [README](../README.md#before-first-startup) for the current provisioning sequence; do not execute a historical proposal as an additional setup path.

### Verification and remaining work

Python 3.13 Docker builds and hashed locks cover PyJWT cryptographic support, psycopg and SQLAlchemy's async extra. The official Supabase JS SDK is exactly pinned in the frontend lock. Existing dependency versions are preserved where possible; source/contract checks remain mandatory.

Source tests cover signed/malformed/wrong-key JWTs, claim rejection, unavailable keys, inactive Auth, missing Bearer credentials, profile validation, HTTP conflicts and ownership-field rejection. Frontend unit tests cover token separation and old-response races. Browser tests explicitly mock provider/API responses on an isolated frontend-only server; these prove interface behavior, not real login, mail delivery or SQL isolation. The opt-in [local integration tests](../backend/tests/integration/test_local_auth.py) are skipped by default. Their current guard permits an isolated `asgard-stage3-test*` stack or the local foundation project with a separate explicit approval flag; neither path is authorized merely by this documentation. They cover two-account persistence/isolation, actual role/RLS access and connection reuse, logout/revocation and refresh; privileged synthetic-account setup is confined to the test harness, never app runtime.

At that pre-activation review, still unverified until execution approval: migration application and grants, real ES256 tokens/JWKS, SMTP delivery and six-digit verification, signup enumeration/rate behavior, actual persistence and pooled-connection isolation, and the opt-in live suite. The hosted Render/session-pooler A-01 gate, external SMTP, production abuse controls, native Linux-host onboarding, code ownership/protected-review setup and hosted CI remain open. This source slice does not establish final-MVP authentication acceptance.

Final pre-activation evidence:

| Check | Result |
| --- | --- |
| Python 3.13 source checks | Pass: Ruff and 23 pytest tests; 4 live integration tests skipped behind the explicit gate |
| Frontend source checks | Pass: TypeScript, ESLint, 6 Vitest tests, production build on Windows and in Linux Docker, API-client drift |
| Environment helper | Pass: all 4 configuration tests; credential initializer rejects invocation without its approval flag |
| Existing UI regressions | Pass: 20 desktop preview/navigation/accessibility checks |
| New Auth/Profile UI | Pass: 9 mocked-provider checks across 1280, 1440 and 1920 px, including focused validation, session restoration, failed edits, saves, logout and axe checks |
| Dependencies | Exact frontend lock and hashed Python locks; existing locked package versions were not upgraded |
| Documentation | Pass: changed-document local links/anchors and diff whitespace checks |
| Live acceptance | Not run: SQL/RLS/provider tests await the separate migration/Auth approval |

An initial browser focus test exposed validation moving the Save button during the click. The connected form now validates first on submit and focuses the committed error summary; corrections revalidate as typed. A separate stale-source issue in the disposable Windows review container was resolved by enabling Vite polling, and all 9 final checks used the current source. The upstream Starlette/httpx pytest deprecation warning remains; no failing automated source/UI checks remain.

The temporary mocked UI container was removed. Ignored `.local/stage3-review/` contains rendered screenshots. Existing app containers were refreshed only to load the new dependencies, with Auth still disabled; backend liveness passed and the protected API returned `503 auth_not_configured` as intended. No Supabase services were started, no database reset or migration application occurred, no signing key/password was initialized, and no commit/push/merge/deployment was performed. Review the SQL, Auth candidate, credential initializer and generated contract before authorizing activation and real-data-path tests.

## Historical foundation evidence

Local Stage B evidence, 25 October 2026: clean npm install; frontend build/typecheck/ESLint; 2 Vitest tests; Ruff; 8 pytest tests; Compose validation/build/startup; local Supabase startup/database lint; schema/client generation/drift checks; and 4 Chromium browser checks passed. Browser checks cover real proxy connectivity, explicit rechecks, missing-route recovery and overflow at 1440×900 and 360×800. The diagnostic page was inspected at both sizes; this is not a product-screen design-fidelity or accessibility pass. Pytest reports an upstream Starlette warning about its future httpx test-transport replacement.

At that historical check, the GitHub Actions workflow added source/contract checks and container builds; hosted CI had not run. Current workflow coverage is described above; no new hosted run was verified by this cleanup. Technical review is pending. This is partial A-06/A-11 and QA-11 evidence, not a QA-11 release pass. Independent teammate bootstrap, application-role/pooler/RLS evidence, auth/ownership, real schema migrations, backup/restore, protected code ownership and hosted verification remain outstanding.

## Stage C UI review

Historical presentation evidence, before Stage 3.5 removed standalone Preview routes. Route names and component-gallery descriptions in this section describe that earlier source; the [Stage 3.5 handoff](stage-3.5-handoff.md) owns the later preservation/removal record. Earlier browser results do not certify the current authenticated application.

Approval was recorded for continuation and Anti Slop during implementation in the decision record on 25 October 2026. The [design guide](design.md) records the implemented system and heuristic findings. Frontend feature directories isolate auth presentation, Dashboard, Discovery, catalog, recommendations, roadmaps and Profile. `/preview/components` links to the screen previews and shared state examples. Fixtures are never persisted; backend actions are disabled. This is presentation coverage for REQ-01–05, REQ-07–11/13 and partial NFR-01/02 / QA-12 evidence, not functional acceptance of those features.

The initial Stage C browser suite covered 1440×900, 768×1024, 360×800 and 320×800. This historical evidence predates the desktop-only scope resolution below. It inspects 14 screens for rendering, overflow, browser errors, unexpected feature-service requests and axe WCAG-tagged findings. Interaction checks exercise catalog context, selection rules, topic focus, menu/dialog Escape and focus return, discard protection, tabs, calendar layout navigation, filter clearing and unavailable actions. Screenshots are local ignored outputs in `frontend/test-results/`. See [UI tests](../frontend/tests/ui.spec.ts) and [navigation checks](../frontend/tests/navigation.spec.ts). Actual screen-reader use, real browser 200%/400% zoom, touch keyboards and Safari/Firefox/Edge remain not run.

shadcn source components were installed through its documented manual registry workflow after its CLI encountered npm EALLOWSCRIPTS. No npm script policy was relaxed, and the incompatible CLI was removed. Component license and provenance are preserved. New dependencies are locked; source checks and the Docker build remain the reproducibility gate. No hosting, auth, migration, API or infrastructure contract changed during UI implementation.

Initial Stage C local record, 25 October 2026 (Chromium 156.0.8078.4 / Playwright 1.64.1; technical review pending):

| Check | Result |
| --- | --- |
| Frontend TypeScript, ESLint and production build | Pass, including the rebuilt Linux container; feature bundles are split and no chunk-size warning remains |
| Vitest | Pass, 4 tests including Unicode name limits and connectivity states |
| Browser suite | Pass, 88 checks across four viewports; affected Profile/Account checks were repeated after final corrections |
| Automated accessibility and errors | Pass for the 14 tested screens at all four widths; no axe findings, horizontal overflow, page errors or feature API calls in that scan |
| Container checks and backend regression | Pass: Compose rebuild/health, Ruff, 8 pytest tests, OpenAPI and generated-client drift |
| Semantic contrast / documentation links | Pass: nine text/control pairings and changed-document local links |
| Hosted CI, real zoom, screen readers and other browser engines | Not run; not substituted by Chromium/axe results |

Rendered desktop/mobile captures are in ignored `.local/ui-review/`; test-run screenshots remain disposable. The [design guide](design.md) records reference comparison, controlled deviations, reuse and heuristic limits. No unresolved automated-check failures remain. Visual approval and feature/content integration are still separate gates owned by independent review and designated feature owners; none is inferred from this record.

Tailwind source detection is explicitly limited to `frontend/src` so existing build output cannot affect the next build. Two consecutive container production builds produced identical CSS SHA-256 values.

## Desktop presentation refinement

25 October 2026 — Acceptance coverage: NFR-01/02 and partial QA-12. Affected modules: shared frontend styles, entry composition, component examples, browser viewport configuration, and owning product/design/verification documentation. Dependencies and shared API/data contracts are unchanged.

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

### Stage 4 bounded execution record

26 October 2026. Execution reference: the recorded Stage 4 brief and Autonomous Execution instruction in the decision record. That instruction authorizes continuous foundation implementation and local additive migration verification without routine planning pauses; it does not establish completed technical review or merge approval. That original task required preserving then-uncommitted Stage 3.5 work on `codex/stage35-canonical-ui` and prohibited creating branches, commits, pushes and resets. The later foundation consolidation supersedes that branch instruction; it does not grant new Git-operation approval.

Scope: shared SQL entities/ownership/concurrency constraints, Pydantic/OpenAPI scaffolding, generated TypeScript contracts, cache/error conventions and a bounded handoff. Requirements: REQ-02–05, REQ-07–11/13; foundation support for F-001-AC-07/08 and F-002-AC-01/06/08–10; A-05/10/11. Feature acceptance remains unimplemented. Affected paths: one additive `supabase/migrations` file, new backend shared/feature schema and route modules, `backend/app/main.py`, generated schema/client, frontend API conventions, focused checks and this guide. No dependency additions or Auth/Profile contract changes.

Plan: (1) relational catalog/questionnaire identities, private Discovery history, learning state/activity, recommendation provenance and quota reservation storage; (2) owner-authenticated API inventory with explicit 501 responses, strict revisions and catalog/evidence validation contracts; (3) generated types and account-scoped query/error conventions using existing session cancellation; (4) one local non-reset migration application, one rollback-only integrity/RLS probe, contract synchronization, targeted Python checks and TypeScript checking. Depend on the existing local restricted role/session validation and running containers. Keep catalog publication, complete workflows, provider calls, PDF processing, progress calculations and hosted/security release gates unfinished. Review/integration order: Stage 3.5 preservation review, then Stage 4 SQL/shared-contract review, then dependent feature work after the architecture's team gate. Execution evidence and actual contract locations are recorded below when available.

Product/content acceptance, architecture review and deployment authorization are distinct; record real operator/contact access before external testing and name a backup operator. These role assignments do not invent a teammate or delivery date. Contributors use reviewed branches/PRs after Git setup; no direct merge to main without explicit authorization.

1. Foundation: repository, pinned lockfiles/images, Compose/Supabase bootstrap, secrets template, least-privilege grants/RLS/pooler spike, generated OpenAPI client, CI and read-only health checks.
2. Safe account entry: implement verified email/password access, verification/recovery, receiving-service CAPTCHA/rate limits and account authorization first. Investigate Google linking in a separate AUTH-C1 spike; its blocker does not block the email/password foundation. Keep TOTP in the approved architecture, but leave enrollment disabled until AUTH-C2 proves enrollment, recovery, rotation, disablement and fresh-auth behavior.
3. Curated catalog/roadmap content and explicit focus/topic persistence with concurrency and branch rules.
4. Dashboard continuation/progress/calendar and explicit Profile/preferences saves with shared guidance.
5. Discovery controls and saved drafts, then evaluated recommendation generation and optional PDF analysis using selected quotas/privacy controls.
6. Security, browser/accessibility, backup/restore, cold-start, hosted smoke tests and the local fallback demo.

This is a dependency order, not a one-day completion estimate. Final MVP requires all scoped features; any working-demo exception must be explicit in Product scope.

Google and MFA gates apply to their integrations, not the whole application. In an interim email/password build, omit Google entry/linking controls and disable MFA enrollment rather than display actions that cannot work safely. Preserve any existing MFA enforcement; a feature flag must never bypass enrolled factors. Label the build as incomplete against final-MVP account scope until both gates pass or approval is recorded for a scope change.

## Scheduled and manual operations

Render Free serves bounded web requests; it is not the scheduler. Use separately triggered GitHub Actions maintenance workflows, already within the approved CI platform, for cleanup and backups. These are future repository workflows, not interactive development-session automations; none is created by this document update. See the [execution matrix](security-and-operations.md#maintenance-execution-matrix) for cadence, ownership, failure handling and manual fallback.

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

The [historical reference README](design/ui-reference/README.md) and [source manifest](design/ui-reference/source-manifest.csv) are retained in this checkout. The external archive name records provenance only; no contributor needs that archive to follow the supported workflow. Do not rewrite the snapshot to make it look like current implementation.
