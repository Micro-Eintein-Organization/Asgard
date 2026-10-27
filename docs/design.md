# Asgard: Implemented UI foundation

Updated 27 October 2026. Stage 3.5 canonical application UI with the later UI-flow repair; project-lead visual review is pending. [Product](product.md), [pages](pages-and-interactions.md), [journeys](user-journeys.md) and [architecture](architecture.md) retain authority over behavior and technical boundaries. This guide describes the implemented presentation, not approval of product integrations or curricula.

The [later Stage 4 foundation](development.md#stage-4-shared-contracts-and-handoff) adds shared SQL/API scaffolding without connecting these sample screens. References below to Stage 3.5 not introducing contracts describe that UI task's scope; they do not mean the current repository lacks contracts. [Current foundation status](development.md#current-foundation-status-and-evidence) distinguishes source, recorded evidence and pending acceptance.

## Identity and hierarchy

Asgard uses white cards, light neutral surfaces, dark text/actions and a restrained green selection/progress accent. Arial/Helvetica matches the sans-serif character of the supplied exports without adding a font dependency. The header/onboarding wordmark uses the supplied light-mode Snowflake + ASGARD image through [BrandLogo](../frontend/src/components/brand-logo.tsx). There are no generated illustrations, invented people, testimonials or match scores.

Design direction: ENERGY 1 / RHYTHM 2 / MOTION 1. Career exploration stays calm and readable; page composition varies with its task. The dark Dashboard milestone establishes the main continuation action. Its dark gradient follows the reference's hierarchy; it is not a page-wide effect. Borders group content. The restored committed screens retain their original card/banner shadows and calendar/callout accents. Functional icons identify navigation, search, account, resources and status; they do not fill empty illustration space.

## Tokens and components

The source of truth is [src/styles.css](../frontend/src/styles.css), including Tailwind v4 semantic mappings. Only the light theme is implemented.

| Token | Implemented use |
| --- | --- |
| `--background` / `--card` | White page / white content surfaces |
| `--foreground` / `--primary` | `#171717` text / black main actions |
| `--secondary` | `#f4f4f5` supporting surfaces |
| `--muted-foreground` | `#60646c` secondary text |
| `--ring` | `#007a53` focus; `--selected` `#009c6b` selected control boundaries |
| `--accent` / `--accent-foreground` | `#edfbf5` / `#006b49` selected and contextual information |
| `--input` / `--destructive` | `#89898e` control boundary / `#9d302c` errors |
| `--progress` | `#00d563` against the dark milestone surface |

Use the four-pixel spacing scale through matching Tailwind utilities or CSS rem values: 4, 8, 12, 16, 24, 32 and 48 px. Body text is 16 px with 1.6 line height; card copy is generally 14 px. Page headings scale from 30 to 44 px; the public introduction has a larger display scale. Shared primitives target at least 44 px touch height. The restored native controls retain their committed sizing; rendered accessibility acceptance remains pending. Primary actions use black pill buttons, following the Figma entry/Discovery references. Secondary controls, cards and dialogs use 8/14/16 px radii. Disabled actions stay neutral gray with nearby explanations; they do not appear available. Neutral gray surfaces and black-to-gray milestone gradients replace the earlier green-tinted neutrals. Green identifies selection, progress and success.

| Import location | Responsibility |
| --- | --- |
| `@/components/ui/*` | shadcn button, input, label, card, badge, dialog, dropdown, tabs, accordion, alert, skeleton, progress and selection primitives |
| `@/components/shared` | PageHeading, BackLink, Notice, StatePanel, StatusBadge and unavailable-action helpers |
| `@/components/catalog/RoleCatalog`, `@/components/discovery/DiscoveryWizard` | Restored source card layouts for catalog and sample results |
| `@/components/unsaved-preview-dialog` | Stay / discard navigation guard for local preview input |
| `@/components/preview-states` | Explicit sample/empty/loading/error review controls, not production data loading |

Primitives were obtained through the [official shadcn registry](https://ui.shadcn.com/docs/installation/manual), then adapted for local imports, tokens, contrast and touch sizing. Their [MIT license](../frontend/src/components/ui/LICENSE.md) is preserved. The owner-selected screen layouts remain in their original `src/screens/` and `src/components/` files. Feature entrypoints re-export them, while Profile data/validation/guards stay in `src/features/profile/`. Shared primitives do not own persistence or product invariants.

## Shell, routes and reflow

[AppShell](../frontend/src/app/shell.tsx) supplies the compact Dashboard / Roadmap / Settings header, account menu, skip link and footer to the authenticated application. Roadmap opens the catalog; Discovery, recommendations and roadmap availability are reached through page actions. Settings opens the original combined Profile and security page; Account and security navigation targets its security section. [Routes](../frontend/src/lib/routes.ts) centralize public entry and protected application addresses; screen bundles load separately. Email/password account access and the profile API are connected. Protected feature routes load the restored committed screen components with labeled sample feature content. A shared Demo content notice distinguishes these examples from saved account data. Standalone `/preview/...` routes and the component gallery are removed; `/status` retains the technical connectivity check.

The MVP targets desktop/laptop widths of approximately 1280–1920 px under [NFR-02](product.md#nfr-02-desktop-compatibility-and-accessible-reflow). Content is capped at 1248 px to keep reading widths comfortable on larger displays. Desktop application navigation stays visible. The catalog has centered search and wrapping category pills above a four-column grid at wide desktop widths; smaller widths retain one or two columns. Roadmap details sit beside milestones. Discovery uses four choice columns; entry uses two.

## Original screen restoration, 27 October 2026

The owner rejected the earlier replacement of new screen source with adapted older feature pages and explicitly approved “Restore the original designs and connect the application flow.” The current [implementation guide](features/ui-flow-integration.md) supersedes the earlier integration/visual-completeness claims. Source was recovered selectively from `2befd54` (introduced in `6d19142`), without reconstructing screenshots or resetting the branch.

[DashboardScreen](../frontend/src/screens/DashboardScreen.tsx) retains its original role/calendar support column, orange calendar grid, dark milestone, three topic groups and blue dismissible enrichment callout. [RoleCatalog](../frontend/src/components/catalog/RoleCatalog.tsx) retains its top action, centered search, category pills, four-column grid and selected-card appearance. [SettingsScreen](../frontend/src/screens/SettingsScreen.tsx) retains its combined Profile, Discovery, preferences, document and security composition. Its name saves and logout use the existing real Profile/Auth integration; unsupported file/security operations are disabled and explained.

[EntryChoice](../frontend/src/components/discovery/EntryChoice.tsx), [DiscoveryHeader and DiscoveryWizard](../frontend/src/components/discovery/DiscoveryWizard.tsx), and [OptionalProfileSetup](../frontend/src/components/profile/OptionalProfileSetup.tsx) retain their committed card/header/form composition with targeted semantic and navigation changes. Canonical question copy, checkbox/radio rules and unsaved-answer protection remain. Results uses the original three-card composition with direct roadmap links and explicitly labeled samples. Setup saves actual names and returns Save/Continue/Skip/Back to Results; it does not simulate uploads.

The [lazy screen map](../frontend/src/app/screens.ts) loads these components directly. Older full-page feature modules are re-export adapters to the same implementations, not alternate screens. The earlier competing catalog/wizard/setup/Settings CSS was removed by recovering the committed stylesheet; a small rule marks entry selection. The simulated recommendation service, duplicate question definitions and draft types remain removed. Roadmap/topic presentation and canonical fixture identities remain unchanged.

Landing and account entry wait for session restoration. Verified existing sessions go to Dashboard; logged-out visitors see public Log in/Get started and the existing real account forms. Verified registration goes to Welcome. Protected application paths and guarded logout remain. `/settings/account` resolves to `/settings/profile#account-security`; `/profile-setup` is a protected page in the Discovery flow.

Formatting and source/reference comparison are recorded in the guide. Tests, builds, type/lint checks, browser/visual comparison, keyboard/contrast/reflow review and security acceptance remain deferred by the owner's instruction. This describes restored source and integration, not demonstrated rendered fidelity or finished feature services.

Existing smaller-width layouts and Menu navigation remain to preserve working code and support zoom/reflow. Further mobile-specific design and optimization are outside MVP scope. Topic details move focus to their heading; Close returns it to the selected row. Catalog query/category state lives in the URL and survives topic navigation. Overflow must remain visible and usable, not hidden to conceal layout failures.

## Interaction and honesty

Owner-approved focused onboarding follow-up, 27 October 2026: `/welcome`, `/discovery`, `/recommendations` and `/profile-setup` omit the application header/navigation/account menu, global demo notice and footer. A small non-interactive supplied logo sits within their main content. The skip link, route focus, screen-specific controls, local sample/unavailable disclosures and protection/unsaved-edit guards remain. These restored screens keep their existing layout. Entry is initially unselected; a fresh questionnaire starts empty. The shell is route-based for new and returning visitors, with no persisted completion flag. Careers, Dashboard, Settings and roadmap pages retain the normal shell, and public/application headers use the supplied logo. Image proportions/transparency remain intact; no alternate brand variants, new artwork, palette or fonts are added. The [follow-up guide](features/ui-flow-integration.md#focused-onboarding-and-branding-follow-up-2026-10-27) records scope, files and deferred acceptance.

The current route flow is Landing/account access → Dashboard for returning users, or Welcome for verified registration. Welcome offers Discovery or direct Careers. Results offers direct roadmap browsing and optional setup; setup returns to Results. Real Profile editing shares its account-keyed controller and dialogs between original Settings and setup. Name saves do not save the prototype field preference, document or recommendations. Failed saves remain recoverable; dirty/pending edits retain navigation/logout protection. The [guide](features/ui-flow-integration.md) records the complete action map and limitations.

The [Stage 3.5 handoff](stage-3.5-handoff.md) remains historical foundation evidence within its original scope. Its former screen ownership, preview controls and shared Settings composition do not override the owner's later original-source selection. Conditional Discovery routing still requires an authored/reviewed map; fixed prototype progress is not production route authority.

- Native labeled radio/checkbox cards implement only local selection. F-001 supplies question copy and combination rules; no inferred recommendation mapping is added.
- Menus, tabs, accordions and dialogs retain semantic keyboard controls. Dialogs close with Escape and return focus. Route changes focus the heading without outlining the entire page.
- Focus uses a visible three-pixel green outline. Selected-topic styling differs from Learning/Done status. Labels/icons accompany status colors. Reduced motion removes transitions; loading examples do not pulse indefinitely.
- Email/password auth and profile saves use the connected local services. Other backend actions remain disabled with nearby explanations. Discovery answers and feature preview data are not saved or analyzed. Unsaved local Discovery input offers Stay or Discard; no save outcome is simulated.
- Profile/auth display actual pending/error feedback; catalog includes an actual no-match state. Historical preview-state primitives remain in source but are not the restored screens’ navigation. Actual service connectivity is independent.
- [Fixtures](../frontend/src/fixtures/catalog.ts) are labeled sample content, not published curricula or generated advice. Only Frontend has topic fixtures; other roadmaps explain their unavailable curriculum. No sample values become saved account state.

## References and review findings

The [Figma exports](design/figma/) supply identity/composition: `Dashboard.png`, `Roadmaps.png`, `Entry Choice.png`, question/result exports, account forms, `Optional Profile Setup.png`, and `Role Catalog Suggestion.png`. `Final Round_ Discovery Results.png` actually shows the catalog; `Rounds 1–5_6.png` shows results. No Settings or mobile frames were supplied. Those layouts apply the shared system rather than claiming pixel fidelity.

Safe prototype reuse is limited to adapted Frontend topic text/resource links, status presentation, and the reference's milestone/supporting-column composition. The old orchestrator, API dispatcher, recommendation triggers, activity calculations, generic state store and duplicate roadmap implementation are excluded. Original reference files remain unchanged.

The [Nielsen heuristic review](https://www.nngroup.com/articles/ten-usability-heuristics/) found the following within the preview scope:

| Heuristic | Implemented evidence / remaining limit |
| --- | --- |
| Status visibility | Text statuses and unavailable-action explanations; live feature status awaits integration |
| Familiar language | F-001 copy, career names and explicit topic states |
| User control | Back, Close, Escape and unsaved-input discard/cancel |
| Consistency | Shared cards, controls, navigation and tokens |
| Error prevention | Disabled backend actions; explicit uncertainty exclusions |
| Recognition | Visible labels, selected rows and topic context |
| Efficiency | Keyboard navigation, dedicated URLs and retained catalog filters |
| Minimalism | No repeated placeholder roles, decorative circles or fabricated match percentages |
| Error recovery | Clear-filter action and route recovery; feature failure states remain examples |
| Help | Field guidance, resource access labels and reasons for unavailable actions |

Automated Chromium/axe checks, rendered comparison and interaction coverage are recorded in [Development](development.md). They are not a WCAG conformance or completed usability-study claim. Real browser zoom, assistive technologies and the desktop cross-browser matrix remain manual gates. The narrow CSS-viewport check is reflow evidence, not proof of real browser zoom.

Future agents: consult this guide before UI changes, reuse these components, keep sample fixtures separate from persisted account data, and obtain reviewed feature contracts before connecting data. Update this guide when the implemented system changes. Product-owner review is still needed for the visual baseline and authored curricula; do not backfill approval from a screenshot or a passing automated check.
