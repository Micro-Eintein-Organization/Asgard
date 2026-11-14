import { beforeEach, expect, it, vi } from "vitest";
import { checkAssurance, verifySecondFactor } from "./mfa";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(), getAuthenticatorAssuranceLevel: vi.fn(), listFactors: vi.fn(),
  challengeAndVerify: vi.fn(), recoveryVerify: vi.fn(),
}));
vi.mock("./supabase", () => ({ supabase: { auth: {
  getSession: mocks.getSession, mfa: { ...mocks, recoveryCodes: { verify: mocks.recoveryVerify } },
} } }));
beforeEach(() => vi.resetAllMocks());

it("checks current provider factors with the exact token, requiring MFA for enrolled AAL1", async () => {
  mocks.getAuthenticatorAssuranceLevel.mockResolvedValue({ data: { currentLevel: "aal1", nextLevel: "aal2" }, error: null });
  expect(await checkAssurance("session-token")).toBe("required");
  expect(mocks.getAuthenticatorAssuranceLevel).toHaveBeenCalledWith("session-token");
});
it.each([["aal1", "aal1"], ["aal2", "aal2"]])("accepts valid %s/%s assurance", async (currentLevel, nextLevel) => {
  mocks.getAuthenticatorAssuranceLevel.mockResolvedValue({ data: { currentLevel, nextLevel }, error: null });
  expect(await checkAssurance("token")).toBe("ready");
});
it("fails closed when security lookup fails or no session exists", async () => {
  mocks.getAuthenticatorAssuranceLevel.mockResolvedValue({ data: null, error: new Error("offline") });
  await expect(checkAssurance("token")).rejects.toThrow("Could not check");
  mocks.getSession.mockResolvedValue({ data: { session: null }, error: null });
  await expect(checkAssurance()).rejects.toThrow("Sign in again");
});
it("verifies only an enrolled provider factor and does not leak raw errors", async () => {
  mocks.listFactors.mockResolvedValue({ data: { totp: [{ id: "unverified", status: "unverified" }, { id: "verified", status: "verified" }] }, error: null });
  mocks.challengeAndVerify.mockResolvedValue({ error: null });
  await verifySecondFactor("123456");
  expect(mocks.challengeAndVerify).toHaveBeenCalledWith({ factorId: "verified", code: "123456" });
  mocks.challengeAndVerify.mockResolvedValue({ error: new Error("private-provider-detail") });
  await expect(verifySecondFactor("000000")).rejects.toThrow("Authenticator verification failed");
});
it("uses provider recovery verification, never TOTP enrollment or a custom code store", async () => {
  mocks.recoveryVerify.mockResolvedValue({ error: null });
  await verifySecondFactor("backup-code", true);
  expect(mocks.recoveryVerify).toHaveBeenCalledWith({ code: "backup-code" });
  expect(mocks.listFactors).not.toHaveBeenCalled();
});
