> Implementation record. Dated sections preserve their original evidence and limitations. For current behavior and activation status, use the [documentation baseline](../README.md) and linked owning specifications. Earlier plans do not override later recorded decisions.

# Hosted feature activation

Implementer: Codex. Created/updated: 2026-11-16. Reviewer/operator:
@YakisobaNissin. Requirements FUT-10/FUT-13, REQ-12, QA-09.
Owner approved hosted photos/PDFs and Groq processing in chat on 2026-11-16.
Status: implemented locally; focused checks passed, human review and hosted acceptance pending.
Authority: [architecture](../architecture.md), [deployment](../deployment.md),
[performance](hosted-content-performance.md), [photos](local-profile-photo.md).

## Implemented behavior

Hosted flags validate dependencies instead of rejecting photos/PDF processing.
Photos retain private owner paths, validation, JPEG re-encoding, version checks,
replacement/removal and queued cleanup. PDF parsing keeps the isolated subprocess,
file/page/text bounds and timeout. One parser runs per process; queue acquisition
expires after two seconds with a recoverable pdf_busy error. Filtered PDF sections
are sent to Groq; original files remain in private Supabase Storage. Resume skill
review preserves explicit user confirmation; extraction does not establish ability.
Existing authentication, isolation, redaction and deletion rules remain.

Recommendation state batches candidate runs, eligibility and items, while run
formatting preserves existing schema/version/outdated rules. Catalog waits for
category/preferences before requesting recommendations. Dashboard activity waits
for primary state/preferences so its timezone is correct and it competes later.
No new API contracts, schema migrations or dependencies.

Sources: backend core/config, documents/provider and service, profiles/photos,
recommendations/service; frontend RoleCatalog and DashboardScreen; render.yaml.

## Operator activation

Existing Singapore service is manually configured; changing render.yaml does not
prove its settings changed. Configure these privately in Render Environment:

- ASGARD_STORAGE_SERVICE_KEY: Supabase server-side Storage credential compatible
  with the current Bearer gateway. Never put it in Vercel/VITE_ variables.
- ASGARD_GROQ_API_KEY: existing Groq credential; reuse it if already configured.
- ASGARD_GROQ_MODEL=openai/gpt-oss-120b.
- ASGARD_AUTH_ENABLED, ASGARD_GROQ_ENABLED, ASGARD_AI_GUIDANCE_ENABLED,
  ASGARD_DOCUMENTS_ENABLED, ASGARD_DOCUMENTS_PROCESSING_ENABLED,
  ASGARD_DOCUMENTS_REAL_DATA_APPROVED, ASGARD_RESUME_SKILL_REVIEW_ENABLED,
  ASGARD_PROFILE_PHOTOS_ENABLED: true after reviewed backend support is deployed.
- Optional ASGARD_EXA_API_KEY and ASGARD_AI_SEARCH_DOMAINS for allowed web search.

Existing migrations provision private asgard-documents and asgard-profile-photos
buckets. Verify their presence and private status; do not duplicate them or make
public. Keep database runtime asgard_app and verify-full TLS unchanged.
Blueprint defaults now enable these features and request the two private keys;
activation fails clearly when required dependencies are missing.

MFA enrollment is a separate Vercel VITE_MFA_ENROLLMENT_APPROVED setting. Its
recovery/fresh-auth capability checks remain required. Google OAuth requires
provider credentials and URL configuration; neither is enabled by a file flag.
This change does not restore previously removed W07 reflection UI or implement
proposed backlog features.

## Cleanup

Existing opportunistic cleanup remains. Within the backend container, run
`python scripts/cleanup_private_files.py` with a privately supplied
ASGARD_MAINTENANCE_ACCESS_TOKEN for the target account. The tool verifies the
session and uses the restricted repository boundary. It processes bounded due
objects, preserves failed work for retry and never enumerates other accounts.
The token is not a permanent scheduler credential: expired/revoked sessions fail.
Unattended cleanup across inactive accounts still requires a separately reviewed
maintenance identity/scheduler; this command does not claim to provide it.

## Verification and manual acceptance

74 focused backend tests passed across two targeted runs, including recommendation
eligibility and existing ownership/session checks; one opt-in real-database guard
test skipped.
Six frontend tests, TypeScript, changed-source lint and production build passed.
The recommendation aggregate executed successfully on the local migrated schema
with an empty account scope. No hosted success, provider output or performance
claim. Broader live photo/PDF ownership and deletion acceptance remain pending.

At https://asgard-navy.vercel.app/settings/profile, upload a disposable still
image, save, refresh, replace and remove it. Confirm old photos disappear and
another account cannot read them. Upload a synthetic selectable-text PDF with
Skills/Education/Experience sections; analyze, review exact evidence, confirm
skills, replace then remove. Verify unsupported/encrypted/scanned PDFs return
recoverable errors and provider failure preserves saved state. Run cleanup for
the testing account and confirm queued deletion drains. Test overlapping uploads,
version conflicts and two-account isolation. Exercise a real counselor answer
and recommendation refresh. Separately test MFA/recovery following its guide.
Report safe request IDs, expected/actual behavior, request counts and timings.

Deploy reviewed backend first, configure credentials, then deploy frontend.
Rollback by disabling file flags or reverting deployments; keep cleanup access
available for previously stored files. No database reset is required.
