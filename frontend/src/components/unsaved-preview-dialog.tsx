import { useRef } from "react";
import { useBlocker, useBeforeUnload } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function UnsavedPreviewDialog({
  when,
  allowedPaths = [],
  skipPath,
}: {
  when: boolean;
  allowedPaths?: string[];
  skipPath?: string;
}) {
  const returnFocusTarget = useRef<HTMLElement | null>(null);
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      when &&
      currentLocation.pathname !== nextLocation.pathname &&
      !allowedPaths.includes(nextLocation.pathname),
  );
  useBeforeUnload((event) => {
    if (when) {
      event.preventDefault();
      event.returnValue = "";
    }
  });
  const isSkipConfirmation =
    blocker.state === "blocked" && blocker.location.pathname === skipPath;
  return (
    <Dialog
      open={blocker.state === "blocked"}
      onOpenChange={(open) => {
        if (!open && blocker.state === "blocked") blocker.reset();
      }}
    >
      <DialogContent
        onOpenAutoFocus={() => {
          const activeElement = document.activeElement;
          returnFocusTarget.current =
            activeElement instanceof HTMLElement ? activeElement : null;
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          const target = returnFocusTarget.current;
          returnFocusTarget.current = null;
          if (target?.isConnected) target.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {isSkipConfirmation
              ? "Are you sure you want to skip?"
              : "Leave your prototype changes?"}
          </DialogTitle>
          <DialogDescription>
            {isSkipConfirmation
              ? "'Stay on this page' will continue questions. 'Confirm' will proceed to career catalog where you can browse all careers available."
              : "These changes exist only in this open page. Saving is not connected, so leaving will discard them."}
          </DialogDescription>
        </DialogHeader>
        <div className="action-row">
          <Button
            variant="outline"
            onClick={() => blocker.state === "blocked" && blocker.reset()}
          >
            Stay on this page
          </Button>
          <Button
            onClick={() => blocker.state === "blocked" && blocker.proceed()}
          >
            {isSkipConfirmation ? "Confirm" : "Discard and leave"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
