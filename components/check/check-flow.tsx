"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CalendarDays,
  FileInput,
  FlaskConical,
  LockKeyhole,
  MoonStar,
  RotateCcw,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { getReportFunnelProperties, trackEvent } from "@/lib/analytics";
import {
  MAX_DRAFT_WORDS,
  OVER_LIMIT_MESSAGE,
  countWords,
} from "@/lib/analysis/limits";
import { sampleInput } from "@/lib/analysis/mock-analysis";
import { deadlineFromTime, formatRemaining, hoursUntil } from "@/lib/deadline";
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
import { PreviewTeaser } from "./preview-teaser";
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
    if (step === 3 && countWords(form.draft) > MAX_DRAFT_WORDS) {
      setError(OVER_LIMIT_MESSAGE);
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

  const analyze = async () => {
    if (!validateStep()) return;
    if (previewUsed && !fullAccess && !reportCredit) {
      router.push("/pricing");
      return;
    }
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
        locked: fullAccess || reportCredit ? false : data.locked,
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
        unlocked: !report.locked,
        ...getReportFunnelProperties(report),
      });
      if (!fullAccess && reportCredit && consumeReportCredit()) {
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

  return (
    <>
      {loading && <LoadingAnalysis />}
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

          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
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
                  {countWords(form.draft) > MAX_DRAFT_WORDS ? (
                    <p
                      role="alert"
                      className="mt-2 rounded-xl border border-[#efcfd6] bg-[#fbebee] px-3.5 py-2.5 text-xs leading-5 text-[#934157]"
                    >
                      This draft is{" "}
                      {countWords(form.draft).toLocaleString()} words —
                      over the {MAX_DRAFT_WORDS.toLocaleString()}-word limit
                      for one analysis. Split it into sections and check each
                      separately.
                    </p>
                  ) : (
                    <p className="mt-2 text-xs leading-5 text-[#85887f]">
                      Up to {MAX_DRAFT_WORDS.toLocaleString()} words per check.
                      Longer essays should be split into sections and analyzed
                      one at a time.
                    </p>
                  )}
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

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-[#efcfd6] bg-[#fbebee] px-4 py-3 text-sm text-[#934157]"
            >
              {error}
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
          <PreviewTeaser />
          <GlassCard subtle className="p-5">
            <p className="text-sm font-extrabold text-[#171912]">
              What Yessay checks
            </p>
            <ul className="mt-4 space-y-2.5 text-sm leading-5 text-[#6c7065]">
              {[
                "Prompt and rubric alignment",
                "Thesis clarity and organization",
                "Evidence and citation signals",
                "Priority fixes and final checklist",
              ].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.08, duration: 0.3 }}
                  className="flex gap-2"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#8caf25]" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </GlassCard>
        </aside>
      </div>
    </>
  );
}
