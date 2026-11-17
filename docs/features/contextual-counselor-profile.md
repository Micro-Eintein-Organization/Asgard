> Implementation record. Dated sections preserve their original evidence and limitations. For current behavior and activation status, use the [documentation baseline](../README.md) and linked owning specifications. Earlier plans do not override later recorded decisions.

# Profile identity and contextual counselor

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
