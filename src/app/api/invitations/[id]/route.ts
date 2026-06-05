import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const invitation = await prisma.invitation.findFirst({
    where: { id, userId: session.user.id },
    include: {
      events: { orderBy: { order: "asc" } },
      guests: { orderBy: { createdAt: "desc" } },
      _count: { select: { wishes: true } },
    },
  });

  if (!invitation) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(invitation);
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.invitation.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (body.isPublished === true && !existing.isPublished) {
    const eventCount = await prisma.weddingEvent.count({ where: { invitationId: id } });
    if (eventCount === 0) {
      return NextResponse.json(
        { error: "Tambahkan minimal satu acara sebelum menerbitkan undangan." },
        { status: 400 }
      );
    }
  }

  const invitation = await prisma.invitation.update({
    where: { id },
    data: {
      isPublished: body.isPublished ?? existing.isPublished,
      publishedAt: body.isPublished ? new Date() : existing.publishedAt,
      loveStory: body.loveStory ?? existing.loveStory,
      seatQuota:
        body.seatQuota !== undefined
          ? body.seatQuota === null || body.seatQuota === ""
            ? null
            : Number(body.seatQuota)
          : existing.seatQuota,
    },
  });

  return NextResponse.json(invitation);
}
