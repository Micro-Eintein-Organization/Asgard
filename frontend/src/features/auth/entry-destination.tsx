import { Link, Navigate } from "react-router";
import { useAuth } from "@/auth/context";
import { StatePanel } from "@/components/shared";
import { coreApi, useCoreQuery } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";

import { hasEntryChoice } from "./entry-choice";

export function PostSignInDestination() {
  const { user } = useAuth();
  const chosen = !!user && hasEntryChoice(user.id);
  const state = useCoreQuery(["entry-destination"], async () => {
    const [discovery, learning] = await Promise.all([coreApi.discovery(), coreApi.learning()]);
    return { returning: !!(discovery.draft || discovery.latest_completed || learning.current_roadmap_id) };
  }, !chosen);
  if (chosen) return <Navigate to={appRoutes.dashboard} replace />;
  if (state.error) return <StatePanel kind="error" title="Could not load your starting page" action={<div className="action-row"><button onClick={() => void state.refetch()}>Try again</button><Link to={appRoutes.welcome}>Choose how to begin</Link></div>}>{state.error.message}</StatePanel>;
  if (!state.data) return <StatePanel kind="loading" title="Finding your starting page">Checking your saved Discovery and learning context.</StatePanel>;
  return <Navigate to={state.data.returning ? appRoutes.dashboard : appRoutes.welcome} replace />;
}
