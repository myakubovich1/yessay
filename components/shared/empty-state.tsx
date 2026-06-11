import Link from "next/link";
import { FileSearch, Plus } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export function EmptyState({
  title = "No reports yet",
  description = "Run your first essay check and the report will appear here.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <GlassCard className="flex flex-col items-center px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-[#171912] bg-[#c8f85a] text-[#171912] shadow-[0_4px_0_#171912]">
        <FileSearch size={25} />
      </div>
      <h2 className="mt-5 text-xl font-extrabold text-[#171912]">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#6c7065]">
        {description}
      </p>
      <Link href="/check" className="primary-button mt-6">
        <Plus size={17} />
        Check an essay
      </Link>
    </GlassCard>
  );
}
