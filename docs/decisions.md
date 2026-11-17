# Asgard: Decisions and delivery gates

## Longest activity streak approval, 2026-11-16

The owner identified themselves as @YakisobaNissin (the CODEOWNERS reviewer) and
approved the bounded [longest-streak plan](plans/longest-streak.md) and end-to-end
implementation in chat after the shared-contract review requirement was raised.
Scope: account-wide maximum consecutive recorded qualifying local days; required
nonnegative `longest_streak_days` on the existing activity response; Dashboard
placeholder replacement; focused verification. No migration or new dependency.
Current-streak/H6 rules remain unchanged. This records technical/product scope
approval, not completed human implementation review or permission to publish.
[Local results and pending journeys](features/learning-streaks.md).

## W05 Guided Discovery revision scope, 2026-11-09

The project owner requested implementation of a four-to-six-question Guided
Discovery route, with six fields, activities based on the chosen fields, at
most one follow-up and an optional skill comparison after career selection.
This supersedes the earlier proposed 8–10-question length. The owner’s
“PLEASE IMPLEMENT THIS PLAN: # Asgard Guided Discovery redesign” message in
this task supplies scope approval. The [review packet](plans/discovery-v2.md)
records the shared contract. On 2026-11-09, the owner confirmed their identity
and replied “please approve and implement,” approving the bounded W01 proposal
and directing source implementation to proceed. The owner also requested a
full retake from both Results and Profile and preservation of the existing
design. Learner comprehension and signed-in acceptance remain release checks.
See the [implementation guide](features/guided-discovery-v2.md).

Local activation, 2026-11-09: the owner confirmed “i want the full
implementation please. i accept already” after being told v2 was staged.
The v2 registry was published alongside v1 in the existing local Asgard
database. New drafts and full retakes now use v2. Existing drafts resume on
their original version.

