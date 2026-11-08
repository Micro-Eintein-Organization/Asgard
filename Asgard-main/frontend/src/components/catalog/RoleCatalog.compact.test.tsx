import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { useCoreQuery } from "@/features/core/data";
import RoleCatalog from "./RoleCatalog";

vi.mock("@/features/core/data", () => ({ coreApi: {}, useCoreQuery: vi.fn() }));

function setup(description = "Build website interfaces. Learn layouts and tools. Representative work: a complete project.") {
  const career = { id: "career", category_id: "software", title: "Frontend Developer", description,
    skills: ["HTML", "CSS", "JavaScript", "Git", "Accessibility"], roadmap_ids: ["roadmap"] };
  const data: Record<string, unknown> = {
    categories: [{ id: "software", title: "Software and AI" }, { id: "hardware", title: "Hardware & Embedded Systems" }],
    preferences: {}, recommendations: { current: null }, careers: { items: [career], total: 1 },
    progress: [], summary: {},
  };
  vi.mocked(useCoreQuery).mockImplementation(key => ({ data: data[String(key[0])], isPending: false, isError: false }) as never);
  return career;
}
function Location() { return <output data-testid="location">{useLocation().search}</output>; }

describe("compact connected catalog", () => {
  it("shows a general opening sentence and three skills without changing the source or roadmap action", () => {
    const career = setup();
    const select = vi.fn();
    render(<MemoryRouter><RoleCatalog onSelectRole={select} /></MemoryRouter>);
    const card = screen.getByRole("heading", { name: "Frontend Developer" }).closest(".career-card") as HTMLElement;
    expect(within(card).getByText("Build website interfaces.")).toBeVisible();
    expect(within(card).queryByText(/Representative work/)).not.toBeInTheDocument();
    expect(within(card).getAllByRole("listitem")).toHaveLength(3);
    expect(within(card).getByText("2 more skills in this roadmap")).toBeVisible();
    fireEvent.click(within(card).getByRole("button", { name: "View Frontend Developer roadmap" }));
    expect(select).toHaveBeenCalledWith("career");
    expect(career.skills).toHaveLength(5);
    expect(career.description).toContain("Representative work:");
  });
  it("bounds a long opening sentence without clipping the complete card", () => {
    setup("Explore practical technology workflows and tools ".repeat(10));
    render(<MemoryRouter><RoleCatalog /></MemoryRouter>);
    const description = document.querySelector(".catalog-career-card > p")!;
    expect(description.textContent!.length).toBeLessThanOrEqual(160);
    expect(description.textContent).toMatch(/…$/);
    expect(screen.getByRole("button", { name: "View Frontend Developer roadmap" })).toBeVisible();
  });
  it("separates number/label spans and preserves search while changing categories", () => {
    setup();
    render(<MemoryRouter initialEntries={["/careers?q=HTML"]}><RoleCatalog /><Location /></MemoryRouter>);
    const nav = screen.getByRole("navigation", { name: "Career categories" });
    const hardware = within(nav).getByRole("button", { name: "Hardware & Embedded Systems" });
    expect(hardware.querySelector(".category-number")).toHaveTextContent("02");
    expect(hardware.querySelector(".category-name")).toHaveTextContent("Hardware & Embedded Systems");
    fireEvent.click(hardware);
    expect(screen.getByTestId("location")).toHaveTextContent("q=HTML&category=Hardware");
    expect(hardware).toHaveAttribute("aria-pressed", "true");
  });
});
