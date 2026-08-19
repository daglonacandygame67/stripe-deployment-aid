import { createFileRoute } from "@tanstack/react-router";
import { getStripe, json, preflight } from "@/lib/stripe.server";

export const Route = createFileRoute("/api/public/stripe/create-checkout-session")({
  server: {
    handlers: {
      OPTIONS: () => preflight(),
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            priceId?: string;
            plan?: string;
            linkCode?: string;
            uid?: string | null;
            successUrl?: string;
            cancelUrl?: string;
          };
          if (!body.priceId || !body.successUrl || !body.cancelUrl) {
            return json({ error: "priceId, successUrl and cancelUrl are required" }, 400);
          }

          const stripe = getStripe();
          const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [{ price: body.priceId, quantity: 1 }],
            success_url: body.successUrl,
            cancel_url: body.cancelUrl,
            allow_promotion_codes: true,
            ...(body.linkCode ? { client_reference_id: body.linkCode } : {}),
            subscription_data: {
              metadata: {
                plan: body.plan ?? "",
                linkCode: body.linkCode ?? "",
                uid: body.uid ?? "",
              },
            },
            metadata: {
              plan: body.plan ?? "",
              linkCode: body.linkCode ?? "",
              uid: body.uid ?? "",
            },
          });

          return json({ url: session.url, id: session.id });
        } catch (e) {
          const message = e instanceof Error ? e.message : "Unknown error";
          console.error("create-checkout-session failed:", message);
          return json({ error: message }, 500);
        }
      },
    },
  },
});
