import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { APIRequestError } from "@/api/errors";
import { useCoreQuery } from "@/features/core/data";
import { RecommendationCards } from "./components";
import type { useRecommendationFlow } from "./use-recommendation-flow";

vi.mock("@/features/core/data", () => ({
  coreApi: { catalog: vi.fn() },
  useCoreQuery: vi.fn(),
}));
vi.mock("@/features/ai-guidance", () => ({ CounselorLauncher: () => null }));

function flow(failed = false) {
  const catalog = {
    data: {
      items: [
        {
          id: "career-1",
          category_id: "software",
          title: "Published career",
          description: "Starter path",
          skills: ["HTML"],
          roadmap_ids: ["roadmap-1"],
        },
      ],
    },
    error: null,
  };
  vi.mocked(useCoreQuery).mockImplementation(key => (key[0] === "recommendation-categories"
    ? { data: [{ id: "software", title: "Software and AI" }], error: null }
    : key[0] === "discovery-session"
      ? { data: key[1] ? { answers: [
          { question_id: "experience_preference", option_ids: ["use_experience"] },
          { question_id: "goals", option_ids: ["change"] },
        ] } : undefined }
      : catalog) as never);
  return {
    query: {
      data: {
        available: true,
        current: {
          id: "run-1",
          status: failed ? "failed" : "completed",
          outdated: false,
          failure_code: failed ? "invalid_output" : null,
          created_at: "2026-10-28T00:00:00Z",
          finished_at: "2026-10-28T00:00:01Z",
          items: failed
            ? []
            : [
                {
                  career_id: "career-1",
                  roadmap_id: "roadmap-1",
                  reason: "Related to your stated interests.",
                  uncertainty_note: "A limited catalog option.",
                },
              ],
        },
        previous_eligible_success: null,
      },
    },
    pending: false,
    error: null,
    request: vi.fn(),
    retryFailed: vi.fn(),
    reload: vi.fn(),
    cooldown: 0,
  } as unknown as ReturnType<typeof useRecommendationFlow>;
}

describe("saved recommendation cards", () => {
  it("replaces the previous failure while a new request is being prepared", () => {
    const current = flow(true);
    current.pending = true;
    render(
      <MemoryRouter>
        <RecommendationCards flow={current} />
      </MemoryRouter>,
    );
    expect(
      screen.queryByText(/couldn’t prepare suggestions/),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Preparing…" })).toBeDisabled();
  });
  it("opens the exact published career and roadmap destination", () => {
    render(
      <MemoryRouter>
        <RecommendationCards flow={flow()} />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "See where to start" })).toHaveAttribute(
      "href",
      "/roadmaps/career-1?roadmap=roadmap-1",
    );
    expect(screen.getByText("Why this was suggested")).toBeVisible();
    expect(screen.getByText("A limited catalog option.")).not.toBeVisible();
    expect(screen.getByText("Software and AI")).toHaveClass("card-category");
    fireEvent.click(screen.getByText("Suggestion details"));
    expect(screen.getByText("A limited catalog option.")).toBeVisible();
    expect(screen.getByRole("link", { name: "Review Discovery answers" })).toHaveAttribute("href", "/settings/profile#saved-discovery");
  });
  it("keeps the roadmap action without offering the disabled experience comparison", () => {
    const current = flow();
    current.query.data!.current!.discovery = { session_id: "completed-v2" } as never;
    render(<MemoryRouter><RecommendationCards flow={current} /></MemoryRouter>);
    expect(screen.queryByRole("link", { name: "Compare my skills to this career" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See where to start" })).toHaveAttribute("href", "/roadmaps/career-1?roadmap=roadmap-1");
    expect(screen.getByText(/Considering a career change/)).toBeVisible();
  });

  it("keeps the saved failure visible alongside retry cooldown feedback", () => {
    const current = flow(true);
    current.error = new APIRequestError(
      429,
      {
        code: "quota_exceeded",
        message: "Wait before requesting again.",
        request_id: "safe-request",
      },
      45,
    );
    current.cooldown = 45;
    render(
      <MemoryRouter>
        <RecommendationCards flow={current} />
      </MemoryRouter>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Wait before requesting again.",
    );
    expect(screen.queryByText(/couldn’t prepare suggestions/)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Try again in 45s" }),
    ).toBeDisabled();
  });
  it("keeps older cards out of view while retrying and reveals them on demand", () => {
    const current = flow(true);
    const previous = flow().query.data!.current!;
    current.query.data!.previous_eligible_success = { ...previous, id: "old-run" };
    current.willRetry = true;
    current.cooldown = 60;
    render(<MemoryRouter><RecommendationCards flow={current} /></MemoryRouter>);
    expect(screen.getByRole("status")).toHaveTextContent("retry automatically. 60s");
    expect(screen.queryByRole("heading", { name: "Published career" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "View previous suggestions" }));
    expect(screen.getByRole("heading", { name: "Published career", level: 2 })).toBeVisible();
    expect(screen.getByText("Previous suggestions from earlier answers or context.")).toBeVisible();
  });
  it("does not require an initial generate button in the Discovery results flow", () => {
    const current = flow();
    current.query.data!.current = null;
    render(<MemoryRouter><RecommendationCards flow={current} allowInitialRequest={false} /></MemoryRouter>);
    expect(screen.queryByRole("button", { name: "Prepare suggestions" })).not.toBeInTheDocument();
  });
  it("offers honest empty-result recovery without a generation button", () => {
    const current = flow(true);
    current.query.data!.current!.failure_code = "no_supported_careers";
    render(<MemoryRouter><RecommendationCards flow={current} rulesMode noDirection /></MemoryRouter>);
    expect(screen.getByText(/enough information to recommend a career reliably/)).toBeVisible();
    expect(screen.getByRole("link", {name: "Upload a résumé"})).toHaveAttribute("href", "/settings/profile#resume-skill-review");
    expect(screen.getByRole("link", {name: "Add skills"})).toHaveAttribute("href", "/settings/profile#profile-skills");
    expect(screen.queryByRole("button", {name: "Try again"})).not.toBeInTheDocument();
  });

});
