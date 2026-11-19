# Presentation accuracy review

- Reviewer/author: Codex.
- Date: 2026-11-19.
- Status: Documentation and selected source review completed; project-owner review and demonstration rehearsal pending.
- Scope: Check the presentation against current documentation and relevant source. Update presentation material only. No feature implementation, configuration changes, or application tests.
- Reviewed outputs: [Speaker-note version](system-presentation.md) and [bullets-only version](system-presentation-bullets.md).
- User direction: Preserve the title **Asgard: An AI Career Decision Support System** and keep slides understandable without specialist source names or engineering review details.

## Review boundaries

The documentation index, current product/architecture/decision/development records, page descriptions, user journeys, specifications, feature records and remaining-work register were used to resolve presentation claims. Feature-status references were searched across the feature documentation. Relevant newer entries were inspected for skills, resumes, matching, Discovery, comparison, Counselor, progress and hosted status. This was a presentation-claim review, not a line-by-line certification of every document or a fresh acceptance test.

The [archive](../archive/README.md) and [research index](../research/README.md) identify historical and proposed material. Earlier plans, fixed catalog counts, research drafts, fixtures and old test results were not treated as current feature acceptance. Member-testing assignments were checked as planned verification, not completed user evaluation.

## Findings and corrections

| Presentation subject | Finding and treatment | Evidence |
| --- | --- | --- |
| Title and goal | Owner supplied the original AI decision-support title. Keep the focus on exploring, comparing and choosing careers; roadmaps support the next step. | [Project overview](../../README.md), [product](../product.md), owner request in this chat |
| Audience | Intended audience is adults aged 18 and above across experience levels; students are an initial evaluation focus. State the age boundary across the scope. | [Product](../product.md) |
| Account access | Both guided Discovery and direct browsing require sign-in. Browse skips Discovery. Keep sign-in before either option in the demo. | [Journeys](../user-journeys.md), [router](../../frontend/src/app/router.tsx) |
| Discovery | Current first suggestions use rules and published careers, with direct and related options. Do not present all suggestions as AI-generated. | [Discovery](../specs/discovery.md), [recommendations](../specs/career-recommendations.md), [service](../../backend/app/modules/recommendations/service.py) |
| AI guidance | Counselor and career explanations use configured AI services. Responses do not automatically choose a roadmap or change progress. Keep claims about usefulness distinct from measured accuracy. | [Counselor](../features/contextual-counselor-profile.md), [AI guidance](../features/ai-guidance.md), [implementation](../development.md#current-implementation) |
| Profile and resume | Previous slides omitted a current capability. Add optional readable-text PDF analysis and profile skills. Saved extracted background and manually confirmed experience ratings are distinct. | [PDF guide](../features/pdf-reading.md), [document controls](../../frontend/src/features/profile/documents.tsx) |
| Career skill matches | Add the current matching feature. It shows matched/unknown/missing records based on saved skills or resume mentions. Counts do not certify ability or career suitability. Learning-path and sample-based views are separate; recorded hosted sample setup/acceptance remains pending. | [Skill specification](../specs/competency-comparison.md), [implementation](../features/competency-comparison.md), [page](../../frontend/src/features/skill-matching/page.tsx), [matcher](../../backend/app/modules/skill_matching/matcher.py) |
| Career comparison | Two-career exploration is present. Do not confuse it with the disabled roadmap experience-comparison dialog. | [Pages](../pages-and-interactions.md), [comparison guide](../features/career-comparison-and-shortlist.md) |
| Roadmaps and progress | Curated roadmaps, explicit focus, reported topic states, milestone progress, activity and streaks are present. Progress is not mastery. | [Journeys](../user-journeys.md), [roadmap](../../frontend/src/features/roadmaps/page.tsx), [Dashboard](../../frontend/src/screens/DashboardScreen.tsx), [streaks](../features/learning-streaks.md) |
| Disabled/deferred features | Exclude dormant practice/reflection panels, disabled roadmap experience comparison, aptitude scoring, job-readiness guarantees and live vacancy matching. | [Remaining work](../future-development.md), [pages](../pages-and-interactions.md), [research boundary](../research/README.md) |
| Hosted readiness | Recorded content publication and service connectivity do not establish authenticated feature acceptance. Avoid production-ready claims and unnecessary catalog counts. | [Hosted audit](../features/supabase-hosted-audit.md), [activation](../features/hosted-feature-activation.md) |
| Verification | Existing records support selected behavior only. New member-testing files are assignments with results pending. Simplify the slides without implying full testing or proven decision improvement. | [Member testing](../member-testing/README.md), [Discovery evidence](../features/guided-discovery-v2.md), [development](../development.md) |
| Team, schedule and costs | Retain placeholders. Documentation and account names do not establish each presenter's contribution or actual project expenses. | Group information remains to be supplied by the owner |

## Checks and remaining work

Background follow-up, 2026-11-19: At the owner's request, both presentation versions now describe the next-step problem for beginners, career shifters, and experienced learners. The [general-audience draft](../research/asgard-general-audience-paper.md), especially Sections 1-3 and 6.4, supports connecting career direction, reported experience, and learning action. The [CS-student edition](../research/asgard-consolidated-paper.md) uses a narrower proposed study population. The [research index](../research/README.md) and [reconstruction review](../research/reconstruction-review.md) identify both as reconstructed proposals, not completed participant research. Only the problem framing was reused; dated feature inventories, source-integration proposals, and evaluation results were not promoted into current system claims. Slide bullets retain plain language and no research-method or source-name detail.

- Passed: Local Markdown file targets, the referenced current-implementation anchor, whitespace checks and slide-content consistency between both versions.
- Not run: Application tests, live provider requests, service startup and browser acceptance. This change edits presentation prose only and reuses dated evidence within its recorded limits.
- Pending: Fill team names, timeline and costs; choose screenshots; rehearse the actual sign-in, Discovery, comparison, Counselor, roadmap and progress flow.
- Optional skill-matching/resume demo: Confirm availability first and use synthetic resume content. A sample view that still needs setup should not be promised as a working live demonstration.
- Review owner: Project owner. No application behavior, shared contract, deferred scope or release status was changed; no feature implementation guide update is required.
