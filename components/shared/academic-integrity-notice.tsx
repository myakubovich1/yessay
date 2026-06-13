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
        <blockquote className="mt-2 border-l-2 border-[#c8f85a] pl-3 text-sm italic leading-6 text-[#4a4e44]">
          “Humans are tool builders. We build tools that can dramatically
          amplify our innate human abilities.”
        </blockquote>
        <p className="mt-1.5 pl-3 text-xs font-bold not-italic text-[#686c61]">
          — Steve Jobs
        </p>
      </div>
    </GlassCard>
  );
}
