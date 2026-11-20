# Asgard: Decisions and delivery gates

DISCOVERY-V4, 2026-11-20: project owner selected balanced experience influence,
stable phases with live progress, published app content only, and at most one
explained alternative outside selected fields; then explicitly requested plan
implementation and prepared migration scripts/steps. Implementer Codex; reviewer
@YakisobaNissin. Source and additive scripts prepared; no v4 application or hosted
activation performed. [Implementation](features/guided-discovery-v4.md),
[operator steps](deployment-discovery-v4.md). Final technical review and live v4
acceptance remain pending.

DISCOVERY-V3 (2026-11-20, project owner/codeowner @YakisobaNissin in chat):
approved the overhaul end to end and requested implementation of the reviewed
plan. Selections: required experience input on the experience branch, adaptive
questions, combined-interest scenarios, deterministic results with optional AI
elaboration, authored roadmap first steps, and removal of the goals question.
Source implemented by Codex; live acceptance and final review remain pending.
See [plan](plans/discovery-v3.md) and [feature guide](features/guided-discovery-v3.md).

Consolidated baseline: 2026-11-17. This register retains recorded owner decisions and stable IDs. Consolidation does not approve unresolved requirements, grant environment activation, or claim completed technical review. The [archived register](archive/2026-11-17/decisions.md) preserves dated approvals and their original scope without treating old plans as current instructions.

<a id="password-minimum-resolution"></a>

<a id="w05-guided-discovery-revision-scope-2026-11-09"></a>

## Current resolutions

