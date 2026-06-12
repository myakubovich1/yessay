import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import type { PricingProduct } from "@/lib/types";

/**
 * Signed, stateless proof that a checkout granted repair access. Issued by
 * verify-checkout-session after a verified payment (or promo/demo grant) and
 * required by /api/fix-essay, so the costly OpenAI call cannot be reached
 * from DevTools alone. Stateless means a token is reusable until it expires;
 * per-use metering arrives with the database migration.
 */

export type FixEntitlement = {
  product: PricingProduct;
  /** Present for draft_repair: the single report the purchase covers. */
  reportId?: string;
  expiresAt: number;
};

const FIX_PRODUCTS: PricingProduct[] = [
  "draft_repair",
  "finals_pass",
  "monthly",
  "annual",
];

const DAY = 24 * 60 * 60 * 1000;

export function fixEntitlementDuration(product: PricingProduct) {
  if (product === "finals_pass") return 7 * DAY;
  if (product === "monthly") return 31 * DAY;
  if (product === "annual") return 366 * DAY;
  if (product === "draft_repair") return 30 * DAY;
  return 0;
}

function getSigningSecret() {
  const secret =
    process.env.CHECKOUT_DEMO_SECRET || process.env.STRIPE_SECRET_KEY;
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") {
    return "yessay-local-demo-checkout";
  }
  throw new Error("A signing secret is required for entitlement tokens.");
}

function sign(payload: string) {
  return createHmac("sha256", `${getSigningSecret()}:entitlement`)
    .update(payload)
    .digest("base64url");
}

export function createFixEntitlementToken(
  product: PricingProduct,
  reportId?: string,
): { token: string; entitlement: FixEntitlement } | null {
  if (!FIX_PRODUCTS.includes(product)) return null;
  if (product === "draft_repair" && !reportId) return null;

  const entitlement: FixEntitlement = {
    product,
    reportId: product === "draft_repair" ? reportId : undefined,
    expiresAt: Date.now() + fixEntitlementDuration(product),
  };
  const payload = Buffer.from(JSON.stringify(entitlement)).toString(
    "base64url",
  );
  return { token: `${payload}.${sign(payload)}`, entitlement };
}

export function verifyFixEntitlementToken(
  token: string,
  reportId: string,
): FixEntitlement | null {
  const [payload, suppliedSignature] = token.split(".");
  if (!payload || !suppliedSignature) return null;

  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(sign(payload));
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return null;
  }

  try {
    const entitlement = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as FixEntitlement;
    if (
      entitlement.expiresAt <= Date.now() ||
      !FIX_PRODUCTS.includes(entitlement.product)
    ) {
      return null;
    }
    if (
      entitlement.product === "draft_repair" &&
      entitlement.reportId !== reportId
    ) {
      return null;
    }
    return entitlement;
  } catch {
    return null;
  }
}
