# Asgard frontend reference

25 October 2026 · Historical UI source snapshot for agent and developer context

This folder preserves useful frontend work from the one-day experiment: screen markup, layout, shared CSS, visual states and sample content. It is a reference implementation, not the main application, an approved architecture, or an accurate specification of every design and interaction. Reuse requires review against the current task and governing documents.

## Start here

1. Read the current [pages and interactions](../../pages-and-interactions.md), relevant [product requirements](../../product.md), and [decisions](../../decisions.md).
2. Inspect the relevant [Figma exports](../figma/). Their approval status and incomplete coverage are described in the page guide.
3. Use the [audit](audit.md) to locate useful UI and known gaps, then inspect only the relevant source below.

The source captures what the experiment rendered or attempted, not what the final application must do. If a reference interaction differs from current requirements, flag it rather than importing it as a product decision. If the governing documents leave a required decision open, request review.

## Useful files

| File | Useful context | Limits |
| --- | --- | --- |
| [Shared CSS](frontend-source/app/ui.css) | Colors/type/size variables, controls, cards, page layouts, responsive rules, focus and selected states | Global selectors, literals and legacy styles coexist. Tokens are observed prototype values, not approved design tokens. |
| [Screen markup](frontend-source/components/prototype.tsx) | Header, Welcome, Discovery, results, catalog, Dashboard, Settings, dialogs and feedback | Also contains obsolete client request/state/navigation wiring and an unused older roadmap. Do not adopt the orchestrator or API assumptions. |
| [Roadmap and topic details](frontend-source/components/career-roadmap.tsx) | Milestone cards, topic rows, resource panel, hide-completed presentation | Hardcoded Frontend details; missing final graph/branch and panel behavior. |
| [Activity calendar](frontend-source/components/activity-calendar.tsx) | Month grid, day selection, navigation, activity presentation | Its embedded activity/streak/date logic is prototype behavior, not the final history/timezone contract. |
| [Sample catalog and types](frontend-source/lib/catalog.ts) | Frontend fixture data needed to understand markup: two roles, one introductory roadmap, five Discovery questions | Not approved taxonomy, curriculum, questionnaire rules, shared contracts, or final persistence design. |
| [Audit](audit.md) | Page/navigation inventory, component reuse classifications, duplication, tokens, Figma comparison and proposed integration sequence | Historical source audit, not runtime verification or authorization to implement its proposal. |
| [Source manifest](source-manifest.csv) | Relative source paths and SHA-256 hashes for the five unchanged frontend files | Records provenance; grants no approval. |

## Reference-only client wiring

The `.tsx` files are unchanged frontend snapshots so their provenance is clear. `prototype.tsx` still contains browser calls to `/api/state`, a generic `perform` dispatcher, query-string navigation, provider setup messages, and automatic recommendation requests. These are historical client dependencies, not a supplied backend or an API contract to recreate. The snapshot is not a runnable or offline UI scaffold. Do not mount it into the application expecting those actions to work.

No API route, database module, migration, Supabase configuration, server recommendation service, environment file, credential, setup script, package manifest, dependency tree, or build output is included. No backend migration is proposed by this folder.

## Known inaccuracies and gaps

- Results navigate directly to selected career detail; current documentation describes a catalog handoff whose details require review.
- Discovery options, selection limits, six-segment wording and save timing reflect experiment choices. Exact final behavior remains under review.
- Catalog search/filter context resets on remount; catalog Back and explained recommendations are incomplete.
- Authentication, logout, optional profile setup as a separate flow, photo/PDF actions and account-security screens are absent.
- Topic progress assumes global topic IDs and a single local profile; graph branches and final account/history rules are not represented.
- Empty illustration circles and limited sample content remain. Do not infer launch coverage from them.
- CSS defines responsive/focus states, but browser, keyboard, contrast and accessibility checks have not been established by this snapshot.

Figma filenames are imperfect: `Final Round_ Discovery Results.png` shows the catalog, `Rounds 1–5_6.png` shows actual results, and `Roadmaps.png` shows roadmap detail. Compare by visible content and the page guide.

## Provenance and use

Copied from the external historical archive `AI-CAREER-DSS-NEW-docs-archive/mvp-one-day-experiment` on 25 October 2026. The five frontend files were checksum-verified against that source. The archive itself was not modified. The original machine-specific path was omitted on 26 October 2026 for documentation portability; the archive name records provenance and is not a required local path. This repository contains the reference files, so teammates do not need access to that external archive to develop Asgard.

Keep this snapshot separate from executable application code. A later authorized implementation may adapt reviewed presentation into the chosen architecture; this folder does not select that architecture or authorize refactoring, dependency installation, service integration, or deletion. Record any approved behavior in its owning specification rather than treating the snapshot as authority.
