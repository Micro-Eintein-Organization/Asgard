import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { components } from "@/api/generated/schema";
import type {
  CareerSkillMatch,
  CareerSkillMatchResponse,
  ResumeSignal,
  SkillMatchItem,
} from "./api";
import SkillMatchingPage from "./page";

type CareerPosting = components["schemas"]["CareerPosting"];
type PostingSkill = components["schemas"]["PostingSkill"];

const mocks = vi.hoisted(() => ({
  readCareerSkillMatches: vi.fn(),
  useCoreQuery: vi.fn(),
}));

vi.mock("./api", () => ({ readCareerSkillMatches: mocks.readCareerSkillMatches }));
vi.mock("@/features/core/data", () => ({
  useCoreQuery: mocks.useCoreQuery,
  coreApi: { interpretResume: vi.fn() },
  useCoreMutation: () => ({ mutate: vi.fn(), isPending: false, error: null }),
}));

function skill(overrides: Partial<SkillMatchItem> = {}): SkillMatchItem {
  return {
    competency_id: "competency-1",
    label: "Python",
    evidence_found: false,
    source: "reviewed snapshot",
    source_version: "v1",
    status: "MISSING",
    reported_level: null,
    user_report: null,
    resume_signals: [],
    posting_count: null,
    total_postings: null,
    ...overrides,
  };
}

function postingSkill(overrides: Partial<PostingSkill> = {}): PostingSkill {
  return {
    label: "Excel",
    resume_match: null,
    ...overrides,
  };
}

function posting(overrides: Partial<CareerPosting> = {}): CareerPosting {
  return {
    source: "hand-collected",
    source_version: "v1",
    posting_id: "ph_002",
    company: "Example Co.",
    job_title: "Junior Data Analyst",
    source_url: "https://example.test/jobs/analyst-1",
    retrieved_on: "2026-11-18",
    skills: [postingSkill()],
    ...overrides,
  };
}

function career(
  skills: SkillMatchItem[] = [skill()],
  overrides: Partial<CareerSkillMatch> = {},
): CareerSkillMatch {
  return {
    career_id: "career-1",
    career_title: "Data Analyst",
    rank: 1,
    matched_skill_count: 0,
    evidence_count: 0,
    benchmark_skill_count: skills.length,
    display_count: "3 of 7",
    skills,
    sample_label: "reviewed snapshot (v1): 5 postings",
    sample_note: "Benchmark sample note.",
    postings: [],
    ...overrides,
  };
}

function response(items: CareerSkillMatch[] = [career()]): CareerSkillMatchResponse {
  return {
    source: "career-linked competencies",
    source_version: "v1",
    sample_label: "benchmark sample",
    postings_sample_label: "Curated benchmark sample",
    items,
  };
}

function renderPage() {
  return render(
    <MemoryRouter>
      <SkillMatchingPage />
    </MemoryRouter>,
  );
}

