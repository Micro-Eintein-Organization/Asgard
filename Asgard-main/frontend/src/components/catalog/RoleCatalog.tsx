import { Link, useNavigate, useSearchParams } from "react-router";
import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeading, StatePanel } from "@/components/shared";
import { coreApi, useCoreQuery } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";
import { careerSummary } from "@/lib/career-summary";

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
    <div className="career-grid">
      {items.map((role) => (
        <Card
          key={role.id}
          className="career-card catalog-career-card"
        >
          <div className="career-card-meta"><p className="card-category">{categories.data?.find((item) => item.id === role.category_id)?.title}</p>
          <RoadmapProgress id={run?.items.find(item => item.career_id === role.id && !!item.roadmap_id && role.roadmap_ids.includes(item.roadmap_id))?.roadmap_id ?? role.roadmap_ids[0] ?? ""} /></div>
          <h2>{role.title}</h2>
          <p>
            {careerSummary(role.description)}
          </p>
          <div className="career-skills">
            <h3>Skills used in this career</h3>
            <ul>
              {role.skills.slice(0, 3).map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
            {role.skills.length > 3 && <p className="catalog-more-skills">{role.skills.length - 3} more skills in this roadmap</p>}
          </div>
          <Button variant="outline" className="card-action" onClick={() => proceed(role.id)} aria-label={`View ${role.title} roadmap`}>View roadmap</Button>
        </Card>
      ))}
    </div>
  );
  return (
    <>
    <PageHeading title="Find a direction worth exploring." description="Understand the work, see the skills involved, and explore a learning path." />
    <div className="catalog-layout">
      <aside className="catalog-sidebar">
        <h2>Career catalog</h2>
        <p className="text-sm text-gray-600">Browse by field</p>
        <nav
          aria-label="Career categories"
        >
          {[{id: "All", title: "All fields"}, ...(categories.data ?? [])].map((item, index) => (
            <Button variant="ghost"
              key={item.id}
              type="button"
              onClick={() => update("category", index === 0 ? "All" : item.title)}
              aria-pressed={category === (index === 0 ? "All" : item.title)}
            >
              <span aria-hidden="true" className="category-number">{index > 0 ? String(index).padStart(2, "0") : ""}</span>
              <span className="category-name">{item.title}</span>
            </Button>
          ))}
        </nav>
        <p className="pt-5 text-sm text-gray-600">You can explore any field. Discovery is optional.</p>
      </aside>
      <div className="catalog-content space-y-8">
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
