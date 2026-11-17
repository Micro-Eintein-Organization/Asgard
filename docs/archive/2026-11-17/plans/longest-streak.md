> Historical record archived 2026-11-17. Dated scope and test evidence are retained; use the [current documentation](../../../README.md). This record does not grant new activation, implementation, or publication authority.

# Longest learning streak

Created/updated: 2026-11-16. Implementation owner: Codex.
Required technical reviewer: @YakisobaNissin (CODEOWNERS).
Status: bounded plan and contract addition approved in chat on 2026-11-16 by
the owner identifying themselves as @YakisobaNissin; end-to-end implementation
authorized. Human review of implementation results remains pending.

## Behaviour and contract

Extend REQ-10 activity summaries with the longest consecutive run of recorded
qualifying local dates across the account's available history. Reuse the same
account-scoped distinct completion dates as the existing current streak. Multiple
completions on one date count once. No records means zero. Gaps break runs.
Undoing Done recalculates from remaining records, so a historical longest streak
may decrease. Preserve recorded dates after timezone changes and the existing
current-streak grace through today. Viewing another calendar month changes only
the displayed days; current/longest counters remain account-wide summaries.

Add required nonnegative integer `longest_streak_days` to ActivityMonth returned
by GET /api/v1/me/activity. Preserve `streak_days` and all existing fields. No SQL
migration, new endpoint, historical rewrite, new dependency or auth change.
Backend ships the additive field before or alongside the synchronized frontend.

## Implementation boundaries

Compute the maximum adjacent-day run from the existing distinct dates in the
progress service; do not add a second history query. Update the progress Pydantic
schema, generated OpenAPI and TypeScript via existing generators. Replace only
the Dashboard's Longest streak placeholder; preserve the calendar/layout.
Do not synthesize a value from the visible month's days. Existing progress query
invalidation already refreshes activity after topic writes.

Affected modules: progress service/schema, generated contracts, Dashboard/test,
focused backend activity tests. Preserve all preceding uncommitted UI changes.
Use the current codex/cabusao-ui-integration branch; no Git publication operations.

## Checks and handoff

Test empty/single-day history, duplicate dates, consecutive days, gaps, month/year
boundaries, historical runs longer than current runs, undo, today/yesterday grace,
timezone boundaries and ownership scoping of the activity reads. Exercise the
service with controlled dates and verify response schema. Update Dashboard tests
for actual value/zero/loading/error without treating missing data as zero.
Run focused pytest/Vitest, OpenAPI/client drift, frontend typecheck/build and
scoped lint. Use existing Docker workflow for backend tooling; record environment
blockers instead of installing host dependencies. Manual: Dashboard shows current
and longest values; month navigation preserves both; allowed test-account Done/
undo operations refresh both. No real-account writes without test authorization.

Create docs/features/learning-streaks.md with REQ-10, author/dates/review status,
source references, results and manual steps; update owning product/page rules for
longest streak and correct older unavailable-placeholder documentation with a
dated implementation note. Retain current-streak rules as their owning authority.
Review gate: AGENTS.md requires the bounded plan reviewed before coding and
architecture-owner review for shared API changes. The owner's approval recorded
above satisfies this gate for this bounded change; implementation results still
require human review before integration.
