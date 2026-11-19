import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { ChangePassword } from "./change-password";
const mocks = vi.hoisted(() => ({ request: vi.fn(), cooldown: vi.fn() }));
vi.mock("@/auth/context", () => ({ useAuth: () => ({ user: { id: "owner", email: "owner@example.test" } }) }));
vi.mock("@/auth/transport", () => ({ isCurrentAccount: () => true }));
vi.mock("@/auth/recovery", () => ({ requestRecovery: mocks.request, recoveryCooldown: mocks.cooldown, recoveryAcknowledgment: "Instructions requested." }));
beforeEach(() => { vi.resetAllMocks(); mocks.cooldown.mockReturnValue(0); });
it("requests recovery for the signed-in account", async () => {
  mocks.request.mockResolvedValue(undefined);
  render(<ChangePassword />);
  fireEvent.click(screen.getByRole("button", { name: "Send password reset email" }));
  expect(await screen.findByRole("status")).toHaveTextContent("Instructions requested.");
  expect(mocks.request).toHaveBeenCalledWith("owner@example.test");
});
it("shows delivery failures", async () => {
  mocks.request.mockRejectedValue(new Error("Delivery unavailable"));
  render(<ChangePassword />);
  fireEvent.click(screen.getByRole("button"));
  expect(await screen.findByRole("alert")).toHaveTextContent("Delivery unavailable");
});
it("respects the shared cooldown", () => {
  mocks.cooldown.mockReturnValue(45);
  render(<ChangePassword />);
  expect(screen.getByRole("button", { name: "Send again in 45s" })).toBeDisabled();
});
