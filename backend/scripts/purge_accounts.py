"""Bounded maintenance worker. Only accepted ledger accounts can be processed."""

import argparse
import asyncio
import json
import os
from datetime import UTC, datetime
from time import monotonic
from uuid import uuid4

import httpx
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine


class PurgeFailure(Exception):
    pass


def configuration(*, needs_admin=True):
    url = os.environ["ASGARD_MAINTENANCE_DATABASE_URL"]
    origin = os.environ["ASGARD_SUPABASE_URL"].rstrip("/")
    key = os.environ.get("ASGARD_AUTH_ADMIN_KEY", "")
    from urllib.parse import parse_qs, urlsplit

    parsed = urlsplit(url)
    if not (parsed.username or "").startswith("asgard_maintenance"):
        raise SystemExit("Use the provisioned maintenance database role.")
    local = os.environ.get("ASGARD_MAINTENANCE_LOCAL") == "1"
    if not local and (
        urlsplit(origin).scheme != "https"
        or parse_qs(parsed.query).get("sslmode") != ["verify-full"]
    ):
        raise SystemExit("Hosted maintenance requires HTTPS and verify-full database TLS.")
    if needs_admin and not key:
        raise SystemExit("Configure the private provider-admin credential.")
    return url, origin, key


async def purge_storage(http, uid):
    for bucket in ("asgard-documents", "asgard-profile-photos"):
        for _ in range(10):
            response = await http.post(
                f"/storage/v1/object/list/{bucket}",
                json={
                    "prefix": uid + "/",
                    "limit": 100,
                    "offset": 0,
                    "sortBy": {"column": "name", "order": "asc"},
                },
            )
            if not response.is_success:
                raise PurgeFailure("storage_list")
            items = response.json()
            if not isinstance(items, list):
                raise PurgeFailure("storage_shape")
            if not items:
                break
            names = []
            for item in items:
                name = item.get("name", "")
                if not item.get("id") or not name or "/" in name or name in (".", ".."):
                    raise PurgeFailure("storage_structure")
                names.append(uid + "/" + name)
            response = await http.request(
                "DELETE", f"/storage/v1/object/{bucket}", json={"prefixes": names}
            )
            if not response.is_success:
                raise PurgeFailure("storage_delete")
        else:
            raise PurgeFailure("storage_batch_limit")


async def update(engine, job, stage=None, failure=None):
    async with engine.begin() as connection:
        if failure:
            await connection.execute(
                text(
                    "UPDATE asgard_private.account_deletions SET "
                    ""
                    "failure_code=:failure,lease_id=NULL,lease_until=NULL,"
                    "next_attempt_at=statement_timestamp()+make_interval(secs=>:delay) "
                    "WHERE user_id=CAST(:uid AS uuid) AND lease_id=CAST(:lease AS uuid)"
                ),
                {
                    "uid": str(job["user_id"]),
                    "lease": str(job["lease_id"]),
                    "failure": failure,
                    "delay": min(21600, 60 * 2 ** min(job["attempts"], 10)),
                },
            )
        else:
            result = await connection.execute(
                text(
                    "UPDATE asgard_private.account_deletions SET stage=:stage, "
                    "failure_code=NULL,completed_at=CASE WHEN :stage='completed' THEN "
                    "statement_timestamp() ELSE completed_at END, "
                    "lease_until=statement_timestamp()+interval '10 minutes' "
                    "WHERE user_id=CAST(:uid AS uuid) AND lease_id=CAST(:lease AS uuid) "
                    "RETURNING user_id"
                ),
                {"uid": str(job["user_id"]), "lease": str(job["lease_id"]), "stage": stage},
            )
            if result.scalar_one_or_none() is None:
                raise PurgeFailure("lease_lost")
            job["stage"] = stage


async def process(engine, http, job):
    uid = str(job["user_id"])
    if job["stage"] == "storage":
        await purge_storage(http, uid)
        await update(engine, job, "auth")
    if job["stage"] == "auth":
        response = await http.request(
            "DELETE", f"/auth/v1/admin/users/{uid}", json={"should_soft_delete": False}
        )
        if response.status_code != 404 and not response.is_success:
            raise PurgeFailure("auth_delete")
        await update(engine, job, "verify")
    if job["stage"] == "verify":
        response = await http.get(f"/auth/v1/admin/users/{uid}")
        if response.status_code != 404:
            raise PurgeFailure("auth_verify")
        await purge_storage(http, uid)
        async with engine.begin() as connection:
            await connection.execute(
                text("SELECT set_config('asgard.user_id',:uid,true)"), {"uid": uid}
            )
            tables = (
                await connection.execute(
                    text(
                        "SELECT DISTINCT table_name FROM information_schema.columns "
                        "WHERE table_schema='asgard_private' AND column_name='user_id' AND "
                        "table_name<>'account_deletions'"
                    )
                )
            ).scalars()
            for table in tables:
                quoted = connection.dialect.identifier_preparer.quote(table)
                count = await connection.scalar(
                    text(
                        f"SELECT count(user_id) FROM asgard_private.{quoted} WHERE "
                        "user_id=CAST(:uid AS uuid)"
                    ),
                    {"uid": uid},
                )
                if count:
                    raise PurgeFailure("records_remain")
        await update(engine, job, "completed")