describe("SkillMatchingPage", () => {
  it("keeps tabs available when the benchmark is unavailable and queries each basis separately", () => {
    mocks.useCoreQuery.mockImplementation((key) => key[1] === "benchmark" ? {
      isError: true, error: new Error("Benchmark not published"), refetch: vi.fn(),
    } : { data: response([career([])]), isPending: false, isError: false });
    renderPage();
    expect(screen.getByRole("tab", { name: "Job-sample skills" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Benchmark not published")).toBeVisible();
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Roadmap skills" }), { button: 0, ctrlKey: false });
    expect(screen.getByRole("tab", { name: "Roadmap skills" })).toHaveAttribute("aria-selected", "true");
    expect(screen.queryByText("Benchmark not published")).not.toBeInTheDocument();
    const call = mocks.useCoreQuery.mock.calls.at(-1)!;
    expect(call[0]).toEqual(["career-skill-matches", "learning_path"]);
    call[1]();
    expect(mocks.readCareerSkillMatches).toHaveBeenLastCalledWith(undefined, "learning_path");
  });
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useCoreQuery.mockReturnValue({
      data: response(),
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });
  });

  it("renders the API display_count text exactly as returned", () => {
    renderPage();
    expect(screen.getByText("Evidence found for 0 of 1 skills")).toBeInTheDocument();
  });

  it("renders Matched, Unknown, and Missing as text labels", () => {
    mocks.useCoreQuery.mockReturnValue({
      data: response([
        career([
          skill({ status: "MATCHED", reported_level: 2 }),
          skill({ competency_id: "competency-2", label: "SQL", status: "UNKNOWN", user_report: { evidence_confirmed: false, source: "user_report", level: null, updated_at: null } }),
          skill({ competency_id: "competency-3", label: "Git" }),
        ]),
      ]),
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();
    expect(screen.getByText("Evidence found")).toBeInTheDocument();
    expect(screen.getByText("Not sure")).toBeInTheDocument();
    expect(screen.getByText("No evidence recorded")).toBeInTheDocument();
  });

  it("labels resume matches and omits a null reported level", () => {
    const signal: ResumeSignal = {
      analysis_id: "analysis-1",
      document_id: "document-1",
      kind: "skill",
      matched_phrases: ["Python"],
      page: 1,
      revision: 2,
      span: "Skills: Python",
      text: "Python",
    };
    mocks.useCoreQuery.mockReturnValue({
      data: response([career([skill({ status: "MATCHED", resume_signals: [signal] })])]),
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();
    expect(screen.getByText("From resume")).toBeInTheDocument();
    expect(screen.queryByText(/Reported level:/)).not.toBeInTheDocument();
  });

  it("shows saved level zero with a resume signal without increasing it", () => {
    const signal: ResumeSignal = {
      analysis_id: "analysis-1",
      document_id: "document-1",
      kind: "skill",
      matched_phrases: ["Python"],
      page: 1,
      revision: 2,
      span: "Skills: Python",
      text: "Python",
    };
    mocks.useCoreQuery.mockReturnValue({
      data: response([career([skill({
        status: "MATCHED",
        reported_level: 0,
        user_report: { evidence_confirmed: false, source: "user_report", level: 0, updated_at: null },
        resume_signals: [signal],
      })])]),
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();
    expect(screen.getByText("From resume")).toBeInTheDocument();
    expect(screen.getByText("Your experience: No experience reported")).toBeInTheDocument();
    expect(screen.queryByText(/Your experience: Familiar with concepts/)).not.toBeInTheDocument();
  });

  it("does not render a percentage", () => {
    const { container } = renderPage();
    expect(container.textContent).not.toContain("%");
  });

  it("shows annotated posting counts and no percent sign", () => {
    mocks.useCoreQuery.mockReturnValue({
      data: response([career([skill({ posting_count: 2, total_postings: 5 })])]),
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    const { container } = renderPage();
    fireEvent.click(screen.getByText("Data Analyst"));
    expect(screen.getByText("seen in 2 of 5 postings")).toBeInTheDocument();
    expect(container.textContent).not.toContain("%");
  });

  it("does not show posting counts when either count is null", () => {
    mocks.useCoreQuery.mockReturnValue({
      data: response([career([skill({ posting_count: 2 })])]),
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();
    fireEvent.click(screen.getByText("Data Analyst"));
    expect(screen.queryByText(/seen in/)).not.toBeInTheDocument();
  });

  it("uses singular posting for a one-posting sample", () => {
    mocks.useCoreQuery.mockReturnValue({
      data: response([career([skill({ posting_count: 1, total_postings: 1 })])]),
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();
    fireEvent.click(screen.getByText("Data Analyst"));
    expect(screen.getByText("seen in 1 of 1 posting")).toBeInTheDocument();
  });

  it("shows a very small sample label while details are collapsed", () => {
    mocks.useCoreQuery.mockReturnValue({
      data: response([career([skill()], { sample_label: "snapshot: 1 posting - very small sample" })]),
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();
    expect(screen.getByText("snapshot: 1 posting - very small sample")).toBeVisible();
    expect(screen.getByText("Data Analyst").closest("details")).not.toHaveAttribute("open");
  });

  it("shows no skill mapping when benchmark_skill_count is zero", () => {
    mocks.useCoreQuery.mockReturnValue({
      data: response([career([], { benchmark_skill_count: 0, display_count: "0 of 0" })]),
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();
    expect(screen.getByText("No skills listed for comparison")).toBeInTheDocument();
    expect(screen.getByText("No reviewed benchmark mappings for this career in this sample.")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders the empty state when the API returns no careers", () => {
    mocks.useCoreQuery.mockReturnValue({
      data: response([]),
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();
    expect(screen.getByText("No careers are available to compare yet.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open profile settings" })).toBeInTheDocument();
  });

  it("renders all-MISSING careers and the narrow no-matches notice", () => {
    mocks.useCoreQuery.mockReturnValue({
      data: response([career([skill(), skill({ competency_id: "competency-2", label: "SQL" })])]),
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();
    expect(screen.getByText("Data Analyst")).toBeInTheDocument();
    expect(screen.getAllByText("No evidence recorded")).toHaveLength(2);
    expect(screen.getByRole("status")).toHaveTextContent("No supporting evidence has been recorded for these career skills yet.");
    expect(screen.getByRole("link", { name: "Go to your profile to add skills" })).toBeInTheDocument();
  });

  it("omits the no-matches notice when any skill is MATCHED", () => {
    mocks.useCoreQuery.mockReturnValue({
      data: response([career([skill({ status: "MATCHED", reported_level: 1 })])]),
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();
    expect(screen.getByText("Evidence found")).toBeInTheDocument();
    expect(screen.queryByText(/No supporting evidence has been recorded/)).not.toBeInTheDocument();
  });

  it("does not render the no-matches notice when any skill is UNKNOWN", () => {
    mocks.useCoreQuery.mockReturnValue({
      data: response([career([skill({ status: "UNKNOWN", user_report: { evidence_confirmed: false, source: "user_report", level: null, updated_at: null } })])]),
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();
    expect(screen.getByText("Not sure")).toBeInTheDocument();
    expect(screen.queryByText(/No supporting evidence has been recorded/)).not.toBeInTheDocument();
  });

  it("renders loading and error states", () => {
    mocks.useCoreQuery.mockReturnValue({ isPending: true, isError: false, refetch: vi.fn() });
    const view = renderPage();
    expect(screen.getByRole("status")).toHaveTextContent("Loading career skill matches");

    mocks.useCoreQuery.mockReturnValue({
      isPending: false,
      isError: true,
      error: new Error("Request failed"),
      refetch: vi.fn(),
    });
    view.rerender(<MemoryRouter><SkillMatchingPage /></MemoryRouter>);
    expect(screen.getByRole("alert")).toHaveTextContent("Request failed");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  });

  it("handles a null source_version", () => {
    mocks.useCoreQuery.mockReturnValue({
      data: { ...response(), source_version: null },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();
    expect(screen.getByText("Source: career-linked competencies")).toBeInTheDocument();
    expect(screen.queryByText(/ \(version /)).not.toBeInTheDocument();
  });

  it("does not add a nested page-container", () => {
    const { container } = renderPage();
    expect(container.querySelector(".page-container")).not.toBeInTheDocument();
  });

  it("shows curated postings under their career with positive resume evidence only", () => {
    const collectedPosting = posting({
      skills: [
        postingSkill({
          resume_match: { matched_phrase: "Excel", pages: [1, 3] },
        }),
        postingSkill({ label: "Java" }),
      ],
    });
    mocks.useCoreQuery.mockReturnValue({
      data: response([
        career([skill()], { postings: [collectedPosting] }),
        career([skill({ competency_id: "competency-2", label: "Kubernetes" })], {
          career_id: "career-2",
          career_title: "DevOps Engineer",
          rank: 2,
          postings: [],
        }),
      ]),
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();
    fireEvent.click(screen.getByText("Data Analyst"));

    const postingCard = screen.getByRole("article", {
      name: "Junior Data Analyst at Example Co.",
    });
    expect(screen.getByText("Curated benchmark sample")).toBeInTheDocument();
    expect(postingCard).toHaveTextContent("Junior Data Analyst");
    expect(postingCard).toHaveTextContent("Example Co.");
    expect(postingCard).toHaveTextContent("Viewed: 2026-11-18");
    expect(
      within(postingCard).getByRole("link", { name: "View original posting" }),
    ).toHaveAttribute("href", "https://example.test/jobs/analyst-1");
    expect(postingCard).toHaveTextContent("Excel");
    expect(postingCard).toHaveTextContent("Java");
    expect(postingCard).toHaveTextContent("In your resume: Excel (pages 1, 3)");
    expect(postingCard).not.toHaveTextContent(/missing|unmatched|not in your resume/i);
    expect(postingCard.closest("details")).toBe(
      screen.getByText("Data Analyst").closest("details"),
    );
    expect(
      screen.queryByRole("region", {
        name: "Curated benchmark sample for DevOps Engineer",
      }),
    ).not.toBeInTheDocument();
  });

  it("renders a career without postings normally and preserves API ranking and skill fields", () => {
    mocks.useCoreQuery.mockReturnValue({
      data: response([
        career(
          [skill({ status: "MATCHED", reported_level: 1 })],
          {
            career_id: "career-b",
            career_title: "Beta Career",
            rank: 1,
            matched_skill_count: 1, evidence_count: 1,
            display_count: "1 of 1",
          },
        ),
        career(
          [skill({ status: "UNKNOWN", user_report: { evidence_confirmed: false, source: "user_report", level: null, updated_at: null } })],
          {
            career_id: "career-a",
            career_title: "Alpha Career",
            rank: 2,
            matched_skill_count: 0,
            display_count: "0 of 1",
          },
        ),
      ]),
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByText("Beta Career")).toBeInTheDocument();
    expect(screen.getByText("Alpha Career")).toBeInTheDocument();
    expect(screen.queryByText("Curated benchmark sample")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Beta Career"));
    expect(screen.getByText("Evidence found")).toBeInTheDocument();
    expect(screen.getByText("Your experience: Familiar with concepts")).toBeInTheDocument();
    expect(screen.getByText("Evidence found for 1 of 1 skills")).toBeInTheDocument();
    expect(screen.getByText("Evidence found for 0 of 1 skills")).toBeInTheDocument();
  });
});
