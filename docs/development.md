# Asgard: Development

Consolidated baseline: 2026-11-17. Maintainer/reviewer: the project lead mapped in [CODEOWNERS](../.github/CODEOWNERS). This guide describes the current source and contributor workflow. Dated test results remain in feature guides and the archived development record; this consolidation runs no application checks.

## Local workflow

Use [local development and onboarding](getting-started.md) for prerequisites, environment provisioning, launchers, startup, shutdown, and troubleshooting. Run commands from the checkout root. Runtime pins belong to version files, manifests, locks, and Dockerfiles. Root npm installs the locked CLI; Docker owns application dependencies. Do not copy credentials between environments.

<a id="current-foundation-status-and-evidence"></a>

## Current implementation

The React application uses authenticated FastAPI services for Discovery, published careers and roadmaps, learning progress, recommendations, preferences, and Profile. Guided Discovery v2 supports conditional questions and saved deterministic first results. Groq supports separately configured recommendations, comparison explanations, and contextual Counselor responses. Optional private photos, PDF processing, resume skill review, MFA, and account deletion depend on their configuration and activation gates.

The roadmap experience-comparison UI is disabled. Profile skills and career-to-career comparison remain available. The earlier practice/reflection UI is dormant while its records and APIs are retained. See [current decisions](decisions.md) and [future development](future-development.md).

## Contracts and migrations

- Versioned SQL in `supabase/migrations/` is schema authority. Never use ORM schema creation or reset a retained database to repair setup.
- `backend/openapi.json` and `frontend/src/api/generated/schema.d.ts` define the wire contract. Generate them together through `node scripts/dev.mjs generate-api` after approved changes.
- Keep feature logic in its owning backend module and frontend feature. Shared route registration, migrations, and generated contracts need coordinated review.
- Preserve account ownership, session checks, revision guards, immutable recommendation provenance, content identities, and learning concurrency rules. The browser never holds a privileged database or provider credential.

<a id="stage-4-shared-contracts-and-handoff"></a>

## Shared contracts and handoff

Discovery owns versioned questionnaire sessions, active answers, checkpoints, and immutable completions. Catalog/Roadmaps owns published career, path, branch, milestone, topic, and resource identities. Recommendations consumes accepted input snapshots and saves validated provenance. Progress owns focus, topic states, activity, streaks, and Dashboard summaries. Profile owns account details and preferences; private documents and images use the reviewed backend Storage gateways.

Shared foundation operations have service handlers. Historical references to intentional feature-wide 501 stubs describe the scaffold, not the current application. A handler's presence is not proof that all security, content, or hosted acceptance criteria passed.

MFA-RECOVERY-01 (owner/codeowner approval, 2026-11-19) adds account recovery endpoints,
private hashed-code/attempt/pending tables and a shared session-guard block. Follow
the [ADR](adr/2026-11-19-application-recovery-codes.md) and
[implementation guide](features/application-recovery-codes.md). Apply the reviewed
migration before deploying the updated backend/frontend; the frontend now checks
durable recovery status during assurance. Backend activation remains off until
credential provisioning and actual provider/session acceptance pass. Historical
provider-managed-only recovery guidance is superseded only within this ADR's scope.

## Verification

Choose focused checks for changed behavior using [AGENTS.md](../AGENTS.md) and [Verification](verification.md). Reuse unchanged dated evidence within its recorded scope. Documentation-only changes use local link/anchor, reference, and whitespace checks. Do not restart services or rerun the full stack for prose edits.

<a id="current-ci-coverage"></a>

## CI coverage

[checks.yml](../.github/workflows/checks.yml) defines helper tests, frontend type/lint/unit/build/client-drift checks, backend lint/tests/OpenAPI drift, Compose and production-image builds, runtime checks, and isolated migration/content/browser acceptance. [account-deletion.yml](../.github/workflows/account-deletion.yml) defines gated maintenance. Workflow source does not establish a successful remote run, protected-branch enforcement, or an active schedule.

## Evidence and release readiness

