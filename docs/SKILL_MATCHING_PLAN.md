# Skill Matching Feature Plan

**Status:** Plan only; no implementation authorized by this document.  
**Scope:** Read-only matching of a student's existing reported skills and stored document evidence against a target career's linked competencies.  
**Data boundary:** Existing `competencies`, `competency_links`, `user_competencies`, and active document evidence only. No new tables, job-posting data, numeric scores, or learning-progress mutations.

## 1. Proposed module layout

```text
backend/app/modules/skill_matching/
├── __init__.py
├── routes.py          Authenticated, read-only API endpoint
├── schemas.py         Pydantic request and response contracts
├── service.py         Loads student evidence and coordinates matching
├── sources.py         Career competency source interface and current adapter
└── matcher.py         Pure matching and classification logic
```

- `sources.py` defines a `CareerCompetencySource` protocol, for example `list_for_career(connection, career_id)`, and an initial `CompetencyLinksSource` that reads `competencies` joined to `competency_links`. The service depends on the interface, allowing a future curated requirements table adapter without rewriting matching logic.
- `service.py` loads the target career's source records, the authenticated student's reports, and that student's active document evidence, then calls the matcher.
- `matcher.py` compares canonical competency IDs to reports and canonical labels/aliases to document text. It owns no SQL or HTTP behavior.
- `routes.py` authenticates, validates the path parameter, starts the existing transaction, and delegates to the service.
- `schemas.py` defines typed, provenance-preserving request and response models.

The current source must be named in terms of **career-linked competencies**. The existing links identify learning-path coverage, not employer requirements; the future source interface makes replacement possible without reinterpreting today's data.

## 2. Proposed request and response schemas

The endpoint is a read-only lookup, so use `GET` with a UUID path parameter rather than a request body. The effective request input is `career_id: UUID`; the student identity comes only from the authenticated session.

Illustrative Pydantic models, following the existing `Contract` base and strict field conventions:

```python
class MatchedSkillEvidence(Contract):
    source: Literal["user_report", "document"]
    competency_id: UUID
    level: StrictInt | None = None
    updated_at: datetime | None = None
    document_id: UUID | None = None
    analysis_id: UUID | None = None
    document_revision: Revision | None = None
    kind: Literal["skill", "education", "experience", "project"] | None = None
    page: int | None = None
    text: str | None = None
    span: str | None = None
    matched_phrase: str | None = None

class CareerSkillMatch(Contract):
    competency_id: UUID
    label: str
    source: str
    source_version: str
    status: Literal["matched", "missing"]
    reported_level: StrictInt | None = None
    evidence: list[MatchedSkillEvidence]

class SkillMatchResult(Contract):
    career_id: UUID
    career_title: str
    items: list[CareerSkillMatch]
    coverage_limitations: list[str] = Field(default_factory=list)
```

These fields are a proposal, not an approved public contract. The `source` and `source_version` fields describe the catalog competency's provenance, not proof that an item is an employer requirement. Evidence fields retain the user report or document source needed to interpret a match.

**Classification policy must be decided before implementation.** Existing self-reports distinguish an absent record, a saved unknown level (`None`), explicit level `0` (self-reported no experience), and positive levels 1–4. Document mentions are evidence, not proof of proficiency. A possible binary policy is: matched when there is a positive report or a document mention, otherwise missing; retain null/zero report evidence and explicitly define “missing” as “no positive evidence found.” Do not silently equate these states.

## 3. Matching logic and resume matcher reuse

Refactor/share the lexical matching core of [`backend/app/modules/documents/resume_review.py`](../backend/app/modules/documents/resume_review.py), but do not reuse its `suggest()` response behavior wholesale. That function is tailored to temporary resume-review suggestions; the feature needs to compare all target career competencies against multiple existing evidence sources.

Proposed flow:

1. Load the career-linked competencies from the source adapter. Today this means joining canonical competencies to `competency_links`; those rows also associate each competency with a roadmap and topic.
2. Load the authenticated user's `user_competencies` rows, retaining competency ID, nullable level, and update time. Match reports by exact canonical `competency_id`, not by fuzzy label matching.
3. Load only the authenticated user's active document record and its existing evidence JSON. Keep document ID, analysis ID, revision, evidence kind, page, text, and source span.
4. Match competency labels and aliases against document evidence text using the shared lexical matcher. Return the original source span/page and the matched phrase. The match result must preserve provenance and must not claim verified ability.
5. Apply the agreed classification policy and return every linked competency, including those with no positive evidence. Return all evidence supporting each match, not only the first hit.
6. Keep the operation read-only: no new persistence, progress changes, or recommendation behavior changes.

The existing resume matcher lowercases labels/aliases and collapses whitespace, uses case-insensitive phrase-boundary regexes, skips ambiguous aliases, resolves overlapping hits, filters a small set of direct negation prefixes, and returns one passage per matched skill. It does not calculate a confidence score. A refactor should preserve its current behavior for its existing caller and tests.

## 4. API route and registration

- **Path:** `GET /api/v1/me/careers/{career_id}/skill-matches`
- **Authentication:** Existing `current_identity` dependency. Derive the user ID from the verified identity; never accept a user ID in the request.
- **Handler:** New route in `backend/app/modules/skill_matching/routes.py`, with the shared transaction helper and standard project error models.
- **Registration:** Import and include its router in `backend/app/main.py` under `/api/v1`, alongside the existing competencies router.
- **Response:** `SkillMatchResult`.

