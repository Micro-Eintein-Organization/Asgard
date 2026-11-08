# Career catalog

- Implementer: Codex
- Created: 2026-11-02
- Last updated: 2026-11-03
- Status: compact-card/sidebar correction implemented with focused local browser evidence; human review and full browser/zoom acceptance pending
- Requirements: [REQ-02 and REQ-03](../product.md)
- Technical reviewer: [CODEOWNERS](../../.github/CODEOWNERS)
- Review reference: owner supplied category-sidebar screenshot and requested implementation in this chat.

## Behavior

[RoleCatalog](../../frontend/src/components/catalog/RoleCatalog.tsx) displays
published categories in its left navigation, with All fields and numbered category
buttons. The selected category has a dark background and a pressed state. Search
appears above the role cards. Cards contain the category, career title, short
description, up to three skills and a direct View roadmap button; no preliminary selection
is required. Saved recommendation groups, errors, loading and no-match states
remain. The URL preserves search/category filters when entering a roadmap and
returning. Category navigation stacks above the cards at smaller widths.

## Compact cards and sidebar correction, 2026-11-03

Implementer: Codex. Reviewer: @YakisobaNissin. Owner reference: the screenshots and
explicit request to shorten catalog cards and repair the broken sidebar in this
chat. [Bounded scope](../plans/catalog-compact-cards-2026-11-03.md).
Requirements: REQ-02/03 and NFR-02. This extends the existing presentation; human
review remains pending and no additional product/API behavior is authorized.

Cards use the opening authored sentence, bounded to 160 characters with a
word-boundary ellipsis if necessary. They show at most three original skill chips
and the actual remaining count. Full descriptions and skills are retained in the
published API and roadmap, and search still uses full source data. No new career
copy or curriculum was invented or published. Card height follows content.

The numbered category spans had lost their category-number class and were caught
by an old last-span count rule, pushing the number toward the label. The shared
Button also supplied white-space: nowrap. Separate number/name spans now have a
fixed number column and flexible, left-aligned wrapping labels. Selected and
keyboard states keep the existing shared tokens. No global Button change was made.

Sources: RoleCatalog and scoped catalog CSS. Three new focused component tests passed
for summary/skill limits, complete source preservation, direct roadmap callback,
separate number/label spans and search preservation on category change. All three
original regressions were also retained and passed: search clearing/focus, exact
recommended-roadmap navigation/badge and withholding unresolved percentages.
Six catalog tests passed in total. Frontend
TypeScript and lint passed. The focused signed-in Chrome check passed at 1280,
1440, 1920 and 320 CSS px: bounded cards, aligned desktop labels, category selection,
no page overflow and roadmap navigation returning to the original search. Largest
observed card was 427 CSS px at each tested width. The temporary synthetic account
was removed; zero provider calls were made. Screenshots are in ignored
`tmp/discovery-repair/catalog-*.png`; 1440 presentation was visually inspected.

Focused UI gate: layout/reflow PASS (geometry and screenshots), behavior PASS
(category/search and direct roadmap/back), copy/purpose PASS (existing authored
summary and bounded preview), consistency PASS (existing cards/buttons/tokens).
Independent browser engines, actual browser zoom, screen readers and human design
approval remain pending. No backend, schema, dependency or Auth changes.

The renewed [Cabusao gap review](../plans/cabusao-ui-gap-review-2026-11-03.md)
records remaining presentation differences elsewhere; this catalog fix does not
claim complete visual integration across the application.

The catalog displays published API content; the unreviewed v4 drafts are not
silently presented as published curricula. Source research and release readiness
are recorded in [roadmap content expansion](roadmap-content-expansion.md).

## Verification

On 2026-11-02 `npm run typecheck` in frontend passed. No dependencies, API or
database contracts changed. Broad regression and browser matrix checks were
deferred per owner instruction. Visual and keyboard acceptance remain pending.

At http://127.0.0.1:5173/careers, sign in, select a category and search for a skill.
Only matching published careers should remain. Open View roadmap on a card, then
Back to catalog: both filters should be retained. Reset filters in the empty
state. Use Tab and Enter to check navigation and focus. At browser zoom, cards
and category navigation should reflow without clipped text. Report failures with
the category, search term, browser/zoom and the unexpected result.
