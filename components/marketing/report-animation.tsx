import { Check, Sparkles } from "lucide-react";

export function ReportAnimation() {
  return (
    <div
      className="report-animation"
      role="img"
      aria-label="An animated Yessay report scanning an essay and revealing a readiness score of 92."
    >
      <div className="report-animation__glow" aria-hidden="true" />
      <div className="report-animation__window">
        <div className="report-animation__topbar">
          <div className="report-animation__dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span className="report-animation__title">Yessay report</span>
          <span className="report-animation__status">
            <Check size={12} strokeWidth={3} />
            Complete
          </span>
        </div>

        <div className="report-animation__body">
          <div className="report-animation__score">
            <div className="report-animation__ring">
              <svg viewBox="0 0 140 140" aria-hidden="true">
                <circle
                  className="report-animation__ring-track"
                  cx="70"
                  cy="70"
                  r="61"
                />
                <circle
                  className="report-animation__ring-value"
                  cx="70"
                  cy="70"
                  r="61"
                />
              </svg>
              <div className="report-animation__number">
                <span className="report-animation__number-state report-animation__number-state--pending">
                  <strong>??</strong>
                  <span>Scanning</span>
                </span>
                <span className="report-animation__number-state report-animation__number-state--ready">
                  <strong>92</strong>
                  <span>Ready</span>
                </span>
              </div>
            </div>
            <p>Essay readiness</p>
          </div>

          <div className="report-animation__signals" aria-hidden="true">
            <div className="report-animation__signal report-animation__signal--one">
              <span className="report-animation__check">
                <Check size={13} strokeWidth={3} />
              </span>
              <span className="report-animation__signal-copy">
                <b>Rubric aligned</b>
                <i />
              </span>
            </div>
            <div className="report-animation__signal report-animation__signal--two">
              <span className="report-animation__check">
                <Check size={13} strokeWidth={3} />
              </span>
              <span className="report-animation__signal-copy">
                <b>Thesis is clear</b>
                <i />
              </span>
            </div>
            <div className="report-animation__signal report-animation__signal--three">
              <span className="report-animation__check">
                <Check size={13} strokeWidth={3} />
              </span>
              <span className="report-animation__signal-copy">
                <b>Citations checked</b>
                <i />
              </span>
            </div>
          </div>
        </div>

        <div className="report-animation__scan" aria-hidden="true">
          <span />
        </div>
      </div>

      <div className="report-animation__result" aria-hidden="true">
        <span>
          <Sparkles size={14} />
        </span>
        <div>
          <strong>3 priority fixes</strong>
          <small>Clear order. No guesswork.</small>
        </div>
      </div>
    </div>
  );
}
