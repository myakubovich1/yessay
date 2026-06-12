import "server-only";

import type { PricingProduct } from "@/lib/types";

const products: PricingProduct[] = [
  "single_report",
  "draft_repair",
  "finals_pass",
  "monthly",
  "annual",
];

function getPromoCodeMap() {
  const map = new Map<string, PricingProduct>();
  for (const entry of (process.env.PROMO_CODES || "").split(",")) {
    const [code, product] = entry.split(":").map((part) => part.trim());
    if (code && products.includes(product as PricingProduct)) {
      map.set(code.toUpperCase(), product as PricingProduct);
    }
  }
  return map;
}

export function resolvePromoCode(code: string) {
  return getPromoCodeMap().get(code.trim().toUpperCase()) || null;
}
