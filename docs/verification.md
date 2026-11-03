# Asgard: Verification and release gates

Recorded October core/browser acceptance is linked from Development and the deployment-preparation guide. November publication/resource/TypeScript evidence is in the roadmap-content-expansion guide; authenticated November layout acceptance is pending. The criteria below remain a verification target, not a report that this documentation change ran them.

## Current local MVP scope — 2026-11-02

The approved [local evaluation resolution](decisions.md#local-evaluation-mvp-resolution-2026-11-02) governs this document's current delivery scope. [Development](development.md#current-local-mvp-status-2026-11-02) records source and dated evidence. Requirements and acceptance IDs below are preserved; inclusion is not a claim that their checks passed.

REQ-01/REQ-13 account recovery, Google linking and deletion; REQ-11 photo/PDF and new MFA lifecycle; REQ-08/REQ-09 shared conflict-resolution dialog; and REQ-10 chronological recent completions are deferred portions for this local MVP. Detailed Profile answer summaries and richer guidance are also deferred. Existing PDF removal/cleanup and existing session/MFA enforcement remain. Future capabilities below retain their security constraints but do not become enabled or accepted through this scope change.

The current baseline includes saved Discovery and blank retakes, suggestions when Groq is configured, catalog/roadmap browsing, explicit learning saves, Dashboard summaries/calendar/streak, names and separate preferences. Conflicting Learning changes are rejected and resolved manually before retry. Twelve roadmaps are locally published; independent curriculum review and current authenticated browser acceptance remain pending. Earlier scope statements below requiring these deferred features for MVP now describe the future public-product target.

25 October 2026. Selected acceptance plan; partial local foundation/UI execution evidence is recorded in [Development](development.md). No complete release gate is claimed by that partial record. Requirements remain in [product](product.md), interactions in [pages](pages-and-interactions.md), and security policy in [security and operations](security-and-operations.md). Evidence, not document completion, determines release readiness.

Status pointers updated 26 October 2026: [current foundation evidence](development.md#current-foundation-status-and-evidence) includes source checks, generated-contract synchronization and the recorded local Stage 4 integrity/RLS probe. [Current CI coverage](development.md#current-ci-coverage) defines source/unit/contract/build checks, not migration reproducibility or end-to-end feature acceptance. [Stage 3.5 manual navigation](stage-3.5-handoff.md#manual-navigation-checklist-pending), native Linux/independent fresh-host, hosted Auth/provider, maintenance/restore and final QA gates remain pending. Verify the recorded [8-character minimum](decisions.md#password-minimum-resolution) at both frontend and receiving service; static config agreement alone is not hosted acceptance.

## Browser, accessibility, and performance

Use current stable Chrome, Edge and Firefox on Windows; Safari on macOS. Record exact versions at release. Test desktop/laptop viewports at 1280×800, 1440×900 and 1920×1080; also check 320 CSS-pixel reflow and 200%/400% browser zoom. Mobile-specific verification is outside MVP scope under NFR-02. Playwright WebKit is useful coverage but does not replace an actual Safari check.

Walk account entry, Discovery, catalog, roadmap, Dashboard and Settings by keyboard. Test NVDA with Firefox on Windows and VoiceOver with Safari on macOS. Check focus return, labeled code fields, error summaries/inline errors, live save feedback, dialog focus, non-color states, touch targets, and reduced motion. Automated accessibility checks supplement manual WCAG 2.2 AA review. [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

Milestones use accordion headers with button semantics, expanded state, and associated panels; Enter/Space toggle without changing topic progress. Multiple milestones can stay open. [WAI accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/).

Adopt LCP ≤2.5 seconds, INP ≤200 ms, CLS ≤0.1 as targets, not measured claims. Use the 75th percentile by device when field data is available; label lab-only results. Warm API reads/writes target p95 ≤2 seconds under 20 active users. Show pending feedback within 1 second. Measure cold starts separately: allow up to 90 seconds of explicit startup feedback, then a recoverable failure; do not retry mutations blindly. Free-tier hosting has no uptime commitment; track observed monthly availability. The earlier 99% figure is an improvement objective, not a release promise. [Web Vitals](https://web.dev/articles/vitals), [Render Free](https://render.com/docs/free).

## Required evidence matrix

| ID | Requirement coverage | Required evidence |
| --- | --- | --- |
| QA-01 | REQ-01/13 | Google/email entry, verification code, invalid/expired/resend, known/unknown reset responses, password change, OAuth cancellation, expired sessions; AUTH-C1 compatibility evidence |
| QA-02 | REQ-11/13 | TOTP enrollment, direct-API AAL enforcement, recovery code once-only consumption under concurrent requests, rotation/ambiguous response, lost-all-factor state, fresh-auth and disablement; AUTH-C2 evidence |
| QA-03 | REQ-04; F-001-AC-01–08 | Per-round controls, exclusive uncertainty, Back/resume/skip, explicit saves, concurrent draft conflict, final submission and failed retake |
| QA-04 | REQ-02/03/07 | Seven reviewed launch roles, six categories, search by role/skill, filter reset, direct View roadmap, role explanation, authored alternatives, resources and desktop/keyboard panels |
| QA-05 | REQ-08/09/10 | Explicit focus, branch/topic switching with resolution, cancel/failure/partial outcomes, cross-tab single Learning topic, per-roadmap state, Done-only counts, Hide completed, retained skipped topics |
| QA-06 | REQ-10 | Empty/start/completed/exhausted Dashboard, continuation, calendar deduplication/undo, midnight/timezone changes and streak rules |
| QA-07 | REQ-10/11 | Explicit profile/preference saves, dirty-form exit, name/photo limits, shared-banner eligibility/dismissal across pages/devices, no recommendation claim from name/photo |
| QA-08 | REQ-05/11; F-002-AC-01–12 | Recommendation/PDF quality suite, schema/reference rejection, provider failure/timeouts, quotas/idempotency, removed/superseded context and out-of-order results |
| QA-09 | NFR-04–07 | Anonymous/owner/other-account/admin matrix for every protected record and file; malformed uploads, prompt injection, secrets/log inspection, deletion access block with still-unexpired JWT |
| QA-10 | NFR-05/07/10 | Safe nonproduction abuse test: direct Auth CAPTCHA rejection, email cooldowns, shared-IP behavior, persisted quotas across restarts/workers, 429/backoff, budget exhaustion, unavailable limiter and sanitized aggregate logs |
| QA-11 | NFR-08/09 | New developer bootstrap, migrations/grants/RLS/pooler, OpenAPI client drift, container builds, daily backup and isolated restore including Storage/removal ledger, hosted cold-start and local fallback |
| QA-12 | NFR-01–03 | Browser/device matrix, keyboard/screen-reader walkthroughs, zoom/reflow/contrast, warm/cold performance results with conditions |

Abuse tests use owned nonproduction infrastructure, bounded request rates, mocks or local load generation. A 40,000 requests/second story is a threat scenario, not a required live test or evidence of capacity.

## AI quality gate

Compare the two architecture-approved candidate models on the same 30 synthetic profiles, three runs each: beginners, mixed/uncertain interests, each launch category, no Discovery, progress/focus changes, PDF-supported context, and adversarial instructions. Require zero invalid catalog IDs, ownership leaks, invented competencies, numeric suitability claims or prompt-instruction overrides across accepted outputs. Reject malformed outputs; do not count rejected generations as valid quality results.

Two reviewers score evidence support and explanation usefulness on a written 1–5 rubric. At least 90% of valid recommendations must score ≥4 for support and ≥3 for usefulness; at least 90% of attempted generations must complete validly within the configured budget in the controlled environment. This is an Asgard evaluation threshold, not a validated career-fit score. Report disagreements and failure rates. Prefer the cheaper/faster model only if it meets the same gate; otherwise retain 120B as the candidate and block release until it passes. Do not invent evaluation results.

Use 20 synthetic PDFs covering usable, sparse, irrelevant, malformed, scanned, encrypted, oversized, multi-page, malicious-instruction, replacement/removal and provider-failure cases. Require every accepted extracted item to match its quoted source span/page, zero unsupported facts, ≥90% recall for explicitly annotated in-scope facts, and zero stale-context application. Extraction failure must preserve earlier successful context.

For comprehension, run five adult participants including beginners and readers using English as an additional language. Ask them to explain the question/control rules, why a suggestion appeared, how opening differs from setting current, and how to resume a topic. Any misunderstanding that prevents the protected journey requires a revision and retest. This small study is usability evidence, not statistical validation of career suitability.

## Release record

Before marking QA-11 passed, run maintenance with Render stopped, intentionally skip a scheduled run, verify independent missed-run notification and manual catch-up, and retry a partially completed purge without reactivating access. Verify encrypted backup restoration includes required Storage objects and respects the deletion ledger. Record repository-plan minutes/storage limits and actual job resource use. OPS-C1 is not passed by writing a workflow or observing one successful cron run.

Email/password foundation acceptance can proceed independently of AUTH-C1/C2. The record must separately mark Google and MFA as not enabled/not verified until their gates pass; do not count an interim build as final-MVP account acceptance or disable MFA for existing enrolled users.

Record each gate as Pass, Fail, or Not run, with date, environment/version, review outcome and artifact link. All required final-MVP gates must pass; label any demo exception explicitly under Product scope. Content authoring, real account/domain provisioning, provider compatibility, engineering review and execution evidence cannot be replaced by selecting defaults. Final review is required; code changes require a reviewed PR before merge.
