"""Opt-in, isolated local-stack tests. Never run against the normal developer database."""

import os
import re
import time
from uuid import uuid4

import httpx
import psycopg
import pytest
from psycopg.conninfo import conninfo_to_dict

pytestmark = pytest.mark.skipif(
    os.getenv("ASGARD_RUN_LOCAL_AUTH_TESTS") != "1",
    reason="Requires separate approval and a migrated, isolated local Auth test stack.",
)


class PrivateFixture(tuple):
    def __repr__(self):
        return "<isolated local Auth fixture>"


class PrivateAccount(dict):
    def __repr__(self):
        return "<synthetic account credentials>"


@pytest.fixture(scope="module")
def stack():
    project = os.environ["ASGARD_TEST_PROJECT_ID"]
    isolated_project = (
        project.startswith("asgard-stage3-test") and project.replace("-", "").isalnum()
    )
    approved_foundation = (
        project == "asgard-foundation" and os.getenv("ASGARD_ALLOW_FOUNDATION_AUTH_TESTS") == "1"
    )
    if not (isolated_project or approved_foundation):
        pytest.fail(
            "Use an isolated asgard-stage3-test project, or explicitly approve "
            "the local asgard-foundation project."
        )
    url = os.environ["ASGARD_TEST_AUTH_URL"]
    if httpx.URL(url).host != f"supabase_kong_{project}":
        pytest.fail("Auth tests require the isolated project's local Docker address.")
    dsn = os.environ["ASGARD_TEST_DATABASE_URL"]
    if dsn.startswith("postgresql+psycopg://"):
        dsn = dsn.replace("postgresql+psycopg://", "postgresql://", 1)
    connection = conninfo_to_dict(dsn)
    if connection.get("host") != f"supabase_db_{project}" or connection.get("user") != "asgard_app":
        pytest.fail("RLS tests require the isolated database and actual asgard_app credentials.")
    public_key = os.environ["ASGARD_TEST_PUBLIC_KEY"]
    service_key = os.environ["ASGARD_TEST_SERVICE_KEY"]
    with (
        httpx.Client(base_url=url, timeout=10) as auth,
        httpx.Client(
            base_url="http://backend:8000",
            timeout=10,
        ) as api,
        httpx.Client(
            base_url=f"http://supabase_inbucket_{project}:8025",
            timeout=5,
        ) as mail,
    ):
        yield PrivateFixture((auth, api, dsn, public_key, service_key, mail))


def confirmation_code(mail: httpx.Client, email: str) -> str:
    deadline = time.monotonic() + 15
    while time.monotonic() < deadline:
        response = mail.get("/api/v1/messages", params={"query": f"to:{email}"})
        assert response.is_success
        for message in response.json().get("messages", []):
            recipients = message.get("To", [])
            if not any(
                recipient.get("Address", "").casefold() == email.casefold()
                for recipient in recipients
            ):
                continue
            detail = mail.get(f"/api/v1/message/{message['ID']}")
            assert detail.is_success
            body = f"{detail.json().get('Text', '')}\n{detail.json().get('HTML', '')}"
            tokens = set(re.findall(r"(?<!\d)\d{6}(?!\d)", body))
            if len(tokens) == 1:
                return next(iter(tokens))
        time.sleep(0.2)
    pytest.fail("The local signup confirmation email did not contain a six-digit code.")


@pytest.fixture
def accounts(stack):
    auth, _, _, public_key, service_key, _ = stack
    created = []
    try:
        for _ in range(2):
            email = f"asgard-test-{uuid4()}@example.test"
            password = f"local test password {uuid4()}"
            result = auth.post(
                "/auth/v1/admin/users",
                headers={
                    "apikey": public_key,
                    "Authorization": f"Bearer {service_key}",
                },
                json={"email": email, "password": password, "email_confirm": True},
            )
            assert result.is_success
            user_id = result.json()["id"]
            created.append(PrivateAccount(id=user_id))
            token = auth.post(
                "/auth/v1/token?grant_type=password",
                headers={"apikey": public_key},
                json={"email": email, "password": password},
            )
            assert token.is_success
            created[-1].update(token.json())
        yield created
    finally:
        for account in created:
            result = auth.delete(
                f"/auth/v1/admin/users/{account['id']}",
                headers={
                    "apikey": public_key,
                    "Authorization": f"Bearer {service_key}",
                },
            )
            assert result.is_success


