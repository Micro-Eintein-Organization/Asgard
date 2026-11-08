import { Link, useLocation } from "react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { coreApi, useCoreMutation, useCoreQuery } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";
import { readProfile } from "@/features/profile/api";
import { dismissGuidance, guidanceIds } from "./guidance-preferences";

export function GuidanceBanner() {
  const { pathname } = useLocation();
  const [index, setIndex] = useState(0);
  const preferences = useCoreQuery(["preferences"], coreApi.preferences);
  const discovery = useCoreQuery(["discovery"], coreApi.discovery);
  const suggestions = useCoreQuery(
    ["recommendations"],
    coreApi.recommendations,
  );
  const save = useCoreMutation(coreApi.savePreferences);
  const profile = useCoreQuery(["guidance-profile"], () => readProfile());
  const displayed = suggestions.data?.current?.status === "completed"
    ? suggestions.data.current
    : suggestions.data?.previous_eligible_success;
  const options = [
    discovery.data?.draft
      ? {
          id: guidanceIds.resume,
          message: "Continue your saved Discovery answers.",
          action: "Resume Discovery",
          to: appRoutes.discovery,
        }
      : null,
    displayed && (displayed.outdated || displayed !== suggestions.data?.current)
      ? {
          id: guidanceIds.outdated,
          message: "Your saved context has changed since these suggestions.",
          action: "Review suggestions",
          to: appRoutes.results,
        }
      : null,
    suggestions.data && !suggestions.data.available
      ? {
          id: guidanceIds.provider,
          message:
            "Career suggestions are unavailable. Your saved learning remains accessible.",
          action: "Browse careers",
          to: appRoutes.careers,
        }
      : null,
    pathname.startsWith("/roadmaps/")
      ? {
          id: guidanceIds.browse,
          message: "Browsing does not change your focus or progress.",
          action: "Browse careers",
          to: appRoutes.careers,
        }
      : null,
    pathname === appRoutes.results
      ? {
          id: guidanceIds.suggestionBrowse,
          message: "Browsing a suggestion does not change your current roadmap.",
          action: "Browse careers",
          to: appRoutes.careers,
        }
      : null,
    pathname !== appRoutes.dashboard && profile.data && !profile.data.profile?.first_name
      ? {
          id: guidanceIds.profile,
          message: "You can add your name in your optional profile.",
          action: "Edit profile",
          to: appRoutes.profile,
        }
      : null,
  ];
  const available = options.filter(
    (item): item is NonNullable<typeof item> =>
      item !== null && !preferences.data?.dismissed_guidance.includes(item.id),
  );
  if (!available.length || !preferences.data) return null;
  const currentIndex = index % available.length;
  const guidance = available[currentIndex];
  const saved = preferences.data;
  return (
    <aside
      aria-label="Tips and reminders"
      className="app-guidance"
    >
      <p className="app-guidance-message" aria-live="polite">{guidance.message}</p>
      <Link className="underline" to={guidance.to}>
        {guidance.action}
      </Link>
      {available.length > 1 && (
        <div className="app-guidance-controls" aria-label="Navigate tips and reminders">
          <button type="button" aria-label="Previous tip" onClick={() => setIndex((currentIndex + available.length - 1) % available.length)}>
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <span aria-label={`Tip ${currentIndex + 1} of ${available.length}`}>{currentIndex + 1} / {available.length}</span>
          <button type="button" aria-label="Next tip" onClick={() => setIndex((currentIndex + 1) % available.length)}>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}
      <button
        disabled={save.isPending}
        aria-label="Dismiss suggestion"
        onClick={() =>
          save.mutate(dismissGuidance(saved, guidance.id))
        }
      >
        Dismiss
      </button>
      {save.error && (
        <p role="alert">
          {save.error.message}{" "}
          <button onClick={async () => {
            const result = await preferences.refetch();
            if (result.isSuccess) save.reset();
          }}>
            Reload preferences
          </button>
        </p>
      )}
    </aside>
  );
}
