import { api } from "@/api/client";
import { isCurrentAccount } from "@/auth/transport";
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

export async function readProfilePhoto(signal: AbortSignal) {
  const { data, error } = await api.GET("/api/v1/me/profile/photo", { parseAs: "blob", signal });
  if (error || !data) throw new Error("Could not load your saved photo.");
  return data;
}

export async function saveProfilePhoto(body: ProfileUpdate, file: File | null, owner: string) {
  const photo = file ? await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected photo."));
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.readAsDataURL(file);
  }) : null;
  if (!isCurrentAccount(owner)) throw new Error("Sign in again to save your photo.");
  const { data, error } = await api.PATCH("/api/v1/me/profile/photo", { body: { ...body, photo } });
  if (error || !data) throw new Error(error?.message ?? "Could not save your photo. Your edits have been kept.");
  return data;
}
