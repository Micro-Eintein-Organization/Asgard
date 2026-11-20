import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock
from uuid import uuid4

import pytest

from app.modules.recommendations import resume_connections
from app.modules.skill_matching import interpretation, service, sources
from app.modules.skill_matching.matcher import (
    BenchmarkSkill,
    Career,
    ResumeEvidence,
    rank_careers,
)
from app.modules.skill_matching.schemas import InterpretationState
from app.modules.skill_matching.technology_evidence import technology_terms


@pytest.mark.parametrize(("label", "text", "matched"), [
    ("Pandas loading and typing", "Python, pandas, scikit-learn", True),
    ("SQL joins", "MySQL and Pandas", True),
    ("SQL filtering and sorting", "PostgreSQL", True),
    ("Python notebooks setup", "Python", True),
    ("Pandas loading and typing", "I want to learn pandas", False),
    ("SQL joins", "I have no MySQL experience", False),
    ("SQL joins", "No MySQL, SQL or PostgreSQL", False),
    ("Pandas loading and typing", "pandasql", False),
    ("PostgreSQL tables and indexes", "MySQL", False),
    ("Build REST APIs", "Python", False),
    ("SQL joins", "Excel, no MySQL experience", False),
])
def test_only_approved_positive_technology_relationships_count(label, text, matched):
    skill = BenchmarkSkill("task", label, competency_id=uuid4(),
                           supporting_technologies=technology_terms(label))
    evidence = ResumeEvidence("skill", text, 1, text)
    result = rank_careers([Career(uuid4(), "Career", (skill,))], (), [evidence])[0]
    assert result.matched_skill_count == int(matched)
    assert result.skill_matches[0].reported_level is None
    if matched:
        assert result.skill_matches[0].resume_signals[0].evidence is evidence


def test_support_counts_once_and_benchmark_objects_keep_exact_matching():
    skill_id = uuid4()
    task = BenchmarkSkill("task", "SQL joins", competency_id=skill_id,
                          supporting_technologies=technology_terms("SQL joins"))
    evidence = [ResumeEvidence("skill", "SQL joins, MySQL, SQL, PostgreSQL", 1, "Original")]
    result = rank_careers([Career(uuid4(), "Roadmap", (task, task))], (), evidence)[0]
    assert result.n_of_N == (1, 1)
    assert set(result.skill_matches[0].resume_signals[0].matched_phrases) == {
        "SQL joins", "SQL", "MySQL", "PostgreSQL",
    }
    benchmark = BenchmarkSkill("task", "SQL joins", competency_id=skill_id)
    result = rank_careers([Career(uuid4(), "Benchmark", (benchmark,))], (), [
        ResumeEvidence("skill", "MySQL", 1, "MySQL"),
    ])[0]
    assert result.n_of_N == (0, 1)


def test_roadmap_api_counts_technology_even_when_interpretation_failed(monkeypatch):
    owner, career = uuid4(), uuid4()
    labels = ("Pandas loading and typing", "SQL joins", "SQL filtering and sorting")
    skill_ids = [uuid4() for _ in labels]
    document = {"id": uuid4(), "analysis_id": uuid4(), "revision": 1,
                "evidence": [{"kind": "skill", "text": "MySQL, pandas", "page": 1,
                              "span": "Skills: MySQL, pandas"}]}

    async def source_read(_conn, sql, params=None):
        if "career_skill_postings" in sql:
            return []
        return [{"career_id": career, "career_title": "Data Analyst",
                 "competency_id": key, "label": label, "aliases": [],
                 "source": "curriculum", "source_version": "v1"}
                for key, label in zip(skill_ids, labels, strict=True)]

    async def private_read(_conn, sql, params):
        assert params == {"uid": str(owner)}
        if "FROM asgard_private.documents" in sql:
            assert "status = 'active'" in sql
            return [document]
        if "FROM asgard_private.user_competencies" in sql:
            return [{"competency_id": skill_ids[0], "level": 0, "updated_at": None,
                     "evidence_confirmed": False}]
        return []

    monkeypatch.setattr(sources, "rows", source_read)
    monkeypatch.setattr(service, "rows", private_read)
    monkeypatch.setattr(interpretation, "saved_state", AsyncMock(return_value=(
        InterpretationState(status="failed", failure_code="provider_unavailable"), [],
    )))
    response = asyncio.run(service.get_career_skill_matches(None, owner))
    result = response.items[0]
    assert result.evidence_count == 3
    assert result.matched_skill_count == 3
    assert result.skills[0].reported_level in (None, 0)
    assert next(s for s in result.skills if s.competency_id == skill_ids[0]).reported_level == 0
    assert all(not s.learning_signals for s in result.skills)
    assert all(s.resume_signals[0].span == "Skills: MySQL, pandas" for s in result.skills)
    assert not any(s.interpretation_signals for s in result.skills)
    benchmark = asyncio.run(service.get_career_skill_matches(
        None, owner, sources.SnapshotSource("reviewed", "v1"),
    ))
    assert benchmark.items[0].evidence_count == 0
    assert all(not s.resume_signals for s in benchmark.items[0].skills)


