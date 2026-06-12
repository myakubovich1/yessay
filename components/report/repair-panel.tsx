"use client";

import { useState } from "react";
import {
  ArrowDown,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  Wand2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { getFixGrant } from "@/lib/storage/local-entitlements";
import {
  getRegenerationCount,
  recordRegeneration,
  saveRevision,
} from "@/lib/storage/local-revisions";
import { getPricingPlan } from "@/lib/pricing";
import type {
  AnalysisReport,
  DraftRevision,
  PricingProduct,
} from "@/lib/types";

const MAX_REPAIR_DRAFT_CHARS = 30000;

export function RepairPanel({
  report,
  revision,
  onRevision,
  checkout,
  checkoutLoading,
}: {
  report: AnalysisReport;
  revision: DraftRevision | null;
  onRevision: (revision: DraftRevision) => void;
  checkout: (product: PricingProduct) => void;
  checkoutLoading: PricingProduct | null;
}) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const grant = getFixGrant(report.id);
  const monthly = getPricingPlan("monthly");
  const regenerations = getRegenerationCount(report.id);

  const generate = async (isRegeneration: boolean) => {
    const activeGrant = getFixGrant(report.id);
    if (!activeGrant || !report.source || generating) return;
    setGenerating(true);
    setError("");
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
      onRevision(data);
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

  return (
    <GlassCard subtle className="p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#171912] bg-[#c8f85a] text-[#171912]">
          <Wand2 size={17} />
        </span>
        <p className="font-extrabold text-[#171912]">AI Draft Repair</p>
      </div>

      {!report.source ? (
        <p className="mt-3 text-sm leading-6 text-[#6b7688]">
          This report predates draft repair. Run a new check on this essay to
          enable it.
        </p>
      ) : report.source.draft.length > MAX_REPAIR_DRAFT_CHARS ? (
        <p className="mt-3 text-sm leading-6 text-[#6b7688]">
          Drafts up to 30,000 characters can be repaired right now. This draft
          is longer — repair the most important sections separately.
        </p>
      ) : revision ? (
        <>
          <p className="mt-3 text-sm leading-6 text-[#6b7688]">
            A revision with tracked changes is ready below.
          </p>
          <a href="#revision" className="primary-button mt-4 w-full text-sm">
            <ArrowDown size={15} />
            See the revision
          </a>
          {grant && regenerations < 1 && (
            <button
              type="button"
              disabled={generating}
              onClick={() => void generate(true)}
              className="secondary-button mt-2 min-h-10 w-full text-xs"
            >
              {generating ? (
                <LoaderCircle size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              {generating ? "Regenerating..." : "Regenerate once"}
            </button>
          )}
        </>
      ) : grant ? (
        <>
          <p className="mt-3 text-sm leading-6 text-[#6b7688]">
            Generate a revised version of this draft with every change tracked
            and explained. You review and decide — you stay the author.
          </p>
          <button
            type="button"
            disabled={generating}
            onClick={() => void generate(false)}
            className="primary-button mt-4 w-full text-sm"
          >
            {generating ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <Sparkles size={15} />
            )}
            {generating ? "Repairing your draft..." : "Repair my draft"}
          </button>
          {generating && (
            <p className="mt-2 text-center text-xs leading-5 text-[#85887f]">
              This usually takes under a minute. Keep this page open.
            </p>
          )}
        </>
      ) : (
        <>
          <p className="mt-3 text-sm leading-6 text-[#6b7688]">
            Get this draft revised with every change tracked and explained —
            tied to the issues found in this report.
          </p>
          <button
            type="button"
            disabled={checkoutLoading !== null}
            onClick={() => checkout("draft_repair")}
            className="primary-button mt-4 w-full text-sm"
          >
            {checkoutLoading === "draft_repair" ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <Wand2 size={15} />
            )}
            {checkoutLoading === "draft_repair"
              ? "Opening checkout..."
              : "Repair this draft · $4.99"}
          </button>
          <button
            type="button"
            disabled={checkoutLoading !== null}
            onClick={() => checkout("monthly")}
            className="secondary-button mt-2 min-h-10 w-full text-xs"
          >
            Go unlimited · {monthly?.price || "$9.99"}/mo
          </button>
          <p className="mt-3 text-xs leading-5 text-[#85887f]">
            Included with Finals Pass, Monthly, and Annual access.
          </p>
        </>
      )}

      {error && (
        <p role="alert" className="mt-3 text-xs leading-5 text-[#98485c]">
          {error}
        </p>
      )}
    </GlassCard>
  );
}
