"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, LoaderCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const tasks = [
  "Reading assignment prompt",
  "Extracting rubric categories",
  "Checking thesis clarity",
  "Scanning citation consistency",
  "Building priority fix list",
  "Preparing your Yessay report",
];

export function LoadingAnalysis() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => Math.min(current + 1, tasks.length - 1));
    }, 850);
    return () => window.clearInterval(timer);
  }, []);

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
              Building a focused revision plan
            </p>
          </div>
        </div>
        <div className="mt-7 h-2 overflow-hidden rounded-full bg-[#dedbd2]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#b8ed42] via-[#c8f85a] to-[#ff8b5e]"
            animate={{ width: `${((active + 1) / tasks.length) * 100}%` }}
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
      </GlassCard>
    </div>
  );
}
