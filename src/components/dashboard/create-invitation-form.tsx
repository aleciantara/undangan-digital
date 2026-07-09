"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TEMPLATES } from "@/types";
import { filterTemplatesForPlan } from "@/lib/plans";
import type { AppPlan } from "@/types/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  userPlan?: AppPlan;
};

export function CreateInvitationForm({ userPlan = "FREE" }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const availableTemplates = filterTemplatesForPlan(TEMPLATES, userPlan);
  const [templateId, setTemplateId] = useState(availableTemplates[0]?.id ?? TEMPLATES[0].id);

  const selected = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      groomName: form.get("groomName"),
      brideName: form.get("brideName"),
      groomParents: form.get("groomParents") || undefined,
      brideParents: form.get("brideParents") || undefined,
      templateId,
      primaryColor: selected.primaryColor,
      accentColor: selected.accentColor,
      fontFamily: selected.fontFamily,
    };

    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Gagal membuat undangan. Periksa data yang diisi.");
        return;
      }
      router.push(`/dashboard/${data.id}`);
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="groomName">Nama panggilan mempelai pria *</Label>
          <Input id="groomName" name="groomName" required placeholder="Budi" />
        </div>
        <div>
          <Label htmlFor="brideName">Nama panggilan mempelai wanita *</Label>
          <Input id="brideName" name="brideName" required placeholder="Sari" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="groomParents">Orang tua mempelai pria</Label>
          <Input id="groomParents" name="groomParents" placeholder="Bpk. ... & Ibu ..." />
        </div>
        <div>
          <Label htmlFor="brideParents">Orang tua mempelai wanita</Label>
          <Input id="brideParents" name="brideParents" placeholder="Bpk. ... & Ibu ..." />
        </div>
      </div>

      <div>
        <Label>Template</Label>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {availableTemplates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplateId(t.id)}
              className={`rounded-xl border-2 p-4 text-left transition ${
                templateId === t.id
                  ? "border-brand-amaranth bg-brand-chalk/60"
                  : "border-stone-200 hover:border-brand-rose/50"
              }`}
            >
              <p className="font-medium text-brand-ink">{t.nameId}</p>
              <p className="text-xs text-stone-500">{t.region ?? "Umum"} · {t.motif}</p>
              <div className="mt-2 flex gap-1">
                <span
                  className="h-4 w-4 rounded-full border"
                  style={{ backgroundColor: t.primaryColor }}
                />
                <span
                  className="h-4 w-4 rounded-full border"
                  style={{ backgroundColor: t.accentColor }}
                />
              </div>
            </button>
          ))}
        </div>
        {userPlan === "FREE" && (
          <p className="mt-2 text-xs text-stone-500">
            Template premium tersedia di paket Pro.{" "}
            <Link href="/dashboard/billing" className="font-medium text-brand-amaranth hover:underline">
              Upgrade paket
            </Link>
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} size="lg">
        {loading ? "Membuat..." : "Lanjut — atur acara"}
      </Button>
    </form>
  );
}
