---
id: PRD
kind: prd
status: draft
requires: [BRIEF]
requirements:
  - REQ-01
  - REQ-02
  - REQ-03
  - REQ-04
  - REQ-05
  - REQ-06
  - REQ-07
  - REQ-08
  - REQ-09
  - REQ-10
  - REQ-11
  - REQ-12
  - REQ-13
---

# Asgard: Product requirements and scope


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


## Skill comparison increment: owner direction, 2026-11-04

The owner selected feature-first local delivery: manual skill profiles and
comparison across the 12 current careers, using Asgard-authored learning content.
The [decision resolution](decisions.md#skill-comparison-delivery-resolution-2026-11-04)
and [feature specification](specs/competency-comparison.md) own this bounded addition.
It adds a manually editable skill capability to the later increment, superseding
the exclusion of that form in REQ-11 only for this new increment. Existing PDF-derived
context and recommendation behavior are unchanged. Hosting/additional account
controls are deferred from its immediate sequence, not removed from final-MVP scope.
Technical/content review and mandatory focused checks remain required. Earlier
seven-role launch coverage is a minimum; this increment targets all 12 current roles.


**Version 0.3 · Updated 26 October 2026 · Status: Product baseline with recorded owner resolutions; partial foundation implemented, feature acceptance pending**

Consolidated 25 October 2026 from the product brief, PRD, and scope. Original requirements and acceptance statements are retained. The owner delegated outstanding choices on 25 October 2026; [decisions](decisions.md) distinguishes selected policy from provider conflicts, authored content and unrun evidence. [Journeys](user-journeys.md) describe routes and [pages and interactions](pages-and-interactions.md) describe screen behavior.

Asgard connects career explanations with curated learning paths so people can understand the work, investigate options, and choose a practical learning step. The assumed need and intended benefits still require user research. Suggestions are advisory and uncertainty must not become an inferred ability or preference.

[Development](development.md#current-foundation-status-and-evidence) owns implementation status and evidence. Auth/Profile source and shared SQL/API scaffolding exist; labeled sample pages and 501 feature operations do not meet these end-to-end acceptance criteria. The [password minimum resolution](decisions.md#password-minimum-resolution) selects 8 characters; [Security and operations](security-and-operations.md) owns the complete account policy. Frontmatter still retains draft status; recorded resolutions do not approve the whole PRD. The missing originating BRIEF artifact is tracked under [decision provenance](decisions.md#documentation-authority-and-unresolved-integration-records).

## Vocabulary

- **Field/category:** a broad area of technology work.
- **Career/role:** a specific type of work within or across fields.
- **Roadmap:** a curated learning path associated with a role or goal.
- **Milestone:** an authored grouping of applicable learning topics.
- **Topic:** an individual learning item; grouping/decorative nodes are not automatically learnable topics.
- **Resource/tool guide:** curated material supporting exploration or learning.

## Product scope

A web application for understanding technology careers, exploring learning paths, and finding a practical next step. The initial release is intended for adults aged 18 and above, across all experience levels. Initial design evaluation focuses on students. Age eligibility does not determine competency levels or restrict the careers and learning topics available within the product. The interface must provide sufficient explanations for beginners.

Sign-in is required after the public Landing page for both guided discovery and free browsing. Free browsing means skipping Discovery, not anonymous access. The five main page families are Landing, Discovery/Setup, Dashboard, Careers/Roadmaps, and Settings.

The MVP shall launch with the six categories and seven roles listed below, confirmed in the 25 October 2026 document review. Each role requires a complete curated career explanation and introductory roadmap. Authored topic/resource inventory remains to be reviewed. Minimum introductory depth and per-topic resource coverage are defined in REQ-07. F-001 selects question controls and F-002 selects input interpretation and refresh policy; catalog attributes still require authored review.

| Launch category | Launch roles |
| --- | --- |
| Software and AI | Frontend Developer; Machine Learning Engineer |
| Design & UX | UX Designer |
| Data & Analytics | Data Analyst |
| Cybersecurity | Cybersecurity Analyst |
| Hardware & Embedded Systems | Embedded Systems Developer |
| Networking & Infrastructure | Network Engineer |

Software and AI is a navigation grouping; software interest must not be interpreted as AI interest. Architecture-related roles may belong within relevant categories; no separate Architecture launch category is required.

## Landing page and login

Account entry, verification, password recovery, and authenticated access. Optional two-factor authentication is configured in Settings under REQ-11.

### REQ-01: Public entry and authenticated navigation

- **Outcome:** understand the product and enter the application.
- **Behavior:** compact Landing combines product essence with Google sign-in and email/password registration or sign-in. Email/password registration shall include email verification. Password recovery shall be available. Route verified new users to Welcome with Guided / Browse choices; returning users toward Dashboard. Returning users with unfinished Discovery shall reach Dashboard and receive an optional Resume Discovery action. Resuming shall retain their saved answers; the questionnaire shall not reopen automatically. Facebook and Apple sign-in are outside the MVP provider set.
- **Acceptance:** a signed-out visitor sees product context and the supported account actions. Google sign-in or verified email/password access allows entry; entering an email alone does not authenticate. After successful authentication, a new user can choose guided discovery or direct browsing. Browse opens Careers directly. An email/password user can request password recovery and set a new password through the recovery flow.
- **States:** authentication processing/failure, email verification pending/success/failure, password recovery, new/returning account, expired session, additional verification when 2FA is enabled.
- **Email verification interaction:** retain emailed code entry with an explicit Verify button. Entering the final digit shall not automatically submit. Provide Resend code and Return to sign-in actions; invalid or expired codes receive recoverable feedback. Code format, expiry and resend policy follow Security and operations; hosted enforcement and delivery still require verification.
- **Journeys:** J-01, J-02.

### REQ-13: Authenticate and protect account-owned data

- **Outcome:** access the app through an account and retain only authorized personal data.
- **Behavior:** public Landing and account entry; authenticated Discovery, Careers, Dashboard, progress, and Settings. User-owned records are authorized per account. Provider credentials remain server-side.
- **Acceptance:** unauthenticated app requests route to account entry; account A cannot access account B's protected records. Expired sessions offer a recoverable authentication route. Failed persistence must not appear saved.
- **Authentication scope:** Google and verified email/password access, email/password recovery, and optional authenticator-app 2FA as specified in REQ-01 and REQ-11.
- **Account linking:** users explicitly link Google only after proving existing-account access; matching email alone does not authorize linking or merging. Preserve the same profile/history. Supabase automatic linking conflicts with this product rule: AUTH-C1 requires provider-boundary compatibility evidence before Google rollout; the existing rule is not silently relaxed.
- **Security policy:** use [Security and operations](security-and-operations.md) for provider-managed recovery, MFA disablement, deletion, retention and abuse controls. AUTH-C1/C2 compatibility gates must pass; do not invent provider capabilities. Self-service deletion is included; downloadable account-data export is deferred.
- **Journeys:** J-01 through J-07.

## Discovery/Setup

Guided discovery and explained recommendations. REQ-05 also governs career suggestions presented in Careers; it uses relevant roadmap progress from REQ-09 and optional document context managed under REQ-11.

### REQ-04: Complete or bypass structured Discovery

- **Outcome:** express interests and receive a useful exploration starting point.
- **Behavior:** collect general interests, activities and motivations, work approach, experience and background, and goals/context, followed by explained career suggestions. Preserve choices during Back navigation and allow explicit uncertainty. Documents, profile photos, employment history, and prior technical experience shall not be prerequisites. Additional background/context fields remain optional.
- **Acceptance:** Guided opens the question sequence; submitting the final question presents catalog-grounded suggestions. Users can proceed from results to Careers. No separate answer-review screen or mandatory profile setup is required. Browse careers bypasses Discovery and opens Careers directly.
- **States:** uncertain/mixed answers, skipped optional fields, changed category, validation feedback, save/request failure, retake.
- **Dependencies:** implement the selected F-001 controls/persistence and F-002 recommendation policy; review authored catalog relevance attributes and execute comprehension tests.
- **Journeys:** J-02, J-05.

### REQ-05: Provide explained, catalog-grounded suggestions

- **Outcome:** understand why a path appears and remain free to explore alternatives.
- **Behavior:** recommendations shall use available catalog content and relevant user context. MVP inputs include Discovery answers when provided, the explicitly selected current roadmap, and recorded topic progress. Guidance shall adapt to relevant changes in these inputs rather than remain fixed to the initial Discovery result. Users who bypass Discovery remain eligible for guidance based on their explicit roadmap choice and topic progress. Suggestions appear in Discovery results and Careers.
- **Acceptance:** each recommendation references an available catalog item and has a plain-language explanation supported by the relevant inputs. The same context is not required to produce different suggestions on every visit. Changes to recommendations shall not automatically change the current roadmap or topic states. Unsure can produce varied broad suggestions. Suitability percentages, assessed competency, job-readiness claims, and invented user skills shall not be displayed. Recorded completion shall not be treated as proof of mastery or career preference.
- **States:** no result, incomplete content, invalid identifier, request failure, previous successful result during a retake. Preserve answers and offer retry/browsing without fabricating a result.
- **MVP approach (updated 24 October 2026):** use LLM-based recommendations grounded in curated catalog entries and permitted user context, returning existing career IDs and supported explanations through a validated result contract. Keep optional PDF extraction separate. Agent-based recommendations and PDF reviewing are possible future extensions; maintain separate service boundaries to support them. This supersedes the earlier rule-based ranking proposal. See the [recommendation specification](specs/career-recommendations.md).
- **Dependencies:** selected F-002 count/diversity/refresh/input policy, Groq adapter/candidate evaluation, reviewed catalog attributes, and encoded/tested Pydantic/OpenAPI contracts. Software interest does not imply AI interest; automation does not necessarily involve AI.
- **Journeys:** J-02, J-05.

## Dashboard/Home

Current learning focus, milestone progress, next topics, activity calendar, and streak. Roadmap and topic-state changes follow REQ-08 and REQ-09.

### REQ-10: Show a useful learning Dashboard

- **Outcome:** understand current focus and continue an actionable topic.
- **Behavior:** show the current role/roadmap with Edit. The main progress card shall represent the current core milestone within that roadmap, displaying its name and milestone-level progress rather than overall roadmap progress. Show the single active Learning topic with its milestone context, suggested next topics, Recently done, and grouped completed-topic summary. No-current roadmap points to Careers; current-with-no-progress offers a starting action.
- **Acceptance:** Continue learning opens the relevant topic panel. Suggested next comes from authored learning relationships; opening a suggestion does not mark it Learning. Recent Done topics are visible without claiming mastery of an incomplete group. Milestone completion percentages and activity streaks shall follow the rules below; neither shall be presented as a competency or career-readiness score.
- **Milestone selection:** within the current roadmap, the core milestone shall follow the active Learning topic when present. If no topic is active within that roadmap, select the earliest milestone in the authored sequence with an available next topic. Users are not required to select the milestone manually.
- **Next-topic suggestions:** follow the authored learning sequence and selected branch, bypassing topics currently marked Done or Skipped. When a milestone has no remaining topic to suggest, advance suggestions to the next milestone even if Skipped topics keep its completion below 100%. Preserve that earlier milestone's actual completion percentage and allow manual revisiting. Opening a suggestion shall not alter its status. Prerequisites remain advisory as specified in REQ-07.
- **Completed roadmap:** when all applicable learning topics in the selected roadmap path are Done, show a completion summary and an Explore other careers action. Retain the current roadmap until the user explicitly changes it.
- **No remaining suggestions:** when no topic remains to suggest because the applicable topics are Done or Skipped, but the roadmap is not fully Done, show No remaining suggested topics and a link to revisit Skipped topics in the roadmap. Preserve actual completion percentages; this state shall not be labeled full completion.
- **Milestone progress:** after required alternative choices are made, progress shall equal the number of applicable learning topics currently marked Done divided by all applicable learning topics within the milestone, expressed as a percentage. Applicable topics include the common path and the user-selected alternative branch; unselected alternatives do not contribute to the numerator or denominator. Skipped applicable topics remain in the denominator and do not increase the completed count. Before required choices are made, show common-topic counts and Choose a path rather than a misleading full-path percentage. Authored topic membership must be defined in the content model; empty milestones shall not be published, as specified in REQ-07.
- **Shared guidance:** use contextual informational guidance across Dashboard, Careers, and Settings, following the shared rules in the page guide. Show at most one general guidance banner; dismissal of the same message persists across pages and visits. Settings / Profile uses inline help rather than a banner linking to itself. Guidance never gates browsing or learning; normal career navigation remains available after dismissal. First-name completion is distinct from optional career-background enrichment and must not promise more accurate suggestions. Photo and PDF remain optional; F-002 defines the selected interpretation/refresh policy.

- **Profile enrichment:** show a Profile Enrichment action in the Dashboard's supporting area until the user saves their name in Profile. Saving the name satisfies profile-completion criteria and hides this action; photo and PDF remain optional. The action opens Settings / Profile. The supporting helper message shall be dismissible, and its dismissal shall persist across future visits. Profile remains accessible through Settings and the account menu after the action is hidden or the message dismissed. Neither the action nor the message shall automatically open setup or gate learning.
- **Account menu:** the header account/avatar control shall open a menu displaying the user's name and Edit profile, Settings, and Log out actions. Edit profile opens Settings / Profile; Settings opens the Settings area; Log out ends the session and returns to Landing. Opening the menu shall not change learning focus or progress.
- **Task status groups:** present roadmap learning items under Not Started, In-Progress, and Complete, corresponding to Not started, Learning, and Done. Each group shall support expansion and collapse without changing topic statuses. Retain milestone context and the single-Learning-topic limit. These groups shall use saved topic statuses rather than imply automatic parent/child completion. Skipped topics shall be visible in the roadmap only; they shall not appear as an additional Dashboard group or be included under Not Started or Complete.
- **Activity calendar:** the MVP shall include an activity calendar/heatmap whose daily activity count is based on topics marked Done on that date. Learning, Skip, Clear, and browsing shall not add activity. The same topic within a roadmap shall count at most once per local calendar day, regardless of repeated Done actions. Undoing a Done status shall remove its calendar contribution and recalculate affected activity summaries. Dates and day boundaries shall use the user's local timezone. Initially show the current month, with navigation to previous months and daily completion counts. Previously recorded calendar dates shall remain unchanged when the user's timezone changes; future activity shall use the new local timezone.
- **Activity streak:** the MVP shall display a flame/streak counter representing consecutive local calendar days with qualifying calendar activity. The same local timezone shall apply to the calendar and streak. Undoing a Done status shall recalculate the streak from the remaining qualifying activity. Streak freezes are outside MVP. If today has no qualifying activity yet, preserve the streak ending yesterday until today ends. A full local calendar day without qualifying activity breaks the streak; show zero until the next qualifying activity starts a new streak. The counter shall not represent assessed competence.
- **Dependencies:** roadmap/task hierarchy, next-topic rules, and persistence. The Dashboard shall represent the single active Learning topic and follow the switching behavior in REQ-09.
- **Journeys:** J-03, J-04.

## Careers/Roadmaps

Career browsing, role explanations, dedicated roadmap pages, topic resources, current focus, and learning progress.

### REQ-02: Browse the category-oriented career/roadmap catalog

- **Outcome:** explore roles and paths without completing Discovery.
- **Behavior:** show a category description, search, category navigation, and concise roadmap entries. Show recommendations when available without restricting the full catalog. A small current-roadmap link appears only when a roadmap was explicitly set as current. No prominent None summary card.
- **Acceptance:** a signed-in user can search/filter, inspect a suggestion or another catalog entry, and reach its roadmap detail. No matches provides filter reset. With no current roadmap the shortcut is absent; with one, it opens that roadmap directly. Unknown category context leads to varied field exploration, not a fabricated selection.
- **States:** loading, missing content, no matches, no Discovery context, uncertain interests, current/no-current roadmap.
- **Catalog actions:** each card provides View roadmap to open its dedicated detail URL directly, without preliminary card selection or a shared selection button. Set as current roadmap is a separate action inside detail, alongside the inspectable role overview. Opening detail never commits focus. Do not group catalog roles under topic-status headings such as Not Started. Card size accommodates authored content; no blanket shorter-card requirement is adopted.

- **Search:** catalog search shall match role titles and associated skills. Matching a skill shall return the relevant role entries. Search shall remain available without Discovery context, and users shall be able to clear the query and category filters.
- **Header navigation:** the working interface's Roadmap navigation item opens this catalog. Opening the catalog shall not change the current roadmap.
- **Coverage:** publish the six categories and seven roles listed in Product scope, each with a complete career explanation and curated introductory roadmap. Additional roles may be added afterward. Naming the inventory does not approve its curriculum or establish content readiness.
- **Dependencies:** reviewed taxonomy and associated role/roadmap content.
- **Journeys:** J-01, J-02, J-04.

### REQ-03: Explain a role inside its opened roadmap

- **Outcome:** understand what the work involves before committing to a path.
- **Behavior:** roadmap detail contains a concise About this career summary and a Read more control that expands curated text within the same experience. Expanded content covers responsibilities, representative work examples, and relevant skills. Catalog category descriptions explain fields, not an individual role. Career videos are outside the MVP requirement.
- **Acceptance:** opening an entry shows its role name, concise explanation, and expandable milestone list. Read more reveals the expanded career explanation; users can collapse it without leaving the roadmap or changing focus. Opening or expanding career information does not set the roadmap as current or change topic progress. Career claims and expanded content must be curated.
- **States:** collapsed/expanded career explanation, missing career content or roadmap.
- **Navigation:** each roadmap detail shall have a dedicated page with its own URL. Opening a catalog entry navigates to that page; the roadmap shall be accessible directly and after refresh. Animated transitions may accompany navigation without replacing the dedicated URL requirement.
- **Dependencies:** editorial ownership, actual roadmap content, and route handling.
- **Journeys:** J-01, J-02, J-03.

### REQ-07: Explore curated interactive roadmaps and resources

- **Outcome:** inspect a comprehensible learning sequence and find material to begin.
- **Behavior:** ordered expandable milestone cards with topics, authored advisory relationships and alternatives, topic selection, and a resource/detail panel within the roadmap experience. Topic content includes explanation, learning context, curated tutorial/book links, and relevant tool setup guidance. Prefer free resources; label cost/access when applicable.
- **Acceptance:** selecting a topic opens its details; closing retains milestone expansion, selected-topic context, and keyboard focus. Opening a resource or topic does not automatically change progress. Missing resources are stated as unavailable. AI-generated graph structures are outside initial scope.
- **States:** roadmap/resource loading errors, unavailable links, desktop layout and zoom/reflow, no topic resources.
- **External resources:** external learning-resource links shall open in a new tab, preserving the current roadmap and selected-topic context in the application. Opening a resource shall not change topic progress.
- **Learning order:** prerequisites and suggested order shall be presented as guidance. Users may open topics, access resources, and record topic states out of order; prerequisite completion shall not lock access. The single-Learning-topic limit in REQ-09 still applies.
- **Alternative learning paths:** authored roadmaps may identify mutually alternative branches, such as choosing one language. Users shall be able to select an applicable branch. Only the selected branch contributes to milestone completion calculations; unselected alternatives are excluded from those calculations. Branch selection shall remain distinct from setting a topic status.
- **Presentation and filtering:** use the milestone list as the primary roadmap presentation; a tree/graph canvas and pan/zoom are not required. Each milestone shows a title, short outcome, and Done/applicable-topic count. Expansion changes presentation only; milestone completion is calculated. Hide completed filters Done topics only without changing counts or states. Skipped remains a separate learning state and accessible to revisit. Cards accommodate authored content and alternatives, such as backend language choices, without a fixed short-height requirement. Totals count learning topics, not resource links.

- **Initial learning depth:** each launch roadmap shall provide a coherent introductory path covering foundations, relevant starter tools, and a practical learning outcome. Extensive advanced coverage is not required for launch; the product audience continues to include all experience levels.
- **Minimum topic content:** every published learnable topic shall include an explanation and at least one curated free learning resource. Provide tool guidance where applicable. Structural/grouping nodes are not automatically learnable topics.
- **Publication quality:** milestones without learning topics shall be treated as incomplete content and shall not be published. Coming-soon placeholders shall not substitute for the required complete launch roadmap.
- **Branch changes:** if selecting a different branch would exclude the active Learning topic, require the user to resolve that topic through Done, Skip, or Clear before saving the branch change. Preserve recorded progress in both branches; recalculate suggestions and milestone percentages for the newly selected branch.
- **Dependencies:** content structure, resource ownership/maintenance, accessible milestone/topic navigation, branch-selection interaction design, and explicit milestone/branch membership.
- **Journeys:** J-01, J-03, J-04.

### REQ-08: Set current roadmap explicitly

- **Outcome:** choose a learning focus without accidental changes while browsing.
- **Behavior:** only Set as current roadmap inside roadmap detail changes current roadmap. Role Edit in Dashboard or Settings opens the catalog. Inspecting categories, recommendations, roadmap details, or nodes does not change focus.
- **Acceptance:** until Set as current roadmap is used, a new user has no current roadmap. After the action, Dashboard and catalog shortcut refer to that roadmap. Replacing focus preserves existing learning history. A failed save is not shown as successful.
- **States:** no current focus, current indicator, replacement choice, persistence failure.
- **Switching focus with an active topic:** before changing to a different current roadmap, require the user to resolve the existing Learning topic through Done, Skip, or Clear as specified in REQ-09. Do not change current focus until that action and the new focus choice save successfully. Cancellation or failure shall preserve the saved focus and shall not imply a successful switch.
- **Optional extension:** AI advice about a starting topic based on supplied experience is a separate candidate, not a baseline requirement. If included, it must reference existing nodes and remain optional; future inclusion requires a separate scoped decision; no baseline behavior depends on it.
- **Journeys:** J-03, J-04, J-05.

### REQ-09: Record reversible topic states

- **Outcome:** remember what is being learned, completed, or bypassed.
- **Behavior:** one current state per topic: Not started, Learning, Done, or Skipped. Learning / Done / Skip change the state; Clear restores Not started. Changes persist for the owning account.
- **Acceptance:** state changes are reflected on revisit and in relevant Dashboard sections. Done removes that topic from Learning. Skipped does not imply competence, completion, or a known reason. Merely viewing a topic/resource changes no state.
- **States:** no progress, save failure, state reversal, content/version changes.
- **Active-topic limit:** an account may have at most one topic marked Learning at a time, including across roadmaps. This limit does not restrict browsing other topics or recording Done/Skipped states.
- **Active-topic switching:** attempting to mark a different topic Learning shall prompt the user to resolve the current Learning topic using Done, Skip, or Clear. The new topic shall not become Learning until that action saves successfully. Cancelling or a failed save shall retain the existing Learning topic. The system shall not silently clear unfinished work.
- **Independent topic states:** each topic retains its own status. Changing a parent topic shall not change its children, and changing a child shall not change its parent or siblings. A parent marked Done shall not imply that its child topics are Done. Any calculated group summary shall remain distinct from individual topic statuses.
- **Completion accounting:** only topics currently marked Done shall count as completed in topic totals, group summaries, or progress measures. Learning, Skipped, and Not started shall not count as completed. Skipped topics shall remain distinguishable from Done. Reversing a Done state shall update the affected completion summaries accordingly.
- **Roadmap-specific progress:** a user's topic status shall be recorded separately within each roadmap. Completing a topic in one roadmap shall not change a similarly named or shared-content topic in another roadmap. The single-Learning-topic limit still applies across the account.
- **Content dependency:** milestones and alternative branches require explicit authored topic membership. Branch changes shall preserve recorded topic history and follow REQ-07.
- **Journeys:** J-03, J-04.

## Settings

Profile information, optional document analysis, Discovery retakes, account/security settings, and logout.

### REQ-11: Manage profile, preferences, and retakes

- **Outcome:** update personal context without losing learning history.
- **Behavior:** Settings includes Profile, Role, account/security, the agreed 2FA scope, and Logout. Name/image editing and optional background enrichment belong in Profile. The MVP shall offer optional PDF upload and analysis from Settings / Profile for users who wish to supply previous work, projects, or other relevant experience. Users can upload, replace, or remove a document. Successful analysis shall automatically update the document-derived profile context used for recommendations, without a mandatory confirmation step. A separate manually editable skills form is not part of the current requirement. Upload shall not require Discovery completion or verified professional experience. F-002 defines logical extraction fields/provenance and budgets; security and operations defines provider privacy/retention. Encode and review implementation contracts before code. Chatbot settings are outside MVP. Account/security shows linked methods, MFA/recovery status, explicit linking and deletion actions, using the security baseline.
- **Profile fields:** First name (1–100 Unicode characters after outer trimming), optional Surname (0–100) and optional photo. Accept diverse names/mononyms; reject control characters. Saving First name completes the basic profile; photo/PDF remain optional. Save profile explicitly commits name/photo; Save preferences independently commits catalog preference. Photo validation follows the security baseline.
- **Discovery context display:** Profile shall show the available saved Discovery result context and a Retake Discovery action. Without a successful result, show an appropriate empty state. This context shall remain distinct from the explicitly selected current roadmap; retaking shall not automatically change that roadmap.
- **Preferred primary field:** users shall be able to select and save a preferred technology category in Settings / Profile. It determines the default category shown when opening the career catalog. Changing this preference shall not itself change recommendations, Discovery answers, the current roadmap, or topic progress. Users remain free to browse other categories.
- **Supported documents:** accept PDF resumes, academic records, and summaries of projects or work experience, up to 10 MB per file. MVP analysis supports PDFs with selectable text; image-only or scanned content requiring text recognition is unsupported. Invalid files, files exceeding the limit, and documents without readable text shall produce a clear explanation and an option to select a supported PDF. Rejected or unreadable input shall not replace previous successfully extracted context.
- **Extraction scope:** extract explicitly stated skills, education, work experience, and projects when available. Missing fields shall remain unknown; the system shall not invent experience or infer competence solely from job titles, institutions, or qualifications. If a readable PDF contains no usable background, explain that outcome and preserve any previous successful document-derived context rather than replacing it with an empty result.
- **Acceptance:** a user can access the optional document feature from Profile without repeating onboarding. Users without a document can continue browsing and learning. Successful analysis applies supported extracted information without requiring a separate review screen. For MVP, users address incorrect extracted information by replacing or removing the PDF. No individual-field correction form is included. Upload success and analysis success shall be represented as distinct states; an analysis failure shall not be reported as completed analysis. Profile edits and document operations do not alter topic states or current roadmap. A successful retake refreshes recommendation context; a failed retake retains earlier successful recommendations. Role opens catalog; only another Set as current roadmap changes focus. Logout returns to Landing.
- **States:** incomplete profile, save failure, no Discovery answers, failed retake, no document, uploading, uploaded, analyzing, analysis completed, analysis failure, replacement/removal.
- **Active document retention:** keep the successfully analyzed original while active. On replacement/removal exclude old context immediately and purge superseded/removed active-storage copies within 24 hours. Failed candidates expire within 24 hours; account deletion and backups follow the security baseline.
- **Document replacement:** after a replacement PDF is successfully analyzed, its extracted information shall replace the previous document-derived context rather than combine with it. Subsequent recommendations shall use the replacement context. While processing or if analysis fails, retain the previous successful context. Replacement shall not change the current roadmap or topic progress. Superseded originals/derived context leave active use immediately and are purged from active storage within 24 hours under the security baseline.
- **Document removal:** removing a PDF shall remove the active document and its extracted context from the profile and recommendation inputs. Subsequent recommendations shall use the remaining available context, including Discovery answers, the current roadmap, and topic progress. A pending analysis for the removed document shall not restore its extracted context. Removal shall preserve the current roadmap and topic progress. Apply security-baseline purge/backup deadlines and suppress recommendations derived from removed context.
- **Optional two-factor authentication:** use authenticator-app TOTP and provider-managed single-use recovery codes, with explicit setup verification before activation. SMS/email-code/push MFA remain excluded. Fresh authentication, AAL enforcement, regeneration, disablement and lost-all-factor policy follow the security baseline; AUTH-C2 must pass before MFA enablement.
- **Account deletion:** provide a self-service account-deletion action in Settings, with explicit confirmation and appropriate identity verification. Once confirmed and identity-verified, deletion shall end account access immediately and initiate removal of the account and associated personal records. There shall be no user-facing restoration period. Exact deletion timing, backup handling, and third-party data handling remain subject to the data lifecycle specification.
- **Data export:** downloadable export of profile and learning records is outside MVP.
- **Dependencies:** encode/test selected F-002 extraction/provenance and security lifecycle policies, including actual provider capabilities. Optional enrichment remains independent of Discovery and learning.
- **Journeys:** J-04 through J-07.

## Excluded and deferred capabilities

These capabilities do not form part of the MVP acceptance scope. Their identifiers are retained for traceability.

### REQ-06: Saved careers and comparison [comparison outside MVP]

- **Outcome:** revisit or compare interesting roles.
- **Status:** career comparison is excluded from MVP. Standalone career bookmarking is not included in the defined baseline. The following requirements apply only if these capabilities enter a later release.
- **If included:** define comparison attributes/selection limits and save persistence. Saving is distinct from Set as current roadmap; it does not restrict catalog access or replace focus.
- **Conditional acceptance:** saves persist for their owning account; comparison uses the same available attributes for selected roles; errors are visible. Incomplete career information is not generated to fill comparison gaps.
- **Dependencies:** explicit launch scope, content, persistence design.
- **Journeys:** optional extension to J-01/J-04, not a baseline step.

### REQ-12: Contextual AI assistance [outside MVP]

- **Outcome if included:** ask questions grounded in curated career/roadmap context.
- **Status:** a user-facing conversational assistant and associated settings are excluded from MVP. In-topic tutoring and AI-generated roadmap structures are outside the current baseline. The following requirements apply only if these capabilities enter a later release.
- **Conditional acceptance:** use available curated context, validate referenced destinations, acknowledge unavailable answers, and keep browsing/learning usable during provider failure. Do not claim that an assistant exists or is approved for implementation.
- **Dependencies:** product scope, provider, cost/data handling, contextual sources.

## Initial scope and excluded extensions

The baseline experience is account entry → guided or direct catalog exploration → role explanation → curated roadmap/topic/resources → explicit current focus → reversible topic states → Dashboard and Settings. Launch coverage spans the major technology categories, with fewer roles initially available per category. Recommendations shall reflect relevant Discovery responses, current-roadmap selection, and recorded topic progress as specified in REQ-05.

Career comparison (REQ-06) and the user-facing assistant (REQ-12) are outside MVP. Experience-based AI starting-topic advice is not part of the defined baseline; standalone bookmarking remains unapproved. PDF upload and analysis are included in the MVP as an optional Profile capability for users supplying additional experience or background. F-002 and Security and operations select processing limits, disclosure and provenance; implementation review remains required. The six-category, seven-role inventory is confirmed; authored curricula and launch schedule still need delivery work. Architecture is approved; capacity and runtime gates remain unverified. Each of the seven launch roles requires a complete career explanation and introductory roadmap under REQ-02 and REQ-07.

Live job-market scraping, market analytics, AI-generated graphs, full course delivery, assessed competencies, achievements, and detailed learning analytics are outside the currently defined baseline.

## Content and data responsibilities

- **Career/category:** stable identifier, working taxonomy, plain-language explanation, associated roadmap references, editorial/source ownership.
- **Roadmap/topic/resource:** authored relationships, meaningful milestone grouping, explanations, resource links/access labels, tool guidance, maintenance/version decisions.
- **Discovery and recommendations:** questionnaire version, supplied answers including explicit uncertainty, relevant roadmap/progress context, and recommendation results. Stage 4 supplies versioned identity/storage and generated API scaffolding; technical review, authored option content and feature services remain required. Retention follows the security baseline.
- **Current focus:** explicit account-to-roadmap choice, separate from selected category and recommendation results.
- **Topic state:** account-owned state and relevant ordering/history data; no assessment score is implied.
- **Profile:** name/image and optional supplied background; no profession-based automatic skill assignment. Document lifecycle follows the security baseline; assistant history is outside MVP.

## Publication and content revision policy

The project lead is initially accountable for curriculum approval and appoints a content editor per role before publication. Store editorial source/license, reviewer, reviewed date and content version. Every launch role needs foundations, starter tools and a practical outcome; each learning topic needs its explanation and at least one free curated resource. Review links before release and every 90 days. No title-only or repeated placeholder cards qualify.

Assign stable identities to roles, roadmaps, milestones, branch groups and learning topics. Each learning topic belongs to exactly one milestone within a roadmap; common-path membership and mutually exclusive alternatives are explicit. Group headings are not status-bearing topics. Alternative groups provide an explanation and explicit user choice, never a silent first-option default. Common topics remain usable before choosing a branch; withhold a full-path percentage until required choices are made and show common-topic counts plus a Choose a path action. Viewing alternative content changes no selected branch.

Copy/resource corrections retain identity and saved state. Materially changed learning outcomes create a new topic identity; do not overwrite completion as though the user completed new work. Retired topics retain read-only historical state and date/activity credit, are excluded from future suggestions/current denominators, and display an unavailable/retired notice. Recalculate displayed totals with a content-updated explanation; never silently clear states or transfer Done to another topic. If an active Learning topic must be retired, require an explicit Clear/Skip/Done resolution before applying the replacement focus/path; do not count a removed item as mastered. A wholly unavailable roadmap preserves history/current-focus reference, explains unavailability and offers catalog browsing rather than silently switching focus. Technical content migrations require review.

## Non-functional requirements

These requirements apply across all five page groups. They specify required quality outcomes rather than a particular architecture or provider. Previously agreed accessibility, compatibility, and data/progress behavior retain their accepted status. The owner-delegated baseline below selects verification objectives and free-tier service limits. No achieved performance, availability or conformance is claimed; verification.md defines evidence.

### NFR-01: Accessibility and usability

- Target WCAG 2.2 Level AA across the supported journeys, including keyboard operation, visible focus, readable labels, understandable validation, and status indications that do not rely solely on color.
- Provide an accessible way to inspect roadmap topics, relationships, resources, and progress actions without depending solely on pointer gestures or visual interpretation.
- Distinguish loading, empty, success, and failure states. Communicate when an operation is pending and whether a save succeeded.
- **Verification:** keyboard and assistive-technology walkthroughs, supported by automated checks. Automated checks alone do not establish conformance. Reference: [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

### NFR-02: Desktop compatibility and accessible reflow

- The MVP supports desktop/laptop layouts at approximately 1280–1920 px. Forms, menus, roadmap navigation and topic resources shall remain readable and operable across these widths. Preserve browser zoom, keyboard access and sensible overflow/reflow; mobile-specific layouts and navigation are outside MVP scope. Existing functioning mobile code may remain.
- Support current stable Chrome, Edge, Firefox, and Safari on their applicable platforms. Record exact browser versions and representative viewport sizes in the release QA matrix.
- The initial interface and curated content shall be in English and broadly applicable without country-specific education or employment guidance.
- **Verification:** the browser/device matrix shall cover account entry, catalog, roadmap/topic actions, Dashboard, and Settings.

### NFR-03: Performance and responsiveness

- **Page targets:** LCP ≤2.5 seconds, INP ≤200 ms, CLS ≤0.1; field 75th percentile by device when available. Label controlled lab measurements and their limits. These are selected objectives, not achieved results. See [verification](verification.md) and [Web Vitals](https://web.dev/articles/vitals).
- **Warm normal-operation target:** p95 ≤2 seconds for catalog queries, ordinary reads and profile/progress/focus saves under 20 active users with representative content. This is the QA workload, not a forecast or capacity guarantee; record network/device/cache conditions and separate cold starts.
- **Feedback target:** show pending feedback within 1 second. Hosted cold startup has a separate 90-second budget, then recoverable failure; no blind mutation retries. Measure upload, external auth and resources separately.
- **PDF-processing limit:** 120 seconds from accepted upload through analysis/application; failure preserves prior successful context. Late results cannot overwrite newer/removed data. F-002 defines recommendation and extraction budgets.
- **Verification:** run the selected warm/cold conditions in verification.md and report measurements; do not treat selected targets as passed checks.

### NFR-04: Reliability and data consistency

- Acknowledged profile, focus, branch, and topic-state saves shall persist across refresh and later authenticated sessions. Failures shall not appear successful; preserve recoverable input and offer retry where applicable.
- Enforce the single-Learning-topic rule across simultaneous sessions/tabs. Duplicate requests and retries shall not create duplicate progress records or calendar credit beyond the accepted counting rules.
- Failed or cancelled focus/branch switches shall not be represented as completed. Preserve previous successful context as required by REQ-05 and REQ-11.
- Removed, superseded, or deleted document/account context shall not be restored by stale analysis responses.
- **Verification:** refresh/revisit, failed-network, retry, concurrent-session, and stale-response scenarios using nonproduction data.

### NFR-05: Security and access control

- Enforce authentication and account ownership for protected records and operations. Changing a URL, record identifier, or request body shall not grant access to another account's data.
- Use HTTPS in deployed environments. Passwords shall be handled through secure authentication facilities and shall not be stored or logged in readable form. Privileged service credentials and AI-provider secrets shall remain outside browser-delivered code and version control.
- Keep uploaded files and extracted context private to authorized access. Validate supported file type and size on the receiving service, independently of browser validation.
- Apply origin-specific edge/provider protection, receiving-service CAPTCHA, account/destination/IP/global quotas, bounded execution and an incident response process. [Security and operations](security-and-operations.md) owns selected limits, privacy policy and compatibility gates; browser cooldowns alone do not qualify.
- **Verification:** account-isolation, unauthorized-request, file-validation, secret-exposure, and authentication-flow checks.

### NFR-06: Privacy and data lifecycle

- Use profile and document information for the stated career and learning-guidance purposes. Explain what information is sent to an external analysis provider and how it is used before users choose to upload.
- Apply the accepted replacement, removal, and account-deletion behavior. Removed context shall stop informing subsequent recommendations; confirmed account deletion shall end access immediately.
- Exclude passwords, tokens, recovery codes, document contents, and unnecessary personal information from normal diagnostic logs.
- Apply active-storage deletion, backup, log and result-retention deadlines from the security baseline; verify provider settings and disclose processing before real users. Application removal is not proof of immediate deletion everywhere.
- **Verification:** access/lifecycle walkthroughs, log review, deletion/removal checks, and documented storage/provider settings. These requirements do not establish jurisdiction-specific legal compliance.

### NFR-07: External-service failure and analysis integrity

- Recommendation or document-analysis failure shall not block authenticated catalog browsing, curated roadmaps/resources, or progress actions when their required core services remain available.
- Validate analysis output against approved structured fields before automatic application. Treat document text and model output as data: embedded instructions shall not override application rules, authorization, or permitted operations.
- Apply supported extracted information only; missing background remains unknown. Recommendation references shall correspond to real catalog items.
- Long-running requests shall use defined timeouts and bounded retry/cost controls. Failure or invalid output shall produce an understandable state and retain previous successful context where required.
- **Verification:** representative valid/invalid documents, misleading document instructions, malformed output, provider failure, timeout, and invalid-reference cases. Selected quality thresholds and budgets are in F-002 and verification.md; actual provider quotas/settings must be checked at deployment.

### NFR-08: Availability and recovery

- **Availability policy:** evaluated free-tier MVP has no always-on service commitment. Track observed monthly availability; 99% remains an improvement objective, not a release promise. Public production requires a separate hosting/reliability review; do not silently upgrade or claim an SLA.
- Provide understandable outage/retry feedback when a required service is unavailable.
- Establish documented backup, restoration, and release-recovery procedures before release with real user records. Verify restoration in nonproduction and prevent removed context or deleted accounts from unintentionally becoming active after recovery.
- Target RPO 24 hours and RTO one working day; daily encrypted backups retained seven days, isolated restore before real-user release and monthly afterward. Include private objects and reapply deletion intents before access, per the security baseline; no achieved recovery guarantee is claimed.
- **Verification:** monitoring configuration, a recorded restore exercise, and deployment-recovery instructions.

### NFR-09: Maintainability and reproducible development

- A teammate shall be able to obtain and run the documented development environment without undocumented files from another person's machine.
- Document runtime versions, dependencies, configuration names without secrets, commands, migrations, and sample-data setup. Keep database changes reproducible and versioned.
- Use stable content identities and explicit relationships so content maintenance cannot silently corrupt saved progress. Follow the publication/revision policy below; migrations/API changes still require technical review.
- Keep canonical requirements, contracts, and setup guidance discoverable. Frameworks, containers, repository structure, and content-management tooling are architecture choices rather than requirements imposed here.
- **Verification:** successful setup by another teammate and review of a representative schema/content change.

### NFR-10: Operational visibility and diagnosability

- Record sufficient non-sensitive error and operation information to investigate failed saves, upload/analysis failures, and deployment incidents.
- Associate failures and long-running work with traceable operation identifiers. Distinguish upload, processing, application, cancellation, and failure outcomes.
- Provide appropriate health information to authorized maintainers and meaningful status feedback to users.
- **Verification:** demonstrate that an ordinary failure can be investigated from recorded evidence without exposing document text, credentials, or another user's data.

## Product evaluation

Evaluate Discovery for comprehension, completion effort, uncertainty handling, and suggestion usefulness when its requirements are reviewed. Evaluate later recommendations against relevant changes in user context. Product outcomes include understanding a role, finding a relevant topic/resource, choosing outside suggestions, and resuming retained progress. F-001/F-002 and verification.md select controls, refresh and evaluation thresholds. No results are claimed; these NFRs do not validate a recommendation algorithm.


## Working demo and final MVP scope

Scope record: SCOPE-001 · 24 October 2026 · Draft reflecting the scope consultation.

### Purpose and capacity

- Evaluated project demonstration; public adoption is not the release objective.
- A one-day working-demo target was requested. Available hours, implementation experience, and reviewed content readiness are not established; this is a timebox target, not a feasibility guarantee.
- Use the approved React/Vite/TypeScript frontend on Vercel, FastAPI backend on Render, Supabase PostgreSQL/Auth/Storage, and Docker Compose plus local Supabase. [Architecture](architecture.md) supersedes earlier Next.js/native-only proposals.
- Support isolated account data under the selected 20-active-user QA workload. Actual evaluator attendance is a delivery fact to confirm, not measured capacity.

### Working demo and final MVP

| Capability | Working demo | Final MVP |
| --- | --- | --- |
| Career coverage | All seven named launch roles, each with reviewed explanation and introductory roadmap | Same inventory; additional roles optional |
| Recommendations | LLM-based, grounded in available catalog content, with validated career IDs and supported explanations | Same architecture, with evaluated prompts and failure behavior |
| PDF extraction | May remain nonfunctional; any displayed unavailable action must be clearly labeled and must not claim analysis success | Working optional extraction required under REQ-11 |
| Future agents and PDF reviewer | Future extensions; preserve separate service contracts | Not automatically included in final MVP |

The 25 October 2026 review confirms the launch categories and roles in Product scope. Earlier four-category frames are incomplete launch coverage. Hardware & Embedded Systems and Networking & Infrastructure are included; Software and AI remains combined with two distinct launch roles.

Topic membership, descriptions, and resource links for all seven launch roles remain to be supplied or reviewed. A roadmap must include coherent introductory topics and resources; a title-only card does not meet the minimum.

### Protected end-to-end journey

Authenticate → choose Guided Discovery or Free Browsing → inspect explained career suggestions / catalog entries → open a role's explanation and roadmap → explicitly set current focus → open topic resources → save Learning / Done / Skip / Clear → return to Dashboard and continue with retained progress.

All seven named launch roles are the content floor; each of the six categories is covered. Journey success also requires working account isolation, persisted progress, and honest failure feedback.

### Build-now boundaries

- Account entry and required verification / recovery, with new versus returning routing: REQ-01, REQ-13.
- Conditional Discovery questions and explained results under F-001's selected controls, using the five existing themes as a content baseline: REQ-04, REQ-05. Later question/choice sets may depend on earlier answers. The reviewed route map, persistence, authored content, service integration and comprehension/quality evidence remain required.
- Searchable category catalog, role explanation, curated roadmap / resources: REQ-02, REQ-03, REQ-07.
- Explicit current roadmap, reversible independent topic states, and account-wide single Learning topic: REQ-08, REQ-09.
- Dashboard continuation, milestone progress, groups, activity, and relevant empty / end states: REQ-10.
- Profile and catalog preferences: relevant parts of REQ-11.

This list describes the proposed protected demo. It does not establish that all work fits one day. No authentication, calendar, or account-management requirement has been silently removed. Any further working-demo deferrals must be recorded explicitly before approving its implementation plan.

### Remaining delivery evidence

- Reviewed explanations, curricula, topic membership, and resources for the confirmed six-category, seven-role inventory.
- Final-MVP account security, linking, deletion and optional working PDF analysis remain required. A demo may label PDF analysis unavailable, but must never claim it worked. No further silent deferrals.
- Execute the verification rubric and 20-active-user workload; record actual evaluator attendance and person-hours before promising a delivery date.
- Approved architecture exists; reviewed implementation contracts and bounded feature plans still require technical review before code. Documentation choices do not create a runtime.
