import { Check, CircleAlert, CircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChecklistItem({
  item,
  status,
  checked,
  onChange,
}: {
  item: string;
  status: "complete" | "needs_work" | "missing";
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const Icon =
    status === "complete"
      ? Check
      : status === "missing"
        ? CircleAlert
        : CircleDashed;

  return (
    <label className="flex cursor-pointer items-start gap-3 border-b border-[#e4e8ef] py-3 last:border-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 size-5 shrink-0 accent-[#3b8068]"
      />
      <span
        className={cn(
          "min-w-0 flex-1 text-sm leading-6 text-[#3c485e]",
          checked && "text-[#748093] line-through",
        )}
      >
        {item}
      </span>
      <span
        className={cn(
          "mt-0.5 hidden size-6 shrink-0 items-center justify-center rounded-full sm:flex",
          status === "complete" && "bg-[#e2f2ea] text-[#357961]",
          status === "needs_work" && "bg-[#f4ecd9] text-[#8a682d]",
          status === "missing" && "bg-[#f8e2e7] text-[#a3485f]",
        )}
        aria-hidden="true"
      >
        <Icon size={14} />
      </span>
    </label>
  );
}
