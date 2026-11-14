# Discovery reliability, comparison insights, and AI Counselor

## Learning progress and authored practice, 2026-11-09

Codex implemented REQ-12 / PM-W08 under Yakisoba Nissin's approved local
plan. Technical reviewer `@YakisobaNissin`. Local signed-in acceptance passed.

The [Counselor](../../backend/app/modules/ai_guidance.py) and Dashboard share
the [Progress module's milestone rule](../../backend/app/modules/progress/service.py).
General questions prioritize an eligible active topic, then the current roadmap.
An explicit roadmap scopes that choice. Next-step replies link to the topic,
branch choice, roadmap, or Careers as applicable. For practice, the Counselor
uses an authored starter only when its topic and roadmap match. Other topics can
offer their curated resources. It can ask one short question when the intended
topic or roadmap is unclear. Groq receives the resolved action and bounded
evidence. The server attaches the destination using Asgard's source list.

Focused Counselor, Progress, and resume checks passed (11 tests). TypeScript,
OpenAPI drift, and generated client synchronization passed. In local Chrome,
a disposable learner asked the live Counselor what to learn next. Its link
matched Dashboard's **Resume learning**. After marking the topic Done, the next
reply in the same chat linked to the next authored topic. The learner was
removed. Branch-choice and practice fallback cases used a stubbed provider.

To repeat, sign in locally at `http://127.0.0.1:5173/dashboard`, select a roadmap,
and mark a topic Learning. Open AI Counselor, ask **What should I learn next?**,
and compare its link with **Resume learning**. Mark the topic Done and ask
again. Expect the next authored step. For practice, open a topic with a matching
authored starter and ask what to practise. Report the roadmap, topic, expected
and actual result, and any safe request ID.

Implementer Codex. Created and updated 2026-11-06. Scope REQ-05, REQ-06,
REQ-12, PM-W04, PM-W06, and PM-W08. Technical reviewer @YakisobaNissin.
Source implemented and enabled on the owner's local stack. Technical review and signed-in acceptance are pending.
[Owner scope](../decisions.md#w08-implementation-scope-2026-11-06)

Discovery keeps the existing API and recommendation lifecycle. The provider receives
compact career summaries and reference excerpts. The pending state and failures use
learner-facing language. Existing saved suggestions, validation, and quotas remain
in the recommendation service. Provider HTTP 400 now has a distinct diagnostic stage.

Compare uses a separate authenticated request after the factual comparison loads.
The counselor keeps recent turns in page memory and can open with a pair, roadmap,
or topic attached. Both operations use the existing Groq transport and validate
source keys. Exa receives public career titles for bounded allowlisted retrieval.
Chat requests use live search when the learner selects public web sources.

The flag ASGARD_AI_GUIDANCE_ENABLED defaults off. Local activation requires review
of ASGARD_EXA_API_KEY, ASGARD_AI_SEARCH_DOMAINS, Groq configuration and data handling,
and the additive quota migration. Compare and Counselor share a limit of eight
provider attempts per minute and thirty per UTC day, within the existing application
cap of 100. Each search, generation and retry reserves an attempt.

- [Guidance API and quota enforcement](../../backend/app/modules/ai_guidance.py)
- [Quota migration](../../supabase/migrations/20261106000200_ai_guidance_budget.sql)
- [Compare and Counselor UI](../../frontend/src/features/ai-guidance.tsx)
- [Groq structured output](https://console.groq.com/docs/structured-outputs)
- [Groq rate limits](https://console.groq.com/docs/rate-limits)
- [Exa Search](https://exa.ai/docs/reference/search)

Testing was deferred by the owner. TypeScript generation from the updated OpenAPI
snapshot succeeded. The snapshot was extended with the new router fragment and
requires full regeneration and drift verification using the pinned backend. No
live provider calls, migration application, builds or browser checks were run.

After review, use a disposable account at http://127.0.0.1:5173. Finish Discovery
and confirm the pending message, saved answers, and recovery after a simulated
failure. At /careers/compare submit a pair and switch it while insight is pending.
Confirm the factual comparison is usable and the previous answer never appears for
the new pair. Open the counselor from Compare, Recommendations and a topic. Ask a
follow-up, verify citations and links, reload, and confirm the chat is empty.
Exercise account isolation, quota exhaustion, provider rejection and deadline
handling before activation. Report the route, expected outcome, and safe request ID.


## Owner-authorized local activation, 2026-11-06

The owner asked to enable the feature for manual testing. A local Supabase dry
run identified only the guidance quota migration. It applied successfully, and
the local backend was recreated with the guidance flag enabled. The frontend
counselor route and backend readiness returned HTTP 200, guidance availability
was true in the running backend, and the unsigned guidance endpoint returned
HTTP 401. Exa credentials and source domains are unset, so the local test uses
Asgard sources. No signed-in generation, live search, or hosted activation was
performed.


## Deeper comparison insight, 2026-11-06

Moved the AI explanation beside Similarities and transferable practice. It uses
both authored career profiles to explain shared tasks, role-specific checks,
handoffs, and a beginner exercise. Groq had returned HTTP 400 for the original
comparison requests despite their estimated size being below the app budget.
The provider schema was simplified while FastAPI retained output length and
source-key validation. A live signed-in Data Engineer / Data Analyst comparison
with a disposable account returned HTTP 200 and Asgard sources. The test account
was deleted. Browser rendering and live web search were not exercised.

## Shared comparison cache, 2026-11-06

Codex implemented the owner-requested Compare reuse for REQ-06 and PM-W06.
Reviewer @YakisobaNissin. Enabled on the local backend. The existing signed-in
comparison insight endpoint now reuses a validated public result for the same
unordered pair, evidence snapshot, prompt, model, and search settings. Concurrent
requests share one generation. The initiating request reserves provider attempts.
The process-local cache holds up to 64 results for one hour without web retrieval,
or five minutes with it. A configured search outage skips caching the fallback.
The cache is cleared on backend restart. Counselor and Discovery do not use it.

Local acceptance passed for concurrent requests from two disposable signed-in
accounts comparing Data Engineer with Data Analyst, plus a reversed-pair repeat.
All three responses matched and the two accounts had one comparison provider
reservation total. Both accounts were deleted. Focused in-container checks passed
for separate cache keys, expiry, search outage bypass, and recovery after a failed
generation. No browser walkthrough or live web search was run. To check the UI,
open http://127.0.0.1:5173/careers/compare, submit the two roles, then reverse them.
The authored comparison should remain available and the AI explanation should
return the same text. Report the pair, expected and actual result, and any safe
request ID.

## Floating counselor panel, 2026-11-07

Codex moved the counselor entry on published Roadmap, completed Compare, and
saved Recommendations screens to a floating button. Scope REQ-12 and PM-W08.
Reviewer @YakisobaNissin. The right-side dialog opens without navigating away
and captures the current topic or comparison context when opened. On narrow
screens the panel fills the available viewport. Closing the dialog clears
the conversation. The existing direct counselor URL remains available.

- [Counselor launcher and panel](../../frontend/src/features/ai-guidance.tsx)
- [Panel layout](../../frontend/src/styles.css)

Frontend type checking and both focused Roadmap tests passed. Two existing
recommendation test assertions still expect the superseded roadmap selection
control and validation error wording. Browser acceptance is pending. Sign in
at http://127.0.0.1:5173/careers, open a roadmap and select a topic. Open the
floating AI Counselor and ask what to try for this topic. Confirm the roadmap URL
stays the same, Escape closes the panel and restores focus to the button, and
reopening shows an empty chat. Repeat at a narrow viewport and confirm that the
question form and close button stay reachable. Report the viewport, route, and
which step differed from the expected behavior.

## Circular launcher and chat layout, 2026-11-07

Codex replaced the text launcher with the standalone Asgard snowflake in a
fixed circular button. Scope REQ-12 and PM-W08. Reviewer @YakisobaNissin.
The launcher renders outside the page layout and retains an accessible name.
The panel uses existing Asgard colors, a separate transcript, suggested
questions that fill the composer, and a bottom composer with a send control.
The selected roadmap, topic, or career pair still supplies chat context.

TypeScript and whitespace checks passed. A disposable signed-in Chrome session
verified the Data Analyst roadmap at 1840 and 390 pixels, including the
launcher position and shape, same-page opening, a suggested question with
roadmap context, Escape and focus return, and a fresh chat on reopen. The
answer was mocked and the account was deleted. No live Groq call was made.
To review locally, open the Data Analyst roadmap from Careers and use the
snowflake in the lower-right corner.

## Dashboard and Settings help, 2026-11-07

Codex added the floating counselor launcher to Dashboard and Settings, including
the Account and security tab. Scope REQ-12 and PM-W08. Reviewer @YakisobaNissin.
Each page suggests relevant questions and supplies its page name with the
question. The backend provides short Asgard references for resume review, saved
skills, and Dashboard progress. The fixed dialog remains outside page layout
and no longer adjusts the page scrollbar when opened. The existing counselor API
and data model are reused.

TypeScript and whitespace checks passed. Signed-in Chrome verification with a
disposable account confirmed one launcher on each page, page-specific prompts,
and identical main-content geometry before and after opening. One live Settings
question returned HTTP 200 with an Asgard source and explained the skill review
and experience-level step. The account was deleted. To try it, open
http://127.0.0.1:5173/dashboard or http://127.0.0.1:5173/settings/profile,
click the snowflake, and send one of the suggested questions.
