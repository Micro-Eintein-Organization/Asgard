import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, it, vi } from "vitest";
import { FoundationStatus } from "./status";

vi.mock("../api/client", () => ({ getHealth: vi.fn(), getReadiness: vi.fn() }));
import { getHealth, getReadiness } from "../api/client";

function renderStatus() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <FoundationStatus />
    </QueryClientProvider>,
  );
}

it("reports a successful health and dependency check", async () => {
  vi.mocked(getHealth).mockResolvedValue({ status: "ok" });
  vi.mocked(getReadiness).mockResolvedValue({
    status: "ready",
    supabase_api: "available",
  });
  renderStatus();
  expect(await screen.findByText("Backend: Connected")).toBeInTheDocument();
  expect(await screen.findByText("Supabase API: Ready")).toBeInTheDocument();
});

it("does not represent an unavailable dependency as ready", async () => {
  vi.mocked(getHealth).mockResolvedValue({ status: "ok" });
  vi.mocked(getReadiness).mockRejectedValue(new Error("unavailable"));
  renderStatus();
  expect(
    await screen.findByText("Supabase API: Unavailable"),
  ).toBeInTheDocument();
});
