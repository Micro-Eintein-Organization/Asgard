# How Asgard reads PDFs

Author/implementer: Codex. Created: 2026-11-18. Last updated: 2026-11-19.
Status: source explanation and Profile extraction interface implemented; human review and hosted acceptance pending.
Reviewer: @YakisobaNissin, following [CODEOWNERS](../../.github/CODEOWNERS).
Requirements: REQ-11, F-002, PM-W03/FUT-13.

## Bounded extraction implementation, 2026-11-19

Owner approved the researched script/chunk approach in chat with “ok implement.”
Implementer: Codex; reviewer: @YakisobaNissin, human review pending. Requirements:
REQ-11/13 and F-002. Scope: internal provider chunking, source-ID extraction,
source reconstruction and bounded merge; document service ownership/revisions,
public evidence schema and private-data rules remain. Preserve existing edits.
Use at most four sequential chunks and one transient retry across the analysis,
retain the service's 120-second analysis timeout and shared reservations for every
call. Divide the 4,000 successful-output-token budget across chunks. Fail the
replacement if any chunk fails; no silent partial apply or inferred proficiency.
No new dependency, OCR, agent framework, migration or public API shape change.
Checks: existing focused PDF/resume cases plus small chunk/provenance regression
coverage, scoped lint/TypeScript if UI feedback changes. Live acceptance remains
separate; owner requested no extensive testing.

Status: implemented locally; human review/live hosted acceptance pending.
The provider splits filtered text into source excerpts of at most 500 characters,
groups them into at most four sequential chunks of about 6,000 serialized UTF-8
bytes, and preserves original page numbers. Short resumes use one chunk.
A conservative request-size estimate is checked against 7,600 estimated total
tokens; this is not an exact tokenizer or a statement of account quota.
Accepted completion budgets total at most 4,000 tokens across chunks. At most
one transient retry is shared across the document; every chunk/retry reserves
shared budget and rechecks active ownership/removal/deadline before its call.
The existing attempt column remains 1 for each chunk's first call and 2 for a
retry; no migration or misuse of the column as a chunk counter is required.

Internal provider schema v2 requests category, source identifier and a short exact
text substring. The backend reconstructs page/span from the submitted excerpt,
rejects unsupported identifiers/text, merges and deduplicates locally, and keeps
the existing maximum of 30 saved items. Empty chunks are allowed, but no usable
items overall is unsuccessful. Any failed chunk, over-budget input, unsupported
evidence or aggregate validation failure rejects the replacement; no incomplete
success is saved. Existing active background remains. Public API evidence fields
are unchanged. This does not introduce an agent or OCR.

Focused checks passed: 25 PDF/resume backend tests in the existing network-isolated
image with read-only source, plus scoped backend Ruff. Added cases cover source
page preservation, sequential merge/reservation and rejecting a bad later chunk.
One existing Starlette deprecation warning remains. No broad suite, new test
infrastructure, live provider request, actual database/concurrency probe or hosted
browser acceptance was run. Manual acceptance pending: analyze short and larger
synthetic resumes on `/settings/profile`, inspect categories/page/source text,
and verify a failed replacement preserves the previous background. Record build,
request ID and actual result without private resume content. The owner must review
real extracted answers before presenting this as a reliability improvement.

## Per-account attempt limit removed, 2026-11-19

Implementer/task owner: Codex. Owner approved “Remove the PDF attempt limit and
cooldown” in chat (PDF-QUOTA-02). Reviewer: @YakisobaNissin; human review and hosted
acceptance pending. Scope: remove account-count queries and browser cooldown,
update tests and policy. No schema, API shape, dependency or Auth changes.

No PDF-specific 3/hour or 5/day account cap remains. Keep one analysis in flight,
normal API/file limits, shared 100 external attempts/UTC day and Groq limits.
Historical reservations remain. This supersedes account-wait descriptions below.
Visible clear/remove controls and earlier feedback fixes are preserved.

