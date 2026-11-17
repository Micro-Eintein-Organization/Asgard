# Full evidence and recommendation integration: technical proposal

Documentation baseline: 2026-11-17. Current [decisions](../decisions.md#current-resolutions) supersede earlier delivery sequencing and fixed catalog counts. Profile skill editing, confirmed resume review, and career-to-career comparison are implemented; roadmap experience comparison is disabled. Occupational reference entries require authored roadmaps and reviewed publication before becoming recommendation candidates. Hosted activation and unrun quality/privacy acceptance remain separate. Dated increment details below retain their original scope.


Current local status, 2026-11-05: owner-approved concrete migration/publication is
applied for all twelve careers; startup and authenticated smoke passed with data
preserved. This supersedes the earlier activation-pending status below. Versioned
SQL is now migration authority; the plan SQL files are retained review artifacts.
See [normal activation evidence](../features/career-evidence-recommendations.md#normal-activation-completed-2026-11-05).

Current implementation status, 2026-11-04: the technically approved local-test plan
now has integrated runtime source and passing isolated acceptance. Earlier
incomplete notes below are historical. Concrete normal activation review remains
pending; independent content approval and live quality are not inferred. See
[execution evidence](../features/career-evidence-recommendations.md#integrated-local-release-acceptance-2026-11-04).

Implementation update, 2026-11-04: the authenticated evidence endpoint and generated
contracts now have source implementation, with bounded PostgreSQL record reads and
explicit unavailable/release-conflict behavior. Topic-coverage extensions and all
recommendation/privacy/UI integration remain pending. See the
[delivery evidence](../features/career-evidence-recommendations.md#paginated-evidence-api-implementation-2026-11-04).

Author: Codex. Created/updated: 2026-11-04. Status: proposed contracts; not reviewed
migrations or implemented recommendation behavior. Technical reviewer:
@YakisobaNissin. Content reviewer: unassigned. Scope is the owner's supplied plan,
not an expansion to new careers, datasets or automatic learning changes.

## Owner-selected local-test implementation boundary, 2026-11-04

Implementer: Codex. Technical reviewer: @YakisobaNissin. On 2026-11-04 the user
explicitly identified themselves as YakisobaNissin and approved this integration
plan in chat ("i approve, im yakisobanissin"). This records contract/plan review,
not review of unwritten SQL, executed checks or independent content. Independent content reviewer
remains unassigned. This bounded plan covers PM-W02/W03/W04/W07 and the existing
PM-I1 acceptance boundaries, subject to technical review before SQL/API coding.

The owner selected a usable local test release for all twelve careers rather than
an inactive-only integration. Skills-only users may receive exploration options;
interests remain unknown and experience must not establish preference. This is a
local-test exception to independent content approval, not an approved wider release.
Unknown provenance/reuse metadata remains unresolved.

The separate [local-test overlay](../../backend/app/content/occupational/v1/local-test-overlay.json)
binds its proposal to the frozen manifest, review and policy hashes. It proposes
only agent-supported core-function observations and traceable partial topic links
to those career-specific concepts. It does not change the research packet's
inference flags or activate runtime data. Excluded/disputed/context-only records,
the architect/analyst ambiguity and conflicting native levels remain withheld.

### Reviewed implementation sequence and acceptance

1. Obtain technical review of this contract, additive persistence/activation design,
   account lock order and narrowly owned erasure design before dependent coding.
2. Implement immutable reference storage and authenticated paginated career evidence
   reads. Preserve existing comparison fields; paginate occupational records
   separately. Runtime credentials read published references, never publish them.
3. Add context v2 with skill-profile version and occupational release identity;
   retain old saved-run decoding. Add validated career-specific source citations,
   regenerate OpenAPI/TypeScript together and supersede prompt/schema versions.
4. Retrieve at most six eligible snippets per career: reviewed relationships to
   reported skills first, then core references with stable identifier ordering.
   This orders evidence, not career fit. Reduce source snippets first under the
   existing token budget; never silently discard user facts. All twelve catalog
   alternatives remain eligible, with generation coverage disclosed.
5. Lock account learning state before competencies for snapshots and writes.
   Advance both versions atomically. Additions mark suggestions outdated;
   edits/removal erase input/result payloads from every run whose snapshot included
   the skill, even when uncited. Keep only permitted metadata. Reject stale provider
   completion and replay restoration; preserve document erasure protections.
6. Extend existing Profile/comparison/results components using the implemented
   design system. Keep native ratings separate from personal ratings and topic
   links free of focus/branch/progress writes. No page visit generates suggestions.
7. Verify migration preservation, repeated/conflicting publication, restricted-role
   isolation, concurrent writes, uncited-input erasure, pending/replay races,
   old-run readback and mocked invalid/cross-career references. Include skills-only,
   uncertain/conflicting interests, partial mappings and unknown versus zero.
8. After isolated checks, review concrete normal-environment SQL/publication before
   applying it. Activate all twelve together and check startup readiness. Live
   model quality, independent content approval and hosted acceptance stay separate.

Affected modules: occupational content/tools, competency and recommendation services,
SQL migrations/content publication, generated API clients, existing Profile,
comparison and suggestion components. Dependencies are the existing frozen packet,
account learning lock, provenance guards and published catalog; no new dependency,
dataset or live provider call. Owning handoff is the
[implementation guide](../features/career-evidence-recommendations.md).

## Reference release and comparisons

Add immutable reference releases, source/version records, source occupations and
native scales, career relationships, competency associations, tasks and reviewed
topic coverage. Reference SQL grants runtime reads only. Keep all existing skill
UUIDs and account ratings. Related or partial curriculum associations never copy
ratings onto broader occupational concepts. No conversion of native scales to 0–4.

Propose authenticated GET `/api/v1/careers/{career_id}/evidence` with limit/offset
pagination and optional source-role filter. Return active reference release,
source roles/levels, typed relationships, native observations, source locators,
review limitations and partial/missing topic coverage. Group levels as reference
information; do not add a target-level preference. Extend existing comparison
reads additively and paginate occupational evidence separately from legacy skills.

Validate and activate all twelve careers atomically through a new administrative
release transaction. Published identities and existing ratings are preserved.
Disputed/unsupported claims remain excluded and documented. Release readiness
requires recorded source/reuse/semantic approval; the research packet is not it.

## Recommendation context and evidence

Add a versioned context capable of self-reported skill facts, skill-profile revision
and reference release identity. Preserve decoding/readback of old saved runs.
Keep current result fields and add validated source-reference citations. Generate
OpenAPI and TypeScript together after review, never hand-maintain wire types.

Construct deterministic facts from current reports and explicitly reviewed source
relationships. Keep unknown, absence and level 0 distinct; partial relationships
are relevant experience, not equivalent assessed competence. Retrieve bounded
candidate-specific evidence within the existing token budget; disclose selection
limits rather than send full profiles or silently truncate the user's meaning.
Keep all twelve published careers eligible and use interests/goals as well as
experience. The provider selects existing alternatives and explains only supplied
facts/references. Validate citation membership and candidate relationships on return.
No numerical fit score, invented target or automatic mastery claim is introduced.

## Mutations and privacy

Acquire the existing account learning lock before the competency lock for both
generation snapshots and skill writes. Atomically advance skill/context revisions.
Addition marks prior suggestions outdated. Editing/removal suppresses every run
whose input snapshot contained the changed skill, including uncited input facts.

Extend immutable-provenance guards narrowly for owned, revision-proven erasure:
clear affected input/result payloads and retain only permitted run metadata. Do
not permit arbitrary provenance rewrites. Old or in-flight generation cannot
restore erased payloads or complete against a different context revision.
No page visit triggers generation; keep explicit Update suggestions and existing
quota, idempotency, timeout and retry behavior.

## Review/verification gates

Resolve source readiness and technical review before dependent coding/activation.
Then implement additive SQL, domain reads, context/erasure services, generated
clients and bounded extensions to the existing Profile/comparison/suggestion UI.
No global redesign or private rating-history feature.

Verify migration preservation, repeated/conflicting publication, native-scale
meaning, actual-role account/session isolation, stale/concurrent writes, pending
result erasure races, old-run compatibility, mocked supported/unsupported provider
references and a guided browser flow. Keep independent content approval and live
quality evidence distinct from technical passes. No new live calls or normal
database activation follows merely from preparing this proposal.
