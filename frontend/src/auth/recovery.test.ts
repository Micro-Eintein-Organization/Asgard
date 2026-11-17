import { beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(), resetPasswordForEmail: vi.fn(), exchangeCodeForSession: vi.fn(),
  getUser: vi.fn(), getSession: vi.fn(), assurance: vi.fn(), updateUser: vi.fn(),
  signOut: vi.fn(), listFactors: vi.fn(), challenge: vi.fn(), recovery: vi.fn(),
  listener: null as null | ((event: string, session: { user: { id: string } }) => void),
}));
vi.mock("@supabase/supabase-js", () => ({ createClient: mocks.createClient }));
vi.mock("./supabase", () => ({ authConfigured: true }));

beforeEach(() => {
  vi.resetModules(); vi.resetAllMocks(); localStorage.clear(); mocks.listener = null;
  window.history.replaceState(null, "", "/");
  mocks.getUser.mockResolvedValue({ data: { user: { id: "owner" } }, error: null });
  mocks.getSession.mockResolvedValue({ data: { session: { access_token: "recovery-token" } }, error: null });
  mocks.assurance.mockResolvedValue({ data: { currentLevel: "aal1", nextLevel: "aal1" }, error: null });
  mocks.updateUser.mockResolvedValue({ error: null });
  mocks.signOut.mockResolvedValue({ error: null });
  mocks.resetPasswordForEmail.mockResolvedValue({ error: null });
  mocks.exchangeCodeForSession.mockImplementation(async () => {
    mocks.listener?.("PASSWORD_RECOVERY", { user: { id: "owner" } });
    return { data: { user: { id: "owner" }, session: { access_token: "recovery-token" } }, error: null };
  });
  mocks.createClient.mockReturnValue({ auth: {
    ...mocks, mfa: { getAuthenticatorAssuranceLevel: mocks.assurance, listFactors: mocks.listFactors,
      challengeAndVerify: mocks.challenge, recoveryCodes: { verify: mocks.recovery } },
    onAuthStateChange: (callback: typeof mocks.listener) => {
      mocks.listener = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    },
  } });
});

it("requests provider PKCE recovery without changing a normal session and enforces its cooldown", async () => {
  const api = await import("./recovery");
  await api.requestRecovery(" owner@example.test ");
  expect(mocks.resetPasswordForEmail).toHaveBeenCalledWith("owner@example.test", {
    redirectTo: window.location.origin + "/reset-password",
  });
  expect(mocks.updateUser).not.toHaveBeenCalled(); expect(mocks.signOut).not.toHaveBeenCalled();
  await expect(api.requestRecovery("another@example.test")).rejects.toThrow("Wait");
  expect(mocks.resetPasswordForEmail).toHaveBeenCalledTimes(1);
});

it("stores only expiring PKCE proof outside memory, separately from the normal app session", async () => {
  await (await import("./recovery")).requestRecovery("owner@example.test");
  const options = mocks.createClient.mock.calls[0][2].auth;
  const key = options.storageKey;
  options.storage.setItem(key, "private-session");
  options.storage.setItem(key + "-code-verifier", "private-proof");
  expect(localStorage.getItem(key)).toBeNull();
  expect(options.storage.getItem(key)).toBe("private-session");
  expect(options.storage.getItem(key + "-code-verifier")).toBe("private-proof");
  const clock = vi.spyOn(Date, "now").mockReturnValue(Date.now() + 16 * 60_000);
  expect(options.storage.getItem(key + "-code-verifier")).toBeNull(); clock.mockRestore();
  expect(options.flowType).toBe("pkce"); expect(options.detectSessionInUrl).toBe(false);
});

it("scrubs callback credentials and rejects ambiguous or implicit callbacks", async () => {
  const api = await import("./recovery");
  window.history.replaceState(null, "", "/reset-password?code=private-code&sb_flow_id=flow");
  expect(api.consumeRecoveryLocation()).toEqual({ code: "private-code", flowId: "flow" });
  expect(window.location.search).toBe("");
  window.history.replaceState(null, "", "/reset-password?code=a&code=b#access_token=secret");
  expect(api.consumeRecoveryLocation().code).toBeNull();
  expect(window.location.hash).toBe("");
});

it("requires a provider recovery event, not merely an authenticated session", async () => {
  mocks.exchangeCodeForSession.mockResolvedValue({ data: { user: { id: "owner" }, session: {} }, error: null });
  const api = await import("./recovery");
  await expect(api.openRecovery("not-a-recovery-code")).rejects.toThrow("cannot be used");
  await expect(api.replaceRecoveredPassword("new-password")).rejects.toThrow("expired");
  expect(mocks.updateUser).not.toHaveBeenCalled();
});

it("prevents writes after the verified subject changes", async () => {
  const api = await import("./recovery");
  await api.openRecovery("valid-code");
  mocks.getUser.mockResolvedValue({ data: { user: { id: "another-account" } }, error: null });
  await expect(api.replaceRecoveredPassword("new-password")).rejects.toThrow("expired");
  expect(mocks.updateUser).not.toHaveBeenCalled(); expect(mocks.signOut).not.toHaveBeenCalled();
});

it("rejects provider-expired or replayed links before any password write", async () => {
  mocks.exchangeCodeForSession.mockResolvedValue({ data: { user: null, session: null }, error: {} });
  const api = await import("./recovery");
  await expect(api.openRecovery("expired-code")).rejects.toThrow("cannot be used");
  expect(mocks.updateUser).not.toHaveBeenCalled();
});

it("blocks missing or invalid MFA and preserves factors on successful recovery-code verification", async () => {
  mocks.assurance.mockResolvedValue({ data: { currentLevel: "aal1", nextLevel: "aal2" }, error: null });
  const api = await import("./recovery");
  expect(await api.openRecovery("valid-code")).toEqual({ mfaRequired: true });
  await expect(api.replaceRecoveredPassword("new-password")).rejects.toThrow("Enter your authenticator");
  mocks.recovery.mockResolvedValue({ error: {} });
  await expect(api.replaceRecoveredPassword("new-password", "bad-code", true)).rejects.toThrow("verification failed");
  expect(mocks.updateUser).not.toHaveBeenCalled();
  mocks.recovery.mockImplementation(async () => {
    mocks.assurance.mockResolvedValue({ data: { currentLevel: "aal2", nextLevel: "aal2" }, error: null });
    return { error: null };
  });
  expect((await api.replaceRecoveredPassword("new-password", "unused-code", true)).complete).toBe(true);
  expect(mocks.updateUser).toHaveBeenCalledWith({ password: "new-password" });
  expect(mocks.signOut).toHaveBeenCalledWith({ scope: "global" });
});

it("retries sign-out after a partial success without applying the password a second time", async () => {
  const api = await import("./recovery");
  await api.openRecovery("valid-code");
  mocks.signOut.mockResolvedValueOnce({ error: {} });
  expect((await api.replaceRecoveredPassword("new-password")).complete).toBe(false);
  expect((await api.replaceRecoveredPassword("")).complete).toBe(true);
  expect(mocks.updateUser).toHaveBeenCalledTimes(1);
});
