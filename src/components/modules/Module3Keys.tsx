import React, { useState } from 'react';
import { TableRow, ModuleProgress } from '../../types';
import { instructorData, sectionData, courseData } from '../../data/sampleData';
import { module3Quiz } from '../../data/quizData';
import { DataTable } from '../common/DataTable';
import { QuizComponent } from '../common/QuizComponent';
import {
  Key,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Link,
  Unlink,
  Layers,
} from 'lucide-react';

interface Module3Props {
  studyMode: 'learn' | 'quiz';
  progress?: ModuleProgress;
  onUpdateProgress: (componentId: string, quizScore?: number) => void;
  onNextModule: () => void;
}

export const Module3Keys: React.FC<Module3Props> = ({
  studyMode,
  progress,
  onUpdateProgress,
  onNextModule,
}) => {
  // Component 1: Superkey Checker
  const allAttributes = ['ID', 'name', 'dept_name', 'salary'];
  const [selectedKeyAttrs, setSelectedKeyAttrs] = useState<string[]>(['ID']);

  // Check uniqueness on sample instructor data
  const checkSuperkey = (attrs: string[]) => {
    if (attrs.length === 0) {
      return { isSuperkey: false, uniqueCount: 0, totalCount: instructorData.length, duplicateGroups: [] };
    }
    const seen = new Map<string, TableRow[]>();
    instructorData.forEach((row) => {
      const keyVal = attrs.map((a) => String(row[a])).join(' | ');
      if (!seen.has(keyVal)) {
        seen.set(keyVal, []);
      }
      seen.get(keyVal)!.push(row);
    });

    const duplicates: { key: string; rows: TableRow[] }[] = [];
    seen.forEach((rows, key) => {
      if (rows.length > 1) {
        duplicates.push({ key, rows });
      }
    });

    const isSuperkey = duplicates.length === 0;
    return {
      isSuperkey,
      uniqueCount: seen.size,
      totalCount: instructorData.length,
      duplicateGroups: duplicates,
    };
  };

  const keyResult = checkSuperkey(selectedKeyAttrs);

  // Component 2: Superkey -> Candidate Key Reducer
  const [currentKeySet, setCurrentKeySet] = useState<string[]>(['ID', 'name', 'dept_name']);
  const [reductionSteps, setReductionSteps] = useState<string[]>([]);
  const isMinimal = currentKeySet.length === 1 && currentKeySet[0] === 'ID';

  const handleRemoveAttributeFromKey = (attr: string) => {
    const nextSet = currentKeySet.filter((a) => a !== attr);
    const evalNext = checkSuperkey(nextSet);

    if (evalNext.isSuperkey) {
      setCurrentKeySet(nextSet);
      setReductionSteps((prev) => [
        ...prev,
        `Removed "${attr}": Remaining set {${nextSet.join(', ')}} is still a valid superkey (unique across all 12 rows).`,
      ]);
      if (nextSet.length === 1 && nextSet[0] === 'ID') {
        onUpdateProgress('comp2');
      }
    } else {
      setReductionSteps((prev) => [
        ...prev,
        `Cannot remove "${attr}": Remaining set {${nextSet.join(', ')}} loses uniqueness and causes duplicate collisions!`,
      ]);
    }
  };

  const handleResetReducer = () => {
    setCurrentKeySet(['ID', 'name', 'dept_name']);
    setReductionSteps([]);
  };

  // Component 3: Primary Key Selection Decision Lab
  const pkCandidates = [
    {
      id: 'id_pk',
      name: '{ID}',
      reason: 'Compact, guaranteed unique 5-digit employee identifier, immutable and never changes over career.',
      isBest: true,
      feedback: 'Excellent choice! Synthetic unique IDs are compact, stable, non-null, and ideal for foreign key indexing.',
    },
    {
      id: 'name_dept',
      name: '{name, dept_name}',
      reason: 'Composite key of faculty full name and department.',
      isBest: false,
      feedback: 'Not recommended: Two instructors in the same department could share the same name (e.g. two "Smith"s in Physics), violating uniqueness in future instances.',
    },
    {
      id: 'salary_dept',
      name: '{salary, dept_name}',
      reason: 'Combination of salary amount and department name.',
      isBest: false,
      feedback: 'Poor choice: Salaries are frequently updated and multiple professors in a department can share identical salary tiers.',
    },
  ];

  const [selectedPK, setSelectedPK] = useState<string | null>(null);

  // Component 4: Foreign Key Visualizer (section -> course)
  const [isFkBroken, setIsFkBroken] = useState(false);

  const brokenSectionRow: TableRow = {
    course_id: 'MAGIC-999',
    sec_id: '1',
    semester: 'Fall',
    year: 2026,
    building: 'Hogwarts',
    room_number: '101',
    time_slot_id: 'A',
  };

  const visualSectionData = isFkBroken ? [brokenSectionRow, ...sectionData.slice(0, 4)] : sectionData.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16">
      {/* Intro Header & Explanation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1e3a5f] font-mono text-xs font-bold">
            Chapter 2 · Slide 8
          </span>
          <span className="text-xs text-slate-500 font-medium">Uniqueness & Referential Constraints</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Module 3 — Keys
        </h2>
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 text-sm leading-relaxed space-y-2">
          <p>
            This covers how to uniquely identify rows. A <strong>superkey</strong> is any set of attributes that can uniquely identify a tuple (e.g., <code className="font-mono text-xs text-blue-900 font-semibold">{`{ID, name}`}</code> works, but so does just <code className="font-mono text-xs text-blue-900 font-semibold">{`{ID}`}</code>). A <strong>candidate key</strong> is a minimal superkey — you can&apos;t remove any attribute without losing uniqueness. Out of all candidate keys, one is chosen as the <strong>primary key</strong>. A <strong>foreign key</strong> is an attribute in one table that must match a value in another table&apos;s primary key, which is how tables reference each other (the &quot;referencing&quot; and &quot;referenced&quot; relations).
          </p>
        </div>
      </div>

      {/* COMPONENT 1: Interactive Superkey Tester */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            1
          </span>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Interactive "Is it a Superkey?" Validator (Slide 8)
            </h3>
            <p className="text-xs text-slate-500">
              Select any subset of attributes from <code className="font-mono text-blue-900">instructor</code>. The engine verifies whether it uniquely identifies all 12 rows.
            </p>
          </div>
        </div>

        {/* Attribute Checkboxes */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
            Choose Key Attribute Subset K ⊆ R:
          </span>

          <div className="flex flex-wrap gap-3">
            {allAttributes.map((attr) => {
              const isChecked = selectedKeyAttrs.includes(attr);
              return (
                <label
                  key={attr}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer select-none ${
                    isChecked
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      if (isChecked) {
                        setSelectedKeyAttrs(selectedKeyAttrs.filter((a) => a !== attr));
                      } else {
                        setSelectedKeyAttrs([...selectedKeyAttrs, attr]);
                      }
                      onUpdateProgress('comp1');
                    }}
                    className="hidden"
                  />
                  <span>{isChecked ? '✓' : '+'}</span>
                  <span>{attr}</span>
                </label>
              );
            })}
          </div>

          {/* Current Evaluation Box */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
              keyResult.isSuperkey
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            {keyResult.isSuperkey ? (
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            )}

            <div className="space-y-1 text-xs">
              <div className="font-bold text-sm">
                K = &#123;{selectedKeyAttrs.join(', ') || '∅'}&#125; is {keyResult.isSuperkey ? 'a Valid Superkey! 🎉' : 'NOT a Superkey ❌'}
              </div>
              <p>
                {keyResult.isSuperkey
                  ? `Distinct combinations: ${keyResult.uniqueCount} of ${keyResult.totalCount} rows. Every tuple is uniquely identified with no duplicates.`
                  : `Collisions found! The chosen attributes yield only ${keyResult.uniqueCount} distinct values across ${keyResult.totalCount} rows, creating duplicate collisions.`}
              </p>

              {keyResult.duplicateGroups.length > 0 && (
                <div className="pt-2">
                  <span className="font-semibold block mb-1 text-rose-900">Duplicate Collisions:</span>
                  <div className="space-y-1">
                    {keyResult.duplicateGroups.slice(0, 2).map((dup, i) => (
                      <div key={i} className="p-2 bg-white/80 rounded border border-rose-200 font-mono text-[11px]">
                        Value: "{dup.key}" occurs in {dup.rows.length} rows (e.g. {dup.rows.map((r) => r.name).join(', ')})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* COMPONENT 2: Superkey -> Candidate Key Reducer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            2
          </span>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Superkey → Candidate Key Reducer (Minimality Step)
            </h3>
            <p className="text-xs text-slate-500">
              A <strong>Candidate Key</strong> is a minimal superkey. Start with a large superkey and eliminate non-essential attributes until only the minimal core remains.
            </p>
          </div>
        </div>

        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Current Key Set:</span>
              <span className="font-mono font-bold text-sm bg-blue-100 text-blue-900 px-3 py-1 rounded-lg border border-blue-300">
                &#123;{currentKeySet.join(', ')}&#125;
              </span>
            </div>

            <button
              onClick={handleResetReducer}
              className="text-xs text-slate-600 hover:text-slate-900 underline cursor-pointer"
            >
              Reset to &#123;ID, name, dept_name&#125;
            </button>
          </div>

          <div>
            <span className="text-xs text-slate-600 block mb-2 font-medium">
              Click an attribute to test if it can be removed without losing uniqueness:
            </span>
            <div className="flex flex-wrap gap-2">
              {currentKeySet.map((attr) => (
                <button
                  key={attr}
                  onClick={() => handleRemoveAttributeFromKey(attr)}
                  className="px-3 py-1.5 bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-slate-800 text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Remove {attr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reduction Log */}
          {reductionSteps.length > 0 && (
            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Minimality Step Log:</span>
              {reductionSteps.map((step, i) => (
                <p key={i} className="text-xs text-slate-700 font-mono">
                  • {step}
                </p>
              ))}
            </div>
          )}

          {isMinimal && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>Candidate Key Found: &#123;ID&#125;</strong> is strictly minimal. Removing ID leaves an empty set, so no smaller superkey exists!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* COMPONENT 3: Primary Key Selection Decision Lab */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            3
          </span>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Primary Key Selection Decision Lab (Slide 8)
            </h3>
            <p className="text-xs text-slate-500">
              A relation may have multiple candidate keys. Which one should the database architect designate as the Primary Key?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {pkCandidates.map((cand) => {
            const isSelected = selectedPK === cand.id;

            return (
              <div
                key={cand.id}
                onClick={() => {
                  setSelectedPK(cand.id);
                  onUpdateProgress('comp3');
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? cand.isBest
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300'
                      : 'bg-amber-50 border-amber-400 ring-2 ring-amber-300'
                    : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-sm text-blue-950">{cand.name}</span>
                    {isSelected && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border">
                        {cand.isBest ? 'Recommended' : 'Alternative'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{cand.reason}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 text-xs font-semibold text-blue-700">
                  {isSelected ? 'Selected' : 'Click to select as PK'}
                </div>
              </div>
            );
          })}
        </div>

        {selectedPK && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950">
            <strong>Architectural Evaluation: </strong>
            {pkCandidates.find((c) => c.id === selectedPK)?.feedback}
          </div>
        )}
      </div>

      {/* COMPONENT 4: Foreign Key & Referential Integrity Visualizer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              4
            </span>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Foreign Key Visualizer & Constraint Violation Simulator
              </h3>
              <p className="text-xs text-slate-500">
                <code className="font-mono text-blue-900">section.course_id</code> references <code className="font-mono text-blue-900">course.course_id</code>.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsFkBroken(!isFkBroken);
              onUpdateProgress('comp4');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isFkBroken
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {isFkBroken ? (
              <>
                <Unlink className="w-4 h-4" /> Restore Valid Foreign Keys
              </>
            ) : (
              <>
                <Link className="w-4 h-4" /> Simulate FK Violation (Break Constraint)
              </>
            )}
          </button>
        </div>

        {isFkBroken && (
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-950 space-y-1.5 animate-in fade-in duration-150">
            <div className="font-bold flex items-center gap-1.5 text-sm text-rose-900">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Referential Integrity Violation Detected!
            </div>
            <p>
              Row 1 in <code className="font-mono font-bold">section</code> references <code className="font-mono bg-rose-200 px-1 rounded font-bold text-rose-950">course_id = "MAGIC-999"</code>, which does NOT exist in the referenced <code className="font-mono font-bold">course</code> table.
            </p>
            <p className="text-rose-800">
              A real relational database engine (RDBMS) rejects this insertion with a <em>Foreign Key Constraint Violation</em> error.
            </p>
          </div>
        )}

        {/* Side-by-side Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DataTable
            title="section (Referencing Relation)"
            subtitle="Holds foreign key: course_id → course(course_id)"
            data={visualSectionData}
            primaryKeys={['course_id', 'sec_id', 'semester', 'year']}
            foreignKeys={[{ attribute: 'course_id', target: 'course(course_id)' }]}
            highlightPredicate={(row) => row.course_id === 'MAGIC-999'}
            pageSize={5}
          />

          <DataTable
            title="course (Referenced Relation)"
            subtitle="Holds target primary key: course_id"
            data={courseData.slice(0, 5)}
            primaryKeys={['course_id']}
            pageSize={5}
          />
        </div>
      </div>

      {/* COMPONENT 5: Module 3 Assessment */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            5
          </span>
          <h3 className="font-bold text-lg text-slate-900">
            Module 3 Knowledge Assessment
          </h3>
        </div>

        <QuizComponent
          quizTitle="Module 3 Assessment: Keys & Integrity Constraints"
          questions={module3Quiz}
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
          <span>Continue to Module 4: Schema Diagrams</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
