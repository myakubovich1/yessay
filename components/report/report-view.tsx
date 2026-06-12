"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  BookOpenCheck,
  Check,
  CheckCircle2,
  Clipboard,
  ClipboardCheck,
  Clock3,
  Download,
  FileQuestion,
  FileText,
  ListChecks,
  LockKeyhole,
  LoaderCircle,
  Quote,
  Rows3,
  ScanLine,
  ShieldAlert,
  Sparkles,
  Target,
  Unlock,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { createSampleReport } from "@/lib/analysis/mock-analysis";
import { singleReportPrice } from "@/lib/pricing";
import {
  getChecklistProgress,
  getReport,
  saveChecklistProgress,
} from "@/lib/storage/local-reports";
import { getRevision } from "@/lib/storage/local-revisions";
import type {
  AnalysisReport,
  DraftRevision,
  PricingProduct,
} from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { AcademicIntegrityNotice } from "@/components/shared/academic-integrity-notice";
import { EmptyState } from "@/components/shared/empty-state";
import { GlassCard } from "@/components/ui/glass-card";
import { ChecklistItem } from "./checklist-item";
import { LockedSection } from "./locked-section";
import { MobileRepairBar } from "./mobile-repair-bar";
import { RepairPanel } from "./repair-panel";
import { ReportSection } from "./report-section";
import { ReportPaywall } from "./report-paywall";
import { RevisionSection } from "./revision-section";
import { ScoreRing } from "./score-ring";
import { SeverityBadge } from "./severity-badge";
import { StatusBadge } from "./status-badge";
import { useDraftRepair } from "./use-draft-repair";

const scoreLabels: Record<
  keyof AnalysisReport["scoreBreakdown"],
  { label: string; icon: typeof Target }
> = {
  promptMatch: { label: "Prompt Match", icon: Target },
  rubricMatch: { label: "Rubric Match", icon: BookOpenCheck },
  thesisClarity: { label: "Thesis Clarity", icon: Quote },
  evidenceQuality: { label: "Evidence Quality", icon: ScanLine },
  organization: { label: "Organization", icon: Rows3 },
  citationSafety: { label: "Citation Safety", icon: ShieldAlert },
  grammarClarity: { label: "Grammar / Clarity", icon: CheckCircle2 },
};

const analysisModeLabels = {
  openai: {
    label: "AI-assisted review",
    icon: Sparkles,
  },
  fallback: {
    label: "Local fallback review",
    icon: FileText,
  },
  sample: {
    label: "Sample report",
    icon: ClipboardCheck,
  },
} satisfies Record<
  NonNullable<AnalysisReport["analysisMode"]>,
  { label: string; icon: typeof FileText }
>;

