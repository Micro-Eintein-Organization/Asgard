import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { PageHeading, BackLink, Notice } from "@/components/shared";
import {
  PreviewDataState,
  PreviewStateControl,
  type PreviewState,
} from "@/components/preview-states";
import { CareerCard } from "@/components/career-card";
import { careers } from "@/fixtures/catalog";
import { appRoutes as pageRoutes } from "@/lib/routes";

export function ResultsPage() {
  const location = useLocation();
  const [state, setState] = useState<PreviewState>("sample");
  const samples = [careers[0], careers[2], careers[3]];
  return (
    <>
      <BackLink to={pageRoutes.discovery} state={location.state}>
        Back to Discovery
      </BackLink>
      <PageHeading
        title="Careers to explore."
        description="Suggestions are starting points. You can explore any career in the catalog."
      />
      <PreviewStateControl value={state} onChange={setState} />
      {state !== "sample" ? (
        <PreviewDataState
          state={state}
          subject="career suggestions"
          onReset={() => setState("sample")}
          emptyAction={
            <Button asChild variant="outline">
              <Link to={pageRoutes.careers}>Browse careers</Link>
            </Button>
          }
        />
      ) : (
        <>
          <Notice>
            Sample results layout. These roles were not generated from your
            answers. The explanations below demonstrate presentation only.
          </Notice>
          <div className="career-grid results-grid mt-6">
            {samples.map((career, index) => (
              <CareerCard
                key={career.id}
                career={career}
                reason={
                  [
                    "Example explanation: an interest in creating useful tools could connect with building interfaces that people use.",
                    "Example explanation: an interest in designing experiences could connect with investigating how people use a product.",
                    "Example explanation: an interest in investigating problems could connect with finding patterns in data.",
                  ][index]
                }
              />
            ))}
          </div>
        </>
      )}
      <div className="action-row centered mt-8">
        <Button asChild variant="outline">
          <Link to={pageRoutes.discovery}>Retake Discovery</Link>
        </Button>
        <Button asChild>
          <Link to={pageRoutes.careers}>Browse careers</Link>
        </Button>
      </div>
      <p className="landing-note centered">
        No match scores, inferred abilities or automatic roadmap selection.
      </p>
    </>
  );
}
