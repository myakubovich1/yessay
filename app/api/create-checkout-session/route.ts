import { z } from "zod";
import { createDemoCheckoutToken } from "@/lib/payments/checkout-token";
import { getPriceId, getStripe } from "@/lib/payments/stripe";

const checkoutSchema = z.object({
  product: z.enum([
    "single_report",
    "draft_repair",
    "finals_pass",
    "monthly",
    "annual",
  ]),
  reportId: z.string().max(100).optional(),
});

function getPublicOrigin(request: Request) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedHost) {
    return `${forwardedProto || "https"}://${forwardedHost}`;
  }
  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  try {
    const parsed = checkoutSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json(
        { error: "Unknown checkout option." },
        { status: 400 },
      );
    }

    const origin = getPublicOrigin(request);
    const stripe = getStripe();
    const priceId = getPriceId(parsed.data.product);
    if (!stripe) {
      if (process.env.NODE_ENV === "production") {
        return Response.json(
          { error: "Checkout is not configured." },
          { status: 503 },
        );
      }
      const demoToken = createDemoCheckoutToken(
        parsed.data.product,
        parsed.data.reportId,
      );
      return Response.json({
        url: `/success?demo_token=${encodeURIComponent(demoToken)}`,
      });
    }

    if (!priceId) {
      return Response.json(
        { error: "This checkout option is not configured." },
        { status: 503 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode:
        parsed.data.product === "monthly" || parsed.data.product === "annual"
          ? "subscription"
          : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: parsed.data.reportId
        ? `${origin}/report/${parsed.data.reportId}`
        : `${origin}/pricing`,
      metadata: {
        product: parsed.data.product,
        reportId: parsed.data.reportId || "",
      },
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }
    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error", error);
    return Response.json(
      { error: "Checkout is unavailable right now. Please try again." },
      { status: 500 },
    );
  }
}
