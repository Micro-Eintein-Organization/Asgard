import createClient from "openapi-fetch";
import type { paths } from "@/api/generated/schema";
import { supabase } from "./supabase";

// Recovery may deliberately revoke the old session. Keep its error handling local.
const recoveryApi = createClient<paths>({ baseUrl: import.meta.env.VITE_API_BASE_URL || "" });

async function authorization(token?: string) {
  if (!token) {
    const result = await supabase?.auth.getSession();
    token = result?.data.session?.access_token;
  }
  if (!token) throw new Error("Sign in again to continue.");
  return { Authorization: `Bearer ${token}` };
}

export async function recoveryState(token?: string) {
  const result = await recoveryApi.GET("/api/v1/me/recovery-codes", {
    headers: await authorization(token), signal: AbortSignal.timeout(15_000),
  });
  if (!result.data) throw new Error("Could not check backup-code recovery. Try again.");
  return result.data;
}

export async function issueRecoveryCodes(replace: boolean) {
  const result = await recoveryApi.POST("/api/v1/me/recovery-codes", {
    headers: await authorization(), body: { replace }, signal: AbortSignal.timeout(15_000),
  });
  if (!result.data) throw new Error(result.error?.message || "Issuance was not confirmed. Reopen settings and replace the codes if needed.");
  return result.data;
}

export async function removeRecoveryCodes() {
  const result = await recoveryApi.POST("/api/v1/me/recovery-codes/remove", {
    headers: await authorization(), signal: AbortSignal.timeout(15_000),
  });
  if (!result.data) throw new Error("Backup-code removal was not confirmed. Your authenticator stays enabled.");
}

export async function beginRecovery(password: string, code: string) {
  const result = await recoveryApi.POST("/api/v1/me/recovery-codes/begin", {
    headers: await authorization(), body: { password, code }, signal: AbortSignal.timeout(30_000),
  });
  if (!result.data) throw new Error(result.error?.message || "Recovery was not confirmed. A submitted code may have been used; try another unused code.");
  return result.data;
}

export async function prepareRecovery(password: string, token: string) {
  const result = await recoveryApi.POST("/api/v1/me/recovery-codes/prepare", {
    headers: await authorization(), body: { password, token }, signal: AbortSignal.timeout(90_000),
  });
  if (!result.data) throw new Error(result.error?.message || "Replacement setup was not confirmed. Retry setup with your password.");
  return result.data;
}

export async function finishRecovery(password: string, token: string, code: string) {
  const result = await recoveryApi.POST("/api/v1/me/recovery-codes/finish", {
    headers: await authorization(), body: { password, token, code }, signal: AbortSignal.timeout(90_000),
  });
  if (!result.data) throw new Error(result.error?.message || "Recovery was not confirmed. Retry with your new authenticator or sign in again if recovery completed.");
  return result.data;
}
