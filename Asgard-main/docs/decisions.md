# Asgard: Decisions and delivery gates

## Connected MVP handoff resolution (2026-10-28)

Approver/reviewer: @YakisobaNissin, as identified by the owner in this task. Reference:
the owner's explicit “PLEASE IMPLEMENT THIS PLAN: Complete the connected MVP backend
and developer handoff” message. Scope includes additive private PDF storage/APIs,
parser dependency, synthetic local evaluation, evidence presentation, Career navigation,
guidance, portable publication and future-work records. Real-document privacy/model
quality and hosted release gates remain required. No Git publication authorized.
See [implementation and evidence](features/mvp-backend-handoff.md). Recorded task
authorization does not imply completed code review or production approval.

Updated 26 October 2026. The project owner delegated policy choices on 25 October and approved the documentation cleanup on 26 October. This register preserves existing review IDs and distinguishes selected policy from implementation evidence. [Development](development.md#current-foundation-status-and-evidence) records local foundation checks; it does not establish reviewed shared contracts, validated questionnaires, completed curricula or release acceptance.

## Password minimum resolution

PASSWORD-01, 26 October 2026. Approver: project owner. Review reference: the owner's reply to the [documentation audit plan](documentation-audit-plan.md), “implement and 8 is the new required.” Scope: eight characters is the required minimum for account passwords, superseding the former 15-character documentation default. [Security and operations](security-and-operations.md#account-access-and-recovery) owns the full policy.

The active and pending Supabase configs, frontend validator, registration feedback and existing password tests already use 8. This resolves AUD-08's policy mismatch without changing runtime source or provider settings. Static agreement does not establish hosted enforcement or final account-security acceptance. Other password, session, MFA and abuse requirements remain in force; no standards-conformance claim follows from this project-specific minimum.

## Documentation authority and unresolved integration records

The project owner approved the bounded cleanup plan on 26 October 2026 in the reply quoted above. The [audit and handoff](documentation-audit-plan.md) records DOC-01 through DOC-05, affected files, verification and remaining follow-up ownership. This approval authorizes documentation edits and the password-policy resolution; it does not grant Git publication, shared-contract approval or feature/release acceptance.

AUD-09 resolution, 26 October 2026. The project owner clarified in this task that the working Discovery flow is conditional: later question or choice sets can depend on earlier answers. This supersedes D1/F-001 wording that all five question rounds are independent and always shown. The existing five themes remain the content baseline, not a fixed route or question count. Assignment A owns proposing the route map, including mixed-interest and uncertainty paths, Back/edit behavior, and treatment of answers made inactive by changed routes. Inactive answers must not be sent for recommendations, as required by the Stage 5 assignment. The current UI is an unfinished skeleton and does not define the route structure. This clarification does not authorize inventing route content or silently clearing saved answers; those details remain for the owner-reviewed Discovery proposal. Related requirements, journeys and screen guidance are aligned to this direction. The Stage 5 task list already assigns this work and is unchanged.

AUD-10 remains open: frontmatter references to `BRIEF` identify an originating artifact absent from this checkout. Earlier approval records cite their original conversations; a durable external review reference was not supplied. These are provenance gaps, not implied new approvals. The project lead owns supplying or confirming the archived source/review references. Preserve existing IDs and recorded approval scope meanwhile.

## Team development hardening

25 October 2026 — project owner approved the bounded hardening plan in this chat. Windows 11/Docker Desktop/WSL2/PowerShell and Linux/Docker Engine/Compose plugin/Bash are the development targets. The shared Node helper and direct attachment to the CLI-managed local Supabase network preserve the approved stack; they add no feature schema, auth workflow or dependency. [Development](development.md#stage-2-hardening-evidence) owns execution evidence and explicitly leaves native Linux-host acceptance pending. A-06/A-11 and QA-11 remain partial; this approval is not a feature-contract or release approval.

## Desktop MVP scope resolution

25 October 2026 — approved by the project owner in this chat (request: “Asgard's MVP is now desktop-only”). [NFR-02](product.md#nfr-02-desktop-compatibility-and-accessible-reflow) owns the 1280–1920 px desktop/laptop scope; [Verification](verification.md#browser-accessibility-and-performance) owns its checks. Mobile-specific layout, navigation and optimization are excluded from the MVP. Existing functioning code remains; accessibility, zoom and overflow handling remain required. This resolution changes presentation scope, not the approved stack or feature contracts.

## Authority and status

- Stage 3 source plan approved by the project owner in this chat on 25 October 2026 (reply: “implement”). Scope: local email/password and confirmation, protected Profile, JWT/session authorization, dedicated database role/RLS, generated contracts and tests. At initial Stage 3 completion, authenticated entry temporarily went to `/settings/profile`; Stage 3.5 resolved that destination below. The owner also approved local-only A-01 persistence/testing before the hosted Render/session-pooler spike. This is a sequencing exception for synthetic local development, not hosted/real-user approval. The separate local-only SQL/Auth/credential activation approval was recorded and executed on 26 October 2026 without resetting local database volumes or modifying hosted resources.

## Stage 3.5 application integration

The following dated paragraphs record the original sequence. The second supersedes the first's public Preview routes. Current source status and the later Stage 4 contracts are in [Development](development.md#current-foundation-status-and-evidence); historical scope exclusions do not undo that later work.

26 October 2026 — approved by the project owner in this task, followed by approval to implement the unified-UI plan. Successful login opens Dashboard; verified registration opens Welcome / entry. The working application shares the preview's compact Dashboard / Roadmap / Settings shell and Settings components. The owner's subsequent Stage 3.5 consolidation correction supersedes the authenticated-only empty/unavailable screen replacements. Feature destinations remain protected and render the same canonical populated screens, sample fixtures and visual-state controls as public `/preview` routes. A shared demo-data notice separates sample roles, suggestions and progress from the persisted Profile. Common feature-route definitions and Profile name fields are shared; authentication/persistence and route destinations are the necessary mode differences. Successful logout returns to `/`; dirty profile changes require confirmation. Existing Supabase Auth, JWT verification, RLS and Profile API contracts remain unchanged. This resolves the temporary Stage 3 profile destination and supersedes the expanded seven-link header. Browser verification is pending owner review.

26 October 2026 — the project owner approved the [standalone Preview removal plan](stage-3.5-handoff.md) in this task (reply: “implement”). This supersedes the paragraph above only where it retains public `/preview` routes and mode-dependent destinations. The authenticated application becomes the single canonical implementation. Preserve populated shared screens, sample fixtures, components, styling and assets; migrate missing Profile prototype sections before removing disconnected duplicates. Retain verified-registration entry choice (Browse careers / Guided Discovery), returning-login Dashboard, real Supabase Auth, session restoration, protected routes, Profile API and logout. No Stage 4 contracts or Stage 5 business logic are authorized. Source verification and pending manual acceptance belong to the handoff; approval to implement does not establish rendered parity or merge approval.

- The foundation in [Architecture](architecture.md) is already approved. React/Vite, FastAPI, Supabase, Groq, Docker and the named hosts supersede older Next.js/native-only proposals.
- The delegated choices below are product/operating defaults. Their owning documents contain the requirements. A selected number is an Asgard policy unless a cited source explicitly supplies it; there is no universal standard for every UX choice or request quota.
- The project lead is initially accountable for product/content approval, architecture review and deployment. Record the actual operator contact and backup operator before external use; do not invent names or delivery availability.
- Evidence gates remain open until demonstrated. Existing architectural restrictions still apply to implementation. Auth/schema/API changes require technical review and changes require human review before merge.
- Historical exports/frontend snapshots are references. Do not rewrite them as though they implement the new baseline.

## Provider conflicts requiring evidence or an owner exception

| Gate | Finding and selected safe boundary | Owner / release effect |
| --- | --- | --- |
| AUTH-C1 | Supabase documents automatic same-email OAuth linking; REQ-13 requires explicit linking after proof of existing-account access. Preserve REQ-13. Prove provider-boundary control; a hidden button or callback rejection is insufficient | Project lead/architecture reviewer; block affected Google integration until evidence or an explicit product exception |
| AUTH-C2 | Upstream Supabase Auth now specifies recovery-code APIs, but hosted project/SDK feature flags and fresh-auth flows are unverified. Select provider-managed codes, no custom MFA/store | Architecture reviewer; block MFA enablement until issuance/redemption/rotation/disablement tests pass |
| ABUSE-C1 | Provider controls may not implement every desired destination-hour limit; an app wrapper is bypassable if direct Auth stays public | Operator/reviewer; record actual enforcement and resolve uncovered control before claiming it or opening unrestricted public recovery |
| OPS-C1 | Render Free is not a dependable background scheduler. Use external GitHub Actions cleanup/backup workflows and manual operator tasks per the execution matrix; verify missed-run detection, encrypted destination and actual free-plan budgets | Project lead/operator; block real-user operation until demonstrated, retain synthetic/local evaluation if infeasible |

These are real compatibility/evidence issues, not generic caveats to delete. See [Security and operations](security-and-operations.md) for sources and safe behavior. No provider switch or scope removal is silently authorized.

Implementation order: verified email/password foundation first. AUTH-C1 blocks Google only; AUTH-C2 blocks new MFA enrollment until enrollment/recovery/rotation/disablement are verified. Preserve existing MFA enforcement. These independent gates do not block catalog/roadmap development, and an interim build does not silently satisfy final-MVP account scope.

## Account entry and security

| ID | Selected policy | Remaining delivery evidence |
| --- | --- | --- |
| L1 | Returning users reach Dashboard; optional Resume Discovery, never automatic reopening | Route/persistence tests |
| L2 | Explicit Google linking with fresh proof of existing-account access; preserve account history | AUTH-C1; direct OAuth and collision tests |
| L3 | Provider-managed single-use recovery, atomic regeneration, fresh primary+factor for sensitive actions; no lost-all-factor/email-only bypass | AUTH-C2, concurrent use/rotation and security review |
| L4 | Compact Landing; 18+ notice without DOB; explicit Verify; neutral reset response; security-baseline password, token, cooldown and abuse policy | Provider config, mail delivery and enumeration/timing tests |

[Security and operations](security-and-operations.md) owns per-origin controls, starting thresholds, privacy, session limitations and incident response. Resend SMTP is selected; verified domain/account access is not assumed. Password recovery remains public but protected; a 40,000 requests/second example is not proof that free hosting can absorb it.

## Discovery and recommendations

### Connected prototype resolution, 2026-10-28

Recommendation repair follow-up, 2026-10-28: the same owner approved “Repair Groq validation and select from published roadmaps” in this task. For the limited prototype catalog, select one to three closest available published paths, with explicit caveats for weak/mixed/uncertain connections. This supersedes the earlier empty-selection catalog-gap choice below for new generations; historical gap outcomes remain readable. The provider returns request-scoped candidate/evidence keys and the backend resolves snapshot IDs. Total completion budget defaults to 4,096 tokens, configurable within 1,024–8,192; final explanations remain short. Public response fields, schemas and database grants are unchanged. Narrow tests and one synthetic live provider call are authorized; broader verification remains deferred. [Repair evidence](features/connected-prototype.md#recommendation-repair-evidence-2026-10-28) distinguishes live validation from the subsequent mocked-provider persistence replay.

Approved by the project owner, identifying themselves in this task as `@YakisobaNissin`, through “PLEASE IMPLEMENT THIS PLAN: Connected prototype with saved Discovery and Groq recommendations.” This authorizes the bounded Discovery definition/persistence contracts, Groq recommendation implementation, additive catalog-gap outcome and local content publication. It is not completed runtime, model-quality or independent code-review evidence.

For this local prototype, one activities stage branches after interests: single tools/design/investigation/systems interests select their authored activity variants; mixed interests or uncertainty select the general activity variant. Approach, background and goals remain shared. Inactive branch answers are retained for restoration and excluded from completion and provider context. New sessions are blank; retakes copy the prior completed answer set. This resolves AUD-09 for this bounded route; deeper branching remains deferred.

Groq is now included in the prototype scope, superseding the earlier task's temporary AI deferral. Publish three brief paths (Frontend Developer, Data Analyst and UI/UX Designer), allow a truthful catalog-gap outcome instead of forced matching, and keep focus/progress changes explicit. Tests, builds, browser checks and live provider validation remain deferred by the owner. The [implementation guide](features/connected-prototype.md) records source, local publication and remaining work.

| ID | Selected policy | Remaining delivery evidence |
| --- | --- | --- |
| D1 | Retain the five existing themes and wording areas as the content baseline; later question/choice sets may depend on earlier answers. Entry unselected; baseline checkbox/radio and uncertainty policies apply subject to the reviewed route map. Assignment A proposes routing, mixed-interest/uncertainty behavior, and inactive-answer handling. Explicit saved checkpoints, separate retake draft and version-conflict recovery | F-001 controls/persistence tests, reviewed route proposal and comprehension study |
| D2 | Up to three distinct published roles with supported reasons/evidence; broad uncertain context spans categories where eligible. Individual View roadmap plus Browse careers; no result-selection prerequisite or match scores | Catalog relevance attributes and output validation |
| D3 | Discovery final submit requests once. Relevant focus/branch/progress/PDF changes mark context outdated; explicit Update suggestions, same-revision reuse, no generation on visits. Removed-document-dependent results are suppressed | F-002 concurrency/quotas, stale/removal tests and quality gate |

D3 is no longer parked. Input boundaries, prompt policy, logical output fields and budgets are in [F-002](specs/career-recommendations.md). Candidate models remain candidates until evaluated; no career-fit or competence assessment is claimed.

## Dashboard and shared guidance

| ID | Selected policy | Remaining delivery evidence |
| --- | --- | --- |
| H1 | First name completes basic profile; optional photo/PDF. Shared account-level message dismissal across pages/devices. Priority: Resume Discovery, basic profile, Start Discovery, optional Careers background prompt. Profile uses inline help | Eligibility, dismissal and save tests |
| H2 | Dashboard Not Started/In-Progress/Complete groups; Skipped only in roadmap and unfinished | State/group tests |
| H3 | Fully Done versus Done/Skipped exhaustion stay distinct; no empty published milestones | Counts/end-state/content checks |
| H4 | Explicit current roadmap; resolve existing Learning topic before conflicting focus/branch/new Learning action | Cancel/failure/partial/concurrent saves |
| H5 | Current-month activity calendar with previous-month navigation and daily Done counts | Local-date deduplication/undo tests |
| H6 | No streak freezes; yesterday's streak survives pending today, a full inactive local day breaks it; historical dates stable after timezone change | Midnight/timezone/undo tests |

Continue learning opens the topic. Separate View milestone links to its roadmap position; remove the placeholder role quote. The roadmap uses ordered expandable milestones and a topic panel, with content-driven card sizing and authored language alternatives. Hide completed filters presentation only; selection, Learning, Done and Skipped are distinct.

## Catalog and content

| ID | Selected policy | Remaining delivery evidence |
| --- | --- | --- |
| C1 | Six categories/seven named launch roles. Each catalog card has direct View roadmap; Set as current roadmap belongs inside detail. No catalog topic-status groupings | All seven curated explanations/introductory paths, search/filter/URL tests |
| C2 | Foundations, starter tools and practical outcome; each topic has explanation and ≥1 free resource. Project lead approves content; editor/source/license/review date per role; link review before release and every 90 days | Authored curricula and editorial review, not fabricated from repeated cards |
| C3 | Stable identities; each learning topic belongs to one milestone within a roadmap. Explicit common/alternative membership; grouping headings have no status. No silent alternative default; withhold full-path percentage until required choice | Stage 4 schema/constraints exist with local integrity evidence; technical review, authored content and denominator service tests remain |
| C4 | Explicit branch changes preserve histories and resolve an excluded Learning topic first | Branch-switch tests |
| C5 | Copy/link corrections retain state; changed outcomes get new identities. Retired topics preserve history/activity, leave future suggestions/denominators, show revision explanation; no silent focus/status transfer | Stable identity/revision storage exists; publication/retirement services, content review and behavioral tests remain |

The owner rejected a blanket shorter-card prescription: actual authored content/choices determine height. A tree canvas/pan/zoom is no longer required. Product publication/revision policy owns details; no curricula were authored or approved in this documentation review.

## Profile and data lifecycle

| ID | Selected policy | Remaining delivery evidence |
| --- | --- | --- |
| S1 | First name 1–100 Unicode characters, optional Surname 0–100; optional bounded re-encoded photo. Explicit separate Save profile/Save preferences, dirty-form protection | Validation, image processing and save/conflict tests |
| S2 | Separate Groq extraction of contact-redacted selectable PDF text; logical skills/education/experience/projects with checked page/span evidence. Explicit Analyze PDF; automatic application only on valid current success | Encoded/reviewed contracts, hosted ZDR/privacy setup and synthetic PDF suite |
| S3 | Replace/Remove correction; no individual-fields editor or mandatory review screen | Replacement/removal/late-job tests |
| S4 | Active original until replacement/removal/deletion; exclude removed context immediately. 24-hour active-storage document purge, 7-day account purge/backup expiry, 30-day bounded logs/results per security baseline. Durable access block before deletion acknowledgment | Purge jobs, provider settings, deletion ledger and isolated restoration |

## Quality and operations

| ID | Selected policy | Remaining delivery evidence |
| --- | --- | --- |
| Q1 | Adults 18+, all experience levels, English, broadly applicable content; notice without DOB collection | Copy review |
| Q2 | WCAG 2.2 AA target; selected browser/viewport and keyboard/screen-reader matrix in verification.md | Recorded manual and automated checks; no conformance claim yet |
| Q3 | Warm p95 ≤2s under 20 active users, feedback ≤1s, separate 90s cold-start budget, 30s recommendations/120s PDF. Free-tier availability observed, no uptime promise. Daily encrypted backup, RPO 24h/RTO one working day | Measurements, configured alerts/budgets, restore drill and host limits |
| Q4 | 30 synthetic profiles ×3/model, 20 PDFs, written reviewer thresholds, five-person comprehension study; QA-01–12 evidence map | Executed results/reviewer records |

## Engineering and delivery

| ID | Selected direction | Remaining work |
| --- | --- | --- |
| E1 | Approved modular monolith in architecture.md; no stack replacement | Local scaffold/restricted-role source and RLS probe are recorded; hosted session-pooler/TLS/reconnect evidence remains |
| E2 | FastAPI Pydantic/OpenAPI with generated TS client; SQL migrations sole authority; transactional invariants and revision guards | Two migrations and generated scaffolding exist with local checks; shared technical review and feature implementation remain |
| E3 | Groq adapter, strict validation and budgeted execution; independent extraction/ranking/authored-next-topic modules | Candidate evaluation, provider settings and integration tests |
| E4 | Compose/local Supabase, Node 24/Python 3.13 lines, npm and hashed pip locks; Vercel/Render/Supabase hosted demo | Pins, helper, locks and source/build CI workflow exist; independent fresh-host/native Linux, hosted CI and deployment/provisioning evidence remain |
| E5 | Project lead initial reviewer/operator; dependency order in development.md and mandatory PR review | Real contacts/access, backup operator, calendar availability and achievable delivery schedule |

## Research and review boundary

The security baseline cites OWASP, NIST and provider documentation for security mechanisms. F-001 cites government UI guidance for input controls; verification cites W3C and Web Vitals. Request quotas, result count, prompt eligibility and processing budgets are Asgard decisions informed by those sources, not universal standards. Raw personal data, unsupplied team names, provider-account settings and test outcomes were not invented.

Next implementation tasks must satisfy their own gates; no feature should wait on unrelated evidence. AUTH-C1 and AUTH-C2 require explicit resolution before the affected integrations. The remaining content, provisioning, technical review and test tasks cannot honestly be marked complete by editing documentation.
