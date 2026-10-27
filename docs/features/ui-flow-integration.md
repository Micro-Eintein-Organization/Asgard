# Original UI integration repair

- Implementer / task owner: Codex
- Created: 2026-10-27
- Last updated: 2026-10-27
- Status: implementation patch; runtime, security and visual acceptance pending
- Required human reviewer: project lead / architecture reviewer `@YakisobaNissin`, per [CODEOWNERS](../../.github/CODEOWNERS)
- Authorization: owner's explicit “PLEASE IMPLEMENT THIS PLAN: Restore the original designs and connect the application flow” request, following confirmation that authenticated sessions go to Dashboard and feature backend wiring is deferred.
- Requirements: REQ-01/02/03/04/05/07/10/11/13; NFR-01/02/05. These identify affected behavior, not completed requirement acceptance.
- Branch: `codex/ui-flow-integration`; no reset, commit, push or merge.

## Scope and authority

[Architecture](../architecture.md), [product](../product.md), [decisions](../decisions.md), [Discovery](../specs/discovery.md), [pages and interactions](../pages-and-interactions.md), and [shared-contract handoff](../development.md#stage-4-shared-contracts-and-handoff) retain their subject authority. The owner explicitly selected the already-committed new screen designs as the presentation source, with real feature services left for later.

The original screen source is available in `2befd54`, introduced in `6d19142`. No source reconstruction from screenshots, earlier-commit retrieval, branch reset or history change was necessary. Source was recovered selectively with `git show 2befd54:<path>`, then edited in place for integration.

The earlier patch removed these components and adapted older feature pages instead. The owner rejected that presentation result. This guide replaces the earlier integration claims and handoff: the active screens now load the restored original components, not the older page implementations. It does not claim visual verification that has not occurred.

## Reviewed implementation boundaries

1. Recover original Dashboard, Settings, catalog, Discovery entry/header/wizard/results and setup component source.
2. Preserve original screen hierarchy, columns, section order and utility styling; make focused navigation, accessible-control and truthful-state changes.
3. Keep real login, verification, session restoration, route protection, Profile API and logout. Mount the restored source inside that flow.
4. Keep optional setup within Discovery: Results → Setup → Results, with Save/Skip/Back all returning to results.
5. Leave backend feature services, database/API contracts, dependencies, infrastructure and provider features unchanged.
6. Remove competing presentation changes and redundant full-page alternatives. Retain historical assets and valuable tests.
7. Defer tests, builds and browser verification as explicitly requested; report source evidence separately.

All implementation work belongs to this task; existing repair edits were inspected and selectively corrected. No unrelated contributor edits were identified or overwritten. Source review by Codex is not human technical approval.

## Implementation status

### Active screens and source provenance

| Screen | Restored source | Preserved design and focused integration |
| --- | --- | --- |
| Dashboard | [DashboardScreen](../../frontend/src/screens/DashboardScreen.tsx) | Original 12-column layout with 4-column role/calendar/callout area and 8-column milestone/topic area; rounded role card, orange 28-cell calendar, dark milestone, blue dismissible enrichment callout and three topic groups. Edit opens catalog, enrichment opens Profile, and continuation/topic links use actual sample topic IDs. Calendar/role/progress remain labeled samples; placeholder/profane copy and alert-only actions are removed. |
| Catalog | [RoleCatalog](../../frontend/src/components/catalog/RoleCatalog.tsx) | Original top action row, centered title/search, category pills, four-column card grid and green selected-card treatment. Canonical fixtures supply seven role IDs/content. Selection is local browsing state; the top action opens the selected role's roadmap with catalog query context. Search includes skills; filtered-out selections cannot be submitted; empty results offer reset. |
| Entry | [EntryChoice](../../frontend/src/components/discovery/EntryChoice.tsx), [DiscoveryContainer](../../frontend/src/components/discovery/DiscoveryContainer.tsx) | Original two-card composition and icon areas. Native buttons select a path; Continue opens the chosen URL. Container is now only a router adapter, with no hidden wizard/catalog/setup modes. |
| Discovery | [DiscoveryWizard](../../frontend/src/components/discovery/DiscoveryWizard.tsx), [DiscoveryHeader](../../frontend/src/components/discovery/DiscoveryHeader.tsx) | Original compact header/progress, four-column choice cards, selected badges, illustration placeholders and centered action row. Existing canonical question copy and checkbox/radio/exclusion rules are retained; Back retains open-page answers and focuses the question. Cross-route exit uses the existing unsaved-input dialog. Real generation is unavailable; a separate View sample results link is explicit about that boundary. |
| Results | `DiscoveryResults` in the restored wizard source | Original result heading, three-card/skills composition and bottom action row. Canonical sample roles replace fixed generated matches; badges say Sample suggestion. Cards have direct roadmap links, plus Browse careers, Retake and optional setup actions. No selected-result state, scores or fabricated generation. |
| Setup | [OptionalProfileSetup](../../frontend/src/components/profile/OptionalProfileSetup.tsx) | Original centered title, rounded narrow form card, avatar area, document area, full-width primary action and lower Skip action. First name and optional Surname use real Profile data and versioned saves. Save succeeds before returning; unchanged Continue, Skip and Back return to results. Load failure permits retry/skip. No fake file acceptance or browser-storage profile save. |
| Settings | [SettingsScreen](../../frontend/src/screens/SettingsScreen.tsx) | Original sidebar and combined Profile → Discovery → field preferences → documents → Account/Security composition. Actual names/save/errors/discard and real guarded logout are connected within the original layout. Discovery summary/document/security rows display honest unavailable states. Account navigation opens the security section of this same page, including after profile loading. |
| Roadmap | [Existing roadmap feature](../../frontend/src/features/roadmaps/page.tsx) | Existing functional role/topic/resource page retained. Navigation from restored catalog/results/Dashboard uses canonical fixture IDs; browsing never saves focus or progress. |

The previously changed older full-page modules now re-export the restored implementations. This preserves their import names without maintaining a second full-page implementation: Dashboard, catalog, Discovery, recommendations and Profile/account feature entrypoints are adapters only. Shared Profile validation and reusable primitives remain intact.

### Landing, authentication and routes

- [Landing](../../frontend/src/features/auth/pages.tsx) waits for session restoration. A verified session without restoration error redirects to Dashboard; a logged-out visitor gets the public landing with Log in and Get started. Restoration errors are visible without inventing an authenticated session.
- [Account entry](../../frontend/src/features/auth/connected-page.tsx) also shows session-loading feedback. Its existing password sign-in, registration, verification and verified-session redirect logic remain. Successful returning login targets Dashboard and verification targets Welcome.
- [Shell](../../frontend/src/app/shell.tsx) keeps application navigation/account menu inside app locations; public navigation has Log in/Get started. No Continue-to-app/Open-Dashboard substitute removes the logged-out account-entry actions.
- [Screen exports](../../frontend/src/app/screens.ts) load the restored components directly. [Router](../../frontend/src/app/router.tsx) retains one protected registration per application path. `/catalog` redirects to Careers, `/settings` to Profile, and `/roadmaps` to the existing Frontend example.
- `/settings/account` redirects to `/settings/profile#account-security`; Settings scrolls/focuses that section after data loading. There is no separate replacement account screen.
- `/profile-setup` is protected and loads the original setup component. Save, Skip and Back return to `/recommendations`.
- Supabase provider/session configuration, JWT transport and backend authorization were not changed. No sessions were forcibly cleared. Logout uses the existing guarded helper and returns to the public landing.

### Connected Profile behavior

[use-profile-editor](../../frontend/src/features/profile/use-profile-editor.ts) and [profile-editor-dialogs](../../frontend/src/features/profile/profile-editor-dialogs.tsx) remain the shared editing core for the restored Settings and setup components. They reuse the existing API, generated types, account-keyed query/cache, name validation, expected version, stale-version reload, dirty/pending navigation protection, before-unload and logout guard.

The expected version stays tied to the loaded form while dirty. A background refetch does not silently authorize overwriting newer data. Duplicate save entry is guarded, failed writes retain input, and late responses after account changes do not update another account's editor. Reload clears input only after a successful current-account read. Pending saves prevent conflicting leave actions.

Field preferences are local-only, explicitly unsaved, participate in dirty navigation protection, and are not sent with name saves. Setup does not save a fake upload flag, recommendations or learning focus.

### Retired simulation and competing presentation

- The simulated `services/discoveryService.ts`, duplicate `data/discoveryQuestions.ts` and `types/discovery.ts` are removed; the restored wizard uses canonical question copy directly. No random failure, timeout-based fake request, fixed match percentage, browser draft or selected-role storage remains in the active components.
- The earlier replacement `features/profile/setup-page.tsx` was removed; the recovered original setup component is the active page.
- The old feature page implementations are adapters to the restored components, rather than competing full screens.
- `styles.css` was recovered from `2befd54`, removing the earlier patch's catalog/wizard/setup/Settings presentation overrides. The only added rule marks the original entry buttons' selected state.
- Historical reference assets, fixture sources, existing tests, migrations, generated API contracts, manifests/locks and backend remain unchanged. No browser-storage keys or private data were deleted.

## Navigation handoff

| Starting point / action | Destination or effect |
| --- | --- |
| Logged-out landing / Log in | Existing sign-in form |
| Logged-out landing / Get started | Existing registration and verification flow |
| Verified session / landing or sign-in | Dashboard after session restoration |
| Successful returning login | Dashboard |
| Verified new registration | Welcome entry choices |
| Welcome / select path + Continue | Discovery or Careers |
| Discovery / Back | Previous open-page question, or Welcome at the beginning; unsaved guard on exit |
| Discovery / Skip questions | Careers with unsaved guard |
| Final question / View sample results | Results with explicit sample notice; not generation success |
| Results / View roadmap | Corresponding canonical role roadmap |
| Results / optional setup | Protected setup form |
| Setup / successful Save or unchanged Continue | Results |
| Setup / Skip or Back | Results without saving; dirty input requires a deliberate leave decision |
| Setup / failed save or canceled discard | Stay on setup with input retained |
| Catalog / selection + View roadmap | Selected visible role's roadmap; preserve search/category context |
| Roadmap / Back to catalog | Catalog with query context |
| Dashboard / Profile Enrichment | Original combined Settings page |
| Account/security action | Security section of original Settings |
| Successful guarded logout | Public landing with account-entry actions |

## Source comparison and evidence

**Completed source work:** recovered original components from the named commit, compared original grid/container/section classes with committed source during editing, inspected lazy exports/routes/action targets and references, and formatted changed sources using the existing container's installed Prettier. Formatting parses source; it is not typechecking or runtime validation. Changed tracked files passed whitespace inspection; all 47 local documentation paths in this guide and the design guide resolved. Link-path resolution does not validate remote sites or demonstrate application behavior.

Examples of preserved original structure: Dashboard `lg:grid-cols-12`, `lg:col-span-4/8`, orange calendar cells and dark gradient; catalog `lg:grid-cols-4` and selected card badge; Settings `md:grid-cols-12`, `md:col-span-3/9` and combined security rows; setup `max-w-md rounded-3xl p-8` card. Functional/semantic changes and canonical content substitution are described above. No claim of exact rendered fidelity follows from source comparison.

**Not run, owner-deferred:** tests, TypeScript/lint checks, builds, browser/manual authentication and Profile flows, security/session/ownership checks, rendered screenshot comparison, keyboard/contrast/reflow checks and full regression. No application test result is claimed. No services were started/restarted and no provider calls were made by this task.

## Guided manual verification when authorized

Starting URL: `http://127.0.0.1:5173/`, using the owner's already configured local environment.

1. If already signed in, expect Dashboard. Use actual Log out, then revisit landing: expect Log in/Get started. Log in should show email/password inputs and real provider feedback; successful login should show the original Dashboard layout.
2. Follow new-account verification to Welcome, choose either entry path and confirm the original cards/catalog. Direct app URLs while signed out require account entry.
3. Exercise question checkboxes, single-choice goal, uncertainty/background exclusions, Back and canceled/confirmed exit. Open explicitly labeled sample results; do not expect generated recommendations.
4. Open optional setup from results. Test Save, unchanged Continue, Skip and Back returning to Results; verify a saved name in original Settings. Failed save must retain input; canceled discard must stay; pending saves must not permit a conflicting operation.
5. Filter/select a catalog role, open its roadmap, and return with query/category context. Use Dashboard topic links. These actions do not save focus/progress.
6. Open Account/security from navigation and a direct URL; confirm the combined Settings security section is reached after loading. Check real logout and dirty/pending guards.
7. Compare every restored screen with committed source/new-design references at desktop width, then review keyboard paths and zoom/reflow. File/source similarity is not a substitute for this rendered check.

Report failures with URL, session state, steps, expected/actual result and visible errors. Do not include credentials, tokens or private documents.

## Limitations and review readiness

Feature backend wiring remains deferred by explicit owner instruction. Dashboard/activity/catalog/results contain samples; persisted Discovery, generation, current-focus/progress saves, uploads/photo processing and MFA are unfinished. Unsupported document and security rows retain their design with disabled actions and explanations; they do not claim success.

Conditional Discovery routing still requires its separately reviewed authored map; the current question sequence remains a labeled prototype. Canonical roles other than Frontend may explain missing curriculum on their roadmap. No backend or product readiness is inferred from the restored design.

This patch is ready for designated human source review, not runtime/visual acceptance or integration. Source checks, essential security/Profile checks and guided rendered review remain required when authorized. Follow-up owner for feature backend wiring is unassigned here. No commit, push or merge was performed.
