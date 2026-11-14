import asyncio
from copy import deepcopy

import pytest

from app.core.errors import APIError
from app.modules.roadmaps import service


@pytest.mark.parametrize("topic_count", [0, 100])
def test_milestones_batch_children_without_changing_shape(monkeypatch, topic_count):
    statements = []
    topics = [
        {"id": f"t{i}", "milestone_id": "m1", "roadmap_id": "r1",
         "position": i, "retired_at": None}
        for i in range(topic_count)
    ]
    data = [
        [{"id": "m1", "roadmap_id": "r1", "retired_at": None},
         {"id": "m2", "roadmap_id": "r1", "retired_at": "retired"}],
        [{"id": "g1", "milestone_id": "m1", "title": "Tool",
          "explanation": "Choose", "position": 1}],
        [{"id": "b1", "group_id": "g1", "title": "First", "position": 1}],
        topics,
        [{"topic_id": "t1", "prerequisite_id": "t0"}] if topic_count else [],
        [{"topic_id": "t1", "id": "resource", "title": "Read", "position": 1}]
        if topic_count else [],
    ]

    async def one(*_args):
        return {"id": "r1"}

    async def rows(_connection, statement, parameters):
        assert parameters == {"id": "r1"}
        assert "CAST(:id AS" in statement
        statements.append(statement)
        return deepcopy(data[len(statements) - 1])

    monkeypatch.setattr(service, "one", one)
    monkeypatch.setattr(service, "rows", rows)
    result = asyncio.run(service.milestones(None, "r1"))
    assert len(statements) == 6
    assert len(result[0]["topics"]) == topic_count
    assert result[1] == {
        "id": "m2", "retired_at": "retired", "branch_groups": [], "topics": [],
    }
    assert result[0]["branch_groups"] == [{
        "id": "g1", "title": "Tool", "explanation": "Choose", "position": 1,
        "branches": [{"id": "b1", "title": "First", "position": 1}],
    }]
    if topic_count:
        assert result[0]["topics"][0]["resources"] == []
        assert result[0]["topics"][1]["prerequisite_ids"] == ["t0"]
        assert result[0]["topics"][1]["resources"] == [{
            "id": "resource", "title": "Read", "position": 1,
        }]


def test_missing_roadmap_still_returns_not_found(monkeypatch):
    async def one(*_args):
        return None

    monkeypatch.setattr(service, "one", one)
    with pytest.raises(APIError):
        asyncio.run(service.milestones(None, "missing"))
