import React from 'react';
import { Menu, BookOpen, Bookmark } from 'lucide-react';

interface HeaderProps {
  currentModule: number;
  studyMode: 'learn' | 'quiz';
  onToggleStudyMode: () => void;
  onOpenCheatSheet: () => void;
  onOpenGlossary: () => void;
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModule,
  studyMode,
  onToggleStudyMode,
  onOpenCheatSheet,
  onOpenGlossary,
  onOpenMobileNav,
}) => {
  const getModuleTitle = () => {
    switch (currentModule) {
      case 0:
        return { title: 'Chapter 2 Overview & Dashboard', subtitle: 'Course syllabus and live interactive relational labs' };
      case 1:
        return { title: 'Module 1: Structure of Relational Databases', subtitle: 'Relations, tuples, attributes, domains, atomicity, and null values' };
      case 2:
        return { title: 'Module 2: Database Schema vs. Instance', subtitle: 'Logical structure versus time-varying state snapshots' };
      case 3:
        return { title: 'Module 3: Relational Keys & Constraints', subtitle: 'Superkeys, candidate keys, primary keys, and foreign keys' };
      case 4:
        return { title: 'Module 4: Schema Diagrams & University DB', subtitle: 'Entity-relationship diagrams, primary keys, and foreign key paths' };
      case 5:
        return { title: 'Module 5: Relational Query Languages', subtitle: 'Procedural vs. declarative paradigms, relational algebra vs. calculus' };
      case 6:
        return { title: 'Module 6: The Relational Algebra Sandbox', subtitle: 'Live query engine for σ, ∏, ×, ⋈, ∪, ∩, −, ρ, γ, and equivalent queries' };
      case 7:
        return { title: 'Chapter 2 Comprehensive Mastery Exam', subtitle: '15-question cumulative assessment covering all relational foundations' };
      default:
        return { title: 'DBMS Chapter 2', subtitle: 'Introduction to the Relational Model' };
    }
  };

  const { title, subtitle } = getModuleTitle();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 lg:px-8 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-[#1e3a5f] truncate tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block truncate mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Unified Reference Tools & Study Mode Bar */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Dedicated Unified Quick-Reference Buttons */}
        <div className="flex items-center bg-slate-100/90 border border-slate-200/80 p-0.5 rounded-xl shadow-2xs">
          <button
            onClick={onOpenCheatSheet}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-white rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
            title="Open Relational Algebra Notation Cheat Sheet (σ, ∏, ×, ⋈, ∪, ∩, −, ρ, γ)"
          >
            <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="hidden sm:inline">Notation Cheat Sheet</span>
            <span className="sm:hidden">Cheat Sheet</span>
          </button>

          <div className="w-[1px] h-4 bg-slate-300 mx-0.5" />

          <button
            onClick={onOpenGlossary}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-amber-700 hover:bg-white rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
            title="Open Relational Model Terminology Glossary (20+ Definitions)"
          >
            <Bookmark className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="hidden sm:inline">Relational Glossary</span>
            <span className="sm:hidden">Glossary</span>
          </button>
        </div>

        {/* Study Mode Switcher */}
        <button
          onClick={onToggleStudyMode}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center transition-colors cursor-pointer border ${
            studyMode === 'learn'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : 'bg-indigo-50 text-indigo-800 border-indigo-300 hover:bg-indigo-100'
          }`}
          title="Toggle between Learn Mode (hints and explanations enabled) and Quiz Mode"
        >
          <span className="hidden md:inline mr-1">Mode:</span>
          <span>{studyMode === 'learn' ? 'Learn' : 'Quiz'}</span>
        </button>
      </div>
    </header>
  );
};

