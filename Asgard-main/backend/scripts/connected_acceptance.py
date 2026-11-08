"""Shared synthetic-account acceptance exercised by the opt-in local document check."""

from datetime import UTC, datetime


def exercise_removal_race(api, owner):
    import asyncio
    from concurrent.futures import ThreadPoolExecutor
    from threading import Event
    from uuid import uuid4

    from app.modules.documents import provider
    from app.modules.documents.schemas import Extraction
    from tests.test_documents import synthetic_pdf

    original = provider.extract
    started, release = Event(), Event()

    async def delayed(*args, **kwargs):
        started.set()
        await asyncio.to_thread(release.wait, 8)
        return Extraction(items=[{"kind": "skill", "text": "SQL", "page": 1, "span": "SQL"}])

    state = api.get("/api/v1/me/documents", headers=owner).json()
    uploaded = api.post(
        "/api/v1/me/documents/upload",
        headers=owner | {"Content-Type": "application/pdf"},
        params={"expected_revision": state["revision"]},
        content=synthetic_pdf("Skills\\nSQL"),
    )
    assert uploaded.status_code == 200
    saved = uploaded.json()
    document = saved["candidate"]["id"]
    provider.extract = delayed
    try:
        with ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(
                api.post,
                "/api/v1/me/documents/" + document + "/analyze",
                headers=owner,
                json={
                    "expected_revision": saved["revision"],
                    "idempotency_key": str(uuid4()),
                    "synthetic_document": True,
                },
            )
            try:
                assert started.wait(8)
                current = api.get("/api/v1/me/documents", headers=owner).json()
                removed = api.post(
                    "/api/v1/me/documents/remove",
                    headers=owner,
                    json={"expected_revision": current["revision"]},
                )
                assert removed.status_code == 200
            finally:
                release.set()
            late = future.result(timeout=15)
            assert late.status_code == 200 and late.json()["active"] is None
        assert (
            api.get("/api/v1/me/documents/" + document + "/download", headers=owner).status_code
            == 404
        )
    finally:
        provider.extract = original


def exercise(api, owner, other):
    def call(method, path, body=None, headers=owner, status=200):
        response = (
            api.request(method, "/api/v1/" + path, headers=headers, json=body)
            if body is not None
            else api.request(method, "/api/v1/" + path, headers=headers)
        )
        if response.status_code != status:
            raise RuntimeError(
                "connected_" + path.replace("/", "_") + "_" + str(response.status_code)
            )
        return response.json()

    profile = call("GET", "me/profile")["profile"]
    profile = call(
        "PATCH",
        "me/profile",
        {
            "first_name": "Synthetic",
            "surname": "Example",
            "expected_version": profile["version"] if profile else 0,
        },
    )["profile"]
    assert call("GET", "me/profile")["profile"]["first_name"] == "Synthetic"
    assert call("GET", "me/profile", headers=other)["profile"] is None
    call(
        "PATCH",
        "me/profile",
        {"first_name": "Stale", "surname": "Example", "expected_version": 0},
        status=409,
    )
    prefs = call("GET", "me/preferences")
    prefs = call(
        "PATCH",
        "me/preferences",
        {
            "expected_version": prefs["version"],
            "timezone": "Asia/Manila",
            "preferred_category_id": None,
            "dismissed_guidance": ["browse-careers"],
        },
    )
    assert call("GET", "me/preferences")["dismissed_guidance"] == ["browse-careers"]
    assert call("GET", "me/preferences", headers=other)["dismissed_guidance"] == []
    definition = call("GET", "discovery/questionnaire")
    assert call("GET", "me/discovery")["draft"] is None
    draft = call("POST", "me/discovery", {"questionnaire_id": definition["id"]})

    def save(qid, options):
        nonlocal draft
        draft = call(
            "PATCH",
            "me/discovery/" + draft["id"] + "/answers",
            {
                "expected_version": draft["revision"],
                "answers": [{"question_id": qid, "option_ids": options}],
            },
        )

    save("interests", ["tools"])
    activities = next(
        q for q in definition["questions"] if q["question_id"] == draft["next_question_id"]
    )
    first = next(o for o in activities["options"] if not o["exclusive"])["id"]
    old_route = activities["question_id"]
    save(old_route, [first])
    stale = draft["revision"]
    save("interests", ["design"])
    assert old_route not in draft["active_question_ids"]
    save("interests", ["tools"])
    assert any(
        a["question_id"] == old_route and a["option_ids"] == [first] for a in draft["answers"]
    )
    call(
        "PATCH",
        "me/discovery/" + draft["id"] + "/answers",
        {
            "expected_version": stale,
            "answers": [{"question_id": "interests", "option_ids": ["design"]}],
        },
        status=409,
    )
    resumed = call("GET", "me/discovery")["draft"]
    assert resumed["revision"] == draft["revision"]
    while draft["next_question_id"]:
        question = next(
            q for q in definition["questions"] if q["question_id"] == draft["next_question_id"]
        )
        option = next(o for o in question["options"] if o["id"] == "unsure")
        save(question["question_id"], [option["id"]])
    completed = call(
        "POST",
        "me/discovery/" + draft["id"] + "/complete",
        {"expected_revision": draft["revision"]},
    )
    call("GET", "me/discovery/" + draft["id"], headers=other, status=404)
    retake = call(
        "POST",
        "me/discovery/retake",
        {"source_session_id": completed["id"], "expected_revision": completed["revision"]},
    )
    assert retake["id"] != completed["id"] and retake["status"] == "draft"
    assert retake["answers"] == [] and retake["source_session_id"] == completed["id"]
    assert call("GET", "me/discovery")["latest_completed"]["id"] == completed["id"]
    catalog = call("GET", "careers")["items"]
    assert len(catalog) == 3
    career = next(c for c in catalog if c["title"] == "Data Analyst")
    path = call("GET", "roadmaps/" + career["roadmap_ids"][0])
    learning = call("GET", "me/learning")
    call(
        "PATCH", "me/learning", {"roadmap_id": path["id"], "expected_version": learning["version"]}
    )
    group = next(group for milestone in path["milestones"] for group in milestone["branch_groups"])
    branch = group["branches"][0]
    call(
        "PATCH",
        "me/roadmaps/" + path["id"] + "/branches/" + group["id"],
        {"branch_id": branch["id"], "expected_version": 0},
    )
    topics = [
        topic
        for milestone in path["milestones"]
        for topic in milestone["topics"]
        if topic["branch_id"] is None
    ]
    topic = topics[0]
    endpoint = "me/roadmaps/" + path["id"] + "/topics/" + topic["id"]
    saved = call("PATCH", endpoint, {"status": "learning", "expected_version": 0})
    call(
        "PATCH",
        "me/roadmaps/" + path["id"] + "/topics/" + topics[1]["id"],
        {"status": "learning", "expected_version": 0},
        status=409,
    )
    saved = call("PATCH", endpoint, {"status": "done", "expected_version": saved["version"]})
    summary = call("GET", "me/roadmaps/" + path["id"] + "/summary")
    assert summary["done"] == sum(m["done"] for m in summary["milestones"]) >= 1
    assert summary["applicable"] == sum(m["applicable"] for m in summary["milestones"])
    month = datetime.now(UTC).strftime("%Y-%m")
    call("GET", "me/activity?month=" + month)
    call("GET", "me/dashboard")
    call("PATCH", endpoint, {"status": "not_started", "expected_version": saved["version"]})
    assert call("GET", "me/roadmaps/" + path["id"] + "/progress", headers=other) == []
