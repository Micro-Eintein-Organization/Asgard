# Development and Curation of an Occupational and Competency Dataset for Asgard: Sources, Processing, Feature Support and Limitations

Dataset preparation report | 2026-11-03 | Curated release v0.1 | Independent content and methodology review pending

## Abstract

This report documents the preparation of an occupational and competency reference dataset for Asgard, a career decision-support application. The preparation addresses three intended uses: understanding reported skill coverage, exploring a career transition, and identifying areas for continued development. Twenty supplied source files were appraised, comprising Philippine occupational classification, competency and qualification publications, and an O*NET 31.0 database archive. A purposive selection process retained evidence relevant to the application's 12 current technology careers while preserving source-specific definitions, career levels, interpretation material and uncertainty. The release organizes 41 source occupation or classification records, 1,185 typed competency and activity references, 5,518 occupational expectation or technology-example observations, and 246 task records. The competency-reference count includes 907 software examples and must not be interpreted as a count of independently assessed skills. Native records, proposed crosswalks, partial learning associations and curation decisions accompany CSV tables and a matching JSON package. Extraction and structural checks were completed; occupational equivalence, a shared proficiency methodology, independent expert acceptance, and application integration were not established. The principal methodological contribution is a traceable separation between source evidence, project interpretation and future user assessment. The resulting artifact is a reviewable research dataset, not a validated measure of competence or employment readiness.

Keywords: occupational information; dataset curation; competency evidence; Philippine skills frameworks; provenance; career decision support

## 1. Introduction

A career-support system needs a defensible account of what a role involves and what a person's evidence actually says. Recognizing a skill name in a profile does not establish the person's proficiency. Likewise, an occupational classification supplies a useful reference without proving that every employer expects the same tools or level of independence. Data preparation therefore affects the meaning of the eventual comparison, not just the convenience of storage.

Asgard already has a local evaluation application with career browsing, roadmaps, saved learning activity, Discovery and bounded AI suggestions. The proposed occupational-knowledge, competency-profile and skill-comparison features require more structured evidence than the catalog's text skill labels. This report describes the research-data work supporting those additions. It reports preparation artifacts and observed source problems; it does not report a deployed comparison service or participant outcomes.

The purpose of curation was to assess and select useful material from the supplied corpus, preserve its origin and meaning, and organize it for subsequent technical and content review. The source files were not concatenated into a single undifferentiated skill list. Instead, occupational descriptions, functional competency expectations, software examples, task observations and classification headings were retained as distinct kinds of information.

## 2. Project context and intended uses

The preparation covers Frontend Developer, UI Designer, UX Designer, Data Analyst, Data Engineer, Machine Learning Engineer, Cybersecurity Analyst, Penetration Tester, Hardware Engineer, Embedded Systems Developer, Network Engineer and DevOps Engineer. These are existing Asgard career identities. Preparing evidence for all 12 does not establish complete or equally strong coverage of every career.

The first intended journey is current skill coverage: a user records experience and inspects how it relates to a chosen role. The second is career transition: the user explores another role and considers related experience and unfamiliar expectations. The third is continued development: the user revisits reference information and learning opportunities as personal evidence or a source version changes. These are proposed uses of the dataset, rather than observed outcomes of the current application.

The existing consolidated research proposal describes staged feature implementation beginning with candidate pilot careers and a student evaluation. This companion report has a different unit of analysis: data preparation across the current catalog. It does not expand that study's population, approve all-career enriched comparison, or change the current adult eligibility boundary. A student task study and independent expert review remain separate activities.

## 3. Source materials and selection rationale

### 3.1 Supplied corpus and provenance

The corpus comprises 20 supplied files: nine Philippine Skills Framework publications, eight TESDA Training Regulations PDFs, one DICT Updated National ICT Competency Standards PDF, one PSOC workbook and one O*NET archive. The 18 PDFs contain 2,894 PDF pages; some PDF pages contain two printed pages. A source manifest records original filenames, byte sizes and SHA-256 hashes. Originals were read without alteration and remain outside the repository.

