import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAddGuest } from "@/lib/plans";
import { z } from "zod";

const guestSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  phone: z.string().min(9, "Nomor WhatsApp wajib untuk verifikasi RSVP"),
  email: z.string().email().optional().or(z.literal("")),
  reservedSeats: z.coerce.number().min(1).max(20).default(2),
});

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const invitation = await prisma.invitation.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!invitation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = guestSchema.safeParse(await req.json());
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const first = Object.values(fieldErrors).flat()[0] ?? "Data tamu tidak valid";
    return NextResponse.json({ error: first, fields: fieldErrors }, { status: 400 });
  }

  const plan = session.user.plan ?? "FREE";
  const guestCount = await prisma.guest.count({ where: { invitationId: id } });
  if (!canAddGuest(plan, guestCount)) {
    return NextResponse.json(
      {
        error: "Batas tamu untuk paket Anda sudah tercapai. Upgrade paket di halaman Billing.",
      },
      { status: 403 }
    );
  }

  const guest = await prisma.guest.create({
    data: {
      invitationId: id,
      name: parsed.data.name.trim(),
      phone: parsed.data.phone.trim(),
      email: parsed.data.email?.trim() || null,
      reservedSeats: parsed.data.reservedSeats,
    },
  });

  return NextResponse.json(guest, { status: 201 });
}
