import React, { useState } from 'react';
import { TableRow, ModuleProgress } from '../../types';
import { instructorData } from '../../data/sampleData';
import { module2Quiz } from '../../data/quizData';
import { DataTable } from '../common/DataTable';
import { QuizComponent } from '../common/QuizComponent';
import {
  Layers,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Info,
  Calendar,
  Trash2,
} from 'lucide-react';

interface Module2Props {
  studyMode: 'learn' | 'quiz';
  progress?: ModuleProgress;
  onUpdateProgress: (componentId: string, quizScore?: number) => void;
  onNextModule: () => void;
}

export const Module2SchemaInstance: React.FC<Module2Props> = ({
  studyMode,
  progress,
  onUpdateProgress,
  onNextModule,
}) => {
  // Component 1: Schema vs Instance presets
  const instancePresets: Record<string, { label: string; date: string; data: TableRow[] }> = {
    fall2017: {
      label: 'Fall 2017 Roster (12 Faculty)',
      date: 'September 2017',
      data: instructorData,
    },
    physicsOnly: {
      label: 'Physics Department Only (2 Faculty)',
      date: 'Sub-cohort',
      data: instructorData.filter((i) => i.dept_name === 'Physics'),
    },
    seniorFaculty: {
      label: 'Senior High-Salary Faculty (> $80k)',
      date: 'Budget Review Snapshot',
      data: instructorData.filter((i) => (i.salary as number) >= 80000),
    },
  };

  const [activePreset, setActivePreset] = useState<string>('fall2017');

  // Component 2: Add / Delete tuple state
  const [userTuples, setUserTuples] = useState<TableRow[]>([...instructorData]);
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('Comp. Sci.');
  const [newSalary, setNewSalary] = useState('85000');
  const [tupleError, setTupleError] = useState<string | null>(null);

  // Component 3: Timeline Slider (T0 -> T1 -> T2 -> T3)
  const timelineStages = [
    {
      time: 'T0: Initial Hiring (2015)',
      desc: 'Initial hiring of faculty with starting base salaries.',
      data: [
        { ID: '10101', name: 'Srinivasan', dept_name: 'Comp. Sci.', salary: 55000 },
        { ID: '22222', name: 'Einstein', dept_name: 'Physics', salary: 85000 },
        { ID: '12121', name: 'Wu', dept_name: 'Finance', salary: 75000 },
      ],
    },
    {
      time: 'T1: Merit Raises & Promotion (2016)',
      desc: 'All faculty receive tenure & performance salary increases.',
      data: [
        { ID: '10101', name: 'Srinivasan', dept_name: 'Comp. Sci.', salary: 65000 },
        { ID: '22222', name: 'Einstein', dept_name: 'Physics', salary: 95000 },
        { ID: '12121', name: 'Wu', dept_name: 'Finance', salary: 90000 },
      ],
    },
    {
      time: 'T2: Department Expansion (2017)',
      desc: 'New faculty recruited into Music and History departments.',
      data: [
        { ID: '10101', name: 'Srinivasan', dept_name: 'Comp. Sci.', salary: 65000 },
        { ID: '22222', name: 'Einstein', dept_name: 'Physics', salary: 95000 },
        { ID: '12121', name: 'Wu', dept_name: 'Finance', salary: 90000 },
        { ID: '15151', name: 'Mozart', dept_name: 'Music', salary: 40000 },
        { ID: '32343', name: 'El Said', dept_name: 'History', salary: 60000 },
      ],
    },
    {
      time: 'T3: Reassignment & Growth (2018)',
      desc: 'Brandt & Crick joined; additional grant budget allocations.',
      data: instructorData.slice(0, 8),
    },
  ];

  const [timeStageIdx, setTimeStageIdx] = useState(0);

  // Component 4: Matching Definitions Exercise
  const matchingTerms = [
    { id: 'schema', term: 'Database Schema', correctDefId: 'd1' },
    { id: 'instance', term: 'Database Instance', correctDefId: 'd2' },
    { id: 'relation', term: 'Relation', correctDefId: 'd3' },
    { id: 'tuple', term: 'Tuple', correctDefId: 'd4' },
    { id: 'domain', term: 'Domain', correctDefId: 'd5' },
  ];

  const matchingDefs = [
    { id: 'd1', text: 'The static logical structure and type definition of the database (e.g. instructor = (ID, name, dept_name, salary)).' },
    { id: 'd2', text: 'The dynamic snapshot of data content present in the database at a specific instant in time.' },
    { id: 'd3', text: 'A mathematical set of tuples sharing the same attribute schema.' },
    { id: 'd4', text: 'A single record or row (t ∈ r) representing one entity instance.' },
    { id: 'd5', text: 'The set of allowed / permissible atomic values for a given attribute.' },
  ];

  const [termMatches, setTermMatches] = useState<Record<string, string>>({});
  const [matchSubmitted, setMatchSubmitted] = useState(false);

  // Handlers
  const handleAddTuple = (e: React.FormEvent) => {
    e.preventDefault();
    setTupleError(null);

    if (!newId || !newName) {
      setTupleError('Please provide both ID and Name.');
      return;
    }

    if (userTuples.some((t) => t.ID === newId)) {
      setTupleError(`Primary Key violation! An instructor with ID "${newId}" already exists.`);
      return;
    }

    const sal = parseInt(newSalary, 10);
    if (isNaN(sal) || sal <= 0) {
      setTupleError('Salary must be a positive integer domain value.');
      return;
    }

    const newRow: TableRow = {
      ID: newId,
      name: newName,
      dept_name: newDept,
      salary: sal,
    };

    setUserTuples([newRow, ...userTuples]);
    setNewId('');
    setNewName('');
    onUpdateProgress('comp2');
  };

  const handleDeleteTuple = (id: string | number) => {
    setUserTuples(userTuples.filter((t) => t.ID !== id));
  };

  const handleMatchSelect = (termId: string, defId: string) => {
    setTermMatches((prev) => ({
      ...prev,
      [termId]: defId,
    }));
  };

  const handleVerifyMatching = () => {
    setMatchSubmitted(true);
    const correctCount = matchingTerms.filter((t) => termMatches[t.id] === t.correctDefId).length;
    if (correctCount === matchingTerms.length) {
      onUpdateProgress('comp4');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1e3a5f] font-mono text-xs font-bold">
            Chapter 2 · Slide 7
          </span>
          <span className="text-xs text-slate-500">5 Interactive Labs</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Database Schema vs. Database Instance
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          One of the most fundamental distinctions in database theory: the <strong>Schema</strong> is the logical
          design and structure (rarely changes), whereas the <strong>Instance</strong> is the snapshot of data
          at a given instant in time (changes continuously as tuples are inserted, updated, or removed).
        </p>
      </div>

      {/* COMPONENT 1: Side-by-Side Invariance Viewer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Schema Invariance vs. Instance Swapping (Slide 7)
              </h3>
              <p className="text-xs text-slate-500">
                Notice how the Schema on the left stays completely unchanged while the live Instance on the right changes.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
            {Object.entries(instancePresets).map(([key, item]) => (
              <button
                key={key}
                onClick={() => {
                  setActivePreset(key);
                  onUpdateProgress('comp1');
                }}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activePreset === key
                    ? 'bg-white text-blue-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Schema Card (Left) */}
          <div className="lg:col-span-4 bg-slate-900 text-white rounded-2xl p-5 flex flex-col justify-between space-y-4 border border-slate-800">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold">
                <Layers className="w-3.5 h-3.5" /> Logical Schema R
              </div>
              <h4 className="font-mono text-sm font-bold text-blue-100">
                instructor = (ID, name, dept_name, salary)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The database schema specifies the table name, column definitions, data types, and primary key constraints. It remains <strong>static</strong>.
              </p>

              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Relation Name:</span>
                  <span className="text-blue-300">instructor</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Arity (Degree):</span>
                  <span>4 Attributes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Key:</span>
                  <span className="text-amber-300 underline">ID</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl text-[11px] text-slate-400 border border-slate-700">
              🔒 <strong>Schema State: </strong> Invariant (Static definition)
            </div>
          </div>

          {/* Instance Table (Right) */}
          <div className="lg:col-span-8 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-semibold text-slate-700">
                Current Instance: <code className="font-mono text-blue-900">r(instructor)</code>
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                {instancePresets[activePreset].date}
              </span>
            </div>
            <DataTable
              title="instructor (Active Snapshot)"
              data={instancePresets[activePreset].data}
              primaryKeys={['ID']}
              pageSize={6}
            />
          </div>
        </div>
      </div>

      {/* COMPONENT 2: "Add a Tuple" Interactive Sandbox */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            2
          </span>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Live Instance Mutation: Insert / Delete Tuples
            </h3>
            <p className="text-xs text-slate-500">
              Insert a new instructor record. Observe how the instance <code className="font-mono">r(R)</code> updates in real time while the schema <code className="font-mono">R</code> remains invariant.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleAddTuple}
          className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end"
        >
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              ID (Primary Key)
            </label>
            <input
              type="text"
              placeholder="e.g. 99111"
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="e.g. Turing"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Dept Name
            </label>
            <select
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Comp. Sci.">Comp. Sci.</option>
              <option value="Physics">Physics</option>
              <option value="Finance">Finance</option>
              <option value="History">History</option>
              <option value="Music">Music</option>
              <option value="Biology">Biology</option>
              <option value="Elec. Eng.">Elec. Eng.</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Salary (USD)
            </label>
            <input
              type="number"
              value={newSalary}
              onChange={(e) => setNewSalary(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-[#1e3a5f] hover:bg-[#152a45] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Insert Tuple
          </button>
        </form>

        {tupleError && (
          <div className="p-3 bg-rose-50 border border-rose-300 text-rose-900 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{tupleError}</span>
          </div>
        )}

        <DataTable
          title="instructor (Live Mutable Instance)"
          data={userTuples}
          primaryKeys={['ID']}
          pageSize={6}
        />
      </div>

      {/* COMPONENT 3: Timeline Slider (Instance at T0 vs T1 vs T2) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            3
          </span>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Temporal Instance Evolution: Time T1 vs. T2 vs. T3
            </h3>
            <p className="text-xs text-slate-500">
              Slide through time to observe how relation instances capture dynamic historical state snapshots.
            </p>
          </div>
        </div>

        {/* Timeline Slider */}
        <div className="space-y-4 p-5 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5 text-blue-900 font-bold">
              <Clock className="w-4 h-4 text-blue-600" />
              {timelineStages[timeStageIdx].time}
            </span>
            <span className="text-slate-500">Step {timeStageIdx + 1} of {timelineStages.length}</span>
          </div>

          <input
            type="range"
            min="0"
            max={timelineStages.length - 1}
            step="1"
            value={timeStageIdx}
            onChange={(e) => {
              setTimeStageIdx(parseInt(e.target.value, 10));
              onUpdateProgress('comp3');
            }}
            className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>T0 (2015)</span>
            <span>T1 (2016)</span>
            <span>T2 (2017)</span>
            <span>T3 (2018)</span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
            <strong>Historical Context: </strong> {timelineStages[timeStageIdx].desc}
          </div>
        </div>

        <DataTable
          title={`instructor (Snapshot at ${timelineStages[timeStageIdx].time})`}
          data={timelineStages[timeStageIdx].data}
          primaryKeys={['ID']}
          pageSize={6}
        />
      </div>

      {/* COMPONENT 4: Concept Matching Exercise */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            4
          </span>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Interactive Concept Matching Exercise
            </h3>
            <p className="text-xs text-slate-500">
              Match each core relational term on the left with its precise theoretical definition on the right.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {matchingTerms.map((item) => {
            const selectedDef = termMatches[item.id];
            const isCorrect = matchSubmitted && selectedDef === item.correctDefId;
            const isWrong = matchSubmitted && selectedDef !== item.correctDefId;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  matchSubmitted
                    ? isCorrect
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-rose-50 border-rose-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="font-bold text-sm text-slate-900 min-w-[180px]">
                    {item.term}
                  </div>

                  <div className="flex-1">
                    <select
                      value={selectedDef || ''}
                      onChange={(e) => handleMatchSelect(item.id, e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="">-- Select corresponding definition --</option>
                      {matchingDefs.map((def) => (
                        <option key={def.id} value={def.id}>
                          {def.text}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {matchSubmitted && (
                  <div className="mt-2 text-xs flex items-center gap-1.5 font-medium">
                    {isCorrect ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct Match!
                      </span>
                    ) : (
                      <span className="text-rose-700 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Incorrect Definition Match.
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
            onClick={handleVerifyMatching}
            className="px-5 py-2 bg-[#1e3a5f] hover:bg-[#152a45] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Verify All Matches
          </button>
        </div>
      </div>

      {/* COMPONENT 5: Module 2 Assessment */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            5
          </span>
          <h3 className="font-bold text-lg text-slate-900">
            Module 2 Knowledge Assessment
          </h3>
        </div>

        <QuizComponent
          quizTitle="Module 2 Assessment: Schema vs. Instance"
          questions={module2Quiz}
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
          <span>Continue to Module 3: Keys & Integrity Constraints</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
