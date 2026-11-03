# Curated dataset and methodology paper: review handoff

Created: 2026-11-03. Last updated: 2026-11-03.
Implementation status: research release and companion paper prepared; no application feature change.
Acceptance status: artifact verification completed as recorded below; independent semantic, methodology and publication acceptance pending.

Follow-up, 2026-11-03: the [objective-support review](dataset-objective-review.md) reruns integrity checks and assesses current skill coverage, career transitions and continued development against actual records. It identifies additional content/methodology work before adequacy claims; it does not accept mappings or feature behavior.

## Authorization and bounded work record

The user approved the expanded Curated Asgard Dataset and Dataset-Methodology Paper plan. It supersedes the earlier two-career data-preparation limit for this release: all 12 current careers receive evidence or explicit gaps, and relevant source career levels remain distinct. It does not expand the existing paper's two-career implementation/student study or authorize schema/API changes. Scope includes source/rule appraisal, related CSV/JSON artifacts, reproducible processing, validation, a readable Markdown/PDF methodology paper and a review handoff.

References: PM-DOC-01 through PM-DOC-04; evidence preparation for PM-W01/PM-W02/PM-W12 and PM-F02/PM-F03/PM-F05. The existing PM-I1 criteria remain proposed feature acceptance; source processing does not pass them. The active branch is `codex/connected-prototype`; existing modifications were preserved. This research work does not invoke the Stages 1-4 foundation branch workflow or perform restricted Git operations.

Problem: the earlier inventory and four candidate O*NET records did not provide a curated all-career release or a usable paper methodology. Steps: preserve original hashes; inspect actual source tables/pages; select bounded occupation/role/definition evidence; clean extraction representation; retain source-native distinctions; propose mappings and partial learning links; package CSV/JSON; verify data and paper; submit unresolved findings for review. Dependencies are the supplied originals, existing catalog identities and the available offline analysis libraries. No application contract changes are introduced.

Deliverables: [release and instructions](../../data/post-mvp/releases/curated-v0.1/README.md), [paper](dataset-methodology.md), the exported PDF at `output/pdf/asgard-dataset-methodology.pdf`, preparation/validation/rendering scripts under `scripts/research/`, and the updated planning navigation/status references.

## Findings requiring human review

1. **Occupation and seniority alignment.** All 59 crosswalks remain proposed. Broad software roles cannot define every Frontend requirement; a senior Data Scientist is not automatically a senior ML Engineer. UI and UX share supplementary occupation data without becoming equivalent.
2. **Native conflicts.** Five same-label level conflict groups in the penetration-testing analyst map are retained in validation.json. Security Threat Research has both 4 and 6. No maximum, average or inferred corrected value was selected. Four same-level repetitions also remain as separately located source observations; consumers must not inflate independent requirement counts from them.
3. **Ambiguous local header.** Local Security Analyst task context was retained, but the adjacent skill-level table was withheld because its heading is ambiguous. The O*NET security profile remains supplementary US evidence.
4. **Definition gaps and names.** 158 of 169 Philippine labels have complete selected definition paragraphs. Eleven unmatched variants remain empty, with locators and scope notes. Similar spellings are not automatically aliases. Networking in the software PSF describes business networking; it must not be equated with computer networks.
5. **Source-specific interpretation.** PSF functional levels, NICS categories, O*NET scales and TESDA qualifications remain distinct. The dataset establishes no compatible user-assessment scale or numeric adequacy method.
6. **Provenance and distribution.** Some exact retrieval URLs, dates, edition dates and collaborative author credits remain unknown. NICS publication month was verified as March 2024 on its image-only cover. Framework launch dates and contributor-message dates were not substituted. Philippine reuse conditions need their source-specific review; the O*NET derivative carries database attribution.
7. **Learning and source coverage.** Twelve proposed partial learning links are not a complete curriculum or proof of mastery. ESCO was not supplied, and current Philippine employer demand was not measured. Some local role tasks remain project paraphrases clearly marked as such.

These findings are part of the research result. They must not be cleared merely by changing a metadata label. Source transcription checks are agent verification, not independent expert acceptance.

## Verification evidence

Passed: original-file SHA-256 checks for all 20 inputs; ZIP CRC; CSV/JSON parity; unique identities; source/reference integrity; native O*NET row and flag/date/value parity; source-native PDF level preservation; count reconciliation; 12-career scenario and learning-reference coverage; existing career/roadmap/topic identities. Detailed counts and conflict IDs are in [validation.json](../../data/post-mvp/releases/curated-v0.1/validation.json).

Passed: visual inspection of selected role-map regions and continuation boundaries, 158 definition paragraphs, and two framework interpretation pages. The selection is explicitly bounded; it is not a claim of independent semantic validation of all 2,894 PDF pages or every native framework level-specific behavior table.

Passed: PDF export to 10 A4 pages; every page rendered with bundled Poppler and visually inspected. Paragraph text parity after removing page footers passed. Tables wrap within margins and repeat headers; references and code paths remain readable. Poppler emitted Symbol/ArialUnicode display-font notices; inspected Times text and diagram glyphs rendered correctly.

Passed: independent repeat preparation produced byte-identical 14 CSV tables and dataset.json. All six negative integrity tests passed, rejecting invalid native levels, discarded suppression flags, broken crosswalk targets, duplicate identities, PDF label contamination and invalid topic IDs. All paper prose and table cells matched PDF text after ignoring whitespace and page footers. Machine-readable evidence and PDF SHA-256 are in [dataset-verification.json](dataset-verification.json).

Checks are limited to research artifacts. No application, provider, database, browser, authorization or participant tests were run because those behaviors were unchanged. No model-quality, expert agreement, certification or career-outcome result is claimed.

## Integration order

Resolve source/mapping findings and comparison methodology first; review affected occupational knowledge/manual profile/comparison contracts second; implement and run applicable security/data-integrity checks third. Application publication uses the existing reviewed administrative workflow later. Independent feature and participant acceptance remains necessary. No feature implementation guide is added because this change prepares research data and documents rather than application behavior.

2026-11-03 change record: implemented the user-reviewed all-career data and paper preparation scope. Existing research proposal content was preserved apart from a companion link and scope note. No commits, pushes, database changes or deployment.
