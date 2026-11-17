import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { beforeEach, expect, it, vi } from "vitest";
import { FoundationStatus } from "./status";
vi.mock("../api/client", () => ({ getHealth: vi.fn(), getReadiness: vi.fn() }));
vi.mock("@/auth/context", () => ({ useAuth: () => ({ user: null, loading: false, error: null, mfa: "ready" }) }));
import { getHealth, getReadiness } from "../api/client";
beforeEach(() => vi.resetAllMocks());
function renderStatus() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <MemoryRouter>
      <QueryClientProvider client={client}>
        <FoundationStatus />
      </QueryClientProvider>
    </MemoryRouter>,
  );
}
function servicesUp() {
  vi.mocked(getHealth).mockResolvedValue({ status: "ok" });
  vi.mocked(getReadiness).mockResolvedValue({
    status: "ready",
    supabase_api: "available",
  });
}
it("reports current connectivity without promising uptime or feature health", async () => {
  servicesUp();
  renderStatus();
  expect(
    await screen.findByRole("heading", { name: "Service is up" }),
  ).toBeInTheDocument();
  expect(screen.getAllByText("Operational")).toHaveLength(2);
  expect(
    screen.getByText(/Last checked/).querySelector("time"),
  ).toHaveAttribute("datetime");
  expect(screen.getByText(/They do not verify sign-in/)).toBeInTheDocument();
  expect(screen.queryByText(/99%/)).not.toBeInTheDocument();
});
it("shows partial failure and recovers through an explicit check", async () => {
  servicesUp();
  vi.mocked(getReadiness).mockRejectedValueOnce(new Error("unavailable"));
  renderStatus();
  expect(
    await screen.findByRole("heading", {
      name: "Some services are unavailable",
    }),
  ).toBeInTheDocument();
  expect(screen.getByText("Unavailable")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Check again" }));
  expect(
    await screen.findByRole("heading", { name: "Service is up" }),
  ).toBeInTheDocument();
  expect(getHealth).toHaveBeenCalledTimes(2);
  expect(getReadiness).toHaveBeenCalledTimes(2);
});
it("keeps initial checks pending without showing success", () => {
  vi.mocked(getHealth).mockReturnValue(new Promise(() => {}));
  vi.mocked(getReadiness).mockReturnValue(new Promise(() => {}));
  renderStatus();
  expect(
    screen.getByRole("heading", { name: "Checking services" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Checking…" })).toBeDisabled();
  expect(screen.queryByText("Operational")).not.toBeInTheDocument();
});
it("reports total failure with startup guidance", async () => {
  vi.mocked(getHealth).mockRejectedValue(new Error("offline"));
  vi.mocked(getReadiness).mockRejectedValue(new Error("offline"));
  renderStatus();
  expect(
    await screen.findByRole("heading", { name: "Unable to reach services" }),
  ).toBeInTheDocument();
  expect(screen.getAllByText("Unavailable")).toHaveLength(2);
  expect(screen.getByText(/about a minute to start/)).toBeInTheDocument();
});
it("rejects a fulfilled but unavailable dependency result", async () => {
  servicesUp();
  vi.mocked(getReadiness).mockResolvedValue({
    status: "ready",
    supabase_api: "unavailable",
  });
  renderStatus();
  expect(
    await screen.findByRole("heading", {
      name: "Some services are unavailable",
    }),
  ).toBeInTheDocument();
});
it("hides stale success during refresh and reports a subsequent failure", async () => {
  servicesUp();
  let rejectRefresh!: (reason: Error) => void;
  renderStatus();
  await screen.findByRole("heading", { name: "Service is up" });
  vi.mocked(getReadiness).mockImplementationOnce(
    () =>
      new Promise((_, reject) => {
        rejectRefresh = reject;
      }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Check again" }));
  expect(
    await screen.findByRole("heading", { name: "Checking services" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Checking…" })).toBeDisabled();
  await waitFor(() => expect(rejectRefresh).toBeDefined());
  rejectRefresh(new Error("offline"));
  expect(
    await screen.findByRole("heading", {
      name: "Some services are unavailable",
    }),
  ).toBeInTheDocument();
  expect(screen.getByText("Unavailable")).toBeInTheDocument();
});
