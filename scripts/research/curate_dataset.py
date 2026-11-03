"""Prepare a review-only research release; never access application services."""

import argparse
import csv
import hashlib
import io
import json
import re
import sys
import zipfile
from collections import Counter
from pathlib import Path
from uuid import NAMESPACE_URL, uuid5

ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "docs/plans/post-mvp/evidence/2026-11-03"
DEFAULT_OUTPUT = ROOT / "data/post-mvp/releases/curated-v0.1"
RULES = ROOT / "data/post-mvp/curation-rules.json"
SELECTED = {"occupation_data", "job_titles", "sample_of_reported_titles", "essential_skills",
            "transferable_skills", "knowledge", "software_skills", "task_statements",
            "task_ratings", "work_activities", "occupation_level_metadata", "related_occupations"}
REFERENCE = {"content_model_reference", "scales_reference", "level_scale_anchors", "task_categories"}


def uid(key):
    return str(uuid5(NAMESPACE_URL, "asgard/research/curated-v0/" + key))


def clean(value):
    return re.sub(r"\s+", " ", str(value)).strip()


def write_table(out, name, rows, fields=None):
    fields = fields or list(rows[0])
    with (out / (name + ".csv")).open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def bundle(out):
    tables = {}
    for path in sorted(out.glob("*.csv")):
        with path.open(encoding="utf-8", newline="") as stream:
            tables[path.stem] = list(csv.DictReader(stream))
    data = {"release": "curated-v0.1", "status": "research draft; not application publication",
            "prepared_date": "2026-11-03", "tables": tables}
    (out / "dataset.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return tables


def prepare(source_dir, cache, out):
    from inspect_sources import inspect, MANIFEST
    from openpyxl import load_workbook
    from openpyxl.utils import get_column_letter
    import pdfplumber

    inspect(source_dir, cache)
    rules = json.loads(RULES.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    out.mkdir(parents=True, exist_ok=True)
    for stale in out.glob("*.csv"):
        if stale.stem not in {"sources", "careers", "source_occupations", "competencies", "expectations", "tasks", "native_records", "crosswalks", "learning_associations", "decisions", "transformations", "comparison_cases", "source_locators", "interpretation"}:
            raise ValueError(f"Unexpected CSV in release: {stale}")
    sources, careers, occupations, competencies, expectations, tasks = [], [], [], {}, [], []
    native, crosswalks, learning, decisions, locators, transforms, interpretation = [], [], [], [], [], [], []
    for source in manifest["sources"]:
        sources.append({"source_id": source["source_id"], "filename": source["original_filename"],
                        "sha256": source["sha256"], "bytes": source["bytes"], "title": source["title"],
                        "version": source.get("version") or "unknown", "publication_date": rules.get("source_metadata", {}).get(source["source_id"], {}).get("publication_date", "unknown"),
                        "download_date": "unknown", "inspection_date": "2026-11-03",
                        "source_family_url": source["source_family_url"], "exact_retrieval_url": "unknown",
                        "reuse_notes": source["reuse_status"], "independent_review": "pending",
                        "metadata_evidence": rules.get("source_metadata", {}).get(source["source_id"], {}).get("locator", "Original manifest; unspecified dates remain unknown")})
    with zipfile.ZipFile(source_dir / "db_31_0_csv.zip") as archive:
        if archive.testzip() is not None:
            raise ValueError("O*NET ZIP integrity failure")
        tables = {Path(n).stem: list(csv.DictReader(io.StringIO(archive.read(n).decode("utf-8-sig"))))
                  for n in archive.namelist() if n.endswith(".csv")}
    with (EVIDENCE / "career-coverage-candidates.csv").open(encoding="utf-8", newline="") as f:
        candidates = list(csv.DictReader(f))
    codes = {c for row in candidates for c in row["onet_candidate_codes"].split("; ")}
    bycode = {r["O*NET-SOC Code"]: r for r in tables["occupation_data"]}
    elements = {r["Element ID"]: r for r in tables["content_model_reference"]}
    for code in sorted(codes):
        r = bycode[code]
        occupations.append({"occupation_id": uid("SRC-10/occupation/" + code), "source_id": "SRC-10",
                            "native_code": code, "title": r["Title"], "description": r["Description"],
                            "career_level": "not separated by this source occupation",
                            "locator": "db_31_0_csv/occupation_data.csv; O*NET-SOC Code=" + code,
                            "transcription": "source values preserved", "mapping_review": "pending"})
    for key, rows in sorted(tables.items()):
        included = 0
        seen = set()
        for i, row in enumerate(rows, 2):
            take = key in REFERENCE or (key in SELECTED and row.get("O*NET-SOC Code") in codes)
            if not take:
                continue
            signature = json.dumps(row, sort_keys=True, ensure_ascii=False)
            if signature in seen:
                continue
            seen.add(signature)
            included += 1
            nid = uid("SRC-10/" + key + "/" + signature)
            native.append({"record_id": nid, "source_id": "SRC-10", "table": key,
                           "locator": f"db_31_0_csv/{key}.csv; CSV row {i}", "values_json": signature})
            if key in {"essential_skills", "transferable_skills", "knowledge", "work_activities", "software_skills"}:
                software = key == "software_skills"
                label = row["Workplace Example"] if software else row["Element Name"]
                ckey = "SRC-10/competency/" + ("software/" + label if software else row["Element ID"])
                cid = uid(ckey)
                descriptor = elements.get(row["Element ID"], {})
                competencies.setdefault(cid, {"competency_id": cid, "source_id": "SRC-10",
                    "native_code": row["Element ID"], "label": label, "definition": descriptor.get("Description", ""),
                    "type": "technology_example" if software else key, "aliases_json": "[]",
                    "definition_locator": ("db_31_0_csv/software_skills.csv; example=" + label) if software else
                    "db_31_0_csv/content_model_reference.csv; Element ID=" + row["Element ID"],
                    "definition_scope": "technology category definition, not product proficiency" if software else "source-native descriptor",
                    "semantic_review": "pending"})
                expectations.append({"expectation_id": uid("expectation/" + nid), "occupation_id": uid("SRC-10/occupation/" + row["O*NET-SOC Code"]),
                    "competency_id": cid, "source_id": "SRC-10", "native_record_id": nid,
                    "native_level": row.get("Data Value", ""), "native_scale": row.get("Scale ID", "technology example; no proficiency scale"),
                    "suppression": row.get("Recommend Suppress", ""), "not_relevant": row.get("Not Relevant", ""),
                    "observation_date": row.get("Date", ""), "locator": native[-1]["locator"],
                    "interpretation": "source occupational evidence; not a user score or mandatory Asgard threshold"})
            if key == "task_statements":
                tasks.append({"task_id": uid("task/" + nid), "occupation_id": uid("SRC-10/occupation/" + row["O*NET-SOC Code"]),
                              "source_id": "SRC-10", "native_record_id": nid, "native_task_code": row.get("Task ID", ""),
                              "description": row["Task"], "locator": native[-1]["locator"], "semantic_review": "pending"})
        decisions.append({"decision_id": uid("decision/SRC-10/" + key), "source_id": "SRC-10", "unit": key,
                          "outcome": "included" if included else "excluded from this release",
                          "input_records": len(rows), "retained_records": included, "not_retained_records": len(rows) - included,
                          "reason": "Full interpretation dependency" if key in REFERENCE else
                          "Occupation-scoped selection; exact repeated rows deduplicated" if key in SELECTED else
                          "Outside occupational/competency evidence required by this release; retained in original archive",
                          "independent_review": "pending"})
    # Existing converter supplies authoritative content identities without publication.
    sys.path.insert(0, str(ROOT / "backend/scripts"))
    from convert_guide_v4 import convert
    alltopics = {}
    for row in candidates:
        slug = row["asgard_career_slug"]
        doc = convert(ROOT / "backend/app/content/guide_v4" / (slug + ".json"))
        career, roadmap = doc["career"], doc["roadmap"]
        alltopics[slug] = {t["slug"]: t for m in roadmap["milestones"] for t in m["topics"]}
        role_codes = row["onet_candidate_codes"].split("; ")
        careers.append({"career_id": career["id"], "slug": slug, "title": career["title"], "roadmap_id": roadmap["id"],
                        "coverage": rules["coverage"][slug], "enrichment_status": "research draft; semantic review pending",
                        "esco_status": "not supplied", "current_employer_demand": "not established"})
        for code in role_codes:
            crosswalks.append({"crosswalk_id": uid("career-onet/" + slug + "/" + code), "career_id": career["id"],
                              "target_id": uid("SRC-10/occupation/" + code), "target_type": "source_occupation",
                              "relationship": "related occupational reference; equivalence not accepted",
                              "rationale": rules["rationales"][slug], "locator": bycode[code]["Description"], "review_status": "proposed"})
    # Reviewed extraction rules retain source role levels, rows and bounded definitions.
    for role in rules["pdf_roles"]:
        sid, page, label = role["source_id"], role["page"], role["title"]
        text = json.loads((cache / (sid + ".json")).read_text(encoding="utf-8"))["pages"][page - 1]["text"]
        if clean(role["anchor"]).lower() not in clean(text).lower():
            raise ValueError(f"PDF anchor changed: {sid} page {page}")
        oid = uid(sid + "/role/" + label)
        location = "; ".join(f"PDF page {part['page']} {part.get('side', 'whole')}" for part in role["parts"]) + f"; printed {role['printed_pages']}"
        occupations.append({"occupation_id": oid, "source_id": sid, "native_code": role.get("native_code", ""),
            "title": label, "description": role["description"], "career_level": role["career_level"],
            "locator": location, "transcription": "visually inspected source page; role description is a marked project paraphrase",
            "mapping_review": "pending"})
        locators.append({"locator_id": uid("locator/" + sid + "/" + str(page)), "source_id": sid,
                         "pdf_page": page, "printed_pages": role["printed_pages"], "visual_status": "visually inspected",
                         "scope": "selected role definition and skill map", "independent_review": "pending"})
        for slug in role["careers"]:
            career = next(c for c in careers if c["slug"] == slug)
            crosswalks.append({"crosswalk_id": uid("career-pdf/" + slug + "/" + oid), "career_id": career["career_id"],
                "target_id": oid, "target_type": "source_occupation", "relationship": role["relationship"],
                "rationale": role["mapping_rationale"], "locator": location, "review_status": "proposed"})
        skills = []
        original = source_dir / next(s["original_filename"] for s in manifest["sources"] if s["source_id"] == sid)
        with pdfplumber.open(original) as pdf:
            regions = []
            for part in role["parts"]:
                original_page = pdf.pages[part["page"] - 1]
                if part.get("side", "whole") == "whole" and original_page.width > original_page.height:
                    regions.extend([{**part, "side": side} for side in ["left", "right"]])
                else:
                    regions.append(part)
            for part in regions:
                pg = pdf.pages[part["page"] - 1]
                side = part.get("side", "whole")
                if side != "whole":
                    pg = pg.crop((0 if side == "left" else pg.width / 2, 0,
                                  pg.width / 2 if side == "left" else pg.width, pg.height))
                region_text = pg.extract_text() or ""
                region_lines = region_text.splitlines()
                for line_index, line in enumerate(region_lines):
                    match = re.match(r"^(.+?)\s+Level\s+([1-6](?:\s*[-–]\s*(?:Level\s*)?[1-6])?)\b", line)
                    if match:
                        name = re.sub(r"^(?:Competencies\s+|Skills and\s+)", "", clean(match[1]))
                        if line_index + 1 < len(region_lines) and region_lines[line_index + 1].strip() == "Deployment":
                            name += " Deployment"
                        if name in {"Proficiency", "FSC Proficiency"}:
                            continue
                        skills.append({"label": name, "level": match[2], "page": part["page"], "side": side, "raw_line": line})
        for entry_index, entry in enumerate(skills):
            name, level = entry["label"], entry["level"]
            cid = uid(sid + "/competency/" + name)
            nid = uid(oid + "/row/" + str(entry_index))
            native.append({"record_id": nid, "source_id": sid, "table": "pdf-functional-row",
                           "locator": f"PDF page {entry['page']} {entry['side']}; {label}; row {entry_index + 1}",
                           "values_json": json.dumps(entry, ensure_ascii=False, sort_keys=True)})
            competencies.setdefault(cid, {"competency_id": cid, "source_id": sid, "native_code": "",
                "label": name, "definition": "", "type": "functional_competency",
                "aliases_json": "[]", "definition_locator": location,
                "definition_scope": "native label and role expectation; full functional definition not transcribed in this release", "semantic_review": "pending"})
            expectations.append({"expectation_id": uid(oid + "/" + cid + "/" + str(entry_index)), "occupation_id": oid, "competency_id": cid,
                "source_id": sid, "native_record_id": nid, "native_level": level, "native_scale": "PSF functional competency level",
                "suppression": "", "not_relevant": "", "observation_date": "unknown", "locator": f"PDF page {entry['page']} {entry['side']}; functional row label={name}",
                "interpretation": "Source role level, including ranges; not converted to a user proficiency score"})
        for i, task in enumerate(role["tasks"], 1):
            tasks.append({"task_id": uid(oid + "/task/" + str(i)), "occupation_id": oid, "source_id": sid,
                          "native_record_id": "", "native_task_code": "", "description": task,
                          "locator": location + "; project paraphrase", "semantic_review": "pending"})
    # NICS source interpretation is kept separate from all PSF and O*NET levels.
    for spec in rules["interpretation"]:
        sid, page = spec["source_id"], spec["page"]
        text = json.loads((cache / (sid + ".json")).read_text(encoding="utf-8"))["pages"][page - 1]["text"]
        assert clean(spec["anchor"]).lower() in clean(text).lower()
        interpretation.append({"interpretation_id": uid(sid + "/interpretation/" + str(page)),
            "source_id": sid, "locator": f"PDF page {page}; printed {spec['printed_pages']}",
            "description": spec["description"], "visual_status": "visually inspected", "cross_scale_conversion": "none"})
    definition_documents = {}
    for spec in rules.get("definitions", []):
        sid, page, label = spec["source_id"], spec["page"], spec["label"]
        if sid not in definition_documents:
            source = next(s for s in manifest["sources"] if s["source_id"] == sid)
            definition_documents[sid] = pdfplumber.open(source_dir / source["original_filename"])
        pg = definition_documents[sid].pages[page - 1]
        side = spec.get("side", "whole")
        if side != "whole":
            pg = pg.crop((0 if side == "left" else pg.width / 2, 0,
                          pg.width / 2 if side == "left" else pg.width, pg.height))
        text = pg.extract_text() or ""
        if clean(spec["definition"]) not in clean(text):
            raise ValueError(f"Definition boundary changed: {sid}/{page}/{label}")
        cid = uid(sid + "/competency/" + label)
        competencies[cid]["definition"] = spec["definition"]
        competencies[cid]["definition_locator"] = f"PDF page {page} {side}; definition paragraph before FSC table"
        competencies[cid]["definition_scope"] = "complete source-native definition paragraph; line wrapping normalized"
        printed = str(2 * page - (3 if side == "right" else 4)) if sid == "SRC-13" else str(page - 2)
        locators.append({"locator_id": uid("definition/" + sid + "/" + str(page) + "/" + label), "source_id": sid,
                         "pdf_page": page, "printed_pages": printed, "visual_status": "visually inspected definition paragraph",
                         "scope": "definition only; level-specific application tables not transcribed", "independent_review": "pending"})
    for document in definition_documents.values():
        document.close()
    selected_pages = {(r["source_id"], p["page"]) for r in rules["pdf_roles"] for p in r["parts"]} | {(r["source_id"], r["page"]) for r in rules["interpretation"] + rules.get("definitions", [])}
    for source in sources:
        sid = source["source_id"]
        cached = cache / (sid + ".json")
        if not cached.exists():
            continue
        for p in json.loads(cached.read_text(encoding="utf-8"))["pages"]:
            take = (sid, p["page"]) in selected_pages
            decisions.append({"decision_id": uid(f"decision/{sid}/page/{p['page']}"), "source_id": sid,
                              "unit": f"PDF page {p['page']}", "outcome": "included selected evidence" if take else "supporting; not extracted into release",
                              "input_records": 1, "retained_records": int(take), "not_retained_records": int(not take),
                              "reason": "Bounded visually inspected evidence selection" if take else rules["source_appraisal"][sid],
                              "independent_review": "pending"})
    # PSOC is classified at unit-group level; it is never a competency target.
    wb = load_workbook(source_dir / manifest["sources"][0]["original_filename"], read_only=True, data_only=True)
    for sheet in wb:
        retained = 0
        for row_number, cells in enumerate(sheet.iter_rows(), 1):
            vals = [c.value for c in cells]
            first_value = next((v for v in vals if v is not None), None)
            code = str(first_value) if isinstance(first_value, int) and str(first_value) in rules["psoc_codes"] else None
            if code is None:
                continue
            title = next((v for v in vals if isinstance(v, str) and len(v.strip()) > 5 and v.strip().isupper()), None)
            if not title:
                continue
            oid = uid("SRC-01/occupation/" + code)
            if any(o["occupation_id"] == oid for o in occupations):
                continue
            retained += 1
            locator = f"{sheet.title}!A{row_number}:{get_column_letter(sheet.max_column)}{row_number}"
            occupations.append({"occupation_id": oid, "source_id": "SRC-01", "native_code": code,
                "title": clean(title), "description": "Local unit-group classification; consult source surrounding rows for task descriptions",
                "career_level": "not specified", "locator": locator, "transcription": "source classification heading", "mapping_review": "pending"})
            for slug in rules["psoc_codes"][code]:
                career = next(c for c in careers if c["slug"] == slug)
                crosswalks.append({"crosswalk_id": uid("career-psoc/" + slug + "/" + code), "career_id": career["career_id"],
                    "target_id": oid, "target_type": "source_occupation", "relationship": "candidate local classification; broad group",
                    "rationale": "Classification context only; does not imply skill equivalence or an adequacy threshold", "locator": locator, "review_status": "proposed"})
        decisions.append({"decision_id": uid("decision/SRC-01/" + sheet.title), "source_id": "SRC-01", "unit": sheet.title,
            "outcome": "included selected headings" if retained else "not selected", "input_records": sheet.max_row,
            "retained_records": retained, "not_retained_records": sheet.max_row - retained,
            "reason": "Worksheet rows are units for screening; selected unit-group headings only, not all occupied cells", "independent_review": "pending"})
    wb.close()
    for spec in rules["learning_links"]:
        career = next(c for c in careers if c["slug"] == spec["career"])
        topic = alltopics[spec["career"]][spec["topic"]]
        matches = [c for c in competencies.values() if c["source_id"] == spec["source_id"] and c["label"] == spec["competency"]]
        if not matches:
            raise ValueError("Missing learning competency: " + str(spec))
        learning.append({"association_id": uid("learning/" + matches[0]["competency_id"] + "/" + topic["id"]),
                         "career_id": career["career_id"], "roadmap_id": career["roadmap_id"], "topic_id": topic["id"],
                         "topic_title": topic["title"], "competency_id": matches[0]["competency_id"],
                         "coverage": "partial learning support; not mastery or full occupational coverage",
                         "rationale": spec["rationale"], "review_status": "proposed; independent curriculum review pending"})
    for source in sources:
        transforms.append({"transformation_id": uid("transform/" + source["source_id"]), "source_id": source["source_id"],
            "rule_version": rules["version"], "rules_sha256": hashlib.sha256(RULES.read_bytes()).hexdigest(),
            "operations": "Source values preserved in native_records; selected rows, deterministic IDs, exact-row deduplication, derived links" if source["source_id"] == "SRC-10" else
            "Selected headings or PDF role evidence; whitespace cleanup; marked project paraphrases; native levels retained",
            "review_status": "agent extraction verification; independent semantics and publication review pending"})
    cases = []
    for career in careers:
        for scenario in rules["scenarios"]:
            cases.append({"case_id": uid(career["slug"] + "/case/" + scenario["key"]), "career_id": career["career_id"],
                          "journey": scenario["journey"], "scenario": scenario["scenario"], "expected_behavior": scenario["expected"],
                          "status": "proposed reference case; not an executed application test"})
    crosswalks = [{"crosswalk_id": r["crosswalk_id"], "from_id": r["career_id"], "from_type": "asgard_career",
                  "to_id": r["target_id"], "to_type": r["target_type"], "relationship": r["relationship"],
                  "rationale": r["rationale"], "locator": r["locator"], "review_status": r["review_status"]} for r in crosswalks]
    for left_source, left_label, right_source, right_label in [
        ("SRC-13", "Data Analytics", "SRC-16", "Data Analytics"),
        ("SRC-13", "Software Testing", "SRC-16", "Software Testing"),
        ("SRC-13", "Programming and Coding", "SRC-10", "Programming"),
    ]:
        a = next(c for c in competencies.values() if c["source_id"] == left_source and c["label"] == left_label)
        b = next(c for c in competencies.values() if c["source_id"] == right_source and c["label"] == right_label)
        crosswalks.append({"crosswalk_id": uid("competency-crosswalk/" + a["competency_id"] + "/" + b["competency_id"]),
                          "from_id": a["competency_id"], "from_type": "competency", "to_id": b["competency_id"], "to_type": "competency",
                          "relationship": "related definition and task scope; equivalence not accepted",
                          "rationale": "Both definitions concern the same activity domain; granularity and levels remain source-specific. Do not merge identities.",
                          "locator": a["definition_locator"] + " | " + b["definition_locator"], "review_status": "proposed"})
    output = {"sources": sources, "careers": careers, "source_occupations": occupations,
              "competencies": sorted(competencies.values(), key=lambda r: r["competency_id"]), "expectations": expectations,
              "tasks": tasks, "native_records": native, "crosswalks": crosswalks, "learning_associations": learning,
              "decisions": decisions, "transformations": transforms, "comparison_cases": cases,
              "source_locators": locators, "interpretation": interpretation}
    for name, rows in output.items():
        write_table(out, name, rows)
    bundle(out)
    print(json.dumps({name: len(rows) for name, rows in output.items()}, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", type=Path, required=True)
    parser.add_argument("--cache-dir", type=Path, default=ROOT / ".cache/curation")
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    prepare(args.source_dir, args.cache_dir, args.output_dir)
