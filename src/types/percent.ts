export type ChapterId =
  | 'base-anchor'
  | 'reverse-percent'
  | 'signed-change'
  | 'dollars-vs-percent'
  | 'shop-price-tags';

export type SpeakerId = 'pippa' | 'felix' | 'ollie';

export type CharacterMood = 'happy' | 'confused' | 'aha' | 'pointing' | 'warning';

export type VisualFocus =
  | 'anchor'
  | 'difference'
  | 'wrong-way'
  | 'blocks'
  | 'signed-trip'
  | 'dollar-vs-pct'
  | 'bridge-profit'
  | 'bridge-discount'
  | 'bridge-compare';

export interface StoryStep {
  id: string;
  title: string;
  speaker: SpeakerId;
  secondarySpeaker?: SpeakerId;
  mood: CharacterMood;
  secondaryMood?: CharacterMood;
  speech: string;
  tip?: string;
  focus: VisualFocus;
  formula?: string;
}

export interface QuizChoice {
  id: string;
  label: string;
  sublabel?: string;
  isCorrect: boolean;
  feedback: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  contextLine: string;
  choices: QuizChoice[];
}

export interface ChapterParams {
  // Chapter 1 & 3
  originalPrice: number;
  newPrice: number;
  // Chapter 2
  reverseNewPrice: number;
  reverseIncreasePct: number;
  // Chapter 4
  itemAPrice: number;
  itemBPrice: number;
  sharedDollarDiff: number;
  // Chapter 5
  costPrice: number;
  markedPrice: number;
  sellingPrice: number;
}

export interface ChapterMeta {
  id: ChapterId;
  number: number;
  shortTitle: string;
  title: string;
  misconceptionTag: string;
  summary: string;
  itemEmojiLabel: string;
  defaultParams: ChapterParams;
  questions: QuizQuestion[];
}

export interface StudentProgress {
  completedChapters: ChapterId[];
  solvedQuestionIds: string[];
}
