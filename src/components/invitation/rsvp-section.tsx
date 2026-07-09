"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SerializedEvent, SerializedGuest } from "@/lib/invitation-types";
import { useCallback, useEffect, useState } from "react";

const MEAL_OPTIONS = [
  { value: "", label: "— Pilih preferensi —" },
  { value: "regular", label: "Menu biasa" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "halal", label: "Halal" },
  { value: "kids", label: "Menu anak" },
];

type Props = {
  invitationId: string;
  events: SerializedEvent[];
  guest: SerializedGuest | null;
};

type LookupState = {
  name: string;
  reservedSeats: number;
  rsvps: SerializedGuest["rsvps"];
  seatsRemaining: number | null;
  isNew: boolean;
};

export function RsvpSection({ invitationId, events, guest }: Props) {
  const isPersonalLink = !!guest;

  const [guestName, setGuestName] = useState(guest?.name ?? "");
  const [phone, setPhone] = useState(guest?.phone ?? "");
  const [openGuestToken, setOpenGuestToken] = useState<string | null>(null);
  const [verified, setVerified] = useState(isPersonalLink);
  const [lookup, setLookup] = useState<LookupState | null>(
    guest
      ? {
          name: guest.name,
          reservedSeats: guest.reservedSeats,
          rsvps: guest.rsvps,
          seatsRemaining: null,
          isNew: false,
        }
      : null
  );
  const [pax, setPax] = useState<Record<string, number>>({});
  const [mealPref, setMealPref] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Record<string, string>>({});
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initFromRsvps = useCallback((rsvps: SerializedGuest["rsvps"]) => {
    const d: Record<string, boolean> = {};
    const s: Record<string, string> = {};
    const p: Record<string, number> = {};
    const m: Record<string, string> = {};
    for (const r of rsvps) {
      if (r.status !== "PENDING" && r.respondedAt) {
        d[r.eventId] = true;
        s[r.eventId] = r.status;
        p[r.eventId] = r.pax;
        if (r.mealPref) m[r.eventId] = r.mealPref;
      }
    }
    setDone(d);
    setStatus(s);
    setPax(p);
    setMealPref(m);
  }, []);

  useEffect(() => {
    if (guest) {
      initFromRsvps(guest.rsvps);
    }
  }, [guest, initFromRsvps]);

  function resetOpenIdentity() {
    setVerified(false);
    setLookup(null);
    setOpenGuestToken(null);
  }

  async function identifyGuest() {
    setError(null);
    if (!guestName.trim() || guestName.trim().length < 2) {
      setError("Isi nama Anda minimal 2 karakter.");
      return;
    }
    if (!phone.trim()) {
      setError("Isi nomor WhatsApp.");
      return;
    }

    setVerifyLoading(true);
    try {
      const res = await fetch("/api/rsvp/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId,
          guestName: guestName.trim(),
          guestPhone: phone.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        resetOpenIdentity();
        setError(typeof data.error === "string" ? data.error : "Gagal memproses data");
        return;
      }

      setOpenGuestToken(data.guest.token);
      setLookup({
        name: data.guest.name,
        reservedSeats: data.guest.reservedSeats,
        rsvps: data.guest.rsvps,
        seatsRemaining: data.seatsRemaining,
        isNew: data.isNew,
      });
      setGuestName(data.guest.name);
      setVerified(true);
      initFromRsvps(data.guest.rsvps);
    } finally {
      setVerifyLoading(false);
    }
  }

  const maxPaxForGuest = lookup?.reservedSeats ?? guest?.reservedSeats ?? 1;
  const displayName = lookup?.name ?? guest?.name ?? "";

  async function submit(eventId: string, rsvpStatus: "CONFIRMED" | "DECLINED" | "MAYBE") {
    if (!verified || (!isPersonalLink && !openGuestToken)) {
      setError("Isi nama dan nomor WhatsApp, lalu klik Lanjut.");
      return;
    }
    if (done[eventId]) {
      setError("Anda sudah mengonfirmasi acara ini.");
      return;
    }

    const eventPax = rsvpStatus === "CONFIRMED" ? (pax[eventId] ?? 1) : 0;
    if (rsvpStatus === "CONFIRMED" && eventPax > maxPaxForGuest) {
      setError(`Maksimal ${maxPaxForGuest} orang untuk nama ini.`);
      return;
    }

    setError(null);
    setLoading(eventId);
    try {
      const body = isPersonalLink
        ? {
            guestToken: guest!.token,
            eventId,
            status: rsvpStatus,
            pax: eventPax || 1,
            mealPref: mealPref[eventId] || undefined,
            email: email || undefined,
          }
        : {
            guestToken: openGuestToken!,
            eventId,
            status: rsvpStatus,
            pax: eventPax || 1,
            mealPref: mealPref[eventId] || undefined,
            email: email || undefined,
          };

      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Gagal menyimpan RSVP");
        return;
      }

      setDone((d) => ({ ...d, [eventId]: true }));
      setStatus((s) => ({ ...s, [eventId]: rsvpStatus }));
      if (lookup && rsvpStatus === "CONFIRMED" && lookup.seatsRemaining != null) {
        setLookup({
          ...lookup,
          seatsRemaining: Math.max(0, lookup.seatsRemaining - eventPax),
        });
      }
    } finally {
      setLoading(null);
    }
  }

  if (events.length === 0) {
    return (
      <p className="text-center text-sm text-inv-muted">Belum ada acara untuk dikonfirmasi.</p>
    );
  }

  return (
    <div className="space-y-6">
      {isPersonalLink ? (
        <p className="text-center font-invitation text-lg text-inv-ink">
          Yth. <span className="font-semibold">{guest.name}</span>
        </p>
      ) : (
        <div className="rounded-xl border border-inv bg-inv-surface p-5 space-y-4">
          <p className="text-center text-sm text-inv-soft">
            Isi nama dan nomor WhatsApp Anda. Jika nomor sudah ada di daftar tamu, konfirmasi
            akan dicatat untuk tamu tersebut. Jika belum, Anda akan ditambahkan sebagai tamu
            baru.
          </p>
          <div>
            <Label htmlFor="rsvp-name">Nama</Label>
            <Input
              id="rsvp-name"
              value={guestName}
              onChange={(e) => {
                setGuestName(e.target.value);
                resetOpenIdentity();
              }}
              placeholder="Nama Anda"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="rsvp-phone">Nomor WhatsApp</Label>
            <Input
              id="rsvp-phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                resetOpenIdentity();
              }}
              placeholder="08xxxxxxxxxx"
              required
              className="mt-1"
            />
          </div>
          <Button
            type="button"
            className="inv-btn-primary w-full"
            onClick={identifyGuest}
            disabled={verifyLoading}
          >
            {verifyLoading ? "Memproses..." : "Lanjut"}
          </Button>
          {verified && lookup && (
            <p
              className={`rounded-lg px-3 py-2 text-sm ${
                lookup.isNew ? "bg-amber-50 text-amber-900" : "bg-green-50 text-green-800"
              }`}
            >
              {lookup.isNew ? (
                <>
                  Tamu baru dicatat: <strong>{lookup.name}</strong> (kuota{" "}
                  {lookup.reservedSeats} orang)
                </>
              ) : (
                <>
                  Ditemukan di daftar tamu: <strong>{lookup.name}</strong> (kuota{" "}
                  {lookup.reservedSeats} orang)
                </>
              )}
            </p>
          )}
        </div>
      )}

      {verified && (
        <div className="rounded-xl border border-inv bg-inv-surface p-5">
          <Label htmlFor="rsvp-email">Email (opsional)</Label>
          <Input
            id="rsvp-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            className="mt-1"
          />
        </div>
      )}

      {verified &&
        events.map((event) => (
          <div key={event.id} className="rounded-xl border border-inv bg-inv-surface p-5">
            <h4 className="font-medium text-inv-ink">{event.name}</h4>

            {done[event.id] ? (
              <p className="mt-2 text-sm text-green-700">
                Sudah dikonfirmasi
                {displayName ? ` — ${displayName}` : ""}:{" "}
                {status[event.id] === "CONFIRMED"
                  ? `Hadir (${pax[event.id] ?? 1} org)`
                  : status[event.id] === "DECLINED"
                    ? "Tidak hadir"
                    : "Mungkin"}
                ✓
              </p>
            ) : (
              <>
                {status[event.id] !== "DECLINED" && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label>Jumlah tamu (hadir)</Label>
                      <select
                        className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
                        value={pax[event.id] ?? 1}
                        onChange={(e) =>
                          setPax((p) => ({ ...p, [event.id]: Number(e.target.value) }))
                        }
                      >
                        {Array.from({ length: maxPaxForGuest }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n} orang
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Preferensi menu</Label>
                      <select
                        className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
                        value={mealPref[event.id] ?? ""}
                        onChange={(e) =>
                          setMealPref((m) => ({ ...m, [event.id]: e.target.value }))
                        }
                      >
                        {MEAL_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="inv-btn-primary"
                    disabled={loading === event.id}
                    onClick={() => submit(event.id, "CONFIRMED")}
                  >
                    Hadir
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="inv-btn-outline"
                    disabled={loading === event.id}
                    onClick={() => submit(event.id, "MAYBE")}
                  >
                    Mungkin
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="inv-btn-outline border-0"
                    disabled={loading === event.id}
                    onClick={() => submit(event.id, "DECLINED")}
                  >
                    Tidak hadir
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-700">{error}</p>
      )}
    </div>
  );
}
