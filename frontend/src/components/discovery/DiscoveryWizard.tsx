import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import type { components } from "@/api/generated/schema";
import { DiscoveryHeader } from "./DiscoveryHeader";
import { StatePanel } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { appRoutes } from "@/lib/routes";
import { coreApi, useCoreMutation, useCoreQuery } from "@/features/core/data";
import { useDiscoveryEditor } from "@/features/discovery/use-discovery-editor";
import { RecommendationCards } from "@/features/recommendations/components";
import { useRecommendationFlow } from "@/features/recommendations/use-recommendation-flow";

type Schemas = components["schemas"];

export function DiscoveryWizard() {
  const navigate = useNavigate();
  const state = useCoreQuery(["discovery"], coreApi.discovery);
  const definition = useCoreQuery(
    ["questionnaire", state.data?.draft?.questionnaire_id],
    () => coreApi.questionnaire(state.data?.draft?.questionnaire_id),
  );
  const start = useCoreMutation(coreApi.startDiscovery);
  const retake = useCoreMutation(coreApi.retakeDiscovery);
  const opening = useRef(false);
  useEffect(() => {
    if (
      opening.current ||
      !state.data ||
      !definition.data ||
      state.data.draft ||
      state.data.latest_completed
    )
      return;
    opening.current = true;
    start.mutate({ questionnaire_id: definition.data.id });
  }, [state.data, definition.data, start]);
  const error = state.error ?? definition.error;
  if (error)
    return (
      <StatePanel
        kind="error"
        title="Discovery unavailable"
        action={
          <div className="action-row">
            <button
              onClick={() => {
                void state.refetch();
                void definition.refetch();
              }}
            >
              Try again
            </button>
            <Link to={appRoutes.careers}>Browse careers</Link>
          </div>
        }
      >
        {error.message}
      </StatePanel>
    );
  if (!state.data || !definition.data)
    return (
      <StatePanel kind="loading" title="Loading Discovery">
        Reading your saved answers and question version.
      </StatePanel>
    );
  if (state.data.draft)
    return (
      <DiscoveryEditor
        key={state.data.draft.id}
        initial={state.data.draft}
        definition={definition.data}
      />
    );
  const completed = state.data.latest_completed;
  const authored = definition.data;
  if (!completed)
    return start.error ? (
      <StatePanel
        kind="error"
        title="Could not open Discovery"
        action={
          <button
            disabled={start.isPending}
            onClick={() => start.mutate({ questionnaire_id: authored.id })}
          >
            Try again
          </button>
        }
      >
        {start.error.message}
      </StatePanel>
    ) : (
      <StatePanel kind="loading" title="Opening Discovery">
        Creating your blank saved draft.
      </StatePanel>
    );
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col p-6 space-y-8">
      <DiscoveryHeader
        currentStep={1}
        showProgress={false}
        onBack={() => void navigate(appRoutes.welcome)}
        onSkip={() => void navigate(appRoutes.careers)}
      />
      <div className="max-w-xl mx-auto w-full py-12 text-center space-y-6">
        <h2 className="text-2xl font-bold">
          {completed
            ? "Your completed Discovery is saved"
            : "Explore what interests you"}
        </h2>
        <p className="text-sm text-gray-500">
          Five short themes include an activities question based on your
          interests. You can choose uncertainty, save and leave, or browse
          careers at any time.
        </p>
        <p className="text-xs text-gray-500">
          Your active answers and relevant learning context can be sent to Groq
          to suggest careers from the small published catalog. Names and contact
          details are excluded. Suggestions are exploration options, not an
          assessment of ability.
        </p>
        <Button
          disabled={start.isPending || retake.isPending}
          onClick={() => {
            if (completed)
              retake.mutate({
                source_session_id: completed.id,
                expected_revision: completed.revision,
              });
            else start.mutate({ questionnaire_id: authored.id });
          }}
        >
          {start.isPending || retake.isPending
            ? "Opening…"
            : completed
              ? "Retake Discovery"
              : "Start Discovery"}
        </Button>
        {(start.error || retake.error) && (
          <p role="alert" className="field-error">
            {(start.error ?? retake.error)?.message}{" "}
            <button onClick={() => void state.refetch()}>
              Reload saved state
            </button>
          </p>
        )}
        <div className="action-row justify-center">
          <Link to={appRoutes.careers}>Browse careers</Link>
          {completed && <Link to={appRoutes.results}>View saved results</Link>}
        </div>
      </div>
    </div>
  );
}