Manual check pending: at `/settings/profile` on the intended build, repeat
synthetic PDF analysis past former account limits; verify no account countdown
while shared-budget rejection remains safe. Removing limits does not establish
extraction quality or live success. See [research findings](../research/pdf-analysis-reliability.md).

Focused verification: 22 backend PDF/resume tests and 10 frontend Profile tests
passed; TypeScript, scoped backend Ruff and whitespace checks passed. Backend
checks used the existing image, read-only source and no network. No full suite,
image rebuild, live provider test, database quota integration or hosted browser
acceptance was run. Owner requested no extensive testing due to time constraints;
existing regressions remain and no further test expansion is planned here.

### Removal feedback follow-up, 2026-11-19

Codex corrected stale feedback within the owner-approved PDF controls scope.
An earlier removal receipt is now hidden while saved state still contains an
active/pending document or a new local selection. Confirming removal clears old
analysis/cleanup errors; it preserves the account quota and waiting time.
Two regression cases cover new pending documents and confirmed empty state.
Human review and hosted visual verification remain pending; see the checks
reported in the handoff. No API, database or quota policy changes.

## Reliability and visible controls, 2026-11-19

Implementer/task owner: Codex. Owner approved the bounded implementation plan
in chat with “Please implement the plan.” Required reviewer: @YakisobaNissin.
Status: source implemented; human review and live hosted acceptance pending.
Requirements: REQ-11/13, F-002, existing privacy/resource limits.

Approved scope: fix filtering, quota reservation timing and retry feedback;
use shared clear/remove/recovery buttons. Affected modules are document service,
provider, Profile controls and their tests. No schema, API shape, dependency,
provider or numerical quota changes. Account transactions, private Storage,
shared budgets, removal guards and previous successful background are preserved.

Allowed headings now accept inline content such as `Skills: SQL`, and sections
continue across pages. Provider allowance is reserved after bounded local
preparation and before each AI call, including its one transient retry.
Pre-provider storage/read/filter failures do not spend AI allowance. Historical
reservations remain unchanged. Quota rejection retains an uploaded candidate;
Retry-After reflects the limiting rolling window or UTC day. Failure diagnostics
contain stage/code/request ID, not resume text.

Profile displays specific failure reasons, quota waiting time, bounded status
polling and duplicate-click protection with a per-candidate analysis key.
Clear selected PDF clears only local selection. Remove resume is a destructive
button with confirmation covering saved and pending background; manual skills
and progress remain. Reload and cleanup are visible shared buttons.

Verification: 22 backend PDF/resume tests passed in the existing image with
read-only mounted source and networking disabled. Coverage includes inline and
continued sections, pre-provider failures without quota reservation, quota
candidate retention, waits and a simulated transient retry. Eight Profile tests
and TypeScript passed on the host. Backend scoped Ruff passed after line-length
corrections. Docker required sandbox escalation; no services were started or
rebuilt. Frontend lint's new clock/dependency findings were corrected; its
pre-existing synchronous inactive-form reset remains a limitation.

Not run: live provider, authenticated browser and actual PostgreSQL quota/race
acceptance. Mocked responses do not establish live reliability. Human reviewer:
@YakisobaNissin. No commit/deployment or 100-percent success claim.

Manual acceptance (pending): at `/settings/profile` on the intended build,
analyze synthetic separate-heading, inline-heading and multi-page text PDFs.
Inspect saved evidence and source passages. Reject a scan/invalid PDF without
losing prior background. At an arranged quota boundary, verify waiting time and
retained candidate. Clear selection without deleting saved background; cancel
then confirm Remove resume and verify manual skills/progress remain. Report
request ID, build, action and expected/actual outcome without private PDF text.

Owner's subsequent request for completed-roadmap indicators in Career skill
matches is a separate shared-contract decision awaiting clarification. Splitting
AI requests would increase quota use; no chunking or quota-policy expansion is
implemented by this change.

## Organized results and Skills visibility, 2026-11-19

Task UI-RESUME-02. Implementer: Codex. Owner approved the
[bounded plan](../plans/resume-results-organization.md) in chat with “approve”.
Required reviewer: @YakisobaNissin. Status: implemented locally; human code review
and manual visual acceptance pending.

