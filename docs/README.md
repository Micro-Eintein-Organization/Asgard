# Asgard documentation

Current editorial baseline: 2026-11-17. The project owner requested consolidation against the current application and retention of earlier records in an archive. This baseline is final for the present documentation scope; future behavior changes must update their owning documents. It does not mark unrun release gates passed or approve unresolved product/architecture decisions.

## Current guides

| Subject | Owning document |
| --- | --- |
| Repository overview | [README](../README.md) |
| Product requirements and stable REQ IDs | [Product](product.md) |
| Approved architecture and A-01–A-11 | [Architecture](architecture.md) |
| Current decisions and compatibility gates | [Decisions](decisions.md) |
| User flows | [Journeys](user-journeys.md) |
| Current page behavior | [Pages and interactions](pages-and-interactions.md) |
| UI components and tokens | [Design](design.md) |
| Local setup | [Getting started](getting-started.md) |
| Contracts, workflow, CI and evidence | [Development](development.md) |
| Publishing career/roadmap content | [Content authoring](content-authoring.md) |
| Hosted operation | [Deployment](deployment.md) |
| Restricted account demonstration | [Account-demo checklist](deployment-account-demo.md) |
| Security policy and operational controls | [Security and operations](security-and-operations.md) |
| Acceptance and release checks | [Verification](verification.md) |
| Remaining work and disabled capabilities | [Future development](future-development.md) |

## Feature specifications

[Discovery](specs/discovery.md) owns the versioned questionnaire and checkpoint behavior. [Recommendations](specs/career-recommendations.md) owns deterministic v2 first results and provider-backed evidence/refresh boundaries. [Competencies](specs/competency-comparison.md), [career comparison](specs/career-exploration-comparison.md), and [occupational evidence](specs/career-evidence-integration.md) retain their stable IDs and bounded increment contracts; later recorded decisions qualify their historical inventories and sequencing. Generated OpenAPI/TypeScript and versioned SQL remain wire/schema authority.

## Implementation records

The [feature directory](features/) contains dated implementation and verification records. Sections are evidence for their recorded code/environment, not blanket approval or production certification. Use the current guides above for behavior; preserve original test dates and limitations.

Current cross-cutting records include [Discovery v2](features/guided-discovery-v2.md), [Counselor/profile context](features/contextual-counselor-profile.md), [hosted feature activation](features/hosted-feature-activation.md), [performance](features/hosted-content-performance.md), [account deletion](features/account-deletion.md), [MFA](features/optional-two-factor-authentication.md), [streaks](features/learning-streaks.md), and [footer/status](features/footer-information-and-service-status.md).

Roadmap experience comparison is disabled; W07 practice/reflection presentation is dormant. Profile skills and two-career comparison remain separate. Optional integrations depend on explicit environment configuration. Pending hosted timing, content/privacy/model review, mail/MFA compatibility, monitoring/restore, and browser/accessibility acceptance stay open unless their records explicitly report completion.

## Historical material

The [archive](archive/README.md) retains superseded decision registers, plans, scaffold handoffs, UI integration records, and earlier specification snapshots. Old paths retain forwarding links/anchors so existing reviews remain navigable. Historical inventories, setup proposals, and approval quotes do not authorize current operations.

[Research](research/README.md) is supporting analysis, not product authority. [Static design exports](design/figma/) and the [historical frontend reference](design/ui-reference/README.md) are presentation/provenance sources, not runtime acceptance. The reference snapshot and third-party licenses are preserved.

## Maintenance and review

Use each document for the subject it owns. Update the owning guide and relevant feature record when behavior changes; do not prepend competing decision journals. Record significant policy changes in Decisions with date, approver, scope, and reference. Keep personal credentials, workstation paths, and contact details out of public docs. CODEOWNERS remains the account mapping for review.

See the [consolidation record](documentation-baseline.md) for this pass's scope, verification, and remaining limits.