Feature guides record what ran, when, and in which environment. Current follow-ups include [hosted content performance](features/hosted-content-performance.md), [hosted feature activation](features/hosted-feature-activation.md), [account deletion](features/account-deletion.md), [MFA](features/optional-two-factor-authentication.md), and [public information/status pages](features/footer-information-and-service-status.md).

Hosted timing/load targets, privacy and provider quality, mail delivery, complete MFA recovery, maintenance monitoring, backup/restore, independent setup, and the remaining manual browser/accessibility matrix require their own evidence. Do not infer release acceptance from this documentation baseline.

## Contributor workflow

Record a bounded task, owner, requirements, affected modules/contracts, checks, and reviewer before implementation. Inspect existing edits and preserve unrelated work. Feature changes update their implementation guide. Shared architecture, Auth, migrations, and contracts require designated technical review. Submit changes for human review; commits, publication, and integration require explicit authorization.

<a id="foundation-git-workflow"></a>

## Branch policy

The recorded Stages 1–4 owner workflow uses `foundation` with a reviewed PR into `main`. Feature branches follow their agreed assignments. This documentation cleanup stays on the existing branch and changes no branch policy or history. Historical branch names and command records do not authorize checkout switches, merges, rebases, commits, or pushes.

## Historical references

Earlier headings remain addressable for incoming links. Their linked records describe the dated work only; current policy and status are above.

<a id="workspace"></a>

[Workspace](archive/2026-11-17/development.md#workspace).





<a id="local-network-and-filesystem-boundaries"></a>

[Local network and filesystem boundaries](archive/2026-11-17/development.md#local-network-and-filesystem-boundaries).



<a id="stage-4-parallel-readiness-and-publication"></a>

[Stage 4 parallel readiness and publication](archive/2026-11-17/development.md#stage-4-parallel-readiness-and-publication).

<a id="stage-2-hardening-evidence"></a>

[Stage 2 hardening evidence](archive/2026-11-17/development.md#stage-2-hardening-evidence).

<a id="stage-3-authentication-and-profile-review-gate"></a>

[Stage 3 authentication and Profile review gate](archive/2026-11-17/development.md#stage-3-authentication-and-profile-review-gate).

<a id="implemented-source-boundaries"></a>

[Implemented source boundaries](archive/2026-11-17/development.md#implemented-source-boundaries).

<a id="sql-and-credential-proposal-for-review"></a>

[SQL and credential proposal for review](archive/2026-11-17/development.md#sql-and-credential-proposal-for-review).

<a id="verification-and-remaining-work"></a>

[Verification and remaining work](archive/2026-11-17/development.md#verification-and-remaining-work).

<a id="historical-foundation-evidence"></a>

[Historical foundation evidence](archive/2026-11-17/development.md#historical-foundation-evidence).

<a id="stage-c-ui-review"></a>

[Stage C UI review](archive/2026-11-17/development.md#stage-c-ui-review).

<a id="desktop-presentation-refinement"></a>

[Desktop presentation refinement](archive/2026-11-17/development.md#desktop-presentation-refinement).

<a id="selected-development-baseline"></a>

[Selected development baseline](archive/2026-11-17/development.md#selected-development-baseline).

<a id="work-order-and-ownership"></a>

[Work order and ownership](archive/2026-11-17/development.md#work-order-and-ownership).

<a id="stage-4-bounded-execution-record"></a>

[Stage 4 bounded execution record](archive/2026-11-17/development.md#stage-4-bounded-execution-record).

<a id="scheduled-and-manual-operations"></a>

[Scheduled and manual operations](archive/2026-11-17/development.md#scheduled-and-manual-operations).

<a id="before-each-implementation"></a>

[Before each implementation](archive/2026-11-17/development.md#before-each-implementation).

<a id="security-and-analysis"></a>

[Security and analysis](archive/2026-11-17/development.md#security-and-analysis).

<a id="completion-evidence"></a>

[Completion evidence](archive/2026-11-17/development.md#completion-evidence).
