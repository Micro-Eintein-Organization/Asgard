import { Link, useLocation } from "react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CareerFixture } from "@/fixtures/catalog";
import { appRoutes as pageRoutes } from "@/lib/routes";

export function CareerCard({
  career,
  reason,
}: {
  career: CareerFixture;
  reason?: string;
}) {
  const location = useLocation();
  return (
    <Card className="career-card">
      <p className="card-category">{career.work}</p>
      <h2>{career.title}</h2>
      <p>{career.description}</p>
      {reason && (
        <div className="suggestion-reason">
          <h3>Why this was suggested</h3>
          <p>{reason}</p>
        </div>
      )}
      <div className="career-skills">
        <h3>Skills used in this career</h3>
        <ul>
          {career.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>
      <Button asChild variant="outline" className="card-action">
        <Link
          to={pageRoutes.roadmap(career.id)}
          state={{
            catalogSearch:
              location.pathname === pageRoutes.careers ? location.search : "",
          }}
        >
          View roadmap<span className="sr-only"> for {career.title}</span>
        </Link>
      </Button>
    </Card>
  );
}
