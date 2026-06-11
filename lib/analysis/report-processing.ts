import type { AnalysisInput, AnalysisReport, Severity } from "@/lib/types";
import { clamp } from "@/lib/utils";
import type { OpenAIReportDraft } from "./schema";
import {
  getReadinessStatus,
  scorePerformanceLevel,
  weightedScore,
} from "./scoring";

const STATUS_SCORES: Record<
  AnalysisReport["rubricBreakdown"][number]["status"],
  number
> = {
  strong: 94,
  okay: 82,
  needs_work: 64,
  missing: 30,
};

const IMPACT_ORDER: Record<Severity, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const EFFORT_TIME = {
  quick: "5-10 min",
  focused: "15-25 min",
  substantial: "30-60 min",
} as const;

type RevisionEffort = keyof typeof EFFORT_TIME;

export const ANALYSIS_VERSION = "2026-06-grounded-v1";

const genreDefaults: Record<
  string,
  { centralClaimLabel: string; evidenceLabel: string }
> = {
  "Argumentative Essay": {
    centralClaimLabel: "Thesis",
    evidenceLabel: "Evidence & Analysis",
  },
  "Research Paper": {
    centralClaimLabel: "Research Claim",
    evidenceLabel: "Research & Analysis",
  },
  Reflection: {
    centralClaimLabel: "Central Insight",
    evidenceLabel: "Reflection & Detail",
  },
  "Discussion Post": {
    centralClaimLabel: "Main Response",
    evidenceLabel: "Course Support",
  },
  "Literary Analysis": {
    centralClaimLabel: "Interpretive Claim",
    evidenceLabel: "Textual Evidence",
  },
  "Case Study": {
    centralClaimLabel: "Recommendation",
    evidenceLabel: "Case Analysis",
  },
  "Lab Report": {
    centralClaimLabel: "Main Finding",
    evidenceLabel: "Data & Interpretation",
  },
  "Business Memo": {
    centralClaimLabel: "Purpose",
    evidenceLabel: "Support & Rationale",
  },
  "Scholarship Essay": {
    centralClaimLabel: "Central Narrative",
    evidenceLabel: "Examples & Reflection",
  },
};

export function getGenreLabels(assignmentType: string) {
  return genreDefaults[assignmentType] || genreDefaults["Argumentative Essay"];
}

export function requiresCitations(input: AnalysisInput, modelValue = false) {
  const instructions = `${input.assignmentPrompt}\n${input.rubric || ""}`;
  const explicitlyNotRequired =
    /\b(?:no|without)\s+(?:outside|external|additional)?\s*(?:sources?|research|citations?)\b/i.test(
      instructions,
    ) ||
    /\bdo not (?:use|include|cite)\s+(?:outside|external|additional)?\s*(?:sources?|research|citations?)\b/i.test(
      instructions,
    );
  if (explicitlyNotRequired) return false;

  const explicitlyRequired =
    /\b(?:cite|citation|citations|sources?|research|works cited|references|bibliography)\b/i.test(
      instructions,
    );
  if (explicitlyRequired) return true;

  return modelValue;
}

function normalizedKey(value: string) {
  return value
    .toLowerCase()
    .replace(
      /\b(the|a|an|draft|essay|possible|likely|consider|revising)\b/g,
      "",
    )
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .slice(0, 10)
    .join(" ");
}

function thematicKey(value: string) {
  if (
    /\b(?:word count|target range|required range|\d{2,4}\s*[-–]\s*\d{2,4}\s*words?|below the required|meet the .*word|expand the draft)\b/i.test(
      value,
    )
  ) {
    return "length-requirement";
  }
  if (
    /\b(?:works cited|reference list|references page|bibliography)\b/i.test(
      value,
    )
  ) {
    return "source-list";
  }
  if (
    /\b(?:add|find|locate|use|integrate)\b[\s\S]{0,60}\b(?:credible |scholarly )?sources?\b/i.test(
      value,
    )
  ) {
    return "source-count";
  }
  if (
    /\b(?:counterargument|counterclaim|opposing view|rebuttal)\b/i.test(value)
  ) {
    return "counterargument";
  }

  return normalizedKey(value);
}

