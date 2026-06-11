"use client";

import type { AnalysisReport } from "@/lib/types";

const REPORTS_KEY = "yessay:reports";
const LAST_REPORT_KEY = "yessay:last-report";
const CHECKLIST_KEY = "yessay:checklist-progress";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getReports(): AnalysisReport[] {
  if (!canUseStorage()) return [];
  try {
    const value = window.localStorage.getItem(REPORTS_KEY);
    return value ? (JSON.parse(value) as AnalysisReport[]) : [];
  } catch {
    return [];
  }
}

export function getReport(id: string) {
  return getReports().find((report) => report.id === id);
}

export function saveReport(report: AnalysisReport) {
  if (!canUseStorage()) return;
  const reports = getReports().filter((item) => item.id !== report.id);
  window.localStorage.setItem(
    REPORTS_KEY,
    JSON.stringify([report, ...reports].slice(0, 30)),
  );
  window.localStorage.setItem(LAST_REPORT_KEY, report.id);
}

export function deleteReport(id: string) {
  if (!canUseStorage()) return;
  const reports = getReports().filter((report) => report.id !== id);
  window.localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));

  const progress = getAllChecklistProgress();
  delete progress[id];
  window.localStorage.setItem(CHECKLIST_KEY, JSON.stringify(progress));
}

export function unlockReport(id: string) {
  const report = getReport(id);
  if (!report) return;
  saveReport({ ...report, locked: false });
}

export function unlockAllReports() {
  if (!canUseStorage()) return;
  const reports = getReports().map((report) => ({ ...report, locked: false }));
  window.localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function getLastReportId() {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(LAST_REPORT_KEY);
}

function getAllChecklistProgress(): Record<string, string[]> {
  if (!canUseStorage()) return {};
  try {
    const value = window.localStorage.getItem(CHECKLIST_KEY);
    return value ? (JSON.parse(value) as Record<string, string[]>) : {};
  } catch {
    return {};
  }
}

export function getChecklistProgress(reportId: string) {
  return getAllChecklistProgress()[reportId] || [];
}

export function saveChecklistProgress(
  reportId: string,
  checkedItems: string[],
) {
  if (!canUseStorage()) return;
  const progress = getAllChecklistProgress();
  progress[reportId] = checkedItems;
  window.localStorage.setItem(CHECKLIST_KEY, JSON.stringify(progress));
}
