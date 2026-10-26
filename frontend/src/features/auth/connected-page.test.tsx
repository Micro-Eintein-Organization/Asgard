import { beforeEach, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { AuthContext } from "@/auth/context";
import { ConnectedAuthPage } from "./connected-page";
import { WelcomePage } from "@/features/discovery/page";

const authMocks = vi.hoisted(() => ({
  verifyOtp: vi.fn(),
  resend: vi.fn(),
}));

vi.mock("@/auth/supabase", () => ({
  authConfigured: true,
  supabase: { auth: authMocks },
}));

beforeEach(() => {
  sessionStorage.clear();
  vi.clearAllMocks();
});

function renderVerificationPage(mode: "verify" | "recovery" = "verify") {
  return render(
    <MemoryRouter>
      <AuthContext.Provider
        value={{
          user: null,
          loading: false,
          error: null,
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
  expect(
    await screen.findByRole("heading", {
      name: "How would you like to begin?",
    }),
  ).toBeVisible();
  expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
  fireEvent.click(screen.getByRole("radio", { name: new RegExp(choice) }));
  fireEvent.click(screen.getByRole("link", { name: "Continue" }));
  expect(
    await screen.findByRole("heading", { name: destination }),
  ).toBeVisible();
  expect(sessionStorage.getItem("asgard.signup-email")).toBeNull();
});

it("keeps recovery clearly unavailable without calling the provider", () => {
  renderVerificationPage("recovery");
  expect(
    screen.getByRole("heading", { name: "Reset your password." }),
  ).toBeVisible();
  expect(
    screen.getByRole("button", { name: "Send recovery instructions" }),
  ).toBeDisabled();
  expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
  expect(authMocks.verifyOtp).not.toHaveBeenCalled();
  expect(authMocks.resend).not.toHaveBeenCalled();
});
