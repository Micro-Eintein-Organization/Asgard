from contextlib import asynccontextmanager
from types import SimpleNamespace
from uuid import UUID

from fastapi.testclient import TestClient
from test_documents import synthetic_pdf

from app.core.errors import APIError
from app.core.security import current_identity
from app.main import create_app
from app.modules.documents import routes
from app.modules.documents.resume_review import suggest

CAREER = UUID(int=10)
SKILLS = [
    {"id": UUID(int=1), "label": "C++", "aliases": ["Shared"]},
    {"id": UUID(int=2), "label": "SQL", "aliases": ["Shared"]},
]


def test_matches_are_unique_verbatim_and_ordered():
    assert suggest(["PostgreSQL Shared", "Used c++ and SQL", "C++ again"], SKILLS) == [
        {"skill_id": UUID(int=1), "label": "C++", "page": 2, "passage": "Used c++ and SQL"},
        {"skill_id": UUID(int=2), "label": "SQL", "page": 2, "passage": "Used c++ and SQL"},
    ]


def test_matches_distinguish_punctuation_and_skip_direct_negation():
    skills = SKILLS + [
        {"id": UUID(int=index), "label": label, "aliases": []}
        for index, label in enumerate(("C", "C#", "AWS"), 3)
    ]
    pages = [
        "Used C#. No experience with SQL. Never used C++. Not familiar with AWS.",
        "No experience with AWS, but used SQL. Later built a tool in C++.",
    ]
    assert [(item["label"], item["page"]) for item in suggest(pages, skills)] == [
        ("C#", 1), ("SQL", 2), ("C++", 2),
    ]
    assert [item["label"] for item in suggest(["Used C."], skills)] == ["C"]


def test_resume_endpoint(monkeypatch):
    app = create_app()
    app.state.settings = SimpleNamespace(resume_skill_review_enabled=False)
    identity = object()
    signed_in = False
    reads = []

    def auth():
        if not signed_in:
            raise APIError(401, "unauthorized", "Sign in.")
        return identity

    @asynccontextmanager
    async def transaction(request, owner):
        assert owner is identity
        yield object()

    async def rows(connection, statement, params):
        assert statement.startswith("SELECT") and "career.status='published'" in statement
        reads.append(params["career_id"])
        return SKILLS if params["career_id"] == CAREER else []

    async def forbidden(*args, **kwargs):
        raise AssertionError("Resume review called document storage or the provider")

    app.dependency_overrides[current_identity] = auth
    monkeypatch.setattr(routes, "transaction", transaction)
    monkeypatch.setattr(routes, "rows", rows)
    monkeypatch.setattr(routes.service, "object_request", forbidden)
    monkeypatch.setattr(routes.provider, "extract", forbidden)
    client = TestClient(app)
    url = "/api/v1/me/documents/resume-skill-review"

    def post(pdf, career=CAREER):
        return client.post(
            url, params={"career_id": str(career)}, content=pdf,
            headers={"content-type": "application/pdf"},
        )

    assert post(synthetic_pdf()).status_code == 401
    signed_in = True
    assert post(synthetic_pdf()).status_code == 503
    app.state.settings.resume_skill_review_enabled = True
    assert post(synthetic_pdf(), UUID(int=11)).status_code == 404
    assert post(b"x" * 10_000_001).status_code == 413
    assert post(synthetic_pdf("")).status_code == 422
    assert post(synthetic_pdf("Other work")).json() == {"suggestions": []}
    response = post(synthetic_pdf("Used c++ and SQL"))
    assert response.status_code == 200
    assert response.headers["cache-control"] == "no-store"
    assert [item["passage"] for item in response.json()["suggestions"]] == ["Used c++ and SQL"] * 2
    assert len(reads) == 5
