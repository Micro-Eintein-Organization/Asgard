> Historical record archived 2026-11-17. Dated scope and test evidence are retained; use the [current documentation](../../../README.md). This record does not grant new activation, implementation, or publication authority.

# Account deletion
2026-11-16. Owner/reviewer @YakisobaNissin approved chat implementation plan.
Implementer Codex. Scope REQ-13 and QA-01/02/09/11: confirmation UI, server fresh
auth, durable block/ledger, resumable Storage/Auth purge, maintenance workflow.
Preserve pending security UI edits. Additive APIs and versioned SQL; focused
security/worker/migration checks and frontend build. Hosted deletion, monitoring
and restore acceptance remain operator gates. No commit/deployment authorized.

2026-11-17 continuation: implementation and bounded local checks are recorded in
[the feature guide](../../../features/account-deletion.md). Hosted activation remains
disabled; @YakisobaNissin owns review, environment setup and disposable-account
acceptance. Unrelated footer/status edits in the checkout are outside this task.
