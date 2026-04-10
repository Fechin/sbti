export type Language = "zh-Hans" | "zh-Hant" | "en";
export type Level = "L" | "M" | "H";

export interface LocalizedText {
  "zh-Hans": string;
  "zh-Hant": string;
  en: string;
}

export interface QuestionOption {
  value: 1 | 2 | 3;
  text: LocalizedText;
}

export interface Question {
  id: string;
  dimension: string;
  text: LocalizedText;
  options: QuestionOption[];
}

export interface PersonalityType {
  code: string;
  name: LocalizedText;
  pattern: string;
  description: LocalizedText;
  traits: string[];
  shareableText: LocalizedText;
}

export interface TestOptions {
  language?: Language;
  answers?: Array<1 | 2 | 3> | string;
  specialAnswers?: Array<1 | 2 | 3> | string;
}

export interface DimensionExplanation {
  code: string;
  model: string;
  title: string;
  level: Level;
  explanation: string;
}

export interface MatchSummary {
  code: string;
  name: string;
  description: string;
  traits: string[];
  shareableText: string;
  similarity: number;
  pattern: string;
}

export interface TestResult {
  language: Language;
  personality: string;
  personalityName: string;
  score: number;
  vector: string;
  dimensions: Record<string, Level>;
  matchedType: MatchSummary;
  topMatches: MatchSummary[];
  answers: Array<1 | 2 | 3>;
  specialAnswers: Array<1 | 2 | 3>;
  reason: string;
  timestamp: string;
}

export interface ResultReport extends TestResult {
  dimensionExplanations: DimensionExplanation[];
}

export class SBTITest {
  constructor(options?: { language?: Language });
  reset(): void;
  getQuestions(): Question[];
  getSpecialQuestions(): Question[];
  submitAnswer(questionId: string, value: 1 | 2 | 3): void;
  submitSpecialAnswer(questionId: string, value: 1 | 2 | 3): void;
  answerAll(
    answers: Array<1 | 2 | 3> | string,
    specialAnswers?: Array<1 | 2 | 3> | string
  ): TestResult;
  calculateDimensions(): Record<string, Level>;
  calculateResult(): TestResult;
  getResultReport(): ResultReport;
}

export const DEFAULT_QUESTION_BANK: {
  dimensionOrder: string[];
  questions: Question[];
  specialQuestions: Question[];
  types: PersonalityType[];
};

export const SUPPORTED_LANGUAGES: Language[];

export function parseAnswerList(
  input: Array<1 | 2 | 3> | string,
  expectedLength: number,
  fieldName?: string
): Array<1 | 2 | 3>;

export function answersFromPattern(pattern: string): Array<1 | 2 | 3>;
export function formatResult(result: ResultReport): string;
export function runTest(options: TestOptions): Promise<TestResult>;
