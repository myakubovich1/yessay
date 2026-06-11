import { cn } from "@/lib/utils";

export function GradientBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(246,241,232,0.96),rgba(255,253,248,0.88)_48%,rgba(239,249,212,0.8))]" />
      <div className="absolute -left-28 top-20 size-80 rounded-full bg-[#c8f85a]/24 blur-3xl" />
      <div className="absolute -right-24 top-1/3 size-72 rounded-full bg-[#ff8b5e]/14 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/80" />
    </div>
  );
}
