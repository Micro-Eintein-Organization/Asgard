import React from "react";

interface DiscoveryHeaderProps {
  currentStep: number;
  totalSteps?: number;
  onBack: () => void;
  onSkip: () => void;
}

export const DiscoveryHeader: React.FC<DiscoveryHeaderProps> = ({
  currentStep,
  totalSteps = 5,
  onBack,
  onSkip,
}) => {
  return (
    <div className="max-w-4xl mx-auto w-full pt-4 pb-6 space-y-4 border-b">
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-xs font-semibold px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors flex items-center space-x-1 cursor-pointer"
        >
          <span>&larr; Back</span>
        </button>

        {currentStep <= totalSteps && (
          <button
            onClick={onSkip}
            className="text-xs text-gray-500 hover:text-black font-medium cursor-pointer"
          >
            Skip to Free Browsing &rarr;
          </button>
        )}
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold tracking-tight">
          {currentStep <= totalSteps ? "Discovery" : "Discovery results"}
        </h1>
        <p className="text-xs text-gray-500">
          {currentStep <= totalSteps
            ? `Prototype question ${currentStep} of ${totalSteps}`
            : "Sample results layout"}
        </p>
        {currentStep <= totalSteps && (
          <div className="flex justify-center items-center space-x-2">
            {Array.from({ length: totalSteps }, (_, index) => index + 1).map(
              (s) => (
                <div
                  key={s}
                  className={`h-1.5 w-12 rounded-full transition-colors ${
                    s < currentStep
                      ? "bg-emerald-500"
                      : s === currentStep
                        ? "bg-emerald-500"
                        : "bg-gray-200"
                  }`}
                />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};
