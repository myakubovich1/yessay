import type { Metadata } from "next";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { PricingGrid } from "@/components/marketing/pricing-grid";
import { PromoCodeForm } from "@/components/marketing/promo-code-form";
import { Footer } from "@/components/shared/footer";
import { GradientBackground } from "@/components/shared/gradient-background";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Choose a single essay report, a seven-day Finals Pass, monthly access, or annual access.",
};

export default function PricingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pt-28">
      <GradientBackground />
      <section className="page-shell pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Simple pricing</p>
          <h1 className="mt-5 text-balance text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#171912] sm:text-6xl">
            Pick the access that fits your deadline.
          </h1>
          <p className="mt-5 text-base leading-7 text-[#6c7065]">
            Run one analysis first. Your score and issue count are visible
            before payment; recommendations and additional analyses require
            access.
          </p>
        </div>

        <div className="mt-12">
          <PricingGrid />
        </div>

        <PromoCodeForm className="mt-10" />

        <div className="mx-auto mt-10 flex max-w-2xl flex-col justify-center gap-3 text-sm font-semibold text-[#5f6359] sm:flex-row sm:gap-8">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#617c12]" />
            One-time option available for a single report
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#617c12]" />
            Revision guidance, never grade promises
          </span>
        </div>

        <div className="mx-auto mt-16 max-w-3xl border-y border-[#171912]/14 py-8">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              [
                "Before Payment",
                "Readiness score and total issue count. No actionable recommendations are shown.",
              ],
              [
                "Full Report",
                "Every rubric category, thesis note, citation warning, priority fix, and checklist item.",
              ],
              [
                "Annual Access",
                "Unlimited full reports for $49.99/year, including every future check during the access period.",
              ],
            ].map(([title, copy]) => (
              <div key={title}>
                <h2 className="font-extrabold text-[#171912]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#6c7065]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
