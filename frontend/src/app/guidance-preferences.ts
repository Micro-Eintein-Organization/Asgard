import type { components } from "@/api/generated/schema";

export const guidanceIds = {
  resume: "resume_discovery",
  profile: "basic_profile",
  start: "start_discovery",
  outdated: "outdated-suggestions",
  provider: "provider-unavailable",
  browse: "browse-careers",
  suggestionBrowse: "browse-suggestions",
} as const;

export function dismissGuidance(
  saved: components["schemas"]["Preferences"], id: string,
): components["schemas"]["SavePreferences"] {
  return {
    expected_version: saved.version,
    preferred_category_id: saved.preferred_category_id,
    timezone: saved.timezone,
    dismissed_guidance: [...saved.dismissed_guidance.filter(item => item !== id), id].slice(-20),
  };
}
