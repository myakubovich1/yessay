/**
 * Deadline helpers for Due Tonight Mode. All math runs on the user's device
 * clock, since "tonight" only means something in their timezone.
 */

/** Today at HH:mm — or tomorrow if that moment already passed. */
export function deadlineFromTime(dueTime: string): Date {
  const [hours, minutes] = dueTime.split(":").map(Number);
  const deadline = new Date();
  deadline.setHours(hours || 0, minutes || 0, 0, 0);
  if (deadline.getTime() <= Date.now()) {
    deadline.setDate(deadline.getDate() + 1);
  }
  return deadline;
}

export function hoursUntil(deadline: Date): number {
  return (deadline.getTime() - Date.now()) / 3_600_000;
}

/** "≈ 3h 40m" (or "≈ 25m" under an hour). */
export function formatRemaining(deadline: Date): string {
  const totalMinutes = Math.max(
    Math.round((deadline.getTime() - Date.now()) / 60_000),
    0,
  );
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `≈ ${minutes}m`;
  return `≈ ${hours}h ${minutes}m`;
}

/** "9:05 PM" in the user's locale. */
export function formatClockTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