export function ReportView({ reportId }: { reportId: string }) {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<PricingProduct | null>(
    null,
  );
  const [copyLabel, setCopyLabel] = useState("Copy Report");
  const [checkoutError, setCheckoutError] = useState("");
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [revision, setRevision] = useState<DraftRevision | null>(null);
  const repair = useDraftRepair(report, setRevision);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const value =
        reportId === "sample-report"
          ? createSampleReport(false)
          : getReport(reportId) || null;
      setReport(value);
      setCheckedItems(getChecklistProgress(reportId));
      setRevision(getRevision(reportId));
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [reportId]);

  const issueCount = useMemo(() => {
    if (!report) return 0;
    return (
      report.missingRequirements.length +
      report.citationWarnings.length +
      report.formattingWarnings.length
    );
  }, [report]);

  const checkout = async (product: PricingProduct) => {
    setCheckoutLoading(product);
    setCheckoutError("");
    trackEvent("checkout_started", { product, location: "report" });
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, reportId }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Checkout is unavailable.");
      }
      window.location.href = data.url;
    } catch (error) {
      setCheckoutLoading(null);
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Checkout is unavailable. Please try again.",
      );
    }
  };

  const copyReport = async () => {
    if (!report) return;
    const text = report.locked
      ? [
          `Yessay Score: ${report.overallScore}/100 (${report.readinessStatus})`,
          `${issueCount} possible issues flagged`,
          "",
          report.disclaimer,
        ].join("\n")
      : [
          `Yessay Score: ${report.overallScore}/100 (${report.readinessStatus})`,
          report.executiveSummary,
          "",
          "Priority fixes:",
          ...report.priorityFixes.map((item) => `${item.rank}. ${item.fix}`),
          "",
          "Final checklist:",
          ...report.finalChecklist.map(
            (item) =>
              `- [${checkedItems.includes(item.item) ? "x" : " "}] ${item.item}`,
          ),
          "",
          report.disclaimer,
        ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopyLabel("Copied");
    } catch {
      setCopyLabel("Copy unavailable");
    }
    window.setTimeout(() => setCopyLabel("Copy Report"), 1600);
  };

  if (!loaded) {
    return (
      <div className="page-shell pt-28">
        <GlassCard className="h-72 animate-pulse" />
      </div>
    );
  }

  if (!report) {
    return (
      <main className="min-h-screen pb-20 pt-28">
        <div className="page-shell">
          <EmptyState
            title="Report not found"
            description="This report may have been created in a different browser or removed from local storage."
          />
        </div>
      </main>
    );
  }

  const criterionLabels = report.criterionLabels;
  const analysisMode = report.analysisMode
    ? analysisModeLabels[report.analysisMode]
    : null;
  const visibleCopyLabel =
    copyLabel === "Copy Report" && report.locked ? "Copy Score" : copyLabel;

  const setChecklistItem = (item: string, checked: boolean) => {
    const updated = checked
      ? [...new Set([...checkedItems, item])]
      : checkedItems.filter((value) => value !== item);
    setCheckedItems(updated);
    saveChecklistProgress(reportId, updated);
  };

  return (
    <main className="min-h-screen bg-[#f6f1e8] pb-28 pt-28 sm:pt-32">
      <div className="page-shell">
        {checkoutError && (
          <div
            role="alert"
            className="no-print fixed right-4 top-20 z-[55] max-w-sm rounded-xl border border-[#efcfd6] bg-[#fff4f5] px-4 py-3 text-sm text-[#934157] shadow-xl"
          >
            {checkoutError}
          </div>
        )}
        <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#6c7065] hover:text-[#171912]"
          >
            <ArrowLeft size={16} />
            All reports
          </Link>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={copyReport}
              className="secondary-button min-h-10 px-3.5 text-xs"
            >
              <Clipboard size={15} />
              {visibleCopyLabel}
            </button>
            {!report.locked && (
              <button
                type="button"
                onClick={() => window.print()}
                className="secondary-button min-h-10 px-3.5 text-xs"
              >
                <Download size={15} />
                Download PDF
              </button>
            )}
          </div>
        </div>

        <GlassCard className="overflow-hidden p-0">
          <div className="grid gap-8 bg-[#fffdf8] p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={report.readinessStatus} />
                <span className="text-xs text-[#777a70]">
                  {formatDate(report.createdAt)}
                </span>
                {report.locked && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e2d6b7] bg-[#f7efdc] px-3 py-1 text-xs font-semibold text-[#866629]">
                    <LockKeyhole size={12} />
                    Preview
                  </span>
                )}
              </div>
              <h1 className="mt-5 max-w-3xl text-balance text-4xl font-black leading-[1.05] tracking-[-0.045em] text-[#171912] sm:text-5xl">
                {report.locked ? "Your essay analysis is ready." : report.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#666a60]">
                {report.locked
                  ? `${issueCount} possible issues were found. Unlock the report to see what they are and exactly what to revise.`
                  : report.executiveSummary}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#777a70]">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  {issueCount} possible issues flagged
                </span>
                {!report.locked && (
                  <>
                    <span className="flex items-center gap-1.5">
                      <FileText size={14} />
                      Checked against{" "}
                      {report.promptSummary.specialInstructions.some((item) =>
                        item.includes("provided rubric"),
                      )
                        ? "prompt + rubric"
                        : "prompt + general standards"}
                    </span>
                    {analysisMode && (
                      <span className="flex items-center gap-1.5">
                        <analysisMode.icon size={14} />
                        {analysisMode.label}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="justify-self-center lg:justify-self-end">
              <ScoreRing score={report.overallScore} />
            </div>
          </div>
          <div className="border-t border-[#171912]/12 bg-[#eff9d4] px-6 py-4 text-xs font-medium leading-5 text-[#5f6359] sm:px-8">
            {report.disclaimer}
          </div>
        </GlassCard>

        {!report.locked && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {(
              Object.entries(report.scoreBreakdown) as [
                keyof AnalysisReport["scoreBreakdown"],
                AnalysisReport["scoreBreakdown"][keyof AnalysisReport["scoreBreakdown"]],
              ][]
            ).map(([key, value]) => {
              const item = scoreLabels[key];
              const label = criterionLabels?.[key] || item.label;
              return (
                <GlassCard key={key} subtle className="p-4">
                  <div className="flex items-center justify-between">
                    <item.icon size={17} className="text-[#617c12]" />
                    <span className="text-lg font-black text-[#171912]">
                      {value === null ? "N/A" : value}
                    </span>
                  </div>
                  <p className="mt-4 text-xs font-bold leading-4 text-[#5f6359]">
                    {label}
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#dedbd2]">
                    <div
                      className={
                        value === null
                          ? "h-full w-full rounded-full bg-[repeating-linear-gradient(90deg,#d7dde7_0,#d7dde7_5px,transparent_5px,transparent_9px)]"
                          : "h-full rounded-full bg-gradient-to-r from-[#b8ed42] to-[#ff8b5e]"
                      }
                      style={
                        value === null ? undefined : { width: `${value}%` }
                      }
                    />
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}

        {report.locked && (
          <ReportPaywall
            checkout={checkout}
            loading={checkoutLoading}
            reportId={reportId}
          />
        )}

        <div className="report-grid mt-6">
          <div className="space-y-5">
            {report.locked ? (
              <div className="locked-report-preview" aria-hidden="true">
                <div className="locked-report-preview__heading">
                  <span>Full report preview</span>
                  <LockKeyhole size={15} />
                </div>
                <LockedSection title="Rubric Breakdown" />
                <LockedSection title="Thesis & Structure" />
                <LockedSection title="Citations & Formatting" />
                <LockedSection title="Priority Fix List" />
                <LockedSection title="Final Revision Checklist" />
              </div>
            ) : (
              <>
                {revision && <RevisionSection revision={revision} />}

                <ReportSection
                  title="Prompt Snapshot"
                  description="What Yessay detected in the assignment instructions."
                  icon={<FileQuestion size={20} />}
                >
                  <p className="text-sm leading-6 text-[#465268]">
                    {report.promptSummary.detectedTask}
                  </p>
                  <dl className="mt-5 grid gap-4 border-t border-[#e2e6ed] pt-5 sm:grid-cols-3">
                    {[
                      [
                        "Length",
                        report.promptSummary.wordCountRequirement ||
                          "Not detected",
                      ],
                      [
                        "Sources",
                        report.promptSummary.sourceRequirement ||
                          "Not detected",
                      ],
                      [
                        "Format",
                        report.promptSummary.formattingRequirement ||
                          "Check prompt",
                      ],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-[10px] font-bold uppercase tracking-wider text-[#8a93a2]">
                          {label}
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-[#344158]">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </ReportSection>

                <ReportSection
                  title="Missing Requirements"
                  description="Possible gaps that may cost points if the prompt requires them."
                  icon={<AlertTriangle size={20} />}
                >
                  {report.missingRequirements.length ? (
                    <div className="space-y-3">
                      {report.missingRequirements.map((item) => (
                        <div
                          key={item.issue}
                          className="rounded-xl border border-[#e0e5ed] bg-white/55 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold leading-6 text-[#303d54]">
                              {item.issue}
                            </p>
                            <SeverityBadge severity={item.severity} />
                          </div>
                          <p className="mt-2 text-sm leading-6 text-[#6b7688]">
                            {item.whyItMatters}
                          </p>
                          <p className="mt-3 border-l-2 border-[#7288bf] pl-3 text-sm leading-6 text-[#445168]">
                            <strong>Consider revising:</strong>{" "}
                            {item.suggestedFix}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-xl border border-[#dfe6ee] bg-white/55 p-4 text-sm leading-6 text-[#657186]">
                      No explicit prompt or rubric gaps were flagged in this
                      pass.
                    </p>
                  )}
                </ReportSection>

                <ReportSection
                  title="Rubric Breakdown"
                  description="A category-by-category reading of the draft."
                  icon={<BarChart3 size={20} />}
                >
                  <div className="space-y-4">
                    {report.rubricBreakdown.map((item) => (
                      <div
                        key={item.category}
                        className="grid gap-4 border-b border-[#e2e6ed] pb-4 last:border-0 last:pb-0 sm:grid-cols-[150px_1fr]"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#344158]">
                            {item.category}
                          </p>
                          <p className="mt-1 text-xs text-[#788395]">
                            {item.scoreEstimate}/100 ·{" "}
                            {item.status.replace("_", " ")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm leading-6 text-[#626e81]">
                            {item.feedback}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[#3f4d65]">
                            <strong>Direction:</strong> {item.suggestedFix}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ReportSection>

                <ReportSection
                  title={`${report.thesisFeedback.label || "Thesis"} Feedback`}
                  description={`The draft's likely ${(
                    report.thesisFeedback.label || "thesis"
                  ).toLowerCase()} and how effectively it guides the writing.`}
                  icon={<Quote size={20} />}
                >
                  <blockquote className="border-l-2 border-[#6f7fba] pl-4 text-sm italic leading-7 text-[#3e4b61]">
                    “{report.thesisFeedback.detectedThesis}”
                  </blockquote>
                  <div className="mt-5 grid gap-5 sm:grid-cols-[110px_1fr]">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a93a2]">
                        Clarity
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-[#2b384e]">
                        {report.thesisFeedback.clarityScore}
                      </p>
                    </div>
                    <div className="text-sm leading-6 text-[#626e81]">
                      <p>{report.thesisFeedback.feedback}</p>
                      <p className="mt-3 text-[#3e4b61]">
                        <strong>Consider revising:</strong>{" "}
                        {report.thesisFeedback.improvementDirection}
                      </p>
                    </div>
                  </div>
                </ReportSection>

                <ReportSection
                  title="Structure Map"
                  description="The major essay roles detected in the current draft."
                  icon={<Rows3 size={20} />}
                >
                  <div className="space-y-1">
                    {report.structureMap.map((item) => (
                      <div
                        key={item.section}
                        className="grid gap-2 border-b border-[#e4e8ee] py-3 last:border-0 sm:grid-cols-[150px_1fr]"
                      >
                        <p className="flex items-center gap-2 text-sm font-semibold text-[#344158]">
                          <span
                            className={
                              item.detected
                                ? "flex size-5 items-center justify-center rounded-full bg-[#e1f0e8] text-[#35765f]"
                                : "flex size-5 items-center justify-center rounded-full bg-[#f6e7e9] text-[#9b465b]"
                            }
                          >
                            {item.detected ? (
                              <Check size={12} />
                            ) : (
                              <AlertTriangle size={11} />
                            )}
                          </span>
                          {item.section}
                        </p>
                        <p className="text-sm leading-6 text-[#687487]">
                          {item.notes}
                        </p>
                      </div>
                    ))}
                  </div>
                </ReportSection>

                <ReportSection
                  title="Evidence and Analysis"
                  description="Where claims may need stronger support or interpretation."
                  icon={<ScanLine size={20} />}
                >
                  <IssueList
                    items={report.evidenceAnalysis}
                    emptyMessage="No specific evidence or development warnings were returned."
                  />
                </ReportSection>

                <ReportSection
                  title="Citation Warnings"
                  description="Possible citation risks to verify against the required style."
                  icon={<ShieldAlert size={20} />}
                >
                  <IssueList
                    emptyMessage="No citation warnings were needed for this assignment."
                    items={report.citationWarnings.map((item) => ({
                      issue: item.warning,
                      severity: item.severity,
                      suggestedFix: item.suggestedFix,
                    }))}
                  />
                </ReportSection>

                <ReportSection
                  title="Formatting Warnings"
                  description="Document details that need a final check in your editor."
                  icon={<FileText size={20} />}
                >
                  <IssueList
                    emptyMessage="No formatting warnings were returned."
                    items={report.formattingWarnings.map((item) => ({
                      issue: item.warning,
                      severity: item.severity,
                      suggestedFix: item.suggestedFix,
                    }))}
                  />
                </ReportSection>

                <ReportSection
                  title="Priority Fix List"
                  description="Work from the top down for the greatest likely impact."
                  icon={<ListChecks size={20} />}
                >
                  <div className="space-y-3">
                    {report.priorityFixes.map((item) => (
                      <div
                        key={item.rank}
                        className="flex items-start gap-4 rounded-xl border border-[#e0e5ed] bg-white/55 p-4"
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#e7ecf9] text-sm font-bold text-[#4563a7]">
                          {item.rank}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold leading-6 text-[#344158]">
                            {item.fix}
                          </p>
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            <span
                              className={cn(
                                "rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold",
                                item.estimatedImpact === "high"
                                  ? "border-[#e8b7a4] bg-[#fdeee7] text-[#a04e2c]"
                                  : item.estimatedImpact === "medium"
                                    ? "border-[#e2d6a7] bg-[#faf3da] text-[#8a6d1d]"
                                    : "border-[#cfd8c2] bg-[#eef3e6] text-[#5a7034]",
                              )}
                            >
                              {item.estimatedImpact} impact
                            </span>
                            <span className="rounded-full border border-[#d8dde6] bg-white/70 px-2.5 py-0.5 text-[11px] font-bold text-[#657081]">
                              {item.timeEstimate}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ReportSection>

                <ReportSection
                  title="Final Submission Checklist"
                  description="Check each item in your actual document before uploading."
                  icon={<ClipboardCheck size={20} />}
                >
                  <p className="mb-2 text-xs font-semibold text-[#687487]">
                    {checkedItems.length} of {report.finalChecklist.length}{" "}
                    checked on this device
                  </p>
                  {report.finalChecklist.map((item) => (
                    <ChecklistItem
                      key={item.item}
                      {...item}
                      checked={checkedItems.includes(item.item)}
                      onChange={(checked) =>
                        setChecklistItem(item.item, checked)
                      }
                    />
                  ))}
                </ReportSection>

                {report.dueTonightPlan && (
                  <ReportSection
                    title="Due Tonight Plan"
                    description="Choose the time window you actually have and work in order."
                    icon={<Clock3 size={20} />}
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      {[
                        [
                          "15 minutes",
                          report.dueTonightPlan.fifteenMinuteFixes,
                        ],
                        ["30 minutes", report.dueTonightPlan.thirtyMinuteFixes],
                        ["60 minutes", report.dueTonightPlan.sixtyMinuteFixes],
                        ["Skip if no time", report.dueTonightPlan.skipIfNoTime],
                      ].map(([label, items]) => (
                        <div key={label as string}>
                          <p className="text-xs font-bold uppercase tracking-wider text-[#5e70a0]">
                            {label}
                          </p>
                          <ul className="mt-3 space-y-2">
                            {(items as string[]).map((item) => (
                              <li
                                key={item}
                                className="flex gap-2 text-sm leading-6 text-[#5d697d]"
                              >
                                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[#667fbd]" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </ReportSection>
                )}
              </>
            )}
          </div>

          <aside className="no-print space-y-4 lg:sticky lg:top-24">
            {!report.locked && (
              <>
                <RepairPanel
                  reportId={reportId}
                  revision={revision}
                  repair={repair}
                  checkout={checkout}
                  checkoutLoading={checkoutLoading}
                />
                <GlassCard subtle className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-extrabold text-[#171912]">
                      Revision progress
                    </p>
                    <span className="text-xs font-bold text-[#6c7065]">
                      {checkedItems.length}/{report.finalChecklist.length}
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#dedbd2]">
                    <div
                      className="h-full rounded-full bg-[#9fc433] transition-[width] duration-500"
                      style={{
                        width: `${
                          report.finalChecklist.length
                            ? Math.round(
                                (checkedItems.length /
                                  report.finalChecklist.length) *
                                  100,
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <p className="mt-3 text-xs leading-5 text-[#85887f]">
                    Tick checklist items as you fix them in your document.
                  </p>
                </GlassCard>
                <GlassCard subtle className="p-5">
                  <div className="flex items-center gap-3 text-[#34775f]">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-[#e1f0e9]">
                      <Sparkles size={18} />
                    </span>
                    <p className="font-semibold">Full report unlocked</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#6b7688]">
                    Use this report as a revision guide, then make every final
                    writing decision yourself.
                  </p>
                </GlassCard>
              </>
            )}
            <AcademicIntegrityNotice compact />
          </aside>
        </div>
      </div>

      <MobileRepairBar
        report={report}
        revision={revision}
        repair={repair}
        checkout={checkout}
        checkoutLoading={checkoutLoading}
      />

      {report.locked && (
        <div className="no-print fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-white bg-white/88 p-3 shadow-2xl backdrop-blur-xl lg:hidden">
          <button
            type="button"
            onClick={() => checkout("single_report")}
            disabled={checkoutLoading !== null}
            className="primary-button w-full"
          >
            {checkoutLoading === "single_report" ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Unlock size={16} />
            )}
            {checkoutLoading === "single_report"
              ? "Opening checkout..."
              : `Unlock This Report — ${singleReportPrice}`}
          </button>
        </div>
      )}
    </main>
  );
}

function IssueList({
  items,
  emptyMessage,
}: {
  items: {
    issue: string;
    severity: "high" | "medium" | "low";
    suggestedFix: string;
    paragraphReference?: string;
  }[];
  emptyMessage?: string;
}) {
  if (!items.length) {
    return (
      <p className="rounded-xl border border-[#dfe6ee] bg-white/55 p-4 text-sm leading-6 text-[#657186]">
        {emptyMessage || "No issues were returned for this section."}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={`${item.issue}-${item.paragraphReference || ""}`}
          className="rounded-xl border border-[#e0e5ed] bg-white/55 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold leading-6 text-[#344158]">
                {item.issue}
              </p>
              {item.paragraphReference && (
                <p className="mt-1 text-xs text-[#808a9a]">
                  {item.paragraphReference}
                </p>
              )}
            </div>
            <SeverityBadge severity={item.severity} />
          </div>
          <p className="mt-3 text-sm leading-6 text-[#58657a]">
            <strong>Consider revising:</strong> {item.suggestedFix}
          </p>
        </div>
      ))}
    </div>
  );
}
