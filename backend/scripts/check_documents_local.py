"""Explicit synthetic local acceptance. Private admin key enters through stdin only."""

import argparse
import json
import logging
import sys
from uuid import uuid4

import httpx
from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import create_app
from scripts.connected_acceptance import exercise, exercise_removal_race
from tests.test_documents import synthetic_pdf


class BoundedProvider(httpx.AsyncBaseTransport):
    def __init__(self, live):
        self.live = live
        self.calls = 0
        self.network = httpx.AsyncHTTPTransport(retries=0)

    async def handle_async_request(self, request):
        if request.url.host != "api.groq.com":
            return await self.network.handle_async_request(request)
        self.calls += 1
        if self.calls > 2:
            raise RuntimeError("provider_call_bound")
        if self.live:
            return await self.network.handle_async_request(request)
        body = json.loads(request.content)
        if body["response_format"]["json_schema"]["name"] == "document_evidence_v1":
            value = {"items": [{"kind": "skill", "text": "SQL", "page": 1, "span": "SQL"}]}
        else:
            context = json.loads(body["messages"][1]["content"])
            fact = next(
                fact for fact in context["facts"] if "Document states" in fact["description"]
            )
            value = {
                "items": [
                    {
                        "candidate_key": context["candidates"][0]["key"],
                        "reason": (
                            "This introductory published path offers an option to explore the "
                            "supplied background."
                        ),
                        "evidence_keys": [fact["key"]],
                        "caveat": (
                            "A document statement does not establish proficiency. The catalog is "
                            "limited."
                        ),
                        "weak_connection": True,
                    }
                ]
            }
        return httpx.Response(
            200,
            json={
                "choices": [{"finish_reason": "stop", "message": {"content": json.dumps(value)}}]
            },
        )

    async def aclose(self):
        await self.network.aclose()


def require(value, label):
    if not value:
        raise RuntimeError(label)


