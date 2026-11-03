# Can curated-v0.1 support Asgard's objectives?

Review date: 2026-11-03. Release: curated-v0.1. Status: agent data review completed; independent semantic and methodology acceptance pending.

## Conclusion

The release is a usable research foundation for occupational browsing, a source-qualified manual competency vocabulary and a bounded categorical comparison prototype. It does not yet establish individual skill adequacy, validated career-transition suitability or current Philippine technology requirements. More general dataset acquisition is not the immediate priority. The next work should turn selected existing evidence into reviewed, role-specific comparison content and address the gaps below.

This conclusion distinguishes data support from working software. No skill-comparison service, user assessment, participant evaluation or database publication was tested or approved here.

## Review scope and method

The user requested testing against the project objectives. The bounded review covers PM-F02 competency profiles, PM-F03 occupational knowledge and PM-F05 skill comparison, with implications for recommendations, career comparison and learning guidance. The three questions are current skill coverage/adequacy, career transitions and continued development. Existing architecture and application contracts remain unchanged.

Checks: rerun the existing source-fidelity validator and six negative integrity tests; join actual career mappings to roles, expectations, definitions and learning links; inspect per-career gaps and source contributions; examine four career-pair overlaps and actual Data Analyst/Frontend records; record what each result can and cannot support. No changes to curated CSV/JSON content were made. The review script writes a separate evidence report.

Reproduce from the checkout root using the same offline analysis Python environment documented in the [release README](../../data/post-mvp/releases/curated-v0.1/README.md):

```powershell
python scripts/research/validate_dataset.py --source-dir "<your-source-directory>"
python scripts/research/test_curated_dataset.py
python scripts/research/review_objective_support.py
```

The first command requires the unchanged supplied originals. Review joins and counts are recorded in [dataset-objective-evidence.json](dataset-objective-evidence.json), including the dataset package SHA-256. These checks assess available evidence; they are not a validated matching algorithm. Existing [preparation findings](dataset-review.md) and the [methodology paper](dataset-methodology.md) remain applicable.

## Findings, in priority order

### 1. Adequacy requires behavioral criteria and a compatible user-assessment method

The 628 local expectation rows provide role-to-label relationships and native PSF levels, with selected competency definitions. They do not provide a complete structured set of level-specific behavioral indicators or assessment tasks. NICS contributes an interpretation record, but no structured competency expectations; none of the eight TESDA standards contributes structured roles, competencies, tasks or expectations in this release. Downloaded and appraised sources must not be described as fully incorporated.

A user saying “I know data visualization” can be associated with a reviewed source concept. It cannot establish that the user performs that concept at PSF level 3. A roadmap topic marked Done likewise cannot establish occupational competence. Extract and review the relevant level-specific indicators from the existing frameworks, then define evidence questions/tasks and acceptable interpretation before making adequacy claims. Keep native PSF levels, O*NET IM/LV values, qualification levels and any user rubric distinct.

This blocks validated adequacy judgments, not reference browsing or showing reported experience beside reference expectations.

### 2. Role mappings and broad overlap cannot define a mandatory skill list

All 59 crosswalks remain proposed; no career has an accepted occupation mapping. Candidate source roles include broader and supplementary occupations. Unioning their expectations would add irrelevant requirements and collapse associate, practitioner and senior distinctions.

The audit found 120 source-qualified reference items common to every career's candidate evidence set. UI Designer and UX Designer share 366 items, including 236 technology examples and 109 knowledge/activity/essential/transferable descriptors; only 21 shared items are local functional labels. These are reference-set intersections, not measured transferability. The common O*NET occupation and generic descriptor coverage explain much of the apparent similarity. Raw item counts, Jaccard overlap and “percent matched” must not become readiness scores.

Review the primary role and career level for each comparison profile. Explicitly select which relationships are relevant, optional, contextual or unresolved. Broad source roles can remain visible as supporting material without becoming mandatory targets.

### 3. Coverage is uneven despite every career having records

Cybersecurity Analyst has local task context but **zero curated local competency expectations** because the adjacent source skill-map header is ambiguous. Penetration Tester has five conflicting same-label native-level groups. Frontend uses broader local software-engineering roles; there is no accepted Frontend-specific level target. Senior Data Scientist evidence cannot establish a senior ML Engineer target.

Resolve these bounded source/role questions before declaring all-career comparison coverage. An explicit source-supported gap is an acceptable research result; it is not a completed comparison profile.

