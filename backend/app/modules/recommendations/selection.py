"""Private model output uses request-scoped keys; database identities stay server-owned."""

from typing import Annotated

from pydantic import Field, model_validator

from app.api.contracts import Contract, Identifier
from app.modules.recommendations.schemas import (
    UntrustedRecommendationItem,
    UntrustedRecommendationOutput,
)


class SelectionItem(Contract):
    candidate_key: Identifier
    reason: Annotated[str, Field(min_length=1, max_length=500)]
    evidence_keys: Annotated[list[Identifier], Field(min_length=1, max_length=12)]
    caveat: Annotated[str, Field(min_length=1, max_length=300)]
    weak_connection: bool
    source_reference_keys: Annotated[list[Identifier], Field(max_length=6)] = Field(
        default_factory=list
    )


class SelectionOutput(Contract):
    items: Annotated[list[SelectionItem], Field(min_length=1, max_length=3)]

    @model_validator(mode="after")
    def distinct_candidates(self):
        if len({item.candidate_key for item in self.items}) != len(self.items):
            raise ValueError("duplicate_candidate")
        return self


class SelectionFailure(ValueError):
    """Only the fixed stage identifier is safe to log."""


def provider_payload(content, *, compact=False):
    reference_map, references = {}, []
    for ref in content["context"].get("source_references", []):
        key = "r" + str(len(references) + 1)
        reference_map[key] = ref
        references.append(
            {
                "key": key,
                **{k: ref[k][:240] for k in ("label", "definition", "relationship", "limitation")},
                "source_role_title": ref.get("source_role_title", "Unknown role"),
                "career_relationship": ref.get("career_relationship", "unassessed"),
                **(
                    {"evidence_type": ref["evidence_type"],
                     "source_relationship": ref["source_relationship"]}
                    if ref.get("evidence_type") == "esco_occupation_skill" else {}
                ),
            }
        )
    candidates, candidate_map = [], {}
    for career in content["catalog"]:
        paths = {path["id"]: path for path in career.get("roadmaps", [])}
        for roadmap_id in career["roadmap_ids"]:
            key = "c" + str(len(candidates) + 1)
            candidate_map[key] = {"career_id": career["career_id"], "roadmap_id": roadmap_id}
            matching = {
                k: r["id"]
                for k, r in reference_map.items()
                if r["career_id"] == career["career_id"]
            }
            if matching:
                candidate_map[key]["_reference_map"] = matching
            path = paths.get(roadmap_id, {})
            candidates.append(
                {
                    "key": key,
                    **{
                        field: career[field]
                        for field in ("title", "description", "skills", "category", "relevance")
                    },
                    "roadmap_title": path.get("title", career["title"]),
                    "roadmap_description": (path.get("description") or "")[:220],
                }
            )
            candidates[-1]["description"] = career["description"][:280]
            candidates[-1]["skills"] = career["skills"][:8]
            if compact:
                candidate = candidates[-1]
                candidate["description"] = career["description"][:170]
                candidate["skills"] = career["skills"][:4]
                candidate.pop("roadmap_description")
                relevance = career["relevance"]
                candidate["relevance"] = {
                    field: [value[:100] for value in relevance[field][:2] if isinstance(value, str)]
                    for field in ("activities", "boundaries")
                    if isinstance(relevance.get(field), list)
                }
            if "source_references" in content["context"]:
                candidates[-1]["source_reference_keys"] = list(matching)
    fact_map, facts = {}, []
    for fact in content["context"]["facts"]:
        key = "f" + str(len(facts) + 1)
        fact_map[key] = fact["id"]
        facts.append({"key": key, "source": fact["source"], "description": fact["description"]})
    payload = {"candidates": candidates, "facts": facts}
    if "source_references" in content["context"]:
        payload["references"] = references
    return payload, candidate_map, fact_map


def resolve_selection(output, candidates, facts):
    items, seen_careers = [], set()
    for item in output.items:
        if item.candidate_key not in candidates:
            raise SelectionFailure("unknown_candidate")
        if not set(item.evidence_keys) <= facts.keys():
            raise SelectionFailure("unknown_evidence")
        if len(set(item.evidence_keys)) != len(item.evidence_keys):
            raise SelectionFailure("duplicate_evidence")
        target = candidates[item.candidate_key]
        source_map = target.get("_reference_map", {})
        if (
            len(set(item.source_reference_keys)) != len(item.source_reference_keys)
            or not set(item.source_reference_keys) <= source_map.keys()
            or (source_map and not item.source_reference_keys)
        ):
            raise SelectionFailure("invalid_source_citation")
        if target["career_id"] in seen_careers:
            raise SelectionFailure("duplicate_career")
        seen_careers.add(target["career_id"])
        caveat = (
            "This is a loosely related exploration option from the current catalog. "
            if item.weak_connection
            else "Suggestions are limited to the current published catalog. "
        ) + item.caveat
        items.append(
            UntrustedRecommendationItem(
                **{k: v for k, v in target.items() if k != "_reference_map"},
                reason=item.reason,
                evidence_fact_ids=[facts[key] for key in item.evidence_keys],
                uncertainty_note=caveat,
                starting_topic_id=None,
                source_reference_ids=[source_map[k] for k in item.source_reference_keys],
            )
        )
    return UntrustedRecommendationOutput(items=items)
