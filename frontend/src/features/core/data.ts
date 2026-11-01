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
  documents: () => result(api.GET("/api/v1/me/documents")),
  uploadDocument: ({ file, revision }: { file: File; revision: number }) =>
    result(
      api.POST("/api/v1/me/documents/upload", {
        params: { query: { expected_revision: revision } },
        body: file as unknown as string,
        bodySerializer: (body) => body as unknown as File,
        headers: { "Content-Type": "application/pdf" },
      }),
    ),
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
  categories: () => result(api.GET("/api/v1/categories")),
  catalog: (
    query: {
      q?: string;
      category_id?: string;
      limit?: number;
      offset?: number;
    } = {},
  ) => result(api.GET("/api/v1/careers", { params: { query } })),
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
  preferences: () => result(api.GET("/api/v1/me/preferences")),
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
  discovery: () => result(api.GET("/api/v1/me/discovery")),
  questionnaire: (id?: string) =>
    result(
      api.GET("/api/v1/discovery/questionnaire", {
        params: { query: { questionnaire_id: id } },
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
  recommendations: () => result(api.GET("/api/v1/me/recommendations")),
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
  load: () => Promise<T>,
  enabled = true,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["account", user?.id, ...key],
    queryFn: load,
    enabled: !!user && enabled,
    retry: false,
  });
}

export function useCoreMutation<TVariables, TData>(
  save: (variables: TVariables) => Promise<TData>,
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
    onSuccess: async () => {
      if (userId && isCurrentAccount(userId))
        await client.invalidateQueries({ queryKey: ["account", userId] });
    },
  });
}
