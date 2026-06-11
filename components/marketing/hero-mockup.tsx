import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  FileText,
  Quote,
  Sparkles,
} from "lucide-react";

const checks = [
  {
    icon: AlertTriangle,
    label: "Source requirement",
    detail: "Works Cited page not detected",
    tone: "bg-[#ff8b5e]",
  },
  {
    icon: Quote,
    label: "Counterargument",
    detail: "Needs one more evidence link",
    tone: "bg-[#cfc3ff]",
  },
  {
    icon: Check,
    label: "Thesis",
    detail: "Clear and debatable",
    tone: "bg-[#c8f85a]",
  },
];

export function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[510px]">
      <div className="absolute -left-8 top-16 hidden rotate-[-9deg] rounded-full border border-[#171912] bg-[#ff8b5e] px-4 py-2 text-xs font-black text-[#171912] shadow-[0_4px_0_#171912] sm:block">
        3 fixes found
      </div>
      <div className="absolute -right-7 bottom-16 z-20 hidden rotate-[7deg] rounded-full border border-[#171912] bg-[#c8f85a] px-4 py-2 text-xs font-black text-[#171912] shadow-[0_4px_0_#171912] sm:block">
        Ready to revise
      </div>

      <div className="rotate-[1.5deg] rounded-[38px] border-2 border-white/18 bg-[#f6f1e8] p-3 shadow-[0_28px_80px_rgba(0,0,0,0.34)]">
        <div className="overflow-hidden rounded-[30px] border border-[#171912] bg-[#fffdf8] text-[#171912]">
          <div className="flex items-center justify-between border-b border-[#171912]/12 px-5 py-4">
            <span className="flex items-center gap-2 text-sm font-black">
              <span className="flex size-8 items-center justify-center rounded-xl bg-[#171912] text-[#c8f85a]">
                <FileText size={16} />
              </span>
              Essay report
            </span>
            <span className="rounded-full bg-[#eff9d4] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider">
              Needs fixes
            </span>
          </div>

          <div className="grid gap-5 bg-[#171912] p-5 text-white sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/45">
                Public transit argument
              </p>
              <p className="mt-2 text-xl font-black leading-tight">
                Strong draft. Fix the sourcing before submission.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-white/58">
                <Sparkles size={14} className="text-[#c8f85a]" />
                Checked against prompt + rubric
              </div>
            </div>
            <div
              className="relative flex size-28 items-center justify-center rounded-full"
              style={{
                background:
                  "conic-gradient(#c8f85a 0deg 274deg, rgba(255,255,255,.12) 274deg 360deg)",
              }}
            >
              <div className="flex size-[82px] flex-col items-center justify-center rounded-full bg-[#171912]">
                <span className="text-3xl font-black">76</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/45">
                  score
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-3 gap-2">
              {[
                ["88", "Prompt"],
                ["74", "Evidence"],
                ["69", "Citations"],
              ].map(([score, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[#171912]/12 bg-[#f6f1e8] p-3"
                >
                  <p className="text-lg font-black">{score}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#777a70]">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 space-y-2">
              {checks.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl border border-[#171912]/12 bg-white p-3"
                >
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#171912] ${item.tone}`}
                  >
                    <item.icon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#777a70]">
                      {item.label}
                    </p>
                    <p className="truncate text-xs font-bold">{item.detail}</p>
                  </div>
                  <ArrowUpRight size={15} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
