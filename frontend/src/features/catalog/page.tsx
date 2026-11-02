import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeading } from "@/components/shared";
import { categories, careers, sampleMilestones } from "@/fixtures/catalog";
import { CareerCard } from "@/components/career-card";
import { PreviewDataState } from "@/components/preview-states";
import { readTopicStatuses, useTopicStatuses } from "@/lib/learning-state";

function getCareerProgressPercent(
  careerId: string,
  statuses: ReturnType<typeof readTopicStatuses>,
) {
  const topics =
    careerId === "frontend"
      ? sampleMilestones.flatMap((milestone) => milestone.topics)
      : [];
  if (!topics.length || !topics.some((topic) => topic.id in statuses))
    return undefined;
  const completed = topics.filter(
    (topic) => statuses[topic.id] === "Done",
  ).length;
  return Math.round((completed / topics.length) * 100);
}

export function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const topicStatuses = readTopicStatuses(useTopicStatuses());
  const searchInputRef = useRef<HTMLInputElement>(null);
  const restoreSearchFocus = useRef(false);
  const query = params.get("q") ?? "";
  const categoryId = params.get("category");
  const category = categories.find(
    (item) => item.id === categoryId,
  );
  const invalidCategory = categoryId !== null && !category;
  const results = careers.filter(
    (career) =>
      (!category || career.category === category.id) &&
      [career.title, ...career.skills]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  useEffect(() => {
    if (restoreSearchFocus.current && !query) {
      restoreSearchFocus.current = false;
      searchInputRef.current?.focus();
    }
  }, [query]);
  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }
  function clearSearch() {
    restoreSearchFocus.current = true;
    update("q", "");
  }
  return (
    <>
      <PageHeading
        title="Find a direction worth exploring."
        description="Understand the work, see the skills involved, and take a closer look at a learning path."
      />
      {invalidCategory ? (
        <PreviewDataState
          state="error"
          subject="career catalog"
          action={
            <Button variant="outline" onClick={() => setParams({})}>
              Clear invalid filter
            </Button>
          }
        >
          The selected career category is unavailable. Clear the filter to
          return to the catalog.
        </PreviewDataState>
      ) : (
        <div className="catalog-layout">
          <aside className="catalog-sidebar">
            <h2>Career catalog</h2>
            <p className="small muted">Browse by field</p>
            <nav aria-label="Career categories">
              <Button
                variant="ghost"
                aria-pressed={!category}
                onClick={() => update("category", "")}
              >
                All fields<span>7</span>
              </Button>
              {categories.map((item, index) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  aria-pressed={category?.id === item.id}
                  onClick={() => update("category", item.id)}
                >
                  <span className="category-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  {item.title}
                </Button>
              ))}
            </nav>
            <p className="sidebar-note">
              You can explore any field. Discovery is optional.
            </p>
          </aside>
          <section className="catalog-content" aria-label="Career results">
            <div className="search-field">
              <Search aria-hidden="true" size={19} />
              <label className="sr-only" htmlFor="career-search">
                Search career roles or skills
              </label>
              <Input
                ref={searchInputRef}
                id="career-search"
                type="search"
                placeholder="Search career roles or skills"
                value={query}
                onChange={(event) => update("q", event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape" && query) {
                    event.preventDefault();
                    update("q", "");
                  }
                }}
              />
              {query && (
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Clear search query"
                  onClick={clearSearch}
                >
                  <X />
                </Button>
              )}
            </div>
            <div className="catalog-intro">
              <div>
                <h2>
                  {category?.title ?? "A place to start, in every field."}
                </h2>
                <p>
                  {category?.description ??
                    "Seven launch roles across six technology fields. These descriptions are sample content for design review."}
                </p>
              </div>
              <span className="result-count" role="status">
                {results.length} {results.length === 1 ? "role" : "roles"}
              </span>
            </div>
            {results.length ? (
              <div className="career-grid">
                {results.map((career) => (
                  <CareerCard
                    key={career.id}
                    career={career}
                    progressPercent={getCareerProgressPercent(
                      career.id,
                      topicStatuses,
                    )}
                  />
                ))}
              </div>
            ) : (
              <PreviewDataState
                state="empty"
                subject="matching careers"
                emptyAction={
                  <Button variant="outline" onClick={() => setParams({})}>
                    Clear search and filters
                  </Button>
                }
              >
                Try a role title or a skill, or return to all fields.
              </PreviewDataState>
            )}
          </section>
        </div>
      )}
    </>
  );
}
