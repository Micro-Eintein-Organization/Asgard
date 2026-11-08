import { Link, useLocation } from "react-router";
import { coreApi, useCoreMutation, useCoreQuery } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";
import { readProfile } from "@/features/profile/api";
import { dismissGuidance, guidanceIds } from "./guidance-preferences";

export function GuidanceBanner() {
  const { pathname } = useLocation();
  const preferences = useCoreQuery(["preferences"], coreApi.preferences);
  const discovery = useCoreQuery(["discovery"], coreApi.discovery);
  const suggestions = useCoreQuery(
    ["recommendations"],
    coreApi.recommendations,
  );
  const save = useCoreMutation(coreApi.savePreferences);
  const profile = useCoreQuery(["guidance-profile"], () => readProfile());
  const options = [
    discovery.data?.draft
      ? {
          id: guidanceIds.resume,
          message: "Continue your saved Discovery answers.",
          action: "Resume Discovery",
          to: appRoutes.discovery,
        }
      : null,
    suggestions.data?.current?.outdated
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
          message:
            "You can explore another career. Your saved progress will remain.",
          action: "Browse careers",
          to: appRoutes.careers,
        }
      : null,
    profile.data && !profile.data.profile?.first_name
      ? {
          id: guidanceIds.profile,
          message: "You can add your name in your optional profile.",
          action: "Edit profile",
          to: appRoutes.profile,
        }
      : null,
  ];
  const guidance = options.find(
    (item) => item && !preferences.data?.dismissed_guidance.includes(item.id),
  );
  if (!guidance || !preferences.data) return null;
  const saved = preferences.data;
  return (
    <aside
      aria-label="Suggested next step"
      className="rounded-xl border border-sky-200 bg-sky-50 p-4 mb-6 text-sm flex flex-wrap items-center gap-3"
    >
      <p className="flex-1">{guidance.message}</p>
      <Link className="underline" to={guidance.to}>
        {guidance.action}
      </Link>
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
