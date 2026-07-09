import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe, planFromStripePriceId } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe webhook]", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(checkoutSession);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[stripe webhook handler]", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan as "PRO" | "PREMIUM" | undefined;
  if (!userId || !plan) return;

  await prisma.user.update({
    where: { id: userId },
    data: {
      plan,
      stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
      stripeSubscriptionId:
        typeof session.subscription === "string" ? session.subscription : undefined,
    },
  });
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;
  if (!customerId) return;

  const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
  if (!user) return;

  if (subscription.status === "active" || subscription.status === "trialing") {
    const priceId = subscription.items.data[0]?.price.id;
    const plan = priceId ? planFromStripePriceId(priceId) : null;
    if (plan) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          plan,
          stripeSubscriptionId: subscription.id,
        },
      });
      return;
    }
  }

  if (subscription.status === "canceled" || subscription.status === "unpaid") {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan: "FREE",
        stripeSubscriptionId: null,
        planExpiresAt: null,
      },
    });
  }
}
