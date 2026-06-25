"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SerializedWish } from "@/lib/invitation-types";
import { useState } from "react";

type Props = {
  invitationId: string;
  initialWishes: SerializedWish[];
  defaultGuestName?: string;
};

export function WishesSection({ invitationId, initialWishes, defaultGuestName = "" }: Props) {
  const [wishes, setWishes] = useState(initialWishes);
  const [guestName, setGuestName] = useState(defaultGuestName);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId, guestName, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.guestName?.[0] ?? data.error ?? "Gagal mengirim ucapan");
        return;
      }
      setWishes((w) => [
        {
          id: data.id,
          guestName: data.guestName,
          message: data.message,
          emoji: data.emoji,
          createdAt: data.createdAt,
        },
        ...w,
      ]);
      setMessage("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-batik-brown/10 bg-white/80 p-5">
        <div>
          <Label htmlFor="wish-name">Nama</Label>
          <Input
            id="wish-name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
            placeholder="Nama Anda"
          />
        </div>
        <div>
          <Label htmlFor="wish-msg">Ucapan</Label>
          <Textarea
            id="wish-msg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            maxLength={500}
            placeholder="Selamat menempuh hidup baru..."
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} className="inv-btn-primary w-full">
          {loading ? "Mengirim..." : "Kirim ucapan"}
        </Button>
      </form>

      <ul className="space-y-3">
        {wishes.length === 0 && (
          <p className="text-center text-sm text-batik-brown/60">Belum ada ucapan. Jadilah yang pertama!</p>
        )}
        {wishes.map((w) => (
          <li
            key={w.id}
            className="rounded-xl border border-batik-brown/10 bg-white/70 px-4 py-3 shadow-sm"
          >
            <p className="font-medium text-batik-dark">
              {w.emoji && <span className="mr-1">{w.emoji}</span>}
              {w.guestName}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-stone-700">{w.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
