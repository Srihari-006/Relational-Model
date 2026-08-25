import React, { useState } from 'react';
import {
  Table,
  Layers,
  Key,
  Network,
  Code2,
  Cpu,
  Play,
  ArrowRight,
  Database,
  GraduationCap,
} from 'lucide-react';
import { DataTable } from '../common/DataTable';
import { sampleDatabase, universityDatabaseSchemas } from '../../data/sampleData';

interface DashboardProps {
  onSelectModule: (id: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectModule,
}) => {
  const [selectedPreviewTable, setSelectedPreviewTable] = useState<string>('instructor');

  const modules = [
    {
      id: 1,
      title: 'Module 1: Structure of Relational Databases',
      desc: 'Relations, tuples, attributes, domains, atomic values, and null constraints.',
      icon: Table,
      topics: ['Relation Schema R(A1..An)', 'Atomic Domains', 'Unordered Tuples', 'Null Value Semantics'],
      tag: 'Foundations',
    },
    {
      id: 2,
      title: 'Module 2: Database Schema vs. Instance',
      desc: 'Logical structure (invariant) vs. time-varying data snapshots across time.',
      icon: Layers,
      topics: ['Schema Notation r(R)', 'Instance Snapshot', 'Timeline Mutation', 'Definition Matching'],
      tag: 'Core Concept',
    },
    {
      id: 3,
      title: 'Module 3: Keys & Integrity Constraints',
      desc: 'Superkeys, candidate keys, primary keys, and foreign key referential integrity.',
      icon: Key,
      topics: ['Superkey Subsets', 'Candidate Key Minimality', 'Primary Key Election', 'Foreign Key Violations'],
      tag: 'Constraints',
    },
    {
      id: 4,
      title: 'Module 4: Schema Diagrams & University DB',
      desc: 'Complete 11-table University ER schema, primary keys, and foreign key pathfinding.',
      icon: Network,
      topics: ['University Schema SVG', 'Referential Relationships', 'Join Pathfinding', 'Mini-Schema Sandbox'],
      tag: 'Database Design',
    },
    {
      id: 5,
      title: 'Module 5: Relational Query Languages',
      desc: 'Procedural vs. declarative paradigms, relational algebra vs. calculus equivalence.',
      icon: Code2,
      topics: ['Procedural vs Declarative', 'Algebra vs Calculus', 'Language Classification', 'SQL Evolution Tree'],
      tag: 'Theory & Paradigms',
    },
    {
      id: 6,
      title: 'Module 6: The Relational Algebra Sandbox',
      desc: 'Live execution engine for σ, ∏, ×, ⋈, ∪, ∩, −, ρ, γ, and equivalent queries.',
      icon: Cpu,
      isMajor: true,
      topics: ['Live σ Predicate Builder', 'Live ∏ Projection', '× and ⋈ Multipliers', 'Set Operations', 'Query Challenges'],
      tag: 'Interactive Engine',
    },
  ];

  const currentSchema = universityDatabaseSchemas[selectedPreviewTable];
  const currentData = (sampleDatabase as any)[selectedPreviewTable] || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0f243d] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold">
              Database Management Systems · Chapter 2
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Introduction to the Relational Model
            </h2>
            <p className="text-sm text-blue-100/90 leading-relaxed">
              Explore the foundational concepts of relational database systems: mathematical relations,
              attributes, keys, schema diagrams, and an interactive live Relational Algebra query execution engine.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectModule(1)}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                Start Module 1: Structure of Relational DBs
              </button>

              <button
                onClick={() => onSelectModule(6)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-amber-300" />
                Relational Algebra Engine
              </button>

              <button
                onClick={() => onSelectModule(7)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-emerald-300" />
                Comprehensive Exam
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1e3a5f]">Chapter Syllabus & Interactive Modules</h3>
            <p className="text-xs text-slate-500">Structured lessons with interactive visualizers, sandboxes, and self-checks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;

            return (
              <div
                key={m.id}
                onClick={() => onSelectModule(m.id)}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all hover:shadow-md cursor-pointer group ${
                  m.isMajor
                    ? 'border-amber-300 ring-1 ring-amber-200'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`p-2.5 rounded-xl ${
                        m.isMajor
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-blue-50 text-blue-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {m.tag}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                      {m.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{m.desc}</p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {m.topics.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                  <span>Explore Module</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sample University Database Browser */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-[#1e3a5f]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Shared University Database Browser
              </h3>
              <p className="text-xs text-slate-500">
                Consistent dataset used throughout Chapter 2 lectures and interactive exercises
              </p>
            </div>
          </div>

          {/* Table Selector Tabs */}
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
            {Object.keys(sampleDatabase).map((tbl) => (
              <button
                key={tbl}
                onClick={() => setSelectedPreviewTable(tbl)}
                className={`text-xs px-2.5 py-1 rounded-lg font-mono font-medium transition-colors cursor-pointer ${
                  selectedPreviewTable === tbl
                    ? 'bg-white text-blue-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tbl}
              </button>
            ))}
          </div>
        </div>

        {/* Live Table Preview */}
        <DataTable
          title={selectedPreviewTable}
          subtitle={
            currentSchema
              ? `Schema: ${currentSchema.name}(${currentSchema.attributes.map((a) => a.name).join(', ')}) · Primary Key: {${currentSchema.primaryKey.join(', ')}}`
              : undefined
          }
          data={currentData}
          primaryKeys={currentSchema?.primaryKey || []}
          pageSize={10}
        />
      </div>
    </div>
  );
};

