import type { AnalysisReport, ReadinessStatus, ScoreValue } from "@/lib/types";
import { clamp } from "@/lib/utils";

export type PerformanceLevel =
  | "strong"
  | "proficient"
  | "developing"
  | "weak"
  | "missing";

const LEVEL_SCORES: Record<PerformanceLevel, number> = {
  strong: 94,
  proficient: 84,
  developing: 72,
  weak: 56,
  missing: 30,
};

const SCORE_WEIGHTS: Record<keyof AnalysisReport["scoreBreakdown"], number> = {
  promptMatch: 0.22,
  rubricMatch: 0.18,
  thesisClarity: 0.14,
  evidenceQuality: 0.18,
  organization: 0.12,
  citationSafety: 0.08,
  grammarClarity: 0.08,
};

export function getReadinessStatus(score: number): ReadinessStatus {
  if (score >= 90) return "Strong";
  if (score >= 80) return "Mostly Ready";
  if (score >= 70) return "Needs Fixes";
  if (score >= 60) return "Risky";
  return "Not Ready";
}

export function scorePerformanceLevel(level: PerformanceLevel) {
  return LEVEL_SCORES[level];
}

export function weightedScore(scores: Record<string, ScoreValue>) {
  const entries = Object.entries(scores).filter(
    (entry): entry is [string, number] => entry[1] !== null,
  );
  if (!entries.length) return 0;

  const knownEntries = entries.filter(([key]) => key in SCORE_WEIGHTS) as [
    keyof AnalysisReport["scoreBreakdown"],
    number,
  ][];

  if (knownEntries.length === entries.length) {
    const totalWeight = knownEntries.reduce(
      (sum, [key]) => sum + SCORE_WEIGHTS[key],
      0,
    );
    return clamp(
      knownEntries.reduce(
        (sum, [key, score]) => sum + score * SCORE_WEIGHTS[key],
        0,
      ) / totalWeight,
    );
  }

  return clamp(
    entries.reduce((sum, [, score]) => sum + score, 0) / entries.length,
  );
}
