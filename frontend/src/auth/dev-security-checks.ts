import { supabase } from "./supabase";

declare global {
  interface Window {
    asgardDevSecurityChecks?: {
      currentUserId: () => Promise<string>;
      revokeCurrentSession: () => Promise<{ status: number; code: string | null }>;
    };
  }
}

function assertLocalOrigin() {
  const allowedHost = (host: string) => host === "localhost" || host === "127.0.0.1";
  if (
    !allowedHost(window.location.hostname) ||
    !allowedHost(new URL(import.meta.env.VITE_SUPABASE_URL).hostname)
  ) {
    throw new Error("Local security checks only run against loopback services.");
  }
}

export function installDevSecurityChecks() {
  const client = supabase;
  if (!import.meta.env.DEV || !client) return;

  window.asgardDevSecurityChecks = {
    async currentUserId() {
      assertLocalOrigin();
      const { data, error } = await client.auth.getUser();
      if (error || !data.user) throw new Error("Sign in through Asgard first.");
      return data.user.id;
    },

    async revokeCurrentSession() {
      assertLocalOrigin();
      const {
        data: { session },
        error: sessionError,
      } = await client.auth.getSession();
      if (sessionError || !session)
        throw new Error("Sign in through Asgard first.");

      const accessToken = session.access_token;
      const { error: signOutError } = await client.auth.signOut({
        scope: "local",
      });
      if (signOutError) throw new Error("Supabase sign-out did not complete.");

      const response = await fetch("/api/v1/me/profile", {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });
      const body: unknown = await response.json().catch(() => null);
      const code =
        typeof body === "object" && body !== null && "code" in body &&
        typeof body.code === "string"
          ? body.code
          : null;
      return { status: response.status, code };
    },
  };
}
