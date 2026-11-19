# Resume results organization

Created/updated: 2026-11-19. Task owner/implementer: Codex.
Required reviewer: @YakisobaNissin, per [CODEOWNERS](../../.github/CODEOWNERS).
Status: owner approved the bounded plan in chat with “approve” on 2026-11-19;
implementation and focused checks recorded in the PDF guide. Human code review pending.
Task: UI-RESUME-02. Requirements: REQ-11, F-002, PM-W03/FUT-13.

## Request and current behavior

The owner reported a failed PDF analysis, then confirmed successful extraction in
chat. The earlier failure cause remains unconfirmed; the screenshot exposes only
a generic failure message. The owner subsequently asked why extracted skills do
not populate Skills and requested a more organized, table-based presentation.

The successful screenshot shows persisted document background, not a confirmed
skill self-report. [Decision S3](../decisions.md#current-resolutions) and the
[competency specification](../specs/competency-comparison.md) keep those records
separate. [F-002](../specs/career-recommendations.md#optional-pdf-extraction)
automatically applies valid document background. This plan changes presentation,
not those persistence rules.

## Proposed implementation

1. Replace the loose extracted-background lists with a semantic table showing
   category, extracted background, and an expandable source page/passage. Keep
   skills, work experience, education and projects clearly identified; preserve
   original evidence text and missing-category explanations. Do not guess at
   titles, companies, dates, or individual skills inside grouped provider text.
2. Show saved skill evidence automatically in the Skills card under a separate
   **From resume** group, using the same account-scoped document query/cache and
   shared evidence presentation where appropriate. Explain that these are saved
   resume claims; experience ratings remain user-confirmed. Refresh/replacement/
   removal must reflect the current active document. Preserve existing reports.
3. Group resume status and links, add spacing between results and actions, and
   retain explicit Analyze PDF, replacement/removal controls, pending/error
   recovery, synthetic-data gating and navigation/account guards.
4. Follow the existing [design system](../design.md), spacing, tokens, native
   disclosure keyboard behavior and shared Button. Make long text wrap within
   the table and preserve readable reflow at narrow widths and zoom. No assets,
   fonts, packages or new global design system.

## Files, dependencies and boundaries

Expected files: `frontend/src/features/profile/documents.tsx`, a small shared
resume-evidence presentation component if needed,
`frontend/src/features/competencies/profile-skills.tsx`, focused existing test
files, `frontend/src/styles.css`, and [PDF guide](../features/pdf-reading.md).
Inspect the Settings mount and update it only if required to share data cleanly.

Dependencies: existing account-keyed core queries, generated Document contracts,
active document lifecycle, Profile skill editor, and current CSS tokens. No
backend, parser/provider, schema, API, authentication, dependencies, or hosted
configuration changes. Automatically creating canonical skill reports or ratings
is outside this plan and would require a separately reviewed product decision.

Initial inspection: branch `codex/cabusao-ui-integration`; unrelated untracked
`output/sql/supabase-security-audit.sql` is preserved. No application edits made
during diagnosis. No commits, pushes or deployment are authorized.

## Verification and acceptance

- Run TypeScript checking and scoped lint in the existing frontend environment.
- Reuse the document/Profile skill tests; add coverage only for the meaningful
  integration gap: resume evidence appears in Skills, removal clears it, and
  showing evidence does not call the save-competency API or alter user ratings.
- Verify table semantics, category/empty states, source disclosure, long-text
  wrapping and pending/error controls. Preserve existing upload/revision/account
  tests. Do not rerun the full foundation or provider suites for presentation.
- Guided manual acceptance at `/settings/profile` in the owner's existing app:
  refresh a successful analysis, inspect the organized results, open a source
  passage with keyboard, and confirm the same skills appear under From resume
  in Skills. Existing experience reports and ratings must remain unchanged.
  Check a narrow viewport and 200% zoom. In a disposable approved test flow,
  replace/remove the document and verify both views reflect current state.
- Record actual pass/fail/not-run evidence and manual acceptance status in the
  PDF guide. Human review remains required before integration.

The earlier analysis failure is unresolved. No new provider requests, private
PDF uploads or hosted data mutations were performed. Automatic approval review
blocked Chrome access without supplying a further reason, so browser inspection
of that failure was not completed. Local Compose application services were not
running; existing application images are available. Use focused existing-image
checks if local services remain stopped; do not start the full stack for this UI
change without need.
