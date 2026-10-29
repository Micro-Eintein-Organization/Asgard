"""Render the additive Data Analyst teaching revision; never connect to a database."""

from copy import deepcopy

from render_content_release import identifier, insert, literal
from render_prototype import render as render_original

from app.content.prototype_v1 import calc, careers


def render():
    career = deepcopy(next(c for c in careers() if c["slug"] == "data-analyst"))
    rid = identifier("roadmap/data-analyst/1")
    old = career["roadmap"]["milestones"]
    groups = [
        (
            "understand-data",
            "Frame a useful question",
            [
                (
                    "question-types",
                    "Define a useful question",
                    "Ask whether completion differs by channel.",
                    (
                        "Write a question specifying completion,"
                        " channel and the eight fictional visits."
                    ),
                ),
                (
                    "inspect-records",
                    "Inspect records",
                    "Each row is one visit, not one person.",
                    (
                        "Count eight rows and explain why repeate"
                        "d visits would not measure unique people."
                    ),
                ),
                (
                    "fields-types",
                    "Identify fields and types",
                    "Channel is categorical; minutes is numeric; week is an ordered label.",
                    "Classify every field and distinguish an identifier from a measurement.",
                ),
            ],
        ),
        (
            "prepare-data",
            "Prepare trustworthy data",
            [
                (
                    "clean-data",
                    "Keep a cleaning record",
                    "Keep the original CSV unchanged and work on a copy.",
                    "Record the input row count, each change and the reason.",
                ),
                (
                    "missing-values",
                    "Handle missing values",
                    "A missing duration is unknown, not zero.",
                    (
                        "Blank one duration in a copy; describe exclusi"
                        "on versus imputation without silently choosing."
                    ),
                ),
                (
                    "duplicate-records",
                    "Check duplicate records",
                    "Visit identifiers should be unique.",
                    "Duplicate visit 1 in a copy, detect it and restore eight distinct visits.",
                ),
                (
                    "consistent-values",
                    "Check consistency",
                    "Web and web would split one category.",
                    "Introduce Web in a copy, normalize it and verify the before/after counts.",
                ),
            ],
        ),
        (
            "analyze-explain",
            "Choose an analysis tool",
            [
                (
                    "spreadsheet-basics",
                    "Import and filter in Calc",
                    "Import the CSV with the first row as headings.",
                    "Filter channel=web and verify four records.",
                    "spreadsheet",
                ),
                (
                    "calc-formulas",
                    "Calculate with formulas",
                    "There are five yes values across eight records.",
                    "Use COUNTIF on completed and calculate 5/8.",
                    "spreadsheet",
                ),
                (
                    "calc-groups",
                    "Group with a pivot table",
                    "Web has three completions and referral has two.",
                    "Create channel totals and compare them with the reference output.",
                    "spreadsheet",
                ),
                (
                    "calc-checks",
                    "Check spreadsheet results",
                    "Both channels average 15 minutes.",
                    "Calculate each mean independently and retain formulas.",
                    "spreadsheet",
                ),
                (
                    "sql-basics",
                    "Import and select with SQLite",
                    "The practice table is named visits.",
                    "Import the CSV and SELECT COUNT(*) to verify eight rows.",
                    "sql",
                ),
                (
                    "sql-filter",
                    "Filter records with SQL",
                    "WHERE completed='yes' retains five records.",
                    "Select completed visits and list their identifiers.",
                    "sql",
                ),
                (
                    "sql-groups",
                    "Group and aggregate with SQL",
                    "GROUP BY channel gives two groups.",
                    "Use COUNT and AVG(minutes) and compare with the reference output.",
                    "sql",
                ),
                (
                    "sql-checks",
                    "Validate SQL totals",
                    "Group counts must sum to eight.",
                    (
                        "Compare grouped counts and completion t"
                        "otals with a separate whole-table query."
                    ),
                    "sql",
                ),
            ],
        ),
        (
            "communicate",
            "Analyze and communicate",
            [
                (
                    "summaries",
                    "Choose a summary",
                    "A mean duration describes these eight records only.",
                    "Report counts and mean duration with units.",
                ),
                (
                    "comparisons",
                    "Compare like denominators",
                    "Web is 3/4; referral is 2/4.",
                    "Report both counts and percentages; explain the tiny sample.",
                ),
                (
                    "charts",
                    "Choose and explain a chart",
                    "A two-bar chart can compare completion counts.",
                    "Label channels and units, start the count axis at zero and show the source.",
                ),
                (
                    "interpretation",
                    "Separate observation and cause",
                    "The table records a difference, not its cause.",
                    "Write one supported observation and one explanation requiring more evidence.",
                ),
            ],
        ),
        (
            "project",
            "Complete a small project",
            [
                (
                    "project-plan",
                    "Plan the analysis",
                    "A useful report answers one bounded question.",
                    "Record question, population, fields and intended output.",
                ),
                (
                    "project-prepare",
                    "Prepare a reproducible table",
                    "Cleaning choices affect the result.",
                    "Deliver the original, working copy and cleaning record.",
                ),
                (
                    "project-analyze",
                    "Run a reproducible analysis",
                    "Either tool should produce the same reference counts.",
                    "Save formulas or SQL and reconcile totals.",
                ),
                (
                    "analysis-report",
                    "Write a short analysis report",
                    "Web: four visits, three completions; referral: four visits, two completions.",
                    "Present question, checks, chart and findings in one page.",
                ),
                (
                    "project-limits",
                    "Document limitations",
                    "Synthetic visits cannot establish real user behavior.",
                    "State the synthetic source, small sample and absence of causal evidence.",
                ),
            ],
        ),
    ]
    baseline = {}
    for pos, m in enumerate(old):
        mid = identifier("milestone/" + rid + "/" + m["slug"])
        baseline[("milestones", mid)] = {
            "title": m["title"],
            "description": m["description"],
            "position": pos,
        }
        for p, t in enumerate(m["topics"]):
            baseline[("topics", identifier("topic/" + rid + "/" + t["slug"]))] = {
                "milestone_id": mid,
                "title": t["title"],
                "explanation": t["explanation"],
                "position": p + 1000,
            }
    statements = ["BEGIN;", "SELECT pg_advisory_xact_lock(72611029);"]
    changes, checks = [], []
    branch_mid = identifier("milestone/" + rid + "/analyze-explain")
    gid = identifier("group/" + branch_mid + "/analysis-tool")
    for pos, (slug, title, lessons) in enumerate(groups):
        mid = identifier("milestone/" + rid + "/" + slug)
        fields = {
            "id": mid,
            "roadmap_id": rid,
            "title": title,
            "description": title + " using the Asgard synthetic visit dataset.",
            "position": pos,
        }
        if ("milestones", mid) in baseline:
            changes.append(update("milestones", mid, baseline[("milestones", mid)], fields))
        else:
            changes.append(insert("milestones", fields))
        checks.append(insert("milestones", fields))
        for p, lesson in enumerate(lessons):
            key, label, example, exercise, *branch = lesson
            tid = identifier("topic/" + rid + "/" + key)
            explanation = (
                "Objective: " + label + ".\n\n"
                "Explanation: "
                + example
                + "\n\nWorked example: "
                + example
                + "\n\nExercise: "
                + exercise
                + (
                    "\n\nCompletion checklist: Save your worki"
                    "ng; explain the result in your own words; "
                )
                + "check it against the data dictionary and reference results; "
                "record uncertainties. "
                "Marking Done records learning activity, not assessed proficiency."
            )
            fields = {
                "id": tid,
                "roadmap_id": rid,
                "milestone_id": mid,
                "branch_id": identifier("branch/" + gid + "/" + branch[0]) if branch else None,
                "title": label,
                "explanation": explanation,
                "position": p,
            }
            if ("topics", tid) in baseline:
                changes.append(update("topics", tid, baseline[("topics", tid)], fields))
            else:
                changes.append(insert("topics", fields))
                resource = calc("LibreOffice Calc documentation")
                if branch == ["sql"]:
                    resource.update(
                        title="SQLite SELECT documentation",
                        url="https://www.sqlite.org/lang_select.html",
                        license="SQLite public-domain documentation; link only",
                    )
                changes.append(
                    insert(
                        "resources",
                        {
                            "id": identifier("resource/" + tid + "/0"),
                            "topic_id": tid,
                            **resource,
                            "position": 0,
                        },
                    )
                )
            checks.append(insert("topics", fields))
    # Existing position 1 moves to 2 before the new milestone occupies position 1.
    changes = [
        changes[0],
        changes[
            next(
                i
                for i, s in enumerate(changes)
                if s.startswith("DO") and "Choose an analysis tool" in s
            )
        ],
    ] + [
        s
        for i, s in enumerate(changes)
        if i
        not in (
            0,
            next(
                i
                for i, s in enumerate(changes)
                if s.startswith("DO") and "Choose an analysis tool" in s
            ),
        )
    ]
    statements.append(
        (
            "DO $release$ BEGIN IF NOT EXISTS (SELECT 1 FROM"
            " asgard_catalog.releases WHERE version=2) THEN\n"
        )
        + "UPDATE asgard_catalog.topics SET position=position+1000 WHERE roadmap_id="
        + literal(rid)
        + ";\n"
        + "\n".join(changes)
        + (
            "\nUPDATE asgard_catalog.roadmaps SET revision=2, revision_note='"
            "Detailed Data Analyst path; existing progress retained' WHERE id="
        )
        + literal(rid)
        + " AND revision=1;"
        + "\nINSERT INTO asgard_catalog.releases(id,version) VALUES("
        + literal(identifier("release/2"))
        + ",2); END IF; END $release$;"
    )
    statements.extend(checks)
    # Validate untouched release-1 records too, including other published careers.
    for statement in render_original().split("\n\n"):
        if not statement.startswith("INSERT INTO asgard_catalog."):
            continue
        table = statement.split("asgard_catalog.", 1)[1].split(" ", 1)[0]
        if table in ("milestones", "topics", "roadmaps") and rid in statement:
            continue
        if table == "releases":
            continue
        statements.append(statement)
    statements.append(insert("roadmaps", {
        "id": rid, "career_id": identifier("career/data-analyst"),
        "title": career["roadmap"]["title"], "description": career["roadmap"]["description"],
        "status": "published", "revision": 2,
        "revision_note": "Detailed Data Analyst path; existing progress retained",
    }))
    statements.append("COMMIT;")
    return "\n".join(statements)


def update(table, identity, old, new):
    conditions = " AND ".join(k + " IS NOT DISTINCT FROM " + literal(v) for k, v in old.items())
    values = ", ".join(k + "=" + literal(v) for k, v in new.items() if k != "id")
    return (
        "DO $update$ BEGIN IF NOT EXISTS(SELECT 1 FROM asgard_catalog."
        + table
        + " WHERE id="
        + literal(identity)
        + " AND "
        + conditions
        + ") THEN RAISE EXCEPTION 'Unexpected content revision'; END IF; UPDATE asgard_catalog."
        + table
        + " SET "
        + values
        + " WHERE id="
        + literal(identity)
        + "; END $update$;"
    )


if __name__ == "__main__":
    print(render())
