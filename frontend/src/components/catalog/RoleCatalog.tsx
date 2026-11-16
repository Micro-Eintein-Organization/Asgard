import { Link, useNavigate, useSearchParams } from "react-router";
import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeading, StatePanel } from "@/components/shared";
import { coreApi, useCoreQuery, useRoadmapPreload } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";
import { careerSummary } from "@/lib/career-summary";

interface RoleCatalogProps {
  onBack?: () => void;
  onSelectRole?: (roleId: string) => void;
}
function RoadmapProgress({ value }: {
  value?: { has_progress: boolean; percentage: number | null; requires_branch_choice: boolean };
}) {
  if (!value?.has_progress || value.percentage == null || value.requires_branch_choice) return null;
  return <span className="career-progress" role="meter" aria-label="Roadmap completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value.percentage}>{Math.round(value.percentage)}%</span>;
}
export default function RoleCatalog({
  onSelectRole,
}: RoleCatalogProps) {
  const navigate = useNavigate();
  const preload = useRoadmapPreload();
  const [params, setParams] = useSearchParams();
  const searchInput = useRef<HTMLInputElement>(null);
  const restoreFocus = useRef(false);
  const catalogSummary = useCoreQuery(["catalog-summary"], coreApi.catalogSummary);
  const categories = { ...catalogSummary, data: catalogSummary.data?.categories };
  const fieldCounts = { ...catalogSummary, data: catalogSummary.data && {
    total: catalogSummary.data.total, byCategory: catalogSummary.data.by_category,
  } };
  const preferences = useCoreQuery(["preferences"], coreApi.preferences);
  const recommendations = useCoreQuery(
    ["recommendations"],
    coreApi.recommendations,
    !catalogSummary.isPending && !preferences.isPending,
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
    signal =>
      coreApi.catalog({
        q: search || undefined,
        category_id: categoryId,
        limit: 100,
      }, signal),
    !categories.isPending && !preferences.isPending,
  );
  const state = recommendations.data;
  const run = state?.current?.status === "completed" ? state.current : state?.previous_eligible_success;
  const cardRoadmap = (role: NonNullable<typeof careers.data>["items"][number]) =>
    run?.items.find(item => item.career_id === role.id && !!item.roadmap_id && role.roadmap_ids.includes(item.roadmap_id))?.roadmap_id ?? role.roadmap_ids[0] ?? "";
  const ids = [...new Set((careers.data?.items ?? []).map(cardRoadmap).filter(Boolean))].sort();
  const badges = useCoreQuery(["catalog-progress", ids], signal => coreApi.catalogProgress(ids, signal), ids.length > 0);
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
          <RoadmapProgress value={badges.data?.find(item => item.roadmap_id === cardRoadmap(role))} /></div>
          <h2>{role.title}</h2>
          <p>
            {careerSummary(role.description)}
          </p>
          <div className="career-skills">
            <h3>{role.exploration ? "What you could do" : "Roadmap topics"}</h3>
            <ul>
              {(role.exploration?.activities.map(activity => activity.action) ?? role.skills).slice(0, 3).map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
            {!role.exploration && role.skills.length > 3 && <p className="catalog-more-skills">{role.skills.length - 3} more skills in this roadmap</p>}
          </div>
          <Button variant="outline" className="card-action" onFocus={() => preload(cardRoadmap(role))} onMouseEnter={() => preload(cardRoadmap(role))} onMouseLeave={() => preload("")} onBlur={() => preload("")} onClick={() => proceed(role.id)} aria-label={`View ${role.title} roadmap`}>Explore career</Button>
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
          {[{ id: "All", title: "All fields" }, ...(categories.data ?? [])].map((item) => {
            const value = item.id === "All" ? "All" : item.title;
            const counts = fieldCounts.data;
            const count = counts && (item.id === "All" ? counts.total : counts.byCategory[item.id] ?? 0);
            return (
              <Button variant="ghost"
                key={item.id}
                type="button"
                onClick={() => update("category", value)}
                aria-pressed={category === value}
                aria-description={count === undefined ? undefined : `${count} available ${count === 1 ? "career" : "careers"}`}
              >
                <span aria-hidden="true" className="category-number">{count}</span>
                <span className="category-name">{item.title}</span>
              </Button>
            );
          })}
        </nav>
      </aside>
      <div className="catalog-content space-y-8">
        <div className="search-field"><Search size={19} aria-hidden="true" />
        <input ref={searchInput} id="career-search" type="search" aria-label="Search career roles or skills" value={search} onChange={(event) => update("q", event.target.value)} onKeyDown={event => {if (event.key === "Escape") {event.preventDefault(); update("q", "");}}} placeholder="Search career roles or skills" className="min-h-11 w-full px-4 py-3 text-sm" />
        {search && <button type="button" aria-label="Clear search query" onClick={() => {restoreFocus.current = true; update("q", "");}}><X size={19} /></button>}
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">{suggested.length ? "Suggested careers" : "Explore careers"}</h2>
          <Button asChild variant="outline"><Link to="/careers/compare">Compare careers</Link></Button>
        </div>
        {suggested.length > 0 && (
          <section className="space-y-4">
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
          {suggested.length > 0 && <h2 className="text-2xl font-bold">All other careers</h2>}
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
