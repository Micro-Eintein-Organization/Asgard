import { fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, expect, it, vi } from "vitest";
import { useCoreQuery } from "@/features/core/data";
import { PostSignInDestination } from "./entry-destination";
import { hasEntryChoice, rememberEntryChoice } from "./entry-choice";

const mocks = vi.hoisted(() => ({ discovery: vi.fn(), learning: vi.fn(), listFactors: vi.fn() }));
vi.mock("@/auth/context", () => ({ useAuth: () => ({ user: { id: "owner" } }) }));
vi.mock("@/auth/supabase", () => ({ supabase: { auth: { mfa: { listFactors: mocks.listFactors } } } }));
vi.mock("@/features/core/data", () => ({ coreApi: { discovery: mocks.discovery, learning: mocks.learning }, useCoreQuery: vi.fn() }));

beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });

function open() {
  render(<MemoryRouter><Routes>
    <Route path="/" element={<PostSignInDestination />} />
    <Route path="/welcome" element={<h1>Choose your path</h1>} />
    <Route path="/set-up-2fa" element={<><h1>Protect your account</h1><Link to="/welcome">Skip for now</Link></>} />
    <Route path="/dashboard" element={<h1>Your Dashboard</h1>} />
  </Routes></MemoryRouter>);
}

it("offers optional 2FA before the entry choice without looping after skip", async () => {
  vi.mocked(useCoreQuery).mockReturnValue({ data: { returning: false, hasAuthenticator: false } } as never);
  open();
  expect(await screen.findByText("Protect your account")).toBeVisible();
  fireEvent.click(screen.getByRole("link", { name: "Skip for now" }));
  expect(await screen.findByText("Choose your path")).toBeVisible();
  expect(screen.queryByText("Protect your account")).not.toBeInTheDocument();
});

it("does not offer enrollment to an account with an authenticator", async () => {
  vi.mocked(useCoreQuery).mockReturnValue({ data: { returning: false, hasAuthenticator: true } } as never);
  open();
  expect(await screen.findByText("Choose your path")).toBeVisible();
});

it("returns an established learner to Dashboard", async () => {
  vi.mocked(useCoreQuery).mockReturnValue({ data: { returning: true } } as never);
  open();
  expect(await screen.findByText("Your Dashboard")).toBeVisible();
});

it("honors an explicit browsing choice without requiring a Discovery record", async () => {
  rememberEntryChoice("owner");
  vi.mocked(useCoreQuery).mockReturnValue({} as never);
  open();
  expect(await screen.findByText("Your Dashboard")).toBeVisible();
});

it("keeps the browser choice scoped to its account", () => {
  rememberEntryChoice("other");
  expect(hasEntryChoice("owner")).toBe(false);
  expect(hasEntryChoice("other")).toBe(true);
});

it("does not silently skip onboarding when saved context cannot load", () => {
  vi.mocked(useCoreQuery).mockReturnValue({ error: new Error("Unavailable"), refetch: vi.fn() } as never);
  open();
  expect(screen.getByText("Could not load your starting page")).toBeVisible();
  expect(screen.getByRole("link", { name: "Choose how to begin" })).toHaveAttribute("href", "/welcome");
});

it.each([false, true])("checks verified provider factors for a new learner (enrolled: %s)", async enrolled => {
  mocks.discovery.mockResolvedValue({ draft: null, latest_completed: null });
  mocks.learning.mockResolvedValue({ current_roadmap_id: null });
  mocks.listFactors.mockResolvedValue({ data: { totp: [{ status: "unverified" }, ...(enrolled ? [{ status: "verified" }] : [])] }, error: null });
  vi.mocked(useCoreQuery).mockReturnValue({} as never);
  open();
  const load = vi.mocked(useCoreQuery).mock.calls[0][1];
  await expect(load()).resolves.toEqual({ returning: false, hasAuthenticator: enrolled });
});

it("does not treat a failed factor lookup as permission to skip setup", async () => {
  mocks.discovery.mockResolvedValue({});
  mocks.learning.mockResolvedValue({});
  mocks.listFactors.mockResolvedValue({ data: null, error: new Error("private provider details") });
  vi.mocked(useCoreQuery).mockReturnValue({} as never);
  open();
  await expect(vi.mocked(useCoreQuery).mock.calls[0][1]()).rejects.toThrow("Could not check your authenticator. Try again.");
});
