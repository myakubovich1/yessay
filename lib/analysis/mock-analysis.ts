import type { AnalysisInput, AnalysisReport, Severity } from "@/lib/types";
import { clamp } from "@/lib/utils";
import {
  ANALYSIS_VERSION,
  getGenreLabels,
  requiresCitations,
} from "./report-processing";
import { getReadinessStatus, weightedScore } from "./scoring";

export const sampleInput: AnalysisInput = {
  assignmentPrompt:
    "Write a 1,200-1,500 word argumentative essay that takes a clear position on whether cities should make public transit free. Use at least four credible sources, address one counterargument, and include an MLA Works Cited page.",
  rubric:
    "Thesis and argument 25%; evidence and analysis 30%; organization 20%; counterargument 10%; MLA citations and formatting 15%. Strong work uses specific evidence and explains how each source supports the claim.",
  noRubric: false,
  assignmentType: "Argumentative Essay",
  citationStyle: "MLA",
  dueDate: "",
  dueTonight: true,
  draft:
    "Cities across the country are looking for ways to reduce traffic and make opportunity more equal. Public transit should be free because fares create barriers for low-income riders, fare collection slows service, and broader access can reduce congestion.\n\nFare costs may look small, but they compound for riders who commute every day. A recent transportation study found that household transportation costs take a larger share of income from low-wage workers (Martinez 42). This matters because reliable access to work and school affects whether residents can participate in city life.\n\nFree transit can also make buses run more efficiently. When every rider must stop to pay or scan a card, boarding takes longer. Several pilot programs reported faster boarding after suspending fares. However, cities would need a stable source of operating revenue before removing fares.\n\nCritics argue that free service could become overcrowded or underfunded. That concern is important, but it is a reason to pair fare-free transit with dedicated funding rather than keep a system that limits access.\n\nIn conclusion, fare-free public transit would remove a daily barrier and make city transportation more useful. Cities should test the policy while tracking ridership, reliability, and funding.",
};

function extractRequirement(prompt: string, pattern: RegExp) {
  return prompt.match(pattern)?.[0];
}

function firstSentence(text: string) {
  return text.split(/(?<=[.!?])\s+/)[0]?.trim() || "";
}

function findThesis(draft: string) {
  const sentences = draft.slice(0, 1500).split(/(?<=[.!?])\s+/);
  return (
    sentences.find((sentence) =>
      /\b(should|argue|because|although|must|demonstrates?|shows?)\b/i.test(
        sentence,
      ),
    ) || firstSentence(draft)
  );
}

