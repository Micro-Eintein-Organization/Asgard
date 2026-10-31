import { act, fireEvent, render, screen } from "@testing-library/react";
import {
  createMemoryRouter,
  Link,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMemo } from "react";
import { DashboardPage } from "@/features/dashboard/page";
import { CatalogPage } from "@/features/catalog/page";
import { DiscoveryPage, WelcomePage } from "@/features/discovery/page";
import { ResultsPage } from "@/features/recommendations/page";
import { RoadmapPage } from "@/features/roadmaps/page";
import { careers } from "@/fixtures/catalog";
import {
  setCurrentTopicId,
  useCurrentTopicId,
} from "@/lib/learning-state";

function LocationMarker() {
  const location = useLocation();
  return (
    <output data-testid="location">
      {location.pathname}
      {location.search}
    </output>
  );
}

function LearningFlow({ initialEntry }: { initialEntry: string }) {
  const router = useMemo(
    () =>
      createMemoryRouter(
        [
          {
            path: "/",
            element: (
              <>
                <LocationMarker />
                <nav>
                  <Link to="/dashboard">Dashboard</Link>
                </nav>
                <Outlet />
              </>
            ),
            children: [
              { path: "welcome", element: <WelcomePage /> },
              { path: "discovery", element: <DiscoveryPage /> },
              { path: "careers", element: <CatalogPage /> },
              { path: "roadmaps/:careerId", element: <RoadmapPage /> },
              { path: "recommendations", element: <ResultsPage /> },
              { path: "dashboard", element: <DashboardPage /> },
            ],
          },
        ],
        { initialEntries: [initialEntry] },
      ),
    [initialEntry],
  );
  return <RouterProvider router={router} />;
}

