"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_GIFT_INTRO } from "@/lib/gift-types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type GiftProps = {
  invitationId: string;
  groomName: string;
  brideName: string;
  giftEnabled: boolean;
  giftTitle: string | null;
  giftMessage: string | null;
  giftGroomAccountName: string | null;
  giftGroomBank: string | null;
  giftGroomAccountNumber: string | null;
  giftBrideAccountName: string | null;
  giftBrideBank: string | null;
  giftBrideAccountNumber: string | null;
  giftGroomAddressTitle: string | null;
  giftGroomAddressFull: string | null;
  giftBrideAddressTitle: string | null;
  giftBrideAddressFull: string | null;
};

import { parseApiError } from "@/lib/api-errors";
function GiftPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-4">
      <p className="mb-3 text-sm font-semibold text-stone-800">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function InvitationGift({
  invitationId,
  groomName,
  brideName,
  giftEnabled,
  giftTitle,
  giftMessage,
  giftGroomAccountName,
  giftGroomBank,
  giftGroomAccountNumber,
  giftBrideAccountName,
  giftBrideBank,
  giftBrideAccountNumber,
  giftGroomAddressTitle,
  giftGroomAddressFull,
  giftBrideAddressTitle,
  giftBrideAddressFull,
}: GiftProps) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(giftEnabled);
  const [title, setTitle] = useState(giftTitle ?? "Kirim Kado");
  const [message, setMessage] = useState(giftMessage ?? DEFAULT_GIFT_INTRO);
  const [groomAccName, setGroomAccName] = useState(giftGroomAccountName ?? "");
  const [groomBank, setGroomBank] = useState(giftGroomBank ?? "");
  const [groomAccNo, setGroomAccNo] = useState(giftGroomAccountNumber ?? "");
  const [brideAccName, setBrideAccName] = useState(giftBrideAccountName ?? "");
  const [brideBank, setBrideBank] = useState(giftBrideBank ?? "");
  const [brideAccNo, setBrideAccNo] = useState(giftBrideAccountNumber ?? "");
  const [groomAddrTitle, setGroomAddrTitle] = useState(giftGroomAddressTitle ?? "");
  const [groomAddrFull, setGroomAddrFull] = useState(giftGroomAddressFull ?? "");
  const [brideAddrTitle, setBrideAddrTitle] = useState(giftBrideAddressTitle ?? "");
  const [brideAddrFull, setBrideAddrFull] = useState(giftBrideAddressFull ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setSaving(true);

    const res = await fetch(`/api/invitations/${invitationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        giftEnabled: enabled,
        giftTitle: title,
        giftMessage: message,
        giftGroomAccountName: groomAccName,
        giftGroomBank: groomBank,
        giftGroomAccountNumber: groomAccNo,
        giftBrideAccountName: brideAccName,
        giftBrideBank: brideBank,
        giftBrideAccountNumber: brideAccNo,
        giftGroomAddressTitle: groomAddrTitle,
        giftGroomAddressFull: groomAddrFull,
        giftBrideAddressTitle: brideAddrTitle,
        giftBrideAddressFull: brideAddrFull,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(parseApiError(data));
      return;
    }

    setStatus("Bagian kirim kado disimpan.");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kirim kado</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-stone-600">
          Isi rekening masing-masing mempelai dan/atau alamat pengiriman hadiah. Kosongkan panel yang
          tidak digunakan.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="rounded border-stone-300"
            />
            Tampilkan bagian kirim kado di undangan
          </label>

          <div>
            <Label htmlFor="gift-title">Judul bagian</Label>
            <Input
              id="gift-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="gift-message">Pesan pembuka</Label>
            <textarea
              id="gift-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm"
            />
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
              Nomor rekening
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <GiftPanel title={`Mempelai pria — ${groomName}`}>
                <div>
                  <Label>Nama pemilik rekening</Label>
                  <Input
                    value={groomAccName}
                    onChange={(e) => setGroomAccName(e.target.value)}
                    placeholder="Nama sesuai rekening"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Bank</Label>
                  <Input
                    value={groomBank}
                    onChange={(e) => setGroomBank(e.target.value)}
                    placeholder="BCA, Mandiri, ..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>No. rekening</Label>
                  <Input
                    value={groomAccNo}
                    onChange={(e) => setGroomAccNo(e.target.value)}
                    placeholder="1234567890"
                    className="mt-1 font-mono"
                  />
                </div>
              </GiftPanel>

              <GiftPanel title={`Mempelai wanita — ${brideName}`}>
                <div>
                  <Label>Nama pemilik rekening</Label>
                  <Input
                    value={brideAccName}
                    onChange={(e) => setBrideAccName(e.target.value)}
                    placeholder="Nama sesuai rekening"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Bank</Label>
                  <Input
                    value={brideBank}
                    onChange={(e) => setBrideBank(e.target.value)}
                    placeholder="BCA, Mandiri, ..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>No. rekening</Label>
                  <Input
                    value={brideAccNo}
                    onChange={(e) => setBrideAccNo(e.target.value)}
                    placeholder="1234567890"
                    className="mt-1 font-mono"
                  />
                </div>
              </GiftPanel>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
              Alamat pengiriman hadiah
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <GiftPanel title={`Rumah mempelai pria — ${groomName}`}>
                <div>
                  <Label>Judul rumah</Label>
                  <Input
                    value={groomAddrTitle}
                    onChange={(e) => setGroomAddrTitle(e.target.value)}
                    placeholder="Rumah Mempelai Pria"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Alamat lengkap</Label>
                  <textarea
                    value={groomAddrFull}
                    onChange={(e) => setGroomAddrFull(e.target.value)}
                    rows={3}
                    placeholder="Jl. ..., RT/RW, Kelurahan, Kecamatan, Kota"
                    className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </GiftPanel>

              <GiftPanel title={`Rumah mempelai wanita — ${brideName}`}>
                <div>
                  <Label>Judul rumah</Label>
                  <Input
                    value={brideAddrTitle}
                    onChange={(e) => setBrideAddrTitle(e.target.value)}
                    placeholder="Rumah Mempelai Wanita"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Alamat lengkap</Label>
                  <textarea
                    value={brideAddrFull}
                    onChange={(e) => setBrideAddrFull(e.target.value)}
                    rows={3}
                    placeholder="Jl. ..., RT/RW, Kelurahan, Kecamatan, Kota"
                    className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </GiftPanel>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {status && <p className="text-sm text-green-700">{status}</p>}

          <Button type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan kirim kado"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
