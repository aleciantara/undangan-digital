"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DresscodeColorPicker } from "@/components/dashboard/dresscode-color-picker";
import { InvitationDetails } from "@/components/dashboard/invitation-details";
import { InvitationGallery } from "@/components/dashboard/invitation-gallery";
import { InvitationGift } from "@/components/dashboard/invitation-gift";
import { InvitationMusic } from "@/components/dashboard/invitation-music";
import { InvitationSchedule } from "@/components/dashboard/invitation-schedule";
import { InvitationVerse } from "@/components/dashboard/invitation-verse";
import { InvitationVideos } from "@/components/dashboard/invitation-videos";
import { InviteQr } from "@/components/dashboard/invite-qr";
import { formatEventDate, formatEventTime, toDatetimeLocalInput } from "@/lib/format";
import { buildGuestInviteMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { EVENT_TYPES } from "@/types";
import type { AppPlan } from "@/types/auth";
import Link from "next/link";
import { ArrowLeft, Copy, ExternalLink, MessageCircle, Pencil, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Event = {
  id: string;
  name: string;
  date: string;
  venue: string;
  address: string;
  mapsUrl: string | null;
  wazeUrl: string | null;
  dresscodeColor: string | null;
  dresscodeAttire: string | null;
  notes: string | null;
};

type EventFormDefaults = {
  date: string;
  venue: string;
  address: string;
  mapsUrl: string;
  wazeUrl: string;
  dresscodeColor: string;
  dresscodeAttire: string;
  notes: string;
};

const emptyEventFormDefaults = (): EventFormDefaults => ({
  date: "",
  venue: "",
  address: "",
  mapsUrl: "",
  wazeUrl: "",
  dresscodeColor: "",
  dresscodeAttire: "",
  notes: "",
});

type Guest = {
  id: string;
  name: string;
  token: string;
  phone: string | null;
  reservedSeats: number;
};

type Photo = {
  id: string;
  url: string;
  caption: string | null;
};

type RsvpStats = {
  confirmed: number;
  declined: number;
  maybe: number;
  pending: number;
};

type Props = {
  invitation: {
    id: string;
    slug: string;
    groomName: string;
    brideName: string;
    groomFullName: string | null;
    brideFullName: string | null;
    groomParents: string | null;
    brideParents: string | null;
    loveStory: string | null;
    isPublished: boolean;
    opensAt: string | null;
    seatQuota: number | null;
    templateId: string;
    coverPhotoUrl: string | null;
    landscapeBackdropFill: boolean;
    musicUrl: string | null;
    musicTitle: string | null;
    musicAutoplay: boolean;
    musicStartSec: number;
    inviteVerseTitle: string | null;
    inviteVersePreset: string | null;
    inviteVerseText: string | null;
    prewedVideoUrl: string | null;
    prewedVideoTitle: string | null;
    liveStreamUrl: string | null;
    liveStreamTitle: string | null;
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
    photos: Photo[];
    events: Event[];
    guests: Guest[];
    _count: { wishes: number };
  };
  rsvpStats: RsvpStats;
  appUrl: string;
  userPlan?: AppPlan;
};

function parseApiError(data: { error?: unknown; fields?: Record<string, string[]> }): string {
  if (typeof data.error === "string") return data.error;
  if (data.fields) {
    const first = Object.values(data.fields).flat()[0];
    if (first) return first;
  }
  return "Terjadi kesalahan. Coba lagi.";
}

export function ManageInvitation({ invitation, rsvpStats, appUrl, userPlan = "FREE" }: Props) {
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [eventLoading, setEventLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [eventError, setEventError] = useState<string | null>(null);
  const [guestError, setGuestError] = useState<string | null>(null);
  const [eventSuccess, setEventSuccess] = useState(false);
  const [eventSuccessMessage, setEventSuccessMessage] = useState<string | null>(null);
  const [eventFormKey, setEventFormKey] = useState(0);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventFormDefaults, setEventFormDefaults] = useState<EventFormDefaults>(emptyEventFormDefaults);
  const [guestSuccess, setGuestSuccess] = useState(false);
  const [eventName, setEventName] = useState("");
  const [seatQuotaInput, setSeatQuotaInput] = useState(
    invitation.seatQuota != null ? String(invitation.seatQuota) : ""
  );
  const [seatQuotaLoading, setSeatQuotaLoading] = useState(false);
  const [seatQuotaMessage, setSeatQuotaMessage] = useState<string | null>(null);

  const publicUrl = `${appUrl}/undangan/${invitation.slug}`;

  async function togglePublish() {
    setPublishing(true);
    const res = await fetch(`/api/invitations/${invitation.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !invitation.isPublished }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(parseApiError(data));
    }
    setPublishing(false);
    router.refresh();
  }

  async function saveEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEventError(null);
    setEventSuccess(false);
    setEventLoading(true);

    const form = new FormData(e.currentTarget);
    const dateStr = String(form.get("date"));
    const parsed = new Date(dateStr);
    if (Number.isNaN(parsed.getTime())) {
      setEventError("Tanggal tidak valid");
      setEventLoading(false);
      return;
    }

    const payload = {
      name: form.get("name"),
      date: parsed.toISOString(),
      venue: form.get("venue"),
      address: form.get("address"),
      mapsUrl: form.get("mapsUrl") || "",
      wazeUrl: form.get("wazeUrl") || "",
      dresscodeColor: form.get("dresscodeColor") || "",
      dresscodeAttire: form.get("dresscodeAttire") || "",
      notes: form.get("notes") || "",
    };

    const isEditing = editingEventId !== null;
    const res = await fetch(
      isEditing
        ? `/api/invitations/${invitation.id}/events/${editingEventId}`
        : `/api/invitations/${invitation.id}/events`,
      {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json().catch(() => ({}));
    setEventLoading(false);

    if (!res.ok) {
      setEventError(parseApiError(data));
      return;
    }

    setEventSuccessMessage(
      isEditing ? "Acara berhasil diperbarui." : "Acara berhasil ditambahkan."
    );
    setEventSuccess(true);
    resetEventForm();
    router.refresh();
  }

  function resetEventForm() {
    setEditingEventId(null);
    setEventName("");
    setEventFormDefaults(emptyEventFormDefaults());
    setEventFormKey((k) => k + 1);
    setEventError(null);
  }

  function startEditEvent(ev: Event) {
    setEditingEventId(ev.id);
    setEventName(ev.name);
    setEventFormDefaults({
      date: toDatetimeLocalInput(ev.date),
      venue: ev.venue,
      address: ev.address,
      mapsUrl: ev.mapsUrl ?? "",
      wazeUrl: ev.wazeUrl ?? "",
      dresscodeColor: ev.dresscodeColor ?? "",
      dresscodeAttire: ev.dresscodeAttire ?? "",
      notes: ev.notes ?? "",
    });
    setEventFormKey((k) => k + 1);
    setEventError(null);
    setEventSuccess(false);
    setEventSuccessMessage(null);
  }

  async function saveSeatQuota(e: React.FormEvent) {
    e.preventDefault();
    setSeatQuotaMessage(null);
    setSeatQuotaLoading(true);
    const value = seatQuotaInput.trim();
    const res = await fetch(`/api/invitations/${invitation.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seatQuota: value === "" ? null : Number(value),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSeatQuotaLoading(false);
    if (!res.ok) {
      setSeatQuotaMessage(parseApiError(data));
      return;
    }
    setSeatQuotaMessage("Kuota undangan disimpan.");
    router.refresh();
  }

  async function addGuest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGuestError(null);
    setGuestSuccess(false);
    setGuestLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch(`/api/invitations/${invitation.id}/guests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        phone: form.get("phone"),
        reservedSeats: form.get("reservedSeats") || 2,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setGuestLoading(false);

    if (!res.ok) {
      setGuestError(parseApiError(data));
      return;
    }

    setGuestSuccess(true);
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  async function deleteEvent(eventId: string) {
    if (!confirm("Hapus acara ini?")) return;
    if (editingEventId === eventId) resetEventForm();
    await fetch(`/api/invitations/${invitation.id}/events/${eventId}`, { method: "DELETE" });
    router.refresh();
  }

  async function deleteGuest(guestId: string) {
    if (!confirm("Hapus tamu ini?")) return;
    await fetch(`/api/invitations/${invitation.id}/guests/${guestId}`, { method: "DELETE" });
    router.refresh();
  }

  function copyLink(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const totalRsvp =
    rsvpStats.confirmed + rsvpStats.declined + rsvpStats.maybe + rsvpStats.pending;

  const isScheduled =
    invitation.isPublished &&
    invitation.opensAt &&
    new Date(invitation.opensAt).getTime() > Date.now();

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition hover:text-brand-amaranth md:hidden"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke daftar undangan
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-invitation text-2xl font-semibold text-brand-ink">
            {invitation.groomName} & {invitation.brideName}
          </h1>
          <p className="mt-1 text-sm text-stone-500">/{invitation.slug}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge
              className={
                isScheduled
                  ? "bg-amber-100 text-amber-800"
                  : invitation.isPublished
                    ? "bg-green-100 text-green-800"
                    : "bg-stone-100"
              }
            >
              {isScheduled ? "Terjadwal" : invitation.isPublished ? "Terbit" : "Draft"}
            </Badge>
            <Badge className="bg-brand-chalk text-brand-amaranth">{invitation._count.wishes} ucapan</Badge>
            <Badge className="bg-stone-100 text-stone-600">{invitation.guests.length} tamu</Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={togglePublish}
            disabled={publishing || (!invitation.isPublished && invitation.events.length === 0)}
            variant={invitation.isPublished ? "outline" : "primary"}
            title={
              invitation.events.length === 0 ? "Tambahkan acara dulu" : undefined
            }
          >
            {invitation.isPublished ? "Jadikan draft" : "Terbitkan"}
          </Button>
          {invitation.isPublished && (
            <Link href={publicUrl} target="_blank">
              <Button variant="secondary">
                <ExternalLink className="h-4 w-4" />
                Lihat undangan
              </Button>
            </Link>
          )}
        </div>
      </div>

      {totalRsvp > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan RSVP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg bg-green-50 px-4 py-3 text-center">
                <p className="text-2xl font-semibold text-green-800">{rsvpStats.confirmed}</p>
                <p className="text-xs text-green-700">Hadir</p>
              </div>
              <div className="rounded-lg bg-amber-50 px-4 py-3 text-center">
                <p className="text-2xl font-semibold text-amber-800">{rsvpStats.maybe}</p>
                <p className="text-xs text-amber-700">Mungkin</p>
              </div>
              <div className="rounded-lg bg-stone-100 px-4 py-3 text-center">
                <p className="text-2xl font-semibold text-stone-700">{rsvpStats.declined}</p>
                <p className="text-xs text-stone-600">Tidak hadir</p>
              </div>
              <div className="rounded-lg bg-stone-50 px-4 py-3 text-center">
                <p className="text-2xl font-semibold text-stone-600">{rsvpStats.pending}</p>
                <p className="text-xs text-stone-500">Belum jawab</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <InvitationDetails
        invitationId={invitation.id}
        groomName={invitation.groomName}
        brideName={invitation.brideName}
        groomFullName={invitation.groomFullName}
        brideFullName={invitation.brideFullName}
        groomParents={invitation.groomParents}
        brideParents={invitation.brideParents}
        loveStory={invitation.loveStory}
        templateId={invitation.templateId}
        userPlan={userPlan}
      />

      <InvitationSchedule
        invitationId={invitation.id}
        isPublished={invitation.isPublished}
        opensAt={invitation.opensAt}
      />

      <InvitationGallery
        invitationId={invitation.id}
        photos={invitation.photos}
        coverPhotoUrl={invitation.coverPhotoUrl}
        landscapeBackdropFill={invitation.landscapeBackdropFill}
        templateId={invitation.templateId}
      />

      <InvitationMusic
        invitationId={invitation.id}
        musicUrl={invitation.musicUrl}
        musicTitle={invitation.musicTitle}
        musicAutoplay={invitation.musicAutoplay}
        musicStartSec={invitation.musicStartSec}
      />

      <InvitationVerse
        invitationId={invitation.id}
        inviteVerseTitle={invitation.inviteVerseTitle}
        inviteVersePreset={invitation.inviteVersePreset}
        inviteVerseText={invitation.inviteVerseText}
      />

      <InvitationVideos
        invitationId={invitation.id}
        prewedVideoUrl={invitation.prewedVideoUrl}
        prewedVideoTitle={invitation.prewedVideoTitle}
        liveStreamUrl={invitation.liveStreamUrl}
        liveStreamTitle={invitation.liveStreamTitle}
      />

      <InvitationGift
        invitationId={invitation.id}
        groomName={invitation.groomName}
        brideName={invitation.brideName}
        giftEnabled={invitation.giftEnabled}
        giftTitle={invitation.giftTitle}
        giftMessage={invitation.giftMessage}
        giftGroomAccountName={invitation.giftGroomAccountName}
        giftGroomBank={invitation.giftGroomBank}
        giftGroomAccountNumber={invitation.giftGroomAccountNumber}
        giftBrideAccountName={invitation.giftBrideAccountName}
        giftBrideBank={invitation.giftBrideBank}
        giftBrideAccountNumber={invitation.giftBrideAccountNumber}
        giftGroomAddressTitle={invitation.giftGroomAddressTitle}
        giftGroomAddressFull={invitation.giftGroomAddressFull}
        giftBrideAddressTitle={invitation.giftBrideAddressTitle}
        giftBrideAddressFull={invitation.giftBrideAddressFull}
      />

      {invitation.isPublished && (
        <Card>
          <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
            <InviteQr url={publicUrl} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-stone-700">Link undangan publik</p>
              <code className="mt-1 block truncate rounded bg-stone-100 px-2 py-1 text-sm">
                {publicUrl}
              </code>
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => copyLink(publicUrl, "public")}
              >
                <Copy className="h-4 w-4" />
                {copied === "public" ? "Tersalin!" : "Salin link"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Acara ({invitation.events.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {invitation.events.length === 0 && (
            <p className="text-sm text-stone-500">Tambahkan minimal satu acara agar undangan lengkap.</p>
          )}
          <ul className="space-y-3">
            {invitation.events.map((ev) => (
              <li
                key={ev.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-stone-200 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{ev.name}</p>
                  <p className="text-sm text-stone-600">
                    {formatEventDate(ev.date)} · {formatEventTime(ev.date)} · {ev.venue}
                  </p>
                  <p className="text-xs text-stone-500">{ev.address}</p>
                  {ev.notes && (
                    <p className="mt-1 text-xs text-stone-500">{ev.notes}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => startEditEvent(ev)}
                    aria-label="Edit acara"
                  >
                    <Pencil className="h-4 w-4 text-stone-400" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteEvent(ev.id)}
                    aria-label="Hapus acara"
                  >
                    <Trash2 className="h-4 w-4 text-stone-400" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.slice(0, 4).map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setEventName(t.label)}
                className="rounded-full border border-brand-amaranth/20 px-3 py-1 text-xs text-brand-amaranth transition hover:bg-brand-chalk"
              >
                {t.label}
              </button>
            ))}
          </div>

          <form
            key={eventFormKey}
            onSubmit={saveEvent}
            className="grid gap-3 border-t border-stone-100 pt-6 sm:grid-cols-2"
          >
            {editingEventId && (
              <div className="flex items-center justify-between rounded-lg bg-brand-chalk/60 px-3 py-2 sm:col-span-2">
                <p className="text-sm font-medium text-brand-ink">Mengedit acara</p>
                <Button type="button" size="sm" variant="ghost" onClick={resetEventForm}>
                  <X className="h-4 w-4" />
                  Batal
                </Button>
              </div>
            )}
            <div className="sm:col-span-2">
              <Label>Nama acara</Label>
              <Input
                name="name"
                required
                placeholder="Akad Nikah"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>
            <div>
              <Label>Tanggal & waktu</Label>
              <Input
                name="date"
                type="datetime-local"
                required
                defaultValue={eventFormDefaults.date}
              />
            </div>
            <div>
              <Label>Tempat</Label>
              <Input
                name="venue"
                required
                placeholder="Masjid / Gedung"
                defaultValue={eventFormDefaults.venue}
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Alamat</Label>
              <Input name="address" required defaultValue={eventFormDefaults.address} />
            </div>
            <div>
              <Label>Google Maps URL</Label>
              <Input
                name="mapsUrl"
                type="url"
                placeholder="https://maps.google.com/..."
                defaultValue={eventFormDefaults.mapsUrl}
              />
            </div>
            <div>
              <Label>Waze URL</Label>
              <Input
                name="wazeUrl"
                type="url"
                placeholder="https://waze.com/..."
                defaultValue={eventFormDefaults.wazeUrl}
              />
            </div>
            <div className="sm:col-span-2">
              <DresscodeColorPicker
                name="dresscodeColor"
                defaultValue={eventFormDefaults.dresscodeColor}
              />
            </div>
            <div>
              <Label>Jenis pakaian</Label>
              <Input
                name="dresscodeAttire"
                placeholder="Batik formal / Kebaya"
                defaultValue={eventFormDefaults.dresscodeAttire}
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Catatan acara</Label>
              <Input name="notes" placeholder="Opsional" defaultValue={eventFormDefaults.notes} />
            </div>
            {eventError && (
              <p className="text-sm text-red-600 sm:col-span-2">{eventError}</p>
            )}
            {eventSuccess && eventSuccessMessage && (
              <p className="text-sm text-green-700 sm:col-span-2">{eventSuccessMessage}</p>
            )}
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <Button type="submit" disabled={eventLoading}>
                {eventLoading
                  ? "Menyimpan..."
                  : editingEventId
                    ? "Simpan perubahan"
                    : "Tambah acara"}
              </Button>
              {editingEventId && (
                <Button type="button" variant="outline" onClick={resetEventForm}>
                  Batal
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kuota kursi undangan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-stone-600">
            Batas total tamu yang hadir di seluruh acara. Kosongkan jika tanpa batas. Tamu tanpa
            link personal harus verifikasi nomor WhatsApp yang sama seperti di daftar tamu.
          </p>
          <form onSubmit={saveSeatQuota} className="mt-4 flex flex-wrap items-end gap-3">
            <div className="min-w-[140px] flex-1">
              <Label htmlFor="seat-quota">Maks. tamu hadir (total)</Label>
              <Input
                id="seat-quota"
                type="number"
                min={1}
                placeholder="Tanpa batas"
                value={seatQuotaInput}
                onChange={(e) => setSeatQuotaInput(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={seatQuotaLoading}>
              {seatQuotaLoading ? "Menyimpan..." : "Simpan kuota"}
            </Button>
          </form>
          {seatQuotaMessage && (
            <p className="mt-2 text-sm text-stone-600">{seatQuotaMessage}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar tamu ({invitation.guests.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="space-y-3">
            {invitation.guests.map((g) => {
              const link = `${publicUrl}?tamu=${g.token}`;
              const waMessage = buildGuestInviteMessage(
                g.name,
                invitation.groomName,
                invitation.brideName,
                link
              );
              const waUrl = g.phone ? buildWhatsAppUrl(g.phone, waMessage) : null;

              return (
                <li
                  key={g.id}
                  className="rounded-lg border border-stone-200 px-4 py-3"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">{g.name}</p>
                      <p className="text-xs text-stone-500">
                        {g.phone ?? "— tanpa nomor —"} · kuota {g.reservedSeats} kursi
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => copyLink(link, g.id)}>
                        <Copy className="h-4 w-4" />
                        {copied === g.id ? "Tersalin!" : "Salin link"}
                      </Button>
                      {waUrl ? (
                        <a href={waUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="secondary" type="button">
                            <MessageCircle className="h-4 w-4" />
                            WhatsApp
                          </Button>
                        </a>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          type="button"
                          title="Isi nomor WhatsApp untuk kirim undangan"
                          onClick={() =>
                            copyLink(waMessage, `wa-${g.id}`)
                          }
                        >
                          <MessageCircle className="h-4 w-4" />
                          {copied === `wa-${g.id}` ? "Pesan disalin" : "Salin pesan"}
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteGuest(g.id)}
                        aria-label="Hapus tamu"
                      >
                        <Trash2 className="h-4 w-4 text-stone-400" />
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <form
            onSubmit={addGuest}
            className="grid gap-3 border-t border-stone-100 pt-6 sm:grid-cols-2"
          >
            <div>
              <Label>Nama tamu</Label>
              <Input name="name" required placeholder="Nama di undangan" className="mt-1" />
            </div>
            <div>
              <Label>Nomor WhatsApp</Label>
              <Input
                name="phone"
                required
                placeholder="08xxxxxxxxxx"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Kursi untuk nama ini</Label>
              <Input
                name="reservedSeats"
                type="number"
                min={1}
                max={20}
                defaultValue={2}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={guestLoading} className="w-full sm:w-auto">
                {guestLoading ? "Menyimpan..." : "Tambah tamu"}
              </Button>
            </div>
          </form>
          {guestError && <p className="text-sm text-red-600">{guestError}</p>}
          {guestSuccess && <p className="text-sm text-green-700">Tamu berhasil ditambahkan.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
