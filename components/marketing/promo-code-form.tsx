"use client";

import { useState } from "react";
import { LoaderCircle, TicketPercent } from "lucide-react";
import { getReports } from "@/lib/storage/local-reports";
import { cn } from "@/lib/utils";

const styles = {
  light: {
    root: "glass-subtle mx-auto w-full max-w-md rounded-[24px] px-6 py-6 text-center",
    label:
      "flex items-center justify-center gap-2 text-sm font-extrabold text-[#171912]",
    icon: "text-[#617c12]",
    hint: "mt-1.5 text-xs leading-5 text-[#6c7065]",
    form: "mt-4 flex items-center gap-2.5",
    input:
      "h-[50px] min-w-0 flex-1 rounded-full border-[1.5px] border-[#171912]/18 bg-white px-5 text-sm font-semibold uppercase tracking-wide text-[#171912] placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-[#9a9e93] focus:border-[#617c12] focus:outline-none",
    button: "primary-button px-7 text-sm",
    error: "mt-3 text-sm font-semibold text-[#934157]",
  },
  dark: {
    root: "",
    label:
      "flex items-center gap-2 text-[0.61rem] font-extrabold uppercase tracking-[0.08em] text-white/40",
    icon: "text-[#c8f85a]",
    hint: null,
    form: "mt-3 flex items-center gap-2",
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
    <div className={cn(style.root, className)}>
      <p className={style.label}>
        <TicketPercent
          size={variant === "light" ? 16 : 13}
          className={style.icon}
        />
        Have a promo code?
      </p>
      {style.hint && (
        <p className={style.hint}>
          Redeem it here for instant access — no card required.
        </p>
      )}
      <form onSubmit={redeem} className={style.form}>
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
