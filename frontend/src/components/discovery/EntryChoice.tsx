import React, { useState } from "react";
interface EntryChoiceProps {
  onSelectChoice: (choice: "wizard" | "catalog") => void;
}
export const EntryChoice: React.FC<EntryChoiceProps> = ({ onSelectChoice }) => {
  const [choice, setChoice] = useState<"wizard" | "catalog" | null>(null);
  const options = [
    {
      id: "wizard" as const,
      title: "Guided Discovery",
      description:
        "Answer questions about your interests and explore suggested careers.",
      shape: "★",
    },
    {
      id: "catalog" as const,
      title: "Browse Role Catalog",
      description: "Explore published careers and roadmaps at your own pace.",
      shape: "●",
    },
  ];
  return (
    <div
      data-screen="entry-choice"
      className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-20 text-center"
    >
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
        How would you like to begin?
      </h1>
      <p className="mt-4 text-base text-gray-600">
        Choose a path. You can switch anytime.
      </p>
      <div
        className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6"
        role="group"
        aria-label="Choose how to begin"
      >
        {options.map((option) => (
          <button
            type="button"
            key={option.id}
            aria-pressed={choice === option.id}
            onClick={() => setChoice(option.id)}
            className={
              "relative flex min-h-72 sm:min-h-96 flex-col items-center justify-center gap-8 rounded-2xl border-2 p-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 " +
              (choice === option.id ? "border-emerald-500" : "border-gray-200")
            }
          >
            {choice === option.id && (
              <span className="absolute right-4 top-4 rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-800">
                Selected
              </span>
            )}
            <span
              aria-hidden="true"
              className="text-7xl leading-none text-gray-300"
            >
              {option.shape}
            </span>
            <span className="space-y-3">
              <strong className="block text-xl">{option.title}</strong>
              <span className="block text-sm text-gray-600">
                {option.description}
              </span>
            </span>
          </button>
        ))}
      </div>
      <button
        disabled={!choice}
        onClick={() => choice && onSelectChoice(choice)}
        className="mt-7 min-h-11 w-full rounded-full bg-black px-8 py-3 text-sm text-white disabled:opacity-50"
      >
        Continue
      </button>
      <p className="mt-4 text-xs text-gray-600">
        Answers save to your account. Active answers and learning context can be
        sent to Groq for suggestions. Names and contact details are excluded.
      </p>
    </div>
  );
};
