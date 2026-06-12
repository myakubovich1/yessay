"use client";

/**
 * Client-side document text extraction. Files are parsed in the browser
 * and never uploaded; only the extracted text enters the form.
 */

export const DOCUMENT_EXTENSIONS = ["docx", "pdf", "txt", "md"] as const;
export type DocumentKind = "docx" | "pdf" | "text";

export const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024;

export type ExtractionResult = {
  text: string;
  warning?: string;
};

export function documentKindFor(file: File): DocumentKind | null {
  const name = file.name.toLowerCase();
  if (
    name.endsWith(".docx") ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "docx";
  }
  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    return "pdf";
  }
  if (
    name.endsWith(".txt") ||
    name.endsWith(".md") ||
    file.type === "text/plain" ||
    file.type === "text/markdown"
  ) {
    return "text";
  }
  if (name.endsWith(".doc")) {
    throw new ExtractionError(
      "Legacy .doc files aren't supported. In Word, use Save As and pick .docx, then upload that.",
    );
  }
  if (name.endsWith(".pages")) {
    throw new ExtractionError(
      "Apple Pages files aren't supported. In Pages, use File → Export To → Word or PDF, then upload that.",
    );
  }
  return null;
}

export class ExtractionError extends Error {}

function normalize(text: string) {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function extractDocx(file: File): Promise<ExtractionResult> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({
    arrayBuffer: await file.arrayBuffer(),
  });
  const text = normalize(result.value);
  if (text.length < 5) {
    throw new ExtractionError(
      "This Word document appears to be empty or contains only images.",
    );
  }
  return {
    text,
    warning:
      result.messages.length > 0
        ? "Some elements (images, charts, or unusual formatting) were skipped."
        : undefined,
  };
}

async function extractPdf(file: File): Promise<ExtractionResult> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const loadingTask = pdfjs.getDocument({ data: await file.arrayBuffer() });
  let pdf;
  try {
    pdf = await loadingTask.promise;
  } catch (error) {
    if (error instanceof Error && error.name === "PasswordException") {
      throw new ExtractionError(
        "This PDF is password protected. Remove the password and upload it again.",
      );
    }
    throw new ExtractionError(
      "This PDF couldn't be opened. It may be corrupted — try re-exporting it.",
    );
  }

  try {
    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      let pageText = "";
      for (const item of content.items) {
        if ("str" in item) {
          pageText += item.str;
          if (item.hasEOL) pageText += "\n";
          else if (item.str && !item.str.endsWith(" ")) pageText += " ";
        }
      }
      pages.push(pageText);
    }
    const text = normalize(pages.join("\n\n"));
    if (text.length < 20) {
      throw new ExtractionError(
        "No selectable text was found — this PDF is likely scanned. Take a screenshot of each page and use the screenshot option instead.",
      );
    }
    return {
      text,
      warning:
        pdf.numPages > 1
          ? `Text from all ${pdf.numPages} pages was added. Tables may need re-formatting — review the result.`
          : undefined,
    };
  } finally {
    void loadingTask.destroy();
  }
}

async function extractPlainText(file: File): Promise<ExtractionResult> {
  const text = normalize(await file.text());
  if (text.length < 5) {
    throw new ExtractionError("This file appears to be empty.");
  }
  return { text };
}

export async function extractTextFromDocument(
  file: File,
): Promise<ExtractionResult> {
  if (file.size > MAX_DOCUMENT_SIZE) {
    throw new ExtractionError("Documents must be smaller than 20 MB.");
  }
  const kind = documentKindFor(file);
  if (kind === "docx") return extractDocx(file);
  if (kind === "pdf") return extractPdf(file);
  if (kind === "text") return extractPlainText(file);
  throw new ExtractionError(
    "Use a DOCX, PDF, TXT, or Markdown file — or a PNG, JPEG, or WebP screenshot.",
  );
}
