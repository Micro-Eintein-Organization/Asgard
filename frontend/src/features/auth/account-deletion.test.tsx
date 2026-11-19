import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, expect, it, vi } from "vitest";
import { AccountDeletion } from "./account-deletion";

const mocks = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), end: vi.fn(), current: vi.fn() }));
vi.mock("@/auth/context", () => ({ useAuth: () => ({ user: { id: "owner" } }) }));
vi.mock("@/api/client", () => ({ api: { GET: mocks.get, POST: mocks.post } }));
vi.mock("@/auth/transport", () => ({ endAcceptedDeletion: mocks.end, isCurrentAccount: mocks.current }));
vi.mock("@/auth/supabase", () => ({ supabase: null, authStorageKey: "fixture-auth" }));

function open() {
  render(<QueryClientProvider client={new QueryClient({ defaultOptions: {
    queries: { retry: false },
  } })}><AccountDeletion /></QueryClientProvider>);
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.current.mockReturnValue(true);
  mocks.get.mockResolvedValue({ data: { enabled: true, mfa_required: true } });
});

it("keeps unavailable deletion disabled", async () => {
  mocks.get.mockResolvedValue({ data: { enabled: false, mfa_required: false } });
  open();
  await screen.findByRole("status");
  expect(screen.getByRole("button", { name: "Delete account" })).toBeDisabled();
  expect(mocks.post).not.toHaveBeenCalled();
});

it("retries a failed availability check", async () => {
  mocks.get.mockRejectedValueOnce(new Error("Network error"));
  open();
  fireEvent.click(await screen.findByRole("button", { name: "Try again" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Delete account" })).toBeEnabled());
  expect(mocks.post).not.toHaveBeenCalled();
});

it("requires confirmation, clears canceled credentials and preserves access on rejection", async () => {
  mocks.post.mockResolvedValue({ error: { message: "Verification failed." } });
  open();
  await waitFor(() => expect(screen.getByRole("button", { name: "Delete account" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Delete account" }));
  expect(screen.getByRole("button", { name: "Permanently delete account" })).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Confirm your password"), { target: { value: "private-password" } });
  fireEvent.change(screen.getByLabelText("Authenticator code"), { target: { value: "123456" } });
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(mocks.post).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Delete account" }));
  expect(screen.getByLabelText("Confirm your password")).toHaveValue("");
  expect(screen.getByLabelText("Authenticator code")).toHaveValue("");
  fireEvent.change(screen.getByLabelText("Confirm your password"), { target: { value: "private-password" } });
  fireEvent.change(screen.getByLabelText("Authenticator code"), { target: { value: "123456" } });
  fireEvent.change(screen.getByLabelText("Type DELETE to confirm"), { target: { value: "DELETE" } });
  fireEvent.click(screen.getByRole("button", { name: "Permanently delete account" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Verification failed.");
  expect(mocks.end).not.toHaveBeenCalled();
  expect(mocks.post).toHaveBeenCalledTimes(1);
});

it("does not clear a replacement account when an old request completes", async () => {
  mocks.current.mockReturnValue(false);
  mocks.get.mockResolvedValue({ data: { enabled: true, mfa_required: false } });
  mocks.post.mockResolvedValue({ data: { status: "accepted" } });
  open();
  await waitFor(() => expect(screen.getByRole("button", { name: "Delete account" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Delete account" }));
  fireEvent.change(screen.getByLabelText("Confirm your password"), { target: { value: "private-password" } });
  fireEvent.change(screen.getByLabelText("Type DELETE to confirm"), { target: { value: "DELETE" } });
  fireEvent.click(screen.getByRole("button", { name: "Permanently delete account" }));
  await waitFor(() => expect(mocks.current).toHaveBeenCalledWith("owner"));
  expect(mocks.end).not.toHaveBeenCalled();
});
