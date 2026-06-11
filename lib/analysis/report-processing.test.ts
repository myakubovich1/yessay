import assert from "node:assert/strict";
import test from "node:test";
import type { AnalysisInput } from "@/lib/types";
import { createProcessedReport } from "./report-processing";
import type { OpenAIReportDraft } from "./schema";

const baseInput: AnalysisInput = {
  assignmentPrompt:
    "Explain a meaningful academic challenge and what you learned from it.",
  rubric: "Focus, specific detail, reflection, organization, and clarity.",
  noRubric: false,
  draft:
    "During my first semester, I struggled to plan a long research project. I initially treated every source as equally useful, which left my notes unfocused.\n\nI changed my process by writing one question for each reading and recording how the evidence answered it. That habit made my later drafts more purposeful and taught me to revise my process instead of only working longer.",
  assignmentType: "Reflection",
  citationStyle: "Auto-detect",
  dueDate: "",
  dueTonight: false,
};

function assessment(
  level: OpenAIReportDraft["assessments"]["promptMatch"]["level"],
  applicable = true,
) {
  return {
    applicable,
    level,
    evidence: "Grounded observation from the supplied draft.",
  };
}

const baseDraft = {
  title: "Learning to revise a research process",
  executiveSummary:
    "The draft has a clear experience and a useful reflective turn. It would benefit from more specific detail about the change in process.",
  genreProfile: {
    centralClaimLabel: "Central Insight",
    evidenceLabel: "Reflection & Detail",
    citationRequired: false,
  },
  promptSummary: {
    detectedTask: "Reflect on an academic challenge and explain the learning.",
    wordCountRequirement: null,
    sourceRequirement: null,
    formattingRequirement: null,
    requiredSections: ["Challenge", "Response", "Learning"],
    specialInstructions: [],
  },
  assessments: {
    promptMatch: assessment("strong"),
    rubricMatch: assessment("proficient"),
    centralClaim: assessment("developing"),
    evidenceQuality: assessment("weak"),
    organization: assessment("proficient"),
    citationSafety: assessment("missing", false),
    grammarClarity: assessment("strong"),
  },
  missingRequirements: [],
  rubricBreakdown: [
    {
      category: "Focus",
      status: "strong",
      feedback: "The challenge is easy to identify.",
      suggestedFix: "Keep the reflection centered on the same challenge.",
    },
    {
      category: "Specific detail",
      status: "okay",
      feedback: "Some concrete process details are present.",
      suggestedFix: "Add one more specific moment from the process.",
    },
    {
      category: "Reflection",
      status: "needs_work",
      feedback: "The lesson is present but brief.",
      suggestedFix: "Explain how the lesson affects later academic work.",
    },
    {
      category: "Required section",
      status: "missing",
      feedback: "A requested section is absent.",
      suggestedFix: "Add the requested section in the student's own words.",
    },
  ],
  thesisFeedback: {
    detectedThesis:
      "That habit taught me to revise my process instead of only working longer.",
    feedback: "The central insight is visible near the end.",
    improvementDirection:
      "Connect the insight more explicitly to the specific challenge.",
  },
  structureMap: [
    {
      section: "Challenge",
      detected: true,
      notes: "The challenge appears in the opening.",
    },
  ],
  evidenceAnalysis: [
    {
      issue: "The changed process could use one more concrete detail.",
      paragraphReference: "Paragraph 2",
      severity: "medium",
      suggestedFix: "Name one specific action and its result.",
    },
  ],
  citationWarnings: [],
  formattingWarnings: [
    {
      warning: "Plain text cannot verify font, margins, or line spacing.",
      severity: "low",
      suggestedFix: "Check the final document in the editor.",
    },
  ],
  priorityActions: [
    {
      fix: "Add one concrete detail about the changed process.",
      estimatedImpact: "medium",
      effort: "focused",
    },
  ],
  finalChecklist: [
    {
      item: "The reflection answers every part of the prompt.",
      status: "needs_work",
    },
  ],
} satisfies OpenAIReportDraft;

function cloneDraft() {
  return structuredClone(baseDraft) as OpenAIReportDraft;
}

test("maps performance levels and rubric statuses to stable percentages", () => {
  const report = createProcessedReport(baseInput, cloneDraft());

  assert.deepEqual(report.scoreBreakdown, {
    promptMatch: 94,
    rubricMatch: 84,
    thesisClarity: 72,
    evidenceQuality: 56,
    organization: 84,
    citationSafety: null,
    grammarClarity: 94,
  });
  assert.deepEqual(
    report.rubricBreakdown.map((item) => item.scoreEstimate),
    [94, 82, 64, 30],
  );
  assert.equal(report.analysisMode, "openai");
});

test("forces citation scoring to N/A when instructions reject outside sources", () => {
  const draft = cloneDraft();
  draft.genreProfile.citationRequired = true;
  draft.genreProfile.centralClaimLabel = "Thesis";
  draft.genreProfile.evidenceLabel = "Evidence & Analysis";
  const input = {
    ...baseInput,
    assignmentPrompt:
      "Reflect on a meaningful academic challenge. No outside sources or citations are required.",
  };

  const report = createProcessedReport(input, draft);

  assert.equal(report.scoreBreakdown.citationSafety, null);
  assert.equal(report.criterionLabels?.thesisClarity, "Central Insight");
  assert.equal(report.criterionLabels?.evidenceQuality, "Reflection & Detail");
  assert.deepEqual(report.citationWarnings, []);
});

