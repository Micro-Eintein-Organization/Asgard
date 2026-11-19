# Asgard: Security and operations baseline

Documentation baseline: 2026-11-17. The controls below remain policy. Implemented optional photo/document processing, MFA source, and deletion maintenance do not establish active hosted configuration. Use [hosted activation](features/hosted-feature-activation.md), [MFA](features/optional-two-factor-authentication.md), and [account deletion](features/account-deletion.md) for current implementation and activation requirements. Unverified provider/backup/restore gates remain open.


Implementation update, 2026-11-17: the owner-approved account deletion source and
maintenance workflow are implemented behind a disabled backend gate. See the
[implementation guide](features/account-deletion.md) for activation order and
verification limits. This records implementation status; it does not establish
hosted scheduler, independent alerts, backup/restore or purge acceptance.

25 October 2026. Documentation decisions delegated by the project owner. These are required controls and starting operating limits, not deployed settings, measured capacity, or a security certification. Preserve the foundation in [architecture](architecture.md). Schema, endpoint, and privileged-operation implementations still require technical review under AGENTS.md.

The eight-character password minimum is recorded in [Decisions](decisions.md#password-minimum-resolution). Core authorization and lifecycle services now exist; feature guides own their dated checks. Hosted protection, active maintenance, independent monitoring, and final security acceptance remain separate evidence gates.

## Public entry points and abuse

Password recovery must work before sign-in. Protect its public endpoint rather than requiring an authenticated session. Asgard has three separate internet boundaries: the Vercel frontend, the Render API, and Supabase Auth/Storage. A frontend firewall, hidden button, CORS policy, or browser cooldown cannot protect the other origins from direct requests.

Use provider edge protection at each hosted origin, Supabase Auth's server-enforced rate limits and CAPTCHA, and backend quotas for application work. Render documents automatic DDoS protection; Vercel describes protection for its own network. Neither statement establishes protection of another provider's origin or a guarantee that application abuse is prevented. [Render](https://render.com/docs/ddos-protection), [Vercel](https://vercel.com/docs/vercel-firewall/ddos-mitigation).

Enable Cloudflare Turnstile through Supabase Auth for supported signup, password sign-in, and reset flows. Missing, expired, and replayed challenge tokens must fail at the receiving service, including direct API requests. Challenge failure offers retry and an accessible explanation. Do not automatically retry email sends. Supabase supports Turnstile and auth rate limits; record actual project settings before release. [CAPTCHA](https://supabase.com/docs/guides/auth/auth-captcha), [Auth limits](https://supabase.com/docs/guides/auth/rate-limits).

### Starting limit policy

These numbers are Asgard's initial policy, not OWASP defaults. Use whichever applicable limit is stricter. Test shared-campus networks and tune through a recorded change, not an automatic relaxation during an attack.

| Operation | Initial policy | Enforcement |
| --- | --- | --- |
| Auth email requests, including recovery | At least 60 seconds between sends to the same destination; target at most 5/hour per destination; no account lock from reset requests | Configure provider-supported cooldowns/limits; prove destination-hour enforcement before claiming it exists |
| Signup/recover/resend group | Retain Supabase's documented IP baseline of 30 requests/5 minutes unless a stricter tested setting is adopted | Supabase, not just the SPA |
| Verification and password sign-in | Keep provider throttling; add progressive challenge behavior and generic errors; do not use permanent attacker-triggered account locks | Auth provider; validate actual configuration |
| API reads | 120/minute/account, burst 20; bounded catalog queries | Backend |
| API writes | 60/minute/account, burst 10; stricter limits below take precedence | Backend |
| Recommendation generation | 1 in flight/account, 1/minute and 10/day/account | Persisted quota reservation before provider call |
| PDF analysis | 1 in flight/account, 3/hour and 5/day/account | Persisted quota reservation and file limits |
| Application-wide external analysis | Initially 100 attempts/day across recommendations and PDF analysis, including retries, or lower remaining provider quota | Shared persisted budget, no automatic paid upgrade |

Supabase documents a per-user reset cooldown, not every destination-hour rule above. A control unsupported by hosted Auth is a compatibility gate, not something to simulate in the browser. A custom FastAPI reset endpoint is not needed by the approved direct Auth flow. Do not add a privileged proxy just to claim extra limits: it needs separate review, protected provider access, trusted client-IP forwarding, and proof that direct Auth cannot bypass the intended control.

Application quotas use a shared persistent counter/reservation design in PostgreSQL; in-memory counters may supplement them but cannot be the only defense across restarts/workers. The [Stage 4 migration](../supabase/migrations/20261026000100_shared_foundation.sql) supplies analysis-attempt and aggregate daily-budget storage; technical review and transactional quota enforcement remain unfinished. Storage alone does not enforce these limits. Reject over-budget expensive work before contacting a provider. If quota enforcement fails, fail closed for analysis while leaving independent reads/progress usable. Respond with 429 and Retry-After where the service owns that response. Bound request bodies, query length, concurrency, DB pools, and execution time. Do not allocate one task or log record per hostile request without limits. This follows resource-bounding guidance in [OWASP DoS prevention](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html).

Trust client addresses only from documented trusted proxies. Ignore user-supplied forwarding headers otherwise. IPs help identify traffic patterns; country alone is not evidence of abuse. Rotating IPs and many accounts require destination, account, and global limits as well.

## Account access and recovery

Owner-selected input bounds, 2026-11-19 (ACCOUNT-ACCESS-01): sign-in, registration and reset use the eight-Unicode-character minimum and provider-compatible 72 UTF-8 byte ceiling. Never truncate or trim passwords; multibyte characters reach that ceiling sooner. Auth emails are trimmed, format-checked and limited to 254 characters. Explicit duplicate-registration feedback is selected for supported provider duplicate responses; reset acknowledgments remain neutral. See [implementation evidence](features/account-access-fixes.md). Hosted receiving-service acceptance remains pending.

- Use Supabase for passwords, verification tokens, sessions, and TOTP; never build an alternative password store or custom TOTP verifier. The owner's 2026-11-19 [MFA-RECOVERY-01 ADR](adr/2026-11-19-application-recovery-codes.md) permits a narrowly scoped application-managed backup-code verifier for authenticator replacement, with the controls below.
- Require a minimum of 8 characters, selected by the project owner on 26 October 2026; support at least 64 characters, spaces, paste, autofill, and password managers. The minimum is an Asgard product decision, not a claim of standards conformance. Active Supabase config and frontend validation already use 8; verify hosted receiving-service enforcement separately. Do not require arbitrary upper/lower/digit/symbol mixtures or routine password expiration. Configure server-side policy, not just client validation. Block common/compromised passwords where supported. Supabase's leaked-password check is plan-dependent; do not claim it exists on Free. Review an upgrade or provider-supported control before unrestricted public registration. [Supabase password controls](https://supabase.com/docs/guides/auth/password-security).
- Registration uses a provider-issued six-digit email code, explicit Verify, a target 10-minute expiry, and a 60-second resend cooldown. Reset uses a provider-issued single-use HTTPS link, target 15-minute expiry, and an allowlisted callback. Verify that the hosted provider can configure distinct expiry policies; if not, use the stricter shared 10-minute expiry and update displayed copy. Do not invent separate application tokens.
- Reset request acknowledgment: "If an account can use password recovery, we’ll send instructions." Use the same accepted-request status/body for known and unknown destinations. Avoid existence-dependent timing shortcuts; rate-limit identifiers regardless of whether an account exists. Provider behavior must be tested, including duplicate registration and OAuth-only accounts.
- Do not change an account or invalidate its session merely because someone requested a reset. On successful password change, notify the holder, revoke refresh sessions, and return to normal sign-in. Preserve MFA. The API must account for already-issued access-token lifetime; session revocation is not an instant JWT recall. Use a 15-minute access-token lifetime as the deployment target and a backend account-access check for deletion/disablement.
- Recovery callback uses no-referrer and no third-party analytics/assets that could receive tokens. Never log recovery URLs/tokens; remove callback credentials from browser history after exchange. Allowlist redirect URLs exactly in production. These safeguards follow [OWASP password recovery](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html).

### MFA lifecycle and provider compatibility

Require fresh primary authentication within 5 minutes for initial MFA enrollment, followed by verification of the newly enrolled factor before activation. For MFA-enabled accounts, require fresh primary authentication plus an existing factor for factor changes, linking, deletion and recovery-code regeneration; ordinary accounts require fresh primary authentication for linking/deletion. Supabase's AAL claim alone is not proof of recent primary authentication; verify through supported provider mechanisms. For MFA-enabled users, backend application-data access requires AAL2. Test direct API access after primary sign-in; a frontend challenge screen alone is insufficient.

MFA-RECOVERY-01 replaces provider-managed-only recovery within its approved scope.
The owner observed `mfa_recovery_codes_enroll_not_enabled` on their actual hosted
project. Generate ten independent 128-bit backup codes on the backend; store only
account-bound digests in private RLS-protected tables. Require recent signed
primary-password and TOTP proof for issuance, rotation and removal. Show each set
once, support copy/download, and display only remaining-count metadata afterward.
Never store plaintext codes or capabilities in application tables, logs, query
caches or persistent browser storage.

Password plus an unused backup code authorizes replacement of the lost
authenticator, not an application assertion of provider AAL2. Verify primary
credentials server-side, consume the code atomically and commit an account-wide
application-data block before any privileged factor removal. Limit each stage to
five attempts per account per fifteen minutes. Require a hashed, ten-minute
recovery capability and fresh password for replacement setup/verification. Only
Supabase verification of the specific replacement TOTP, removal of unexpected
factors, and revocation of other sessions permit clearing the block. Expiry and
failure must retain it. Another unused code and password may restart recovery.
Keep the provider admin credential backend-only, explicitly gated and reviewed;
normal application database work stays under the restricted role.

Rotation replaces the prior set atomically; recovery completion also replaces all
prior codes. Lost responses are ambiguous: check status and require authenticated
rotation instead of claiming the old set works. Disablement requires explicit
confirmation and notification, revokes recovery material and refresh sessions,
and preserves a usable primary method. Email-password reset and deletion require
the recovered authenticator first; password reset alone never removes MFA or the
pending recovery block. Losing both primary password and authenticator is outside
backup-code recovery. Loss of all factors/codes has no email-only or security-question
bypass. Follow [OWASP MFA guidance](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html).

**Compatibility blocker AUTH-C1:** Supabase documents automatic same-email OAuth identity linking, while REQ-13 requires explicit linking after proof of existing-account access. Preserve REQ-13. A provider configuration/spike must prove this policy at the provider boundary, including direct OAuth attempts. Hiding a button or rejecting the callback afterward does not undo a provider-side link. Do not enable conflicting Google behavior or replace the identity provider without a separate owner decision. [Supabase identity linking](https://supabase.com/docs/guides/auth/auth-identity-linking).

**Capability gate AUTH-C2:** demonstrate MFA-RECOVERY-01 code issuance, concurrent
single-use redemption, rotation, restricted replacement, direct-provider race
isolation, session revocation, disablement, notifications and fresh-auth behavior
on the actual project before enabling MFA. The ADR authorizes local source
implementation; it does not establish provider compatibility or pass this gate.

Build verified email/password access first. AUTH-C1 blocks Google integration only; AUTH-C2 blocks new MFA enrollment only. Neither prevents independent catalog/roadmap work. Do not disable enforcement for users already enrolled in MFA. An interim email/password build does not satisfy final-MVP Google/MFA requirements merely because unsafe controls are hidden.

## Upload and provider data handling

Accept one active PDF/account, at most 10 MB (10,000,000 bytes), 50 pages and 100,000 extracted characters. Reject encrypted, malformed, image-only, oversized, and over-budget PDFs with specific recoverable messages. Parse in a constrained server process: 15-second extraction deadline, no network, no embedded-script execution, and bounded memory. Use maintained libraries, server-generated private object names, signature/type/size checks, and owner authorization. Do not render original PDF content inline. A private download streams through an owner-authorized backend check with attachment/no-store headers; do not issue public or reusable signed links that bypass the deletion access block. Re-encode optional profile JPEG/PNG/WebP images, maximum 2 MB and 4096 pixels per side; strip metadata and reject SVG/animated uploads. These are chosen product limits informed by [OWASP upload guidance](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).

Extract text locally on the backend; Groq receives bounded, contact-redacted text for PDF extraction, then only validated structured background for recommendations. Raw files, names, email addresses, phone numbers, postal addresses, and account identifiers are excluded from provider requests where not needed. Explain purpose, provider, cross-border processing, limits, and removal before upload; require an explicit Analyze PDF action. No document-based processing without that action. Successful analysis applies supported fields automatically; there is no extra mandatory review screen.

Select Groq with Zero Data Retention enabled for these inference calls. Verify account settings, model availability and current terms before real documents; disable the feature if the required setting cannot be established. This is a required configuration, not a claim of provider compliance or deletion. [Groq data handling](https://console.groq.com/docs/your-data).

## Retention, backups, and deletion

These are application policy deadlines; verify hosted storage and provider retention separately in the privacy notice.

| Data | Policy |
| --- | --- |
| Profile, current roadmap, progress, saved Discovery | Retain for the account lifetime; no automatic inactivity purge in MVP |
| Active original PDF and validated derived context | Retain until successful replacement, removal, or account deletion |
| Failed/unselected upload candidates | Delete within 24 hours; retain no extracted document text in ordinary logs |
| Superseded/removed PDFs and their derived context | Exclude immediately on accepted removal/replacement; remove active-storage copies within 24 hours |
| Recommendations | Keep latest eligible success; delete superseded result payloads within 30 days; suppress and delete removed-document-derived payloads within 24 hours |
| Security/operational metadata | Retain 30 days, restrict access; no raw prompts, credentials, document contents, full recovery URLs, or unnecessary answers |
| Account deletion | Deny access and new work immediately after verified acceptance; purge active application/Auth/Storage records within 7 days; retry failures and record status |
| Encrypted backup snapshots | Daily, retain 7 days; include private objects as well as database if needed for restoration |

Mark deletion accepted only after a durable deletion intent and access block exist. Provider deletion can continue afterward; say "Account access ended; deletion is in progress" rather than claim an immediate physical purge. Keep a minimal protected deletion ledger through backup expiry so restoration reapplies removals before access is restored; purge ledger identifiers after the window plus verification. A failed external purge is an incident, not a reason to reactivate the account. No legal-compliance guarantee is implied.

Target RPO 24 hours and RTO 1 working day for the evaluated MVP. Restore to isolated staging before first real-user release and monthly thereafter; ensure removed documents/accounts stay unavailable. Supabase database backups do not restore Storage objects automatically. [Supabase backups](https://supabase.com/docs/guides/platform/backups).

### Maintenance execution matrix

Do not run required schedules in FastAPI startup hooks, process-local timers, or post-response background tasks. Render Free can sleep or restart; Render Cron is a separate billed service and is not included in the selected free web-service plan. Select external GitHub Actions maintenance workflows plus manual operator fallback without changing the application stack. [Render Free](https://render.com/docs/free), [Render Cron](https://render.com/docs/cronjobs).

| Work | Execution and cadence | Persistence / recovery |
| --- | --- | --- |
| Quota checks and reservations | FastAPI request path before expensive work | Transactional shared database state; time-window expiry checked on each request, no midnight reset daemon; fail closed for analysis if unavailable |
| Deletion acceptance and context removal | Authorized request path | Persist intent, immediate access block and context invalidation before acknowledgment; physical purge may continue separately |
| File/account purge and retention cleanup | External GitHub Actions workflow hourly, offset from the hour; operator can manually dispatch the same job | Durable due-work records, bounded batches, concurrency protection, idempotent retries and per-item completion/error status; honor existing 24-hour/7-day/30-day deadlines |
| Abandoned analysis bookkeeping | Same hourly maintenance workflow | Mark expired records by persisted deadline; late responses still fail revision/access checks. Request deadlines do not wait for cleanup |
| Encrypted database and required private-object backups | External workflow twice daily, aiming to leave recovery time within the 24-hour RPO target | Encrypted operator-controlled off-provider destination, seven-day retention, manifests/checksums and last-success record; do not use the repository or ordinary CI artifacts as private backup storage |
| Incident and job-failure alerts | Provider-side alerts where available; workflow failure notification plus external last-success/deadline check | Verify a real operator channel; a failed scheduler cannot be its own only missed-run detector. Sample sanitized metrics, not private payloads |
| Restore test, policy/provider review and incident response | Manual operator work; restore before real-user release and monthly, inspect last successful maintenance/backup daily | Record evidence, reapply deletion ledger before restored access, investigate missed deadlines and dispatch catch-up jobs |

GitHub scheduled runs can be delayed or dropped, so cron timing is not a deadline guarantee. Configure manual dispatch, use an off-peak schedule, and monitor last success independently through a provisioned external check plus operator review. Public repositories also have scheduled-workflow inactivity constraints. These limitations come from [GitHub scheduling guidance](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).

Maintenance credentials belong in protected environment secrets with minimal grants; runners use reviewed entry points against database/Storage, not user-facing admin URLs. Pin third-party actions, restrict dispatch/deployment permissions, and prevent untrusted pull-request code from accessing those secrets. Maintenance must work while Render is stopped. Alerts/status contain record counts and error IDs, not account details or document contents.

**Operations gate OPS-C1:** before real-user release, prove scheduler availability on the actual repository plan, runner/network compatibility, maintenance access, encrypted destination/retention, bounded runtime/minutes/storage, independent missed-run detection and manual recovery. Test a skipped schedule and a partially failed purge. If the free plans cannot satisfy the selected deadlines, retain synthetic-data/local evaluation until the owner approves a different operating budget or revised deadlines. Do not claim manual availability, automatic scheduling, alerts or backup capacity has already been provisioned.

## Monitoring and incident response

The project lead is the initial accountable operator and release reviewer. Record a real contact, provider access, and backup operator before external use; no 24/7 on-call service is promised. Send alerts to a verified operator channel configured during deployment, without creating messages or integrations during this documentation task.

Initial alerts: auth traffic above 100 requests/minute for 5 minutes, sustained 429s above 20% for 5 minutes, application 5xx above 5% with at least 20 requests/5 minutes, or provider budget at 80%/100%, or a missed/failed daily backup. Provider dashboards may expose different metrics; establish equivalent alerts and record blind spots. Disable paid overage/automatic upgrades where supported. An alert is not a hard spending cap.

For a reset flood, including the illustrative 40,000 requests/second case:

1. Identify which origin/path is receiving traffic; use aggregate provider metrics and sampled sanitized evidence. Do not reproduce the flood against a live shared service.
2. Contain at that origin's edge/provider controls. Check CAPTCHA enforcement, auth limits, destination cooldowns, sender budget, and direct-origin bypasses. Temporarily suspend abusive email generation or registrations if necessary; show honest recovery unavailability.
3. Protect the API separately with concurrency/budget limits and a provider circuit breaker. Preserve catalog/progress where their dependencies remain healthy. Do not disable authentication checks to restore availability.
4. Check email volume, queue/backlog, DB connections, provider quotas, costs, and signs of account compromise. Blocking one IP is temporary containment; geography is not the rule.
5. Restore gradually, test with nonproduction accounts, record impact and timeline, then adjust controls and run the regression cases in [verification](verification.md).

Rate limits and CAPTCHA address application abuse; sustained volumetric floods need the hosting/provider edge. No free-tier configuration in this document is asserted to withstand a particular attack rate.
