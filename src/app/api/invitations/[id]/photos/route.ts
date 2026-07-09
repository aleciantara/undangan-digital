import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { auth } from "@/lib/auth";
import { isMediaUploadAvailable, uploadMedia } from "@/lib/media-storage";
import { prisma } from "@/lib/prisma";

const MAX_PHOTOS = 32;
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isMediaUploadAvailable()) {
    return NextResponse.json(
      {
        error:
          "Penyimpanan foto belum tersedia. Gunakan Laragon/VPS (simpan lokal) atau konfigurasi R2 di .env.",
      },
      { status: 503 }
    );
  }

  const { id } = await params;
  const invitation = await prisma.invitation.findFirst({
    where: { id, userId: session.user.id },
    include: { _count: { select: { photos: true } } },
  });
  if (!invitation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (invitation._count.photos >= MAX_PHOTOS) {
    return NextResponse.json(
      { error: `Maksimal ${MAX_PHOTOS} foto per undangan.` },
      { status: 400 }
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File wajib diunggah." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Format tidak didukung. Gunakan JPEG, PNG, atau WebP." },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Ukuran file maksimal 5 MB." }, { status: 400 });
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const key = `invitations/${id}/photos/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  let url: string;
  try {
    url = await uploadMedia(key, buffer, file.type);
  } catch (err) {
    console.error("[photos] upload failed:", err);
    return NextResponse.json({ error: "Gagal mengunggah ke penyimpanan." }, { status: 500 });
  }

  const caption = String(form.get("caption") ?? "").trim() || null;
  const setCover = form.get("setCover") === "true";
  const order = invitation._count.photos;

  const photo = await prisma.photo.create({
    data: {
      invitationId: id,
      url,
      caption,
      order,
      uploadedBy: "couple",
    },
  });

  if (setCover) {
    await prisma.invitation.update({
      where: { id },
      data: { coverPhotoUrl: url },
    });
  }

  return NextResponse.json(photo, { status: 201 });
}
