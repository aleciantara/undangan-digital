import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteFromR2, isR2Configured, keyFromPublicUrl } from "@/lib/r2";

type Params = { params: Promise<{ id: string; photoId: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, photoId } = await params;

  const invitation = await prisma.invitation.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!invitation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const photo = await prisma.photo.findFirst({
    where: { id: photoId, invitationId: id },
  });
  if (!photo) return NextResponse.json({ error: "Foto tidak ditemukan" }, { status: 404 });

  if (isR2Configured()) {
    const key = keyFromPublicUrl(photo.url);
    if (key) {
      try {
        await deleteFromR2(key);
      } catch {
        // Continue — DB record is source of truth for UI
      }
    }
  }

  await prisma.photo.delete({ where: { id: photoId } });

  if (invitation.coverPhotoUrl === photo.url) {
    const next = await prisma.photo.findFirst({
      where: { invitationId: id },
      orderBy: { order: "asc" },
    });
    await prisma.invitation.update({
      where: { id },
      data: { coverPhotoUrl: next?.url ?? null },
    });
  }

  return NextResponse.json({ ok: true });
}
