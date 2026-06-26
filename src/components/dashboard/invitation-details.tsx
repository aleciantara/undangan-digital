"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TEMPLATES } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  invitationId: string;
  groomName: string;
  brideName: string;
  groomFullName: string | null;
  brideFullName: string | null;
  groomParents: string | null;
  brideParents: string | null;
  loveStory: string | null;
  templateId: string;
};

function parseApiError(data: { error?: unknown; fields?: Record<string, string[]> }): string {
  if (typeof data.error === "string") return data.error;
  if (data.fields) {
    const first = Object.values(data.fields).flat()[0];
    if (first) return first;
  }
  return "Terjadi kesalahan. Coba lagi.";
}

export function InvitationDetails({
  invitationId,
  groomName: initialGroom,
  brideName: initialBride,
  groomFullName: initialGroomFull,
  brideFullName: initialBrideFull,
  groomParents: initialGroomParents,
  brideParents: initialBrideParents,
  loveStory: initialLoveStory,
  templateId: initialTemplateId,
}: Props) {
  const router = useRouter();
  const [groomName, setGroomName] = useState(initialGroom);
  const [brideName, setBrideName] = useState(initialBride);
  const [groomFullName, setGroomFullName] = useState(initialGroomFull ?? "");
  const [brideFullName, setBrideFullName] = useState(initialBrideFull ?? "");
  const [groomParents, setGroomParents] = useState(initialGroomParents ?? "");
  const [brideParents, setBrideParents] = useState(initialBrideParents ?? "");
  const [loveStory, setLoveStory] = useState(initialLoveStory ?? "");
  const [templateId, setTemplateId] = useState(initialTemplateId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const selected = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);

    const res = await fetch(`/api/invitations/${invitationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groomName: groomName.trim(),
        brideName: brideName.trim(),
        groomFullName: groomFullName,
        brideFullName: brideFullName,
        groomParents: groomParents,
        brideParents: brideParents,
        loveStory: loveStory,
        templateId: selected.id,
        primaryColor: selected.primaryColor,
        accentColor: selected.accentColor,
        fontFamily: selected.fontFamily,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(parseApiError(data));
      return;
    }

    setMessage("Data mempelai dan template disimpan.");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data mempelai & template</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="edit-groomName">Nama panggilan mempelai pria *</Label>
              <Input
                id="edit-groomName"
                required
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-brideName">Nama panggilan mempelai wanita *</Label>
              <Input
                id="edit-brideName"
                required
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="edit-groomFullName">Nama lengkap mempelai pria</Label>
              <Input
                id="edit-groomFullName"
                value={groomFullName}
                onChange={(e) => setGroomFullName(e.target.value)}
                placeholder="Opsional"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-brideFullName">Nama lengkap mempelai wanita</Label>
              <Input
                id="edit-brideFullName"
                value={brideFullName}
                onChange={(e) => setBrideFullName(e.target.value)}
                placeholder="Opsional"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="edit-groomParents">Orang tua mempelai pria</Label>
              <Input
                id="edit-groomParents"
                value={groomParents}
                onChange={(e) => setGroomParents(e.target.value)}
                placeholder="Bpk. ... & Ibu ..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-brideParents">Orang tua mempelai wanita</Label>
              <Input
                id="edit-brideParents"
                value={brideParents}
                onChange={(e) => setBrideParents(e.target.value)}
                placeholder="Bpk. ... & Ibu ..."
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-loveStory">Kisah cinta / kutipan</Label>
            <textarea
              id="edit-loveStory"
              value={loveStory}
              onChange={(e) => setLoveStory(e.target.value)}
              placeholder="Opsional — ditampilkan di undangan"
              rows={3}
              className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-brand-amaranth focus:outline-none focus:ring-2 focus:ring-brand-amaranth/20"
            />
          </div>

          <div>
            <Label>Template</Label>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {TEMPLATES.filter((t) => !t.isPremium).map((t) => (
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
                  <p className="text-xs text-stone-500">{t.region ?? "Umum"}</p>
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
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-700">{message}</p>}

          <Button type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan perubahan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
