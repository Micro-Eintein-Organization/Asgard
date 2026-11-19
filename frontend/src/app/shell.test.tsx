import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, expect, it, vi } from "vitest";
import { Header } from "./shell";
import { InformationPage } from "./information";

const state = vi.hoisted(() => ({
  user: { id: "owner", email: "owner@example.test", email_confirmed_at: "confirmed" } as { id: string; email: string; email_confirmed_at: string } | null,
  loading: false, error: null as string | null, mfa: "ready",
}));
vi.mock("@/auth/context", () => ({ useAuth: () => state }));
vi.mock("@/features/profile/identity", () => ({ useSavedProfile: () => ({ data: null }), AccountAvatar: () => <span>Avatar</span> }));
vi.mock("./logout", () => ({ useLogout: () => async () => { state.user = null; } }));
vi.mock("./career-navigation", () => ({ CareerNavigation: () => <a href="/roadmaps">Career</a> }));
beforeEach(() => {
  state.user = { id: "owner", email: "owner@example.test", email_confirmed_at: "confirmed" };
  state.loading = false; state.error = null; state.mfa = "ready";
});
function open(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><Header /><InformationPage page="credits" /></MemoryRouter>);
}
it.each(["/licenses", "/credits", "/terms", "/status", "/credits/", "/set-up-2fa", "/password-recovery"])("retains account navigation on %s and updates after logout", path => {
  const view = open(path);
  expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/dashboard");
  expect(screen.getByRole("button", { name: "Account menu" })).toBeInTheDocument();
  expect(screen.queryByText("Get started")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Asgard home" })).toHaveAttribute("href", "/dashboard");
  expect(screen.getByRole("link", { name: "Back to Asgard" })).toHaveAttribute("href", "/dashboard");
  fireEvent.click(screen.getByRole("button", { name: "Menu" }));
  expect(screen.getAllByRole("navigation", { name: "Main navigation" })).toHaveLength(2);
  state.user = null;
  view.rerender(<MemoryRouter initialEntries={[path]}><Header /><InformationPage page="credits" /></MemoryRouter>);
  expect(screen.getByRole("link", { name: "Log in" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Back to Asgard" })).toHaveAttribute("href", "/");
});
it.each(["/licenses", "/credits", "/terms", "/status"])("offers public navigation signed out on %s", path => {
  state.user = null; open(path);
  expect(screen.getByRole("link", { name: "Get started" })).toHaveAttribute("href", "/create-account");
});
it.each(["loading", "checking", "required", "unverified", "error"])("handles %s without signed-out prompts", phase => {
  if (phase === "loading") { state.user = null; state.loading = true; }
  if (phase === "checking" || phase === "required") state.mfa = phase;
  if (phase === "unverified") state.user!.email_confirmed_at = "";
  if (phase === "error") state.error = "Session unavailable";
  open("/set-up-2fa");
  expect(screen.queryByText("Get started")).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Account menu" })).not.toBeInTheDocument();
  if (phase === "loading" || phase === "checking") expect(screen.getByRole("status")).toBeInTheDocument();
  else expect(screen.getByRole("link", { name: phase === "error" ? "Sign in again" : "Continue to account" })).toHaveAttribute("href", phase === "error" ? "/sign-in" : phase === "unverified" ? "/check-email" : "/verify-2fa");
});