This is purposive source selection for a defined application scope, not an exhaustive systematic review. Sources were screened for relevant role descriptions, competency definitions, tasks, proficiency interpretation, local classification and reproducibility. The existing manifest identifies received copies; it does not establish that a copy is the latest publisher edition. Exact original download dates and retrieval URLs are unknown where not supplied. An inspection date was not substituted for either.

Table 1 summarizes the responsibilities assigned to source families. These are analytical roles in this research release, not a claim that one framework is authoritative for every Asgard competency.

| Source family | Material used or retained | Reason and limitation |
| --- | --- | --- |
| Philippine Skills Framework: Software Development and Security | Selected role maps, functional definitions and level interpretation | Local software, design, infrastructure, embedded and security context; broad roles and source conflicts require review |
| Philippine Skills Framework: Analytics and AI | Selected analyst, engineering and ML-related role maps and definitions | Local role and career-level distinctions; Data Scientist is not automatically equivalent to ML Engineer |
| Philippine Skills Framework: Electronics | Selected junior/senior circuit-design evidence and definitions | Useful engineering context; semiconductor design is narrower than generic hardware engineering |
| DICT Updated NICS | Framework interpretation page | Behavioral indicators and enabling knowledge support interpretation; its levels are not converted to PSF levels |
| PSA PSOC workbook | Five selected unit-group headings with cell locators | Philippine classification context; group membership does not establish proficiency |
| O*NET 31.0 archive | Eleven candidate occupations, selected evidence tables and interpretation dependencies | Structured supplementary US occupational evidence; not a Philippine vacancy census |
| Other six PSF publications and eight TESDA qualifications | Supporting corpus with page-level non-selection records | Retained for later appraisal; duplicate sectors, training qualifications or servicing roles were not substituted for the selected engineering careers |

TESDA's official PSF index identifies the available sector publications (Technical Education and Skills Development Authority [TESDA], n.d.-a). The Analytics and AI association also describes the framework's development as an effort to articulate roles and expected competencies (Analytics and Artificial Intelligence Association of the Philippines [AAP], n.d.). Neither an official hosting page nor a framework's existence proves a particular Asgard crosswalk.

### 3.2 Publication context and exclusions

Software Development and Security describes its multi-agency framework context and includes dated contributor messages. Analytics and AI describes a 2024 launch, and Electronics describes a March 2025 launch. These contextual dates are not used as inferred edition dates. The NICS cover was visually inspected because it contains no extractable text; it explicitly states March 2024, which is recorded as its publication month. Other unspecified bibliographic details remain review items.

The eight TESDA files were identified as Computer Systems Servicing NC II, Cyber Threat Monitoring NC I, Cyber Threat Mitigation NC II, Mobile Phones and Handheld Gadgets Servicing NC III, Programming (.NET Technology) NC III, Programming (Java) NC III, Programming (Oracle Database) NC III, and Visual Graphic Design NC III. They were retained as qualification-specific supporting evidence. TESDA describes its competency standards as units containing acceptable work-performance descriptors, packaged into qualifications (TESDA, n.d.-b). A qualification level such as NC III was not reinterpreted as level three of an individual skill.

ESCO was not supplied because the user reported the download unavailable. No ESCO records or fabricated identifiers occur in this release. This is an acquisition limitation, not a finding that ESCO is unsuitable. It does not prevent preparation of the available Philippine and O*NET evidence.

## 4. Data requirements and interpretation boundaries

The dataset needs careers and source occupations because application labels and official occupational categories differ in breadth. It needs competencies and definitions because similarly named skills can have different meanings. It needs expectations, tasks and career levels because relevance, performance context and seniority cannot be represented by one skill name. It also needs provenance and decisions so that a comparison's basis can be inspected and corrected.

