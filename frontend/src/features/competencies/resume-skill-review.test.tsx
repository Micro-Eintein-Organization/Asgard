import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { coreApi } from "@/features/core/data";
import { ResumeSkillReview } from "./resume-skill-review";

vi.mock("@/features/core/data", () => ({
  useCoreQuery: () => ({ data: { enabled: true } }),
  coreApi: { resumeReviewAvailability: vi.fn(), reviewResume: vi.fn() },
}));

it("ignores a late PDF response after ending the review", async () => {
  let finish!: (value: Awaited<ReturnType<typeof coreApi.reviewResume>>) => void;
  vi.mocked(coreApi.reviewResume).mockImplementation(() =>
    new Promise((resolve) => { finish = resolve; }),
  );
  const { container } = render(
    <ResumeSkillReview careers={[{ id: "career", title: "Data Analyst" }]}
      onReview={() => null} disabled={false} />,
  );
  container.querySelector("details")!.open = true;
  fireEvent.change(screen.getByLabelText("Career"), { target: { value: "career" } });
  fireEvent.change(screen.getByLabelText("Selectable text PDF, up to 10 MB"), {
    target: { files: [new File(["pdf"], "resume.pdf", { type: "application/pdf" })] },
  });
  fireEvent.click(screen.getByRole("button", { name: "Review resume" }));
  fireEvent.click(screen.getByRole("button", { name: "End review" }));
  expect(vi.mocked(coreApi.reviewResume).mock.calls[0][2].aborted).toBe(true);
  await act(async () => finish({
    suggestions: [{ skill_id: "skill", label: "SQL", page: 1, passage: "Used SQL" }],
  }));
  expect(screen.queryByText("Used SQL")).toBeNull();
});
