export interface TableRow {
  [key: string]: string | number | null | undefined;
}

export interface RelationSchema {
  name: string;
  primaryKey: string[];
  attributes: {
    name: string;
    type: 'string' | 'number' | 'date';
    domain: string;
    description?: string;
  }[];
  foreignKeys?: {
    attribute: string;
    referencedTable: string;
    referencedAttribute: string;
  }[];
}

export interface ModuleProgress {
  moduleId: number;
  completedComponents: string[]; // e.g. ['comp1', 'comp2', 'comp3', 'comp4', 'quiz']
  quizScore?: number;
  isCompleted: boolean;
}

export interface StudyState {
  currentModule: number; // 0 for dashboard, 1-6 for modules, 7 for final comprehensive exam
  studyMode: 'learn' | 'quiz'; // 'learn' shows explanations, 'quiz' hides hints
  progress: Record<number, ModuleProgress>;
  isCheatSheetOpen: boolean;
  isGlossaryOpen: boolean;
}

export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: MCQOption[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
}

export interface GlossaryTerm {
  term: string;
  symbol?: string;
  pronunciation?: string;
  category: 'Structure' | 'Schema & Instance' | 'Keys' | 'Query Languages' | 'Relational Algebra';
  definition: string;
  formalDefinition?: string;
  example: string;
}

export interface RelationalQueryResult {
  columns: string[];
  rows: TableRow[];
  cardinality: number;
  degree: number;
  explanation: string;
  executionSteps: string[];
  expression?: string;
}

export interface QueryChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  expectedAlgebra: string;
  targetTables: string[];
  hint: string;
  solutionExplanation: string;
}
