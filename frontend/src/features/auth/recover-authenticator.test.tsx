import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, expect, it, vi } from "vitest";
import { RecoverAuthenticator } from "./recover-authenticator";

const mocks = vi.hoisted(() => ({ begin: vi.fn(), prepare: vi.fn(), finish: vi.fn(),
  setSession: vi.fn(), refresh: vi.fn(), signOut: vi.fn(), owner: "owner" }));
vi.mock("@/auth/recovery-codes", () => ({ beginRecovery: mocks.begin, prepareRecovery: mocks.prepare,
  finishRecovery: mocks.finish }));
vi.mock("@/auth/supabase", () => ({ supabase: { auth: { setSession: mocks.setSession } } }));
vi.mock("@/auth/context", () => ({ useAuth: () => ({ user: { id: mocks.owner },
  refreshAssurance: mocks.refresh, signOut: mocks.signOut }) }));
beforeEach(() => {
  vi.resetAllMocks(); mocks.owner = "owner";
  mocks.begin.mockResolvedValue({ token: "private-capability" });
  mocks.prepare.mockResolvedValue({ secret: "private-seed", qr: "data:image/svg+xml,test" });
  mocks.finish.mockResolvedValue({ access_token: "private-access", refresh_token: "private-refresh",
    codes: ["replacement-backup"], total: 1 });
  mocks.setSession.mockResolvedValue({ error: null });
  mocks.refresh.mockResolvedValue(undefined);
});
function page() { return <MemoryRouter><RecoverAuthenticator /></MemoryRouter>; }
function fill(password = "password", code = "unused-backup") {
  fireEvent.change(screen.getByLabelText("Confirm your password"), { target: { value: password } });
  fireEvent.change(screen.getByLabelText("Recovery code"), { target: { value: code } });
}
it("requires a replacement authenticator before adopting the real recovered session", async () => {
  render(page()); fill(); fireEvent.click(screen.getByRole("button", { name: "Recover authenticator" }));
  expect(await screen.findByText("private-seed")).toBeVisible();
  expect(mocks.setSession).not.toHaveBeenCalled();
  expect(screen.getByLabelText("Confirm your password")).toHaveValue("");
  fireEvent.change(screen.getByLabelText("Confirm your password"), { target: { value: "password" } });
  fireEvent.change(screen.getByLabelText("New authenticator code"), { target: { value: "123456" } });
  fireEvent.click(screen.getByRole("button", { name: "Verify replacement authenticator" }));
  expect(await screen.findByText("replacement-backup")).toBeVisible();
  expect(mocks.finish).toHaveBeenCalledWith("password", "private-capability", "123456");
  expect(mocks.setSession).toHaveBeenCalledOnce();
  expect(localStorage.getItem("private-capability")).toBeNull();
  expect(sessionStorage.getItem("private-capability")).toBeNull();
});
it("retains the recovery capability for setup retries without consuming another code", async () => {
  mocks.prepare.mockRejectedValueOnce(new Error("Provider unavailable"));
  render(page()); fill(); fireEvent.click(screen.getByRole("button", { name: "Recover authenticator" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Provider unavailable");
  fireEvent.change(screen.getByLabelText("Confirm your password"), { target: { value: "password" } });
  fireEvent.click(screen.getByRole("button", { name: "Retry replacement setup" }));
  expect(await screen.findByText("private-seed")).toBeVisible();
  expect(mocks.begin).toHaveBeenCalledTimes(1);
  expect(mocks.setSession).not.toHaveBeenCalled();
});
it("does not adopt a session after recovery UI unmounts", async () => {
  let complete!: (value: { access_token: string; refresh_token: string; codes: string[] }) => void;
  mocks.finish.mockReturnValue(new Promise(resolve => { complete = resolve; }));
  const view = render(page()); fill(); fireEvent.click(screen.getByRole("button", { name: "Recover authenticator" }));
  await screen.findByText("private-seed");
  fireEvent.change(screen.getByLabelText("Confirm your password"), { target: { value: "password" } });
  fireEvent.change(screen.getByLabelText("New authenticator code"), { target: { value: "123456" } });
  fireEvent.click(screen.getByRole("button", { name: "Verify replacement authenticator" }));
  await waitFor(() => expect(mocks.finish).toHaveBeenCalledOnce()); view.unmount();
  complete({ access_token: "old-access", refresh_token: "old-refresh", codes: [] });
  await Promise.resolve();
  expect(mocks.setSession).not.toHaveBeenCalled();
});
