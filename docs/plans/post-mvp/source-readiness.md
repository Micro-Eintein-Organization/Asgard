# Received datasets: readiness and next implementation plan

Created: 2026-11-03. Last updated: 2026-11-03.
Approval: user authorized inspection, planning and supporting files. Feature implementation, source mappings, proficiency methodology and publication require their applicable reviews.
Implementation: source inventory and research fixtures prepared; no application behavior changed.
Verification: structural results recorded below; independent content acceptance pending.
References: PM-DOC-01 through PM-DOC-04; initial evidence preparation for PM-W01/PM-W02/PM-W12 and PM-F02/PM-F03/PM-F05. Existing PM-I1 criteria remain proposed.

## What is available

Later preparation update, 2026-11-03: the user authorized expanding from the initial two-career fixtures to [curated evidence for all 12 careers](../../../data/post-mvp/releases/curated-v0.1/README.md), with a [methodology paper](../../research/dataset-methodology.md) and [review findings](../../research/dataset-review.md). The inventory and initial pilot statements below preserve their inspection-stage scope; current curation evidence and next review actions belong to those new artifacts. No application acceptance or mapping approval is inferred.

The [source register](evidence/2026-11-03/source-register.md) identifies all 20 supplied files, including eight generically named TESDA qualifications. The [manifest](evidence/2026-11-03/source-manifest.json) records their original filenames, byte sizes and SHA-256 identities. Original files remain unchanged in the user's download directory; no raw PDFs, ZIP or workbook were copied into the repository.

The PSF Analytics and AI document contains a Data Analyst role at PDF page 38 (printed page 36), with tasks and functional skill levels. Its Associate Data Analyst role at PDF page 37 provides a useful seniority contrast. Software Development and Security has an Associate Software Engineer role at PDF page 54 (printed pages 104-105); it is broader than Frontend Developer and is not an accepted substitute. NICS PDF page 6 describes its own three-level interpretation and behavioral indicators. These pages were visually inspected, not merely searched for matching titles.

PSOC is local occupation classification evidence. TESDA qualifications describe qualification-specific performance/assessment expectations; NC II/III must not become a user's per-skill level. Programming qualifications for Java, .NET and Oracle are supporting historical/qualification references, not evidence of today's entire technology market. Other sectors were inventoried, not added to Asgard's product scope.

ESCO was not supplied; the user reports the dataset unavailable. Continue with the received sources and keep the future ESCO crosswalk optional. This inspection does not diagnose website availability or invent ESCO identifiers.

## Proposed source responsibilities

| Responsibility | Candidate evidence | Boundary |
| --- | --- | --- |
| Philippine role descriptions and expectations | Relevant PSF sector publications | Review role, seniority and competency scope separately |
| Task/behavior descriptions for user evidence | NICS; applicable PSF/TESDA competency descriptions | Source scales remain separate; no automatic self-report conversion |
| Structured occupational comparison | O*NET 31.0 records and metadata | US occupational evidence, not Philippine employer demand |
| Local classification | PSOC workbook | Group/classification codes do not certify skill proficiency |
| Current technology requirements | Versioned software examples and later permitted local observations | No live-demand or universal employer claims from these downloads |

This arrangement is a proposal for review. No source has been appointed sole authority over all competencies. Do not collapse similarly named competencies, qualification levels or source identifiers before reviewing their definitions.

## Work to accomplish while MVP work continues

