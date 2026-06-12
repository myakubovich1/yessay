import { useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { SourceUpload } from "./source-upload";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  showWords?: boolean;
  uploadLabel?: string;
  onTextExtracted?: (text: string) => void;
};

export function TextAreaWithCounter({
  label,
  hint,
  showWords = false,
  uploadLabel,
  onTextExtracted,
  className,
  value,
  ...props
}: Props) {
  const id = useId();
  const text = String(value || "");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div>
      <span className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-bold text-[#171912]">
          {label}
        </label>
        {hint && <span className="text-xs text-[#777a70]">{hint}</span>}
      </span>
      <textarea
        id={id}
        className={cn(
          "field mt-2 min-h-72 resize-y p-4 text-[15px] leading-7 placeholder:text-[#9a9c93]",
          className,
        )}
        value={value}
        {...props}
      />
      <span className="mt-2 flex justify-end gap-3 text-xs text-[#7c7f75]">
        {showWords && <span>{words.toLocaleString()} words</span>}
        <span>{text.length.toLocaleString()} characters</span>
      </span>
      {uploadLabel && onTextExtracted && (
        <SourceUpload
          label={uploadLabel}
          disabled={props.disabled}
          onTextExtracted={onTextExtracted}
        />
      )}
    </div>
  );
}
