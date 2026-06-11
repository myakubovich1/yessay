import type { ReactNode } from "react";
import { GlassCard } from "@/components/ui/glass-card";

export function ReportSection({
  title,
  description,
  icon,
  children,
  id,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  id?: string;
}) {
  return (
    <GlassCard id={id} className="scroll-mt-24 p-5 sm:p-7">
      <div className="mb-5 flex items-start gap-3">
        {icon && (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[14px] border border-[#171912] bg-[#c8f85a] text-[#171912]">
            {icon}
          </span>
        )}
        <div>
          <h2 className="text-lg font-extrabold text-[#171912]">{title}</h2>
          {description && (
            <p className="mt-1 text-sm leading-6 text-[#6c7065]">
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </GlassCard>
  );
}
