import { act, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { beforeEach, expect, it, vi } from "vitest";
import { AuthProvider } from "./provider";
import { useAuth } from "./context";

const mocks = vi.hoisted(() => ({ getSession: vi.fn(), signOut: vi.fn(), checkAssurance: vi.fn(),
  callback: null as null | ((event: string, session: Session | null) => void),
}));
vi.mock("./supabase", () => ({ supabase: { auth: {
  getSession: mocks.getSession, signOut: mocks.signOut,
  onAuthStateChange: (callback: typeof mocks.callback) => {
    mocks.callback = callback; return { data: { subscription: { unsubscribe: vi.fn() } } };
  },
} } }));
vi.mock("./mfa", () => ({ checkAssurance: mocks.checkAssurance }));
function State() {
  const auth = useAuth();
  return <output>{auth.user?.id ?? "none"}|{auth.mfa}|{auth.error ?? "ok"}</output>;
}
const session = (id: string) => ({ user: { id }, access_token: id + "-token" }) as Session;
function open() {
  render(<QueryClientProvider client={new QueryClient()}><AuthProvider><State /></AuthProvider></QueryClientProvider>);
}
beforeEach(() => { vi.resetAllMocks(); mocks.callback = null; });

it("checks restored sessions before allowing protected data", async () => {
  mocks.getSession.mockResolvedValue({ data: { session: session("owner") }, error: null });
  mocks.checkAssurance.mockResolvedValue("required"); open();
  expect(await screen.findByText("owner|required|ok")).toBeVisible();
  expect(mocks.checkAssurance).toHaveBeenCalledWith("owner-token");
});
it("does not restore a stale session over a newer sign-in event", async () => {
  let restore!: (value: unknown) => void;
  mocks.getSession.mockReturnValue(new Promise(resolve => { restore = resolve; }));
  mocks.checkAssurance.mockResolvedValue("ready"); open();
  act(() => mocks.callback!("SIGNED_IN", session("new")));
  expect(await screen.findByText("new|ready|ok")).toBeVisible();
  await act(async () => restore({ data: { session: session("old") }, error: null }));
  expect(screen.getByText("new|ready|ok")).toBeVisible();
});
it("ignores a late assurance response after sign-out", async () => {
  let resolveAssurance!: (value: string) => void;
  mocks.getSession.mockResolvedValue({ data: { session: session("owner") }, error: null });
  mocks.checkAssurance.mockReturnValue(new Promise(resolve => { resolveAssurance = resolve; })); open();
  await waitFor(() => expect(mocks.checkAssurance).toHaveBeenCalled());
  act(() => mocks.callback!("SIGNED_OUT", null));
  await act(async () => resolveAssurance("ready"));
  expect(screen.getByText("none|ready|ok")).toBeVisible();
});
it("fails closed with an actionable error when factor lookup is unavailable", async () => {
  mocks.getSession.mockResolvedValue({ data: { session: session("owner") }, error: null });
  mocks.checkAssurance.mockRejectedValue(new Error("provider unavailable")); open();
  expect(await screen.findByText(/owner\|checking\|Could not check account security/)).toBeVisible();
});
