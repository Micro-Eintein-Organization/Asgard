"""Run a rollback-only cross-account profile RLS check on local Asgard."""

import os
from uuid import UUID

import psycopg
from psycopg.conninfo import conninfo_to_dict


def account_id(label: str) -> UUID:
    return UUID(input(f"{label} user UUID: ").strip())


def main() -> int:
    if os.getenv("ASGARD_ENABLE_LOCAL_RLS_CHECK") != "1":
        raise SystemExit("Set ASGARD_ENABLE_LOCAL_RLS_CHECK=1 for this local check.")
    if os.getenv("ASGARD_PROJECT_ID") != "asgard-foundation":
        raise SystemExit("This check is restricted to the local asgard-foundation project.")

    url = os.getenv("ASGARD_DATABASE_URL", "").replace(
        "postgresql+psycopg://", "postgresql://", 1
    )
    connection_info = conninfo_to_dict(url)
    if (
        connection_info.get("host") != "supabase_db_asgard-foundation"
        or connection_info.get("user") != "asgard_app"
        or connection_info.get("dbname") != "postgres"
    ):
        raise SystemExit("The configured database connection is not the local least-privilege role.")

    account_a = account_id("Account A")
    account_b = account_id("Account B")
    if account_a == account_b:
        raise SystemExit("Enter two different account UUIDs.")

    with psycopg.connect(url, autocommit=True) as connection:
        role = connection.execute("SELECT current_user").fetchone()[0]
        if role != "asgard_app":
            raise SystemExit("The database connection is not using asgard_app.")

        connection.execute("BEGIN")
        try:
            connection.execute(
                "SELECT set_config('asgard.user_id', %s, true)", (str(account_a),)
            )
            own_a = connection.execute(
                "SELECT user_id FROM asgard_private.profiles WHERE user_id = %s",
                (account_a,),
            ).fetchall()
            other_read = connection.execute(
                "SELECT user_id FROM asgard_private.profiles WHERE user_id = %s",
                (account_b,),
            ).fetchall()
            update_blocked = False
            try:
                updated = connection.execute(
                    "UPDATE asgard_private.profiles SET first_name = %s WHERE user_id = %s",
                    ("__asgard_rls_probe__", account_b),
                )
                update_blocked = updated.rowcount == 0
            except psycopg.errors.InsufficientPrivilege:
                update_blocked = True
        finally:
            connection.execute("ROLLBACK")

        connection.execute("BEGIN")
        try:
            connection.execute(
                "SELECT set_config('asgard.user_id', %s, true)", (str(account_b),)
            )
            own_b = connection.execute(
                "SELECT user_id FROM asgard_private.profiles WHERE user_id = %s",
                (account_b,),
            ).fetchall()
        finally:
            connection.execute("ROLLBACK")

    if len(own_a) != 1 or len(own_b) != 1:
        raise SystemExit("Both accounts must have an existing profile for this check.")
    if other_read:
        raise SystemExit("FAIL: Account A could read Account B's profile.")
    if not update_blocked:
        raise SystemExit("FAIL: Account A could update Account B's profile.")

    print("Account A cannot read Account B's profile: PASS")
    print("Account A cannot update Account B's profile: PASS")
    print("All database probes rolled back; no profile data was changed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
