# PDF and skill evidence regression investigation

Date: 2026-11-20. Investigator/proposed implementer: Codex.
Required reviewer: @YakisobaNissin, per [CODEOWNERS](../../.github/CODEOWNERS).
Status: owner approved the bounded repair in chat with "approve" on 2026-11-20;
implemented locally. Final human review and browser/provider acceptance pending.
Requirements: REQ-11, F-002, RES-01, SKILL-01/02.
Authority: [architecture](../architecture.md),
[skill specification](../specs/competency-comparison.md),
[PDF guide](../features/pdf-reading.md),
[comparison guide](../features/competency-comparison.md).

## Confirmed findings

1. Commit `bd4bb11` (2026-11-20) added `competencies/claims.py` and made
   `skill_matching/matcher.py` filter resume statements through it. Its broad
   word-boundary expression recognizes `learn` inside `scikit-learn`, rejecting
   the entire skill statement. It also rejects positive SQL/Excel evidence in
   `SQL, Excel, no Java experience`. The same filter affects natural-language
   skill previews. Saved source evidence is not deleted by this filter.
2. With the three skill statements visible in the owner's screenshots and the
   checked-in PH posting sample, the current matcher returns zero for all ten
   sampled careers. Removing only `scikit-learn` from the in-memory input restores
   Data Analyst 3/19, Data Engineer 2/16, Cybersecurity 1/6 and DevOps 1/15, among
   other Python matches. This explains the screenshot's exact-match zeros;
   it does not establish the hosted interpretation status or deployed revision.
3. Commit `2b45954` added `discovery/experience.py` with separate resume matching.
   Its exact-label fallback ignores evidence categories and negation, does not
   resolve aliases, and reads learning-path links rather than the configured
   benchmark mappings. In a mocked-read reproduction, Discovery counts Python
   for both `Python, scikit-learn` and `I have no Python experience`, while the
   comparison rejects both. The negative example is an incorrect support signal.
   Different career coverage between the two views can be intentional; conflicting
   treatment of an identical claim needs repair.
4. The running local backend reports documents enabled, processing disabled,
   real-data approval disabled, and Groq enabled. Document availability checks
   only storage configuration, so Profile shows upload controls although upload
   and analysis routes reject requests with `documents_deferred`. This processing
   gate predates today's Discovery work (route history: `6a10653`, 2026-10-29).
   The synthetic checkbox follows the separate real-data approval flag.
5. The interpretation prompt changed in `bd4bb11`, but its stored prompt version
   remains `resume-equivalence-v1`. Completed entries can therefore be reused
   without evaluating the newer negation instructions. This is a versioning gap,
   not evidence that the owner's saved interpretation caused the zeros.

No changes to the PDF parser, extraction provider, document saving service, or
Profile upload component appear between `bd4bb11^` and current `HEAD`. Discovery
reuses the Profile component. The inspected Discovery experience paths read
saved documents; they do not clear their evidence. A new successful upload through
either surface intentionally replaces the prior active resume for that account.

## Verification and limits

Hosted evidence supplied by the owner, 2026-11-20 (not independently queried):
the active resume retains 18 evidence entries, including three skill statements.
Its current-analysis interpretation failed at `2026-11-20T10:48:27Z` with
`provider_unavailable`, model `openai/gpt-oss-120b`, prompt
`resume-equivalence-v1`, and zero mappings. This establishes extraction persistence
and absence of derived mappings for that analysis, but not the upstream failure
cause. Discovery runs completed with three items; evidence correctness remains
unverified. The supplied Render excerpt covers approximately
`2026-11-20T11:00:18Z`–`11:00:39Z`, later than the failed operation. It shows
successful GETs for documents, career skill matches and recommendations, with
no failed database statements, interpretation POST or provider warning. These
read successes do not establish matching correctness or recovery of the earlier
failure. Logs for the interpretation attempt around `10:47Z`–`10:49Z`, including
`Skill interpretation provider status=`, retry/rate-limit diagnostics and the
request ID, are still needed. No hosted backend log connection was available;
plugin discovery found an available, uninstalled Render integration. No hosted
activation, deployment or provider retry was performed.

