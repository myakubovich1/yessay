"use client";

import { useMemo, useState } from "react";
import { Check, Clipboard, Download, Wand2 } from "lucide-react";
import { ReportSection } from "./report-section";
import { cn } from "@/lib/utils";
import type { DraftRevision } from "@/lib/types";

export function RevisionSection({ revision }: { revision: DraftRevision }) {
  const [view, setView] = useState<"changes" | "draft">("changes");
  const [copied, setCopied] = useState(false);

  const changedParagraphs = useMemo(
    () => new Set(revision.changes.map((change) => change.paragraph)),
    [revision],
  );
  const draftParagraphs = useMemo(
    () =>
      revision.revisedDraft
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
    [revision],
  );

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(revision.revisedDraft);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; download still works
    }
  };

  const downloadDraft = () => {
    const blob = new Blob([revision.revisedDraft], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "yessay-revised-draft.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ReportSection
      id="revision"
      title="AI Revision Draft"
      description="Every change is tracked and explained. Review each one and keep only what sounds like you — you are the author."
      icon={<Wand2 size={20} />}
    >
      <p className="rounded-xl border border-[#d9e3c2] bg-[#f4fadf] p-4 text-sm leading-6 text-[#4c5530]">
        {revision.summary}
      </p>

      <div className="no-print mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-full border border-[#171912]/15 bg-white/70 p-1">
          {(
            [
              ["changes", "Tracked changes"],
              ["draft", "Clean draft"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-extrabold transition-colors",
                view === key
                  ? "bg-[#171912] text-white"
                  : "text-[#6c7065] hover:text-[#171912]",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void copyDraft()}
            className="secondary-button min-h-9 px-3 text-xs shadow-none"
          >
            {copied ? <Check size={14} /> : <Clipboard size={14} />}
            {copied ? "Copied" : "Copy draft"}
          </button>
          <button
            type="button"
            onClick={downloadDraft}
            className="secondary-button min-h-9 px-3 text-xs shadow-none"
          >
            <Download size={14} />
            Download .txt
          </button>
        </div>
      </div>

      {view === "changes" ? (
        <div className="mt-5 space-y-3">
          {revision.changes.map((change, index) => (
            <div
              key={`${change.paragraph}-${index}`}
              className="rounded-xl border border-[#e0e5ed] bg-white/55 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#171912]/15 bg-[#eff9d4] px-2.5 py-0.5 text-[11px] font-extrabold text-[#4c5530]">
                  {change.criterion}
                </span>
                <span className="text-[11px] font-semibold text-[#8a93a2]">
                  Paragraph {change.paragraph}
                </span>
              </div>
              <p className="mt-3 rounded-lg bg-[#fbeeee] px-3 py-2 text-sm leading-6 text-[#7d5560] line-through decoration-[#c89aa4]">
                {change.original}
              </p>
              <p className="mt-2 rounded-lg bg-[#eff9d4] px-3 py-2 text-sm leading-6 text-[#3c4423]">
                {change.revised}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#6b7688]">
                <strong className="text-[#445168]">Why:</strong>{" "}
                {change.reason}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {draftParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className={cn(
                "text-sm leading-7 text-[#3c4332]",
                changedParagraphs.has(index + 1) &&
                  "-ml-3 border-l-2 border-[#9fc433] pl-3",
              )}
            >
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {revision.notChanged.length > 0 && (
        <div className="mt-6 border-t border-[#e2e6ed] pt-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8a93a2]">
            Left for you
          </p>
          <ul className="mt-3 space-y-2">
            {revision.notChanged.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm leading-6 text-[#5d697d]"
              >
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[#9fc433]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-6 text-xs leading-5 text-[#85887f]">
        Review every change before submitting and follow your course&apos;s
        policies on writing assistance. The final draft is your decision and
        your work.
      </p>
    </ReportSection>
  );
}
