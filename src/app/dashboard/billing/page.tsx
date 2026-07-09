import { requireSession } from "@/lib/authz";
import { BillingPlans } from "@/components/dashboard/billing-plans";

const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY?.trim());

export default async function BillingPage() {
  const session = await requireSession();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-invitation text-2xl font-semibold text-brand-ink">Billing & Paket</h1>
        <p className="mt-1 text-sm text-stone-600">
          Kelola paket langganan dan fitur undangan digital Anda.
        </p>
      </div>
      <BillingPlans currentPlan={session.user.plan ?? "FREE"} stripeEnabled={stripeEnabled} />
    </div>
  );
}
