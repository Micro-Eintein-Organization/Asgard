# Future development

## Local MVP deferrals — 2026-11-02

Approved scope reduction is recorded in the decision register. Photos (FUT-10), PDF processing (FUT-13), recovery/Google/new MFA lifecycle (FUT-11), deletion/hosted operations (FUT-12) remain deferred. Additional deferred UX: shared Learning resolution/continuation dialog, chronological recent completions, detailed Profile Discovery summary and richer guidance eligibility. Existing rejection/manual resolution and status/results links form the local baseline. Implementation owners for these follow-ups are unassigned; technical review remains required. No deferral waives security checks for enabled behavior.

Current scope, 2026-11-02: use the [local MVP resolution](decisions.md#local-evaluation-mvp-resolution-2026-11-02) and [consolidated implementation/evidence](development.md#current-local-mvp-status-2026-11-02). Earlier inventories and proposed work below retain their dates; existing implemented core and the 12-path release must not be treated as new implementation assignments. Pending review, future proposals and hosted gates remain separate.

Resource update, 2026-11-02: release 4 now supplies topic-specific resources for
all 288 topics (238 distinct checked destinations), superseding the generic-link
limitation of release 3. Independent subject-matter review, periodic link upkeep
and authenticated browser acceptance remain follow-up work. See
[evidence and limits](features/roadmap-content-expansion.md).

Local roadmap update, 2026-11-02: the documented scope covers import of v4 as supplied
and waived resource verification. Release 3 is locally published with 12 roadmaps;
the three short paths are retired with their history retained. This supersedes
three-path-only local inventory status. Resource relevance, curriculum quality,
independent acceptance and browser checks remain follow-up work. See
[roadmap content expansion](features/roadmap-content-expansion.md) for evidence.
This local import grants no hosted publication or Git approval.

Updated: 2026-11-03. This backlog records intent, not approval. Product, architecture and decisions remain authoritative.
Future tasks must update the affected entry's status, date, decisions and evidence.

The [post-MVP roadmap](post-mvp-roadmap.md) records the recorded 2026-10-29 request
for a repository-specific planning document. It separates proposed features into
bounded work packages, dependencies and review gates. This is a planning addition;
the entries below remain deferred and no feature implementation is approved by
the roadmap. Its PM-Fxx/PM-Wxx references do not replace existing requirement IDs.
The [first implementation proposal](post-mvp-first-implementation.md) provides
the detailed foundation sequence, feasibility review and proposed acceptance gates.

All entries below are deferred from the current local handoff by the recorded task
of 2026-10-28. Review and implementation remain pending unless explicitly recorded later.

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

## Post-MVP planning update (2026-11-03)

Curated research release follow-up: the user approved all-12-career data preparation and a companion methodology paper, superseding the earlier two-career preparation limit only. See the [dataset](../data/post-mvp/releases/curated-v0.1/README.md), [paper](research/dataset-methodology.md) and [review handoff](research/dataset-review.md). Proposed mappings, source conflicts, definition gaps and adequacy interpretation remain explicit. No FUT feature is promoted to implemented or accepted by this research release; study decisions and application gates remain separate.

Source preparation follow-up: 20 user-supplied files were inventoried and structurally inspected; provisional candidate coverage, pilot evidence and comparison cases are linked from the [received-source plan](plans/post-mvp/source-readiness.md). Philippine frameworks are now explicit candidate sources alongside O*NET. ESCO was not supplied and is unavailable as reported by the user. Mappings, methodology, publication and all affected FUT implementations remain pending/deferred.

Documentation restructuring authorized by the user: the [roadmap](post-mvp-roadmap.md#feature-map) now indexes ten substantive feature plans and independent dependency paths. The [shared dataset plan](plans/post-mvp/datasets.md) makes actual source inspection and a reviewed two-career pilot precede dependent contract finalization. All 12 careers receive a coverage assessment; Data Analyst and Frontend Developer are pilot candidates, not accepted mappings. The [integration plan](post-mvp-first-implementation.md#feature-ownership-and-readiness) links acceptance to feature owners.

FUT statuses and existing operational deferrals are unchanged. The initial documentation restructuring acquired no datasets; the subsequent user-supplied source inspection is recorded above. No feature implementation or source/mapping/publication approval is inferred. Approval, implementation and verification evidence are tracked separately.

## Skill evidence extension boundary

FUT-12 remains deferred for hosted release. On 2026-10-29 approval was recorded for
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
an entry, record the review requirements, date, decision reference, scope and
acceptance evidence. Preserve unresolved decisions and link the owning specification.
