"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock3, LoaderCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const tasks = [
  "Reading assignment prompt",
  "Extracting rubric categories",
  "Checking thesis clarity",
  "Scanning citation consistency",
  "Building priority fix list",
  "Preparing your Yessay report",
];

/**
 * The analysis call reports no real progress, so the bar and steps are
 * driven by elapsed time on an asymptotic curve: progress = 1 - e^(-t/tau).
 * Steps split the curve evenly, which spaces them naturally — early steps
 * move quickly, later ones take progressively longer, and nothing parks at
 * 100% while the request is still running.
 */
const TAU_MS = 35000;
const MAX_PROGRESS = 0.96;
const LONG_RUN_MS = 75000;

export function LoadingAnalysis() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      setElapsed(Date.now() - startedAt);
    }, 250);
    return () => window.clearInterval(timer);
  }, []);

  const progress = Math.min(1 - Math.exp(-elapsed / TAU_MS), MAX_PROGRESS);
  const active = Math.min(Math.floor(progress * tasks.length), tasks.length - 1);
  const longRunning = elapsed > LONG_RUN_MS;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#f6f1e8]/88 px-4 backdrop-blur-xl">
      <GlassCard className="w-full max-w-lg p-7 sm:p-9">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-[#171912] bg-[#c8f85a] text-[#171912] shadow-[0_4px_0_#171912]">
            <LoaderCircle className="animate-spin" size={23} />
          </div>
          <div>
            <p className="text-lg font-extrabold text-[#171912]">
              Reviewing your draft
            </p>
            <p className="text-sm text-[#6c7065]">
              {longRunning
                ? "Still working — long drafts take a little more time"
                : "Building a focused revision plan"}
            </p>
          </div>
        </div>
        <div className="mt-7 h-2 overflow-hidden rounded-full bg-[#dedbd2]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#b8ed42] via-[#c8f85a] to-[#ff8b5e]"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        </div>
        <div className="mt-6 space-y-3">
          {tasks.map((task, index) => (
            <div
              key={task}
              className="flex items-center gap-3 text-sm"
              aria-current={index === active ? "step" : undefined}
            >
              <span
                className={
                  index < active
                    ? "flex size-6 items-center justify-center rounded-full bg-[#c8f85a] text-[#171912]"
                    : index === active
                      ? "flex size-6 items-center justify-center rounded-full bg-[#171912] text-[#c8f85a]"
                      : "flex size-6 items-center justify-center rounded-full bg-[#e9e5dc] text-[#989b91]"
                }
              >
                {index < active ? (
                  <Check size={13} strokeWidth={2.8} />
                ) : (
                  <span className="size-1.5 rounded-full bg-current" />
                )}
              </span>
              <span
                className={
                  index <= active ? "text-[#34372f]" : "text-[#92958c]"
                }
              >
                {task}
                {index === active ? "..." : ""}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-6 flex items-center justify-center gap-1.5 border-t border-[#171912]/10 pt-5 text-center text-xs leading-5 text-[#85887f]">
          <Clock3 size={13} className="shrink-0" />
          A thorough review can take up to a few minutes. Keep this page open.
        </p>
      </GlassCard>
    </div>
  );
}
