"use client";

import type { DraftRevision } from "@/lib/types";

const REVISIONS_KEY = "yessay:revisions";
const REGENERATIONS_KEY = "yessay:revision-regenerations";
const MAX_STORED = 10;

function canUseStorage() {
  return typeof window !== "undefined";
}

function readAll(): DraftRevision[] {
  if (!canUseStorage()) return [];
  try {
    const value = window.localStorage.getItem(REVISIONS_KEY);
    return value ? (JSON.parse(value) as DraftRevision[]) : [];
  } catch {
    return [];
  }
}

export function getRevision(reportId: string) {
  return readAll().find((revision) => revision.reportId === reportId) || null;
}

export function saveRevision(revision: DraftRevision) {
  if (!canUseStorage()) return;
  const rest = readAll().filter((item) => item.reportId !== revision.reportId);
  try {
    window.localStorage.setItem(
      REVISIONS_KEY,
      JSON.stringify([revision, ...rest].slice(0, MAX_STORED)),
    );
  } catch {
    // Storage full: keep only this revision rather than losing it.
    window.localStorage.setItem(REVISIONS_KEY, JSON.stringify([revision]));
  }
}

export function getRegenerationCount(reportId: string) {
  if (!canUseStorage()) return 0;
  try {
    const value = window.localStorage.getItem(REGENERATIONS_KEY);
    const counts = value ? (JSON.parse(value) as Record<string, number>) : {};
    return counts[reportId] || 0;
  } catch {
    return 0;
  }
}

export function recordRegeneration(reportId: string) {
  if (!canUseStorage()) return;
  try {
    const value = window.localStorage.getItem(REGENERATIONS_KEY);
    const counts = value ? (JSON.parse(value) as Record<string, number>) : {};
    counts[reportId] = (counts[reportId] || 0) + 1;
    window.localStorage.setItem(REGENERATIONS_KEY, JSON.stringify(counts));
  } catch {
    // non-critical
  }
}
