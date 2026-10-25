import { beforeEach, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AuthContext } from "@/auth/context";
import { ConnectedAuthPage } from "./connected-page";

const authMocks = vi.hoisted(() => ({
  verifyOtp: vi.fn(),
  resend: vi.fn(),
}));

vi.mock("@/auth/supabase", () => ({
  supabase: { auth: authMocks },
}));

beforeEach(() => {
  sessionStorage.clear();
  vi.clearAllMocks();
});

function renderVerificationPage() {
  return render(
    <MemoryRouter>
      <AuthContext.Provider
        value={{ user: null, loading: false, error: null, signOut: async () => {} }}
      >
        <ConnectedAuthPage mode="verify" />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

it("shows the destination address and a visible resend option", () => {
  sessionStorage.setItem("asgard.signup-email", "owner@example.test");
  sessionStorage.setItem("asgard.resend-at", String(Date.now() + 30_000));

  renderVerificationPage();

  expect(
    screen.getByText(/We sent a six-digit code to owner@example\.test/),
  ).toBeVisible();
  expect(
    screen.getByText(/request another code when the timer ends/),
  ).toBeVisible();
  expect(screen.getByRole("button", { name: /Resend code in/ })).toBeDisabled();
});

it("explains verification failures", async () => {
  sessionStorage.setItem("asgard.signup-email", "owner@example.test");
  authMocks.verifyOtp.mockResolvedValue({ error: new Error("expired") });

  renderVerificationPage();
  fireEvent.change(screen.getByLabelText("Email confirmation code"), {
    target: { value: "123456" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Verify" }));
  expect(
    await screen.findByText(
      "That code did not work or has expired. Check your latest email, or request a new code when the timer ends.",
    ),
  ).toBeVisible();
});

it("explains when a resend request fails", async () => {
  sessionStorage.setItem("asgard.signup-email", "owner@example.test");
  sessionStorage.setItem("asgard.resend-at", "0");
  authMocks.resend.mockResolvedValue({ error: new Error("offline") });

  renderVerificationPage();
  fireEvent.click(screen.getByRole("button", { name: "Resend code" }));
  expect(
    await screen.findByText(
      "We could not send another code. Check the email address and connection, then try again when the timer ends.",
    ),
  ).toBeVisible();
});
