import { ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export function AcademicIntegrityNotice({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <GlassCard subtle className={compact ? "flex gap-3 p-4" : "flex gap-4 p-6"}>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-[14px] border border-[#171912] bg-[#c8f85a] text-[#171912]">
        <ShieldCheck size={20} />
      </div>
      <div>
        <p className="font-extrabold text-[#171912]">
          Built for revision, not cheating.
        </p>
        <p className="mt-1 text-sm leading-6 text-[#686c61]">
          Yessay flags possible issues and gives revision direction. It does not
          write full essays, guarantee grades, or replace your professor&apos;s
          instructions.
        </p>
      </div>
    </GlassCard>
  );
}
