export const assignmentTypes = [
  "Argumentative Essay",
  "Research Paper",
  "Reflection",
  "Discussion Post",
  "Literary Analysis",
  "Case Study",
  "Lab Report",
  "Business Memo",
  "Scholarship Essay",
  "Other",
] as const;

export const citationStyles = [
  "Auto-detect",
  "APA",
  "MLA",
  "Chicago",
  "Harvard",
  "Other",
] as const;

export type AnalysisInput = {
  assignmentPrompt: string;
  rubric?: string;
  noRubric: boolean;
  draft: string;
  assignmentType: string;
  citationStyle: string;
  dueDate?: string;
  dueTonight: boolean;
  /** "HH:mm" deadline tonight, chosen by the user. */
  dueTime?: string;
  /** Hours between the user's clock and their deadline, computed client-side. */
  hoursUntilDeadline?: number;
};

export type DeadlineBlock = {
  task: string;
  durationMinutes: number;
  kind: "fix" | "final";
};

export type DeadlineSchedule = {
  hoursAvailable: number;
  blocks: DeadlineBlock[];
  skipIfNoTime: string[];
  note?: string;
};

export type Severity = "high" | "medium" | "low";
export type ScoreValue = number | null;
export type AnalysisMode = "openai" | "fallback" | "sample";
export type ReadinessStatus =
  | "Strong"
  | "Mostly Ready"
  | "Needs Fixes"
  | "Risky"
  | "Not Ready";

export type AnalysisReport = {
  id: string;
  createdAt: string;
  analysisMode?: AnalysisMode;
  analysisVersion?: string;
  title: string;
  overallScore: number;
  readinessStatus: ReadinessStatus;
  executiveSummary: string;
  promptSummary: {
    detectedTask: string;
    wordCountRequirement?: string;
    sourceRequirement?: string;
    formattingRequirement?: string;
    requiredSections: string[];
    specialInstructions: string[];
  };
  criterionLabels?: {
    promptMatch: string;
    rubricMatch: string;
    thesisClarity: string;
    evidenceQuality: string;
    organization: string;
    citationSafety: string;
    grammarClarity: string;
  };
  scoreBreakdown: {
    promptMatch: ScoreValue;
    rubricMatch: ScoreValue;
    thesisClarity: ScoreValue;
    evidenceQuality: ScoreValue;
    organization: ScoreValue;
    citationSafety: ScoreValue;
    grammarClarity: ScoreValue;
  };
  missingRequirements: {
    severity: Severity;
    issue: string;
    whyItMatters: string;
    suggestedFix: string;
  }[];
  rubricBreakdown: {
    category: string;
    status: "strong" | "okay" | "needs_work" | "missing";
    scoreEstimate: number;
    feedback: string;
    suggestedFix: string;
  }[];
  thesisFeedback: {
    label?: string;
    detectedThesis: string;
    clarityScore: number;
    feedback: string;
    improvementDirection: string;
  };
  structureMap: {
    section: string;
    detected: boolean;
    notes: string;
  }[];
  evidenceAnalysis: {
    issue: string;
    paragraphReference?: string;
    severity: Severity;
    suggestedFix: string;
  }[];
  citationWarnings: {
    warning: string;
    severity: Severity;
    suggestedFix: string;
  }[];
  formattingWarnings: {
    warning: string;
    severity: Severity;
    suggestedFix: string;
  }[];
  priorityFixes: {
    rank: number;
    fix: string;
    estimatedImpact: "high" | "medium" | "low";
    timeEstimate: string;
  }[];
  finalChecklist: {
    item: string;
    status: "complete" | "needs_work" | "missing";
  }[];
  dueTonightPlan?: {
    fifteenMinuteFixes: string[];
    thirtyMinuteFixes: string[];
    sixtyMinuteFixes: string[];
    skipIfNoTime: string[];
  };
  /** Time-budgeted plan when the user gave a concrete deadline. */
  deadlineSchedule?: DeadlineSchedule;
  /** ISO timestamp of the user's deadline, set on-device at analysis time. */
  deadlineAt?: string;
  disclaimer: string;
  locked: boolean;
  /** Original inputs, kept on-device so the AI revision can run later. */
  source?: ReportSource;
};

export type ReportSource = {
  assignmentPrompt: string;
  rubric?: string;
  draft: string;
  assignmentType: string;
  citationStyle: string;
};

export type RevisionChange = {
  paragraph: number;
  original: string;
  revised: string;
  reason: string;
  criterion: string;
};

export type DraftRevision = {
  reportId: string;
  createdAt: string;
  revisedDraft: string;
  changes: RevisionChange[];
  summary: string;
  notChanged: string[];
};

export type PricingProduct =
  | "single_report"
  | "draft_repair"
  | "finals_pass"
  | "monthly"
  | "annual";
