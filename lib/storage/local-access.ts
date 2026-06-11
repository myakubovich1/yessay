"use client";

import type { PricingProduct } from "@/lib/types";
import { unlockAllReports, unlockReport } from "@/lib/storage/local-reports";

const ACCESS_KEY = "yessay:access";
const REPORT_CREDITS_KEY = "yessay:report-credits";
const DAY = 24 * 60 * 60 * 1000;

type AccessGrant = {
  product: Exclude<PricingProduct, "single_report">;
  expiresAt: string;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

function getAccessGrant(): AccessGrant | null {
  if (!canUseStorage()) return null;

  try {
    const value = window.localStorage.getItem(ACCESS_KEY);
    if (!value) return null;

    const access = JSON.parse(value) as AccessGrant;
    if (new Date(access.expiresAt).getTime() <= Date.now()) {
      window.localStorage.removeItem(ACCESS_KEY);
      return null;
    }
    return access;
  } catch {
    return null;
  }
}

export function hasActiveFullAccess() {
  return getAccessGrant() !== null;
}

export function getReportCredits() {
  if (!canUseStorage()) return 0;
  const value = Number(window.localStorage.getItem(REPORT_CREDITS_KEY) || 0);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

export function hasReportCredit() {
  return getReportCredits() > 0;
}

export function consumeReportCredit() {
  if (!canUseStorage()) return false;
  const credits = getReportCredits();
  if (credits < 1) return false;
  window.localStorage.setItem(REPORT_CREDITS_KEY, String(credits - 1));
  return true;
}

export function grantAccess(product: PricingProduct, reportId?: string | null) {
  if (!canUseStorage()) return;

  if (product === "single_report") {
    if (reportId) {
      unlockReport(reportId);
    } else {
      window.localStorage.setItem(
        REPORT_CREDITS_KEY,
        String(getReportCredits() + 1),
      );
    }
    return;
  }

  const duration =
    product === "finals_pass"
      ? 7 * DAY
      : product === "annual"
        ? 366 * DAY
        : 31 * DAY;
  window.localStorage.setItem(
    ACCESS_KEY,
    JSON.stringify({
      product,
      expiresAt: new Date(Date.now() + duration).toISOString(),
    } satisfies AccessGrant),
  );
  unlockAllReports();
}
