import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProfileDocuments } from "./documents";

const remove = vi.fn();
vi.mock("@/features/core/data", () => ({
  coreApi: {
    documents: vi.fn(), uploadDocument: vi.fn(), analyzeDocument: vi.fn(),
    removeDocuments: "remove", cleanupDocuments: vi.fn(),
  },
  useCoreQuery: () => ({ data: {
    available: true, synthetic_only: true, revision: 2,
    active: { evidence: [] }, candidate: null, cleanup_pending: 0,
  } }),
  useCoreMutation: (operation: unknown) => ({
    isPending: false, mutate: operation === "remove" ? remove : vi.fn(), reset: vi.fn(),
  }),
}));

afterEach(() => { vi.restoreAllMocks(); remove.mockClear(); });

describe("PDF removal", () => {
  it("does not remove the saved document when confirmation is cancelled", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<MemoryRouter><ProfileDocuments /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Remove document background" }));
    expect(remove).not.toHaveBeenCalled();
  });
});
