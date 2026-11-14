import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { useCoreMutation, useCoreQuery } from "@/features/core/data";
import { RoadmapPage } from "./page";

vi.mock("@/features/core/data", () => ({coreApi:{}, useCoreQuery:vi.fn(), useCoreMutation:vi.fn()}));
describe("roadmap task visibility", () => {
  it("hides and restores a completed task without saving or losing focus", async () => {
    const save = vi.fn();
    const milestone = {id:"milestone", title:"Foundations", description:"Start", retired_at:null, branch_groups:[], topics:[{id:"topic", title:"Saved task", branch_id:null, retired_at:null}]};
    const data: Record<string, unknown> = {
      career:{id:"career", title:"Career", roadmap_ids:["roadmap"], skills:[], responsibilities:[]},
      roadmap:{id:"roadmap", career_id:"career", title:"Roadmap", status:"published", milestones:[milestone]},
      learning:{current_roadmap_id:"roadmap",version:1},
      progress:[{topic_id:"topic",status:"done",version:1}],
      summary:{milestones:[{milestone_id:"milestone",percentage:100}],done:1,applicable:1,percentage:100},
      branches:[],
    };
    vi.mocked(useCoreQuery).mockImplementation(key => ({data:key[0] === "roadmap-view" ? (data.summary ? {roadmap:data.roadmap,learning_state:data.learning,progress:data.progress,summary:data.summary,branches:data.branches} : undefined) : data[String(key[0])],refetch:vi.fn(),error:null}) as never);
    vi.mocked(useCoreMutation).mockReturnValue({mutate:save,isPending:false,error:null} as never);
    render(<MemoryRouter initialEntries={["/roadmaps/career"]}><Routes><Route path="/roadmaps/:careerId" element={<RoadmapPage />} /></Routes></MemoryRouter>);
    const hide = screen.getByRole("button",{name:"Hide task: Saved task"});
    fireEvent.click(hide);
    const show = screen.getByRole("button",{name:"Show task: Saved task"});
    await waitFor(() => expect(show).toHaveFocus());
    expect(hide.closest("[inert]")).not.toBeNull();
    fireEvent.click(show);
    await waitFor(() => expect(screen.getByRole("button",{name:"Hide task: Saved task"})).toHaveFocus());
    expect(screen.getByText("Done")).toBeVisible();
    expect(screen.getByText("Done")).toHaveClass("topic-status", "status-done");
    expect(document.querySelector(".milestone-list #milestone-milestone")).not.toBeNull();
    expect(save).not.toHaveBeenCalled();
  });
});