Source-specific information is preserved. O*NET importance and level ratings have different meanings, ranges and anchors (National Center for O*NET Development, n.d.-b). NICS distinguishes Basic, Intermediate and Advanced through behavioral indicators and enabling knowledge (Department of Information and Communications Technology [DICT], 2024, PDF p. 6). The PSF functional descriptors address knowledge/abilities, autonomy/complexity and responsibility (PSF Software Development and Security, n.d., PDF p. 100, left; printed p. 196). None is automatically mapped to a universal 0-4 self-report scale.

The release contains no personal competency records. It provides occupational references against which future user-supplied evidence might be interpreted. Unknown experience, explicit no-experience, reported experience and independently assessed competence remain different states. Topic completion is learning activity, not a competence measurement.

## 5. Preparation methodology

### 5.1 Preservation, inspection and selection

The preparation first verified the original file hashes and cached extractable PDF text for screening. ZIP integrity and CSV readability were checked. The workbook was inspected in read-only mode. Selection rules were then recorded for occupations, PDF roles, definition paragraphs, classification headings and partial learning links. These rules are versioned alongside the dataset.

The O*NET occupation choices were proposed using the existing coverage matrix and reviewed role/task descriptions. All occupation-scoped records from selected tables were retained for the eleven candidate occupations; a separate skill-importance cutoff was not introduced. Four interpretation tables were retained in full. This prevents an arbitrary popularity threshold from silently determining the skill vocabulary. Sixteen of the archive's 45 CSV tables contributed records; the remaining 29 remain available in the untouched archive.

For the Philippine frameworks, 25 role references were selected across associate, practitioner, senior, lead, architect and manager labels where relevant evidence was available. Source-native career levels remain distinct. This is a bounded selection, not an assertion that every seniority path in every source was exhaustively transcribed. A Senior Data Scientist, for example, remains a related occupation rather than becoming a senior ML Engineer by renaming.

Figure 1 presents the preparation sequence. Review states accompany each stage; reaching the final box does not imply approval for application publication.

```text
Supplied originals + hashes
          |
          v
Source appraisal + career coverage screening
          |
          v
Occupation / role / definition selection
          |
          v
Extraction + visual verification + cleaning
          |
          v
Source-qualified records + proposed mappings
          |
          v
CSV release -> matching JSON -> validation
          |
          v
Review report + methodology paper
```

### 5.2 Extraction and cleaning

O*NET records were read as UTF-8 CSV. Selected source rows retain original fields in a native-record table, including dates, domain source, confidence information and suppression flags where present. Source row numbers are stored with archive-member names. Software examples remain technology examples; they are not rated proficiency claims.

PDF extraction required spatial boundaries. Whole-spread extraction initially joined task text from one printed page with a skill row on the other. The extraction rule was corrected to process each half of a double-page spread independently. Role continuations, such as Associate Software Engineer across PDF pages 54 and 55, were selected explicitly. Source regions were rendered and inspected to check role headings, level columns and continuation boundaries.

Whitespace was normalized. Repeated side labels such as “Skills and Competencies” were removed when they intruded into a row label. A wrapped “Continuous Integration and Continuous Deployment” label was rejoined. Native levels and ranges were retained. Cleaning changed extraction representation, not the substantive level value. Definition paragraphs were selected independently from role maps, and their source page and side were retained. The 158 included Philippine-framework definition paragraphs were visually inspected; 11 remaining native label variants or missing exact-heading matches remain definition gaps.

PSOC selection used the current unit-group code column. During preparation, a broad scan of numeric cells could mistake a historical cross-reference code for a current code. The rule was corrected to require the leading current-code value. The final selected 2152 heading is Electronics Engineers, rather than the adjacent Electrical Engineers group. Workbook cell ranges identify the selected headings.

### 5.3 Organization, identity and mapping

Source-qualified deterministic identities preserve the distinction between records from different frameworks. O*NET elements, source occupation codes and original labels remain available. Similar labels were not automatically merged. Three proposed competency relationships illustrate possible connections between source definitions: Data Analytics across the two PSFs, Software Testing across those PSFs, and Programming and Coding in the software PSF with O*NET Programming. These are proposed relationships, not accepted equivalence or scale conversions.

