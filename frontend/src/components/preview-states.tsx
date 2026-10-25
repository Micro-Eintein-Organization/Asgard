import { useId } from "react";
import { Button } from "@/components/ui/button";
import { StatePanel } from "@/components/shared";
import { useIsPreview } from "@/lib/page-routes";

export type PreviewState = "sample" | "empty" | "loading" | "error";
export function PreviewStateControl({
  value,
  onChange,
}: {
  value: PreviewState;
  onChange: (value: PreviewState) => void;
}) {
  const id = useId();
  const preview = useIsPreview();
  if (!preview) return null;
  return (
    <div className="preview-state-control">
      <label htmlFor={id}>Review layout state</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as PreviewState)}
      >
        <option value="sample">Sample content</option>
        <option value="empty">Empty</option>
        <option value="loading">Loading</option>
        <option value="error">Error</option>
      </select>
      <span>Visual examples only</span>
    </div>
  );
}
export function PreviewDataState({
  state,
  subject,
  onReset,
  emptyAction,
}: {
  state: Exclude<PreviewState, "sample">;
  subject: string;
  onReset: () => void;
  emptyAction?: React.ReactNode;
}) {
  return (
    <StatePanel
      kind={state}
      title={
        state === "loading"
          ? `Loading ${subject}`
          : state === "error"
            ? `We could not load ${subject}`
            : `No ${subject} yet`
      }
      action={
        state === "empty" && emptyAction ? (
          emptyAction
        ) : (
          <Button variant="outline" onClick={onReset}>
            Show sample content
          </Button>
        )
      }
    >
      {state === "loading"
        ? "Loading-state example. No request is running in this preview."
        : state === "error"
          ? "Error-state example. Your next action should remain available when a service fails."
          : "This is the empty-state layout. The preview has no saved account data."}
    </StatePanel>
  );
}
