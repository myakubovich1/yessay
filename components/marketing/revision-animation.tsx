"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Check, Sparkles, X, Zap, FileText, Layout, Target } from "lucide-react";

/**
 * PREMIUM GRAPHIC DESIGN ANIMATION
 * Purely abstract, UI-driven, and geometric.
 * Visualizes the journey from "Messy Draft" to "Perfected Report".
 */

export function RevisionAnimation() {
  const [phase, setPhase] = useState<"input" | "process" | "output">("input");

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((current) => {
        if (current === "input") return "process";
        if (current === "process") return "output";
        return "input";
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-full min-h-[400px] w-full items-center justify-center overflow-hidden p-8">
      <AnimatePresence mode="wait">
        {phase === "input" && <InputState key="input" />}
        {phase === "process" && <ProcessState key="process" />}
        {phase === "output" && <OutputState key="output" />}
      </AnimatePresence>

      {/* Atmospheric Background Glows */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{
            opacity: phase === "output" ? 0.4 : 0.15,
            scale: phase === "output" ? 1.2 : 1,
          }}
          className="absolute left-1/2 top-1/2 size-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c8f85a] blur-[100px]"
        />
      </div>
    </div>
  );
}

function InputState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative flex flex-col items-center gap-8"
    >
      <div className="relative">
        {/* The "Messy" Draft */}
        <div className="relative h-56 w-44 rounded-2xl border-2 border-[#171912] bg-white p-5 shadow-[8px_8px_0_#171912]">
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="relative h-2 w-full overflow-hidden rounded-full bg-[#171912]/5">
                {i === 2 || i === 4 ? (
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute right-0 h-full w-1/3 bg-[#ff8b5e]/40"
                  />
                ) : null}
              </div>
            ))}
          </div>
          <div className="absolute -right-4 top-12">
            <div className="flex size-10 items-center justify-center rounded-xl border-2 border-[#171912] bg-white text-[#ff8b5e] shadow-[4px_4px_0_#171912]">
              <X size={20} strokeWidth={3} />
            </div>
          </div>
          <div className="absolute -left-6 bottom-16">
            <div className="flex h-10 items-center justify-center rounded-xl border-2 border-[#171912] bg-white px-3 text-[10px] font-black uppercase shadow-[4px_4px_0_#171912]">
              Gap found
            </div>
          </div>
        </div>
        
        {/* Background stack */}
        <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-2xl border-2 border-[#171912]/10 bg-white" />
      </div>

      <div className="text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#6c7065]">
          Raw draft input
        </p>
      </div>
    </motion.div>
  );
}

function ProcessState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col items-center gap-10"
    >
      <div className="relative h-64 w-[340px] overflow-hidden rounded-[32px] border-[3px] border-[#171912] bg-white shadow-2xl">
        {/* HUD UI Elements */}
        <div className="flex h-12 items-center justify-between border-b-[3px] border-[#171912] px-6">
          <div className="flex gap-2">
            <div className="size-2.5 rounded-full bg-[#171912]" />
            <div className="size-2.5 rounded-full bg-[#171912]/20" />
            <div className="size-2.5 rounded-full bg-[#171912]/20" />
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest">Analysis Engine</div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-6">
          <div className="space-y-4">
            <div className="h-2 w-full rounded-full bg-[#171912]/5" />
            <div className="h-2 w-2/3 rounded-full bg-[#171912]/5" />
            <div className="h-2 w-full rounded-full bg-[#171912]/5" />
            <motion.div 
              animate={{ width: ["0%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 rounded-full bg-[#c8f85a]" 
            />
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-[#f6f1e8] p-4">
            <Target size={24} className="mb-2 text-[#171912]" />
            <span className="text-[9px] font-black uppercase">Aligning Rubric</span>
          </div>
        </div>

        {/* The Scanning Laser */}
        <motion.div
          animate={{ y: [-20, 260] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
          className="absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-[#c8f85a]/30 to-transparent shadow-[0_0_20px_#c8f85a]"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px]">
          <div className="flex items-center gap-3 rounded-full border-2 border-[#171912] bg-[#171912] px-6 py-3 text-white shadow-xl">
            <Zap size={16} className="text-[#c8f85a]" fill="currentColor" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Cross-checking</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function OutputState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="relative flex flex-col items-center gap-8"
    >
      <div className="relative">
        {/* The Perfected Report */}
        <div className="relative h-60 w-48 rounded-2xl border-2 border-[#171912] bg-[#c8f85a] p-6 shadow-[10px_10px_0_#171912]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm">
                <Check size={20} strokeWidth={4} className="text-[#171912]" />
              </div>
              <div>
                <div className="h-2.5 w-16 rounded-full bg-[#171912]" />
                <div className="mt-1.5 h-1.5 w-10 rounded-full bg-[#171912]/40" />
              </div>
            </div>
            <div className="pt-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="mb-3 h-2 w-full rounded-full bg-[#171912]/10" />
              ))}
            </div>
          </div>
        </div>

        {/* Success Popups */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -right-12 -top-6"
        >
          <div className="rounded-2xl border-2 border-[#171912] bg-white px-5 py-3 shadow-[6px_6px_0_#171912]">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#ff8b5e]" />
              <strong className="text-xl font-black italic">98</strong>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -left-10 bottom-8"
        >
          <div className="flex items-center gap-2 rounded-xl border-2 border-[#171912] bg-[#171912] px-4 py-2.5 text-white shadow-lg">
            <Layout size={14} className="text-[#c8f85a]" />
            <span className="text-[10px] font-black uppercase">Ready</span>
          </div>
        </motion.div>
      </div>

      <div className="text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#171912]">
          Submission ready
        </p>
      </div>
    </motion.div>
  );
}