def main(live):
    logging.getLogger("asgard.request").setLevel(logging.WARNING)
    private = json.load(sys.stdin)
    original = Settings()
    require(
        "supabase_db_asgard-foundation" in original.database_url.get_secret_value(),
        "local_stack_required",
    )
    require(
        httpx.URL(original.supabase_url).host == "supabase_kong_asgard-foundation",
        "local_auth_required",
    )
    settings = original.model_copy(
        update={
            "documents_enabled": True,
            "documents_processing_enabled": True,
            "storage_service_key": private["service_key"],
            "documents_real_data_approved": False,
            "groq_enabled": True,
        }
    )
    # model_copy does not coerce SecretStr.
    from pydantic import SecretStr

    settings.storage_service_key = SecretStr(private["service_key"])
    if not live:
        settings.groq_api_key = SecretStr("synthetic-not-a-provider-key")
    app = create_app(settings)
    bounded = BoundedProvider(live)
    users = []
    tokens = []
    public = original.supabase_anon_key.get_secret_value()
    report = {"mode": "live" if live else "mocked", "status": "failed"}
    with httpx.Client(base_url=settings.supabase_url, timeout=15) as auth:
        admin = {"apikey": public, "Authorization": "Bearer " + private["service_key"]}
        try:
            for _ in range(2):
                email = "asgard-doc-" + str(uuid4()) + "@example.test"
                password = "synthetic " + str(uuid4())
                created = auth.post(
                    "/auth/v1/admin/users",
                    headers=admin,
                    json={"email": email, "password": password, "email_confirm": True},
                )
                require(created.is_success, "create_synthetic_account")
                users.append(created.json()["id"])
                login = auth.post(
                    "/auth/v1/token?grant_type=password",
                    headers={"apikey": public},
                    json={"email": email, "password": password},
                )
                require(login.is_success, "login")
                tokens.append({"Authorization": "Bearer " + login.json()["access_token"]})
            with TestClient(app) as api:
                provider_http = httpx.AsyncClient(transport=bounded)
                app.state.http = provider_http
                try:
                    owner, other = tokens
                    exercise(api, owner, other)

                    def state():
                        response = api.get("/api/v1/me/documents", headers=owner)
                        require(response.status_code == 200, "read_document_state")
                        return response.json()

                    before = api.get("/api/v1/me/learning", headers=owner).json()
                    current = state()
                    response = api.post(
                        "/api/v1/me/documents/upload",
                        params={"expected_revision": current["revision"]},
                        headers=owner | {"Content-Type": "application/pdf"},
                        content=synthetic_pdf("Skills\\nSQL"),
                    )
                    require(response.status_code == 200, "upload_document")
                    current = response.json()
                    doc = current["candidate"]["id"]
                    require(
                        api.get(
                            "/api/v1/me/documents/" + doc + "/download", headers=other
                        ).status_code
                        == 404,
                        "cross_account_download_denied",
                    )
                    require(
                        api.post(
                            "/api/v1/me/documents/remove",
                            headers=owner,
                            json={"expected_revision": 1},
                        ).status_code
                        == 409,
                        "stale_revision_denied",
                    )
                    key = str(uuid4())
                    body = {
                        "expected_revision": current["revision"],
                        "idempotency_key": key,
                        "synthetic_document": True,
                    }
                    analyzed = api.post(
                        "/api/v1/me/documents/" + doc + "/analyze", headers=owner, json=body
                    )
                    require(analyzed.status_code == 200, "analysis_response")
                    current = analyzed.json()
                    report["analysis_failure"] = (
                        current.get("latest_failure", {}).get("failure_code")
                        if current.get("latest_failure")
                        else None
                    )
                    require(current["active"] is not None, "validated_analysis_applied")
                    require(
                        api.post(
                            "/api/v1/me/documents/" + doc + "/analyze", headers=owner, json=body
                        ).status_code
                        == 200,
                        "duplicate_analysis_reused",
                    )
                    context = api.get("/api/v1/me/recommendations", headers=owner).json()
                    run = api.post(
                        "/api/v1/me/recommendations",
                        headers=owner,
                        json={
                            "expected_context_revision": context["context_revision"],
                            "catalog_release_id": context["catalog_release_id"],
                            "idempotency_key": str(uuid4()),
                        },
                    )
                    require(run.status_code == 202, "recommendation_response")
                    require(run.json()["status"] == "completed", "document_recommendation_saved")
                    require(
                        any(f["source"] == "pdf_analysis" for f in run.json()["evidence"]),
                        "document_provenance",
                    )
                    item = run.json()["items"][0]
                    require(
                        api.get("/api/v1/roadmaps/" + item["roadmap_id"], headers=owner).status_code
                        == 200,
                        "published_destination",
                    )
                    require(
                        api.get("/api/v1/me/learning", headers=owner).json()["current_roadmap_id"]
                        == before["current_roadmap_id"],
                        "focus_preserved",
                    )
                    removed = api.post(
                        "/api/v1/me/documents/remove",
                        headers=owner,
                        json={"expected_revision": current["revision"]},
                    )
                    require(
                        removed.status_code == 200 and removed.json()["active"] is None,
                        "remove_context",
                    )
                    require(
                        api.get(
                            "/api/v1/me/documents/" + doc + "/download", headers=owner
                        ).status_code
                        == 404,
                        "removed_download_blocked",
                    )
                    latest = api.get("/api/v1/me/recommendations", headers=owner)
                    require(latest.status_code == 200, "read_removed_recommendations")
                    require(
                        not latest.json().get("previous_eligible_success"),
                        "removed_fallback_suppressed",
                    )
                    require(not latest.json()["current"]["items"], "removed_payload_suppressed")
                    require(removed.json()["cleanup_pending"] == 0, "original_purged")
                    if not live:
                        exercise_removal_race(api, other)
                    report["status"] = "passed"
                finally:
                    # Attempt owner cleanup even if an assertion fails.
                    for token in tokens:
                        current = api.get("/api/v1/me/documents", headers=token)
                        if current.status_code == 200:
                            api.post(
                                "/api/v1/me/documents/remove",
                                headers=token,
                                json={"expected_revision": current.json()["revision"]},
                            )
                    api.portal.call(provider_http.aclose)
        finally:
            report["provider_requests"] = bounded.calls
            report["synthetic_accounts_removed"] = all(
                auth.delete("/auth/v1/admin/users/" + uid, headers=admin).is_success
                for uid in users
            )
            print(json.dumps(report))


if __name__ == "__main__":
    args = argparse.ArgumentParser()
    args.add_argument("--live", action="store_true")
    parsed = args.parse_args()
    main(parsed.live)
