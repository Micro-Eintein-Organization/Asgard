import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import { requestError } from "@/api/errors";
import type { components } from "@/api/generated/schema";
import { useAuth } from "@/auth/context";
import { isCurrentAccount } from "@/auth/transport";

type Schemas = components["schemas"];

async function result<T>(
  request: Promise<{
    data?: T;
    error?: Schemas["ErrorBody"];
    response: Response;
  }>,
): Promise<T> {
  const response = await request;
  if (response.error || response.data === undefined)
    throw requestError(response.response, response.error);
  return response.data;
}

export const coreApi = {
  catalogSummary: (signal?: AbortSignal) => result(api.GET("/api/v1/catalog/summary", { signal })),
  dashboardView: (signal?: AbortSignal) => result(api.GET("/api/v1/me/dashboard/view", { signal })),
  catalogProgress: (ids: string[], signal?: AbortSignal) =>
    result(api.GET("/api/v1/me/roadmaps/catalog-progress", {
      params: { query: { roadmap_ids: ids } }, signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(90_000)]) : AbortSignal.timeout(90_000),
    })),
  roadmapView: (id: string, signal?: AbortSignal) =>
    result(api.GET("/api/v1/me/roadmaps/{roadmap_id}/view", {
      params: { path: { roadmap_id: id } }, signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(90_000)]) : AbortSignal.timeout(90_000),
    })),
  roadmapGuidance: (roadmapId: string, signal?: AbortSignal) =>
    result(api.GET("/api/v1/me/roadmaps/{roadmap_id}/guidance", {
      params: { path: { roadmap_id: roadmapId } }, signal,
    })),
  savePractice: ({ roadmapId, topicId, body }: {
    roadmapId: string; topicId: string; body: Schemas["SavePractice"];
  }) => result(api.PUT("/api/v1/me/roadmaps/{roadmap_id}/guidance/practice/{topic_id}", {
    params: { path: { roadmap_id: roadmapId, topic_id: topicId } }, body,
  })),
  saveMilestoneReflection: ({ roadmapId, milestoneId, body }: {
    roadmapId: string; milestoneId: string; body: Schemas["SaveReflection"];
  }) => result(api.PUT("/api/v1/me/roadmaps/{roadmap_id}/guidance/reflections/{milestone_id}", {
    params: { path: { roadmap_id: roadmapId, milestone_id: milestoneId } }, body,
  })),
  deleteMilestoneReflection: ({ roadmapId, milestoneId, body }: {
    roadmapId: string; milestoneId: string; body: Schemas["VersionedChange"];
  }) => result(api.DELETE("/api/v1/me/roadmaps/{roadmap_id}/guidance/reflections/{milestone_id}", {
    params: { path: { roadmap_id: roadmapId, milestone_id: milestoneId } }, body,
  })),
  escoConcepts: (
    query: { q: string; kind?: "occupation" | "skill"; offset: number; expected_release_id?: string; career_id?: string },
    signal?: AbortSignal,
  ) => result(api.GET("/api/v1/esco/concepts", { params: { query }, signal })),
  escoConcept: (
    query: { uri: string; offset: number; expected_release_id?: string },
    signal?: AbortSignal,
  ) => result(api.GET("/api/v1/esco/concept", { params: { query }, signal })),
  careerShortlist: () => result(api.GET("/api/v1/me/career-shortlist")),
  saveCareer: ({ id, body }: { id: string; body: Schemas["SaveCareer"] }) => result(api.PATCH("/api/v1/me/career-shortlist/{career_id}", { params: { path: { career_id: id } }, body })),
  removeCareer: ({ id, body }: { id: string; body: Schemas["VersionedChange"] }) => result(api.POST("/api/v1/me/career-shortlist/{career_id}/remove", { params: { path: { career_id: id } }, body })),
  compareCareers: (left: string, right: string, signal?: AbortSignal) => result(api.GET("/api/v1/me/career-comparison", { params: { query: { left, right } }, signal })),
  careerEvidence: (
    careerId: string,
    query: {
      limit?: number;
      offset?: number;
      source_role?: string;
      expected_release_id?: string;
    } = {},
    signal?: AbortSignal,
  ) =>
    result(
      api.GET("/api/v1/careers/{career_id}/evidence", {
        params: { path: { career_id: careerId }, query },
        signal,
      }),
    ),
  competencies: (
    query: {
      q?: string;
      career_id?: string;
      limit?: number;
      offset?: number;
    } = {},
  ) => result(api.GET("/api/v1/competencies", { params: { query } })),
  myCompetencies: () => result(api.GET("/api/v1/me/competencies")),
  saveCompetency: ({
    id,
    body,
  }: {
    id: string;
    body: Schemas["SaveCompetency"];
  }) =>
    result(
      api.PATCH("/api/v1/me/competencies/{competency_id}", {
        params: { path: { competency_id: id } },
        body,
      }),
    ),
  removeCompetency: ({
    id,
    body,
  }: {
    id: string;
    body: Schemas["VersionedChange"];
  }) =>
    result(
      api.POST("/api/v1/me/competencies/{competency_id}/remove", {
        params: { path: { competency_id: id } },
        body,
      }),
    ),
  competencyComparison: (careerId: string) =>
    result(
      api.GET("/api/v1/me/careers/{career_id}/competency-comparison", {
        params: { path: { career_id: careerId } },
      }),
    ),
  documents: () => result(api.GET("/api/v1/me/documents")),
  resumeReviewAvailability: () => result(api.GET("/api/v1/me/documents/resume-skill-review")),
  reviewResume: (careerId: string, file: File, signal: AbortSignal) =>
    result(api.POST("/api/v1/me/documents/resume-skill-review", {
      params: { query: { career_id: careerId } },
      body: file as unknown as string,
      bodySerializer: () => file,
      headers: { "Content-Type": "application/pdf" },
      cache: "no-store",
      signal,
    })),
  uploadDocument: ({ file, revision }: { file: File; revision: number }) =>
    result(
      api.POST("/api/v1/me/documents/upload", {
        params: { query: { expected_revision: revision } },
        body: file as unknown as string,
        bodySerializer: (body) => body as unknown as File,
        headers: { "Content-Type": "application/pdf" },
      }),
    ),
  interpretResume: (id: string) => result(api.POST(
    "/api/v1/me/documents/{document_id}/skill-interpretation", {
      params: { path: { document_id: id } }, signal: AbortSignal.timeout(65_000),
    },
  )),
  analyzeDocument: ({
    id,
    body,
  }: {
    id: string;
    body: Schemas["AnalyzeDocument"];
  }) =>
    result(
      api.POST("/api/v1/me/documents/{document_id}/analyze", {
        params: { path: { document_id: id } },
        body,
      }),
    ),
  removeDocuments: (body: Schemas["DocumentCommand"]) =>
    result(api.POST("/api/v1/me/documents/remove", { body })),
  cleanupDocuments: () => result(api.POST("/api/v1/me/documents/cleanup")),
  categories: (signal?: AbortSignal) => result(api.GET("/api/v1/categories", { signal })),
  catalog: (
    query: {
      q?: string;
      category_id?: string;
      limit?: number;
      offset?: number;
    } = {}, signal?: AbortSignal,
  ) => result(api.GET("/api/v1/careers", { params: { query }, signal })),
  career: (id: string) =>
    result(
      api.GET("/api/v1/careers/{career_id}", {
        params: { path: { career_id: id } },
      }),
    ),
  roadmap: (id: string) =>
    result(
      api.GET("/api/v1/roadmaps/{roadmap_id}", {
        params: { path: { roadmap_id: id } },
      }),
    ),
  preferences: (signal?: AbortSignal) => result(api.GET("/api/v1/me/preferences", { signal })),
  savePreferences: (body: Schemas["SavePreferences"]) =>
    result(api.PATCH("/api/v1/me/preferences", { body })),
  learning: () => result(api.GET("/api/v1/me/learning")),
  selectRoadmap: (body: Schemas["SelectRoadmap"]) =>
    result(api.PATCH("/api/v1/me/learning", { body })),
  progress: (id: string) =>
    result(
      api.GET("/api/v1/me/roadmaps/{roadmap_id}/progress", {
        params: { path: { roadmap_id: id } },
      }),
    ),
  branches: (id: string) =>
    result(
      api.GET("/api/v1/me/roadmaps/{roadmap_id}/branches", {
        params: { path: { roadmap_id: id } },
      }),
    ),
  saveBranch: ({
    roadmapId,
    groupId,
    body,
  }: {
    roadmapId: string;
    groupId: string;
    body: Schemas["SaveBranchChoice"];
  }) =>
    result(
      api.PATCH("/api/v1/me/roadmaps/{roadmap_id}/branches/{group_id}", {
        params: { path: { roadmap_id: roadmapId, group_id: groupId } },
        body,
      }),
    ),
  saveProgress: ({
    roadmapId,
    topicId,
    body,
  }: {
    roadmapId: string;
    topicId: string;
    body: Schemas["SaveTopicProgress"];
  }) =>
    result(
      api.PATCH("/api/v1/me/roadmaps/{roadmap_id}/topics/{topic_id}", {
        params: { path: { roadmap_id: roadmapId, topic_id: topicId } },
        body,
      }),
    ),
  summary: (id: string) =>
    result(
      api.GET("/api/v1/me/roadmaps/{roadmap_id}/summary", {
        params: { path: { roadmap_id: id } },
      }),
    ),
  dashboard: () => result(api.GET("/api/v1/me/dashboard")),
  activity: (month: string) =>
    result(api.GET("/api/v1/me/activity", { params: { query: { month } } })),
  discovery: (signal?: AbortSignal) => result(api.GET("/api/v1/me/discovery", { signal })),
  discoverySession: (id: string) =>
    result(api.GET("/api/v1/me/discovery/{session_id}", {
      params: { path: { session_id: id } },
    })),
  questionnaire: (id?: string, signal?: AbortSignal) =>
    result(
      api.GET("/api/v1/discovery/questionnaire", {
        params: { query: { questionnaire_id: id } }, signal,
      }),
    ),
  startDiscovery: (body: Schemas["StartDiscovery"]) =>
    result(api.POST("/api/v1/me/discovery", { body })),
  saveDiscovery: ({
    id,
    body,
  }: {
    id: string;
    body: Schemas["SaveDiscovery"];
  }) =>
    result(
      api.PATCH("/api/v1/me/discovery/{session_id}/answers", {
        params: { path: { session_id: id } },
        body,
      }),
    ),
  completeDiscovery: ({
    id,
    body,
  }: {
    id: string;
    body: Schemas["CompleteDiscovery"];
  }) =>
    result(
      api.POST("/api/v1/me/discovery/{session_id}/complete", {
        params: { path: { session_id: id } },
        body,
      }),
    ),
  retakeDiscovery: (body: Schemas["RetakeDiscovery"]) =>
    result(api.POST("/api/v1/me/discovery/retake", { body })),
  recommendations: (signal?: AbortSignal) =>
    result(api.GET("/api/v1/me/recommendations", { signal })),
  generateRecommendations: (body: Schemas["RequestRecommendations"]) =>
    result(api.POST("/api/v1/me/recommendations", { body })),
  retryRecommendations: ({
    id,
    body,
  }: {
    id: string;
    body: Schemas["RetryRecommendations"];
  }) =>
    result(
      api.POST("/api/v1/me/recommendations/{run_id}/retry", {
        params: { path: { run_id: id } },
        body,
      }),
    ),
  async resolveCareer(reference: string): Promise<Schemas["Career"]> {
    if (/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(reference))
      return coreApi.career(reference);
    if (reference === "ui-ux-designer")
      return coreApi.career("38e46141-e303-5cd6-a589-7ee57147488d");
    let offset = 0;
    for (;;) {
      const page = await coreApi.catalog({ limit: 100, offset });
      const found = page.items.find((career) => career.slug === reference);
      if (found) return found;
      offset += page.items.length;
      if (!page.items.length || offset >= page.total)
        throw new Error("This published career is unavailable.");
    }
  },
};

