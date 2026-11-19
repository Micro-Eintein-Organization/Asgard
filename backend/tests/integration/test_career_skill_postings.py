"""Real-PostgreSQL lifecycle checks for isolated career posting test projects.

Set ASGARD_RUN_POSTING_INTEGRATION_TESTS=1,
ASGARD_TEST_PROJECT_ID=asgard-stage3-test-<unique-name>,
ASGARD_TEST_POSTINGS_ADMIN_DATABASE_URL, and ASGARD_TEST_DATABASE_URL.
The first DSN must connect as postgres; the second must connect as asgard_app.
Both must use the named isolated local Supabase project's database container.
This module never creates a database, applies migrations, or cleans up rows.
"""

from __future__ import annotations

import asyncio
import os
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from threading import Barrier
from uuid import UUID, uuid4

import psycopg
import pytest
from psycopg.conninfo import conninfo_to_dict
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from app.modules.skill_matching.service import get_career_skill_matches
from scripts.render_career_skill_snapshot import render_postings_publish_sql

pytestmark = pytest.mark.skipif(
    os.getenv("ASGARD_RUN_POSTING_INTEGRATION_TESTS") != "1",
    reason=(
        "Requires explicit opt-in and a migrated, isolated local PostgreSQL "
        "posting test project."
    ),
)


@dataclass(frozen=True)
class PostingDatabase:
    admin_dsn: str = field(repr=False)
    runtime_dsn: str = field(repr=False)
    career_id: UUID


def _checked_dsn(name: str, expected_user: str, expected_host: str, project: str) -> str:
    dsn = os.environ.get(name)
    if not dsn:
        pytest.fail(f"{name} is required when posting integration tests are enabled.")
    if dsn.startswith("postgresql+psycopg://"):
        dsn = dsn.replace("postgresql+psycopg://", "postgresql://", 1)
    settings = conninfo_to_dict(dsn)
    if settings.get("user") != expected_user:
        pytest.fail(f"{name} must use the {expected_user} database role.")
    if settings.get("host") != expected_host:
        pytest.fail(f"{name} must use the isolated project's local database container.")
    if settings.get("dbname") != "postgres":
        pytest.fail(f"{name} must use the isolated local postgres database.")
    if not project.startswith("asgard-stage3-test-"):
        pytest.fail("Posting integration tests require a uniquely named isolated test project.")
    return dsn


@pytest.fixture
def posting_database() -> PostingDatabase:
    project = os.environ.get("ASGARD_TEST_PROJECT_ID", "")
    if not project.startswith("asgard-stage3-test-") or not project.replace(
        "-", ""
    ).isalnum():
        pytest.fail(
            "ASGARD_TEST_PROJECT_ID must be a unique asgard-stage3-test-* project; "
            "shared development, staging, and production databases are forbidden."
        )
    host = f"supabase_db_{project}"
    admin_dsn = _checked_dsn(
        "ASGARD_TEST_POSTINGS_ADMIN_DATABASE_URL", "postgres", host, project
    )
    runtime_dsn = _checked_dsn("ASGARD_TEST_DATABASE_URL", "asgard_app", host, project)

    with psycopg.connect(admin_dsn) as connection:
        required_tables = connection.execute(
            "SELECT to_regclass('asgard_catalog.career_skill_posting_versions'), "
            "to_regclass('asgard_catalog.career_skill_postings')"
        ).fetchone()
        if not all(required_tables):
            pytest.fail(
                "The posting migration is not installed in the isolated test database; "
                "this test will not apply it."
            )
        career = connection.execute(
            "SELECT id FROM asgard_catalog.careers "
            "WHERE status = 'published' ORDER BY id LIMIT 1"
        ).fetchone()
        if career is None:
            pytest.skip("The isolated database needs a published career for posting FKs.")
        return PostingDatabase(admin_dsn, runtime_dsn, career[0])


def _source() -> str:
    return f"stage-d-integration:{uuid4()}"