@pytest.mark.parametrize("missing_document", [False, True])
def test_discovery_connections_survive_provider_failure_but_not_removed_source(
    monkeypatch, missing_document,
):
    owner, career, skill, document_id, analysis = [uuid4() for _ in range(5)]
    text = "MySQL, pandas"
    document = {"id": document_id, "analysis_id": analysis, "revision": 2,
                "evidence": [{"kind": "skill", "text": text, "page": 1, "span": text}]}
    context = SimpleNamespace(
        document=SimpleNamespace(document_id=document_id, analysis_id=analysis, revision=2),
        facts=[SimpleNamespace(id="pdf:0", source="pdf_analysis", source_id=str(analysis),
                               source_revision=2, description="Document states: " + text)],
    )

    async def one(_conn, sql, params):
        assert params == {"uid": str(owner), "id": str(document_id),
                          "analysis": str(analysis), "revision": 2}
        assert "status='active'" in sql
        return None if missing_document else document

    relationships = AsyncMock(return_value=[{
        "career_id": career, "id": skill, "label": "Pandas loading and typing",
        "aliases": [], "learning_path": True,
    }])
    monkeypatch.setattr(resume_connections, "one", one)
    monkeypatch.setattr(resume_connections, "rows", relationships)
    monkeypatch.setattr(resume_connections, "saved_state", AsyncMock(return_value=(
        InterpretationState(status="failed", failure_code="provider_unavailable"), [],
    )))
    found = asyncio.run(resume_connections.saved_connections(None, owner, context))
    if missing_document:
        assert found == {}
        relationships.assert_not_awaited()
    else:
        link = found[str(career)][0]
        assert link["fact_id"] == "pdf:0" and link["quote"] == text
        assert link["matched_phrases"] == ["pandas"]
        assert link["technology_evidence"]


def test_interpreted_and_technology_connections_deduplicate_by_skill_and_source():
    career, skill, analysis = [uuid4() for _ in range(3)]
    context = SimpleNamespace(document=SimpleNamespace(analysis_id=analysis, revision=1), facts=[
        SimpleNamespace(id="pdf:0", source="pdf_analysis", source_id=str(analysis),
                        source_revision=1, description="pandas"),
    ])
    mapping = {"competency_id": str(skill), "evidence_index": 0, "quote": "pandas"}
    links = resume_connections.resolve_connections([
        mapping, {**mapping, "matched_phrases": ["pandas"], "technology_evidence": True},
    ], [{"career_id": career, "id": skill, "label": "Pandas loading and typing"}], context)
    assert len(links[str(career)]) == 1


def test_technology_background_is_not_promoted_to_a_performed_task(monkeypatch):
    from app.modules.discovery import experience

    career, skill = uuid4(), uuid4()
    text = "I built reports with pandas"

    async def read(_conn, sql, params=None):
        if "SELECT id,slug" in sql:
            return [{"id": career, "slug": "data-analyst"}]
        return []

    async def one(_conn, sql, params=None):
        if "competency_state" in sql:
            return {"version": 1}
        return {"id": uuid4(), "analysis_id": uuid4(), "revision": 1,
                "evidence": [{"kind": "skill", "text": text, "page": 1, "span": text}]}

    monkeypatch.setattr(experience, "rows", read)
    monkeypatch.setattr(experience, "one", one)
    monkeypatch.setattr(experience, "saved_connections", AsyncMock(return_value={
        str(career): [{"competency_id": str(skill), "label": "Pandas loading and typing",
                       "quote": text, "technology_evidence": True}],
    }))
    _, support = asyncio.run(experience.current(None, uuid4()))
    assert support["data-analyst"] == 1
    assert support["_task_roles"] == []


@pytest.mark.parametrize(("questionnaire", "old_version", "current_version"), [
    ("v3", "discovery-rules-3.1", "discovery-rules-3.2"),
    ("v4", "discovery-rules-4", "discovery-rules-4.1"),
])
def test_old_recommendation_strategy_is_stale_without_rewriting_runs(
    monkeypatch, questionnaire, old_version, current_version,
):
    from copy import deepcopy
    from datetime import UTC, datetime

    from app.modules.recommendations import service as recommendations

    session, release, owner, run_id = [uuid4() for _ in range(4)]
    questionnaire_id = (recommendations.QUESTIONNAIRE_V3_ID if questionnaire == "v3"
                        else recommendations.QUESTIONNAIRE_V4_ID)
    saved = {
        "id": run_id, "status": "completed", "context_revision": 1,
        "catalog_release_id": release, "prompt_version": old_version,
        "schema_version": "1", "model_id": None, "created_at": datetime.now(UTC),
        "finished_at": datetime.now(UTC), "failure_code": None,
        "discovery_session_id": session, "discovery_revision": 1,
        "context_snapshot": {"context": {"schema_version": "1", "facts": [],
            "discovery": {"session_id": str(session), "revision": 1,
                          "questionnaire_id": str(questionnaire_id)}}},
    }
    before = deepcopy(saved)
    monkeypatch.setattr(recommendations, "one", AsyncMock(return_value=saved))
    monkeypatch.setattr(recommendations, "rows", AsyncMock(return_value=[{
        "career_id": uuid4(), "roadmap_id": uuid4(), "reason": "Saved choice",
        "evidence_fact_ids": ["discovery:interests:data"], "uncertainty_note": None,
    }]))
    monkeypatch.setattr(recommendations, "eligible", AsyncMock(return_value=True))
    monkeypatch.setattr(recommendations.discovery, "latest_completed_identity",
                        AsyncMock(return_value={"id": session, "revision": 1}))
    old = asyncio.run(recommendations.run(None, owner, run_id, 1, release))
    assert old.outdated
    assert saved == before
    saved["prompt_version"] = current_version
    fresh = asyncio.run(recommendations.run(None, owner, run_id, 1, release))
    assert not fresh.outdated


