# Discovery v3 implementation

2026-11-20. Owner/reviewer: @YakisobaNissin. Implementer: Codex.
Status: source implemented; local registry published; confirmed-skills migration
applied locally with owner authorization on 2026-11-20. Final review and live
browser acceptance remain pending.
Requirements: REQ-04, REQ-05, REQ-11; F-001/F-002 acceptance.

Implement versioned adaptive questions, experience intake, grounded deterministic
results and optional Counselor explanations. Preserve historical sessions.
Affected modules: Discovery, recommendations, their frontend screens and content
publication. Shared contracts: questionnaire, checkpoint and recommendation APIs.
Dependency: concurrent natural-language skills work owns its interpretation,
confirmation, profile components and migration; reuse it without replacing edits.
Checks: focused route/rules/security tests, TypeScript, contract drift and guided
manual acceptance. No full foundation suite or browser matrix.
No commit, push, deployment or hosted activation is part of implementation.

## Owner-requested presentation correction, 2026-11-20

Owner requested cards/progress based on the earlier supplied design. Codex owns
the bounded change; reviewer @YakisobaNissin. Acceptance F-001-AC-06/07: readable
wrapping cards with semantic icons, outlined green selection and stable geometry;
question-based progress advances with navigation and follows the active route.
Affected modules: DiscoveryHeader, wizard presentation and scoped stylesheet.
No API/schema/branching changes. Reuse existing lucide icons and design tokens.
Verify with TypeScript and one short browser pass at desktop/mobile; no broad suite.

## Owner-requested question/explanation correction, 2026-11-20

Codex owns concrete follow-up copy and resume-backed main reasons under REQ-04/05/11,
F-001-AC-05/06 and F-002-AC-01/07/08. Reviewer: @YakisobaNissin. Replace repeated
activity labels with distinct realistic situations while preserving existing option
identities/meanings, routes and saved-version compatibility. Reuse only current
validated saved resume interpretations and exact published skill wording, citing
the original resume fact. Put supported background in the visible main reason and
stop truncating reasons to one sentence. Bump deterministic rule identity so older
results refresh. No new provider calls, schema or API changes. Checks: focused
copy/evidence regressions, TypeScript and scoped lint; no broad suite.

## Completion/navigation correction, 2026-11-20

Owner approved the bounded completion/navigation plan in chat. Implementer: Codex;
reviewer: @YakisobaNissin. Scope: REQ-04/05, F-001-AC-06/07/08. Preserve question
versions and ranking. Save route-defining edits before dependent edits, navigate
using returned next_question_id, and expose See suggestions only for a fully
saved valid route. Keep failed/conflicting input, question-ID cursors and v4 phase
progress; remove shifting legacy totals. Affected files: Discovery editor, wizard,
header, focused frontend regressions and v4 guide/design record. Existing checkpoint
and completion contracts suffice; no SQL/API/auth changes. Checks: targeted editor
regressions, TypeScript, scoped lint and one short authenticated local browser pass.
Hosted activation and Git publication remain separate.
