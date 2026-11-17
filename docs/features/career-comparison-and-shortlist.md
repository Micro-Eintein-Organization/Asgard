> Implementation record. Dated sections preserve their original evidence and limitations. For current behavior and activation status, use the [documentation baseline](../README.md) and linked owning specifications. Earlier plans do not override later recorded decisions.

# Career exploration and saved comparison

## Aligned work comparison rows, 2026-11-08

Codex implemented the owner-requested formatting correction for CEJ-04,
REQ-06 and PM-W06. The [comparison explanation](../../frontend/src/features/ai-guidance.tsx)
now groups each work example with both career descriptions in a single row.
Work and shared skills use the same grid. The two descriptions stack within
each row at narrow widths. The summary and optional connection explanation sit
in the Work comparison card. Review owner: @YakisobaNissin.

TypeScript and a signed-in Chrome check passed. The Chrome check used a mocked
explanation with unequal description lengths and confirmed aligned rows at
1440 px, stacked descriptions at 390 px, and a visible connection explanation.

To verify, open `http://127.0.0.1:5173/careers/compare` and compare Data Analyst
with Data Scientist. With the comparison explanation available, check that each
work label aligns with both descriptions. Narrow the window and confirm the
descriptions stack under their own label.

## Catalog controls and comparison sources, 2026-11-06

Codex moved Compare careers beside the catalog results heading, removed the
Saved careers filter and ESCO catalog link, and added a collapsed data-source
list to the comparison page. Saved career records and the ESCO catalog remain
available through their existing routes. The stale-suggestions reminder uses the
shared alert, including when an earlier successful run is displayed. Tests and
browser verification were not run at the owner's request. To review manually,
open Careers, check Compare careers beside Suggested careers, and open the
comparison page's Data sources disclosure.

The owner also removed the catalog's Return to dashboard button, saved-context
sentence, matching-roles count, suggestion-details link and category-sidebar
Discovery note.

Implementer: Codex. Created: 2026-11-05. Last updated: 2026-11-05.
Status: implemented and activated for local testing after concrete owner approval; focused checks and the short browser journey passed. Technical reviewer: @YakisobaNissin. Independent code review pending.
Requirements: CEJ-01–06 in the [owning specification](../specs/career-exploration-comparison.md), extending PM-F06 / W06 and existing PM-I1 experience behavior. Owner authorized the bounded implementation plan in the recorded task; no independent approval is inferred.

## Collapsible roadmap introduction, 2026-11-06

