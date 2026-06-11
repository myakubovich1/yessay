import {
  CalendarCheck2,
  Check,
  LoaderCircle,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import { PromoCodeForm } from "@/components/marketing/promo-code-form";
import { getPricingPlan } from "@/lib/pricing";
import type { PricingProduct } from "@/lib/types";

const alternativeProducts: PricingProduct[] = [
  "single_report",
  "monthly",
  "finals_pass",
];

export function ReportPaywall({
  checkout,
  loading,
  reportId,
}: {
  checkout: (product: PricingProduct) => void;
  loading: PricingProduct | null;
  reportId?: string;
}) {
  const annual = getPricingPlan("annual");
  const alternatives = alternativeProducts
    .map(getPricingPlan)
    .filter((plan) => plan !== undefined);

  if (!annual) return null;

  return (
    <section id="unlock-report" className="report-paywall no-print">
      <div className="report-paywall__intro">
        <span className="report-paywall__lock">
          <LockKeyhole size={20} />
        </span>
        <div>
          <p className="report-paywall__eyebrow">Analysis complete</p>
          <h2>Unlock the exact changes that improve this draft.</h2>
          <p>
            Every rubric finding, citation warning, priority fix, and revision
            checklist item is ready behind the paywall.
          </p>
        </div>
      </div>

      <div className="report-paywall__offers">
        <div className="report-paywall__annual">
          <div className="report-paywall__annual-top">
            <span className="report-paywall__annual-icon">
              <CalendarCheck2 size={20} />
            </span>
            <span className="report-paywall__badge">Recommended</span>
          </div>
          <p className="report-paywall__plan-name">Annual access</p>
          <div className="report-paywall__price">
            <strong>{annual.price}</strong>
            <span>{annual.cadence}</span>
          </div>
          <p className="report-paywall__saving">{annual.valueNote}</p>
          <ul>
            {annual.features.map((feature) => (
              <li key={feature}>
                <Check size={13} strokeWidth={3} />
                {feature}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => checkout("annual")}
            disabled={loading !== null}
          >
            {loading === "annual" ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Sparkles size={17} />
            )}
            {loading === "annual"
              ? "Opening checkout..."
              : "Unlock every report"}
          </button>
          <small>{annual.billingNote}</small>
        </div>

        <div className="report-paywall__alternatives">
          <p className="report-paywall__choice-label">
            Or choose shorter access
          </p>
          {alternatives.map((plan) => (
            <button
              key={plan.product}
              type="button"
              className="report-paywall__alternative"
              onClick={() => checkout(plan.product!)}
              disabled={loading !== null}
            >
              <span>
                <strong>{plan.name}</strong>
                <small>{plan.billingNote}</small>
              </span>
              <span className="report-paywall__alternative-price">
                {loading === plan.product ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <>
                    <strong>{plan.price}</strong>
                    {plan.cadence && <small>{plan.cadence}</small>}
                  </>
                )}
              </span>
            </button>
          ))}
          <p className="report-paywall__fine-print">
            One report and Finals Pass are one-time payments. Subscription
            options renew at the cadence shown.
          </p>
          <PromoCodeForm
            variant="dark"
            reportId={reportId}
            className="mt-4 border-t border-white/10 pt-4"
          />
        </div>
      </div>
    </section>
  );
}
