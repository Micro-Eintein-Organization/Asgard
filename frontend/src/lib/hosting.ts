export function validateHostedEnvironment(env: Record<string, string | undefined>) {
  const environment = env.VITE_DEPLOYMENT_ENVIRONMENT ?? "local";
  if (!["local", "staging", "production"].includes(environment))
    throw new Error("VITE_DEPLOYMENT_ENVIRONMENT is invalid.");
  if (environment === "local") return;
  for (const name of ["VITE_API_BASE_URL", "VITE_SUPABASE_URL"]) {
    let url: URL;
    try { url = new URL(env[name] ?? ""); }
    catch { throw new Error(name + " must be an explicit HTTPS origin."); }
    if (url.protocol !== "https:" || url.pathname !== "/" || url.search || url.hash ||
        url.username || url.password || ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))
      throw new Error(name + " must be an explicit HTTPS origin.");
  }
  if (env.VITE_AUTH_ENABLED !== "true" || !env.VITE_SUPABASE_ANON_KEY)
    throw new Error("Hosted frontend requires configured Supabase account access.");
}