Saved background now uses category tables with wrapping text and expandable
source passages. Skills automatically shows the current active document's skill
evidence under **From resume**, using the existing account-scoped document query.
Replacement/removal updates both views through the shared query cache. Resume
claims remain separate from confirmed experience reports and never create or
overwrite their ratings. Grouped source text is preserved rather than guessed
into individual canonical skills. The empty Skills message now specifically
refers to confirmed reports.

Sources: [shared evidence presentation](../../frontend/src/features/profile/resume-evidence.tsx),
[document controls](../../frontend/src/features/profile/documents.tsx),
[Skills card](../../frontend/src/features/competencies/profile-skills.tsx), and
[styles](../../frontend/src/styles.css). No backend, parser, provider, schema,
contract, dependency or environment changes.

Verification: 14 focused Vitest tests passed across document controls, shared
resume evidence and competencies in the existing frontend Docker image with
current source mounted read-only and networking disabled. Coverage includes
source disclosures, clearing removed background, and no skill-report writes.
TypeScript passed. Scoped ESLint failed only on the pre-existing synchronous
state reset in `documents.tsx` (`react-hooks/set-state-in-effect`); no errors
were reported in the new shared component or changed Skills component.
The unrelated lint issue remains outside this presentation change.

Manual acceptance pending: open `/settings/profile` in the existing app, refresh
a successful analysis and inspect each category table. Expand a source using
Tab/Enter; compare Skills → From resume with the saved skill evidence. Existing
confirmed ratings must remain unchanged. Check long text at a narrow viewport
and 200% zoom. With disposable approved data, replace/remove background and
verify both views update. Report the route, viewport and expected/actual behavior
without sharing private PDF text. Chrome inspection was denied during the earlier
diagnosis; no new live PDF/provider or hosted checks were performed. The original
transient extraction failure remains unconfirmed. No commits or publication.

## Primary resume picker presentation, 2026-11-19

Task: UI-RESUME-01. Implementer/task owner: Codex. Reviewer: @YakisobaNissin.
The owner requested that the main resume upload use the existing **Review a
resume** card with its PDF indicator, rather than the plain native file input.
The screenshot and request define the bounded presentation plan: reuse the
existing resume-card classes in `frontend/src/features/profile/documents.tsx`,
show the selected filename/readiness, and retain Choose/Replace PDF keyboard
activation plus the existing explicit Analyze PDF action. Existing document
upload, synthetic-data confirmation, account guards, saved evidence, and the
optional career-specific temporary review keep their behavior. No backend,
shared contracts, dependencies or new visual assets are needed.

Initial worktree inspection was clean on `codex/cabusao-ui-integration`. The owner
requested no tests for this change; no tests were added or run. Verification:
`npm run typecheck` passed, existing card classes and keyboard button activation
were checked in source, and scoped whitespace checks passed. Status: implemented
locally and ready for source review; manual appearance acceptance pending.

Manual check at `http://127.0.0.1:5173/settings/profile`: the main import flow
should show the existing red PDF indicator, **Review a resume**, and **Choose
PDF**. Choose a PDF using keyboard or pointer; its filename and Ready to analyze
indicator should appear. Analyze PDF retains its existing enablement conditions.
Cancel selection should restore the prompt. Check a narrow viewport and long
filename. Report the route and expected/actual presentation; keep resume contents
private. Provider configuration acceptance is outside this presentation change.

## Profile extraction integration, 2026-11-19

Implementer/task owner: Codex. Created/updated: 2026-11-19. Reviewer:
@YakisobaNissin. Owner requested implementation in chat. Bounded implementation
uses the already approved upload/analyze/remove operations and the F-002 rule that
explicit Analyze PDF authorizes automatically applying validated extraction.
Scope: Profile document controls, their Settings mount, primary/secondary resume
presentation, focused frontend tests and implementation guides. No shared API,
schema, authentication, parser or provider changes are included. Unrelated
concurrent recovery-code work is preserved.