Codex placed the full career introduction and starter activities inside a
collapsed **Read about this career** disclosure on [Roadmap](../../frontend/src/features/roadmaps/page.tsx).
Manual verification is pending. Open a career roadmap in the
[local app](http://127.0.0.1:5173) and expand and collapse the introduction.
Milestones should stay visible in both states.

## Catalog comparison entry and shared practice, 2026-11-05

Codex implemented the owner-approved catalog-only comparison flow for technical review by @YakisobaNissin. The catalog heading provides the entry. The comparison page owns the two draft selections and uses `left` and `right` for submitted results. The former global tray and per-card controls were removed.

The [curated mapping](../../frontend/src/features/careers/shared-practice-data.json) connects nine shared practices across twelve careers. Each example is keyed to a career, competency and topic. The comparison displays a connection when both topic links resolve in the existing API response. Reported levels retain their existing skill identity.

TypeScript, scoped lint and the mapping integrity check passed. A disposable browser walkthrough confirmed the single catalog entry, refresh and back navigation, draft selections, both records-practice topic links, and the unmapped-pair message. The selectors stacked at 390 px with no horizontal overflow. The local preservation check confirmed unchanged focus, branches and completion, then removed the disposable account.

To verify locally, open `http://127.0.0.1:5173/careers`, select Compare careers, and compare Data Analyst with Cybersecurity Analyst. Follow both links under Narrow records to answer a question. Replace Cybersecurity Analyst with Hardware Engineer and submit to see the unmapped-pair message.

## Beginner exploration, 2026-11-05

Owner: Codex. Technical reviewer: @YakisobaNissin. Status: implemented for local testing; independent content and code review pending. Acceptance: all 12 current careers show understandable work, distinct outputs and an activity; all 120 reports retain identity and have task-based explanations. See the [approved scope and checks](../plans/beginner-career-exploration.md).

[Versioned explanations](../../backend/app/content/career-exploration/v1/profiles.json) pair existing roadmap practice and curriculum with the existing occupational review scope and traceable source hashes. Authored examples are local exploration aids; they do not claim occupational equivalence, independent approval, assessed ability or job readiness. Existing source records are unchanged. The API adds optional typed exploration and skill explanation fields; [the loader](../../backend/app/modules/careers/exploration.py) falls back to existing curriculum when the package cannot be used. No migration or provider change.

Catalog and suggestion cards lead with activities. The career and comparison screens show work, outputs, checks, learning groups and a beginner activity. Experience reporting remains optional, grouped and attached to existing UUIDs. Existing saved recommendation reasons and evidence remain unchanged. Notes, report erasure and learning-state mutations keep their existing operations.

Verification: TypeScript, OpenAPI/TypeScript drift, scoped lint and one [content-integrity check](../../backend/tests/test_learner_exploration.py). The check caught and corrected the existing Frontend canonical slug difference before release. A disposable browser walkthrough saved a Data Analyst report, compared data work with Frontend interface work, saved a private note, refreshed it and opened Business questions and measures. The final question copy was simplified afterward; existing save behavior did not change. Learning focus, branches and completion were preserved and the disposable account removed. No broad regression or live AI calls. Functional walkthrough is agent evidence; independent beginner comprehension remains unverified.

Manual check: visit `http://127.0.0.1:5173/careers`; compare Frontend Developer with Data Analyst. Explain how a responsive interface differs from a report that answers a business question. Choose an activity you could try, then open it without setting a learning focus. Report any unfamiliar term or unclear activity instruction.

## Scope, dependencies and implementation

Codex owns the learner-flow, career comparison and private shortlist modules. Shared changes are additive API registration, generated contracts and typed career context on skill reads. Existing authentication, skill mutation/erasure, reference publication and learning updates are reused without replacing their operations. The existing branch and unrelated edits are preserved.

- [Career comparison service](../../backend/app/modules/careers/comparison.py): session-checked shortlist reads, versioned save/remove, owner advisory locking, consistent pair reads, account/catalog/reference versions.
- [Migration proposal](../plans/career-shortlist-proposed.sql): two private owner-RLS tables, title snapshots for unavailable entries, note length constraint, no learning/recommendation writes. It was promoted unchanged to [the versioned migration](../../supabase/migrations/20261105000100_career_shortlist.sql) after concrete owner review.
- [Competencies service](../../backend/app/modules/competencies/service.py) and schemas: typed career context from explicit canonical links; all existing UUIDs and saved levels retained.
- [Career UI](../../frontend/src/features/careers/): account-reset comparison scope, two-slot tray, URL-backed paired sections, private note editing and secondary full source browser. No new visual system.
- Existing [experience dialog](../../frontend/src/features/competencies/comparison.tsx) now offers inline versioned add/edit/remove and descriptive labels. Profile groups saved reports by career and filters additions by learning path. Existing suggestion cards offer direct exploration/comparison, preserving saved typed evidence disclosures.
- Catalog adds comparison controls and a Saved careers filter, including removal of unavailable alternatives. Topic navigation is read-only and keeps focus selection separate.

## Verification, 2026-11-05

Passed: TypeScript; OpenAPI/TypeScript generation and drift; scoped frontend ESLint and backend Ruff; one focused real-role PostgreSQL acceptance test covering save, cross-transaction refresh, note update, removal, persistent version, another account's empty read/removal denial and stale-write rejection. The disposable `shortlist_check_20261105` database has only synthetic users/catalog and the proposed migration; normal account data was not modified. Test: [test_career_shortlist.py](../../backend/tests/test_career_shortlist.py).

The first contract-drift command hit the existing Windows temporary-path CLI issue; retry with workspace TEMP/TMP passed. Frontend lint initially caught mixed component/hook exports; splitting the hooks/context resolved it. These were verification/source issues, not runtime authorization failures.

Reused: [prior local evidence activation and skill-erasure acceptance](career-evidence-recommendations.md#normal-activation-completed-2026-11-05). No claim that it verifies new shortlist UI. Broad regression, extensive browser automation, live AI and model quality were not run, as requested.

## Guided acceptance (completed on a disposable account)

Local URL: `http://127.0.0.1:5173/careers`.

1. Explore any career. Open Review your experience, save a relevant report, and confirm descriptive feedback. Unknown, zero and absent reports remain distinct; Profile shows the learning-path grouping.
2. Return to careers, choose Compare on two cards (a third is disabled), then Compare careers. Compare work, reported experience and curriculum in matched sections. Remove a tray item to replace it.
3. Save an alternative with an optional note. Refresh the comparison URL: the pair and saved note return. Check Saved careers in the catalog. Remove the saved career: note disappears, pair remains.
4. Open a linked topic and confirm focus, branch selections and completion were not changed. Review source details separately. Recheck suggestion cards' Explore career and Compare actions without generating a live request.
5. With keyboard only, check dialog focus return and comparison removal; inspect desktop and narrow reflow. Report URL, action, expected/actual result and sanitized error if anything fails.

## Pending and limitations

The owner explicitly answered **Approve local shortlist activation** for the concrete bundle on 2026-11-05. Its exact one-migration SQL was applied locally; original private-table digests, all 120 skill identities and the twelve-career reference activation were preserved. The bundle retains SQL/hash, before/after evidence and recovery guidance. No existing evidence release is republished. Notes are private decision aids excluded from AI. Independent content review, source reuse gaps, live-model compatibility/quality and hosted acceptance remain unresolved under their existing owners; content-review assignment remains unassigned.

## Normal activation and learner journey, 2026-11-05

Owner approval: explicit “Approve local shortlist activation” reply to the one-migration concrete review. Local `asgard-foundation` only. The versioned SQL matches reviewed SHA-256 `f741b271e0ff84de61ec1ab4a3170158579fb6d9ee1a749430fa5ee40a2e2e8e`. No evidence release was republished. Runtime write policy remains owner-scoped.

Completed browser checks: recorded career-specific experience inline; compared Cybersecurity Analyst with Data Analyst; observed a disabled third selection, reported experience on one side and neutral missing experience on the other; saved a private note; refreshed the URL and saw both the pair and note restored; removed the alternative/note while retaining the pair; opened a linked topic; saw canonical career grouping/descriptive rating in Profile and an empty saved-careers filter after removal. Desktop paired sections were visually inspected. Existing design components and tokens remain in use. No live suggestion generation was requested.

The in-app browser stalled on the original native removal confirmation. It was replaced by in-page Confirm removal / Keep saved career controls; the resumed removal check passed. One exact-text Profile selector did not match a label containing nested rating text; accessibility output verified the grouped report. Final script authentication expired during the interrupted browser session; renewing the synthetic session resolved the 401 before checking preservation. These are recorded separately from application failures.

Focused final preservation verifies unchanged current roadmap, no branch choices or topic progress created by browsing, frontend/backend readiness, removal of the synthetic account and original-account digests. Disposable fixtures remain isolated from real account content. Broader keyboard/reflow/network matrices, broad regression, independent code/content review, live model evaluation and hosted acceptance remain pending or deferred as recorded above. No commits or deployment were made.

## Comparison presentation, 2026-11-07

Codex grouped the generated summary and curated practice under Shared skills and
work. Scope REQ-06 and PM-W06. Reviewer @YakisobaNissin. The page leads with the
side-by-side work and a short summary. The full comparison, its sources, and
paired practice examples are available through separate disclosures. Loading and
retry copy refers to the comparison summary. Generation and stored data are
unchanged.

Frontend type checking and whitespace checks passed. Signed-in Chrome verified
the layout and disclosures for Cybersecurity Analyst and Data Analyst at desktop
and narrow widths using a mocked summary. The first attempt used an invalid
career ID and returned 404. The corrected pair passed and both disposable
accounts were removed. No live provider call was made. To review, open
http://127.0.0.1:5173/careers/compare and select both roles. Confirm the summary is
visible and the details, sources and practice expand independently.

## Full shared-work card and consolidated sources, 2026-11-07

Codex updated REQ-06 and PM-W06 for review by @YakisobaNissin. The full shared-work
explanation is visible in one card, with practice examples still expandable.
The per-career learning cards no longer repeat the sources disclosure. The
bottom Sources and limitations disclosure combines career limitations, links
to both career reference pages, citations for the explanation, and catalog
attribution. The comparison API and generation behavior are unchanged.

TypeScript, whitespace, and signed-in Chrome checks passed. A mocked response
verified both paragraphs were visible in the card, both career links and the
citation appeared in the bottom disclosure, and the card fit at 390 pixels.
The disposable account was removed. To try it, open
http://127.0.0.1:5173/careers/compare and compare Data Engineer and Data Analyst.
Read the card, then expand Sources and limitations at the bottom.

## Matched work and shared skill cards, 2026-11-07

Codex implemented the owner-requested redesign for CEJ-04, REQ-06, and PM-W06.
Reviewer @YakisobaNissin. The comparison explanation now has paired work cards,
a separate Shared skills card, and a short handoff when supported. Each matched
row requires a source for each career and is returned by career ID so reversing
the selection preserves the right descriptions. The existing comparison request
and process cache serve both sections. Authored work and mapped practice remain
available if generation fails. Sources are consolidated at the bottom.

OpenAPI and the TypeScript client were regenerated. OpenAPI drift, client drift,
TypeScript, whitespace, and focused citation validation passed. A signed-in
Chrome run with a disposable account generated three matched work rows and
four shared skill rows for Data Analyst and Data Engineer, confirmed reversed
ordering reused the same answer, and verified reflow at 390 pixels. The account
was deleted. Scoped Ruff reported existing line-length violations in the
guidance module. No separate live test of a sparse pair was run.

To try it, open http://127.0.0.1:5173/careers/compare and compare Data Analyst
with Data Engineer. Confirm the work cards use the same labels and the Shared
skills card explains the two uses separately. Swap the roles and check that
each description stays with its career. Report the pair, the expected and
actual display, and the safe request ID if shown.
