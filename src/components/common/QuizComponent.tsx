import React, { useState } from 'react';
import { MCQQuestion } from '../../types';
import { CheckCircle2, XCircle, HelpCircle, RotateCcw, Award, ArrowRight, Eye, EyeOff } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizComponentProps {
  quizTitle: string;
  questions: MCQQuestion[];
  studyMode: 'learn' | 'quiz';
  onComplete?: (score: number, total: number) => void;
  minPassingScore?: number; // e.g. 70%
}

export const QuizComponent: React.FC<QuizComponentProps> = ({
  quizTitle,
  questions,
  studyMode,
  onComplete,
  minPassingScore = 70,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const handleSelect = (questionId: string, optionId: string) => {
    if (isSubmitted && studyMode === 'quiz') return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));

    if (studyMode === 'learn') {
      setShowExplanation((prev) => ({
        ...prev,
        [questionId]: true,
      }));
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    const pct = Math.round((score / questions.length) * 100);

    if (pct >= minPassingScore) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
    }

    if (onComplete) {
      onComplete(score, questions.length);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowExplanation({});
    setShowHint({});
    setIsSubmitted(false);
    setCurrentIdx(0);
  };

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);
  const isPassed = percentage >= minPassingScore;
  const currentQ = questions[currentIdx];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">{quizTitle}</h3>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                studyMode === 'learn'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-indigo-100 text-indigo-800'
              }`}
            >
              {studyMode === 'learn' ? 'Learn Mode: Immediate Feedback' : 'Quiz Mode: Graded Assessment'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Question {currentIdx + 1} of {questions.length} · Passing criteria: {minPassingScore}%
          </p>
        </div>

        {/* Progress Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {questions.map((q, i) => {
            const answered = selectedAnswers[q.id] !== undefined;
            const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
            const isCurrent = i === currentIdx;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(i)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'ring-2 ring-blue-600 ring-offset-1 bg-[#1e3a5f] text-white'
                    : isSubmitted || studyMode === 'learn'
                    ? answered
                      ? isCorrect
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-slate-100 text-slate-500'
                    : answered
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Question Body */}
      {currentQ && (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h4 className="text-base font-semibold text-slate-900 leading-snug">
              <span className="text-blue-700 font-mono mr-2">Q{currentIdx + 1}.</span>
              {currentQ.question}
            </h4>

            {currentQ.hint && studyMode === 'learn' && (
              <button
                onClick={() =>
                  setShowHint((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))
                }
                className="text-xs text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                {showHint[currentQ.id] ? 'Hide Hint' : 'Show Hint'}
              </button>
            )}
          </div>

          {showHint[currentQ.id] && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Hint: </strong> {currentQ.hint}
              </div>
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {currentQ.options.map((opt) => {
              const isSelected = selectedAnswers[currentQ.id] === opt.id;
              const isCorrectOpt = currentQ.correctAnswer === opt.id;
              const revealAnswers = isSubmitted || (studyMode === 'learn' && selectedAnswers[currentQ.id] !== undefined);

              let optionStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';

              if (revealAnswers) {
                if (isCorrectOpt) {
                  optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-1 ring-emerald-400';
                } else if (isSelected && !isCorrectOpt) {
                  optionStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-1 ring-rose-400';
                } else {
                  optionStyle = 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-70';
                }
              } else if (isSelected) {
                optionStyle = 'bg-blue-50 border-blue-500 text-blue-950 ring-1 ring-blue-500';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(currentQ.id, opt.id)}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${optionStyle}`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                      revealAnswers && isCorrectOpt
                        ? 'bg-emerald-600 text-white'
                        : revealAnswers && isSelected && !isCorrectOpt
                        ? 'bg-rose-600 text-white'
                        : isSelected
                        ? 'bg-[#1e3a5f] text-white'
                        : 'bg-white border border-slate-300 text-slate-700'
                    }`}
                  >
                    {opt.id}
                  </span>
                  <span className="text-sm font-medium leading-normal flex-1">{opt.text}</span>
                  {revealAnswers && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {revealAnswers && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {(isSubmitted || (studyMode === 'learn' && selectedAnswers[currentQ.id] !== undefined)) && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed animate-in fade-in duration-150 ${
                selectedAnswers[currentQ.id] === currentQ.correctAnswer
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50/80 border-rose-200 text-rose-950'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                {selectedAnswers[currentQ.id] === currentQ.correctAnswer ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Correct!
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Incorrect. (Correct answer is {currentQ.correctAnswer})
                  </>
                )}
              </div>
              <p>{currentQ.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation & Submit Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Previous
          </button>
          <button
            disabled={currentIdx === questions.length - 1}
            onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
            className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {isSubmitted ? (
            <button
              onClick={handleReset}
              className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Quiz
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-5 py-2 text-xs font-bold bg-[#1e3a5f] hover:bg-[#152a45] text-white rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Award className="w-4 h-4 text-blue-200" />
              Submit Quiz & Record Score
            </button>
          )}
        </div>
      </div>

      {/* Score Banner when Submitted */}
      {isSubmitted && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            isPassed
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <Award className={`w-8 h-8 ${isPassed ? 'text-emerald-600' : 'text-amber-600'}`} />
            <div>
              <div className="font-bold text-sm">
                Score: {score} / {questions.length} ({percentage}%) — {isPassed ? 'Passed! 🎉' : 'Needs Review (< 70%)'}
              </div>
              <p className="text-xs opacity-90 mt-0.5">
                {isPassed
                  ? 'Congratulations! You mastered this module’s concepts.'
                  : 'Review the explanations above or switch to Learn mode to strengthen your understanding.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
