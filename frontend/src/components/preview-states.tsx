import { Button } from "@/components/ui/button";
import { StatePanel } from "@/components/shared";

export type PreviewState = "empty" | "loading" | "error";
export function PreviewDataState({
  state,
  subject,
  onReset,
  emptyAction,
  action,
  children,
}: {
  state: PreviewState;
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
