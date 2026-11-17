# Hosted account-demo checklist

Documentation baseline: 2026-11-17. Use your own approved environment and enter secrets directly in provider stores. [Earlier operator-reported setup progress](archive/2026-11-17/account-demo-setup-progress.md) is archived with deployment identifiers generalized. It does not establish current hosted acceptance. This restricted demo exception does not approve public signup or production operation.

<a id="setup-progress-2026-11-14"></a>

## What you configure

Create a Supabase Free project, a Render Free Docker service from the repository's
`render.yaml`, and a Vercel Hobby Vite project with root `frontend`. Keep automatic
deployments off while reviewing configuration. Use the current reviewed app
snapshot; do not silently substitute `main`. For Vercel, configure Git deployment
controls in the dashboard before enabling repository-triggered releases.

Record these public values privately in your deployment record:

| Name used below | Actual value you supply |
| --- | --- |
| FRONTEND | Stable HTTPS Vercel **preview/branch** origin used for this team demo |
| API | HTTPS Render service origin, without `/api` |
| SUPABASE | HTTPS Supabase project origin |
| PROJECT_REF | That Supabase project's reference |
| PUBLIC_KEY | Its browser-safe anonymous/publishable key |
| SESSION_POOLER | The project's shared session-pooler host |

These names are placeholders, not runnable values. Resolve actual project URLs from the approved deployment record. Origins contain no trailing slash, path or share-link
query string. Public URLs and the public key can be shared with Codex for final
configuration checking. Enter secrets directly in provider secret stores.

## Supabase: your steps

1. Create the Free project in your organization. Store its new database password
   privately and record PROJECT_REF/SUPABASE/PUBLIC_KEY. Use a region near Render.
2. In Auth configuration, enable Email/password signup and **Confirm email**;
   set minimum password length 8, email OTP length 6, expiry 600 seconds and the
   supported 60-second resend cooldown. Local `config.toml` does not configure hosting.
3. In Email Templates, copy the contents of
   [`supabase/templates/confirmation.html`](../supabase/templates/confirmation.html)
   into Confirm signup; subject: **Confirm your Asgard account**. It uses
   `{{ .Token }}` for the six-digit verification screen.
4. Set Auth Site URL to FRONTEND. Add only exact implemented redirect destinations;
   this demo uses explicit code verification and does not need OAuth/reset callback
   URLs. Remove obsolete local/wildcard hosted entries. Keep Google disabled.
5. Configure the current signing key as asymmetric **ES256/P-256**. Do not upload
   local private keys. Verify issuer `SUPABASE/auth/v1` and published JWKS belong
   to the same project before releasing the backend.
6. Keep built-in email for this owner demo. Your demo recipient must be the exact
   address of an existing Supabase organization member, including yourself.
   App registration does not grant email eligibility. Do not invite observers as
   administrators to work around this restriction. The documented built-in quota
   is currently two messages/hour **project-wide**, including resend attempts;
   prepare before the presentation and leave time between email tests.
7. Under Auth MFA, enable supported TOTP enrollment/challenge/verification and check
   provider-managed recovery-code availability on this project. Supabase dashboard
   account MFA is different from MFA for Asgard users. The SDK experimental option
   is configured in source; it cannot turn on unsupported server features.
8. Before enabling Asgard enrollment, verify AUTH-C2: issuance, single-use recovery
   redemption (including concurrent reuse), regeneration, removal, lost-response
   handling, fresh primary authentication and factor-change notifications. Check
   **direct provider endpoints**, not only UI prompts. Browser checks alone cannot
   enforce the five-minute policy. If unsupported, keep the gate false and report
   the exact error/capability; do not weaken the policy or invent recovery storage.
