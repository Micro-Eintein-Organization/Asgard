# Discovery v3 and contextual counselor: combined activation checklist

Prepared by Codex on 2026-11-20. Release operator/reviewer: @YakisobaNissin.
This is the single operator checklist for the combined changes, supplementing the
[deployment runbook](deployment.md). It does not authorize publication, migration
application or deployment. Product behavior and acceptance remain owned by the
[Discovery guide](features/guided-discovery-v3.md), [counselor guide](features/contextual-counselor-profile.md),
[competency guide](features/competency-comparison.md) and [PDF guide](features/pdf-reading.md).

## Current state and responsibility

- Both features share one uncommitted checkout on `codex/cabusao-ui-integration`.
  Neither chat committed, pushed or deployed these changes. Redeploying the current
  remote revision alone will not publish the local changes.
- With owner authorization, the Discovery chat applied only migration
  `20261120000100` locally and recorded its source/history atomically. The counselor
  chat independently verified that the installed function matches the reviewed SQL.
  Default false/non-null, protected execution, denied direct confirmation writes and
  actual nonexistent-session denial were checked. The v3 registry was tested twice
  in rollback and published locally. These are not hosted acceptance results.
- Local follow-up, 2026-11-20: the owner requested remaining local work. Reviewed
  migrations `20261116000100`, `20261118000100`, `20261118000200`,
  `20261119000100` and `20261119000200` passed rollback validation and were applied
  with exact source/history recording. Deletion/recovery features remain disabled.
  The approved `ph_postings_collected/2026-11-19-v1` technology publication was
  validated/applied locally and selected in the ignored local configuration.
  The focused authenticated/browser journey passed; see the Discovery guide.
  These local changes do not establish hosted state.
- Codex owns the prepared source, generated contracts, migration/content artifacts,
  documentation and recorded focused checks. @YakisobaNissin owns final review,
  explicit Git/hosted-operation authorization, target selection and private credentials.
  Codex can perform approved operations using available access; no manual action is
  required merely because a step is a migration. The human walkthrough coordinator
  is unassigned until the owner assigns themselves or another tester.

## Apply in this order

| Step | Exact action | Owner and exit condition |
| --- | --- | --- |
| 1. Review combined source | Review both features together, including shared competencies, recommendation/discovery services, OpenAPI/TypeScript and the confirmation migration. Select one release revision and check for overlapping edits. | @YakisobaNissin approves the release content. Codex resolves approved integration issues without overwriting unrelated edits. |
| 2. Inspect target | Confirm the actual hosted Supabase project, Render service and Vercel project/deployment branches. Read hosted migration history **and actual schema/grants**, then inventory published v3 and skill-reference content. Check backup/operator readiness under the existing runbook. | Codex may inspect with available access; owner supplies identities/access privately where missing. A dated target-specific missing-artifact list is required. The 2026-11-19 audit is historical evidence only. |
| 3. Publish code | Obtain explicit approval for the specific commit/push/integration operations. Publish the combined reviewed changes onto the agreed deployment branch, preserving the repository branch/PR workflow. | Owner authorizes; Codex or owner executes. Record the commit SHA. Do not assume the current feature branch is configured for either host. |
| 4. Prepare Supabase schema | Apply only reviewed missing schema prerequisites from the dependency table below, then [confirmed-skill evidence](../supabase/migrations/20261120000100_confirmed_skill_evidence.sql). Preserve exact migration source/history. Verify the new column/default and protected grants. | Owner separately authorizes the concrete hosted writes; Codex or owner executes. Already-present matching artifacts are verified rather than rerun. Resolve history/schema disagreement before writing. Never blanket-push every pending migration or reset a retained database. |
| 5. Deploy Render | Deploy the backend from the selected reviewed SHA. Verify existing configuration below and `/ready`; confirm logs contain no missing-table/function or migration errors. | Owner authorizes deployment; Codex or owner executes. Record the actual live SHA and readiness result before proceeding. Repository `render.yaml` disables auto-deploy; inspect the actual service setting. |
| 6. Publish v3 registry | Immediately after the compatible backend is ready, publish the [v3 registry](../supabase/content/20261120_discovery_v3.sql), preserving v1/v2 registries and existing sessions. Verify published questionnaire version 3 and the authored question registry. | Owner separately authorizes content publication; Codex or owner executes. This is content publication, not a schema migration/history repair. |
| 7. Deploy Vercel | Deploy the frontend from the **same reviewed SHA**, using the existing frontend project/build configuration and hosted backend origin. | Owner authorizes deployment; Codex or owner executes. Record the actual live SHA. No new feature-specific Vercel variable is needed. |
| 8. Accept the combined flow | Use disposable accounts and the short walkthrough below. Start a new Discovery attempt or retake; existing drafts/completions intentionally retain their questionnaire version. | Assigned human tester, supported by Codex. Record expected/actual behavior, sanitized request IDs and failures. Code/tests alone do not pass this step. |

