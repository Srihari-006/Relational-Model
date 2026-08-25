import React, { useState } from 'react';
import { X, Copy, Check, BookOpen, Sparkles } from 'lucide-react';

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({ isOpen, onClose }) => {
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSymbol(text);
    setTimeout(() => setCopiedSymbol(null), 1500);
  };

  const symbols = [
    { sym: 'σ', name: 'Select (Sigma)', syntax: 'σ_predicate(r)', desc: 'Filters rows satisfying predicate' },
    { sym: '∏', name: 'Project (Pi)', syntax: '∏_A1,A2(r)', desc: 'Extracts columns & removes duplicate rows' },
    { sym: '×', name: 'Cartesian Product', syntax: 'r × s', desc: 'Pairs all rows (|r| × |s| tuples)' },
    { sym: '⋈', name: 'Join (Bowtie)', syntax: 'r ⋈_θ s', desc: 'Cartesian product + selection σ_θ(r × s)' },
    { sym: '∪', name: 'Union', syntax: 'r ∪ s', desc: 'Combines compatible relations (removes duplicates)' },
    { sym: '∩', name: 'Intersection', syntax: 'r ∩ s', desc: 'Tuples present in both relations' },
    { sym: '−', name: 'Set Difference', syntax: 'r − s', desc: 'Tuples in r but NOT in s' },
    { sym: 'ρ', name: 'Rename (Rho)', syntax: 'ρ_x(E)', desc: 'Assigns relation name x to expression E' },
    { sym: 'γ', name: 'Aggregate (Gamma)', syntax: 'dept_name γ_avg(salary)(r)', desc: 'Applies avg, sum, min, max, count with optional Group By' },
    { sym: '←', name: 'Assignment', syntax: 'Temp ← σ_p(r)', desc: 'Stores intermediate relation in variable' },
    { sym: '∧', name: 'Logical AND', syntax: 'cond1 ∧ cond2', desc: 'Both conditions must be TRUE' },
    { sym: '∨', name: 'Logical OR', syntax: 'cond1 ∨ cond2', desc: 'At least one condition TRUE' },
    { sym: '¬', name: 'Logical NOT', syntax: '¬(cond)', desc: 'Negates the condition' },
  ];

  const equivalenceRules = [
    {
      title: 'Selection Cascade',
      rule: 'σ_{c1 ∧ c2}(E) ≡ σ_{c1}(σ_{c2}(E))',
      desc: 'Filtering by multiple conditions combined with AND is identical to chaining selections.',
    },
    {
      title: 'Selection Commutativity',
      rule: 'σ_{c1}(σ_{c2}(E)) ≡ σ_{c2}(σ_{c1}(E))',
      desc: 'The order in which independent selections are applied does not affect the final result.',
    },
    {
      title: 'Join Definition',
      rule: 'r ⋈_θ s ≡ σ_θ(r × s)',
      desc: 'A theta join is mathematically defined as a Cartesian product followed by a selection.',
    },
    {
      title: 'Pushdown Selection Through Join',
      rule: 'σ_θ(r ⋈ s) ≡ (σ_θ(r)) ⋈ s',
      desc: 'When condition θ involves only attributes of r, filtering r before joining speeds up execution dramatically.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1e3a5f] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10 text-blue-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Relational Algebra & Notation Cheat Sheet</h2>
              <p className="text-xs text-blue-200">Chapter 2: Mathematical Operators, Syntax & Equivalence Laws</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          {/* Quick Symbol Palette */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Quick Symbols Palette (Click to copy)
              </h3>
              <span className="text-xs text-slate-500">Tap any character to copy to clipboard</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {symbols.map((s) => (
                <button
                  key={s.sym}
                  onClick={() => copyToClipboard(s.sym)}
                  className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl flex items-start justify-between text-left transition-all group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xl font-bold text-blue-900">{s.sym}</span>
                      <span className="text-xs font-semibold text-slate-700">{s.name}</span>
                    </div>
                    <code className="block text-[11px] text-slate-500 font-mono mt-1">{s.syntax}</code>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{s.desc}</p>
                  </div>
                  <div className="text-slate-400 group-hover:text-blue-600 ml-1 mt-0.5">
                    {copiedSymbol === s.sym ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Equivalence Laws */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Core Query Equivalence Laws (Slides 32–33)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {equivalenceRules.map((eq, i) => (
                <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-950">{eq.title}</span>
                    <button
                      onClick={() => copyToClipboard(eq.rule)}
                      className="text-slate-400 hover:text-blue-700 text-xs flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSymbol === eq.rule ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="my-2 p-2 bg-white rounded-lg border border-slate-200 font-mono text-xs text-blue-900 font-semibold">
                    {eq.rule}
                  </div>
                  <p className="text-xs text-slate-600">{eq.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Cheat Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
