import React from 'react';
import {
  LayoutDashboard,
  Table,
  Layers,
  Key,
  Network,
  Code2,
  Cpu,
  GraduationCap,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface SidebarProps {
  currentModule: number;
  onSelectModule: (id: number) => void;
  studyMode: 'learn' | 'quiz';
  onToggleStudyMode: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  studyMode,
  onToggleStudyMode,
  isMobileOpen,
  onCloseMobile,
}) => {
  const modules = [
    { id: 0, title: 'Course Dashboard', short: 'Overview', icon: LayoutDashboard },
    { id: 1, title: '1. Structure of Relational DBs', short: 'Structure', icon: Table },
    { id: 2, title: '2. Schema vs Instance', short: 'Schema/Instance', icon: Layers },
    { id: 3, title: '3. Relational Keys', short: 'Keys', icon: Key },
    { id: 4, title: '4. Schema Diagrams', short: 'Schema Diagrams', icon: Network },
    { id: 5, title: '5. Query Languages', short: 'Query Languages', icon: Code2 },
    { id: 6, title: '6. The Relational Algebra', short: 'Relational Algebra', icon: Cpu, isMajor: true },
    { id: 7, title: 'Comprehensive Exam', short: 'Final Exam', icon: GraduationCap },
  ];

  const handleSelect = (id: number) => {
    onSelectModule(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0f243d] text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Course Brand */}
        <div className="p-5 border-b border-slate-800/80 bg-[#0b1b2e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 font-bold font-mono">
              R
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white leading-none">
                DBMS Chapter 2
              </h1>
              <p className="text-[11px] text-blue-200/80 mt-1 font-medium">
                Introduction to Relational Model
              </p>
            </div>
          </div>
        </div>

        {/* Study Mode Toggle */}
        <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800">
          <button
            onClick={onToggleStudyMode}
            className="w-full px-3 py-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between transition-colors text-xs cursor-pointer"
          >
            <div className="text-left">
              <span className="font-semibold block text-slate-200">
                {studyMode === 'learn' ? 'Learn Mode' : 'Quiz Mode'}
              </span>
              <span className="text-[10px] text-slate-400">
                {studyMode === 'learn' ? 'Full Explanations & Hints' : 'Test Mode (Hidden Hints)'}
              </span>
            </div>
            {studyMode === 'learn' ? (
              <ToggleRight className="w-6 h-6 text-emerald-400 shrink-0" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-indigo-400 shrink-0" />
            )}
          </button>
        </div>

        {/* Navigation Modules */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Modules & Sandbox
          </div>

          {modules.map((m) => {
            const Icon = m.icon;
            const isSelected = currentModule === m.id;

            return (
              <button
                key={m.id}
                onClick={() => handleSelect(m.id)}
                className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left transition-all text-xs group cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isSelected ? 'text-white' : m.isMajor ? 'text-amber-400' : 'text-blue-300/70 group-hover:text-blue-200'
                    }`}
                  />
                  <span className="truncate">{m.title}</span>
                </div>

                {m.isMajor && !isSelected && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-400/20 text-amber-300 font-bold ml-2 shrink-0">
                    ENGINE
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

