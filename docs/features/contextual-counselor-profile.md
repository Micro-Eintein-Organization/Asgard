> Implementation record. Dated sections preserve their original evidence and limitations. For current behavior and activation status, use the [documentation baseline](../README.md) and linked owning specifications. Earlier plans do not override later recorded decisions.

# Profile identity and contextual counselor

Hosted rollout and unresolved integration work:
[combined Discovery and counselor checklist](../deployment-discovery-and-counselor.md).

## Composer refinement, 2026-11-16

Later owner screenshot feedback supersedes the context-switch presentation below:
page context is now included automatically in existing scoped request fields.
The visible Using/page-context switch and per-answer context labels are removed.
No extra context fields or provider permissions were added. The provider
disclosure and separate opt-in for web sources remain. The composer uses a dark
neutral focus border, replacing its green textarea outline, and a centered 44 px
circular send button. Implementer Codex; reviewer @YakisobaNissin pending.
See [verification and manual review](ui-refinement-and-motion.md).

Implementer Codex. Created/updated 2026-11-16. Owner/reviewer @YakisobaNissin.
Owner approved the expanded chat plan, general knowledge and session continuity.
Requirements REQ-12, FUT-10, QA-09. Status implemented locally; human visual,
hosted security and live answer-quality acceptance pending.

Header identity reuses the Settings profile query. Confirmed saves update its
name/photo version. Avatar uses private authenticated blob queries shared with
Settings, with initials/icon fallback; object URLs are released. Dashboard and
counselor welcome use a saved first name without sending it just for a greeting.

The authenticated shell owns one counselor launcher. Dialogue messages remain in
memory across route changes and closing/reopening; logout/account changes unmount
the session. New conversation clears it. Context opt-out removes page identifiers.
Requests carry bounded page paths plus existing career/roadmap/topic identifiers;
backend reads remain account scoped. Explicit catalog titles/aliases (including
SWE) override page learning context. Comparison intent excludes unrelated active
learning sources. Short follow-ups can resolve career names from the last user
turn. General knowledge is separate from cited evidence; prompts preserve no
account writes. Settings skill questions load up to 12 saved skill labels.

User bubbles use body text rather than headings. Answers render safe paragraphs
and simple lists; pending questions appear immediately. API adds optional
page_context/general_knowledge, with generated OpenAPI/TypeScript synchronized.
Source modules: app/shell, features/ai-guidance, features/profile/identity and
profile-photo, DashboardScreen; backend modules/ai_guidance.

Verification: eight counselor regression tests passed, including the exact Cloud
Engineer/SWE question overriding an unrelated active roadmap. API synchronization,
TypeScript, production build and backend F/I lint passed on the preceding source;
final frontend checks recorded in handoff. UI lint retains fast-refresh advisories.
Initial Dashboard test needed its new profile query mocked, not a production auth
change. No authenticated browser/hosted/model answer acceptance was performed.

Manual review: save a new name/photo in Settings, verify header and Dashboard,
replace/remove/refresh, sign out and switch accounts. Open the counselor on Compare
Careers before comparison data loads, ask the reported question with web off/on,
then navigate to a roadmap and ask a follow-up. Close/reopen; confirm chat persists.
Use New conversation and verify it clears. Check failed sends and photo loading.
At 360/390 px and desktop, review keyboard focus, long text/lists, composer and
source links. Review real model answers for relevance and unsupported claims.

## Completed page wiring, 2026-11-16

The per-account shell provider receives live, route-scoped registrations from
Roadmap, Compare Careers, catalog, Settings, Dashboard and the Discovery editor.
Labels use authored roadmap/topic/career names, selected category and Discovery
question wording. The current displayed recommendation run is identified explicitly;
server selection rejects outdated/unavailable run context. Discovery question IDs
are bounded authored identifiers (not UUIDs), checked against the published
questionnaire before context is supplied. Category IDs are resolved server-side.
Filter text is bounded and treated as UI data, not instructions. Page context is
serialized to JSON before provider payload assembly. Context opt-out omits these
page identifiers. The counselor remains read-only.

Welcome now uses the saved first name. Panel drafts, web preference and context
opt-out survive closing/reopening along with messages. Account switches reset
provider/dialog state and abort pending HTTP reads. Session-local request state
prevents duplicate sends after reopening. Each answer keeps its send-time context;
source navigation does not relabel history. Standalone counselor entry points to
the same shell conversation. Older-message reading suppresses automatic scroll.
The mobile panel uses dynamic viewport sizing and a single transcript scroll area.

