export function applicationIssues(values, report) {
  const issues = [];
  if (values.ASGARD_AUTH_ENABLED !== "true" || !report.auth_enabled)
    issues.push("Local Auth is disabled. Run Setup-Asgard.cmd and confirm ENABLE AUTH only after project-lead approval.");
  if (!values.ASGARD_DATABASE_URL || !report.database_ready)
    issues.push("Application database access is unavailable. Complete approved local credential setup; do not copy another teammate's .env or rotate an existing password.");
  if (!report.content_ready)
    issues.push("The expected career/roadmap release is missing or unreadable. Run Setup-Asgard.cmd and confirm PUBLISH CONTENT, or follow README content-publication recovery.");
  return issues;
}

export async function offerContentPublication(confirm, publish) {
  const approved = await confirm(
    "Publish this checkout's reviewed career/roadmap content into this local database? Existing account state is preserved; unexpected content conflicts stop publication.",
    "PUBLISH CONTENT",
  );
  if (approved) await publish();
  return approved;
}

export async function prepareLocalSetup(state, actions) {
  if (state.hasDatabaseCredential && !state.hasKey)
    throw new Error("This checkout has a database credential without its signing key. Preserve both files and follow README recovery; setup did not replace either secret.");
  if (!state.hasDatabaseCredential) {
    const approved = await actions.confirm(
      "Continue only if this is a brand-new local database, or the same fresh setup previously started by this script with no user data, and the project lead approved initialization and credential provisioning. If this Docker project may contain existing data, stop and ask the project lead.",
      "INITIALIZE",
    );
    if (!approved) return false;
    if (!state.hasKey) await actions.createSigningKey();
  }
  await actions.bootstrap();
  if (!state.hasDatabaseCredential) await actions.provision();
  if (!state.authEnabled) {
    const approved = await actions.confirm(
      "Has the project lead approved enabling local email/password Auth for this environment? The script will save that setting in your ignored .env for your manual signup, verification, sign-in, and Profile checks.",
      "ENABLE AUTH",
    );
    if (approved) await actions.enableAuth();
  }
  await offerContentPublication(actions.confirm, actions.publish);
  return true;
}