export function useCoreQuery<T>(
  key: readonly unknown[],
  load: (signal?: AbortSignal) => Promise<T>,
  enabled = true,
  options: { keepPreviousData?: boolean } = {},
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["account", user?.id, ...key],
    queryFn: ({ signal }) => load(AbortSignal.any([signal, AbortSignal.timeout(90_000)])),
    enabled: !!user && enabled,
    placeholderData: options.keepPreviousData
      ? (previous, query) => user && query?.queryKey[0] === "account" &&
          query.queryKey[1] === user.id && query.queryKey[2] === key[0]
        ? previous : undefined
      : undefined,
    staleTime: ["catalog-summary", "careers", "career", "roadmap"].includes(String(key[0])) ? 30_000 : 0,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    retry: false,
  });
}

export function useRoadmapGuidance(roadmapId: string) {
  return useCoreQuery(["roadmap-guidance", roadmapId], (signal) =>
    coreApi.roadmapGuidance(roadmapId, signal), !!roadmapId,
  );
}

export function useCoreMutation<TVariables, TData>(
  save: (variables: TVariables) => Promise<TData>,
  options?: { clearSuggestions?: (variables: TVariables) => boolean; learningChange?: "selection" | "progress"; clearSkillEvidence?: boolean },
) {
  const { user } = useAuth();
  const client = useQueryClient();
  const userId = user?.id;
  return useMutation({
    mutationFn: (variables: TVariables) => {
      if (!userId || !isCurrentAccount(userId))
        throw new Error(
          "Your account changed. Reopen this screen before saving.",
        );
      return save(variables);
    },
    onSuccess: async (_data, variables) => {
      if (userId && isCurrentAccount(userId)) {
        if (options?.clearSkillEvidence) {
          const key = ["account", userId, "career-skill-matches"];
          await client.cancelQueries({ queryKey: key });
          if (!isCurrentAccount(userId)) return;
          await client.resetQueries({ queryKey: key });
        }
        if (options?.learningChange === "selection") {
          const state = _data as Schemas["LearningState"];
          await client.cancelQueries({ predicate: query =>
            query.queryKey[0] === "account" && query.queryKey[1] === userId &&
            ["learning", "roadmap-view", "dashboard", "dashboard-view", "recommendations", "roadmap-guidance"]
              .includes(String(query.queryKey[2])),
          });
          if (!isCurrentAccount(userId)) return;
          client.setQueryData(["account", userId, "learning"], state);
          client.setQueriesData<Schemas["RoadmapView"]>(
            { queryKey: ["account", userId, "roadmap-view"] },
            previous => previous ? { ...previous, learning_state: state } : previous,
          );
          void client.invalidateQueries({ predicate: query =>
            query.queryKey[0] === "account" && query.queryKey[1] === userId &&
            ["dashboard", "dashboard-view", "recommendations", "roadmap-guidance"].includes(String(query.queryKey[2])),
            refetchType: "none",
          });
          return;
        }
        if (options?.learningChange === "progress") {
          const change = variables as { roadmapId: string; groupId?: string; topicId?: string };
          const viewKey = ["account", userId, "roadmap-view", change.roadmapId];
          await client.cancelQueries({ queryKey: viewKey });
          if (!isCurrentAccount(userId)) return;
          client.setQueryData<Schemas["RoadmapView"]>(viewKey, previous => {
            if (!previous) return previous;
            if (change.topicId) {
              const saved = _data as Schemas["TopicProgress"];
              return { ...previous, progress: [...previous.progress.filter(item => item.topic_id !== saved.topic_id), saved] };
            }
            const saved = _data as Schemas["BranchChoice"];
            return { ...previous, branches: [...previous.branches.filter(item => item.group_id !== saved.group_id), saved] };
          });
          void client.invalidateQueries({ predicate: query =>
            query.queryKey[0] === "account" && query.queryKey[1] === userId &&
            ["dashboard", "dashboard-view", "learning", "roadmap-view", "progress", "summary", "branches",
              "catalog-progress", "activity", "recommendations", "roadmap-guidance", "career-skill-matches"]
              .includes(String(query.queryKey[2])),
            refetchType: "none",
          });
          void client.invalidateQueries({ queryKey: viewKey, exact: true });
          return;
        }
        if (options?.clearSuggestions?.(variables)) {
          const queryKey = ["account", userId, "recommendations"];
          await client.cancelQueries({ queryKey });
          await client.resetQueries({ queryKey });
        }
        await client.invalidateQueries({ queryKey: ["account", userId] });
      }
    },
  });
}


export function useRoadmapPreload() {
  const { user } = useAuth();
  const client = useQueryClient();
  const work = useRef<{ timer?: ReturnType<typeof setTimeout>; controller?: AbortController }>({});
  useEffect(() => () => {
    clearTimeout(work.current.timer);
    work.current.controller?.abort();
  }, [user?.id]);
  return (id: string) => {
    clearTimeout(work.current.timer);
    work.current.controller?.abort();
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!user || !id || connection?.saveData || document.hidden ||
        client.isMutating() > 0 || client.isFetching() > 0) return;
    const userId = user.id;
    work.current.timer = setTimeout(() => {
      if (!isCurrentAccount(userId) || document.hidden ||
          client.isMutating() > 0 || client.isFetching() > 0) return;
      const controller = new AbortController();
      work.current.controller = controller;
      void client.prefetchQuery({
        queryKey: ["account", userId, "roadmap-view", id], staleTime: 30_000,
        queryFn: ({ signal }) => coreApi.roadmapView(id, AbortSignal.any([signal, controller.signal])),
      });
    }, 200);
  };
}
