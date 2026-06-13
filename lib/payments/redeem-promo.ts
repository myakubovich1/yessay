"use client";

import { grantAccess } from "@/lib/storage/local-access";
import {
  saveFixGrant,
  type StoredFixGrant,
} from "@/lib/storage/local-entitlements";
import type { PricingProduct } from "@/lib/types";

export type PromoRedemption = {
  product: PricingProduct;
  reportId?: string;
  fixGrant?: StoredFixGrant;
};

/**
 * Redeems a promo code and applies the grant entirely client-side, without
 * navigating to the success page. Redeem issues a signed demo token, which
 * verify exchanges for the grant; access and any repair entitlement are then
 * written to local storage. Throws with a user-facing message on failure.
 */
export async function redeemPromoCode(
  code: string,
  reportId?: string,
): Promise<PromoRedemption> {
  const redeemed = await fetch("/api/redeem-promo-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: code.trim(), reportId }),
  });
  const redeemData = (await redeemed.json()) as {
    url?: string;
    error?: string;
  };
  if (!redeemed.ok || !redeemData.url) {
    throw new Error(redeemData.error || "That promo code isn't valid.");
  }

  const demoToken = new URLSearchParams(
    redeemData.url.split("?")[1] || "",
  ).get("demo_token");
  const verified = await fetch("/api/verify-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ demoToken }),
  });
  const grantData = (await verified.json()) as {
    product?: PricingProduct;
    reportId?: string;
    fixGrant?: StoredFixGrant;
    error?: string;
  };
  if (!verified.ok || !grantData.product) {
    throw new Error(grantData.error || "That promo code isn't valid.");
  }

  grantAccess(grantData.product, grantData.reportId);
  if (grantData.fixGrant) saveFixGrant(grantData.fixGrant);
  return {
    product: grantData.product,
    reportId: grantData.reportId,
    fixGrant: grantData.fixGrant,
  };
}
