# Asgard: Implemented UI foundation

Footer follow-up, 2026-11-17: the black footer now links to public Licenses,
Credits, draft Terms and conditions, and Service status. The existing `/status`
connectivity checks now have an availability summary, separate API/data results,
last-check time and manual retry. No historical uptime claim is displayed.
These public pages reuse current typography, surfaces and focus behavior;
focused-onboarding exclusions remain. See the
[implementation and verification](features/footer-information-and-service-status.md)
for completed checks, remaining browser coverage and Terms review.

Longest streak, 2026-11-16: the Dashboard's existing calendar card now shows the
account's actual longest qualifying run in place of Not available. Composition
is unchanged. See [learning-streak evidence](features/learning-streaks.md).

Loading follow-up, 2026-11-16: existing loading text now pairs with the supplied
snowflake (2.4 s rotation; stationary under reduced motion). Existing save
confirmation fades share the motion tokens. Counselor context is automatic;
its composer has neutral focus feedback and a 44 px circular send action.
The owner disabled roadmap experience comparison and its suggestion-card links.
See [current implementation evidence](features/ui-refinement-and-motion.md).

Refinement, 2026-11-16: shared control sizing and CSS/Radix motion presets now
follow the existing presentation. Page changes use a brief fade; reduced motion
disables animation. See [implementation and verification](features/ui-refinement-and-motion.md)
for scope, evidence and pending human/desktop acceptance. Existing layouts and
colour meanings remain the baseline; no palette, font or page redesign was added.