def _insert_draft(
    connection: psycopg.Connection,
    source: str,
    version: str,
    career_id: UUID,
    posting_id: str | None = None,
) -> str:
    posting_id = posting_id or f"posting-{uuid4()}"
    connection.execute(
        "INSERT INTO asgard_catalog.career_skill_posting_versions "
        "(source, source_version, input_row_count, verified_row_count, posting_count) "
        "VALUES (%s, %s, 15, 5, 1)",
        (source, version),
    )
    connection.execute(
        "INSERT INTO asgard_catalog.career_skill_postings "
        "(source, source_version, posting_id, career_id, job_title, company, source_url, "
        "retrieved_on, skill_labels, collected_by, reviewed_by) "
        "VALUES (%s, %s, %s, %s, 'Integration test role', 'Test company', "
        "'https://example.test/posting', DATE '2026-11-19', "
        "ARRAY['Python', 'PostgreSQL'], 'Stage D test collector', 'Stage D test reviewer')",
        (source, version, posting_id, career_id),
    )
    return posting_id


def _publish(
    dsn: str,
    source: str,
    version: str,
    reviewer: str = "Stage D test reviewer",
    before_commit=None,
) -> None:
    """Exercise the renderer's source lock and retire-then-publish transaction."""
    with psycopg.connect(dsn) as connection:
        with connection.transaction():
            connection.execute(
                "SELECT pg_advisory_xact_lock(hashtextextended(%s, 411))",
                ("asgard:career-skill-postings:" + source,),
            )
            target = connection.execute(
                "SELECT status, posting_count FROM asgard_catalog.career_skill_posting_versions "
                "WHERE source = %s AND source_version = %s FOR UPDATE",
                (source, version),
            ).fetchone()
            if target is None or target[0] != "draft":
                raise AssertionError("publication target must be an existing draft")
            actual_count = connection.execute(
                "SELECT count(*) FROM asgard_catalog.career_skill_postings "
                "WHERE source = %s AND source_version = %s",
                (source, version),
            ).fetchone()[0]
            if actual_count != target[1]:
                raise AssertionError("draft posting count must match its version record")
            connection.execute(
                "UPDATE asgard_catalog.career_skill_posting_versions "
                "SET status = 'retired', retired_at = now() "
                "WHERE source = %s AND status = 'published'",
                (source,),
            )
            connection.execute(
                "UPDATE asgard_catalog.career_skill_posting_versions "
                "SET status = 'published', reviewed_by = %s, reviewed_at = now(), "
                "published_at = now() "
                "WHERE source = %s AND source_version = %s AND status = 'draft'",
                (reviewer, source, version),
            )
            if before_commit is not None:
                before_commit(connection)


def _statuses(dsn: str, source: str) -> dict[str, str]:
    with psycopg.connect(dsn) as connection:
        rows = connection.execute(
            "SELECT source_version, status FROM asgard_catalog.career_skill_posting_versions "
            "WHERE source = %s",
            (source,),
        ).fetchall()
    return dict(rows)


def test_partial_unique_index_rejects_two_published_versions(posting_database):
    source = _source()
    with psycopg.connect(posting_database.admin_dsn) as connection:
        _insert_draft(connection, source, "one", posting_database.career_id)
        _insert_draft(connection, source, "two", posting_database.career_id)
    _publish(posting_database.admin_dsn, source, "one")

    with pytest.raises(psycopg.errors.UniqueViolation), psycopg.connect(
        posting_database.admin_dsn
    ) as connection:
        with connection.transaction():
            connection.execute(
                "UPDATE asgard_catalog.career_skill_posting_versions "
                "SET status = 'published', reviewed_by = 'reviewer', reviewed_at = now(), "
                "published_at = now() WHERE source = %s AND source_version = 'two'",
                (source,),
            )

    assert _statuses(posting_database.admin_dsn, source) == {
        "one": "published",
        "two": "draft",
    }


def test_publishing_one_source_does_not_retire_another(posting_database):
    first_source, second_source = _source(), _source()
    with psycopg.connect(posting_database.admin_dsn) as connection:
        _insert_draft(connection, first_source, "first-v1", posting_database.career_id)
        _insert_draft(connection, first_source, "first-v2", posting_database.career_id)
        _insert_draft(connection, second_source, "second-v1", posting_database.career_id)
    _publish(posting_database.admin_dsn, first_source, "first-v1")
    _publish(posting_database.admin_dsn, second_source, "second-v1")
    _publish(posting_database.admin_dsn, first_source, "first-v2")

    assert _statuses(posting_database.admin_dsn, first_source) == {
        "first-v1": "retired",
        "first-v2": "published",
    }
    assert _statuses(posting_database.admin_dsn, second_source) == {"second-v1": "published"}


