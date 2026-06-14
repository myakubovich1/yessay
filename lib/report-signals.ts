import type { AnalysisReport, Severity } from "@/lib/types";

export type ReportIssueSummary = {
  total: number;
  high: number;
  medium: number;
  low: number;
};

export function getReportIssueSummary(
  report: AnalysisReport,
): ReportIssueSummary {
  const severities: Severity[] = [
    ...report.missingRequirements.map((item) => item.severity),
    ...report.evidenceAnalysis.map((item) => item.severity),
    ...report.citationWarnings.map((item) => item.severity),
    ...report.formattingWarnings.map((item) => item.severity),
  ];

  return severities.reduce<ReportIssueSummary>(
    (summary, severity) => ({
      ...summary,
      total: summary.total + 1,
      [severity]: summary[severity] + 1,
    }),
    { total: 0, high: 0, medium: 0, low: 0 },
  );
}
