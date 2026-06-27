import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasBodyKey } from "@/lib/api-errors";
import { normalizeGiftFields } from "@/lib/gift-types";
import { prisma } from "@/lib/prisma";
import { updateInvitationSchema } from "@/lib/validations";
import type { Prisma } from "@/generated/prisma/client";

type Params = { params: Promise<{ id: string }> };

const GIFT_DETAIL_KEYS = [
  "giftGroomAccountName",
  "giftGroomBank",
  "giftGroomAccountNumber",
  "giftBrideAccountName",
  "giftBrideBank",
  "giftBrideAccountNumber",
  "giftGroomAddressTitle",
  "giftGroomAddressFull",
  "giftBrideAddressTitle",
  "giftBrideAddressFull",
] as const;

function buildInvitationUpdate(
  body: Record<string, unknown>,
  data: ReturnType<typeof updateInvitationSchema.parse>,
  existing: NonNullable<Awaited<ReturnType<typeof prisma.invitation.findFirst>>>
): Prisma.InvitationUpdateInput {
  const update: Prisma.InvitationUpdateInput = {};

  if (hasBodyKey(body, "groomName")) update.groomName = data.groomName ?? existing.groomName;
  if (hasBodyKey(body, "brideName")) update.brideName = data.brideName ?? existing.brideName;
  if (hasBodyKey(body, "groomFullName")) update.groomFullName = data.groomFullName ?? null;
  if (hasBodyKey(body, "brideFullName")) update.brideFullName = data.brideFullName ?? null;
  if (hasBodyKey(body, "groomParents")) update.groomParents = data.groomParents ?? null;
  if (hasBodyKey(body, "brideParents")) update.brideParents = data.brideParents ?? null;
  if (hasBodyKey(body, "templateId")) update.templateId = data.templateId ?? existing.templateId;
  if (hasBodyKey(body, "primaryColor")) update.primaryColor = data.primaryColor ?? existing.primaryColor;
  if (hasBodyKey(body, "accentColor")) update.accentColor = data.accentColor ?? existing.accentColor;
  if (hasBodyKey(body, "fontFamily")) update.fontFamily = data.fontFamily ?? existing.fontFamily;
  if (hasBodyKey(body, "loveStory")) update.loveStory = data.loveStory ?? null;

  if (hasBodyKey(body, "isPublished")) {
    update.isPublished = data.isPublished ?? existing.isPublished;
    if (data.isPublished === true && !existing.isPublished) {
      update.publishedAt = new Date();
    } else if (data.isPublished === false) {
      update.publishedAt = null;
    }
  }

  if (hasBodyKey(body, "seatQuota")) {
    update.seatQuota =
      data.seatQuota === null || data.seatQuota === "" ? null : Number(data.seatQuota);
  }

  if (hasBodyKey(body, "musicUrl")) update.musicUrl = data.musicUrl ?? null;
  if (hasBodyKey(body, "musicTitle")) update.musicTitle = data.musicTitle ?? null;
  if (hasBodyKey(body, "musicAutoplay")) update.musicAutoplay = data.musicAutoplay ?? false;
  if (hasBodyKey(body, "musicStartSec")) update.musicStartSec = data.musicStartSec ?? 0;
  if (hasBodyKey(body, "coverPhotoUrl")) update.coverPhotoUrl = data.coverPhotoUrl ?? null;
  if (hasBodyKey(body, "opensAt")) update.opensAt = data.opensAt ?? null;

  if (hasBodyKey(body, "inviteVerseTitle")) update.inviteVerseTitle = data.inviteVerseTitle ?? null;
  if (hasBodyKey(body, "inviteVersePreset")) {
    update.inviteVersePreset = data.inviteVersePreset ?? existing.inviteVersePreset;
  }
  if (hasBodyKey(body, "inviteVerseText")) update.inviteVerseText = data.inviteVerseText ?? null;

  if (hasBodyKey(body, "prewedVideoUrl")) update.prewedVideoUrl = data.prewedVideoUrl ?? null;
  if (hasBodyKey(body, "prewedVideoTitle")) update.prewedVideoTitle = data.prewedVideoTitle ?? null;
  if (hasBodyKey(body, "liveStreamUrl")) update.liveStreamUrl = data.liveStreamUrl ?? null;
  if (hasBodyKey(body, "liveStreamTitle")) update.liveStreamTitle = data.liveStreamTitle ?? null;

  if (hasBodyKey(body, "giftEnabled")) update.giftEnabled = data.giftEnabled ?? false;
  if (hasBodyKey(body, "giftTitle")) update.giftTitle = data.giftTitle ?? null;
  if (hasBodyKey(body, "giftMessage")) update.giftMessage = data.giftMessage ?? null;

  if (GIFT_DETAIL_KEYS.some((key) => hasBodyKey(body, key))) {
    Object.assign(
      update,
      normalizeGiftFields({
        giftGroomAccountName: hasBodyKey(body, "giftGroomAccountName")
          ? (body.giftGroomAccountName as string)
          : existing.giftGroomAccountName,
        giftGroomBank: hasBodyKey(body, "giftGroomBank")
          ? (body.giftGroomBank as string)
          : existing.giftGroomBank,
        giftGroomAccountNumber: hasBodyKey(body, "giftGroomAccountNumber")
          ? (body.giftGroomAccountNumber as string)
          : existing.giftGroomAccountNumber,
        giftBrideAccountName: hasBodyKey(body, "giftBrideAccountName")
          ? (body.giftBrideAccountName as string)
          : existing.giftBrideAccountName,
        giftBrideBank: hasBodyKey(body, "giftBrideBank")
          ? (body.giftBrideBank as string)
          : existing.giftBrideBank,
        giftBrideAccountNumber: hasBodyKey(body, "giftBrideAccountNumber")
          ? (body.giftBrideAccountNumber as string)
          : existing.giftBrideAccountNumber,
        giftGroomAddressTitle: hasBodyKey(body, "giftGroomAddressTitle")
          ? (body.giftGroomAddressTitle as string)
          : existing.giftGroomAddressTitle,
        giftGroomAddressFull: hasBodyKey(body, "giftGroomAddressFull")
          ? (body.giftGroomAddressFull as string)
          : existing.giftGroomAddressFull,
        giftBrideAddressTitle: hasBodyKey(body, "giftBrideAddressTitle")
          ? (body.giftBrideAddressTitle as string)
          : existing.giftBrideAddressTitle,
        giftBrideAddressFull: hasBodyKey(body, "giftBrideAddressFull")
          ? (body.giftBrideAddressFull as string)
          : existing.giftBrideAddressFull,
      })
    );
  }

  return update;
}

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

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body permintaan tidak valid." }, { status: 400 });
  }

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

  const updateData = buildInvitationUpdate(body, data, existing);
  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "Tidak ada data untuk disimpan." }, { status: 400 });
  }

  try {
    const invitation = await prisma.invitation.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(invitation);
  } catch (err) {
    console.error("PATCH /api/invitations/[id] failed:", err);
    const message =
      err instanceof Error
        ? err.message
        : "Gagal menyimpan undangan. Restart server dev lalu coba lagi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
