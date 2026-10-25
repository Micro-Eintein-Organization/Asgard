import { api } from "@/api/client";
import type { components } from "@/api/generated/schema";

export type SavedProfile = components["schemas"]["Profile"];
export type ProfileUpdate = components["schemas"]["ProfileUpdate"];

export async function readProfile(signal?: AbortSignal) {
  const { data, error } = await api.GET("/api/v1/me/profile", { signal });
  if (error || !data)
    throw new Error(
      error?.message ?? "Could not load your profile. Try again.",
    );
  return data;
}

export async function saveProfile(body: ProfileUpdate) {
  const { data, error } = await api.PATCH("/api/v1/me/profile", { body });
  if (error || !data)
    throw new Error(
      error?.message ??
        "Could not save your profile. Your edits have been kept.",
    );
  return data;
}
