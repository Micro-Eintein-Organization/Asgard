import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/auth/context";
import { useEffect, useRef, useState } from "react";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { readProfilePhoto } from "./api";

export function ProfilePhoto({ enabled, savedVersion, draft, onChange, disabled }: {
  enabled: boolean;
  savedVersion: number | null;
  draft: File | null | undefined;
  onChange: (draft: File | null | undefined) => void;
  disabled: boolean;
}) {
  const { user } = useAuth();
  const saved = useQuery({ queryKey: ["profile-photo", user?.id, savedVersion],
    queryFn: ({ signal }) => readProfilePhoto(signal),
    enabled: !!user && enabled && draft === undefined && savedVersion !== null,
    staleTime: 30_000, gcTime: 0, retry: false });
  const input = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [selectionError, setSelectionError] = useState("");
  const [readError, setReadError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    let objectUrl: string | undefined;
    setUrl(null);
    setReadError("");
    const show = (blob: Blob) => {
      if (controller.signal.aborted) return;
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    };
    if (draft) show(draft);
    else if (enabled && draft === undefined && savedVersion !== null) {
      if (saved.data) show(saved.data);
      else if (saved.error) queueMicrotask(() => { if (!controller.signal.aborted) setReadError("Could not load your saved photo."); });
    }
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [draft, enabled, savedVersion, saved.data, saved.error]);

  return (
    <div className="profile-photo">
      <div className="avatar-placeholder">
        {url ? <img className="h-full w-full rounded-full object-cover" src={url} alt="Profile photo" />
          : <UserRound size={27} aria-hidden="true" />}
      </div>
      {enabled ? (
        <>
          <Button type="button" variant="outline" disabled={disabled} onClick={() => input.current?.click()}>
            Change photo
          </Button>
          <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" disabled={disabled}
            hidden
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              event.currentTarget.value = "";
              if (!file) return;
              if (file.size > 2_000_000 || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                setSelectionError("Choose a JPEG, PNG, or WebP up to 2 MB.");
                return;
              }
              setSelectionError("");
              onChange(file);
            }}
          />
          {(draft || (draft === undefined && savedVersion !== null)) && (
            <Button type="button" variant="outline" disabled={disabled} onClick={() => {
              setSelectionError("");
              onChange(savedVersion === null ? undefined : null);
            }}>Remove photo</Button>
          )}
          {draft !== undefined && <p className="field-help">{draft ? "Save profile to use this photo." : "Save profile to remove this photo."}</p>}
          {(selectionError || readError) && <p role="alert" className="field-error">{selectionError || readError}</p>}
        </>
      ) : <p className="field-help">Photo uploads are unavailable.</p>}
    </div>
  );
}
