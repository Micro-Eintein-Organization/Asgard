import { Link, useSearchParams } from "react-router";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeading, StatePanel } from "@/components/shared";
import { categories, careers } from "@/fixtures/catalog";
import { CareerCard } from "@/components/career-card";
import { useIsPreview, usePageRoutes } from "@/lib/page-routes";
import { appRoutes } from "@/lib/routes";
import {
  PreviewStateControl,
  PreviewDataState,
  type PreviewState,
} from "@/components/preview-states";

export function CatalogPage() {
  const preview = useIsPreview();
  const pageRoutes = usePageRoutes();
  const [state, setState] = useState<PreviewState>("sample");
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const category = categories.find(
    (item) => item.id === params.get("category"),
  );
  const results = careers.filter(
    (career) =>
      (!category || career.category === category.id) &&
      [career.title, ...career.skills]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }
  return (
    <>
      <PageHeading
        title="Find a direction worth exploring."
        description="Understand the work, see the skills involved, and take a closer look at a learning path."
      />
      <PreviewStateControl value={state} onChange={setState} />
      {!preview ? (
        <StatePanel
          kind="empty"
          title="Career browsing is coming next"
          action={
            <div className="action-row">
              <Button asChild>
                <Link to={pageRoutes.welcome}>Explore Discovery</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={appRoutes.roadmaps}>Roadmaps</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={pageRoutes.results}>Your suggestions</Link>
              </Button>
            </div>
          }
        >
          Published careers and learning paths are not available yet. Browsing
          here does not select a roadmap or change your progress.
        </StatePanel>
      ) : state !== "sample" ? (
        <PreviewDataState
          state={state}
          subject="careers"
          onReset={() => setState("sample")}
        />
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
                id="career-search"
                type="search"
                placeholder="Search career roles or skills"
                value={query}
                onChange={(event) => update("q", event.target.value)}
              />
              {query && (
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Clear search"
                  onClick={() => update("q", "")}
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
                  <CareerCard key={career.id} career={career} />
                ))}
              </div>
            ) : (
              <StatePanel
                kind="empty"
                title="No matching careers"
                action={
                  <Button variant="outline" onClick={() => setParams({})}>
                    Clear search and filters
                  </Button>
                }
              >
                Try a role title or a skill, or return to all fields.
              </StatePanel>
            )}
          </section>
        </div>
      )}
    </>
  );
}
