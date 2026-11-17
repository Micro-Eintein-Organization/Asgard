import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { useCoreQuery } from "./data";

const account = vi.hoisted(() => ({ id: "first" }));
vi.mock("@/auth/context", () => ({ useAuth: () => ({ user: { id: account.id } }) }));
vi.mock("@/api/client", () => ({ api: {} }));

it("retains previous results only within the same account and operation", () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  client.setQueryData(["account", "first", "careers", ""], "Previous careers");
  const load = () => new Promise<string>(() => {});
  function View({ search, operation = "careers" }: { search: string; operation?: string }) {
    const query = useCoreQuery([operation, search], load, true, { keepPreviousData: true });
    return <p>{query.data ?? "Loading"}</p>;
  }
  const view = render(<QueryClientProvider client={client}><View search="" /></QueryClientProvider>);
  view.rerender(<QueryClientProvider client={client}><View search="backend" /></QueryClientProvider>);
  expect(screen.getByText("Previous careers")).toBeVisible();
  view.rerender(<QueryClientProvider client={client}><View search="backend" operation="other" /></QueryClientProvider>);
  expect(screen.getByText("Loading")).toBeVisible();
  view.rerender(<QueryClientProvider client={client}><View search="" /></QueryClientProvider>);
  account.id = "second";
  view.rerender(<QueryClientProvider client={client}><View search="backend" /></QueryClientProvider>);
  expect(screen.getByText("Loading")).toBeVisible();
  view.unmount();
  client.clear();
});
