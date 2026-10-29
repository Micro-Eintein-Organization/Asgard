import React from 'react';

interface EntryChoiceProps {
  onSelectChoice: (choice: 'wizard' | 'catalog') => void;
}

export const EntryChoice: React.FC<EntryChoiceProps> = ({ onSelectChoice }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        How would you like to start?
      </h1>
      <p className="mt-3 text-sm text-gray-500 max-w-lg mx-auto">
        Choose between guided career discovery questions or browse the full role catalog directly.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => onSelectChoice('wizard')}
          className="cursor-pointer rounded-2xl border-2 border-gray-200 p-8 transition-all hover:border-black hover:shadow-md relative flex flex-col items-center justify-center text-center space-y-4 bg-white"
        >
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
            1
          </div>
          <h2 className="text-lg font-bold text-gray-900">Guided Discovery</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Answer a few quick questions about your technical interests, project goals, and preferred stack to get tailored recommendations.
          </p>
          <span className="text-xs font-semibold text-blue-600 hover:underline">
            Start Questionnaire &rarr;
          </span>
        </div>

        <div
          onClick={() => onSelectChoice('catalog')}
          className="cursor-pointer rounded-2xl border-2 border-gray-200 p-8 transition-all hover:border-black hover:shadow-md relative flex flex-col items-center justify-center text-center space-y-4 bg-white"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
            2
          </div>
          <h2 className="text-lg font-bold text-gray-900">Browse Role Catalog</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Jump straight to exploring all technical roles, skill roadmaps, and career requirements at your own pace.
          </p>
          <span className="text-xs font-semibold text-emerald-600 hover:underline">
            Explore Catalog &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
