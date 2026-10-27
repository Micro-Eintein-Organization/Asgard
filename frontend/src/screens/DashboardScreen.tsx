import { useState, useEffect } from 'react';

interface ActiveRole {
  title: string;
  description: string;
}

export const DashboardScreen = () => {
  const [activeRole, setActiveRole] = useState<ActiveRole>({
    title: 'Fullstack Developer',
    description: '"A jack of all trades is a master of none, but oftentimes better than a master of one"',
  });
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const savedRole = localStorage.getItem('asgard_active_role');
    if (savedRole) {
      try {
        const parsed = JSON.parse(savedRole);
        setActiveRole({
          title: parsed.title,
          description: parsed.description || activeRole.description,
        });
      } catch {
        // fallback to default activeRole
      }
    }
  }, [activeRole.description]);

  // Calendar Heatmap Mock Grid (7 cols x 4 rows)
  const calendarDays = [
    { level: 1 }, { level: 1 }, { level: 1 }, { level: 1 }, { level: 1 }, { level: 1 }, { level: 1 },
    { level: 1 }, { level: 1 }, { level: 2 }, { level: 3 }, { level: 1 }, { level: 1 }, { level: 1 },
    { level: 3 }, { level: 3 }, { level: 1 }, { level: 1 }, { level: 1 }, { level: 1 }, { level: 1 },
    { level: 1 }, { level: 1 }, { level: 0 }, { level: 0 }, { level: 0 }, { level: 0 }, { level: 0 },
  ];

  const getHeatmapBg = (level: number) => {
    switch (level) {
      case 3:
        return 'bg-amber-600';
      case 2:
        return 'bg-amber-400';
      case 1:
        return 'bg-amber-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Top Banner */}
      <div className="bg-gray-100 border-b border-gray-200 px-8 py-2 text-xs text-gray-500">
        <span className="font-semibold text-gray-700 mr-2">Demo content</span>
        Sample careers, suggestions and progress. These examples are not your saved account data. Discovery answers are not saved.
      </div>

      {/* Main Content Container with reduced top padding */}
      <div className="max-w-7xl mx-auto px-6 py-4 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Sidebar Column (Role, Heatmap Calendar, Profile Enrichment) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Active Target Role Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-3 relative">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
                <span>Role</span>
                <button
                  onClick={() => (window.location.href = '/catalog')}
                  className="flex items-center space-x-1 text-gray-500 hover:text-black transition-colors cursor-pointer text-xs font-medium"
                >
                  <span>Edit</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl py-3 px-4 text-center bg-gray-50/50">
                <h2 className="text-base font-bold text-gray-900">{activeRole.title}</h2>
              </div>

              <p className="text-xs text-center italic text-gray-500 leading-relaxed px-2">
                {activeRole.description}
              </p>
            </div>

            {/* Square Heatmap Activity Calendar */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900">October</h3>
                <div className="flex items-center space-x-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-amber-700 text-xs font-bold">
                  <span>67</span>
                  <span>🔥</span>
                </div>
              </div>

              <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-gray-400 pb-1">
                <span>S</span>
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>TH</span>
                <span>F</span>
                <span>S</span>
              </div>

              {/* Square Heatmap Grid */}
              <div className="grid grid-cols-7 gap-1.5 justify-items-center">
                {calendarDays.map((day, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square w-6 h-6 rounded-md transition-colors ${getHeatmapBg(day.level)}`}
                  />
                ))}
              </div>
            </div>

            {/* Profile Enrichment CTA & Nielsen-Compliant Tooltip */}
            <div className="relative space-y-2">
              <button
                onClick={() => (window.location.href = '/profile-setup')}
                className="w-full py-3 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 transition-all shadow-sm cursor-pointer"
              >
                Profile Enrichment
              </button>

              {showTooltip && (
                <div className="relative bg-blue-600 text-white p-3.5 rounded-2xl shadow-lg text-xs space-y-1">
                  <div className="absolute -top-1.5 left-8 w-3 h-3 bg-blue-600 rotate-45" />
                  <div className="flex items-start justify-between">
                    <p className="font-medium pr-2 leading-snug">
                      Complete your student profile to personalize your learning roadmap.
                    </p>
                    <button
                      onClick={() => setShowTooltip(false)}
                      className="text-white hover:text-gray-200 font-bold text-sm cursor-pointer ml-1"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Core Milestone & Curriculum Roadmap) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Core Milestone Banner */}
            <div className="bg-black text-white rounded-3xl p-8 space-y-6 shadow-md relative overflow-hidden">
              <div className="space-y-1">
                <h1 className="text-2xl font-extrabold tracking-tight">[Core Milestone Name]</h1>
                <button className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer">
                  continue &gt;
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-end text-xs font-bold text-gray-300">
                  <span>25%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-1/4 rounded-full" />
                </div>
              </div>
            </div>

            {/* Curriculum Roadmap Section */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-gray-900">Software development foundations</h2>

              <div className="space-y-3">
                {/* Not Started */}
                <div className="border-b border-gray-200 pb-3">
                  <span className="text-xs font-bold text-gray-500 flex items-center space-x-1 mb-2">
                    <span>Not Started</span>
                    <span>▲</span>
                  </span>
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center space-x-3 text-xs font-semibold text-gray-800">
                      <span className="w-4 h-4 border-2 border-dashed border-gray-400 rounded-full flex-shrink-0" />
                      <span>Core Universal Principles</span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs font-semibold text-gray-800">
                      <span className="w-4 h-4 border-2 border-dashed border-gray-400 rounded-full flex-shrink-0" />
                      <span>Data and Databases</span>
                    </div>
                  </div>
                </div>

                {/* In-Progress */}
                <div className="border-b border-gray-200 pb-3">
                  <span className="text-xs font-bold text-gray-500 flex items-center space-x-1 mb-2">
                    <span>In-Progress</span>
                    <span>▲</span>
                  </span>
                  <div className="pl-2">
                    <div className="flex items-center space-x-3 text-xs font-semibold text-emerald-700">
                      <span className="w-4 h-4 border-2 border-emerald-500 rounded-full flex-shrink-0" />
                      <span>Development Methodologies</span>
                    </div>
                  </div>
                </div>

                {/* Complete */}
                <div>
                  <span className="text-xs font-bold text-gray-500 flex items-center space-x-1 mb-2">
                    <span>Complete</span>
                    <span>▲</span>
                  </span>
                  <div className="pl-2">
                    <div className="flex items-center space-x-3 text-xs font-semibold text-gray-400 line-through">
                      <span className="w-4 h-4 bg-gray-200 rounded-full flex-shrink-0" />
                      <span>The Software Development Life Cycle (SDLC)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
          <p><strong className="text-gray-900">Asgard</strong> Career exploration, at your pace.</p>
          <a href="#" className="hover:underline">Service status</a>
        </div>
      </div>
    </div>
  );
};