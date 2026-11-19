# Hosted Supabase audit and repair

Implementer/task owner: Codex. Created/last updated: 2026-11-19.
Reviewer/operator: YakisobaNissin, per [CODEOWNERS](../../.github/CODEOWNERS).
Requirements: REQ-01/11/12, QA-09, architecture A-01/A-03/A-08/A-11.
Status: read-only hosted audit completed for the accessible scope; portable
reference repair prepared and locally verified. Hosted publication, Auth/SSL
changes and backup/restore acceptance are not executed or approved by this record.
Task/review reference: the owner's request to review all Supabase aspects and make
repairs concrete after confirming the missing reference releases.

## Bounded work and authority

Audit migration history, catalog completeness, roles/RLS/grants, Storage,
non-secret Auth configuration, public deployed connectivity and maintenance/
backup metadata. Prepare restoration of the existing local reference releases
without changing their data or introducing schema/contracts/auth architecture.
Relevant modules are the existing reference renderers, catalog publication
runbook and packaged reference content. The backend/browser application is
unchanged; user data and private object bodies were not read or exported.

[Architecture](../architecture.md), [security policy](../security-and-operations.md),
[deployment](../deployment.md) and versioned migrations remain authoritative.
Project AGENTS.md requires architecture-owner review for Auth/infrastructure and
reviewed content publication; this task prepares exact changes for that review,
not an automatic global configuration push. Existing local-only reference
approval does not establish hosted content/privacy/provider acceptance.

## Confirmed hosted state

The linked project and deployed frontend point to the same Supabase project.
All results are dated 2026-11-19 and are not permanent health guarantees.

| Area | Evidence | Assessment |
| --- | --- | --- |
| Migration ledger | All 20 repository migrations recorded remotely | No migration repair or rerun indicated |
| Main catalog | 23 published careers/roadmaps, questionnaire v1/v2, releases 1–6; no published career without a published roadmap | Present; 1 retired career and 3 retired roadmaps stay retired |
| Skills/PH sample | 230 learning-path skills, 108 technology skills, 120 snapshot mappings and 22 PH postings published | Present; do not republish to fix other datasets |
| ESCO/occupational | Both release and active-pointer tables empty | Confirmed missing hosted content |
| Roles | asgard_app/asgard_maintenance have no superuser, bypass-RLS, create-role or create-database flags and no parent memberships | Restricted attributes confirmed; credentials not inspected |
| Protected schemas | 55 tables checked; no effective anon/authenticated table or column grants; no browser schema USAGE | No browser data exposure found in this scope |
| RLS/function controls | 54 tables have RLS; 92 policies; SECURITY DEFINER functions have fixed search paths and no browser execute grants | Owner-only skill_erasure_authorizations intentionally has no RLS and no app/browser grants, matching its migration; do not blindly enable RLS there |
| Database integrity | No invalid/unready indexes or unvalidated constraints | No metadata integrity defect found |
| Storage | Both application buckets private; documents 10 MB/PDF, photos 2 MB/JPEG; no browser object policies | Matches backend-gateway design |
| Auth | Email confirmation on; anonymous/Google providers off; custom SMTP enabled; hosted site/reset callback correct; ES256/P-256 JWKS | Configuration/public metadata verified; no email was sent and no factor was changed |
| JWT lifetime | Hosted 3600 seconds; approved local/security target 900 | Adjust the hosted setting, not the entire local config |
| SSL enforcement | Provider reports database enforcement false | Review and enable after confirming application/admin clients use the approved TLS connection settings |
| Pooler | Config diff reports transaction mode vs local session mode | This alone does not identify Render's actual endpoint; verify Render uses session-pooler port 5432 and verify-full TLS, never copy the local URL |
| Deployment | Frontend 200; backend /health and /ready 200, Supabase available; correct-origin CORS; untrusted-origin ACAO absent | Connectivity/readiness passed; not authenticated feature acceptance |
| Anonymous reads | Profile/documents/matching/ESCO endpoints returned 401 | Public denial verified without creating test accounts |
| Maintenance | 9 recorded deletion runs, last 2026-11-19 08:07 UTC; at 09:48 UTC, no due/failed deletion jobs or document/photo cleanup backlog | Heartbeat exists; hourly scheduler continuity still needs operator confirmation |
| Backups | Provider lists no backup records and PITR false | External encrypted backup and restore evidence remains unverified; no private backup was downloaded |

Read-only query artifacts: `output/sql/catalog-publication-audit.sql` and
`output/sql/supabase-security-audit.sql`. Configuration diff was filtered to safe
fields; secret values, user identifiers, object keys and account rows were not
included in the audit output. Some initial CLI invocations required the supported
JSON-output/experimental flags; corrected reads succeeded.

## Prepared reference repair