function uniqueByText<T>(items: T[], getText: (item: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = thematicKey(getText(item));
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractWordRequirement(prompt: string) {
  const match = prompt.match(
    /\b(\d{1,3}(?:,\d{3})?)(?:\s*[-–]\s*(\d{1,3}(?:,\d{3})?))?\s*words?\b/i,
  );
  if (!match) return null;

  return {
    minimum: Number(match[1].replaceAll(",", "")),
    maximum: match[2] ? Number(match[2].replaceAll(",", "")) : null,
    label: match[0],
  };
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function scoreCriterion(
  assessment: OpenAIReportDraft["assessments"]["promptMatch"],
) {
  return assessment.applicable ? scorePerformanceLevel(assessment.level) : null;
}

function normalizeEffort(
  fix: string,
  impact: Severity,
  effort: RevisionEffort,
): RevisionEffort {
  const substantialPattern =
    /\b(?:research|find|locate|add|integrate|expand|write|create|complete|build|develop)\b[\s\S]{0,80}\b(?:sources?|research|works cited|references|bibliography|paragraphs?|sections?|pages?|1,\d{3}|1200|1500|word count)\b/i;
  if (impact === "high" && substantialPattern.test(fix)) {
    return "substantial";
  }

  return effort;
}

function buildPriorityFixes(draft: OpenAIReportDraft) {
  const supplied = draft.priorityActions.map((item) => ({
    fix: item.fix,
    estimatedImpact: item.estimatedImpact,
    effort: normalizeEffort(item.fix, item.estimatedImpact, item.effort),
  }));
  const requirementActions = draft.missingRequirements.map((item) => ({
    fix: item.suggestedFix,
    estimatedImpact: item.severity,
    effort:
      item.severity === "high"
        ? ("substantial" as const)
        : ("focused" as const),
  }));

  return uniqueByText([...supplied, ...requirementActions], (item) => item.fix)
    .sort(
      (a, b) =>
        IMPACT_ORDER[a.estimatedImpact] - IMPACT_ORDER[b.estimatedImpact],
    )
    .slice(0, 5)
    .map((item, index) => ({
      rank: index + 1,
      fix: item.fix,
      estimatedImpact: item.estimatedImpact,
      timeEstimate: EFFORT_TIME[item.effort],
      effort: item.effort,
    }));
}

function buildDueTonightPlan(
  fixes: ReturnType<typeof buildPriorityFixes>,
): AnalysisReport["dueTonightPlan"] {
  const quick = fixes.filter((item) => item.effort === "quick");
  const focused = fixes.filter((item) => item.effort === "focused");
  const substantial = fixes.filter((item) => item.effort === "substantial");

  return {
    fifteenMinuteFixes: quick.length
      ? quick.slice(0, 3).map((item) => item.fix)
      : [
          focused[0]
            ? `Mark exactly where this revision belongs: ${focused[0].fix}`
            : "Mark the explicit prompt or rubric requirements that are still missing.",
        ],
    thirtyMinuteFixes: [...quick, ...focused].length
      ? [...quick, ...focused].slice(0, 4).map((item) => item.fix)
      : substantial[0]
        ? [`Start the highest-impact revision: ${substantial[0].fix}`]
        : [],
    sixtyMinuteFixes: [...substantial, ...focused]
      .slice(0, 4)
      .map((item) => item.fix),
    skipIfNoTime: [
      "Cosmetic word swaps that do not improve meaning.",
      "Optional formatting polish beyond the professor's stated requirements.",
    ],
  };
}

function isCitationOrRequirementDuplicate(warning: string) {
  return /\b(word count|words?|works cited|references|bibliography|sources?|citations?)\b/i.test(
    warning,
  );
}

export function createProcessedReport(
  input: AnalysisInput,
  draft: OpenAIReportDraft,
): AnalysisReport {
  const defaults = getGenreLabels(input.assignmentType);
  const hasKnownGenre = Object.prototype.hasOwnProperty.call(
    genreDefaults,
    input.assignmentType,
  );
  const centralClaimLabel = hasKnownGenre
    ? defaults.centralClaimLabel
    : draft.genreProfile.centralClaimLabel.trim() || defaults.centralClaimLabel;
  const evidenceLabel = hasKnownGenre
    ? defaults.evidenceLabel
    : draft.genreProfile.evidenceLabel.trim() || defaults.evidenceLabel;
  const citationApplicable = requiresCitations(
    input,
    draft.genreProfile.citationRequired,
  );

  const scoreBreakdown: AnalysisReport["scoreBreakdown"] = {
    promptMatch: scoreCriterion(draft.assessments.promptMatch),
    rubricMatch: scoreCriterion(draft.assessments.rubricMatch),
    thesisClarity: scoreCriterion(draft.assessments.centralClaim),
    evidenceQuality: scoreCriterion(draft.assessments.evidenceQuality),
    organization: scoreCriterion(draft.assessments.organization),
    citationSafety: citationApplicable
      ? scoreCriterion(draft.assessments.citationSafety)
      : null,
    grammarClarity: scoreCriterion(draft.assessments.grammarClarity),
  };

  const wordRequirement = extractWordRequirement(input.assignmentPrompt);
  if (wordRequirement && scoreBreakdown.promptMatch !== null) {
    const ratio =
      countWords(input.draft) / Math.max(wordRequirement.minimum, 1);
    if (ratio < 0.5) {
      scoreBreakdown.promptMatch = Math.min(scoreBreakdown.promptMatch, 42);
    } else if (ratio < 0.8) {
      scoreBreakdown.promptMatch = Math.min(scoreBreakdown.promptMatch, 58);
    } else if (ratio < 0.95) {
      scoreBreakdown.promptMatch = Math.min(scoreBreakdown.promptMatch, 74);
    }
  }

  const missingRequirements = uniqueByText(
    draft.missingRequirements,
    (item) => item.issue,
  ).slice(0, 6);
  const highSeverityCount = missingRequirements.filter(
    (item) => item.severity === "high",
  ).length;

  let overallScore = weightedScore(scoreBreakdown);
  if (highSeverityCount >= 3) overallScore = Math.min(overallScore, 59);
  else if (highSeverityCount === 2) overallScore = Math.min(overallScore, 64);
  else if (highSeverityCount === 1) overallScore = Math.min(overallScore, 79);
  overallScore = clamp(overallScore);

  const prioritiesWithEffort = buildPriorityFixes(draft);
  const priorityFixes = prioritiesWithEffort.map((item) => ({
    rank: item.rank,
    fix: item.fix,
    estimatedImpact: item.estimatedImpact,
    timeEstimate: item.timeEstimate,
  }));

  const formattingWarnings = uniqueByText(
    draft.formattingWarnings.filter(
      (item) => !isCitationOrRequirementDuplicate(item.warning),
    ),
    (item) => item.warning,
  ).slice(0, 3);
  const missingRequirementThemes = new Set(
    missingRequirements.map((item) => thematicKey(item.issue)),
  );
  const evidenceAnalysis = uniqueByText(
    draft.evidenceAnalysis,
    (item) => `${item.paragraphReference || ""} ${item.issue}`,
  )
    .filter((item) => !missingRequirementThemes.has(thematicKey(item.issue)))
    .slice(0, 5)
    .map((item) => ({
      ...item,
      paragraphReference: item.paragraphReference ?? undefined,
    }));

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    analysisMode: "openai",
    analysisVersion: ANALYSIS_VERSION,
    title: draft.title,
    overallScore,
    readinessStatus: getReadinessStatus(overallScore),
    executiveSummary: draft.executiveSummary,
    criterionLabels: {
      promptMatch: "Prompt Match",
      rubricMatch: input.noRubric ? "Writing Standards" : "Rubric Match",
      thesisClarity: centralClaimLabel,
      evidenceQuality: evidenceLabel,
      organization: "Organization",
      citationSafety: "Citation Readiness",
      grammarClarity: "Clarity & Style",
    },
    promptSummary: {
      ...draft.promptSummary,
      wordCountRequirement:
        draft.promptSummary.wordCountRequirement ??
        wordRequirement?.label ??
        undefined,
      sourceRequirement: draft.promptSummary.sourceRequirement ?? undefined,
      formattingRequirement:
        draft.promptSummary.formattingRequirement ?? undefined,
      specialInstructions: [
        ...(input.noRubric
          ? ["Reviewed using genre-appropriate college writing standards"]
          : ["Checked against the provided rubric"]),
        ...draft.promptSummary.specialInstructions,
      ].slice(0, 10),
    },
    scoreBreakdown,
    missingRequirements,
    rubricBreakdown: uniqueByText(
      draft.rubricBreakdown,
      (item) => item.category,
    ).map((item) => ({
      ...item,
      scoreEstimate: STATUS_SCORES[item.status],
    })),
    thesisFeedback: {
      label: centralClaimLabel,
      ...draft.thesisFeedback,
      clarityScore: scoreBreakdown.thesisClarity ?? 0,
    },
    structureMap: uniqueByText(draft.structureMap, (item) => item.section),
    evidenceAnalysis,
    citationWarnings: citationApplicable
      ? uniqueByText(draft.citationWarnings, (item) => item.warning).slice(0, 4)
      : [],
    formattingWarnings,
    priorityFixes,
    finalChecklist: uniqueByText(
      draft.finalChecklist,
      (item) => item.item,
    ).slice(0, 8),
    dueTonightPlan: input.dueTonight
      ? buildDueTonightPlan(prioritiesWithEffort)
      : undefined,
    disclaimer:
      "Yessay provides revision guidance and possible issue flags. It does not verify source accuracy, guarantee grades, or replace your professor's instructions.",
    locked: true,
  };
}