9. Configure applicable Auth rate limits/abuse controls. Before widening beyond this
   owner-operated demo, the [public-entry controls](security-and-operations.md#public-entry-points-and-abuse),
   including receiving-service CAPTCHA, must be implemented and verified. This
   increment does not claim public-registration or real-user operations acceptance.

## Database and publication: your administrative steps

Use the root-locked Supabase CLI and a separately authorized operator login.
Never use the app runtime role to apply migrations. In the checkout root, after
`npm ci`, log in privately with the CLI and link PROJECT_REF. Review the actual
pending changes with `npx --no-install supabase db push --linked --dry-run`.
Only after reviewing that output, apply using the same command without `--dry-run`.
Do not use reset or force/include-all to paper over history mismatches.

Inspect the initial restricted-role migration before applying: it rejects an
unexplained pre-existing role. Set a new `asgard_app` password privately. The
application role must retain its migration-defined grants/RLS and no administrative
or bypass-RLS attributes. No new migration is introduced by this task.

For catalog content, `node scripts/render-publication.mjs` generates the current
ordered transactional SQL. Save it to a private local SQL file only after checking
the command's exit status. Review the releases, then apply with your operator's
PostgreSQL client and verified TLS, as described in the
[publication instructions](deployment.md#administrative-migrations-and-content).
Keep the output out of the code review unless intentionally publishing that artifact.
Generation was checked in memory; application to hosting has not been performed.

## Render: your secret-store entries

Reuse the blueprint: Docker context `backend`, production Dockerfile,
`python -m app.start`, readiness `/ready`, automatic deployment off.

| Variable | Value |
| --- | --- |
| ASGARD_DEPLOYMENT_ENVIRONMENT | `staging` |
| ASGARD_AUTH_ENABLED | `true` |
| ASGARD_CORS_ORIGINS | JSON array containing FRONTEND only |
| ASGARD_SUPABASE_URL | SUPABASE |
| ASGARD_SUPABASE_ANON_KEY | PUBLIC_KEY |
| ASGARD_AUTH_ISSUER | SUPABASE followed by `/auth/v1` |
| ASGARD_DATABASE_URL | Restricted-role psycopg session-pooler URL with verified TLS |

Database URL shape (replace placeholders privately, URL-encoding the password):

```text
postgresql+psycopg://asgard_app.PROJECT_REF:ENCODED_PASSWORD@SESSION_POOLER:5432/postgres?sslmode=verify-full&sslrootcert=/etc/secrets/supabase-root.crt
```

Use the actual provider-supported custom-role username. Install the project's
trusted certificate as the Render secret file `supabase-root.crt`. Never weaken TLS
to make connectivity work. Confirm restricted-role access through the actual pooler.
The existing app bounds its pool to three connections with pre-ping/recycle.

The blueprint explicitly disables Groq, AI guidance, documents, resume review and
profile photos for this account demo. Do not add service-role or provider secrets
unless separately enabling reviewed behavior. Render's platform PORT is automatic.

## Vercel: your project entries and private sharing

Root: `frontend`; framework Vite; build `npm run build`; output `dist`. Reuse
`frontend/vercel.json` for asset serving, security headers and SPA fallback.
Set these in the **Preview** environment and rebuild after changes:

| Variable | Value |
| --- | --- |
| VITE_DEPLOYMENT_ENVIRONMENT | `staging` |
| VITE_API_BASE_URL | API |
| VITE_AUTH_ENABLED | `true` |
| VITE_SUPABASE_URL | SUPABASE |
| VITE_SUPABASE_ANON_KEY | PUBLIC_KEY |
| VITE_MFA_ENROLLMENT_APPROVED | `false`; change to `true` only after reviewed AUTH-C2 evidence |

Enable Vercel Authentication/Standard Protection and share the protected preview
through the dashboard's supported sharing mechanism. Hobby has sharing limits;
verify your account can admit the intended observers before relying on a link.
The production alias may remain public under Standard Protection: do not publish
the demo there and assume it is private. A shareable-link bypass token is sensitive;
do not put it in CORS, Auth URLs, frontend variables, documentation or logs.

Vercel protection covers the frontend, not Render or Supabase. Protected API data
continues to require valid account sessions, ownership checks and enrolled MFA.
Do not share an Asgard password or grant provider administration to demo observers.

## What Codex verifies, and what you test

Codex runs focused source/unit/configuration/security checks and a hosted-mode
production build. See the implementation guide for dated results. Actual hosted
pooler, TLS, role/RLS and health probes need the resources above; they remain
unverified until supplied and exercised. No inbox/browser journey is claimed.

You run the [manual account checklist](features/optional-two-factor-authentication.md#owner-manual-acceptance)
at FRONTEND plus `/create-account`, `/sign-in`, `/settings/account` and protected
pages. First open API plus `/health` and `/ready`; allow the free API to wake, then
open the Vercel share link. Record observed warm/cold behavior, refresh/deep links,
email delivery and MFA/recovery outcomes. Keep the tested local demo available as
a fallback. Do not use periodic keep-alive traffic to defeat free-tier idling.

Before real-user operation, finish backup/restore, maintenance, abuse, privacy and
review gates from the main runbook. This nonproduction exception does not pass
A-02/08, OPS-C1 or final-MVP account acceptance. Roll back compatible app builds
without reversing migrations or deleting retained data.

## Provider references

- [Supabase custom SMTP and built-in sender limits](https://supabase.com/docs/guides/auth/auth-smtp)
- [Supabase application MFA](https://supabase.com/docs/guides/auth/auth-mfa)
- [Supabase recovery verification API](https://supabase.com/docs/reference/javascript/auth-mfa-recovery-codes-verify)
- [Vercel deployment protection](https://vercel.com/docs/deployment-protection)
- [Vercel sharing](https://vercel.com/docs/deployments/sharing-deployments)
- [Render Free behavior](https://render.com/docs/free)
