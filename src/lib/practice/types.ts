export type PracticeLocale = "en" | "es";

export type PracticeMode =
  | "interview"
  | "meeting"
  | "drill"
  | "coach"
  | "glossary";

export type StudyKind = "term" | "acronym" | "phrase" | "script";

export type PracticeDifficulty = "baja" | "media" | "alta";

export type TermCategory =
  | "agents_rag"
  | "architecture"
  | "cloud_infra"
  | "fullstack"
  | "products";

export type PhraseSituation =
  | "open"
  | "connectors"
  | "soften"
  | "standup"
  | "design"
  | "client"
  | "defer"
  | "interview_star"
  | "close";

export const PRACTICE_SCORE_DIMENSIONS = [
  "fluency",
  "grammar",
  "vocabulary",
  "professionalism",
  "content",
] as const;

export type PracticeScoreDimension =
  (typeof PRACTICE_SCORE_DIMENSIONS)[number];

export type PracticeScores = Record<PracticeScoreDimension, number>;

export type TurnFeedback = {
  scores: PracticeScores;
  score: number;
  diagnosis: string;
  nativeRewrite: string;
  tips: string[];
  suggestedConnectors: string[];
  glossaryHits: string[];
};

export type PracticeTerm = {
  id: string;
  category: TermCategory;
  en: string;
  es: string;
  definitionEn: string;
  definitionEs: string;
  interviewLineEn: string;
  exampleEn: string;
  sourceSlug: string;
};

export type PracticeAcronym = {
  id: string;
  acronym: string;
  expansionEn: string;
  expansionEs: string;
  definitionEn: string;
  definitionEs: string;
  meetingLineEn: string;
  sourceSlug?: string;
  domain: TermCategory | "general";
};

export type PracticePhrase = {
  id: string;
  situation: PhraseSituation;
  en: string;
  es: string;
  whenToUse: string;
  variant: string;
};

export type WorkplaceScript = {
  id: string;
  situation: string;
  titleEn: string;
  titleEs: string;
  contextEs: string;
  modelEn: string;
  modelEs: string;
  phraseIds: string[];
  sourceSlug?: string;
};

export type MeetingScenario = {
  slug: string;
  titleEn: string;
  titleEs: string;
  brief: string;
  goal: string;
  difficulty: PracticeDifficulty;
};

export type DrillItem = {
  id: string;
  pack: string;
  promptEn: string;
  promptEs: string;
  options: string[];
  correctIndex: number;
  explanationEn: string;
  explanationEs: string;
  tags: string[];
};
