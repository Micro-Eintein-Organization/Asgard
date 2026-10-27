import React, { useState } from 'react';

interface OptionalProfileSetupProps {
  onBack?: () => void;
  onProceed?: () => void;
  onSkip?: () => void;
}

export default function OptionalProfileSetup({ onBack, onProceed, onSkip }: OptionalProfileSetupProps) {
  const [fullName, setFullName] = useState('');
  const [hasFile, setHasFile] = useState(false);

  const handleProceed = () => {
    const setupData = {
      fullName,
      hasFile,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('asgard_student_profile', JSON.stringify(setupData));

    if (onProceed) {
      onProceed();
    } else {
      window.location.href = '/dashboard';
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 bg-white min-h-screen text-gray-900">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack || (() => window.history.back())}
          className="text-xs font-semibold px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors flex items-center space-x-1 cursor-pointer"
        >
          <span>&larr; Back</span>
        </button>
      </div>

      {/* Title & Subtitle */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Set up your student profile</h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
          Add your details now for deeper career recommendations, or skip and complete this anytime from your dashboard.
        </p>
      </div>

      {/* Main Centered Card Container */}
      <div className="max-w-md mx-auto border border-gray-200 rounded-3xl p-8 space-y-6 bg-white shadow-xs">
        
        {/* Upload Profile Avatar */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors border border-gray-300">
            <span className="text-sm">✏️</span>
          </div>
          <span className="text-[10px] font-medium text-gray-400">Upload Profile</span>
        </div>

        {/* Full Name Field */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-900">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="E.G. Esmiringhoy"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-black transition-colors"
          />
        </div>

        {/* Academic Records or Resume (Optional) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-900">Academic Records or Resume (Optional)</label>
          
          <div
            onClick={() => setHasFile(!hasFile)}
            className="border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-2xl p-6 text-center cursor-pointer transition-colors space-y-3 bg-gray-50/50"
          >
            <div className="w-10 h-10 rounded-lg bg-red-500 text-white font-bold flex items-center justify-center mx-auto text-[10px] shadow-xs">
              PDF
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-600">
                {hasFile ? (
                  <span className="font-bold text-emerald-700">Evaluation_Record_Attached.pdf</span>
                ) : (
                  <>Drag & drop your PDF here, or <span className="underline font-semibold text-black">browse files</span></>
                )}
              </p>
              <p className="text-[10px] text-gray-400">Supports PDF up to 10MB</p>
            </div>
          </div>
        </div>

        {/* Proceed Button */}
        <div className="pt-2">
          <button
            onClick={handleProceed}
            className="w-full bg-black text-white py-3 rounded-full text-xs font-semibold hover:bg-gray-800 transition-colors cursor-pointer shadow-sm"
          >
            Proceed
          </button>
        </div>
      </div>

      {/* Footer Skip Link */}
      <div className="text-center pt-2">
        <button
          onClick={handleSkip}
          className="text-xs text-gray-400 hover:text-black font-medium transition-colors cursor-pointer"
        >
          I'll set this up later
        </button>
      </div>
    </div>
  );
}