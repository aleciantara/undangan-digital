"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  invitationId: string;
  isPublished: boolean;
  opensAt: string | null;
};

function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function InvitationSchedule({ invitationId, isPublished, opensAt }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(toDatetimeLocalValue(opensAt));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const scheduled = isPublished && opensAt && new Date(opensAt).getTime() > Date.now();

  async function save(opensAtValue: string | null) {
    setError(null);
    setMessage(null);
    setSaving(true);

    const res = await fetch(`/api/invitations/${invitationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opensAt: opensAtValue }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Gagal menyimpan jadwal.");
      return;
    }

    setMessage(opensAtValue ? "Jadwal buka undangan disimpan." : "Jadwal dihapus — undangan langsung terbuka setelah diterbitkan.");
    router.refresh();
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) {
      save(null);
      return;
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      setError("Tanggal tidak valid.");
      return;
    }
    save(parsed.toISOString());
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5" />
          Jadwal buka undangan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-stone-600">
          Setelah diterbitkan, tamu melihat halaman tunggu sampai waktu yang Anda tentukan. Kosongkan
          untuk membuka undangan segera setelah diterbitkan.
        </p>

        {scheduled && (
          <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Undangan terjadwal — akan dibuka pada{" "}
            {new Date(opensAt!).toLocaleString("id-ID", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </p>
        )}

        <form onSubmit={handleSave} className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <Label htmlFor="opens-at">Buka pada (opsional)</Label>
            <Input
              id="opens-at"
              type="datetime-local"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan jadwal"}
          </Button>
          {value && (
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => {
                setValue("");
                save(null);
              }}
            >
              Hapus jadwal
            </Button>
          )}
        </form>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}
      </CardContent>
    </Card>
  );
}
