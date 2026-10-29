import asyncio
from uuid import uuid4

from app.modules.progress import service
from app.modules.progress.schemas import ProgressSummary


def test_roadmap_summary_counts_only_the_chosen_branch(monkeypatch):
    roadmap_id, milestone_id, common, left, right, branch_left, branch_right = (
        uuid4() for _ in range(7)
    )
    content = {
        "revision": 1,
        "milestones": [{
            "id": milestone_id, "retired_at": None,
            "branch_groups": [{"branches": [{"id": branch_left}, {"id": branch_right}]}],
            "topics": [
                {"id": common, "branch_id": None, "retired_at": None, "revision": 1},
                {"id": left, "branch_id": branch_left, "retired_at": None, "revision": 1},
                {"id": right, "branch_id": branch_right, "retired_at": None, "revision": 1},
            ],
        }],
    }
    choices = []
    states = [{"topic_id": common, "status": "done"}, {"topic_id": right, "status": "done"}]

    async def get_roadmap(*args):
        return content

    async def get_progress(*args):
        return states

    async def get_branches(*args):
        return choices

    monkeypatch.setattr(service, "roadmap", get_roadmap)
    monkeypatch.setattr(service, "progress", get_progress)
    monkeypatch.setattr(service, "branches", get_branches)
    result = asyncio.run(service.summary(None, uuid4(), roadmap_id))
    assert (result["state"], result["done"], result["applicable"], result["percentage"]) == (
        "branch_required", 1, 1, None
    )
    choices.append({"branch_id": branch_left})
    result = asyncio.run(service.summary(None, uuid4(), roadmap_id))
    assert (result["state"], result["done"], result["applicable"], result["percentage"]) == (
        "in_progress", 1, 2, 50.0
    )
    states.append({"topic_id": left, "status": "skipped"})
    result = asyncio.run(service.summary(None, uuid4(), roadmap_id))
    assert result["state"] == "review_skipped"
    states[-1]["status"] = "done"
    result = asyncio.run(service.summary(None, uuid4(), roadmap_id))
    assert result["state"] == "completed"
    ProgressSummary.model_validate(result)
