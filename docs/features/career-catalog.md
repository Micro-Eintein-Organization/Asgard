# Career catalog

- Created: 2026-11-02
- Last updated: 2026-11-02
- Status: implemented source; manual visual acceptance pending
- Requirements: [REQ-02 and REQ-03](../product.md)

- Review reference: category-sidebar presentation accepted from the supplied reference.

## Behavior

[RoleCatalog](../../frontend/src/components/catalog/RoleCatalog.tsx) displays
published categories in its left navigation, with All fields and numbered category
buttons. The selected category has a dark background and a pressed state. Search
appears above the role cards. Cards contain the category, career title, short
description, skills and a direct View roadmap button; no preliminary selection
is required. Saved recommendation groups, errors, loading and no-match states
remain. The URL preserves search/category filters when entering a roadmap and
returning. Category navigation stacks above the cards at smaller widths.

The catalog displays published API content; the unreviewed v4 drafts are not
silently presented as published curricula. Source research and release readiness
are recorded in [roadmap content expansion](roadmap-content-expansion.md).

## Verification

On 2026-11-02 `npm run typecheck` in frontend passed. No dependencies, API or
database contracts changed. Broad regression and browser matrix checks were
deferred per recorded scope. Visual and keyboard acceptance remain pending.

At http://127.0.0.1:5173/careers, sign in, select a category and search for a skill.
Only matching published careers should remain. Open View roadmap on a card, then
Back to catalog: both filters should be retained. Reset filters in the empty
state. Use Tab and Enter to check navigation and focus. At browser zoom, cards
and category navigation should reflow without clipped text. Report failures with
the category, search term, browser/zoom and the unexpected result.