The old standard publisher covers careers/roadmaps/resources/Discovery. It does
not imply publication of skills, benchmarks, ESCO or occupational reference data.
The [deployment inventory](../deployment.md#content-publication-inventory) now
makes those separate stages explicit.

The [reference renderer](../../backend/scripts/render_reference_restore.py) uses
portable, hashed assets in `supabase/content/reference-data/20261108/`, packaged
from the existing source-verified local rollout. It preserves the exact earlier
IDs and payload, including historical limitations and source provenance:

- ESCO: `8e4deef5-ac7a-5960-b937-8a98e34803a6`, v1.2.1, 165 concepts,
  68 source links and 23 career mappings.
- Occupational: `b6ff93ae-3210-5bbe-8410-a3f6d989962a`, 23 profiles,
  SHA-256 `6d194c8d6dc67c0417ceeb6d20b7357f5d6617637596b492685ef60528f142e8`.

The existing local ESCO staging/approval selection was reloaded with the pinned
archive hash and reproduced the original release ID. The original occupational
canonical payload reproduced its original release ID/hash. The packaged assets
do not depend on ignored rollout directories or a contributor's absolute path
after checkout. [ESCO attribution and reuse limitations](../../licenses/esco.md)
and the [historical local activation scope](career-evidence-recommendations.md#expanded-local-reference-release-2026-11-08)
continue to apply; this is not new independent content review.

Executed from `backend/` in the pinned runtime:

```text
python scripts/render_reference_restore.py --output ../output/sql/reference-data-restore.sql
```

The generated SQL is about 5.6 MB instead of the archived 42 MB occupational
script. A reversible string dictionary reconstructs the original canonical JSON
and verifies its hash inside PostgreSQL before insertion. One transaction imports
and activates both releases. It checks expected ESCO row counts, refuses a
different active release, preserves existing immutable data, and is repeat-safe
for the same release. No user records, schema, roles or Auth settings are changed.

Verification passed: three focused integrity/encoding tests and scoped Ruff.
A disposable network-isolated PostgreSQL 17 database applied the real reference
migrations over minimal public career/roadmap/topic prerequisites, then the full
repair. Restricted asgard_app reads saw all 165 ESCO concepts and 23 occupational
profiles; repeating the repair succeeded. The container was removed. This is
targeted reference validation, not a full Supabase rebuild, hosted pooler/session
test or independent content acceptance. No frontend tests/build were repeated
because this change modifies offline tooling and documentation only.

## Owner repair order and remaining gates

### SQL Editor size-limit workaround

The owner attempted the reviewed restoration in hosted SQL Editor; its web client
rejected the 5.6 MB query before execution. Automatic approval review separately
rejected Codex's CLI execution attempt because exact hosted execution authority
was unclear; no hosted write occurred. The owner then requested split files.

The offline `backend/scripts/split_reference_restore.py` prepared 12 ordered files
under `output/sql/reference-data-split/`: initialize, ten upload chunks, and final
publish. Each is under 1 MB. PostgreSQL's owner-only large-object storage carries
the temporary SQL bytes across separate Editor sessions; no new application
table, schema or function is created. Upload ACLs exclude PUBLIC, browser,
runtime and maintenance roles. All files must run under the same database role.
Only the final file verifies the complete SHA-256 and executes the original
reviewed commands atomically, then removes the temporary upload. Failed final
execution preserves the upload for retry. An optional cleanup file deletes only
that owner's tagged temporary object if the operation is abandoned.

The full 12-file sequence passed in a network-isolated disposable PostgreSQL 17
fixture using the real reference migrations: 165 ESCO concepts, 23 occupational
profiles, and zero remaining upload objects. The container was removed. This is
a manual operator alternative; no split-file hosted execution was performed.

1. Review `output/sql/reference-data-restore.sql` and the preserved local reference
   scope, then approve hosted activation before running the whole file in the
   intended Supabase SQL Editor. Do not run old full-catalog dumps or migrations.
   Verify one release and active selector for each reference dataset afterward;
   refresh Sources and limitations in the app. New recommendations must be
   explicitly refreshed; existing saved explanations are not rewritten.
2. Supabase Auth settings: set JWT/access-token expiration to **900 seconds**.
   Preserve the hosted site URL, reset callback, SMTP and TOTP settings. Do not
   push `supabase/config.toml`, whose loopback URLs are intentionally local.
   This affects newly issued tokens; existing tokens need their own lifecycle.
3. Confirm Render's restricted session-pooler URL uses port 5432 and
   `sslmode=verify-full` with its configured trusted CA. Confirm administrative
   clients use TLS too. Then enable provider SSL enforcement through the Dashboard
   or the pinned CLI's reviewed `ssl-enforcement update` operation. Retest /ready.
   No database credential or client configuration was read from Render in this
   audit; this check remains an operator action.
4. Confirm GitHub's account-maintenance schedule/enable variable and missed-run
   alerting. A past heartbeat and empty queues do not prove future scheduling.
   Do not run a deletion worker merely to test a configuration switch.
5. Choose an external encrypted backup destination/operator and execute the
   existing backup/restore acceptance policy before claiming recovery readiness.
   No destination/credentials were supplied; this cannot be marked fixed by
   creating a workflow file or finding an old local dump.
6. Finish guided hosted checks with disposable accounts: signup/confirmation,
   reset callback, MFA/recovery, Profile/skills, document/photo lifecycle,
   cross-account denial, evidence reads and deletion lifecycle. Provider delivery,
   CAPTCHA/direct-provider controls, notification/race/session behavior and full
   authenticated acceptance remain unverified. Do not enter credentials in chat.

No hosted mutation, commit, push, reset, source publication or deployment was
performed by the audit. Remaining approvals/operations belong to YakisobaNissin;
external backup ownership/destination is not yet assigned in this record.