Catalog correction/review, 2026-11-03: catalog cards use a short authored opening
sentence and up to three skill chips; category numbers/labels have separate,
left-aligned wrapping columns. See [catalog evidence](features/career-catalog.md#compact-cards-and-sidebar-correction-2026-11-03).
The renewed [Cabusao gap review](plans/cabusao-ui-gap-review-2026-11-03.md) recorded
Settings, roadmap, Results and Dashboard composition gaps. Those scoped corrections
are now implemented: shared Settings cards and account view, published topic
guidance sections/status, Results metadata/navigation and milestone shortcuts.
See [completion evidence](features/cabusao-ui-integration.md#agreed-ui-completion-2026-11-03).
Human reference-fidelity review remains pending.

Discovery update, 2026-11-03: questionnaire choices use one row at 1280–1920 px,
including uncertainty, with a question-specific column count and a wider existing
page container. Welcome retains two choices; narrower effective widths wrap for
accessible reflow. The last-question action is **See suggestions**: save and
complete first, then request once and open results without another initial generate
button. Errors retain explicit retry and saved-state recovery. See the
[repair evidence](features/cabusao-ui-integration.md#discovery-flow-repair-2026-11-03).

Correction, 2026-11-03: Cabusao component structure is the presentation baseline,
not merely its stylesheet. The first integration retained competing newer markup
and did not establish fidelity. Dashboard, onboarding, results and catalog now
restore reference structure around current data/services. See the
[correction record](features/cabusao-ui-integration.md#presentation-correction-2026-11-03)
for exceptions and pending screenshot/authenticated acceptance.

Integration update, 2026-11-03: the approved Cabusao presentation integration uses
a fixed header, full-width black footer, shared pill controls, selected cards and
sticky roadmap details. Selection blue is `#286b9f` to support white text.
The Career dropdown and account-backed focus, progress, Discovery and suggestion
services remain current. See [integration evidence](features/cabusao-ui-integration.md)
for implementation and pending acceptance; historical inventories below do not
certify this merged presentation.

Updated 27 October 2026. Stage 3.5 canonical application UI with the later UI-flow repair; project-lead visual review is pending. [Product](product.md), [pages](pages-and-interactions.md), [journeys](user-journeys.md) and [architecture](architecture.md) retain authority over behavior and technical boundaries. This guide describes the implemented presentation, not approval of product integrations or curricula.

The current UI uses account APIs, published content, and explicit unavailable states. Guided Discovery v2 and saved deterministic results supersede the original questionnaire/result fixtures. See [current interactions](pages-and-interactions.md), [Discovery](features/guided-discovery-v2.md), and [Development](development.md) for implementation and evidence. Earlier dated presentation sections describe their original scope.

## Identity and hierarchy

Catalog update, 2026-11-02: the owner-supplied category-sidebar reference now
defines catalog navigation. Categories appear on the left, search above the
cards, and each role opens its roadmap directly. This supersedes the category
pills and selected-card descriptions below for the catalog only. See the
[implementation guide](features/career-catalog.md) for checks and pending visual
acceptance.

Asgard uses white cards, light neutral surfaces, dark text/actions and a restrained green selection/progress accent. Arial/Helvetica matches the sans-serif character of the supplied exports without adding a font dependency. The header/onboarding wordmark uses the supplied light-mode Snowflake + ASGARD image through [BrandLogo](../frontend/src/components/brand-logo.tsx). There are no generated illustrations, invented people, testimonials or match scores.

Design direction: ENERGY 1 / RHYTHM 2 / MOTION 2. Career exploration stays calm and readable; page composition varies with its task. The dark Dashboard milestone establishes the main continuation action. Its dark gradient follows the reference's hierarchy; it is not a page-wide effect. Borders group content. The restored committed screens retain their original card/banner shadows and calendar/callout accents. Functional icons identify navigation, search, account, resources and status; they do not fill empty illustration space.

Owner-approved motion refinement, 2026-11-17: small page/content glides and fades,
consistent control feedback and smooth expansion use 140/160/220/280 ms feedback,
exit, entry and expansion tokens. Reduced motion renders final states immediately.
See [implementation and pending visual acceptance](features/ui-refinement-and-motion.md#fluid-motion-follow-up-2026-11-17).

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

[AppShell](../frontend/src/app/shell.tsx) supplies the compact Dashboard / Roadmap / Settings header, account menu, skip link and footer to the authenticated application. Roadmap opens the catalog; Discovery, recommendations and roadmap availability are reached through page actions. Settings opens the original combined Profile and security page; Account and security navigation targets its security section. [Routes](../frontend/src/lib/routes.ts) centralize public entry and protected application addresses; screen bundles load separately. Email/password account access and the profile API are connected. Protected feature routes load the restored committed screen layouts with account API data or genuine unavailable states. The shared Demo content notice and landing sample progress were removed by the persisted-core follow-up. Standalone `/preview/...` routes and the component gallery are removed; `/status` retains the technical connectivity check.

The MVP targets desktop/laptop widths of approximately 1280–1920 px under [NFR-02](product.md#nfr-02-desktop-compatibility-and-accessible-reflow). Content is capped at 1248 px to keep reading widths comfortable on larger displays. Desktop application navigation stays visible. The catalog has centered search and wrapping category pills above a four-column grid at wide desktop widths; smaller widths retain one or two columns. Roadmap details sit beside milestones. Discovery uses one desktop row for the current question's choices; entry uses two columns.

## Original screen restoration, 27 October 2026

The owner rejected the earlier replacement of new screen source with adapted older feature pages and explicitly approved “Restore the original designs and connect the application flow.” The current [implementation guide](features/ui-flow-integration.md) supersedes the earlier integration/visual-completeness claims. Source was recovered selectively from `2befd54` (introduced in `6d19142`), without reconstructing screenshots or resetting the branch.

[DashboardScreen](../frontend/src/screens/DashboardScreen.tsx) retains its original role/calendar support column, orange calendar grid, dark milestone, three topic groups and blue dismissible enrichment callout. [RoleCatalog](../frontend/src/components/catalog/RoleCatalog.tsx) retains its top action, centered search, category pills, four-column grid and selected-card appearance. [SettingsScreen](../frontend/src/screens/SettingsScreen.tsx) retains its combined Profile, Discovery, preferences, document and security composition. Its name saves and logout use the existing real Profile/Auth integration; unsupported file/security operations are disabled and explained.

[EntryChoice](../frontend/src/components/discovery/EntryChoice.tsx), [DiscoveryHeader and DiscoveryWizard](../frontend/src/components/discovery/DiscoveryWizard.tsx), and [OptionalProfileSetup](../frontend/src/components/profile/OptionalProfileSetup.tsx) retain their committed card/header/form composition with targeted semantic and navigation changes. The current application renders the published versioned questionnaire in the shared card/grid/header structure. Results renders saved deterministic v2 suggestions or eligible provider-backed results with direct roadmap actions and no match scores or result selection. Entry, checkpoint errors, resume and optional setup retain their original composition. Setup saves actual names and returns Save/Continue/Skip/Back to Results; it does not simulate uploads.

The [lazy screen map](../frontend/src/app/screens.ts) loads these components directly. Older full-page feature modules are re-export adapters to the same implementations, not alternate screens. The earlier competing catalog/wizard/setup/Settings CSS was removed by recovering the committed stylesheet; a small rule marks entry selection. The simulated recommendation service, duplicate question definitions and draft types remain removed. Roadmap/topic presentation and canonical fixture identities remain unchanged.

Landing and account entry wait for session restoration. Verified existing sessions go to Dashboard; logged-out visitors see public Log in/Get started and the existing real account forms. Verified registration goes to Welcome. Protected application paths and guarded logout remain. `/settings/account` resolves to `/settings/profile#account-security`; `/profile-setup` is a protected page in the Discovery flow.

Formatting and source/reference comparison are recorded in the guide. Tests, builds, type/lint checks, browser/visual comparison, keyboard/contrast/reflow review and security acceptance remain deferred by the owner's instruction. This describes restored source and integration, not demonstrated rendered fidelity or finished feature services.

Existing smaller-width layouts and Menu navigation remain to preserve working code and support zoom/reflow. Further mobile-specific design and optimization are outside MVP scope. Topic details move focus to their heading; Close returns it to the selected row. Catalog query/category state lives in the URL and survives topic navigation. Overflow must remain visible and usable, not hidden to conceal layout failures.

## Interaction and honesty

Owner-approved focused onboarding follow-up, 27 October 2026: `/welcome`, `/discovery`, `/recommendations` and `/profile-setup` omit the application header/navigation/account menu, global demo notice and footer. A small non-interactive supplied logo sits within their main content. The skip link, route focus, screen-specific controls, local sample/unavailable disclosures and protection/unsaved-edit guards remain. These restored screens keep their existing layout. Entry and new-user question input are initially unselected. The authored activities variant follows saved interests; returning users explicitly resume their draft. The shell is route-based for new and returning visitors, with no persisted completion flag. Careers, Dashboard, Settings and roadmap pages retain the normal shell, and public/application headers use the supplied logo. Image proportions/transparency remain intact; no alternate brand variants, new artwork, palette or fonts are added. The [follow-up guide](features/ui-flow-integration.md#focused-onboarding-and-branding-follow-up-2026-10-27) records scope, files and deferred acceptance.

The current route flow is Landing/account access → Dashboard for returning users, or Welcome for verified registration. Welcome offers Discovery or direct Careers. Results offers direct roadmap browsing and optional setup; setup returns to Results. Real Profile editing shares its account-keyed controller and dialogs between original Settings and setup. Profile names and category/timezone preferences have separate API saves. Documents and AI recommendations remain unavailable. Failed saves remain recoverable; dirty/pending edits retain navigation/logout protection. The [guide](features/ui-flow-integration.md) records the complete action map and limitations.

The [Stage 3.5 handoff](stage-3.5-handoff.md) remains historical foundation evidence within its original scope. Its former screen ownership, preview controls and shared Settings composition do not override the owner's later original-source selection. Conditional Discovery routing still requires an authored/reviewed map; fixed prototype progress is not production route authority.

- F-001 supplies question-copy and combination rules. The owner-approved connected-prototype map branches activities only, preserving inactive saved answers and excluding them from provider input. This does not define assessed career fit.
- Menus, tabs, accordions and dialogs retain semantic keyboard controls. Dialogs close with Escape and return focus. Route changes focus the heading without outlining the entire page.
- Focus uses a visible three-pixel green outline. Selected-topic styling differs from Learning/Done status. Labels/icons accompany status colors. Reduced motion removes transitions; loading examples do not pulse indefinitely.
- Email/password auth and Profile retain their established services. Core learning/preferences actions use existing-contract API handlers in unverified source. Discovery and Groq have real saved-state service implementations in unverified source. Documents and MFA remain explicitly unavailable; no save outcome is simulated.
- Profile/auth display actual pending/error feedback; catalog includes an actual no-match state. Historical preview-state primitives remain in source but are not the restored screens’ navigation. Actual service connectivity is independent.
- [Fixtures](../frontend/src/fixtures/catalog.ts) remain historical source and are not imported by the current application screens. Catalog content must be reviewed and published; no fixture values become saved account state.

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
