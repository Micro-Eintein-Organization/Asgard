# Asgard curated occupational dataset v0.1

Created: 2026-11-03. Last updated: 2026-11-03.
Status: research preparation draft; independent content, mapping and publication review pending.
Scope: all 12 existing careers, with source-native role levels and explicit gaps. No application import.

See the [objective-support review](../../../../docs/research/dataset-objective-review.md) for tested coverage, career-specific gaps and limits on adequacy, transition and current-market claims.
Task references: PM-W01/PM-W02/PM-W12; PM-F02/PM-F03/PM-F05; PM-DOC-01 through PM-DOC-04. This task implements research artifacts, not the application criteria PM-I1-01 through PM-I1-12.

Read the [methodology paper](../../../../docs/research/dataset-methodology.md) for the human-readable account and the [review report](../../../../docs/research/dataset-review.md) for unresolved findings and verification. The existing [source manifest](../../../../docs/plans/post-mvp/evidence/2026-11-03/source-manifest.json) identifies the supplied originals. Originals remain unchanged outside the repository; resolve filenames in an authorized source directory.

## Contents and interpretation

| File | Purpose and important fields |
| --- | --- |
| sources.csv | Source ID, filename, hash, known version, unknown dates, family URL, reuse and review notes |
| careers.csv | Existing career/roadmap IDs, slug, title and coverage conclusion |
| source_occupations.csv | Source-qualified role or classification ID, native code, description, career level and locator |
| competencies.csv | Source-qualified label, native code, type, definition, definition scope/locator and semantic-review state |
| expectations.csv | Occupation/competency references, native value and scale, source date, suppression and source-row reference |
| tasks.csv | Source task descriptions or explicitly marked project paraphrases, source IDs and exact locators |
| native_records.csv | Selected O*NET source fields or PDF extraction lines as values_json; archive-member/row or PDF-region locator |
| crosswalks.csv | Proposed from/to relationships; types distinguish career/occupation from competency/competency mappings |
| learning_associations.csv | Existing career/roadmap/topic IDs, competency reference, partial coverage rationale and pending review |
| decisions.csv | Source table, PDF page or worksheet selection decision; input/retained/non-retained unit counts and reasons |
| transformations.csv | Source-level preparation operations, rule version and rule-file SHA-256 |
| comparison_cases.csv | Proposed journey scenarios and expected categorical behavior, not executed application tests |
| source_locators.csv | Selected PDF role/definition locations and agent visual-inspection scope |
| interpretation.csv | NICS/PSF interpretation boundaries; no cross-scale conversion |
| dataset.json | Matching package generated from the CSV tables; values remain strings to preserve source representations |
| validation.json | Artifact check results, hashes, definition gaps, conflicting native levels and checks not run |

The 1,185 typed references include 907 software examples, 169 Philippine functional labels, 41 work activities, 33 knowledge descriptors, 25 transferable skills and 10 essential skills. They are not 1,185 independently assessed user skills. There are 158 complete Philippine definition paragraphs; 11 unmatched labels retain an empty definition and explicit scope note. Technology-example definitions describe their source category, not product-specific proficiency.

The 5,518 expectations include scale-specific O*NET observations and software examples. Do not treat every row as a separate mandatory requirement. Different source occupations and seniority profiles remain alternatives or complementary evidence. Crosswalks are proposed, never accepted implicitly. No universal skill-level score, suitability percentage or readiness cutoff is provided.

All five native same-label level conflicts are retained in validation.json. A consumer must withhold definitive targets for those conflicts until reviewed. Four additional same-level repetitions remain separate observations because they have different recorded source-row locations; do not count them as independent requirements. The local Security Analyst task context is present, but the adjacent ambiguous skill map was not assigned to that role. The software framework's Networking definition concerns business opportunity development; do not merge it with computer networking. Source role levels and NC qualification levels are not user scores.

## Reproduction and checks

These are offline research-processing commands, separate from the supported application startup workflow. Use a Python analysis environment with pypdf, pdfplumber and openpyxl already available; ReportLab is needed only for the paper export. This task used the bundled Codex analysis runtime and added no application dependency or lockfile change. Substitute that environment's Python executable for `python` as needed. Obtain authorized originals and supply their actual directory; the script checks all hashes before selection.

From the checkout root:

```powershell
python scripts/research/curate_dataset.py --source-dir "<your-source-directory>"
python scripts/research/validate_dataset.py --source-dir "<your-source-directory>"
python scripts/research/test_curated_dataset.py
python scripts/research/render_dataset_paper.py
```

The source-directory placeholder is not a literal path. Source text caches live under ignored `.cache/curation/`. An alternate destination can be supplied with `--output-dir` for a repeat build. The dataset rules are [curation-rules.json](../../curation-rules.json); identities are deterministic source-qualified UUIDs and changes in published meaning require a new reviewed version. PDF roles are bounded by explicit page/side selections; definitions record exact visually inspected text and their source region. The scripts never connect to a database or publish a catalog release.

CSV files are the structured release source. JSON is derived from CSV and validator equality checks prohibit divergent copies. Proposed human corrections must update the curation rule and transformation evidence, then regenerate and validate; do not silently edit source values or fabricate missing definitions. Retain this release as a dated artifact when preparing a successor.

## Attribution and limits

This release derives selected records from the O*NET 31.0 Database, sponsored by the U.S. Department of Labor, Employment and Training Administration, and developed by the National Center for O*NET Development. Selection, reserialization, project identities and proposed mappings are Asgard additions. Use is under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); see the [database license](https://www.onetcenter.org/license_db.html). O*NET® is a USDOL/ETA trademark. The source organization has not approved this preparation or its interpretation. Instrument licensing is separate.

Philippine source-specific reuse, edition metadata and complete collaborative bibliographic credits still need review before redistribution or application publication. Source availability alone is not a license determination. ESCO was not supplied. The dataset provides no current Philippine vacancy-demand measurement. Independent mappings, adequacy methodology, complete learning coverage and application acceptance remain pending.
