# Footer navigation, team portraits and Counselor presentation

Date: 2026-11-17. Implementer/task owner: Codex. Required reviewer:
@YakisobaNissin, as mapped in CODEOWNERS. The owner confirmed their identity and
approved the revised footer plan in chat before requesting implementation.
The subsequent Counselor screenshot request authorizes the bounded readability
and collapsed-source follow-up. Human implementation review remains pending.

Acceptance: FOOT-04 session-aware public information navigation, FOOT-05 six
owner-supplied portraits and corrected alphabetical credits, FOOT-06 professional
Terms wording, STAT-02 removal of demo terminology, COUN-UI-01 conversation
readability, COUN-UI-02 initially collapsed Sources disclosure. The owner request
supersedes the prior FOOT-03 visible draft label; no legal review is inferred.

Affected modules: frontend information/status pages, shell, Counselor, focused
tests, shared stylesheet, bundled team assets, and related documentation.
Dependencies: existing Auth context, router, components/tokens and supplied files.
No backend, schema, auth policy, wire-contract or dependency changes. Existing
feature branch codex/cabusao-ui-integration; no Git publication operations.

Checks: focused existing Vitest infrastructure, TypeScript, scoped ESLint,
documentation references and whitespace; footer asset bundling verified by build.
Manual review covers signed-in/out footer navigation, portraits, reflow and
Counselor disclosure/keyboard behavior. Per owner request, no extensive backend
or infrastructure tests. Evidence and limits belong to the implementation guides:
[footer](../features/footer-information-and-service-status.md) and
[Counselor](../features/contextual-counselor-profile.md).