function TopicSubscriber() {
  const topicId = useCurrentTopicId();
  return <output data-testid="topic-id">{topicId ?? "none"}</output>;
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("documented learning navigation", () => {
  it("follows the Guided Discovery fork, keeps step answers on Back, and confirms Skip", () => {
    render(<LearningFlow initialEntry="/welcome" />);
    fireEvent.click(screen.getByRole("radio", { name: /Guided Discovery/ }));
    fireEvent.click(screen.getByRole("link", { name: "Continue" }));
    expect(
      screen.getByRole("heading", {
        name: "What kinds of work interest you?",
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/Creating useful tools/));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByLabelText(/Creating useful tools/)).toBeChecked();

    fireEvent.click(
      screen.getByRole("link", { name: /Skip questions and browse careers/ }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Discard and leave" }));
    expect(
      screen.getByRole("heading", { name: "Find a direction worth exploring." }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("/careers");
  });

  it("follows Browse careers and preserves the catalog search on roadmap Back", () => {
    const welcome = render(<LearningFlow initialEntry="/welcome" />);
    fireEvent.click(screen.getByRole("radio", { name: /Browse careers/ }));
    fireEvent.click(screen.getByRole("link", { name: "Continue" }));
    expect(screen.getByTestId("location")).toHaveTextContent("/careers");

    welcome.unmount();
    const catalog = render(<LearningFlow initialEntry="/careers?q=CSS" />);
    fireEvent.click(
      screen.getByRole("link", {
        name: /View roadmap.*Frontend Developer/,
      }),
    );
    expect(screen.getByTestId("location")).toHaveTextContent(
      "/roadmaps/frontend",
    );
    fireEvent.click(screen.getByRole("link", { name: "Back to catalog" }));
    expect(screen.getByTestId("location")).toHaveTextContent("/careers?q=CSS");
    expect(
      screen.getByRole("searchbox", { name: "Search career roles or skills" }),
    ).toHaveValue("CSS");
    catalog.unmount();
  });

  it("returns from sample results to the same Discovery step and answers", () => {
    render(<LearningFlow initialEntry="/discovery" />);
    const answers = [
      /Creating useful tools/,
      /Building software logic/,
      /Working on my own/,
      /I'm new to technology/,
      /Start learning/,
    ];

    answers.forEach((answer, index) => {
      fireEvent.click(screen.getByLabelText(answer));
      if (index < answers.length - 1)
        fireEvent.click(screen.getByRole("button", { name: "Next" }));
    });
    expect(
      screen.getByRole("button", { name: "See suggestions" }),
    ).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "See suggestions" }));
    expect(
      screen.getByRole("heading", { name: "Careers to explore." }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/These roles were not generated from your answers/),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Review layout state"),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: "Back to Discovery" }));
    expect(screen.getByText(/Question 5 of 5/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start learning/)).toBeChecked();
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByText(/Question 4 of 5/)).toBeInTheDocument();
    expect(screen.getByLabelText(/I'm new to technology/)).toBeChecked();
  });

  it("renders real empty and invalid-data results states without a state selector", () => {
    const savedCareers = careers.splice(0);
    let empty: ReturnType<typeof render> | undefined;
    try {
      empty = render(<LearningFlow initialEntry="/recommendations" />);
      expect(
        screen.getByText("No sample career suggestions are available."),
      ).toBeInTheDocument();
      expect(
        screen.queryByLabelText("Review layout state"),
      ).not.toBeInTheDocument();
    } finally {
      careers.push(...savedCareers);
      empty?.unmount();
    }

    const career = careers[0];
    const originalSkills = career.skills;
    Object.assign(career, { skills: null });
    let invalid: ReturnType<typeof render> | undefined;
    try {
      invalid = render(<LearningFlow initialEntry="/recommendations" />);
      expect(
        screen.getByText(/sample career data is invalid/i),
      ).toBeInTheDocument();
      expect(
        screen.queryByLabelText("Review layout state"),
      ).not.toBeInTheDocument();
    } finally {
      career.skills = originalSkills;
      invalid?.unmount();
    }
  });
});

describe("shared current-topic state", () => {
  it("updates same-tab subscribers and survives a page remount", () => {
    const view = render(
      <>
        <TopicSubscriber />
        <TopicSubscriber />
        <button onClick={() => setCurrentTopicId("css-layout")}>
          Select topic
        </button>
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Select topic" }));
    expect(screen.getAllByTestId("topic-id")).toHaveLength(2);
    expect(screen.getAllByTestId("topic-id")[0]).toHaveTextContent("css-layout");
    expect(window.localStorage.getItem("asgard.current-learning-topic")).toBe(
      "css-layout",
    );

    view.unmount();
    render(<TopicSubscriber />);
    expect(screen.getByTestId("topic-id")).toHaveTextContent("css-layout");
  });

  it("shows the selected topic, status, and calculated progress on Dashboard", () => {
    const roadmap = render(<LearningFlow initialEntry="/roadmaps/frontend" />);
    fireEvent.click(screen.getByRole("button", { name: /CSS and layout/ }));
    expect(
      screen.getByRole("heading", { name: "CSS and layout" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /CSS and layout/ }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(window.localStorage.getItem("asgard.current-learning-topic")).toBe(
      "css-layout",
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Mark topic complete" }),
    );
    expect(
      screen.getByText("You marked this topic complete."),
    ).toBeInTheDocument();
    expect(
      JSON.parse(window.localStorage.getItem("asgard.topic-statuses") ?? "{}"),
    ).toMatchObject({ "css-layout": "Done" });
    fireEvent.click(screen.getByRole("link", { name: "Dashboard" }));

    expect(
      screen.getByRole("heading", { name: "CSS and layout" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Done").length).toBeGreaterThan(0);
    expect(screen.getByText(/2 of 4 sample topics Done/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Review topic" })).toBeInTheDocument();
    expect(screen.getByText("Done", { selector: ".topic-status" })).toHaveClass(
      "status-done",
    );
    expect(screen.queryByLabelText("Review layout state")).not.toBeInTheDocument();

    roadmap.unmount();
    render(<LearningFlow initialEntry="/dashboard" />);
    expect(
      screen.getByRole("heading", { name: "CSS and layout" }),
    ).toBeInTheDocument();
  });

  it("updates an already-mounted Dashboard when the shared topic changes", () => {
    render(<LearningFlow initialEntry="/dashboard" />);
    expect(
      screen.getByRole("heading", { name: "No current learning topic yet" }),
    ).toBeInTheDocument();

    act(() => setCurrentTopicId("css-layout"));

    expect(
      screen.getByRole("heading", { name: "CSS and layout" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Continue learning" }),
    ).toBeInTheDocument();
    expect(window.localStorage.getItem("asgard.current-learning-topic")).toBe(
      "css-layout",
    );
  });

  it("renders actual empty and invalid-data states without the review switcher", () => {
    const empty = render(<LearningFlow initialEntry="/dashboard" />);
    expect(screen.getByRole("heading", { name: "No current learning topic yet" }))
      .toBeInTheDocument();
    expect(screen.queryByLabelText("Review layout state")).not.toBeInTheDocument();

    empty.unmount();
    window.localStorage.setItem("asgard.current-learning-topic", "unknown-topic");
    render(<LearningFlow initialEntry="/dashboard" />);
    expect(
      screen.getByText(/saved topic is not part of the available roadmap/i),
    ).toBeInTheDocument();
  });

  it("shows an error for an invalid roadmap topic and catalog category", () => {
    const emptyCatalog = render(
      <LearningFlow initialEntry="/careers?q=no-matching-career" />,
    );
    expect(
      screen.getByRole("heading", { name: "No matching careers yet" }),
    ).toBeInTheDocument();
    emptyCatalog.unmount();

    const roadmap = render(
      <LearningFlow initialEntry="/roadmaps/frontend?topic=unknown-topic" />,
    );
    expect(
      screen.getByRole("heading", { name: "This topic is unavailable" }),
    ).toBeInTheDocument();

    roadmap.unmount();
    render(<LearningFlow initialEntry="/careers?category=unknown-category" />);
    expect(
      screen.getByText(/selected career category is unavailable/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Review layout state"),
    ).not.toBeInTheDocument();
  });

  it("still opens the selected topic if browser storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    });

    render(<LearningFlow initialEntry="/roadmaps/frontend" />);
    fireEvent.click(screen.getByRole("button", { name: /CSS and layout/ }));
    expect(
      screen.getByRole("heading", { name: "CSS and layout" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/could not be saved in this browser/i),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: "Dashboard" }));
    expect(
      screen.getByRole("heading", { name: "CSS and layout" }),
    ).toBeInTheDocument();
  });
});
