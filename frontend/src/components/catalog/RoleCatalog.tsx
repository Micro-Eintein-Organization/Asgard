import { useState } from 'react';

interface RoleCard {
  id: string;
  title: string;
  description: string;
  category: string;
  badge?: string;
}

const ROLES_DATA: RoleCard[] = [
  { id: 'frontend', title: 'Frontend Developer', description: 'Create user interfaces, websites, and interactive visual elements that people interact with.', category: 'Software and AI', badge: 'User-facing Web development' },
  { id: 'backend', title: 'Backend Developer', description: 'Build the services, rules, and data behind applications, handling logic, accounts, and databases.', category: 'Software and AI', badge: 'Systems Data processing' },
  { id: 'ai-auto', title: 'AI Automation Specialist', description: 'Automate repetitive tasks, connect digital tools, and integrate AI workflow solutions.', category: 'Software and AI', badge: 'Workflow AI Tools' },
  { id: 'fullstack', title: 'Full-Stack Engineer', description: 'Handle both frontend visual elements and backend system architecture, bridging both worlds.', category: 'Software and AI', badge: 'Full-cycle Development' },
  { id: 'uiux', title: 'UI/UX Designer', description: 'Design intuitive user experiences, wireframes, and design systems for web and mobile.', category: 'Design & UX', badge: 'User Research & Figma' },
  { id: 'product-dsn', title: 'Product Designer', description: 'End-to-end product design from user personas to high-fidelity clickable prototypes.', category: 'Design & UX', badge: 'Product Strategy' },
  { id: 'data-eng', title: 'Data Engineer', description: 'Build scalable pipelines for data ingestion, storage, and large-scale analytics processing.', category: 'Data & Analytics', badge: 'Pipelines & SQL' },
  { id: 'data-sci', title: 'Data Scientist', description: 'Analyze complex datasets, build predictive statistical models, and extract actionable insights.', category: 'Data & Analytics', badge: 'Machine Learning' },
  { id: 'sec-analyst', title: 'Cybersecurity Analyst', description: 'Monitor networks for security breaches, investigate violations, and harden system defenses.', category: 'Cybersecurity', badge: 'Network Security' },
];

const CATEGORIES = ['All', 'Software and AI', 'Design & UX', 'Data & Analytics', 'Cybersecurity'];

interface RoleCatalogProps {
  onBack?: () => void;
  onSelectRole?: (roleId: string) => void;
}

export default function RoleCatalog({ onBack, onSelectRole }: RoleCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('frontend');

  const filteredRoles = ROLES_DATA.filter((role) => {
    const matchesSearch =
      role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || role.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProceed = () => {
    localStorage.setItem('asgard_selected_role', selectedRoleId);
    if (onSelectRole) {
      onSelectRole(selectedRoleId);
    } else {
      window.location.href = '/profile-setup';
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
              window.location.href = '/discovery';
            }
          }}
          className="text-xs font-semibold px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors flex items-center space-x-1 cursor-pointer"
        >
          <span>&larr; Back</span>
        </button>

        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          FINAL ROUND: DISCOVERY RESULTS
        </span>

        <button
          onClick={handleProceed}
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
              onClick={() => setSelectedCategory(cat)}
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

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {filteredRoles.map((role) => {
          const isSelected = selectedRoleId === role.id;
          return (
            <div
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              className={
                "cursor-pointer rounded-2xl border p-6 transition-all relative flex flex-col justify-between h-80 bg-white " +
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
                <h3 className="text-lg font-bold tracking-tight text-gray-900">{role.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-4">{role.description}</p>
              </div>

              {role.badge && (
                <div className="pt-4 border-t border-gray-100">
                  <span className="text-[10px] text-gray-400 font-medium">{role.badge}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}