import { Link, useNavigate, useSearchParams } from "react-router";
import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { PageHeading, StatePanel } from "@/components/shared";
import { coreApi, useCoreQuery } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";

interface RoleCatalogProps {
  onBack?: () => void;
  onSelectRole?: (roleId: string) => void;
}
function RoadmapProgress({ id }: { id: string }) {
  const progress = useCoreQuery(["progress", id], () => coreApi.progress(id), !!id);
  const summary = useCoreQuery(["summary", id], () => coreApi.summary(id), !!id);
  if (!progress.data?.length || summary.data?.percentage == null || summary.data.requires_branch_choice) return null;
  return <span className="career-progress" role="meter" aria-label="Roadmap completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={summary.data.percentage}>{Math.round(summary.data.percentage)}%</span>;
}
export default function RoleCatalog({
  onBack,
  onSelectRole,
}: RoleCatalogProps) {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const searchInput = useRef<HTMLInputElement>(null);
  const restoreFocus = useRef(false);
  const categories = useCoreQuery(["categories"], coreApi.categories);
  const preferences = useCoreQuery(["preferences"], coreApi.preferences);
  const recommendations = useCoreQuery(
    ["recommendations"],
    coreApi.recommendations,
  );
  const search = params.get("q") ?? "";
  useEffect(() => {
    if (!search && restoreFocus.current) {
      searchInput.current?.focus();
      restoreFocus.current = false;
    }
  }, [search]);
  const category =
    params.get("category") ??
    categories.data?.find(
      (c) => c.id === preferences.data?.preferred_category_id,
    )?.title ??
    "All";
  const categoryId = categories.data?.find((c) => c.title === category)?.id;
  const careers = useCoreQuery(
    ["careers", search, categoryId],
    () =>
      coreApi.catalog({
        q: search || undefined,
        category_id: categoryId,
        limit: 100,
      }),
    !categories.isPending && !preferences.isPending,
  );
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  const failure = categories.error ?? preferences.error ?? careers.error;
  if (failure)
    return (
      <StatePanel
        kind="error"
        title="Careers unavailable"
        action={
          <button
            onClick={() => {
              void categories.refetch();
              void preferences.refetch();
              void careers.refetch();
            }}
          >
            Try again
          </button>
        }
      >
        {failure.message}
      </StatePanel>
    );
  if (categories.isPending || preferences.isPending || careers.isPending)
    return (
      <StatePanel kind="loading" title="Loading published careers">
        Reading the career catalog.
      </StatePanel>
    );
  const all = careers.data?.items ?? [];
  const state = recommendations.data;
  const run =
    state?.current?.status === "completed"
      ? state.current
      : state?.previous_eligible_success;
  const suggestedIds = new Set(run?.items.map((item) => item.career_id) ?? []);
  const suggested = all.filter((role) => suggestedIds.has(role.id));
  const others = all.filter((role) => !suggestedIds.has(role.id));
  const proceed = (selected: string) => {
    const role = all.find((item) => item.id === selected);
    if (!role) return;
    if (onSelectRole) onSelectRole(selected);
    else {
      const suggestedRoadmap = run?.items.find(
        (item) => item.career_id === selected && !!item.roadmap_id && role.roadmap_ids.includes(item.roadmap_id),
      )?.roadmap_id;
      const destination = appRoutes.roadmap(selected) +
        (suggestedRoadmap ? `?roadmap=${encodeURIComponent(suggestedRoadmap)}` : "");
      void navigate(destination, {
        state: { catalogSearch: "?" + params.toString() },
      });
    }
  };
  const cards = (items: typeof all) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {items.map((role) => (
        <article
          key={role.id}
          className="flex min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-5"
        >
          <div className="career-card-meta"><p className="text-xs text-gray-600">{categories.data?.find((item) => item.id === role.category_id)?.title}</p>
          <RoadmapProgress id={run?.items.find(item => item.career_id === role.id && !!item.roadmap_id && role.roadmap_ids.includes(item.roadmap_id))?.roadmap_id ?? role.roadmap_ids[0] ?? ""} /></div>
          <h3 className="mt-4 text-xl font-semibold">{role.title}</h3>
          <span className="mt-4 text-sm leading-relaxed text-gray-600">
            {role.description.split("\n\n")[0]}
          </span>
          <div className="mt-5 mb-6">
            <p className="mb-2 text-xs font-semibold">Skills used in this career</p>
            <ul className="flex flex-wrap gap-1.5">
              {role.skills.map((skill) => <li key={skill} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">{skill}</li>)}
            </ul>
          </div>
          <button type="button" onClick={() => proceed(role.id)} aria-label={`View ${role.title} roadmap`} className="mt-auto min-h-11 rounded-full bg-gray-100 px-4 text-sm font-medium hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">View roadmap</button>
        </article>
      ))}
    </div>
  );
  return (
    <>
    <PageHeading title="Find a direction worth exploring." description="Understand the work, see the skills involved, and explore a learning path." />
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-2 py-8 text-gray-900 md:grid-cols-[15rem_minmax(0,1fr)] md:px-6">
      <aside className="min-w-0 space-y-4 md:border-r md:pr-5">
        <h1 className="text-lg font-semibold">Career catalog</h1>
        <p className="text-sm text-gray-600">Browse by field</p>
        <nav
          aria-label="Career categories"
          className="flex max-h-56 flex-col overflow-y-auto md:max-h-none"
        >
          {[{id: "All", title: "All fields"}, ...(categories.data ?? [])].map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => update("category", index === 0 ? "All" : item.title)}
              aria-pressed={category === (index === 0 ? "All" : item.title)}
              className={
                "min-h-11 rounded-full px-3 py-2 text-left text-sm " +
                (category === (index === 0 ? "All" : item.title) ? "bg-black text-white" : "hover:bg-gray-100")
              }
            >
              {index > 0 && <span aria-hidden="true" className="mr-2 text-xs">{String(index).padStart(2, "0")}</span>}{item.title}
            </button>
          ))}
        </nav>
        <p className="pt-5 text-sm text-gray-600">You can explore any field. Discovery is optional.</p>
      </aside>
      <div className="min-w-0 space-y-8">
        <div className="search-field"><Search size={19} aria-hidden="true" />
        <input ref={searchInput} id="career-search" type="search" aria-label="Search career roles or skills" value={search} onChange={(event) => update("q", event.target.value)} onKeyDown={event => {if (event.key === "Escape") {event.preventDefault(); update("q", "");}}} placeholder="Search career roles or skills" className="min-h-11 w-full px-4 py-3 text-sm" />
        {search && <button type="button" aria-label="Clear search query" onClick={() => {restoreFocus.current = true; update("q", "");}}><X size={19} /></button>}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() =>
              onBack ? onBack() : void navigate(appRoutes.dashboard)
            }
            className="min-h-11 rounded-full border px-5 text-sm font-semibold"
          >
            ← Return to dashboard
          </button>
          <p role="status" className="text-sm text-gray-600">{careers.data?.total ?? 0} matching roles</p>
        </div>
        {recommendations.isError && (
          <p role="status" className="text-sm text-gray-600">
            Suggestions are unavailable. You can still browse all published
            careers.{" "}
            <button
              className="underline"
              onClick={() => void recommendations.refetch()}
            >
              Retry
            </button>
          </p>
        )}
        {suggested.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Suggested careers</h2>
            <p className="text-sm text-gray-600">
              {run?.outdated || run !== state?.current
                ? "These saved suggestions may be out of date."
                : "Based on your saved Discovery and learning context."}{" "}
              <Link className="underline" to={appRoutes.results}>
                View suggestion details
              </Link>
            </p>
            {cards(suggested)}
          </section>
        )}
        {run && !suggested.length && (
          <p className="text-sm text-gray-600">
            No saved suggestions match these filters.{" "}
            <Link className="underline" to={appRoutes.results}>
              View saved suggestions
            </Link>
          </p>
        )}
        {!run && !recommendations.isPending && !recommendations.isError && (
          <p className="text-sm text-gray-600">
            No saved suggestions yet.{" "}
            <Link className="underline" to={appRoutes.results}>
              Explore Discovery results
            </Link>
          </p>
        )}
        <section className="space-y-4 border-t pt-7">
          <h2 className="text-2xl font-bold">
            {suggested.length ? "All other careers" : "Explore careers"}
          </h2>
          {others.length ? (
            cards(others)
          ) : (
            <p role="status">
              {all.length ? (
                "All matching careers are shown above."
              ) : (
                <>
                  No matching careers.{" "}
                  <button
                    className="underline"
                    onClick={() => setParams({ category: "All" })}
                  >
                    Clear search and filters
                  </button>
                </>
              )}
            </p>
          )}
        </section>
      </div>
    </div>
    </>
  );
}
