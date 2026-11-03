# Connected MVP backend handoff

Historical implementation/evidence record: later source, explicit deferrals and current acceptance limits are consolidated in [Development](../development.md#current-local-mvp-status-2026-11-02). Preserve dated results below; earlier three-path, copied-retake or unverified descriptions do not override that current status.

Created: 2026-10-28. Updated: 2026-10-29.
Status: local core acceptance recorded; deployment preparation implemented. Human review is deferred; hosted release gates remain open.

## Reviewed scope

Approval was recorded for this bounded implementation in the task on 2026-10-28:
document storage, typed document APIs, additive migrations and a pinned PDF parser;
Career navigation, contextual guidance, recommendation evidence, portable content
publication and focused local acceptance. No Git publication or deployment is included.

Requirements: REQ-04, REQ-05, REQ-07, REQ-09, REQ-11; F-002-AC-07,
F-002-AC-11. Dependencies: existing Auth/session boundary, restricted asgard_app
role, private Supabase Storage, Groq and persisted analysis budgets. Contracts:
generated OpenAPI/TypeScript plus additive versioned SQL. Existing product and security documents remain
authoritative; this records implementation authorization, not completed review.

Affected modules: documents, recommendations, app navigation, Profile, local tooling.
Checks: parser/evidence and lifecycle tests, ownership/revisions, migration and API
drift, frontend checks, clean setup and complete browser flow. Live calls limited
to two synthetic calls. See [connected prototype](connected-prototype.md) for prior evidence.

## Implemented behavior

Owner decision 2026-10-29: PDF processing is deferred. Upload and analysis routes
are gated by `ASGARD_DOCUMENTS_PROCESSING_ENABLED`, default false; Settings shows
Coming later and retains existing document removal and cleanup. The focused route
deferral test passed. The detailed Data Analyst release, isolated upgrade-preservation
check and browser registration/core journey now have local evidence in
[deployment preparation](deployment-preparation.md). Human review remains deferred.

On 2026-10-29, the document removal confirmation was corrected so cancelling it
does not submit removal, and selected files and pending document operations were
added to the Settings navigation guard. Preparation also drops lines containing
saved profile names. This is still not a general anonymizer: ordinary personal
documents remain gated pending the provider data-control verification and privacy
review described below. Focused PDF/progress tests and mocked synthetic-account
database acceptance passed, including blank retakes, progress readback, document
ownership and removal. No live provider requests were made. Later local core
acceptance and remaining hosted gates are recorded in the linked current guide.

- Career resolves saved focus through `/roadmaps`, with a separate destinations
  dropdown. Direct `/careers` stays accessible. Existing roadmap URLs remain valid.
- Contextual guidance uses account state and versioned preference dismissals. It
  never appears in the first-time Discovery shell or substitutes for save errors.
- Saved recommendation responses expose only referenced, readable evidence facts.
- Profile includes private PDF upload, explicit analysis, source-backed statements,
  replacement, removal, error readback and cleanup retry. Name saves are independent.
- Documents use a private `asgard-documents` bucket. Browser JWTs have no direct
  object access. A backend-only service credential is confined to the bucket gateway;
  ordinary SQL continues using session-checked `asgard_app` and owner RLS.
- PDF processing uses pypdf 6.21.3 in a subprocess with memory/CPU limits, a
  15-second wall deadline and disabled socket creation. Encrypted, malformed,
  image-only and oversized documents fail. No original is rendered inline.
- Extraction keeps bounded background sections, drops header/contact and known-name lines,
  and validates exact page/spans/substrings. This conservative filter is **not a
  general anonymizer**. Real-data activation remains off pending privacy review.
- Analysis has a 120-second deadline, persistent quotas and at most one transient
  retry. Successful replacement increments recommendation context without generating
  suggestions. Removal immediately suppresses and erases dependent payloads.
- Additive SQL preserves ordinary immutable recommendation provenance and permits
  only exact privacy erasure after the owned source document is removed. Corrective
  migrations retain the local application sequence, including the table-specific guard fix.
- Failed/removed objects retain durable due-work until deletion succeeds. Local
  operator cleanup is explicit; no hosted scheduler or production retention claim exists.

Relevant source: `backend/app/modules/documents/`, recommendation services/schemas,
`supabase/migrations/20261028000200_documents.sql` and subsequent privacy guard
migrations; `frontend/src/app/career-navigation.tsx`, `guidance.tsx`, Profile document
component and generated client. See [content authoring](../content-authoring.md).

## Local setup and operations

Run from the checkout root after the existing [getting started](../../README.md#getting-started)
sequence provisions this developer's local signing keys, restricted credentials and stack.

1. Review/apply pending migrations with the pinned local CLI. The daily starter
   intentionally refuses pending migrations instead of silently applying/resetting them.
2. `node scripts/publish-local-content.mjs` explicitly installs the reviewed starter
   artifact through local administrative psql, preserving account state and rejecting conflicts.
3. `node scripts/configure-local-documents.mjs` obtains **this local stack's** service
   credential privately and writes only ignored `.env`. It enables synthetic documents
   and leaves real-data approval false. It never exports a VITE credential.
4. Rebuild backend for the pinned parser, then recreate it for changed configuration:
   `docker compose build backend`, then `docker compose up -d --no-build --force-recreate backend`.
5. Use `node scripts/cleanup-local-documents.mjs` for bounded operator cleanup and a
   pending/failed count. Run it after interrupted analysis and before local handoff.
   The Profile cleanup action retries due files for the signed-in account.

Keep Groq enablement/key/model in ignored server configuration. The default document
mode requires an explicit synthetic-data acknowledgement before Analyze PDF. Enabling
real personal data requires verified Groq ZDR settings, privacy notice/redaction review
and the owning security/operations gates; changing a flag alone is not that evidence.

## API and frontend integration

Generated OpenAPI and TypeScript own the wire shapes. Document operations are
authenticated under `/api/v1/me/documents`: GET state; POST `/upload` with raw PDF
and `expected_revision` query; POST `/{id}/analyze` with an idempotency key and
revision; POST `/remove`; POST `/cleanup`; GET `/{id}/download` as a private attachment.

Use the generated client via `features/core/data.ts`. Account queries include user
identity; successful writes invalidate that account's data. Preserve operation keys
on network retries and use the revision read with the edited state. A 409 requires
reload/reconciliation, never silently substituting a newer revision. Failed analysis
preserves the active document; upload another candidate to retry. Document removal
does not change focus/progress. Ordinary model calls remain explicit, bounded and
independent of page reads. Errors use the common sanitized envelope and request ID.

## Acceptance evidence

- Backend image with hash-pinned parser built successfully; additive local migrations applied without reset.
- PDF parser/evidence cases: 11 passed, including page limits, encrypted/image-only rejection,
  contact/header filtering and unsupported source references.
- Existing backend suite before expanded acceptance: 54 passed, four opt-in tests skipped.
- Synthetic local API acceptance passed: Profile and preference readback/isolation,
  stale writes, Discovery branching/restoration/resume/completion/retake, explicit Data
  Analyst focus/branch, one-Learning guard, Done/undo, activity and Dashboard; document
  upload, other-account denial, duplicate analysis, evidence-backed recommendations,
  roadmap destination and removal/download/fallback suppression with object cleanup.
- **Two live synthetic provider requests total:** extraction plus recommendation
  completed and saved; exact roadmap destination resolved; removal suppressed derived
  results and purged the original. Temporary accounts removed. No further live calls authorized by this run.
- Frontend type check, production build and lint passed. Frontend unit tests: 18 passed
  after updating stale registration expectations to the existing entry-card controls.
- Existing development-helper tests: four passed. Explicit content republication
  succeeded; cleanup reported zero pending/failed operations.
- Historical check: full backend lint initially reported long-line/import issues.
  Subsequent approval covered the bounded cleanup and the full check passed.

### Final local follow-up

- Final backend regression: 65 passed, four explicitly opt-in cases skipped in the default run.
- Existing Auth integration suite explicitly executed against synthetic local accounts:
  four passed, covering real-role RLS, verification, stale writes, logout rejection
  of old access/refresh tokens and refresh restoration. Its email helper now deduplicates
  the same code appearing in both plain text and HTML; no Auth behavior changed.
- Mocked concurrent removal during delayed analysis passed: a late result could not
  restore background or download access. No additional live calls were made.
- Targeted document/recommendation/backend-helper lint passed; database function/schema
  lint found no errors. Generated OpenAPI and TypeScript drift checks passed.
- Actual installed Chrome acceptance passed: login, no-focus catalog routing, blank
  five-question Discovery, saved results with intentionally unavailable provider,
  catalog-to-roadmap explicit focus, Career resume, Profile save/refresh, keyboard
  dropdown, logout/relogin persistence and 320 px Settings reflow. Browser PDF upload,
  synthetic consent, simulated provider failure, removal and clearing stale failure
  feedback after successful removal also passed, with zero extra provider calls.
- A clean source copy at ignored `tmp/handoff-20261028` initialized independent
  Supabase resources/ports, all migrations and new signing keys. Root npm ci, fresh
  restricted-role provisioning, explicit starter publication and private document
  configuration succeeded; catalog contained three published careers/roadmaps.
  Both app images built and started healthy there. The same actual-browser journey
  passed against that fresh stack with **no copied Groq key**. This is clean-directory
  acceptance on this Windows/Docker host, not a separate teammate or Linux-host trial.

Remaining verification: the complete provider/model-quality corpus, all replacement/
failure/concurrency permutations, browser registration/verification (verification was
exercised through the real Auth integration suite),
independent-host acceptance and full release regression. Production activation remains
out of scope. Human review remains pending. The previously reported 72 baseline
lint findings were addressed in the later approved cleanup; focused progress
lint also passed on 2026-10-29.

The independent test stack has been stopped with its data retained; normal local
services remain running. Its fresh source/configuration remains in ignored temporary
storage. No credentials were copied from the normal stack or printed.

## Guided manual acceptance

At `http://127.0.0.1:5173`, register/verify a synthetic account, open blank Discovery,
save an answer, refresh and resume, complete, and inspect evidence/uncertainty on results.
Choose a catalog career, open a roadmap and explicitly set focus. Mark a topic Learning,
Done, then Clear; choose the Data Analyst tool branch. Check Dashboard readback.
Open Career again and confirm it resumes focus; use its dropdown to browse alternatives.
Save Profile names and refresh. Confirm the document section says Coming later; if
an existing document is present, verify removal and dependent-result suppression.
Log out/in
and confirm independent names, Discovery, focus and progress remain. Report the exact
step, visible message and request ID on failure; never send credentials or private PDFs.

## Future work

See [future development](../future-development.md). PDF real-data activation needs
verified provider/privacy configuration; hosted operations remain outside this local milestone.

The Data Analyst practice dataset and worked reference results are authored in
[data/data-analyst-practice.md](../data/data-analyst-practice.md). The detailed
roadmap now contains five milestones, 24 topics across two tool tracks and 20
applicable topics per selected track. Local publication and repeat publication
passed on 2026-10-29, followed by mocked synthetic-account persistence acceptance.
Human content review remains pending. The publisher and renderer preserve the
existing identities and do not write user-owned state.
