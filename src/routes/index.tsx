import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Verve Billing Backend — Stripe endpoints" },
      {
        name: "description",
        content:
          "Stripe checkout, billing portal and session verification endpoints powering the Verve health app.",
      },
      { property: "og:title", content: "Verve Billing Backend — Stripe endpoints" },
      {
        property: "og:description",
        content:
          "Stripe checkout, billing portal and session verification endpoints powering the Verve health app.",
      },
    ],
  }),
  component: Index,
});

const endpoints = [
  { path: "/api/public/stripe/create-checkout-session", desc: "Starts a subscription checkout" },
  { path: "/api/public/stripe/create-portal-session", desc: "Opens the Stripe billing portal" },
  { path: "/api/public/stripe/verify-checkout-session", desc: "Confirms a completed checkout" },
];

function Index() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Verve
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">Billing backend</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          These endpoints keep your Stripe secret key off the client. The Verve app calls them from{" "}
          <code className="rounded bg-muted px-1 py-0.5">STRIPE_CONFIG</code>.
        </p>

        <ul className="mt-8 space-y-3">
          {endpoints.map((e) => (
            <li key={e.path} className="rounded-lg border border-border bg-card p-4">
              <code className="text-sm text-card-foreground">POST {e.path}</code>
              <p className="mt-1 text-sm text-muted-foreground">{e.desc}</p>
            </li>
          ))}
        </ul>

        <a
          href="/verve/index.html"
          className="mt-8 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Open the Verve app
        </a>
      </div>
    </main>
  );
}
