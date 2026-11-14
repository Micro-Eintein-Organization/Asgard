import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, expect, it, vi } from "vitest";
import { MfaPage } from "./mfa-page";

const mocks = vi.hoisted(() => ({
  approved: false, mfa: "ready", listFactors: vi.fn(), signInWithPassword: vi.fn(),
  enroll: vi.fn(), challengeAndVerify: vi.fn(), verifySecondFactor: vi.fn(),
  generate: vi.fn(), getStatus: vi.fn(), regenerate: vi.fn(), unenroll: vi.fn(),
  refreshAssurance: vi.fn(), signOut: vi.fn(),
}));
vi.mock("@/auth/context", () => ({ useAuth: () => ({
  user: { id: "owner", email: "owner@example.test", email_confirmed_at: "today" },
  loading: false, mfa: mocks.mfa, refreshAssurance: mocks.refreshAssurance, signOut: mocks.signOut,
}) }));
vi.mock("@/auth/mfa", () => ({ get mfaEnrollmentApproved() { return mocks.approved; }, verifySecondFactor: mocks.verifySecondFactor }));
vi.mock("@/auth/supabase", () => ({ supabase: { auth: {
  signInWithPassword: mocks.signInWithPassword, signOut: mocks.signOut,
  mfa: { listFactors: mocks.listFactors, enroll: mocks.enroll, challengeAndVerify: mocks.challengeAndVerify,
    unenroll: mocks.unenroll, recoveryCodes: { generate: mocks.generate, getStatus: mocks.getStatus, regenerate: mocks.regenerate, unenroll: mocks.unenroll } },
} } }));

