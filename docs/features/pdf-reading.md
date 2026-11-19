# How Asgard reads PDFs

Author/implementer: Codex. Created: 2026-11-18. Last updated: 2026-11-18.
Status: source-based explanation; human review pending.
Reviewer: @YakisobaNissin, following [CODEOWNERS](../../.github/CODEOWNERS).
Requirements: REQ-11, F-002, PM-W03/FUT-13.

The owner approved this documentation-only plan in chat on 2026-11-18.
The bounded change covers this guide and its documentation-index link, with
source inspection, local-link/anchor checks and whitespace checks. It changes
no application behavior, contracts, dependencies or environment settings.

## Which PDF feature is available?

Asgard has two separate paths:

| Path | What it does | Current presentation |
| --- | --- | --- |
| Temporary resume skill review | Matches text against skills linked to a selected career; you choose what to save | Profile offers it when resume review is enabled |
| Stored document analysis | Uses Groq to extract supported background for recommendation context | Backend operations exist; the current document-management frontend says “PDF upload and analysis: Coming later.” |

The second path is described below to explain the backend, not as an available
upload button. Existing stored background can still be removed through Profile.
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

1. Open **Settings / Profile**, expand **Review skills from a resume**, choose
   a career and a selectable-text PDF, then select **Review resume**.
2. The backend checks that review is enabled and loads skills linked to that
   published career. It parses the submitted PDF using the shared parser.
3. The local matcher searches for skill labels and aliases. It handles skill
   punctuation such as C++ and C#, skips ambiguous aliases, avoids overlapping
   matches, and suppresses certain direct negative phrases such as “never used”.
   These rules do not understand every possible sentence or negation.
4. The response contains at most 30 distinct suggested skills, each with its
   original page number and nearby passage. No match produces an empty list.
5. Read the passage, dismiss unwanted suggestions, and explicitly choose a
   skill and self-reported experience level to save. A mention alone does not
   establish proficiency and never automatically becomes a saved skill report.
6. End or replace the review to discard temporary suggestions. Ending the
   review does not undo skill reports you already saved. Manual entry remains
   available when review is disabled or finds nothing.

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
| Analysis quota | Three reserved attempts per rolling hour and five per rolling 24 hours per account; 100 reserved attempts per UTC day application-wide; retries reserve another attempt |
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
be verified through the current “Coming later” frontend; use the existing
reviewed backend verification workflow and hosted acceptance record for that
path. Report the URL, action, expected/actual behavior and a safe request ID;
exclude document text and credentials.
