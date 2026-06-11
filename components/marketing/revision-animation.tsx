"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Check, Sparkles, X, Zap, MousePointer2 } from "lucide-react";

/**
 * PREMIUM "HUMAAANS-STYLE" CHARACTER ANIMATION
 * Style: Flat, hand-drawn vector aesthetic (Reference: Screenshot)
 * Features: Flowing hair, oversized clothing, long limbs, dynamic posing
 */

export function RevisionAnimation() {
  const [phase, setPhase] = useState<"struggle" | "fixing" | "success">(
    "struggle",
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((current) => {
        if (current === "struggle") return "fixing";
        if (current === "fixing") return "success";
        return "struggle";
      });
    }, 6500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-full min-h-[520px] w-full items-center justify-center overflow-hidden py-12">
      <AnimatePresence mode="wait">
        {phase === "struggle" && <StruggleView key="struggle" />}
        {phase === "fixing" && <FixingView key="fixing" />}
        {phase === "success" && <SuccessView key="success" />}
      </AnimatePresence>

      {/* Stylized Background Blob (Matching Screenshot) */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <motion.svg
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          viewBox="0 0 500 500"
          className="h-[120%] w-[120%] opacity-[0.05]"
        >
          <path
            d="M410.5,333.5 Q381,427 280,418.5 Q179,410 119.5,321 Q60,232 121.5,142.5 Q183,53 285.5,69.5 Q388,86 429,209.5 Q470,333 410.5,333.5"
            fill="#5C90D2"
          />
        </motion.svg>
      </div>
    </div>
  );
}

function HumaaanCharacter({ mood, armRaised = false }: { mood: "stressed" | "focused" | "triumphant"; armRaised?: boolean }) {
  const bodyTransition = { duration: 3, repeat: Infinity, ease: "easeInOut" };

  return (
    <div className="relative h-[340px] w-[280px]">
      <svg viewBox="0 0 200 240" className="h-full w-full overflow-visible">
        {/* Hair - Large and flowing */}
        <motion.path
          animate={{
            d: mood === "stressed" 
              ? "M60 40 Q30 20 20 80 Q10 140 50 130 Q70 110 70 80 Q70 50 60 40" 
              : "M60 40 Q10 20 5 90 Q0 160 55 140 Q80 110 80 80 Q80 50 60 40",
            rotate: mood === "stressed" ? [0, -3, 3, 0] : [0, 2, -2, 0]
          }}
          transition={bodyTransition}
          fill="#171912"
        />

        {/* Head */}
        <motion.path
          animate={{ y: mood === "stressed" ? [0, 4, 0] : [0, -2, 0] }}
          transition={bodyTransition}
          d="M75 80 Q75 55 100 55 Q125 55 125 80 Q125 110 100 110 Q75 110 75 80"
          fill="#FFFDF8"
          stroke="#171912"
          strokeWidth="2.5"
        />

        {/* Face Details */}
        <g transform="translate(100, 85)">
          {/* Eyes */}
          <circle cx="-12" cy="0" r="1.5" fill="#171912" />
          <circle cx="12" cy="0" r="1.5" fill="#171912" />
          {/* Mouth */}
          <motion.path
            animate={{
              d: mood === "triumphant" ? "M-5 12 Q0 18 5 12" : "M-4 15 L4 15",
            }}
            fill="none"
            stroke="#171912"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* Torso - Oversized Sweater */}
        <motion.path
          animate={{ scaleY: [1, 1.02, 1] }}
          transition={bodyTransition}
          d="M70 120 Q100 110 130 120 L150 180 Q100 200 50 180 Z"
          fill="#5C90D2"
          stroke="#171912"
          strokeWidth="2.5"
        />

        {/* Left Arm (Fixed on hip) */}
        <path
          d="M70 135 Q50 150 65 185"
          fill="none"
          stroke="#171912"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Right Arm (Dynamic) */}
        <motion.path
          animate={{
            d: armRaised 
              ? "M130 135 Q180 110 200 80" 
              : mood === "stressed"
                ? "M130 135 Q150 170 140 200"
                : "M130 135 Q160 160 155 190"
          }}
          transition={{ type: "spring", stiffness: 60, damping: 10 }}
          fill="none"
          stroke="#171912"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Legs - Long and thin */}
        <g stroke="#171912" strokeWidth="2.5" strokeLinecap="round">
          {/* Left Leg */}
          <motion.path
            animate={{ d: mood === "stressed" ? "M75 190 L65 240" : "M80 195 L75 250" }}
            transition={bodyTransition}
          />
          {/* Right Leg */}
          <motion.path
            animate={{ d: mood === "stressed" ? "M125 190 L135 240" : "M120 195 L125 250" }}
            transition={bodyTransition}
          />
        </g>

        {/* Tools (Holding a brush when raised) */}
        <AnimatePresence>
          {armRaised && (
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, x: 195, y: 75 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <path
                d="M0 0 L15 -15 M15 -15 Q20 -20 25 -15 L35 -5 Q40 0 35 5 Z"
                fill="#FFFDF8"
                stroke="#171912"
                strokeWidth="2"
              />
              <path d="M15 -15 L25 -5" stroke="#171912" strokeWidth="2" />
              {/* Brush Tip */}
              <motion.path
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                d="M30 0 Q35 10 40 0 Q35 -5 30 0"
                fill="#F1935C"
              />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}

function StruggleView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex flex-col items-center gap-10"
    >
      <div className="relative flex items-center justify-center">
        <HumaaanCharacter mood="stressed" />
        
        {/* Messy Windows (Matching Screenshot) */}
        <motion.div
          animate={{ x: -140, y: -40, rotate: -12 }}
          className="absolute rounded-xl border-2 border-[#171912] bg-white p-2 shadow-[6px_6px_0_#171912]"
        >
          <div className="flex h-32 w-48 flex-col gap-2 p-2">
            <div className="h-3 w-3/4 rounded-full bg-[#171912]/10" />
            <div className="h-3 w-full rounded-full bg-[#171912]/10" />
            <div className="mt-auto flex justify-between">
              <div className="size-8 rounded-lg bg-[#F1935C]/20" />
              <X size={20} className="text-[#F1935C]" strokeWidth={3} />
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ x: 140, y: 60, rotate: 8 }}
          className="absolute rounded-xl border-2 border-[#171912] bg-[#FFFDF8] p-2 shadow-[6px_6px_0_#F1935C]"
        >
          <div className="flex h-24 w-40 flex-col gap-2 p-3">
            <div className="flex gap-2">
              <div className="size-3 rounded-full bg-[#171912]" />
              <div className="h-3 w-12 rounded-full bg-[#171912]/20" />
            </div>
            <div className="h-2 w-full rounded-full bg-[#171912]/10" />
            <div className="h-2 w-2/3 rounded-full bg-[#171912]/10" />
          </div>
        </motion.div>
      </div>

      <div className="text-center">
        <p className="text-sm font-black uppercase tracking-[0.4em] text-[#171912]/40">
          Unorganized draft
        </p>
      </div>
    </motion.div>
  );
}

