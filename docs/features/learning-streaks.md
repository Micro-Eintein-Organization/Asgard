# Learning streaks

Implementer: Codex. Created: 2026-11-16. Last updated: 2026-11-16.
Requirements: REQ-10; existing H6 current-streak/timezone rules.
Status: implemented and locally verified; human integration review pending.
Reviewer: @YakisobaNissin. Owner identified as that reviewer and approved the
bounded plan/additive API change in chat on 2026-11-16. See the
[reviewed plan](../plans/longest-streak.md), [product rules](../product.md),
[page rules](../pages-and-interactions.md#progress-calendar-and-streak-rules)
and [architecture](../architecture.md).

## Implementation

The existing activity endpoint now returns required nonnegative
`longest_streak_days` alongside `streak_days`, month and daily counts. Contract
authority remains [generated OpenAPI](../../backend/openapi.json) and
[generated TypeScript](../../frontend/src/api/generated/schema.d.ts).

The [progress service](../../backend/app/modules/progress/service.py) computes
the maximum adjacent-date run from its existing account-scoped distinct local
completion dates. It adds no database query or migration. Current streak and
timezone handling remain unchanged. Duplicate dates count once; gaps break runs;
no dates means zero. Removing qualifying activity can reduce the longest value.
Both counters cover all available history regardless of calendar month.

The [Dashboard](../../frontend/src/screens/DashboardScreen.tsx) replaces the
Longest streak placeholder with the actual value while preserving its layout.
Pending reads show Loading, failed reads show Unavailable when no saved data is
available, and a genuinely empty history shows 0 days. An older backend lacking
the new field shows Unavailable rather than an invented zero. Deploy the backend
field before or with this frontend. Existing progress invalidation marks activity
stale; navigating back to Dashboard refetches it.

## Verification

- PASS: nine backend pytest cases cover empty/single-day history, duplicate and
  unordered dates, gaps, month/year boundaries, past runs longer than current,
  yesterday grace, Manila versus UTC day boundaries, removal of activity and
  nonnegative required-field validation. Service mocks assert the account
  predicate/parameter on both reads. This is not a new live cross-account test;
  authorization/query filters were unchanged.
- PASS: focused Dashboard Vitest test covers real longest value, zero, loading
  and failed reads, preserving the existing layout/interaction assertions.
- PASS: frontend build/TypeScript, scoped Dashboard ESLint, backend schema/test
  Ruff, OpenAPI regeneration/drift and generated TypeScript synchronization.
- Host client-drift check FAIL: Windows temporary-path EISDIR error in the
  existing generator harness. The same repository check PASS in the existing
  frontend Docker container. No infrastructure change was introduced.
- Backend progress-service Ruff FAIL: six pre-existing E501 long lines in
  unrelated dashboard/view code. The new code has no reported lint finding.
- Live signed-in Dashboard PASS: current 0 days and longest 2 days match the
  visible November 3, 5 and 6 activity dates; previous-month navigation and return
  preserve both counters. No completion records were changed for verification.

## Manual follow-up and limits

Open http://127.0.0.1:5173/dashboard. Confirm current and longest counters and
use Previous month/Next month; only the calendar dates should change. On a
designated test account, mark a topic Done and return to Dashboard; current and
longest should reflect qualifying local dates. Undo Done, return again and verify
both recalculate from remaining records. Multiple topics completed on one day
still count as one streak day. Report route, timezone, relevant dates and
expected/actual values; do not include credentials.

Live Done/undo, midnight rollover and timezone-change journeys remain pending;
controlled service tests cover their calculation boundaries without altering the
owner's saved data. Full regression/release acceptance was not rerun for this
additive field. Existing broader frontend lint/test-harness issues remain outside
scope. No dependencies, Auth logic, SQL schema, commits or publication changed.
