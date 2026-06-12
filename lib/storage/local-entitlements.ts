"use client";

import type { PricingProduct } from "@/lib/types";

const FIX_GRANTS_KEY = "yessay:fix-grants";

export type StoredFixGrant = {
  token: string;
  product: PricingProduct;
  reportId?: string;
  expiresAt: number;
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
