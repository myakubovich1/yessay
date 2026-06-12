"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CalendarCheck2,
  Check,
  FileCheck2,
  GraduationCap,
  LoaderCircle,
  TimerReset,
} from "lucide-react";
import type { PricingPlan } from "@/lib/pricing";
import type { PricingProduct } from "@/lib/types";
import { cn } from "@/lib/utils";

function PlanIcon({ product }: { product?: PricingProduct }) {
  if (product === "finals_pass") {
    return <TimerReset size={20} strokeWidth={2.2} />;
  }
  if (product === "monthly") {
    return <GraduationCap size={20} strokeWidth={2.2} />;
  }
  if (product === "annual") {
    return <CalendarCheck2 size={20} strokeWidth={2.2} />;
  }
  return <FileCheck2 size={20} strokeWidth={2.2} />;
}

function getPlanCta(product?: PricingProduct) {
  if (product === "single_report") return "Unlock one report";
  if (product === "finals_pass") return "Get the 7-day pass";
  if (product === "annual") return "Get annual access";
  return "Get monthly access";
}

export function PricingCard({
  plan,
  onCheckout,
  loading = false,
  ctaLabel,
}: {
  plan: PricingPlan;
  onCheckout?: (product: PricingProduct) => void;
  loading?: boolean;
  ctaLabel?: string;
}) {
  const buttonLabel = ctaLabel || getPlanCta(plan.product);

  return (
    <article
      className={cn(
        "pricing-card",
        `pricing-card--${plan.accent}`,
        plan.highlighted && "pricing-card--highlighted",
      )}
    >
      <div className="pricing-card__top">
        <span className="pricing-card__icon">
          <PlanIcon product={plan.product} />
        </span>
        {plan.label && (
          <span className="pricing-card__label">{plan.label}</span>
        )}
      </div>

      <p className="pricing-card__name">{plan.name}</p>
      <div className="pricing-card__price">
        <strong>{plan.monthlyEquivalent || plan.price}</strong>
        {plan.monthlyEquivalent ? (
          <span>/month</span>
        ) : (
          plan.cadence && <span>{plan.cadence}</span>
        )}
      </div>
      {plan.monthlyEquivalent && (
        <p className="pricing-card__billed-as">
          Billed yearly as {plan.price}
        </p>
      )}
      <p className="pricing-card__description">{plan.description}</p>
      <span className="pricing-card__value">{plan.valueNote}</span>

      <ul className="pricing-card__features">
        {plan.features.map((feature) => (
          <li key={feature}>
            <span>
              <Check size={13} strokeWidth={3} />
            </span>
            <p>{feature}</p>
          </li>
        ))}
      </ul>

      {plan.product && onCheckout ? (
        <button
          type="button"
          onClick={() => onCheckout(plan.product!)}
          disabled={loading}
          className="pricing-card__button"
        >
          {loading && <LoaderCircle size={17} className="animate-spin" />}
          {buttonLabel}
          {!loading && <ArrowUpRight size={17} />}
        </button>
      ) : (
        <Link href="/pricing" className="pricing-card__button">
          {buttonLabel}
          <ArrowUpRight size={17} />
        </Link>
      )}
      <p className="pricing-card__billing">{plan.billingNote}</p>
    </article>
  );
}
