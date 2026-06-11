"use client";

import { useEffect, useRef, useState, type ClipboardEvent } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  ClipboardPaste,
  FileImage,
  ImagePlus,
  LoaderCircle,
  Trash2,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

function extensionFor(type: string) {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/webp") return "webp";
  return "png";
}

export function ScreenshotUpload({
  label,
  disabled = false,
  onTextExtracted,
}: {
  label: string;
  disabled?: boolean;
  onTextExtracted: (text: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState<
    "idle" | "extracting" | "complete" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const clearScreenshot = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setFileName("");
    setStatus("idle");
    setMessage("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const extract = async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setStatus("error");
      setMessage("Use a PNG, JPEG, or WebP screenshot.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setStatus("error");
      setMessage("Screenshot must be smaller than 8 MB.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setFileName(file.name);
    setStatus("extracting");
    setMessage("Reading text from screenshot...");

    try {
      const body = new FormData();
      body.append("image", file);
      const response = await fetch("/api/extract-text", {
        method: "POST",
        body,
      });
      const data = (await response.json()) as {
        text?: string;
        confidence?: number;
        error?: string;
      };

      if (!response.ok || !data.text) {
        throw new Error(data.error || "Text extraction failed.");
      }

      onTextExtracted(data.text);
      setStatus("complete");
      setMessage(
        data.confidence && data.confidence < 70
          ? "Text added. Review it above because this image was difficult to read."
          : "Text added. Review it above before continuing.",
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "We couldn't read that screenshot.",
      );
    }
  };

  const fileFromBlob = (blob: Blob) =>
    new File([blob], `Pasted ${label} screenshot.${extensionFor(blob.type)}`, {
      type: blob.type,
    });

  const pasteFromClipboard = async () => {
    if (disabled || status === "extracting") return;

    if (!navigator.clipboard?.read) {
      setStatus("error");
      setMessage(
        "This browser cannot read a pasted image from a button. Focus this box and press Ctrl/Command+V.",
      );
      return;
    }

    setStatus("extracting");
    setMessage("Checking your clipboard for an image...");

    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const type = item.types.find((value) => ACCEPTED_TYPES.includes(value));
        if (type) {
          await extract(fileFromBlob(await item.getType(type)));
          return;
        }
      }
      setStatus("error");
      setMessage("No PNG, JPEG, or WebP image was found on the clipboard.");
    } catch {
      setStatus("error");
      setMessage(
        "Clipboard access was blocked. Focus this box and press Ctrl/Command+V, or upload the screenshot.",
      );
    }
  };

  const pasteFromEvent = async (event: ClipboardEvent<HTMLDivElement>) => {
    if (disabled || status === "extracting") return;

    const file = Array.from(event.clipboardData.files).find((item) =>
      ACCEPTED_TYPES.includes(item.type),
    );
    const item = Array.from(event.clipboardData.items).find(
      (value) => value.kind === "file" && ACCEPTED_TYPES.includes(value.type),
    );
    const image = file || item?.getAsFile();

    if (image) {
      event.preventDefault();
      await extract(image.name ? image : fileFromBlob(image));
    }
  };

  const handleDroppedFiles = async (files: FileList) => {
    const file = Array.from(files).find((item) =>
      ACCEPTED_TYPES.includes(item.type),
    );
    if (file) {
      await extract(file);
      return;
    }

    setStatus("error");
    setMessage("Drop a PNG, JPEG, or WebP screenshot.");
  };

  return (
    <div
      className="mt-3"
      onPaste={(event) => void pasteFromEvent(event)}
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled && status !== "extracting") setDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled && status !== "extracting") {
          event.dataTransfer.dropEffect = "copy";
        }
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setDragging(false);
        }
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (!disabled && status !== "extracting") {
          void handleDroppedFiles(event.dataTransfer.files);
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        disabled={disabled || status === "extracting"}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void extract(file);
        }}
      />

      {!previewUrl ? (
        <div
          tabIndex={disabled ? -1 : 0}
          className={cn(
            "rounded-[18px] border border-dashed border-[#bdb9af] bg-white/58 p-3 transition-colors focus:outline-none focus-visible:border-[#171912] focus-visible:ring-4 focus-visible:ring-[#c8f85a]/35",
            dragging && "border-[#171912] bg-[#eff9d4]",
            disabled && "cursor-not-allowed opacity-45",
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#171912] bg-[#c8f85a] text-[#171912]">
                <ImagePlus size={18} />
              </span>
              <span>
                <span className="block text-sm font-extrabold text-[#171912]">
                  Add {label} screenshot
                </span>
                <span className="mt-0.5 block text-xs text-[#777a70]">
                  PNG, JPEG, or WebP · up to 8 MB
                </span>
              </span>
            </span>
            <FileImage size={17} className="shrink-0 text-[#777a70]" />
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              disabled={disabled || status === "extracting"}
              onClick={() => inputRef.current?.click()}
              className="secondary-button min-h-10 px-3 text-xs shadow-none"
            >
              <Upload size={15} />
              Upload image
            </button>
            <button
              type="button"
              disabled={disabled || status === "extracting"}
              onClick={() => void pasteFromClipboard()}
              className="secondary-button min-h-10 px-3 text-xs shadow-none"
            >
              {status === "extracting" ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <ClipboardPaste size={15} />
              )}
              Paste screenshot
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] leading-4 text-[#85887f]">
            You can also drop an image here or focus this box and press
            Ctrl/Command+V.
          </p>
          {status === "extracting" && (
            <p
              role="status"
              className="mt-2 text-center text-xs leading-5 text-[#6c7065]"
            >
              <LoaderCircle size={13} className="mr-1.5 inline animate-spin" />
              {message}
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-[18px] border border-[#171912]/14 bg-white/68 p-3">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-[#171912]/14 bg-white">
            <Image
              src={previewUrl}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold text-[#171912]">
              {fileName}
            </p>
            <p
              className={
                status === "error"
                  ? "mt-1 text-xs leading-5 text-[#98485c]"
                  : "mt-1 text-xs leading-5 text-[#6f7b8e]"
              }
              role={status === "error" ? "alert" : "status"}
            >
              {status === "extracting" && (
                <LoaderCircle
                  size={13}
                  className="mr-1.5 inline animate-spin"
                />
              )}
              {status === "complete" && (
                <CheckCircle2
                  size={13}
                  className="mr-1.5 inline text-[#377b64]"
                />
              )}
              {message}
            </p>
          </div>
          <button
            type="button"
            onClick={clearScreenshot}
            disabled={status === "extracting"}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[#748095] transition-colors hover:bg-[#edf0f5] hover:text-[#39465c] disabled:opacity-40"
            aria-label={`Remove ${label} screenshot`}
            title="Remove screenshot"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
      {!previewUrl && status === "error" && (
        <p role="alert" className="mt-2 text-xs leading-5 text-[#98485c]">
          {message}
        </p>
      )}
    </div>
  );
}
