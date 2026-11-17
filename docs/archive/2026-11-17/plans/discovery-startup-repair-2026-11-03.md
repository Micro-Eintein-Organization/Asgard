> Historical record archived 2026-11-17. Dated scope and test evidence are retained; use the [current documentation](../../../README.md). This record does not grant new activation, implementation, or publication authority.

# Discovery and local startup repair

Created: 2026-11-03. Owner/implementer: Codex. Required reviewer: @YakisobaNissin.
Status: implemented and focused local checks passed; bounded plan approved by the
owner's “PLEASE IMPLEMENT THIS PLAN” instruction on 2026-11-03. Completed human
technical review and independent Windows/real-zoom acceptance remain pending.

Scope: repair recommendation request budgeting with pinned tiktoken 0.12.0 and
offline Docker tokenizer data; preflight before quota reservation; final-question
See suggestions action and one automatic saved-session generation; desktop choice
rows; guided local content publication and truthful application readiness.

Acceptance: QA-11, NFR-02, F-001-AC-05–08 and F-002 generation, provenance,
idempotency, quota and recovery requirements. Authority: architecture.md,
specs/discovery.md, specs/career-recommendations.md and security-and-operations.md.

Affected modules: backend recommendations and dependency/Docker packaging;
frontend Discovery/recommendations and questionnaire styles; local setup/startup
helpers and their focused checks; existing feature/setup/design documentation.
Dependencies: local Supabase, restricted asgard_app role, published content,
backend-only Groq configuration. Public API shapes, SQL and Auth contracts stay
unchanged. The owner explicitly approved the tokenizer dependency and startup
changes in the implementation plan; code review remains required before integration.

Checks: focused recommendation/preflight and flow tests; startup decision tests;
frontend type/lint/API drift and backend lint; affected Docker build and offline
tokenizer check; one synthetic live Groq check with saved readback; browser layout,
keyboard/reflow and final-step walkthrough. Independent Windows acceptance remains
pending unless actually performed. Preserve all existing uncommitted UI edits on
codex/cabusao-ui-integration. No Git publication or shared-data reset is authorized.