[Profile document controls](../../frontend/src/features/profile/documents.tsx)
now upload the chosen file, use the returned account revision for analysis, and
display persisted skills, work experience, education and projects. Each result
has its supporting page/span. Analysis requires an explicit action and, when the
backend limits use to synthetic data, explicit synthetic-document confirmation.
An account change after upload prevents analysis under the next account. Selected
files and processing participate in the Settings navigation guard. Existing
backend lifecycle rules preserve prior active evidence until validated success;
remove/replace, failure recovery and pending-document status remain available.
Resume evidence feeds career matching independently of manually rated skills.

Verification: 12 focused document/Profile tests passed, including upload-to-analysis
revision handoff, explicit action/synthetic gating, saved evidence presentation,
removal cancellation and account-change protection. TypeScript checking was
attempted and failed in unrelated concurrent `src/auth/recovery-codes.ts` error
union handling (four errors); no errors were reported in the changed resume
sources. The additional Settings suite failed in its pre-existing ProfilePhoto
test harness because it lacks QueryClientProvider; it was not expanded or retried.
No full suite/build, live provider calls, backend or hosted/browser acceptance ran.
The offline skill publisher generated 230 stable identities and passed Node syntax
checking; its SQL has not been applied or database-validated. Whitespace checks
passed for the changed resume sources.

Manual acceptance remains pending: at `/settings/profile`, select a synthetic
PDF containing separate Skills and Work experience headings and choose Analyze
PDF. Expect automatically saved grouped evidence, then refresh and open
`/career-skill-matches`. Replace with an invalid PDF and verify previous successful
background remains. Remove background and check resume-derived matching disappears;
manual reports remain. Repeat as another account to verify isolation. Backend
Storage, processing/Groq flags and credentials must already be provisioned;
availability does not establish privacy or provider-quality acceptance.

### Empty hosted skill catalog

