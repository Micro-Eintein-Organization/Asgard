import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { coreApi } from "@/features/core/data";
import { ResumeSkillReview } from "./resume-skill-review";

vi.mock("@/features/core/data", () => ({
  useCoreQuery: () => ({ data: { enabled: true } }),
  coreApi: { resumeReviewAvailability: vi.fn(), reviewResume: vi.fn() },
}));

beforeEach(() => { vi.mocked(coreApi.reviewResume).mockReset(); });

it("ignores a late PDF response after ending the review", async () => {
  let finish!: (value: Awaited<ReturnType<typeof coreApi.reviewResume>>) => void;
  vi.mocked(coreApi.reviewResume).mockImplementation(() =>
    new Promise((resolve) => { finish = resolve; }),
  );
  render(
    <ResumeSkillReview careers={[{ id: "career", title: "Data Analyst" }]}
      onReview={() => null} disabled={false} />,
  );
  fireEvent.change(screen.getByLabelText("Career"), { target: { value: "career" } });
  fireEvent.change(screen.getByLabelText("Choose PDF"), {
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

const careers = [{ id: "career", title: "Data Analyst" }, { id: "other", title: "Developer" }];
const suggestions = [{ skill_id: "skill", label: "SQL", page: 1, passage: "Used SQL" }];

it.each([true, false])("retains the PDF across career changes (file first: %s)", async (fileFirst) => {
  vi.mocked(coreApi.reviewResume).mockResolvedValue({ suggestions });
  render(<ResumeSkillReview careers={careers} onReview={() => null} disabled={false} />);
  const file = new File(["pdf"], "resume.pdf", { type: "application/pdf" });
  const chooseFile = () => fireEvent.change(screen.getByLabelText("Choose PDF"), { target: { files: [file] } });
  const chooseCareer = (value: string) => fireEvent.change(screen.getByLabelText("Career"), { target: { value } });
  expect(screen.getByRole("button", { name: "Review resume" })).toBeDisabled();
  if (fileFirst) chooseFile();
  chooseCareer("career");
  if (!fileFirst) chooseFile();
  fireEvent.click(screen.getByRole("button", { name: "Review resume" }));
  await screen.findByText("Used SQL");
  chooseCareer("other");
  expect(screen.queryByText("Used SQL")).toBeNull();
  expect(screen.getByText("resume.pdf")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Review resume" }));
  await waitFor(() => expect(coreApi.reviewResume).toHaveBeenLastCalledWith("other", file, expect.any(AbortSignal)));
  await screen.findByText("Used SQL");
});

it("keeps a failed PDF available for retry and discards it on removal", async () => {
  vi.mocked(coreApi.reviewResume).mockRejectedValueOnce(new Error("Please retry")).mockResolvedValueOnce({ suggestions });
  render(<ResumeSkillReview careers={careers} initialCareer="career" onReview={() => null} disabled={false} />);
  fireEvent.change(screen.getByLabelText("Choose PDF"), { target: { files: [new File(["pdf"], "resume.pdf")] } });
  fireEvent.click(screen.getByRole("button", { name: "Review resume" }));
  await screen.findByRole("alert");
  expect(screen.getByRole("button", { name: "Review resume" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Review resume" }));
  await screen.findByText("Used SQL");
  fireEvent.click(screen.getByRole("button", { name: "Remove" }));
  expect(screen.queryByText("Used SQL")).toBeNull();
  expect(screen.getByRole("button", { name: "Review resume" })).toBeDisabled();
});

it("aborts an obsolete career request and ignores its late response", async () => {
  let finish!: (value: Awaited<ReturnType<typeof coreApi.reviewResume>>) => void;
  vi.mocked(coreApi.reviewResume).mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
  render(<ResumeSkillReview careers={careers} initialCareer="career" onReview={() => null} disabled={false} />);
  fireEvent.change(screen.getByLabelText("Choose PDF"), { target: { files: [new File(["pdf"], "resume.pdf")] } });
  fireEvent.click(screen.getByRole("button", { name: "Review resume" }));
  fireEvent.change(screen.getByLabelText("Career"), { target: { value: "other" } });
  expect(vi.mocked(coreApi.reviewResume).mock.calls[0][2].aborted).toBe(true);
  await act(async () => finish({ suggestions }));
  expect(screen.queryByText("Used SQL")).toBeNull();
  expect(screen.getByText("resume.pdf")).toBeVisible();
});