Definitions also expose misleading similarities. “Networking” in the software PSF describes business opportunity development (PDF p. 180, left; printed p. 356). It must not be treated as computer networking merely because the same word appears in a technology career. This finding demonstrates why definition review is necessary before matching or deduplication.

Exact repeated O*NET rows were deduplicated within a table; the selection record reconciles retained and non-retained counts. Repeated Philippine-framework expectations with different values were retained and flagged. Source conflicts are evidence for review, not extraction errors to be silently repaired. No voting, averaging or maximum-level rule selected a supposedly correct value.

### 5.4 Reproducible packaging

CSV tables are the structured source of the release. The JSON package is generated from them and preserves their values as strings, including source-native level ranges and flags. The preparation script accepts a source directory, verifies hashes and derives existing Asgard content identities through the repository's current converter. It performs no database writes or provider calls.

Preparation rules, source locators, decisions and transformation records accompany the release. A person with authorized copies of the same sources can reconstruct it using the supplied instructions. Publisher availability, missing retrieval dates and unresolved reuse details are recorded separately from processing reproducibility. O*NET attribution follows its database license, which distinguishes database content from separately licensed career-exploration tools (National Center for O*NET Development, n.d.-a).

## 6. Dataset organization and coverage

Table 2 summarizes the release. Counts describe different units and must not be added together as if they were independent competencies.

| Component | Records | Interpretation |
| --- | --- | --- |
| Source register | 20 | Received copies and provenance limitations |
| Asgard careers | 12 | Existing catalog identities and coverage conclusions |
| Source occupations/classifications | 41 | 11 O*NET occupations, 25 local role references and 5 PSOC headings |
| Typed competency/activity references | 1,185 | Includes software examples, knowledge, work activities and local functional labels |
| Occupational observations/expectations | 5,518 | Includes scale-specific observations and software examples, not 5,518 independent requirements |
| Tasks | 246 | 238 O*NET tasks and 8 explicitly marked project paraphrases of local role tasks |
| Proposed crosswalks | 59 | Career-to-source references and 3 competency relationships |
| Proposed learning associations | 12 | One partial learning link per career; not complete curricular coverage |
| Proposed comparison cases | 96 | Eight scenarios for each career; not executed application tests |

Of the 1,185 typed references, 169 are source-qualified Philippine functional competency labels, 907 are software examples, 33 are knowledge descriptors, 41 are work activities, 25 are transferable skills and 10 are essential skills. The distinction prevents a software product example from being represented as a formally assessed capability. Aliases are left empty where no defensible alias was selected; similar spelling alone did not create one.

Table 3 summarizes coverage rather than assigning a suitability score.

| Asgard career | Selected reference coverage | Principal qualification |
| --- | --- | --- |
| Frontend Developer | Web occupations; associate and practitioner software roles | Local software roles are broader than Frontend |
| UI Designer | Associate, practitioner and lead UI maps; interface occupation | Shared interface occupation does not collapse UI and UX |
| UX Designer | Associate and practitioner UX maps; interface occupation | Research and seniority coverage are not exhaustive |
| Data Analyst | Associate/practitioner local maps; BI and Data Science references | Related O*NET occupations remain alternatives |
| Data Engineer | Associate, practitioner and senior local maps; database/software references | Database/software categories only partially align |
| Machine Learning Engineer | ML role and related senior Data Scientist; supplementary occupations | No automatic senior ML equivalence |
| Cybersecurity Analyst | Local analyst task context and O*NET security profile | Local skill-level association withheld due ambiguous spread header |
| Penetration Tester | Analyst/manager skill maps and penetration occupation | Conflicting repeated native levels remain flagged |
| Hardware Engineer | Junior/senior circuit-design maps and hardware occupation | Semiconductor-specific local scope |
| Embedded Systems Developer | Associate, engineer and architect maps; software/hardware references | Broad supplementary occupations require interpretation |
| Network Engineer | Infrastructure roles; architecture and administration references | Operations and architecture are distinct functions |
| DevOps Engineer | Platform/infrastructure roles; software and administration references | No accepted unique DevOps occupational equivalence |

