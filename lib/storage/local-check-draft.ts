"use client";

import type { AnalysisInput } from "@/lib/types";

const CHECK_DRAFT_KEY = "yessay:check-draft";

export type SavedCheckDraft = {
  form: AnalysisInput;
  step: number;
  savedAt: string;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getCheckDraft(): SavedCheckDraft | null {
  if (!canUseStorage()) return null;

  try {
    const value = window.localStorage.getItem(CHECK_DRAFT_KEY);
    if (!value) return null;

    const draft = JSON.parse(value) as SavedCheckDraft;
    if (!draft.form || !draft.savedAt || !Number.isFinite(draft.step)) {
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

export function saveCheckDraft(form: AnalysisInput, step: number) {
  if (!canUseStorage()) return;

  window.localStorage.setItem(
    CHECK_DRAFT_KEY,
    JSON.stringify({
      form,
      step,
      savedAt: new Date().toISOString(),
    } satisfies SavedCheckDraft),
  );
}

export function clearCheckDraft() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(CHECK_DRAFT_KEY);
}
