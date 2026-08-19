import { createFileRoute } from "@tanstack/react-router";
import { getStripe, json, preflight } from "@/lib/stripe.server";

export const Route = createFileRoute("/api/public/stripe/create-portal-session")({
  server: {
    handlers: {
      OPTIONS: () => preflight(),
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            stripeCustomerId?: string | null;
            returnUrl?: string;
          };
          if (!body.stripeCustomerId) {
            return json({ error: "stripeCustomerId is required" }, 400);
          }

          const stripe = getStripe();
          const session = await stripe.billingPortal.sessions.create({
            customer: body.stripeCustomerId,
            ...(body.returnUrl ? { return_url: body.returnUrl } : {}),
          });

          return json({ url: session.url });
        } catch (e) {
          const message = e instanceof Error ? e.message : "Unknown error";
          console.error("create-portal-session failed:", message);
          return json({ error: message }, 500);
        }
      },
    },
  },
});
