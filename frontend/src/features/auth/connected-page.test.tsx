import { beforeEach, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router";
import { AuthContext } from "@/auth/context";
import { ConnectedAuthPage } from "./connected-page";
import { WelcomePage } from "@/features/discovery/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const authMocks = vi.hoisted(() => ({
  signUp: vi.fn(),
  verifyOtp: vi.fn(),
  resend: vi.fn(),
  requestRecovery: vi.fn(),
}));

vi.mock("@/auth/supabase", () => ({
  authConfigured: true,
  supabase: { auth: authMocks },
}));
vi.mock("@/auth/recovery", () => ({
  requestRecovery: authMocks.requestRecovery, recoveryCooldown: () => 0,
  recoveryAcknowledgment: "If an account can use password recovery, we’ll send instructions.",
}));

beforeEach(() => {
  sessionStorage.clear();
  vi.clearAllMocks();
});

function renderVerificationPage(mode: "verify" | "recovery" | "register" | "login" = "verify", authError: string | null = null) {
  return render(
    <QueryClientProvider client={new QueryClient()}><MemoryRouter>
      <AuthContext.Provider
        value={{
          user: null,
          loading: false,
          error: authError,
          mfa: "ready",
          refreshAssurance: async () => {},
          signOut: async () => {},
        }}
      >
        <Routes>
          <Route path="/" element={<ConnectedAuthPage mode={mode} />} />
          <Route
            path="/create-account"
            element={<h1>Create an account destination</h1>}
          />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/set-up-2fa" element={<><h1>Protect your account</h1><Link to="/welcome">Skip for now</Link></>} />
          <Route
            path="/careers"
            element={<h1>Career catalog destination</h1>}
          />
          <Route
            path="/discovery"
            element={<h1>Discovery questionnaire destination</h1>}
          />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter></QueryClientProvider>,
  );
}

it.each(["login", "register"] as const)("explains session errors on %s without hiding the form", mode => {
  renderVerificationPage(mode, "Could not check account security. Sign in again.");
  expect(screen.getByRole("alert")).toHaveTextContent("Could not check account security. Sign in again.");
  expect(screen.getByLabelText("Email")).toBeVisible();
  expect(screen.getByLabelText("Password")).toBeVisible();
  expect(screen.getByRole("button", { name: mode === "login" ? "Sign in" : "Send email code" })).toBeEnabled();
});

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

it.each([
  { data: { user: { identities: [] }, session: null }, error: null },
  { data: {}, error: { code: "user_already_exists" } },
])("keeps duplicate signup out of verification", async response => {
  authMocks.signUp.mockResolvedValue(response);
  renderVerificationPage("register");
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "owner@example.test" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
  fireEvent.change(screen.getByLabelText("Confirm password"), { target: { value: "password123" } });
  fireEvent.click(screen.getByRole("button", { name: "Send email code" }));
  expect(await screen.findByText(/An account already exists/)).toBeVisible();
  expect(sessionStorage.getItem("asgard.signup-email")).toBeNull();
  expect(sessionStorage.getItem("asgard.resend-at")).toBeNull();
});

it("returns direct verification visits to account creation without a pending signup", async () => {
  renderVerificationPage();
  expect(
    await screen.findByRole("heading", {
      name: "Create an account destination",
    }),
  ).toBeVisible();
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

it.each([
  ["Browse careers", "Career catalog destination"],
  ["Guided Discovery", "Discovery questionnaire destination"],
])("verified registration offers the %s path", async (choice, destination) => {
  sessionStorage.setItem("asgard.signup-email", "owner@example.test");
  authMocks.verifyOtp.mockResolvedValue({ error: null });
  renderVerificationPage();

  fireEvent.change(screen.getByLabelText("Email confirmation code"), {
    target: { value: "123456" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Verify" }));
  expect(await screen.findByRole("heading", { name: "Protect your account" })).toBeVisible();
  fireEvent.click(screen.getByRole("link", { name: "Skip for now" }));
  expect(
    await screen.findByRole("heading", {
      name: "How would you like to begin?",
    }),
  ).toBeVisible();
  expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
  fireEvent.click(screen.getByRole("radio", { name: new RegExp(choice) }));
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  expect(
    await screen.findByRole("heading", { name: destination }),
  ).toBeVisible();
  expect(sessionStorage.getItem("asgard.signup-email")).toBeNull();
});

it("requests recovery without revealing account existence or calling signup verification", async () => {
  authMocks.requestRecovery.mockResolvedValue(undefined);
  renderVerificationPage("recovery");
  expect(
    screen.getByRole("heading", { name: "Reset your password." }),
  ).toBeVisible();
  expect(
    screen.getByRole("button", { name: "Send recovery instructions" }),
  ).toBeEnabled();
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "owner@example.test" } });
  fireEvent.click(screen.getByRole("button", { name: "Send recovery instructions" }));
  expect(await screen.findByRole("status")).toHaveTextContent("If an account can use password recovery");
  expect(authMocks.requestRecovery).toHaveBeenCalledWith("owner@example.test");
  expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
  expect(authMocks.verifyOtp).not.toHaveBeenCalled();
  expect(authMocks.resend).not.toHaveBeenCalled();
});
