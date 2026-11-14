import { supabase } from "./supabase";

export const mfaEnrollmentApproved = import.meta.env.VITE_MFA_ENROLLMENT_APPROVED === "true";

export async function checkAssurance(token?: string) {
  if (!supabase) throw new Error("Account access is not configured.");
  if (!token) {
    const result = await supabase.auth.getSession();
    if (result.error || !result.data.session) throw new Error("Sign in again to continue.");
    token = result.data.session.access_token;
  }
  // Passing the JWT makes the SDK check current factors with Auth instead of cached user data.
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel(token);
  if (error || !data?.currentLevel) throw new Error("Could not check account security. Sign in again.");
  return data.nextLevel === "aal2" && data.currentLevel !== "aal2" ? "required" as const : "ready" as const;
}

export async function verifySecondFactor(code: string, recovery = false) {
  if (!supabase) throw new Error("Account access is not configured.");
  if (recovery) {
    const { error } = await supabase.auth.mfa.recoveryCodes.verify({ code });
    if (error) throw new Error("Recovery verification failed. Check the code or try again later.");
  } else {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) throw new Error("Could not load your authenticator. Try again.");
    const factor = data.totp.find(item => item.status === "verified");
    if (!factor) throw new Error("No verified authenticator is available. Use a recovery code if you have one.");
    const result = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code });
    if (result.error) throw new Error("Authenticator verification failed. Check the current code or try again later.");
  }
}
