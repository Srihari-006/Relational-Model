import React, { useState, useMemo } from 'react';
import { X, Search, Bookmark, Tag } from 'lucide-react';
import { glossaryTerms } from '../../data/glossaryData';
import { GlossaryTerm } from '../../types';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Structure', 'Schema & Instance', 'Keys', 'Relational Algebra'];

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter((term: GlossaryTerm) => {
      const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
      const matchesSearch =
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (term.symbol && term.symbol.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1e3a5f] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10 text-blue-200">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Relational Model Glossary</h2>
              <p className="text-xs text-blue-200">Formal definitions, standard terminology, and examples</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts (e.g. relation, candidate key, atomic, null, sigma)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium mr-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1e3a5f] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Terms List */}
        <div className="p-6 overflow-y-auto space-y-4">
          {filteredTerms.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">No glossary terms match your search query.</p>
            </div>
          ) : (
            filteredTerms.map((term, i) => (
              <div
                key={i}
                className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl hover:border-blue-200 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{term.term}</span>
                    {term.symbol && (
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono text-xs font-bold">
                        {term.symbol}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                    {term.category}
                  </span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed mb-2">{term.definition}</p>

                {term.formalDefinition && (
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 mb-2 font-mono text-xs text-blue-950">
                    <span className="text-[10px] font-sans uppercase font-bold text-slate-400 block mb-0.5">
                      Formal Mathematical Notation
                    </span>
                    {term.formalDefinition}
                  </div>
                )}

                <div className="text-xs text-slate-600 bg-amber-50/70 border border-amber-200/60 rounded-lg p-2.5">
                  <strong className="text-amber-900 font-semibold">Example: </strong>
                  <code className="font-mono text-slate-800">{term.example}</code>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Showing {filteredTerms.length} of {glossaryTerms.length} terms</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
