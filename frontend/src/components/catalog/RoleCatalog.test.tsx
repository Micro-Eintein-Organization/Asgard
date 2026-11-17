import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCoreQuery } from "@/features/core/data";
import RoleCatalog from "./RoleCatalog";

vi.mock("@/features/core/data", () => ({coreApi:{},useRoadmapPreload:()=>vi.fn(),useCoreQuery:vi.fn()}));
let branchRequired: boolean;
let hasProgress: boolean;
function Location() {const location=useLocation(); return <output>{location.pathname}{location.search}</output>;}
beforeEach(() => {
  branchRequired=false;
  hasProgress=true;
  vi.mocked(useCoreQuery).mockImplementation(key => {
    const records: Record<string,unknown> = {
      categories:[{id:"category",title:"Design"}],preferences:{preferred_category_id:null},
      recommendations:{current:{status:"completed",items:[{career_id:"career",roadmap_id:"recommended"}]}},
      careers:{total:1,items:[{id:"career",title:"Designer",description:"Design",category_id:"category",skills:[],roadmap_ids:["first","recommended"]}]},
      "catalog-progress":[{roadmap_id:"recommended",has_progress:hasProgress,percentage:branchRequired?null:50,requires_branch_choice:branchRequired}],
    };
    return {data:key[0] === "catalog-summary" ? {categories:records.categories,total:1,by_category:{}} : records[String(key[0])],isPending:false,error:null} as never;
  });
});
describe("connected catalog interactions", () => {
  it("keeps search mounted and focused while results load or fail", async () => {
    const original = vi.mocked(useCoreQuery).getMockImplementation()!;
    let pending = false;
    let failed = false;
    vi.mocked(useCoreQuery).mockImplementation((...args) => {
      if (args[0][0] === "careers" && pending)
        return { data: undefined, isPending: !failed, isFetching: !failed,
          error: failed ? new Error("Search unavailable") : null } as never;
      return original(...args);
    });
    const view = render(<MemoryRouter><RoleCatalog /></MemoryRouter>);
    const input = screen.getByRole("searchbox");
    input.focus();
    pending = true;
    fireEvent.change(input, { target: { value: "bac" } });
    expect(screen.getByRole("searchbox")).toBe(input);
    expect(input).toHaveFocus();
    const results = document.querySelector(".catalog-results")!;
    expect(results).toHaveAttribute("aria-busy", "true");
    expect(results.querySelector('.loading-indicator[data-size="panel"]')).not.toBeNull();
    expect(screen.getByText("Updating careers")).toHaveClass("sr-only");
    expect(screen.queryByText("Loading published careers")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Design" })).toBeEnabled();
    fireEvent.change(input, { target: { value: "backend" } });
    await waitFor(() => expect(vi.mocked(useCoreQuery).mock.calls.some(call =>
      call[0][0] === "careers" && call[0][1] === "backend")).toBe(true));
    expect(vi.mocked(useCoreQuery).mock.calls.some(call =>
      call[0][0] === "careers" && call[0][1] === "bac")).toBe(false);
    failed = true;
    view.rerender(<MemoryRouter><RoleCatalog /></MemoryRouter>);
    expect(screen.getByText("Could not update careers")).toBeVisible();
    expect(screen.getByRole("searchbox")).toBe(input);
    expect(input).toHaveFocus();
    expect(results.querySelector(".loading-indicator")).toBeNull();
    fireEvent.keyDown(input, { key: "Escape" });
    expect(input).toHaveValue("");
  });
  it("does not request summaries for roadmaps without saved progress", () => {
    hasProgress = false;
    render(<MemoryRouter><RoleCatalog /></MemoryRouter>);
    expect(vi.mocked(useCoreQuery).mock.calls.filter(call => call[0][0] === "catalog-progress")).toHaveLength(1);
    expect(vi.mocked(useCoreQuery).mock.calls.some(call => call[0][0] === "progress" || call[0][0] === "summary")).toBe(false);
    expect(screen.queryByRole("meter")).toBeNull();
  });
  it("clears only search and returns focus to the input", async () => {
    render(<MemoryRouter initialEntries={["/careers?category=Design&q=designer"]}><RoleCatalog /><Location /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button",{name:"Clear search query"}));
    await waitFor(() => expect(screen.getByRole("searchbox")).toHaveFocus());
    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(screen.getByText("/careers?category=Design")).toBeVisible();
    fireEvent.change(screen.getByRole("searchbox"),{target:{value:"query"}});
    fireEvent.keyDown(screen.getByRole("searchbox"),{key:"Escape"});
    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(screen.getByText("/careers?category=Design")).toBeVisible();
  });
  it("uses the exact recommended roadmap for both badge and navigation", () => {
    render(<MemoryRouter initialEntries={["/careers"]}><RoleCatalog /><Location /></MemoryRouter>);
    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow","50");
    expect(vi.mocked(useCoreQuery).mock.calls.some(call => call[0][0] === "catalog-progress" && JSON.stringify(call[0][1]) === JSON.stringify(["recommended"]))).toBe(true);
    fireEvent.click(screen.getByRole("button",{name:"View Designer roadmap"}));
    expect(screen.getByText("/roadmaps/career?roadmap=recommended")).toBeVisible();
  });
  it("withholds percentage until the tool path is chosen", () => {
    branchRequired=true;
    render(<MemoryRouter><RoleCatalog /></MemoryRouter>);
    expect(screen.queryByRole("meter")).toBeNull();
  });
});