## 7. Feature support and worked examples

### 7.1 What the dataset contributes

Table 4 connects data preparation to the ten planned features. A data dependency is not an implementation or approval claim.

| Planned feature | Contribution from this release | Work still required |
| --- | --- | --- |
| Discovery and assessment | Occupational vocabulary and context for explained exploration | Reviewed questions; official instrument access, scoring and mappings remain separate |
| Competency profile | Traceable labels, definitions and evidence descriptions | User-input design, ownership, retention and self-report interpretation |
| Occupational knowledge | Source occupations, expectations, tasks and classification context | Accepted crosswalks and reviewed publication contracts |
| Recommendations | Bounded candidate evidence and explanation references | Retrieval, eligible context, invalidation and model-quality evaluation |
| Skill comparison | Source-specific expectations, definitions and uncertainty | A reviewed comparison method and consistent user-evidence lifecycle |
| Career comparison | Distinct occupational references and scope differences | Comparison criteria, saved alternatives and interface comprehension |
| Learning guidance | Twelve proposed partial topic associations | Broader competency coverage and independent curriculum review |
| Reflection | Vocabulary for explicit reassessment | Reflection questions, consent/retention and downstream-use decisions |
| AI counselor | Potential evidence references for authorized read-only services | Tool architecture, authorization, grounding and adversarial evaluation |
| Philippine market context | Local classification and occupational terminology | Permitted current vacancy observations, geography, freshness and coverage |

PDF enrichment would use the competency vocabulary to propose candidate evidence. This release does not process personal documents, approve automatic confirmation or establish the privacy/removal lifecycle. Similarly, source expectations can inform a competency profile without assessing a user.

### 7.2 Data Analyst example

The Analytics and AI Data Analyst map at PDF page 38 (printed page 36) associates Data Analytics with native level 2 and Data Visualization and Storytelling with native level 3. The Associate Data Analyst at PDF page 37 is a separate role. The definition of Data Analytics at PDF page 165 (printed page 163) describes the use of analytical techniques to derive business information. These source facts are retained with their locations (PSF Analytics and Artificial Intelligence, n.d.).

A transformation example begins with the row “Data Analytics Level 2.” The curated competency keeps the source label and definition under a source-qualified identity; a separate expectation links that competency to the Data Analyst source role with level “2.” A proposed crosswalk connects the source role to the existing Asgard career. No user score is created, and level 2 is not converted to 50%, “beginner” or a certification result.

For a future user with no Data Analytics record, the proposed comparison case requires “unassessed,” rather than “cannot analyze data.” A user who reports analysis experience supplies additional evidence, but an adequacy conclusion still depends on a reviewed assessment method. The data establishes a reference for discussion; it does not make that assessment automatically.

### 7.3 Frontend example

The local Associate Software Engineer map spans PDF page 54 and the left half of page 55 (printed pages 104-106). It includes Applications Development at level 3 and an Applications Support and Enhancement range of 1-2. A separate Software Engineer reference retains practitioner-level expectations. The source role also discusses database and operational work, so the release does not label all of its expectations mandatory for Frontend development (PSF Software Development and Security, n.d.).

O*NET Web Developers and Web and Digital Interface Designers provide supplementary references. They remain separate occupations. A matching method would need to distinguish Frontend implementation from interface design and broader software engineering. The proposed learning link from Programming to the current HTML topic supports a limited aspect of practice; it does not cover the entire occupational descriptor or prove competence after completion.

### 7.4 Illustrative career transition and source update

Consider a hypothetical user exploring a move from Frontend work toward UX. The dataset allows a future system to inspect definitions and task contexts across the two careers. It does not authorize treating all similarly named design or testing competencies as equivalent, nor does browsing UX change learning focus. This is a proposed reference scenario, not a participant observation.

