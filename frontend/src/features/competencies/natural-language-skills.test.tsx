import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { expect, it, vi } from "vitest";
import { NaturalLanguageSkills } from "./natural-language-skills";

const calls = vi.hoisted(() => ({ preview: vi.fn(), save: vi.fn() }));
vi.mock("@/auth/context", () => ({ useAuth: () => ({ user: { id: "owner" } }) }));
vi.mock("@/auth/transport", () => ({ isCurrentAccount: () => true }));
vi.mock("@/features/core/data", () => ({
  coreApi: { interpretSkills: calls.preview, confirmSkills: calls.save },
  useCoreMutation: () => ({ mutateAsync: calls.save, isPending: false }),
}));

it("previews without saving and confirms selection with existing levels omitted", async () => {
  calls.preview.mockResolvedValue({ interpretation_available: true, items: [
    { competency_id: "sql", label: "SQL", quote: "used SQL", method: "exact", applications: [] },
  ] });
  calls.save.mockResolvedValue({ version: 8, items: [] });
  render(<MemoryRouter><QueryClientProvider client={new QueryClient()}>
    <NaturalLanguageSkills saved={{ version: 7, items: [], recommendations_enabled: false }} onGuardChange={vi.fn()} />
  </QueryClientProvider></MemoryRouter>);
  fireEvent.change(screen.getByLabelText("Describe your skills or experience"), { target: { value: "I used SQL" } });
  fireEvent.click(screen.getByRole("button", { name: "Find matching skills" }));
  await screen.findByRole("checkbox", { name: "SQL" });
  expect(calls.save).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("checkbox", { name: "SQL" }));
  fireEvent.click(screen.getByRole("button", { name: "Save selected skills" }));
  await waitFor(() => expect(calls.save).toHaveBeenCalledWith({ expected_version: 7, items: [{ competency_id: "sql" }] }));
});
