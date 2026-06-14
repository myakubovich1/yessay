import { AlertTriangle, LockKeyhole } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const previewScore = 76;
const scoreRadius = 42;
const scoreCircumference = 2 * Math.PI * scoreRadius;

export function PreviewTeaser() {
  return (
    <GlassCard
      subtle
      className="preview-teaser overflow-hidden p-0"
      aria-labelledby="preview-teaser-title"
    >
      <div className="preview-teaser__header">
        <div className="preview-teaser__meta">
          <span>
            <i aria-hidden="true" />
            Free report preview
          </span>
          <span>0–100</span>
        </div>
        <h2 id="preview-teaser-title">See where your draft stands.</h2>
      </div>

      <div className="preview-teaser__report">
        <div className="preview-teaser__score-wrap">
          <div
            className="preview-teaser__score"
            aria-label={`Example readiness score: ${previewScore} out of 100`}
          >
            <svg viewBox="0 0 110 110" aria-hidden="true">
              <circle
                cx="55"
                cy="55"
                r={scoreRadius}
                fill="none"
                stroke="rgba(23,25,18,0.09)"
                strokeWidth="7"
              />
              <circle
                className="preview-teaser__score-value"
                cx="55"
                cy="55"
                r={scoreRadius}
                fill="none"
                stroke="#171912"
                strokeLinecap="round"
                strokeWidth="7"
                strokeDasharray={scoreCircumference}
                strokeDashoffset={
                  scoreCircumference -
                  (previewScore / 100) * scoreCircumference
                }
              />
            </svg>
            <div>
              <strong>{previewScore}</strong>
              <span>readiness</span>
            </div>
          </div>

          <div className="preview-teaser__issues">
            <AlertTriangle size={12} />
            <span>
              <strong>6</strong> signals
            </span>
          </div>
        </div>

        <div className="preview-teaser__locked">
          <div className="preview-teaser__locked-copy">
            <span>Ranked fixes</span>
            <strong>Know what to change first</strong>
          </div>
          <span className="preview-teaser__lock" aria-hidden="true">
            <LockKeyhole size={14} />
          </span>
          <div className="preview-teaser__locked-lines" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>

      <p className="preview-teaser__note">
        Score and issue count are free. Fixes unlock with the report.
      </p>
    </GlassCard>
  );
}
