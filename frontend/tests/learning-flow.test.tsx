import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
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
  getLocalDateKey,
  setCurrentTopicId,
  setTopicStatus,
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

function getContrastRatio(firstColor: string, secondColor: string) {
  function luminance(color: string) {
    const channels = color.match(/[a-f\d]{2}/gi);
    if (!channels || channels.length !== 3)
      throw new Error(`Expected a six-digit hex color, received ${color}`);
    const [red = 0, green = 0, blue = 0] = channels
      .map((channel) => Number.parseInt(channel, 16) / 255)
      .map((channel) =>
        channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4,
      );
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  }
  const firstLuminance = luminance(firstColor);
  const secondLuminance = luminance(secondColor);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
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
    const firstQuestionBack = screen.getByRole("link", { name: "Return" });
    expect(firstQuestionBack).toHaveAttribute("href", "/welcome");
    expect(firstQuestionBack).toHaveAttribute("data-slot", "button");
    expect(firstQuestionBack).toHaveAttribute("data-variant", "ghost");

    fireEvent.click(screen.getByLabelText(/Creating useful tools/));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("button", { name: "Return" })).toHaveClass(
      firstQuestionBack.className,
    );
    fireEvent.click(screen.getByRole("button", { name: "Return" }));
    expect(screen.getByLabelText(/Creating useful tools/)).toBeChecked();

    fireEvent.click(
      screen.getByRole("link", { name: /Skip questions and browse careers/ }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(
      screen.getByRole("heading", { name: "Find a direction worth exploring." }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("/careers");
  });

  it("shows an arrow on every Discovery Back control", () => {
    render(<LearningFlow initialEntry="/discovery" />);
    const answers = [
      /Creating useful tools/,
      /Building software logic/,
      /Working on my own/,
      /I'm new to technology/,
      /Start learning/,
    ];

    answers.forEach((answer, index) => {
      const back =
        index === 0
          ? screen.getByRole("link", { name: "Return" })
          : screen.getByRole("button", { name: "Return" });
      expect(back.querySelector("svg")).toBeInTheDocument();
      expect(screen.queryByText(/^Question \d of 5/)).not.toBeInTheDocument();
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuetext",
        `Question ${index + 1} of 5`,
      );
      const actionLabel = index === 4 ? "See suggestions" : "Next";
      expect(
        screen.getByRole("button", { name: actionLabel }).closest(".question-actions"),
      ).toHaveAttribute("data-align", "end");
      expect(
        screen.queryByText(/Answers are transient navigation state/),
      ).not.toBeInTheDocument();
      if (index === 4)
        expect(
          screen.getByText(/Recommendation generation is not connected/),
        ).toBeInTheDocument();
      fireEvent.click(screen.getByLabelText(answer));
      if (index < answers.length - 1)
        fireEvent.click(screen.getByRole("button", { name: "Next" }));
    });
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

  it("clears the native search input and app query button independently", () => {
    render(
      <LearningFlow initialEntry="/careers?category=software-ai&q=missing" />,
    );
    const search = screen.getByRole("searchbox", {
      name: "Search career roles or skills",
    });
    expect(search).toHaveAttribute("type", "search");
    expect(
      screen.getAllByRole("button", {
        name: "Clear search query",
      }),
    ).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", {
      name: "Clear search query",
    }));
    expect(search).toHaveValue("");
    expect(search).toHaveFocus();
    expect(screen.getByTestId("location")).toHaveTextContent(
      "/careers?category=software-ai",
    );
    expect(
      screen.queryByRole("button", { name: "Clear search query" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Frontend Developer" }),
    ).toBeInTheDocument();

    fireEvent.change(search, { target: { value: "keyboard-clear" } });
    expect(
      screen.getAllByRole("button", {
        name: "Clear search query",
      }),
    ).toHaveLength(1);
    fireEvent.keyDown(search, { key: "Escape" });
    expect(search).toHaveValue("");
    expect(screen.getByTestId("location")).toHaveTextContent(
      "/careers?category=software-ai",
    );
    expect(
      screen.queryByRole("button", { name: "Clear search query" }),
    ).not.toBeInTheDocument();

    fireEvent.change(search, { target: { value: "still-missing" } });
    fireEvent.click(
      screen.getByRole("button", { name: "Clear search query" }),
    );
    expect(search).toHaveValue("");
    expect(screen.getByTestId("location")).toHaveTextContent(
      "/careers?category=software-ai",
    );
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
    expect(screen.getByText("You can change this later on")).toBeInTheDocument();
    expect(
      screen.getByText("You can change your career later if you change your mind."),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Review layout state"),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: "Back to Discovery" }));
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      "Question 5 of 5",
    );
    expect(screen.getByLabelText(/Start learning/)).toBeChecked();
    fireEvent.click(screen.getByRole("button", { name: "Return" }));
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      "Question 4 of 5",
    );
    expect(screen.getByLabelText(/I'm new to technology/)).toBeChecked();
  });

  it("uses the skip confirmation only for the Skip flow and preserves answers on Stay", async () => {
    render(<LearningFlow initialEntry="/discovery" />);
    const answer = screen.getByLabelText(/Creating useful tools/);
    const skipLink = screen.getByRole("link", {
      name: /Skip questions and browse careers/,
    });
    fireEvent.click(answer);
    skipLink.focus();
    fireEvent.click(skipLink);

    expect(
      screen.getByRole("heading", { name: "Are you sure you want to skip?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "'Stay on this page' will continue questions. 'Confirm' will proceed to career catalog where you can browse all careers available.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Stay on this page" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(skipLink).toHaveFocus();
    expect(answer).toBeChecked();

    fireEvent.click(skipLink);
    fireEvent.click(screen.getByRole("button", { name: "Stay on this page" }));
    expect(answer).toBeChecked();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      "Question 1 of 5",
    );

    fireEvent.click(
      screen.getByRole("link", { name: /Skip questions and browse careers/ }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(
      screen.getByRole("heading", { name: "Find a direction worth exploring." }),
    ).toBeInTheDocument();
  });

  it("retains the existing confirmation copy for other blocked Discovery exits", () => {
    render(<LearningFlow initialEntry="/discovery" />);
    fireEvent.click(screen.getByLabelText(/Creating useful tools/));
    fireEvent.click(screen.getByRole("link", { name: "Return" }));
    expect(
      screen.getByRole("heading", {
        name: "Leave your prototype changes?",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "These changes exist only in this open page. Saving is not connected, so leaving will discard them.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Discard and leave" }),
    ).toBeInTheDocument();
  });

  it("supports single-select recommendations and enables the selected roadmap", () => {
    render(<LearningFlow initialEntry="/recommendations" />);
    const setCareer = screen.getByRole("button", { name: "Set as Career" });
    expect(setCareer).toBeDisabled();
    expect(setCareer).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(setCareer);
    fireEvent.keyDown(setCareer, { key: "Enter" });
    fireEvent.keyDown(setCareer, { key: " " });
    expect(screen.getByTestId("location")).toHaveTextContent(
      "/recommendations",
    );

    const frontend = screen.getByRole("radio", {
      name: "Select Frontend Developer",
    });
    const uxDesigner = screen.getByRole("radio", {
      name: "Select UX Designer",
    });
    expect(frontend).toHaveAttribute("name", "recommended-career");
    expect(
      screen.queryByRole("link", { name: /^View roadmap/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("You can change this later on")).toBeInTheDocument();
    expect(
      screen.getByText("You can change your career later if you change your mind."),
    ).toBeInTheDocument();

    fireEvent.click(frontend);
    expect(frontend).toBeChecked();
    expect(setCareer).toBeEnabled();
    expect(setCareer).toHaveAttribute("aria-disabled", "false");
    fireEvent.click(uxDesigner);
    expect(uxDesigner).toBeChecked();
    expect(frontend).not.toBeChecked();
    expect(
      uxDesigner.closest("label")?.querySelector(".selection-indicator"),
    ).toBeInTheDocument();

    frontend.focus();
    fireEvent.keyDown(frontend, { key: "Enter" });
    expect(frontend).toBeChecked();
    expect(uxDesigner).not.toBeChecked();
  });

  it("navigates Set as Career to the selected career's existing roadmap route", () => {
    render(<LearningFlow initialEntry="/recommendations" />);
    fireEvent.click(
      screen.getByRole("radio", { name: "Select Frontend Developer" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Set as Career" }));
    expect(screen.getByTestId("location")).toHaveTextContent(
      "/roadmaps/frontend",
    );
  });

  it("Retake Discovery restores the draft from recommendations", () => {
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
    fireEvent.click(screen.getByRole("button", { name: "See suggestions" }));
    fireEvent.click(screen.getByRole("link", { name: "Retake Discovery" }));
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      "Question 5 of 5",
    );
    expect(screen.getByLabelText(/Start learning/)).toBeChecked();
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
    fireEvent.click(screen.getByRole("button", { name: /^CSS and layout/ }));
    expect(
      screen.getByRole("heading", { name: "CSS and layout" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^CSS and layout/ }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(window.localStorage.getItem("asgard.current-learning-topic")).toBe(
      "css-layout",
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Mark topic complete" }),
    );
    const completedTask = screen.getByRole("button", {
      name: /^CSS and layout/,
    });
    expect(completedTask.querySelector("svg.lucide-check")).toBeVisible();
    const incompleteTask = screen.getByRole("button", {
      name: /^Semantic HTML/,
    });
    expect(incompleteTask.querySelector("svg.lucide-circle")).toBeVisible();
    expect(incompleteTask.querySelector("svg.lucide-check")).toBeNull();
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
    const { container } = render(<LearningFlow initialEntry="/dashboard" />);
    expect(
      screen.getByRole("heading", { name: "No current learning topic yet" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Your next step is here.")).not.toBeInTheDocument();
    expect(screen.queryByText("Current streak")).not.toBeInTheDocument();
    expect(screen.queryByText("Longest streak")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Complete a topic to start your learning streak."),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Choose a topic" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        "Keep your focus in sight. Pick up a topic, or make room to explore something different.",
      ),
    ).not.toBeInTheDocument();
    expect(container.querySelector(".calendar-grid")).not.toBeInTheDocument();

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
    expect(screen.getByText("Your next step is here.")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Keep your focus in sight. Pick up a topic, or make room to explore something different.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Current streak")).toBeInTheDocument();
    expect(screen.getByText("Longest streak")).toBeInTheDocument();
    expect(container.querySelector(".calendar-grid")).toBeInTheDocument();
  });

  it("shows status counts and updates them when a topic changes status", () => {
    window.localStorage.setItem("asgard.current-learning-topic", "css-layout");
    render(<LearningFlow initialEntry="/dashboard" />);
    expect(
      screen.getByRole("button", { name: "In progress, 1 topic" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Not started, 1 topic" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Complete, 1 topic" }),
    ).toBeInTheDocument();

    act(() => setTopicStatus("css-layout", "Done"));
    expect(
      screen.getByRole("button", { name: "Not started, 0 topics" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Complete, 2 topics" }),
    ).toBeInTheDocument();
  });

  it("shows only persisted curriculum progress on the matching catalog card", () => {
    render(<LearningFlow initialEntry="/careers" />);
    expect(screen.queryByRole("meter")).not.toBeInTheDocument();

    act(() => setTopicStatus("css-layout", "Done"));
    const frontendLink = screen.getByRole("link", {
      name: /View roadmap.*Frontend Developer/,
    });
    const frontendCard = frontendLink.closest<HTMLElement>(".career-card");
    if (!frontendCard) throw new Error("Frontend career card was not rendered");
    expect(
      within(frontendCard).getByRole("meter", {
        name: "17% complete",
      }),
    ).toHaveTextContent("17%");
    const otherCareerLink = screen.getByRole("link", {
      name: /View roadmap.*Machine Learning Engineer/,
    });
    const otherCareerCard = otherCareerLink.closest<HTMLElement>(".career-card");
    if (!otherCareerCard)
      throw new Error("Machine Learning Engineer career card was not rendered");
    expect(within(otherCareerCard).queryByRole("meter")).not.toBeInTheDocument();
  });

  it("highlights active days in current and past months and marks today", () => {
    const today = new Date();
    const pastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 14);
    const currentDateKey = getLocalDateKey(today);
    const pastDateKey = getLocalDateKey(pastMonthDate);
    window.localStorage.setItem("asgard.current-learning-topic", "css-layout");
    window.localStorage.setItem(
      "asgard.topic-statuses",
      JSON.stringify({
        "css-layout": "Done",
        "html-basics": "Done",
        __completionDates: {
          "css-layout": currentDateKey,
          "html-basics": pastDateKey,
        },
      }),
    );
    const { container } = render(<LearningFlow initialEntry="/dashboard" />);

    const currentDay = container.querySelector(".calendar-day.today");
    expect(currentDay).toHaveClass("active-current");
    expect(currentDay).toHaveAttribute("aria-current", "date");
    fireEvent.click(screen.getByRole("button", { name: "Previous month" }));
    expect(container.querySelector(".calendar-day.active-past")).toHaveTextContent(
      String(pastMonthDate.getDate()),
    );
  });

  it("keeps the calendar today marker and keyboard-focus styles distinguishable", () => {
    const styles = readFileSync(
      resolve(process.cwd(), "src/styles.css"),
      "utf8",
    );
    const todayStyles = styles.match(
      /\.calendar-grid \.today\s*\{([^}]+)\}/,
    )?.[1];
    const focusVisibleStyles = styles.match(
      /:focus-visible\s*\{([^}]+)\}/,
    )?.[1];

    expect(todayStyles).toContain("inset 0 0 0 2px var(--foreground)");
    expect(focusVisibleStyles).toContain("outline: 3px solid var(--ring)");
    expect(focusVisibleStyles).toContain("outline-offset: 4px");
    expect(todayStyles).not.toContain("var(--ring)");
  });

  it("removes custom text-selection colors and keeps status count contrast accessible", () => {
    const styles = readFileSync(
      resolve(process.cwd(), "src/styles.css"),
      "utf8",
    );
    const getToken = (name: string) =>
      styles.match(new RegExp(`${name}:\\s*(#[\\da-fA-F]{6})`))?.[1];
    const foreground = getToken("--topic-count-foreground");
    const fills = [
      getToken("--topic-count-in-progress"),
      getToken("--topic-count-not-started"),
      getToken("--topic-count-complete"),
    ];

    expect(styles).not.toMatch(/::selection/);
    expect(foreground).toBeDefined();
    expect(fills.every((fill) => fill !== undefined)).toBe(true);
    for (const fill of fills) {
      if (foreground && fill)
        expect(getContrastRatio(foreground, fill)).toBeGreaterThanOrEqual(4.5);
    }
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
    fireEvent.click(screen.getByRole("button", { name: /^CSS and layout/ }));
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

  it("hides and restores a topic task without changing its completion status", async () => {
    render(<LearningFlow initialEntry="/roadmaps/frontend" />);
    const task = document.getElementById("topic-task-how-the-web-works");
    const taskButton = document.getElementById("topic-how-the-web-works");
    const incompleteButton = document.getElementById("topic-semantic-html");
    expect(task).toBeInTheDocument();
    expect(taskButton).toHaveTextContent("Done");
    expect(taskButton?.querySelector("svg.lucide-check")).toBeVisible();
    expect(incompleteButton).toBeInTheDocument();
    expect(incompleteButton?.querySelector("svg.lucide-circle")).toBeVisible();
    expect(incompleteButton?.querySelector("svg.lucide-check")).toBeNull();

    fireEvent.click(
      screen.getByRole("button", { name: "Hide task: How the web works" }),
    );
    expect(task).toHaveClass("is-hidden");
    expect(task).toHaveAttribute("aria-hidden", "true");
    expect(task).toHaveAttribute("inert");
    expect(taskButton).toHaveTextContent("Done");
    expect(
      window.localStorage.getItem("asgard.topic-statuses"),
    ).toBeNull();

    fireEvent.click(
      screen.getByRole("button", { name: "Show task: How the web works" }),
    );
    expect(task).not.toHaveClass("is-hidden");
    expect(task).toHaveAttribute("aria-hidden", "false");
    expect(taskButton).toHaveTextContent("Done");
    expect(taskButton?.querySelector("svg.lucide-check")).toBeVisible();
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Hide task: How the web works" }),
      ).toHaveFocus(),
    );
    expect(
      window.localStorage.getItem("asgard.topic-statuses"),
    ).toBeNull();
  });
});
