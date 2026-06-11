import Link from "next/link";
import { ArrowRight, Eye, ShieldCheck } from "lucide-react";

export function PricingPreview() {
  return (
    <div className="pricing-preview">
      <span className="pricing-preview__icon">
        <Eye size={21} />
      </span>
      <div className="pricing-preview__copy">
        <strong>Run the analysis before you choose a plan</strong>
        <p>
          Your first score and issue count are free to view. Actionable feedback
          and additional analyses unlock with payment.
        </p>
      </div>
      <span className="pricing-preview__trust">
        <ShieldCheck size={15} />
        Preview before checkout
      </span>
      <Link href="/check" className="pricing-preview__button">
        Analyze a draft
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
