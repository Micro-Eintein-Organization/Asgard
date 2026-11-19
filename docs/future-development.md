# Future development and remaining acceptance

Baseline: 2026-11-17. This is the remaining-work register, not implementation authorization. Requirements stay in their specifications. Status distinguishes implemented source, disabled presentation, pending activation, and unrun release checks. Historical sequencing and activation records are in the [archive](archive/2026-11-17/future-development.md).

## Feature status

SKILL-EVIDENCE-03 update, 2026-11-19 (owner-approved plan, Codex implementation):
FUT-01 now includes a locally implemented unified evidence count, applicable
Done-topic links and separate automatic supported-equivalence resume interpretation.
The additive migration, generated contracts and UI are prepared; human review,
authorized migration/deployment and live semantic/browser acceptance remain pending.
This does not reactivate roadmap experience-comparison UI or dormant W07 panels.
See [current handoff](features/competency-comparison.md).

| ID | Scope | Current disposition and next step |
| --- | --- | --- |
| FUT-01 | Skill evidence and comparisons | On 2026-11-19 YakisobaNissin approved separate Benchmark sample/Learning-path skills views and a separate technology vocabulary. Hosted read-only audit confirms 108 benchmark references, 120 mappings and 22 PH postings published alongside the 230 learning-path skills. Render configuration and app acceptance remain pending. Roadmap experience-comparison UI remains disabled. See [competencies](features/competency-comparison.md#benchmark-and-learning-path-views-2026-11-19) |
| FUT-02 | Compare careers and save alternatives | Implemented career-to-career comparison and saved alternatives; comprehension/content review remains pending. See [comparison guide](features/career-comparison-and-shortlist.md) |
| FUT-03 | Practice and reflection | W07 UI dormant; retain records/APIs pending an approved redesign |
| FUT-04 | Conversational guidance | Contextual Counselor source implemented; hosted answer-quality and privacy acceptance pending. See [Counselor](features/contextual-counselor-profile.md) |
| FUT-05 | Adaptive Discovery | v2 implemented; learner comprehension remains pending. Optional AI refinement remains proposed. See [Discovery](features/guided-discovery-v2.md) |
| FUT-06 | Suitable learning entry point | Authored next-topic guidance implemented; no inferred mastery or automatic completion. Further assessment/personal practice remains deferred |
| FUT-07 | Broader curricula | Publication and expansion implemented; new curricula still require editorial, resource, and licensing review |
| FUT-08 | Labor-market context | Optional future work; no selected demand/salary feed |
| FUT-09 | OCR and other document formats | Deferred; selectable-text PDF support does not authorize OCR or new parsers |
| FUT-10 | Profile photos | Source supports hosted activation; hosted acceptance and unattended cleanup remain pending |
| FUT-11 | Google/MFA/recovery | MFA/password-recovery source implemented. Owner/codeowner approved MFA-RECOVERY-01 and explicitly authorized activation before live/manual acceptance on 2026-11-19; the Render Blueprint is enabled. See [recovery guide](features/application-recovery-codes.md). Actual hosted activation and AUTH-C2 provider/session/notification evidence remain unverified. Google stays omitted; AUTH-C1 and public-abuse gates remain open. Reviewer/operator: @YakisobaNissin |
| FUT-12 | Production operations | Hosted performance, SMTP/public signup, backup/restore, monitoring, provider and release gates remain open |
| FUT-13 | PDF analysis and resume review | Hosted activation authorized 2026-11-16. On 2026-11-19, owner-requested Profile upload/Analyze PDF presentation connects existing extraction and displays saved background; configuration, privacy and lifecycle acceptance remain pending. See [PDF guide](features/pdf-reading.md) |

## Account deletion

Implemented source; activation remains off until its documented maintenance, migration, monitoring, ledger/restore, and disposable-account checks pass. Review/operator: project lead in CODEOWNERS. See [implementation guide](features/account-deletion.md).

## Release acceptance

Hosted Supabase audit, 2026-11-19: primary catalogs, migrations and PH benchmark
are present; the separate ESCO/occupational reference layers are missing in the
linked project. Portable restoration is prepared and locally verified, pending
hosted approval/application. JWT lifetime differs from the approved target and
database SSL enforcement is off; external backup/restore and some live provider
checks remain operator work. See the [audit](features/supabase-hosted-audit.md).

Use [Verification](verification.md), [hosted performance](features/hosted-content-performance.md), [hosted activation](features/hosted-feature-activation.md), and the [deployment runbook](deployment.md). None is marked passed merely because this baseline is consolidated. The restricted account-demo exception remains narrower than public signup or production operation.

## Updating this register

Record date, owner/reviewer, decision reference, implementation status, and evidence when promoting or deferring scope. Preserve stable FUT IDs. New dependencies, contracts, activation, or architecture changes require their existing review gates.

## Historical references

Earlier headings remain addressable for incoming links. Their linked records describe the dated work only; current policy and status are above.

<a id="account-deletion-implementation-2026-11-17"></a>

[Account deletion implementation, 2026-11-17](archive/2026-11-17/future-development.md#account-deletion-implementation-2026-11-17).

<a id="roadmap-experience-comparison-disabled-2026-11-16"></a>

[Roadmap experience comparison disabled, 2026-11-16](archive/2026-11-17/future-development.md#roadmap-experience-comparison-disabled-2026-11-16).

<a id="hosted-account-demo-2026-11-13"></a>

[Hosted account demo, 2026-11-13](archive/2026-11-17/future-development.md#hosted-account-demo-2026-11-13).

<a id="resume-review-follow-up-2026-11-06"></a>

[Resume review follow-up, 2026-11-06](archive/2026-11-17/future-development.md#resume-review-follow-up-2026-11-06).

<a id="w08-implementation-and-activation-follow-up-2026-11-06"></a>

[W08 implementation and activation follow-up, 2026-11-06](archive/2026-11-17/future-development.md#w08-implementation-and-activation-follow-up-2026-11-06).

<a id="w08-original-final-stage-direction-2026-11-06"></a>

[W08 original final-stage direction, 2026-11-06](archive/2026-11-17/future-development.md#w08-original-final-stage-direction-2026-11-06).

<a id="w09-optional-official-assessment-2026-11-06"></a>

[W09 optional official assessment, 2026-11-06](archive/2026-11-17/future-development.md#w09-optional-official-assessment-2026-11-06).

<a id="w11-optional-labor-market-observations-2026-11-06"></a>

[W11 optional labor-market observations, 2026-11-06](archive/2026-11-17/future-development.md#w11-optional-labor-market-observations-2026-11-06).

<a id="w12-practical-evidence-scope-2026-11-06"></a>

[W12 practical evidence scope, 2026-11-06](archive/2026-11-17/future-development.md#w12-practical-evidence-scope-2026-11-06).

<a id="w04-local-recommendation-activation-direction-2026-11-06"></a>

[W04 local recommendation activation direction, 2026-11-06](archive/2026-11-17/future-development.md#w04-local-recommendation-activation-direction-2026-11-06).

<a id="w03-resume-assisted-profile-scope-2026-11-06"></a>

[W03 resume-assisted Profile scope, 2026-11-06](archive/2026-11-17/future-development.md#w03-resume-assisted-profile-scope-2026-11-06).

<a id="occupational-reference-scope-2026-11-06"></a>

[Occupational reference scope, 2026-11-06](archive/2026-11-17/future-development.md#occupational-reference-scope-2026-11-06).

<a id="learner-journey-simplification-direction-2026-11-05"></a>

[Learner journey simplification direction, 2026-11-05](archive/2026-11-17/future-development.md#learner-journey-simplification-direction-2026-11-05).

<a id="beginner-exploration-update-2026-11-05"></a>

[Beginner exploration update, 2026-11-05](archive/2026-11-17/future-development.md#beginner-exploration-update-2026-11-05).

<a id="learner-exploration-and-career-comparison-2026-11-05"></a>

[Learner exploration and career comparison, 2026-11-05](archive/2026-11-17/future-development.md#learner-exploration-and-career-comparison-2026-11-05).

<a id="career-evidence-local-release-active-2026-11-05"></a>

[Career-evidence local release active, 2026-11-05](archive/2026-11-17/future-development.md#career-evidence-local-release-active-2026-11-05).

<a id="integrated-career-evidence-local-release-2026-11-04"></a>

[Integrated career-evidence local release, 2026-11-04](archive/2026-11-17/future-development.md#integrated-career-evidence-local-release-2026-11-04).

<a id="career-evidence-selection-helpers-2026-11-04"></a>

[Career evidence selection helpers, 2026-11-04](archive/2026-11-17/future-development.md#career-evidence-selection-helpers-2026-11-04).

<a id="paginated-evidence-api-source-2026-11-04"></a>

[Paginated evidence API source, 2026-11-04](archive/2026-11-17/future-development.md#paginated-evidence-api-source-2026-11-04).

<a id="local-test-career-integration-preparation-2026-11-04"></a>

[Local-test career integration preparation, 2026-11-04](archive/2026-11-17/future-development.md#local-test-career-integration-preparation-2026-11-04).

<a id="twelve-career-agent-review-packet-2026-11-04"></a>

[Twelve-career agent review packet, 2026-11-04](archive/2026-11-17/future-development.md#twelve-career-agent-review-packet-2026-11-04).

<a id="occupational-originals-verified-2026-11-04"></a>

[Occupational originals verified, 2026-11-04](archive/2026-11-17/future-development.md#occupational-originals-verified-2026-11-04).

<a id="full-occupational-evidence-preparation-2026-11-04"></a>

[Full occupational evidence preparation, 2026-11-04](archive/2026-11-17/future-development.md#full-occupational-evidence-preparation-2026-11-04).

<a id="owner-authorized-local-testing-2026-11-04"></a>

[Owner-authorized local testing, 2026-11-04](archive/2026-11-17/future-development.md#owner-authorized-local-testing-2026-11-04).

<a id="docker-verification-follow-up-2026-11-04"></a>

[Docker verification follow-up, 2026-11-04](archive/2026-11-17/future-development.md#docker-verification-follow-up-2026-11-04).

<a id="implementation-follow-up-2026-11-04"></a>

[Implementation follow-up, 2026-11-04](archive/2026-11-17/future-development.md#implementation-follow-up-2026-11-04).

<a id="current-increment-update-2026-11-04"></a>

[Current increment update, 2026-11-04](archive/2026-11-17/future-development.md#current-increment-update-2026-11-04).

<a id="w07-personal-learning-guidance-2026-11-05"></a>

[W07 personal learning guidance, 2026-11-05](archive/2026-11-17/future-development.md#w07-personal-learning-guidance-2026-11-05).

<a id="skill-evidence-extension-boundary"></a>

[Skill evidence extension boundary](archive/2026-11-17/future-development.md#skill-evidence-extension-boundary).

<a id="updating-entries"></a>

[Updating entries](archive/2026-11-17/future-development.md#updating-entries).

<a id="hosted-performance-acceptance-2026-11-15"></a>

[Hosted performance acceptance, 2026-11-15](archive/2026-11-17/future-development.md#hosted-performance-acceptance-2026-11-15).
