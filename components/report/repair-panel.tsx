"use client";

import {
  ArrowDown,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  Wand2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { getPricingPlan } from "@/lib/pricing";
import type { DraftRevision, PricingProduct } from "@/lib/types";
import type { DraftRepairState } from "./use-draft-repair";

export function RepairPanel({
  revision,
  repair,
  checkout,
  checkoutLoading,
}: {
  revision: DraftRevision | null;
  repair: DraftRepairState;
  checkout: (product: PricingProduct) => void;
  checkoutLoading: PricingProduct | null;
}) {
  const monthly = getPricingPlan("monthly");
  const { grant, generating, error, generate, regenerations, repairability } =
    repair;

  return (
    <GlassCard subtle className="p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#171912] bg-[#c8f85a] text-[#171912]">
          <Wand2 size={17} />
        </span>
        <p className="font-extrabold text-[#171912]">AI Draft Repair</p>
      </div>

      {repairability === "no_source" ? (
        <p className="mt-3 text-sm leading-6 text-[#6b7688]">
          This report predates draft repair. Run a new check on this essay to
          enable it.
        </p>
      ) : repairability === "too_long" ? (
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
