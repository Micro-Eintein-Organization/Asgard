import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeading, BackLink, Notice } from "@/components/shared";
import { PreviewDataState } from "@/components/preview-states";
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
  const navigate = useNavigate();
  const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null);
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
      <section className="recommendations-page">
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
          <Notice>You can change this later on</Notice>
          <fieldset className="recommendation-options">
            <legend className="sr-only">
              Choose a career to set as your career
            </legend>
            <div className="career-grid results-grid mt-6">
              {samples.map(({ career, reason }, index) => (
                <label
                  key={career.id}
                  className="career-card selectable-card recommendation-card"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <input
                    type="radio"
                    name="recommended-career"
                    value={career.id}
                    checked={selectedCareerId === career.id}
                    onChange={() => setSelectedCareerId(career.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        setSelectedCareerId(career.id);
                      }
                    }}
                    aria-label={`Select ${career.title}`}
                  />
                  <span className="selection-indicator" aria-hidden="true">
                    <Check size={16} />
                  </span>
                  <p className="card-category">{career.work}</p>
                  <h2>{career.title}</h2>
                  <p>{career.description}</p>
                  <div className="suggestion-reason">
                    <h3>Why this was suggested</h3>
                    <p>{reason}</p>
                  </div>
                  <div className="career-skills">
                    <h3>Skills used in this career</h3>
                    <ul>
                      {career.skills.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>
        </>
      )}
      <div className="action-row centered mt-8">
        <Button asChild variant="outline">
          <Link to={pageRoutes.discovery} state={location.state}>
            Retake Discovery
          </Link>
        </Button>
        <Button
          aria-disabled={!selectedCareerId}
          disabled={!selectedCareerId}
          onClick={() => {
            if (selectedCareerId)
              navigate(pageRoutes.roadmap(selectedCareerId));
          }}
        >
          Set as Career
        </Button>
      </div>
      <p className="landing-note centered">
        You can change your career later if you change your mind.
      </p>
    </section>
  );
}
