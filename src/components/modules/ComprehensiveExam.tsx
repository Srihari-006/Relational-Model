import React, { useState } from 'react';
import { ModuleProgress } from '../../types';
import { comprehensiveExam } from '../../data/quizData';
import { QuizComponent } from '../common/QuizComponent';
import {
  GraduationCap,
  Award,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';

interface ComprehensiveExamProps {
  studyMode: 'learn' | 'quiz';
  progress?: ModuleProgress;
  onUpdateProgress: (componentId: string, quizScore?: number) => void;
  onSelectModule: (id: number) => void;
}

export const ComprehensiveExam: React.FC<ComprehensiveExamProps> = ({
  studyMode,
  progress,
  onUpdateProgress,
  onSelectModule,
}) => {
  const [examFinished, setExamFinished] = useState(false);
  const [examScore, setExamScore] = useState<number | null>(null);

  const handleComplete = (score: number, total: number) => {
    const pct = Math.round((score / total) * 100);
    setExamScore(pct);
    setExamFinished(true);
    onUpdateProgress('quiz', pct);
  };

  const isPassed = examScore !== null && examScore >= 70;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0f243d] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-mono text-xs font-bold border border-amber-400/30">
            Final Assessment
          </span>
          <span className="text-xs text-blue-200">15 Comprehensive Questions</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Chapter 2 Comprehensive Mastery Exam
        </h2>
        <p className="text-sm text-blue-100/90 leading-relaxed">
          Test your mastery across all six modules: Relational Structure, Schema vs Instance, Keys, Schema Diagrams, Query Languages, and the Relational Algebra.
          Score 70% or higher to earn the <strong>Relational Model Mastery Certificate</strong>.
        </p>
      </div>

      {/* Passing Badge Banner */}
      {examFinished && isPassed && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-6 text-emerald-950 shadow-md space-y-4 text-center">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-sm">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-emerald-900">
              Congratulations! Mastery Badge Unlocked! 🎓
            </h3>
            <p className="text-sm text-emerald-800">
              You scored <span className="font-bold font-mono">{examScore}%</span> on the Chapter 2 Comprehensive Examination.
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => onSelectModule(0)}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* The Quiz Engine */}
      <QuizComponent
        quizTitle="Chapter 2 Relational Model Final Examination"
        questions={comprehensiveExam}
        studyMode={studyMode}
        onComplete={handleComplete}
      />
    </div>
  );
};
