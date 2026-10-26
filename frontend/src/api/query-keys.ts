// Include account identity even though session changes also cancel and clear the cache.
export const queryKeys = {
  account: (userId: string) => ["account", userId] as const,
  discovery: (userId: string) => ["account", userId, "discovery"] as const,
  recommendations: (userId: string) =>
    ["account", userId, "recommendations"] as const,
  learning: (userId: string) => ["account", userId, "learning"] as const,
  dashboard: (userId: string) => ["account", userId, "dashboard"] as const,
  preferences: (userId: string) => ["account", userId, "preferences"] as const,
  progress: (userId: string, roadmapId: string) =>
    ["account", userId, "learning", roadmapId] as const,
  activity: (userId: string, month: string) =>
    ["account", userId, "activity", month] as const,
  careers: (
    userId: string,
    filters: { q?: string; category_id?: string; offset?: number; limit?: number },
  ) =>
    ["account", userId, "careers", filters] as const,
  roadmap: (userId: string, roadmapId: string) =>
    ["account", userId, "roadmap", roadmapId] as const,
};
