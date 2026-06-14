"use client";

import { track } from "@vercel/analytics";
import { getReportIssueSummary } from "@/lib/report-signals";
import type { AnalysisReport } from "@/lib/types";

/**
 * Funnel events for Vercel Web Analytics. Names live here so the dashboard
 * stays consistent. Never include draft text, prompts, emails, or any other
 * user content in properties.
 */
export type FunnelEvent =
  | "analysis_completed"
  | "free_score_viewed"
  | "paywall_viewed"
  | "unlock_clicked"
  | "checkout_started"
  | "purchase_verified"
  | "report_unlocked"
  | "promo_redeemed"
  | "draft_repair_generated";

function getViewportBucket() {
  if (typeof window === "undefined") return "unknown";
  if (window.innerWidth < 640) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
}

export function getScoreBand(score: number) {
  if (score < 50) return "0-49";
  if (score < 70) return "50-69";
  if (score < 85) return "70-84";
  return "85-100";
}

export function getReportFunnelProperties(report: AnalysisReport) {
  const issues = getReportIssueSummary(report);

  return {
    score_band: getScoreBand(report.overallScore),
    issue_count: issues.total,
    high_issues: issues.high,
    medium_issues: issues.medium,
    low_issues: issues.low,
    assignment_type: report.source?.assignmentType || "unknown",
    analysis_mode: report.analysisMode || "unknown",
  };
}

export function trackEvent(
  name: FunnelEvent,
  properties?: Record<string, string | number | boolean>,
) {
  try {
    track(name, {
      ...properties,
      viewport: properties?.viewport || getViewportBucket(),
    });
  } catch {
    // Analytics must never break the product.
  }
}

export function trackEventOnce(
  name: FunnelEvent,
  key: string,
  properties?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") return;
  const storageKey = `yessay:analytics:${name}:${key}`;

  try {
    if (window.sessionStorage.getItem(storageKey)) return;
  } catch {
    // Continue without deduplication when storage is unavailable.
  }

  trackEvent(name, properties);
  try {
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    // Analytics must never break the product.
  }
}
