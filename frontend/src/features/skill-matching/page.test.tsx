import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  CareerSkillMatch,
  CareerSkillMatchResponse,
  ResumeSignal,
  SkillMatchItem,
} from "./api";
import SkillMatchingPage from "./page";

const mocks = vi.hoisted(() => ({
  readCareerSkillMatches: vi.fn(),
  useCoreQuery: vi.fn(),
}));

vi.mock("./api", () => ({ readCareerSkillMatches: mocks.readCareerSkillMatches }));
vi.mock("@/features/core/data", () => ({ useCoreQuery: mocks.useCoreQuery }));

function skill(overrides: Partial<SkillMatchItem> = {}): SkillMatchItem {
  return {
    competency_id: "competency-1",
    label: "Python",
    source: "reviewed snapshot",
    source_version: "v1",
    status: "MISSING",
    reported_level: null,
    user_report: null,
    resume_signals: [],
    ...overrides,
  };
}

function career(skills: SkillMatchItem[] = [skill()]): CareerSkillMatch {
  return {
    career_id: "career-1",
    career_title: "Data Analyst",
    rank: 1,
    matched_skill_count: 0,
    benchmark_skill_count: skills.length,
    display_count: "3 of 7",
    skills,
    sample_note: "Benchmark sample note.",
  };
}

function response(items: CareerSkillMatch[] = [career()]): CareerSkillMatchResponse {
  return {
    source: "career-linked competencies",
    source_version: "v1",
    sample_label: "benchmark sample",
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
    expect(screen.getByText("3 of 7")).toBeInTheDocument();
  });

  it("renders Matched, Unknown, and Missing as text labels", () => {
    mocks.useCoreQuery.mockReturnValue({
      data: response([
        career([
          skill({ status: "MATCHED", reported_level: 2 }),
          skill({ competency_id: "competency-2", label: "SQL", status: "UNKNOWN", user_report: { source: "user_report", level: null, updated_at: null } }),
          skill({ competency_id: "competency-3", label: "Git" }),
        ]),
      ]),
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();
    expect(screen.getByText("Matched")).toBeInTheDocument();
    expect(screen.getByText("Unknown")).toBeInTheDocument();
    expect(screen.getByText("Missing")).toBeInTheDocument();
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
    expect(screen.getByText("from resume")).toBeInTheDocument();
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
        user_report: { source: "user_report", level: 0, updated_at: null },
        resume_signals: [signal],
      })])]),
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();
    expect(screen.getByText("from resume")).toBeInTheDocument();
    expect(screen.getByText("Reported level: 0")).toBeInTheDocument();
    expect(screen.queryByText("Reported level: 1")).not.toBeInTheDocument();
  });

  it("does not render a percentage", () => {
    const { container } = renderPage();
    expect(container.textContent).not.toContain("%");
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
    expect(screen.getByText("1. Data Analyst")).toBeInTheDocument();
    expect(screen.getAllByText("Missing")).toHaveLength(2);
    expect(screen.getByRole("status")).toHaveTextContent("None of your saved skills or resume mentions match the skills in these careers yet.");
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
    expect(screen.getByText("Matched")).toBeInTheDocument();
    expect(screen.queryByText(/None of your saved skills or resume mentions match/)).not.toBeInTheDocument();
  });

  it("does not render the no-matches notice when any skill is UNKNOWN", () => {
    mocks.useCoreQuery.mockReturnValue({
      data: response([career([skill({ status: "UNKNOWN", user_report: { source: "user_report", level: null, updated_at: null } })])]),
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();
    expect(screen.getByText("Unknown")).toBeInTheDocument();
    expect(screen.queryByText(/None of your saved skills or resume mentions match/)).not.toBeInTheDocument();
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
    expect(screen.getByText("benchmark sample")).toBeInTheDocument();
    expect(screen.getByText("career-linked competencies")).toBeInTheDocument();
    expect(screen.queryByText(/Source version:/)).not.toBeInTheDocument();
  });
});
