import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rsvpSchema } from "@/lib/validations";
import { isValidIndonesianPhone } from "@/lib/phone";
import { getConfirmedPaxTotal } from "@/lib/rsvp-seats";
import { isInvitationOpen } from "@/lib/invitation-access";
import { findGuestByPhone, findOrCreateOpenGuest } from "@/lib/guest-resolve";

export const runtime = "nodejs";

async function resolveGuest(
  guestToken: string | undefined,
  invitationId: string | undefined,
  guestPhone: string | undefined,
  guestName: string | undefined
) {
  if (guestToken) {
    return prisma.guest.findUnique({
      where: { token: guestToken },
      include: { rsvps: true },
    });
  }

  if (!invitationId || !guestPhone?.trim()) return null;
  if (!isValidIndonesianPhone(guestPhone)) return null;

  const existing = await findGuestByPhone(prisma, invitationId, guestPhone);
  if (existing) return existing;

  if (!guestName?.trim()) return null;

  const created = await findOrCreateOpenGuest(
    prisma,
    invitationId,
    guestName,
    guestPhone
  );
  return created.ok ? created.guest : null;
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Data RSVP tidak valid";
    return NextResponse.json({ error: first }, { status: 400 });
  }

  const {
    guestToken,
    invitationId,
    guestPhone,
    guestName,
    eventId,
    status,
    pax,
    mealPref,
    email,
  } = parsed.data;

  const guest = await resolveGuest(guestToken, invitationId, guestPhone, guestName);
  if (!guest) {
    return NextResponse.json({ error: "Tamu tidak ditemukan" }, { status: 404 });
  }

  const invitationForAccess = await prisma.invitation.findUnique({
    where: { id: guest.invitationId },
  });
  if (!invitationForAccess || !isInvitationOpen(invitationForAccess)) {
    return NextResponse.json({ error: "Undangan belum dibuka" }, { status: 403 });
  }

  if (email?.trim()) {
    await prisma.guest.update({
      where: { id: guest.id },
      data: { email: email.trim() },
    });
  }

  const event = await prisma.weddingEvent.findFirst({
    where: { id: eventId, invitationId: guest.invitationId },
  });
  if (!event) {
    return NextResponse.json({ error: "Acara tidak ditemukan" }, { status: 404 });
  }

  const existing = await prisma.rSVP.findUnique({
    where: { guestId_eventId: { guestId: guest.id, eventId } },
  });

  if (existing?.respondedAt && existing.status === status && existing.pax === pax) {
    return NextResponse.json(
      { error: "Anda sudah mengonfirmasi acara ini. Tidak perlu mengisi ulang." },
      { status: 409 }
    );
  }

  if (status === "CONFIRMED") {
    if (pax > guest.reservedSeats) {
      return NextResponse.json(
        {
          error: `Kuota kursi untuk nama ini: ${guest.reservedSeats} orang. Kurangi jumlah tamu.`,
        },
        { status: 400 }
      );
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id: guest.invitationId },
    });

    if (invitation?.seatQuota != null) {
      const currentTotal = await getConfirmedPaxTotal(
        prisma,
        guest.invitationId,
        existing?.id
      );
      if (currentTotal + pax > invitation.seatQuota) {
        const sisa = Math.max(0, invitation.seatQuota - currentTotal);
        return NextResponse.json(
          {
            error: `Kuota undangan tersisa ${sisa} kursi. Tidak dapat menambah ${pax} tamu.`,
          },
          { status: 400 }
        );
      }
    }
  }

  const rsvp = await prisma.rSVP.upsert({
    where: { guestId_eventId: { guestId: guest.id, eventId } },
    update: {
      status,
      pax: status === "CONFIRMED" ? pax : 0,
      mealPref: mealPref || null,
      message: null,
      respondedAt: new Date(),
    },
    create: {
      guestId: guest.id,
      eventId,
      status,
      pax: status === "CONFIRMED" ? pax : 0,
      mealPref: mealPref || null,
      respondedAt: new Date(),
    },
  });

  return NextResponse.json({
    ...rsvp,
    guestToken: guest.token,
    guestName: guest.name,
  });
}
