import React, { useState } from 'react';

export const SettingsScreen: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [selectedField, setSelectedField] = useState('Software and AI');

  const fields = [
    'Software and AI',
    'Data & Analytics',
    'UI/UX Design',
    'Security & Infrastructure',
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between border-b border-gray-100">
        <h1 className="text-2xl font-extrabold tracking-tight">Asgard</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => (window.location.href = '/login')}
            className="text-xs font-semibold px-4 py-2 hover:text-black text-gray-600 transition-colors cursor-pointer"
          >
            Log in
          </button>
          <button
            onClick={() => (window.location.href = '/signup')}
            className="bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors shadow-xs cursor-pointer"
          >
            Get started
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-10 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left Sidebar Navigation */}
        <div className="md:col-span-3 space-y-6">
          <h2 className="text-xl font-bold tracking-tight">Settings</h2>
          <nav className="space-y-1">
            <button className="w-full text-left px-4 py-2.5 text-xs font-bold bg-gray-100 rounded-xl text-gray-900">
              Profile
            </button>
            <button className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
              Log out
            </button>
          </nav>
        </div>

        {/* Main Settings Form Area */}
        <div className="md:col-span-9 space-y-10">
          <h2 className="text-xl font-bold tracking-tight">Profile</h2>

          {/* Profile Picture Upload & Names */}
          <div className="flex items-center space-x-6">
            {/* Standardized Avatar Circle with Square Edit Icon */}
            <div className="relative group cursor-pointer flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 group-hover:bg-gray-200 transition-colors border border-gray-200 shadow-xs">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>

            <div className="space-y-3 w-full max-w-sm">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black transition-colors"
              />
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Surname"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          {/* Active Discovery Results */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-800">Active Discovery Results</h3>
            <div className="border border-gray-200 rounded-2xl p-6 flex items-center justify-between bg-white shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Current Focus
                </span>
                <h4 className="text-sm font-bold text-gray-900 pt-1">
                  Software and AI · Frontend Focus
                </h4>
                <p className="text-[11px] text-gray-400">
                  Based on your assessment answers from Guided Discovery.
                </p>
              </div>
              <button
                onClick={() => (window.location.href = '/discovery')}
                className="px-5 py-2 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Retake Discovery
              </button>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Preferred Primary Field */}
          <div className="space-y-3">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-gray-800">Preferred Primary Field</h3>
              <p className="text-[11px] text-gray-400">
                Manually change your catalog focus without resetting your past milestone progress.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {fields.map((f) => {
                const isSelected = selectedField === f;
                return (
                  <button
                    key={f}
                    onClick={() => setSelectedField(f)}
                    className={
                      'px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer border flex items-center space-x-1.5 ' +
                      (isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 font-bold'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white')
                    }
                  >
                    <span>{f}</span>
                    <span
                      className={
                        'w-2 h-2 rounded-full inline-block ' +
                        (isSelected ? 'bg-emerald-500' : 'bg-gray-300')
                      }
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Academic Profile & Document Management */}
          <div className="space-y-3">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-gray-800">Academic Profile & Document Management</h3>
              <p className="text-[11px] text-gray-400">
                Your uploaded records are used for coursework and skill analysis.
              </p>
            </div>
            <div className="border border-gray-200 rounded-2xl p-5 flex items-center justify-between bg-white shadow-xs">
              <div className="flex items-center space-x-3">
                <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                  PDF
                </span>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-gray-800">Curriculum_Evaluation_2026.pdf</p>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Uploaded
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-xs font-semibold">
                <button className="text-gray-700 hover:text-black cursor-pointer">Replace PDF</button>
                <button className="text-red-600 hover:text-red-700 cursor-pointer">Remove</button>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Account and Security */}
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-gray-800">Account and Security</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;