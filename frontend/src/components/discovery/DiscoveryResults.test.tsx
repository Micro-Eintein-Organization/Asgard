import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCoreMutation, useCoreQuery } from "@/features/core/data";
import { useRecommendationFlow } from "@/features/recommendations/use-recommendation-flow";
import { DiscoveryResults } from "./DiscoveryWizard";

vi.mock("@/features/core/data", () => ({ coreApi: {}, useCoreQuery: vi.fn(), useCoreMutation: vi.fn() }));
vi.mock("@/features/recommendations/use-recommendation-flow", () => ({ useRecommendationFlow: vi.fn() }));
vi.mock("@/features/recommendations/components", () => ({ RecommendationCards: () => <div>Saved results</div> }));
vi.mock("@/auth/context", () => ({ useAuth: () => ({ user: { id: "user" } }) }));
vi.mock("@/auth/transport", () => ({ isCurrentAccount: () => true }));

describe("final Discovery handoff", () => {
  let saved: { data: { latest_completed: { id: string; revision: number; questionnaire_id?: string; answers?: {question_id: string; option_ids: string[]}[]; active_question_ids?: string[] }; draft?: object }; isFetching: boolean };
  let flow: ReturnType<typeof useRecommendationFlow>;
  let retake: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    saved = { data: { latest_completed: { id: "completed-session", revision: 6, answers: [{question_id: "interests", option_ids: ["data"]}], active_question_ids: ["interests"] } }, isFetching: false };
    flow = {
      query: { data: { available: true, current: null }, isFetching: false },
      pending: false, request: vi.fn(),
    } as unknown as ReturnType<typeof useRecommendationFlow>;
    vi.mocked(useCoreQuery).mockImplementation(() => saved as never);
    vi.mocked(useRecommendationFlow).mockImplementation(() => flow);
    retake = vi.fn().mockResolvedValue({});
    vi.mocked(useCoreMutation).mockReturnValue({ mutateAsync: retake } as never);
  });
  function open(trigger: string | null = "completed-session") {
    const router = createMemoryRouter([
      { path: "/recommendations", element: <DiscoveryResults /> },
      { path: "/discovery", element: <p>Discovery editor</p> },
    ], {
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
    saved.data.latest_completed = { id: "completed-session", revision: 6, answers: [{question_id: "interests", option_ids: ["data"]}], active_question_ids: ["interests"] };
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
      discovery: { session_id: "completed-session", revision: 6, answers: [{question_id: "interests", option_ids: ["data"]}], active_question_ids: ["interests"] }, status: "failed", outdated: false,
    } as never;
    const { router } = open();
    await waitFor(() => expect(router.state.location.state).toBeNull());
    expect(flow.request).not.toHaveBeenCalled();
  });
  it("starts a full retake from Results using the saved completion", async () => {
    open(null);
    fireEvent.click(screen.getByRole("button", { name: "Retake Discovery" }));
    await screen.findByText("Discovery editor");
    expect(retake).toHaveBeenCalledExactlyOnceWith({
      source_session_id: "completed-session",
      expected_revision: 6,
    });
  });
  it("offers resume when a draft already exists", () => {
    saved.data.draft = { id: "saved-draft" };
    open(null);
    expect(screen.getByRole("link", { name: "Resume Discovery" })).toHaveAttribute("href", "/discovery");
    expect(screen.queryByRole("button", { name: "Retake Discovery" })).not.toBeInTheDocument();
  });

  function useV2() {
    saved.data.latest_completed.questionnaire_id = "questionnaire-v2";
    vi.mocked(useCoreQuery).mockImplementation(key =>
      (key[0] === "questionnaire" ? { data: { version: 2 } } : saved) as never,
    );
  }

  it("automatically prepares a missing v2 result on a direct visit, once", async () => {
    useV2();
    const { router } = open(null);
    await waitFor(() => expect(flow.request).toHaveBeenCalledExactlyOnceWith());
    await router.navigate("/recommendations");
    expect(flow.request).toHaveBeenCalledTimes(1);
  });

  it("replaces an older AI result automatically and leaves current v2 results alone", async () => {
    useV2();
    const data = flow.query.data!;
    const older = {
      model_id: "old-provider", status: "completed", outdated: true,
      discovery: { session_id: "completed-session", revision: 6, answers: [{question_id: "interests", option_ids: ["data"]}], active_question_ids: ["interests"] },
    };
    data.current = older as never;
    const previous = open(null);
    await waitFor(() => expect(flow.request).toHaveBeenCalledTimes(1));
    previous.view.unmount();
    vi.mocked(flow.request).mockClear();
    data.current = { ...older, model_id: null, outdated: false } as never;
    open(null);
    expect(flow.request).not.toHaveBeenCalled();
  });

  it("does not keep requesting when a v2 result has no eligible career", () => {
    useV2();
    flow.query.data!.current = {
      model_id: null, status: "failed", outdated: false, failure_code: "no_supported_careers",
      discovery: { session_id: "completed-session", revision: 6, answers: [{question_id: "interests", option_ids: ["data"]}], active_question_ids: ["interests"] },
    } as never;
    open(null);
    expect(flow.request).not.toHaveBeenCalled();
  });
  it("automatically refreshes an uncertain result when saved experience changes", async () => {
    useV2();
    saved.data.latest_completed.answers = [{question_id: "interests", option_ids: ["unsure"]}];
    const current = {discovery: {session_id: "completed-session", revision: 6},
      status: "failed", failure_code: "no_supported_careers", outdated: false,
      model_id: null, prompt_version: "experience-fallback-1"};
    flow.query.data!.current = current as never;
    const {router} = open(null);
    expect(flow.request).not.toHaveBeenCalled();
    current.outdated = true;
    flow.query.data!.context_revision = 3;
    await router.navigate("/recommendations");
    await waitFor(() => expect(flow.request).toHaveBeenCalledOnce());
    await router.navigate("/recommendations");
    expect(flow.request).toHaveBeenCalledOnce();
  });

});
