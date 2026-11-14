import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { expect, it, vi } from "vitest";
import { useCoreMutation, useCoreQuery } from "@/features/core/data";
import { RoadmapPage } from "./page";

vi.mock("@/features/core/data", () => ({ coreApi: {}, useCoreQuery: vi.fn(), useCoreMutation: vi.fn() }));

it("waits for all roadmap reads before focusing a requested milestone", async () => {
  const data: Record<string, unknown> = {
    career: { id: "career", title: "Career", roadmap_ids: ["roadmap"], skills: [], responsibilities: [] },
    categories: [], learning: { current_roadmap_id: "roadmap", version: 1 }, progress: [], branches: [],
    roadmap: { id: "roadmap", career_id: "career", status: "published", milestones: [{ id: "first", title: "Foundations", topics: [], branch_groups: [] }] },
  };
  vi.mocked(useCoreQuery).mockImplementation(key => ({ data: key[0] === "roadmap-view" ? (data.summary ? {roadmap:data.roadmap,learning_state:data.learning,progress:data.progress,summary:data.summary,branches:data.branches} : undefined) : data[String(key[0])], error: null }) as never);
  vi.mocked(useCoreMutation).mockReturnValue({ isPending: false, error: null } as never);
  const scroll = HTMLElement.prototype.scrollIntoView;
  HTMLElement.prototype.scrollIntoView = vi.fn();
  function App() { return <MemoryRouter initialEntries={["/roadmaps/career#milestone-first"]}><Routes><Route path="/roadmaps/:careerId" element={<RoadmapPage />} /></Routes></MemoryRouter>; }
  try {
    const view = render(<App />);
    expect(screen.getByRole("heading", { name: "Loading your roadmap" })).toBeVisible();
    data.summary = { milestones: [], done: 0, applicable: 0, percentage: null };
    view.rerender(<App />);
    await waitFor(() => expect(document.getElementById("milestone-first")).toHaveFocus());
  } finally {
    HTMLElement.prototype.scrollIntoView = scroll;
  }
});
