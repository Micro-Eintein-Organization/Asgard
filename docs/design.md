# Asgard: Implemented UI foundation

Updated 26 October 2026. Stage 3.5 canonical application UI, retaining the Stage C visual foundation; project-lead visual review is pending. [Product](product.md), [pages](pages-and-interactions.md), [journeys](user-journeys.md) and [architecture](architecture.md) retain authority over behavior and technical boundaries. This guide describes the implemented presentation, not approval of product integrations or curricula.

The [later Stage 4 foundation](development.md#stage-4-shared-contracts-and-handoff) adds shared SQL/API scaffolding without connecting these sample screens. References below to Stage 3.5 not introducing contracts describe that UI task's scope; they do not mean the current repository lacks contracts. [Current foundation status](development.md#current-foundation-status-and-evidence) distinguishes source, recorded evidence and pending acceptance.

## Identity and hierarchy

Asgard uses white cards, light neutral surfaces, dark text/actions and a restrained green selection/progress accent. Arial/Helvetica matches the sans-serif character of the supplied exports without adding a font dependency. The text wordmark remains Asgard. There are no generated illustrations, invented people, testimonials or match scores.

Design direction: ENERGY 1 / RHYTHM 2 / MOTION 1. Career exploration stays calm and readable; page composition varies with its task. The dark Dashboard milestone establishes the main continuation action. Its dark gradient follows the reference's hierarchy; it is not a page-wide effect. Borders group content; shadows are reserved for floating menus/dialogs. Functional icons identify navigation, search, account, resources and status; they do not fill empty illustration space.

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

Use the four-pixel spacing scale through matching Tailwind utilities or CSS rem values: 4, 8, 12, 16, 24, 32 and 48 px. Body text is 16 px with 1.6 line height; card copy is generally 14 px. Page headings scale from 30 to 44 px; the public introduction has a larger display scale. Controls have at least 44 px touch height. Primary actions use black pill buttons, following the Figma entry/Discovery references. Secondary controls, cards and dialogs use 8/14/16 px radii. Disabled actions stay neutral gray with nearby explanations; they do not appear available. Neutral gray surfaces and black-to-gray milestone gradients replace the earlier green-tinted neutrals. Green identifies selection, progress and success.

| Import location | Responsibility |
| --- | --- |
| `@/components/ui/*` | shadcn button, input, label, card, badge, dialog, dropdown, tabs, accordion, alert, skeleton, progress and selection primitives |
| `@/components/shared` | PageHeading, BackLink, Notice, StatePanel, StatusBadge and unavailable-action helpers |
| `@/components/career-card` | One career card for catalog and sample results |
| `@/components/unsaved-preview-dialog` | Stay / discard navigation guard for local preview input |
| `@/components/preview-states` | Explicit sample/empty/loading/error review controls, not production data loading |

Primitives were obtained through the [official shadcn registry](https://ui.shadcn.com/docs/installation/manual), then adapted for local imports, tokens, contrast and touch sizing. Their [MIT license](../frontend/src/components/ui/LICENSE.md) is preserved. Feature-specific layout belongs in `src/features/`; shared components do not own persistence or product invariants.

## Shell, routes and reflow

[AppShell](../frontend/src/app/shell.tsx) supplies the compact Dashboard / Roadmap / Settings header, account menu, skip link and footer to the authenticated application. Roadmap opens the catalog; Discovery, recommendations and roadmap availability are reached through page actions. Settings opens Profile, with Account and security in the shared Settings navigation and account menu. [Routes](../frontend/src/lib/routes.ts) centralize public entry and protected application addresses; screen bundles load separately. Email/password account access and the profile API are connected. Protected feature routes retain the canonical populated screens, sample fixtures and visual-state controls. A shared Demo content notice distinguishes these examples from saved account data. Standalone `/preview/...` routes and the component gallery are removed; `/status` retains the technical connectivity check.

The MVP targets desktop/laptop widths of approximately 1280–1920 px under [NFR-02](product.md#nfr-02-desktop-compatibility-and-accessible-reflow). Content is capped at 1248 px to keep reading widths comfortable on larger displays. Desktop navigation stays visible, catalog categories sit beside a three-column grid, and roadmap details sit beside milestones. Discovery uses four choice columns; entry uses two.

Existing smaller-width layouts and Menu navigation remain to preserve working code and support zoom/reflow. Further mobile-specific design and optimization are outside MVP scope. Topic details move focus to their heading; Close returns it to the selected row. Catalog query/category state lives in the URL and survives topic navigation. Overflow must remain visible and usable, not hidden to conceal layout failures.

## Interaction and honesty

Stage 3.5 preserves the former Preview's visual foundation in the working application. Login opens Dashboard; verified registration opens Welcome / entry, where Browse careers opens the catalog and Guided Discovery opens the unfinished five-question skeleton. The owner-selected flow allows later questions or choice sets to depend on earlier answers; the current fixed progress indicator and choices do not implement or define that routing. Profile setup remains optional. [SettingsLayout, ProfileDetailsCard and ProfileNameFields](../frontend/src/features/profile/settings-layout.tsx) remain shared components. The connected Profile retains explicit name saves, stale-version feedback, discard/reload confirmation and Save-and-leave protection. Its career-background, saved-suggestions and preference sections preserve the former Preview's presentation as labeled prototypes. Preference selections are local only, participate in the existing unsaved-input guard and are never included in Profile saves. Successful logout returns to `/`; dirty profile edits require confirmation before logout. The shared logout helper still delegates session clearing to the existing Auth provider. Dashboard, Careers, Roadmaps, Discovery, Recommendations and the activity calendar retain their populated components; the public Preview route tree, mode-switching helpers and disconnected Profile/auth forms are removed. One account-entry form implementation also presents unavailable configuration and recovery states. Demo data remains in `frontend/src/fixtures/catalog.ts`, separate from the FastAPI-backed Profile data. Discovery answers and demo activity remain unsaved. No Stage 4 contracts or Stage 5 logic are introduced. See the [preservation and verification handoff](stage-3.5-handoff.md); browser verification remains pending owner review.

- Native labeled radio/checkbox cards implement only local selection. F-001 supplies question copy and combination rules; no inferred recommendation mapping is added.
- Menus, tabs, accordions and dialogs retain semantic keyboard controls. Dialogs close with Escape and return focus. Route changes focus the heading without outlining the entire page.
- Focus uses a visible three-pixel green outline. Selected-topic styling differs from Learning/Done status. Labels/icons accompany status colors. Reduced motion removes transitions; loading examples do not pulse indefinitely.
- Email/password auth and profile saves use the connected local services. Other backend actions remain disabled with nearby explanations. Discovery answers and feature preview data are not saved or analyzed. Unsaved local Discovery input offers Stay or Discard; no save outcome is simulated.
- Empty/loading/error examples remain available through the data screens' state selectors. Real Profile and auth feedback retain success/error styling. The standalone component gallery is removed; its shared primitives, tokens and assets remain. Actual service connectivity is independent.
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