Final checks: nine focused backend counselor cases passed; backend F/I lint passed.
Final TypeScript/production build/API synchronization passed, and 11 focused
frontend Dashboard/catalog/recommendation cases passed. No full/offline performance suite added. Existing account-isolation
and session regression tests were retained. UI lint reports fast-refresh warnings,
no errors in the checked implementation files. Live browser/model review remains
pending and is not replaced by these checks.

## Hosted rollout

Review/commit the full change together, including generated OpenAPI/TypeScript.
Deploy backend first, then frontend Production. Existing environment keys suffice;
no migration or additional provider service is needed. Keep the previous deployment
for rollback. The host must use the same reviewed commit on Render and Vercel.
Run the manual steps above at https://asgard-navy.vercel.app, including two accounts,
web failure and the exact reported comparison. Report request IDs and behavior,
not secrets. Manual visual/keyboard/real-answer acceptance is pending; no claim of
hallucination-free output or completed release acceptance is made.

## Counselor readability and source disclosure, 2026-11-17

Implementer: Codex. Created: 2026-11-17. Last updated: 2026-11-17.
Status: implemented; human visual review pending. Reviewer: @YakisobaNissin.
Owner requested this bounded UI follow-up in chat during the approved footer task.
Requirements REQ-12, QA-09; task-local COUN-UI-01 readability and COUN-UI-02 sources.
Scope: existing ai-guidance component, its tests and shared stylesheet. No backend,
context collection, model, dependencies, API or privacy-contract changes.

Conversation uses the existing secondary surface, foreground text, white answer
surfaces and dark question bubbles. Counselor answer sources are inside a native
Sources details/summary disclosure, collapsed initially and keyboard operable.
Existing Asgard/web grouping and link destinations remain; web-unavailable warnings
stay visible outside the disclosure. Comparison sources retain their presentation.

Manual review pending: at http://127.0.0.1:5173/dashboard, sign in and open AI
Counselor. Send a question returning sources; expect readable separated messages,
Sources initially collapsed, and working links after expanding by click or Enter.
Verify narrow width, 200% zoom, Tab focus, scrolling and composer availability.
Report route, viewport and observed/expected behavior to @YakisobaNissin.

Verification, 2026-11-17: two focused Counselor tests passed, including collapsed
source visibility and expansion; frontend TypeScript passed. Scoped ESLint has
zero errors but fails its zero-warning gate on the pre-existing mixed hook/component
export (useComparisonInsight, react-refresh/only-export-components). That export
is unchanged; no unrelated module split was introduced for this UI task.
The first disclosure assertion was corrected for the DOM harness: collapsed native
details retain descendants in the DOM but hide them visually. No application
workaround was needed. Browser preview timed out; real visual/keyboard checks
remain pending. Full backend suites and container rebuilds were not run because
backend behavior is unchanged and the owner requested limited UI verification.
## Selection-aware context, 2026-11-20

Implementer: Codex. Created/last updated: 2026-11-20. Acceptance: REQ-12,
COUN-01–03. Reviewer: @YakisobaNissin; concrete SQL/API approval recorded in the
[review package](../plans/context-aware-counselor-and-skills.md). Implementation
added; human code review, browser and real model acceptance pending.

Roadmaps register milestone/topic selection. The backend resolves authored details
and actual topic/milestone progress. Comparison answers return a cached reference;
the counselor reuses it only for the same pair and current public evidence key,
otherwise reports expiry. Skill matches register basis, expanded career and focused
skill; backend reads actual account evidence, bounds detail and distinguishes sources.
Saved skills can support relevant questions beyond Settings. Existing conversation,
web opt-in and source disclosure remain; private matching data never enters the
public comparison cache or public web query. Explicit different careers clear
unrelated selected evidence before the model call.

Sources: backend `modules/ai_guidance.py`; frontend `features/counselor-context`,
`features/ai-guidance`, Roadmaps, Compare Careers and skill-matching page.
Existing counselor regressions passed (nine cases); F/I lint passed.
The added selected-topic/status/milestone case also passed. Final focused counselor
and NLP checks passed (20 cases). TypeScript and generated API synchronization
passed; source/browser acceptance is still distinct from these automated checks.
For manual
acceptance use `http://127.0.0.1:5173`: select a roadmap topic and ask about this
topic/milestone; switch comparison pairs and ask about the displayed explanation;
expand careers in both skill-match tabs and ask about a selected skill. Confirm
answers use the selection, source distinctions and actual status. Check navigation
during an answer and account switching. Report route/request ID and expected/actual
behavior without private content. Browser/model checks remain pending.