- Passed: 65 existing focused cases across `test_documents.py`,
  `test_skill_matching.py`, `test_skill_matching_basis.py`, `test_skill_evidence.py`,
  `test_natural_language_skills.py`, and `test_discovery_reasoning.py`, executed in
  the running backend container. One existing Starlette deprecation warning.
- Passed reproductions: screenshot text versus posting CSV; isolated matcher and
  statement-filter examples; actual Discovery experience function with mocked
  database reads and interpretation mappings. These expose gaps in existing tests.
- Inspected running local non-secret feature flags; no credentials printed.
- Not run: hosted authenticated API reads, live Groq requests, real PDF upload,
  database writes, migrations, builds, full regression suite or browser acceptance.
  Browser inspection previously stopped because the tool could not reliably
  identify Chrome's URL. No claim of hosted data loss or parser failure is made.

## Bounded repair plan for review

Execution, 2026-11-20: the plan below was approved and implemented. Claim filtering
now preserves hyphenated names and positive comma-separated claims, retaining
negative/aspirational scope across subsequent list items until an explicit positive
clause or new statement. Discovery's direct learning-path lookup uses the shared
matcher, including skill categories, aliases, ambiguity and phrase boundaries.
Interpretations now use policy version `resume-equivalence-v2`; old mappings become
stale without changing saved source text or calling a provider during reads.
Availability now includes the processing flag. Only the ignored local processing
setting changed; only the backend was recreated, without building images or
restarting Supabase/frontend. Runtime processing=true, real-data approval=false;
`/health` and `/ready` both returned 200.

Verification: 84 distinct focused backend cases passed across the eight planned
test files, including 14 added regression cases. The final combined run initially
had 83 passes and one failure caused by an original assertion accidentally placed
inside the new three-skill test; the assertion was restored to its original test
and all 18 matcher cases then passed. All other cases were unchanged. Scoped Ruff
passed after wrapping existing long lines in affected files. No frontend, schema,
dependency or API-shape change; no TypeScript or contract regeneration needed.
Live synthetic upload, Groq interpretation and browser walkthrough remain pending;
see the updated feature guides. Full suites and hosted checks were not run.

Owner/implementer: Codex. Reviewer: @YakisobaNissin. Existing branch:
`codex/cabusao-ui-integration`; preserve unrelated untracked deletion-repair plan.

1. Repair claim filtering so technology names and unrelated positive skill claims
   survive, while genuine negated, hypothetical and aspirational claims remain
   excluded. Reuse the resulting evidence rules in Discovery's direct matching,
   preserving approved catalog identities and differing source coverage.
2. Enable `ASGARD_DOCUMENTS_PROCESSING_ENABLED=true` in the ignored local `.env`
   and recreate only the backend so the local test path is active. Keep local
   real-data approval false and use synthetic input; hosted settings are outside
   this repair. Inspect service dependencies before applying the runtime change.
3. Make document availability reflect the processing gate so disabled environments
   explain why upload is unavailable. Preserve access to saved evidence/removal.
4. Version the changed interpretation policy so incompatible saved mappings are
   visibly stale. Ordinary reads must not call Groq or erase source evidence.
5. Add focused regression coverage for scikit-learn, mixed positive/negative
   statements, Discovery agreement, processing-disabled availability, and stale
   interpretation policy. Reuse existing tests; run relevant backend cases and
   TypeScript if frontend changes are needed. No new framework or dependency.
6. Update the existing PDF/comparison/Discovery feature guides with dates, sources,
   evidence and remaining manual steps. Manually test a synthetic PDF at
   `http://127.0.0.1:5173/settings/profile`, then `/career-skill-matches` and
   Discovery's experience step. Report any provider/configuration blocker once.

Shared boundaries: no schema, API shape, Auth, credential, catalog publication or
dependency changes. No commits, pushes, deployments or hosted activation. Exact
matching repair must not require re-uploading or deleting the saved resume.
