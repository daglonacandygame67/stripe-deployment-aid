import { createFileRoute } from "@tanstack/react-router";
import type Stripe from "stripe";
import { getStripe, json, preflight } from "@/lib/stripe.server";

export const Route = createFileRoute("/api/public/stripe/verify-checkout-session")({
  server: {
    handlers: {
      OPTIONS: () => preflight(),
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { sessionId?: string };
          if (!body.sessionId) return json({ error: "sessionId is required" }, 400);

          const stripe = getStripe();
          const session = await stripe.checkout.sessions.retrieve(body.sessionId, {
            expand: ["subscription", "customer"],
          });

          const subscription = session.subscription as Stripe.Subscription | null;
          const paid = session.payment_status === "paid" || session.status === "complete";
          const item = subscription?.items?.data?.[0];
          const periodEnd = item?.current_period_end ?? null;

          return json({
            active: Boolean(paid && subscription && subscription.status !== "canceled"),
            plan: session.metadata?.["plan"] ?? null,
            linkCode: session.metadata?.["linkCode"] ?? null,
            stripeCustomerId:
              typeof session.customer === "string" ? session.customer : (session.customer?.id ?? null),
            stripeSubscriptionId: subscription?.id ?? null,
            currentPeriodEnd: periodEnd,
            status: subscription?.status ?? session.status,
          });
        } catch (e) {
          const message = e instanceof Error ? e.message : "Unknown error";
          console.error("verify-checkout-session failed:", message);
          return json({ error: message }, 500);
        }
      },
    },
  },
});
