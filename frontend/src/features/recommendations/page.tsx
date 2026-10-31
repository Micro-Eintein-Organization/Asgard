import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { PageHeading, BackLink, Notice } from "@/components/shared";
import { PreviewDataState } from "@/components/preview-states";
import { CareerCard } from "@/components/career-card";
import { careers, type CareerFixture } from "@/fixtures/catalog";
import { appRoutes as pageRoutes } from "@/lib/routes";

function isCareerFixture(value: unknown): value is CareerFixture {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "title" in value &&
    typeof value.title === "string" &&
    "work" in value &&
    typeof value.work === "string" &&
    "description" in value &&
    typeof value.description === "string" &&
    "skills" in value &&
    Array.isArray(value.skills) &&
    value.skills.every((skill) => typeof skill === "string")
  );
}

export function ResultsPage() {
  const location = useLocation();
  const candidates: { career: unknown; reason: string }[] = [
    {
      career: careers[0],
      reason:
        "Example explanation: an interest in creating useful tools could connect with building interfaces that people use.",
    },
    {
      career: careers[2],
      reason:
        "Example explanation: an interest in designing experiences could connect with investigating how people use a product.",
    },
    {
      career: careers[3],
      reason:
        "Example explanation: an interest in investigating problems could connect with finding patterns in data.",
    },
  ];
  const availableCandidates = candidates.filter(
    ({ career }) => career !== undefined,
  );
  const hasInvalidData = availableCandidates.some(
    ({ career }) => !isCareerFixture(career),
  );
  const samples = availableCandidates.filter(
    (
      candidate,
    ): candidate is { career: CareerFixture; reason: string } =>
      isCareerFixture(candidate.career),
  );
  return (
    <>
      <BackLink to={pageRoutes.discovery} state={location.state}>
        Back to Discovery
      </BackLink>
      <PageHeading
        title="Careers to explore."
        description="Suggestions are starting points. You can explore any career in the catalog."
      />
      {hasInvalidData ? (
        <PreviewDataState
          state="error"
          subject="career suggestions"
          action={
            <Button asChild variant="outline">
              <Link to={pageRoutes.careers}>Browse careers</Link>
            </Button>
          }
        >
          The sample career data is invalid, so these results cannot be shown.
        </PreviewDataState>
      ) : samples.length === 0 ? (
        <PreviewDataState
          state="empty"
          subject="career suggestions"
          emptyAction={
            <Button asChild variant="outline">
              <Link to={pageRoutes.careers}>Browse careers</Link>
            </Button>
          }
        >
          No sample career suggestions are available.
        </PreviewDataState>
      ) : (
        <>
          <Notice>
            Sample results layout. These roles were not generated from your
            answers. The explanations below demonstrate presentation only.
          </Notice>
          <div className="career-grid results-grid mt-6">
            {samples.map(({ career, reason }) => (
              <CareerCard
                key={career.id}
                career={career}
                reason={reason}
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