def test_replacement_retires_old_and_publishes_new_in_one_transaction(posting_database):
    source = _source()
    with psycopg.connect(posting_database.admin_dsn) as connection:
        _insert_draft(connection, source, "old", posting_database.career_id)
        _insert_draft(connection, source, "new", posting_database.career_id)
    _publish(posting_database.admin_dsn, source, "old")
    _publish(posting_database.admin_dsn, source, "new")

    assert _statuses(posting_database.admin_dsn, source) == {
        "old": "retired",
        "new": "published",
    }


def test_failed_publication_rolls_back_retirement(posting_database):
    source = _source()
    with psycopg.connect(posting_database.admin_dsn) as connection:
        _insert_draft(connection, source, "old", posting_database.career_id)
        _insert_draft(connection, source, "target", posting_database.career_id)
    _publish(posting_database.admin_dsn, source, "old")

    def fail_after_updates(_connection):
        raise RuntimeError("injected failure after publication updates")

    with pytest.raises(RuntimeError, match="injected failure"):
        _publish(
            posting_database.admin_dsn,
            source,
            "target",
            before_commit=fail_after_updates,
        )

    assert _statuses(posting_database.admin_dsn, source) == {
        "old": "published",
        "target": "draft",
    }


def test_generated_publication_sql_retires_old_and_publishes_new(posting_database):
    source = _source()
    with psycopg.connect(posting_database.admin_dsn) as connection:
        _insert_draft(connection, source, "old", posting_database.career_id)
        _insert_draft(connection, source, "new", posting_database.career_id)
    _publish(posting_database.admin_dsn, source, "old")

    sql = render_postings_publish_sql(source, "new", "Stage D test reviewer")
    with psycopg.connect(posting_database.admin_dsn, autocommit=True) as connection:
        with psycopg.ClientCursor(connection) as cursor:
            cursor.execute(sql)

    assert _statuses(posting_database.admin_dsn, source) == {
        "old": "retired",
        "new": "published",
    }


def test_concurrent_publications_for_one_source_leave_one_consistent_version(
    posting_database,
):
    source = _source()
    with psycopg.connect(posting_database.admin_dsn) as connection:
        _insert_draft(connection, source, "concurrent-a", posting_database.career_id)
        _insert_draft(connection, source, "concurrent-b", posting_database.career_id)
    barrier = Barrier(2)

    def publish_after_barrier(version: str) -> None:
        barrier.wait(timeout=10)
        _publish(posting_database.admin_dsn, source, version)

    with ThreadPoolExecutor(max_workers=2) as pool:
        futures = [
            pool.submit(publish_after_barrier, "concurrent-a"),
            pool.submit(publish_after_barrier, "concurrent-b"),
        ]
        for future in futures:
            future.result(timeout=30)

    statuses = _statuses(posting_database.admin_dsn, source)
    assert list(statuses.values()).count("published") == 1
    assert list(statuses.values()).count("retired") == 1


async def _runtime_response(dsn: str):
    async_dsn = dsn
    if async_dsn.startswith("postgresql://"):
        async_dsn = async_dsn.replace("postgresql://", "postgresql+psycopg://", 1)
    engine = create_async_engine(async_dsn, pool_pre_ping=True)
    try:
        async with engine.connect() as connection:
            assert (await connection.exec_driver_sql("SELECT current_user")).scalar_one() == (
                "asgard_app"
            )
            user_id = UUID(int=0)
            await connection.execute(
                text("SELECT set_config('asgard.user_id', :uid, true)"),
                {"uid": str(user_id)},
            )
            return await get_career_skill_matches(connection, user_id)
    finally:
        await engine.dispose()


def _runtime_posting_ids(database: PostingDatabase, source: str) -> set[str]:
    response = asyncio.run(_runtime_response(database.runtime_dsn))
    return {
        posting.posting_id
        for career in response.items
        for posting in career.postings
        if posting.source == source
    }


def test_runtime_source_excludes_draft_postings(posting_database):
    source = _source()
    with psycopg.connect(posting_database.admin_dsn) as connection:
        posting_id = _insert_draft(connection, source, "draft", posting_database.career_id)

    assert posting_id not in _runtime_posting_ids(posting_database, source)


