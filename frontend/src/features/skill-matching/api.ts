import { api } from "@/api/client";
import type { components } from "@/api/generated/schema";

export type CareerSkillMatchResponse = components["schemas"]["CareerSkillMatchResponse"];
export type CareerSkillMatch = components["schemas"]["CareerSkillMatch"];
export type SkillMatchItem = components["schemas"]["SkillMatchItem"];
export type ResumeSignal = components["schemas"]["ResumeSignal"];

export async function readCareerSkillMatches(signal?: AbortSignal, basis: "benchmark" | "learning_path" = "learning_path") {
  const { data, error } = await api.GET("/api/v1/me/career-skill-matches", { signal, params: { query: { basis } } });
  if (error || !data)
    throw new Error(
      error && "message" in error ? error.message : "Could not load career skill matches. Try again.",
    );
  return data;
}
