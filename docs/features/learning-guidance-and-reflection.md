# Personal learning guidance and reflection

Implementer Codex. Created and updated 2026-11-05. PM-W07, FUT-03 and FUT-06. Status is active locally after owner approval in chat. Technical reviewer is @YakisobaNissin. [Roadmap scope](../post-mvp-roadmap.md#pm-w07-personal-learning-guidance-and-reflection)

## Owner-directed presentation rework, 2026-11-05

The owner identified clutter in the W07 Roadmap presentation and directed that
the added practice and reflection surfaces be removed from both Roadmap and
Dashboard for now, restoring the simpler authored-roadmap experience. Preserve
the W07 migration, API and learner data dormant for a later redesign.

Codex implemented the presentation cleanup on 2026-11-06 in
[Roadmap](../../frontend/src/features/roadmaps/page.tsx) and
[Dashboard](../../frontend/src/screens/DashboardScreen.tsx). Dashboard uses
existing progress data for learning links. The implementation and verification
below record the original W07 delivery. Manual acceptance for this cleanup is
pending. In the [local app](http://127.0.0.1:5173), open the current Roadmap,
confirm the guidance and comparison panels are gone, mark a topic Learning, and
check that Dashboard's **Resume learning** opens that topic. Open saved career
suggestions and expand **Evidence used** on a result with supporting evidence.

## Implementation

The roadmap and dashboard show the next authored topic or applicable tool-path choice. Dashboard prioritizes an active Learning topic. Suggested practice uses applicable topic links for skills explicitly rated no experience. Learners can also save other applicable topics. Saved practice follows authored order and remains available for removal after branch changes or retirement. Each milestone supports one optional private reflection with two prompts. Completion adds an inline reminder, and reversing progress preserves the reflection.

The [Progress guidance API](../../backend/app/modules/progress/guidance.py) owns the new account-scoped endpoints and uses one revision per account and roadmap for practice and reflection writes. The [additive migration](../../supabase/migrations/20261105000300_learning_guidance.sql) uses composite catalog references, forced owner RLS, and account deletion cascades. Guidance writes are separate from focus, progress, skill ratings, and recommendation context. The roadmap and dashboard share the [guidance UI](../../frontend/src/features/roadmaps/learning-guidance.tsx).

## Verification and local handoff

A rollback-only PostgreSQL probe ran the migration with synthetic accounts. The restricted application role could create its own records, stale version writes affected no rows, and another account could neither read nor mutate the records. Deleting the fixture account cascaded to all three new tables. The transaction rolled back.

Scoped Ruff and ESLint, TypeScript, OpenAPI drift, and the regenerated TypeScript contract comparison passed.

On 2026-11-05 the owner explicitly approved the concrete migration in chat. The Supabase dry run listed only W07, the migration applied locally, and a second dry run confirmed the database was current. A disposable signed-in learner passed the API journey for focus, resume, practice save and removal, reflection save, edit and deletion, and progress reversal with records preserved. The fixture account was removed. The 12 published local roadmaps contain no branch groups, so branch switching needs an isolated branched fixture. Browser rendering, milestone-completion prompting, and retired-topic presentation remain unverified.

For guided browser verification, sign in at [the local app](http://127.0.0.1:5173) and use a published roadmap for the first three steps. Use an isolated branched roadmap fixture for the fourth.

1. Set the roadmap as current and mark an eligible topic Learning. Open Dashboard and use **Resume learning**. Expect it to open the same topic.
2. Record no experience for a linked skill in Profile. On the roadmap, expect a practice suggestion when an applicable unfinished topic has a matching link. Save it and another topic manually, then confirm both appear in authored order on Dashboard.
3. Open a milestone reflection before completion, save it, and edit it after refresh. Complete an applicable milestone with no reflection and check that the optional prompt appears. Reverse a completion and confirm the saved reflection stays available. Delete the reflection when finished.
4. Resolve the current Learning topic before switching branches. Confirm the old branch's saved practice appears under **Unavailable** with a remove action. With a retired-topic content fixture, expect the same behavior with the retirement reason. Confirm existing progress, skill ratings, and recommendation history remain intact.

Report a failure with the roadmap, action, expected and actual result, and request ID if shown. Model evaluation and the staged ESCO recommendation release belong to their separate work.
