"use client";

import { useState } from "react";
import { LoaderCircle, TicketPercent } from "lucide-react";
import { getReports } from "@/lib/storage/local-reports";
import { cn } from "@/lib/utils";

const styles = {
  light: {
    label: "text-sm font-semibold text-[#5f6359]",
    input:
      "min-w-0 flex-1 rounded-xl border border-[#171912]/20 bg-white/80 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-[#171912] placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-[#9a9e93] focus:border-[#617c12] focus:outline-none",
    button:
      "flex items-center gap-2 rounded-xl border border-[#171912] bg-[#c8f85a] px-5 py-2.5 text-sm font-extrabold text-[#171912] shadow-[0_3px_0_#171912] transition disabled:cursor-not-allowed disabled:opacity-50",
    error: "mt-3 text-sm font-semibold text-[#934157]",
  },
  dark: {
    label:
      "text-[0.61rem] font-extrabold uppercase tracking-[0.08em] text-white/40",
    input:
      "min-w-0 flex-1 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#fffdf8] placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-white/35 focus:border-[#c8f85a] focus:outline-none",
    button:
      "flex items-center gap-2 rounded-xl bg-[#c8f85a] px-4 py-2.5 text-xs font-extrabold text-[#171912] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50",
    error: "mt-3 text-xs font-semibold text-[#ffb4a8]",
  },
};

export function PromoCodeForm({
  reportId,
  variant = "light",
  className,
}: {
  reportId?: string;
  variant?: "light" | "dark";
  className?: string;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const style = styles[variant];

  const redeem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!code.trim() || loading) return;

    setLoading(true);
    setError("");
    try {
      const targetReportId =
        reportId || getReports().find((report) => report.locked)?.id;
      const response = await fetch("/api/redeem-promo-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), reportId: targetReportId }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error || "That promo code isn't valid.");
      }
      window.location.href = data.url;
    } catch (redeemError) {
      setError(
        redeemError instanceof Error
          ? redeemError.message
          : "That promo code isn't valid.",
      );
      setLoading(false);
    }
  };

  return (
    <div className={cn(variant === "light" && "text-center", className)}>
      <p
        className={cn(
          "flex items-center gap-2",
          variant === "light" && "justify-center",
          style.label,
        )}
      >
        <TicketPercent
          size={variant === "light" ? 16 : 13}
          className={variant === "light" ? "text-[#617c12]" : "text-[#c8f85a]"}
        />
        Have a promo code?
      </p>
      <form onSubmit={redeem} className="mt-3 flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Enter your code"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          className={style.input}
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className={style.button}
        >
          {loading ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            "Apply"
          )}
        </button>
      </form>
      {error && (
        <p role="alert" className={style.error}>
          {error}
        </p>
      )}
    </div>
  );
}
