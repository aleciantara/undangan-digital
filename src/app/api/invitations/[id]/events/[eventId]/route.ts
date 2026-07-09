import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createEventSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string; eventId: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, eventId } = await params;
  const invitation = await prisma.invitation.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!invitation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const existing = await prisma.weddingEvent.findFirst({
    where: { id: eventId, invitationId: id },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = createEventSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const first = Object.values(fieldErrors).flat()[0] ?? "Data acara tidak valid";
    return NextResponse.json({ error: first, fields: fieldErrors }, { status: 400 });
  }

  const event = await prisma.weddingEvent.update({
    where: { id: eventId },
    data: {
      name: parsed.data.name,
      nameEn: parsed.data.nameEn,
      date: new Date(parsed.data.date),
      endTime: parsed.data.endTime ? new Date(parsed.data.endTime) : null,
      venue: parsed.data.venue,
      address: parsed.data.address,
      mapsUrl: parsed.data.mapsUrl || null,
      wazeUrl: parsed.data.wazeUrl || null,
      dresscode: parsed.data.dresscode,
      dresscodeColor: parsed.data.dresscodeColor || null,
      dresscodeAttire: parsed.data.dresscodeAttire || null,
      notes: parsed.data.notes,
    },
  });

  return NextResponse.json(event);
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, eventId } = await params;
  const invitation = await prisma.invitation.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!invitation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.weddingEvent.deleteMany({
    where: { id: eventId, invitationId: id },
  });

  return NextResponse.json({ ok: true });
}