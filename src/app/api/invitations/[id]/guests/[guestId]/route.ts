import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; guestId: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, guestId } = await params;
  const invitation = await prisma.invitation.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!invitation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.guest.deleteMany({
    where: { id: guestId, invitationId: id },
  });

  return NextResponse.json({ ok: true });
}
