> Historical record archived 2026-11-17. Dated scope and test evidence are retained; use the [current documentation](../../../README.md). This record does not grant new activation, implementation, or publication authority.

# UI refinement and motion

Date: 2026-11-16. Owner: Codex. Required reviewer: @YakisobaNissin.
Status: bounded plan reviewed by the owner in chat; implementation authorized.

Owner-approved extension, 2026-11-16: branded 32/16 px snowflake loading feedback,
2.4 s rotation with 150 ms reveal delay, reduced-motion still image, existing save
feedback fades; disable roadmap experience comparison and its recommendation
links. Keep Profile skills and all persistence. Later owner screenshot feedback
also authorizes neutral Counselor composer focus, aligned 44 px send action and
automatic background page context without its visible switch/labels. Preserve
the provider disclosure and separate explicit web-search opt-in. Additional
checks cover loading lifecycle, legacy reviewSkills URLs and Counselor payload.

Scope: existing frontend controls, shared styles/primitives, shell content fade,
and Counselor presentation. Requirements: NFR-01–03; task acceptance is consistent
controls, reduced-motion support, interruptible motion and preserved layout/state.
Dependencies: existing React, Radix and CSS; no new packages or shared contracts.
Affected modules: frontend styles, UI primitives, optional profile setup, shell,
Counselor overlay and implementation/design documentation.

Implement shared 120/180/220 ms motion presets, restore missing Radix animations,
align native form controls with existing inputs, and retain all current page
compositions. Page entry fades only after content resolves, without remounting
forms or replaying for query/hash updates. Preserve existing task-collapse motion.

Checks: frontend typecheck/lint/build and affected existing tests; focused browser
inspection of menu/dialog entry/exit, focus return, rapid interaction, reduced
motion, form consistency and navigation. Desktop/zoom checks require separate
evidence if the browser viewport cannot be controlled. Backend/DB/Auth logic,
contracts, dependencies, Git commits and publication are outside this change.
