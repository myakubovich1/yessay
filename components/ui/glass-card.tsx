import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = ComponentProps<"div"> & {
  subtle?: boolean;
};

export function GlassCard({
  className,
  subtle = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        subtle ? "glass-subtle" : "glass",
        "rounded-[24px]",
        className,
      )}
      {...props}
    />
  );
}
