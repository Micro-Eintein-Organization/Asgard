import { Link } from "react-router";
import { BackLink, PageHeading } from "@/components/shared";
import { routes } from "@/lib/routes";
import shadcnLicense from "@/components/ui/LICENSE.md?raw";
import { useInformationReturn } from "./information-navigation";
import coulison from "@/assets/team/coulison.png";
import hzmth from "@/assets/team/hzmth.png";
import lambOh from "@/assets/team/lamb-oh.png";
import ranz from "@/assets/team/ranz.jpg";
import yakisoba from "@/assets/team/yakisobanissin.png";
import founder from "@/assets/team/founder.png";

const members = [
  { name: "Coulison", portrait: coulison },
  { name: "Hzmth", portrait: hzmth },
  { name: "Lamb-OH", portrait: lambOh },
  { name: "Ranzzzz", portrait: ranz },
  { name: "YakisobaNissin", portrait: yakisoba },
  { name: "约翰·马可", portrait: founder, role: "CEO and Founder" },
];

export function FooterLinks() {
  return (
    <nav className="footer-links" aria-label="Information and service">
      <Link to={routes.licenses}>Licenses</Link>
      <Link to={routes.credits}>Credits</Link>
      <Link to={routes.terms}>Terms and conditions</Link>
      <Link to={routes.status}>
        Service status <span aria-hidden="true">↗</span>
      </Link>
    </nav>
  );
}

export function InformationPage({
  page,
}: {
  page: "licenses" | "credits" | "terms";
}) {
  const returnTo = useInformationReturn();
  const title = {
    licenses: "Licenses",
    credits: "Credits",
    terms: "Terms and conditions",
  }[page];
  return (
    <article className="information-page">
      <BackLink to={returnTo}>Back to Asgard</BackLink>
      <PageHeading
        title={title}
        description={
          {
            licenses: "The software and sources behind Asgard.",
            credits: "Built with the work of many.",
            terms: "Terms for using Asgard’s career exploration and learning services.",
          }[page]
        }
      />
      {page === "licenses" && (
        <>
          <section>
            <h2>Interface components</h2>
            <p>
              Asgard includes adapted shadcn/ui components. Their MIT license is
              reproduced below.
            </p>
            <details className="license-notice">
              <summary>Read the shadcn/ui MIT license</summary>
              <pre>{shadcnLicense}</pre>
            </details>
          </section>
          <section>
            <h2>Occupational information</h2>
            <p>
              This service uses the ESCO classification of the European
              Commission. Asgard selects and maps occupational records to its
              career paths.
            </p>
            <p>
              <a href="https://esco.ec.europa.eu/en/use-esco/download/privacy-statement">
                ESCO reuse terms
              </a>
            </p>
            <p>
              Career evidence also includes selected O*NET® records. O*NET® is a
              trademark of the U.S. Department of Labor, Employment and Training
              Administration.
            </p>
            <p>
              <a href="https://www.onetcenter.org/license_db.html">
                O*NET database license
              </a>
            </p>
          </section>
          <section>
            <h2>Other software and learning resources</h2>
            <p>
              Asgard uses open-source software including React, Vite, FastAPI
              and Supabase. Each project retains its own license. Linked
              learning resources belong to their respective owners and have
              their own terms.
            </p>
            <p className="information-note">
              This page lists selected notices. It is not a complete dependency
              license inventory or a license grant for Asgard.
            </p>
          </section>
        </>
      )}
      {page === "credits" && (
        <>
          <section>
            <h2>The Asgard project</h2>
            <p>
              Asgard brings career explanations, learning topics and resources
              together to help people explore a direction at their own pace.
            </p>
            <p>
              Thank you for trying out our university project. Suggestions are welcome!
              <br />The Asgard Team
            </p>
          </section>
          <section aria-labelledby="team-heading">
            <h2 id="team-heading">Asgard Team Members</h2>
            <ul className="team-grid">
              {members.map(member => (
                <li key={member.name}>
                  <figure>
                    <img src={member.portrait} alt="" width={160} height={160} loading="lazy" />
                    <figcaption>{member.name}{member.role && <span>{member.role}</span>}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Open-source foundations</h2>
            <p>
              React, Vite and TypeScript power the interface. Tailwind CSS,
              shadcn/ui, Radix UI and Lucide support its presentation and
              controls. FastAPI and Supabase support the application services.
            </p>
          </section>
          <section>
            <h2>Career and learning sources</h2>
            <p>
              Occupational references include the European Commission’s ESCO
              classification and the O*NET database. Philippine career evidence
              also draws on PSA classifications, TESDA training regulations and
              skills frameworks, and DICT competency standards.
            </p>
            <p>
              Source details are provided with career evidence and learning
              resources. Thank you to the authors and maintainers who make this
              material available.
            </p>
            <Link to={routes.licenses}>View licenses and reuse notices</Link>
          </section>
        </>
      )}
      {page === "terms" && (
        <>
          <section>
            <h2>Career exploration</h2>
            <p>
              Asgard is intended for adults aged 18 and above who want to
              explore careers and learning paths. Suggestions support
              exploration; they do not assess competence or guarantee career
              suitability, job readiness or employment.
            </p>
          </section>
          <section>
            <h2>Your account and progress</h2>
            <p>
              Keep your account credentials private. Learning progress reflects
              the activity you record and is not a professional certification.
            </p>
          </section>
          <section>
            <h2>AI suggestions and external resources</h2>
            <p>
              AI-generated suggestions can be incomplete or incorrect. Review
              them alongside your own goals and the original sources. External
              learning resources are provided by their respective owners.
            </p>
          </section>
          <section>
            <h2>Service availability</h2>
            <p>
              Service access may be interrupted by maintenance or technical issues.
              Some requests may take longer after periods of inactivity. Continuous
              availability and a specific uptime percentage are not guaranteed.
            </p>
            <Link to={routes.status}>Check current service status</Link>
          </section>
        </>
      )}
    </article>
  );
}
