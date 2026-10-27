import { Link, useNavigate } from "react-router";
import { DiscoveryHeader } from "./DiscoveryHeader";
import { StatePanel } from "@/components/shared";
import { appRoutes } from "@/lib/routes";
import { coreApi, useCoreQuery } from "@/features/core/data";

export function DiscoveryWizard() {
  const navigate = useNavigate();
  const state = useCoreQuery(["discovery"], coreApi.discovery);
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col p-6 space-y-8">
      <DiscoveryHeader
        currentStep={1}
        totalSteps={1}
        showProgress={false}
        onBack={() => void navigate(appRoutes.welcome)}
        onSkip={() => void navigate(appRoutes.careers)}
      />
      <StatePanel
        kind={state.isPending ? "loading" : "empty"}
        title={
          state.isPending ? "Loading Discovery" : "Discovery is awaiting review"
        }
      >
        {state.error?.message ??
          "The published question definition and database-save contract need architecture and content review before Discovery can accept answers."}
      </StatePanel>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to={appRoutes.careers}
          className="rounded-full bg-black text-white px-6 py-3 text-xs"
        >
          Browse published careers
        </Link>
        <Link
          to={appRoutes.results}
          className="rounded-full border px-6 py-3 text-xs"
        >
          Discovery status
        </Link>
      </div>
    </div>
  );
}

export function DiscoveryResults() {
  const navigate = useNavigate();
  const state = useCoreQuery(["discovery"], coreApi.discovery);
  const completed = state.data?.latest_completed;
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col p-6 space-y-8">
      <DiscoveryHeader
        currentStep={2}
        totalSteps={1}
        onBack={() => void navigate(appRoutes.welcome)}
        onSkip={() => void navigate(appRoutes.careers)}
      />
      <div className="max-w-5xl mx-auto w-full py-8 space-y-8 text-center">
        <h2 className="text-2xl font-bold">
          {completed ? "Discovery saved" : "Discovery status"}
        </h2>
        {state.isPending ? (
          <p>Loading saved Discovery state.</p>
        ) : state.error ? (
          <StatePanel
            kind="error"
            title="Discovery records unavailable"
            action={
              <button onClick={() => void state.refetch()}>Try again</button>
            }
          >
            {state.error.message}
          </StatePanel>
        ) : (
          <p>
            {completed
              ? "Your completed answers are stored on your account."
              : state.data?.draft
                ? "Your saved draft has not been completed."
                : "No completed Discovery is saved."}
          </p>
        )}
        <p className="text-sm text-gray-500">
          AI career recommendations are not enabled. Browse the published
          catalog to choose a direction yourself.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to={appRoutes.careers}
            className="bg-black text-white px-6 py-3 rounded-full text-xs"
          >
            Browse careers
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
