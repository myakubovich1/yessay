import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import type { PricingProduct } from "@/lib/types";

type DemoCheckoutGrant = {
  product: PricingProduct;
  reportId?: string;
  expiresAt: number;
};

function getSigningSecret() {
  const secret =
    process.env.CHECKOUT_DEMO_SECRET || process.env.STRIPE_SECRET_KEY;

  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") {
    return "yessay-local-demo-checkout";
  }

  throw new Error(
    "CHECKOUT_DEMO_SECRET is required when Stripe is not configured.",
  );
}

function signPayload(payload: string) {
  return createHmac("sha256", getSigningSecret())
    .update(payload)
    .digest("base64url");
}

export function createDemoCheckoutToken(
  product: PricingProduct,
  reportId?: string,
) {
  const payload = Buffer.from(
    JSON.stringify({
      product,
      reportId,
      expiresAt: Date.now() + 15 * 60 * 1000,
    } satisfies DemoCheckoutGrant),
  ).toString("base64url");

  return `${payload}.${signPayload(payload)}`;
}

export function verifyDemoCheckoutToken(token: string) {
  const [payload, suppliedSignature] = token.split(".");
  if (!payload || !suppliedSignature) return null;

  const expectedSignature = signPayload(payload);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  ) {
    return null;
  }

  try {
    const grant = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as DemoCheckoutGrant;
    if (
      grant.expiresAt <= Date.now() ||
      !["single_report", "finals_pass", "monthly", "annual"].includes(
        grant.product,
      )
    ) {
      return null;
    }
    return grant;
  } catch {
    return null;
  }
}
