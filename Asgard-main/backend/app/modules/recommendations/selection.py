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


class SelectionOutput(Contract):
    items: Annotated[list[SelectionItem], Field(min_length=1, max_length=3)]

    @model_validator(mode="after")
    def distinct_candidates(self):
        if len({item.candidate_key for item in self.items}) != len(self.items):
            raise ValueError("duplicate_candidate")
        return self


class SelectionFailure(ValueError):
    """Only the fixed stage identifier is safe to log."""


def provider_payload(content):
    candidates, candidate_map = [], {}
    for career in content["catalog"]:
        paths = {path["id"]: path for path in career.get("roadmaps", [])}
        for roadmap_id in career["roadmap_ids"]:
            key = "c" + str(len(candidates) + 1)
            candidate_map[key] = {"career_id": career["career_id"], "roadmap_id": roadmap_id}
            path = paths.get(roadmap_id, {})
            candidates.append(
                {
                    "key": key,
                    **{
                        field: career[field]
                        for field in ("title", "description", "skills", "category", "relevance")
                    },
                    "roadmap_title": path.get("title", career["title"]),
                    "roadmap_description": path.get("description", career["description"]),
                }
            )
    fact_map, facts = {}, []
    for fact in content["context"]["facts"]:
        key = "f" + str(len(facts) + 1)
        fact_map[key] = fact["id"]
        facts.append({"key": key, "source": fact["source"], "description": fact["description"]})
    return {"candidates": candidates, "facts": facts}, candidate_map, fact_map


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
                **target,
                reason=item.reason,
                evidence_fact_ids=[facts[key] for key in item.evidence_keys],
                uncertainty_note=caveat,
                starting_topic_id=None,
            )
        )
    return UntrustedRecommendationOutput(items=items)