Results follow-up, 2026-11-09: the owner requested automatic retry for
temporary failures, optional previous suggestions, a prominent full retake,
and smaller cards with less evidence clutter. The open Results flow may
retry once after a user-initiated request under existing quota and cooldown
rules. The request does not schedule generation on routine revisits.
See the [Results follow-up](features/guided-discovery-v2.md#results-recovery-and-card-layout-2026-11-09).

Deterministic first results, 2026-11-09: the owner replied “approved” to
the [W01 saved-results proposal](plans/discovery-deterministic-results.md#shared-behavior-requiring-w01-review).
This authorizes rule-based first results for completed Discovery v2 using
existing storage and API operations, a Discovery-only snapshot, and no
provider quota reservation. Existing AI runs retain their existing privacy
and retirement protections. Optional AI refinement is a separate increment.

Automatic v2 Results, 2026-11-09: the owner requested that learners never
have to initiate the first suggestions or retry them manually. Results
automatically prepares the current completed v2 session when it lacks an
eligible result, including on a direct visit after an older completion.
The client reuses valid results and bounds recovery from temporary errors.
This does not authorize sending free text to a provider without the W01
refinement review.

Related careers, 2026-11-09: the owner requested related suggestions even
when an activity has a strong match. Direct matches stay first. Up to three
total results may include published roles that share concrete work, with a
reason that distinguishes them from direct matches. Ask an extra question
only when an unresolved choice can change the suggestions.
[Rules follow-up](plans/discovery-deterministic-results.md#related-careers-and-clarification-2026-11-09).

## W08 implementation scope, 2026-11-06

Project owner @YakisobaNissin selected a session-only read-only counselor, automatic
AI insights for submitted career pairs, and live public web retrieval in the
implementation request. Codex owns implementation. Exa credentials, source domains,
provider data handling, and the quota migration require owner review before local
activation. The guidance flag defaults off. This advances W08 source implementation
from the final-stage sequence while leaving activation gated.
[Implementation record](features/ai-guidance.md)


## Occupational reference scope, 2026-11-06

The project owner confirmed that Asgard keeps its current twelve roadmap-backed
careers as the recommendation candidate roster. Broader ESCO occupations and
skills remain in the separate reference catalog. An additional reference
occupation becomes an Asgard career only through future work that gives it an
authored roadmap and reviewed career mapping. This direction does not imply a
full O*NET import or clear pending reuse/content review. Recorded from the
owner's “yes” in this conversation on 2026-11-06. See the [W02 roadmap](post-mvp-roadmap.md#pm-w02-reviewed-occupational-evidence).

## W03 Profile and resume-reader scope, 2026-11-06

The project owner approved including an optional resume-assisted skill review
within Profile. Keep manual selection and a skip path. Resume extraction may
suggest skill candidates with source passages; the learner reviews them and
provides their own experience report before anything enters the profile. Keep
resume and extracted content under the private document lifecycle, with deletion
and replacement cleanup. This changes the plan only; extraction method, consent,
retention and provider use remain to be reviewed before coding. OCR and other
file formats remain deferred. Scope reference: the owner's “yea. and also that
is in the profile section right?” in this conversation, 2026-11-06. See the
[W03 plan](post-mvp-roadmap.md#pm-w03-user-confirmed-competency-profile) and
[competency profile specification](specs/competency-comparison.md#planned-w03-resume-assisted-profile-review-2026-11-06).

## W04 local recommendation activation, 2026-11-06

The project owner directed that W04 include local activation of the staged
ESCO-backed recommendation evidence without waiting for the two-model quality
evaluation. The evaluation is waived for this local activation and must be
recorded as not run, not passed. This does not authorize hosted publication or
claim recommendation quality has been established. Recorded from the owner's
“no need for the quality gate, activate already in the plan” in this conversation,
2026-11-06. See the [W04 roadmap](post-mvp-roadmap.md#pm-w04-skill-comparison-and-recommendation-integration)
and [ESCO implementation guide](features/esco-reference-catalog.md#owner-directed-local-recommendation-activation-2026-11-06).

## W04 recommendation presentation, 2026-11-06

The project owner selected the existing Recommendations results page as the
durable home for saved recommendations. Reuse its current Dashboard shortcut;
do not add a separate notification screen. Keep Roadmap focused on learning, with
no comparison panel. Show W04 skill comparisons only through each result's
“Why this was suggested” and expandable “Evidence used” sections. Keep W06's
two-career comparison on its separate page. Recorded from the owner's “yes” in
this conversation, 2026-11-06. See the [W04 roadmap](post-mvp-roadmap.md#pm-w04-skill-comparison-and-recommendation-integration).

## W08 final-stage improvement, 2026-11-06

The project owner chose to keep the single bounded AI counselor in the roadmap
as a final-stage optional improvement, after the core app flows are settled. It
is not a required part of the current delivery. W01's architecture decision and
the W08 privacy, authorization and confirmation boundaries remain prerequisites
before implementation. Recorded from the owner's “yea keep it in the plan as
one final improvement” in this conversation, 2026-11-06. See the
[W08 roadmap](post-mvp-roadmap.md#pm-w08-one-bounded-ai-counselor).

## W09 optional assessment, 2026-11-06

The project owner confirmed that an official interest assessment remains
optional future work. Keep it separate from Quick Discovery; no instrument or
integration is selected by this decision. Recorded from the owner's “yea
optional” in this conversation, 2026-11-06. See the
[W09 roadmap](post-mvp-roadmap.md#pm-w09-optional-official-interest-assessment).

## W11 optional labor-market data, 2026-11-06

The project owner kept W11 as optional future work. Existing DICT/NICS and
Philippine Skills Framework records are occupational competency sources; they do
not replace the distinct job-listing observations proposed by W11. No collection
is authorized by this decision. Recorded from the owner's “yea optional” in this
conversation, 2026-11-06. See the
[W11 roadmap](post-mvp-roadmap.md#pm-w11-philippine-labor-market-observations).

## W12 practical evidence scope, 2026-11-06

The project owner selected a lightweight record of product verification,
limitations and user-facing acceptance. Participant studies, psychological
outcome claims and a research paper are deferred unless the owner later chooses
a research goal. This does not mark any unrun check as passed. Recorded from the
owner's “yes” to keeping practical evidence while deferring participant studies
and research claims, 2026-11-06. See the
[W12 roadmap](post-mvp-roadmap.md#pm-w12-evaluation-and-research-record).

## Learner journey presentation simplification, 2026-11-05

The project owner, self-identified as @YakisobaNissin in this conversation,
selected these plan changes: retain the current Discovery flow and schedule its
redesign as the final improvement; focus W06 on differences between two careers
with shortlist and notes secondary; remove W07 practice and reflection UI from
Roadmap and Dashboard for now while preserving its API, migration and stored data
dormantly. This approves the product direction and documentation update only;
the W06/W07 UI changes have not been implemented or technically reviewed.
Recorded from the owner's selections in this conversation on 2026-11-05. See the
[roadmap update](post-mvp-roadmap.md#learner-journey-simplification-direction-2026-11-05)
and [W07 implementation guide](features/learning-guidance-and-reflection.md#owner-directed-presentation-rework-2026-11-05).

## Career exploration and saved alternatives, 2026-11-05

Activation update: the owner approved the concrete one-migration shortlist bundle. It is now applied locally; original-data checks and the focused learner journey passed. See [final evidence](features/career-comparison-and-shortlist.md#normal-activation-and-learner-journey-2026-11-05).

The owner selected one coherent career-first experience → two-career comparison → private saved alternative → learning-topic journey. Codex implements; @YakisobaNissin reviews technical changes. Existing identities, design, privacy erasure and learning state remain intact. New shortlist persistence requires final concrete normal-environment review. PDF, hosting and additional account controls stay deferred. See the [owning specification](specs/career-exploration-comparison.md) and [implementation status](features/career-comparison-and-shortlist.md).


## Career-evidence local activation approved/applied, 2026-11-05

After reviewing the concrete hashed bundle, the owner answered **Approve local
activation** for local `asgard-foundation`. Both additive migrations and all-twelve
publication were applied. Original private data/skill catalog preservation, READY
startup and normal authenticated smoke passed; provider configuration is unchanged.
This approves local testing, not independent content, live quality or hosted release.
See [execution evidence](features/career-evidence-recommendations.md#normal-activation-completed-2026-11-05).

## Integrated career-evidence release ready for local review, 2026-11-04

The owner approved end-to-end implementation and then requested fast-tracked
verification. Runtime integration and the isolated synthetic-provider browser
journey passed; existing focused evidence was reused. The concrete numbered SQL
and publication bundle is ready for the final normal-environment review required
by the approved plan. No normal activation or independent content approval is
recorded. See [evidence and deferred checks](features/career-evidence-recommendations.md#integrated-local-release-acceptance-2026-11-04).

## Local-test career integration approval, 2026-11-04

The owner selected local testing for all twelve careers and experience-based
exploration when Discovery interests are absent. The user then explicitly identified
themselves as YakisobaNissin and approved the supplied integration plan in chat.
Record this as technical plan/contract approval by that self-identified reviewer,
not independent content approval or completed runtime acceptance. The
[integration contract](specs/career-evidence-integration.md) owns the implementation
boundary; [delivery evidence](features/career-evidence-recommendations.md#local-test-integration-preparation-2026-11-04)
records the prepared overlay, isolated reference-storage checks and unfinished work.
Normal database activation requires the concrete publication review after integration
checks. Independent content reviewer remains unassigned.





## Twelve-career agent review packet, 2026-11-04

The owner requested the bounded twelve-career evidence review. Codex prepared an
inactive policy-assisted review covering all inherited records, existing skills and
learning topics, preserving native scales and private rating identities. This is
agent-proposed scope/partial-coverage evidence, not independent expert approval.
Disputed ratings remain withheld and publication/inference flags remain false.
See [review method, results and limits](features/career-evidence-recommendations.md#twelve-career-policy-assisted-agent-review-2026-11-04).
Runtime recommendation integration and content-review assignment remain pending.

## Occupational originals verified, 2026-11-04

The owner supplied the original research files; all 20 match the recorded SHA-256
and byte sizes. This resolves the missing-originals issue for this packet, without
establishing independent semantic approval. Two original PDF ambiguities were
inspected and recorded conservatively. The packet remains inactive pending full
review and shared-contract approval. See
[source verification](features/career-evidence-recommendations.md#original-source-verification-2026-11-04).

## Full occupational evidence preparation, 2026-11-04

The owner requested the full twelve-career evidence/recommendation plan: full
applicable source profiles, grouped reference levels, interests plus experience,
one release activation, and erasure of obsolete skill-derived result payloads.
Codex prepared a durable inactive research packet and structural validator. No
semantic approval, source-original hash verification or recommendation integration
is claimed. Shared contract review and independent content approval remain pending;
existing local-test behavior is unchanged. See the
[implementation status](features/career-evidence-recommendations.md) and
[technical proposal](specs/career-evidence-integration.md).

## Owner-authorized local testing, 2026-11-04

After setup stopped on the new pending migration, the owner explicitly requested
applying it and implementing all required local activation so they could test.
The single competency migration and 120 Asgard-authored mappings are now installed
in the normal local environment, preserving all pre-existing private-table digests.
This is a local-test publication exception with independent content/code review
still pending; it does not approve hosted use or claim validated occupational
requirements. See [activation evidence](features/competency-comparison.md#normal-local-test-activation-2026-11-04).

## Docker verification follow-up, 2026-11-04

The resumed competency checks passed the isolated migration/private-state upgrade,
draft/repeat/conflict publication, 21 pinned-container unit/Auth integration cases,
and scoped Chrome persistence/comparison/removal/layout/focus checks. SQL policy
quoting, readback ordering and comparison-trigger contrast were corrected. Normal
migration/activation, real content approval and independent human review remain
pending. See [dated execution evidence](features/competency-comparison.md#resumed-docker-acceptance-2026-11-04).
This does not change final-MVP or hosted release gates.

## Implementation follow-up, 2026-11-04

The owner subsequently approved proceeding with the proposed migration/API scope
and selected Anti Slop during. Skill-profile/comparison source and generated clients
are now implemented. Independent review, database activation, content publication
and end-to-end acceptance remain pending; earlier preparation-only status below is
historical. See [implementation evidence and limitations](features/competency-comparison.md).
No final-MVP release gate is marked complete by this update.


## ESCO integration scope resolution (2026-11-05)

The project owner and technical reviewer, @YakisobaNissin, explicitly removed the ESCO deferral and approved the full implementation plan in chat on 2026-11-05. This supersedes the ESCO deferral below. Scope covers English v1.2.1 offline staging, a cleared reference catalog, and reviewed evidence for recommendations across the 12 existing careers. PM-W02, PM-W04 and FUT-01 apply. Independent data/content review, source-specific reuse clearance, concrete release review, and recommendation quality checks remain required. See the [implementation guide](features/esco-reference-catalog.md).

On 2026-11-05, @YakisobaNissin identified themselves as the content reviewer and approved integration in chat, with tests deferred. The resulting local browse release is limited to 101 digital and computing occupation identifiers and preferred labels, plus 12 related Asgard career mappings. The source-specific exclusions, release identity and remaining recommendation gates are recorded in the [local release handoff](features/esco-reference-catalog.md#owner-reviewed-local-browse-release-2026-11-05).

## Skill comparison delivery resolution (2026-11-04)

Decision PM-I1-SCOPE-20261104. Product decision-maker: project owner in this chat.
Reference: the recorded selections and explicit implementation requests in the
[session record](plans/competency-comparison-2026-11-04.md).

Prioritize manual skill profiles/comparison for all 12 current careers, using
Asgard-authored content while ESCO downloading/import is deferred. Select unknown
or self-reported levels 0–4, current records only, Profile and roadmap entry points,
and preservation of the existing UI. Defer hosting/additional account controls and
broad acceptance from this immediate increment; retain mandatory focused checks.
This supersedes the earlier first-increment proposal's accepted-MVP-first sequencing,
external-source-first assumption and proposed rating history for this increment only.
Final-MVP account obligations, eligibility and external-use gates remain unchanged.

The owner requested end-to-end implementation, but completed architecture review
of migration/shared contracts is not recorded. Technical reviewer: @YakisobaNissin.
Content/mapping reviewer remains unassigned at the owner's direction; publication
waits for that assignment and approval. See the [feature specification](specs/competency-comparison.md)
and [actual implementation status](features/competency-comparison.md).


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
