# Context-aware counselor and natural-language skills: technical review

Created/updated: 2026-11-20. Task owner/implementer: Codex.
Product selections and bounded implementation plan approved by the owner in chat.
Required technical reviewer: @YakisobaNissin, per [CODEOWNERS](../../.github/CODEOWNERS).
Status: concrete SQL/API proposal approved by @YakisobaNissin in chat on 2026-11-20
with “oim yakisobanissin i approve”. Source implemented with focused checks.
Local migration application separately authorized and installed schema verified
on 2026-11-20; see the competency feature guide. Hosted migration application,
provider evaluation and deployment remain separate.

Requirements: REQ-12, REQ-11, PM-W03, SKILL-EVIDENCE-03;
task acceptance COUN-01, COUN-02, COUN-03, RES-01, SKILL-01, SKILL-02.
Architecture: [approved boundaries](../architecture.md).
Owning skill specification: [competency comparison](../specs/competency-comparison.md).

## Concrete database proposal

Review the [proposed SQL](context-aware-counselor-and-skills-proposed.sql).
The approved executable copy is now `supabase/migrations/20261120000100_confirmed_skill_evidence.sql`.
The proposal remains as the dated review artifact; the versioned migration is schema authority.

- Add `user_competencies.evidence_confirmed`, non-null false by default. Do not
  backfill existing unknown/zero records as confirmed. Existing manual mutations
  preserve confirmation; deleting the skill deletes its confirmation.
- Add `skill_interpretation` to the existing analysis-attempt operation constraint.
  Include it in the shared counselor/comparison per-account quota query: eight
  reservations/minute, thirty/day, using the existing global daily allowance.
- Add `confirm_reported_skills(session_id, assurance, expected_version, selections)`.
  Selections contain 1–30 unique published competency IDs and optional nullable
  levels. Missing level preserves a saved rating; explicit null clears it. No
  original description or model output is persisted.
- The function delegates each save to the existing protected mutation, retaining
  session validation, account-before-competency lock order, recommendation payload
  erasure and context revision changes. One transaction makes the batch atomic;
  version advances once per selected skill, and the response returns the final
  version. Do not assume it advances only once per HTTP request.
- Retain existing RLS and revoked direct write grants. No privileged browser or
  runtime credentials, new tables, extension, provider or dependencies.

## Additive API proposal

All paths are relative to `/api/v1`; existing authentication/errors apply.
These are proposed wire additions, not a replacement for generated OpenAPI.

| Operation | Proposed contract |
| --- | --- |
| POST `/me/competencies/interpret` | Body `{text: string}` (1–2,000 characters). Returns `{items: SkillSuggestion[]}` (at most 30). No profile writes. |
| POST `/me/competencies/confirm` | Body `{expected_version: integer, items: [{competency_id: UUID, level?: integer or null}]}` (1–30 unique items). Returns existing `CompetencyState` with added confirmation fields. All-or-nothing transaction. |
| Existing competency responses | Add `evidence_confirmed: boolean = false` to `UserCompetency`, `ComparisonItem` and `UserReportSignal`. Keep reported levels and legacy status meaning intact; confirmation contributes to `evidence_found`/`evidence_count`. |
| Existing comparison insight response | Add nullable `context_id: UUID`. Allocate it server-side for a cached completed public comparison, with the existing cache TTL and eviction. |
| Existing counselor request | Add nullable `milestone_id: UUID`; add optional `PageContext.skill_matching_basis: benchmark or learning_path`, `competency_id: UUID`, `comparison_context_id: UUID`. Use existing career IDs for the focused career or ordered comparison pair. |

`SkillSuggestion` contains `competency_id`, server-authored `label`, `quote`
(exact submitted-text substring), `method` (`exact` or `interpreted`) and
`applications`: career ID/title, basis and authored topic links (roadmap/topic
ID/title). Return only published relationships; deduplicate by competency ID.
Do not merge technology references with narrower curriculum task identities.

