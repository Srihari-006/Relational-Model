import React, { useState } from 'react';
import { TableRow, ModuleProgress } from '../../types';
import { instructorData } from '../../data/sampleData';
import { module1Quiz } from '../../data/quizData';
import { DataTable } from '../common/DataTable';
import { QuizComponent } from '../common/QuizComponent';
import {
  Shuffle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface Module1Props {
  studyMode: 'learn' | 'quiz';
  progress?: ModuleProgress;
  onUpdateProgress: (componentId: string, quizScore?: number) => void;
  onNextModule: () => void;
}

export const Module1Structure: React.FC<Module1Props> = ({
  studyMode,
  progress,
  onUpdateProgress,
  onNextModule,
}) => {
  // Component 1: Hover inspector state
  const [inspectedPart, setInspectedPart] = useState<'relation' | 'attribute' | 'tuple' | 'cell' | 'null' | null>(null);

  // Component 2: Build a Relation Schema state
  const availableSlots = ['salary', 'building', 'ID', 'credits', 'name', 'dept_name', 'grade'];
  const [selectedSchemaAttrs, setSelectedSchemaAttrs] = useState<string[]>([]);
  const [schemaValidation, setSchemaValidation] = useState<'idle' | 'valid' | 'invalid'>('idle');

  // Component 3: Shuffle the rows demo
  const [shuffledData, setShuffledData] = useState<TableRow[]>([...instructorData]);
  const [shuffleCount, setShuffleCount] = useState(0);

  // Component 4: Domain & Atomicity Checker
  const domainChallenges = [
    {
      attr: 'salary',
      domain: 'Positive numeric currency (USD integer)',
      value: '"ninety thousand"',
      isAtomic: true,
      isValidDomain: false,
      explanation: 'While "ninety thousand" is technically a single string, the declared domain for salary requires numeric integer values, making this an invalid domain type.',
    },
    {
      attr: 'salary',
      domain: 'Positive numeric currency (USD integer)',
      value: '95000',
      isAtomic: true,
      isValidDomain: true,
      explanation: 'Valid! 95000 is an atomic, positive numeric value satisfying the salary domain.',
    },
    {
      attr: 'dept_name',
      domain: 'Department name string',
      value: '["Physics", "Comp. Sci."]',
      isAtomic: false,
      isValidDomain: false,
      explanation: 'Non-atomic! Storing a list/array of multiple departments in a single cell violates 1NF (First Normal Form) atomicity.',
    },
    {
      attr: 'name',
      domain: 'Instructor name string',
      value: 'null',
      isAtomic: true,
      isValidDomain: true,
      explanation: 'Special value null is a member of every domain, indicating an unknown, missing, or unspecified value.',
    },
    {
      attr: 'ID',
      domain: '5-character unique string',
      value: '22222',
      isAtomic: true,
      isValidDomain: true,
      explanation: 'Valid atomic 5-character string representing an instructor identification number.',
    },
  ];

  const [domainAnswers, setDomainAnswers] = useState<Record<number, { atomic: boolean; valid: boolean }>>({});
  const [domainChecked, setDomainChecked] = useState<Record<number, boolean>>({});

  // Handlers
  const handleToggleAttr = (attr: string) => {
    if (selectedSchemaAttrs.includes(attr)) {
      setSelectedSchemaAttrs(selectedSchemaAttrs.filter((a) => a !== attr));
    } else {
      setSelectedSchemaAttrs([...selectedSchemaAttrs, attr]);
    }
    setSchemaValidation('idle');
  };

  const handleValidateSchema = () => {
    const required = ['ID', 'name', 'dept_name', 'salary'];
    const isExact =
      selectedSchemaAttrs.length === required.length &&
      required.every((r) => selectedSchemaAttrs.includes(r));

    if (isExact) {
      setSchemaValidation('valid');
      onUpdateProgress('comp2');
    } else {
      setSchemaValidation('invalid');
    }
  };

  const handleShuffle = () => {
    const arr = [...shuffledData];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffledData(arr);
    setShuffleCount((c) => c + 1);
    onUpdateProgress('comp3');
  };

  const handleDomainSelect = (idx: number, type: 'atomic' | 'valid', value: boolean) => {
    setDomainAnswers((prev) => ({
      ...prev,
      [idx]: {
        ...(prev[idx] || { atomic: true, valid: true }),
        [type]: value,
      },
    }));
  };

  const handleVerifyDomain = (idx: number) => {
    setDomainChecked((prev) => ({ ...prev, [idx]: true }));
    onUpdateProgress('comp4');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1e3a5f] font-mono text-xs font-bold">
            Chapter 2 · Slides 3–6
          </span>
          <span className="text-xs text-slate-500">5 Interactive Labs</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Structure of Relational Databases
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          The relational model represents data as a collection of relations (tables). Each relation consists of a
          schema defining its attributes (columns) and an instance consisting of a set of unordered tuples (rows).
        </p>
      </div>

      {/* COMPONENT 1: Interactive Labeled Diagram of Instructor Relation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-base text-slate-900">
                Interactive Labeled Structure of <code className="font-mono text-blue-900">instructor</code>
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Hover over or click the highlighted markers to inspect the formal relational definitions (Slide 3).
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'relation', label: 'Relation (Table)' },
              { id: 'attribute', label: 'Attributes (Columns)' },
              { id: 'tuple', label: 'Tuples (Rows)' },
              { id: 'cell', label: 'Atomic Value' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setInspectedPart(btn.id as any)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  inspectedPart === btn.id
                    ? 'bg-[#1e3a5f] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Explanation Callout */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div>
            {inspectedPart === 'relation' && (
              <p>
                <strong>Relation (Table): </strong> A mathematical set of tuples. In this example, <code className="font-bold">instructor</code> is a relation with degree (arity) = 4 and cardinality = 12.
              </p>
            )}
            {inspectedPart === 'attribute' && (
              <p>
                <strong>Attributes (Columns): </strong> Named dimensions <code className="font-bold">ID, name, dept_name, salary</code> representing properties of the entity. The list of attributes forms the schema.
              </p>
            )}
            {inspectedPart === 'tuple' && (
              <p>
                <strong>Tuple (Row): </strong> An individual element <code className="font-bold">t ∈ r</code> representing a single instructor entity record (e.g. Einstein, Physics, 95000).
              </p>
            )}
            {inspectedPart === 'cell' && (
              <p>
                <strong>Atomic Value: </strong> Every cell must contain an indivisible atomic element from the attribute’s domain.
              </p>
            )}
            {!inspectedPart && (
              <p>
                Hover over the table columns or rows below, or click any inspector button above to explore its formal role in relational theory.
              </p>
            )}
          </div>
        </div>

        {/* Visual Table */}
        <div className="relative border-2 border-dashed border-blue-300 rounded-xl p-2 bg-slate-50/50">
          <div className="absolute -top-3 left-4 bg-blue-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
            Relation: instructor
          </div>

          <DataTable
            data={instructorData.slice(0, 6)}
            title="instructor"
            primaryKeys={['ID']}
            pageSize={6}
            showMetrics={true}
          />
        </div>
      </div>

      {/* COMPONENT 2: Build a Relation Schema Interactive */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            2
          </span>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Interactive Schema Builder: <code className="font-mono text-blue-900">instructor = (A₁, A₂, ..., Aₙ)</code>
            </h3>
            <p className="text-xs text-slate-500">
              Construct the official schema for the <code className="font-mono">instructor</code> relation by selecting its exact attributes (Slide 4).
            </p>
          </div>
        </div>

        {/* Canvas Display */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-base text-slate-900">instructor = (</span>
            {selectedSchemaAttrs.length === 0 ? (
              <span className="text-slate-400 italic text-xs font-mono px-3 py-1 bg-white border border-dashed border-slate-300 rounded-lg">
                Click attributes below to add to schema...
              </span>
            ) : (
              selectedSchemaAttrs.map((attr, i) => (
                <span
                  key={attr}
                  onClick={() => handleToggleAttr(attr)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-100 text-blue-900 font-mono text-xs font-bold border border-blue-300 cursor-pointer hover:bg-rose-100 hover:text-rose-900 hover:border-rose-300 transition-colors"
                  title="Click to remove"
                >
                  {attr}
                  {i < selectedSchemaAttrs.length - 1 && <span className="text-slate-400">,</span>}
                </span>
              ))
            )}
            <span className="font-mono font-bold text-base text-slate-900">)</span>
          </div>

          {/* Palette of available attributes */}
          <div>
            <span className="text-xs font-semibold text-slate-600 block mb-2">
              Available candidate attributes:
            </span>
            <div className="flex flex-wrap gap-2">
              {availableSlots.map((attr) => {
                const isSelected = selectedSchemaAttrs.includes(attr);
                return (
                  <button
                    key={attr}
                    onClick={() => handleToggleAttr(attr)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {attr}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleValidateSchema}
              className="px-4 py-2 bg-[#1e3a5f] hover:bg-[#152a45] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Validate Schema Definition
            </button>

            {schemaValidation === 'valid' && (
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Correct! instructor = (ID, name, dept_name, salary)
              </span>
            )}
            {schemaValidation === 'invalid' && (
              <span className="text-xs text-rose-700 bg-rose-50 border border-rose-300 px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                Incorrect schema! Check which 4 attributes belong to instructor.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* COMPONENT 3: Shuffle the Rows Demo ("Relations are Unordered") */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Live Demonstration: "Relations are Unordered" (Slide 6)
              </h3>
              <p className="text-xs text-slate-500">
                In relational algebra and set theory, order of tuples is completely irrelevant.
              </p>
            </div>
          </div>

          <button
            onClick={handleShuffle}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <Shuffle className="w-4 h-4 text-indigo-600" />
            Shuffle Tuples ({shuffleCount} times)
          </button>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-2">
          <p>
            <strong>Mathematical Principle: </strong> Because a relation instance <code className="font-bold">r(R)</code> is defined as a mathematical <strong>set</strong> of tuples, no row has a permanent index or intrinsic sequence.
          </p>
        </div>

        <DataTable
          title="instructor (Arbitrary Order Snapshot)"
          data={shuffledData}
          primaryKeys={['ID']}
          pageSize={6}
        />
      </div>

      {/* COMPONENT 4: Domain & Atomicity Judge */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            4
          </span>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Domain & Atomicity Evaluation Lab (Slide 5)
            </h3>
            <p className="text-xs text-slate-500">
              Evaluate whether each candidate value satisfies the attribute's domain type and atomicity rules.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {domainChallenges.map((ch, idx) => {
            const ans = domainAnswers[idx] || { atomic: true, valid: true };
            const isChecked = domainChecked[idx];
            const isCorrect = isChecked && ans.atomic === ch.isAtomic && ans.valid === ch.isValidDomain;

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  isChecked
                    ? isCorrect
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-rose-50/70 border-rose-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-bold text-blue-900">{ch.attr}</span>
                      <span className="text-slate-400">→ Domain: {ch.domain}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      Candidate Value: <code className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-purple-900">{ch.value}</code>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <div className="flex items-center bg-white rounded-lg border border-slate-300 p-1 text-xs">
                      <button
                        onClick={() => handleDomainSelect(idx, 'atomic', true)}
                        className={`px-2.5 py-1 rounded font-medium ${
                          ans.atomic ? 'bg-blue-600 text-white' : 'text-slate-600'
                        }`}
                      >
                        Atomic
                      </button>
                      <button
                        onClick={() => handleDomainSelect(idx, 'atomic', false)}
                        className={`px-2.5 py-1 rounded font-medium ${
                          !ans.atomic ? 'bg-blue-600 text-white' : 'text-slate-600'
                        }`}
                      >
                        Non-Atomic
                      </button>
                    </div>

                    <div className="flex items-center bg-white rounded-lg border border-slate-300 p-1 text-xs">
                      <button
                        onClick={() => handleDomainSelect(idx, 'valid', true)}
                        className={`px-2.5 py-1 rounded font-medium ${
                          ans.valid ? 'bg-emerald-600 text-white' : 'text-slate-600'
                        }`}
                      >
                        Valid Domain
                      </button>
                      <button
                        onClick={() => handleDomainSelect(idx, 'valid', false)}
                        className={`px-2.5 py-1 rounded font-medium ${
                          !ans.valid ? 'bg-rose-600 text-white' : 'text-slate-600'
                        }`}
                      >
                        Invalid Domain
                      </button>
                    </div>

                    <button
                      onClick={() => handleVerifyDomain(idx)}
                      className="px-3 py-1.5 bg-[#1e3a5f] hover:bg-[#152a45] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Check
                    </button>
                  </div>
                </div>

                {isChecked && (
                  <div className="mt-3 pt-2 border-t border-slate-200/80 text-xs leading-relaxed text-slate-700">
                    <div className="flex items-center gap-1 font-bold mb-1">
                      {isCorrect ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct Assessment!
                        </span>
                      ) : (
                        <span className="text-rose-700 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Incorrect Classification.
                        </span>
                      )}
                    </div>
                    <p>{ch.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* COMPONENT 5: Module 1 Mini-Quiz */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            5
          </span>
          <h3 className="font-bold text-lg text-slate-900">
            Module 1 Knowledge Assessment
          </h3>
        </div>

        <QuizComponent
          quizTitle="Module 1 Assessment: Relational Structure & Atomicity"
          questions={module1Quiz}
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
          className="px-6 py-3 bg-[#1e3a5f] hover:bg-[#152a45] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <span>Continue to Module 2: Schema vs. Instance</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
