import type { PricingProduct } from "@/lib/types";

const singleReportVariants = {
  "699": "$6.99",
  "799": "$7.99",
  "999": "$9.99",
} as const;

export type SingleReportPriceVariant = keyof typeof singleReportVariants;

export const singleReportPriceVariant: SingleReportPriceVariant =
  process.env.NEXT_PUBLIC_SINGLE_REPORT_PRICE_VARIANT === "699" ||
  process.env.NEXT_PUBLIC_SINGLE_REPORT_PRICE_VARIANT === "999"
    ? process.env.NEXT_PUBLIC_SINGLE_REPORT_PRICE_VARIANT
    : "799";

export const singleReportPrice = singleReportVariants[singleReportPriceVariant];

export type PricingPlan = {
  name: string;
  price: string;
  cadence?: string;
  description: string;
  features: string[];
  product?: PricingProduct;
  highlighted?: boolean;
  label?: string;
  accent: "lavender" | "orange" | "lime" | "paper";
  valueNote: string;
  billingNote: string;
};

export const pricingPlans: PricingPlan[] = [
  {
    name: "Annual",
    price: "$49.99",
    cadence: "/year",
    description: "Unlimited reports through the full academic year.",
    features: [
      "Unlimited essay checks",
      "Unlimited AI draft repairs",
      "Due Tonight repair plans",
      "Every future report unlocked",
    ],
    product: "annual",
    highlighted: true,
    label: "Best value",
    accent: "lime",
    valueNote: "Save 58% vs monthly",
    billingNote: "Renews yearly · about $4.17/month",
  },
  {
    name: "Single Report",
    price: singleReportPrice,
    description: "Unlock the complete report for the draft due now.",
    features: [
      "Every rubric category",
      "Missing requirements + citation flags",
      "Ranked revision plan",
    ],
    product: "single_report",
    label: "One draft",
    accent: "lavender",
    valueNote: "Keep the full report",
    billingNote: "One-time payment",
  },
  {
    name: "Monthly",
    price: "$9.99",
    cadence: "/month",
    description: "Unlimited full feedback without a long commitment.",
    features: [
      "Unlimited essay checks",
      "Unlimited AI draft repairs",
      "Ongoing revision guidance",
    ],
    product: "monthly",
    accent: "paper",
    valueNote: "Flexible month-to-month access",
    billingNote: "Renews monthly",
  },
  {
    name: "Finals Pass",
    price: "$17.99",
    description: "Unlimited full reports during your busiest seven days.",
    features: [
      "Unlimited essay checks",
      "Unlimited AI draft repairs",
      "Due Tonight repair plans",
    ],
    product: "finals_pass",
    label: "No subscription",
    accent: "orange",
    valueNote: "Built for deadline week",
    billingNote: "One payment · expires in 7 days",
  },
];

export function getPricingPlan(product: PricingProduct) {
  return pricingPlans.find((plan) => plan.product === product);
}
