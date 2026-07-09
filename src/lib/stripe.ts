import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) return null;

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2026-06-24.dahlia",
    });
  }

  return stripeClient;
}

export function getStripePriceId(plan: "PRO" | "PREMIUM") {
  if (plan === "PRO") return process.env.STRIPE_PRICE_PRO?.trim() ?? null;
  return process.env.STRIPE_PRICE_PREMIUM?.trim() ?? null;
}

export function planFromStripePriceId(priceId: string): "PRO" | "PREMIUM" | null {
  if (priceId === process.env.STRIPE_PRICE_PRO?.trim()) return "PRO";
  if (priceId === process.env.STRIPE_PRICE_PREMIUM?.trim()) return "PREMIUM";
  return null;
}
