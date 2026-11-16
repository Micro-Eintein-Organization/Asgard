import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/auth/context";
import { isCurrentAccount } from "@/auth/transport";
import { appRoutes } from "@/lib/routes";
import { StatePanel } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { LoadingIndicator } from "@/components/loading-indicator";
import { Button } from "@/components/ui/button";
import { useProfileEditor } from "@/features/profile/use-profile-editor";
import { ProfileEditorDialogs } from "@/features/profile/profile-editor-dialogs";
import {
  validateFirstName,
  validateSurname,
} from "@/features/profile/validation";

export default function OptionalProfileSetup() {
  const { user } = useAuth();
  return user ? <SetupEditor key={user.id} userId={user.id} /> : null;
}

function SetupEditor({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const editor = useProfileEditor(userId);
  const { query, mutation, persist, blocker, errorSummary, setReloadOpen } =
    editor;
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = editor.form;
  const [returnRequested, setReturnRequested] = useState(false);
  useEffect(() => {
    if (
      returnRequested &&
      !isDirty &&
      !mutation.isPending &&
      isCurrentAccount(userId)
    ) {
      if (blocker.state === "blocked") {
        blocker.reset();
        return;
      }
      void navigate(appRoutes.results, { replace: true });
    }
  }, [returnRequested, isDirty, mutation.isPending, userId, blocker, navigate]);
  const skip = () => void navigate(appRoutes.results);
  if (query.isPending)
    return (
      <StatePanel
        kind="loading"
        title="Loading your profile"
        action={<button onClick={skip}>Skip to results</button>}
      >
        Reading your saved name.
      </StatePanel>
    );
  if (query.isError)
    return (
      <StatePanel
        kind="error"
        title="Profile unavailable"
        action={
          <div className="action-row">
            <button onClick={() => void query.refetch()}>Try again</button>
            <button onClick={skip}>Skip to results</button>
          </div>
        }
      >
        {query.error.message}
      </StatePanel>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 bg-white min-h-screen text-gray-900">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <Button variant="outline"
          onClick={skip}
          disabled={mutation.isPending}
        >
          <span>&larr; Back</span>
        </Button>
      </div>

      {/* Title & Subtitle */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Set up your profile
        </h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
          Add your name, or skip and complete this later in Settings. Both
          actions return to Discovery results.
        </p>
      </div>

      {/* Main Centered Card Container */}
      <form
        onSubmit={handleSubmit(async (values) => {
          if (!isDirty && query.data.profile?.first_name)
            setReturnRequested(true);
          else if (await persist(values)) setReturnRequested(true);
        })}
        className="max-w-md mx-auto border border-gray-200 rounded-3xl p-8 space-y-6 bg-white shadow-xs"
      >
        {/* Photo uploads unavailable Avatar */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
            <span className="text-sm">✏️</span>
          </div>
          <span className="text-[10px] font-medium text-gray-400">
            Photo uploads unavailable
          </span>
        </div>

        {/* Full Name Field */}
        <div className="space-y-2">
          <label
            htmlFor="setup-first-name"
            className="text-sm font-semibold text-foreground"
          >
            First name
          </label>
          <Input
            type="text"
            id="setup-first-name"
            disabled={mutation.isPending || returnRequested}
            aria-invalid={!!errors.firstName}
            {...register("firstName", { validate: validateFirstName })}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="setup-surname" className="text-sm font-semibold">
            Surname (optional)
          </label>
          <Input
            id="setup-surname"
            disabled={mutation.isPending || returnRequested}
            aria-invalid={!!errors.surname}
            {...register("surname", { validate: validateSurname })}
          />
        </div>
        {(errors.firstName || errors.surname) && (
          <p
            ref={errorSummary}
            role="alert"
            tabIndex={-1}
            className="field-error"
          >
            {errors.firstName?.message ?? errors.surname?.message}
          </p>
        )}
        {mutation.error && (
          <div role="alert" className="field-error">
            {mutation.error.message}{" "}
            <button type="button" onClick={() => setReloadOpen(true)}>
              Reload saved profile
            </button>
          </div>
        )}
        {/* Academic Records or Resume (Optional) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-900">
            Academic Records or Resume (Optional)
          </label>

          <div
            aria-disabled="true"
            className="border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-2xl p-6 text-center transition-colors space-y-3 bg-gray-50/50"
          >
            <div className="w-10 h-10 rounded-lg bg-red-500 text-white font-bold flex items-center justify-center mx-auto text-[10px] shadow-xs">
              PDF
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-600">
                PDF upload and analysis are not available yet. No files are
                accepted.
              </p>
              <p className="text-[10px] text-gray-400">
                Supports PDF up to 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Proceed Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={mutation.isPending || returnRequested}
            className="w-full"
          >
            {mutation.isPending && <LoadingIndicator />}
            {mutation.isPending
              ? "Saving…"
              : !isDirty && query.data.profile?.first_name
                ? "Continue to results"
                : "Save and return to results"}
          </Button>
        </div>
      </form>

      {/* Footer Skip Link */}
      <div className="text-center pt-2">
        <Button variant="link"
          onClick={skip}
          disabled={mutation.isPending}
          className="text-muted-foreground"
        >
          I'll set this up later
        </Button>
      </div>
      <ProfileEditorDialogs editor={editor} />
    </div>
  );
}
