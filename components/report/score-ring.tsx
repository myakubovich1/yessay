"use client";

import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ScoreRing({
  score,
  size = "large",
  animated = false,
}: {
  score: number;
  size?: "small" | "large";
  animated?: boolean;
}) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const reducedMotion = useReducedMotion();
  const [animatedScore, setAnimatedScore] = useState(0);
  const gradientId = `score-${useId().replaceAll(":", "")}`;
  const displayScore =
    animated && !reducedMotion ? animatedScore : score;

  useEffect(() => {
    if (!animated || reducedMotion) return;

    let frame = 0;
    const duration = 900;
    const startedAt = performance.now();

    const update = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      if (progress < 1) frame = window.requestAnimationFrame(update);
    };

    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, [animated, reducedMotion, score]);

  return (
    <div
      className={cn(
        "relative shrink-0",
        size === "large" ? "size-36" : "size-20",
      )}
      aria-label={`Yessay score: ${score} out of 100`}
    >
      <svg className="-rotate-90 size-full" viewBox="0 0 100 100">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#b8ed42" />
            <stop offset="72%" stopColor="#c8f85a" />
            <stop offset="100%" stopColor="#ff8b5e" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(23,25,18,0.12)"
          strokeWidth="7"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeLinecap="round"
          strokeWidth="7"
          strokeDasharray={circumference}
          initial={
            animated && !reducedMotion
              ? { strokeDashoffset: circumference }
              : false
          }
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "font-black tracking-[-0.05em] text-[#171912]",
            size === "large" ? "text-4xl" : "text-xl",
          )}
        >
          {displayScore}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#777a70]">
          score
        </span>
      </div>
    </div>
  );
}
