import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { StatePanel } from "@/components/shared";
import { coreApi, useCoreQuery } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";

interface RoleCatalogProps {
  onBack?: () => void;
  onSelectRole?: (roleId: string) => void;
}
export default function RoleCatalog({
  onBack,
  onSelectRole,
}: RoleCatalogProps) {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [selected, setSelected] = useState("");
  const categories = useCoreQuery(["categories"], coreApi.categories);
  const preferences = useCoreQuery(["preferences"], coreApi.preferences);
  const recommendations = useCoreQuery(
    ["recommendations"],
    coreApi.recommendations,
  );
  const search = params.get("q") ?? "";
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
  const proceed = () => {
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
        <label
          key={role.id}
          className={
            "relative flex min-h-64 cursor-pointer flex-col rounded-2xl border-2 bg-white p-6 focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-emerald-700 " +
            (selected === role.id
              ? "border-emerald-500"
              : "border-gray-200 hover:border-gray-400")
          }
        >
          <span className="flex items-center justify-between gap-2">
            <input
              type="radio"
              name="catalog-career"
              value={role.id}
              checked={selected === role.id}
              onChange={() => setSelected(role.id)}
              className="accent-emerald-600"
            />
            {selected === role.id && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-800">
                Selected
              </span>
            )}
          </span>
          <strong className="mt-6 text-xl">{role.title}</strong>
          <span className="mt-4 text-sm leading-relaxed text-gray-600">
            {role.description}
          </span>
          <span className="mt-auto pt-8 text-xs text-gray-600">
            {role.skills.join(" · ")}
          </span>
        </label>
      ))}
    </div>
  );
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-2 py-8 text-gray-900 md:grid-cols-[15rem_minmax(0,1fr)] md:px-6">
      <aside className="min-w-0 space-y-4 md:border-r md:pr-5">
        <h1 className="text-2xl font-bold">Roles Catalog</h1>
        <input
          type="search"
          aria-label="Search career roles or skills"
          value={search}
          onChange={(e) => update("q", e.target.value)}
          placeholder="Search career roles or skills..."
          className="w-full rounded-full border border-gray-300 px-4 py-3 text-sm"
        />
        <nav
          aria-label="Published careers"
          className="flex max-h-56 flex-col overflow-y-auto md:max-h-none"
        >
          {all.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setSelected(role.id)}
              aria-pressed={selected === role.id}
              className={
                "min-h-11 rounded px-3 text-left text-sm hover:bg-gray-100 " +
                (selected === role.id ? "bg-gray-100 font-semibold" : "")
              }
            >
              {role.title}
            </button>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() =>
              onBack ? onBack() : void navigate(appRoutes.dashboard)
            }
            className="min-h-11 rounded-full border px-5 text-sm font-semibold"
          >
            ← Return to dashboard
          </button>
          <button
            disabled={!all.some((role) => role.id === selected)}
            onClick={proceed}
            className="min-h-11 rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white disabled:opacity-50"
          >
            Select Role & View Roadmap
          </button>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Career categories">
          {["All", ...(categories.data ?? []).map((item) => item.title)].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => update("category", cat)}
                aria-pressed={category === cat}
                className={
                  "min-h-11 rounded-full border px-5 text-sm " +
                  (category === cat
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white")
                }
              >
                {cat}
              </button>
            ),
          )}
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
  );
}
