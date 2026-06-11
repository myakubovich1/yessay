import { LockKeyhole } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export function LockedSection({ title }: { title: string }) {
  return (
    <GlassCard className="relative min-h-52 overflow-hidden border-[#171912]/12 bg-[#fffdf8] p-6">
      <div className="select-none space-y-3 opacity-40 blur-[6px]">
        <div className="h-5 w-40 rounded-full bg-[#171912]" />
        <div className="h-3 w-full rounded-full bg-[#a9aa9f]" />
        <div className="h-3 w-11/12 rounded-full bg-[#a9aa9f]" />
        <div className="mt-6 h-12 w-full rounded-xl bg-[#d9d6ce]" />
        <div className="h-12 w-full rounded-xl bg-[#d9d6ce]" />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#fffdf8]/46 text-center backdrop-blur-[2px]">
        <span className="flex size-11 items-center justify-center rounded-xl border border-[#171912]/15 bg-[#c8f85a] text-[#171912] shadow-sm">
          <LockKeyhole size={19} />
        </span>
        <p className="mt-3 font-extrabold text-[#171912]">{title}</p>
        <p className="mt-1 text-xs text-[#6c7065]">Unlock to reveal</p>
      </div>
    </GlassCard>
  );
}
