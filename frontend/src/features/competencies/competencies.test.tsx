import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, expect, it, vi } from "vitest";
import { coreApi, useCoreMutation, useCoreQuery } from "@/features/core/data";
import { ProfileSkills } from "./profile-skills";
import { SkillComparison } from "./comparison";
import { experienceLabel } from "./levels";

vi.mock("@/auth/context", () => ({
  useAuth: () => ({ user: { id: "owner" } }),
}));
vi.mock("@/auth/transport", () => ({ isCurrentAccount: () => true }));
vi.mock("@/features/core/data", () => ({
  coreApi: {
    myCompetencies: vi.fn(),
    competencies: vi.fn(),
    saveCompetency: vi.fn(),
    removeCompetency: vi.fn(),
    competencyComparison: vi.fn(),
    resumeReviewAvailability: vi.fn(),
    reviewResume: vi.fn(),
  },
  useCoreQuery: vi.fn(),
  useCoreMutation: vi.fn(),
}));
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(coreApi.saveCompetency).mockResolvedValue({
    version: 8,
    items: [],
    recommendations_enabled: false,
  });
  vi.mocked(coreApi.removeCompetency).mockResolvedValue({
    version: 8,
    items: [],
    recommendations_enabled: false,
  });
  vi.mocked(useCoreMutation).mockImplementation(
    (save) =>
      ({ mutateAsync: save, isPending: false, reset: vi.fn() }) as never,
  );
  vi.mocked(useCoreQuery).mockImplementation(
    (key) =>
      ({
        data:
          key[0] === "skills"
            ? {
                version: 7,
                items: [
                  {
                    competency_id: "sql",
                    label: "SQL",
                    level: null,
                    updated_at: "2026-11-04",
                  },
                ],
              }
            : key[0] === "skill-comparison"
              ? {
                  items: [
                    {
                      id: "sql",
                      label: "SQL",
                      recorded: false,
                      level: null,
                      source: "Asgard-authored",
                      source_version: "v1",
                      topics: [
                        {
                          topic_id: "topic",
                          roadmap_id: "roadmap",
                          title: "Practice SQL",
                        },
                      ],
                    },
                  ],
                }
              : { items: [], total: 0 },
        refetch: vi.fn(),
      }) as never,
  );
});
it("distinguishes unassessed, saved unknown and explicit zero", () => {
  expect(experienceLabel(false, null)).toBe("Not recorded");
  expect(experienceLabel(true, null)).toBe("Not sure yet");
  expect(experienceLabel(true, 0)).toContain("No experience");
});
it("explains an empty published catalog when a skill search has no results", () => {
  render(<ProfileSkills onGuardChange={vi.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Add a skill" }));
  fireEvent.change(screen.getByLabelText("Find a skill"), { target: { value: "css" } });
  expect(screen.getByText(/The published skill catalog is empty/)).toBeVisible();
});
it("saves zero with the revision captured when editing and clears the guard", async () => {
  const guard = vi.fn();
  render(<ProfileSkills onGuardChange={guard} />);
  fireEvent.click(screen.getByRole("button", { name: "Edit SQL" }));
  expect(guard).toHaveBeenLastCalledWith(true, false);
  fireEvent.change(screen.getByLabelText("Your experience"), {
    target: { value: "0" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save skill" }));
  await waitFor(() =>
    expect(coreApi.saveCompetency).toHaveBeenCalledWith({
      id: "sql",
      body: { expected_version: 7, level: 0 },
    }),
  );
  await waitFor(() => expect(guard).toHaveBeenLastCalledWith(false, false));
});
it("keeps a failed edit available for reconciliation", async () => {
  vi.mocked(coreApi.saveCompetency).mockRejectedValue(new Error("Conflict"));
  render(<ProfileSkills onGuardChange={vi.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Edit SQL" }));
  fireEvent.click(screen.getByRole("button", { name: "Save skill" }));
  await waitFor(() => expect(coreApi.saveCompetency).toHaveBeenCalled());
  expect(screen.getByLabelText("Your experience")).toHaveValue("");
});
it("adds a PDF suggestion only after an explicit experience save", async () => {
  vi.mocked(useCoreQuery).mockImplementation((key) => ({
    data: key[0] === "skills" ? { version: 7, items: [], recommendations_enabled: false }
      : key[0] === "resume-review-availability" ? { enabled: true }
      : { items: [{ id: "career", title: "Data Analyst", roadmap_ids: [] }], total: 1 },
    refetch: vi.fn(),
  }) as never);
  vi.mocked(coreApi.reviewResume).mockResolvedValue({ suggestions: [
    { skill_id: "sql", label: "SQL", page: 1, passage: "Used SQL" },
  ] });
  render(<ProfileSkills onGuardChange={vi.fn()} />);
  screen.getByText("Review career-linked skills without storing a resume").closest("details")!.open = true;
  fireEvent.change(screen.getByLabelText("Career"), { target: { value: "career" } });
  fireEvent.change(screen.getByLabelText("Choose PDF"), { target: { files: [new File(["pdf"], "resume.pdf")] } });
  fireEvent.click(screen.getByRole("button", { name: "Review resume" }));
  fireEvent.click(await screen.findByRole("button", { name: "Add SQL" }));
  expect(coreApi.saveCompetency).not.toHaveBeenCalled();
  expect(screen.getByLabelText("Your experience")).toHaveFocus();
  fireEvent.change(screen.getByLabelText("Your experience"), { target: { value: "2" } });
  fireEvent.click(screen.getByRole("button", { name: "Save skill" }));
  await waitFor(() => expect(coreApi.saveCompetency).toHaveBeenCalledWith({ id: "sql", body: { expected_version: 7, level: 2 } }));
  await screen.findByText("Skill saved.");
});
it("opens a bounded comparison with exact topic links and no learning writes", () => {
  render(
    <MemoryRouter>
      <SkillComparison careerId="career" roadmapId="roadmap" initiallyOpen />
    </MemoryRouter>,
  );
  expect(screen.getByRole("dialog")).toBeVisible();
  expect(screen.getByText("Not recorded")).toBeVisible();
  expect(screen.getByRole("link", { name: "Review skills from a resume" })).toHaveAttribute(
    "href", "/settings/profile?reviewCareer=career&reviewRoadmap=roadmap#resume-skill-review",
  );
  expect(screen.getByRole("link", { name: "Practice SQL" })).toHaveAttribute(
    "href",
    "/roadmaps/career?roadmap=roadmap&topic=topic",
  );
  expect(coreApi.saveCompetency).not.toHaveBeenCalled();
});
