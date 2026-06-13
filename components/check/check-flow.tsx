"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CalendarDays,
  FileInput,
  FlaskConical,
  LoaderCircle,
  LockKeyhole,
  MoonStar,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { AcademicIntegrityNotice } from "@/components/shared/academic-integrity-notice";
import { GlassCard } from "@/components/ui/glass-card";
import { trackEvent } from "@/lib/analytics";
import { sampleInput } from "@/lib/analysis/mock-analysis";
import { deadlineFromTime, formatRemaining, hoursUntil } from "@/lib/deadline";
import { redeemPromoCode } from "@/lib/payments/redeem-promo";
import {
  consumeReportCredit,
  hasActiveFullAccess,
  hasReportCredit,
} from "@/lib/storage/local-access";
import {
  clearCheckDraft,
  getCheckDraft,
  saveCheckDraft,
} from "@/lib/storage/local-check-draft";
import { getReports, saveReport } from "@/lib/storage/local-reports";
import type { AnalysisInput, AnalysisReport } from "@/lib/types";
import { assignmentTypes, citationStyles } from "@/lib/types";
import { LoadingAnalysis } from "./loading-analysis";
import { Stepper } from "./stepper";
import { TextAreaWithCounter } from "./text-area-with-counter";

const emptyForm: AnalysisInput = {
  assignmentPrompt: "",
  rubric: "",
  noRubric: false,
  draft: "",
  assignmentType: "Argumentative Essay",
  citationStyle: "Auto-detect",
  dueDate: "",
  dueTonight: false,
};

