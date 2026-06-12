"use client";

import type { PricingProduct } from "@/lib/types";

const FIX_GRANTS_KEY = "yessay:fix-grants";
const CHECKOUT_REF_KEY = "yessay:checkout-reference";

export type StoredFixGrant = {
  token: string;
  product: PricingProduct;
  reportId?: string;
  expiresAt: number;
};

/**
 * The last verified Stripe checkout session for a plan purchase. Lets the
 * app re-verify against Stripe later (renewals, expired fix tokens, new
 * features) without a database.
 */
export type CheckoutReference = {
  sessionId: string;
  product: PricingProduct;
  savedAt: number;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

function readGrants(): StoredFixGrant[] {
  if (!canUseStorage()) return [];
  try {
    const value = window.localStorage.getItem(FIX_GRANTS_KEY);
    const grants = value ? (JSON.parse(value) as StoredFixGrant[]) : [];
    return grants.filter((grant) => grant.expiresAt > Date.now());
  } catch {
    return [];
  }
}

export function saveFixGrant(grant: StoredFixGrant) {
  if (!canUseStorage()) return;
  const grants = readGrants().filter(
    (existing) =>
      existing.token !== grant.token &&
      // one repair grant per report is enough
      !(
        existing.product === "draft_repair" &&
        grant.product === "draft_repair" &&
        existing.reportId === grant.reportId
      ),
  );
  window.localStorage.setItem(
    FIX_GRANTS_KEY,
    JSON.stringify([grant, ...grants].slice(0, 20)),
  );
}

/** The grant usable for a given report: plan-wide first, then per-report. */
export function getFixGrant(reportId: string): StoredFixGrant | null {
  const grants = readGrants();
  return (
    grants.find((grant) => grant.product !== "draft_repair") ||
    grants.find(
      (grant) =>
        grant.product === "draft_repair" && grant.reportId === reportId,
    ) ||
    null
  );
}

export function saveCheckoutReference(reference: CheckoutReference) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(CHECKOUT_REF_KEY, JSON.stringify(reference));
}

export function getCheckoutReference(): CheckoutReference | null {
  if (!canUseStorage()) return null;
  try {
    const value = window.localStorage.getItem(CHECKOUT_REF_KEY);
    return value ? (JSON.parse(value) as CheckoutReference) : null;
  } catch {
    return null;
  }
}

/**
 * Re-verifies the stored checkout session with Stripe and saves the fresh
 * fix grant it returns. Used when a subscriber's fix token is missing or
 * expired (pre-feature purchases, monthly renewals, new devices keeping
 * localStorage). Returns the new grant, or null if it can't be confirmed.
 */
export async function refreshFixGrantFromCheckout(): Promise<StoredFixGrant | null> {
  const reference = getCheckoutReference();
  if (!reference) return null;
  try {
    const response = await fetch("/api/verify-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: reference.sessionId }),
    });
    const data = (await response.json()) as {
      fixGrant?: StoredFixGrant;
      error?: string;
    };
    if (!response.ok || !data.fixGrant) return null;
    saveFixGrant(data.fixGrant);
    return data.fixGrant;
  } catch {
    return null;
  }
}
