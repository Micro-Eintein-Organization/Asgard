import { useEffect, useRef, useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useBlocker, useBeforeUnload } from "react-router";
import { FileText } from "lucide-react";
import { useAuth } from "@/auth/context";
import { isCurrentAccount } from "@/auth/transport";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PageHeading, StatePanel, Unavailable } from "@/components/shared";
import { categories } from "@/fixtures/catalog";
import { appRoutes } from "@/lib/routes";
import { readProfile, saveProfile } from "./api";
import {
  SettingsLayout,
  ProfileDetailsCard,
  ProfileNameFields,
} from "./settings-layout";
import { useLogout, useLogoutGuard } from "@/app/logout";

export function AuthenticatedProfilePage() {
  const { user } = useAuth();
  return user ? <ProfileEditor key={user.id} userId={user.id} /> : null;
}

function ProfileEditor({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const logout = useLogout();
  const key = ["profile", userId];
  const query = useQuery({
    queryKey: key,
    queryFn: ({ signal }) => readProfile(signal),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, submitCount },
  } = useForm<{ firstName: string; surname: string }>({
    defaultValues: { firstName: "", surname: "" },
    mode: "onSubmit",
    shouldFocusError: false,
  });
  const [feedback, setFeedback] = useState("");
  const [logoutError, setLogoutError] = useState("");
  const [reloadOpen, setReloadOpen] = useState(false);
  const errorSummary = useRef<HTMLParagraphElement>(null);
  const lastSubmission = useRef(0);
  useEffect(() => {
    if (submitCount === lastSubmission.current) return;
    lastSubmission.current = submitCount;
    if (errors.firstName || errors.surname) {
      const frame = requestAnimationFrame(() => errorSummary.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
  }, [submitCount, errors.firstName, errors.surname]);
  useEffect(() => {
    if (query.data && !isDirty)
      reset({
        firstName: query.data.profile?.first_name ?? "",
        surname: query.data.profile?.surname ?? "",
      });
  }, [query.data, reset, isDirty]);
  const mutation = useMutation({ mutationFn: saveProfile });
  const preferences = useForm<{ field: string }>();
  const hasUnsavedChanges = isDirty || preferences.formState.isDirty;
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isCurrentAccount(userId) &&
      (hasUnsavedChanges || mutation.isPending) &&
      currentLocation.pathname !== nextLocation.pathname,
  );
  useLogoutGuard(() => {
    if (mutation.isPending) {
      window.alert("Wait for your profile save to finish before logging out.");
      return false;
    }
    return (
      !hasUnsavedChanges ||
      window.confirm("Discard your unsaved profile changes and log out?")
    );
  });
  useBeforeUnload((event) => {
    if (hasUnsavedChanges || mutation.isPending) {
      event.preventDefault();
      event.returnValue = "";
    }
  });
  async function persist(values: { firstName: string; surname: string }) {
    if (!query.data || mutation.isPending) return;
    setFeedback("");
    try {
      const data = await mutation.mutateAsync({
        first_name: values.firstName,
        surname: values.surname,
        expected_version: query.data.profile?.version ?? 0,
      });
      if (!isCurrentAccount(userId)) return false;
      queryClient.setQueryData(key, data);
      reset({
        firstName: data.profile?.first_name ?? "",
        surname: data.profile?.surname ?? "",
      });
      setFeedback("Profile saved.");
      return true;
    } catch {
      return false;
    }
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    await handleSubmit(async (values) => {
      await persist(values);
    })(event);
  }
  async function signOut() {
    setLogoutError("");
    try {
      await logout();
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : "Could not sign out.",
      );
    }
  }
  if (query.isPending)
    return (
      <StatePanel kind="loading" title="Loading your profile">
        Reading your saved details.
      </StatePanel>
    );
  if (query.isError)
    return (
      <StatePanel
        kind="error"
        title="Profile unavailable"
        action={
          <div className="action-row">
            <Button onClick={() => void query.refetch()}>Try again</Button>
            <Button variant="outline" onClick={() => void signOut()}>
              Sign out
            </Button>
          </div>
        }
      >
        {query.error.message}
        {logoutError && <p role="alert">{logoutError}</p>}
      </StatePanel>
    );
  return (
    <SettingsLayout>
      <PageHeading
        title="Your profile."
        description="A little about you, on your terms. A photo and background document are always optional."
      />
      <ProfileDetailsCard>
        <form className="form-grid" onSubmit={save}>
          {(errors.firstName || errors.surname) && (
            <p
              ref={errorSummary}
              role="alert"
              className="field-error"
              tabIndex={-1}
            >
              Check the name fields below.
            </p>
          )}
          <ProfileNameFields
            register={register}
            errors={errors}
            disabled={mutation.isPending}
          />
          {mutation.error && (
            <div role="alert" className="field-error">
              <p>{mutation.error.message}</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setReloadOpen(true)}
              >
                Reload saved profile
              </Button>
            </div>
          )}
          {feedback && !isDirty && <p role="status">{feedback}</p>}
          <div className="action-row">
            <Button type="submit" disabled={!isDirty || mutation.isPending}>
              {mutation.isPending ? "Saving…" : "Save profile"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!isDirty || mutation.isPending}
              onClick={() => {
                reset({
                  firstName: query.data?.profile?.first_name ?? "",
                  surname: query.data?.profile?.surname ?? "",
                });
                mutation.reset();
                setFeedback("");
              }}
            >
              Discard changes
            </Button>
          </div>
        </form>
      </ProfileDetailsCard>
      <Card className="settings-card">
        <header>
          <h2>Career background</h2>
          <p>
            Optionally add a resume, academic record or project summary. No
            document is required to browse or learn.
          </p>
        </header>
        <div className="upload-placeholder">
          <FileText size={28} aria-hidden="true" />
          <h3>Add a PDF when you're ready.</h3>
          <p>
            A future analysis will extract explicitly stated background for
            career suggestions. Review the provider and privacy notice before
            uploading.
          </p>
          <Button disabled variant="outline">
            Choose PDF
          </Button>
          <p>
            Selectable-text PDF, up to 10 MB. Scanned or encrypted documents are
            unsupported.
          </p>
        </div>
        <Unavailable>
          Prototype: upload, analysis, replacement and removal are not
          connected. No files are accepted.
        </Unavailable>
      </Card>
      <Card className="settings-card">
        <header>
          <h2>Saved Discovery suggestions</h2>
          <p>Discovery results are separate from your current roadmap.</p>
        </header>
        <StatePanel
          kind="empty"
          title="No saved suggestions"
          action={
            <Button asChild variant="outline">
              <Link to={appRoutes.welcome}>Open Discovery</Link>
            </Button>
          }
        >
          Prototype: saving suggestions is not connected. You can try the
          questionnaire without saving or analyzing answers.
        </StatePanel>
      </Card>
      <Card className="settings-card">
        <header>
          <h2>Preferred primary field</h2>
          <p>
            In the completed app, this sets the catalog's default category. It
            does not change your current roadmap or recommendations.
          </p>
        </header>
        <form
          onSubmit={(event) => event.preventDefault()}
          className="form-grid"
        >
          <fieldset>
            <legend className="sr-only">Preferred primary field</legend>
            <div className="preference-list">
              {categories.map((category) => (
                <label key={category.id}>
                  <input
                    type="radio"
                    value={category.id}
                    {...preferences.register("field")}
                  />
                  {category.title}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <Button disabled>Save preferences</Button>
            <Unavailable>
              Prototype: this selection stays in this open page only. Saving
              your profile saves your name, not this preference. Leaving or
              refreshing clears the selection.
            </Unavailable>
          </div>
        </form>
      </Card>
      <Dialog open={reloadOpen} onOpenChange={setReloadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reload the saved profile?</DialogTitle>
            <DialogDescription>
              Your unsaved edits will be discarded.
            </DialogDescription>
          </DialogHeader>
          <div className="action-row">
            <Button
              onClick={() => {
                reset();
                mutation.reset();
                setFeedback("");
                setReloadOpen(false);
                void query.refetch();
              }}
            >
              Reload saved profile
            </Button>
            <Button variant="outline" onClick={() => setReloadOpen(false)}>
              Keep editing
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={blocker.state === "blocked"}
        onOpenChange={(open) => {
          if (!open && blocker.state === "blocked" && !mutation.isPending)
            blocker.reset();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save your profile changes?</DialogTitle>
            {mutation.error && (
              <p role="alert" className="field-error">
                {mutation.error.message}
              </p>
            )}
            <DialogDescription>
              Save before leaving, discard the edits, or stay on this page.
              {preferences.formState.isDirty &&
                " Prototype preferences cannot be saved and will be discarded when you leave."}
            </DialogDescription>
          </DialogHeader>
          <div className="action-row">
            <Button
              disabled={mutation.isPending}
              onClick={async () => {
                await handleSubmit(
                  async (values) => {
                    if ((await persist(values)) && blocker.state === "blocked")
                      blocker.proceed();
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
              disabled={mutation.isPending}
              onClick={() => blocker.state === "blocked" && blocker.proceed()}
            >
              Discard and leave
            </Button>
            <Button
              variant="outline"
              disabled={mutation.isPending}
              onClick={() => blocker.state === "blocked" && blocker.reset()}
            >
              Stay
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SettingsLayout>
  );
}
