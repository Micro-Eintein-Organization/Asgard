# Shared post-MVP dataset acquisition plan

Created: 2026-11-03. Last updated: 2026-11-03.
Approval: user authorized source inspection, all-12-career curation and a methodology paper; mappings, comparison methodology, contracts and publication require their applicable reviews.
Implementation: [curated-v0.1 research release](../../../data/post-mvp/releases/curated-v0.1/README.md) prepared; no application import or behavior change.
Verification: structural inspection recorded in the [received-source plan](source-readiness.md); mappings and dataset acceptance remain pending.
References: PM-F03, PM-W01, PM-W02, PM-W12; FUT-01/FUT-07.

## Evidence requirements

Current preparation scope, 2026-11-03: the user expanded the initial two-career preparation to all 12 careers while retaining source-native career levels and explicit gaps. The [methodology paper](../../research/dataset-methodology.md) explains actual selection, extraction, exclusions, transformations and feature uses; the [review report](../../research/dataset-review.md) records checks and pending decisions. This supersedes the two-career preparation boundary only. Implementation/study scope and all feature acceptance gates remain separate.

Current acquisition evidence: [source readiness and next steps](source-readiness.md), [20-file register](evidence/2026-11-03/source-register.md), [12-career candidate matrix](evidence/2026-11-03/career-coverage-candidates.csv) and [O*NET pilot selection](evidence/2026-11-03/onet-pilot/README.md). Philippine Skills Framework, DICT NICS, TESDA qualifications and PSOC now join O*NET as inspected candidate evidence. ESCO was not supplied; the user reports it unavailable. Its absence does not block independent pilot preparation. Source receipt and structural inspection do not constitute mapping, methodology or publication approval.

The [feature plans](../../post-mvp-roadmap.md#feature-map) own user outcomes. Occupational knowledge, skill profiles, comparisons and enriched recommendations need versioned skill identities and occupation relationships. Learning guidance additionally needs reviewed topic associations. Official interest assessment needs instrument/scoring/mapping evidence. Market context needs separately permitted local observations. Reflection and informal Discovery can start with authored content and comprehension review.

Current authored curricula and checked resource URLs do not constitute an occupational taxonomy or validated proficiency targets. Existing [content publication](../../content-authoring.md) remains authoritative for current releases.

## Acquisition and review sequence

1. Record feature-specific evidence needs and expected claims before choosing a source.
2. Inspect the Philippine Skills Framework, DICT NICS, applicable TESDA qualifications, PSOC and O*NET documentation and actual supplied files. Evaluate ESCO when available. Record available identifiers, languages, relationships, scales, missing fields, access conditions, attribution and geography. Choose source coverage from inspected evidence; do not infer fields from source names. Local framework levels, qualification levels and O*NET scales remain distinct.
3. Assess all 12 current careers in a coverage matrix: existing career identity, candidate source/version/occupation IDs, rationale, ambiguous or one-to-many matches, supported capabilities, missing evidence and review status. Candidate mapping is not acceptance.
4. Prepare bounded evidence for all 12 current careers under the expanded user-reviewed scope. Data Analyst and Frontend remain worked examples. Preserve failed, partial or unresolved mappings as findings for review; do not silently substitute another occupation or force title equivalence. Source-native career levels remain distinct. Full upstream archives remain original evidence, without making full application ingestion a prerequisite.
5. Submit selected relationships, scale interpretation, mappings, coverage limitations and expected categorical comparisons for data/content review. Define evaluation cases with PM-W12 before dependent coding.
6. Finalize dependent schemas/APIs after evidence review and architecture review. Implement repeat-safe additive ingestion and publish only through the separately reviewed administrative release path. Acquisition does not grant publication approval.

W02 source inspection precedes final W01 contracts; W02 application publication follows them. Do not invent migrations or publish into the retained local database during acquisition.

## Pilot artifacts and exit criteria

Maintain a source manifest with official retrieval URL, exact version, retrieval date, checksum, format/language, reuse terms/attribution and any redistribution limits. Preserve external identifiers separately from internal IDs and document transformations. Record raw-file locations or reproducible retrieval instructions; do not commit restricted files or personal data.

Provide the 12-career coverage matrix, selected two-career records, relationship/mapping rationales, unresolved cases, topic-coverage review and expected comparison cases. Each review record must separate pending findings from genuine acceptance.

Exit requires reproducible source selection, resolvable references, duplicate/conflict checks, explicit missing/ambiguous mappings, reviewed comparison expectations and recorded data-review evidence. A failed pilot blocks dependent claims, not independent feature planning. Production source choice and record counts remain review outcomes, not assumptions.

ESCO relations join via identifiers; preserve their classifications rather than inventing targets. See [official relationship guidance](https://esco.ec.europa.eu/en/about-esco/faq) and [downloads](https://esco.ec.europa.eu/en/use-esco/download). O*NET occupational ratings have scale-specific meanings and anchors; do not directly convert them to the proposed 0-4 self-report scale. See [scale definitions](https://www.onetonline.org/help/online/scales) and [database documentation](https://www.onetcenter.org/database.html). Recheck terms and versions during actual acquisition.

Use categorical comparisons initially. Unknown information, explicit no-experience self-report and unavailable occupational targets remain distinct. Neither source establishes Philippine labor-market validity by itself.

## Separate gates and next action

Official assessments require their own access/scoring/mapping review under PM-F01. Philippine observations require their own permission, collection and freshness review under PM-F10. PDF evidence requires the PM-F02 privacy/removal decisions. None is a prerequisite for the manual pilot.

Next action: review the [curated release findings](../../research/dataset-review.md#findings-requiring-human-review), including provenance gaps, proposed mappings, conflicting levels and comparison methodology. The earlier [received-source work plan](source-readiness.md) remains an inspection-stage record. No mappings or proficiency methodology have been accepted. Follow [PM-W12](../../post-mvp-roadmap.md#pm-w12-evaluation-and-research-record), [architecture](../../architecture.md) and [security](../../security-and-operations.md) for downstream work.
