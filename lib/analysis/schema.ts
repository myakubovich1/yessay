import { z } from "zod";

export const analysisInputSchema = z.object({
  assignmentPrompt: z.string().trim().min(20).max(30000),
  rubric: z.string().trim().max(30000).optional(),
  noRubric: z.boolean(),
  draft: z.string().trim().min(80).max(100000),
  assignmentType: z.string().trim().min(1).max(100),
  citationStyle: z.string().trim().min(1).max(50),
  dueDate: z.string().trim().max(50).optional(),
  dueTonight: z.boolean(),
  dueTime: z.string().trim().max(10).optional(),
  hoursUntilDeadline: z.number().min(0.25).max(48).optional(),
});

const severitySchema = z.enum(["high", "medium", "low"]);
const checklistStatusSchema = z.enum(["complete", "needs_work", "missing"]);
const performanceLevelSchema = z
  .enum(["strong", "proficient", "developing", "weak", "missing"])
  .describe(
    "An absolute performance level, never rubric points or a percentage. Strong means consistently effective; proficient means effective with minor limitations; developing means partially effective; weak means substantially underdeveloped; missing means required evidence is absent.",
  );

const criterionAssessmentSchema = z.object({
  applicable: z
    .boolean()
    .describe("False only when the criterion genuinely does not apply."),
  level: performanceLevelSchema,
  evidence: z
    .string()
    .max(280)
    .describe(
      "One concise observation grounded in the supplied draft, prompt, or rubric.",
    ),
});

export const openAIReportSchema = z.object({
  title: z.string().max(100),
  executiveSummary: z.string().max(700),
  genreProfile: z.object({
    centralClaimLabel: z
      .string()
      .max(40)
      .describe(
        "Genre-appropriate label such as Thesis, Central insight, Purpose, Recommendation, or Main finding.",
      ),
    evidenceLabel: z
      .string()
      .max(40)
      .describe(
        "Genre-appropriate label such as Evidence & analysis, Reflection & detail, Case analysis, or Findings.",
      ),
    citationRequired: z.boolean(),
  }),
  promptSummary: z.object({
    detectedTask: z.string().max(300),
    wordCountRequirement: z.string().max(80).nullable(),
    sourceRequirement: z.string().max(120).nullable(),
    formattingRequirement: z.string().max(160).nullable(),
    requiredSections: z.array(z.string().max(100)).max(10),
    specialInstructions: z.array(z.string().max(140)).max(10),
  }),
  assessments: z.object({
    promptMatch: criterionAssessmentSchema,
    rubricMatch: criterionAssessmentSchema,
    centralClaim: criterionAssessmentSchema,
    evidenceQuality: criterionAssessmentSchema,
    organization: criterionAssessmentSchema,
    citationSafety: criterionAssessmentSchema,
    grammarClarity: criterionAssessmentSchema,
  }),
  missingRequirements: z
    .array(
      z.object({
        severity: severitySchema,
        issue: z.string().max(240),
        whyItMatters: z.string().max(320),
        suggestedFix: z.string().max(320),
      }),
    )
    .max(7),
  rubricBreakdown: z
    .array(
      z.object({
        category: z.string().max(100),
        status: z.enum(["strong", "okay", "needs_work", "missing"]),
        feedback: z.string().max(360),
        suggestedFix: z.string().max(320),
      }),
    )
    .max(10),
  thesisFeedback: z.object({
    detectedThesis: z.string().max(600),
    feedback: z.string().max(400),
    improvementDirection: z.string().max(360),
  }),
  structureMap: z
    .array(
      z.object({
        section: z.string().max(100),
        detected: z.boolean(),
        notes: z.string().max(280),
      }),
    )
    .max(10),
  evidenceAnalysis: z
    .array(
      z.object({
        issue: z.string().max(280),
        paragraphReference: z.string().max(100).nullable(),
        severity: severitySchema,
        suggestedFix: z.string().max(320),
      }),
    )
    .max(6),
  citationWarnings: z
    .array(
      z.object({
        warning: z.string().max(280),
        severity: severitySchema,
        suggestedFix: z.string().max(320),
      }),
    )
    .max(5),
  formattingWarnings: z
    .array(
      z.object({
        warning: z.string().max(280),
        severity: severitySchema,
        suggestedFix: z.string().max(320),
      }),
    )
    .max(4),
  priorityActions: z
    .array(
      z.object({
        fix: z.string().max(320),
        estimatedImpact: severitySchema,
        effort: z.enum(["quick", "focused", "substantial"]),
      }),
    )
    .max(7),
  finalChecklist: z
    .array(
      z.object({
        item: z.string().max(180),
        status: checklistStatusSchema,
      }),
    )
    .max(10),
});

export type OpenAIReportDraft = z.infer<typeof openAIReportSchema>;
