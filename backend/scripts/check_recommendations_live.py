(
    "Explicitly opt-in, one-call local smoke "
    "check with a temporary synthetic "
    "account.\n\nRead the local admin Auth key "
    "from private stdin JSON; never print "
    "credentials or answers.\nUses the same "
    "confirmed-user lifecycle as "
    "tests/integration/test_local_auth.py.\n"
)

import argparse
import json
import re
import sys
from urllib.parse import urlparse
from uuid import uuid4

import httpx
from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import create_app
from app.modules.recommendations.provider import ProviderFailure


class OneGroqCall(httpx.AsyncBaseTransport):
    def __init__(self, live=True):
        self.live = live
        self.transport = (
            httpx.AsyncHTTPTransport(retries=0) if live else httpx.MockTransport(self.replay)
        )
        self.calls = 0
        self.requests = 0

    def replay(self, request):
        body = json.loads(request.content)
        payload = json.loads(body["messages"][1]["content"])
        output = {
            "items": [
                {
                    "candidate_key": payload["candidates"][0]["key"],
                    "reason": (
                        "This published path is an introductory option for exploring the stated"
                        " interests."
                    ),
                    "evidence_keys": [payload["facts"][0]["key"]],
                    "caveat": "The connection is broad because the available catalog is limited.",
                    "weak_connection": True,
                }
            ]
        }
        return httpx.Response(
            200,
            json={
                "choices": [{"finish_reason": "stop", "message": {"content": json.dumps(output)}}]
            },
        )

    async def handle_async_request(self, request):
        if request.url.host != "api.groq.com" or request.url.path != "/openai/v1/chat/completions":
            raise ProviderFailure("provider_unavailable", "unexpected_live_destination")
        if self.requests:
            raise ProviderFailure("quota_exceeded", "live_call_limit")
        self.requests += 1
        if self.live:
            self.calls += 1
        return await self.transport.handle_async_request(request)

    async def aclose(self):
        await self.transport.aclose()


def require(condition, stage):
    if not condition:
        raise RuntimeError(stage)


