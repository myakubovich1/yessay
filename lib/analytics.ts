"use client";

import { track } from "@vercel/analytics";

/**
 * Funnel events for Vercel Web Analytics. Names live here so the dashboard
 * stays consistent. Never include draft text, prompts, emails, or any other
 * user content in properties.
 */
export type FunnelEvent =
  | "analysis_completed"
  | "checkout_started"
  | "purchase_verified"
  | "promo_redeemed"
  | "draft_repair_generated";

export function trackEvent(
  name: FunnelEvent,
  properties?: Record<string, string | number | boolean>,
) {
  try {
    track(name, properties);
  } catch {
    // Analytics must never break the product.
  }
}
