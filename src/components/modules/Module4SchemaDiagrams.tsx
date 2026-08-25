import React, { useState } from 'react';
import { TableRow, ModuleProgress } from '../../types';
import { universityDatabaseSchemas, sampleDatabase } from '../../data/sampleData';
import { module4Quiz } from '../../data/quizData';
import { DataTable } from '../common/DataTable';
import { QuizComponent } from '../common/QuizComponent';
import {
  Network,
  Info,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Route,
  Link,
  Layers,
} from 'lucide-react';

interface Module4Props {
  studyMode: 'learn' | 'quiz';
  progress?: ModuleProgress;
  onUpdateProgress: (componentId: string, quizScore?: number) => void;
  onNextModule: () => void;
}

export const Module4SchemaDiagrams: React.FC<Module4Props> = ({
  studyMode,
  progress,
  onUpdateProgress,
  onNextModule,
}) => {
  // Component 1 & 2: Selected table / Selected relationship in SVG
  const [selectedTable, setSelectedTable] = useState<string>('instructor');
  const [selectedRelationship, setSelectedRelationship] = useState<{
    source: string;
    target: string;
    sourceAttr: string;
    targetAttr: string;
    explanation: string;
  } | null>(null);

  // Component 3: "Trace the Path" Challenge
  const pathChallenges = [
    {
      id: 'p1',
      title: 'Path 1: Find Which Instructor Taught a Student',
      goal: 'Connect a student to their course instructor',
      correctPath: ['student', 'takes', 'section', 'teaches', 'instructor'],
      hint: 'Student enrolls via takes, takes is linked to section, section is taught via teaches, teaches references instructor.',
    },
    {
      id: 'p2',
      title: 'Path 2: Find the Classroom for a Department Course',
      goal: 'Connect a department to the physical classroom where its courses meet',
      correctPath: ['department', 'course', 'section', 'classroom'],
      hint: 'Department offers course, course is scheduled in section, section is hosted in classroom.',
    },
  ];

  const [activePathChallengeIdx, setActivePathChallengeIdx] = useState(0);
  const [userPath, setUserPath] = useState<string[]>(['student']);
  const [pathValidated, setPathValidated] = useState<boolean | null>(null);

  // Component 4: Build-Your-Own Mini Schema (student, takes, course)
  const [miniConnections, setMiniConnections] = useState<{ from: string; to: string }[]>([]);
  const [miniValidation, setMiniValidation] = useState<boolean | null>(null);

  // Handlers
  const handleSelectRelationship = (
    source: string,
    target: string,
    sourceAttr: string,
    targetAttr: string,
    explanation: string
  ) => {
    setSelectedRelationship({ source, target, sourceAttr, targetAttr, explanation });
    onUpdateProgress('comp2');
  };

  const handleAddToPath = (tbl: string) => {
    if (userPath.includes(tbl)) {
      setUserPath(userPath.filter((t) => t !== tbl));
    } else {
      setUserPath([...userPath, tbl]);
    }
    setPathValidated(null);
  };

  const handleValidatePath = () => {
    const cur = pathChallenges[activePathChallengeIdx];
    const isMatch =
      userPath.length === cur.correctPath.length &&
      userPath.every((t, i) => t === cur.correctPath[i]);

    setPathValidated(isMatch);
    if (isMatch) {
      onUpdateProgress('comp3');
    }
  };

  const handleResetPath = () => {
    const start = pathChallenges[activePathChallengeIdx].correctPath[0];
    setUserPath([start]);
    setPathValidated(null);
  };

  const handleToggleMiniConnection = (from: string, to: string) => {
    const exists = miniConnections.some((c) => c.from === from && c.to === to);
    if (exists) {
      setMiniConnections(miniConnections.filter((c) => !(c.from === from && c.to === to)));
    } else {
      setMiniConnections([...miniConnections, { from, to }]);
    }
    setMiniValidation(null);
  };

  const handleValidateMiniSchema = () => {
    // takes.ID -> student.ID and takes.course_id -> course.course_id
    const hasTakesStudent = miniConnections.some((c) => c.from === 'takes' && c.to === 'student');
    const hasTakesCourse = miniConnections.some((c) => c.from === 'takes' && c.to === 'course');
    const isValid = hasTakesStudent && hasTakesCourse && miniConnections.length === 2;

    setMiniValidation(isValid);
    if (isValid) {
      onUpdateProgress('comp4');
    }
  };

  const currentSchemaObj = universityDatabaseSchemas[selectedTable];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16">
      {/* Intro Header & Explanation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1e3a5f] font-mono text-xs font-bold">
            Chapter 2 · Slide 9
          </span>
          <span className="text-xs text-slate-500 font-medium">Big-Picture Visual Schema</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Module 4 — Schema Diagrams
        </h2>
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 text-sm leading-relaxed space-y-2">
          <p>
            This is the visual, big-picture module. It shows the full university database schema diagram, with all the tables (<code className="font-mono text-xs text-slate-800">student</code>, <code className="font-mono text-xs text-slate-800">instructor</code>, <code className="font-mono text-xs text-slate-800">department</code>, <code className="font-mono text-xs text-slate-800">course</code>, <code className="font-mono text-xs text-slate-800">section</code>, <code className="font-mono text-xs text-slate-800">teaches</code>, <code className="font-mono text-xs text-slate-800">takes</code>, <code className="font-mono text-xs text-slate-800">advisor</code>, <code className="font-mono text-xs text-slate-800">classroom</code>, <code className="font-mono text-xs text-slate-800">time_slot</code>, <code className="font-mono text-xs text-slate-800">prereq</code>) and arrows showing how they connect via foreign keys. It helps students see the whole system at once — how a student&apos;s enrollment (<code className="font-mono text-xs text-blue-900 font-semibold">takes</code>) connects to a <code className="font-mono text-xs text-blue-900 font-semibold">section</code>, which connects to a <code className="font-mono text-xs text-blue-900 font-semibold">course</code>, which connects to a <code className="font-mono text-xs text-blue-900 font-semibold">department</code>, and so on.
          </p>
        </div>
      </div>

      {/* COMPONENT 1 & 2: Interactive SVG University Schema Diagram */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              1 & 2
            </span>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Interactive University Database Schema Diagram (Slide 9)
              </h3>
              <p className="text-xs text-slate-500">
                Click any table box to inspect its columns & data; click relationship lines or badges to see foreign key semantics.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive SVG Diagram Visualizer */}
        <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-800 overflow-x-auto">
          <div className="min-w-[760px] relative">
            {/* Grid of Tables structured like Slide 9 */}
            <div className="grid grid-cols-4 gap-6 relative z-10 text-xs">
              {/* Column 1: takes, section, classroom */}
              <div className="space-y-4">
                {/* takes */}
                <div
                  onClick={() => {
                    setSelectedTable('takes');
                    onUpdateProgress('comp1');
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTable === 'takes'
                      ? 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-400 text-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <div className="font-bold text-blue-300 border-b border-slate-700 pb-1 mb-1.5 flex justify-between items-center">
                    <span>takes</span>
                    <span className="text-[10px] text-slate-400 font-normal">Relation</span>
                  </div>
                  <div className="space-y-0.5 font-mono text-[11px]">
                    <div className="underline text-blue-200">ID</div>
                    <div className="underline text-blue-200">course_id</div>
                    <div className="underline text-blue-200">sec_id</div>
                    <div className="underline text-blue-200">semester</div>
                    <div className="underline text-blue-200">year</div>
                    <div className="text-slate-400">grade</div>
                  </div>
                </div>

                {/* section */}
                <div
                  onClick={() => {
                    setSelectedTable('section');
                    onUpdateProgress('comp1');
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTable === 'section'
                      ? 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-400 text-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <div className="font-bold text-blue-300 border-b border-slate-700 pb-1 mb-1.5 flex justify-between items-center">
                    <span>section</span>
                    <span className="text-[10px] text-slate-400 font-normal">Relation</span>
                  </div>
                  <div className="space-y-0.5 font-mono text-[11px]">
                    <div className="underline text-blue-200">course_id</div>
                    <div className="underline text-blue-200">sec_id</div>
                    <div className="underline text-blue-200">semester</div>
                    <div className="underline text-blue-200">year</div>
                    <div className="text-slate-400">building</div>
                    <div className="text-slate-400">room_number</div>
                    <div className="text-slate-400">time_slot_id</div>
                  </div>
                </div>

                {/* classroom */}
                <div
                  onClick={() => {
                    setSelectedTable('classroom');
                    onUpdateProgress('comp1');
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTable === 'classroom'
                      ? 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-400 text-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <div className="font-bold text-blue-300 border-b border-slate-700 pb-1 mb-1.5">
                    classroom
                  </div>
                  <div className="space-y-0.5 font-mono text-[11px]">
                    <div className="underline text-blue-200">building</div>
                    <div className="underline text-blue-200">room_number</div>
                    <div className="text-slate-400">capacity</div>
                  </div>
                </div>
              </div>

              {/* Column 2: time_slot, teaches */}
              <div className="space-y-4">
                {/* time_slot */}
                <div
                  onClick={() => setSelectedTable('time_slot')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTable === 'time_slot'
                      ? 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-400 text-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <div className="font-bold text-blue-300 border-b border-slate-700 pb-1 mb-1.5">
                    time_slot
                  </div>
                  <div className="space-y-0.5 font-mono text-[11px]">
                    <div className="underline text-blue-200">time_slot_id</div>
                    <div className="underline text-blue-200">day</div>
                    <div className="underline text-blue-200">start_time</div>
                    <div className="text-slate-400">end_time</div>
                  </div>
                </div>

                {/* teaches */}
                <div
                  onClick={() => setSelectedTable('teaches')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTable === 'teaches'
                      ? 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-400 text-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <div className="font-bold text-blue-300 border-b border-slate-700 pb-1 mb-1.5">
                    teaches
                  </div>
                  <div className="space-y-0.5 font-mono text-[11px]">
                    <div className="underline text-blue-200">ID</div>
                    <div className="underline text-blue-200">course_id</div>
                    <div className="underline text-blue-200">sec_id</div>
                    <div className="underline text-blue-200">semester</div>
                    <div className="underline text-blue-200">year</div>
                  </div>
                </div>
              </div>

              {/* Column 3: course, prereq */}
              <div className="space-y-4">
                {/* course */}
                <div
                  onClick={() => setSelectedTable('course')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTable === 'course'
                      ? 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-400 text-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <div className="font-bold text-blue-300 border-b border-slate-700 pb-1 mb-1.5">
                    course
                  </div>
                  <div className="space-y-0.5 font-mono text-[11px]">
                    <div className="underline text-blue-200">course_id</div>
                    <div className="text-slate-300">title</div>
                    <div className="text-slate-300">dept_name</div>
                    <div className="text-slate-400">credits</div>
                  </div>
                </div>

                {/* prereq */}
                <div
                  onClick={() => setSelectedTable('prereq')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTable === 'prereq'
                      ? 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-400 text-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <div className="font-bold text-blue-300 border-b border-slate-700 pb-1 mb-1.5">
                    prereq
                  </div>
                  <div className="space-y-0.5 font-mono text-[11px]">
                    <div className="underline text-blue-200">course_id</div>
                    <div className="underline text-blue-200">prereq_id</div>
                  </div>
                </div>
              </div>

              {/* Column 4: student, department, advisor, instructor */}
              <div className="space-y-4">
                {/* student */}
                <div
                  onClick={() => setSelectedTable('student')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTable === 'student'
                      ? 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-400 text-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <div className="font-bold text-blue-300 border-b border-slate-700 pb-1 mb-1.5">
                    student
                  </div>
                  <div className="space-y-0.5 font-mono text-[11px]">
                    <div className="underline text-blue-200">ID</div>
                    <div className="text-slate-300">name</div>
                    <div className="text-slate-300">dept_name</div>
                    <div className="text-slate-400">tot_cred</div>
                  </div>
                </div>

                {/* department */}
                <div
                  onClick={() => setSelectedTable('department')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTable === 'department'
                      ? 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-400 text-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <div className="font-bold text-blue-300 border-b border-slate-700 pb-1 mb-1.5">
                    department
                  </div>
                  <div className="space-y-0.5 font-mono text-[11px]">
                    <div className="underline text-blue-200">dept_name</div>
                    <div className="text-slate-300">building</div>
                    <div className="text-slate-400">budget</div>
                  </div>
                </div>

                {/* advisor */}
                <div
                  onClick={() => setSelectedTable('advisor')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTable === 'advisor'
                      ? 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-400 text-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <div className="font-bold text-blue-300 border-b border-slate-700 pb-1 mb-1.5">
                    advisor
                  </div>
                  <div className="space-y-0.5 font-mono text-[11px]">
                    <div className="underline text-blue-200">s_id</div>
                    <div className="text-slate-300">i_id</div>
                  </div>
                </div>

                {/* instructor */}
                <div
                  onClick={() => setSelectedTable('instructor')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTable === 'instructor'
                      ? 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-400 text-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <div className="font-bold text-blue-300 border-b border-slate-700 pb-1 mb-1.5">
                    instructor
                  </div>
                  <div className="space-y-0.5 font-mono text-[11px]">
                    <div className="underline text-blue-200">ID</div>
                    <div className="text-slate-300">name</div>
                    <div className="text-slate-300">dept_name</div>
                    <div className="text-slate-400">salary</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Relationship Inspector Pills */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Link className="w-3.5 h-3.5" /> Inspect FK Relationships:
              </span>
              {[
                {
                  source: 'teaches',
                  target: 'instructor',
                  sourceAttr: 'ID',
                  targetAttr: 'ID',
                  explanation: 'teaches.ID references instructor(ID). Guarantees every course teaching assignment links to a valid faculty member.',
                },
                {
                  source: 'section',
                  target: 'course',
                  sourceAttr: 'course_id',
                  targetAttr: 'course_id',
                  explanation: 'section.course_id references course(course_id). Every scheduled section must belong to an approved course catalog offering.',
                },
                {
                  source: 'takes',
                  target: 'student',
                  sourceAttr: 'ID',
                  targetAttr: 'ID',
                  explanation: 'takes.ID references student(ID). Ensures grades and enrollments attach exclusively to registered student IDs.',
                },
                {
                  source: 'instructor',
                  target: 'department',
                  sourceAttr: 'dept_name',
                  targetAttr: 'dept_name',
                  explanation: 'instructor.dept_name references department(dept_name). Faculty appointments must belong to existing departments.',
                },
              ].map((rel, i) => (
                <button
                  key={i}
                  onClick={() =>
                    handleSelectRelationship(
                      rel.source,
                      rel.target,
                      rel.sourceAttr,
                      rel.targetAttr,
                      rel.explanation
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-mono border border-slate-700 transition-colors cursor-pointer"
                >
                  {rel.source}.{rel.sourceAttr} → {rel.target}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Relationship Detail Box */}
        {selectedRelationship && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm mb-1">
                Foreign Key: {selectedRelationship.source}.{selectedRelationship.sourceAttr} → {selectedRelationship.target}({selectedRelationship.targetAttr})
              </div>
              <p>{selectedRelationship.explanation}</p>
            </div>
          </div>
        )}

        {/* Live Table for selected table */}
        {currentSchemaObj && (
          <DataTable
            title={`${currentSchemaObj.name} (Live University Data)`}
            subtitle={`Primary Key: {${currentSchemaObj.primaryKey.join(', ')}}`}
            data={(sampleDatabase as any)[selectedTable] || []}
            primaryKeys={currentSchemaObj.primaryKey}
            pageSize={5}
          />
        )}
      </div>

      {/* COMPONENT 3: "Trace the Path" Join Pathfinding Challenge */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                "Trace the Path" Join Pathfinding Challenge
              </h3>
              <p className="text-xs text-slate-500">
                To perform multi-table relational queries and joins, you must trace the foreign key relationship chains.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {pathChallenges.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => {
                  setActivePathChallengeIdx(idx);
                  setUserPath([ch.correctPath[0]]);
                  setPathValidated(null);
                }}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activePathChallengeIdx === idx
                    ? 'bg-[#1e3a5f] text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {ch.title.split(':')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <div className="space-y-1">
            <div className="font-bold text-sm text-slate-900">
              Goal: {pathChallenges[activePathChallengeIdx].goal}
            </div>
            <p className="text-xs text-slate-500">
              Click tables in order to build the path from start to destination:
            </p>
          </div>

          {/* User Path Sequence */}
          <div className="flex items-center gap-2 flex-wrap p-3 bg-white border border-slate-200 rounded-xl min-h-[52px]">
            {userPath.map((tbl, idx) => (
              <React.Fragment key={tbl}>
                <span className="px-3 py-1 bg-blue-100 text-blue-900 font-mono font-bold text-xs rounded-lg border border-blue-300">
                  {tbl}
                </span>
                {idx < userPath.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Table Choice Buttons */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(universityDatabaseSchemas).map((tbl) => (
              <button
                key={tbl}
                onClick={() => handleAddToPath(tbl)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold border transition-all cursor-pointer ${
                  userPath.includes(tbl)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {tbl}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              <button
                onClick={handleValidatePath}
                className="px-4 py-2 bg-[#1e3a5f] hover:bg-[#152a45] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Validate Path
              </button>
              <button
                onClick={handleResetPath}
                className="px-3 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>

            {pathValidated === true && (
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Path Validated! Correct foreign key join trajectory.
              </span>
            )}
            {pathValidated === false && (
              <span className="text-xs text-rose-700 bg-rose-50 border border-rose-300 px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                Incorrect path. Hint: {pathChallenges[activePathChallengeIdx].hint}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* COMPONENT 4: Build-Your-Own Mini Schema Sandbox */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            4
          </span>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Build-Your-Own Mini Schema Connection Sandbox
            </h3>
            <p className="text-xs text-slate-500">
              Connect the foreign key relationships between <code className="font-mono">student</code>, <code className="font-mono">takes</code>, and <code className="font-mono">course</code>.
            </p>
          </div>
        </div>

        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs">
              <div className="font-bold text-blue-900 border-b pb-1 mb-1">student</div>
              <div className="underline text-blue-800">ID (PK)</div>
              <div>name</div>
              <div>dept_name</div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs">
              <div className="font-bold text-blue-900 border-b pb-1 mb-1">takes</div>
              <div className="underline text-blue-800">ID (FK)</div>
              <div className="underline text-blue-800">course_id (FK)</div>
              <div>grade</div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs">
              <div className="font-bold text-blue-900 border-b pb-1 mb-1">course</div>
              <div className="underline text-blue-800">course_id (PK)</div>
              <div>title</div>
              <div>credits</div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              Toggle Foreign Key Constraints:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { from: 'takes', to: 'student', label: 'takes.ID → student.ID' },
                { from: 'takes', to: 'course', label: 'takes.course_id → course.course_id' },
                { from: 'student', to: 'course', label: 'student.dept_name → course.course_id (Invalid)' },
                { from: 'course', to: 'student', label: 'course.course_id → student.ID (Invalid)' },
              ].map((link, i) => {
                const isSelected = miniConnections.some(
                  (c) => c.from === link.from && c.to === link.to
                );
                return (
                  <button
                    key={i}
                    onClick={() => handleToggleMiniConnection(link.from, link.to)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {link.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleValidateMiniSchema}
              className="px-4 py-2 bg-[#1e3a5f] hover:bg-[#152a45] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Validate Mini Schema
            </button>

            {miniValidation === true && (
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Perfect! takes correctly references student(ID) and course(course_id).
              </span>
            )}
            {miniValidation === false && (
              <span className="text-xs text-rose-700 bg-rose-50 border border-rose-300 px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                Schema invalid. Check which table holds foreign keys referencing the other two.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* COMPONENT 5: Module 4 Assessment */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            5
          </span>
          <h3 className="font-bold text-lg text-slate-900">
            Module 4 Knowledge Assessment
          </h3>
        </div>

        <QuizComponent
          quizTitle="Module 4 Assessment: Schema Diagrams & University DB"
          questions={module4Quiz}
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
          <span>Continue to Module 5: Query Languages Overview</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
