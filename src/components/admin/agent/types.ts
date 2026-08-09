export type CorpusCollection = {
  id: string;
  slug: string;
  name: string;
  isPublic: boolean;
};

export type CorpusEntry = {
  id: string;
  collectionId: string;
  title: string;
  sourceType: string;
  sourceRef: string | null;
  lang: string;
  trustTier: string;
  content: string;
  chunks: number;
  createdAt: string;
};

export type Source = {
  id: string;
  title: string;
  sourceRef: string | null;
  similarity: number;
  excerpt: string;
};

export type TestResult = {
  answer: string;
  audience: string;
  stage: string;
  analysis: {
    intent: string;
    sentiment: string;
    urgency: string;
    objections: string[];
    extracted: Record<string, string>;
    tactic: string;
  } | null;
  sources: Source[];
  gap: boolean;
  bestSimilarity: number;
};

export type Scores = Record<string, number>;

export type EvalCaseResult = {
  type: "case";
  caseId: string;
  externalId: string | null;
  question: string;
  audience: string;
  difficulty: string;
  answer: string;
  scores: Scores;
  score: number;
  diagnosis: string;
  improved: string;
  bestSimilarity: number;
  gap: boolean;
  index: number;
  total: number;
};

export type EvalRunSummary = {
  id: string;
  suite: string;
  suiteSlug: string;
  label: string | null;
  model: string;
  promptVersion: number | null;
  avgScore: number | null;
  dimensionAvgs: Scores | null;
  corpusChunks: number;
  completedCases: number;
  startedAt: string;
};

export type Suite = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  cases: number;
  lastRun: { id: string; avgScore: number | null; startedAt: string } | null;
};

export type PersonaVersion = {
  id: string;
  version: number;
  name: string;
  notes: string | null;
  psychologyLayer: string;
  audienceLayers: Record<string, string>;
  model: string;
  temperature: number;
  maxTokens: number;
  isActive: boolean;
  updatedAt: string;
  stageLayers: Record<string, string>;
};

export type Gap = {
  id: string;
  question: string;
  source: string;
  audience: string | null;
  hits: number;
  bestSimilarity: number;
  status: string;
  answer: string | null;
  createdAt: string;
};

export type TrainingExample = {
  id: string;
  question: string;
  answer: string;
  rejectedAnswer: string | null;
  audience: string;
  locale: string;
  source: string;
  tags: string[];
  notes: string | null;
  quality: number | null;
  simulationRunId: string | null;
  evalResultId: string | null;
  approved: boolean;
  createdAt: string;
};

export type TrainingStats = {
  approved: number;
  pending: number;
  minExamples: number;
  ready: boolean;
  bySource: Record<string, number>;
  lastExportAt: string | null;
  withPreference?: number;
};

export type FineTuneJob = {
  id: string;
  openaiJobId: string;
  status: string;
  baseModel: string;
  fineTunedModel: string | null;
  fileId: string | null;
  exampleCount: number;
  error: string | null;
  promptVersionId: string | null;
  createdAt: string;
  updatedAt: string;
  finishedAt: string | null;
};

/**
 * Lee un cuerpo NDJSON entregando cada objeto en cuanto llega. Es lo que hace
 * que las evaluaciones y el role-play se vean avanzar en vivo en vez de
 * aparecer de golpe al final.
 */
export async function readNdjson(
  res: Response,
  onEvent: (event: Record<string, unknown>) => void,
): Promise<void> {
  const reader = res.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        onEvent(JSON.parse(line));
      } catch {
        // Línea partida entre chunks: se completará en la siguiente vuelta.
      }
    }
  }
}
