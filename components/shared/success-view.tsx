"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Check, LoaderCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { grantAccess } from "@/lib/storage/local-access";
import {
  saveFixGrant,
  type StoredFixGrant,
} from "@/lib/storage/local-entitlements";
import { getReports } from "@/lib/storage/local-reports";
import type { PricingProduct } from "@/lib/types";

type VerificationState =
  | { status: "verifying" }
  | {
      status: "success";
      product: PricingProduct;
      reportId?: string;
      demo: boolean;
      via?: "demo" | "promo";
    }
  | { status: "error"; message: string };

export function SuccessView({
  sessionId,
  demoToken,
}: {
  sessionId?: string;
  demoToken?: string;
}) {
  const [verification, setVerification] = useState<VerificationState>({
    status: "verifying",
  });

  useEffect(() => {
    const controller = new AbortController();

    async function verifyCheckout() {
      try {
        const response = await fetch("/api/verify-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, demoToken }),
          signal: controller.signal,
        });
        const data = (await response.json()) as
          | {
              product: PricingProduct;
              reportId?: string;
              demo: boolean;
              via?: "demo" | "promo";
              fixGrant?: StoredFixGrant;
            }
          | { error: string };
        if (!response.ok || "error" in data) {
          throw new Error(
            "error" in data ? data.error : "Checkout verification failed.",
          );
        }

        grantAccess(data.product, data.reportId);
        if (data.fixGrant) saveFixGrant(data.fixGrant);
        // Subscriptions unlock every saved report; land on the latest one
        // instead of sending the buyer back through the check form.
        const reportId =
          data.reportId ||
          (data.product !== "single_report"
            ? getReports()[0]?.id
            : undefined);
        setVerification({ status: "success", ...data, reportId });
      } catch (error) {
        if (controller.signal.aborted) return;
        setVerification({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Checkout verification failed.",
        });
      }
    }

    void verifyCheckout();
    return () => controller.abort();
  }, [demoToken, sessionId]);

  if (verification.status === "verifying") {
    return (
      <GlassCard className="mx-auto max-w-xl px-6 py-12 text-center sm:px-10">
        <LoaderCircle
          size={38}
          className="mx-auto animate-spin text-[#617c12]"
        />
        <h1 className="mt-6 text-3xl font-black tracking-[-0.04em] text-[#171912]">
          Confirming your access
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#6c7065]">
          Keep this page open while Yessay verifies the checkout.
        </p>
      </GlassCard>
    );
  }

  if (verification.status === "error") {
    return (
      <GlassCard className="mx-auto max-w-xl px-6 py-12 text-center sm:px-10">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#9a4559] bg-[#ffe3dc] text-[#9a4559]">
          <AlertTriangle size={25} />
        </span>
        <h1 className="mt-6 text-3xl font-black tracking-[-0.04em] text-[#171912]">
          We couldn&apos;t confirm access
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#6c7065]">
          {verification.message}
        </p>
        <Link href="/pricing" className="secondary-button mt-7">
          Return to pricing
        </Link>
      </GlassCard>
    );
  }

  const accessMessage =
    verification.product === "draft_repair"
      ? "Draft repair is unlocked for this report. Run it from the report page and review every change."
      : verification.product === "finals_pass"
        ? "Your seven-day Finals Pass is active in this browser, including future checks and draft repairs."
        : verification.product === "monthly"
          ? "Your monthly access is active in this browser, including future checks and draft repairs."
          : verification.product === "annual"
            ? "Your annual access is active in this browser, including future checks and draft repairs."
            : verification.reportId
              ? "Your full report is ready in this browser."
              : "One full-report credit is ready for your next essay analysis.";

  const destination = verification.reportId
    ? `/report/${verification.reportId}`
    : verification.product === "single_report"
      ? "/check"
      : "/dashboard";

  return (
    <GlassCard className="mx-auto max-w-xl px-6 py-12 text-center sm:px-10">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#171912] bg-[#c8f85a] text-[#171912] shadow-[0_4px_0_#171912]">
        <Check size={25} strokeWidth={2.5} />
      </span>
      <p className="eyebrow mt-6">
        {verification.via === "promo"
          ? "Promo code redeemed"
          : verification.demo
            ? "Demo checkout complete"
            : "Payment confirmed"}
      </p>
      <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#171912]">
        You&apos;re unlocked.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#6c7065]">
        {accessMessage} Work through the highest-priority fixes first.
      </p>
      <Link href={destination} className="primary-button mt-7">
        {verification.reportId
          ? "Return to report"
          : verification.product === "single_report"
            ? "Analyze my next essay"
            : "Open dashboard"}
        <ArrowRight size={16} />
      </Link>
    </GlassCard>
  );
}
