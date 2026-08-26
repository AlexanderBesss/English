export type CategoryId = 'grammar' | 'verbs' | 'vocabulary' | 'reading' | 'writing' | 'listening' | 'speaking';
export type ExerciseType = 'multiple-choice' | 'gap-fill' | 'matching' | 'transformation' | 'error-correction' | 'short-answer';

export interface LearningObjective { id: string; text: string }
export interface Example { label: string; sentence: string; note: string }
export interface LessonSection { id: string; title: string; body: string; examples?: Example[] }
export interface Answer { values: string[]; explanation: string }
export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  options?: string[];
  answer: Answer;
}
export interface Topic {
  id: string;
  title: string;
  category: CategoryId;
  level: 'B1+' | 'B2';
  minutes: number;
  summary: string;
  keywords: string[];
  objectives: LearningObjective[];
  prerequisite?: string;
  sections: LessonSection[];
  mistake: { wrong: string; right: string; explanation: string };
  exercises: Exercise[];
  production: { prompt: string; model: string; checklist: string[] };
  transcript?: string;
  table?: { headers: string[]; rows: string[][] };
}
export interface TopicSeed {
  id: string; title: string; category: CategoryId; level?: 'B1+' | 'B2'; minutes?: number;
  summary: string; keywords: string[]; focus: string; correct: string; wrong: string;
  question: string; choices: string[]; answer: string; gap: string; gapAnswer: string;
  gapChoices?: string[];
  answerWhy?: string; gapWhy?: string; mistakeWhy?: string; transformWhy?: string;
  transform: string; transformAnswer: string; prerequisite?: string; transcript?: string;
  table?: { headers: string[]; rows: string[][] };
}
export interface TopicProgress { completed: boolean; bestScore: number; attempts: number; bookmarked: boolean }
export interface ProgressState { version: 1; topics: Record<string, TopicProgress>; lastOpened?: string }
