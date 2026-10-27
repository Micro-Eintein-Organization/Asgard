import React, { useState, useEffect } from 'react';
import { DiscoveryAnswers, DiscoveryStep } from '../../types/discovery';
import { DISCOVERY_QUESTIONS } from '../../data/discoveryQuestions';
import { DiscoveryHeader } from './DiscoveryHeader';
import { discoveryService, DiscoveryResult } from '../../services/discoveryService';

interface DiscoveryWizardProps {
  onReturnToEntry?: () => void;
  onSkipToCatalog?: () => void;
  onProceedToProfile?: () => void;
}

export const DiscoveryWizard: React.FC<DiscoveryWizardProps> = ({
  onReturnToEntry,
  onSkipToCatalog,
  onProceedToProfile,
}) => {
  const [step, setStep] = useState<DiscoveryStep>(1);
  const [answers, setAnswers] = useState<DiscoveryAnswers>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // State for Results Card Selection
  const [selectedResultIndex, setSelectedResultIndex] = useState<number>(0);

  // Async submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [results, setResults] = useState<DiscoveryResult[]>([]);
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    const draft = discoveryService.loadDraft();
    if (draft && draft.currentStep > 1 && draft.currentStep <= 5) {
      setHasDraft(true);
    }
  }, []);

  const handleResumeDraft = () => {
    const draft = discoveryService.loadDraft();
    if (draft) {
      setAnswers(draft.answers);
      setStep(draft.currentStep as DiscoveryStep);
      setHasDraft(false);
    }
  };

  const handleStartFresh = () => {
    discoveryService.clearDraft();
    setHasDraft(false);
    setAnswers({});
    setSelectedOption(null);
    setStep(1);
  };

  const handleProceed = async () => {
    if (!selectedOption || !currentRound) return;

    const updatedAnswers = { ...answers, [currentRound.id || step]: selectedOption };
    setAnswers(updatedAnswers);
    setSelectedOption(null);

    if (step < 5) {
      const nextStep = (step + 1) as DiscoveryStep;
      setStep(nextStep);
      discoveryService.saveDraft(updatedAnswers, nextStep);
    } else {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const data = await discoveryService.submitAnswers(updatedAnswers);
        setResults(data);
        setSelectedResultIndex(0); // Default select top match
        setStep(6);
        discoveryService.clearDraft();
      } catch (err: any) {
        setSubmitError(err.message || 'Failed to process recommendations.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleProceedToRoadmap = () => {
    const chosenResult = results[selectedResultIndex];
    if (chosenResult) {
      localStorage.setItem('asgard_active_role', JSON.stringify(chosenResult));
    }

    if (onProceedToProfile) {
      onProceedToProfile();
    } else {
      window.location.href = '/profile-setup';
    }
  };

  const handleBack = () => {
    if (step > 1 && step <= 5) {
      const prevStep = (step - 1) as DiscoveryStep;
      setStep(prevStep);
      setSelectedOption(null);
      discoveryService.saveDraft(answers, prevStep);
    } else if (step === 6) {
      setStep(5);
    } else if (onReturnToEntry) {
      onReturnToEntry();
    }
  };

  const currentRound = DISCOVERY_QUESTIONS[step - 1];

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between p-6">
      <DiscoveryHeader
        currentStep={step}
        onBack={handleBack}
        onSkip={onSkipToCatalog || (() => {})}
      />

      {/* Draft Resume Alert Modal */}
      {hasDraft && step === 1 && (
        <div className="max-w-xl mx-auto bg-emerald-50 border border-emerald-200 rounded-2xl p-4 my-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-emerald-900">In-progress assessment draft found</h4>
            <p className="text-[10px] text-emerald-700">Would you like to resume where you left off?</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleStartFresh}
              className="px-3 py-1 text-[10px] font-semibold text-gray-600 hover:text-black cursor-pointer"
            >
              Start Fresh
            </button>
            <button
              onClick={handleResumeDraft}
              className="px-4 py-1 text-[10px] font-semibold bg-black text-white rounded-full hover:bg-gray-800 cursor-pointer"
            >
              Resume Draft
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="max-w-md mx-auto my-auto text-center py-16 space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="font-bold text-base">Analyzing assessment payload...</h3>
          <p className="text-xs text-gray-400">Matching your answers against career requirements...</p>
        </div>
      )}

      {/* Error State */}
      {submitError && !isSubmitting && (
        <div className="max-w-md mx-auto my-auto text-center py-12 space-y-4 border border-red-200 bg-red-50 rounded-2xl p-6">
          <span className="text-2xl">⚠️</span>
          <h3 className="font-bold text-sm text-red-900">Submission Error</h3>
          <p className="text-xs text-red-600">{submitError}</p>
          <button
            onClick={handleProceed}
            className="px-6 py-2 bg-black text-white rounded-full text-xs font-semibold hover:bg-gray-800 cursor-pointer"
          >
            Retry Submission
          </button>
        </div>
      )}

      {/* Questionnaire Rounds 1 to 5 */}
      {!isSubmitting && !submitError && step <= 5 && currentRound && (
        <div className="max-w-4xl mx-auto w-full my-auto py-8 space-y-8">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-gray-900">{currentRound.title}</h3>
            <p className="text-xs text-gray-500">{currentRound.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentRound.options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={
                    'cursor-pointer rounded-2xl border p-6 transition-all relative flex flex-col justify-between h-64 bg-white select-none ' +
                    (isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500 shadow-md scale-[1.02]'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-xs')
                  }
                >
                  {isSelected && (
                    <span className="absolute top-3 left-3 text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      Selected
                    </span>
                  )}

                  <span className="self-center text-[10px] text-gray-400 border border-gray-200 px-2.5 py-0.5 rounded-full">
                    {opt.badge || 'Domain'}
                  </span>

                  <div className={'w-14 h-14 rounded-full mx-auto transition-colors ' + (isSelected ? 'bg-emerald-50' : 'bg-gray-100')} />

                  <div className="text-center space-y-1">
                    <h4 className="text-xs font-bold leading-tight text-gray-900">{opt.title}</h4>
                    <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">{opt.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={handleProceed}
              disabled={!selectedOption}
              className={
                'px-8 py-3 text-xs font-semibold rounded-full transition-all ' +
                (selectedOption
                  ? 'bg-black text-white hover:bg-gray-800 cursor-pointer shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed')
              }
            >
              {step === 5 ? 'Submit Assessment' : 'Confirm And Proceed'}
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Interactive Results Screen */}
      {!isSubmitting && !submitError && step === 6 && (
        <div className="max-w-5xl mx-auto w-full my-auto py-8 space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold tracking-tight">Here are some directions to explore !</h3>
            <p className="text-xs text-gray-500">These suggestions are starting points based on your answers.</p>
          </div>

          {/* Clickable Direction Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.map((res, idx) => {
              const isSelected = selectedResultIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedResultIndex(idx)}
                  className={
                    'cursor-pointer rounded-2xl p-6 space-y-4 bg-white relative transition-all select-none ' +
                    (isSelected
                      ? 'border-2 border-emerald-500 ring-2 ring-emerald-500 shadow-md scale-[1.02]'
                      : 'border border-gray-200 hover:border-gray-300 shadow-xs')
                  }
                >
                  <span
                    className={
                      'text-[10px] font-bold px-2 py-0.5 rounded-full ' +
                      (isSelected ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600')
                    }
                  >
                    {res.matchPercentage}% Match
                  </span>
                  <h4 className="font-bold text-lg text-gray-900">{res.title}</h4>
                  <p className="text-xs text-gray-500">{res.description}</p>
                  <div className="pt-2 border-t border-gray-100 space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Key Skills</span>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {res.keySkills.map((sk, sIdx) => (
                        <span key={sIdx} className="text-[10px] border border-gray-200 px-2 py-0.5 rounded-full text-gray-600">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center space-x-4 pt-4">
            <button
              onClick={handleStartFresh}
              className="px-6 py-2.5 rounded-full border border-gray-200 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
            >
              Retake Assessment
            </button>
            <button
              onClick={handleProceedToRoadmap}
              className="px-8 py-2.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors cursor-pointer shadow-sm"
            >
              Proceed to Roadmap
            </button>
          </div>
        </div>
      )}
    </div>
  );
};