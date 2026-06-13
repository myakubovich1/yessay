"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const TARGET_SCORE = 78;
const TARGET_ISSUES = 6;
const RADIUS = 40;
const CIRC = 2 * Math.PI * RADIUS;

/**
 * A live mock of the free preview: a score ring that counts up, the two
 * details shown free, and the locked findings beneath. Communicates the
 * "free score, paid details" model visually, with almost no copy.
 */
export function PreviewTeaser() {
  const reduced = useReducedMotion();
  const [score, setScore] = useState(reduced ? TARGET_SCORE : 0);
  const [issues, setIssues] = useState(reduced ? TARGET_ISSUES : 0);

  useEffect(() => {
    if (reduced) return;
    const duration = 1100;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setScore(Math.round(eased * TARGET_SCORE));
      setIssues(Math.round(eased * TARGET_ISSUES));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  return (
    <GlassCard subtle className="overflow-hidden p-5">
      <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-[#7c8064]">
        Your free preview
      </p>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative size-[88px] shrink-0">
          <svg className="size-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="rgba(23,25,18,0.12)"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="url(#preview-score)"
              strokeLinecap="round"
              strokeWidth="8"
              strokeDasharray={CIRC}
              initial={{ strokeDashoffset: CIRC }}
              animate={{
                strokeDashoffset: CIRC - (TARGET_SCORE / 100) * CIRC,
              }}
              transition={
                reduced ? { duration: 0 } : { duration: 1.1, ease: "easeOut" }
              }
            />
            <defs>
              <linearGradient id="preview-score" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#b8ed42" />
                <stop offset="72%" stopColor="#c8f85a" />
                <stop offset="100%" stopColor="#ff8b5e" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black tracking-[-0.05em] text-[#171912]">
              {score}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#777a70]">
              score
            </span>
          </div>
        </div>

        <div className="min-w-0 space-y-2.5">
          <PreviewRow label="Readiness score" />
          <PreviewRow label={`${issues} issues flagged`} />
        </div>
      </div>

      <div className="mt-4 border-t border-[#171912]/10 pt-4">
        <div className="space-y-2">
          {[100, 82, 64].map((width, index) => (
            <div
              key={width}
              className="relative h-2.5 overflow-hidden rounded-full bg-[#171912]/8"
              style={{ width: `${width}%` }}
            >
              {!reduced && (
                <motion.div
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                  initial={{ x: "-120%" }}
                  animate={{ x: "320%" }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.18,
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#6c7065]">
          <Lock size={13} className="text-[#171912]" />
          Full findings, fixes &amp; checklist unlock with access
        </p>
      </div>
    </GlassCard>
  );
}

function PreviewRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#c8f85a]">
        <Check size={11} strokeWidth={3.5} className="text-[#171912]" />
      </span>
      <span className="text-sm font-semibold text-[#3c4133]">{label}</span>
    </div>
  );
}
