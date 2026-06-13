"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, FileText, Wand2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const RADIUS = 34;
const CIRC = 2 * Math.PI * RADIUS;

/**
 * Before/after value card: a sickly red "0" and a thriving lime "100", with
 * the 100 emerging from the 0 and counting up. Frames the product as the
 * improvement itself — no paywall, access, or pricing copy.
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
    // Let the red "0" register before the 100 climbs out of it.
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

      <div className="mt-5 flex items-center justify-center gap-2.5">
        <ScoreCircle value={0} variant="bad" />
        <motion.span
          initial={reduced ? false : { opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="text-[#9aa08c]"
        >
          <ArrowRight size={20} strokeWidth={2.5} />
        </motion.span>
        <ScoreCircle value={score} variant="good" emerge reduced={reduced} />
      </div>

      <p className="mt-5 text-center text-sm font-bold text-[#3c4133]">
        Improve it from <span className="text-[#cf3c2d]">0</span> to{" "}
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
  return (
    <motion.div
      className="relative size-[84px]"
      initial={emerge && !reduced ? { scale: 0.5, opacity: 0 } : false}
      animate={emerge ? { scale: 1, opacity: 1 } : undefined}
      transition={{ delay: 0.45, type: "spring", stiffness: 210, damping: 15 }}
      style={
        good
          ? { filter: "drop-shadow(0 6px 18px rgba(140,200,40,0.42))" }
          : undefined
      }
    >
      <svg className="size-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill={good ? "rgba(200,248,90,0.14)" : "rgba(207,60,45,0.08)"}
          stroke="rgba(23,25,18,0.10)"
          strokeWidth="9"
        />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke={good ? "url(#circle-good)" : "url(#circle-bad)"}
          strokeLinecap="round"
          strokeWidth="9"
          strokeDasharray={CIRC}
          strokeDashoffset={0}
        />
        <defs>
          <linearGradient id="circle-good" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8bd41f" />
            <stop offset="100%" stopColor="#c8f85a" />
          </linearGradient>
          <linearGradient id="circle-bad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c0392b" />
            <stop offset="100%" stopColor="#e87a55" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={
            good
              ? "text-2xl font-black tracking-[-0.05em] text-[#171912]"
              : "text-2xl font-black tracking-[-0.05em] text-[#b23829]"
          }
        >
          {value}
        </span>
        <span
          className={
            good
              ? "text-[9px] font-bold uppercase tracking-wider text-[#5a7034]"
              : "text-[9px] font-bold uppercase tracking-wider text-[#bd7a6e]"
          }
        >
          {good ? "ready" : "as-is"}
        </span>
      </div>
    </motion.div>
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