def test_runtime_source_excludes_retired_and_returns_current_published_postings(
    posting_database,
):
    source = _source()
    with psycopg.connect(posting_database.admin_dsn) as connection:
        retired_id = _insert_draft(connection, source, "old", posting_database.career_id)
        current_id = _insert_draft(connection, source, "current", posting_database.career_id)
    _publish(posting_database.admin_dsn, source, "old")
    _publish(posting_database.admin_dsn, source, "current")

    visible = _runtime_posting_ids(posting_database, source)
    assert current_id in visible
    assert retired_id not in visible


def test_published_and_retired_posting_records_are_immutable(posting_database):
    source = _source()
    with psycopg.connect(posting_database.admin_dsn) as connection:
        retired_id = _insert_draft(connection, source, "old", posting_database.career_id)
        current_id = _insert_draft(connection, source, "current", posting_database.career_id)
    _publish(posting_database.admin_dsn, source, "old")
    _publish(posting_database.admin_dsn, source, "current")

    for version, posting_id in (("old", retired_id), ("current", current_id)):
        with pytest.raises(psycopg.errors.RaiseException), psycopg.connect(
            posting_database.admin_dsn
        ) as connection:
            connection.execute(
                "UPDATE asgard_catalog.career_skill_postings SET company = 'Changed' "
                "WHERE source = %s AND source_version = %s AND posting_id = %s",
                (source, version, posting_id),
            )
        with pytest.raises(psycopg.errors.RaiseException), psycopg.connect(
            posting_database.admin_dsn
        ) as connection:
            connection.execute(
                "DELETE FROM asgard_catalog.career_skill_postings "
                "WHERE source = %s AND source_version = %s AND posting_id = %s",
                (source, version, posting_id),
            )


def test_runtime_role_reads_only_published_data_and_cannot_write(posting_database):
    source = _source()
    with psycopg.connect(posting_database.admin_dsn) as connection:
        published_id = _insert_draft(connection, source, "published", posting_database.career_id)
        draft_id = _insert_draft(connection, source, "draft", posting_database.career_id)
    _publish(posting_database.admin_dsn, source, "published")

    assert _runtime_posting_ids(posting_database, source) == {published_id}
    denied_statements = (
        "INSERT INTO asgard_catalog.career_skill_posting_versions "
        "(source, source_version, input_row_count, verified_row_count, posting_count) "
        "VALUES ('runtime-write-test', 'v1', 15, 5, 1)",
        "UPDATE asgard_catalog.career_skill_posting_versions SET status = 'retired' "
        "WHERE source = %s AND source_version = 'published'",
        "DELETE FROM asgard_catalog.career_skill_posting_versions "
        "WHERE source = %s AND source_version = 'published'",
        "INSERT INTO asgard_catalog.career_skill_postings "
        "(source, source_version, posting_id, career_id, job_title, company, source_url, "
        "retrieved_on, skill_labels, collected_by, reviewed_by) "
        "VALUES ('runtime-write-test', 'v1', 'p1', %s, 'Role', 'Co', "
        "'https://example.test/p1', DATE '2026-11-19', ARRAY['A', 'B'], 'Collector', 'Reviewer')",
        "UPDATE asgard_catalog.career_skill_postings SET company = 'Changed' "
        "WHERE source = %s AND source_version = 'published' AND posting_id = %s",
        "DELETE FROM asgard_catalog.career_skill_postings "
        "WHERE source = %s AND source_version = 'published' AND posting_id = %s",
    )
    parameters = (
        (),
        (source,),
        (source,),
        (posting_database.career_id,),
        (source, published_id),
        (source, published_id),
    )
    for statement, values in zip(denied_statements, parameters, strict=True):
        with pytest.raises(psycopg.errors.InsufficientPrivilege), psycopg.connect(
            posting_database.runtime_dsn
        ) as connection:
            connection.execute(statement, values)

    with psycopg.connect(posting_database.runtime_dsn) as connection:
        visible_versions = connection.execute(
            "SELECT source_version FROM asgard_catalog.career_skill_posting_versions "
            "WHERE source = %s",
            (source,),
        ).fetchall()
        assert visible_versions == [("published",)]
        assert connection.execute(
            "SELECT count(*) FROM asgard_catalog.career_skill_postings "
            "WHERE source = %s AND source_version = %s",
            (source, "draft"),
        ).fetchone()[0] == 0
    assert draft_id not in _runtime_posting_ids(posting_database, source)
