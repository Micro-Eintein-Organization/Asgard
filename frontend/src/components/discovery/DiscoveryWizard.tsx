import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { DiscoveryHeader } from "./DiscoveryHeader";
import { questions } from "@/features/discovery/questions";
import { careers } from "@/fixtures/catalog";
import { appRoutes } from "@/lib/routes";
import { UnsavedPreviewDialog } from "@/components/unsaved-preview-dialog";

export function DiscoveryWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [announcement, setAnnouncement] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const selected = answers[step] ?? [];
  const question = questions[step - 1];
  const currentRound = {
    title: question.title,
    subtitle: question.helper,
    options: question.choices.map(([id, title, description]) => ({
      id,
      title,
      description,
      badge: ["Interest", "Activity", "Approach", "Background", "Goal"][
        step - 1
      ],
    })),
  };
  function select(value: string) {
    let next =
      step === 5
        ? [value]
        : selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected.filter((item) => item !== "unsure"), value];
    if (value === "unsure")
      next = selected.includes(value) && step !== 5 ? [] : [value];
    let message = value === "unsure" ? "Other choices were cleared." : "";
    if (step === 4 && value === "new" && next.includes("technology")) {
      next = next.filter((item) => item !== "technology");
      message = "Technology experience was cleared.";
    }
    if (step === 4 && value === "technology" && next.includes("new")) {
      next = next.filter((item) => item !== "new");
      message = "New to technology was cleared.";
    }
    setAnnouncement(message);
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
  const handleBack = () =>
    step > 1 ? changeStep(step - 1) : void navigate(appRoutes.welcome);
  const handleProceed = () => {
    if (selected.length && step < questions.length) changeStep(step + 1);
  };
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between p-6">
      <UnsavedPreviewDialog
        when={Object.values(answers).some((answer) => answer.length > 0)}
      />
      <DiscoveryHeader
        currentStep={step}
        totalSteps={questions.length}
        onBack={handleBack}
        onSkip={() => void navigate(appRoutes.careers)}
      />
      {/* Questionnaire Rounds 1 to 5 */}
      {currentRound && (
        <div className="max-w-4xl mx-auto w-full my-auto py-8 space-y-8">
          <div className="text-center space-y-1">
            <h2
              ref={heading}
              tabIndex={-1}
              className="text-xl font-bold tracking-tight text-gray-900"
            >
              {currentRound.title}
            </h2>
            <p className="text-xs text-gray-500">{currentRound.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentRound.options.map((opt) => {
              const isSelected = selected.includes(opt.id);
              return (
                <label
                  key={opt.id}
                  className={
                    "cursor-pointer rounded-2xl border p-6 transition-all relative flex flex-col justify-between min-h-64 bg-white select-none " +
                    (isSelected
                      ? "border-emerald-500 ring-2 ring-emerald-500 shadow-md scale-[1.02]"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-xs")
                  }
                >
                  <input
                    type={step === 5 ? "radio" : "checkbox"}
                    name={"question-" + step}
                    checked={isSelected}
                    onChange={() => select(opt.id)}
                    className="absolute top-3 right-3 accent-emerald-600"
                  />
                  {isSelected && (
                    <span className="absolute top-3 left-3 text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      Selected
                    </span>
                  )}

                  <span className="self-center text-[10px] text-gray-400 border border-gray-200 px-2.5 py-0.5 rounded-full">
                    {opt.badge || "Domain"}
                  </span>

                  <div
                    className={
                      "w-14 h-14 rounded-full mx-auto transition-colors " +
                      (isSelected ? "bg-emerald-50" : "bg-gray-100")
                    }
                  />

                  <div className="text-center space-y-1">
                    <h4 className="text-xs font-bold leading-tight text-gray-900">
                      {opt.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          {step < 4 && (
            <label className="flex items-center justify-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.includes("unsure")}
                onChange={() => select("unsure")}
              />
              I'm not sure yet
            </label>
          )}
          <p className="text-center text-xs text-gray-500">
            {step === 5 ? "Choose one" : "Choose all that apply"}. Prototype
            answers stay on this page only.
          </p>
          <p aria-live="polite" className="text-center text-xs">
            {announcement}
          </p>
          <div className="text-center pt-4">
            <button
              onClick={handleProceed}
              disabled={!selected.length || step === questions.length}
              className={
                "px-8 py-3 text-xs font-semibold rounded-full transition-all " +
                (selected.length && step < questions.length
                  ? "bg-black text-white hover:bg-gray-800 cursor-pointer shadow-md"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed")
              }
            >
              {step === questions.length
                ? "See suggestions"
                : "Confirm and proceed"}
            </button>
          </div>
          {step === questions.length && (
            <div className="text-center space-y-3">
              <p className="text-xs text-gray-500">
                Recommendation generation is not connected. Answers are not
                saved or analyzed.
              </p>
              <Link
                to={appRoutes.results}
                className="inline-flex border rounded-full px-6 py-3 text-xs"
              >
                View sample results
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function DiscoveryResults() {
  const navigate = useNavigate();
  const results = [careers[0], careers[2], careers[3]].map((career) => ({
    ...career,
    keySkills: career.skills,
  }));
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between p-6">
      <DiscoveryHeader
        currentStep={questions.length + 1}
        totalSteps={questions.length}
        onBack={() => void navigate(appRoutes.discovery)}
        onSkip={() => void navigate(appRoutes.careers)}
      />
      <div className="max-w-5xl mx-auto w-full my-auto py-8 space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold tracking-tight">
            Here are some directions to explore
          </h3>
          <p className="text-xs text-gray-500">
            Sample results only. These roles were not generated from your
            answers.
          </p>
        </div>

        {/* Clickable Direction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {results.map((res) => {
            return (
              <article
                key={res.id}
                className={
                  "cursor-pointer rounded-2xl p-6 space-y-4 bg-white relative transition-all select-none " +
                  "border border-gray-200 hover:border-gray-300 shadow-xs"
                }
              >
                <span
                  className={
                    "text-[10px] font-bold px-2 py-0.5 rounded-full " +
                    "bg-gray-100 text-gray-600"
                  }
                >
                  Sample suggestion
                </span>
                <h4 className="font-bold text-lg text-gray-900">{res.title}</h4>
                <p className="text-xs text-gray-500">{res.description}</p>
                <p className="text-xs text-gray-500">
                  Example explanation: this role illustrates one direction to
                  explore in the sample catalog.
                </p>
                <div className="pt-2 border-t border-gray-100 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Key Skills
                  </span>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {res.keySkills.map((sk, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] border border-gray-200 px-2 py-0.5 rounded-full text-gray-600"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  to={appRoutes.roadmap(res.id)}
                  className="inline-flex border rounded-full px-5 py-2 text-xs"
                >
                  View roadmap
                </Link>
              </article>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button
            onClick={() => void navigate(appRoutes.discovery)}
            className="px-6 py-2.5 rounded-full border border-gray-200 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
          >
            Retake Assessment
          </button>
          <button
            onClick={() => void navigate(appRoutes.careers)}
            className="px-8 py-2.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors cursor-pointer shadow-sm"
          >
            Browse careers
          </button>
          <Link
            to={appRoutes.profileSetup}
            className="px-6 py-2.5 rounded-full border border-gray-200 text-xs font-semibold"
          >
            Set up your profile (optional)
          </Link>
        </div>
      </div>
    </div>
  );
}
