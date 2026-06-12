import { extractTextFromImage } from "@/lib/analysis/ocr";

export const runtime = "nodejs";
export const maxDuration = 60;

// Vercel serverless functions reject request bodies over ~4.5 MB, so
// advertising a higher limit would produce opaque platform 413s.
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return Response.json(
        { error: "Choose a screenshot to extract." },
        { status: 400 },
      );
    }

    if (!ACCEPTED_IMAGE_TYPES.has(image.type)) {
      return Response.json(
        { error: "Use a PNG, JPEG, or WebP screenshot." },
        { status: 415 },
      );
    }

    if (image.size > MAX_IMAGE_SIZE) {
      return Response.json(
        { error: "Screenshot must be smaller than 4 MB." },
        { status: 413 },
      );
    }

    const result = await extractTextFromImage(
      Buffer.from(await image.arrayBuffer()),
    );

    if (result.text.length < 5) {
      return Response.json(
        {
          error:
            "No readable text was found. Try a sharper screenshot with larger text.",
        },
        { status: 422 },
      );
    }

    return Response.json(result);
  } catch (error) {
    console.error("Screenshot text extraction failed.", error);
    return Response.json(
      {
        error:
          "We couldn't read that screenshot. Try a clearer crop or paste the text instead.",
      },
      { status: 500 },
    );
  }
}