def test_new_discovery_run_saves_resume_connections_without_ai(monkeypatch):
    import json

    from app.modules.discovery import experience
    from app.modules.recommendations import service as recommendations
    from app.modules.recommendations.schemas import (
        CompletedDiscoveryReference,
        ContextFact,
        DocumentContextReference,
        RecommendationContext,
    )

    owner, session_id, career, roadmap, skill, document_id, analysis, release, run_id = (
        uuid4() for _ in range(9)
    )
    session = SimpleNamespace(
        id=session_id, revision=1, questionnaire_id=recommendations.QUESTIONNAIRE_V4_ID,
        active_question_ids=["experience_preference", "interests", "activities_data"],
        answers=[SimpleNamespace(question_id=key, option_ids=value) for key, value in [
            ("experience_preference", ["use_experience"]),
            ("interests", ["data"]), ("activities_data", ["analyze"]),
        ]],
    )
    text = "pandas"
    context = RecommendationContext(
        context_revision=1,
        discovery=CompletedDiscoveryReference(session_id=session_id, revision=1,
            questionnaire_id=session.questionnaire_id),
        document=DocumentContextReference(
            document_id=document_id, analysis_id=analysis, revision=1,
        ),
        facts=[*recommendations.discovery_facts(session), ContextFact(
            id="pdf:0", source="pdf_analysis", source_id=str(analysis), source_revision=1,
            description="Document states (skill): pandas",
        )],
    )
    snapshot_params = {}

    async def read(_conn, sql, params=None):
        if "FROM asgard_catalog.careers c JOIN asgard_catalog.roadmaps" in sql:
            return [{"career_id": career, "slug": "data-analyst", "title": "Data Analyst",
                     "description": "Analyze data", "roadmap_id": roadmap}]
        if "SELECT t.title" in sql:
            return [{"title": "Pandas loading and typing"}]
        return []

    async def one(_conn, sql, params=None):
        if "INSERT INTO asgard_private.recommendation_runs" in sql:
            snapshot_params.update(params)
            return {"id": run_id}
        if "SELECT title, description FROM asgard_catalog.roadmaps" in sql:
            return {"title": "Analyst roadmap", "description": "Start with data"}
        if "SELECT title,skills" in sql:
            return {"title": "Data Analyst", "skills": ["Pandas loading and typing"]}
        return None

    monkeypatch.setattr(recommendations, "rows", read)
    monkeypatch.setattr(recommendations, "one", one)
    monkeypatch.setattr(experience, "rows", read)
    monkeypatch.setattr(recommendations.discovery, "session", AsyncMock(return_value=session))
    monkeypatch.setattr(recommendations, "snapshot", AsyncMock(return_value={
        "context": context.model_dump(mode="json"),
    }))
    monkeypatch.setattr(experience, "current", AsyncMock(return_value=("token", {
        "data-analyst": 1,
    })))
    monkeypatch.setattr(resume_connections, "one", AsyncMock(return_value={
        "id": document_id, "analysis_id": analysis, "revision": 1,
        "evidence": [{"kind": "skill", "text": text, "span": text, "page": 1}],
    }))
    monkeypatch.setattr(resume_connections, "rows", AsyncMock(return_value=[{
        "career_id": career, "id": skill, "label": "Pandas loading and typing",
        "aliases": [], "learning_path": True,
    }]))
    monkeypatch.setattr(resume_connections, "saved_state", AsyncMock(return_value=(
        InterpretationState(status="failed", failure_code="provider_unavailable"), [],
    )))
    monkeypatch.setattr(recommendations, "run", AsyncMock(return_value="saved"))
    conn = SimpleNamespace(execute=AsyncMock())
    result = asyncio.run(recommendations.request_rules(conn, owner,
        SimpleNamespace(idempotency_key=uuid4()), {"context_revision": 1}, release,
        {"id": session_id, "revision": 1, "questionnaire_id": session.questionnaire_id}))
    assert result == "saved"
    saved = json.loads(snapshot_params["snapshot"])["context"]
    connections = saved["explanations"][str(career)]["experience_connections"]
    assert len(connections) == 1
    assert "pandas" in connections[0] and "does not establish task completion" in connections[0]
    writes = [call.args[1] for call in conn.execute.await_args_list]
    item = next(params for params in writes if params.get("career") == str(career))
    assert "pdf:0" in item["facts"]
    assert snapshot_params["strategy"] == "discovery-rules-4.1"
