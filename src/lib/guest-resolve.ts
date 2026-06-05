import type { PrismaClient } from "@/generated/prisma/client";
import { normalizePhone, isValidIndonesianPhone } from "@/lib/phone";

export type GuestWithRsvps = {
  id: string;
  invitationId: string;
  name: string;
  phone: string | null;
  email: string | null;
  reservedSeats: number;
  token: string;
  rsvps: {
    eventId: string;
    status: string;
    pax: number;
    mealPref: string | null;
    respondedAt: Date | null;
  }[];
};

export async function findGuestByPhone(
  prisma: PrismaClient,
  invitationId: string,
  phone: string
): Promise<GuestWithRsvps | null> {
  const normalized = normalizePhone(phone);
  if (!normalized) return null;

  const guests = await prisma.guest.findMany({
    where: { invitationId, phone: { not: null } },
    include: { rsvps: true },
  });

  return guests.find((g) => g.phone && normalizePhone(g.phone) === normalized) ?? null;
}

/** Open RSVP: match by phone, or register a new guest on this invitation. */
export async function findOrCreateOpenGuest(
  prisma: PrismaClient,
  invitationId: string,
  guestName: string,
  guestPhone: string
): Promise<
  | { ok: true; guest: GuestWithRsvps; isNew: boolean }
  | { ok: false; error: string; status: number }
> {
  const name = guestName.trim();
  if (name.length < 2) {
    return { ok: false, error: "Nama minimal 2 karakter", status: 400 };
  }
  if (!isValidIndonesianPhone(guestPhone)) {
    return { ok: false, error: "Nomor WhatsApp tidak valid", status: 400 };
  }

  const invitation = await prisma.invitation.findFirst({
    where: { id: invitationId, isPublished: true },
  });
  if (!invitation) {
    return { ok: false, error: "Undangan tidak ditemukan", status: 404 };
  }

  const existing = await findGuestByPhone(prisma, invitationId, guestPhone);
  if (existing) {
    return { ok: true, guest: existing, isNew: false };
  }

  const guest = await prisma.guest.create({
    data: {
      invitationId,
      name,
      phone: guestPhone.trim(),
      reservedSeats: 1,
    },
    include: { rsvps: true },
  });

  return { ok: true, guest, isNew: true };
}

export function serializeGuestForClient(guest: GuestWithRsvps) {
  return {
    id: guest.id,
    name: guest.name,
    phone: guest.phone,
    reservedSeats: guest.reservedSeats,
    token: guest.token,
    rsvps: guest.rsvps.map((r) => ({
      eventId: r.eventId,
      status: r.status,
      pax: r.pax,
      mealPref: r.mealPref,
      respondedAt: r.respondedAt?.toISOString() ?? null,
    })),
  };
}