async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check-health", action="store_true")
    parser.add_argument(
        "--prune-reviewed-ledger-before",
        type=lambda value: datetime.strptime(value, "%Y-%m-%d").replace(tzinfo=UTC),
    )
    args = parser.parse_args()
    url, origin, key = configuration(
        needs_admin=not (args.check_health or args.prune_reviewed_ledger_before)
    )
    engine = create_async_engine(
        url,
        pool_size=1,
        max_overflow=0,
        hide_parameters=True,
        connect_args={"connect_timeout": 5, "options": "-c statement_timeout=10000"},
    )
    processed = failed = 0
    started = monotonic()
    try:
        async with engine.connect() as connection:
            safe = await connection.scalar(
                text(
                    "SELECT current_user='asgard_maintenance' AND NOT rolsuper "
                    "AND NOT rolbypassrls AND NOT rolcreaterole AND NOT rolcreatedb FROM "
                    "pg_roles WHERE rolname=current_user"
                )
            )
            if not safe:
                raise SystemExit("Unsafe maintenance role.")
        if args.check_health:
            async with engine.connect() as connection:
                healthy = await connection.scalar(
                    text(
                        "SELECT COALESCE((SELECT failed=0 AND "
                        "finished_at>statement_timestamp()-interval '3 hours' FROM "
                        "asgard_private.deletion_maintenance_runs "
                        "ORDER BY finished_at DESC LIMIT 1),false)"
                    )
                )
                overdue = await connection.scalar(
                    text(
                        "SELECT count(*) FROM asgard_private.account_deletions "
                        "WHERE stage<>'completed' AND deadline_at<statement_timestamp()"
                    )
                )
            print(json.dumps({"healthy": healthy, "overdue": overdue}))
            if not healthy or overdue:
                raise SystemExit(1)
            return
        if args.prune_reviewed_ledger_before:
            async with engine.begin() as connection:
                removed = await connection.execute(
                    text(
                        "DELETE FROM asgard_private.account_deletions "
                        "WHERE stage='completed' AND completed_at<:cutoff "
                        "AND completed_at<statement_timestamp()-interval '7 days'"
                    ),
                    {"cutoff": args.prune_reviewed_ledger_before},
                )
                print(json.dumps({"reviewed_ledger_rows_removed": removed.rowcount}))
            return
        async with httpx.AsyncClient(
            base_url=origin,
            follow_redirects=False,
            timeout=15,
            headers={"apikey": key, "Authorization": "Bearer " + key},
        ) as http:
            for _ in range(3):
                if monotonic() - started > 480:
                    break
                async with engine.begin() as connection:
                    row = (
                        (
                            await connection.execute(
                                text(
                                    "WITH candidate AS (SELECT user_id FROM "
                                    "asgard_private.account_deletions "
                                    "WHERE stage<>'completed' AND "
                                    "next_attempt_at<=statement_timestamp() "
                                    "AND (lease_until IS NULL OR "
                                    "lease_until<statement_timestamp()) ORDER BY accepted_at "
                                    "FOR UPDATE SKIP LOCKED LIMIT 1) UPDATE "
                                    "asgard_private.account_deletions d "
                                    "SET lease_id=CAST(:lease AS "
                                    "uuid),lease_until=statement_timestamp()+interval '10 minutes',"
                                    "attempts=attempts+1 "
                                    "FROM candidate c WHERE d.user_id=c.user_id RETURNING d.*"
                                ),
                                {"lease": str(uuid4())},
                            )
                        )
                        .mappings()
                        .one_or_none()
                    )
                if row is None:
                    break
                job = dict(row)
                try:
                    async with asyncio.timeout(150):
                        await process(engine, http, job)
                    processed += 1
                except Exception as error:
                    failed += 1
                    code = str(error) if isinstance(error, PurgeFailure) else "maintenance_failure"
                    await update(engine, job, failure=code)
            async with engine.begin() as connection:
                overdue = await connection.scalar(
                    text(
                        "SELECT count(*) FROM asgard_private.account_deletions "
                        "WHERE stage<>'completed' AND deadline_at<statement_timestamp()"
                    )
                )
                await connection.execute(
                    text(
                        "INSERT INTO asgard_private.deletion_maintenance_runs(id,processed,failed) "
                        "VALUES(CAST(:id AS uuid),:processed,:failed)"
                    ),
                    {
                        "id": str(uuid4()),
                        "processed": processed,
                        "failed": failed + int(bool(overdue)),
                    },
                )
                await connection.execute(
                    text(
                        "DELETE FROM asgard_private.deletion_maintenance_runs "
                        "WHERE finished_at<statement_timestamp()-interval '30 days'"
                    )
                )
                await connection.execute(
                    text(
                        "DELETE FROM asgard_private.account_deletion_attempts WHERE "
                        "(user_id,id) IN "
                        "(SELECT user_id,id FROM asgard_private.account_deletion_attempts "
                        "WHERE created_at<statement_timestamp()-interval '30 days' ORDER BY "
                        "created_at LIMIT 1000)"
                    )
                )
            print(json.dumps({"processed": processed, "failed": failed, "overdue": overdue}))
            if failed or overdue:
                raise SystemExit(1)
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
