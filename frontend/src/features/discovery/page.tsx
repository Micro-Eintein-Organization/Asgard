import { useRef, useState } from "react";
import { Link } from "react-router";
import { BookOpen, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackLink, Notice, Unavailable } from "@/components/shared";
import { usePageRoutes } from "@/lib/page-routes";
import { questions } from "./questions";
import { UnsavedPreviewDialog } from "@/components/unsaved-preview-dialog";

export function WelcomePage() {
  const pageRoutes = usePageRoutes();
  const [choice, setChoice] = useState("");
  return (
    <section className="discovery-page entry-page">
      <div className="discovery-header">
        <h1>How would you like to begin?</h1>
        <p>
          Follow your curiosity. You can explore careers with or without
          Discovery.
        </p>
      </div>
      <fieldset>
        <legend className="sr-only">Choose your path</legend>
        <div className="choice-grid entry-choices">
          {[
            {
              id: "guided",
              title: "Guided Discovery",
              description:
                "Answer five questions about your interests, experience, and goals to get career suggestions.",
              icon: Compass,
            },
            {
              id: "browse",
              title: "Browse careers",
              description:
                "Explore careers and learning roadmaps without answering the questions.",
              icon: BookOpen,
            },
          ].map((item) => (
            <label key={item.id} className="choice-card">
              <input
                type="radio"
                name="entry-path"
                value={item.id}
                checked={choice === item.id}
                onChange={() => setChoice(item.id)}
              />
              <item.icon size={30} aria-hidden="true" />
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="action-row centered entry-actions mt-8">
        {choice ? (
          <Button asChild>
            <Link to={choice === "guided" ? pageRoutes.discovery : pageRoutes.careers}>
              Continue
            </Link>
          </Button>
        ) : (
          <Button disabled>Continue</Button>
        )}
      </div>
      <p className="landing-note centered">
        Choose a path to continue. This preview does not create a saved
        Discovery session.
      </p>
    </section>
  );
}

export function DiscoveryPage() {
  const pageRoutes = usePageRoutes();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [announcement, setAnnouncement] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const question = questions[step];
  const selected = answers[step] ?? [];
  function select(value: string) {
    let next =
      step === 4
        ? [value]
        : selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected.filter((item) => item !== "unsure"), value];
    if (value === "unsure")
      next = selected.includes("unsure") && step !== 4 ? [] : ["unsure"];
    if (step === 3 && value === "new" && next.includes("technology")) {
      next = next.filter((item) => item !== "technology");
      setAnnouncement(
        "Technology experience was cleared because you selected new to technology.",
      );
    } else if (step === 3 && value === "technology" && next.includes("new")) {
      next = next.filter((item) => item !== "new");
      setAnnouncement(
        "New to technology was cleared because you selected technology experience.",
      );
    } else
      setAnnouncement(
        value === "unsure"
          ? "Other choices are cleared when you choose uncertainty."
          : "",
      );
    setAnswers({ ...answers, [step]: next });
  }
  function changeStep(value: number) {
    setStep(value);
    setAnnouncement("");
    requestAnimationFrame(() => {
      heading.current?.focus();
      heading.current?.scrollIntoView({ block: "start" });
    });
  }
  return (
    <section className="discovery-page">
      <UnsavedPreviewDialog
        when={Object.values(answers).some((value) => value.length > 0)}
      />
      <div className="discovery-topline">
        {step === 0 ? (
          <BackLink to={pageRoutes.welcome} />
        ) : (
          <Button variant="ghost" onClick={() => changeStep(step - 1)}>
            Back
          </Button>
        )}
        <Link to={pageRoutes.careers}>Skip questions and browse careers</Link>
      </div>
      <header className="discovery-header">
        <div className="question-progress" aria-hidden="true">
          {questions.map((_, index) => (
            <span key={index} className={index <= step ? "filled" : ""} />
          ))}
        </div>
        <p className="question-subject">
          Question {step + 1} of 5 · {question.subject}
        </p>
        <h1 tabIndex={-1} ref={heading}>
          {question.title}
        </h1>
        <p>{question.helper}</p>
      </header>
      <fieldset>
        <legend className="mb-4 text-sm font-semibold">
          {step === 4 ? "Choose one" : "Choose all that apply"}
        </legend>
        <div className="choice-grid">
          {question.choices.map(([id, title, description]) => (
            <label key={id} className="choice-card">
              <input
                type={step === 4 ? "radio" : "checkbox"}
                name={`question-${step}`}
                checked={selected.includes(id)}
                onChange={() => select(id)}
              />
              <strong>{title}</strong>
              <span>{description}</span>
            </label>
          ))}
        </div>
        {step < 3 && (
          <label className="uncertainty">
            <input
              type="checkbox"
              checked={selected.includes("unsure")}
              onChange={() => select("unsure")}
            />
            <span>
              I'm not sure yet
              <span className="field-help block">
                Choose this to clear the other choices.
              </span>
            </span>
          </label>
        )}
        {step === 3 && (
          <p className="field-help mt-4">
            New to technology and technology experience cannot both be selected.
            Experience in another field can accompany either. Uncertainty clears
            the other choices.
          </p>
        )}
      </fieldset>
      <p aria-live="polite" className="field-help mt-3">
        {announcement}
      </p>
      <div className="question-actions">
        <p>Choices stay in this open preview only.</p>
        {step < 4 ? (
          <Button
            disabled={!selected.length}
            onClick={() => changeStep(step + 1)}
          >
            Next
          </Button>
        ) : (
          <Button disabled>See suggestions</Button>
        )}
      </div>
      {step === 4 && (
        <>
          <Unavailable>
            Recommendation generation is not connected. Your choices have not
            been saved or analyzed.
          </Unavailable>
          <div className="mt-4">
            <Link className="inline-link" to={pageRoutes.results}>
              View sample results layout
            </Link>
          </div>
        </>
      )}
      <div className="mt-6">
        <Notice>
          Refreshing or leaving this page clears these unsaved preview choices.
        </Notice>
      </div>
    </section>
  );
}
