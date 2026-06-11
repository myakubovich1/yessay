"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Check, Sparkles, X } from "lucide-react";

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
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden py-10">
      <AnimatePresence mode="wait">
        {phase === "struggle" && <StruggleView key="struggle" />}
        {phase === "fixing" && <FixingView key="fixing" />}
        {phase === "success" && <SuccessView key="success" />}
      </AnimatePresence>

      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute left-1/4 top-1/4 size-32 rounded-full bg-[#c8f85a] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 size-32 rounded-full bg-[#ff8b5e] blur-3xl" />
      </div>
    </div>
  );
}

function StruggleView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="relative flex flex-col items-center gap-6"
    >
      <div className="relative">
        {/* The Avatar */}
        <motion.div
          animate={{
            x: [0, -2, 2, -2, 0],
            rotate: [0, -1, 1, -1, 0],
          }}
          transition={{ repeat: Infinity, duration: 0.4 }}
          className="relative flex size-24 items-center justify-center rounded-full border-4 border-[#171912] bg-[#f6f1e8]"
        >
          <div className="flex gap-3">
            <motion.div
              animate={{ height: [8, 4, 8] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 rounded-full bg-[#171912]"
            />
            <motion.div
              animate={{ height: [8, 4, 8] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.1 }}
              className="w-2 rounded-full bg-[#171912]"
            />
          </div>
          <motion.div
            animate={{ width: [12, 16, 12] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-6 h-1 rounded-full bg-[#171912]"
          />
        </motion.div>

        {/* Floating Frustrations */}
        <FloatingIcon delay={0} x={-60} y={-40}>
          <div className="flex size-10 items-center justify-center rounded-lg border-2 border-[#171912] bg-white text-[#ff8b5e] shadow-sm">
            <X size={20} strokeWidth={3} />
          </div>
        </FloatingIcon>
        <FloatingIcon delay={0.2} x={70} y={-20}>
          <div className="flex size-10 items-center justify-center rounded-lg border-2 border-[#171912] bg-white text-[#ff8b5e] shadow-sm">
            <span className="text-xs font-black">MLA?</span>
          </div>
        </FloatingIcon>
        <FloatingIcon delay={0.4} x={40} y={60}>
          <div className="flex size-10 items-center justify-center rounded-lg border-2 border-[#171912] bg-white text-[#ff8b5e] shadow-sm">
            <span className="text-xs font-black">4am</span>
          </div>
        </FloatingIcon>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="h-2 w-32 rounded-full bg-[#171912]/10 overflow-hidden">
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="h-full w-full bg-[#ff8b5e]"
          />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#6c7065]">
          Struggling with draft...
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
      className="relative flex flex-col items-center gap-8"
    >
      <div className="relative h-40 w-56 rounded-2xl border-4 border-[#171912] bg-white p-4 shadow-xl">
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="relative h-2 w-full rounded-full bg-[#f6f1e8]">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="absolute inset-0 origin-left rounded-full bg-[#c8f85a]"
              />
            </div>
          ))}
        </div>

        <motion.div
          animate={{ y: [0, 120, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-x-0 top-0 h-1 bg-[#c8f85a] shadow-[0_0_15px_#c8f85a]"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
          <div className="flex items-center gap-3 rounded-full border-2 border-[#171912] bg-[#171912] px-4 py-2 text-white">
            <Sparkles size={16} className="text-[#c8f85a]" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Analyzing Rubric
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SuccessView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="relative flex flex-col items-center gap-6"
    >
      <div className="relative">
        <motion.div
          animate={{
            y: [0, -4, 0],
          }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="relative flex size-28 items-center justify-center rounded-full border-4 border-[#171912] bg-[#c8f85a] shadow-[0_8px_0_#171912]"
        >
          <div className="flex gap-4">
            <motion.div
              animate={{ scaleY: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 4, delay: 1 }}
              className="size-3 rounded-full bg-[#171912]"
            />
            <motion.div
              animate={{ scaleY: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 4, delay: 1.1 }}
              className="size-3 rounded-full bg-[#171912]"
            />
          </div>
          <div className="absolute bottom-7 h-2 w-8 rounded-full bg-[#171912]" />
        </motion.div>

        {/* Success indicators */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 12 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="absolute -right-4 -top-2 flex size-12 items-center justify-center rounded-full border-2 border-[#171912] bg-white text-[#171912] shadow-lg"
        >
          <strong className="text-sm">98</strong>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.4 }}
          className="absolute -left-6 bottom-2 flex size-10 items-center justify-center rounded-full border-2 border-[#171912] bg-[#eff9d4] text-[#566b18]"
        >
          <Check size={20} strokeWidth={4} />
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
              className="size-1.5 rounded-full bg-[#c8f85a]"
            />
          ))}
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#171912]">
          Ready to submit
        </p>
      </div>
    </motion.div>
  );
}

function FloatingIcon({
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
        transition: { delay, type: "spring" },
      }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2, delay, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
