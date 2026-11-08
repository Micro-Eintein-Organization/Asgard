# Roadmap content expansion

- Implementer: Codex
- Created: 2026-11-02
- Last updated: 2026-11-02
- Status: locally published; independent curriculum/technical acceptance pending
- Requirements: [REQ-02, REQ-03 and REQ-07](../product.md)
- Reviewer: project owner, mapped in [CODEOWNERS](../../.github/CODEOWNERS)
- Authorization: owner approved the plan and current branch, then explicitly waived resource verification and requested import as supplied in this chat on 2026-11-02.

## Implemented behavior

The [v4 source pack](../../backend/app/content/guide_v4/) retains original draft
labels and research notes. [The converter](../../backend/scripts/convert_guide_v4.py)
maps guide sections into labeled plain-text topic explanations. Subtopics remain
inside their parent topic with no independent progress state.

[The release renderer](../../backend/scripts/render_guide_release.py) emits
[release 3](../../supabase/content/20261102_guide_v4.sql), included in the existing
administrative publisher. It publishes 12 roadmaps, 72 milestones, 288 topics and
429 resource records, with two careers per category. Category, Frontend and Data
Analyst career identities are reused. Three old roadmaps and the combined UI/UX
career are retired; their topics, resources, branch choices and progress remain.
No user focus or completion transfers automatically. Retired UI/UX links resolve
to their historical path. Data Analyst downloads stay on the original roadmap.

The release validates the captured non-private release-2 catalog baseline before
transition and checks final identities on repeats. Prior releases are applied on
fresh installations; their superseded assertions are skipped after release 3.
Publication retains its transaction and advisory lock. No schema/API changes or
new dependencies were added.

## Source limitations

Resource verification was waived by the owner. Imported resources conservatively
use is_free=false and display Access not verified. Usage notes retain supplied
access claims; reviewed_at records structural import only, explicitly stated in
the license field. It is not a link/license verification date. Generic goals and
subtopic hints are retained as supplied; curriculum quality and resource relevance
remain limitations. Local publication is not independent pedagogical acceptance.

## Verification

On 2026-11-02 all 12 source files passed structural inspection and conversion:
six milestones and 24 topics each, valid checked identities, prerequisite
references/cycles, milestone membership and selected duplicated guide fields.
These were host-Python inspections, not a new setup dependency.

A local release-2 upgrade passed in a rolled-back transaction and produced 12
published careers and 288 published topics. Local publication followed; a digest
across every private table confirmed unchanged private state. Repeat publication
passed. Reads confirmed releases 1–3 and two published careers in each category.
A temporary conflicting topic caused publication rejection and connection rollback;
zero probe rows remained. Existing saved state was exercised, not a newly seeded
synthetic learner matrix. TypeScript results are recorded in the task handoff.
Full regression, browser matrix, live model calls and manual acceptance are deferred.

## Manual acceptance and follow-up

Scroll correction source update, 2026-11-02: at desktop widths of 64rem and
viewport heights of at least 28rem, the milestone column and topic panel have
independent overflow areas. A route-local observer measures the layout's top
offset for viewport sizing. Both regions have keyboard focus targets and names;
scroll chaining is contained. Shorter or narrower viewports retain normal page
scrolling. Selecting a different topic resets the right panel, while refreshes
with the same topic identity preserve its position. Focus return prevents page
scrolling. TypeScript passed; rendered browser acceptance remains pending.

The resource correction is implemented and locally published as release 4.

## Release 4: topic-specific resources

Owner approved the scrolling/resource correction plan on 2026-11-02. Codex selected
specific documentation, lessons, textbook sections and authorized lab references
for all 288 topics across 12 careers. The stable-slug mapping is
[topic-resources.json](../../backend/app/content/topic-resources.json); original
v4 source and the historical release 3 artifact remain intact. Each topic has
one resource; 238 distinct URLs replace the prior 15. Related topics may share
a focused lesson that supports their concept, exercise or final project. These
are supporting resources, not certification of exhaustive subtopic coverage.

The mapping records provider, selected destination, title, coverage rationale,
access conditions and inspection date. Public HTTP responses and selected HTML
anchors were checked; moved URLs and invalid anchors were corrected. Evidence is
in [destination checks](../../backend/app/content/guide-resource-destinations.json).
Free access refers to reading the linked material; account-based labs, vendor
services, software and equipment may have separate requirements. Provider usage
rights remain with the provider; no exhaustive license audit is claimed.

[The release renderer](../../backend/scripts/render_topic_resource_release.py)
updates resource records only and removes obsolete supplementary index links.
It preserves topic IDs, content, prerequisites, roadmap IDs and all private data.
The publisher retains assertions on unchanged guide content, substitutes current
resource assertions after release 4, and never restores old links on repeat runs.
The generated catalog-check artifact is rendered from release 3 with resource
assertions excluded; release 3's historical artifact is not rewritten.

On 2026-11-02: all 288 topic mappings built successfully; all 238 destinations
returned HTTP 200 with selected anchors present. Upgrade and repeat publication
passed together in a rolled-back transaction. A digest covering all private tables
and every catalog table except resources/releases remained unchanged. Actual local
publication succeeded; reads confirmed releases 1–4 and 288 published topics with
288 resource records / 238 distinct URLs. Repeat publication passed afterward.
A controlled resource conflict was rejected and rollback confirmed zero probe
rows. Initial PowerShell probe assembly altered SQL literal newlines; the final
control/probe used exact UTF-8 bytes and passed. Final frontend TypeScript passed.

Fresh-database execution was not repeated; the ordered publisher supports the
existing predecessor chain. Full regressions remain deferred. Browser navigation
reached the sign-in page, so authenticated scrolling/keyboard/zoom checks and
manual learning-state interactions remain pending. Use the manual steps above.

At http://127.0.0.1:5173/careers, filter each category, open a roadmap and inspect
text, subtopics and resource links. From Dashboard open an old current path,
resolve Learning via Done/Skip/Clear, then explicitly select a new roadmap.
Check old history remains. Report role/topic, action and unexpected result.

Project owner retains curriculum approval; independent technical review remains
with CODEOWNERS. Resource verification is waived, not passed. See
[content authoring](../content-authoring.md).
