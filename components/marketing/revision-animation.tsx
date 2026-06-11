"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Check, Sparkles, X, Zap, Target, ShieldCheck, Activity } from "lucide-react";

/**
 * ULTRA-PREMIUM MOTION GRAPHIC SYSTEM
 * - Layered Glassmorphism
 * - Staggered Spring Physics
 * - Mesh Gradients & Dynamic Lighting
 * - High-Frequency Detail (Grid/Noise)
 */

export function RevisionAnimation() {
  const [phase, setPhase] = useState<"draft" | "engine" | "final">("draft");

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((current) => {
        if (current === "draft") return "engine";
        if (current === "engine") return "final";
        return "draft";
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-full min-h-[500px] w-full items-center justify-center overflow-hidden p-12">
      {/* Background Mesh/Grid */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#171912_1px,transparent_1px)] [background-size:24px_24px]" />
        <motion.div
          animate={{
            scale: phase === "final" ? 1.5 : 1,
            x: phase === "engine" ? 100 : 0,
            opacity: phase === "final" ? 0.4 : 0.2,
          }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-[#c8f85a] to-[#ff8b5e] blur-[120px]"
        />
      </div>

      <AnimatePresence mode="wait">
        {phase === "draft" && <DraftPhase key="draft" />}
        {phase === "engine" && <EnginePhase key="engine" />}
        {phase === "final" && <FinalPhase key="final" />}
      </AnimatePresence>
    </div>
  );
}

function DraftPhase() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="relative flex flex-col items-center gap-12"
    >
      <div className="relative">
        {/* Layered Document Stack */}
        <motion.div
          animate={{ rotate: [-2, 0, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 h-64 w-48 rounded-[32px] border border-[#171912]/20 bg-white/80 p-6 shadow-2xl backdrop-blur-xl"
        >
          {/* Internal Skeleton Loader Style */}
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ width: 0 }}
                animate={{ width: i === 5 ? "40%" : "100%" }}
                className="h-2.5 rounded-full bg-[#171912]/5"
              />
            ))}
          </div>

          {/* Floating Issue Markers */}
          <motion.div
            initial={{ scale: 0, x: 20 }}
            animate={{ scale: 1, x: 0 }}
            className="absolute -right-8 top-12"
          >
            <div className="flex size-14 items-center justify-center rounded-2xl border border-[#171912]/10 bg-white p-3 shadow-xl">
              <div className="size-full rounded-lg bg-[#ff8b5e]/10 flex items-center justify-center text-[#ff8b5e]">
                <X size={20} strokeWidth={3} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0, x: -20 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute -left-12 bottom-16"
          >
            <div className="rounded-2xl border border-[#171912]/10 bg-[#171912] px-5 py-3 shadow-2xl">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Missing Source</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Ghost Layers */}
        <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rotate-3 rounded-[32px] border border-[#171912]/5 bg-white/40" />
        <div className="absolute inset-0 -z-20 translate-x-8 translate-y-8 rotate-6 rounded-[32px] border border-[#171912]/5 bg-white/10" />
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
              className="size-1.5 rounded-full bg-[#ff8b5e]"
            />
          ))}
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#6c7065]">Analysis Pending</p>
      </div>
    </motion.div>
  );
}

function EnginePhase() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col items-center gap-14"
    >
      <div className="relative h-72 w-[440px] overflow-hidden rounded-[40px] border-[1.5px] border-[#171912]/10 bg-white/60 p-1 shadow-2xl backdrop-blur-2xl">
        <div className="size-full overflow-hidden rounded-[36px] bg-[#f6f1e8]/30 p-8">
          {/* Top Bar */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity size={18} className="text-[#171912]" />
              <div className="h-2 w-24 rounded-full bg-[#171912]/10" />
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => <div key={i} className="size-2 rounded-full bg-[#171912]/20" />)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#171912]/5">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className="h-full w-full bg-[#c8f85a]"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center rounded-3xl border border-[#171912]/5 bg-white/50 p-6 shadow-inner">
              <Target size={32} className="mb-3 text-[#171912]" />
              <div className="h-1.5 w-16 rounded-full bg-[#171912]/20" />
            </div>
          </div>
        </div>

        {/* The Premium Laser HUD */}
        <motion.div
          animate={{ y: [-40, 320] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[#c8f85a]/40 to-transparent shadow-[0_0_40px_rgba(200,248,90,0.5)]"
        >
          <div className="absolute top-1/2 h-[1px] w-full bg-[#c8f85a]" />
        </motion.div>

        {/* Central HUD Logic */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-4 rounded-full border border-[#171912]/10 bg-[#171912] px-8 py-4 text-white shadow-2xl"
          >
            <Zap size={20} className="text-[#c8f85a]" fill="currentColor" />
            <span className="text-[13px] font-black uppercase tracking-[0.3em]">AI Synthesis</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function FinalPhase() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="relative flex flex-col items-center gap-10"
    >
      <div className="relative">
        {/* The Radiant Final Report */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 h-72 w-56 rounded-[40px] border-[2px] border-[#171912] bg-[#c8f85a] p-8 shadow-[16px_16px_0_#171912]"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <ShieldCheck size={28} strokeWidth={2.5} className="text-[#171912]" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-16 rounded-full bg-[#171912]" />
                <div className="h-2 w-10 rounded-full bg-[#171912]/30" />
              </div>
            </div>
            
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-2 w-full rounded-full bg-[#171912]/10" />
              ))}
            </div>

            <div className="mt-auto flex justify-between items-end">
              <div className="size-10 rounded-lg bg-[#171912]/5" />
              <Sparkles size={24} className="text-[#171912]" />
            </div>
          </div>
        </motion.div>

        {/* Success HUD Elements */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="absolute -right-16 -top-10"
        >
          <div className="rounded-3xl border border-[#171912]/10 bg-white px-7 py-5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#6c7065]">Readiness</span>
                <strong className="text-3xl font-black italic tracking-tighter text-[#171912]">98%</strong>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="absolute -left-12 top-1/2 size-20 -translate-y-1/2 rounded-full border border-[#171912]/10 bg-white p-4 shadow-2xl backdrop-blur-md"
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#eff9d4]">
            <Check size={32} strokeWidth={4} className="text-[#566b18]" />
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-black uppercase tracking-[0.5em] text-[#171912]">High Integrity</p>
        <div className="h-1 w-32 rounded-full bg-[#171912]/5 overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="h-full w-full bg-[#c8f85a]" 
          />
        </div>
      </div>
    </motion.div>
  );
}