export function CheckFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<AnalysisInput>(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [restored, setRestored] = useState(false);
  const [fullAccess, setFullAccess] = useState(false);
  const [reportCredit, setReportCredit] = useState(false);
  const [previewUsed, setPreviewUsed] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [unlockNotice, setUnlockNotice] = useState("");
  const hasContent = Boolean(
    form.assignmentPrompt.trim() || form.rubric?.trim() || form.draft.trim(),
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = getCheckDraft();
      setFullAccess(hasActiveFullAccess());
      setReportCredit(hasReportCredit());
      setPreviewUsed(getReports().length > 0);
      if (saved) {
        setForm(saved.form);
        setStep(Math.min(3, Math.max(1, saved.step)));
        setRestored(
          Boolean(
            saved.form.assignmentPrompt.trim() ||
            saved.form.rubric?.trim() ||
            saved.form.draft.trim(),
          ),
        );
      }
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated || loading) return;

    const timer = window.setTimeout(() => {
      saveCheckDraft(form, step);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [form, hydrated, loading, step]);

  const setField = <K extends keyof AnalysisInput>(
    field: K,
    value: AnalysisInput[K],
  ) => setForm((current) => ({ ...current, [field]: value }));

  const addExtractedText = (
    field: "assignmentPrompt" | "rubric" | "draft",
    text: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: current[field]?.trim() ? `${current[field]}\n\n${text}` : text,
    }));
    setError("");
  };

  const validateStep = () => {
    if (step === 1 && form.assignmentPrompt.trim().length < 20) {
      setError("Paste enough of the assignment prompt to review.");
      return false;
    }
    if (
      step === 2 &&
      !form.noRubric &&
      (!form.rubric || form.rubric.trim().length < 10)
    ) {
      setError("Paste the rubric or select “I don’t have a rubric.”");
      return false;
    }
    if (step === 3 && form.draft.trim().length < 80) {
      setError("Paste a longer draft before analyzing.");
      return false;
    }
    setError("");
    return true;
  };

  const next = () => {
    if (validateStep()) setStep((current) => Math.min(3, current + 1));
  };

  const fillSample = () => {
    setForm(sampleInput);
    setStep(1);
    setError("");
    setRestored(false);
  };

  const startOver = () => {
    if (
      !window.confirm(
        "Start a new check? This will clear the assignment, rubric, and draft saved on this device.",
      )
    ) {
      return;
    }
    clearCheckDraft();
    setForm(emptyForm);
    setStep(1);
    setError("");
    setRestored(false);
  };

  const analyze = async (access?: {
    fullAccess?: boolean;
    reportCredit?: boolean;
    notice?: string;
  }) => {
    if (!validateStep()) return;
    const effectiveFullAccess = access?.fullAccess ?? fullAccess;
    const effectiveReportCredit = access?.reportCredit ?? reportCredit;
    if (previewUsed && !effectiveFullAccess && !effectiveReportCredit) {
      setGateOpen(true);
      return;
    }
    setUnlockNotice(access?.notice || "");
    setLoading(true);
    setError("");
    // Deadline math happens on-device; the API only sees hours remaining.
    const deadline = form.dueTonight
      ? deadlineFromTime(form.dueTime || "23:59")
      : null;
    const hoursUntilDeadline = deadline
      ? Math.min(Math.max(Math.round(hoursUntil(deadline) * 4) / 4, 0.25), 48)
      : undefined;
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, hoursUntilDeadline }),
      });
      const data = (await response.json()) as
        | AnalysisReport
        | { error: string };
      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Analysis failed.");
      }
      const report: AnalysisReport = {
        ...data,
        locked: effectiveFullAccess || effectiveReportCredit
          ? false
          : data.locked,
        deadlineAt: deadline?.toISOString(),
        source: {
          assignmentPrompt: form.assignmentPrompt,
          rubric: form.noRubric ? undefined : form.rubric,
          draft: form.draft,
          assignmentType: form.assignmentType,
          citationStyle: form.citationStyle,
        },
      };
      saveReport(report);
      trackEvent("analysis_completed", {
        assignmentType: form.assignmentType,
        unlocked: !report.locked,
      });
      if (!effectiveFullAccess && effectiveReportCredit && consumeReportCredit()) {
        setReportCredit(false);
      }
      setPreviewUsed(true);
      clearCheckDraft();
      router.push(`/report/${report.id}`);
    } catch (analysisError) {
      setLoading(false);
      setError(
        analysisError instanceof Error
          ? analysisError.message
          : "We couldn't analyze the draft. Please try again.",
      );
    }
  };

  const redeemInline = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!promoCode.trim() || promoLoading) return;
    // Don't spend a code on a draft that won't pass validation.
    if (!validateStep()) return;

    setPromoLoading(true);
    setPromoError("");
    try {
      const redemption = await redeemPromoCode(promoCode.trim());
      if (redemption.product === "draft_repair") {
        setPromoError(
          "That code unlocks AI draft repair, not a new analysis. Use it on a report's repair panel.",
        );
        setPromoLoading(false);
        return;
      }
      trackEvent("promo_redeemed", {
        location: "check",
        product: redemption.product,
      });
      const grantsFullAccess = redemption.product !== "single_report";
      if (grantsFullAccess) setFullAccess(true);
      else setReportCredit(true);
      setPromoCode("");
      setGateOpen(false);
      setPromoLoading(false);
      await analyze({
        fullAccess: grantsFullAccess,
        reportCredit: !grantsFullAccess,
        notice: "Promo applied · access unlocked",
      });
    } catch (redeemError) {
      setPromoError(
        redeemError instanceof Error
          ? redeemError.message
          : "That promo code isn't valid.",
      );
      setPromoLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingAnalysis notice={unlockNotice} />}
      <div className="page-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <GlassCard className="min-h-[650px] p-5 sm:p-8">
          <div className="flex flex-col gap-5 border-b border-[#171912]/12 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="eyebrow">New essay check</p>
              <h1 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] text-[#171912] sm:text-4xl">
                Check your draft against the assignment.
              </h1>
              {hasContent && (
                <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#6c7065]">
                  <CheckCircle2 size={14} className="text-[#617c12]" />
                  {restored
                    ? "Previous work restored and autosaved on this device."
                    : "Your work is autosaved on this device."}
                </p>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              {hasContent && (
                <button
                  type="button"
                  onClick={startOver}
                  className="secondary-button min-h-10 px-3.5 text-xs"
                >
                  <RotateCcw size={15} />
                  Start over
                </button>
              )}
              <button
                type="button"
                onClick={fillSample}
                className="secondary-button min-h-10 px-3.5 text-xs"
              >
                <FlaskConical size={15} />
                Use sample
              </button>
            </div>
          </div>

          <div className="mt-6">
            <Stepper
              step={step}
              onStepChange={(nextStep) => {
                if (nextStep <= step) {
                  setError("");
                  setStep(nextStep);
                }
              }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-8"
            >
              {step === 1 && (
                <div>
                  <TextAreaWithCounter
                    label="Assignment prompt"
                    hint="Required"
                    placeholder="Paste your professor’s assignment instructions here..."
                    value={form.assignmentPrompt}
                    uploadLabel="assignment"
                    onTextExtracted={(text) =>
                      addExtractedText("assignmentPrompt", text)
                    }
                    onChange={(event) =>
                      setField("assignmentPrompt", event.target.value)
                    }
                  />
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <label>
                      <span className="text-sm font-bold text-[#171912]">
                        Assignment type
                      </span>
                      <select
                        value={form.assignmentType}
                        onChange={(event) =>
                          setField("assignmentType", event.target.value)
                        }
                        className="field mt-2 h-12 px-3 text-sm"
                      >
                        {assignmentTypes.map((type) => (
                          <option key={type}>{type}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="text-sm font-bold text-[#171912]">
                        Citation style
                      </span>
                      <select
                        value={form.citationStyle}
                        onChange={(event) =>
                          setField("citationStyle", event.target.value)
                        }
                        className="field mt-2 h-12 px-3 text-sm"
                      >
                        {citationStyles.map((style) => (
                          <option key={style}>{style}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="text-sm font-bold text-[#171912]">
                        Due date
                      </span>
                      <span className="field mt-2 flex h-12 items-center gap-2 px-3">
                        <CalendarDays size={16} className="text-[#7c8798]" />
                        <input
                          type="date"
                          value={form.dueDate}
                          onChange={(event) =>
                            setField("dueDate", event.target.value)
                          }
                          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                        />
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <label className="mb-4 flex cursor-pointer items-center justify-between gap-4 rounded-[18px] border border-[#171912]/14 bg-[#eff9d4] p-4">
                    <span>
                      <span className="block text-sm font-extrabold text-[#171912]">
                        I don&apos;t have a rubric
                      </span>
                      <span className="mt-1 block text-xs text-[#6c7065]">
                        Use general college writing standards instead.
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={form.noRubric}
                      onChange={(event) =>
                        setField("noRubric", event.target.checked)
                      }
                      className="size-5 accent-[#171912]"
                    />
                  </label>
                  <TextAreaWithCounter
                    label="Grading rubric"
                    hint={
                      form.noRubric ? "Using general standards" : "Required"
                    }
                    placeholder="Paste the grading rubric here..."
                    value={form.rubric}
                    uploadLabel="rubric"
                    onTextExtracted={(text) => addExtractedText("rubric", text)}
                    disabled={form.noRubric}
                    className={
                      form.noRubric ? "cursor-not-allowed opacity-45" : ""
                    }
                    onChange={(event) => setField("rubric", event.target.value)}
                  />
                </div>
              )}

              {step === 3 && (
                <div>
                  <TextAreaWithCounter
                    label="Essay draft"
                    hint="Required"
                    placeholder="Paste your essay draft here..."
                    value={form.draft}
                    showWords
                    uploadLabel="draft"
                    onTextExtracted={(text) => addExtractedText("draft", text)}
                    className="min-h-80"
                    onChange={(event) => setField("draft", event.target.value)}
                  />
                  <div className="mt-4 rounded-[18px] border border-[#171912] bg-[#cfc3ff] shadow-[0_4px_0_#171912]">
                    <label className="flex cursor-pointer items-center justify-between gap-4 p-4">
                      <span className="flex items-start gap-3">
                        <span className="flex size-9 items-center justify-center rounded-xl border border-[#171912] bg-white text-[#171912]">
                          <MoonStar size={18} />
                        </span>
                        <span>
                          <span className="block text-sm font-extrabold text-[#171912]">
                            Due Tonight Mode
                          </span>
                          <span className="mt-1 block text-xs text-[#55594f]">
                            A step-by-step plan sized to the hours you actually
                            have left.
                          </span>
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        checked={form.dueTonight}
                        onChange={(event) =>
                          setField("dueTonight", event.target.checked)
                        }
                        className="size-5 accent-[#171912]"
                      />
                    </label>
                    {form.dueTonight && (
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#171912]/25 px-4 py-3">
                        <label className="flex items-center gap-3">
                          <span className="text-xs font-extrabold text-[#171912]">
                            Deadline tonight
                          </span>
                          <input
                            type="time"
                            value={form.dueTime || "23:59"}
                            onChange={(event) =>
                              setField("dueTime", event.target.value)
                            }
                            className="h-10 rounded-xl border border-[#171912]/40 bg-white px-3 text-sm font-bold text-[#171912] focus:border-[#171912] focus:outline-none"
                          />
                        </label>
                        <span className="text-xs font-semibold text-[#55594f]">
                          {formatRemaining(
                            deadlineFromTime(form.dueTime || "23:59"),
                          )}{" "}
                          from now
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-[#efcfd6] bg-[#fbebee] px-4 py-3 text-sm text-[#934157]"
            >
              {error}
            </div>
          )}

          {gateOpen && step === 3 && (
            <div className="mt-5 rounded-2xl border border-[#171912]/15 bg-[#f6f1e8] p-5">
              <div className="flex items-center gap-2">
                <LockKeyhole size={15} className="text-[#171912]" />
                <p className="text-sm font-extrabold text-[#171912]">
                  Unlock to analyze this draft
                </p>
              </div>
              <p className="mt-1.5 text-xs leading-5 text-[#6c7065]">
                Have a promo code? Apply it here and your full analysis starts
                right away.
              </p>
              <form onSubmit={redeemInline} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(event) => setPromoCode(event.target.value)}
                  placeholder="Enter your code"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  className="h-11 min-w-0 flex-1 rounded-xl border border-[#171912]/18 bg-white px-3.5 text-sm font-semibold uppercase tracking-wide text-[#171912] placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-[#9a9e93] focus:border-[#617c12] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={promoLoading || !promoCode.trim()}
                  className="flex h-11 items-center gap-2 rounded-xl border border-[#171912] bg-[#c8f85a] px-4 text-sm font-extrabold text-[#171912] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {promoLoading ? (
                    <LoaderCircle size={15} className="animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </button>
              </form>
              {promoError && (
                <p role="alert" className="mt-2 text-xs leading-5 text-[#98485c]">
                  {promoError}
                </p>
              )}
              <p className="mt-3 text-xs text-[#6c7065]">
                Or{" "}
                <Link
                  href="/pricing"
                  className="font-bold text-[#617c12] underline-offset-2 hover:underline"
                >
                  see all access options
                </Link>
                .
              </p>
            </div>
          )}

          <div className="mt-7 flex items-center justify-between border-t border-[#171912]/12 pt-5">
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep((current) => Math.max(1, current - 1));
              }}
              disabled={step === 1}
              className="secondary-button min-h-11 px-4 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={next}
                className="primary-button min-h-11"
              >
                Continue
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => analyze()}
                className="primary-button min-h-11"
              >
                {previewUsed && !fullAccess && !reportCredit ? (
                  <LockKeyhole size={17} />
                ) : (
                  <FileInput size={17} />
                )}
                {previewUsed && !fullAccess && !reportCredit
                  ? "Unlock to Analyze"
                  : fullAccess || reportCredit
                    ? "Analyze Full Report"
                    : "Analyze & See My Score"}
              </button>
            )}
          </div>
        </GlassCard>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <AcademicIntegrityNotice compact />
          <GlassCard subtle className="p-5">
            <p className="text-sm font-extrabold text-[#171912]">
              What you see before payment
            </p>
            <p className="mt-2 text-sm leading-6 text-[#6c7065]">
              Your first analysis preview is free. You&apos;ll see the readiness
              score and issue count; exact findings, revision steps, and
              additional analyses require paid access.
            </p>
          </GlassCard>
          <GlassCard subtle className="p-5">
            <p className="text-sm font-extrabold text-[#171912]">
              What Yessay checks
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-5 text-[#6c7065]">
              {[
                "Prompt and rubric alignment",
                "Thesis clarity and organization",
                "Evidence and citation signals",
                "Priority fixes and final checklist",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#8caf25]" />
                  {item}
                </li>
              ))}
            </ul>
          </GlassCard>
        </aside>
      </div>
    </>
  );
}
