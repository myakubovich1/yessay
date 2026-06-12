"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { hasActiveFullAccess } from "@/lib/storage/local-access";
import {
  getFixGrant,
  refreshFixGrantFromCheckout,
} from "@/lib/storage/local-entitlements";
import {
  getRegenerationCount,
  recordRegeneration,
  saveRevision,
} from "@/lib/storage/local-revisions";
import type { AnalysisReport, DraftRevision } from "@/lib/types";

export const MAX_REPAIR_DRAFT_CHARS = 30000;

export type Repairability = "ok" | "no_source" | "too_long";

/**
 * Shared state for the desktop rail panel and the mobile action bar, so
 * triggering a repair from one keeps the other in sync.
 */
export function useDraftRepair(
  report: AnalysisReport | null,
  onRevision: (revision: DraftRevision) => void,
) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [, setNonce] = useState(0);
  /** Re-reads grants from storage after an in-place promo redemption. */
  const refresh = () => setNonce((nonce) => nonce + 1);

  const grant = report ? getFixGrant(report.id) : null;
  /**
   * Plan holders get repair as part of the experience: an active plan counts
   * as included even when the signed token is missing or expired (purchases
   * made before the repair feature, monthly renewals). The token is then
   * re-minted by re-verifying the stored checkout session with Stripe.
   */
  const included = Boolean(grant) || hasActiveFullAccess();
  const regenerations = report ? getRegenerationCount(report.id) : 0;
  const repairability: Repairability = !report?.source
    ? "no_source"
    : report.source.draft.length > MAX_REPAIR_DRAFT_CHARS
      ? "too_long"
      : "ok";

  const generate = async (isRegeneration: boolean) => {
    if (!report?.source || generating) return;

    setGenerating(true);
    setError("");
    let activeGrant = getFixGrant(report.id);
    if (!activeGrant) {
      // Plan holder without a valid token: re-verify the stored checkout
      // session with Stripe and mint a fresh one.
      activeGrant = await refreshFixGrantFromCheckout();
      refresh();
    }
    if (!activeGrant) {
      setGenerating(false);
      setError(
        "We couldn't confirm your plan on this device. Open your most recent Yessay receipt link, or re-enter your promo code below.",
      );
      return;
    }

    try {
      const response = await fetch("/api/fix-essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entitlementToken: activeGrant.token,
          reportId: report.id,
          source: report.source,
          priorityFixes: report.priorityFixes.map((item) => item.fix),
        }),
      });
      const data = (await response.json()) as
        | DraftRevision
        | { error: string };
      if (!response.ok || "error" in data) {
        throw new Error(
          "error" in data ? data.error : "The repair couldn't be completed.",
        );
      }
      saveRevision(data);
      if (isRegeneration) recordRegeneration(report.id);
      trackEvent("draft_repair_generated", {
        product: activeGrant.product,
        regeneration: isRegeneration,
      });
      onRevision(data);
      // Bring the freshly rendered revision into view.
      window.setTimeout(() => {
        document
          .getElementById("revision")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (repairError) {
      setError(
        repairError instanceof Error
          ? repairError.message
          : "The repair couldn't be completed. Please try again.",
      );
    } finally {
      setGenerating(false);
    }
  };

  return {
    grant,
    included,
    generating,
    error,
    generate,
    regenerations,
    repairability,
    refresh,
  };
}

export type DraftRepairState = ReturnType<typeof useDraftRepair>;
