import React, { useState } from 'react';
import { ModuleProgress, TableRow } from '../../types';
import { instructorData } from '../../data/sampleData';
import { module5Quiz } from '../../data/quizData';
import { DataTable } from '../common/DataTable';
import { QuizComponent } from '../common/QuizComponent';
import {
  Code2,
  GitBranch,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
} from 'lucide-react';

interface Module5Props {
  studyMode: 'learn' | 'quiz';
  progress?: ModuleProgress;
  onUpdateProgress: (componentId: string, quizScore?: number) => void;
  onNextModule: () => void;
}

export const Module5QueryLanguages: React.FC<Module5Props> = ({
  studyMode,
  progress,
  onUpdateProgress,
  onNextModule,
}) => {
  // Component 1: Procedural vs Declarative Toggle
  const [paradigm, setParadigm] = useState<'procedural' | 'declarative'>('procedural');

  // Filter physics instructors
  const queryResult = instructorData
    .filter((i) => i.dept_name === 'Physics')
    .map((i) => ({ name: i.name }));

  // Component 2: Language Classification Matrix
  const initialLanguages = [
    { id: 'ra', name: 'Relational Algebra', cat: 'proc_pure' },
    { id: 'trc', name: 'Tuple Relational Calculus (TRC)', cat: 'nonproc_pure' },
    { id: 'drc', name: 'Domain Relational Calculus (DRC)', cat: 'nonproc_pure' },
    { id: 'sql', name: 'SQL (Structured Query Language)', cat: 'nonproc_comm' },
    { id: 'datalog', name: 'Datalog (Logic-based)', cat: 'nonproc_comm' },
    { id: 'qbe', name: 'QBE (Query-by-Example)', cat: 'nonproc_comm' },
  ];

  const categories = [
    { id: 'proc_pure', label: 'Procedural · Pure / Theoretical' },
    { id: 'nonproc_pure', label: 'Declarative (Non-Procedural) · Pure / Formal' },
    { id: 'nonproc_comm', label: 'Declarative (Non-Procedural) · Commercial' },
  ];

  const [userCategorization, setUserCategorization] = useState<Record<string, string>>({});
  const [matrixChecked, setMatrixChecked] = useState(false);

  // Component 3: Triangle Equivalence Explorer
  const [activeCorner, setActiveCorner] = useState<'ra' | 'trc' | 'drc'>('ra');

  // Component 4: Historical Timeline Explorer
  const timelineMilestones = [
    {
      year: '1970',
      title: 'Edgar F. Codd’s Landmark Paper',
      desc: 'Codd published "A Relational Model of Data for Large Shared Data Banks" at IBM Research, introducing relations, relational algebra, and calculus.',
    },
    {
      year: '1974',
      title: 'System R & SEQUEL Prototype',
      desc: 'IBM developed System R and designed SEQUEL (later renamed SQL) as a practical declarative language based on Codd’s relational foundations.',
    },
    {
      year: '1986',
      title: 'ANSI / ISO SQL Standardization',
      desc: 'SQL was officially standardized by ANSI and ISO, solidifying declarative queries as the worldwide industry standard for database management.',
    },
    {
      year: 'Present',
      title: 'Cost-Based Query Optimization',
      desc: 'Modern RDBMS engines accept declarative SQL, translate it internally into Relational Algebra ASTs, and optimize physical execution paths automatically.',
    },
  ];

  const [activeMilestoneIdx, setActiveMilestoneIdx] = useState(0);

  // Handlers
  const handleAssignCategory = (langId: string, catId: string) => {
    setUserCategorization((prev) => ({ ...prev, [langId]: catId }));
    setMatrixChecked(false);
  };

  const handleVerifyMatrix = () => {
    setMatrixChecked(true);
    const isAllCorrect = initialLanguages.every(
      (l) => userCategorization[l.id] === l.cat
    );
    if (isAllCorrect) {
      onUpdateProgress('comp2');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16">
      {/* Intro Header & Explanation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1e3a5f] font-mono text-xs font-bold">
            Chapter 2 · Slide 10
          </span>
          <span className="text-xs text-slate-500 font-medium">Paradigms & Equivalences</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Module 5 — Relational Query Languages
        </h2>
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 text-sm leading-relaxed space-y-2">
          <p>
            This is a short conceptual overview before diving into the real language. It distinguishes <strong>procedural languages</strong> (where you specify how to get the result, step by step — this is relational algebra) from <strong>declarative ones</strong> (where you specify what you want, not how — like relational calculus). It notes that algebra, tuple calculus, and domain calculus are all equally powerful, but the course focuses on algebra.
          </p>
        </div>
      </div>

      {/* COMPONENT 1: Procedural vs Declarative Concept Comparator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Procedural ("How") vs. Declarative ("What") Live Comparator
              </h3>
              <p className="text-xs text-slate-500">
                Goal: "Find the names of all instructors in the Physics department."
              </p>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => {
                setParadigm('procedural');
                onUpdateProgress('comp1');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                paradigm === 'procedural'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Procedural View (Relational Algebra)
            </button>
            <button
              onClick={() => {
                setParadigm('declarative');
                onUpdateProgress('comp1');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                paradigm === 'declarative'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Declarative View (SQL)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Code Representation (Left) */}
          <div className="lg:col-span-7 bg-slate-950 text-slate-100 rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-blue-400 flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                {paradigm === 'procedural' ? 'Procedural Expression & Step Pipeline' : 'Declarative SQL Specification'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {paradigm === 'procedural' ? 'Step-by-step "HOW"' : 'Target result "WHAT"'}
              </span>
            </div>

            {paradigm === 'procedural' ? (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-3 bg-blue-950/60 border border-blue-800/60 rounded-xl text-blue-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Formal Relational Algebra Expression:</span>
                  <span className="text-base font-bold">∏_{'{name}'} ( σ_{'{dept_name="Physics"}'} (instructor) )</span>
                </div>

                <div className="space-y-2 text-slate-300 text-xs">
                  <div className="font-bold text-slate-400 uppercase text-[10px]">Execution Steps Specified by User:</div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <strong className="text-blue-400">Step 1 (Select σ): </strong> Scan <code className="text-amber-300">instructor</code> table and filter rows where <code className="text-emerald-300">dept_name == "Physics"</code>.
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <strong className="text-blue-400">Step 2 (Project ∏): </strong> From filtered tuples, discard all columns except <code className="text-amber-300">name</code> and eliminate duplicates.
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-3 bg-indigo-950/60 border border-indigo-800/60 rounded-xl text-indigo-200 space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Declarative SQL Query:</span>
                  <pre className="text-sm font-bold text-emerald-300">
{`SELECT name
FROM instructor
WHERE dept_name = 'Physics';`}
                  </pre>
                </div>

                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-slate-300 text-xs leading-relaxed">
                  <strong className="text-indigo-400">Declarative Philosophy: </strong> The programmer specifies only the predicate condition and desired columns. The RDBMS Query Optimizer figures out the most efficient index scans and join algorithms automatically.
                </div>
              </div>
            )}
          </div>

          {/* Execution Result (Right) */}
          <div className="lg:col-span-5 space-y-2">
            <div className="text-xs font-semibold text-slate-700 px-1 flex items-center justify-between">
              <span>Produced Result Relation:</span>
              <span className="text-emerald-700 font-mono text-[11px]">2 tuples returned</span>
            </div>
            <DataTable
              title="Query Output (Identical Results)"
              data={queryResult}
              pageSize={5}
            />
          </div>
        </div>
      </div>

      {/* COMPONENT 2: Language Classification Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            2
          </span>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Interactive Language Classification Matrix (Slide 10)
            </h3>
            <p className="text-xs text-slate-500">
              Categorize theoretical pure languages vs. practical commercial languages by paradigm.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {initialLanguages.map((lang) => {
            const selectedCat = userCategorization[lang.id];
            const isChecked = matrixChecked;
            const isCorrect = isChecked && selectedCat === lang.cat;

            return (
              <div
                key={lang.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isChecked
                    ? isCorrect
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-rose-50 border-rose-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="font-bold text-xs text-slate-900 min-w-[200px] font-mono">
                    {lang.name}
                  </div>

                  <div className="flex-1">
                    <select
                      value={selectedCat || ''}
                      onChange={(e) => handleAssignCategory(lang.id, e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="">-- Choose Category --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {isChecked && (
                  <div className="mt-2 text-xs flex items-center gap-1 font-semibold">
                    {isCorrect ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct Classification!
                      </span>
                    ) : (
                      <span className="text-rose-700 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Incorrect category.
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleVerifyMatrix}
            className="px-5 py-2 bg-[#1e3a5f] hover:bg-[#152a45] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Verify Classifications
          </button>
        </div>
      </div>

      {/* COMPONENT 3: "Pure Languages Equivalence" Triangle Visualizer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            3
          </span>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              The "Pure" Languages Mathematical Equivalence Triangle (Slide 10)
            </h3>
            <p className="text-xs text-slate-500">
              Codd's Theorem proved that Relational Algebra, Tuple Relational Calculus, and Domain Relational Calculus have identical expressive power.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: 'ra',
              title: 'Relational Algebra',
              symbol: 'σ, ∏, ×, ∪, −, ρ',
              type: 'Procedural Foundation',
              desc: 'Six fundamental operators that construct new relations step-by-step from existing relations.',
            },
            {
              id: 'trc',
              title: 'Tuple Relational Calculus',
              symbol: '{ t | P(t) }',
              type: 'Non-Procedural (Tuple Variables)',
              desc: 'Specifies queries by stating predicates P(t) that output tuples t must satisfy.',
            },
            {
              id: 'drc',
              title: 'Domain Relational Calculus',
              symbol: '{ ⟨x₁, ..., xₙ⟩ | P(x₁, ..., xₙ) }',
              type: 'Non-Procedural (Domain Variables)',
              desc: 'Specifies queries using individual domain variable values rather than whole tuple variables.',
            },
          ].map((corner) => {
            const isSelected = activeCorner === corner.id;
            return (
              <div
                key={corner.id}
                onClick={() => {
                  setActiveCorner(corner.id as any);
                  onUpdateProgress('comp3');
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-300'
                    : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                }`}
              >
                <div>
                  <div className="font-mono text-xs font-bold text-blue-900 bg-white px-2 py-1 rounded border border-slate-200 inline-block mb-2">
                    {corner.symbol}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{corner.title}</h4>
                  <span className="text-[11px] font-medium text-blue-700 block mb-1.5">
                    {corner.type}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">{corner.desc}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 text-xs font-bold text-blue-900">
                  {isSelected ? 'Active Focus' : 'Click to inspect'}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
          <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong>Relational Completeness & Equivalence: </strong>
            Any query that can be expressed in Relational Algebra can also be expressed in TRC and DRC (and vice-versa, for safe queries). A practical language is called <em>relationally complete</em> if it is at least as expressive as Relational Algebra.
          </div>
        </div>
      </div>

      {/* COMPONENT 4: Historical Evolution Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            4
          </span>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Historical Timeline & Evolution of Relational Languages
            </h3>
            <p className="text-xs text-slate-500">
              Trace how mathematical relational algebra evolved into modern database engines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {timelineMilestones.map((m, idx) => {
            const isSelected = activeMilestoneIdx === idx;
            return (
              <div
                key={idx}
                onClick={() => {
                  setActiveMilestoneIdx(idx);
                  onUpdateProgress('comp4');
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-xs'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`font-mono text-xs font-bold ${isSelected ? 'text-blue-300' : 'text-blue-800'}`}>
                  {m.year}
                </div>
                <div className="font-bold text-xs mt-1">{m.title}</div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1">
          <div className="font-bold text-sm text-slate-900">
            {timelineMilestones[activeMilestoneIdx].year}: {timelineMilestones[activeMilestoneIdx].title}
          </div>
          <p className="leading-relaxed">{timelineMilestones[activeMilestoneIdx].desc}</p>
        </div>
      </div>

      {/* COMPONENT 5: Module 5 Assessment */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            5
          </span>
          <h3 className="font-bold text-lg text-slate-900">
            Module 5 Knowledge Assessment
          </h3>
        </div>

        <QuizComponent
          quizTitle="Module 5 Assessment: Relational Query Languages"
          questions={module5Quiz}
          studyMode={studyMode}
          onComplete={(score, total) => {
            const pct = Math.round((score / total) * 100);
            onUpdateProgress('quiz', pct);
          }}
        />
      </div>

      {/* Next Module Navigation */}
      <div className="pt-6 border-t border-slate-200 flex justify-end">
        <button
          onClick={onNextModule}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <span>Continue to Module 6: Live Relational Algebra Engine</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
