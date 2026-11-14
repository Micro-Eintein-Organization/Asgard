import { useEffect, useEffectEvent, useRef, useState } from "react";
import { APIRequestError } from "@/api/errors";
import { useAuth } from "@/auth/context";
import { isCurrentAccount } from "@/auth/transport";
import { coreApi, useCoreMutation, useCoreQuery } from "@/features/core/data";

const RUN_COOLDOWN_SECONDS = 60;

function requestScope(userId: string | undefined, saved: Awaited<ReturnType<typeof coreApi.recommendations>> | undefined) {
  return JSON.stringify([
    userId, saved?.context_revision, saved?.catalog_release_id, saved?.occupational_release_id,
  ]);
}

export function useRecommendationFlow(rulesMode = false) {
  const { user } = useAuth();
  const query = useCoreQuery(["recommendations"], coreApi.recommendations);
  const generation = useCoreMutation(coreApi.generateRecommendations);
  const retry = useCoreMutation(coreApi.retryRecommendations);
  const key = useRef<string | null>(null);
  const writing = useRef(false);
  const [cooldown, setCooldown] = useState(0);
  const [retryAt, setRetryAt] = useState<number | null>(null);
  const [recovery, setRecovery] = useState<{
    scope: string;
    observedRun?: string;
    retryRun?: string;
  } | null>(null);
  const current = query.data?.current;
  const scope = requestScope(user?.id, query.data);
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

  function waitBeforeRetry(seconds: number) {
    setCooldown(seconds);
    setRetryAt(Date.now() + seconds * 1000);
  }

  async function execute(retryRun?: string, idempotencyKey?: string, automatic = false) {
    const saved = query.data;
    if (
      !saved?.catalog_release_id ||
      !saved.available ||
      pending ||
      writing.current ||
      cooldown ||
      (retryRun && (saved.current?.id !== retryRun ||
        saved.current.status !== "failed" || saved.current.outdated))
    )
      return;
    writing.current = true;
    setRecovery(null);
    generation.reset();
    retry.reset();
    try {
      key.current ??= idempotencyKey ?? crypto.randomUUID();
      const body = {
        idempotency_key: key.current,
        expected_context_revision: saved.context_revision,
      };
      const run = retryRun
        ? await retry.mutateAsync({ id: retryRun, body })
        : await generation.mutateAsync({
            ...body,
            catalog_release_id: saved.catalog_release_id,
            occupational_release_id: saved.occupational_release_id ?? null,
          });
      key.current = null;
      generation.reset();
      retry.reset();
      setCooldown(0);
      setRetryAt(null);
      if (!automatic && run.status === "failed" && !run.outdated &&
          (run.failure_code === "provider_unavailable" || run.failure_code === "timeout")) {
        setRecovery({ scope, observedRun: run.id, retryRun: run.id });
        waitBeforeRetry(RUN_COOLDOWN_SECONDS);
      }
    } catch (error) {
      if (rulesMode && !automatic && user && error instanceof APIRequestError &&
          error.body.code === "context_outdated") {
        key.current = null;
        const latest = await query.refetch();
        if (isCurrentAccount(user.id) && latest.isSuccess && latest.data.available) {
          if (latest.data.current?.status === "completed" && !latest.data.current.outdated) {
            generation.reset();
            retry.reset();
          } else {
            setRecovery({
              scope: requestScope(user.id, latest.data),
              observedRun: latest.data.current?.id,
            });
            waitBeforeRetry(1);
          }
        }
        return;
      }
      const retryAfter = error instanceof APIRequestError ? error.retryAfter : null;
      const temporary = error instanceof TypeError || (
        error instanceof APIRequestError && (
          error.body.code === "provider_unavailable" ||
          (rulesMode && [502, 503, 504].includes(error.status) &&
            error.body.code !== "catalog_unpublished") ||
          (error.status === 429 && retryAfter !== null && retryAfter <= RUN_COOLDOWN_SECONDS)
        )
      );
      if (!automatic && temporary && (retryAfter ?? 0) <= RUN_COOLDOWN_SECONDS) {
        setRecovery({ scope, observedRun: saved.current?.id, retryRun });
        waitBeforeRetry(Math.max(retryAfter ?? 0, 5));
      } else if (retryAfter) waitBeforeRetry(retryAfter);
    } finally {
      writing.current = false;
    }
  }

  const automaticRetry = useEffectEvent((retryRun?: string) => {
    void execute(retryRun, undefined, true);
  });
  const willRetry = !!recovery && recovery.scope === scope &&
    recovery.observedRun === current?.id && !!query.data?.available;
  useEffect(() => {
    if (!recovery || !willRetry || cooldown || pending || query.isFetching || query.isError) return;
    automaticRetry(recovery.retryRun);
  }, [recovery, willRetry, cooldown, pending, query.isFetching, query.isError]);

  function request(idempotencyKey?: string) {
    return execute(undefined, idempotencyKey);
  }

  function retryFailed() {
    if (current) return execute(current.id);
  }
  async function reload() {
    if (pending) return;
    setRecovery(null);
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
    willRetry,
  };
}
