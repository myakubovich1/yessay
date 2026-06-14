import type { ReportIssueSummary } from "@/lib/report-signals";
import { ScoreRing } from "./score-ring";

const severityRows = [
  { key: "high", label: "High priority" },
  { key: "medium", label: "Medium priority" },
  { key: "low", label: "Lower priority" },
] as const;

export function LockedScoreReveal({
  score,
  issues,
}: {
  score: number;
  issues: ReportIssueSummary;
}) {
  const largestCount = Math.max(issues.high, issues.medium, issues.low, 1);

  return (
    <div className="locked-score-reveal" aria-live="polite">
      <div className="locked-score-reveal__score">
        <ScoreRing score={score} animated />
      </div>
      <div className="locked-score-reveal__signals">
        <p className="locked-score-reveal__label">Revision signals found</p>
        <div className="locked-score-reveal__count">
          <strong>{issues.total}</strong>
          <span>items need a closer look</span>
        </div>
        <div className="locked-score-reveal__severity">
          {severityRows.map(({ key, label }) => (
            <div key={key} className={`locked-score-reveal__row is-${key}`}>
              <span>{label}</span>
              <div aria-hidden="true">
                <i
                  style={{
                    transform: `scaleX(${
                      issues[key] === 0 ? 0.06 : issues[key] / largestCount
                    })`,
                  }}
                />
              </div>
              <strong>{issues[key]}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
