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
        },
      ],
    },
    error: null,
  };
  vi.mocked(useCoreQuery).mockImplementation(key => (key[0] === "recommendation-categories"
    ? { data: [{ id: "software", title: "Software and AI" }], error: null }
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
      screen.queryByText(/returned suggestions could not be validated/),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Preparing…" })).toBeDisabled();
  });
  it("opens the exact published career and roadmap destination", () => {
    render(
      <MemoryRouter>
        <RecommendationCards flow={flow()} />
      </MemoryRouter>,
    );
    expect(screen.getByRole("button", { name: "View selected roadmap" })).toBeDisabled();
    fireEvent.click(screen.getByRole("radio", { name: /Published career/ }));
    expect(screen.getByRole("link", { name: "View selected roadmap" })).toHaveAttribute(
      "href",
      "/roadmaps/career-1?roadmap=roadmap-1",
    );
    expect(screen.getByText("Why this was suggested")).toBeVisible();
    expect(screen.getByText("A limited catalog option.")).toBeVisible();
    expect(screen.getByText("Software and AI")).toHaveClass("card-category");
    expect(screen.getByRole("link", { name: "Retake Discovery" })).toHaveAttribute("href", "/settings/profile#saved-discovery");
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
    expect(
      screen.queryByText(/returned suggestions could not be validated/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Try again in 45s" }),
    ).toBeDisabled();
  });
  it("does not require an initial generate button in the Discovery results flow", () => {
    const current = flow();
    current.query.data!.current = null;
    render(<MemoryRouter><RecommendationCards flow={current} allowInitialRequest={false} /></MemoryRouter>);
    expect(screen.queryByRole("button", { name: "Prepare suggestions" })).not.toBeInTheDocument();
  });
});