function FixingView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-12"
    >
      <div className="relative flex items-center justify-center">
        <HumaaanCharacter mood="focused" armRaised />
        
        {/* Active Drawing Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 140, y: -80 }}
          animate={{ opacity: 1, scale: 1, x: 120, y: -100, rotate: 2 }}
          className="absolute rounded-2xl border-[3px] border-[#171912] bg-white p-4 shadow-2xl"
        >
          <div className="relative h-40 w-64 overflow-hidden rounded-lg bg-[#5C90D2]/10">
            {/* The "Drawing" Path */}
            <motion.svg className="absolute inset-0 h-full w-full">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
                d="M30 80 Q100 20 140 100 Q180 180 230 80"
                fill="none"
                stroke="#171912"
                strokeWidth="3"
                strokeDasharray="5 5"
              />
            </motion.svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="animate-pulse text-[#F1935C]" size={48} />
            </div>
          </div>
        </motion.div>

        {/* Floating Folder (Matching Screenshot) */}
        <motion.div
          initial={{ opacity: 0, x: -120, y: 100 }}
          animate={{ opacity: 1, x: -140, y: 120, rotate: -5 }}
          className="absolute flex h-24 w-32 items-end justify-center rounded-xl border-2 border-[#171912] bg-[#5C90D2] shadow-[6px_6px_0_#171912]"
        >
          <div className="mb-2 h-2 w-16 rounded-full bg-white/40" />
        </motion.div>
      </div>

      <div className="text-center">
        <div className="flex items-center gap-4 rounded-full border-2 border-[#171912] bg-[#171912] px-6 py-2.5 text-white">
          <Zap size={18} className="text-[#F1935C]" fill="currentColor" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">
            Revising logic...
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function SuccessView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="flex flex-col items-center gap-12"
    >
      <div className="relative flex items-center justify-center">
        <HumaaanCharacter mood="triumphant" />
        
        {/* Organized State */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0, x: -150, rotate: -8 }}
          className="absolute rounded-2xl border-2 border-[#171912] bg-[#C8F85A] px-6 py-4 shadow-[8px_8px_0_#171912]"
        >
          <div className="flex items-center gap-3">
            <Check size={28} className="text-[#171912]" strokeWidth={4} />
            <strong className="text-3xl font-black">98%</strong>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, x: 150, y: 80, rotate: 12 }}
          className="absolute rounded-2xl border-2 border-[#171912] bg-white p-4 shadow-[8px_8px_0_#5C90D2]"
        >
          <div className="flex items-center gap-3 font-black uppercase">
            <Sparkles size={20} className="text-[#F1935C]" />
            Perfect match
          </div>
        </motion.div>

        {/* Floating Confetti Shapes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -100], 
              opacity: [0, 1, 0],
              x: (i - 3) * 60
            }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
            className="absolute size-3 rounded-full bg-[#F1935C]"
          />
        ))}
      </div>

      <div className="text-center">
        <p className="text-base font-black uppercase tracking-[0.5em] text-[#171912]">
          Ready to submit
        </p>
      </div>
    </motion.div>
  );
}