function open(challenge = false) {
  render(<MemoryRouter initialEntries={["/test?welcome=1"]}><Routes>
    <Route path="/test" element={<MfaPage challenge={challenge} />} />
    <Route path="/welcome" element={<h1>Welcome destination</h1>} />
    <Route path="/dashboard" element={<h1>Dashboard destination</h1>} />
    <Route path="/settings/account" element={<h1>Account destination</h1>} />
    <Route path="/sign-in" element={<h1>Sign-in destination</h1>} />
  </Routes></MemoryRouter>);
}
beforeEach(() => {
  vi.resetAllMocks(); mocks.approved = false; mocks.mfa = "ready";
  mocks.listFactors.mockResolvedValue({ data: { all: [], totp: [] }, error: null });
  mocks.signInWithPassword.mockResolvedValue({ data: { user: { id: "owner" } }, error: null });
  mocks.enroll.mockResolvedValue({ data: { id: "factor", totp: { secret: "private-setup-key", qr_code: "data:image/svg+xml,test" } }, error: null });
  mocks.challengeAndVerify.mockResolvedValue({ error: null });
  mocks.generate.mockResolvedValue({ data: { codes: ["private-backup-code"], total: 1 }, error: null });
});
it("offers skip while blocking unapproved enrollment", async () => {
  open();
  expect(await screen.findByRole("button", { name: "Set up authenticator" })).toBeDisabled();
  fireEvent.click(screen.getByRole("link", { name: "Skip for now" }));
  expect(await screen.findByRole("heading", { name: "Welcome destination" })).toBeVisible();
  expect(mocks.enroll).not.toHaveBeenCalled();
});
it("requires fresh password, verifies setup, and reveals provider recovery codes only in memory", async () => {
  mocks.approved = true; open();
  fireEvent.change(await screen.findByLabelText("Confirm your password"), { target: { value: "password" } });
  fireEvent.click(screen.getByRole("button", { name: "Set up authenticator" }));
  expect(await screen.findByText("private-setup-key")).toBeVisible();
  expect(mocks.signInWithPassword).toHaveBeenCalledWith({ email: "owner@example.test", password: "password" });
  fireEvent.change(screen.getByLabelText("Authenticator code"), { target: { value: "123456" } });
  fireEvent.click(screen.getByRole("button", { name: "Verify" }));
  expect(await screen.findByText("private-backup-code")).toBeVisible();
  expect(mocks.challengeAndVerify).toHaveBeenCalledWith({ factorId: "factor", code: "123456" });
  expect(sessionStorage.getItem("private-backup-code")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "I saved my codes" }));
  expect(await screen.findByRole("heading", { name: "Welcome destination" })).toBeVisible();
  expect(screen.queryByText("private-backup-code")).not.toBeInTheDocument();
});
it("keeps failed challenges recoverable and allows provider recovery-code verification", async () => {
  mocks.mfa = "required"; mocks.verifySecondFactor.mockRejectedValueOnce(new Error("Code failed")); open(true);
  fireEvent.change(screen.getByLabelText("Authenticator code"), { target: { value: "123456" } });
  fireEvent.click(screen.getByRole("button", { name: "Verify" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Code failed");
  expect(screen.queryByText("Dashboard destination")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Use a recovery code" }));
  fireEvent.change(screen.getByLabelText("Recovery code"), { target: { value: "backup" } });
  fireEvent.click(screen.getByRole("button", { name: "Verify" }));
  await waitFor(() => expect(mocks.verifySecondFactor).toHaveBeenLastCalledWith("backup", true));
  expect(await screen.findByRole("heading", { name: "Dashboard destination" })).toBeVisible();
});
it("reports unavailable recovery issuance instead of claiming full setup success", async () => {
  mocks.approved = true; mocks.generate.mockResolvedValue({ data: null, error: { code: "mfa_recovery_codes_enroll_not_enabled" } }); open();
  fireEvent.change(await screen.findByLabelText("Confirm your password"), { target: { value: "password" } });
  fireEvent.click(screen.getByRole("button", { name: "Set up authenticator" }));
  await screen.findByText("private-setup-key");
  fireEvent.change(screen.getByLabelText("Authenticator code"), { target: { value: "123456" } });
  fireEvent.click(screen.getByRole("button", { name: "Verify" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Recovery codes could not be issued");
  expect(screen.queryByText("Save your recovery codes")).not.toBeInTheDocument();
});

function existingAuthenticator() {
  mocks.approved = true;
  mocks.listFactors.mockResolvedValue({ data: { all: [{ id: "existing", factor_type: "totp", status: "verified" }], totp: [{ id: "existing", status: "verified" }] }, error: null });
  mocks.getStatus.mockResolvedValue({ data: { remaining: 2 }, error: null });
}
async function fillFreshCredentials() {
  fireEvent.change(await screen.findByLabelText("Confirm your password"), { target: { value: "password" } });
  fireEvent.change(screen.getByLabelText("Authenticator code"), { target: { value: "123456" } });
}
it("reauthenticates and verifies the existing factor before recovery rotation", async () => {
  existingAuthenticator();
  mocks.regenerate.mockResolvedValue({ data: { codes: ["replacement-code"], total: 1 }, error: null }); open();
  await fillFreshCredentials();
  fireEvent.click(screen.getByRole("button", { name: "Replace recovery codes" }));
  expect(await screen.findByText("replacement-code")).toBeVisible();
  expect(mocks.signInWithPassword).toHaveBeenCalled();
  expect(mocks.verifySecondFactor).toHaveBeenCalledWith("123456", false);
  expect(mocks.regenerate).toHaveBeenCalledOnce();
});
it("requires explicit disable confirmation and revokes sessions only after factor removal", async () => {
  existingAuthenticator(); mocks.unenroll.mockResolvedValue({ error: null }); mocks.signOut.mockResolvedValue({ error: null }); open();
  await fillFreshCredentials();
  fireEvent.click(screen.getByRole("button", { name: "Disable two-factor authentication" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Confirm that you want to disable");
  expect(mocks.unenroll).not.toHaveBeenCalled();
  await fillFreshCredentials();
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Disable two-factor authentication" }));
  expect(await screen.findByRole("heading", { name: "Sign-in destination" })).toBeVisible();
  expect(mocks.verifySecondFactor).toHaveBeenCalledWith("123456", false);
  expect(mocks.unenroll).toHaveBeenCalledWith({ factorId: "existing" });
  expect(mocks.signOut).toHaveBeenCalledWith({ scope: "global" });
});
it("retains protection on a recovery-removal error instead of blindly disabling factors", async () => {
  existingAuthenticator(); mocks.unenroll.mockResolvedValue({ error: { code: "unavailable" } }); open();
  await fillFreshCredentials(); fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Disable two-factor authentication" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Authenticator protection remains");
  expect(mocks.unenroll).toHaveBeenCalledOnce();
  expect(mocks.signOut).not.toHaveBeenCalled();
});
