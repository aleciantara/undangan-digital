"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  INVITE_VERSE_PRESETS,
  type InviteVersePresetId,
  getInviteVersePreset,
} from "@/lib/invite-verse-presets";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  invitationId: string;
  inviteVerseTitle: string | null;
  inviteVersePreset: string | null;
  inviteVerseText: string | null;
};

import { parseApiError } from "@/lib/api-errors";
export function InvitationVerse({
  invitationId,
  inviteVerseTitle,
  inviteVersePreset,
  inviteVerseText,
}: Props) {
  const router = useRouter();
  const initialPreset = (inviteVersePreset ?? "islam") as InviteVersePresetId;
  const [preset, setPreset] = useState<InviteVersePresetId>(initialPreset);
  const [title, setTitle] = useState(inviteVerseTitle ?? getInviteVersePreset(initialPreset).title);
  const [text, setText] = useState(
    inviteVerseText ?? getInviteVersePreset(initialPreset).text
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function applyPreset(id: InviteVersePresetId) {
    setPreset(id);
    const p = getInviteVersePreset(id);
    setTitle(p.title);
    if (id !== "custom") setText(p.text);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);

    const res = await fetch(`/api/invitations/${invitationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inviteVerseTitle: title,
        inviteVersePreset: preset,
        inviteVerseText: text,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(parseApiError(data));
      return;
    }

    setMessage("Ayat undangan disimpan.");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ayat undangan (Walimatul Urs)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="verse-preset">Agama / preset</Label>
            <select
              id="verse-preset"
              value={preset}
              onChange={(e) => applyPreset(e.target.value as InviteVersePresetId)}
              className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm"
            >
              {INVITE_VERSE_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="verse-title">Judul bagian</Label>
            <Input
              id="verse-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Walimatul Urs"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="verse-text">Teks undangan</Label>
            <textarea
              id="verse-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 focus:border-brand-amaranth focus:outline-none focus:ring-2 focus:ring-brand-amaranth/20"
            />
            <p className="mt-1 text-xs text-stone-500">
              Pilih preset lalu sesuaikan teks. Teks kustom akan ditampilkan di undangan.
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-700">{message}</p>}

          <Button type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan ayat undangan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
