import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const labels = ["Assignment", "Rubric", "Draft"];

export function Stepper({
  step,
  onStepChange,
}: {
  step: number;
  onStepChange?: (step: number) => void;
}) {
  return (
    <ol className="grid grid-cols-3 gap-2" aria-label="Essay check progress">
      {labels.map((label, index) => {
        const stepNumber = index + 1;
        const complete = step > stepNumber;
        const active = step === stepNumber;
        return (
          <li key={label} className="relative">
            <div
              className={cn(
                "mb-2 h-1 rounded-full transition-colors",
                complete || active ? "bg-[#171912]" : "bg-[#dedbd2]",
              )}
            />
            <button
              type="button"
              onClick={() => onStepChange?.(stepNumber)}
              disabled={!onStepChange || stepNumber > step}
              aria-current={active ? "step" : undefined}
              className="flex items-center gap-2 text-left disabled:cursor-default"
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                  complete
                    ? "bg-[#c8f85a] text-[#171912]"
                    : active
                      ? "bg-[#171912] text-white"
                      : "bg-[#e9e5dc] text-[#777a70]",
                )}
              >
                {complete ? <Check size={13} /> : stepNumber}
              </span>
              <span
                className={cn(
                  "truncate text-xs font-semibold",
                  active ? "text-[#171912]" : "text-[#777a70]",
                )}
              >
                {label}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
