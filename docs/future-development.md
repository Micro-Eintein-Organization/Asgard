# Future development

## Hosted account demo, 2026-11-13

The owner paused unrelated planned features and approved zero-cost deployment
preparation plus optional authenticator/recovery UI on the current app branch.
Codex implements source and technical checks; @YakisobaNissin owns provider setup,
technical review, actual email and browser journeys. The team observes a protected
Vercel preview; signup is demonstrated with the owner's eligible organization email.
Custom SMTP remains deferred for ordinary-user signup. MFA enrollment remains
disabled until hosted AUTH-C2/fresh-auth evidence passes. Hosting, backup/restore,
maintenance and real-user operation remain pending. See the
[implementation guide](features/optional-two-factor-authentication.md) and
[owner checklist](deployment-account-demo.md). This demo exception does not
change the architecture, approve public signup or count as completed acceptance.

## Resume review follow-up, 2026-11-06

The owner enabled the temporary resume reader for local school-project use.
Formal privacy review, extraction acceptance, and the signed-in Profile
walkthrough are deferred. Record their results before broader rollout.
[Implementation guide](features/competency-comparison.md#temporary-resume-review-2026-11-06).

## W08 implementation and activation follow-up, 2026-11-06

Counselor and automatic comparison insight source is implemented behind a disabled
flag. Pending work includes technical review, approved public web domains and
credentials, migration review, contract drift verification and focused acceptance.
[Implementation record](features/ai-guidance.md)

## W08 original final-stage direction, 2026-11-06

The owner chose to keep one bounded AI counselor in the plan as a final-stage
optional improvement after the core app flows settle. W01's architecture
decision remains a prerequisite; W08's authorization, privacy, confirmation and
evaluation boundaries still need to be resolved before implementation. This is
not part of the current delivery. [Decision](decisions.md#w08-final-stage-improvement)
and [roadmap](post-mvp-roadmap.md#pm-w08-one-bounded-ai-counselor).

## W09 optional official assessment, 2026-11-06

The owner kept W09 optional. No instrument or integration has been selected;
keep any official assessment distinct from Quick Discovery.
[W09 roadmap](post-mvp-roadmap.md#pm-w09-optional-official-interest-assessment).

## W11 optional labor-market observations, 2026-11-06

The owner kept W11 optional. DICT/NICS and Philippine Skills Framework sources
already support occupational competency evidence; W11 would add distinct current
job-listing observations. No listing collection has been approved.
[W11 roadmap](post-mvp-roadmap.md#pm-w11-philippine-labor-market-observations).

## W12 practical evidence scope, 2026-11-06

The owner selected a lightweight product-verification record and deferred
participant studies, psychological outcome claims and a research paper unless a
research goal is later chosen. Unrun checks must remain labeled as unrun.
[Decision](decisions.md#w12-practical-evidence-scope-2026-11-06) and
[W12 roadmap](post-mvp-roadmap.md#pm-w12-evaluation-and-research-record).

## W04 local recommendation activation direction, 2026-11-06

The owner directed that W04 include local activation of the staged ESCO-backed
recommendation release without waiting for the two-model quality evaluation.
Record that evaluation as waived/not run, not passed. This is not hosted
publication or evidence of recommendation quality. [Decision](decisions.md#w04-local-recommendation-activation-2026-11-06)
and [W04 roadmap](post-mvp-roadmap.md#pm-w04-skill-comparison-and-recommendation-integration).

Recommendation results stay on the existing Recommendations page. The owner
removed the Dashboard shortcut on 2026-11-06. Roadmap remains focused
on learning and has no comparison panel. W04 skill comparisons appear only in
recommendation explanations and expandable evidence; W06 career-to-career
comparison remains separate. The Round 1 UI cleanup is implemented in source
and manual acceptance is pending.

## W03 resume-assisted Profile scope, 2026-11-06

The owner added an optional selectable-text PDF resume path to W03 in Profile.
Manual skill selection and skip remain available. Extraction suggests skills with
source passages; the learner confirms them and supplies their own experience
reports. W10/FUT-13 document enrichment is folded into W03. Consent, extraction,
retention and cleanup details remain to be reviewed before implementation; OCR
and other formats remain deferred under FUT-09. [Decision](decisions.md#w03-profile-and-resume-reader-scope-2026-11-06),
[W03 plan](post-mvp-roadmap.md#pm-w03-user-confirmed-competency-profile).

## Occupational reference scope, 2026-11-06

The owner confirmed that the twelve Asgard careers with roadmaps remain the
recommendation candidates. Broader ESCO occupations and skills stay in the
reference catalog. Future work may give selected occupations Asgard roadmaps and
reviewed mappings before adding them as career candidates. This records the W02
scope boundary; it does not claim that all O*NET or staged source records are
imported or reuse-cleared. [Decision and W02 plan](decisions.md#occupational-reference-scope-2026-11-06)
and [post-MVP roadmap](post-mvp-roadmap.md#pm-w02-reviewed-occupational-evidence).

## Learner journey simplification direction, 2026-11-05

The owner selected a presentation cleanup: keep current Discovery and schedule
its redesign last; keep W06 comparison focused on differences with saving and
notes secondary; remove W07 practice and reflection UI from Roadmap and
Dashboard for now while retaining its API and stored data dormant. These are
plan decisions; the W06 and W07 UI changes are not yet implemented. Details:
[post-MVP roadmap](post-mvp-roadmap.md#learner-journey-simplification-direction-2026-11-05)
and [W07 implementation guide](features/learning-guidance-and-reflection.md#owner-directed-presentation-rework-2026-11-05).

## Beginner exploration update, 2026-11-05

The owner selected career choice first across all twelve careers. Use concrete work, outputs, checks and one beginner activity per career, with optional task-based experience questions on the existing 120 skills. The typed local content package is implemented without database or recommendation changes. [Implementation and focused evidence](features/career-comparison-and-shortlist.md#beginner-exploration-2026-11-05). Independent comprehension/content review remains pending; PDF, hosting and additional account controls remain deferred.

## Learner exploration and career comparison, 2026-11-05

Activation update: the owner approved the concrete one-migration shortlist bundle. It is now applied locally; original-data checks and the focused learner journey passed. See [final evidence](features/career-comparison-and-shortlist.md#normal-activation-and-learner-journey-2026-11-05).

PM-F06 / W06 is selected and implemented in source with a two-career comparison, private shortlist/notes and repaired career-first experience flow. Focused verification passed; concrete normal migration review and guided acceptance remain pending. PDF upload, hosting, account controls and broad/model-quality testing remain deferred. [Current evidence and limits](features/career-comparison-and-shortlist.md).


## Career-evidence local release active, 2026-11-05

The complete twelve-career integration is active locally after concrete owner
approval, preservation checks and startup/authenticated smoke. Skills-aware
suggestions, cited evidence, grouped comparisons and affected-result erasure are
implemented. Independent content approval, live quality, broader timing/viewport
checks and hosted acceptance remain deferred, not inferred from local passes.
See [activation evidence](features/career-evidence-recommendations.md#normal-activation-completed-2026-11-05).

## Integrated career-evidence local release, 2026-11-04

Skills-aware recommendation context, source citations, owned erasure, grouped
comparisons and explicit replacements are implemented with passing isolated
acceptance. Normal activation awaits concrete review; independent content review,
live model quality and hosted acceptance remain pending. Broader viewport and
network-timing matrices were deferred under the owner's fast-track instruction.
See [current delivery evidence](features/career-evidence-recommendations.md#integrated-local-release-acceptance-2026-11-04).

## Career evidence selection helpers, 2026-11-04

Deterministic reported-skill facts and bounded career-specific retrieval now have
four focused passing tests. Runtime recommendation wiring remains pending the
mutation/erasure implementation; this does not complete the local-release feature.
See [delivery evidence](features/career-evidence-recommendations.md#deterministic-recommendation-evidence-helpers-2026-11-04).

## Paginated evidence API source, 2026-11-04

The twelve-career integration now includes an authenticated typed evidence reader
and synchronized generated contracts. Focused reader checks and isolated PostgreSQL
pagination queries passed. Normal publication, skills-aware suggestions, erasure and
comparison UI remain pending; see [current evidence](features/career-evidence-recommendations.md#paginated-evidence-api-implementation-2026-11-04).

## Local-test career integration preparation, 2026-11-04

The owner selected a usable twelve-career local release, including skills-only
exploration, and the self-identified technical reviewer approved the plan in chat.
The hash-bound local-test eligibility overlay and immutable reference-storage SQL
proposal now have focused structural and isolated PostgreSQL evidence. Runtime
API/recommendation/privacy/UI integration remains unfinished; normal activation,
independent content approval and hosted acceptance remain pending. See the
[implementation evidence and remaining work](features/career-evidence-recommendations.md#local-test-integration-preparation-2026-11-04).





## Twelve-career agent review packet, 2026-11-04

The owner requested the bounded twelve-career evidence review. Codex prepared an
inactive policy-assisted review covering all inherited records, existing skills and
learning topics, preserving native scales and private rating identities. This is
agent-proposed scope/partial-coverage evidence, not independent expert approval.
Disputed ratings remain withheld and publication/inference flags remain false.
See [review method, results and limits](features/career-evidence-recommendations.md#twelve-career-policy-assisted-agent-review-2026-11-04).
Runtime recommendation integration and content-review assignment remain pending.

## Occupational originals verified, 2026-11-04

The owner supplied the original research files; all 20 match the recorded SHA-256
and byte sizes. This resolves the missing-originals issue for this packet, without
establishing independent semantic approval. Two original PDF ambiguities were
inspected and recorded conservatively. The packet remains inactive pending full
review and shared-contract approval. See
[source verification](features/career-evidence-recommendations.md#original-source-verification-2026-11-04).

## Full occupational evidence preparation, 2026-11-04

The owner requested the full twelve-career evidence/recommendation plan: full
applicable source profiles, grouped reference levels, interests plus experience,
one release activation, and erasure of obsolete skill-derived result payloads.
Codex prepared a durable inactive research packet and structural validator. No
semantic approval, source-original hash verification or recommendation integration
is claimed. Shared contract review and independent content approval remain pending;
existing local-test behavior is unchanged. See the
[implementation status](features/career-evidence-recommendations.md) and
[technical proposal](specs/career-evidence-integration.md).

## Owner-authorized local testing, 2026-11-04

After setup stopped on the new pending migration, the owner explicitly requested
applying it and implementing all required local activation so they could test.
The single competency migration and 120 Asgard-authored mappings are now installed
in the normal local environment, preserving all pre-existing private-table digests.
This is a local-test publication exception with independent content/code review
still pending; it does not approve hosted use or claim validated occupational
requirements. See [activation evidence](features/competency-comparison.md#normal-local-test-activation-2026-11-04).

## Docker verification follow-up, 2026-11-04

The resumed competency checks passed the isolated migration/private-state upgrade,
draft/repeat/conflict publication, 21 pinned-container unit/Auth integration cases,
and scoped Chrome persistence/comparison/removal/layout/focus checks. SQL policy
quoting, readback ordering and comparison-trigger contrast were corrected. Normal
migration/activation, real content approval and independent human review remain
pending. See [dated execution evidence](features/competency-comparison.md#resumed-docker-acceptance-2026-11-04).
This does not change final-MVP or hosted release gates.

## Implementation follow-up, 2026-11-04

The owner subsequently approved proceeding with the proposed migration/API scope
and selected Anti Slop during. Skill-profile/comparison source and generated clients
are now implemented. Independent review, database activation, content publication
and end-to-end acceptance remain pending; earlier preparation-only status below is
historical. See [implementation evidence and limitations](features/competency-comparison.md).
No final-MVP release gate is marked complete by this update.


## Current increment update, 2026-11-04

The owner requested implementation of the bounded manual skill-profile/comparison
increment within FUT-01. Preparation is in progress; application implementation,
technical review and content publication are pending. Source is Asgard-authored;
The owner removed the ESCO deferral on 2026-11-05. The approved scope covers offline import, a reference catalog, and reviewed recommendation evidence. Broader occupational-gap claims remain deferred. See the [scope resolution](decisions.md#esco-integration-scope-resolution-2026-11-05) and [implementation status](features/esco-reference-catalog.md).
Hosting and additional account controls remain outside this increment; their
final-MVP/external-use requirements are not waived. See the
[decision record](decisions.md#skill-comparison-delivery-resolution-2026-11-04),
[session history](plans/competency-comparison-2026-11-04.md) and
[implementation guide](features/competency-comparison.md). Older all-entries-deferred
statements below are historical for this bounded portion of FUT-01 only.


Resource update, 2026-11-02: release 4 now supplies topic-specific resources for
all 288 topics (238 distinct checked destinations), superseding the generic-link
limitation of release 3. Independent subject-matter review, periodic link upkeep
and authenticated browser acceptance remain follow-up work. See
[evidence and limits](features/roadmap-content-expansion.md).

Local roadmap update, 2026-11-02: the owner requested import of v4 as supplied
and waived resource verification. Release 3 is locally published with 12 roadmaps;
the three short paths are retired with their history retained. This supersedes
three-path-only local inventory status. Resource relevance, curriculum quality,
independent acceptance and browser checks remain follow-up work. See
[roadmap content expansion](features/roadmap-content-expansion.md) for evidence.
This local import grants no hosted publication or Git approval.

Updated: 2026-10-29. Maintainer: project owner; implementation contributions: Codex.
This backlog records intent, not approval. Product, architecture and decisions remain authoritative.
Future tasks must update the affected entry's status, date, decisions and evidence.

The [post-MVP roadmap](post-mvp-roadmap.md) records the owner's 2026-10-29 request
for a repository-specific planning document. It separates proposed features into
bounded work packages, dependencies and review gates. This is a planning addition;
the entries below remain deferred and no feature implementation is approved by
the roadmap. Its PM-Fxx/PM-Wxx references do not replace existing requirement IDs.
The [first implementation proposal](post-mvp-first-implementation.md) provides
the detailed foundation sequence, feasibility review and proposed acceptance gates.

All entries below are deferred from the current local handoff by the owner's task
of 2026-10-28. Owner/reviewer are unassigned unless explicitly recorded later.

| ID | User outcome | Dependencies/modules and open decisions | Acceptance outline |
|---|---|---|---|
| FUT-01 | Understand evidence-based skill gaps | Reviewed skill taxonomy, role requirements, assessment and provenance; decide validity and correction model | Unknown stays unknown; document statements and Done never imply proficiency |
| FUT-02 | Compare careers and save alternatives | Catalog, preferences; decide criteria and shortlist lifecycle | Saved comparisons preserve focus/progress and explain sources |
| FUT-03 | Reflect after trying a learning activity | Discovery/recommendations; decide questions and interpretation | Optional feedback persists without inferred ability |
| FUT-04 | Ask conversational guidance questions | Provider, privacy, history; decide tutoring and advice boundaries | Grounded responses, validated links, failure recovery |
| FUT-05 | Receive deeper adaptive Discovery | [Guided Discovery v2](features/guided-discovery-v2.md) published locally 2026-11-09. Deterministic first results are automatic; [optional AI refinement](plans/discovery-ai-refinement.md) awaits W01 review | Resume, retakes and inactive answers remain coherent |
| FUT-06 | Start at a suitable learning point | Evidence and authored prerequisites; decide admissible evidence | No automatic completion or unsupported competence claims |
| FUT-07 | Explore broader curricula | Content publication and review capacity | Stable IDs, genuine resource provenance and retained progress |
| FUT-08 | Understand labor-market context | Licensed regional data, freshness and provenance policy | Dated sourced claims; no fabricated demand or salaries |
| FUT-09 | Analyze scans and other document formats | OCR/parser isolation and privacy review | Bounded resources and equivalent removal lifecycle |
| FUT-10 | Manage profile photos | [Active locally](features/local-profile-photo.md) with private storage and image re-encoding | Hosted rollout and unattended cleanup remain future work |
| FUT-11 | Recover accounts and use Google/MFA | Auth provider capability gates AUTH-C1/C2 | Provider-boundary security checks and usable recovery |
| FUT-12 | Use a hosted production service | SMTP, backups/restore, scheduler, deletion, provider gates and operator | Recorded operations/security/release acceptance |
| FUT-13 | Upload and analyze selectable-text PDFs | Folded into W03 Profile on 2026-11-06; existing document service and provider/privacy decisions | Verify user confirmation, privacy, extraction, replacement, removal and cleanup before activation |

## W07 personal learning guidance, 2026-11-05

PM-W07 persistence and API are active locally for FUT-03 and FUT-06, and the
signed-in API journey passed. The owner has directed that its added UI be removed
from Roadmap and Dashboard for now; preserve the API and data dormant. The UI
cleanup is implemented in source and manual acceptance is pending.
[Implementation guide](features/learning-guidance-and-reflection.md)

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
