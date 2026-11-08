"""Versioned curriculum explanations; no account or recommendation writes."""

import hashlib
import json
import logging
from functools import lru_cache
from pathlib import Path
from uuid import UUID

from pydantic import Field

from app.api.contracts import Contract

ROOT = Path(__file__).resolve().parents[2] / "content"


class Activity(Contract):
    action: str
    result: str


class LearningGroup(Contract):
    title: str
    explanation: str
    topic_id: UUID
    roadmap_id: UUID
    topic_title: str


class Starter(Contract):
    title: str
    instructions: str
    expected_result: str
    topic_id: UUID
    roadmap_id: UUID


class SkillExplanation(Contract):
    question: str
    example: str
    why_it_matters: str
    group: str


class Exploration(Contract):
    version: str
    purpose: str
    activities: list[Activity] = Field(min_length=3, max_length=3)
    work_on: str
    produce: str
    check: str
    learning_groups: list[LearningGroup] = Field(min_length=3, max_length=4)
    starter: Starter
    source_scope: str
    limitation: str


def load_profiles(filename, expected_count, *, occupational_review=False):
    try:
        profiles = json.loads(
            (ROOT / "career-exploration/v1" / filename).read_text(encoding="utf-8")
        )
        assert len(profiles) == expected_count and len({p["career_id"] for p in profiles}) == expected_count
        assert sum(len(p["skills"]) for p in profiles) == expected_count * 10
        assert len({s["id"] for p in profiles for s in p["skills"]}) == expected_count * 10
        if occupational_review:
            review_digest = hashlib.sha256(
                (ROOT / "occupational/v1/agent-review.json").read_bytes()
            ).hexdigest()
        for profile in profiles:
            if occupational_review:
                assert review_digest == profile["occupational_review_sha256"]
            assert (
                hashlib.sha256(
                    (ROOT / "guide_v4" / profile["source_file"]).read_bytes()
                ).hexdigest()
                == profile["source_sha256"]
            )
            Exploration.model_validate({k: profile[k] for k in Exploration.model_fields})
            for skill in profile["skills"]:
                assert skill["career_id"] == profile["career_id"]
                SkillExplanation.model_validate(
                    {k: skill[k] for k in SkillExplanation.model_fields}
                )
        return profiles
    except (OSError, ValueError, KeyError, TypeError, AssertionError):
        logging.getLogger(__name__).warning(
            "Learner explanations unavailable; curriculum reads remain enabled"
        )
        return []


@lru_cache(maxsize=1)
def package():
    return load_profiles("profiles.json", 12, occupational_review=True) + load_profiles(
        "expansion-profiles.json", 11
    )


def career_explanation(cid):
    return next(
        (
            {k: p[k] for k in Exploration.model_fields}
            for p in package()
            if p["career_id"] == str(cid)
        ),
        None,
    )


def skill_explanation(sid):
    return next(
        (
            {k: s[k] for k in SkillExplanation.model_fields}
            for p in package()
            for s in p["skills"]
            if s["id"] == str(sid)
        ),
        None,
    )
