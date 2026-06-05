import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createEventSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const invitation = await prisma.invitation.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!invitation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = createEventSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const first =
      Object.values(fieldErrors).flat()[0] ?? "Data acara tidak valid";
    return NextResponse.json({ error: first, fields: fieldErrors }, { status: 400 });
  }

  const count = await prisma.weddingEvent.count({ where: { invitationId: id } });
  const event = await prisma.weddingEvent.create({
    data: {
      invitationId: id,
      name: parsed.data.name,
      nameEn: parsed.data.nameEn,
      date: new Date(parsed.data.date),
      endTime: parsed.data.endTime ? new Date(parsed.data.endTime) : null,
      venue: parsed.data.venue,
      address: parsed.data.address,
      mapsUrl: parsed.data.mapsUrl || null,
      wazeUrl: parsed.data.wazeUrl || null,
      dresscode: parsed.data.dresscode,
      notes: parsed.data.notes,
      order: parsed.data.order ?? count,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
