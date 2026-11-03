import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCoreQuery } from "@/features/core/data";
import { CareerDestination, CareerNavigation } from "./career-navigation";

vi.mock("@/features/core/data", () => ({
  coreApi: {}, useCoreQuery: vi.fn(),
}));
const reload = vi.fn();
let focus: string | null;
let pending: boolean;
let failed: boolean;
function SavedLocation() { const location = useLocation(); return <p>Saved roadmap destination {location.pathname}{location.search}</p>; }
function Destination() {
  return <MemoryRouter initialEntries={["/roadmaps"]}><Routes>
    <Route path="/roadmaps" element={<CareerDestination />} />
    <Route path="/careers" element={<p>Catalog destination</p>} />
    <Route path="/roadmaps/:career" element={<SavedLocation />} />
  </Routes></MemoryRouter>;
}
beforeEach(() => {
  focus = "saved-roadmap"; pending = false; failed = false; reload.mockClear();
  vi.mocked(useCoreQuery).mockImplementation((key) => ({
    data: pending ? undefined : key[0] === "learning" ? {current_roadmap_id: focus} : {career_id: "saved-career"},
    error: failed ? new Error("Unavailable") : null, refetch: reload,
  }) as never);
});
describe("saved Career navigation", () => {
  it("opens the saved roadmap instead of catalog", () => {
    render(<Destination />);
    expect(screen.getByText("Saved roadmap destination /roadmaps/saved-career?roadmap=saved-roadmap")).toBeVisible();
    expect(screen.queryByText("Catalog destination")).toBeNull();
  });
  it("opens catalog only when no roadmap has been saved", () => {
    focus = null; render(<Destination />);
    expect(screen.getByText("Catalog destination")).toBeVisible();
  });
  it("does not flash catalog while saved focus is loading", () => {
    pending = true; render(<Destination />);
    expect(screen.getByRole("status")).toHaveTextContent("Opening your saved learning path");
    expect(screen.queryByText("Catalog destination")).toBeNull();
  });
  it("offers retry and explicit catalog navigation on failure", () => {
    failed = true; render(<Destination />);
    fireEvent.click(screen.getByRole("button", {name: "Reload saved focus"}));
    expect(reload).toHaveBeenCalled();
    expect(screen.getByRole("link", {name:"Browse careers"})).toHaveAttribute("href", "/careers");
    expect(screen.queryByText("Catalog destination")).toBeNull();
  });
  it("keeps the main Career action separate from its dropdown", () => {
    render(<MemoryRouter><CareerNavigation /></MemoryRouter>);
    expect(screen.getByRole("link", {name: "Career"})).toHaveAttribute("href", "/roadmaps");
    expect(screen.getByRole("button", {name: "Career destinations"})).toBeVisible();
  });
  it("uses the newly saved focus when Career is reopened", () => {
    const first = render(<Destination />);
    first.unmount();
    focus = "newly-saved-roadmap";
    render(<Destination />);
    expect(screen.getByText("Saved roadmap destination /roadmaps/saved-career?roadmap=newly-saved-roadmap")).toBeVisible();
  });
});
