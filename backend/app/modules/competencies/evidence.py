"""Read a bounded page from the active immutable occupational snapshot."""

from typing import Literal
from uuid import UUID

from app.api.contracts import Contract, Page
from app.core.errors import APIError
from app.modules.competencies.schemas import TopicLink
from app.modules.storage import one, required


class EvidenceRole(Contract):
    occupation_id: UUID
    source_id: str
    native_code: str
    title: str
    career_level: str
    locator: str
    description: str = ""
    relationship: str = "related"
    source_title: str = "Unknown source title"
    source_version: str = "Unknown version"
    source_level_verified: bool = False


class EvidenceTopic(TopicLink):
    coverage: str
    rationale: str


class EvidenceRecord(Contract):
    record_id: UUID
    record_type: Literal["expectation", "task"]
    occupation_id: UUID
    source_id: str
    label: str
    definition: str
    locator: str
    native_scale: str | None = None
    native_level: str | None = None
    observation_date: str | None = None
    suppression: str | None = None
    not_relevant: str | None = None
    decision: str
    classification: str
    rationale: str
    local_test_eligible: bool
    scale_meaning: str | None = None
    scale_locator: str | None = None
    topics: list[EvidenceTopic] = []


class CareerEvidence(Page[EvidenceRecord]):
    career_id: UUID
    release_id: UUID | None
    review_status: str
    roles: list[EvidenceRole]
    limitations: list[str]


PROFILE = """
WITH active AS (
 SELECT r.id, r.payload FROM asgard_catalog.occupational_active_release a
 JOIN asgard_catalog.occupational_releases r ON r.id=a.release_id
), profile AS (
 SELECT a.id, a.payload->'overlay' AS overlay, p.value AS body,
 a.payload->'sources' AS sources,a.payload->'scale_definitions' AS scales,
 a.payload->'scale_provenance' AS scale_provenance FROM active a,
 LATERAL jsonb_array_elements(a.payload->'profiles') p
 WHERE p.value->'career'->>'career_id'=:career
), records AS (
 SELECT r.value FROM profile p,
 LATERAL jsonb_array_elements(p.body->'records') r
 WHERE (CAST(:role AS text) IS NULL OR r.value->'native'->>'occupation_id'=:role)
)
SELECT p.id AS release_id, p.body->'source_roles' AS roles,
 p.body->'relationships' AS relationships,p.sources,p.scales,p.scale_provenance,
 p.body->'topics' AS topics,
 p.overlay->'limitations' AS limitations,
 (SELECT count(*) FROM records) AS total,
 coalesce((SELECT jsonb_agg(page.value ORDER BY page.role, page.kind, page.key)
 FROM (SELECT r.value, r.value->'native'->>'occupation_id' AS role,
 r.value->'review'->>'record_type' AS kind,
 r.value->'review'->>'record_id' AS key FROM records r
 ORDER BY role,kind,key LIMIT :limit OFFSET :offset) page), '[]'::jsonb) AS records,
 p.body->'eligible_records' AS eligible_records,
 p.body->'competencies' AS definitions
FROM profile p
"""


async def read(
    connection, career_id, limit=20, offset=0, source_role=None, expected_release_id=None
):
    required(
        await one(
            connection,
            "SELECT id FROM asgard_catalog.careers WHERE id=CAST(:career AS uuid) "
            "AND status='published'",
            {"career": str(career_id)},
        )
    )
    installed = await one(
        connection,
        "SELECT to_regclass('asgard_catalog.occupational_releases') IS NOT NULL AS ready",
    )
    result = None
    if installed["ready"]:
        result = await one(
            connection,
            PROFILE,
            {
                "career": str(career_id),
                "role": str(source_role) if source_role else None,
                "limit": limit,
                "offset": offset,
            },
        )
    current_id = result["release_id"] if result else None
    if expected_release_id is not None and str(expected_release_id) != str(current_id):
        raise APIError(
            409, "evidence_release_changed", "Career references changed. Reload this profile."
        )
    base = {
        "career_id": career_id,
        "release_id": current_id,
        "items": [],
        "roles": [],
        "total": 0,
        "limit": limit,
        "offset": offset,
        "review_status": "local test; independent content approval pending"
        if result
        else "unavailable",
        "limitations": result["limitations"]
        if result
        else ["Occupational references are not active."],
    }
    if not result:
        return base
    sources = {r["source_id"]: r for r in result.get("sources", [])}
    relationships = {r["occupation_id"]: r for r in result.get("relationships", [])}
    base["roles"] = []
    for role in result["roles"]:
        source = sources.get(role["source_id"], {})
        relation = relationships.get(role["occupation_id"], {})
        base["roles"].append(
            {
                **{key: role[key] for key in EvidenceRole.model_fields if key in role},
                "relationship": relation.get("relationship", "related"),
                "source_level_verified": relation.get("source_level_verified", False),
                "source_title": source.get("title", "Unknown source title"),
                "source_version": source.get("version", "Unknown version"),
            }
        )
    if source_role is not None and str(source_role) not in {
        str(role["occupation_id"]) for role in base["roles"]
    }:
        raise APIError(
            422, "invalid_source_role", "This source role does not belong to the career."
        )
    definitions = {r["competency_id"]: r for r in result["definitions"]}
    for row in result["records"]:
        native, review = row["native"], row["review"]
        definition = definitions.get(native.get("competency_id"), {})
        base["items"].append(
            {
                "record_id": review["record_id"],
                "record_type": review["record_type"],
                "occupation_id": native["occupation_id"],
                "source_id": native["source_id"],
                "label": definition.get("label", "Source task"),
                "definition": definition.get("definition", native.get("description", "")),
                "locator": native["locator"],
                **{
                    key: native.get(key)
                    for key in (
                        "native_scale",
                        "native_level",
                        "observation_date",
                        "suppression",
                        "not_relevant",
                    )
                },
                **{key: review[key] for key in ("decision", "classification", "rationale")},
                "local_test_eligible": review["record_id"] in result["eligible_records"],
                "scale_meaning": (result.get("scales") or {}).get(native.get("native_scale")),
                "scale_locator": (result.get("scale_provenance") or {}).get(
                    native.get("native_scale")
                ),
                "topics": [
                    {key: topic[key] for key in EvidenceTopic.model_fields}
                    for topic in result.get("topics", [])
                    if native.get("competency_id") in topic["competency_ids"]
                ],
            }
        )
    base["total"] = result["total"]
    return base
