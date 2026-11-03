# Compact catalog cards and category alignment

Created/updated: 2026-11-03. Implementer: Codex. Reviewer: @YakisobaNissin.
Scope: the owner's explicit catalog correction, within the existing approved
Cabusao/catalog presentation integration. Human review remains pending.
Status: implemented; six catalog tests, TypeScript/lint and focused local Chrome
checks passed. The renewed cross-screen review is recorded separately in
[Cabusao gaps](cabusao-ui-gap-review-2026-11-03.md).
Requirements: REQ-02/03 and NFR-02. Preserve existing working-tree edits.

Bounded implementation: use the first authored description sentence (at most
160 characters with a word-boundary ellipsis for longer text), at most three
existing skill chips and an honest remaining count. Separate category number
and label spans; left-align both, allow long labels to wrap, and preserve native
pressed/focus states. Keep direct roadmap actions, published search/filter data,
recommendation grouping and progress semantics unchanged.

Affected modules: RoleCatalog and scoped catalog CSS; targeted component checks;
career-catalog implementation guide and design documentation. No schema, API,
Auth, dependency or content-publication change. Full descriptions and skill data
remain authoritative in the API and roadmap content.

Verification: focused component tests, frontend TypeScript/lint, signed-in local
Chrome review at 1280/1440/1920 and narrow reflow; category selection/search and
roadmap navigation. Reuse the existing temporary-account browser helper rather
than building new infrastructure. No Git publication is authorized.
