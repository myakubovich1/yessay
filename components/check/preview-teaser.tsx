"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FileText, Wand2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const TARGET_SCORE = 100;
const RADIUS = 40;
const CIRC = 2 * Math.PI * RADIUS;

/**
 * Aspirational value card: a readiness gauge that climbs from 0 to 100,
 * framed as the difference Yessay makes ("0 without us, 100 with us"), plus
 * what the student gets. Deliberately no paywall, access, or pricing copy.
 */
export function PreviewTeaser() {
  const reduced = useReducedMotion();
  const [score, setScore] = useState(reduced ? TARGET_SCORE : 0);

  useEffect(() => {
    if (reduced) return;
    const duration = 1400;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setScore(Math.round(eased * TARGET_SCORE));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  return (
    <GlassCard subtle className="p-5">
      <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-[#7c8064]">
        With Yessay
      </p>

      <div className="mt-4 flex flex-col items-center">
        <div className="relative size-[120px]">
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
              initial={{ strokeDashoffset: reduced ? 0 : CIRC }}
              animate={{ strokeDashoffset: 0 }}
              transition={
                reduced ? { duration: 0 } : { duration: 1.4, ease: "easeOut" }
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
            <span className="text-4xl font-black tracking-[-0.05em] text-[#171912]">
              {score}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#777a70]">
              ready
            </span>
          </div>
        </div>

        <div className="mt-4 flex w-full items-center justify-between text-[11px] font-bold">
          <span className="text-[#a2a597]">0 · without us</span>
          <span className="text-[#5a7034]">100 · with us</span>
        </div>
      </div>

      <div className="mt-5 space-y-3 border-t border-[#171912]/10 pt-4">
        <ValueRow icon={<FileText size={15} />}>
          Unlock the full report on your essay
        </ValueRow>
        <ValueRow icon={<Wand2 size={15} />}>
          Let us help you rewrite it
        </ValueRow>
      </div>
    </GlassCard>
  );
}

function ValueRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-[#171912] bg-[#c8f85a] text-[#171912]">
        {icon}
      </span>
      <span className="text-sm font-semibold leading-5 text-[#3c4133]">
        {children}
      </span>
    </div>
  );
}
