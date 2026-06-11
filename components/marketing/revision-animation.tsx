"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Check, Sparkles, X, Zap } from "lucide-react";

/**
 * DISNEY-STANDARD PREMIUM ANIMATION
 * Follows 12 Principles of Animation:
 * 1. Squash and Stretch (Breathing & Reactions)
 * 2. Anticipation (Eye movements before head turns)
 * 3. Follow Through & Overlapping Action (Hair sway)
 * 4. Slow In and Slow Out (Custom Bezier curves)
 * 5. Appeal (Organic silhouettes)
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
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-full min-h-[450px] w-full items-center justify-center overflow-hidden py-12">
      <AnimatePresence mode="wait">
        {phase === "struggle" && <StruggleView key="struggle" />}
        {phase === "fixing" && <FixingView key="fixing" />}
        {phase === "success" && <SuccessView key="success" />}
      </AnimatePresence>

      {/* Atmospheric Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: phase === "success" ? 1.6 : 1,
            opacity: phase === "success" ? 0.25 : 0.08,
            backgroundColor: phase === "success" ? "#c8f85a" : "#ff8b5e",
          }}
          transition={{ duration: 2 }}
          className="absolute left-1/2 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        />
      </div>
    </div>
  );
}

function DisneyCharacter({ mood }: { mood: "stressed" | "analyzing" | "hero" }) {
  // Custom cubic-bezier for "organic" feel
  const organicTransition = {
    duration: 3,
    repeat: Infinity,
    ease: [0.45, 0, 0.55, 1],
  };

  return (
    <div className="relative size-64 sm:size-72">
      <svg viewBox="0 0 240 240" className="h-full w-full drop-shadow-2xl">
        <defs>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF8" />
            <stop offset="100%" stopColor="#F9E8D2" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Torso / Shoulders (Squash & Stretch) */}
        <motion.path
          animate={{
            d: mood === "hero" 
              ? "M50 220 Q120 180 190 220 L190 240 L50 240 Z" 
              : "M60 230 Q120 200 180 230 L180 240 L60 240 Z",
            scaleY: [1, 1.02, 1],
          }}
          transition={organicTransition}
          d="M60 230 Q120 200 180 230 L180 240 L60 240 Z"
          fill="#171912"
        />

        {/* Neck */}
        <path d="M110 180 Q120 195 130 180 L130 210 L110 210 Z" fill="#F9E8D2" />

        {/* Head Group (Overlapping Action) */}
        <motion.g
          animate={{
            y: mood === "stressed" ? [0, 4, 0] : [0, -2, 0],
            rotate: mood === "stressed" ? [-1, 1, -1] : 0,
          }}
          transition={organicTransition}
        >
          {/* Main Face Path (Organic Silhouette) */}
          <path
            d="M80 110 Q80 50 120 50 Q160 50 160 110 Q160 180 120 180 Q80 180 80 110"
            fill="url(#skinGrad)"
            filter="url(#softShadow)"
          />

          {/* Hair (Secondary Action - Sway) */}
          <motion.path
            animate={{
              rotate: mood === "stressed" ? [0, -2, 2, 0] : [0, 1, -1, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            d="M75 100 Q70 40 120 35 Q170 40 165 100 Q175 120 165 140 Q150 90 120 90 Q90 90 75 140"
            fill="#171912"
          />
          <motion.circle 
            animate={{ scale: [1, 1.05, 1] }}
            transition={organicTransition}
            cx="120" cy="35" r="18" fill="#171912" 
          />

          {/* Eyes (Expressive Features) */}
          <g transform="translate(120, 115)">
            {/* Left Eye */}
            <g transform="translate(-22, 0)">
              <motion.ellipse
                animate={{ scaleY: mood === "stressed" ? [1, 0.2, 1] : [1, 0.1, 1] }}
                transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                rx="7" ry="9" fill="#171912"
              />
              <circle cx="2" cy="-3" r="2" fill="white" opacity="0.8" />
              {mood === "stressed" && (
                <path d="M-10 -14 Q-5 -17 0 -14" fill="none" stroke="#171912" strokeWidth="2" strokeLinecap="round" />
              )}
            </g>
            {/* Right Eye */}
            <g transform="translate(22, 0)">
              <motion.ellipse
                animate={{ scaleY: mood === "stressed" ? [1, 0.2, 1] : [1, 0.1, 1] }}
                transition={{ repeat: Infinity, duration: 4, delay: 1.1 }}
                rx="7" ry="9" fill="#171912"
              />
              <circle cx="2" cy="-3" r="2" fill="white" opacity="0.8" />
              {mood === "stressed" && (
                <path d="M0 -14 Q5 -17 10 -14" fill="none" stroke="#171912" strokeWidth="2" strokeLinecap="round" />
              )}
            </g>
          </g>

          {/* Mouth (Exaggeration) */}
          <motion.path
            animate={{
              d: mood === "hero" 
                ? "M105 145 Q120 165 135 145" 
                : mood === "stressed" 
                  ? "M108 155 Q120 150 132 155" 
                  : "M110 155 L130 155",
            }}
            fill="none"
            stroke="#171912"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </motion.g>
      </svg>

      {/* Particles (Success State) */}
      {mood === "hero" && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: "50%", y: "50%" }}
              animate={{
                scale: [0, 1, 0],
                x: `${50 + (Math.cos(i * 60) * 40)}%`,
                y: `${50 + (Math.sin(i * 60) * 40)}%`,
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              className="absolute size-2 rounded-full bg-[#c8f85a]"
            />
          ))}
        </div>
      )}
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
      <div className="relative">
        <DisneyCharacter mood="stressed" />
        
        {/* Floating Stressors (Harmonic Orbit) */}
        <FloatingBadge delay={0} x={-110} y={-60}>
          <div className="rounded-2xl border-2 border-[#171912] bg-white p-4 shadow-[6px_6px_0_#171912]">
            <X size={28} className="text-[#ff8b5e]" strokeWidth={4} />
          </div>
        </FloatingBadge>

        <FloatingBadge delay={0.3} x={120} y={-20}>
          <div className="rounded-2xl border-2 border-[#171912] bg-white px-5 py-3 shadow-[6px_6px_0_#171912]">
            <span className="text-xs font-black uppercase italic tracking-tighter">Drafting...</span>
          </div>
        </FloatingBadge>

        <FloatingBadge delay={0.6} x={-40} y={130}>
          <div className="rounded-2xl border-2 border-[#171912] bg-[#171912] px-5 py-3 text-white shadow-[6px_6px_0_#ff8b5e]">
            <span className="text-xs font-black">LATE NIGHT</span>
          </div>
        </FloatingBadge>
      </div>

      <div className="text-center">
        <div className="mb-3 h-2 w-56 overflow-hidden rounded-full bg-[#171912]/5">
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
            className="h-full w-full bg-[#ff8b5e]/40"
          />
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#6c7065]/60">
          Stuck in the loop
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
      <div className="relative">
        <DisneyCharacter mood="analyzing" />
        
        {/* Analysis HUD (Layered Depth) */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative h-72 w-96 rotate-[-2deg] overflow-hidden rounded-[32px] border-[3px] border-[#171912] bg-white/30 shadow-2xl backdrop-blur-xl">
            <div className="space-y-5 p-10">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${60 + (i * 7) % 30}%` }}
                    transition={{ delay: i * 0.15, duration: 1 }}
                    className="h-2.5 rounded-full bg-[#171912]/15" 
                  />
                  {i % 2 === 0 && <div className="size-2.5 rounded-full bg-[#c8f85a]" />}
                </div>
              ))}
            </div>

            {/* Magic Scan Beam */}
            <motion.div
              animate={{ y: [-40, 300] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: [0.45, 0.05, 0.55, 0.95] }}
              className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-[#c8f85a]/40 to-transparent"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-4 rounded-full border-[3px] border-[#171912] bg-[#171912] px-8 py-4 text-white shadow-xl"
              >
                <Zap size={22} className="text-[#c8f85a]" fill="currentColor" />
                <span className="text-[13px] font-black uppercase tracking-[0.25em]">
                  Analyzing
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
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
      className="flex flex-col items-center gap-10"
    >
      <div className="relative">
        <DisneyCharacter mood="hero" />
        
        {/* Victory Badges */}
        <motion.div
          initial={{ y: 30, opacity: 0, rotate: 15 }}
          animate={{ y: 0, opacity: 1, rotate: 8 }}
          transition={{ type: "spring", delay: 0.4, stiffness: 100 }}
          className="absolute -right-12 -top-6 rounded-3xl border-[3px] border-[#171912] bg-[#c8f85a] px-7 py-4 shadow-[8px_8px_0_#171912]"
        >
          <div className="flex items-center gap-3">
            <Sparkles size={24} className="text-[#171912]" />
            <strong className="text-3xl font-black italic">98</strong>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.6, damping: 12 }}
          className="absolute -left-14 top-1/2 size-20 -translate-y-1/2 rounded-full border-[3px] border-[#171912] bg-white p-4 shadow-2xl"
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#eff9d4]">
            <Check size={32} className="text-[#566b18]" strokeWidth={5} />
          </div>
        </motion.div>
      </div>

      <div className="text-center">
        <p className="text-base font-black uppercase tracking-[0.4em] text-[#171912]">
          Submission Ready
        </p>
        <p className="mt-2 text-[11px] font-bold tracking-wider text-[#6c7065]">
          A-LEVEL DRAFT VERIFIED
        </p>
      </div>
    </motion.div>
  );
}

function FloatingBadge({
  children,
  x,
  y,
  delay,
}: {
  children: React.ReactNode;
  x: number;
  y: number;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{
        opacity: 1,
        x,
        y,
        transition: { delay, type: "spring", stiffness: 80, damping: 15 },
      }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div
        animate={{ 
          y: [0, -12, 0], 
          rotate: [-3, 3, -3],
          scale: [1, 1.02, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