Use the existing staging/controlled release workflow for steps 5–7 and do not
announce new Discovery availability until all three are complete. The backend may
request v3 before its registry is present during this short rollout window.
The registry is not a frontend deployment and old backend code must not be assumed
to understand v3.
If a deployed revision fails acceptance, pause rollout and restore the previous
compatible backend/frontend revisions. Preserve additive schema and historical
sessions; do not drop confirmation data or remove questionnaire registries as an
automatic rollback. Follow the existing runbook for the specific failure.

## Schema, content and configuration dependencies

Inspect each target first; a missing entry in one environment says nothing about
another environment. Apply reviewed prerequisites in their dependency order.

| Artifact | When it matters |
| --- | --- |
| `20261120000100_confirmed_skill_evidence.sql` | Required for the combined current source: competency reads select `evidence_confirmed`; NLP confirmation and Discovery experience intake consume it. Requires existing skill tables, protected skill mutation, session function and budget table. Installed locally; hosted status unverified. |
| `20261118000100_career_skill_snapshot.sql` and `20261118000200_career_skill_postings.sql` | Required schema for the current full skill flow, including NLP preview: even the learning-path source queries snapshot/posting tables. A blank benchmark setting does **not** remove this schema dependency. Missing tables are an activation blocker for that flow. |
| Published benchmark references/postings | Required for Job-sample results. Verify published skills/mappings and configured source/version. Missing benchmark publication can leave Roadmap view usable when the required tables exist, but does not meet acceptance for both requested views. The historical hosted audit found `ph_postings_collected/2026-11-19-v1`; verify it is still the intended published selection before configuring Render. |
| `20261119000200_document_skill_interpretations.sql` | Required for saved semantic resume-equivalence interpretation. Without it, exact matching/extraction may remain available but the interpretation service reports unavailable; full resume interpretation acceptance is not passed. This migration also grants to `asgard_maintenance`, so verify that role and its approved prerequisite below. |
| `20261116000100_account_deletion.sql` | Not an inherent product requirement of Discovery branching. It provisions the maintenance role used by later migrations, including saved resume interpretations; if that role is absent, resolve this transitive schema dependency through reviewed migration scope. Do not invent substitute privileged grants or activate the deletion worker as a shortcut. |
| `20261119000100_application_recovery_codes.sql` | Required by the current frontend account-assurance read even when recovery issuance is disabled: `checkAssurance` reads recovery state. Apply the reviewed schema without automatically enabling recovery. Local acceptance exposed this dependency; schema presence does not pass the separate recovery lifecycle/activation gate. |
| `supabase/content/20261120_discovery_v3.sql` | Required authored v3 questionnaire/question registry, separate from schema migration history. Locally published; hosted publication unverified. Publish with its conflict checks; retain earlier questionnaire versions. |
| Existing published careers, roadmaps, topics and competency links | Required for meaningful routes, results and evidence destinations. Preserve published IDs and retired status; no new catalog/benchmark publication is approved merely by deploying these two features. |

No new feature-specific environment variable was introduced. Inspect the actual
Render Environment; a source `render.yaml` entry is not proof of live settings.

- NLP equivalence and counselor: existing `ASGARD_GROQ_ENABLED=true`, valid backend
  `ASGARD_GROQ_API_KEY`, and existing model/budget settings. Counselor also requires
  `ASGARD_AI_GUIDANCE_ENABLED=true`. Provider failure leaves bounded fallback paths;
  it does not establish full AI acceptance.
