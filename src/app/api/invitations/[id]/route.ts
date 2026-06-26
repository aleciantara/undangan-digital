import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateInvitationSchema } from "@/lib/validations";

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
      photos: { orderBy: { order: "asc" } },
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

  const parsed = updateInvitationSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const first = Object.values(fieldErrors).flat()[0] ?? "Data tidak valid";
    return NextResponse.json({ error: first, fields: fieldErrors }, { status: 400 });
  }

  const data = parsed.data;

  const existing = await prisma.invitation.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (data.isPublished === true && !existing.isPublished) {
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
      groomName: data.groomName ?? existing.groomName,
      brideName: data.brideName ?? existing.brideName,
      groomFullName:
        data.groomFullName !== undefined ? data.groomFullName : existing.groomFullName,
      brideFullName:
        data.brideFullName !== undefined ? data.brideFullName : existing.brideFullName,
      groomParents: data.groomParents !== undefined ? data.groomParents : existing.groomParents,
      brideParents: data.brideParents !== undefined ? data.brideParents : existing.brideParents,
      templateId: data.templateId ?? existing.templateId,
      primaryColor: data.primaryColor ?? existing.primaryColor,
      accentColor: data.accentColor ?? existing.accentColor,
      fontFamily: data.fontFamily ?? existing.fontFamily,
      isPublished: data.isPublished ?? existing.isPublished,
      publishedAt:
        data.isPublished === true && !existing.isPublished
          ? new Date()
          : data.isPublished === false
            ? null
            : existing.publishedAt,
      loveStory: data.loveStory !== undefined ? data.loveStory : existing.loveStory,
      seatQuota:
        data.seatQuota !== undefined
          ? data.seatQuota === null || data.seatQuota === ""
            ? null
            : Number(data.seatQuota)
          : existing.seatQuota,
      musicUrl: data.musicUrl !== undefined ? (data.musicUrl ?? null) : existing.musicUrl,
      musicTitle: data.musicTitle !== undefined ? data.musicTitle : existing.musicTitle,
      musicAutoplay: data.musicAutoplay ?? existing.musicAutoplay,
      musicStartSec: data.musicStartSec ?? existing.musicStartSec,
      coverPhotoUrl:
        data.coverPhotoUrl !== undefined ? (data.coverPhotoUrl ?? null) : existing.coverPhotoUrl,
      opensAt: data.opensAt !== undefined ? data.opensAt : existing.opensAt,
    },
  });

  return NextResponse.json(invitation);
}
