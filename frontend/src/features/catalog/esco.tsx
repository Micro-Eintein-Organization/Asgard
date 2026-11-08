import { Link, useSearchParams } from "react-router";
import { PageHeading, StatePanel } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { coreApi, useCoreQuery } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";

const path = "/catalog/esco";
const pageSize = 20;

function conceptLink(uri: string, release?: string) {
  const params = new URLSearchParams({ uri });
  if (release) params.set("release", release);
  return path + "?" + params;
}

export function EscoCareerSources({ careerId }: { careerId: string }) {
  const evidence = useCoreQuery(["esco-career", careerId], (signal) =>
    coreApi.escoConcepts({ q: "", offset: 0, career_id: careerId }, signal),
  );
  const release = evidence.data;
  if (!release?.release_id || release.items.length === 0) return null;
  return (
    <section className="space-y-2 rounded-lg border p-4">
      <h2 className="text-lg font-semibold">ESCO occupational references</h2>
      <ul className="space-y-1">
        {release.items.map((item) => (
          <li key={item.uri}><Link className="underline" to={conceptLink(item.uri, release.release_id ?? undefined)}>{item.label}</Link></li>
        ))}
      </ul>
      <p>This service uses the ESCO classification of the European Commission.</p>
      <p>ESCO {release.version} · <a className="underline" href="https://esco.ec.europa.eu/en/use-esco/download/privacy-statement">Reuse terms</a></p>
      <p>{release.adaptations}</p>
    </section>
  );
}

export function EscoReferencePage() {
  const [params, setParams] = useSearchParams();
  const uri = params.get("uri");
  const q = (params.get("q") ?? "").slice(0, 160);
  const type = params.get("kind");
  const kind = type === "occupation" || type === "skill" ? type : undefined;
  const rawOffset = Number(params.get("offset"));
  const offset = Number.isSafeInteger(rawOffset) && rawOffset >= 0 ? rawOffset : 0;
  const expected_release_id = params.get("release") ?? undefined;
  const browse = useCoreQuery(
    ["esco-browse", q, kind, offset, expected_release_id],
    (signal) => coreApi.escoConcepts({ q, kind, offset, expected_release_id }, signal),
    uri === null,
  );
  const detail = useCoreQuery(
    ["esco-detail", uri, offset, expected_release_id],
    (signal) => coreApi.escoConcept({ uri: uri ?? "", offset, expected_release_id }, signal),
    uri !== null,
  );
  const query = uri === null ? browse : detail;
  const release = query.data;
  function paginate(next: number) {
    const nextParams = new URLSearchParams(params);
    nextParams.set("offset", String(next));
    if (release?.release_id) nextParams.set("release", release.release_id);
    setParams(nextParams);
  }
  return (
    <section className="space-y-6">
      <PageHeading
        title={uri === null ? "ESCO reference" : detail.data?.concept.label ?? "ESCO concept"}
        description="Explore European occupational and skills reference data."
        action={<Button asChild variant="outline"><Link to={uri === null ? appRoutes.careers : path}>{uri === null ? "Career catalog" : "Search ESCO"}</Link></Button>}
      />
      {uri === null && (
        <form className="flex flex-wrap items-end gap-3" onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const next = new URLSearchParams();
          for (const name of ["q", "kind"]) {
            const value = String(data.get(name) ?? "").trim();
            if (value) next.set(name, value);
          }
          setParams(next);
        }} key={q + ":" + (kind ?? "")}>
          <label className="grid flex-1 gap-1">
            Search occupations and skills
            <Input name="q" defaultValue={q} maxLength={160} />
          </label>
          <label className="grid gap-1">
            Concept type
            <select name="kind" defaultValue={kind ?? ""} className="h-10 rounded-md border bg-background px-3">
              <option value="">All types</option>
              <option value="occupation">Occupations</option>
              <option value="skill">Skills</option>
            </select>
          </label>
          <Button type="submit">Search</Button>
        </form>
      )}
      {query.isPending && <StatePanel kind="loading" title="Loading ESCO reference" />}
      {query.isError && (
        <StatePanel kind="error" title="ESCO reference unavailable"
          action={<Button asChild variant="outline"><Link to={uri ? conceptLink(uri) : path} onClick={expected_release_id ? undefined : () => void query.refetch()}>Reload reference</Link></Button>}>
          The release may have changed or may be temporarily unavailable.
        </StatePanel>
      )}
      {release && !release.release_id && <StatePanel kind="empty" title="ESCO data is awaiting publication" />}
      {release?.release_id && (
        <>
          {uri && detail.data && (
            <section className="space-y-2">
              <p>{detail.data.description}</p>
              <p><a className="break-all underline" href={detail.data.concept.uri}>Original ESCO concept</a></p>
              {detail.data.careers.length > 0 ? (
                <ul className="space-y-1">
                  {detail.data.careers.map((career) => (
                    <li key={career.id}><Link className="underline" to={appRoutes.roadmap(career.id)}>{career.title}</Link></li>
                  ))}
                </ul>
              ) : detail.data.concept.kind === "occupation" && <p>No Asgard roadmap yet</p>}
              <h2 className="text-lg font-semibold">Related concepts</h2>
            </section>
          )}
          {release.items.length === 0 ? <StatePanel kind="empty" title="No matching concepts" /> : (
            <ul className="divide-y rounded-lg border">
              {release.items.map((item) => (
                <li className="px-4 py-3" key={item.uri + ":" + item.relationship}>
                  <Link className="underline" to={conceptLink(item.uri, release.release_id ?? undefined)}>{item.label}</Link>
                  <p className="text-sm">{item.kind}{item.relationship ? " · " + item.relationship : ""}</p>
                </li>
              ))}
            </ul>
          )}
          <nav className="flex flex-wrap items-center gap-3" aria-label="ESCO results pages">
            <Button variant="outline" disabled={offset === 0} onClick={() => paginate(Math.max(0, offset - pageSize))}>Previous</Button>
            <span>{release.total} results</span>
            <Button variant="outline" disabled={offset + pageSize >= release.total} onClick={() => paginate(offset + pageSize)}>Next</Button>
          </nav>
          <footer className="space-y-1 border-t pt-4 text-sm">
            <p>This service uses the ESCO classification of the European Commission.</p>
            <p>ESCO {release.version} · <a className="underline" href="https://esco.ec.europa.eu/en/use-esco/download/privacy-statement">Reuse terms</a></p>
            <p>{release.adaptations}</p>
          </footer>
        </>
      )}
    </section>
  );
}
