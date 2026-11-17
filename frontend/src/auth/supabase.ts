import { createClient } from "@supabase/supabase-js";

export const authConfigured =
  import.meta.env.VITE_AUTH_ENABLED === "true" &&
  Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
  );

export const authStorageKey = import.meta.env.VITE_SUPABASE_URL
  ? `sb-${new URL(import.meta.env.VITE_SUPABASE_URL).hostname.split(".")[0]}-auth-token` : "asgard-auth";

export const supabase = authConfigured
  ? createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
      {
        auth: {
          storageKey: authStorageKey,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          experimental: { recoveryCodes: true },
        },
      },
    )
  : null;
