import { createClient } from "@supabase/supabase-js";
import { authConfigured } from "./supabase";
import { validateNewPassword } from "./password";
import { validateEmail } from "./email";
import { emailDeliveryError } from "./email-errors";
import { routes } from "@/lib/routes";

export const recoveryAcknowledgment = "If an account can use password recovery, we’ll send instructions.";
const cooldownKey = "asgard.recovery-send-at";
const verifierPrefix = "asgard-password-recovery";
let client: ReturnType<typeof createClient> | null = null;
let verifiedOwner: string | null = null;
let passwordChanged = false;
let exchange: Promise<{ mfaRequired: boolean }> | null = null;

function recoveryClient() {
  if (!authConfigured) throw new Error("Account recovery is not configured in this environment.");
  if (!client) {
    // Each page gets its own session/broadcast channel; only PKCE proof crosses tabs.
    const sessionKey = `${verifierPrefix}-${crypto.randomUUID()}`;
    const memory = new Map<string, string>();
    client = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {
      auth: {
        storageKey: sessionKey, persistSession: true, autoRefreshToken: false,
        detectSessionInUrl: false, flowType: "pkce", experimental: { recoveryCodes: true },
        storage: {
          getItem(key) {
            if (!key.endsWith("-code-verifier")) return memory.get(key) ?? null;
            const storageKey = key.replace(sessionKey, verifierPrefix);
            const raw = localStorage.getItem(storageKey);
            if (!raw) return null;
            try {
              const entry = JSON.parse(raw);
              if (typeof entry.value === "string" && entry.expires > Date.now()) return entry.value;
            } catch { /* Invalid or expired proof cannot authorize recovery. */ }
            localStorage.removeItem(storageKey);
            return null;
          },
          setItem(key, value) {
            if (key.endsWith("-code-verifier")) localStorage.setItem(key.replace(sessionKey, verifierPrefix),
              JSON.stringify({ value, expires: Date.now() + 15 * 60_000 }));
            else memory.set(key, value);
          },
          removeItem(key) {
            if (key.endsWith("-code-verifier")) localStorage.removeItem(key.replace(sessionKey, verifierPrefix));
            else memory.delete(key);
          },
        },
      },
    });
  }
  return client;
}

export function recoveryCooldown() {
  return Math.max(0, Math.ceil((Number(localStorage.getItem(cooldownKey)) - Date.now()) / 1000));
}

export async function requestRecovery(email: string) {
  const validation = validateEmail(email);
  if (validation !== true) throw new Error(validation);
  if (recoveryCooldown()) throw new Error("Wait before requesting another recovery email.");
  const auth = recoveryClient().auth;
  exchange = null;
  verifiedOwner = null;
  passwordChanged = false;
  localStorage.setItem(cooldownKey, String(Date.now() + 60_000));
  const { error } = await auth.resetPasswordForEmail(email.trim(), {
    redirectTo: new URL(routes.resetPassword, window.location.origin).href,
  });
  if (error && error.code !== "user_not_found") throw new Error(emailDeliveryError(error.code,
    "We could not send recovery instructions. Try again later."));
}

export function consumeRecoveryLocation() {
  const url = new URL(window.location.href);
  if (url.pathname !== routes.resetPassword) return { code: null, flowId: undefined };
  const code = url.searchParams.getAll("code").length === 1 ? url.searchParams.get("code") : null;
  const flowId = url.searchParams.get("sb_flow_id") ?? undefined;
  const invalid = url.searchParams.has("error") || !!url.hash;
  window.history.replaceState(window.history.state, "", url.pathname);
  return { code: invalid ? null : code, flowId };
}

async function sameOwner() {
  const auth = recoveryClient().auth;
  const { data, error } = await auth.getUser();
  if (error || !verifiedOwner || data.user?.id !== verifiedOwner)
    throw new Error("Recovery verification has expired. Request a new recovery email.");
  return auth;
}

async function needsMfa() {
  const auth = await sameOwner();
  const session = await auth.getSession();
  if (session.error || !session.data.session) throw new Error("Request a new recovery email.");
  const { data, error } = await auth.mfa.getAuthenticatorAssuranceLevel(session.data.session.access_token);
  if (error || !data.currentLevel) throw new Error("Could not check account security. Try again.");
  return data.nextLevel === "aal2" && data.currentLevel !== "aal2";
}

export function openRecovery(code: string | null, flowId?: string) {
  // The same promise survives React StrictMode's repeated effect setup.
  exchange ??= (async () => {
    if (!code) throw new Error("This recovery link is missing, invalid or expired. Request a new email.");
    const auth = recoveryClient().auth;
    let recoveryOwner: string | null = null;
    const { data: listener } = auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") recoveryOwner = session?.user.id ?? null;
    });
    try {
      const { data, error } = await auth.exchangeCodeForSession(code, flowId ? { flowId } : undefined);
      if (error || !data.session || recoveryOwner !== data.user.id) {
        if (data.session) await auth.signOut({ scope: "local" });
        throw new Error("This recovery link cannot be used. Request a new email and open it in the same browser.");
      }
      verifiedOwner = data.user.id;
      return { mfaRequired: await needsMfa() };
    } finally {
      listener.subscription.unsubscribe();
    }
  })();
  return exchange;
}

export async function replaceRecoveredPassword(password: string, code = "", recovery = false) {
  const auth = await sameOwner();
  if (!passwordChanged) {
    const validation = validateNewPassword(password);
    if (validation !== true) throw new Error(validation);
    if (await needsMfa()) {
      if (!code.trim()) throw new Error("Enter your authenticator or recovery code.");
      if (recovery) {
        const result = await auth.mfa.recoveryCodes.verify({ code: code.trim() });
        if (result.error) throw new Error("Recovery code verification failed.");
      } else {
        const factors = await auth.mfa.listFactors();
        const factor = factors.data?.totp.find(item => item.status === "verified");
        if (factors.error || !factor) throw new Error("Use a recovery code if your authenticator is unavailable.");
        const result = await auth.mfa.challengeAndVerify({ factorId: factor.id, code: code.trim() });
        if (result.error) throw new Error("Authenticator verification failed. Check the current code.");
      }
      if (await needsMfa()) throw new Error("Second-factor verification is still required.");
    }
    await sameOwner();
    const result = await auth.updateUser({ password });
    if (result.error) throw new Error("Password change was not confirmed. Check the password or request a new recovery email.");
    passwordChanged = true;
  }
  await sameOwner();
  try {
    const result = await auth.signOut({ scope: "global" });
    return { complete: !result.error, userId: verifiedOwner! };
  } catch {
    return { complete: false, userId: verifiedOwner! };
  }
}
