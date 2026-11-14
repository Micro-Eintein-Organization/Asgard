# Deterministic first results for Guided Discovery

## Related careers and clarification, 2026-11-09

The owner requested that a strong result include related alternatives and
that extra questions appear only when they could resolve uncertainty. Codex
owns the work. Reviewer: `@YakisobaNissin`. Scope: F-001-AC-02/05/06 and
F-002 evidence and catalog checks. Keep direct activity suggestions first,
then add up to two distinct published alternatives using documented shared
work in the [career guides](../../backend/app/content/guide_v4/). Give each
alternative its own reason grounded in the source activity. Never fill with
an unrelated career. Preserve broad results when there is no direct match.
Advance the approved rules provenance version so existing Results refresh
automatically. Keep the questionnaire and saved answer meaning unchanged.
The existing follow-up only appears for an unresolved pair of selected
activities. Adding an alternative does not trigger a question. The pending
[AI refinement](discovery-ai-refinement.md) follows the same principle.
Affected modules: private Discovery rules and focused local acceptance.
Check all 23 mappings, priority, published eligibility, reason evidence,
automatic refresh and the existing conditional route.

## Automatic Results follow-up, 2026-11-09

Owner request: make v2 suggestion preparation and transient recovery automatic.
Owner: Codex. Reviewer: `@YakisobaNissin`. Scope: Results handoff, the existing
request controller, and focused checks for F-001-AC-08 and F-002 recovery.
Prepare missing or outdated v2 results when Results opens, even without a
navigation trigger. Reuse matching results, bound retries, and keep the
existing layout and browse and retake paths. API, storage, v1 and optional AI
behavior are outside this change. See the [owner decision](../decisions.md#w05-guided-discovery-revision-scope-2026-11-09).

Prepared by Codex on 2026-11-09 for PM-W05 / FUT-05. The owner asked to rebuild after discussing immediate results from saved answers, optional AI follow-ups, and a possible text box. Scope for this increment is the deterministic first result. Owner: Codex. W01 reviewer: `@YakisobaNissin`, per [CODEOWNERS](../../.github/CODEOWNERS). The owner approved this saved-results design on 2026-11-09. See [architecture review requirements](../architecture.md#11-team-and-ai-agent-guardrails), [F-001](../specs/discovery.md), [F-002](../specs/career-recommendations.md) and the [implementation guide](../features/guided-discovery-v2.md).

## Selection rules for review

Use the active answers from the latest completed Discovery v2 session. A substantive follow-up puts its chosen activity first. For the rest, take one activity per selected field in the saved route order before taking a second from either field. Within a question, use its authored option order. Deduplicate by career, discard unpublished or retired destinations, and return up to three. Use the first published roadmap in the catalog's existing ordering for that career. An exact answer supports a short explanation such as “You chose to build games. This roadmap introduces game development.”

Use the mapping below with the current catalog slugs, cross-checked against the [published guide sources](../../backend/app/content/guide_v4/) and the existing [activity review](discovery-v2.md#content-and-route-review). General activity choices use the same activity keys. These are concrete activity relationships. The learner sees reasons and roadmap links.

| Field | Activity key → career slug in authored order |
| --- | --- |
| Build | `web` → `frontend`, `backend` → `backend-developer`, `full_stack` → `full-stack-developer`, `mobile` → `mobile-developer`, `games` → `game-developer`, `ai_features` → `ai-engineer` |
| Data | `analyze` → `data-analyst`, `dashboards` → `bi-analyst`, `pipelines` → `data-engineer`, `statistics` → `data-scientist`, `train_models` → `machine-learning-engineer` |
| Design | `layouts` → `ui-designer`, `research` → `ux-designer` |
| Security | `test_security` → `penetration-tester`, `respond` → `cybersecurity-analyst`, `cloud_security` → `cloud-security-engineer` |
| Infrastructure | `networks` → `network-engineer`, `servers` → `system-administrator`, `cloud` → `cloud-engineer`, `releases` → `devops-engineer` |
| Devices | `circuits` → `hardware-engineer`, `embedded` → `embedded-systems-developer`, `linux` → `linux-systems-engineer` |

When no selected activity resolves to a published roadmap, use one representative published role per selected field. In order, the defaults are Frontend Developer, Data Analyst, UI Designer, Cybersecurity Analyst, Network Engineer and Hardware Engineer. If a default is unavailable, use the first eligible career in that field's authored activity order. When all interests and activities are uncertain, use the first three available representatives from distinct fields in the same order. Label those cards broad examples for exploration. If none are eligible, keep the existing catalog-availability and Browse careers path. When specific suggestions exist, fill open slots only with reviewed related alternatives. Goal and the experience preference continue to affect copy and actions. Learning progress, skill reports, and resume text supply no ranking input.

## Shared behavior requiring W01 review

- Use the existing authenticated recommendation operations, result shape, account locks, candidate and evidence validation, and published-roadmap checks. Resolve catalog slugs privately on the backend. For completed v2, create and complete a deterministic run in the same transaction, with `model_id = null` and the versioned strategy in the existing provenance fields. No new SQL tables, grants, migrations, dependencies, or public API fields are proposed.
- Use the existing Discovery-only snapshot shape for this strategy, with active Discovery facts and the completed session reference. The current occupational snapshot trigger requires all saved skill facts when that snapshot type is used. Using the Discovery-only shape intentionally keeps unrelated skill records and document references out of these runs. The rule result must reuse when the completed Discovery revision, catalog release, and rule version match. The write still checks the current account revision and catalog under lock. Later skill, document, or learning changes should not make a rule result stale on their own. Keep current snapshot/erasure and stale-result behavior for existing AI runs. Review how strategy-aware freshness and idempotency will use the existing fields before coding.
- Enable v2 generation even with Groq off or in cooldown. A deterministic run calls no model and reserves no provider attempt. Continue existing v1 and no-Discovery behavior. Keep prior results under **View previous suggestions**. Reuse the compact Results cards, retake, roadmap links, and skill comparison. Use a fresh request key for the new strategy so an old Groq run cannot satisfy the initial v2 request.
- Keep AI refinement separate for a later increment. The next design can review a short optional question or a text box after Results that turns text into editable preferences with explicit confirmation. Existing Results must remain usable when that service is unavailable.

## Acceptance and implementation boundary

- Review all 23 activity destinations, and example outputs for a clear Game Developer choice, an AI Engineer / Machine Learning Engineer follow-up, two fields with unequal selections, all-uncertain answers, a retired destination, and an edited branch.
- After technical approval, verify identical outputs and idempotent persistence, v2 completion with Groq off and no attempt recorded, isolation, stale writes and catalog retirement, v1/legacy compatibility, and preservation of prior runs. Check that a skill or document deletion cannot expose erased AI results and does not make a Discovery-only result read private information.
- Verify local Results at desktop and phone widths. Confirm initial deterministic suggestions appear immediately, the reason and correct roadmap match the selected activity, and retake and skill comparison preserve learning focus and progress. Record results in the [implementation guide](../features/guided-discovery-v2.md).
- Scope touches the recommendation service, private rule definition, Results handoff, and focused checks. The active branch is `codex/cabusao-ui-integration`. Preserve the existing work in these files and the unrelated Counselor, Progress, and resume work.
