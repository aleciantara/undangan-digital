import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getConfirmedPaxTotal } from "@/lib/rsvp-seats";
import {
  findOrCreateOpenGuest,
  serializeGuestForClient,
} from "@/lib/guest-resolve";

export const runtime = "nodejs";

const identifySchema = z.object({
  invitationId: z.string().min(1),
  guestName: z.string().min(2, "Nama minimal 2 karakter"),
  guestPhone: z.string().min(9, "Nomor WhatsApp wajib diisi"),
});

export async function POST(req: Request) {
  const parsed = identifySchema.safeParse(await req.json());
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Data tidak valid";
    return NextResponse.json({ error: first }, { status: 400 });
  }

  const { invitationId, guestName, guestPhone } = parsed.data;
  const result = await findOrCreateOpenGuest(
    prisma,
    invitationId,
    guestName,
    guestPhone
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
  });
  const confirmedTotal = await getConfirmedPaxTotal(prisma, invitationId);
  const seatQuota = invitation?.seatQuota ?? null;
  const seatsRemaining =
    seatQuota != null ? Math.max(0, seatQuota - confirmedTotal) : null;

  return NextResponse.json({
    found: true,
    isNew: result.isNew,
    guest: serializeGuestForClient(result.guest),
    seatQuota,
    seatsRemaining,
    confirmedTotal,
  });
}
