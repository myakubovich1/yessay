import Stripe from "stripe";
import {
  singleReportPriceVariant,
  type SingleReportPriceVariant,
} from "@/lib/pricing";
import type { PricingProduct } from "@/lib/types";

export function getStripe() {
  return process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;
}

export function getPriceId(product: PricingProduct) {
  const singleReportPrices: Record<
    SingleReportPriceVariant,
    string | undefined
  > = {
    "699": process.env.STRIPE_SINGLE_REPORT_PRICE_ID_699,
    "799": process.env.STRIPE_SINGLE_REPORT_PRICE_ID_799,
    "999": process.env.STRIPE_SINGLE_REPORT_PRICE_ID_999,
  };
  const prices: Record<PricingProduct, string | undefined> = {
    single_report:
      singleReportPrices[singleReportPriceVariant] ||
      process.env.STRIPE_SINGLE_REPORT_PRICE_ID,
    draft_repair: process.env.STRIPE_DRAFT_REPAIR_PRICE_ID,
    finals_pass: process.env.STRIPE_FINALS_PASS_PRICE_ID,
    monthly: process.env.STRIPE_MONTHLY_PRICE_ID,
    annual: process.env.STRIPE_ANNUAL_PRICE_ID,
  };
  return prices[product];
}
