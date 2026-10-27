import React, { useState } from 'react';

export function SettingsScreen() {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [primaryField, setPrimaryField] = useState('Software and AI');
  const [documentUploaded, setDocumentUploaded] = useState(true);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 bg-white text-gray-900 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t pt-6">
        
        {/* Left Sidebar */}
        <div className="md:col-span-3 space-y-2 border-r pr-6">
          <h2 className="text-xl font-bold mb-6">Settings</h2>
          <button className="w-full text-left px-4 py-2 rounded-xl bg-gray-200 font-bold text-xs">
            Profile
          </button>
          <button 
            onClick={() => alert("Logging out...")} 
            className="w-full text-left px-4 py-2 text-xs text-gray-500 hover:text-black cursor-pointer"
          >
            Log out
          </button>
        </div>

        {/* Right Main Content */}
        <div className="md:col-span-9 space-y-10 pl-2">
          
          {/* Profile Section */}
          <section className="space-y-6">
            <h3 className="text-lg font-bold">Profile</h3>

            {/* Profile Inputs */}
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 border">
                ✏️
              </div>
              <div className="space-y-3 max-w-sm flex-1">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:border-black"
                />
                <input
                  type="text"
                  placeholder="Surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Active Discovery Results Card */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-gray-700">Active Discovery Results</span>
              <div className="border border-gray-200 rounded-2xl p-5 flex justify-between items-center bg-white shadow-2xs">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    Current Focus
                  </span>
                  <h4 className="font-bold text-sm">Software and AI · Frontend Focus</h4>
                  <p className="text-[10px] text-gray-400">Based on your assessment answers from Guided Discovery.</p>
                </div>
                <button
                  onClick={() => window.location.href = '/discovery'}
                  className="px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Retake Discovery
                </button>
              </div>
            </div>

            {/* Preferred Primary Field Radio Selector */}
            <div className="space-y-2 pt-2 border-t">
              <span className="text-xs font-bold text-gray-700">Preferred Primary Field</span>
              <p className="text-[10px] text-gray-400">
                Manually change your catalog focus without resetting your past milestone progress.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  'Software and AI',
                  'Data & Analytics',
                  'UI/UX Design',
                  'Security & Infrastructure',
                ].map((field) => {
                  const isSelected = primaryField === field;
                  return (
                    <button
                      key={field}
                      onClick={() => setPrimaryField(field)}
                      className={`px-4 py-2 rounded-full text-xs font-medium border flex items-center space-x-2 transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold'
                          : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <span>{field}</span>
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Document Management Card */}
            <div className="space-y-2 pt-2 border-t">
              <span className="text-xs font-bold text-gray-700">Academic Profile & Document Management</span>
              <p className="text-[10px] text-gray-400">Your uploaded records are used for coursework and skill analysis.</p>

              {documentUploaded ? (
                <div className="border border-gray-300 rounded-2xl p-4 flex justify-between items-center bg-white shadow-2xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-500 text-white font-bold rounded-lg flex items-center justify-center text-[10px]">
                      PDF
                    </div>
                    <div>
                      <h5 className="font-bold text-xs">Curriculum_Evaluation_2026.pdf</h5>
                      <span className="text-[9px] font-bold text-emerald-600 px-2 py-0.5 rounded-full bg-emerald-50">
                        Uploaded
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-3 text-xs font-semibold">
                    <button onClick={() => alert("Select new PDF")} className="hover:underline cursor-pointer">
                      Replace PDF
                    </button>
                    <button onClick={() => setDocumentUploaded(false)} className="text-red-500 hover:underline cursor-pointer">
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center space-y-2">
                  <button onClick={() => setDocumentUploaded(true)} className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                    Upload Curriculum Evaluation PDF
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Account and Security Section */}
          <section className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-bold">Account and Security</h3>
            <p className="text-xs font-semibold text-gray-700">Set up 2FA</p>
            <p className="text-[10px] text-gray-400">Choose authentication method</p>

            <div className="space-y-3">
              <div className="border border-emerald-500 bg-emerald-50/20 rounded-xl p-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">📱</span>
                  <div>
                    <h5 className="font-bold text-xs">Authenticator App</h5>
                    <p className="text-[10px] text-gray-500">Enter a 6-digit code from app.</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-red-500 hover:underline cursor-pointer">Remove</button>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-white">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">💬</span>
                  <div>
                    <h5 className="font-bold text-xs">SMS Message</h5>
                    <p className="text-[10px] text-gray-400">Receive a code by text message.</p>
                  </div>
                </div>
                <button className="text-xs font-semibold px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  Setup needed
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-white">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">✉️</span>
                  <div>
                    <h5 className="font-bold text-xs">Email Code</h5>
                    <p className="text-[10px] text-gray-400">Receive a code by email.</p>
                  </div>
                </div>
                <button className="text-xs font-semibold px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  Setup needed
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-white">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🔔</span>
                  <div>
                    <h5 className="font-bold text-xs">Push Notification</h5>
                    <p className="text-[10px] text-gray-400">Approve sign-in with a tap.</p>
                  </div>
                </div>
                <button className="text-xs font-semibold px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  Setup needed
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}