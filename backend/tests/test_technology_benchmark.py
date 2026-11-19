import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import render_technology_benchmark as technology  # noqa: E402


def record(skill="Python", career="data-analyst"):
    return {"posting_id": "one", "skills": skill, "review_status": "pending",
            "collected_by": "Collector", "asgard_career_proposed": career}


def test_technology_references_are_stable_and_separate_from_learning_tasks():
    records = [record("Python|CSS"), record(" python ", "frontend")]
    approved, careers, vocabulary = technology.prepare(records, "Reviewer")
    assert len(vocabulary) == 2
    assert technology.technology_key("Python") == technology.technology_key(" PYTHON ")
    assert all(item.canonical_key.startswith("benchmark-technology/") for item in vocabulary)
    assert all(item["review_status"] == "verified" for item in approved)
    assert records[0]["review_status"] == "pending"
    assert len(next(c for c in careers if c.key == "data-analyst").competencies) == 2
    assert len(next(c for c in careers if c.key == "frontend").competencies) == 1


def test_technology_publication_rejects_unknown_careers_and_self_review():
    with pytest.raises(ValueError, match="Unresolved"):
        technology.prepare([record(career="unknown")], "Reviewer")
    with pytest.raises(ValueError, match="must differ"):
        technology.prepare([record()], "Collector")


def test_reference_sql_does_not_modify_learning_links_or_existing_reports():
    _, _, vocabulary = technology.prepare([record("C++|C#")], "Reviewer")
    sql = technology.reference_sql(vocabulary, "Reviewer")
    assert "benchmark-technology/" in sql
    assert "conflicts with an existing canonical" in sql
    assert "ON CONFLICT (id) DO NOTHING" in sql
    assert "competency_links" not in sql
    assert "user_competencies" not in sql


def test_existing_rejected_postings_are_not_promoted():
    item = {**record(), "review_status": "rejected"}
    approved, _, vocabulary = technology.prepare([item], "Reviewer")
    assert approved == [] and vocabulary == ()
