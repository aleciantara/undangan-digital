import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { invitationId, guestToken } = await req.json();
  if (!invitationId) return NextResponse.json({ ok: false });

  const guest = guestToken
    ? await prisma.guest.findUnique({ where: { token: guestToken } })
    : null;

  await prisma.openLog.create({
    data: {
      invitationId,
      guestId: guest?.id,
      userAgent: req.headers.get("user-agent") ?? undefined,
    },
  });

  return NextResponse.json({ ok: true });
}
