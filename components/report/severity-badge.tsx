import type { Severity } from "@/lib/types";
import { cn } from "@/lib/utils";

const styles: Record<Severity, string> = {
  high: "bg-[#f3bdd3] text-[#6b2943]",
  medium: "bg-[#ffe178] text-[#5c4810]",
  low: "bg-[#cfc3ff] text-[#41356f]",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={cn(
        "rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
        styles[severity],
      )}
    >
      {severity}
    </span>
  );
}
