import { render, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCoreQuery } from "@/features/core/data";
import { useRecommendationFlow } from "@/features/recommendations/use-recommendation-flow";
import { DiscoveryResults } from "./DiscoveryWizard";

vi.mock("@/features/core/data", () => ({ coreApi: {}, useCoreQuery: vi.fn(), useCoreMutation: vi.fn() }));
vi.mock("@/features/recommendations/use-recommendation-flow", () => ({ useRecommendationFlow: vi.fn() }));
vi.mock("@/features/recommendations/components", () => ({ RecommendationCards: () => <div>Saved results</div> }));

describe("final Discovery handoff", () => {
  let saved: { data: { latest_completed: { id: string; revision: number } }; isFetching: boolean };
  let flow: ReturnType<typeof useRecommendationFlow>;
  beforeEach(() => {
    saved = { data: { latest_completed: { id: "completed-session", revision: 6 } }, isFetching: false };
    flow = {
      query: { data: { available: true, current: null }, isFetching: false },
      pending: false, request: vi.fn(),
    } as unknown as ReturnType<typeof useRecommendationFlow>;
    vi.mocked(useCoreQuery).mockImplementation(() => saved as never);
    vi.mocked(useRecommendationFlow).mockImplementation(() => flow);
  });
  function open(trigger: string | null = "completed-session") {
    const router = createMemoryRouter([{ path: "/recommendations", element: <DiscoveryResults /> }], {
      initialEntries: [{ pathname: "/recommendations", state: trigger ? { generateFor: trigger } : null }],
    });
    const view = render(<RouterProvider router={router} />);
    return { router, view };
  }
  it("requests once for the saved completion and consumes its navigation trigger", async () => {
    const { router } = open();
    await waitFor(() => expect(flow.request).toHaveBeenCalledExactlyOnceWith("completed-session"));
    await waitFor(() => expect(router.state.location.state).toBeNull());
    await router.navigate("/recommendations");
    expect(flow.request).toHaveBeenCalledTimes(1);
  });
  it("waits for the matching saved completion instead of consuming a stale snapshot", async () => {
    saved.data.latest_completed.id = "old-session";
    const { router } = open();
    expect(flow.request).not.toHaveBeenCalled();
    expect(router.state.location.state).toEqual({ generateFor: "completed-session" });
    saved.data.latest_completed = { id: "completed-session", revision: 6 };
    await router.navigate("/recommendations", { state: { generateFor: "completed-session" } });
    await waitFor(() => expect(flow.request).toHaveBeenCalledTimes(1));
  });
  it("waits for recommendation refresh and does not generate on ordinary visits", async () => {
    flow.query.isFetching = true;
    const { router } = open();
    expect(flow.request).not.toHaveBeenCalled();
    flow.query.isFetching = false;
    await router.navigate("/recommendations");
    expect(flow.request).not.toHaveBeenCalled();
  });
  it("reuses matching saved runs when a handoff is remounted", async () => {
    flow.query.data!.current = {
      discovery: { session_id: "completed-session", revision: 6 }, status: "failed", outdated: false,
    } as never;
    const { router } = open();
    await waitFor(() => expect(router.state.location.state).toBeNull());
    expect(flow.request).not.toHaveBeenCalled();
  });
});
