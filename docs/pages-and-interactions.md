---
id: DESIGN
kind: design
status: draft
requires: [PRD]
---

# Asgard: Pages and interactions

Status: Owner-delegated interaction baseline · Updated 26 October 2026 · Canonical presentation and Auth/Profile source implemented; feature integration and acceptance pending

This guide uses short content and interaction descriptions across five page categories: Landing / Account Entry, Discovery / Setup, Dashboard / Home, Careers / Roadmaps, and Settings.

The controls below describe intended behavior unless explicitly identified as current prototype behavior. [Design](design.md) documents implemented presentation; [Development](development.md#current-foundation-status-and-evidence) distinguishes working foundation source, labeled samples, authenticated 501 stubs and pending acceptance. Current Google, MFA, recovery, upload and learning actions must not be inferred from the intended screen descriptions. The [password resolution](decisions.md#password-minimum-resolution) selects an eight-character minimum without enabling unfinished account features.

[Product requirements](product.md) own outcomes and constraints; [journeys](user-journeys.md) own routes and [decisions](decisions.md) track open details. This guide consolidates the simple guide and unique detail from the previous page specification. [Static exports](design/figma/) supply layout references, not proof of functioning interactions, completed design, or approval. Screen IDs below are logical references rather than implementation routes or Figma node IDs.

**Reading the Missing blocks:** These identify PRD-required content, controls, or states not shown or not established in the supplied frames. Some are already described in this guide as intended behavior; that description does not establish completed frame coverage. Static frames do not verify working interactions. Existing screenshot content that needs correction remains under Recorded design decisions. A missing state may be a variation of an existing screen rather than a separate page. Selected controls below replace prior provisional choices; provider compatibility and unrun tests remain evidence gates.

## Screen references and requirement coverage

| Page group | Screen IDs | Functional requirements |
| --- | --- | --- |
| Landing page and login | LANDING; AUTH-REGISTER, AUTH-VERIFY, AUTH-LOGIN, AUTH-PASSWORD-RECOVERY, AUTH-SECOND-FACTOR | REQ-01, REQ-13; REQ-11 for 2FA |
| Discovery/Setup | ENTRY-CHOICE; DISC-INTERESTS, DISC-ACTIVITIES, DISC-WORK-APPROACH, DISC-BACKGROUND, DISC-GOALS, DISC-RESULTS | REQ-04, REQ-05; REQ-01 for resume |
| Dashboard/Home | DASHBOARD; ACCOUNT-MENU | REQ-10; REQ-08, REQ-09, REQ-11 for linked actions |
| Careers/Roadmaps | CAREERS-CATALOG; ROADMAP-DETAIL; TOPIC-PANEL; RESOLVE-LEARNING | REQ-02, REQ-03, REQ-07, REQ-08, REQ-09; REQ-05 for suggestions |
| Settings | SETTINGS-PROFILE; PROFILE-ENRICHMENT; SETTINGS-ACCOUNT; TWO-FACTOR-ENROLLMENT; RECOVERY-CODES; ACCOUNT-DELETE | REQ-11, REQ-13; REQ-04 for retakes |

REQ-06 and REQ-12 remain outside MVP. Career saving/comparison, tutor/chat interfaces, and chatbot preferences are not included. NFR-01 through NFR-10 apply across all groups; the shared quality coverage at the end maps their interface effects.


## Shared behavior

### Navigation and terminology

- The authenticated application uses the reference header's Dashboard, Roadmap, Settings, and account/avatar entry points. Roadmap opens the career catalog. Existing page actions lead to Discovery, recommendations and roadmap availability; progress belongs to Dashboard. There is no separate UI Preview navigation or route tree.
- Settings opens Profile. Its shared navigation and the account menu expose Profile and Account and security. Successful Log out returns to the public landing page at `/`. Confirm discarding dirty profile edits before logging out; an active profile save must finish first.
- During the approved prototype phase, authenticated feature routes are the canonical layouts and retain sample fixtures and visual-state controls. Label demo data clearly; sample roles, recommendations and progress must not appear to be persisted account data. Profile remains backed by the real account API; background documents, saved suggestions and preference controls remain clearly labeled prototypes within that page.
- Protected pages require authentication. Unauthenticated access opens account entry; expired sessions provide a recoverable authentication route.
- New authenticated users reach ENTRY-CHOICE. Returning users reach Dashboard. Unfinished Discovery produces an optional Resume Discovery action using saved answers.
- Each roadmap detail has its own addressable URL. Animation may accompany navigation without removing that URL.
- Back, Close, opening a topic, and viewing resources do not independently save form changes, change focus, or change topic status.

### Shared contextual guidance

Owner-confirmed direction, 25 October 2026: use a shared informational guidance component across Dashboard, Careers, and Settings, with relevant messages rather than a universal warning.

- Show at most one general guidance banner with one relevant action and a dismiss control. Dismissal of the same message persists across pages and future visits. Priority: Resume Discovery, unfinished basic profile, Start Discovery, optional background enrichment. Show the first eligible undismissed message. After dismissal, wait until the next navigation/visit before offering another. Persist per account/message across devices; copy edits do not reset dismissal. Career exploration stays an ordinary link in roadmap detail.
- Until a nonempty First name is saved, offer Edit profile: “Finish setting up your profile. Adding your name is enough; a photo and PDF are optional.” Saving the name hides this basic-profile prompt everywhere.
- Without completed Discovery, offer Start Discovery, or Resume Discovery when saved answers exist: “Want suggestions based on your interests? Try Discovery, or keep browsing.” Adapt copy for a resumable session; browsing remains available.
- In roadmap detail, offer the ordinary Browse careers link: “Browse other careers. Your saved roadmap progress will be kept.” This opens the catalog without changing focus. Normal navigation remains available after dismissal.
- Optional background help: “You can optionally add a resume or project summary to give suggestions more background.” A missing PDF does not make a profile incomplete. Do not promise improved recommendation accuracy from name/photo completion. Offer this banner only in Careers after a successful Discovery result, with no active/pending PDF and no higher-priority message; inline Profile help remains available.
- Settings / Profile places relevant help beside its fields instead of a banner linking to itself. Helpers never automatically open setup, gate learning, change progress/focus, or establish D3 recommendation-refresh rules.

### Persistence and feedback

- Distinguish loading, empty, pending-save, success, and failure states. Never display a failed save as successful.
- Place validation beside its field and preserve recoverable form input after request failure.
- Core controls require keyboard access and visible focus. Menus and panels need accessible names, a reliable close action, and focus return to their trigger.
- Retain light neutral surfaces, dark text/actions and green progress accent from the references. Verify contrast, use semantic danger styling for errors/destructive actions, and honor reduced motion. No new visual identity is required; token values are implementation details.


## 1. Landing / Account Entry

### Landing Page

#### Content Area

- Product Identity and Introduction
  - Shows: Product name and a short explanation of its purpose

- Create an Account
  - On click: Opens the registration form

- Sign In
  - On click: Opens the login form

- Continue with Google
  - On click: Starts Google authentication
  - On success: Follows the account-entry destinations below, including enabled 2FA when required
  - On cancellation or failure: Returns to account entry with feedback

### Create an Account

#### Content Area

- Registration Form
  - Shows: Create an account heading, brief instructions, Email, Password, and Confirm Password
  - On input: Accepts account details; passwords must match

- Send Email Code
  - On click: Validates the form and requests email verification
  - On success: Opens Check Your Email
  - On invalid input or failure: Shows feedback and allows correction or retry

- Continue with Google
  - On click: Starts Google authentication

- Already Have an Account? Sign In
  - On click: Opens the login form

### Check Your Email

#### Content Area

- Verification Instructions
  - Shows: Check your email heading, destination email, and guidance to check the spam folder

- Email Verification Code
  - Shows: Code-entry fields; the screenshot illustrates six boxes
  - On Verify click: Checks the entered verification code; entering the final digit does not automatically submit
  - On success: Completes email verification and follows the account-entry destinations below
  - On invalid or expired code: Shows feedback and allows recovery

- Resend Code
  - On click: Requests another verification email when permitted
  - Shows: Sending feedback and any resend wait or failure message

- Return to Sign-in
  - On click: Opens sign-in without granting access or marking the email verified

### Login

#### Content Area

- Login Form
  - Shows: Login heading, brief instructions, Email, and Password

- Login Button
  - On click: Submits the email and password
  - On success: Opens the authenticator challenge if enabled; otherwise follows the account-entry destinations below
  - On failure: Shows feedback and allows retry

- Continue with Google
  - On click: Starts Google authentication

- Forgot Your Password?
  - On click: Opens password recovery

### Password Recovery

#### Content Area

- Recovery Request Form
  - Shows: Email field, recovery instructions, and request action
  - On submission: Requests password recovery and shows the request outcome

- Password Reset Form
  - Shows: New-password entry after verified recovery
  - On submission: Validates and saves the new password
  - On success: Allows normal sign-in, including enabled 2FA
  - On invalid, expired, or failed recovery: Shows feedback and a recovery action

- Return to Login
  - On click: Opens the login form

### Authenticator Verification

#### Content Area

- Authenticator Code
  - Shows: Check your authentication app heading, instructions, and six-digit code entry
  - Appears: During sign-in when authenticator 2FA is enabled
  - On Verify click: Checks the authenticator code; explicit submission is the selected interaction
  - On success: Follows the account-entry destinations below
  - On invalid or expired code: Shows feedback and allows retry

- Use a Recovery Code
  - On click: Opens recovery-code entry
  - On successful submission: Completes the second factor using a valid issued code; that code cannot be reused

### Account-Entry Destinations

- New Account
  - After successful authentication and required verification: Opens Welcome with Guided Discovery and Browse careers choices

- Returning Account
  - After successful authentication and required verification: Opens Dashboard
  - If Discovery is unfinished: Offers Resume Discovery on Dashboard

### Page States

- Signed out: Show public account-entry actions
- Processing: Show the current authentication, code, or recovery request in progress
- Invalid input: Show feedback beside the relevant field
- Verification pending: Keep the code-entry and recovery actions available
- Authentication or provider failure: Show feedback and a retry or return action
- Expired session: Offer a route back to sign-in

### Recorded design decisions

- Landing: Compact public introduction with Create an account, Sign in and Continue with Google; forms are supporting views. Google release requires AUTH-C1 compatibility evidence.
- Code submission: Explicit Verify for registration, authenticator and recovery codes; support paste/autofill and one accessible input even if visually segmented. Use provider timing/format in the security baseline; no automatic submission.
- Email verification recovery: Use Resend code and Return to sign-in below code entry, with request/wait/failure feedback. This placement is selected; the frame does not establish working coverage.
- 2FA setup: The method-selection and QR-code screenshots belong to optional Settings / Account and Security setup under the current requirements. Setup also needs code verification and recovery codes.
- 2FA methods: The screenshot lists Authenticator App, SMS Message, Email Code, and Push Notification. Current requirements include Authenticator App only. Email registration verification is a separate step.
- Password recovery: Required by the project documents; its supporting screens are not supplied in this iteration's images.

### Missing:

- Compact Landing Composition: REQ-01
  - Shows: Product identity, purpose, and supported account-entry actions together; the supplied frames show the supporting forms.
- Password Recovery and Reset: REQ-01, REQ-13
  - Shows: Recovery request, request feedback, verified new-password entry, and return to sign-in.
- Email Verification Recovery: REQ-01
  - Shows: Invalid / expired code feedback and a recoverable route. Resend and return controls are described in this guide but absent from the frame; use the specified placement and provider-aware cooldown feedback.
- Authentication Feedback: REQ-01, REQ-13
  - Shows: Field validation, mismatched passwords, processing, failed credentials, Google cancellation / failure, and expired-session recovery.
- Second-Factor Recovery: REQ-01, REQ-11
  - Shows: Recovery-code entry for an unavailable authenticator, code validation feedback, and successful continuation.

### Account-entry constraints

- Confirm password is form validation, not a separately stored account attribute. Registration alone grants no access.
- The registration email code verifies email/password registration; it does not establish passwordless email-code login. Use format/timing, password and abuse policy in [Security and operations](security-and-operations.md#account-access-and-recovery).
- A matching email must not silently merge accounts. Authentication errors must not expose private account details.
- Password recovery must not bypass enabled 2FA. A recovery code becomes invalid after successful use.
- The 18+ audience does not establish a date-of-birth field or age-verification flow.

### Selected account-access policy

The owner delegated remaining choices on 25 October 2026. Security and operations owns the limits/lifecycle and AUTH-C1/C2 provider gates; no custom password/MFA system is authorized.

- Explain the 18+ audience beside account entry without collecting date of birth. An age-verification mechanism is not established by this notice.
- Submit email, authenticator, and recovery codes explicitly with Verify. Keep input available after recoverable failure; do not submit automatically on the final digit. Disable repeated submission while a request is pending and announce its outcome accessibly.
- Password-reset requests show the same neutral acknowledgment whether an account exists. Explain request/service failures without disclosing account existence. After a valid reset, return to normal sign-in, including enabled 2FA.
- Do not merge duplicate or same-email identities automatically. Direct users toward sign-in/recovery or the existing explicit Google-linking flow without revealing another account's private details.
- Before 2FA disablement or recovery-code regeneration, require fresh primary authentication and an existing authenticator or valid unused recovery code. A session alone is insufficient. Notify the account holder after a successful factor change. New recovery codes invalidate the previous set only when replacement succeeds; reveal the new set once and prompt the user to save it. Cancelled/uncommitted changes preserve the prior working state. A lost response after committed provider rotation requires status recovery; prior codes may already be invalid.
- Before account deletion, explain consequences, require explicit confirmation and fresh authentication, and complete enabled 2FA using the established factor/recovery route. Confirmed success ends access immediately. Physical deletion and backup timing follow the security baseline.
- Loss of all factors/codes has no manual/email-only bypass in MVP. Show recovery unavailable; password reset never removes 2FA. Do not promise a support override.
- Use provider-managed codes and security-baseline limits. Count/format follows verified provider capability; direct-endpoint behavior, hosted settings and security review require executed evidence.

Security review references: [OWASP MFA guidance](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) and [OWASP password recovery guidance](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html). These support the safeguards; they do not approve a provider implementation.

## 2. Discovery / Setup

Use the existing five themes as the content baseline, followed by results after the applicable conditional route. Later questions or choice sets may depend on earlier answers. The [Discovery copy draft](specs/discovery.md#discovery-copy-draft) owns the baseline headings, questions, card labels, descriptions, uncertainty wording, and shared messages. The 26 October 2026 owner clarification supersedes fixed-five/no-branch wording; Assignment A must propose the route map and inactive-answer behavior. The selected baseline controls and persistence in F-001 apply subject to that reviewed route; screenshots and historical prototypes do not define routing.

### Entry Choice

#### Content Area

- Introduction
  - Shows: How would you like to begin? and a short explanation of the two paths

- Guided Discovery and Browse Careers Cards
  - Shows: Path name, illustration or icon area, and a short description
  - On click: Selects the card, highlighting its border and showing a Selected label as pictured

- Continue
  - On click with Guided Discovery selected: Opens the first question round
  - On click with Browse careers selected: Opens the career catalog

### Question screens and conditional route

#### Content Area

- Discovery Heading and Progress Indicator
  - Shows: Discovery title and progress through the active route; the current five-screen progress indicator is skeleton content and must be replaced by route-aware progress when questions are authored

- Question and Instructions
  - Shows: The current question, its subject, and a short explanation of how to answer
  - Subject labels: Your interests; Activities you might enjoy; How you approach problems; Your background; Your goal
  - Exact copy: Use the Discovery copy draft; preserve the existing subject order and meaning

- Content / Answer Cards
  - Shows: Choice title, short description where supplied, category label, and illustration or icon area
  - On click: Selects the answer card, highlighting its border and showing a Selected label as pictured
  - Exact content: F-001 baseline content; show the authored question/choice set for the active route

- Next / See Suggestions
  - Shows: Next for questions with a later active step; See suggestions on the final question in the applicable route
  - On click: Validates and saves the current answer, then advances; save failure retains recoverable input
  - On the last question round: Submits the answers and opens the results when ready

#### Navigation

- Back
  - On click: Follows F-001 checkpoint save/validation policy, then returns with prior answers retained; opening prior rounds never fabricates a saved current answer

- Skip Questions and Browse Careers
  - On click: Opens the career catalog
  - Saved unfinished answers: Can be resumed later from Dashboard

### Final Round: Discovery Results

#### Content Area

- Results Heading and Progress Indicator
  - Shows: Completed progress indicator, Careers to explore heading, and the introduction from the Discovery copy draft

- Suggested Career / Field Cards
  - Shows: Up to three role names, descriptions, supported reasons, career skills and View roadmap on each
  - On View roadmap: Opens that detail URL directly; no selected-result state or automatic focus
  - Browse careers: Opens the full catalog with supporting suggestions and no implicit role/category selection

- Browse Careers
  - Shows: Browse careers; older exports use Show Suggestions or Proceed to Roadmap for this handoff
  - On click: Opens Careers for further exploration

- Retake Discovery
  - On click: Returns to the Discovery questions to review or change answers and request updated suggestions

- Set Up Your Profile (Optional)
  - Shows: An optional profile action; name/photo setup is distinct from optional career-background analysis
  - On click: Opens the optional profile setup form below
  - Can be skipped: Browse careers remains available without completing a profile

- Back
  - On click: Returns to the preceding question round

### Optional Profile Setup

#### Content Area

- Profile Introduction
  - Shows: Set up your profile heading and a brief explanation that setup is optional and available later from Dashboard

- Profile Photo
  - Shows: Photo placeholder and upload control
  - On click: Opens a file chooser for an optional profile photo

- Name Fields
  - Shows: First name and optional Surname fields
  - On input: Accepts the user's name

- Academic Records or Resume (Optional)
  - Shows: PDF upload area, drag-and-drop instructions, Browse Files, and a 10 MB limit
  - On drop or Browse Files: Selects/validates a candidate; Analyze PDF explicitly authorizes upload/analysis after the disclosure
  - Shows feedback: File validation, uploading, analysis, success, or failure

- Proceed
  - On click: Saves the profile details
  - On successful save: Returns to Discovery results; the user can continue to Careers
  - On failure: Shows feedback and allows correction or retry
  - Photo and PDF: Optional; a failed document analysis does not prevent saving the name

- I'll Set This Up Later
  - On click: Returns to Discovery results without requiring profile completion

- Back
  - On click: Returns to Discovery results

### Page States

- Answer selected: Show the highlighted card and Selected label
- Processing results: Show progress while suggestions are prepared
- Request failure: Show feedback and a retry or browsing action; retain answers and previous successful suggestions
- Unfinished Discovery: Allow an explicit resume from Dashboard

### Recorded design decisions

- Controls: Entry starts unselected. F-001 specifies baseline checkbox/radio controls, uncertainty/background exclusions, validation and saved checkpoints. Conditional questions and choice sets follow the reviewed route map.
- Entry action: Guided Discovery, Browse careers, Continue. Remove the duplicate Start Assessment control.
- Results actions: View roadmap opens the associated detail; Browse careers opens the full catalog. No result selection or focus change.
- Match badges: The screenshots show match percentages. The current requirements omit them, so this draft leaves them out of card content.
- Profile wording: The supplied profile screenshot says Set up your student profile and uses Full Name. This draft follows the current project wording, Set up your profile, with First name and optional Surname.

### Missing:

- Explicit Uncertainty Choices: REQ-04
  - Shows: A way to answer unsure within Discovery, including the first three rounds where it is absent from the pictured cards. Exiting to Free Browsing does not replace this answer option.
- Selection Instructions and Validation: REQ-04
  - Shows: Whether a question accepts one or several choices, required-answer feedback, and treatment of optional inputs. Use F-001 controls and validation.
- Why Each Suggestion Appeared: REQ-05
  - Shows: A plain-language explanation tied to supplied answers or other relevant context. Role descriptions and key-skill chips alone do not provide this explanation.
- Unavailable or Failed Results: REQ-05
  - Shows: No usable result, incomplete catalog content, or invalid result-reference feedback, with retry and full-catalog browsing actions.
- Retake and Changed-Answer States: REQ-04, REQ-05
  - Shows: Retained answers and previous successful suggestions during a failed retake. Earlier edits recompute the active route; inactive-answer retention or clearing follows the reviewed policy. Concurrent saves require explicit conflict recovery.
- Optional Profile Feedback: REQ-11
  - Shows: Saving / saved / failed profile states and PDF validation, uploading, analyzing, completed-analysis, and failure states. Upload success must be distinct from analysis success.
- Document-Use Explanation: NFR-06
  - Shows: What supplied document information is used for and what is sent to an external analysis provider, where applicable, before upload. Use the Groq disclosure/security baseline and verify actual data settings before real documents.

## 3. Main Dashboard / Home

### Header

- Navigation
  - Shows: Product name, Dashboard, Roadmap, and Settings
  - On Dashboard click: Opens Main Dashboard
  - On Roadmap click: Opens the career / roadmap catalog
  - On Settings click: Opens Settings

- Account Icon
  - On click: Opens the account menu

### Content Area

- Main Milestone Card
  - Shows: Current core milestone name, completion bar, percentage, and Continue
  - Milestone shown: Follows the active topic in the current roadmap; otherwise uses the earliest milestone with an available next topic
  - Progress: Topics marked Done out of all applicable topics in that milestone
  - On Continue click: Opens the active topic's details and resources
  - With no active topic: Offers a starting or next suggested topic; opening it does not mark it In Progress

- Milestone / Topic Group Heading
  - Shows: The milestone or learning-group name above its topic lists

- Not Started
  - Shows: Topics with saved Not started status, including relevant starting or next-topic suggestions
  - On heading / arrow click: Expands or collapses the list
  - On topic click: Opens that topic's details and resources

- In-Progress
  - Shows: The single topic currently marked Learning, with its milestone context
  - On heading / arrow click: Expands or collapses the list
  - On topic click: Reopens that topic's details and resources

- Complete
  - Shows: Topics marked Done, including recent completions
  - On heading / arrow click: Expands or collapses the list
  - On topic click: Opens that topic's details and resources, where its status can be changed

Opening topics and expanding lists do not change topic status. Skipped topics remain available in the roadmap.

### Supporting Area

- Current Role Card
  - Shows: The explicitly selected career / roadmap name; the screenshot also includes a short quote
  - On Edit click: Opens the career catalog to explore another roadmap
  - Current role changes: Only after an explicit Set as current roadmap action in Careers / Roadmaps

- Activity Calendar
  - Shows: Month, weekday labels, daily activity cells, and completion intensity
  - On date selection or keyboard focus: Shows that day's completed-topic count
  - On month navigation: Shows an earlier month; navigation controls are required but not drawn in this screenshot
  - Activity source: Topics marked Done on that local date

- Streak Counter
  - Shows: Consecutive days with qualifying Done activity, accompanied by the pictured flame indicator

- Profile Enrichment
  - Shows: An optional profile-setup action until a nonempty First name is saved
  - On click: Opens Settings / Profile

- Profile Helper Message
  - Shows: The eligible basic-profile message from Shared contextual guidance, distinct from optional background enrichment
  - On dismiss: Hides the helper across future visits; a dismiss control needs to be included

### Account Menu

- Account Name
  - Shows: Saved name or a neutral fallback

- Edit Profile
  - On click: Opens Settings / Profile

- Settings
  - On click: Opens Settings

- Log Out
  - On click: Ends the session and returns to Landing

### Page States

- No current roadmap: Show Go to Careers to choose a focus
- Current roadmap with no progress: Offer an authored starting topic
- No topics in a status group: Show an empty state for that group
- All applicable topics Done: Show completion feedback and Explore other careers
- Remaining topics are Done or Skipped: Show No remaining suggested topics and a roadmap link to revisit Skipped topics
- Unfinished Discovery: Offer Resume Discovery
- Loading or failure: Show feedback and a recovery action

### Recorded design decisions

- Dashboard milestone card: Continue learning opens the active/next topic. A separate View milestone link opens roadmap detail anchored there; the rest of the card is not an implicit click target.
- Role quote: Remove the placeholder quote; use concise curated role context and Edit focus.
- Status indicators: The circles and colors illustrate saved states. The screenshot does not establish separate status-changing click actions for them.
- Profile helper copy: Use Shared contextual guidance and retain persistent dismissal; the pictured placeholder is superseded.

### Missing:

- Clear Next-Topic and Recent-Completion Content: REQ-10
  - Shows: Identifiable authored next-topic suggestions and Recently done context alongside the existing groups, with an actionable Learning topic and its milestone context. The broad sample labels do not establish this hierarchy.
- Calendar Inspection and Navigation: REQ-10
  - Shows: Earlier-month controls and daily Done-count details on date selection / focus.
- Profile Helper Dismissal: REQ-10
  - On dismiss: Hides the helper across future visits; the pictured message has no dismiss control.
- No Current Roadmap / No Progress: REQ-10
  - Shows: Go to Careers when no focus is set, or an authored starting-topic action when a roadmap has no progress.
- Completed and Exhausted-Path States: REQ-10
  - Shows: Completion summary and Explore other careers when all applicable topics are Done; otherwise No remaining suggested topics and a route to revisit Skipped topics when only Done / Skipped remain.
- Resume Discovery: REQ-01
  - Shows: An optional resume action when saved Discovery is unfinished.
- Empty, Loading, and Failed-Load States: REQ-10, NFR-01
  - Shows: Empty topic / activity content, loading feedback, and recoverable errors using actual saved progress.

### Progress, calendar, and streak rules

- Milestone percentage = Done applicable learning topics / all applicable learning topics. Count the common path and selected alternatives; exclude unselected alternatives. Skipped applicable topics stay in the total but are not completed.
- Parent/child statuses stay independent. Group summaries must not imply mastery of incomplete groups.
- Calendar credit comes from Done topics; a topic within a roadmap counts at most once per local day. Learning, Skip, Clear, and browsing create no credit.
- Undoing Done removes its contribution and recalculates calendar/streak summaries. Use local dates. Preserve historical dates after timezone changes and use the new timezone for future activity.
- The streak counts consecutive qualifying local days. Preserve yesterday's streak through today while today's activity is pending. A full inactive day breaks it. No streak freezes are included.
- Percentages and counters describe recorded activity, not assessed competence or employability.


## 4. Careers / Roadmaps

### Role Catalog

#### Content Area

- Page Heading
  - Shows: Role Catalog

- Search Bar
  - Shows: Search career roles or skills placeholder and search icon
  - On input: Filters roles by title or associated skills
  - On clearing the search: Restores results within the selected category

- Category Filters
  - Shows: Technology category choices; the screenshot includes Software and AI, Design & UX, Data & Analytics, and Cybersecurity
  - On click: Highlights the selected category and filters the role cards
  - Initial category: Uses saved Preferred Primary Field when available; otherwise All categories. Include an All categories/reset control; do not fabricate a field preference

- Category Description
  - Shows: A short explanation of the selected category, as required by REQ-02

- Role Cards
  - Shows: Role name, description of its work, brief field / skill context, and View roadmap on each card
  - On View roadmap: Opens that role’s dedicated detail URL directly; no preliminary card selection or shared selection button
  - Focus: Opening detail does not set current focus; Set as current roadmap belongs inside detail
  - Sizing: Accommodate real authored content rather than impose a shorter-card rule. Milestone cards also allow substantial content and choices such as backend language alternatives
  - Organization: Do not group catalog roles under topic statuses such as Not Started; retain topic-status groups in Dashboard and states within roadmaps

#### Supporting Content

- Career Suggestions, When Available
  - Shows: Relevant suggested roles and a short explanation of why they appeared
  - Browsing: Keeps the full catalog available alongside suggestions

- Current Roadmap Shortcut
  - Shows: A small shortcut when a current roadmap has already been explicitly set
  - On click: Opens that roadmap

#### Navigation

- Back
  - On click: Returns to the preceding app screen
  - On returning to the catalog: Retains useful search and category context

### Page States

- Loading: Show that catalog content is loading
- Filtered results: Show roles matching the category and search
- No matches: Explain that no roles match and offer to clear the search or filters
- No suggestions: Keep normal catalog browsing available
- Content failure: Show feedback and a retry action

### Recorded design decisions

- Confirmed action change: Replace the pictured Select Role & View Roadmap flow with View roadmap on each card and Set as current roadmap inside detail.
- Role content: Repeated cards and additional roles in the screenshot are examples. Populate the confirmed launch inventory: Software and AI (Frontend Developer, Machine Learning Engineer), Design & UX (UX Designer), Data & Analytics (Data Analyst), Cybersecurity (Cybersecurity Analyst), Hardware & Embedded Systems (Embedded Systems Developer), and Networking & Infrastructure (Network Engineer). Curricula and resources still require review.
- Supporting content placement: Category descriptions, explained suggestions, and the current-roadmap shortcut are required by the product requirements but are not drawn in this screenshot.

### Missing:

- Category Explanation: REQ-02
  - Shows: A short description of the selected technology category.
- Explained Suggestions: REQ-05
  - Shows: Available recommended catalog entries and why each appeared, while keeping all roles accessible.
- Conditional Current-Roadmap Shortcut: REQ-02
  - Shows: A small direct link only after a roadmap has explicitly been set as current.
- Search / Filter Recovery: REQ-02
  - Shows: No-match feedback and controls to clear query and category filters; unknown preferences allow exploration without inventing a selected field.
- Catalog Feedback: REQ-02, NFR-01
  - Shows: Loading, unavailable content, and recoverable failure states. Each card has a direct View roadmap action; no selected-card validation state is required.
- Career Explanation in Opened Roadmap: REQ-03
  - Shows: Role name, concise About this career, and expandable / collapsible Read more with responsibilities, work examples, and skills at a dedicated URL.
- Roadmap and Topic Resources: REQ-07
  - Shows: Ordered expandable milestones, authored relationships and alternatives, accessible topic navigation, topic selection, and a detail / resource panel with close behavior that preserves context.
  - Topic content: Explanation, at least one free curated resource, applicable tool guidance, and cost / access labels. External resources open in a new tab; missing resources need feedback.
- Explicit Current Focus and Topic States: REQ-08, REQ-09
  - Shows: Set as current roadmap / Current, Learning / Done / Skip / Clear, save feedback, and state reversal. Viewing alone does not change focus or progress.
- Alternative Branches and Active-Topic Resolution: REQ-07–REQ-09
  - Shows: Authored branch selection where applicable and a dialog to resolve an existing Learning topic through Done, Skip, or Clear before conflicting changes, with Cancel and failure feedback.
- Roadmap Recovery States: REQ-03, REQ-07–REQ-09
  - Shows: Missing career content / roadmap, roadmap and resource loading errors, unavailable links, no resources, and failed focus / branch / topic saves.

### Opened roadmap: ROADMAP-DETAIL

The Roadmaps.png frame supplies the milestone-list reference. Owner-confirmed behavior below replaces earlier graph/pan/zoom requirements and pictured placeholders; responsive, keyboard, save, and failure states still need verification.

- Career Explanation
  - Shows: Role/roadmap name, concise About this career, and Read more for curated responsibilities, examples, and skills
  - On Read more click: Expands in place; collapse restores concise content
  - Address: Own dedicated URL; Back to catalog preserves focus and progress
- Set as Current
  - Shows: Set as current roadmap inside detail alongside the inspectable role overview, or the saved Current indicator
  - On click: Requests an explicit focus save; switching roadmaps first resolves any existing Learning topic
  - Revision behavior: Apply Product publication/revision policy; retired topics preserve history and unavailable roadmap content never silently changes focus
  - On cancellation or failure: Does not claim that the requested focus switch succeeded
- Expandable Milestones and Alternative Paths
  - Shows: Authored milestones, topics, advisory relationships, alternative branches, and status indicators
  - Structure: Role overview, ordered expandable milestones, topics, then topic details/resources; no tree canvas or pan/zoom requirement
  - Milestone content: Title, short learning outcome, and Done/applicable-topic count; expand/collapse never changes statuses, and completion is calculated
  - Overview: Keep useful learning content visible; longer career explanation belongs behind Read more
  - Topic rows: Actual topic names and text status labels; selected-topic styling differs from Learning and Done
  - Hide completed: Filters Done topics only without changing counts or states; Skipped remains accessible and separate from visibility
  - Alternatives: Present authored choices, such as backend language alternatives, inside the relevant milestone and show applicable topics; cards grow with content
  - Keyboard: Explicit accessible expansion/selection controls and visible focus; prerequisites remain advisory
  - On topic click: Opens the topic/resources panel
  - On branch selection: Uses the selected path for suggestions and percentages, preserves both histories, and resolves an active Learning topic if excluded
  - Before required path choice: Show common-topic counts and Choose a path; withhold full-path percentage. Never silently preselect an alternative
  - State ownership: Overlapping topics in different roadmaps retain separate progress; empty milestones cannot be published

### Topic resources: TOPIC-PANEL

- Content and Resources
  - Shows: Topic name, milestone/path context, explanation, at least one free curated resource, applicable access/cost labels, and starter-tool guidance
  - On resource click: Opens a new tab; viewing creates no progress or calendar credit
  - On Close: Restores milestone expansion, selected-topic context, and keyboard focus without changing progress
  - Desktop: Clearly identify the selected topic in its row and panel title; the panel may remain visible while topics scroll
  - Reflow: Preserve existing smaller-width topic details and an obvious return action restoring list context. This supports zoom/reflow; new mobile-specific layout work is outside the desktop MVP scope in NFR-02
  - On unavailable content: Shows feedback rather than inventing replacement resources
- Learning / Done / Skip / Clear
  - On explicit successful save: Changes only this topic; Clear restores Not started
  - Learning limit: At most one Learning topic across the account; resolve any other active topic first
  - Independence: Parent, child, and sibling states do not propagate; Done is user-reported completion
  - On failure: Shows the actual saved state; supports desktop and keyboard interaction, including browser zoom/reflow

### Resolve active learning: RESOLVE-LEARNING

- Resolution Dialog
  - Shows: Existing Learning topic and roadmap, the pending action, Done / Skip / Clear, and Cancel
  - Applies to: Starting another topic, switching current roadmap, or selecting a branch that excludes the active topic
  - On resolution success: Continues the pending request; the requested action waits for resolution
  - On cancellation or failure: Does not claim a completed switch
  - On a later failure after resolution saved: Reports that partial outcome without claiming an unperformed rollback

## 5. Settings

### Navigation

- Profile
  - Shows: The selected Settings navigation item
  - On click: Opens the Profile content

- Log Out
  - On click: Ends the session and returns to Landing

### Profile

#### Content Area

- Profile Photo
  - Shows: Saved photo or a placeholder with an edit control
  - On click: Opens a file chooser to add or replace the optional photo

- Name Fields
  - Shows: First name and optional Surname
  - On input: Allows the user to edit their name
  - After saving a nonempty First name: Completes basic profile setup and hides the basic-profile prompt across supported pages; optional background enrichment remains separate

- Save Profile
  - On click: Saves edited profile details and shows pending, success, or failure feedback
  - Placement: Save profile below name/photo fields; disabled while unchanged or saving. Explicit save, no autosave

- Active Discovery Results
  - Shows: Available saved Discovery direction and a short explanation of its source
  - Context: Describes Discovery results separately from the explicitly current roadmap

- Retake Discovery
  - On click: Opens Discovery with saved answers where applicable, allowing review and updated suggestions
  - On successful final retake submission: Generates once under F-002; generation failure retains eligible prior results
  - On failure: Retains previous successful results and offers recovery

- Preferred Primary Field
  - Shows: Category choices and the saved selection
  - On click: Selects and highlights a category
  - On save: Sets the catalog's default category
  - Effect: Does not change Discovery answers, recommendations, current roadmap, or topic progress

### Profile validation and unsaved edits

- First name: 1–100 Unicode characters after trimming outer whitespace. Surname: 0–100. Accept mononyms, spaces, apostrophes, hyphens and other scripts; no alphabet-only/legal-name rule. Reject control characters; show inline errors and a focused summary.
- Optional photos follow the security baseline (2 MB JPEG/PNG/WebP, up to 4096 pixels/side). A replacement is a pending preview committed with Save profile; failure retains the saved image/name.
- Save preferences does not save dirty profile fields. Internal dirty-form exit offers Save and leave (validate/save first), Discard, or Stay; browser warnings supplement this without promising persistence.
- Label available context Saved Discovery suggestions, distinct from Current roadmap. Name/photo completion does not claim improved recommendation accuracy.

### Academic Profile and Document Management

#### Content Area

- Document Card
  - Shows: Active PDF filename, actual upload / analysis status, Replace PDF, and Remove
  - With no document: Offers an optional PDF upload

- Upload / Replace PDF
  - On click: Opens a file chooser for a selectable-text PDF up to 10 MB
  - On selection: Validates the candidate; Analyze PDF explicitly starts upload/analysis after disclosure with separate stage feedback
  - On successful analysis: Applies supported background information; a replacement supersedes previous document-derived context
  - On failure or no usable background: Shows feedback and retains previous successful context

- Remove
  - On click: Confirms intent, then removes active/pending PDF context on accepted save and suppresses affected recommendations; removal failure does not appear successful
  - Result: Keeps the current roadmap and topic progress

### Account and Security

#### Content Area

- Authenticator App 2FA
  - Shows: Setup or enabled status
  - On setup click: Opens authenticator setup instructions and a QR code or equivalent setup information
  - On code verification: Enables 2FA only after a valid authenticator code is confirmed
  - After setup: Presents single-use recovery codes to save for future access recovery

- Linked Sign-In Methods
  - Shows: Available linked account access methods
  - On Link Google click: Starts explicit linking after proof of access to the existing account

- Delete Account
  - On click: Opens an explanation of consequences and a confirmation step with appropriate identity verification
  - On confirmed success: Ends access and begins account deletion
  - On failure: Shows feedback without reporting deletion as successful

### Page States

- Loading: Show that saved profile and account information is loading
- No Discovery results: Show an honest empty state
- No document: Show the optional upload action
- Saving profile or preferences: Show pending, saved, or failed feedback
- Uploading / analyzing document: Show each stage separately
- Document validation or analysis failure: Explain the issue and allow recovery
- 2FA setup pending or code invalid: Show instructions and correction feedback
- Account action failure: Show feedback and a recovery action

### Recorded design decisions

- Save behavior: Save profile commits name/photo. Save preferences beside Preferred Primary Field commits it independently without requiring a name. Document operations remain separate.
- Discovery label: The screenshot's Current Focus badge must clearly identify Discovery context rather than imply a current-roadmap change.
- 2FA methods: The screenshot lists SMS, email codes, and push notifications alongside Authenticator App. Current requirements support Authenticator App only.
- 2FA removal/regeneration: Fresh authentication, existing factor, confirmation and provider-managed lifecycle follow the security baseline; AUTH-C2 must pass.
- Supporting security content: Google linking, recovery codes, and account deletion are required by the product requirements but are not drawn in this screenshot.

### Missing:

- Profile and Preference Save Interaction: REQ-11, NFR-01
  - Shows: A clear way to commit changes and distinguish pending, saved, and failed outcomes. Use explicit Save profile and Save preferences; retain dirty edits after failure and offer Save and leave, Discard, or Stay on app navigation.
- Discovery Empty and Retake-Failure States: REQ-05, REQ-11
  - Shows: No successful Discovery result, saved answers during retake, and failed-retake feedback retaining previous successful results.
- Role / Catalog Action: REQ-11
  - On click: Opens the catalog to inspect roles; a role name is not directly edited here. Place Browse careers beside the saved current-roadmap summary in Settings.
- Document Upload and Analysis States: REQ-11
  - Shows: No document / upload action, invalid or oversized PDF, unsupported scanned PDF, uploading, uploaded, analyzing, analysis success / failure, and no usable background.
  - Replacement / removal feedback: Preserves previous successful context until replacement succeeds and reports the actual removal outcome.
- Document-Use Explanation: NFR-06
  - Shows: The purpose of analysis and information sent to an external provider, where applicable, before upload.
- Authenticator Enrollment Completion and Recovery Codes: REQ-11
  - Shows: Setup-code verification before activation, invalid-code feedback, and issued single-use recovery codes. The existing QR and sign-in frames do not cover the full enrollment sequence.
- Explicit Google Account Linking: REQ-13
  - Shows: Linked sign-in methods, linking action, proof of existing-account access, and outcome feedback.
- Account Deletion: REQ-11, REQ-13
  - Shows: Delete account action, consequences, explicit confirmation, appropriate identity verification, and success / failure states. Successful deletion ends access immediately.

### Document and account lifecycle constraints

- Validate file type/size on the receiving service, not only in the form. PDFs must contain selectable text; OCR is outside MVP.
- Apply explicitly documented background only. Retain the active original until replacement, removal, or account deletion; do not replace previous successful context until replacement analysis succeeds.
- Pending analysis must not restore removed or superseded context. A failed analysis does not erase an otherwise saved name or learning history. Replace / Remove are MVP correction controls; no individual-skills editor or mandatory extraction-review form is included.
- Explicit Google linking requires proof of existing-account access and preserves its profile/progress. Use single-use provider codes and the selected regeneration/disablement policy, subject to AUTH-C1/C2 gates.
- Confirmed identity-verified deletion ends access immediately, without a restoration grace period. Apply security-baseline deadlines; application removal is not proof of immediate deletion from backups/providers.

## Shared Design Coverage

### Missing:

- Desktop Layouts and Accessible Reflow: NFR-02
  - Shows: Desktop/laptop page groups at approximately 1280–1920 px, including usable forms, cards, navigation, menus and resource panels. Browser zoom, keyboard access and sensible overflow remain required. Mobile-specific layouts/navigation are outside MVP scope; existing functioning code may remain.
- Keyboard and Accessible Interaction States: NFR-01
  - Shows: Visible keyboard focus, selection and status labels beyond color, readable validation, accessible code entry, menu / panel closing and focus return, and an accessible way to inspect roadmap relationships and actions. Static images cannot establish these behaviors or WCAG conformance.
- Consistent Request Feedback: NFR-01, NFR-03, NFR-04, NFR-07, NFR-08
  - Shows: Pending, empty, success, failure, timeout, and retry feedback where applicable; recoverable input and previous successful context remain available. Recommendation or analysis failure keeps available core browsing and learning usable.

Engineering requirements such as authorization, storage, backup procedures, performance measurements, and operational logging need separate implementation / verification evidence. They are not treated as missing visual controls here. Selected audience notice, conditional Discovery routing direction, security-action policies and retention deadlines apply. The route map, provider compatibility, technical review, content readiness and test evidence remain release gates. Excluded features such as comparison, bookmarking, an assistant, and data export are not missing MVP screens.


### Quality coverage

| NFR | Interface implications |
| --- | --- |
| NFR-01 Accessibility/usability | Keyboard paths, focus, non-color states, validation, accessible topic/relationship navigation. |
| NFR-02 Compatibility | Usable forms, menus, milestone/topic controls, and panels across agreed devices/browsers; English content. |
| NFR-03 Performance | Prompt pending feedback and honest timeout/retry states. Use warm/cold budgets in verification; do not claim measured performance. |
| NFR-04 Reliability | Accurate saved state on revisit, cross-tab single-topic enforcement, no stale document application. |
| NFR-05 Security | Authenticated entry, account ownership, private uploads, verified linking/protected account actions. |
| NFR-06 Privacy | Document-use disclosure and accurate removal/deletion feedback without unnecessary private-data exposure. |
| NFR-07 Service resilience | Continue core learning during independent recommendation/analysis failures when required core services remain available. |
| NFR-08 Availability/recovery | Understandable outage states and honest restored/saved data presentation. |
| NFR-09 Maintainability | Stable screen/content references and traceable changes; environment setup belongs in engineering guidance. |
| NFR-10 Operational visibility | Distinct operation outcomes and supportable error identifiers without raw credentials, document text, or server traces. |
