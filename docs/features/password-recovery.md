# Password recovery

2026-11-19 follow-up (Codex): Account and security now offers recovery email for the
signed-in account, using the existing isolated flow and shared cooldown. Input
validation follows ACCOUNT-ACCESS-01. See [account access fixes](account-access-fixes.md)
for source, verification and pending hosted acceptance. Last updated: 2026-11-19;
required reviewer remains @YakisobaNissin.

Implementer: Codex. Created/last updated: 2026-11-17.
Owner/reviewer: @YakisobaNissin. Status: source implemented; focused local checks
and hosted acceptance are recorded below. No completed human review is implied.
Requirements: REQ-01, REQ-11, REQ-13; QA-01/02/09.
The owner approved the [bounded implementation plan](../plans/password-recovery.md)
in chat. [Security policy](../security-and-operations.md#account-access-and-recovery)
owns password, MFA, notification, revocation and abuse behavior;
[architecture](../architecture.md) owns the direct Supabase Auth boundary.

## Implemented behavior

`/password-recovery` requests a provider email and displays the neutral acknowledgment
for accepted requests. A persistent, browser-wide 60-second cooldown reduces repeated
clicks; it does not replace receiving-service throttling. No automatic resend occurs.
Requesting recovery does not sign out, replace, or modify the normal application session.

`/reset-password` consumes a Supabase PKCE authorization code once, clears its query
and fragment before the app shell renders, and requires the SDK's PASSWORD_RECOVERY
event for the exchanged subject. An ordinary existing session or a URL flag cannot
unlock password editing. Expired/replayed links, missing proof, implicit token fragments
and conflicting parameters fail closed. Open the email link in the same browser and
origin where it was requested; another device/browser or cleared browser storage needs
a fresh request. The SDK PKCE proof expires from this storage adapter after 15 minutes;
the provider's configured email expiry is independent and can be shorter.

Recovery uses a separate SDK client with a unique per-page session/broadcast key.
Session access/refresh tokens stay in memory. Only the expiring SDK PKCE proof uses
localStorage so an email opened in another tab of the same browser can complete.
No application token, recovery-code table, API endpoint, migration, or dependency was added.
The verified provider subject is rechecked before sensitive operations. A mismatched
subject cannot update a password or globally sign out another account.

The shared eight-character rule and matching confirmation apply. Enrolled accounts
must complete TOTP or an unused provider recovery code before updating the password.
No factor removal or email-only bypass is implemented. On successful update, global
refresh-session sign-out is requested. Failure to confirm sign-out has a distinct
partial-success state that retries sign-out without updating the password again.
Only a matching normal application account is cleared; another signed-in account
is not replaced by the recovery session. Completed recovery returns to sign-in.
Existing access JWTs follow provider expiry; global sign-out is not instant JWT recall.

HTML and hosted response headers use no-referrer; the callback has no-store hosting
headers and adds no third-party scripts/assets. Passwords/codes are component memory,
not query caches or diagnostics. Existing local SMTP remains untouched.

## Files

- `frontend/src/auth/recovery.ts`: provider requests, isolated storage, PKCE validation,
  subject binding, MFA and password/session updates.
- `frontend/src/auth/transport.ts`: shared local access teardown; existing deletion
  callers retain their compatibility wrapper.
- `frontend/src/features/auth/connected-page.tsx`: request form and success message.
- `frontend/src/features/auth/reset-password.tsx`: recovery form and error/partial states.
- `frontend/src/app/router.tsx`, `frontend/src/lib/routes.ts`: public callback route.
- `frontend/index.html`, `frontend/vercel.json`: referrer and callback cache policy.
- `supabase/config.toml`, `supabase/templates/recovery.html`: local redirect allowlist
  and recovery email. Running local Auth must reload its configuration before a new
  template/allowlist is active; this task does not restart shared services.
- Corresponding auth and page tests cover changed security/interaction behavior.

## Hosted setup after publication

No Render flag, Groq key, SQL migration or new SMTP credential is needed.

1. In Supabase → Authentication → URL Configuration, use the actual main frontend
   origin as Site URL and add its exact callback to Redirect URLs:
   `https://asgard-navy.vercel.app/reset-password`.
   Keep existing approved redirects; do not broadly allow arbitrary preview origins.
2. Under Authentication → Emails → Reset Password, retain a link using
   `{{ .ConfirmationURL }}`. Do not replace it with the signup OTP or a plain Site URL;
   Supabase must verify the email before redirecting with its PKCE code. The local
   [template](../../supabase/templates/recovery.html) is an example for a ten-minute
   provider expiry. Confirm the configured expiry before using that wording.
3. Keep the working SMTP username/app password. Enable the provider's password-change
   security notification and verify delivery; application source does not send a
   separate notification or prove that dashboard setting is active.
4. Verify receiving-service email cooldown, recovery/verification rate limits and
   neutral known/unknown-address behavior. The existing security baseline requires
   Turnstile and has an open ABUSE-C1 provider-limit gate before unrestricted public
   recovery. This change does not implement a CAPTCHA widget or provision provider
   abuse controls; do not enable mandatory CAPTCHA globally without wiring all
   affected signup/sign-in/recovery forms. Controlled developer verification does
   not establish unrestricted public readiness.
5. Deploy the reviewed frontend changes to Vercel, then run the real email/MFA checks
   below. Source tests do not establish hosted delivery, provider MFA enforcement,
   expiry, notification, limits or session revocation.

## Verification

Verification on 2026-11-17: 31 focused tests passed across recovery service/UI,
existing signup verification, AuthProvider, MFA and deletion UI. TypeScript, scoped
ESLint and the production frontend build passed. Provider operations were mocked;
this is evidence for application logic, not real mail delivery or hosted controls.
The existing registration test fixture needed its normal QueryClientProvider to
render the current Welcome screen; application signup behavior was preserved.
Hosted and manual browser acceptance are pending. No real password was changed,
no email requested and no hosted setting modified during implementation.

Manual local path: `http://127.0.0.1:5173/password-recovery`. Use that same origin
throughout, a disposable local account and the local email inbox configured by the
supported development setup. If testing hosted, use the main Vercel origin instead.

1. Request recovery; confirm neutral acknowledgment and 60-second cooldown. An existing
   signed-in account must remain usable just because recovery was requested.
2. Open the link in the same browser. Confirm the address bar has no code/token after
   processing. A direct callback without a link and expired/reused links show an error.
3. Enter mismatched/short passwords; saving must be blocked. Save a valid replacement.
   Expect sign-in, the old password rejected and the new password accepted.
4. Test an enrolled disposable account: missing/wrong TOTP/recovery code cannot change
   its password; a valid factor permits it and remains enrolled afterward. Reused
   recovery codes fail. No email-only factor removal is offered.
5. Confirm prior refresh sessions and protected app access fail as specified, the
   holder receives a password-change notice, and a different account remains intact.
6. Test keyboard, mobile reflow and partial sign-out recovery. Report the route,
   timestamp and sanitized error, never passwords, email links or recovery codes.

Known limits: refreshing the callback after its credentials were removed requires a
new email; in-memory recovery sessions intentionally do not survive page reload.
Hosted configuration, real email/factor/session acceptance and public-abuse controls
remain operator/reviewer work. Existing documentation edits elsewhere are preserved.