1. **Complete provenance and source maintenance review.** Use the manifest to request missing exact retrieval URLs, download dates, publication/version details and source-specific reuse conditions. Unknown dates stay null; inspection date is not publication or download date. Keep sources with unresolved redistribution terms outside committed application content. The official [PSF index](https://www.tesda.gov.ph/About/TESDA/27898), [NICS publication](https://cms-cdn.e.gov.ph/DICT/pdf/DICT_Updated%20NICS.pdf), [PSOC page](https://psa.gov.ph/classification/psoc) and [O*NET database license](https://www.onetcenter.org/license_db.html) are starting references.
2. **Review the candidate coverage matrix.** The [12-career matrix](evidence/2026-11-03/career-coverage-candidates.csv) contains valid O*NET IDs but unaccepted relationships. Check actual tasks, role breadth and seniority; record accepted, rejected, partial or unresolved findings with evidence. UI and UX must not become interchangeable because both share a broad source occupation. Local PDF locators still need expansion for the ten non-pilot careers.
3. **Complete the two-career evidence pack.** Begin with the [local pilot locators](evidence/2026-11-03/pilot-local-evidence.csv) and [O*NET extract](evidence/2026-11-03/onet-pilot/README.md). The local CSV is a visually checked sample, not the complete competency graph. Extract complete selected role/competency definitions with PDF/printed-page references, source-native levels, rationale and missing coverage. Manually verify table boundaries, especially two-page spreads. Do not merge alternative O*NET occupations into an artificial mandatory profile.
4. **Define the comparison interpretation with reviewers.** Test: understand my current skill coverage; explore a career transition; revisit expectations after a source update. Use task/independence/recency/evidence descriptions to propose user inputs. Keep reported versus assessed evidence distinct. Begin categorically; an adequacy conclusion requires compatible occupational targets and a reviewed assessment method, not matching a skill word or rescaling O*NET/PSF/NICS levels.
5. **Review pilot skill-to-topic links.** Propose exact existing career/roadmap/topic IDs and why a topic supports a competency. Mark missing or partial coverage. A link never selects learning focus, changes branches or completes a topic. Current curricula still need their independent review.
6. **Submit the bounded contracts/implementation plan.** Only after evidence review, finalize the occupational knowledge, manual profile and comparison interfaces through architecture review. Use the [integration plan](../../post-mvp-first-implementation.md) and owning feature plans; code follows those reviews. Preserve existing catalog IDs, generated-client authority, ownership, revision guards and all progress invariants.

Review output is evidence, not a named-person assignment. Product/rubric, data/content and architecture review remain separate. Counselors, PDF activation, official assessments, market collection and Discovery are not prerequisites for this manual pilot. No migrations, database imports, dependency changes, services or Git publication belong to this preparation task.

## Proposed review cases and acceptance

The [ten comparison cases](evidence/2026-11-03/comparison-review-cases.csv) cover unknown versus explicit no-experience, unsupported cross-scale conversion, source uncertainty, broad role mappings, removal, missing topic coverage, career transitions and source updates. They are review inputs, not passed application tests. PM-I1 definitions remain in the owning feature plans and are not replaced by these case IDs.

Evidence-pack readiness requires reproducible inputs, source-native definitions/levels, reviewed role mappings, reviewed expected comparisons, source-version/removal effects and explicit limitations. Numeric readiness, certification, automatic skill inference from topic completion and live Philippine market coverage are outside current acceptance. A defensible outcome may be that a source does not support an adequacy claim.

## Verification and limits

Recorded [structural results](evidence/2026-11-03/inspection-results.json): 20 unique source hashes; 18 PDFs / 2,894 PDF pages; one workbook with ten worksheets; ZIP CRC passed; 45 O*NET CSV tables parsed without malformed field counts. All essential-skills, transferable-skills, knowledge and work-activities rows reference existing occupation, scale and content-element IDs. Other relationship tables and every PDF cell have not been semantically validated. Three pilot/level pages and two cover pages were visually checked.

The pilot has four candidate O*NET occupation records across two Asgard career investigations. Filtered records retain source fields, uncertainty/suppression flags and dates; interpretation dependencies accompany them. [Extraction instructions and attribution](evidence/2026-11-03/onet-pilot/README.md) describe the exact selection and reserialization.

Application/security/browser tests were not run because this task changes research/planning artifacts only. Human data/content review, full local crosswalks, independent source freshness/rights review and source-specific proficiency methodology remain pending. The raw file hashes identify supplied copies; no publisher checksum comparison is claimed. Teammates need the same authorized originals or reproducible downloads for reinspection.

Artifact verification passed: all 20 original hashes still match; all 12 extracted CSVs reproduce their source selection exactly, including retained interpretation tables; local Markdown links/anchors and whitespace were checked. These are artifact checks, not feature acceptance.

2026-11-03 change record: user supplied the received source files and authorized preparation/planning. This record and linked evidence update acquisition status without promoting deferred feature implementation. No feature implementation guide is required because no feature behavior changed.
