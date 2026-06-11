import Link from "next/link";
import { cn } from "@/lib/utils";
import { YessayLogo } from "./yessay-logo";

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 font-black tracking-[-0.04em]",
        light ? "text-white" : "text-[#171912]",
      )}
      aria-label="Yessay home"
    >
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-[14px] border-[1.5px]",
          light
            ? "border-white/70 bg-[#c8f85a] text-[#171912]"
            : "border-[#171912] bg-[#c8f85a] text-[#171912] shadow-[0_3px_0_#171912]",
        )}
      >
        <YessayLogo className="h-7 w-6" />
      </span>
      <span className="text-[1.18rem]">Yessay</span>
    </Link>
  );
}