function DiscoveryEditor({
  initial,
  definition,
}: {
  initial: Schemas["DiscoverySession"];
  definition: Schemas["Questionnaire"];
}) {
  const editor = useDiscoveryEditor(initial, definition);
  const heading = useRef<HTMLHeadingElement>(null);
  const errorSummary = useRef<HTMLDivElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [editor.question.question_id]);
  useEffect(() => {
    if (editor.error && editor.blocker.state !== "blocked")
      errorSummary.current?.focus();
  }, [editor.error, editor.blocker.state]);
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between p-6">
      <DiscoveryHeader
        currentStep={editor.index + 1}
        totalSteps={editor.total}
        disabled={editor.busy}
        onBack={() => void editor.move(-1)}
        onSkip={() => void editor.skip()}
      />
      <div className="max-w-4xl mx-auto w-full my-auto py-8 space-y-8">
        <div className="text-center space-y-2">
          <h2
            ref={heading}
            tabIndex={-1}
            className="text-xl font-bold tracking-tight"
          >
            {editor.question.prompt}
          </h2>
          <p id="question-helper" className="text-sm text-gray-500">
            {editor.question.helper}
          </p>
          <p className="text-xs text-gray-500">
            {editor.question.multiple
              ? "Choose all that apply, or uncertainty on its own."
              : "Choose one."}
          </p>
        </div>
        <fieldset
          disabled={editor.busy}
          aria-describedby="question-helper"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-0 p-0"
        >
          <legend className="sr-only">{editor.question.prompt}</legend>
          {editor.question.options.map((option) => {
            const selected = editor.selected.includes(option.id);
            return (
              <label
                key={option.id}
                className={
                  "cursor-pointer rounded-2xl border p-6 transition-all relative flex flex-col justify-between min-h-56 bg-white " +
                  (selected
                    ? "border-emerald-500 ring-2 ring-emerald-500 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-xs")
                }
              >
                <input
                  type={editor.question.multiple ? "checkbox" : "radio"}
                  name={editor.question.question_id}
                  checked={selected}
                  onChange={() => editor.toggle(option.id)}
                  className="self-start accent-emerald-600"
                />
                {selected && (
                  <span className="absolute top-3 right-3 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    Selected
                  </span>
                )}
                <div className="text-center space-y-2">
                  <span className="block text-sm font-bold leading-tight">
                    {option.label}
                  </span>
                  <span className="block text-xs text-gray-500 leading-relaxed">
                    {option.description}
                  </span>
                </div>
              </label>
            );
          })}
        </fieldset>
        {editor.feedback && (
          <p role="status" className="text-center text-xs text-gray-600">
            {editor.feedback}
          </p>
        )}
        {editor.error && (
          <div
            ref={errorSummary}
            tabIndex={-1}
            role="alert"
            className="border border-red-200 bg-red-50 rounded-2xl p-4 text-sm space-y-3"
          >
            <p>{editor.error}</p>
            <button
              disabled={editor.busy}
              onClick={() => void editor.reload()}
              className="underline"
            >
              Reload saved answers
            </button>
            <button
              disabled={editor.busy}
              onClick={editor.leaveWithoutSaving}
              className="underline ml-4"
            >
              Leave without saving
            </button>
          </div>
        )}
        <div className="text-center pt-4">
          <Button disabled={editor.busy} onClick={() => void editor.move(1)}>
            {editor.busy
              ? "Saving…"
              : editor.index === editor.total - 1
                ? "Save Discovery and see suggestions"
                : "Next"}
          </Button>
        </div>
        <p className="text-center text-xs text-gray-500">
          Saved revision {editor.saved.revision}. Only answers on your current
          route are used for suggestions.
        </p>
      </div>
      <Dialog
        open={editor.blocker.state === "blocked"}
        onOpenChange={(open) => {
          if (!open && !editor.busy && editor.blocker.state === "blocked")
            editor.blocker.reset();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editor.busy ? "Saving Discovery" : "Save your Discovery edits?"}
            </DialogTitle>
            <DialogDescription>
              Saved answers remain on your account. Unsaved changes exist only
              in this tab. Save valid edits, leave without saving, or stay.
            </DialogDescription>
          </DialogHeader>
          {editor.error && (
            <p role="alert" className="field-error">
              {editor.error}
            </p>
          )}
          <div className="action-row">
            <Button
              disabled={editor.busy}
              onClick={() => void editor.saveAndLeave()}
            >
              Save and leave
            </Button>
            <Button
              variant="outline"
              disabled={editor.busy}
              onClick={() =>
                editor.blocker.state === "blocked" && editor.blocker.proceed()
              }
            >
              Leave without saving
            </Button>
            <Button
              variant="outline"
              disabled={editor.busy}
              onClick={() =>
                editor.blocker.state === "blocked" && editor.blocker.reset()
              }
            >
              Stay
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function DiscoveryResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = useCoreQuery(["discovery"], coreApi.discovery);
  const flow = useRecommendationFlow();
  const started = useRef(false);
  const completed = state.data?.latest_completed;
  const generateFor =
    typeof location.state?.generateFor === "string"
      ? location.state.generateFor
      : null;
  useEffect(() => {
    if (
      !generateFor ||
      started.current ||
      !completed ||
      !flow.query.data ||
      flow.pending
    )
      return;
    started.current = true;
    void navigate(appRoutes.results, { replace: true, state: null });
    if (generateFor === completed.id && flow.query.data.available)
      void flow.request(completed.id);
  }, [generateFor, completed, flow, navigate]);
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col p-6 space-y-8">
      <DiscoveryHeader
        currentStep={6}
        totalSteps={5}
        showProgress={false}
        onBack={() => void navigate(appRoutes.welcome)}
        onSkip={() => void navigate(appRoutes.careers)}
      />
      <div className="max-w-5xl mx-auto w-full my-auto py-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Careers to explore
          </h2>
          <p className="text-sm text-gray-500">
            {completed
              ? "Your Discovery answers are saved. Suggestions are starting points from the available catalog."
              : "Complete Discovery or choose a learning focus to provide context. You can browse all careers."}
          </p>
        </div>
        {state.error && (
          <StatePanel
            kind="error"
            title="Discovery status unavailable"
            action={
              <button onClick={() => void state.refetch()}>Try again</button>
            }
          >
            {state.error.message}
          </StatePanel>
        )}
        <RecommendationCards flow={flow} />
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            to={appRoutes.careers}
            className="bg-black text-white px-6 py-3 rounded-full text-xs"
          >
            Browse careers
          </Link>
          <Link
            to={appRoutes.discovery}
            className="border px-6 py-3 rounded-full text-xs"
          >
            {state.data?.draft
              ? "Resume Discovery"
              : completed
                ? "Retake Discovery"
                : "Start Discovery"}
          </Link>
          <Link
            to={appRoutes.profileSetup}
            className="border px-6 py-3 rounded-full text-xs"
          >
            Set up your profile (optional)
          </Link>
        </div>
      </div>
    </div>
  );
}
