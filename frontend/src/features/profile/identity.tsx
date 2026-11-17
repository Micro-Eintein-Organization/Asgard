import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserRound } from "lucide-react";
import { useAuth } from "@/auth/context";
import { readProfile, readProfilePhoto } from "./api";

export function useSavedProfile() {
  const { user, mfa } = useAuth();
  return useQuery({ queryKey: ["profile", user?.id], queryFn: ({ signal }) => readProfile(signal),
    enabled: !!user?.email_confirmed_at && mfa === "ready", staleTime: 30_000, retry: false });
}

export function AccountAvatar() {
  const { user } = useAuth();
  const profile = useSavedProfile();
  const saved = profile.data?.profile;
  const photo = useQuery({ queryKey: ["profile-photo", user?.id, saved?.version],
    queryFn: ({ signal }) => readProfilePhoto(signal),
    enabled: !!user && !!saved?.has_photo && profile.data?.photo_enabled === true,
    staleTime: 30_000, gcTime: 0, retry: false });
  const [image, setImage] = useState<{ blob: Blob; url: string } | null>(null);
  useEffect(() => {
    if (!photo.data) return;
    const url = URL.createObjectURL(photo.data);
    const preload = new Image();
    const blob = photo.data;
    preload.onload = () => setImage({ blob, url });
    preload.src = url;
    return () => { preload.onload = null; URL.revokeObjectURL(url); };
  }, [photo.data]);
  const initials = [saved?.first_name, saved?.surname].filter(Boolean).map(part => Array.from(part!.trim())[0] ?? "").join("").toLocaleUpperCase();
  return saved?.has_photo && photo.data && image?.blob === photo.data
    ? <img src={image.url} alt="" className="h-full w-full rounded-full object-cover" onError={() => setImage(null)} />
    : initials ? <span aria-hidden="true">{initials}</span> : <UserRound aria-hidden="true" />;
}
