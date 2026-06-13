import { z } from "zod";
import { createMockRevision, createOpenAIRevision } from "@/lib/analysis/revision";
import { verifyFixEntitlementToken } from "@/lib/payments/entitlement-token";

// The full repair model can take a couple of minutes; needs a Vercel plan
// that allows extended function duration (Pro/Fluid). Hobby caps at 60s.
export const maxDuration = 300;

const fixSchema = z.object({
  entitlementToken: z.string().min(10).max(4000),
  reportId: z.string().min(1).max(100),
  source: z.object({
    assignmentPrompt: z.string().trim().min(20).max(30000),
    rubric: z.string().trim().max(30000).optional(),
    draft: z.string().trim().min(80).max(30000),
    assignmentType: z.string().trim().min(1).max(100),
    citationStyle: z.string().trim().min(1).max(50),
  }),
  priorityFixes: z.array(z.string().max(400)).max(8).default([]),
});

export async function POST(request: Request) {
  try {
    const parsed = fixSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json(
        {
          error:
            "The draft couldn't be read for repair. Drafts up to 30,000 characters are supported right now.",
        },
        { status: 400 },
      );
    }

    const { entitlementToken, reportId, source, priorityFixes } = parsed.data;
    const entitlement = verifyFixEntitlementToken(entitlementToken, reportId);
    if (!entitlement) {
      return Response.json(
        {
          error:
            "Draft repair isn't active for this report. Purchase a repair or an unlimited plan to continue.",
          code: "not_entitled",
        },
        { status: 403 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      if (process.env.NODE_ENV === "production") {
        return Response.json(
          { error: "Draft repair is not configured." },
          { status: 503 },
        );
      }
      return Response.json(createMockRevision(reportId, source));
    }

    const revision = await createOpenAIRevision(
      reportId,
      source,
      priorityFixes,
    );
    return Response.json(revision);
  } catch (error) {
    console.error("Draft repair failed.", error);
    return Response.json(
      {
        error:
          "The repair couldn't be completed. Your access is unaffected — please try again.",
      },
      { status: 500 },
    );
  }
}
