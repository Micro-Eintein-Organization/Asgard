---
id: BRIEF
kind: brief
status: draft
---

# Asgard

Asgard is a web application for exploring technology careers, following curated learning roadmaps, and returning to a practical next learning step. Users can browse directly or use guided Discovery for explained career suggestions. They choose their current roadmap and record their own topic progress.

The initial audience is adults aged 18 and above at any experience level; initial design evaluation focuses on students. Suggestions support exploration, and recorded completion describes activity rather than measured competence.

## Current state

The workspace contains active product/engineering documentation, historical frontend references and 14 static Figma images. It has no application runtime or Git repository. No install, start, build, or test commands have been established.

The protected journey is sign in → guided Discovery or direct browsing → career explanation and roadmap → explicit current focus and topic states → Dashboard continuation. Optional profile enrichment must not block it. The one-day working demo and final MVP have different PDF expectations; see the product document.

## Read what the task needs

| Document | Read for |
| --- | --- |
| [AI engineering instructions](AGENTS.md) | Agent boundaries, verification, and conflict handling |
| [Product requirements and scope](docs/product.md) | Users, requirements, acceptance criteria, demo/MVP boundaries, and exclusions |
| [User journeys](docs/user-journeys.md) | End-to-end actions, recovery, one flow diagram, and a student example |
| [Pages and interactions](docs/pages-and-interactions.md) | Screen content, controls, state changes, and missing design coverage |
| [Decisions and open work](docs/decisions.md) | Recorded resolutions, unresolved choices, and implementation blockers |
| [Architecture](docs/architecture.md) | Approved React/Vite, FastAPI, Supabase and Docker foundation |
| [Development context](docs/development.md) | Selected tooling, work order, implementation prerequisites and checks |
| [Security and operations](docs/security-and-operations.md) | Abuse controls, account recovery, provider gates, retention, backups and incident response |
| [Verification](docs/verification.md) | Browser/accessibility, AI quality and release evidence gates |
| [Discovery](docs/specs/discovery.md) | Questionnaire boundaries and F-001 acceptance scenarios |
| [Career recommendations](docs/specs/career-recommendations.md) | Catalog-grounded LLM direction, PDF boundaries, and F-002 acceptance scenarios |
| [Static Figma exports](docs/design/figma/) | Visual reference only; incomplete coverage, not verified interactions |
| [Frontend UI reference](docs/design/ui-reference/README.md) | Historical frontend source, styles and reuse audit; some designs/interactions are inaccurate; no backend or implementation authority |

The architecture foundation is approved; the owner delegated remaining product/default choices on 25 October 2026. The decision register distinguishes selected policy from provider conflicts, content authoring, technical contract review and unrun verification. No document asserts a working implementation. Start with the relevant documents and inspect any implementation added by later tasks; the historical archive is not default task context.

## History

Historical documentation, legacy tooling, LaTeX/PDF exports, and temporary files are preserved outside this workspace at `C:\Users\saave\OneDrive\Documents\Projects\AI-CAREER-DSS-NEW-docs-archive\2026-10-25`. The original consolidation manifest is at the archive root; `workspace-cleanup/manifest.csv` records the 865 additional files archived and checksum-verified before removal. Historical files are not implementation authority.
