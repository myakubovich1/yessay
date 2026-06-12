"use client";

import { useState } from "react";
import {
  ArrowDown,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  TicketPercent,
  Wand2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { trackEvent } from "@/lib/analytics";
import { getPricingPlan } from "@/lib/pricing";
import { grantAccess } from "@/lib/storage/local-access";
import {
  saveFixGrant,
  type StoredFixGrant,
} from "@/lib/storage/local-entitlements";
import type { DraftRevision, PricingProduct } from "@/lib/types";
import type { DraftRepairState } from "./use-draft-repair";

export function RepairPanel({
  reportId,
  revision,
  repair,
  checkout,
  checkoutLoading,
}: {
  reportId: string;
  revision: DraftRevision | null;
  repair: DraftRepairState;
  checkout: (product: PricingProduct) => void;
  checkoutLoading: PricingProduct | null;
}) {
  const monthly = getPricingPlan("monthly");
  const { grant, generating, error, generate, regenerations, repairability } =
    repair;
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");

  const redeemPromo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!promoCode.trim() || promoLoading) return;
    setPromoLoading(true);
    setPromoError("");
    try {
      const redeemed = await fetch("/api/redeem-promo-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim(), reportId }),
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
      if (!grantData.fixGrant) {
        throw new Error("That code doesn't include draft repair.");
      }
      grantAccess(grantData.product, grantData.reportId);
      saveFixGrant(grantData.fixGrant);
      trackEvent("promo_redeemed", {
        location: "repair_panel",
        product: grantData.product,
      });
      repair.refresh();
    } catch (redeemError) {
      setPromoError(
        redeemError instanceof Error
          ? redeemError.message
          : "That promo code isn't valid.",
      );
    } finally {
      setPromoLoading(false);
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
          {!showPromo ? (
            <button
              type="button"
              onClick={() => setShowPromo(true)}
              className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-[#617c12] transition-colors hover:text-[#171912]"
            >
              <TicketPercent size={13} />
              Have a promo code?
            </button>
          ) : (
            <form onSubmit={(event) => void redeemPromo(event)} className="mt-3 flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(event) => setPromoCode(event.target.value)}
                placeholder="Promo code"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                autoFocus
                className="h-10 min-w-0 flex-1 rounded-xl border border-[#171912]/18 bg-white px-3 text-xs font-semibold uppercase tracking-wide text-[#171912] placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-[#9a9e93] focus:border-[#617c12] focus:outline-none"
              />
              <button
                type="submit"
                disabled={promoLoading || !promoCode.trim()}
                className="flex h-10 items-center rounded-xl border border-[#171912] bg-[#c8f85a] px-3.5 text-xs font-extrabold text-[#171912] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {promoLoading ? (
                  <LoaderCircle size={14} className="animate-spin" />
                ) : (
                  "Apply"
                )}
              </button>
            </form>
          )}
          {promoError && (
            <p role="alert" className="mt-2 text-xs leading-5 text-[#98485c]">
              {promoError}
            </p>
          )}
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
