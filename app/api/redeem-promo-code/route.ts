import { z } from "zod";
import { createDemoCheckoutToken } from "@/lib/payments/checkout-token";
import { resolvePromoCode } from "@/lib/payments/promo-codes";

const redeemSchema = z.object({
  code: z.string().min(1).max(60),
  reportId: z.string().max(100).optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = redeemSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: "Enter a promo code." }, { status: 400 });
    }

    const product = resolvePromoCode(parsed.data.code);
    if (!product) {
      return Response.json(
        { error: "That promo code isn't valid." },
        { status: 404 },
      );
    }

    const token = createDemoCheckoutToken(
      product,
      parsed.data.reportId,
      "promo",
    );
    return Response.json({
      url: `/success?demo_token=${encodeURIComponent(token)}`,
    });
  } catch (error) {
    console.error("Promo code error", error);
    return Response.json(
      { error: "We couldn't apply this code. Please try again." },
      { status: 500 },
    );
  }
}