This keeps the cross-source matching orchestration in its own module while reusing the existing competency domain's data access where appropriate.

## 5. Existing files expected to change during implementation

| Existing file | Why |
|---|---|
| `backend/app/main.py` | Register the new router under `/api/v1`. |
| `backend/app/modules/documents/resume_review.py` | Extract or delegate lexical matching primitives while preserving current `suggest()` behavior. |
| `backend/tests/test_resume_review.py` | Protect existing resume-review behavior during the matcher refactor. |
| `backend/openapi.json` | Regenerate the committed OpenAPI contract for the new endpoint. |
| `frontend/src/api/generated/schema.d.ts` | Regenerate the TypeScript API contract from OpenAPI; no frontend UI change is implied here. |
| `docs/features/skill-matching.md` | Required feature implementation/verification guide when implementation is undertaken. |

The proposed module files are new, not existing files to edit: `__init__.py`, `routes.py`, `schemas.py`, `service.py`, `sources.py`, and `matcher.py`. No migration or changes to existing persistence schemas are planned. If the route is intentionally kept internal or the generated contract workflow differs, adjust the artifact list before implementation.

## 6. Tests to add

Add `backend/tests/test_skill_matching.py`, following the existing pytest and `TestClient`/dependency-override style, for:

- Pure matcher cases: exact ID report matches; canonical label and alias document matches; case/whitespace normalization; punctuation-heavy terms; duplicate/ambiguous aliases; overlapping phrases; multiple evidence items; no match.
- Evidence preservation: page, source span, document/analysis IDs, revision, report level and update time are returned faithfully.
- Classification policy: absent record, unknown (`None`), level `0`, positive level, document mention, and combinations. This suite depends on the policy decision above.
- Current source adapter: only competencies linked to the target career are returned; retirement/publication eligibility follows current catalog rules.
- Service isolation: only the authenticated user's reports and active document are read; no inactive/other-user evidence is included.
- Route behavior: anonymous request denied, valid request succeeds, unavailable career returns the normal not-found error, and the endpoint performs no writes or storage/provider calls.

Extend `backend/tests/test_resume_review.py` as needed to prove its output remains unchanged after sharing the lexical matcher. Run the focused new and existing matcher tests and the API/OpenAPI synchronization check when implementation is authorized.

## 7. Specification and architecture alignment

### Current competency links are not employer requirements

The competency specification says:

> “These describe learning-path coverage, not validated employer requirements.”
> — [`competency-comparison.md:31`](specs/competency-comparison.md#L31)

Therefore the current source adapter and response should call these career-linked competencies, not required skills. The planned source interface allows a future curated requirements source without changing the matcher.

### Preserve report-state distinctions; no mastery claim

The specification says:

> “An absent record is unassessed, distinct from a saved record with an unknown rating. Skill presence does not assert mastery.”
> — [`competency-comparison.md:47–49`](specs/competency-comparison.md#L47)

It defines null as unknown and zero as explicitly self-reported no experience ([`competency-comparison.md:38–45`](specs/competency-comparison.md#L38)). A binary result must not erase these distinctions or imply that “matched” means mastery. The classification definition needs owner/product agreement.

### No scores or automatic learning changes

The spec excludes:

> “numerical gap score, readiness percentage, or automatic learning updates”
> — [`competency-comparison.md:35–36`](specs/competency-comparison.md#L35)

The proposed endpoint has no numeric score and is read-only, so it stays within this boundary.

### Existing recommendation wording conflicts with current source

The spec states:

> “Skills do not affect AI recommendations in this increment.”
> — [`competency-comparison.md:52`](specs/competency-comparison.md#L52)

Current source already turns saved skills into `reported_skill` facts ([`occupational_context.py:7–31`](../backend/app/modules/recommendations/occupational_context.py#L7)) and adds them to recommendation snapshots ([`recommendations/service.py:329–335`](../backend/app/modules/recommendations/service.py#L329)). The spec wording appears scoped to the earlier manual-profile increment, but it conflicts with the present implementation if read as current behavior. This feature plan does not change recommendations; the owning spec should clarify or update that statement separately.

### Architecture

No architectural conflict is identified. The architecture requires versioned HTTP routes and Pydantic request/response models, generated TypeScript contracts, and coordinated contract updates ([`docs/architecture.md:74–80`](architecture.md#L74)). It also gives a feature-owned modular monolith layout ([`docs/architecture.md:82–86`](architecture.md#L82)). A source adapter plus a pure matcher fits those boundaries. No schema, authentication, or shared architecture change is proposed.

## 8. Open questions for the team

1. What counts as **HAS**: positive self-report, any saved report including level 0/unknown, a document mention, or a combination?
2. Should level 0 appear as missing with explicit “no experience” evidence? Should null remain missing or become a separate unknown status?
3. Should matching search only document evidence with `kind="skill"`, or also education, experience, and project evidence?
4. Is exact lexical label/alias matching sufficient, or should the first version retain the existing matcher rules? Who reviews aliases and any future semantic matching policy?
5. Should a report count as a match regardless of level, with the reported level displayed independently?
6. How should the response describe a career with no available linked competencies or limited/unpublished mapping coverage?
7. Is this a distinct feature or an extension of the existing “Review your experience” capability, with its own UX and acceptance criteria?
8. Who owns content review for a future curated requirements source? The spec currently records the content reviewer as unassigned ([`competency-comparison.md:23–27`](specs/competency-comparison.md#L23)).
