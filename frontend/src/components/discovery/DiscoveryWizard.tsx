import { useScreenContext } from "@/features/counselor-context";
import { useEffect, useRef, type CSSProperties } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import type { components } from "@/api/generated/schema";
import { DiscoveryHeader } from "./DiscoveryHeader";
import { BackLink, PageHeading, StatePanel } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { LoadingIndicator } from "@/components/loading-indicator";
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
import { useAuth } from "@/auth/context";
import { isCurrentAccount } from "@/auth/transport";

type Schemas = components["schemas"];

export function DiscoveryWizard() {
  const navigate = useNavigate();
  const state = useCoreQuery(["discovery"], coreApi.discovery);
  const definition = useCoreQuery(
    ["questionnaire", state.data?.draft?.questionnaire_id],
    signal => coreApi.questionnaire(state.data?.draft?.questionnaire_id, signal),
    !!state.data,
  );
  const start = useCoreMutation(coreApi.startDiscovery);

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
  if (!completed)
    return start.error ? (
      <StatePanel
        kind="error"
        title="Could not open Discovery"
        action={
          <button
            disabled={start.isPending}
            onClick={() => {
              void definition.refetch().then(({ data }) => {
                if (!data) return;
                opening.current = true;
                start.mutate({ questionnaire_id: data.id });
              });
            }}
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
    <div className="discovery-page">
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
          Discovery asks about work you’d like to try. You can choose
          uncertainty, save and leave, or browse careers at any time.
        </p>
        <p className="text-xs text-gray-500">
          {definition.data.version === 2
            ? "Suggestions use your active answers and the published career catalog. They are starting points for exploration."
            : "Your active answers and relevant learning context can be sent to Groq to suggest careers from the published catalog. Names and contact details are excluded."}
        </p>
        <Link to={appRoutes.profile} className="underline">
          Retake Discovery in Settings
        </Link>
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
  useScreenContext({ label: "Discovery → " + editor.question.prompt, questionnaire_id: definition.id, question_id: editor.question.question_id });
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
    <section className="discovery-page">
      <DiscoveryHeader
        currentStep={editor.index + 1}
        totalSteps={editor.total}
        disabled={editor.busy}
        onBack={() => void editor.move(-1)}
        onSkip={() => void editor.skip()}
      />
      <div>
        <header className="discovery-header">
          <h1 ref={heading} tabIndex={-1}>
            {editor.question.prompt}
          </h1>
          <p id="question-helper" className="text-sm text-gray-500">
            {editor.question.helper}
          </p>
          <p className="text-xs text-gray-500">
            {editor.question.multiple
              ? editor.question.max_selections
                ? `Choose up to ${editor.question.max_selections}, or uncertainty on its own.`
                : "Choose all that apply, or uncertainty on its own."
              : "Choose one."}
          </p>
        </header>
        <fieldset
          disabled={editor.busy}
          aria-describedby="question-helper"
          className="choice-grid question-choices border-0 p-0"
          style={
            {
              "--choice-count": definition.version === 2
                ? Math.min(editor.question.options.length, 4)
                : editor.question.options.length,
            } as CSSProperties
          }
        >
          <legend className="sr-only">{editor.question.prompt}</legend>
          {editor.question.options.map((option) => {
            const selected = editor.selected.includes(option.id);
            return (
              <label key={option.id} className="choice-card selectable-card">
                <input
                  type={editor.question.multiple ? "checkbox" : "radio"}
                  name={editor.question.question_id}
                  checked={selected}
                  onChange={() => editor.toggle(option.id)}
                  className="self-start accent-emerald-600"
                />
                {selected && (
                  <span className="selection-indicator" aria-hidden="true">
                    ✓
                  </span>
                )}
                <strong>{option.label}</strong>
                {option.description && <span>{option.description}</span>}
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
        <div className="question-actions" data-align="end">
          {editor.question.kind === "experience_preference" && (
            <Button variant="outline" disabled={editor.busy} onClick={() => void editor.skipExperience()}>
              Skip
            </Button>
          )}
          <Button disabled={editor.busy} onClick={() => void editor.move(1)}>
            {editor.busy && <LoadingIndicator />}
            {editor.busy
              ? "Saving…"
              : editor.index === editor.total - 1
                ? "See suggestions"
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
    </section>
  );
}

export function DiscoveryResults() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = useCoreQuery(["discovery"], coreApi.discovery);
  const retake = useCoreMutation(coreApi.retakeDiscovery);
  const started = useRef(false);
  const requestedRules = useRef<string | null>(null);
  const completed = state.data?.latest_completed;
  const questionnaire = useCoreQuery(
    ["questionnaire", completed?.questionnaire_id],
    () => coreApi.questionnaire(completed?.questionnaire_id),
    !!completed?.questionnaire_id,
  );
  const rulesMode = questionnaire.data?.version === 2;
  const flow = useRecommendationFlow(rulesMode);
  const generateFor =
    typeof location.state?.generateFor === "string"
      ? location.state.generateFor
      : null;
  useEffect(() => {
    if (
      !completed ||
      !flow.query.data ||
      state.isFetching ||
      (!!completed.questionnaire_id && !questionnaire.data) ||
      flow.query.isFetching ||
      flow.pending ||
      flow.cooldown
    )
      return;
    const saved = flow.query.data;
    const current = saved.current;
    const matchingCompletion = current?.discovery?.session_id === completed.id &&
      current.discovery.revision === completed.revision && !current.outdated;
    if (rulesMode) {
      if (generateFor) void navigate(appRoutes.results, { replace: true, state: null });
      const finished = matchingCompletion && current?.model_id === null &&
        (current.status === "completed" || current.failure_code === "no_supported_careers");
      const scope = JSON.stringify([user?.id, completed.id, completed.revision, saved.catalog_release_id]);
      if (!saved.available || finished || requestedRules.current === scope) return;
      requestedRules.current = scope;
      void flow.request();
      return;
    }
    if (!generateFor || started.current || generateFor !== completed.id) return;
    started.current = true;
    void navigate(appRoutes.results, { replace: true, state: null });
    if (saved.available && !matchingCompletion) void flow.request(completed.id);
  }, [generateFor, completed, flow, navigate, state.isFetching, questionnaire.data, rulesMode, user?.id]);
  async function retakeDiscovery() {
    if (!completed || !user || state.data?.draft || retake.isPending) return;
    try {
      await retake.mutateAsync({
        source_session_id: completed.id,
        expected_revision: completed.revision,
      });
      if (isCurrentAccount(user.id)) void navigate(appRoutes.discovery);
    } catch {
      void state.refetch();
    }
  }
  return (
    <section className="recommendations-page">
      <BackLink to={appRoutes.discovery}>Back to Discovery</BackLink>
      <div>
        <PageHeading
          title="Careers to explore."
          description={
            completed
              ? "Your Discovery answers are saved. Suggestions are starting points. You can explore any career in the catalog."
              : flow.query.data?.has_reported_skills
                ? "Suggestions can use your reported experience. Your interests remain unknown until you provide them in Discovery. You can explore any career."
                : "Complete Discovery or choose a learning focus to provide context. You can browse all careers."
          }
        />
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
        <div className="action-row mb-6">
          <Link
            to={appRoutes.careers}
            className="bg-black text-white px-6 py-3 rounded-full text-xs"
          >
            Browse careers
          </Link>
          {state.data?.draft ? (
            <Link
              to={appRoutes.discovery}
              className="border px-6 py-3 rounded-full text-xs"
            >
              Resume Discovery
            </Link>
          ) : completed && (
            <Button variant="outline" disabled={retake.isPending || state.isFetching}
              onClick={() => void retakeDiscovery()}>
              {retake.isPending ? "Opening…" : "Retake Discovery"}
            </Button>
          )}
        </div>
        {retake.error && <p role="alert" className="field-error">{retake.error.message}</p>}
        <RecommendationCards
          flow={flow}
          rulesMode={rulesMode}
          allowInitialRequest={
            !rulesMode && !!flow.query.data?.has_reported_skills && !generateFor
          }
        />
        <Link to={appRoutes.profileSetup} className="mt-4 inline-block text-xs underline">
          Set up your profile (optional)
        </Link>
      </div>
    </section>
  );
}
