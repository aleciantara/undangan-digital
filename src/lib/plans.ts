import type { AppPlan, AppUserRole } from "@/types/auth";

export type PlanEntitlements = {
  maxInvitations: number | null;
  premiumTemplates: boolean;
  maxGuestsPerInvitation: number | null;
};

export const PLAN_ENTITLEMENTS: Record<AppPlan, PlanEntitlements> = {
  FREE: {
    maxInvitations: 1,
    premiumTemplates: false,
    maxGuestsPerInvitation: 50,
  },
  PRO: {
    maxInvitations: 5,
    premiumTemplates: true,
    maxGuestsPerInvitation: 200,
  },
  PREMIUM: {
    maxInvitations: null,
    premiumTemplates: true,
    maxGuestsPerInvitation: null,
  },
};

export const PLAN_LABELS: Record<AppPlan, string> = {
  FREE: "Gratis",
  PRO: "Pro",
  PREMIUM: "Premium",
};

export const PLAN_PRICES: Record<Exclude<AppPlan, "FREE">, { monthly: number; label: string }> = {
  PRO: { monthly: 99000, label: "Rp 99.000/bulan" },
  PREMIUM: { monthly: 199000, label: "Rp 199.000/bulan" },
};

export function getPlanEntitlements(plan: AppPlan): PlanEntitlements {
  return PLAN_ENTITLEMENTS[plan];
}

export function canUsePremiumTemplates(plan: AppPlan): boolean {
  return PLAN_ENTITLEMENTS[plan].premiumTemplates;
}

export function canCreateInvitation(plan: AppPlan, currentCount: number): boolean {
  const limit = PLAN_ENTITLEMENTS[plan].maxInvitations;
  if (limit === null) return true;
  return currentCount < limit;
}

export function canAddGuest(plan: AppPlan, currentGuestCount: number): boolean {
  const limit = PLAN_ENTITLEMENTS[plan].maxGuestsPerInvitation;
  if (limit === null) return true;
  return currentGuestCount < limit;
}

export function filterTemplatesForPlan<T extends { isPremium: boolean }>(
  templates: T[],
  plan: AppPlan
): T[] {
  if (canUsePremiumTemplates(plan)) return templates;
  return templates.filter((t) => !t.isPremium);
}

export function hasRole(
  role: AppUserRole | undefined,
  ...allowed: AppUserRole[]
): boolean {
  if (!role) return false;
  return allowed.includes(role);
}