test("deduplicates semantically equivalent length findings and actions", () => {
  const draft = cloneDraft();
  draft.missingRequirements = [
    {
      severity: "high",
      issue: "The draft is below the required 500-700 word range.",
      whyItMatters: "Length is an explicit requirement.",
      suggestedFix: "Expand the draft to meet the 500-700 word requirement.",
    },
  ];
  draft.evidenceAnalysis.push({
    issue: "The draft is substantially below the required word count.",
    paragraphReference: null,
    severity: "high",
    suggestedFix: "Add more developed reflection.",
  });
  draft.priorityActions = [
    {
      fix: "Expand the draft to meet the 500-700 word requirement.",
      estimatedImpact: "high",
      effort: "substantial",
    },
    {
      fix: "Expand the reflection with examples until it fits the required range.",
      estimatedImpact: "high",
      effort: "substantial",
    },
  ];

  const report = createProcessedReport(baseInput, draft);

  assert.equal(report.priorityFixes.length, 1);
  assert.equal(
    report.evidenceAnalysis.some((item) => /word count/i.test(item.issue)),
    false,
  );
});

test("explicit source requirements override an incorrect model profile", () => {
  const draft = cloneDraft();
  draft.genreProfile.citationRequired = false;
  draft.assessments.citationSafety = assessment("developing", true);
  const input = {
    ...baseInput,
    assignmentPrompt:
      "Use at least two credible sources and include MLA in-text citations.",
  };

  const report = createProcessedReport(input, draft);

  assert.equal(report.scoreBreakdown.citationSafety, 72);
});

test("caps a report with a high-severity missing requirement", () => {
  const draft = cloneDraft();
  for (const key of Object.keys(
    draft.assessments,
  ) as (keyof OpenAIReportDraft["assessments"])[]) {
    draft.assessments[key] = assessment("strong");
  }
  draft.missingRequirements = [
    {
      severity: "high",
      issue: "The required methods section is missing.",
      whyItMatters: "The prompt explicitly requires this section.",
      suggestedFix: "Add the methods section using the student's own work.",
    },
  ];

  const report = createProcessedReport(baseInput, draft);

  assert.equal(report.overallScore, 79);
  assert.equal(report.readinessStatus, "Needs Fixes");
});

test("keeps substantial revisions out of the 15-minute plan", () => {
  const draft = cloneDraft();
  draft.priorityActions = [
    {
      fix: "Research and add the three required scholarly sources.",
      estimatedImpact: "high",
      effort: "substantial",
    },
    {
      fix: "Clarify the final reflective sentence.",
      estimatedImpact: "medium",
      effort: "focused",
    },
    {
      fix: "Correct the assignment title.",
      estimatedImpact: "low",
      effort: "quick",
    },
  ];
  const report = createProcessedReport(
    { ...baseInput, dueTonight: true },
    draft,
  );

  assert.deepEqual(report.dueTonightPlan?.fifteenMinuteFixes, [
    "Correct the assignment title.",
  ]);
  assert.ok(
    report.dueTonightPlan?.sixtyMinuteFixes.includes(
      "Research and add the three required scholarly sources.",
    ),
  );
});

test("upgrades high-impact source-list work to substantial effort", () => {
  const draft = cloneDraft();
  draft.priorityActions = [
    {
      fix: "Create a complete MLA Works Cited page for the required sources.",
      estimatedImpact: "high",
      effort: "focused",
    },
  ];

  const report = createProcessedReport(
    { ...baseInput, dueTonight: true },
    draft,
  );

  assert.equal(report.priorityFixes[0].timeEstimate, "30-60 min");
  assert.ok(
    !report.dueTonightPlan?.fifteenMinuteFixes.some((item) =>
      /Works Cited/i.test(item),
    ),
  );
  assert.ok(
    report.dueTonightPlan?.thirtyMinuteFixes.some((item) =>
      /Start the highest-impact revision/i.test(item),
    ),
  );
  assert.ok(
    report.dueTonightPlan?.sixtyMinuteFixes.some((item) =>
      /Works Cited/i.test(item),
    ),
  );
});

test("deduplicates repeated actions and removes misplaced formatting warnings", () => {
  const draft = cloneDraft();
  draft.priorityActions.push({
    ...draft.priorityActions[0],
  });
  draft.formattingWarnings.push(
    {
      warning: "The draft is below the required word count.",
      severity: "high",
      suggestedFix: "Add analysis to the underdeveloped sections.",
    },
    {
      warning: "A Works Cited page was not detected.",
      severity: "high",
      suggestedFix: "Add the required source list.",
    },
  );

  const report = createProcessedReport(baseInput, draft);

  assert.equal(report.priorityFixes.length, 1);
  assert.equal(report.formattingWarnings.length, 1);
  assert.match(report.formattingWarnings[0].warning, /Plain text/);
});
