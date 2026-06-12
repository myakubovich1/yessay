"use client";

import { useEffect, useMemo, useState } from "react";
import { AlarmClock, Clock3, Flag } from "lucide-react";
import { formatClockTime, formatRemaining } from "@/lib/deadline";
import type { DeadlineSchedule } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ReportSection } from "./report-section";

/**
 * Renders the time-budgeted plan as a live timeline: block start/end times
 * are computed from the reader's clock each minute, so the schedule always
 * answers "what should I be doing right now".
 */
export function DeadlineScheduleSection({
  schedule,
  deadlineAt,
}: {
  schedule: DeadlineSchedule;
  deadlineAt?: string;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const deadline = useMemo(
    () => (deadlineAt ? new Date(deadlineAt) : null),
    [deadlineAt],
  );
  const deadlinePassed = deadline ? deadline.getTime() <= now : false;
  const minutesLeft = deadline
    ? Math.max(Math.round((deadline.getTime() - now) / 60_000), 0)
    : null;
  const plannedMinutes = schedule.blocks.reduce(
    (sum, block) => sum + block.durationMinutes,
    0,
  );

  // Sequential clock times starting from "now".
  const rows = useMemo(() => {
    const result = [];
    let cursor = now;
    for (const block of schedule.blocks) {
      const end = cursor + block.durationMinutes * 60_000;
      result.push({ ...block, start: new Date(cursor), end: new Date(end) });
      cursor = end;
    }
    return result;
  }, [schedule.blocks, now]);

  return (
    <ReportSection
      title="Due Tonight Plan"
      description={
        deadline
          ? `Built for your ${formatClockTime(deadline)} deadline. Work the blocks in order.`
          : "Work the blocks in order."
      }
      icon={<AlarmClock size={20} />}
    >
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {deadline && !deadlinePassed && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#171912] bg-[#c8f85a] px-3 py-1 text-xs font-extrabold text-[#171912]">
            <Clock3 size={13} />
            {formatRemaining(deadline)} left
          </span>
        )}
        {deadlinePassed && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e2d6b7] bg-[#f7efdc] px-3 py-1 text-xs font-semibold text-[#866629]">
            <Clock3 size={13} />
            Deadline passed — durations still apply
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d8dde6] bg-white/70 px-3 py-1 text-xs font-bold text-[#657081]">
          {Math.floor(plannedMinutes / 60) > 0
            ? `${Math.floor(plannedMinutes / 60)}h ${plannedMinutes % 60}m planned`
            : `${plannedMinutes}m planned`}
        </span>
      </div>

      {minutesLeft !== null &&
        !deadlinePassed &&
        minutesLeft < plannedMinutes - 10 && (
        <p className="mb-4 rounded-xl border border-[#efcfd6] bg-[#fbebee] px-4 py-3 text-sm leading-6 text-[#934157]">
          Less time is left than this plan needs — work from the top and cut
          from the bottom.
        </p>
      )}

      <ol className="space-y-3">
        {rows.map((row, index) => (
          <li
            key={`${row.task}-${index}`}
            className={cn(
              "flex items-start gap-4 rounded-xl border p-4",
              row.kind === "final"
                ? "border-[#171912] bg-[#eff9d4]"
                : "border-[#e0e5ed] bg-white/55",
            )}
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
                row.kind === "final"
                  ? "bg-[#c8f85a] text-[#171912]"
                  : "bg-[#e7ecf9] text-[#4563a7]",
              )}
            >
              {row.kind === "final" ? <Flag size={15} /> : index + 1}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-6 text-[#344158]">
                {row.task}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {!deadlinePassed && (
                  <span className="rounded-full border border-[#d8dde6] bg-white/70 px-2.5 py-0.5 text-[11px] font-bold text-[#657081]">
                    {formatClockTime(row.start)} – {formatClockTime(row.end)}
                  </span>
                )}
                <span className="rounded-full border border-[#cfd8c2] bg-[#eef3e6] px-2.5 py-0.5 text-[11px] font-extrabold text-[#5a7034]">
                  {row.durationMinutes} min
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {schedule.note && (
        <p className="mt-4 text-sm leading-6 text-[#6b7688]">{schedule.note}</p>
      )}

      <div className="mt-5 border-t border-[#e2e6ed] pt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[#8a93a2]">
          Skip if you run out of time
        </p>
        <ul className="mt-2 space-y-1.5">
          {schedule.skipIfNoTime.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-sm leading-6 text-[#5d697d]"
            >
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[#bcc4b0]" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </ReportSection>
  );
}
