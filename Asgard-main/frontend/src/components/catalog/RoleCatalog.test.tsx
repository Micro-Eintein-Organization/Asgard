import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCoreQuery } from "@/features/core/data";
import RoleCatalog from "./RoleCatalog";

vi.mock("@/features/core/data", () => ({coreApi:{},useCoreQuery:vi.fn()}));
let branchRequired: boolean;
function Location() {const location=useLocation(); return <output>{location.pathname}{location.search}</output>;}
beforeEach(() => {
  branchRequired=false;
  vi.mocked(useCoreQuery).mockImplementation(key => {
    const records: Record<string,unknown> = {
      categories:[{id:"category",title:"Design"}],preferences:{preferred_category_id:null},
      recommendations:{current:{status:"completed",items:[{career_id:"career",roadmap_id:"recommended"}]}},
      careers:{total:1,items:[{id:"career",title:"Designer",description:"Design",category_id:"category",skills:[],roadmap_ids:["first","recommended"]}]},
      progress:[{status:"done"}],summary:{percentage:branchRequired?null:50,requires_branch_choice:branchRequired},
    };
    return {data:records[String(key[0])],isPending:false,error:null} as never;
  });
});
describe("connected catalog interactions", () => {
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
    expect(vi.mocked(useCoreQuery).mock.calls.some(call => call[0][0] === "summary" && call[0][1] === "recommended")).toBe(true);
    fireEvent.click(screen.getByRole("button",{name:"View Designer roadmap"}));
    expect(screen.getByText("/roadmaps/career?roadmap=recommended")).toBeVisible();
  });
  it("withholds percentage until the tool path is chosen", () => {
    branchRequired=true;
    render(<MemoryRouter><RoleCatalog /></MemoryRouter>);
    expect(screen.queryByRole("meter")).toBeNull();
  });
});