@pytest.fixture
def verified_signup(stack):
    auth, _, _, public_key, service_key, mail = stack
    email = f"asgard-signup-test-{uuid4()}@example.test"
    password = f"local test password {uuid4()}"
    user_id = None
    try:
        signup = auth.post(
            "/auth/v1/signup",
            headers={"apikey": public_key},
            json={"email": email, "password": password},
        )
        assert signup.is_success
        signup_body = signup.json()
        user_id = signup_body.get("user", signup_body)["id"]
        code = confirmation_code(mail, email)
        verified = auth.post(
            "/auth/v1/verify",
            headers={"apikey": public_key},
            json={"type": "signup", "email": email, "token": code},
        )
        assert verified.is_success
        login = auth.post(
            "/auth/v1/token?grant_type=password",
            headers={"apikey": public_key},
            json={"email": email, "password": password},
        )
        assert login.is_success
        account = PrivateAccount(id=user_id)
        account.update(login.json())
        yield account
    finally:
        if user_id:
            deleted = auth.delete(
                f"/auth/v1/admin/users/{user_id}",
                headers={
                    "apikey": public_key,
                    "Authorization": f"Bearer {service_key}",
                },
            )
            assert deleted.is_success


def test_persistence_owner_isolation_and_stale_save(stack, accounts, verified_signup):
    _, api, _, _, _, _ = stack
    signup_headers = {"Authorization": f"Bearer {verified_signup['access_token']}"}
    assert (
        api.patch(
            "/api/v1/me/profile",
            headers=signup_headers,
            json={"first_name": "Verified signup", "expected_version": 0},
        ).status_code
        == 200
    )
    assert (
        api.get("/api/v1/me/profile", headers=signup_headers).json()["profile"]["first_name"]
        == "Verified signup"
    )
    for account, name in zip(accounts, ["Account A", "Account B"], strict=True):
        headers = {"Authorization": f"Bearer {account['access_token']}"}
        assert api.get("/api/v1/me/profile", headers=headers).json() == {"profile": None}
        saved = api.patch(
            "/api/v1/me/profile",
            headers=headers,
            json={
                "first_name": name,
                "surname": "",
                "expected_version": 0,
            },
        )
        assert saved.status_code == 200
        assert (
            api.get("/api/v1/me/profile", headers=headers).json()["profile"]["first_name"] == name
        )
        assert (
            api.patch(
                "/api/v1/me/profile",
                headers=headers,
                json={
                    "first_name": "stale",
                    "expected_version": 0,
                },
            ).status_code
            == 409
        )
    assert api.get("/api/v1/me/profile").status_code == 401
    assert (
        api.patch(
            "/api/v1/me/profile",
            headers={
                "Authorization": f"Bearer {accounts[0]['access_token']}",
            },
            json={"first_name": "attack", "expected_version": 1, "user_id": accounts[1]["id"]},
        ).status_code
        == 422
    )


def test_real_role_rls_and_reused_connection(stack, accounts):
    _, api, dsn, _, _, _ = stack
    for account in accounts:
        assert (
            api.patch(
                "/api/v1/me/profile",
                headers={
                    "Authorization": f"Bearer {account['access_token']}",
                },
                json={"first_name": "Owner", "expected_version": 0},
            ).status_code
            == 200
        )
    with psycopg.connect(dsn) as connection:
        assert connection.execute("select current_user").fetchone()[0] == "asgard_app"
        for role in ("anon", "authenticated"):
            assert not connection.execute(
                "select has_table_privilege(%s, 'asgard_private.profiles', 'SELECT')", [role]
            ).fetchone()[0]
        assert connection.execute("select count(*) from asgard_private.profiles").fetchone()[0] == 0
        connection.commit()
        for account in accounts:
            with connection.transaction():
                connection.execute("select set_config('asgard.user_id', %s, true)", [account["id"]])
                rows = connection.execute(
                    "select user_id::text from asgard_private.profiles"
                ).fetchall()
                assert rows == [(account["id"],)]
                other = next(item for item in accounts if item["id"] != account["id"])
                with pytest.raises(psycopg.errors.InsufficientPrivilege), connection.transaction():
                    connection.execute(
                        "insert into asgard_private.profiles(user_id,first_name) "
                        "values(%s,'forged')",
                        [other["id"]],
                    )
                assert (
                    connection.execute(
                        "update asgard_private.profiles set first_name='forbidden' "
                        "where user_id=%s",
                        [other["id"]],
                    ).rowcount
                    == 0
                )
            assert (
                connection.execute("select count(*) from asgard_private.profiles").fetchone()[0]
                == 0
            )
            connection.commit()
        with pytest.raises(psycopg.errors.InsufficientPrivilege), connection.transaction():
            connection.execute("delete from asgard_private.profiles")


