import {
  MAX_DRAFT_WORDS,
  OVER_LIMIT_MESSAGE,
  countWords,
} from "@/lib/analysis/limits";
import { createMockReport } from "@/lib/analysis/mock-analysis";
import { createOpenAIReport } from "@/lib/analysis/openai-analysis";
import { analysisInputSchema } from "@/lib/analysis/schema";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = analysisInputSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error:
            "Please include an assignment prompt and a longer draft before analyzing.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    if (!parsed.data.noRubric && !parsed.data.rubric?.trim()) {
      return Response.json(
        { error: "Add the rubric or select “I don't have a rubric.”" },
        { status: 400 },
      );
    }

    if (countWords(parsed.data.draft) > MAX_DRAFT_WORDS) {
      return Response.json({ error: OVER_LIMIT_MESSAGE }, { status: 413 });
    }

    if (process.env.OPENAI_API_KEY) {
      try {
        return Response.json(await createOpenAIReport(parsed.data), {
          headers: { "X-Yessay-Analysis-Mode": "openai" },
        });
      } catch (error) {
        console.error(
          "OpenAI analysis failed; using deterministic fallback.",
          error instanceof Error ? error.message : "Unknown error",
        );
      }
    }

    return Response.json(createMockReport(parsed.data), {
      headers: { "X-Yessay-Analysis-Mode": "fallback" },
    });
  } catch {
    return Response.json(
      { error: "We couldn't read that request. Please try again." },
      { status: 400 },
    );
  }
}
