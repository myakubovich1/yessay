"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { pricingPlans } from "@/lib/pricing";
import { getReports } from "@/lib/storage/local-reports";
import type { PricingProduct } from "@/lib/types";
import { PricingCard } from "./pricing-card";
import { PricingPreview } from "./pricing-preview";

export function PricingGrid() {
  const router = useRouter();
  const [loading, setLoading] = useState<PricingProduct | null>(null);
  const [error, setError] = useState("");
  const [hasReports, setHasReports] = useState(false);
  const [lockedReportId, setLockedReportId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const reports = getReports();
      setHasReports(reports.length > 0);
      setLockedReportId(reports.find((report) => report.locked)?.id || null);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const checkout = async (product: PricingProduct) => {
    if (product === "single_report") {
      if (lockedReportId) {
        router.push(`/report/${lockedReportId}`);
        return;
      }
      if (!hasReports) {
        router.push("/check");
        return;
      }
    }

    setLoading(product);
    setError("");
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          reportId: lockedReportId || undefined,
        }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Checkout is unavailable.");
      }
      trackEvent("checkout_started", { product, location: "pricing" });
      window.location.href = data.url;
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Checkout is unavailable.",
      );
      setLoading(null);
    }
  };

  return (
    <>
      {error && (
        <div
          role="alert"
          className="mx-auto mb-5 max-w-xl rounded-xl border border-[#efcfd6] bg-[#fbebee] px-4 py-3 text-center text-sm text-[#934157]"
        >
          {error}
        </div>
      )}
      <div className="pricing-offer-grid">
        {pricingPlans.map((plan) => (
          <PricingCard
            key={plan.name}
            plan={plan}
            onCheckout={checkout}
            loading={loading === plan.product}
            ctaLabel={
              plan.product === "single_report"
                ? lockedReportId
                  ? "Unlock latest report"
                  : hasReports
                    ? "Buy next report"
                    : "Analyze a draft first"
                : undefined
            }
          />
        ))}
      </div>
      <PricingPreview />
    </>
  );
}
