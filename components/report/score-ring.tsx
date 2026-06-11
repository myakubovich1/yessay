import { cn } from "@/lib/utils";

export function ScoreRing({
  score,
  size = "large",
}: {
  score: number;
  size?: "small" | "large";
}) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      className={cn(
        "relative shrink-0",
        size === "large" ? "size-36" : "size-20",
      )}
      aria-label={`Yessay score: ${score} out of 100`}
    >
      <svg className="-rotate-90 size-full" viewBox="0 0 100 100">
        <defs>
          <linearGradient id={`score-${size}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#b8ed42" />
            <stop offset="72%" stopColor="#c8f85a" />
            <stop offset="100%" stopColor="#ff8b5e" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(23,25,18,0.12)"
          strokeWidth="7"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={`url(#score-${size})`}
          strokeLinecap="round"
          strokeWidth="7"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "font-black tracking-[-0.05em] text-[#171912]",
            size === "large" ? "text-4xl" : "text-xl",
          )}
        >
          {score}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#777a70]">
          score
        </span>
      </div>
    </div>
  );
}