- PH-SALARY-01 clarification (2026-11-20, project owner in chat): requested a general “gist on average starting,” permitting researched, explicitly labeled starting-pay estimates using broader job families. The owner corrected the obsolete twelve-role assumption; cover the full published catalog (currently 23), including the 11-role expansion. This supersedes the initial exact-reference-only salary presentation, not the shared API or recommendation boundaries. See [specification](specs/career-exploration-comparison.md#philippine-salary-and-organization-update-2026-11-20). Codex implements; @YakisobaNissin review and owner Chrome acceptance remain pending.

- PH-SALARY-01 / COMPARE-ORG-01 (2026-11-20, project owner in chat): “implement” approves the [comparison salary and organization plan](plans/comparison-ph-salary-2026-11-20.md). Permit bounded attributed Philippine salary snapshots, explicit missing coverage and clearer labeled sections/icons. Supersedes the comparison specification's no-new-dataset boundary only for this snapshot; live feeds and recommendation inputs remain outside scope. Implementer: Codex; technical reviewer: @YakisobaNissin, review pending. No shared API, migration, dependency or Git publication change.

- SKILL-EVIDENCE-03 (2026-11-19, project owner in chat): selected “One evidence count,” automatic resume interpretation, and “Supported equivalence,” then approved implementation with “implement.” Add applicable Done-topic evidence to Roadmap skills; retain separately labeled reports, resume passages and interpreted wording; count each skill once. Permit automatic equivalent-wording interpretation with validated IDs/source quotes, excluding broad or uncertain implications. Authorize the bounded private interpretation migration and additive API/client changes in the reviewed plan. Codex implemented locally; @YakisobaNissin technical review and live acceptance pending. No hosted migration, deployment or Git publication authorized. [Owning specification](specs/competency-comparison.md), [implementation](features/competency-comparison.md).

- PDF-EXTRACT-03 (2026-11-19, project owner in chat): “ok implement” approves bounded sequential chunks and source-ID evidence reconstruction from the researched script-based approach. Maximum four chunks plus one transient retry across the analysis, shared reservation for every call, local deduplication, original page evidence and all-or-nothing replacement. Preserve the public API, existing item/output/deadline limits and account isolation. Codex implemented locally; technical reviewer @YakisobaNissin, review/live hosted acceptance pending. See [PDF guide](features/pdf-reading.md).

- PDF-QUOTA-02 (2026-11-19, project owner in chat): "Remove the PDF attempt limit and cooldown." Remove PDF-specific hourly/daily account caps and the Profile countdown. Preserve the shared application/provider budget, one in-flight analysis, normal request/file limits and reservation records. Supersedes only PDF 3/hour and 5/day; recommendation quotas remain. Implementer: Codex; technical reviewer @YakisobaNissin, review pending. No deployment or pipeline redesign is authorized by this record. See [PDF guide](features/pdf-reading.md).

- MFA-RECOVERY-01 activation override (2026-11-19): the owner/codeowner explicitly requested "enable it now. override. tell me what to do for enable" for the existing hosted Asgard environment. Render's deployment configuration enables recovery and prompts for its backend-only Auth admin credential. This accepts proceeding before the recorded live-provider/manual gate is complete; those checks remain unverified, not passed. The migration, credential validation, fresh-auth proof, pending access block and provider AAL2 verification remain required. No commit, push or actual hosted change is recorded by this entry. See the [activation instructions](features/application-recovery-codes.md#owner-activation-override-2026-11-19).

- MFA-RECOVERY-01 (2026-11-19): the owner requested application-managed backup codes and approved the bounded password-plus-code authenticator-replacement implementation, identifying themselves as codeowner @YakisobaNissin in chat. The [ADR](adr/2026-11-19-application-recovery-codes.md) records the exception to provider-managed-only recovery. Supabase TOTP/AAL2 enforcement stays authoritative; source implementation, review and hosted acceptance are distinct. No Git publication or hosted activation was approved.

- ACCOUNT-ACCESS-01 review, 2026-11-19: the owner identified themselves as the designated @YakisobaNissin reviewer and approved the implemented bounded changes in chat. See the [approval record](features/account-access-fixes.md). Hosted/manual acceptance and deletion activation prerequisites remain open; no Git publication operation was authorized.

- ACCOUNT-ACCESS-01 (2026-11-19, project owner in chat, reviewed implementation plan): show explicit duplicate-registration feedback from supported provider responses; offer email recovery from signed-in Account and security. Validate sign-in, signup and reset passwords at eight Unicode characters minimum and 72 UTF-8 bytes maximum, and auth emails at 254 characters maximum with format validation. Preserve existing Unicode-name rules. Technical review remains assigned to @YakisobaNissin; hosted activation is not approved by this entry.

- Approved architecture: React/Vite, FastAPI, Supabase PostgreSQL/Auth/Storage, SQLAlchemy restricted-role access, versioned SQL, generated API contracts, Docker development, and backend-only Groq integration. See [Architecture](architecture.md).
- PASSWORD-01: the minimum is eight characters, replacing the former fifteen-character documentation default. [Security policy](security-and-operations.md#account-access-and-recovery) owns the remaining controls.
- Discovery v2 supersedes the original fixed-five and later 8–10-question proposals for new sessions. Existing drafts keep their version; retakes start blank. [Current specification](specs/discovery.md).
- Completed v2 uses saved deterministic first results without a provider call. Older/provider-backed results keep their own refresh, evidence, quota, and privacy rules. Optional AI refinement remains proposed rather than silently enabled.
- Only published careers with authored roadmaps enter the recommendation roster. ESCO references do not automatically become Asgard career paths. Old three-, seven-, and twelve-career counts describe earlier releases.
- Roadmap experience comparison and its recommendation links are disabled by the 2026-11-16 direction. Profile skill editing, resume review, and two-career comparison remain separate capabilities.
- W07 practice/reflection presentation is dormant after the recorded simplification. Preserve stored records and APIs; reactivation needs a new task.
- Hosted photo/PDF/Groq source activation was authorized on 2026-11-16. Configuration dependencies, privacy rules, and pending hosted acceptance still apply. See [activation](features/hosted-feature-activation.md).
- Longest streak is implemented from recorded qualifying local days; it does not change current-streak rules. See [streaks](features/learning-streaks.md).
- Account deletion is implemented with a durable access block and resumable purge. Activation remains gated on reviewed migration, protected maintenance, monitoring, ledger preservation, and disposable-account acceptance. See [account deletion](features/account-deletion.md).
- Desktop/laptop scope remains 1280–1920 px with accessible reflow, keyboard access, and zoom checks. This is not a mobile-optimization commitment.

## Retained policy IDs

These policies are interpreted with the current resolutions above and their owning specifications. Historical delivery-status columns have moved to the archive; they are not current acceptance results.

| ID | Policy |
| --- | --- |
| L1 | Returning users reach Dashboard; optional Resume Discovery, never automatic reopening |
| L2 | Explicit Google linking with fresh proof of existing-account access; preserve account history |
| L3 | MFA-RECOVERY-01: application-managed single-use backup codes authorize restricted TOTP replacement; atomic rotation, fresh primary+factor for code management, real provider AAL2 after replacement; no lost-all-factor/email-only bypass |
| L4 | Compact Landing; 18+ notice without DOB; explicit Verify; neutral reset response; security-baseline password, token, cooldown and abuse policy |
| D1 | Guided Discovery v2: four-to-six-question conditional route, up to two field/activity choices, exclusive uncertainty, versioned checkpoints, inactive-answer exclusion, and blank full retakes. |
| D2 | Up to three distinct published roles with supported reasons/evidence; broad uncertain context spans categories where eligible. Individual View roadmap plus Browse careers; no result-selection prerequisite or match scores |
| D3 | Completed v2 automatically prepares missing/outdated deterministic first results and reuses eligible saved results; bounded transient recovery. Provider-backed refresh retains explicit consent, quotas, revisions, and removal protections. |
| H1 | First name completes basic profile; optional photo/PDF. Shared account-level message dismissal across pages/devices. Priority: Resume Discovery, basic profile, Start Discovery, optional Careers background prompt. Profile uses inline help |
| H2 | Dashboard Not Started/In-Progress/Complete groups; Skipped only in roadmap and unfinished |
| H3 | Fully Done versus Done/Skipped exhaustion stay distinct; no empty published milestones |
| H4 | Explicit current roadmap; resolve existing Learning topic before conflicting focus/branch/new Learning action |
| H5 | Current-month activity calendar with previous-month navigation and daily Done counts |
| H6 | No streak freezes; yesterday's streak survives pending today, a full inactive local day breaks it; historical dates stable after timezone change |
| C1 | Six categories; published roadmap-backed careers are recommendation candidates. The original seven-role minimum and twelve-role inventory are historical counts, not a permanent roster limit. |
| C2 | Foundations, starter tools and practical outcome; each topic has explanation and ≥1 free resource. Project lead approves content; editor/source/license/review date per role; link review before release and every 90 days |
| C3 | Stable identities; each learning topic belongs to one milestone within a roadmap. Explicit common/alternative membership; grouping headings have no status. No silent alternative default; withhold full-path percentage until required choice |
| C4 | Explicit branch changes preserve histories and resolve an excluded Learning topic first |
| C5 | Copy/link corrections retain state; changed outcomes get new identities. Retired topics preserve history/activity, leave future suggestions/denominators, show revision explanation; no silent focus/status transfer |
| S1 | First name 1–100 Unicode characters, optional Surname 0–100; optional bounded re-encoded photo. Explicit separate Save profile/Save preferences, dirty-form protection |
| S2 | Separate Groq extraction of contact-redacted selectable PDF text; logical skills/education/experience/projects with checked page/span evidence. Explicit Analyze PDF; automatic application only on valid current success |
| S3 | Document replacement/removal corrects extracted context. Resume-assisted Profile skills require user confirmation and remain distinct from automatic document analysis. |
| S4 | Active original until replacement/removal/deletion; exclude removed context immediately. 24-hour active-storage document purge, 7-day account purge/backup expiry, 30-day bounded logs/results per security baseline. Durable access block before deletion acknowledgment |
| Q1 | Adults 18+, all experience levels, English, broadly applicable content; notice without DOB collection |
| Q2 | WCAG 2.2 AA target; selected browser/viewport and keyboard/screen-reader matrix in verification.md |
| Q3 | Warm p95 ≤2s under 20 active users, feedback ≤1s, separate 90s cold-start budget, 30s recommendations/120s PDF. Free-tier availability observed, no uptime promise. Daily encrypted backup, RPO 24h/RTO one working day |
| Q4 | 30 synthetic profiles ×3/model, 20 PDFs, written reviewer thresholds, five-person comprehension study; QA-01–12 evidence map |
| E1 | Approved modular monolith in architecture.md; no stack replacement |
| E2 | FastAPI Pydantic/OpenAPI and generated TypeScript define wire contracts; versioned SQL defines schema. Shared changes preserve transactions, ownership, and revision guards. |
| E3 | Groq adapter, strict validation and budgeted execution; independent extraction/ranking/authored-next-topic modules |
| E4 | Compose/local Supabase, Node 24/Python 3.13 lines, npm and hashed pip locks; Vercel/Render/Supabase hosted demo |
| E5 | Project lead initial reviewer/operator; dependency order in development.md and mandatory PR review |

<a id="documentation-authority-and-unresolved-integration-records"></a>

## Unresolved compatibility and release gates

| ID | Boundary | Owner |
| --- | --- | --- |
| AUTH-C1 | Explicit Google linking must be proved at the provider boundary; keep conflicting behavior disabled | Architecture reviewer/operator |
| AUTH-C2 | New MFA enrollment requires the MFA-RECOVERY-01 backup-code replacement, provider/session, notification and fresh-auth lifecycle acceptance; preserve existing enforcement | Architecture reviewer/operator |
| ABUSE-C1 | Verify actual provider-side abuse/rate controls, including direct Auth requests | Operator |
| OPS-C1 | Prove scheduled maintenance, missed-run detection, backup destination, and isolated restore; workflow files alone are insufficient | Operator |
| AUD-10 | Originating BRIEF and durable external references for early conversation approvals remain absent | Project lead |

The owner/reviewer account mapping remains in [CODEOWNERS](../.github/CODEOWNERS). No personal contact information or workstation path is required in public documentation. Contributor credit and approval attribution remain in dated evidence. [Future development](future-development.md) owns deferred work; [Verification](verification.md) owns acceptance.

## Historical references

Earlier headings remain addressable for incoming links. Their linked records describe the dated work only; current policy and status are above.

<a id="longest-activity-streak-approval-2026-11-16"></a>

[Longest activity streak approval, 2026-11-16](archive/2026-11-17/decisions.md#longest-activity-streak-approval-2026-11-16).


<a id="w08-implementation-scope-2026-11-06"></a>

[W08 implementation scope, 2026-11-06](archive/2026-11-17/decisions.md#w08-implementation-scope-2026-11-06).

<a id="occupational-reference-scope-2026-11-06"></a>

[Occupational reference scope, 2026-11-06](archive/2026-11-17/decisions.md#occupational-reference-scope-2026-11-06).

<a id="w03-profile-and-resume-reader-scope-2026-11-06"></a>

[W03 Profile and resume-reader scope, 2026-11-06](archive/2026-11-17/decisions.md#w03-profile-and-resume-reader-scope-2026-11-06).

<a id="w04-local-recommendation-activation-2026-11-06"></a>

[W04 local recommendation activation, 2026-11-06](archive/2026-11-17/decisions.md#w04-local-recommendation-activation-2026-11-06).

<a id="w04-recommendation-presentation-2026-11-06"></a>

[W04 recommendation presentation, 2026-11-06](archive/2026-11-17/decisions.md#w04-recommendation-presentation-2026-11-06).

<a id="w08-final-stage-improvement-2026-11-06"></a>

[W08 final-stage improvement, 2026-11-06](archive/2026-11-17/decisions.md#w08-final-stage-improvement-2026-11-06).

<a id="w09-optional-assessment-2026-11-06"></a>

[W09 optional assessment, 2026-11-06](archive/2026-11-17/decisions.md#w09-optional-assessment-2026-11-06).

<a id="w11-optional-labor-market-data-2026-11-06"></a>

[W11 optional labor-market data, 2026-11-06](archive/2026-11-17/decisions.md#w11-optional-labor-market-data-2026-11-06).

<a id="w12-practical-evidence-scope-2026-11-06"></a>

[W12 practical evidence scope, 2026-11-06](archive/2026-11-17/decisions.md#w12-practical-evidence-scope-2026-11-06).

<a id="learner-journey-presentation-simplification-2026-11-05"></a>

[Learner journey presentation simplification, 2026-11-05](archive/2026-11-17/decisions.md#learner-journey-presentation-simplification-2026-11-05).

<a id="career-exploration-and-saved-alternatives-2026-11-05"></a>

[Career exploration and saved alternatives, 2026-11-05](archive/2026-11-17/decisions.md#career-exploration-and-saved-alternatives-2026-11-05).

<a id="career-evidence-local-activation-approvedapplied-2026-11-05"></a>

[Career-evidence local activation approved/applied, 2026-11-05](archive/2026-11-17/decisions.md#career-evidence-local-activation-approvedapplied-2026-11-05).

<a id="integrated-career-evidence-release-ready-for-local-review-2026-11-04"></a>

[Integrated career-evidence release ready for local review, 2026-11-04](archive/2026-11-17/decisions.md#integrated-career-evidence-release-ready-for-local-review-2026-11-04).

<a id="local-test-career-integration-approval-2026-11-04"></a>

[Local-test career integration approval, 2026-11-04](archive/2026-11-17/decisions.md#local-test-career-integration-approval-2026-11-04).

<a id="twelve-career-agent-review-packet-2026-11-04"></a>

[Twelve-career agent review packet, 2026-11-04](archive/2026-11-17/decisions.md#twelve-career-agent-review-packet-2026-11-04).

<a id="occupational-originals-verified-2026-11-04"></a>

[Occupational originals verified, 2026-11-04](archive/2026-11-17/decisions.md#occupational-originals-verified-2026-11-04).

<a id="full-occupational-evidence-preparation-2026-11-04"></a>

[Full occupational evidence preparation, 2026-11-04](archive/2026-11-17/decisions.md#full-occupational-evidence-preparation-2026-11-04).

<a id="owner-authorized-local-testing-2026-11-04"></a>

[Owner-authorized local testing, 2026-11-04](archive/2026-11-17/decisions.md#owner-authorized-local-testing-2026-11-04).

<a id="docker-verification-follow-up-2026-11-04"></a>

[Docker verification follow-up, 2026-11-04](archive/2026-11-17/decisions.md#docker-verification-follow-up-2026-11-04).

<a id="implementation-follow-up-2026-11-04"></a>

[Implementation follow-up, 2026-11-04](archive/2026-11-17/decisions.md#implementation-follow-up-2026-11-04).

<a id="esco-integration-scope-resolution-2026-11-05"></a>

[ESCO integration scope resolution (2026-11-05)](archive/2026-11-17/decisions.md#esco-integration-scope-resolution-2026-11-05).

<a id="skill-comparison-delivery-resolution-2026-11-04"></a>

[Skill comparison delivery resolution (2026-11-04)](archive/2026-11-17/decisions.md#skill-comparison-delivery-resolution-2026-11-04).

<a id="connected-mvp-handoff-resolution-2026-10-28"></a>

[Connected MVP handoff resolution (2026-10-28)](archive/2026-11-17/decisions.md#connected-mvp-handoff-resolution-2026-10-28).



<a id="team-development-hardening"></a>

[Team development hardening](archive/2026-11-17/decisions.md#team-development-hardening).

<a id="desktop-mvp-scope-resolution"></a>

[Desktop MVP scope resolution](archive/2026-11-17/decisions.md#desktop-mvp-scope-resolution).

<a id="authority-and-status"></a>

[Authority and status](archive/2026-11-17/decisions.md#authority-and-status).

<a id="stage-35-application-integration"></a>

[Stage 3.5 application integration](archive/2026-11-17/decisions.md#stage-35-application-integration).

<a id="provider-conflicts-requiring-evidence-or-an-owner-exception"></a>

[Provider conflicts requiring evidence or an owner exception](archive/2026-11-17/decisions.md#provider-conflicts-requiring-evidence-or-an-owner-exception).

<a id="account-entry-and-security"></a>

[Account entry and security](archive/2026-11-17/decisions.md#account-entry-and-security).

<a id="discovery-and-recommendations"></a>

[Discovery and recommendations](archive/2026-11-17/decisions.md#discovery-and-recommendations).

<a id="connected-prototype-resolution-2026-10-28"></a>

[Connected prototype resolution, 2026-10-28](archive/2026-11-17/decisions.md#connected-prototype-resolution-2026-10-28).

<a id="dashboard-and-shared-guidance"></a>

[Dashboard and shared guidance](archive/2026-11-17/decisions.md#dashboard-and-shared-guidance).

<a id="catalog-and-content"></a>

[Catalog and content](archive/2026-11-17/decisions.md#catalog-and-content).

<a id="profile-and-data-lifecycle"></a>

[Profile and data lifecycle](archive/2026-11-17/decisions.md#profile-and-data-lifecycle).

<a id="quality-and-operations"></a>

[Quality and operations](archive/2026-11-17/decisions.md#quality-and-operations).

<a id="engineering-and-delivery"></a>

[Engineering and delivery](archive/2026-11-17/decisions.md#engineering-and-delivery).

<a id="research-and-review-boundary"></a>

[Research and review boundary](archive/2026-11-17/decisions.md#research-and-review-boundary).
# Contextual counselor and confirmed skill evidence, 2026-11-20

The owner selected current screen plus relevant saved data, review before saving
natural-language skills, confirmed evidence without a proficiency rating, and
resume matching across both skill views/all published careers. @YakisobaNissin
approved the concrete SQL/API [review package](plans/context-aware-counselor-and-skills.md)
in chat with “oim yakisobanissin i approve”. Approval covers bounded implementation;
it does not authorize retained/hosted migration application or deployment.
Acceptance: COUN-01–03, RES-01, SKILL-01–02. Evidence and outstanding acceptance
belong to the existing counselor, competency and PDF feature guides.
