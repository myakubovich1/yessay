"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  LockKeyhole,
  Trash2,
  Unlock,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { GlassCard } from "@/components/ui/glass-card";
import { deleteReport, getReports } from "@/lib/storage/local-reports";
import type { AnalysisReport } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ScoreRing } from "./score-ring";
import { StatusBadge } from "./status-badge";

export function DashboardView() {
  const [reports, setReports] = useState<AnalysisReport[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setReports(getReports());
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!loaded) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <GlassCard key={item} className="h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!reports.length) {
    return <EmptyState />;
  }

  const removeReport = (report: AnalysisReport) => {
    if (!window.confirm(`Remove "${report.title}" from this device?`)) return;
    deleteReport(report.id);
    setReports((current) => current.filter((item) => item.id !== report.id));
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reports.map((report) => (
        <GlassCard
          key={report.id}
          className="flex flex-col p-5 transition-transform hover:-translate-y-1"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="flex size-10 items-center justify-center rounded-xl border border-[#171912] bg-[#c8f85a] text-[#171912]">
              <FileText size={18} />
            </span>
            <span className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => removeReport(report)}
                className="flex size-8 items-center justify-center rounded-lg text-[#777a70] transition-colors hover:bg-[#ffe3dc] hover:text-[#9a4559]"
                aria-label={`Remove ${report.title}`}
                title="Remove report"
              >
                <Trash2 size={15} />
              </button>
              <ScoreRing score={report.overallScore} size="small" />
            </span>
          </div>
          <h2 className="mt-5 line-clamp-2 min-h-12 font-extrabold leading-6 text-[#171912]">
            {report.title}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={report.readinessStatus} />
            <span className="text-xs text-[#777a70]">
              {formatDate(report.createdAt)}
            </span>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-[#171912]/12 pt-4">
            <span className="flex items-center gap-1.5 text-xs text-[#777a70]">
              {report.locked ? <LockKeyhole size={13} /> : <Unlock size={13} />}
              {report.locked ? "Preview" : "Full report"}
            </span>
            <Link
              href={`/report/${report.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#526b08]"
            >
              Open
              <ArrowRight size={15} />
            </Link>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
