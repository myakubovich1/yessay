import { z } from "zod";
import { verifyDemoCheckoutToken } from "@/lib/payments/checkout-token";
import { createFixEntitlementToken } from "@/lib/payments/entitlement-token";
import { getStripe } from "@/lib/payments/stripe";
import type { PricingProduct } from "@/lib/types";

const verificationSchema = z
  .object({
    sessionId: z.string().max(200).optional(),
    demoToken: z.string().max(2000).optional(),
  })
  .refine((value) => value.sessionId || value.demoToken);

const pricingProducts: PricingProduct[] = [
  "single_report",
  "draft_repair",
  "finals_pass",
  "monthly",
  "annual",
];

function fixGrantFor(product: PricingProduct, reportId?: string) {
  const granted = createFixEntitlementToken(product, reportId);
  if (!granted) return undefined;
  return { token: granted.token, ...granted.entitlement };
}

export async function POST(request: Request) {
  try {
    const parsed = verificationSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json(
        { error: "Missing checkout confirmation." },
        { status: 400 },
      );
    }

    if (parsed.data.demoToken) {
      const grant = verifyDemoCheckoutToken(parsed.data.demoToken);
      if (!grant) {
        return Response.json(
          { error: "This demo checkout confirmation is invalid or expired." },
          { status: 403 },
        );
      }
      return Response.json({
        ...grant,
        demo: true,
        fixGrant: fixGrantFor(grant.product, grant.reportId),
      });
    }

    const stripe = getStripe();
    if (!stripe || !parsed.data.sessionId) {
      return Response.json(
        { error: "Stripe checkout verification is unavailable." },
        { status: 503 },
      );
    }

    const session = await stripe.checkout.sessions.retrieve(
      parsed.data.sessionId,
    );
    const product = session.metadata?.product as PricingProduct | undefined;
    if (
      session.status !== "complete" ||
      session.payment_status !== "paid" ||
      !product ||
      !pricingProducts.includes(product)
    ) {
      return Response.json(
        { error: "Payment has not been confirmed." },
        { status: 403 },
      );
    }

    const reportId = session.metadata?.reportId || undefined;
    return Response.json({
      product,
      reportId,
      demo: false,
      fixGrant: fixGrantFor(product, reportId),
    });
  } catch (error) {
    console.error("Checkout verification error", error);
    return Response.json(
      { error: "We couldn't verify this checkout. Please contact support." },
      { status: 500 },
    );
  }
}