If a later source release changes a role map or technology example, the intended process is to retain the earlier source version, identify the changed evidence and reconsider dependent mappings. A source update would not establish an immediate nationwide change in employer demand. These distinctions are represented in proposed comparison cases for every career.

## 8. Validation and preparation results

### 8.1 Completed artifact checks

The release validator checks CSV/JSON agreement, unique identities, references, occupation coverage, native field preservation, source hashes, selected O*NET row parity and existing topic identities. It also reconciles retained and non-retained selection counts. A repeated build is compared through artifact hashes; malformed or inconsistent records must fail validation instead of being silently omitted.

Source checking covers all 20 supplied hashes and ZIP CRC. O*NET values retain scale IDs, source dates, suppression flags and not-relevant flags. These are not merely descriptive metadata: disregarding them could make a comparison falsely precise. PDF visual checks cover included role-map regions, definition paragraphs and interpretation pages. They are agent extraction checks, not independent expert review.

Selection accounting uses separate units. There are 45 O*NET table decisions, 2,894 PDF-page decisions and 10 workbook-sheet decisions. A PDF-page decision means selected evidence was retained from that page, not that every item on it was imported. Workbook screening counts worksheet rows, not competencies. The release retains 16 O*NET tables wholly or partially, excludes 29 from the curated selection, and preserves the original archive for future work.

### 8.2 Observed problems and unresolved findings

The penetration-testing analyst map at software PDF page 70 (left, printed page 136) contains repeated labels with conflicting levels. Five same-label conflict groups are retained in the validation report. For example, Security Threat Research appears at levels 4 and 6. The dataset does not decide which is intended. Some additional differently spelled labels may also warrant review; spelling normalization was not used to conceal that uncertainty.

The Security Analyst spread has an ambiguous adjacent role heading. Its local task context was retained, but levels from the adjacent skill map were withheld rather than assigned to the analyst. O*NET security evidence remains available with its geographic limitation. Eleven selected Philippine-framework labels lack a matched complete definition paragraph in this release; they remain visible gaps rather than receiving generated definitions.

Structural validation does not establish that source occupations are equivalent to Asgard careers. Nor does it prove that every retained technology example is current, relevant to every employer, or appropriate as a user assessment item. The 96 cases describe intended categorical behavior; no comparison application or participant experiment was executed through this preparation task.

## 9. Limitations and responsible interpretation

This is a bounded, versioned research artifact. Philippine frameworks improve local contextual relevance but may describe broad roles, industry-specific practice or particular career levels. O*NET provides US occupational evidence. PSOC is a classification system. Combining them does not establish national Philippine labor-market validity or a universal hiring threshold (Philippine Statistics Authority, n.d.; National Center for O*NET Development, n.d.-b).

Some metadata remain unknown. A contributor message or launch date is not automatically a publication edition date. Website availability and public download access do not settle all redistribution requirements. The source manifest and attribution notes support further review before public or application publication.

Competency references are not assessment instruments. Future user self-report will be subject to interpretation, recall and response bias. Occupational levels cannot be subtracted from an unrelated self-report scale. The release deliberately supports categorical evidence review before any defensible adequacy claim. It does not certify users, predict employment success or translate roadmap completion into mastery.

Learning coverage is intentionally limited. There is one proposed partial association per career, not a complete remediation curriculum. Further subject-matter review is needed to decide whether a topic genuinely supports a competency and what it leaves uncovered. Source and user changes would also require versioned invalidation rules in the future application.

The wider research paper should report this preparation as an artifact-development activity. It should separately report any later expert review, technical feature evaluation, student study or model comparison. Automated validity of identifiers is evidence about the dataset's structure, not evidence of psychological outcomes or career decision quality.

## 10. Conclusion

Asgard's curated release organizes supplied occupational evidence into traceable source records, definitions, role expectations and proposed relationships for all 12 existing careers. The preparation preserved source distinctions and recorded both useful coverage and unresolved problems. Its value is a reproducible basis for review and subsequent implementation, rather than a claim that matching skill words establishes readiness.

