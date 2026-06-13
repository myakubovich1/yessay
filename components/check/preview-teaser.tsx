"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FileText, Sparkles, Wand2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

/**
 * Before/after value card: a dull "0 as-is" medallion and a glowing "100
 * ready" medallion, with the 100 springing out and counting up. Frames the
 * product as the improvement itself — no paywall, access, or pricing copy.
 */
export function PreviewTeaser() {
  const reduced = useReducedMotion() ?? false;
  const [score, setScore] = useState(reduced ? 100 : 0);

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const run = () => {
      const duration = 1200;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setScore(Math.round(eased * 100));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    // Let the dull "0" register before the 100 climbs out of it.
    const timeout = window.setTimeout(run, 550);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [reduced]);

  return (
    <GlassCard subtle className="p-5">
      <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-[#7c8064]">
        With Yessay
      </p>

      <div className="mt-6 flex items-center justify-center gap-1">
        <ScoreCircle value={0} variant="bad" />
        <TransitionArrow reduced={reduced} />
        <ScoreCircle value={score} variant="good" emerge reduced={reduced} />
      </div>

      <p className="mt-6 text-center text-sm font-bold text-[#3c4133]">
        Improve it from <span className="text-[#c75a48]">0</span> to{" "}
        <span className="text-[#5a7034]">100</span>
      </p>

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

function ScoreCircle({
  value,
  variant,
  emerge = false,
  reduced = false,
}: {
  value: number;
  variant: "bad" | "good";
  emerge?: boolean;
  reduced?: boolean;
}) {
  const good = variant === "good";
  const diameter = good ? 96 : 80;

  return (
    <motion.div
      className="relative shrink-0"
      style={{ width: diameter, height: diameter }}
      initial={emerge && !reduced ? { scale: 0.4, opacity: 0 } : false}
      animate={emerge ? { scale: 1, opacity: 1 } : undefined}
      transition={{ delay: 0.5, type: "spring", stiffness: 220, damping: 16 }}
    >
      {/* soft halo behind the "after" medallion */}
      {good && (
        <div
          aria-hidden
          className="absolute -inset-0.5 rounded-full bg-[#c8f85a] opacity-30 blur-lg"
        />
      )}

      <div
        className="relative flex size-full flex-col items-center justify-center rounded-full"
        style={
          good
            ? {
                background:
                  "radial-gradient(circle at 36% 28%, #f6fde0 0%, #e4f7af 52%, #cdef88 100%)",
                border: "2px solid #b3da4a",
                boxShadow:
                  "inset 0 2px 3px rgba(255,255,255,0.85), inset 0 -6px 12px rgba(120,170,30,0.18), 0 12px 26px rgba(150,210,40,0.4)",
              }
            : {
                background:
                  "radial-gradient(circle at 36% 28%, #fdf1ee 0%, #f1d9d2 70%, #e7cabf 100%)",
                border: "2px solid #d8b0a6",
                boxShadow:
                  "inset 0 2px 3px rgba(255,255,255,0.7), inset 0 -5px 10px rgba(150,80,65,0.08)",
              }
        }
      >
        {good && (
          <Sparkles
            size={13}
            className="absolute right-2.5 top-2.5 text-[#6f9018]"
            fill="currentColor"
          />
        )}
        <span
          className={
            good
              ? "text-[1.7rem] font-black leading-none tracking-[-0.06em] text-[#171912]"
              : "text-[1.55rem] font-black leading-none tracking-[-0.06em] text-[#a85a4b]"
          }
        >
          {value}
        </span>
        <span
          className={
            good
              ? "mt-1 text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#5a7034]"
              : "mt-1 text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#c3938a]"
          }
        >
          {good ? "ready" : "as-is"}
        </span>
      </div>
    </motion.div>
  );
}

function TransitionArrow({ reduced }: { reduced: boolean }) {
  return (
    <motion.svg
      width="40"
      height="22"
      viewBox="0 0 40 22"
      fill="none"
      className="mx-0.5 shrink-0"
      initial={reduced ? false : { opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.45 }}
    >
      <defs>
        <linearGradient id="teaser-arrow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d3a99f" />
          <stop offset="100%" stopColor="#9ed12f" />
        </linearGradient>
      </defs>
      <path
        d="M3 11 H30"
        stroke="url(#teaser-arrow)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M25 5 L33 11 L25 17"
        stroke="url(#teaser-arrow)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
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
