import React, { useState } from 'react';
import { ModuleProgress } from './types';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { Module1Structure } from './components/modules/Module1Structure';
import { Module2SchemaInstance } from './components/modules/Module2SchemaInstance';
import { Module3Keys } from './components/modules/Module3Keys';
import { Module4SchemaDiagrams } from './components/modules/Module4SchemaDiagrams';
import { Module5QueryLanguages } from './components/modules/Module5QueryLanguages';
import { Module6RelationalAlgebra } from './components/modules/Module6RelationalAlgebra';
import { ComprehensiveExam } from './components/modules/ComprehensiveExam';
import { CheatSheetModal } from './components/common/CheatSheetModal';
import { GlossaryModal } from './components/common/GlossaryModal';

export default function App() {
  // Navigation: 0 = Dashboard, 1-6 = Modules, 7 = Comprehensive Exam
  const [currentModule, setCurrentModule] = useState<number>(0);

  // Study Mode: 'learn' (with explanations & hints) vs 'quiz' (formal assessment)
  const [studyMode, setStudyMode] = useState<'learn' | 'quiz'>('learn');

  // Modals
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  // Progress tracking for modules 1 through 7
  const [progress, setProgress] = useState<Record<number, ModuleProgress>>({
    1: { moduleId: 1, completedComponents: [], isCompleted: false },
    2: { moduleId: 2, completedComponents: [], isCompleted: false },
    3: { moduleId: 3, completedComponents: [], isCompleted: false },
    4: { moduleId: 4, completedComponents: [], isCompleted: false },
    5: { moduleId: 5, completedComponents: [], isCompleted: false },
    6: { moduleId: 6, completedComponents: [], isCompleted: false },
    7: { moduleId: 7, completedComponents: [], isCompleted: false },
  });

  const handleUpdateProgress = (moduleId: number, componentId: string, quizScore?: number) => {
    setProgress((prev) => {
      const current = prev[moduleId] || {
        moduleId,
        completedComponents: [],
        isCompleted: false,
      };

      const updatedComponents = current.completedComponents.includes(componentId)
        ? current.completedComponents
        : [...current.completedComponents, componentId];

      const isCompleted =
        quizScore !== undefined ? quizScore >= 60 : updatedComponents.length >= 3;

      return {
        ...prev,
        [moduleId]: {
          ...current,
          completedComponents: updatedComponents,
          quizScore: quizScore !== undefined ? quizScore : current.quizScore,
          isCompleted: isCompleted || current.isCompleted,
        },
      };
    });
  };

  const handleToggleStudyMode = () => {
    setStudyMode((m) => (m === 'learn' ? 'quiz' : 'learn'));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex antialiased selection:bg-blue-600 selection:text-white">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentModule={currentModule}
        onSelectModule={(id) => setCurrentModule(id)}
        studyMode={studyMode}
        onToggleStudyMode={handleToggleStudyMode}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Sticky Top Header */}
        <Header
          currentModule={currentModule}
          studyMode={studyMode}
          onToggleStudyMode={handleToggleStudyMode}
          onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
          onOpenGlossary={() => setIsGlossaryOpen(true)}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
        />

        {/* Dynamic Module Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentModule === 0 && (
            <Dashboard
              onSelectModule={(id) => setCurrentModule(id)}
            />
          )}

          {currentModule === 1 && (
            <Module1Structure
              studyMode={studyMode}
              progress={progress[1]}
              onUpdateProgress={(comp, score) => handleUpdateProgress(1, comp, score)}
              onNextModule={() => setCurrentModule(2)}
            />
          )}

          {currentModule === 2 && (
            <Module2SchemaInstance
              studyMode={studyMode}
              progress={progress[2]}
              onUpdateProgress={(comp, score) => handleUpdateProgress(2, comp, score)}
              onNextModule={() => setCurrentModule(3)}
            />
          )}

          {currentModule === 3 && (
            <Module3Keys
              studyMode={studyMode}
              progress={progress[3]}
              onUpdateProgress={(comp, score) => handleUpdateProgress(3, comp, score)}
              onNextModule={() => setCurrentModule(4)}
            />
          )}

          {currentModule === 4 && (
            <Module4SchemaDiagrams
              studyMode={studyMode}
              progress={progress[4]}
              onUpdateProgress={(comp, score) => handleUpdateProgress(4, comp, score)}
              onNextModule={() => setCurrentModule(5)}
            />
          )}

          {currentModule === 5 && (
            <Module5QueryLanguages
              studyMode={studyMode}
              progress={progress[5]}
              onUpdateProgress={(comp, score) => handleUpdateProgress(5, comp, score)}
              onNextModule={() => setCurrentModule(6)}
            />
          )}

          {currentModule === 6 && (
            <Module6RelationalAlgebra
              studyMode={studyMode}
              progress={progress[6]}
              onUpdateProgress={(comp, score) => handleUpdateProgress(6, comp, score)}
              onNextModule={() => setCurrentModule(7)}
            />
          )}

          {currentModule === 7 && (
            <ComprehensiveExam
              studyMode={studyMode}
              progress={progress[7]}
              onUpdateProgress={(comp, score) => handleUpdateProgress(7, comp, score)}
              onSelectModule={(id) => setCurrentModule(id)}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <CheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
      />

      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
    </div>
  );
}
