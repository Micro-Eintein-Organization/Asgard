import { useId } from "react";
import { Button } from "@/components/ui/button";
import { StatePanel } from "@/components/shared";

export type PreviewState = "sample" | "empty" | "loading" | "error";
export function PreviewStateControl({
  value,
  onChange,
}: {
  value: PreviewState;
  onChange: (value: PreviewState) => void;
}) {
  const id = useId();
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
  action,
  children,
}: {
  state: Exclude<PreviewState, "sample">;
  subject: string;
  onReset?: () => void;
  emptyAction?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
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
      action={action ??
        (state === "empty" && emptyAction) ??
        (onReset ? (
          <Button variant="outline" onClick={onReset}>
            Show sample content
          </Button>
        ) : undefined)}
    >
      {children ??
        (state === "loading"
          ? `Loading ${subject}.`
          : state === "error"
            ? `We could not load ${subject}.`
            : `There is no ${subject} to show.`)}
    </StatePanel>
  );
}
