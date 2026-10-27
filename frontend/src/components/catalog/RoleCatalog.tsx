import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { careers, categories } from "@/fixtures/catalog";
import { appRoutes } from "@/lib/routes";

const ROLES_DATA = careers.map((career) => ({
  ...career,
  category: categories.find((category) => category.id === career.category)!
    .title,
  badge: career.work,
}));
const CATEGORIES = ["All", ...categories.map((category) => category.title)];

interface RoleCatalogProps {
  onBack?: () => void;
  onSelectRole?: (roleId: string) => void;
}

export default function RoleCatalog({
  onBack,
  onSelectRole,
}: RoleCatalogProps) {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const searchQuery = params.get("q") ?? "";
  const selectedCategory = CATEGORIES.includes(params.get("category") ?? "")
    ? params.get("category")!
    : "All";
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value && value !== "All") next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  const [selectedRoleId, setSelectedRoleId] = useState<string>("frontend");

  const filteredRoles = ROLES_DATA.filter((role) => {
    const matchesSearch =
      role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.skills.join(" ").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || role.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProceed = () => {
    if (!filteredRoles.some((role) => role.id === selectedRoleId)) return;
    if (onSelectRole) {
      onSelectRole(selectedRoleId);
    } else {
      void navigate(appRoutes.roadmap(selectedRoleId), {
        state: { catalogSearch: "?" + params.toString() },
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 bg-white min-h-screen text-gray-900">
      {/* Top Header Navigation */}
      <div className="flex justify-between items-center border-b pb-4">
        <button
          onClick={() => {
            if (onBack) {
              onBack();
            } else {
              void navigate(appRoutes.welcome);
            }
          }}
          className="text-xs font-semibold px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors flex items-center space-x-1 cursor-pointer"
        >
          <span>&larr; Back</span>
        </button>

        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          CAREER CATALOG
        </span>

        <button
          onClick={handleProceed}
          disabled={!filteredRoles.some((role) => role.id === selectedRoleId)}
          className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-gray-800 transition-colors cursor-pointer shadow-sm"
        >
          Select Role & View Roadmap
        </button>
      </div>

      {/* Main Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Role Catalog</h1>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-xl mx-auto relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="search"
          aria-label="Search career roles or skills"
          value={searchQuery}
          onChange={(e) => update("q", e.target.value)}
          placeholder="Search career roles or skills..."
          className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 text-xs focus:outline-none focus:border-black transition-colors shadow-xs"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex justify-center flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              aria-pressed={selectedCategory === cat}
              onClick={() => update("category", cat)}
              className={
                "px-5 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer border " +
                (isActive
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300")
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      {!filteredRoles.length && (
        <p role="status" className="text-center">
          No matching careers.{" "}
          <button className="underline" onClick={() => setParams({})}>
            Clear search and filters
          </button>
        </p>
      )}
      {/* Role Cards Grid */}
      <div
        role="radiogroup"
        aria-label="Choose a career to view"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4"
      >
        {filteredRoles.map((role) => {
          const isSelected = selectedRoleId === role.id;
          return (
            <div
              key={role.id}
              role="radio"
              tabIndex={0}
              aria-checked={isSelected}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedRoleId(role.id);
                }
              }}
              onClick={() => setSelectedRoleId(role.id)}
              className={
                "cursor-pointer rounded-2xl border p-6 transition-all relative flex flex-col justify-between min-h-80 bg-white " +
                (isSelected
                  ? "border-emerald-500 ring-1 ring-emerald-500 shadow-md"
                  : "border-gray-200 hover:border-gray-300 shadow-xs")
              }
            >
              {isSelected && (
                <span className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  SELECTED
                </span>
              )}

              <div className="space-y-3 pt-2">
                <h3 className="text-lg font-bold tracking-tight text-gray-900">
                  {role.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {role.description}
                </p>
              </div>

              {role.badge && (
                <div className="pt-4 border-t border-gray-100">
                  <span className="text-[10px] text-gray-400 font-medium">
                    {role.badge}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