Preview reuses the bounded supported-equivalence matcher, generalized behind a
module interface so competencies do not depend on document persistence. Validate
IDs and exact source quotes; exclude negated, hypothetical, desired or uncertain
claims. Use existing structured-output provider, timeout/batching limits and
budget reservations for every attempt. No transaction spans provider calls.
When provider support fails, return clearly identified exact-only suggestions
with an additive `interpretation_available: false` response field. Exact matching
must apply the same negation/aspiration exclusions. Never silently label a
substring match as semantic interpretation. No automatic POST retry from the UI.

Confirm validates the current catalog again; preview is not authorization. Return
409 on stale profile versions without retry or partial writes; 422 for duplicate,
invalid or unavailable IDs. Session failures use existing 401/403 handling.
Apply static routes before any dynamic route that could shadow them.

## Context assembly and UI

- Roadmap registration sends the selected topic's milestone; otherwise the most
  recently expanded milestone still open, otherwise a valid milestone hash.
  Topic selection wins. Resolve relationships and actual progress server-side;
  never substitute a different active topic for a selected topic explanation.
- Compare Careers registers the displayed result reference and submitted pair,
  never unsent dropdown drafts. Resolve reference only for the same ordered pair
  and current public content/prompt cache key. Expired/missing references add an
  explicit unavailable-result fact and use curated data without regenerating.
- Skill matches registers active basis, last opened career still expanded and
  last focused skill belonging to it. With no focused career provide a bounded
  current overview rather than arbitrarily selecting a career. Obtain counts and
  source distinctions from the owning service, not client-submitted evidence.
- Relevant saved skill/document context is account scoped on every screen. Use
  bounded structured extracts, excluding identity/contact details and private
  notes. Preserve explicit question precedence, current selection over history,
  send-time context, account-switch cancellation and existing web-search privacy.
- Profile Add skills defaults to description entry, preview, selection and Save
  selected skills; manual catalog entry stays available. Existing levels are
  shown and omitted from the save payload unless edited. Add clear confirmation
  evidence labels, source phrases and career/topic links. Guard unsaved input.
- Reuse the current resume analysis/interpretation orchestration and cached
  interpretation state. Show both bases and source passages in Profile results,
  plus supported career/topic destinations. Preserve exact evidence on failure;
  no provider calls on GET, inferred proficiency or learning-state mutations.
- Use [existing design tokens and controls](../design.md). No new assets or
  redesign. antislop active: during (session override).

## Implementation order and required verification

After the designated reviewer approves this concrete proposal: promote the SQL
to a new versioned migration; implement protected saves and evidence reads;
implement preview and counselor context assembly; generate OpenAPI/TypeScript;
wire Profile, resume presentation and screen context; update owning documents
and existing counselor, competency and PDF implementation guides in the same change.
Do not change branch or publish: current branch is `codex/cabusao-ui-integration`.

Focused tests must cover batch rollback on a later invalid item, stale/replayed
versions, missing vs null level, unchanged positive/unknown/zero reports,
confirmation without proficiency, removal/recreation, published-only validation,
anonymous and cross-account access, actual restricted-role grants and session
denial, and recommendation erasure through the existing protected routine.
Provider tests cover exact/equivalent phrases, duplicates, negation/aspiration,
invalid IDs/quotes, task overreach, timeout/budget failure and exact-only fallback.
Counselor tests cover selected topic/milestone, unrelated active learning,
comparison reuse/expiry/changed pair, both skill bases and in-flight navigation.
Run focused UI tests, TypeScript, scoped lint, migration checks and generated
contract drift checks. Use synthetic examples for live model quality review.

Manual acceptance: on `http://127.0.0.1:5173`, select a roadmap topic and ask about
this milestone/topic; open Compare Careers and ask about its displayed result;
expand a career in each skill-match tab and ask which evidence is present; enter
a skill description in Settings > Profile, preview, confirm without a rating,
reload and check both matching views. Verify manual fallback, keyboard operation,
account switching and resume replacement/removal. Report route, request ID and
expected/actual behavior without private resume text.

Checks performed at proposal preparation: source and permission inspection,
local Markdown link checks and whitespace checks only. SQL execution, migration
acceptance, application tests, browser acceptance and live model review remain
not run. No runtime behavior has changed. Hosted application/deployment and Git
operations need their separately recorded authorization.
