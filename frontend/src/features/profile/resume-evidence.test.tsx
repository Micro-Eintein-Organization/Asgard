import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { SavedResumeSkills } from "./resume-evidence";
import { MemoryRouter } from "react-router";

const state = vi.hoisted(() => ({ active: true }));
const save = vi.hoisted(() => vi.fn());
vi.mock("@/features/core/data", () => ({
  coreApi: { documents: vi.fn(), saveCompetency: save },
  useCoreQuery: (key: string[]) => {
    if (key[0] === "career-skill-matches") return { data: { items: [], interpretation: { status: "completed" } } };
    return { data: { active: state.active ? { evidence: [
      { kind: "skill", text: "SQL, Python", page: 1, span: "Skills: SQL, Python" },
      { kind: "education", text: "Statistics", page: 1, span: "Statistics" },
    ] } : null } };
  },
}));
afterEach(() => { state.active = true; vi.clearAllMocks(); });

it("shows saved resume skills and source without creating experience reports", () => {
  render(<MemoryRouter><SavedResumeSkills /></MemoryRouter>);
  const group = screen.getByRole("region", { name: "From resume" });
  expect(within(group).getByRole("table")).toHaveAccessibleName("Skills from resume");
  expect(within(group).getByText("SQL, Python")).toBeVisible();
  expect(screen.queryByText("Statistics")).not.toBeInTheDocument();
  fireEvent.click(screen.getByText("Page 1"));
  expect(screen.getByText("Skills: SQL, Python")).toBeVisible();
  expect(save).not.toHaveBeenCalled();
});

it("removes the resume group when active document background disappears", () => {
  const view = render(<MemoryRouter><SavedResumeSkills /></MemoryRouter>);
  state.active = false;
  view.rerender(<MemoryRouter><SavedResumeSkills /></MemoryRouter>);
  expect(screen.queryByRole("region", { name: "From resume" })).not.toBeInTheDocument();
  expect(save).not.toHaveBeenCalled();
});
