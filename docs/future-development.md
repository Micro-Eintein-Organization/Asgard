# Future development

Updated: 2026-10-29. Maintainer: project owner; implementation contributions: Codex.
This backlog records intent, not approval. Product, architecture and decisions remain authoritative.
Future tasks must update the affected entry's status, date, decisions and evidence.

All entries below are deferred from the current local handoff by the owner's task
of 2026-10-28. Owner/reviewer are unassigned unless explicitly recorded later.

| ID | User outcome | Dependencies/modules and open decisions | Acceptance outline |
|---|---|---|---|
| FUT-01 | Understand evidence-based skill gaps | Reviewed skill taxonomy, role requirements, assessment and provenance; decide validity and correction model | Unknown stays unknown; document statements and Done never imply proficiency |
| FUT-02 | Compare careers and save alternatives | Catalog, preferences; decide criteria and shortlist lifecycle | Saved comparisons preserve focus/progress and explain sources |
| FUT-03 | Reflect after trying a learning activity | Discovery/recommendations; decide questions and interpretation | Optional feedback persists without inferred ability |
| FUT-04 | Ask conversational guidance questions | Provider, privacy, history; decide tutoring and advice boundaries | Grounded responses, validated links, failure recovery |
| FUT-05 | Receive deeper adaptive Discovery | Versioned definitions/routing; author and review further branches | Resume, retakes and inactive answers remain coherent |
| FUT-06 | Start at a suitable learning point | Evidence and authored prerequisites; decide admissible evidence | No automatic completion or unsupported competence claims |
| FUT-07 | Explore broader curricula | Content publication and review capacity | Stable IDs, genuine resource provenance and retained progress |
| FUT-08 | Understand labor-market context | Licensed regional data, freshness and provenance policy | Dated sourced claims; no fabricated demand or salaries |
| FUT-09 | Analyze scans and other document formats | OCR/parser isolation and privacy review | Bounded resources and equivalent removal lifecycle |
| FUT-10 | Manage profile photos | Private storage and image re-encoding | Limits, metadata stripping, authorization and cleanup |
| FUT-11 | Recover accounts and use Google/MFA | Auth provider capability gates AUTH-C1/C2 | Provider-boundary security checks and usable recovery |
| FUT-12 | Use a hosted production service | SMTP, backups/restore, scheduler, deletion, provider gates and operator | Recorded operations/security/release acceptance |
| FUT-13 | Upload and analyze selectable-text PDFs | Documents service, provider data controls and privacy review; owner deferred processing on 2026-10-29 | Verify privacy, extraction, replacement, removal and cleanup before activation |

## Skill evidence extension boundary

FUT-12 remains deferred for hosted release. On 2026-10-29 the owner approved
deployment preparation: source configuration, isolated local acceptance, CI and
runbooks are implemented in the [acceptance guide](features/deployment-preparation.md).
Actual hosting, SMTP, pooler/TLS, backup/restore and model-quality gates remain open.
This preparation does not approve deployment.

Keep interests, self-report, document-supported statements, learning activity,
assessed competence and authored role requirements distinct. Future skill IDs may
map to stable career/topic IDs through reviewed associations. Evidence needs source,
revision, date, confirmation and assessment method where applicable. Corrections
and removal invalidate dependent analyses. Do not add unused assessment tables now.

## Updating entries

Use statuses proposed, approved, in progress, completed or deferred. When promoting
an entry, record the named owner/reviewer, date, decision reference, scope and
acceptance evidence. Preserve unresolved decisions and link the owning specification.
