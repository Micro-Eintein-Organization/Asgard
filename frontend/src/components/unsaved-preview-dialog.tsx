import { useBlocker, useBeforeUnload } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function UnsavedPreviewDialog({ when }: { when: boolean }) {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      when && currentLocation.pathname !== nextLocation.pathname,
  );
  useBeforeUnload((event) => {
    if (when) {
      event.preventDefault();
      event.returnValue = "";
    }
  });
  return (
    <Dialog
      open={blocker.state === "blocked"}
      onOpenChange={(open) => {
        if (!open && blocker.state === "blocked") blocker.reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave your prototype changes?</DialogTitle>
          <DialogDescription>
            These changes exist only in this open page. Saving is not connected,
            so leaving will discard them.
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
            Discard and leave
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
