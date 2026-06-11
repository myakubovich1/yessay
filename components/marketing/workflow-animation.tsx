import { Check, FileText, ScanText, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type WorkflowAnimationKind = "assignment" | "draft" | "fixes";

export function WorkflowAnimation({ kind }: { kind: WorkflowAnimationKind }) {
  return (
    <div
      className={cn("workflow-animation", `workflow-animation--${kind}`)}
      aria-hidden="true"
    >
      {kind === "assignment" && <AssignmentAnimation />}
      {kind === "draft" && <DraftAnimation />}
      {kind === "fixes" && <FixesAnimation />}
    </div>
  );
}

function AssignmentAnimation() {
  return (
    <>
      <div className="workflow-orbit workflow-orbit--one" />
      <div className="workflow-paper workflow-paper--back">
        <span />
        <span />
        <span />
      </div>
      <div className="workflow-paper workflow-paper--front">
        <div className="workflow-paper__header">
          <span className="workflow-paper__icon">
            <FileText size={13} />
          </span>
          <span>Assignment brief</span>
          <span className="workflow-paper__status">Ready</span>
        </div>
        <span className="workflow-paper__title" />
        <span className="workflow-paper__line workflow-paper__line--long" />
        <span className="workflow-paper__line workflow-paper__line--medium" />
        <span className="workflow-paper__line workflow-paper__line--short" />
        <span className="workflow-paper__check">
          <Check size={13} strokeWidth={3} />
        </span>
      </div>
      <span className="workflow-chip workflow-chip--words">1,500 words</span>
      <span className="workflow-chip workflow-chip--style">MLA</span>
    </>
  );
}

function DraftAnimation() {
  return (
    <>
      <div className="workflow-editor">
        <div className="workflow-editor__bar">
          <span />
          <span />
          <span />
          <small>essay-draft.docx</small>
        </div>
        <div className="workflow-editor__body">
          <span className="workflow-editor__line workflow-editor__line--one" />
          <span className="workflow-editor__line workflow-editor__line--two" />
          <span className="workflow-editor__line workflow-editor__line--three" />
          <span className="workflow-editor__line workflow-editor__line--four" />
          <span className="workflow-editor__line workflow-editor__line--five" />
          <div className="workflow-scan-beam">
            <ScanText size={15} />
            <span>Reading draft</span>
          </div>
        </div>
      </div>
      <span className="workflow-draft-count">
        <Sparkles size={12} />
        1,284 words
      </span>
      <span className="workflow-scan-dot workflow-scan-dot--one" />
      <span className="workflow-scan-dot workflow-scan-dot--two" />
    </>
  );
}

function FixesAnimation() {
  return (
    <>
      <div className="workflow-score">
        <div className="workflow-score__ring">
          <div>
            <strong>92</strong>
            <span>ready</span>
          </div>
        </div>
        <span className="workflow-score__lift">+16</span>
      </div>
      <div className="workflow-fix-list">
        {[
          ["Add missing source", "high"],
          ["Tighten thesis", "medium"],
          ["Check citations", "done"],
        ].map(([label, state], index) => (
          <div
            key={label}
            className={cn(
              "workflow-fix",
              state === "done" && "workflow-fix--done",
            )}
            style={{ "--fix-index": index } as CSSProperties}
          >
            <span className="workflow-fix__check">
              <Check size={11} strokeWidth={3} />
            </span>
            <span className="workflow-fix__label">{label}</span>
            <span
              className={cn(
                "workflow-fix__priority",
                `workflow-fix__priority--${state}`,
              )}
            />
          </div>
        ))}
      </div>
      <span className="workflow-spark workflow-spark--one" />
      <span className="workflow-spark workflow-spark--two" />
      <span className="workflow-spark workflow-spark--three" />
    </>
  );
}
