import type { components } from "@/api/generated/schema";

type Schemas = components["schemas"];

export function hasDiscoveryDirection(session: Schemas["DiscoverySession"] | null | undefined) {
  return !!session?.answers?.some(answer =>
    session.active_question_ids?.includes(answer.question_id) &&
    (answer.question_id === "interests" || answer.question_id.startsWith("activities_") ||
      answer.question_id.startsWith("scenario_") || answer.question_id.startsWith("prefer_")) &&
    answer.option_ids.some(value => value !== "unsure" && value !== "both"),
  );
}
