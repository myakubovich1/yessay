"use client";

import { ArrowDown, LoaderCircle, Sparkles, Wand2 } from "lucide-react";
import type {
  AnalysisReport,
  DraftRevision,
  PricingProduct,
} from "@/lib/types";
import type { DraftRepairState } from "./use-draft-repair";

/**
 * Floating action bar for small screens, where the desktop rail sits below
 * the fold. Mirrors the rail's repair states; hidden on lg and up.
 */
export function MobileRepairBar({
  report,
  revision,
  repair,
  checkout,
  checkoutLoading,
}: {
  report: AnalysisReport;
  revision: DraftRevision | null;
  repair: DraftRepairState;
  checkout: (product: PricingProduct) => void;
  checkoutLoading: PricingProduct | null;
}) {
  // No paid repair bar on the public sample report.
  if (
    report.locked ||
    report.id === "sample-report" ||
    repair.repairability !== "ok"
  )
    return null;

  const { included, generating, error, generate } = repair;

  return (
    <div className="no-print fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-white bg-white/88 p-3 shadow-2xl backdrop-blur-xl lg:hidden">
      {revision ? (
        <a href="#revision" className="primary-button w-full text-sm">
          <ArrowDown size={15} />
          See your revised draft
        </a>
      ) : included ? (
        <>
          <button
            type="button"
            disabled={generating}
            onClick={() => void generate(false)}
            className="primary-button w-full text-sm"
          >
            {generating ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <Sparkles size={15} />
            )}
            {generating ? "Repairing your draft..." : "Repair my draft"}
          </button>
          {generating && (
            <p className="mt-2 text-center text-[11px] leading-4 text-[#85887f]">
              Usually under a minute — keep this page open.
            </p>
          )}
        </>
      ) : (
        <>
          <button
            type="button"
            disabled={checkoutLoading !== null}
            onClick={() => checkout("draft_repair")}
            className="primary-button w-full text-sm"
          >
            {checkoutLoading === "draft_repair" ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <Wand2 size={15} />
            )}
            {checkoutLoading === "draft_repair"
              ? "Opening checkout..."
              : "Repair this draft with AI · $4.99"}
          </button>
          <button
            type="button"
            disabled={checkoutLoading !== null}
            onClick={() => checkout("monthly")}
            className="mt-1.5 w-full text-center text-xs font-bold text-[#6c7065] transition-colors hover:text-[#171912]"
          >
            or go unlimited · $9.99/mo
          </button>
        </>
      )}
      {error && (
        <p
          role="alert"
          className="mt-2 text-center text-[11px] leading-4 text-[#98485c]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
