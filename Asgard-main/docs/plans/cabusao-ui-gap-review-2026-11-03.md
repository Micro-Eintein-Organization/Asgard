# Cabusao UI gap review

Created/updated: 2026-11-03. Reviewer/implementer: Codex. Required human reviewer:
@YakisobaNissin. Status: renewed source review complete; the scoped findings below
were subsequently implemented by Codex. Human reference/current visual acceptance
remains pending. The findings preserve the state at review time.

## Evidence and boundaries

The owner requested another review because visible parts were missing. Reference:
`origin/Cabusao-Changes` at `74015f31e6146ce60844680a8d6741aa130a8b40`.
`git ls-remote` confirmed the remote hash on 2026-11-03 without fetching or changing
branches. Compared against the working tree on `codex/cabusao-ui-integration`,
including its existing uncommitted corrections. Reviewed actual active screen
mapping, reference/current JSX, shared primitives, stylesheet differences and
public API field availability. Reference feature pages are not the active screen
implementation in the current tree; several are re-export adapters.

The corrected catalog was exercised in authenticated Chrome at 1280/1440/1920
and 320 CSS widths. This is not a claim that every reference/current screen has
been rendered side by side. Earlier passing tests and shared stylesheet reuse
did not establish complete visual fidelity. Owning requirements, architectural
boundaries, account-backed state and recorded product resolutions still apply.

## Findings at review time

| Priority | Area | Concrete gap and required correction boundary |
| --- | --- | --- |
| P2 | Settings composition | The active SettingsScreen still uses the older custom form, emoji avatar/security rows and settings-main wrapper rather than Cabusao's SettingsLayout/settings-content, shared Card/settings-card sections and ProfileDetailsCard. Personal details/photo placeholder, saved-suggestions card and separate sign-in/authenticator/deletion cards are not faithfully reproduced. Restore presentation around existing profile/preferences/document guards; do not enable unavailable photo, OAuth, MFA or deletion operations. |
| P2 | Roadmap milestone/topic composition | The active Accordion omits the reference milestone-list class. Topic rows omit the reference StatusBadge wrapper, and the topic panel omits the milestone breadcrumb/status badge and labeled Completion section. The empty panel's Eye/Take a closer look composition is also absent. These are presentation omissions that can reuse current data and versioned progress commands. Preserve branch/retired-history handling, scrolling, hide/reveal focus and explicit focus saving. |
| P2 | Results context and navigation | Saved cards omit Cabusao's category eyebrow although career category_id exists. The reference Back to Discovery and Retake Discovery controls are not reproduced; current Return goes to Dashboard. Retake is intentionally a new blank saved draft from Settings, so restoring a navigation shortcut must keep that policy and must not copy the reference navigation-state draft. The reference Set as Career merely navigates; current View selected roadmap is the honest label and must not become an implicit focus save. |
| P2 | Dashboard milestone shortcut | The reference has a separate View milestone link beside Your learning topics; current Dashboard uses View roadmap with the next-topic URL. Keep Continue learning's topic destination, but a separate milestone shortcut needs its intended landmark/target restored. The card/calendar/accordion composition is otherwise substantially present. |

Settings is the largest remaining structural mismatch. Merely applying its layout
class names is insufficient. The earlier guide's statement about reference
Settings classes must not be read as completed component fidelity.

## Data/policy differences that are not missing working features

- Cabusao's longest-streak statistic has no current activity API field. The
  single month response is insufficient to infer a lifetime maximum. Do not show
  a fixture value or invent a number; any contract addition needs owner review.
- Cabusao topic panels have separate Learning outcome and Tools and setup fields,
  and the career overview has an Example project. The current Topic contract has
  explanation/resources, and Career has description/responsibilities/skills;
  those separate fields do not exist. They need an approved content/interface
  decision before being presented as authored structured data. Generic sample
  browser/editor instructions would be wrong for many of the 12 live careers.
- Retake drafts, current-roadmap saving, Career destination dropdown, account
  scoping, learning/progress semantics and provider evidence/recovery are the
  current connected application's behavior. Preserve them while restoring UI.
- Landing retains the path-preview composition but replaces the reference's
  fixture Frontend topics/status badges with truthful entry steps and session
  restoration. Optional profile setup is newer than Cabusao's route set. The
  supplied onboarding logo/shell is an owner-directed addition.
- Shared Card and shared presentation helpers match the reference. Button differs
  in the darker approved hover blue; Progress additionally forwards its value for
  accessibility. The core stylesheet is substantially Cabusao's with scoped newer
  behavior. The remaining gaps are primarily JSX/data composition, not wholesale
  absence of the stylesheet.

## Catalog corrections completed in this review

The owner explicitly requested shorter cards and a repaired sidebar. The active
catalog now shows the first general sentence, at most three skills and remaining
count, with unchanged API data/search and direct roadmap action. Separate numeric
and label columns repair the old count-selector/nowrap interaction. See
[implementation and evidence](../features/career-catalog.md#compact-cards-and-sidebar-correction-2026-11-03).

## Resolution, 2026-11-03

The owner approved implementing the agreed Cabusao UI after this review. Codex
recorded the [completion plan](cabusao-ui-completion-2026-11-03.md) and implemented
the four scoped presentation corrections. The
[feature guide](../features/cabusao-ui-integration.md#agreed-ui-completion-2026-11-03)
records source, 27 passing focused tests, build/lint, authenticated local Chrome
checks, inspected screenshots and remaining manual/human acceptance.

The initial field-availability finding above needs this clarification: separate
Topic outcome/setup fields do not exist, but the published explanation already
contains authored labels from `backend/scripts/convert_guide_v4.py`. The UI now
formats those existing sections and published Representative work text without
new data/contracts. Legacy free-form content retains an honest fallback. Lifetime
longest streak still cannot be derived and is shown as unavailable.

## Review handoff

Required reviewer: @YakisobaNissin. Implementation owner: Codex. Completed human
review has not been recorded.
No new authentication capabilities, contracts, migrations, fabricated values or
fixture-backed runtime state are authorized by this review. Reference/current
screenshots in equivalent real-account states are still required before declaring
the entire integration visually accepted. No Git commits, pushes or merges made.
