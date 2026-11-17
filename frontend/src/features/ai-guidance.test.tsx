import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { expect, it, vi } from "vitest";
import { api } from "@/api/client";
import { CounselorLauncher } from "./ai-guidance";

vi.mock("@/api/client", () => ({ api: { POST: vi.fn() } }));
vi.mock("@/auth/context", () => ({ useAuth: () => ({ user: { id: "owner" } }) }));
vi.mock("@/features/core/data", () => ({ useCoreQuery: () => ({ data: true }) }));
vi.mock("@/features/profile/identity", () => ({ useSavedProfile: () => ({ data: null }) }));
vi.mock("@/features/counselor-context", () => ({ useCurrentScreen: () => ({ label: "Profile", category_id: "category" }) }));

it("uses background context without controls and keeps sending state accessible", async () => {
  vi.mocked(api.POST).mockImplementation(() => new Promise(() => {}));
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const view = render(<QueryClientProvider client={client}><MemoryRouter>
    <CounselorLauncher page="/settings/profile" />
  </MemoryRouter></QueryClientProvider>);
  fireEvent.click(screen.getByRole("button", { name: "Open AI Counselor" }));
  expect(screen.queryByLabelText("Use page context")).not.toBeInTheDocument();
  expect(screen.queryByText(/^Using:/)).not.toBeInTheDocument();
  const send = screen.getByRole("button", { name: "Send question" });
  expect(send).toBeDisabled();
  fireEvent.change(screen.getByRole("textbox", { name: "Your question" }), { target: { value: "How does this work?" } });
  expect(send).toBeEnabled();
  fireEvent.click(send);
  await waitFor(() => expect(api.POST).toHaveBeenCalled());
  expect(api.POST).toHaveBeenCalledWith("/api/v1/me/ai-guidance/counselor", expect.objectContaining({ body: expect.objectContaining({
    question: "How does this work?", search_web: false,
    page_context: expect.objectContaining({ path: "/settings/profile", category_id: "category" }),
  }) }));
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Preparing your answer"));
  expect(send).toBeDisabled();
  expect(screen.getByRole("status").querySelector(".loading-indicator")).not.toBeNull();
  view.unmount();
  client.clear();
});
