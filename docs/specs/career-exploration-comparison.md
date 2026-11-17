# Career exploration, comparison and saved alternatives

Documentation baseline: 2026-11-17. Current [decisions](../decisions.md#current-resolutions) supersede earlier delivery sequencing and fixed catalog counts. Profile skill editing, confirmed resume review, and career-to-career comparison are implemented; roadmap experience comparison is disabled. Occupational reference entries require authored roadmaps and reviewed publication before becoming recommendation candidates. Hosted activation and unrun quality/privacy acceptance remain separate. Dated increment details below retain their original scope.


## Beginner exploration update, 2026-11-05

The owner selected career choice first across all twelve careers. Use concrete work, outputs, checks and one beginner activity per career, with optional task-based experience questions on the existing 120 skills. The typed local content package is implemented without database or recommendation changes. [Implementation and focused evidence](../features/career-comparison-and-shortlist.md#beginner-exploration-2026-11-05). Independent comprehension/content review remains pending; PDF, hosting and additional account controls remain deferred.

Author: Codex. Created/updated: 2026-11-05. Status: owner-selected implementation scope; technical reviewer @YakisobaNissin. Independent technical review is pending.

Authority: the owner's “Make career exploration understandable and add career comparison” implementation request. This extends PM-F06 / W06 and the [existing experience specification](competency-comparison.md) within the [architecture](../architecture.md). Generated OpenAPI remains wire authority.

## Acceptance

- CEJ-01: Optional career-first experience review supports add, edit and removal through existing versioned skill endpoints. Absent, unknown and explicit zero remain distinct. Personal ratings never become occupational targets.
- CEJ-02: Profile manages reports grouped by actual career identity, with a learning-path filter. Existing skill UUIDs, saved ratings and learning state are preserved.
- CEJ-03: Suggestions expose a direct Explore career action. Historical explanations use saved typed evidence. Full native source records move to a secondary Sources and limitations page.
- CEJ-04: Compare exactly two published careers. The catalog heading is the single Compare careers entry. Two dropdowns on the comparison page hold draft choices. A valid URL restores the submitted pair after refresh. The comparison screen prioritizes concise career differences; shared practice and detailed evidence support remain secondary. Matched sections reflow into paired vertical cards on small screens.
- CEJ-05: Private shortlist notes are at most 500 characters and secondary to comparison. Saving/removal does not change focus, recommendation context or learning progress. Removal deletes the note without changing the comparison pair. Unavailable entries retain their title/note for explanation and removal.
- CEJ-06: Reads and writes reuse authenticated restricted-role transactions. Shortlist-wide optimistic versions and a consistent account advisory lock prevent stale writes or mixed-version list reads. Ownership RLS protects both tables. Comparisons identify account, catalog and occupational versions.

## Contract and persistence

`GET /me/career-shortlist`, `PATCH /me/career-shortlist/{career_id}` with expected version/note, `POST /me/career-shortlist/{career_id}/remove`, and `GET /me/career-comparison?left=…&right=…` are under `/api/v1`. Missing/duplicate/unavailable comparison selections fail with recoverable errors. Shortlist reads return `available:false` before its additive migration; comparison/experience remain usable.

Only shortlist state and owner-owned entries are new persistence. No trigger changes learning state or recommendation context. Notes are not included in recommendation snapshots. Existing skill mutation and payload erasure remain the owning privacy operation. Comparison reads lock existing learning state before competency state without creating learning records. Occupational identity uses the established active-release shared lock.

Saving an unpublished career fails; removing a retained entry remains possible. Skill search and saved-report reads add typed career context from published mappings; label text is not used to infer identity. Related learning never transfers proficiency.

## Boundaries and verification

No new AI generation behavior, datasets, dependencies, fit scores, inferred preferences/targets, PDF work, hosting or extra account controls. Normal migration application requires concrete review. Verification is intentionally limited to types/contracts, scoped lint, focused shortlist persistence/isolation/stale-write checks and a short guided journey. Existing skill-erasure/session evidence is reused where unchanged; broad regression and model-quality evaluation remain deferred.

Implementation/evidence: [feature guide](../features/career-comparison-and-shortlist.md).