### 4. Continued development is supported as a reference use, not current demand monitoring

The release has 907 technology-example identities, not 907 proficiency competencies. O*NET's 2,492 selected technology-example relationship rows have no per-row observation date in the expectation table. Another 628 local expectation rows have an explicitly unknown observation date. Dated O*NET ratings range from July 2017 to August 2026. A 31.0 package version does not make every observation current.

Nineteen of 20 source publication dates and all 20 download dates remain unknown in the register. Inspection date is not publication date. O*NET hot/in-demand flags concern its source context and do not measure Philippine employer requirements.

The data can explain a dated reference expectation and identify topics to investigate. It cannot establish what Philippine employers currently require, how demand changed or whether a tool has become obsolete. A later source-update comparison needs two preserved versions; a local market feature needs permitted, dated observations and coverage/freshness rules. Neither is supplied by this one release.

### 5. Learning associations are too sparse for comprehensive guidance

There is exactly one proposed partial topic association per career. These 12 links resolve to existing topic IDs and, in every case, to a competency present in that career's candidate expectation set. This is useful traceability, but insufficient remediation coverage. A comparison must be able to say “no reviewed learning link” instead of inventing a recommendation. Expand links for the selected pilot competencies and review what each topic actually teaches.

### 6. Missing definitions, flags and naming require explicit consumer rules

Eleven of 169 local labels lack a complete curated definition. Source-qualified identities prevent accidental merges, but only three competency crosswalks are proposed and none accepted. Identical names are not enough for equivalence: the software framework's Networking definition concerns business opportunity development, not computer networking.

There are 61 O*NET expectation rows with Recommend Suppress=Y and 172 with Not Relevant=Y. These flag categories can overlap. Blank flags are not explicit N. The data preserves them; the current validator does not implement feature rules for hiding, qualifying or displaying such observations. Review those rules before using rating rows as targets.

## Support for the three objectives

| Objective | What the data supports now | What remains necessary |
| --- | --- | --- |
| Understand current skill coverage | Source-defined concepts, role context, tasks and native expectations can support a reviewed categorical display beside user reports | Reviewed vocabulary and role selection; user evidence model; unknown versus no-experience handling; behavior/level evidence for adequacy |
| Explore a career change | Compare candidate source roles and inspect shared source-qualified concepts as possible discussion points | Reviewed cross-source equivalences; source-role/level selection; evidence of transferability and target-specific expectations; no overlap-based suitability score |
| Keep developing with the field | Browse dated reference expectations and technology examples; attach reviewed learning material | Broader topic coverage, version-to-version review and permitted current local observations for claims about changing employer requirements |

For PM-F03, the reference data is substantial enough for a bounded review/prototype. For PM-F02, it provides a candidate vocabulary, not user evidence or a validated assessment. For PM-F05, categorical comparison is a reasonable next design target after content review; numeric adequacy is unsupported.

Other features remain distinct: recommendations and career comparison need their own selection/evaluation rules; learning needs curriculum review; Discovery and official assessment need appropriate instrument evidence/licensing; PDF enrichment needs extraction/confirmation/privacy behavior; reflection needs user feedback and reassessment rules; the counselor needs grounded response and write-confirmation controls; Philippine market context needs separate observations. Dataset integrity passes none of those feature acceptance gates.

## All-career evidence audit

Counts below are unique source-qualified labels across each career's candidate roles, not requirements. Career rows overlap; column totals must not be added as independent dataset totals. Zero missing definitions does not imply full role coverage.

| Career | Local functional labels | Missing local definitions | Technology examples | Interpretation |
| --- | ---: | ---: | ---: | --- |
| Frontend Developer | 37 | 2 | 261 | Broader software roles; Frontend targets require selection |
| Data Analyst | 13 | 0 | 237 | Associate/practitioner local maps; useful initial pilot |
| UI Designer | 28 | 4 | 236 | Local levels retained; name variants and overlap need review |
| UX Designer | 24 | 2 | 236 | Separate local role evidence; shared O*NET role does not imply equivalence |
| Data Engineer | 31 | 1 | 536 | Local levels available; CI/CD definition gap |
| Machine Learning Engineer | 42 | 2 | 454 | ML role plus broader senior Data Scientist evidence |
| Network Engineer | 16 | 0 | 353 | Infrastructure references need network-specific selection |
| Cybersecurity Analyst | 0 | 0 | 245 | Local task context only; skill-map association withheld |
| Penetration Tester | 39 | 1 | 67 | Five conflicting level groups require resolution/withholding |
| Hardware Engineer | 21 | 1 | 112 | Circuit-design references; broader hardware boundary needs review |
| Embedded Systems Developer | 43 | 2 | 516 | Local role levels available; two definition gaps |
| DevOps Engineer | 47 | 1 | 515 | Platform/software/infrastructure references; select a coherent role boundary |

