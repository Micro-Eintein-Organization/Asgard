import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, expect, it, vi } from "vitest";
import { useCoreQuery } from "@/features/core/data";
import { PostSignInDestination } from "./entry-destination";
import { hasEntryChoice, rememberEntryChoice } from "./entry-choice";

vi.mock("@/auth/context", () => ({ useAuth: () => ({ user: { id: "owner" } }) }));
vi.mock("@/features/core/data", () => ({ coreApi: {}, useCoreQuery: vi.fn() }));

beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });

function open() {
  render(<MemoryRouter><Routes>
    <Route path="/" element={<PostSignInDestination />} />
    <Route path="/welcome" element={<h1>Choose your path</h1>} />
    <Route path="/dashboard" element={<h1>Your Dashboard</h1>} />
  </Routes></MemoryRouter>);
}

it("offers Discovery or browsing to an account without saved context", async () => {
  vi.mocked(useCoreQuery).mockReturnValue({ data: { returning: false } } as never);
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
