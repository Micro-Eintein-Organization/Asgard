# Roadmap technology evidence

Created/updated: 2026-11-20. Task owner/proposed implementer: Codex.
Product owner selected technology mentions as evidence in the current chat.
Required technical reviewer: @YakisobaNissin, per CODEOWNERS.
Status: owner approved the plan/table with "implement, make sure it does not break
other features again" on 2026-11-20. Implemented locally; final human review and
hosted/browser acceptance pending.
Requirements: REQ-11, F-002, RES-01, SKILL-01/02.
Authority: [skill specification](../specs/competency-comparison.md#technology-mentions-as-roadmap-evidence-2026-11-20),
[architecture](../architecture.md), [shared contracts](../development.md#shared-contracts-and-handoff).

## Scope and proposed relationships

Add deterministic, explicit technology evidence for existing published roadmap
skills. Initial bounded relationships follow the owner's pandas/MySQL examples
and the SQL/Python/pandas skills visible in the reported resume:

| Positive resume technology | Task labels eligible for related evidence |
| --- | --- |
| pandas | Pandas loading and typing; Python data science stack (NumPy, pandas) |
| Python | Python notebooks setup; Terminal Git and Python setup; Python transformations; Python notebooks and environments; Numerical Python basics; Python data science stack (NumPy, pandas) |
| SQL, MySQL, PostgreSQL | SQL filtering and sorting; SQL joins; SQL foundations; Relational database schemas and SQL queries; Advanced SQL queries and window functions; Relational data modeling and SQL |
| PostgreSQL | PostgreSQL tables and indexes |

Technology mentions support the listed tasks as background evidence only, including
when a task names multiple technologies. Do not change canonical identities,
aliases or learning completion. Do not infer unsupported relationships for other
tasks. The table was approved with the implementation instruction above;
final review of the implemented source remains pending.

## Implementation plan

1. Add one small internal technology relationship table/helper in the owning
   skill-matching module. Carry applicable technology terms with learning-path
   benchmark objects (internal dataclass only), leaving job-sample comparisons
   unchanged. Match positive skill evidence through the existing phrase/negation
   rules; keep exact original passages. Do not use an LLM for these relationships.
2. Count the supporting term once per canonical roadmap skill through existing
   resume evidence fields, without creating manual reports, ratings or progress.
   Use existing matched-phrase provenance; no public DTO/schema changes planned.
3. Reuse these connections in Discovery's selection and recommendation
   explanations so displayed evidence agrees with support counts. Preserve active
   document/analysis/revision ownership checks. Treat an absent mapping as unknown.
   Do not backfill or silently rewrite immutable completed recommendation runs.
4. Advance the affected deterministic recommendation strategy version so earlier
   runs with incomplete enrichment are shown as old and new requests use the new
   implementation. Preserve saved answers and ordinary GETs without provider calls.
5. If the existing UI does not make the supporting technology clear, use the
   existing exact matched-phrase field to label it as technology evidence with the
   original passage. Follow the design system before any frontend edit. Preserve
   the single evidence count; no proficiency or task-completion wording.
6. Update the competency-comparison and Discovery feature guides with source,
   evidence and exact manual steps. Add focused tests for pandas/MySQL/Python,
   task boundaries, negative/aspirational claims, deduplication, no ratings/writes,
   unchanged benchmark counts, and Discovery selection/explanation provenance.
   Run those checks, existing relevant matcher/evidence/Discovery cases and scoped
   Ruff; use TypeScript/relevant frontend tests if the UI changes. No new harness.

Affected modules: `backend/app/modules/skill_matching/{matcher,sources,service}.py`,
one internal relationship helper; `backend/app/modules/discovery/experience.py`;
`backend/app/modules/recommendations/{resume_connections,service}.py`; their
existing focused tests. Optional narrow presentation change in skill-matching
page/Profile resume evidence, with existing UI tests. Guides:
`docs/features/competency-comparison.md`, `docs/features/guided-discovery-v4.md`.

Branch: `codex/cabusao-ui-integration`; no branch/history changes. Existing
account-deletion edits belong to a different task and must be preserved. Preserve
the prior regression-investigation notes and diagnostic SQL. No migrations, new
dependencies, Auth changes, credentials, hosted data writes, commits, pushes or
deployment. If API shape changes become necessary, stop for contract review.

## Pending hosted diagnosis

The earlier AI interpretation failed; its upstream cause remains unverified.
Technology evidence removes that dependency only for the explicit table above.
The owner reports the Discovery screenshot is from a new post-redeploy attempt.
The [read-only audit](../../output/sql/discovery-experience-audit.sql) can distinguish
the saved experience choice, source facts and generated connections. It was
EXPLAIN-validated locally, not executed against hosted. No claim that the hosted
choice was lost has been established.

## Implementation and evidence, 2026-11-20

Implemented by Codex in `skill_matching/technology_evidence.py`, `matcher.py`,
`sources.py`, `discovery/experience.py`, and recommendation `resume_connections.py`,
`service.py`, `discovery_v3_rules.py`, `discovery_v4_rules.py`. The internal table
is attached only to learning-path skills; no canonical alias or wire model changes.
Existing resume signal fields retain original passages and matched technology
terms. Source notes distinguish supporting background from task completion.
Ratings, manual reports, progress and job-sample source objects remain unchanged.

Discovery shares the matcher/terms; direct evidence survives failed interpretation.
Connections recheck current owner/document/analysis/revision, carry PDF fact IDs
and matched phrases, and deduplicate by canonical skill/source. Technology-only
support cannot trigger the performed-task quote shortcut for outside-field
alternatives. Existing two-skill support and field limits remain. Explanations cite
the technology/source without claiming task completion or proficiency. Strategy
versions `discovery-rules-3.2` and `discovery-rules-4.1` mark old runs outdated;
no saved answers or completed results are rewritten.

Passed: 167 focused backend cases across technology evidence, matcher/API/basis,
skill evidence, natural-language skills, Discovery reasoning/v3/v4/rules,
recommendation evidence and recommendation repair. Cases cover positive mapped
terms, negation/aspiration, near misses, unchanged snapshot behavior, source
removal, deduplication, preserved ratings/no learning writes, failed interpretation,
strategy staleness and new-run explanation persistence with a cited PDF fact.
Initial new-test failures were invalid/incomplete fixtures; corrected fixtures
passed affected checks before the combined run. One existing Starlette warning.
OpenAPI drift passed; no frontend or schema regeneration needed.

Scoped Ruff passed except the pre-existing UP042 on the unchanged matcher
`SkillStatus(str, Enum)` declaration. Full scoped lint still exits nonzero for
that finding; it was not suppressed or changed to StrEnum because that would
alter string behavior outside this repair. No new findings remain. Existing
Sequence-import/line-length findings in the touched matcher were corrected.

A read-only restricted-role probe planned the actual relationship query and
matched the screenshot's synthetic statement against the real local published
catalog: Data Analyst 4/10 (SQL joins, SQL filtering and sorting, Pandas loading and
typing, Python notebooks setup). No private records or provider calls were used.
An additional read-only check of the local configured published job sample
confirmed unchanged counts: Data Analyst 3/19 and Data Engineer 2/16. Local
documentation links/anchors and `git diff --check` passed.
No migrations, dependencies, Auth, frontend layout or API shape changes.

Manual acceptance pending: at `http://127.0.0.1:5173/career-skill-matches`, use the
existing synthetic resume and check Roadmap skills for the four matches/source
passages. Job-sample counts should remain 3/19 for Data Analyst with that sample.
Then refresh suggestions or complete a new With experience attempt at `/discovery`;
inspect a supported career's Experience connections and original source citation.
Old results appear outdated, not rewritten. Report career, tab/run ID and request
ID for discrepancies without private resume text. Hosted behavior needs reviewed
backend deployment. No commit, push or deployment performed. Full suites, live
Groq and browser acceptance were not run; the earlier provider cause is unresolved.
