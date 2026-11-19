# PDF analysis reliability: online review

Author: Codex. Created/updated: 2026-11-19. Status: research and proposed follow-up,
not implementation authority or live-provider acceptance. Reviewer: @YakisobaNissin.
User requested online investigation and suggested split calls or a script-running
AI agent. Current implementation remains governed by the [PDF guide](../features/pdf-reading.md).

Implementation follow-up, 2026-11-19: the owner approved “ok implement.” Bounded
chunks, internal source identifiers, conservative token-size checking and validated
local merge are now implemented; see the PDF guide for exact bounds and tests.
No live accuracy measurement, parser layout fallback, agent, OCR or partial-result
mode was added. The proposal below retains its research context; its original
“not implemented” notes are superseded only for these named changes.

## Findings from primary documentation

- [Groq rate limits](https://console.groq.com/docs/rate-limits) apply across the
  organization, including request and token budgets. Actual account limits must
  be checked in the console; the model's context window is not its minute budget.
  Headers report remaining budgets and Retry-After. Removing Asgard's personal
  PDF allowance does not remove Groq's restrictions.
- [Structured outputs](https://console.groq.com/docs/structured-outputs) constrain
  JSON shape, not semantic correctness. Decomposing complex tasks is a documented
  option. Asgard already uses strict schema output and validates source evidence;
  that cannot guarantee complete or correct resume extraction.
- [Groq errors](https://console.groq.com/docs/errors) distinguish invalid requests,
  oversize requests, throttling and temporary failures. Blindly repeating every
  failure is inappropriate; inspect sanitized status/stage metadata first.
- [pypdf text extraction](https://pypdf.readthedocs.io/en/stable/user/extract-text.html)
  supports plain and layout modes. Complex PDF layout complicates extraction;
  image-only documents need OCR. Layout mode is an option to evaluate against
  the pinned version, not an automatic improvement for every document.

## Concrete risks in current code

Source inspection: `backend/app/modules/documents/parser.py`, `provider.py`,
`service.py` and `schemas.py`.

- The existing script extracts embedded text, not page images. An autonomous
  agent running the same script would inherit this limitation.
- The provider receives up to 24,000 filtered characters and reserves 4,000 output
  tokens. There is no PDF-specific total-token preflight. This may exceed a
  current account's available token allowance; this is a risk, not a confirmed
  diagnosis of the user's live failure.
- Up to 30 returned evidence items are validated together. One invalid source
  passage currently rejects the full result. Source validation is necessary;
  blindly accepting unsupported items is not a remedy.
- Broad extraction, long copied spans and a fixed completion budget can increase
  truncation risk. Current failures need safe diagnostics to distinguish this
  from PDF reading, privacy filtering or provider availability.

## Recommended next increment for review

1. Diagnose representative failures through the authenticated application with
   synthetic PDFs, recording stage, status, elapsed time and counts, never raw
   resumes or prompts. Record the actual account token/request budget.
2. Add conservative total-token budgeting before provider calls. Prefer one
   compact request for short resumes. For larger prepared text, use bounded,
   sequential section/page chunks while preserving original page numbers.
3. Limit total calls, retries and elapsed time across the complete analysis.
   Reserve the shared budget for every provider attempt; respect throttling.
4. Validate each chunk against its source. Merge and deduplicate locally rather
   than using another LLM to rewrite evidence. Do not present a partial chunk set
   as complete; define and review partial-result behavior before implementation.
5. Evaluate requesting source identifiers and reconstructing exact passages
   locally, reducing demands on the model to reproduce whitespace verbatim.
   Keep external evidence fields compatible; provider prompt/schema changes
   require reviewer assessment and an updated evaluation set.
6. Compare live results across supported resume layouts before making reliability
   claims. Preserve prior successful background on any unsuccessful replacement.

This increment is proposed, not implemented. It needs a bounded reviewed plan,
especially for total-call budget, partial-results policy and provider schema.
No new agent framework, OCR dependency, model replacement, raw-document upload
to a new service or public configuration change is proposed as an automatic fix.
No method can promise successful external-service calls for every PDF/request.

## Implemented separately

PDF-QUOTA-02 removes Asgard's per-account PDF attempt cap and browser countdown.
It preserves shared/provider budgets and does not implement chunking, layout
fallback, partial extraction or a new autonomous agent. Live tests have not run
as part of this research; simulated regressions are not a substitute.
