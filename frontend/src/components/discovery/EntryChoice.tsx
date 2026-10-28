import React, { useState } from "react";

interface EntryChoiceProps {
  onSelectChoice: (choice: "wizard" | "catalog") => void;
}

export const EntryChoice: React.FC<EntryChoiceProps> = ({ onSelectChoice }) => {
  const [choice, setChoice] = useState<"wizard" | "catalog" | null>(null);
  return (
    <div
      data-screen="entry-choice"
      className="max-w-3xl mx-auto px-4 py-12 text-center"
    >
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        How would you like to start?
      </h1>
      <p className="mt-3 text-sm text-gray-500 max-w-lg mx-auto">
        Answer guided questions about your interests, or browse the career
        catalog directly.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          type="button"
          aria-pressed={choice === "wizard"}
          onClick={() => setChoice("wizard")}
          className="cursor-pointer rounded-2xl border-2 border-gray-200 p-8 transition-all hover:border-black hover:shadow-md relative flex flex-col items-center justify-center text-center space-y-4 bg-white"
        >
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
            1
          </div>
          <h2 className="text-lg font-bold text-gray-900">Guided Discovery</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Explore your interests, experience and goals. Save your answers and
            get career suggestions from the available catalog.
          </p>
          <span className="text-xs font-semibold text-blue-600 hover:underline">
            Start Discovery &rarr;
          </span>
        </button>

        <button
          type="button"
          aria-pressed={choice === "catalog"}
          onClick={() => setChoice("catalog")}
          className="cursor-pointer rounded-2xl border-2 border-gray-200 p-8 transition-all hover:border-black hover:shadow-md relative flex flex-col items-center justify-center text-center space-y-4 bg-white"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
            2
          </div>
          <h2 className="text-lg font-bold text-gray-900">
            Browse Role Catalog
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Explore published career roles, learning roadmaps, and career
            requirements at your own pace.
          </p>
          <span className="text-xs font-semibold text-emerald-600 hover:underline">
            Explore Catalog &rarr;
          </span>
        </button>
      </div>
      <button
        disabled={!choice}
        onClick={() => choice && onSelectChoice(choice)}
        className="mt-8 rounded-full bg-black text-white px-8 py-3 text-sm disabled:opacity-50"
      >
        Continue
      </button>
      <p className="mt-4 text-xs text-gray-500">
        Discovery answers save to your account. Active answers and learning
        context can be sent to Groq for career suggestions when configured.
        Names and contact details are excluded; browsing stays available.
      </p>
    </div>
  );
};
