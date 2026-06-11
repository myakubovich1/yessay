import { mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createWorker } from "tesseract.js";

type OCRWorker = Awaited<ReturnType<typeof createWorker>>;

let workerPromise: Promise<OCRWorker> | null = null;
let recognitionQueue: Promise<void> = Promise.resolve();

async function createOCRWorker() {
  const cachePath = join(tmpdir(), "yessay-tesseract-cache");
  await mkdir(cachePath, { recursive: true });
  return createWorker("eng", undefined, { cachePath });
}

function getWorker() {
  workerPromise ??= createOCRWorker();
  return workerPromise;
}

function normalizeExtractedText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 100_000);
}

export function extractTextFromImage(image: Buffer) {
  const recognition = recognitionQueue.then(async () => {
    const worker = await getWorker();
    const result = await worker.recognize(image);
    return {
      text: normalizeExtractedText(result.data.text),
      confidence: Math.round(result.data.confidence),
    };
  });

  recognitionQueue = recognition.then(
    () => undefined,
    () => undefined,
  );

  return recognition;
}
