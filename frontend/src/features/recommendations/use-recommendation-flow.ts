import { useEffect, useRef, useState } from "react";
import { APIRequestError } from "@/api/errors";
import { coreApi, useCoreMutation, useCoreQuery } from "@/features/core/data";

export function useRecommendationFlow() {
  const query = useCoreQuery(["recommendations"], coreApi.recommendations);
  const generation = useCoreMutation(coreApi.generateRecommendations);
  const retry = useCoreMutation(coreApi.retryRecommendations);
  const key = useRef<string | null>(null);
  const writing = useRef(false);
  const [cooldown, setCooldown] = useState(0);
  const [retryAt, setRetryAt] = useState<number | null>(null);
  const current = query.data?.current;
  const pending =
    generation.isPending || retry.isPending || current?.status === "pending";
  useEffect(() => {
    if (current?.status !== "pending" || query.isError) return;
    const timer = setTimeout(() => void query.refetch(), 1500);
    return () => clearTimeout(timer);
  }, [current, query]);
  useEffect(() => {
    if (retryAt === null) return;
    const timer = setInterval(() => {
      const seconds = Math.max(0, Math.ceil((retryAt - Date.now()) / 1000));
      setCooldown(seconds);
      if (!seconds) {
        setRetryAt(null);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [retryAt]);

  async function request(idempotencyKey?: string) {
    const saved = query.data;
    if (
      !saved?.catalog_release_id ||
      !saved.available ||
      pending ||
      writing.current ||
      cooldown
    )
      return;
    writing.current = true;
    generation.reset();
    retry.reset();
    try {
      key.current ??= idempotencyKey ?? crypto.randomUUID();
      await generation.mutateAsync({
        idempotency_key: key.current,
        expected_context_revision: saved.context_revision,
        catalog_release_id: saved.catalog_release_id,
        occupational_release_id: saved.occupational_release_id ?? null,
      });
      key.current = null;
      generation.reset();
      retry.reset();
      setCooldown(0);
      setRetryAt(null);
    } catch (error) {
      if (error instanceof APIRequestError && error.retryAfter) {
        setCooldown(error.retryAfter);
        setRetryAt(Date.now() + error.retryAfter * 1000);
      }
    } finally {
      writing.current = false;
    }
  }

  async function retryFailed() {
    const saved = query.data;
    if (!saved?.current || pending || writing.current || cooldown) return;
    writing.current = true;
    generation.reset();
    retry.reset();
    try {
      key.current ??= crypto.randomUUID();
      await retry.mutateAsync({
        id: saved.current.id,
        body: {
          idempotency_key: key.current,
          expected_context_revision: saved.context_revision,
        },
      });
      key.current = null;
      generation.reset();
      retry.reset();
      setCooldown(0);
      setRetryAt(null);
    } catch (error) {
      if (error instanceof APIRequestError && error.retryAfter) {
        setCooldown(error.retryAfter);
        setRetryAt(Date.now() + error.retryAfter * 1000);
      }
    } finally {
      writing.current = false;
    }
  }
  async function reload() {
    if (pending) return;
    key.current = null;
    const result = await query.refetch();
    if (result.isSuccess) {
      generation.reset();
      retry.reset();
      if (result.data.current?.status === "completed") {
        setCooldown(0);
        setRetryAt(null);
      }
    }
  }
  return {
    query,
    pending,
    error: generation.error ?? retry.error,
    request,
    retryFailed,
    reload,
    cooldown,
  };
}
