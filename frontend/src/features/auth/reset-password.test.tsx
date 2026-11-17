import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, expect, it, vi } from "vitest";
import { ResetPasswordPage } from "./reset-password";

const mocks = vi.hoisted(() => ({ open: vi.fn(), save: vi.fn(), end: vi.fn(), current: vi.fn() }));
vi.mock("@/auth/recovery", () => ({
  consumeRecoveryLocation: () => ({ code: "code", flowId: undefined }),
  openRecovery: mocks.open, replaceRecoveredPassword: mocks.save,
}));
vi.mock("@/auth/transport", () => ({ endCurrentAccountAccess: mocks.end, isCurrentAccount: mocks.current }));

function open() {
  render(<MemoryRouter initialEntries={["/reset-password"]}><Routes>
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/sign-in" element={<h1>Sign-in destination</h1>} />
  </Routes></MemoryRouter>);
}
async function fill() {
  fireEvent.change(await screen.findByLabelText("New password"), { target: { value: "new-password" } });
  fireEvent.change(screen.getByLabelText("Confirm new password"), { target: { value: "new-password" } });
}
beforeEach(() => {
  vi.resetAllMocks(); mocks.open.mockResolvedValue({ mfaRequired: false });
  mocks.save.mockResolvedValue({ complete: true, userId: "owner" });
  mocks.current.mockReturnValue(true);
});

it("blocks invalid callbacks instead of displaying an editable password form", async () => {
  mocks.open.mockRejectedValue(new Error("expired")); open();
  expect(await screen.findByRole("alert")).toHaveTextContent("cannot be used");
  expect(screen.queryByLabelText("New password")).not.toBeInTheDocument();
  expect(mocks.save).not.toHaveBeenCalled();
});

it("validates matching passwords, accepts MFA and returns to sign-in on confirmed success", async () => {
  mocks.open.mockResolvedValue({ mfaRequired: true }); open(); await fill();
  fireEvent.change(screen.getByLabelText("Authenticator code"), { target: { value: "123456" } });
  fireEvent.change(screen.getByLabelText("Confirm new password"), { target: { value: "different" } });
  fireEvent.click(screen.getByRole("button", { name: "Save new password" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("same password twice");
  expect(mocks.save).not.toHaveBeenCalled();
  fireEvent.change(screen.getByLabelText("Confirm new password"), { target: { value: "new-password" } });
  fireEvent.change(screen.getByLabelText("Authenticator code"), { target: { value: "123456" } });
  fireEvent.click(screen.getByRole("button", { name: "Save new password" }));
  expect(await screen.findByRole("heading", { name: "Sign-in destination" })).toBeVisible();
  expect(mocks.save).toHaveBeenCalledWith("new-password", "123456", false);
  expect(mocks.end).toHaveBeenCalledTimes(1);
});

it("handles partial success honestly and never clears a different account", async () => {
  mocks.current.mockReturnValue(false);
  mocks.save.mockResolvedValueOnce({ complete: false, userId: "owner" });
  open(); await fill(); fireEvent.click(screen.getByRole("button", { name: "Save new password" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Your password changed");
  expect(screen.queryByLabelText("New password")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Finish signing out" }));
  expect(await screen.findByRole("heading", { name: "Sign-in destination" })).toBeVisible();
  expect(mocks.save).toHaveBeenLastCalledWith("", "", false);
  expect(mocks.end).not.toHaveBeenCalled();
});
