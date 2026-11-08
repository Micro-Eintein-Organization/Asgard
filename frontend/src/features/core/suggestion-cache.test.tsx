import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { useCoreMutation, useCoreQuery } from "./data";

vi.mock("@/auth/context", () => ({
  useAuth: () => ({ user: { id: "owner" } }),
}));
vi.mock("@/auth/transport", () => ({ isCurrentAccount: () => true }));
vi.mock("@/api/client", () => ({ api: {} }));

it("clears suggestions and rejects a late read after a successful skill edit", async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const key = ["account", "owner", "recommendations"];
  client.setQueryData(key, { current: "old private explanation" });
  let oldSignal: AbortSignal | undefined;
  let resolveOld: ((value: { current: string | null }) => void) | undefined;
  let reads = 0;
  const load = (signal?: AbortSignal) => {
    if (reads++ > 0) return Promise.resolve({ current: null });
    oldSignal = signal;
    return new Promise<{ current: string | null }>((resolve) => {
      resolveOld = resolve;
    });
  };
  function View() {
    const suggestions = useCoreQuery(["recommendations"], load);
    const save = useCoreMutation(async () => ({ saved: true }), {
      clearSuggestions: () => true,
    });
    return (
      <>
        <p>{suggestions.data?.current ?? "No saved suggestions"}</p>
        <button onClick={() => save.mutate(undefined)}>Save skill edit</button>
      </>
    );
  }
  render(
    <QueryClientProvider client={client}>
      <View />
    </QueryClientProvider>,
  );
  await waitFor(() => expect(oldSignal).toBeDefined());
  fireEvent.click(screen.getByRole("button", { name: "Save skill edit" }));
  await waitFor(() =>
    expect(screen.getByText("No saved suggestions")).toBeVisible(),
  );
  expect(oldSignal?.aborted).toBe(true);
  await act(async () => {
    resolveOld?.({ current: "old private explanation" });
  });
  expect(screen.queryByText("old private explanation")).not.toBeInTheDocument();
  expect(client.getQueryData(key)).toEqual({ current: null });
  client.clear();
});