export function createMockReport(
  input: AnalysisInput,
  options?: { id?: string; locked?: boolean },
): AnalysisReport {
  const words = input.draft.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const promptLower = input.assignmentPrompt.toLowerCase();
  const paragraphs = input.draft
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length);
  const hasCitation =
    /\([A-Z][A-Za-z-]+(?:,?\s+\d+)?\)|\[[0-9]+\]|\baccording to\b/i.test(
      input.draft,
    );
  const hasReferenceList = /\b(works cited|references|bibliography)\b/i.test(
    input.draft,
  );
  const hasConclusion =
    /\b(in conclusion|to conclude|ultimately|in summary)\b/i.test(input.draft);
  const hasCounterargument =
    /\b(however|critics|opponents|some may argue|although)\b/i.test(
      input.draft,
    );
  const thesis = findThesis(input.draft);
  const thesisIsClear = thesis.length >= 45 && thesis.length <= 280;
  const requiresSources = requiresCitations(input);
  const requiresCounterargument =
    /\b(counterargument|counterclaim|opposing|rebuttal)\b/i.test(promptLower);
  const genreLabels = getGenreLabels(input.assignmentType);
  const wordRequirement = extractRequirement(
    input.assignmentPrompt,
    /\b\d{1,3}(?:,\d{3})?(?:\s*[-–]\s*\d{1,3}(?:,\d{3})?)?\s*words?\b/i,
  );
  const requestedSources = extractRequirement(
    input.assignmentPrompt,
    /\b(?:at least\s+)?(?:two|three|four|five|six|\d+)\s+(?:credible\s+)?sources?\b/i,
  );

  const targetWordCount = wordRequirement
    ? Number(wordRequirement.replaceAll(",", "").match(/\d+/)?.[0])
    : 700;
  const lengthRatio = Math.min(1, wordCount / Math.max(targetWordCount, 1));

  const scoreBreakdown: AnalysisReport["scoreBreakdown"] = {
    promptMatch: clamp(56 + lengthRatio * 25 + (hasCounterargument ? 8 : 0)),
    rubricMatch: clamp(input.noRubric ? 72 : 62 + lengthRatio * 18),
    thesisClarity: thesisIsClear ? 84 : 61,
    evidenceQuality: requiresSources
      ? clamp(52 + (hasCitation ? 18 : 0) + Math.min(paragraphs.length * 2, 10))
      : clamp(62 + Math.min(paragraphs.length * 4, 20)),
    organization: clamp(
      58 + Math.min(paragraphs.length * 4, 20) + (hasConclusion ? 8 : 0),
    ),
    citationSafety: requiresSources
      ? clamp(54 + (hasCitation ? 18 : 0) + (hasReferenceList ? 15 : 0))
      : null,
    grammarClarity: clamp(78 + Math.min(wordCount / 100, 8)),
  };
  const overallScore = weightedScore(scoreBreakdown);
  const readinessStatus = getReadinessStatus(overallScore);

  const missingRequirements: AnalysisReport["missingRequirements"] = [];
  if (wordRequirement && wordCount < targetWordCount * 0.88) {
    missingRequirements.push({
      severity: "high",
      issue: `Draft may be short of the ${wordRequirement} requirement.`,
      whyItMatters:
        "A substantial length gap can signal that required analysis or evidence is still underdeveloped.",
      suggestedFix:
        "Compare each body paragraph to the rubric and add analysis where a claim is currently asserted without explanation.",
    });
  }
  if (requiresSources && !hasCitation) {
    missingRequirements.push({
      severity: "high",
      issue: "Required source use is not clearly visible in the draft.",
      whyItMatters:
        "The assignment appears to expect research support, and uncited claims may not satisfy that requirement.",
      suggestedFix:
        "Identify the claims that rely on outside information, add source support, and cite it in the required style.",
    });
  }
  if (requiresSources && !hasReferenceList) {
    missingRequirements.push({
      severity: "medium",
      issue: `A ${input.citationStyle === "APA" ? "References" : "Works Cited or reference"} page was not detected.`,
      whyItMatters:
        "In-text citations generally need a matching full source entry.",
      suggestedFix:
        "Add the required reference list and verify that every in-text citation has a matching entry.",
    });
  }
  if (requiresCounterargument && !hasCounterargument) {
    missingRequirements.push({
      severity: "high",
      issue: "The requested counterargument is likely missing.",
      whyItMatters:
        "This may cost points if the prompt or rubric explicitly evaluates opposing views.",
      suggestedFix:
        "Add a brief, fair opposing view and explain why your position still holds.",
    });
  }
  if (!hasConclusion) {
    missingRequirements.push({
      severity: "medium",
      issue: "A distinct conclusion was not clearly detected.",
      whyItMatters:
        "Readers may not get a final synthesis of the essay's reasoning.",
      suggestedFix:
        "Close by synthesizing the argument's significance rather than only repeating the thesis.",
    });
  }
  const citationWarnings: AnalysisReport["citationWarnings"] = [];
  if (!requiresSources) {
    // Citation criteria are intentionally omitted for assignments that do not
    // ask for outside research or source use.
  } else if (!hasCitation) {
    citationWarnings.push({
      warning: "No clear in-text citation pattern was detected.",
      severity: "high",
      suggestedFix:
        "Check every borrowed fact, paraphrase, and quotation and add an in-text citation where needed.",
    });
  } else if (hasCitation && !hasReferenceList) {
    citationWarnings.push({
      warning:
        "In-text citations appear present, but a source list was not detected.",
      severity: "medium",
      suggestedFix:
        "Match each in-text citation to a complete entry in the required citation style.",
    });
  } else {
    citationWarnings.push({
      warning:
        "Citation patterns were detected, but source accuracy was not verified.",
      severity: "low",
      suggestedFix:
        "Open each source and verify author names, page numbers, dates, and reference entries.",
    });
  }

  const rawTitle =
    input.assignmentPrompt
      .replace(/\s+/g, " ")
      .split(/[.!?]/)[0]
      .replace(/^(write|compose|prepare)\s+/i, "")
      .slice(0, 58) || input.assignmentType;
  const titleSeed = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

  const issueSeverity = (
    test: boolean,
    trueValue: Severity,
    falseValue: Severity,
  ) => (test ? trueValue : falseValue);

  return {
    id: options?.id ?? crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    analysisMode: "fallback",
    analysisVersion: ANALYSIS_VERSION,
    title: titleSeed,
    overallScore,
    readinessStatus,
    executiveSummary:
      overallScore >= 80
        ? "The draft has a credible core argument and is close to submission, but a focused citation and requirement check would reduce avoidable risk."
        : "The draft has a workable foundation, but several prompt-facing revisions should happen before submission.",
    criterionLabels: {
      promptMatch: "Prompt Match",
      rubricMatch: input.noRubric ? "Writing Standards" : "Rubric Match",
      thesisClarity: genreLabels.centralClaimLabel,
      evidenceQuality: genreLabels.evidenceLabel,
      organization: "Organization",
      citationSafety: "Citation Readiness",
      grammarClarity: "Clarity & Style",
    },
    promptSummary: {
      detectedTask: `${input.assignmentType}: ${firstSentence(input.assignmentPrompt).slice(0, 180)}`,
      wordCountRequirement: wordRequirement,
      sourceRequirement: requestedSources,
      formattingRequirement:
        input.citationStyle === "Auto-detect"
          ? undefined
          : `${input.citationStyle} citation style`,
      requiredSections: [
        `Opening and ${genreLabels.centralClaimLabel.toLowerCase()}`,
        genreLabels.evidenceLabel,
        ...(requiresCounterargument ? ["Counterargument"] : []),
        "Conclusion",
      ],
      specialInstructions: [
        ...(input.noRubric
          ? ["Reviewed using general college writing standards"]
          : ["Checked against the provided rubric"]),
        ...(input.dueDate ? [`Due date noted: ${input.dueDate}`] : []),
      ],
    },
    scoreBreakdown,
    missingRequirements,
    rubricBreakdown: [
      {
        category: `${genreLabels.centralClaimLabel} and purpose`,
        status: thesisIsClear ? "strong" : "needs_work",
        scoreEstimate: scoreBreakdown.thesisClarity ?? 0,
        feedback: thesisIsClear
          ? "A position is visible early and gives the draft a clear direction."
          : "The opening suggests a topic, but the controlling claim may not be specific enough.",
        suggestedFix:
          "Make the central claim debatable, specific, and broad enough to govern every body paragraph.",
      },
      {
        category: genreLabels.evidenceLabel,
        status:
          (scoreBreakdown.evidenceQuality ?? 0) >= 80 ? "okay" : "needs_work",
        scoreEstimate: scoreBreakdown.evidenceQuality ?? 0,
        feedback: hasCitation
          ? "Some source use is visible; the key question is whether each source is interpreted rather than dropped in."
          : requiresSources
            ? "The draft needs clearer source support or more visible citation signals."
            : "The draft would benefit from more specific detail and fuller explanation of its examples.",
        suggestedFix: requiresSources
          ? `After each important piece of evidence, explain how it supports the paragraph claim and the ${genreLabels.centralClaimLabel.toLowerCase()}.`
          : "After each important example, explain what it shows and why it matters to the central point.",
      },
      {
        category: "Organization",
        status: paragraphs.length >= 4 ? "okay" : "needs_work",
        scoreEstimate: scoreBreakdown.organization ?? 0,
        feedback:
          "The draft has a recognizable progression, though paragraph roles could be more explicit.",
        suggestedFix:
          "Give each paragraph one job and use topic sentences that show how the section advances the argument.",
      },
      ...(requiresSources
        ? [
            {
              category: "Citation and formatting",
              status:
                hasCitation && hasReferenceList
                  ? ("strong" as const)
                  : ("needs_work" as const),
              scoreEstimate: scoreBreakdown.citationSafety ?? 0,
              feedback:
                "Citation pattern detection is only a warning system and cannot verify source accuracy.",
              suggestedFix:
                "Cross-check in-text citations, source entries, spacing, headings, and page formatting against your professor's instructions.",
            },
          ]
        : []),
    ],
    thesisFeedback: {
      label: genreLabels.centralClaimLabel,
      detectedThesis: thesis || "No confident thesis candidate detected.",
      clarityScore: scoreBreakdown.thesisClarity ?? 0,
      feedback: thesisIsClear
        ? "The thesis states a position and gives readers a useful sense of the essay's reasoning."
        : "The likely thesis may be too broad, descriptive, or difficult to distinguish from background context.",
      improvementDirection: `Consider sharpening the ${genreLabels.centralClaimLabel.toLowerCase()}, the main support behind it, and why it matters. Keep the final wording in your own voice.`,
    },
    structureMap: [
      {
        section: "Introduction",
        detected: paragraphs.length > 0,
        notes:
          "Opening context is present; confirm that it leads efficiently to the thesis.",
      },
      {
        section: genreLabels.centralClaimLabel,
        detected: thesisIsClear,
        notes: thesisIsClear
          ? "A likely thesis appears in the opening."
          : "Revise the opening so one sentence clearly controls the argument.",
      },
      {
        section: "Body development",
        detected: paragraphs.length >= 3,
        notes: `${Math.max(0, paragraphs.length - 2)} likely body sections detected.`,
      },
      ...(requiresCounterargument
        ? [
            {
              section: "Counterargument",
              detected: hasCounterargument,
              notes: "The prompt appears to require an opposing view.",
            },
          ]
        : []),
      {
        section: "Conclusion",
        detected: hasConclusion,
        notes: hasConclusion
          ? "A closing signal is present."
          : "Add a final synthesis and explain why the argument matters.",
      },
    ],
    evidenceAnalysis: [
      {
        issue: hasCitation
          ? "At least one citation signal is present, but analysis depth may vary across paragraphs."
          : requiresSources
            ? "Major claims are not consistently paired with visible source support."
            : "Examples and details may need fuller interpretation in some sections.",
        paragraphReference:
          paragraphs.length > 2 ? "Body paragraphs" : undefined,
        severity: requiresSources
          ? issueSeverity(hasCitation, "medium", "high")
          : "medium",
        suggestedFix: requiresSources
          ? "Use a claim-evidence-analysis pattern: make the point, present specific support, then explain its significance."
          : "Use a point-example-reflection pattern: state the idea, give a specific detail, then explain its significance.",
      },
      {
        issue:
          "Check whether each paragraph connects its evidence back to the thesis rather than ending on a quotation or fact.",
        severity: "medium",
        suggestedFix:
          "Add your interpretation after source material and name the connection to the paragraph's claim.",
      },
    ],
    citationWarnings,
    formattingWarnings: [
      {
        warning:
          "Plain-text review cannot reliably verify margins, font, line spacing, page numbers, or hanging indents.",
        severity: "low",
        suggestedFix:
          "Compare the formatted document against the assignment sheet immediately before export.",
      },
      ...(wordRequirement && wordCount < targetWordCount * 0.88
        ? [
            {
              warning: `Current draft length is approximately ${wordCount} words.`,
              severity: "high" as const,
              suggestedFix:
                "Confirm the final word count in your document editor and prioritize underdeveloped analysis.",
            },
          ]
        : []),
    ],
    priorityFixes: (missingRequirements.length
      ? missingRequirements.slice(0, 3).map((item) => ({
          fix: item.suggestedFix,
          estimatedImpact: item.severity,
        }))
      : [
          {
            fix: "Do one final line-by-line comparison with the assignment instructions before submitting.",
            estimatedImpact: "low" as const,
          },
        ]
    ).map((item, index) => ({
      rank: index + 1,
      ...item,
      timeEstimate: index === 0 ? "15-25 min" : "10-15 min",
    })),
    finalChecklist: [
      {
        item: `The ${genreLabels.centralClaimLabel.toLowerCase()} is specific and clearly guides the draft.`,
        status: thesisIsClear ? "complete" : "needs_work",
      },
      {
        item: "Every prompt requirement has a visible response in the draft.",
        status:
          missingRequirements[0]?.severity === "low"
            ? "complete"
            : "needs_work",
      },
      ...(requiresSources
        ? [
            {
              item: "Source-based claims have in-text citations.",
              status: hasCitation
                ? ("complete" as const)
                : ("missing" as const),
            },
            {
              item: "In-text citations match the source list.",
              status:
                hasCitation && hasReferenceList
                  ? ("complete" as const)
                  : ("needs_work" as const),
            },
          ]
        : []),
      {
        item: "The conclusion synthesizes the argument and its significance.",
        status: hasConclusion ? "complete" : "missing",
      },
      {
        item: "Final formatting matches the professor's instructions.",
        status: "needs_work",
      },
    ],
    dueTonightPlan: input.dueTonight
      ? {
          fifteenMinuteFixes: [
            "Compare the draft to every explicit prompt requirement.",
            `Strengthen the ${genreLabels.centralClaimLabel.toLowerCase()} and section openings.`,
            ...(requiresSources ? ["Fix missing in-text citations."] : []),
          ],
          thirtyMinuteFixes: [
            `Add analysis after the weakest ${genreLabels.evidenceLabel.toLowerCase()}.`,
            ...(requiresSources
              ? ["Complete the source list and match every citation."]
              : ["Develop the least specific example or reflection."]),
          ],
          sixtyMinuteFixes: [
            "Revise paragraph order and transitions.",
            "Read the full essay aloud for clarity and repetition.",
          ],
          skipIfNoTime: [
            "Cosmetic word swaps that do not improve meaning.",
            "Reformatting beyond the professor's stated requirements.",
          ],
        }
      : undefined,
    disclaimer:
      "Yessay provides revision guidance and possible issue flags. It does not guarantee grades or replace your professor's instructions.",
    locked: options?.locked ?? true,
  };
}

export function createSampleReport(locked = false) {
  return {
    ...createMockReport(sampleInput, { id: "sample-report", locked }),
    analysisMode: "sample" as const,
  };
}
