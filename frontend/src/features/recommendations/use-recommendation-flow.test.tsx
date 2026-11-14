import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { APIRequestError } from "@/api/errors";
import { coreApi, useCoreMutation, useCoreQuery } from "@/features/core/data";
import { useRecommendationFlow } from "./use-recommendation-flow";

vi.mock("@/auth/context", () => ({ useAuth: () => ({ user: { id: "owner" } }) }));
vi.mock("@/auth/transport", () => ({ isCurrentAccount: () => true }));
vi.mock("@/features/core/data", () => ({
  coreApi: { generateRecommendations: vi.fn(), retryRecommendations: vi.fn() },
  useCoreMutation: vi.fn(),
  useCoreQuery: vi.fn(),
}));

describe("automatic Results recovery", () => {
  const generate = vi.fn();
  const retry = vi.fn();
  const failed = { id: "run-1", status: "failed", failure_code: "provider_unavailable", outdated: false };
  const saved = { available: true, context_revision: 2, catalog_release_id: "catalog", current: null as typeof failed | null };

  beforeEach(() => {
    vi.useFakeTimers();
    saved.current = null;
    saved.context_revision = 2;
    generate.mockReset().mockImplementation(async () => {
      saved.current = failed;
      return failed;
    });
    retry.mockReset().mockResolvedValue({ ...failed, id: "run-2" });
    vi.mocked(useCoreQuery).mockReturnValue({ data: saved } as never);
    vi.mocked(useCoreMutation).mockImplementation(operation => ({
      mutateAsync: operation === coreApi.generateRecommendations ? generate : retry,
      reset: vi.fn(),
    }) as never);
  });
  afterEach(() => vi.useRealTimers());

  it("waits for the cooldown and retries a failed run only once", async () => {
    const { result } = renderHook(useRecommendationFlow);
    await act(() => result.current.request("completion-key"));
    expect(result.current.willRetry).toBe(true);
    await act(() => vi.advanceTimersByTimeAsync(59000));
    expect(retry).not.toHaveBeenCalled();
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(retry).toHaveBeenCalledExactlyOnceWith({
      id: "run-1",
      body: { expected_context_revision: 2, idempotency_key: expect.any(String) },
    });
    await act(() => vi.advanceTimersByTimeAsync(60000));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("honors a short Retry-After and reuses the same request key", async () => {
    generate.mockRejectedValueOnce(new APIRequestError(
      429, { code: "quota_exceeded", message: "Wait", request_id: "request" }, 30,
    ));
    const { result } = renderHook(useRecommendationFlow);
    await act(() => result.current.request("completion-key"));
    await act(() => vi.advanceTimersByTimeAsync(29000));
    expect(generate).toHaveBeenCalledTimes(1);
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(generate).toHaveBeenCalledTimes(2);
    expect(generate.mock.calls[1][0].idempotency_key).toBe("completion-key");
  });

  it("does not auto-retry a previous visit or after the saved context changes", async () => {
    saved.current = failed;
    const { result, rerender } = renderHook(useRecommendationFlow);
    await act(() => vi.advanceTimersByTimeAsync(60000));
    expect(retry).not.toHaveBeenCalled();
    await act(() => result.current.request());
    saved.context_revision = 3;
    rerender();
    await act(() => vi.advanceTimersByTimeAsync(60000));
    expect(retry).not.toHaveBeenCalled();
  });

  it("refreshes stale v2 context and automatically requests once with the new revision", async () => {
    generate.mockRejectedValueOnce(new APIRequestError(
      409, { code: "context_outdated", message: "Saved context changed", request_id: "request" },
    ));
    const refetch = vi.fn(async () => {
      saved.context_revision = 3;
      return { isSuccess: true, data: saved };
    });
    vi.mocked(useCoreQuery).mockReturnValue({ data: saved, refetch } as never);
    const { result } = renderHook(() => useRecommendationFlow(true));
    await act(() => result.current.request("first-key"));
    expect(refetch).toHaveBeenCalledOnce();
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(generate).toHaveBeenCalledTimes(2);
    expect(generate.mock.calls[1][0].expected_context_revision).toBe(3);
    expect(generate.mock.calls[1][0].idempotency_key).not.toBe("first-key");
    await act(() => vi.advanceTimersByTimeAsync(60000));
    expect(generate).toHaveBeenCalledTimes(2);
  });
});