Approval recorded 2026-11-19: YakisobaNissin explicitly approved the prepared
publication of the existing 230 skill definitions in chat ("i approve, can you
please adjust the skill publicaiton sql"). Codex set the reviewer in
`output/sql/skill-catalog-publication.sql` to `YakisobaNissin`; the generic renderer
retains its approval guard for future generation. This records content-publication
approval, not executed hosted SQL or completed runtime acceptance.

The owner's 2026-11-19 Supabase SQL result showed zero total, published and
CSS skill records. Migrations create tables; skill content is published separately.
An empty search now checks the unfiltered catalog once and explains when the
published catalog is empty rather than implying only the search term failed.

`node scripts/render-skill-publication.mjs output/sql/skill-catalog-publication.sql`
was executed successfully. The offline [renderer](../../scripts/render-skill-publication.mjs)
combines the existing base and expansion definitions, retaining their identity/
conflict checks and requiring 230 published identities within one transaction.
The generated SQL is a local output artifact, not a migration or approval record.
Review it, replace its single reviewer-setting value `REPLACE_AFTER_REVIEW` with
the approving reviewer name, and run the entire file in the correct Supabase
project's SQL Editor. Until replaced, the guard deliberately rejects execution.
No administrator credentials or hosted writes are used by the renderer.
Foreign-key/content conflicts roll back the publication; report them rather than
resetting or deleting existing content. Repeat publication preserves existing
skill reports. No table migration or migration-history repair is needed for this
content-only operation. After success, repeat the count query and search CSS;
expect 230 published skills and the existing CSS skill. Content review and hosted
acceptance remain pending.

The original documentation-only baseline below retains its dated evidence;
this section records the subsequent interface implementation.

The owner approved this documentation-only plan in chat on 2026-11-18.
The bounded change covers this guide and its documentation-index link, with
source inspection, local-link/anchor checks and whitespace checks. It changes
no application behavior, contracts, dependencies or environment settings.

## Which PDF feature is available?

Asgard has two separate paths:

| Path | What it does | Current presentation |
| --- | --- | --- |
| Temporary resume skill review | Matches text against skills linked to a selected career; you choose what to save | Profile offers it when resume review is enabled |
| Stored document analysis | Uses Groq to extract skills, work experience, education and projects for saved background | Profile offers Choose resume PDF and explicit Analyze PDF when storage is available; backend processing/provider gates still apply |

The second path is now the primary Profile resume action. Select a PDF and explicitly
choose **Analyze PDF** to authorize upload and provider processing. On validated
success its extracted background is saved automatically and displayed by kind, with
page/source passages. No career selection or manual retyping is needed. Resume skills
feed career matching through active document evidence; they remain distinct from
manually rated skill reports. The older temporary review lives under **Review
career-linked skills without storing a resume**. Existing stored background can
still be removed through Profile.
Availability depends on environment configuration; source code and flags alone
do not prove hosted activation or acceptance.

The [product requirements](../product.md#req-11-manage-profile-preferences-and-retakes),
[recommendation specification](../specs/career-recommendations.md#optional-pdf-extraction),
[competency specification](../specs/competency-comparison.md) and
[security policy](../security-and-operations.md#upload-and-provider-data-handling)
own the requirements. This guide explains the implementation within the
[approved architecture](../architecture.md).

## How the PDF becomes readable text

Both paths use the same backend parser:

1. **Receive an authenticated request.** The browser sends PDF bytes to FastAPI
   with its session token and `application/pdf` content type. Routes enforce
   the upload size limit and scope operations to the authenticated account.
2. **Wait for a parser slot.** One parser runs at a time per backend process.
   Waiting more than two seconds returns a recoverable `pdf_busy` error.
3. **Start an isolated Python subprocess.** The backend passes bytes through
   standard input to a separate interpreter. The parser sets memory, CPU and
   file-size limits and disables Python socket creation. Its communication
   timeout is 15 seconds; this is constrained parsing, not a claim of a complete
   operating-system security sandbox.
4. **Check the file.** The parser requires the `%PDF-` signature, opens it with
   `pypdf.PdfReader(..., strict=True)`, rejects encryption, and checks page count.
5. **Extract each page's text.** `page.extract_text()` reads embedded text into
   a list, preserving page positions for later evidence. The parser rejects
   excessive text and documents with no non-whitespace extracted text.
6. **Return text or an error.** The calling path either matches skills locally
   or prepares text for provider analysis. A successful parse means readable
   text was found; it does not establish useful background or skill proficiency.

A scanned page is an image of words. Reading it requires optical character
recognition (OCR), which this implementation does not perform. Image-only PDFs
are unsupported. In a mixed PDF, embedded text may be read while image-only
content is missed. Asgard does not visually interpret page layouts or pictures.

Sources: [routes](../../backend/app/modules/documents/routes.py),
[parser process](../../backend/app/modules/documents/parser.py),
[parser orchestration](../../backend/app/modules/documents/provider.py).

## Temporary resume review: step by step

1. Open **Settings / Profile**, find **Academic profile & document management**, choose
   a career and a selectable-text PDF, then select **Review resume**.
2. The backend checks that review is enabled and loads skills linked to that
   published career. It parses the submitted PDF using the shared parser.
3. The local matcher searches for skill labels and aliases. It handles skill
   punctuation such as C++ and C#, skips ambiguous aliases, avoids overlapping
   matches, and suppresses certain direct negative phrases such as “never used”.
   These rules do not understand every possible sentence or negation.
4. The response contains at most 30 distinct suggested skills, each with its
   original page number and nearby passage. No match produces an empty list.
5. Read the passage, dismiss unwanted suggestions, select **Add [skill]**
   (or **Edit [skill]** for a saved report), choose your experience in the Skills
   editor below, and select **Save skill**. A mention alone does not
   establish proficiency and never automatically becomes a saved skill report.
6. End or replace the review to discard temporary suggestions. Ending the
   review does not undo skill reports you already saved. Manual entry remains
   available when review is disabled or finds nothing.

Changing careers cancels outdated review work and clears suggestions while keeping
the selected PDF. Failed reviews retain the PDF for retry. The Review button has
adjacent guidance explaining missing prerequisites. See the
[2026-11-19 repair and verification record](competency-comparison.md#resume-saving-and-hosted-schema-repair-2026-11-19)
for hosted migration requirements and pending manual acceptance.

This path makes no Groq request. The PDF and extracted text remain temporary
in-memory data rather than stored documents; the response uses `Cache-Control:
no-store`. Only explicitly saved skill reports persist. Hosted configuration
currently requires the broader PDF-processing dependencies even though the
matcher itself does not call Groq.

**Synthetic example:** suppose a page says `Skills: Python`, and the selected
career has an unambiguous published skill label or alias `Python`. The matcher
can return that skill, page 1, and the supporting passage. You still choose
whether to save it and supply your own experience level. This is an illustrative
example, not a newly executed test result.

Sources: [review interface](../../frontend/src/features/competencies/resume-skill-review.tsx),
[local matcher](../../backend/app/modules/documents/resume_review.py),
[configuration gates](../../backend/app/core/config.py).

## Stored document analysis: backend steps

1. **Upload a candidate.** The authenticated upload operation checks type, size,
   signature and expected state revision, then stores the original under an
   account-scoped, server-generated key in private Supabase Storage. Upload
   success means `uploaded`, not analyzed. Only one pending candidate is allowed.
2. **Explicitly request analysis.** The analyze operation checks ownership,
   configuration, revision, idempotency key and quota. Without real-data
   approval, it requires a synthetic-document declaration. It marks the
   candidate `analyzing` before doing external work.
3. **Fetch and parse the candidate.** The backend retrieves the private original
   and runs the shared parser. Parsing occurs during analysis, so a file may
   pass upload checks and still fail the deeper PDF checks here.
4. **Filter text before sending it.** On each page, filtering starts at a
   recognized standalone Skills, Technical Skills, Education, Experience,
   Work Experience or Projects heading. It drops lines matching contact
   patterns or known profile names. The prepared text must be nonempty and at
   most 24,000 characters. This conservative filter can omit useful content;
   it is not a guaranteed anonymizer or a full understanding of section boundaries.
5. **Ask Groq for structured evidence.** Groq receives the filtered text with
   page numbers, not the PDF file. Instructions restrict output to explicitly
   stated skills, education, experience and projects and treat document
   instructions as untrusted data. Output is capped at 4,000 completion tokens.
6. **Validate the response.** Pydantic checks the structure, allowing at most
   30 items. Every item needs a page, an exact supporting span on that page,
   and text contained in that span. Empty or invalid evidence fails analysis.
   These checks establish source support; they do not prove that a resume's
   claims are true or that the model's interpretation is always correct.
7. **Apply a valid result.** The backend rechecks candidate state and deadline.
   A still-valid success becomes active document context automatically, with
   no extra mandatory confirmation screen. This context is separate from the
   explicitly saved skill reports in temporary resume review.

Sources: [document service and lifecycle](../../backend/app/modules/documents/service.py),
[filtering/provider validation](../../backend/app/modules/documents/provider.py),
[response models](../../backend/app/modules/documents/schemas.py).

## Limits, failures and recovery

| Check | Implemented behavior |
| --- | --- |
| PDF size | Maximum 10,000,000 bytes (10 MB) |
| Page count | Maximum 50 pages |
| Extracted text | Maximum 100,000 characters across pages |
| Unsupported input | Wrong type/signature, encrypted or malformed PDFs, and PDFs without selectable text are rejected |
| Parser bounds | Two-second slot wait; 15-second communication timeout; 384 MiB address-space and 12-second CPU limits |
| Provider failures | At most one transient retry, subject to quota; malformed, refused, truncated or unsupported output fails analysis |
| Analysis quota | No PDF-specific per-account cap; one in flight/account; 100 shared external-analysis attempts per UTC day; reserve before each provider request, including retries |
| Changed state | Revision conflicts require reloading state before retrying; removed or expired candidates cannot apply late results |

The [specification](../specs/career-recommendations.md#optional-pdf-extraction)
requires a 120-second total deadline from accepted upload through application.
Current source sets an upload deadline, clears it when upload finishes, and
starts a fresh 120-second deadline when analysis begins. Analysis external work
is wrapped in a 120-second timeout and application checks the stored deadline.
This does **not** establish a single enforced end-to-end upload-to-application
deadline; that policy difference remains for reviewer follow-up.

Failed analysis preserves previous successful document context. Replacement
only retires earlier active context after the new candidate succeeds. Removal
excludes active and pending context, clears evidence, suppresses document-derived
recommendation payloads, and prevents an in-flight analysis from restoring it.
These operations preserve the selected roadmap and topic progress.

## Privacy, cleanup and verification status

Stored originals are private; authorized downloads go through the backend with
attachment and no-store headers. Successful replacement, removal and failed
analysis schedule cleanup. Cleanup attempts delete due objects and retain
failures for retry; exclusion from active use is distinct from physical deletion.
The [retention policy](../security-and-operations.md#retention-backups-and-deletion)
requires applicable active-storage purges within 24 hours. Opportunistic cleanup
does not prove that deadline for inactive accounts. The
[hosted activation record](hosted-feature-activation.md#cleanup) leaves unattended
cross-account cleanup scheduling as separately reviewed work.

Provider privacy settings, including the required Zero Data Retention setting,
and hosted isolation/deletion acceptance still require their recorded checks.
Filtering alone does not establish privacy approval. Do not put PDF contents,
credentials or raw prompts into normal diagnostics.

**Evidence:** the [2026-11-09 matcher record](competency-comparison.md#local-resume-skill-matching-2026-11-09)
reports local signed-in acceptance. The
[2026-11-16 hosted activation record](hosted-feature-activation.md#verification-and-manual-acceptance)
reports focused checks and leaves human review and broader hosted PDF acceptance
pending. These dated results are not new verification performed for this guide.

**2026-11-18 documentation checks:** source inspection completed; all 55 local
links across this guide and the index resolve, including referenced heading
anchors. Both files pass trailing-whitespace checks; the tracked diff passes
`git diff --check`.
Application tests and new browser/provider checks are not run because this
change only explains existing source. Human documentation review remains pending.

**Guided manual check (pending for this change):** in an authorized local
environment, open `http://127.0.0.1:5173/settings/profile`. Review a synthetic
selectable-text PDF for a selected career, inspect the page/passage, dismiss one
suggestion and explicitly save another with an experience level. End review and
reload: only saved reports should remain. Check an image-only PDF produces a
recoverable error and manual entry still works. Stored upload/analysis cannot
be verified by the original documentation-only baseline. The 2026-11-19 interface
now exposes this flow; use the current manual steps above and the existing
reviewed backend verification workflow for acceptance. Report the URL, action, expected/actual behavior and a safe request ID;
exclude document text and credentials.
## Resume applications across skill views, 2026-11-20

Implementer: Codex. Created/last updated: 2026-11-20. Requirement RES-01/REQ-11;
reviewer @YakisobaNissin approved the [bounded SQL/API package](../plans/context-aware-counselor-and-skills.md).
Source implemented; human code/browser/model review pending.

Profile's saved resume skills now expose Job-sample and Roadmap match disclosures,
grouped by career with source passages, exact/interpreted wording and published
roadmap/topic links. Existing analysis/interpretation orchestration is reused;
GET does not generate, failure preserves exact matches, and no lesson is completed
automatically. Conservative positive-claim filtering also applies to exact resume
matching. Sources: frontend `features/profile/resume-evidence`; backend
`modules/skill_matching/{schemas,service,matcher,interpretation}`.

Two resume presentation regressions passed within nine focused UI cases. Matching/
evidence regressions passed within 33 backend cases. Browser and real provider
quality acceptance remain pending. After approved environment activation, visit
`http://127.0.0.1:5173/settings/profile`, analyze a synthetic resume, expand both
match disclosures, inspect passages and follow topic links. Replace/remove the
resume and verify derived matches disappear while self-reports remain. Report
route/request ID and expected/actual outcome without private resume text.
