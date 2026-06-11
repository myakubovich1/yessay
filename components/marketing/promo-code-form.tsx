"use client";

import { useState } from "react";
import { LoaderCircle, TicketPercent } from "lucide-react";
import { getReports } from "@/lib/storage/local-reports";

export function PromoCodeForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redeem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!code.trim() || loading) return;

    setLoading(true);
    setError("");
    try {
      const lockedReportId = getReports().find((report) => report.locked)?.id;
      const response = await fetch("/api/redeem-promo-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), reportId: lockedReportId }),
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
    <div className="mx-auto mt-10 max-w-md text-center">
      <p className="flex items-center justify-center gap-2 text-sm font-semibold text-[#5f6359]">
        <TicketPercent size={16} className="text-[#617c12]" />
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
          className="min-w-0 flex-1 rounded-xl border border-[#171912]/20 bg-white/80 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-[#171912] placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-[#9a9e93] focus:border-[#617c12] focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="flex items-center gap-2 rounded-xl border border-[#171912] bg-[#c8f85a] px-5 py-2.5 text-sm font-extrabold text-[#171912] shadow-[0_3px_0_#171912] transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            "Apply"
          )}
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-[#934157]">
          {error}
        </p>
      )}
    </div>
  );
}
