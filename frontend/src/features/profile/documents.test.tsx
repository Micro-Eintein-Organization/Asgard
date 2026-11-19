import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProfileDocuments } from "./documents";
import { coreApi } from "@/features/core/data";
import { isCurrentAccount } from "@/auth/transport";

const remove = vi.fn();
const documentView = vi.hoisted(() => ({ active: true, removed: false, candidate: false, evidence: [] as { kind: string; text: string; page: number; span: string }[] }));
vi.mock("@/auth/context", () => ({ useAuth: () => ({ user: { id: "owner" } }) }));
vi.mock("@/auth/transport", () => ({ isCurrentAccount: vi.fn(() => true) }));
vi.mock("@/features/core/data", () => ({
  coreApi: {
    documents: vi.fn(), uploadDocument: vi.fn(), analyzeDocument: vi.fn(),
    removeDocuments: "remove", cleanupDocuments: vi.fn(),
  },
  useCoreQuery: () => ({ data: {
    available: true, synthetic_only: true, revision: 2,
    active: documentView.active ? { evidence: documentView.evidence } : null,
    candidate: documentView.candidate ? { id: "pending", status: "uploaded" } : null, cleanup_pending: 0,
  }, refetch: vi.fn() }),
  useCoreMutation: (operation: unknown) => ({
    isSuccess: operation === "remove" && documentView.removed,
    isPending: false, mutate: operation === "remove" ? remove : vi.fn(), reset: vi.fn(),
    mutateAsync: operation,
  }),
}));

afterEach(() => { vi.restoreAllMocks(); vi.clearAllMocks(); documentView.active = true; documentView.removed = false; documentView.candidate = false; documentView.evidence = []; vi.mocked(isCurrentAccount).mockReturnValue(true); });

describe("PDF removal", () => {
  it("does not show an old removal receipt beside a new pending PDF", () => {
    documentView.active = false;
    documentView.removed = true;
    documentView.candidate = true;
    render(<MemoryRouter><ProfileDocuments /></MemoryRouter>);
    expect(screen.getByText("A pending document is saved and can be removed.")).toBeVisible();
    expect(screen.queryByText("Document background removed from active use.")).not.toBeInTheDocument();
  });
  it("shows the removal receipt only after saved state has no document", () => {
    documentView.active = false;
    documentView.removed = true;
    render(<MemoryRouter><ProfileDocuments /></MemoryRouter>);
    expect(screen.getByText("Document background removed from active use.")).toBeVisible();
  });
  it("does not remove the saved document when confirmation is cancelled", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<MemoryRouter><ProfileDocuments /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Remove resume" }));
    expect(remove).not.toHaveBeenCalled();
  });
  it("keeps saved-document removal available in the compact reference card", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<MemoryRouter><ProfileDocuments compact /></MemoryRouter>);
    expect(screen.queryByText("Academic profile and document management")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Remove resume" }));
    expect(remove).not.toHaveBeenCalled();
  });
  it("offers extraction without a career selection and keeps the guard registered", () => {
    documentView.active = false;
    const guard = vi.fn();
    render(<MemoryRouter><ProfileDocuments compact onGuardChange={guard} /></MemoryRouter>);
    expect(screen.getByLabelText("Choose resume PDF")).toBeVisible();
    expect(screen.getByRole("button", { name: "Analyze PDF" })).toBeDisabled();
    expect(guard).toHaveBeenCalledWith(false, false);
  });
});

it("uploads and analyzes the chosen PDF only after confirmation, using the upload revision", async () => {
  vi.mocked(coreApi.uploadDocument).mockResolvedValue({ revision: 3, candidate: { id: "document", status: "uploaded" } } as never);
  vi.mocked(coreApi.analyzeDocument).mockResolvedValue({ revision: 4 } as never);
  render(<MemoryRouter><ProfileDocuments /></MemoryRouter>);
  const file = new File(["pdf"], "resume.pdf", { type: "application/pdf" });
  fireEvent.change(screen.getByLabelText("Replace resume PDF"), { target: { files: [file] } });
  expect(coreApi.uploadDocument).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Analyze PDF" })).toBeDisabled();
  fireEvent.click(screen.getByLabelText("This is a synthetic test resume with no real personal data."));
  fireEvent.click(screen.getByRole("button", { name: "Analyze PDF" }));
  await waitFor(() => expect(coreApi.analyzeDocument).toHaveBeenCalledWith({ id: "document", body: {
    expected_revision: 3, idempotency_key: expect.any(String), synthetic_document: true,
  } }));
  expect(coreApi.uploadDocument).toHaveBeenCalledWith({ file, revision: 2 });
});

it("renders persisted skills and work experience with source passages", () => {
  documentView.evidence = [
    { kind: "skill", text: "CSS", page: 1, span: "Skills: CSS" },
    { kind: "experience", text: "Frontend Developer", page: 2, span: "Worked as a Frontend Developer" },
  ];
  render(<MemoryRouter><ProfileDocuments /></MemoryRouter>);
  expect(screen.getByRole("region", { name: "Skills from resume" })).toHaveTextContent("CSS");
  expect(screen.getByRole("region", { name: "Work experience from resume" })).toHaveTextContent("Frontend Developer");
  expect(screen.getByText("Page 2")).toBeVisible();
});

it("does not analyze an uploaded file after an account change", async () => {
  vi.mocked(coreApi.uploadDocument).mockImplementation(async () => {
    vi.mocked(isCurrentAccount).mockReturnValue(false);
    return { revision: 3, candidate: { id: "document", status: "uploaded" } } as never;
  });
  render(<MemoryRouter><ProfileDocuments /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText("Replace resume PDF"), { target: { files: [new File(["pdf"], "resume.pdf")] } });
  fireEvent.click(screen.getByLabelText("This is a synthetic test resume with no real personal data."));
  fireEvent.click(screen.getByRole("button", { name: "Analyze PDF" }));
  await waitFor(() => expect(isCurrentAccount).toHaveBeenCalledWith("owner"));
  expect(coreApi.analyzeDocument).not.toHaveBeenCalled();
});

it("clears only the selected PDF without removing saved background", () => {
  documentView.evidence = [{ kind: "skill", text: "SQL", page: 1, span: "Skills: SQL" }];
  render(<MemoryRouter><ProfileDocuments /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText("Replace resume PDF"), {
    target: { files: [new File(["pdf"], "selection.pdf", { type: "application/pdf" })] },
  });
  fireEvent.click(screen.getByRole("button", { name: "Clear selected PDF" }));
  expect(screen.queryByText("selection.pdf")).not.toBeInTheDocument();
  expect(screen.getByRole("region", { name: "Skills from resume" })).toHaveTextContent("SQL");
  expect(remove).not.toHaveBeenCalled();
});

it("uses a destructive button and confirms the removal scope", () => {
  const confirm = vi.spyOn(window, "confirm").mockReturnValue(true);
  render(<MemoryRouter><ProfileDocuments /></MemoryRouter>);
  const button = screen.getByRole("button", { name: "Remove resume" });
  expect(button).toHaveAttribute("data-variant", "destructive");
  fireEvent.click(button);
  expect(confirm).toHaveBeenCalledWith(expect.stringContaining("Manual skills and learning progress are preserved"));
  expect(remove).toHaveBeenCalledWith({ expected_revision: 2 });
});
