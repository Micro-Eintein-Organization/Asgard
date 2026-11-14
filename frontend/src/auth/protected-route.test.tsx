import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { expect, it, vi } from "vitest";
import { ProtectedRoute } from "./protected-route";

const state = vi.hoisted(() => ({ mfa: "checking", error: null as string | null }));
vi.mock("./supabase", () => ({ authConfigured: true }));
vi.mock("./context", () => ({ useAuth: () => ({ user: { email_confirmed_at: "yes" }, loading: false, ...state }) }));
function open() {
  render(<MemoryRouter initialEntries={["/private"]}><Routes>
    <Route element={<ProtectedRoute />}><Route path="/private" element={<h1>Private data</h1>} /></Route>
    <Route path="/verify-2fa" element={<h1>Challenge destination</h1>} />
  </Routes></MemoryRouter>);
}
it.each(["checking", "required", "ready"])("guards direct navigation with %s assurance", async mfa => {
  state.mfa = mfa; state.error = null; open();
  if (mfa === "ready") expect(screen.getByText("Private data")).toBeVisible();
  else {
    expect(screen.queryByText("Private data")).not.toBeInTheDocument();
    if (mfa === "required") expect(await screen.findByText("Challenge destination")).toBeVisible();
    else expect(screen.getByText("Checking account security")).toBeVisible();
  }
});
it("does not expose private data on a failed security lookup", () => {
  state.mfa = "checking"; state.error = "Security unavailable"; open();
  expect(screen.getByText("Session unavailable")).toBeVisible();
  expect(screen.queryByText("Private data")).not.toBeInTheDocument();
});