def test_logout_rejects_old_access_token_and_refresh(stack, accounts):
    auth, api, _, public_key, _, _ = stack
    account = accounts[0]
    headers = {"apikey": public_key, "Authorization": f"Bearer {account['access_token']}"}
    assert auth.post("/auth/v1/logout?scope=local", headers=headers).is_success
    assert (
        api.get(
            "/api/v1/me/profile",
            headers={
                "Authorization": f"Bearer {account['access_token']}",
            },
        ).status_code
        == 401
    )
    assert not auth.post(
        "/auth/v1/token?grant_type=refresh_token",
        headers={"apikey": public_key},
        json={"refresh_token": account["refresh_token"]},
    ).is_success


def test_refresh_restores_access(stack, accounts):
    auth, api, _, public_key, _, _ = stack
    account = accounts[0]
    assert (
        api.patch(
            "/api/v1/me/profile",
            headers={"Authorization": f"Bearer {account['access_token']}"},
            json={"first_name": "Persisted after refresh", "expected_version": 0},
        ).status_code
        == 200
    )
    refresh = auth.post(
        "/auth/v1/token?grant_type=refresh_token",
        headers={"apikey": public_key},
        json={"refresh_token": account["refresh_token"]},
    )
    assert refresh.is_success
    restored = api.get(
        "/api/v1/me/profile",
        headers={"Authorization": f"Bearer {refresh.json()['access_token']}"},
    )
    assert restored.status_code == 200
    assert restored.json()["profile"]["first_name"] == "Persisted after refresh"


def test_competency_persistence_isolation_and_removal_revision(stack, accounts):
    """Requires migrated schema and at least one reviewed published skill."""
    _, api, dsn, _, _, _ = stack
    a, b = accounts
    headers = {"Authorization": f"Bearer {a['access_token']}"}
    other = {"Authorization": f"Bearer {b['access_token']}"}
    references = api.get("/api/v1/competencies?limit=1", headers=headers)
    assert references.status_code == 200
    assert references.json()["items"], (
        "Publish a reviewed skill fixture in this isolated stack first"
    )
    cid = references.json()["items"][0]["id"]
    path = f"/api/v1/me/competencies/{cid}"
    initial = api.get("/api/v1/me/competencies", headers=headers).json()
    version = initial["version"]
    learning = api.get("/api/v1/me/learning", headers=headers).json()
    result = api.patch(path, headers=headers, json={"expected_version": version, "level": 0})
    assert result.status_code == 200
    version += 1
    assert any(
        item["competency_id"] == cid and item["level"] == 0 for item in result.json()["items"]
    )
    assert (
        api.patch(
            path, headers=headers, json={"expected_version": version - 1, "level": 4}
        ).status_code
        == 409
    )
    assert not api.get("/api/v1/me/competencies", headers=other).json()["items"]
    with psycopg.connect(dsn) as connection:
        assert connection.execute("SELECT current_user").fetchone()[0] == "asgard_app"
        connection.execute("SELECT set_config('asgard.user_id', %s, true)", (a["id"],))
        assert (
            connection.execute(
                "SELECT count(*) FROM asgard_private.user_competencies WHERE user_id=%s", (b["id"],)
            ).fetchone()[0]
            == 0
        )
    with pytest.raises(psycopg.errors.InsufficientPrivilege), psycopg.connect(dsn) as connection:
        connection.execute("SELECT set_config('asgard.user_id', %s, true)", (b["id"],))
        connection.execute(
            "INSERT INTO asgard_private.user_competencies(user_id,competency_id,label,level) "
            "VALUES(%s,%s,'probe',4)",
            (a["id"], cid),
        )
    removed = api.post(path + "/remove", headers=headers, json={"expected_version": version})
    assert removed.status_code == 200
    version += 1
    assert not any(item["competency_id"] == cid for item in removed.json()["items"])
    recreated = api.patch(path, headers=headers, json={"expected_version": version, "level": None})
    assert recreated.status_code == 200
    assert any(
        item["competency_id"] == cid and item["level"] is None for item in recreated.json()["items"]
    )
    assert (
        api.post(path + "/remove", headers=headers, json={"expected_version": version}).status_code
        == 409
    )
    assert api.get("/api/v1/me/learning", headers=headers).json() == learning