The next work is independent appraisal of occupational mappings, unresolved definitions and conflicting expectations; selection of a compatible user-evidence and comparison methodology; and review of the contracts required for occupational knowledge, manual profiles and categorical comparisons. Application publication follows those reviews. Market observations, official assessment instruments and personal-document processing remain separate additions.

## References

Analytics and Artificial Intelligence Association of the Philippines. (n.d.). Philippine Skills Framework for Analytics & AI: Framework development account. https://www.aap.ph/philippine-skills-framework-for-analytics-and-ai

Department of Information and Communications Technology. (2024, March). Updated National ICT Competency Standards. Supplied publication, source SRC-11; date verified on its cover. https://cms-cdn.e.gov.ph/DICT/pdf/DICT_Updated%20NICS.pdf

National Center for O*NET Development. (n.d.-a). O*NET 31.0 Database content license. https://www.onetcenter.org/license_db.html

National Center for O*NET Development. (n.d.-b). O*NET OnLine help: Scales, ratings, and standardized scores. https://www.onetonline.org/help/online/scales

National Center for O*NET Development. (n.d.-c). O*NET 31.0 Database. Supplied archive, source SRC-10. https://www.onetcenter.org/database.html

Philippine Skills Framework for Analytics and Artificial Intelligence. (n.d.). Supplied framework, source SRC-16; DICT/AAP development context is described in its introductory material. Official hosting index: https://www.tesda.gov.ph/About/TESDA/27898

Philippine Skills Framework for Electronics. (n.d.). Supplied framework, source SRC-19; multi-agency development context is described in its introductory material. Official hosting index: https://www.tesda.gov.ph/About/TESDA/27898

Philippine Skills Framework for Software Development and Security. (n.d.). Supplied framework, source SRC-13; DICT development context is described in its introductory material. Official hosting index: https://www.tesda.gov.ph/About/TESDA/27898

Philippine Statistics Authority. (n.d.). 2022 updates to the 2012 Philippine Standard Occupational Classification. Supplied workbook, source SRC-01. https://psa.gov.ph/classification/psoc

Technical Education and Skills Development Authority. (n.d.-a). Philippine Skills Framework: Publication index. https://www.tesda.gov.ph/About/TESDA/27898

Technical Education and Skills Development Authority. (n.d.-b). Competency standards development. https://www.tesda.gov.ph/About/TESDA/85

Publication dates and complete institutional credits for supplied framework editions remain a bibliographic review item. Title-first entries avoid assigning sole authorship to the website hosting a collaborative publication. Page locators in this report refer to the supplied copies identified by SHA-256, not an assumed interchangeable online edition.

## Appendix A. Artifact and evidence guide

The dataset is in `data/post-mvp/releases/curated-v0.1/` from the checkout root. `sources.csv` and the earlier source manifest identify received copies. `native_records.csv` preserves selected source rows and PDF extraction lines. `decisions.csv` records selected and non-selected units. `transformations.csv` identifies the curation-rule version, and `validation.json` records checks and unresolved native conflicts. `comparison_cases.csv` contains proposed reference scenarios.

The editable preparation rules are in `data/post-mvp/curation-rules.json`. The preparation and validation scripts reside in `scripts/research/`. Operational instructions and interpretation limits accompany the release README. These research artifacts are separate from versioned application SQL, generated APIs and the protected publication workflow.

## Appendix B. Review questions before application use

Reviewers should determine whether each proposed occupational mapping has sufficient task and seniority support; whether the conflicting source levels can be resolved by authoritative clarification; whether unmatched definition labels are spelling variants or genuinely different concepts; and whether a proposed learning association supports the intended development need. They should also select a comparison method compatible with the user evidence to be collected.

These questions identify remaining decisions. This report does not assign completed review status to a person, invent a reviewer agreement rate, or infer permission to import the release into the application database.
