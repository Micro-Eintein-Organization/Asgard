"""Run only against a disposable network-isolated PostgreSQL container."""

import os
from pathlib import Path

import psycopg

if os.environ.get("ASGARD_ISOLATED_CONFIRMATION_CHECK") != "1":
    raise SystemExit("Explicit isolated-container check required")

root = Path("/repo")
subject = "00000000-0000-0000-0000-000000000001"
other = "00000000-0000-0000-0000-000000000002"
skill = "00000000-0000-0000-0000-000000000011"
with psycopg.connect("host=127.0.0.1 dbname=postgres user=postgres", autocommit=True) as conn:
    conn.execute((root / "backend/tests/confirmed_skills_fixture.sql").read_text())
    original = (root / "supabase/migrations/20261104000300_skill_recommendation_privacy.sql").read_text()
    routine = original.split("CREATE FUNCTION asgard_private.mutate_reported_skill(", 1)[1].split("END $$;", 1)[0]
    conn.execute("CREATE FUNCTION asgard_private.mutate_reported_skill(" + routine + "END $$;")
    conn.execute("REVOKE ALL ON FUNCTION asgard_private.mutate_reported_skill(uuid,text,uuid,integer,integer,boolean) FROM PUBLIC")
    conn.execute((root / "supabase/migrations/20261120000100_confirmed_skill_evidence.sql").read_text())
    conn.execute("SET ROLE asgard_app")
    conn.execute("SELECT set_config('asgard.user_id',%s,false)", (subject,))

    def confirm(version, items, session=subject):
        return conn.execute("SELECT asgard_private.confirm_reported_skills(%s,'aal1',%s,%s::jsonb)",
                            (session, version, items)).fetchone()[0]

    items = '[{"competency_id":"' + skill + '"}]'
    assert confirm(0, items) == 1
    for version, selections, session in [
        (0, items, subject), (1, items, other),
        (1, '[{"competency_id":"' + skill + '","level":4},'
            '{"competency_id":"00000000-0000-0000-0000-000000000099"}]', subject),
        (1, '[' + items[1:-1] + ',' + items[1:-1] + ']', subject),
    ]:
        try:
            confirm(version, selections, session)
        except psycopg.Error:
            pass
        else:
            raise AssertionError("Invalid batch accepted")
    try:
        conn.execute("UPDATE asgard_private.user_competencies SET level=4")
    except psycopg.errors.InsufficientPrivilege:
        pass
    else:
        raise AssertionError("Restricted role obtained direct write access")
    conn.execute("RESET ROLE")
    assert conn.execute("SELECT level,evidence_confirmed FROM asgard_private.user_competencies").fetchone() == (None, True)
    assert conn.execute("SELECT version FROM asgard_private.competency_state").fetchone()[0] == 1
    conn.execute("UPDATE asgard_private.user_competencies SET level=3")
    conn.execute("SET ROLE asgard_app")
    assert confirm(1, items) == 2
    conn.execute("SELECT set_config('asgard.user_id',%s,false)", (other,))
    assert confirm(0, items, other) == 1
    conn.execute("RESET ROLE")
    assert conn.execute("SELECT level FROM asgard_private.user_competencies WHERE user_id=%s", (subject,)).fetchone()[0] == 3
    assert conn.execute("SELECT count(*) FROM asgard_private.user_competencies").fetchone()[0] == 2
print("PASS: actual migration, atomic rollback, stale/duplicate saves, session denial, restricted writes, preserved rating, account isolation")
