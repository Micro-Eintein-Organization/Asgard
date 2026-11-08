import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { useProfileEditor } from "./use-profile-editor";

export function ProfileEditorDialogs({
  editor,
  extraDirty = false,
  extraPending = false,
}: {
  editor: ReturnType<typeof useProfileEditor>;
  extraDirty?: boolean;
  extraPending?: boolean;
}) {
  const {
    blocker,
    mutation,
    form,
    persist,
    reloadOpen,
    setReloadOpen,
    reload,
  } = editor;
  return (
    <>
      <Dialog open={reloadOpen} onOpenChange={setReloadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reload the saved profile?</DialogTitle>
            <DialogDescription>
              Your unsaved name edits will be discarded.
            </DialogDescription>
          </DialogHeader>
          <div className="action-row">
            <Button onClick={() => void reload()}>Reload saved profile</Button>
            <Button variant="outline" onClick={() => setReloadOpen(false)}>
              Keep editing
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={blocker.state === "blocked"}
        onOpenChange={(open) => {
          if (
            !open &&
            blocker.state === "blocked" &&
            !mutation.isPending &&
            !extraPending
          )
            blocker.reset();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mutation.isPending || extraPending
                ? "Saving your profile"
                : "Save your profile changes?"}
            </DialogTitle>
            {mutation.error && (
              <p role="alert" className="field-error">
                {mutation.error.message}
              </p>
            )}
            <DialogDescription>
              {mutation.isPending || extraPending
                ? "Wait for the save to finish before leaving."
                : "Save before leaving, discard the edits, or stay on this page."}
              {extraDirty &&
                " Save preferences or upload the selected document before leaving, or discard those changes here."}
            </DialogDescription>
          </DialogHeader>
          <div className="action-row">
            <Button
              disabled={mutation.isPending || extraPending || extraDirty}
              onClick={async () => {
                await form.handleSubmit(
                  async (values) => {
                    const saved =
                      !form.formState.isDirty || (await persist(values));
                    if (saved && blocker.state === "blocked") blocker.proceed();
                  },
                  () => {
                    if (blocker.state === "blocked") blocker.reset();
                  },
                )();
              }}
            >
              Save and leave
            </Button>
            <Button
              variant="outline"
              disabled={mutation.isPending || extraPending}
              onClick={() => blocker.state === "blocked" && blocker.proceed()}
            >
              Discard and leave
            </Button>
            <Button
              variant="outline"
              disabled={mutation.isPending || extraPending}
              onClick={() => blocker.state === "blocked" && blocker.reset()}
            >
              Stay
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
