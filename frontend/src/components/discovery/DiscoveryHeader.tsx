import React from "react";

interface DiscoveryHeaderProps {
  currentStep: number;
  totalSteps?: number;
  showProgress?: boolean;
  disabled?: boolean;
  onBack: () => void;
  onSkip: () => void;
}

export const DiscoveryHeader: React.FC<DiscoveryHeaderProps> = ({
  currentStep,
  totalSteps = 5,
  showProgress = true,
  disabled = false,
  onBack,
  onSkip,
}) => {
  return (
    <div className="max-w-6xl mx-auto w-full pt-4 pb-6 space-y-5">
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          disabled={disabled}
          className="min-h-11 text-sm font-semibold px-5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center space-x-1 cursor-pointer"
        >
          <span>&larr; Back</span>
        </button>

        {showProgress && currentStep <= totalSteps && (
          <button
            onClick={onSkip}
            disabled={disabled}
            className="min-h-11 text-sm text-gray-600 hover:text-black font-medium cursor-pointer"
          >
            Save and browse careers &rarr;
          </button>
        )}
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Discovery</h1>
        <p className="text-xs text-gray-500">
          {currentStep <= totalSteps
            ? `Question ${currentStep} of ${totalSteps}`
            : "Your saved account results"}
        </p>
        {showProgress && (
          <div
            className="flex justify-center items-center space-x-2"
            aria-label={
              currentStep <= totalSteps
                ? `Question ${currentStep} of ${totalSteps}`
                : "Discovery complete"
            }
          >
            {Array.from(
              { length: totalSteps + 1 },
              (_, index) => index + 1,
            ).map((s) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
