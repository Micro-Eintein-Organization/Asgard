import { useState } from "react";
import { Button } from "@/components/ui/button";
import { coreApi, useCoreMutation } from "@/features/core/data";

import { useShortlist } from "./data";

export function SavedCareerEditor({
  id,
  title,
  available = true,
}: {
  id: string;
  title: string;
  available?: boolean;
}) {
  const query = useShortlist();
  const save = useCoreMutation(coreApi.saveCareer);
  const remove = useCoreMutation(coreApi.removeCareer);
  const [draft, setDraft] = useState<{ text: string; version: number } | null>(
    null,
  );
  const [feedback, setFeedback] = useState("");
  const [confirmRemoval, setConfirmRemoval] = useState(false);
  const entry = query.data?.items.find((item) => item.career_id === id);
  const pending = save.isPending || remove.isPending;
  if (query.isPending) return <p role="status">Loading saved careers…</p>;
  if (query.error)
    return (
      <p role="alert">
        {query.error.message}{" "}
        <button onClick={() => void query.refetch()}>
          Reload saved careers
        </button>
      </p>
    );
  if (!query.data?.available)
    return (
      <p>
        Saving careers is temporarily unavailable. You can still compare and
        explore.
      </p>
    );
  const error = save.error ?? remove.error;
  return (
    <form
      className="space-y-2"
      onSubmit={(event) => {
        event.preventDefault();
        void save
          .mutateAsync({
            id,
            body: {
              expected_version: draft?.version ?? query.data!.version,
              note: draft?.text ?? entry?.note ?? "",
            },
          })
          .then(() => {
            setDraft(null);
            setFeedback("Career saved.");
          })
          .catch(() => {});
      }}
    >
      <label className="block" htmlFor={`note-${id}`}>
        Why I’m considering {title} (optional)
      </label>
      <textarea
        id={`note-${id}`}
        className="w-full rounded-md border p-2"
        maxLength={500}
        disabled={pending || !available}
        value={draft?.text ?? entry?.note ?? ""}
        onChange={(event) =>
          setDraft({
            text: event.target.value,
            version: draft?.version ?? query.data!.version,
          })
        }
      />
      <p className="text-sm">
        This private note is for your comparison; it is not sent to AI.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending || !available}>
          {entry ? "Save note" : "Save career"}
        </Button>
        {draft && (
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => setDraft(null)}
          >
            Discard note edits
          </Button>
        )}
        {entry && !confirmRemoval && (
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => setConfirmRemoval(true)}
          >
            Remove saved career
          </Button>
        )}
        {entry && confirmRemoval && (
          <div className="space-y-2">
            <p>
              Remove {title} and its saved note? Your comparison pair will stay.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => {
                  void remove
                    .mutateAsync({
                      id,
                      body: { expected_version: query.data!.version },
                    })
                    .then(() => {
                      setDraft(null);
                      setConfirmRemoval(false);
                      setFeedback("Saved career and note removed.");
                    })
                    .catch(() => {});
                }}
              >
                Confirm removal
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => setConfirmRemoval(false)}
              >
                Keep saved career
              </Button>
            </div>
          </div>
        )}
      </div>
      {feedback && <p role="status">{feedback}</p>}
      {error && (
        <p role="alert">
          {error.message}{" "}
          <button type="button" onClick={() => void query.refetch()}>
            Reload saved careers
          </button>
        </p>
      )}
    </form>
  );
}
