import type { ReadinessStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const styles: Record<ReadinessStatus, string> = {
  Strong: "bg-[#c8f85a] text-[#171912] border-[#171912]",
  "Mostly Ready": "bg-[#eff9d4] text-[#3f4c17] border-[#aeca52]",
  "Needs Fixes": "bg-[#ffe178] text-[#5c4810] border-[#d9b62f]",
  Risky: "bg-[#ffb28f] text-[#6d2f17] border-[#e47b4d]",
  "Not Ready": "bg-[#f3bdd3] text-[#6b2943] border-[#d77d9f]",
};

export function StatusBadge({ status }: { status: ReadinessStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}
