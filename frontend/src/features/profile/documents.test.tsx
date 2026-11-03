import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProfileDocuments } from "./documents";

const remove = vi.fn();
const documentView = vi.hoisted(() => ({ active: true }));
vi.mock("@/features/core/data", () => ({
  coreApi: {
    documents: vi.fn(), uploadDocument: vi.fn(), analyzeDocument: vi.fn(),
    removeDocuments: "remove", cleanupDocuments: vi.fn(),
  },
  useCoreQuery: () => ({ data: {
    available: true, synthetic_only: true, revision: 2,
    active: documentView.active ? { evidence: [] } : null, candidate: null, cleanup_pending: 0,
  } }),
  useCoreMutation: (operation: unknown) => ({
    isPending: false, mutate: operation === "remove" ? remove : vi.fn(), reset: vi.fn(),
  }),
}));

afterEach(() => { vi.restoreAllMocks(); remove.mockClear(); documentView.active = true; });

describe("PDF removal", () => {
  it("does not remove the saved document when confirmation is cancelled", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<MemoryRouter><ProfileDocuments /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Remove document background" }));
    expect(remove).not.toHaveBeenCalled();
  });
  it("keeps saved-document removal available in the compact reference card", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<MemoryRouter><ProfileDocuments compact /></MemoryRouter>);
    expect(screen.queryByText("Academic profile and document management")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Remove document background" }));
    expect(remove).not.toHaveBeenCalled();
  });
  it("omits duplicate empty-state copy while keeping the document guard registered", () => {
    documentView.active = false;
    const guard = vi.fn();
    const view = render(<MemoryRouter><ProfileDocuments compact onGuardChange={guard} /></MemoryRouter>);
    expect(view.container).toBeEmptyDOMElement();
    expect(guard).toHaveBeenCalledWith(false, false);
  });
});
