import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { appRoutes } from "@/lib/routes";

export function DashboardScreen() {
  const navigate = useNavigate();
  const topic = (id: string) => `${appRoutes.roadmap("frontend")}?topic=${id}`;
  const [profileTooltipDismissed, setProfileTooltipDismissed] = useState(false);
  const [openSections, setOpenSections] = useState({
    notStarted: true,
    inProgress: true,
    complete: true,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 bg-white text-gray-900 min-h-screen">
      <h1 className="sr-only">Dashboard</h1>
      {/* Main Grid: Left Column (Role + Calendar) & Right Column (Milestone Banner + Foundations) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Selected Role Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-3 relative">
            <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
              <span>Role</span>
              <button
                onClick={() => void navigate(appRoutes.careers)}
                className="hover:text-black flex items-center space-x-1 cursor-pointer"
              >
                <span>edit</span>
                <span>✏️</span>
              </button>
            </div>
            <div className="border border-gray-300 rounded-xl p-3 bg-white text-center font-bold text-lg shadow-2xs">
              Frontend Developer
            </div>
            <p className="text-xs text-gray-500 italic text-center leading-relaxed">
              Sample roadmap. Choosing a saved focus is not connected yet.
            </p>
          </div>

          {/* Activity / Streak Calendar Widget */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm">October</h3>
              <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-2xs">
                <span>Sample</span>
                <span>🔥</span>
              </span>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400">
              <span>S</span>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>TH</span>
              <span>F</span>
              <span>S</span>
            </div>

            {/* Calendar Heatmap Grid */}
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {[...Array(28)].map((_, idx) => {
                const isOrange = idx < 16;
                const isDarkOrange = idx >= 10 && idx < 16;
                return (
                  <div
                    key={idx}
                    className={`h-6 rounded-md ${
                      isDarkOrange
                        ? "bg-orange-500"
                        : isOrange
                          ? "bg-orange-200"
                          : "bg-gray-200"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Profile Enrichment Callout & Banner */}
          <div className="relative pt-2">
            <button
              onClick={() => void navigate(appRoutes.profile)}
              className="w-full bg-black text-white font-semibold py-3 px-6 rounded-full text-xs hover:bg-gray-800 transition-colors shadow-md cursor-pointer"
            >
              Profile Enrichment
            </button>

            {!profileTooltipDismissed && (
              <div className="mt-3 bg-blue-600 text-white p-4 rounded-xl text-xs relative shadow-lg space-y-2">
                <div className="absolute -top-2 left-8 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-blue-600" />
                <div className="flex justify-between items-start">
                  <p className="pr-4 leading-relaxed font-medium">
                    Add your name or review your profile in Settings. This is
                    optional.
                  </p>
                  <button
                    aria-label="Dismiss profile guidance"
                    onClick={() => setProfileTooltipDismissed(true)}
                    className="text-white opacity-70 hover:opacity-100 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Milestone Hero Banner */}
          <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl p-8 space-y-6 shadow-md relative overflow-hidden">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold tracking-tight">
                Web foundations
              </h2>
              <button
                onClick={() => void navigate(topic("semantic-html"))}
                className="text-xs text-gray-300 hover:text-white font-medium cursor-pointer"
              >
                continue &gt;
              </button>
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex justify-end text-xs font-bold text-gray-300">
                <span>25%</span>
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-1/4 rounded-full transition-all duration-500" />
              </div>
            </div>
          </div>

          {/* Software Development Foundations List */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg tracking-tight">
              Software development foundations
            </h3>

            {/* Not Started Section */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection("notStarted")}
                aria-expanded={openSections.notStarted}
                className="flex items-center space-x-2 text-xs font-bold text-gray-700 hover:text-black cursor-pointer"
              >
                <span>Not Started</span>
                <span
                  className={`transform transition-transform ${openSections.notStarted ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>
              <div className="h-px bg-gray-200" />

              {openSections.notStarted && (
                <div className="pl-4 space-y-3 pt-1">
                  <Link
                    to={topic("css-layout")}
                    className="flex items-center space-x-3 text-xs font-semibold text-gray-800 cursor-pointer hover:text-emerald-600"
                  >
                    <span className="w-4 h-4 border-2 border-dashed border-gray-400 rounded-full flex-none" />
                    <span>CSS and layout</span>
                  </Link>
                  <Link
                    to={`${appRoutes.roadmap("frontend")}?topic=javascript`}
                    className="flex items-center space-x-3 text-xs font-semibold text-gray-800 cursor-pointer hover:text-emerald-600"
                  >
                    <span className="w-4 h-4 border-2 border-dashed border-gray-400 rounded-full flex-none" />
                    <span>JavaScript fundamentals</span>
                  </Link>
                </div>
              )}
            </div>

            {/* In-Progress Section */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection("inProgress")}
                aria-expanded={openSections.inProgress}
                className="flex items-center space-x-2 text-xs font-bold text-gray-700 hover:text-black cursor-pointer"
              >
                <span>In-Progress</span>
                <span
                  className={`transform transition-transform ${openSections.inProgress ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>
              <div className="h-px bg-gray-200" />

              {openSections.inProgress && (
                <div className="pl-4 space-y-3 pt-1">
                  <Link
                    to={topic("semantic-html")}
                    className="flex items-center space-x-3 text-xs font-semibold text-gray-800 cursor-pointer hover:text-emerald-600"
                  >
                    <span className="w-4 h-4 border-2 border-emerald-500 bg-emerald-50 rounded-full flex-none" />
                    <span>Semantic HTML</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Complete Section */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection("complete")}
                aria-expanded={openSections.complete}
                className="flex items-center space-x-2 text-xs font-bold text-gray-700 hover:text-black cursor-pointer"
              >
                <span>Complete</span>
                <span
                  className={`transform transition-transform ${openSections.complete ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>
              <div className="h-px bg-gray-200" />

              {openSections.complete && (
                <div className="pl-4 space-y-3 pt-1">
                  <Link
                    to={topic("how-the-web-works")}
                    className="flex items-center space-x-3 text-xs font-medium text-gray-400 line-through"
                  >
                    <span className="w-4 h-4 bg-gray-300 rounded-full flex-none" />
                    <span>How the web works</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