def main(project, live):
    settings = Settings()
    require(re.fullmatch(r"asgard-[a-z0-9-]+", project) is not None, "invalid_local_project")
    database = urlparse(
        settings.database_url.get_secret_value().replace(
            "postgresql+psycopg://", "postgresql://", 1
        )
    )
    require(
        database.hostname == "supabase_db_" + project and database.username == "asgard_app",
        "local_restricted_database_required",
    )
    require(
        httpx.URL(settings.supabase_url).host == "supabase_kong_" + project, "local_auth_required"
    )
    require(
        settings.groq_enabled and bool(settings.groq_api_key.get_secret_value()),
        "groq_configuration_required",
    )
    private = json.load(sys.stdin)
    public = settings.supabase_anon_key.get_secret_value()
    require(bool(private.get("service_key")) and bool(public), "local_auth_keys_required")
    admin = {"apikey": public, "Authorization": "Bearer " + private["service_key"]}
    uid = None
    report = {"status": "failed", "provider_calls": 0, "roadmap_destinations_checked": 0}
    transport = OneGroqCall(live=live)
    report["provider_mode"] = "live" if live else "mocked_replay"
    with httpx.Client(base_url=settings.supabase_url, timeout=10) as auth:
        try:
            email, password = (
                "asgard-groq-smoke-" + str(uuid4()) + "@example.test",
                "synthetic " + str(uuid4()),
            )
            created = auth.post(
                "/auth/v1/admin/users",
                headers=admin,
                json={"email": email, "password": password, "email_confirm": True},
            )
            require(created.is_success, "synthetic_account_create")
            uid = created.json()["id"]
            login = auth.post(
                "/auth/v1/token?grant_type=password",
                headers={"apikey": public},
                json={"email": email, "password": password},
            )
            require(login.is_success, "synthetic_login")
            headers = {"Authorization": "Bearer " + login.json()["access_token"]}
            app = create_app(settings)
            with TestClient(app) as api:
                bounded_http = httpx.AsyncClient(transport=transport)
                app.state.http = bounded_http
                try:
                    questionnaire = api.get("/api/v1/discovery/questionnaire", headers=headers)
                    require(questionnaire.status_code == 200, "questionnaire_read")
                    require(
                        questionnaire.json()["version"] == 1,
                        "v2_uses_local_rules_run_scripts_check_discovery_v2",
                    )
                    started = api.post(
                        "/api/v1/me/discovery",
                        headers=headers,
                        json={"questionnaire_id": questionnaire.json()["id"]},
                    )
                    require(started.status_code == 200, "synthetic_discovery_start")
                    draft = started.json()
                    answers = {
                        "interests": ["tools", "design"],
                        "activities_general": ["screens_interactions", "software_logic"],
                        "approach": ["try_ideas"],
                        "background": ["new"],
                        "goals": ["start"],
                    }
                    while draft["next_question_id"]:
                        qid = draft["next_question_id"]
                        checkpoint = api.patch(
                            "/api/v1/me/discovery/" + draft["id"] + "/answers",
                            headers=headers,
                            json={
                                "expected_version": draft["revision"],
                                "answers": [{"question_id": qid, "option_ids": answers[qid]}],
                            },
                        )
                        require(checkpoint.status_code == 200, "synthetic_checkpoint")
                        draft = checkpoint.json()
                    completed = api.post(
                        "/api/v1/me/discovery/" + draft["id"] + "/complete",
                        headers=headers,
                        json={"expected_revision": draft["revision"]},
                    )
                    require(completed.status_code == 200, "synthetic_completion")
                    before = api.get("/api/v1/me/learning", headers=headers).json()
                    catalog = api.get("/api/v1/careers?limit=100", headers=headers)
                    require(
                        catalog.status_code == 200 and bool(catalog.json()["items"]),
                        "published_catalog_read",
                    )
                    published = catalog.json()["items"]
                    report["published_candidates"] = len(published)
                    state = api.get("/api/v1/me/recommendations", headers=headers)
                    require(
                        state.status_code == 200 and state.json()["available"],
                        "recommendation_state",
                    )
                    body = {
                        "idempotency_key": str(uuid4()),
                        "expected_context_revision": state.json()["context_revision"],
                        "catalog_release_id": state.json()["catalog_release_id"],
                    }
                    result = api.post("/api/v1/me/recommendations", headers=headers, json=body)
                    require(result.status_code == 202, "recommendation_request")
                    run = result.json()
                    report["run_status"] = run["status"]
                    report["failure_code"] = run["failure_code"]
                    require(run["status"] == "completed", "live_generation_failed")
                    require(1 <= len(run["items"]) <= 3, "result_count")
                    for item in run["items"]:
                        career = next(
                            (entry for entry in published if entry["id"] == item["career_id"]), None
                        )
                        require(
                            career is not None and item["roadmap_id"] in career["roadmap_ids"],
                            "published_relationship",
                        )
                        roadmap = api.get("/api/v1/roadmaps/" + item["roadmap_id"], headers=headers)
                        require(
                            roadmap.status_code == 200
                            and roadmap.json()["career_id"] == item["career_id"],
                            "roadmap_destination",
                        )
                        report["roadmap_destinations_checked"] += 1
                    replay = api.post("/api/v1/me/recommendations", headers=headers, json=body)
                    require(
                        replay.status_code == 202 and replay.json()["id"] == run["id"],
                        "idempotent_replay",
                    )
                    reuse = api.post(
                        "/api/v1/me/recommendations",
                        headers=headers,
                        json=body | {"idempotency_key": str(uuid4())},
                    )
                    require(
                        reuse.status_code == 202 and reuse.json()["id"] == run["id"],
                        "same_context_reuse",
                    )
                    require(
                        api.get("/api/v1/me/learning", headers=headers).json() == before,
                        "learning_state_preserved",
                    )
                    after = api.get("/api/v1/me/discovery", headers=headers)
                    require(
                        after.status_code == 200
                        and after.json()["latest_completed"]["answers"]
                        == completed.json()["answers"],
                        "saved_answers_preserved",
                    )
                    require(
                        transport.requests == 1 and transport.calls == (1 if live else 0),
                        "single_provider_request",
                    )
                    report.update(
                        status="passed",
                        idempotency="passed",
                        saved_answers="preserved",
                        learning_state="unchanged",
                    )
                finally:
                    api.portal.call(bounded_http.aclose)
        except Exception as error:
            report["stage"] = (
                str(error) if isinstance(error, RuntimeError) else "unexpected_check_failure"
            )
        finally:
            report["provider_calls"] = transport.calls
            if uid:
                deleted = auth.delete("/auth/v1/admin/users/" + uid, headers=admin)
                report["synthetic_account_removed"] = deleted.is_success
                if not deleted.is_success:
                    report.update(
                        status="failed", stage="synthetic_cleanup", synthetic_account_id=uid
                    )
    print(json.dumps(report))
    return 0 if report["status"] == "passed" else 1


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--live", action="store_true")
    mode.add_argument("--replay", action="store_true")
    parser.add_argument("--local-project", required=True)
    args = parser.parse_args()
    raise SystemExit(main(args.local_project, args.live))