## Worked record checks

**Data Analyst:** SRC-16 PDF pages 37 and 38 associate Applications Development and Data Visualization and Storytelling with native level 3 for both Associate Data Analyst and Data Analyst. The visualization definition is preserved from PDF page 183. The data can retrieve and explain this expectation with provenance. It cannot distinguish a beginner who has watched a tutorial from someone who demonstrates the level's behaviors using a skill label alone.

**Frontend:** SRC-13 Associate Software Engineer associates Applications Development with level 3 on PDF page 54 right; Software Engineer associates it with level 4 on PDF page 56 left. Both carry User Interface (UI) Design at level 3, but that label has a definition gap in this release. This is evidence for keeping role levels separate and resolving the definition; it does not prove every Frontend developer needs the full Software Engineer profile.

**Transition:** Data Analyst and Data Engineer candidate sets share 307 source-qualified items, of which 12 are local functional labels. Data Visualization and Storytelling is among them. A reviewed interface could show it as common reference context, while retaining each role's native expectations. It cannot infer that a user's self-reported visualization skill transfers at the required level or that the remaining 52 Data Analyst reference items are irrelevant. Cross-source synonyms require reviewed links.

These are queries over real curated records, not participant results or executions of an application comparison engine. Hypothetical user inputs remain hypothetical: absent evidence must stay unassessed, an explicit no-experience report must remain distinct, a conflicting target must remain unresolved, and a changed source version requires a reviewed update rather than silently rewriting a user's history.

## Executed checks and limits

| Check executed on 2026-11-03 | Result |
| --- | --- |
| Original hashes for 20 inputs, ZIP CRC, selected O*NET row fidelity | Passed |
| CSV/JSON parity, unique identities, references, native values/flags, counts, existing topic IDs | Passed using existing validator |
| Six negative integrity cases | 6 passed; corrupted artifacts rejected |
| Expectation source agrees with role and competency source | Passed across 5,518 rows |
| Task occupation reference and source agreement | Passed across 246 rows |
| Candidate roles and expectation references for every career | Passed for 12 careers; does not prove completeness |
| Learning links belong to candidate career expectation sets | Passed for 12 links; does not prove educational suitability |
| Four career-pair intersections | Computed; descriptive evidence, no success threshold |

The 96 comparison-case records are eight scenario templates repeated across 12 careers. They are useful planning coverage, but contain no executed application behavior and do not yet provide concrete per-case user records, selected occupation/level IDs and exact expected output records. Before PM-I1-06 acceptance, convert a bounded set into such fixtures, including suppression, not-relevant, missing definitions, ambiguous mappings, duplicate observations and changed-version cases.

No application, security, database, browser, participant or independent expert tests were run: no corresponding behavior changed or was available to assess. Source fidelity and successful joins do not prove semantic correctness. The prior PDF transcription/rendering evidence was not repeated because no source selection or paper export changed. This review also found no basis to claim source/mapping publication approval.

## Recommended next work

1. Keep Data Analyst and Frontend as the bounded pilot while retaining the all-career research release. Choose the exact local role and level; record broader O*NET roles as supplementary references.
2. Resolve the pilot's missing definitions and review occupational relevance. Extract the selected competencies' level-specific behavioral indicators from the supplied originals, with exact page locators and visual verification. Expand NICS/TESDA only where their content fills an identified gap.
3. Review categorical user-evidence wording and explicit unknown/no-experience/conflicting-target behavior. Prepare concrete record-level fixtures; do not convert native scales into a common score.
4. Expand and review learning associations for those pilot competencies. Keep uncovered areas visible.
5. Review affected feature contracts and implement only after the applicable gates. Address all-career gaps in bounded follow-up curation; procure new material when existing sources genuinely cannot answer a requirement. Acquire a separate permitted local observation source if current-market claims remain an objective.

The release is ready for this focused content and methodology review. It is not ready for unqualified adequacy scoring or blanket publication of all candidate mappings.
