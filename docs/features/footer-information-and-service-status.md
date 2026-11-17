# Footer information and service status

Implementer: Codex. Created: 2026-11-17. Last updated: 2026-11-17.
Status: implemented; focused automated checks passed; partial browser verification
completed. Human presentation/content review and final Terms approval pending.
Required reviewer and follow-up owner: @YakisobaNissin.

The owner approved the [bounded plan](../plans/footer-information-and-service-status.md)
in chat on 2026-11-16 (“approved. implement end to end”), then confirmed the
useful status overview. Acceptance IDs: FOOT-01–03 and STAT-01 from that plan;
related NFR-01/02 in [Product](../product.md), the [design system](../design.md),
and A-09/free-tier limits in [Architecture](../architecture.md). This is frontend
presentation using existing contracts, not a new availability commitment.

## Implemented behavior and files

- `frontend/src/app/information.tsx`: shared footer links and public `/licenses`,
  `/credits`, `/terms` pages. Licenses reproduces the retained shadcn MIT notice
  directly and links existing ESCO/O*NET reuse notices. Credits identifies the
  recorded project lead, Cabusao integration, software and source organizations.
  Notices are explicitly a selected inventory, not a new Asgard license grant.
- Terms is visibly labeled Draft for review and describes documented service
  purpose and limitations. No jurisdiction, effective legal agreement, consent
  enforcement, operator contact or final legal approval is invented.
- `frontend/src/lib/routes.ts`, `frontend/src/app/router.tsx`: centralized public
  routes outside authentication protection. `frontend/src/app/shell.tsx` retains
  the black footer and focused-onboarding exclusions, with wrapping labeled links.
- `frontend/src/app/status.tsx`: existing health/readiness requests and query keys;
  response-field validation; checking, success, partial/total failure and refresh
  states; manual retry disabled while fetching. A failed refresh cannot display
  stale success. No polling, automatic retry or new API contract is added.
- Status shows Application API and Data service results, browser-local last-check
  time, startup guidance and connectivity limits. It does not report historical
  uptime or claim to check sign-in, email delivery, AI answers or every feature.
- `frontend/src/styles.css`: task-scoped reading widths, information sections,
  wrapping footer and labeled status presentation using existing tokens. No new
  assets, fonts, dependencies, backend, database or authentication changes.
- Tests: `frontend/src/app/status.test.tsx` and
  `frontend/src/app/information.test.tsx`.

Existing MFA, Settings, account-deletion, hosting and shared-stylesheet edits
were preserved. Work stays on `codex/cabusao-ui-integration`; no commits, branch
changes, push or deployment. Unrelated working-tree changes are outside this task.
No deferred-feature scope changed, so no future-development update was needed.

## Verification

Passed during implementation, 2026-11-16:

- `npm run typecheck` from `frontend/`.
- Scoped ESLint with zero warnings for information/status source and tests,
  shell, router and routes.
- `npm test -- src/app/status.test.tsx src/app/information.test.tsx`: 10 passed.
  Covers public footer navigation, retained license, draft label, initial pending,
  success, partial/total failure, explicit retry/recovery, response-field checks
  and stale-success rejection after failed refresh.
- Local browser: observed Service is up, both checks Operational and a timestamp
  at `http://127.0.0.1:5173/status`. Clicking Check again showed pending feedback
  and disabled retry. Visually inspected the status page at the default viewport.
- Opened all three information pages through the footer; route headings received
  focus. Enter expanded the license disclosure and exposed the retained MIT text.
- Inspected Terms at a 320 px viewport override. Document client width and scroll
  width were both 305 px (scrollbar accounts for remaining width): no horizontal
  overflow on that page.

Passed 2026-11-17: `npm run build` (TypeScript plus Vite production output),
task-scoped `git diff --check`, and nine local documentation links/anchors plus
acceptance-ID, design-reference and new-document whitespace checks.

Pending: narrow footer/status/expanded-license rendering, full keyboard traversal,
real browser zoom and other browser engines. On resumption the preview connection
was refused; starting only the frontend with existing `npm run dev` succeeded,
but the in-app browser timed out. No infrastructure or security configuration was
changed to bypass this environment blocker. Earlier browser evidence is limited
to the listed paths. Controlled browser outage/recovery remains pending; focused
tests cover those failure states.

Foundation backend/auth/security suites were not rerun because this task changes
none of those paths or contracts. Existing [foundation evidence](../development.md#current-foundation-status-and-evidence)
retains its recorded limits. Hosted acceptance and uptime measurement are outside
this feature. Final legal wording and a full dependency license inventory remain
owner review work; no legal review or full license audit is claimed.

## Guided manual review

1. With the normal documented local environment running, open
   `http://127.0.0.1:5173/dashboard` signed in. Follow each black-footer link;
   expect the matching public page and heading focus. Repeat signed out at
   `http://127.0.0.1:5173/licenses`, `/credits`, `/terms` and `/status`.
2. On Licenses, Tab to the MIT disclosure and press Enter; expect the full notice.
   Activate again to collapse. On Terms, expect the visible draft label.
3. On status, expect actual connectivity results and time. Click Check again;
   expect pending feedback, disabled retry, then updated results. Failed checks
   must never leave Service is up visible as the current result.
4. Inspect the footer, status rows and expanded license at a narrow viewport and
   browser zoom. Expect wrapping, readable content and no horizontal overflow.
   Tab/Shift+Tab and Enter must retain visible focus and working navigation.
5. Confirm Welcome/Discovery/Results/profile setup still omit the global footer.
   Review and approve final Terms wording before external use.

Report failures with route, viewport/zoom, steps, observed and expected behavior.

## Design delivery assessment

PASS: existing ENERGY 1 / RHYTHM 2 / MOTION 1 direction retained with supplied
branding, existing type and black footer; no generated assets or new motion.

PASS: status surfaces and check/warning/refresh icons communicate current state
and next action. Information pages use readable text sections; monospace is
confined to verbatim license text. Status color always has a readable label.

PASS: real state and working local destinations are backed by 10 tests and
browser navigation; no invented uptime, people, security claims or fake metrics.

PASS: runtime, build, TypeScript and scoped lint succeeded. Verified Terms reflow
and keyboard disclosure are recorded above; remaining visual/accessibility
acceptance stays explicitly pending and is not represented as completed.
