# Adding careers and roadmaps

Resource update, 2026-11-02: release 4 replaces the imported generic resource lists
with [topic-specific selections](../backend/app/content/topic-resources.json) for
all 288 published topics. Destinations/anchors were checked; license and independent
curriculum acceptance remain separate. Existing topic identities and saved state
are preserved. See [release evidence](features/roadmap-content-expansion.md).

Local update, 2026-11-02: release 3 imports the owner's v4 pack as supplied,
with resource verification explicitly waived in this task. The existing publisher
now includes this release. Imported resource access remains unverified, not
certified free. See the [roadmap expansion guide](features/roadmap-content-expansion.md)
for retirement, publication checks and pending acceptance. This bounded owner
exception does not approve other unreviewed content or provider license terms.

Updated 2026-10-28. Maintainer: project owner; implementation guide: Codex.

Use [the catalog schema](../supabase/migrations/20261026000100_shared_foundation.sql)
and [starter content source](../backend/app/content/prototype_v1.py) as the current
contract and authored example. The owner reviews career relevance and curriculum;
generated SQL does not establish content approval.

1. Author a career title, unique slug, category, description, responsibilities,
   skills and reviewed relevance attributes. Interests describe exploration, never ability.
2. Author a roadmap, milestones, ordered topics, explanations and prerequisites.
   Optional branch groups contain ordered branches; topics identify their branch.
   Every published career needs a published roadmap destination.
3. Record genuine resource URLs, type, free-access flag, license, review date and
   provenance. Link to resources; do not republish protected material.
4. Allocate stable UUIDs through the namespace/key convention in
   [the renderer](../backend/scripts/render_prototype.py). Never reuse an identity
   for different content or change published content under the same release.
5. Prepare a reviewed additive publication with
   [the publication renderer](../backend/scripts/render_content_release.py).
   Validate references, positions, branches, prerequisites and URLs. Advance revisions
   and notes; retire historical content instead of deleting progress identities.
6. Publish administratively, never through the runtime role.
   `node scripts/publish-local-content.mjs` installs the current starter artifact
   repeat-safely and refuses conflicts. It is not an overwrite command for a new release.

The 2026-10-29 Data Analyst revision is rendered by
`backend/scripts/render_data_analyst.py` into
`supabase/content/20261029_data_analyst.sql`. It preserves the original roadmap,
branch and equivalent topic IDs. The local publisher applies the original release
before this revision and validates the resulting content on repeat publication.
It does not change user-owned tables. New totals reflect added learning material.
The practice CSV and reference outputs are linked from the Data Analyst roadmap.

The local publisher now wraps the ordered releases in one administrative
transaction with a shared advisory lock, expected release identities and conflict
checks. It validates untouched original records as well as the revised path.
`node scripts/render-publication.mjs` emits the same portable SQL for an
operator-managed psql connection; see [deployment](deployment.md).
Isolated acceptance passed fresh migrations/release 1, saved-state upgrade,
repeat publication and conflict rollback on 2026-10-29. Human content review is
still required; automated publication does not establish pedagogical approval.

The browser reads published content through generated API types. Content following
these contracts needs no page-specific fixtures. After publication check search,
roadmap destinations, branch choices, summaries, retained history and AI candidates.
See [future development](future-development.md) for skill taxonomy and assessment.
