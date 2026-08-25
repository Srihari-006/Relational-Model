import React, { useState } from 'react';
import { ModuleProgress, RelationalQueryResult, TableRow } from '../../types';
import { sampleDatabase } from '../../data/sampleData';
import { relationalAlgebraEngine } from '../../utils/relationalAlgebra';
import { module6Quiz } from '../../data/quizData';
import { DataTable } from '../common/DataTable';
import { QuizComponent } from '../common/QuizComponent';
import {
  Cpu,
  Filter,
  Columns,
  X,
  GitMerge,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Calculator,
  Terminal,
  Bookmark,
  BookOpen,
} from 'lucide-react';

interface Module6Props {
  studyMode: 'learn' | 'quiz';
  progress?: ModuleProgress;
  onUpdateProgress: (componentId: string, quizScore?: number) => void;
  onNextModule: () => void;
}

export const Module6RelationalAlgebra: React.FC<Module6Props> = ({
  studyMode,
  progress,
  onUpdateProgress,
  onNextModule,
}) => {
  // Operation Sub-tabs (A - H) + Assessment
  const [activeTab, setActiveTab] = useState<
    'select' | 'project' | 'cartesian' | 'join' | 'setops' | 'rename' | 'extended' | 'challenges' | 'quiz'
  >('select');

  // === 6A: SELECT (σ) STATE ===
  const [selectRelation, setSelectRelation] = useState<string>('instructor');
  const [selectAttr, setSelectAttr] = useState<string>('dept_name');
  const [selectOp, setSelectOp] = useState<'=' | '!=' | '>' | '<' | '>=' | '<='>('=');
  const [selectVal, setSelectVal] = useState<string>('Physics');
  const [selectCombinedCond, setSelectCombinedCond] = useState<string>('none'); // none | and_salary | or_dept
  const [selectResult, setSelectResult] = useState<RelationalQueryResult | null>(null);

  // === 6B: PROJECT (∏) STATE ===
  const [projectRelation, setProjectRelation] = useState<string>('instructor');
  const [selectedProjAttrs, setSelectedProjAttrs] = useState<string[]>(['ID', 'name', 'salary']);
  const [projectResult, setProjectResult] = useState<RelationalQueryResult | null>(null);

  // === 6C: CARTESIAN PRODUCT (×) STATE ===
  const [cartRel1, setCartRel1] = useState<string>('instructor');
  const [cartRel2, setCartRel2] = useState<string>('teaches');
  const [cartResult, setCartResult] = useState<RelationalQueryResult | null>(null);

  // === 6D: JOIN (⋈) STATE ===
  const [joinType, setJoinType] = useState<'natural' | 'theta'>('natural');
  const [joinRel1, setJoinRel1] = useState<string>('instructor');
  const [joinRel2, setJoinRel2] = useState<string>('teaches');
  const [thetaCond, setThetaCond] = useState<string>('instructor.ID = teaches.ID');
  const [joinResult, setJoinResult] = useState<RelationalQueryResult | null>(null);

  // === 6E: SET OPERATIONS (∪, ∩, −) STATE ===
  const [setOpType, setSetOpType] = useState<'union' | 'intersect' | 'difference'>('union');
  const [setOpResult, setSetOpResult] = useState<RelationalQueryResult | null>(null);

  // === 6F: RENAME (ρ) STATE ===
  const [renameOrigRel, setRenameOrigRel] = useState<string>('instructor');
  const [renameNewName, setRenameNewName] = useState<string>('faculty');
  const [renameResult, setRenameResult] = useState<RelationalQueryResult | null>(null);

  // === 6G: EXTENDED AGGREGATE (γ / G) STATE ===
  const [aggGroupAttr, setAggGroupAttr] = useState<string>('dept_name');
  const [aggFunc, setAggFunc] = useState<'avg' | 'sum' | 'count' | 'min' | 'max'>('avg');
  const [aggTargetAttr, setAggTargetAttr] = useState<string>('salary');
  const [aggResult, setAggResult] = useState<RelationalQueryResult | null>(null);

  // === 6H: MULTI-STEP QUERY CHALLENGES ===
  const queryChallenges = [
    {
      id: 'q1',
      title: 'Query 1: High-Earning Comp Sci Instructors',
      task: 'Find instructors in "Comp. Sci." with salary > 70000',
      formula: 'σ_{dept_name="Comp. Sci." ∧ salary > 70000}(instructor)',
      expectedCount: 2,
      hint: 'Apply Select on instructor with department = Comp. Sci. and salary > 70000.',
    },
    {
      id: 'q2',
      title: 'Query 2: Names of Physics Instructors',
      task: 'Find ONLY the names of all instructors in the Physics department',
      formula: '∏_{name}(σ_{dept_name="Physics"}(instructor))',
      expectedCount: 2,
      hint: 'First select Physics instructors, then project onto the name attribute.',
    },
    {
      id: 'q3',
      title: 'Query 3: Instructors and Courses They Teach',
      task: 'Find instructor names along with the course IDs they teach',
      formula: '∏_{name, course_id}(instructor ⋈ teaches)',
      expectedCount: 14,
      hint: 'Perform a natural join of instructor and teaches on ID, then project name and course_id.',
    },
    {
      id: 'q4',
      title: 'Query 4: Spring 2018 Courses in Watson Building',
      task: 'Find course IDs of courses taught in Spring 2018 in the "Watson" building',
      formula: '∏_{course_id}(σ_{semester="Spring" ∧ year=2018 ∧ building="Watson"}(section))',
      expectedCount: 1,
      hint: 'Filter section for semester=Spring, year=2018, building=Watson, then project course_id.',
    },
  ];

  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [challengeResult, setChallengeResult] = useState<RelationalQueryResult | null>(null);

  // ===== EXECUTION HANDLERS =====

  const handleRunSelect = () => {
    let predicate = '';
    if (selectCombinedCond === 'none') {
      const isNum = !isNaN(Number(selectVal)) && selectVal.trim() !== '';
      const formattedVal = isNum ? selectVal : `'${selectVal}'`;
      predicate = `${selectAttr} ${selectOp} ${formattedVal}`;
    } else if (selectCombinedCond === 'and_salary') {
      predicate = `dept_name = 'Physics' and salary > 90000`;
    } else if (selectCombinedCond === 'or_dept') {
      predicate = `dept_name = 'Physics' or dept_name = 'Music'`;
    }

    const res = relationalAlgebraEngine.select(selectRelation, predicate);
    setSelectResult(res);
    onUpdateProgress('tabA');
  };

  const handleRunProject = () => {
    const res = relationalAlgebraEngine.project(projectRelation, selectedProjAttrs);
    setProjectResult(res);
    onUpdateProgress('tabB');
  };

  const handleRunCartesian = () => {
    const res = relationalAlgebraEngine.cartesianProduct(cartRel1, cartRel2);
    setCartResult(res);
    onUpdateProgress('tabC');
  };

  const handleRunJoin = () => {
    let res: RelationalQueryResult;
    if (joinType === 'natural') {
      res = relationalAlgebraEngine.naturalJoin(joinRel1, joinRel2);
    } else {
      res = relationalAlgebraEngine.join(joinRel1, joinRel2, thetaCond);
    }
    setJoinResult(res);
    onUpdateProgress('tabD');
  };

  const handleRunSetOp = () => {
    // We construct two compatible sub-relations:
    // R1: Courses taught in Fall 2017 -> ∏_{course_id}(σ_{semester='Fall' ∧ year=2017}(section))
    // R2: Courses taught in Spring 2018 -> ∏_{course_id}(σ_{semester='Spring' ∧ year=2018}(section))
    const r1 = relationalAlgebraEngine.project(
      relationalAlgebraEngine.select('section', "semester = 'Fall' and year = 2017").rows,
      ['course_id']
    );
    const r2 = relationalAlgebraEngine.project(
      relationalAlgebraEngine.select('section', "semester = 'Spring' and year = 2018").rows,
      ['course_id']
    );

    let res: RelationalQueryResult;
    if (setOpType === 'union') {
      res = relationalAlgebraEngine.union(r1.rows, r2.rows, 'Fall_2017_Courses', 'Spring_2018_Courses');
    } else if (setOpType === 'intersect') {
      res = relationalAlgebraEngine.intersect(r1.rows, r2.rows, 'Fall_2017_Courses', 'Spring_2018_Courses');
    } else {
      res = relationalAlgebraEngine.difference(r1.rows, r2.rows, 'Fall_2017_Courses', 'Spring_2018_Courses');
    }
    setSetOpResult(res);
    onUpdateProgress('tabE');
  };

  const handleRunRename = () => {
    const res = relationalAlgebraEngine.rename(renameOrigRel, renameNewName);
    setRenameResult(res);
    onUpdateProgress('tabF');
  };

  const handleRunAggregate = () => {
    const res = relationalAlgebraEngine.aggregate(
      'instructor',
      aggGroupAttr ? [aggGroupAttr] : [],
      aggFunc,
      aggTargetAttr
    );
    setAggResult(res);
    onUpdateProgress('tabG');
  };

  const handleRunChallenge = (idx: number) => {
    let res: RelationalQueryResult;
    if (idx === 0) {
      res = relationalAlgebraEngine.select('instructor', "dept_name = 'Comp. Sci.' and salary > 70000");
    } else if (idx === 1) {
      const filtered = relationalAlgebraEngine.select('instructor', "dept_name = 'Physics'");
      res = relationalAlgebraEngine.project(filtered.rows, ['name']);
    } else if (idx === 2) {
      const joined = relationalAlgebraEngine.naturalJoin('instructor', 'teaches');
      res = relationalAlgebraEngine.project(joined.rows, ['name', 'course_id']);
    } else {
      const filtered = relationalAlgebraEngine.select('section', "semester = 'Spring' and year = 2018 and building = 'Watson'");
      res = relationalAlgebraEngine.project(filtered.rows, ['course_id']);
    }
    setChallengeResult(res);
    onUpdateProgress('tabH');
  };

  // Helper for toggle project attributes
  const handleToggleProjAttr = (attr: string) => {
    if (selectedProjAttrs.includes(attr)) {
      if (selectedProjAttrs.length > 1) {
        setSelectedProjAttrs(selectedProjAttrs.filter((a) => a !== attr));
      }
    } else {
      setSelectedProjAttrs([...selectedProjAttrs, attr]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#0f243d] rounded-2xl p-6 text-white shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-xs font-bold border border-amber-400/30">
              Module 6 · Complete Query Engine
            </span>
            <span className="text-xs text-blue-200">Chapter 2 · Slides 11–24</span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          The Relational Algebra Interactive Engine
        </h2>
        <p className="text-sm text-blue-100/90 leading-relaxed max-w-3xl">
          Execute real relational algebra operations step-by-step against the University Database.
          Inspect resulting relations, degrees, cardinalities, predicate expressions, and equivalences in real-time.
        </p>

        {/* Sub-Tabs Nav */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/15">
          {[
            { id: 'select', label: 'σ Select', symbol: 'σ' },
            { id: 'project', label: '∏ Project', symbol: '∏' },
            { id: 'cartesian', label: '× Cartesian', symbol: '×' },
            { id: 'join', label: '⋈ Join', symbol: '⋈' },
            { id: 'setops', label: '∪ ∩ − Sets', symbol: '∪' },
            { id: 'rename', label: 'ρ Rename', symbol: 'ρ' },
            { id: 'extended', label: 'γ Aggregate', symbol: 'γ' },
            { id: 'challenges', label: 'Step Challenges', symbol: '🎯' },
            { id: 'quiz', label: 'Module Quiz', symbol: '📝' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6A: SELECT OPERATOR (σ) */}
      {/* ========================================================================= */}
      {activeTab === 'select' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-mono font-bold text-base flex items-center justify-center">
                σ
              </span>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Select Operation: <code className="font-mono text-blue-900">σ_p(r)</code> (Slides 12–13)
                </h3>
                <p className="text-xs text-slate-500">
                  Selects tuples that satisfy a given predicate predicate <em>p</em>. Acts as a horizontal filter.
                </p>
              </div>
            </div>

            {/* Builder Form */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Relation (r)
                  </label>
                  <select
                    value={selectRelation}
                    onChange={(e) => setSelectRelation(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  >
                    {Object.keys(sampleDatabase).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Attribute
                  </label>
                  <select
                    value={selectAttr}
                    onChange={(e) => setSelectAttr(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  >
                    <option value="dept_name">dept_name</option>
                    <option value="salary">salary</option>
                    <option value="name">name</option>
                    <option value="ID">ID</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Comparison Operator
                  </label>
                  <select
                    value={selectOp}
                    onChange={(e) => setSelectOp(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  >
                    <option value="=">=</option>
                    <option value="!=">≠ (!=)</option>
                    <option value=">">&gt;</option>
                    <option value="<">&lt;</option>
                    <option value=">=">≥</option>
                    <option value="<=">≤</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Literal Value
                  </label>
                  <input
                    type="text"
                    value={selectVal}
                    onChange={(e) => setSelectVal(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              {/* Complex Combined Predicate Toggle */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-xs font-semibold text-slate-600 block mb-2">
                  Slide 13 Complex Predicates (∧, ∨, ¬):
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'none', label: 'Single Condition' },
                    { id: 'and_salary', label: 'σ_{dept_name="Physics" ∧ salary > 90000}(instructor)' },
                    { id: 'or_dept', label: 'σ_{dept_name="Physics" ∨ dept_name="Music"}(instructor)' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectCombinedCond(preset.id)}
                      className={`text-xs px-3 py-1 rounded-lg font-mono border transition-colors cursor-pointer ${
                        selectCombinedCond === preset.id
                          ? 'bg-[#1e3a5f] text-white border-[#1e3a5f] font-bold'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleRunSelect}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" /> Execute σ Query
                </button>
              </div>
            </div>

            {/* Query Result Output */}
            {selectResult && (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-slate-900 text-blue-300 font-mono text-xs rounded-xl flex items-center justify-between border border-slate-800">
                  <span className="font-bold">Result Relation: {selectResult.expression}</span>
                  <span className="text-slate-400 text-[11px]">
                    Cardinality: {selectResult.cardinality} | Degree: {selectResult.degree}
                  </span>
                </div>

                <DataTable
                  title={selectResult.expression}
                  data={selectResult.rows}
                  columns={selectResult.columns}
                  pageSize={6}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6B: PROJECT OPERATOR (∏) */}
      {/* ========================================================================= */}
      {activeTab === 'project' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-mono font-bold text-base flex items-center justify-center">
                ∏
              </span>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Project Operation: <code className="font-mono text-blue-900">∏_&#123;A₁, ..., A_k&#125;(r)</code> (Slides 14–15)
                </h3>
                <p className="text-xs text-slate-500">
                  Selects specified columns and discards all others. <strong>Crucial rule: </strong> automatically eliminates duplicate rows!
                </p>
              </div>
            </div>

            {/* Builder Form */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Target Relation:</span>
                  <select
                    value={projectRelation}
                    onChange={(e) => {
                      setProjectRelation(e.target.value);
                      setSelectedProjAttrs(['ID', 'name']);
                    }}
                    className="p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  >
                    {Object.keys(sampleDatabase).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-xs text-slate-500">
                  Click attributes below to toggle inclusion in projection list ∏
                </div>
              </div>

              {/* Checkboxes */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2 uppercase">
                  Select Projection Attributes (A₁, A₂, ...):
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.keys((sampleDatabase as any)[projectRelation][0] || {}).map((attr) => {
                    const isSelected = selectedProjAttrs.includes(attr);
                    return (
                      <button
                        key={attr}
                        onClick={() => handleToggleProjAttr(attr)}
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

              <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-950">
                <strong>Slide 15 Duplicate Elimination Notice: </strong> If you project only <code className="font-bold font-mono">dept_name</code> from <code className="font-bold font-mono">instructor</code>, all 12 rows collapse into just 7 distinct department tuples.
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleRunProject}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" /> Execute ∏ Query
                </button>
              </div>
            </div>

            {/* Query Result Output */}
            {projectResult && (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-slate-900 text-blue-300 font-mono text-xs rounded-xl flex items-center justify-between border border-slate-800">
                  <span className="font-bold">Result Relation: {projectResult.expression}</span>
                  <span className="text-slate-400 text-[11px]">
                    Cardinality: {projectResult.cardinality} tuples | Degree: {projectResult.degree} columns
                  </span>
                </div>

                <DataTable
                  title={projectResult.expression}
                  data={projectResult.rows}
                  columns={projectResult.columns}
                  pageSize={6}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6C: CARTESIAN PRODUCT (×) */}
      {/* ========================================================================= */}
      {activeTab === 'cartesian' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-mono font-bold text-base flex items-center justify-center">
                ×
              </span>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Cartesian-Product Operation: <code className="font-mono text-blue-900">r₁ × r₂</code> (Slides 17–18)
                </h3>
                <p className="text-xs text-slate-500">
                  Combines every tuple of relation 1 with every tuple of relation 2. Degree = d₁ + d₂, Cardinality = c₁ × c₂.
                </p>
              </div>
            </div>

            {/* Builder Form */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Relation 1 (r₁)
                  </label>
                  <select
                    value={cartRel1}
                    onChange={(e) => setCartRel1(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  >
                    <option value="instructor">instructor (12 tuples, 4 attrs)</option>
                    <option value="department">department (7 tuples, 3 attrs)</option>
                    <option value="course">course (13 tuples, 4 attrs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Relation 2 (r₂)
                  </label>
                  <select
                    value={cartRel2}
                    onChange={(e) => setCartRel2(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  >
                    <option value="teaches">teaches (15 tuples, 5 attrs)</option>
                    <option value="section">section (15 tuples, 7 attrs)</option>
                    <option value="student">student (13 tuples, 4 attrs)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleRunCartesian}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" /> Compute Cartesian Product
                </button>
              </div>
            </div>

            {/* Query Result Output */}
            {cartResult && (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-slate-900 text-blue-300 font-mono text-xs rounded-xl flex items-center justify-between border border-slate-800">
                  <span className="font-bold">Result Relation: {cartResult.expression}</span>
                  <span className="text-emerald-400 font-bold text-[11px]">
                    Size: {cartResult.cardinality} rows ({cartResult.degree} cols)
                  </span>
                </div>

                <DataTable
                  title={cartResult.expression}
                  data={cartResult.rows}
                  columns={cartResult.columns}
                  pageSize={6}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6D: JOIN OPERATORS (⋈) */}
      {/* ========================================================================= */}
      {activeTab === 'join' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-mono font-bold text-base flex items-center justify-center">
                ⋈
              </span>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Natural Join (⋈) & Theta Join (⋈_θ) (Slides 19–20)
                </h3>
                <p className="text-xs text-slate-500">
                  Combines related tuples from two tables. Natural Join matches on all identically named attributes and drops duplicate columns.
                </p>
              </div>
            </div>

            {/* Builder Form */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setJoinType('natural')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    joinType === 'natural'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Natural Join (instructor ⋈ teaches)
                </button>
                <button
                  onClick={() => setJoinType('theta')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    joinType === 'theta'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Theta Join (instructor ⋈_&#123;θ&#125; teaches)
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Left Relation
                  </label>
                  <select
                    value={joinRel1}
                    onChange={(e) => setJoinRel1(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  >
                    <option value="instructor">instructor</option>
                    <option value="course">course</option>
                    <option value="student">student</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Right Relation
                  </label>
                  <select
                    value={joinRel2}
                    onChange={(e) => setJoinRel2(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  >
                    <option value="teaches">teaches</option>
                    <option value="section">section</option>
                    <option value="department">department</option>
                  </select>
                </div>
              </div>

              {joinType === 'theta' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Join Condition Predicate (θ)
                  </label>
                  <input
                    type="text"
                    value={thetaCond}
                    onChange={(e) => setThetaCond(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleRunJoin}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" /> Execute Join Query
                </button>
              </div>
            </div>

            {/* Query Result Output */}
            {joinResult && (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-slate-900 text-blue-300 font-mono text-xs rounded-xl flex items-center justify-between border border-slate-800">
                  <span className="font-bold">Result Relation: {joinResult.expression}</span>
                  <span className="text-emerald-400 font-bold text-[11px]">
                    {joinResult.cardinality} Matching Tuples
                  </span>
                </div>

                <DataTable
                  title={joinResult.expression}
                  data={joinResult.rows}
                  columns={joinResult.columns}
                  pageSize={6}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6E: SET OPERATIONS (∪, ∩, −) */}
      {/* ========================================================================= */}
      {activeTab === 'setops' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-mono font-bold text-base flex items-center justify-center">
                ∪
              </span>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Set Operations: Union (∪), Intersection (∩), Difference (−) (Slide 16)
                </h3>
                <p className="text-xs text-slate-500">
                  Set operations require <strong>Union Compatibility</strong> (same arity and compatible attribute domains).
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-mono text-slate-700 space-y-1">
                <span className="font-bold text-blue-900 block">Tested Union-Compatible Relations (Slide 16):</span>
                <div>R₁ = ∏_&#123;course_id&#125;(σ_&#123;semester="Fall" ∧ year=2017&#125;(section)) · (Fall 2017 Courses)</div>
                <div>R₂ = ∏_&#123;course_id&#125;(σ_&#123;semester="Spring" ∧ year=2018&#125;(section)) · (Spring 2018 Courses)</div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'union', label: 'R₁ ∪ R₂ (Union: Taught in Fall 2017 OR Spring 2018)' },
                  { id: 'intersect', label: 'R₁ ∩ R₂ (Intersection: Taught in BOTH semesters)' },
                  { id: 'difference', label: 'R₁ − R₂ (Difference: Taught in Fall 2017 BUT NOT Spring 2018)' },
                ].map((op) => (
                  <button
                    key={op.id}
                    onClick={() => setSetOpType(op.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer ${
                      setOpType === op.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {op.label}
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleRunSetOp}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" /> Compute Set Operation
                </button>
              </div>
            </div>

            {/* Query Result Output */}
            {setOpResult && (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-slate-900 text-blue-300 font-mono text-xs rounded-xl flex items-center justify-between border border-slate-800">
                  <span className="font-bold">Result: {setOpResult.expression}</span>
                  <span className="text-emerald-400 font-bold text-[11px]">
                    {setOpResult.cardinality} Tuples Returned
                  </span>
                </div>

                <DataTable
                  title={setOpResult.expression}
                  data={setOpResult.rows}
                  columns={setOpResult.columns}
                  pageSize={6}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6F: RENAME OPERATOR (ρ) */}
      {/* ========================================================================= */}
      {activeTab === 'rename' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-mono font-bold text-base flex items-center justify-center">
                ρ
              </span>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Rename Operation: <code className="font-mono text-blue-900">ρ_x(E)</code> (Slide 22)
                </h3>
                <p className="text-xs text-slate-500">
                  Assigns a new relation name to the output of an algebraic expression, essential for self-joins and intermediate query variable storage.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Original Relation (E)
                  </label>
                  <select
                    value={renameOrigRel}
                    onChange={(e) => setRenameOrigRel(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  >
                    <option value="instructor">instructor</option>
                    <option value="student">student</option>
                    <option value="course">course</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    New Assigned Relation Alias (x)
                  </label>
                  <input
                    type="text"
                    value={renameNewName}
                    onChange={(e) => setRenameNewName(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleRunRename}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" /> Execute Rename Query
                </button>
              </div>
            </div>

            {renameResult && (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-slate-900 text-blue-300 font-mono text-xs rounded-xl flex items-center justify-between border border-slate-800">
                  <span className="font-bold">Result: {renameResult.expression}</span>
                  <span className="text-emerald-400 font-bold text-[11px]">
                    Alias registered in environment
                  </span>
                </div>

                <DataTable
                  title={renameResult.expression}
                  data={renameResult.rows}
                  columns={renameResult.columns}
                  pageSize={6}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6G: EXTENDED AGGREGATE (γ / G) */}
      {/* ========================================================================= */}
      {activeTab === 'extended' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-mono font-bold text-base flex items-center justify-center">
                γ
              </span>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Aggregate Operations: <code className="font-mono text-blue-900">G_&#123;f(A)&#125;(r)</code> (Slide 24)
                </h3>
                <p className="text-xs text-slate-500">
                  Calculates aggregate summary statistics (avg, sum, count, min, max) optionally grouped by categorical attributes.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Group By Attribute
                  </label>
                  <select
                    value={aggGroupAttr}
                    onChange={(e) => setAggGroupAttr(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  >
                    <option value="dept_name">dept_name</option>
                    <option value="">(None - Whole Relation)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Aggregate Function
                  </label>
                  <select
                    value={aggFunc}
                    onChange={(e) => setAggFunc(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  >
                    <option value="avg">avg (Average)</option>
                    <option value="sum">sum (Total Sum)</option>
                    <option value="count">count (Row Count)</option>
                    <option value="min">min (Minimum)</option>
                    <option value="max">max (Maximum)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Target Column
                  </label>
                  <select
                    value={aggTargetAttr}
                    onChange={(e) => setAggTargetAttr(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  >
                    <option value="salary">salary</option>
                    <option value="ID">ID</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleRunAggregate}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" /> Compute Aggregates
                </button>
              </div>
            </div>

            {aggResult && (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-slate-900 text-blue-300 font-mono text-xs rounded-xl flex items-center justify-between border border-slate-800">
                  <span className="font-bold">Result: {aggResult.expression}</span>
                  <span className="text-emerald-400 font-bold text-[11px]">
                    {aggResult.cardinality} Aggregated Groups
                  </span>
                </div>

                <DataTable
                  title={aggResult.expression}
                  data={aggResult.rows}
                  columns={aggResult.columns}
                  pageSize={6}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6H: MULTI-STEP QUERY CHALLENGES */}
      {/* ========================================================================= */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-bold text-base flex items-center justify-center">
                🎯
              </span>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Multi-Step Relational Algebra Challenges (Slide 23)
                </h3>
                <p className="text-xs text-slate-500">
                  Solve realistic university database queries by combining σ, ∏, and ⋈ operations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {queryChallenges.map((ch, idx) => {
                const isSelected = activeChallengeIdx === idx;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setActiveChallengeIdx(idx);
                      setChallengeResult(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-xs'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs">{ch.title.split(':')[0]}</div>
                    <div className="text-[11px] opacity-80 truncate mt-1">{ch.task}</div>
                  </button>
                );
              })}
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <div className="space-y-1">
                <div className="font-bold text-base text-slate-900">
                  Task: {queryChallenges[activeChallengeIdx].task}
                </div>
                <div className="text-xs font-mono text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 inline-block">
                  Target Algebraic Formula: {queryChallenges[activeChallengeIdx].formula}
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600">
                <strong>Solution Blueprint Hint: </strong>
                {queryChallenges[activeChallengeIdx].hint}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleRunChallenge(activeChallengeIdx)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-slate-950" /> Execute Challenge Pipeline
                </button>
              </div>
            </div>

            {challengeResult && (
              <div className="space-y-3 pt-2 animate-in fade-in">
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Query Pipeline Executed Successfully! </strong> Returned {challengeResult.cardinality} tuples matching the formal relational algebra specification.
                  </span>
                </div>

                <DataTable
                  title={`Result: ${challengeResult.expression}`}
                  data={challengeResult.rows}
                  columns={challengeResult.columns}
                  pageSize={6}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6I: MODULE 6 ASSESSMENT QUIZ */}
      {/* ========================================================================= */}
      {activeTab === 'quiz' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              📝
            </span>
            <h3 className="font-bold text-lg text-slate-900">
              Module 6 Relational Algebra Mastery Assessment
            </h3>
          </div>

          <QuizComponent
            quizTitle="Module 6 Assessment: Relational Algebra Operators & Equivalences"
            questions={module6Quiz}
            studyMode={studyMode}
            onComplete={(score, total) => {
              const pct = Math.round((score / total) * 100);
              onUpdateProgress('quiz', pct);
            }}
          />
        </div>
      )}

      {/* Next Module Navigation */}
      <div className="pt-6 border-t border-slate-200 flex justify-end">
        <button
          onClick={onNextModule}
          className="px-6 py-3 bg-[#1e3a5f] hover:bg-[#152a45] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <span>Take Chapter 2 Comprehensive Exam</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
