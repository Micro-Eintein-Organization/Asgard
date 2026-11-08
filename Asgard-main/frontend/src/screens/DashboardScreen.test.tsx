import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { useCoreMutation, useCoreQuery } from "@/features/core/data";
import { DashboardScreen } from "./DashboardScreen";

vi.mock("@/features/core/data",()=>({coreApi:{},useCoreQuery:vi.fn(),useCoreMutation:vi.fn()}));
describe("account-backed Cabusao Dashboard",()=>{
  it("uses the reference card hierarchy and presents saved states in reference accordions",()=>{
    const topics=[{id:"next",title:"Learn interfaces",branch_id:null},{id:"done",title:"Finished topic",branch_id:null},{id:"skipped",title:"Skipped topic",branch_id:null}];
    const data:Record<string,unknown>={
      dashboard:{learning_state:{current_roadmap_id:"roadmap"},active_topic:null,core_milestone_id:"milestone",progress:{next_topic_ids:["next"],milestones:[{milestone_id:"milestone",done:1,applicable:3,percentage:33}],requires_branch_choice:false},guidance_id:null},
      preferences:{timezone:"Asia/Manila"},roadmap:{career_id:"career",milestones:[{id:"milestone",title:"Foundations",topics}]},career:{title:"Saved career"},
      progress:[{topic_id:"done",status:"done"},{topic_id:"skipped",status:"skipped"}],branches:[],activity:{days:[],streak_days:2},
    };
    vi.mocked(useCoreQuery).mockImplementation(key=>({data:data[String(key[0])],error:null,refetch:vi.fn()}) as never);
    vi.mocked(useCoreMutation).mockReturnValue({error:null,isPending:false} as never);
    render(<MemoryRouter><DashboardScreen /></MemoryRouter>);
    const title=screen.getByRole("heading",{name:"Saved career"});
    const card=title.closest('[data-slot="card"]') as HTMLElement;
    expect(card).toHaveClass("support-card","current-roadmap-card");
    expect(title.parentElement).toHaveClass("current-roadmap-heading");
    expect(within(card).getByRole("link",{name:"Open roadmap"})).toHaveAttribute("href","/roadmaps/career?roadmap=roadmap");
    expect(within(card).getByRole("link",{name:"Edit"})).toHaveAttribute("href","/careers");
    expect(screen.getByRole("heading",{name:"Learn interfaces"}).closest("section")).toHaveClass("milestone-hero");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow","33");
    expect(screen.getByRole("button",{name:"Not started, 1 topics"})).toHaveClass("dashboard-status-trigger");
    fireEvent.click(screen.getByRole("button",{name:"Complete, 1 topics"}));
    expect(screen.getByText("Finished topic")).toBeVisible();
    fireEvent.click(screen.getByRole("button",{name:"Skipped, 1 topics"}));
    expect(screen.getByText("Skipped topic")).toBeVisible();
    expect(screen.getByRole("group",{name:"Learning streak"})).toHaveTextContent("2 days");
    expect(screen.getByRole("link",{name:"View milestone"})).toHaveAttribute("href","/roadmaps/career?roadmap=roadmap#milestone-milestone");
    expect(screen.getByRole("group",{name:"Learning streak"})).toHaveTextContent("Longest streak Not available");
  });
});