- Resume processing: existing `ASGARD_DOCUMENTS_ENABLED`,
  `ASGARD_DOCUMENTS_PROCESSING_ENABLED`, approved real-data policy and private
  Storage credential/buckets. Temporary review additionally uses
  `ASGARD_RESUME_SKILL_REVIEW_ENABLED`. Follow [hosted activation](features/hosted-feature-activation.md).
- Benchmark: existing `ASGARD_SKILL_MATCHING_BENCHMARK_SOURCE` and
  `ASGARD_SKILL_MATCHING_BENCHMARK_VERSION` must match the verified published data.
- Preserve restricted `asgard_app`, hosted Supabase origins, verified TLS and exact
  CORS/frontend API configuration. No provider or database secret belongs in Vercel
  browser variables. Optional web search remains independent of core activation.

## Unresolved work and shortest acceptance walkthrough

**Required before claiming complete hosted activation:** combined human code/content
review; a published reviewed release SHA; target-specific schema/content/configuration
verification; any reviewed missing dependencies; matching backend/frontend deployments;
and the authenticated walkthrough below. None is certified by local source checks.

**Required for the requested security/data-integrity acceptance:** complete an
authenticated two-account save/readback and denial check, stale version/failed batch
handling, skill/resume removal and suppression of dependent recommendation explanations.
The isolated SQL wrapper check and local nonexistent-session denial are useful but
do not establish the combined live experience/privacy journey.

**Required for AI answer-quality acceptance:** human review of representative real
NLP paraphrases, negation/aspirations, resume equivalence and counselor selection/
comparison explanations. Until reviewed, mark quality pending rather than calling
structured-output validation proof of correct meaning.

Run this bounded walkthrough at the selected hosted frontend, or locally at
`http://127.0.0.1:5173` after its dependencies are present:

1. Settings > Profile: describe a concrete task, preview skills, confirm one without
   a rating and reload. It must count as confirmed evidence without an inferred
   level. Verify manual entry and negation/aspiration fallback.
2. Career skill matches: inspect Job-sample and Roadmap views, exact/interpreted
   resume passages and topic destinations. Replace/remove a synthetic resume;
   derived evidence must update without changing self-reports or topic progress.
3. New Discovery/Retake: Use my experience must require a confirmed skill, positive
   self-report or usable active analyzed resume; an uploaded candidate alone must
   not qualify. Check Basics, input-method switching, Data + Security bridge,
   activity-specific follow-ups, Back changes and reload/resume. Old drafts stay old.
4. Results: inspect answer/experience reasons and authored introductory topic links.
   Remove supporting evidence and verify affected explanations are outdated or
   suppressed. Focus, progress and authored curriculum must stay unchanged.
5. Counselor: select a specific roadmap topic/milestone; ask about this selection.
   Follow up on an already displayed comparison; then ask about a focused skill
   in each basis. Check pair/route changes, expired comparison reference, provider
   failure, session/account changes, keyboard operation and a narrow viewport.

**Deferred/nonblocking for these bounded features:** unrelated backlog work, new
datasets, semantic expansion of Discovery's exact resume-connection reasons, full
browser matrices and broad foundation reruns without a changed-risk reason. Existing
production security, recovery, operational backup and release gates still apply
when their environment/feature scope is activated; this checklist does not waive them.

Evidence already recorded: Discovery 64 route/rule cases, 24 additional v3/skill
privacy cases and 15 Results/card UI cases; counselor/skills focused runs, nine
Profile/NLP/resume UI cases, isolated database wrapper tests, local session/grant
verification, TypeScript, scoped lint and generated-contract checks. See owning
guides for exact dated limits. No broad suite was rerun to produce this checklist.
Documentation verification: local link targets and whitespace checked. The local
skills/Discovery browser and ownership/removal journey now passes. Hosted schema,
deployments and hosted acceptance remain unverified. A subsequent focused correction
reduced interpretation batch payload size to fit the full provider-request budget.
One authenticated synthetic local preview returned interpretation available with
six suggestions, five from interpreted wording. Transient Groq HTTP 429 responses
were also observed; exact fallback remains available. See the competency guide for
the limits of this live smoke evidence. Local PDF processing remains disabled; full resume
and Counselor comparison/skill-basis quality walkthroughs remain pending.
