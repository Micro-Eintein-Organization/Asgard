import React, { useState } from 'react';

interface OptionalProfileSetupProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export const OptionalProfileSetup: React.FC<OptionalProfileSetupProps> = ({
  onComplete,
  onSkip,
}) => {
  const [fullName, setFullName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onComplete) {
      onComplete();
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between p-6 font-sans">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pt-2">
        <button
          onClick={onSkip || (() => (window.location.href = '/dashboard'))}
          className="px-4 py-1.5 border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
        >
          &larr; Back
        </button>
      </div>

      {/* Main Form Box */}
      <div className="max-w-xl mx-auto w-full my-auto py-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Set up your student profile
          </h1>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            Add your details now for deeper career recommendations, or skip and complete this anytime from your dashboard.
          </p>
        </div>

        {/* Form Container */}
        <div className="border border-gray-200 rounded-3xl p-8 space-y-6 bg-white shadow-xs">
          
          {/* Avatar Upload Trigger with Uniform Square Edit SVG */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative group cursor-pointer">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 group-hover:bg-gray-200 transition-colors shadow-xs border border-gray-200">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-500">Upload Profile</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Juan Dela Cruz"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all"
              />
            </div>

            {/* PDF / Resume Upload Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800">
                Academic Records or Resume <span className="font-normal text-gray-400">(Optional)</span>
              </label>

              <label className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:border-gray-300 transition-colors bg-gray-50/50">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-md">
                  PDF
                </span>
                <p className="text-xs text-gray-600">
                  Drag & drop your PDF here, or <span className="font-bold underline text-black">browse files</span>
                </p>
                <span className="text-[10px] text-gray-400">
                  {selectedFile ? selectedFile.name : 'Supports PDF up to 10MB'}
                </span>
              </label>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 transition-all shadow-xs cursor-pointer mt-2"
            >
              Proceed
            </button>
          </form>
        </div>

        {/* Skip Link */}
        <div className="text-center pt-1">
          <button
            onClick={onSkip || (() => (window.location.href = '/dashboard'))}
            className="text-xs text-gray-400 hover:text-black font-medium transition-colors cursor-pointer"
          >
            I'll set this up later
          </button>
        </div>
      </div>
    </div>
  );
};

// Provide default export to satisfy default imports in containers/routers
export default OptionalProfileSetup;