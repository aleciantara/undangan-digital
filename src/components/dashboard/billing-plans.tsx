"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PLAN_ENTITLEMENTS, PLAN_LABELS, PLAN_PRICES } from "@/lib/plans";
import type { AppPlan } from "@/types/auth";
import { useState } from "react";

type Props = {
  currentPlan: AppPlan;
  stripeEnabled: boolean;
};

function formatLimit(value: number | null) {
  return value === null ? "Tanpa batas" : String(value);
}

export function BillingPlans({ currentPlan, stripeEnabled }: Props) {
  const [loadingPlan, setLoadingPlan] = useState<AppPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade(plan: AppPlan) {
    if (plan === "FREE" || plan === currentPlan) return;
    setError(null);
    setLoadingPlan(plan);

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Gagal memulai checkout.");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setError("Stripe belum dikonfigurasi. Hubungi admin untuk upgrade manual.");
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoadingPlan(null);
    }
  }

  const plans: AppPlan[] = ["FREE", "PRO", "PREMIUM"];

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {!stripeEnabled && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Pembayaran Stripe belum aktif. Set STRIPE_SECRET_KEY dan price ID di .env.local untuk
          mengaktifkan checkout.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const entitlements = PLAN_ENTITLEMENTS[plan];
          const isCurrent = plan === currentPlan;
          const price = plan !== "FREE" ? PLAN_PRICES[plan] : null;

          return (
            <Card
              key={plan}
              className={isCurrent ? "border-brand-amaranth ring-1 ring-brand-amaranth/30" : ""}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {PLAN_LABELS[plan]}
                  {isCurrent && (
                    <span className="rounded-full bg-brand-rose/20 px-2 py-0.5 text-xs font-medium text-brand-amaranth">
                      Aktif
                    </span>
                  )}
                </CardTitle>
                <p className="text-sm text-stone-600">
                  {price ? price.label : "Gratis selamanya"}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-stone-700">
                  <li>Undangan: {formatLimit(entitlements.maxInvitations)}</li>
                  <li>Tamu/undangan: {formatLimit(entitlements.maxGuestsPerInvitation)}</li>
                  <li>
                    Template premium: {entitlements.premiumTemplates ? "Ya" : "Tidak"}
                  </li>
                </ul>
                {plan !== "FREE" && !isCurrent && (
                  <Button
                    className="w-full"
                    disabled={!stripeEnabled || loadingPlan !== null}
                    onClick={() => handleUpgrade(plan)}
                  >
                    {loadingPlan === plan ? "Memproses..." : `Upgrade ke ${PLAN_LABELS[plan]}`}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
