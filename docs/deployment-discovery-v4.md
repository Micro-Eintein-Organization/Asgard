# Discovery v4: scripts and activation

Prepared by Codex, 2026-11-20; operator/reviewer @YakisobaNissin.
V4 scripts were applied locally with explicit owner authorization on 2026-11-20.
Hosted application remains pending. Previous hosted migration evidence does not
mean this new migration or questionnaire is already installed on hosting.

1. Review and publish the combined source to the agreed deployment branch; record
   its commit SHA. No commit/push/merge is performed by this task.
2. In a short controlled update window, run the reviewed
   [combined v4 SQL](../supabase/content/20261120_discovery_v4_upgrade.sql) in the intended Supabase
   project's SQL Editor. It applies only v4 flow metadata and publishes the v4
   registry, preserving earlier versions and recording the new migration history.
   Existing compatible objects are verified/skipped; conflicts fail the transaction.
   Do not rerun the older deletion, recovery, snapshot or interpretation migrations.
3. Deploy that reviewed backend SHA on Render, then the matching frontend SHA on
   Vercel. Existing environment variables are reused. Keep the update window until
   both compatible deployments are ready; schema/content/app activation is not atomic.
4. Use a new attempt or Retake Discovery. Existing drafts intentionally retain
   their version. Check experience intake, relevant questions, Back/resume, phase
   progress, and supported recommendation reasons. Stop rollout on a real failure.

For CLI-managed migration application, use the versioned
[migration](../supabase/migrations/20261120000200_discovery_flow_plan.sql) through
the repository-pinned migration workflow, then the separate
[registry](../supabase/content/20261120_discovery_v4.sql). The combined operator SQL
is an alternative; do not blindly run both approaches.

Scripts require the existing approved foundation and confirmed-skill schema.
Only generic route IDs, slot counts and a source-version hash are persisted by the
new column. No personal resume text is added. Keep the existing restricted runtime
role, RLS, credentials and provider settings. Hosted compatibility and final human
acceptance remain pending until the steps above are performed.

Completion/navigation follow-up, 2026-11-20: frontend-only correction is implemented
locally; 10 targeted editor regressions, TypeScript, scoped lint and the short
local authenticated clarification-to-results walkthrough passed. No additional SQL
or backend deployment is required for this correction itself. Publish the reviewed
combined change, redeploy Vercel, and verify the hosted revision. Earlier v4 schema,
registry and matching backend prerequisites in this guide remain applicable.
See the [feature evidence](features/guided-discovery-v4.md#completion-and-navigation-correction-2026-11-20).
