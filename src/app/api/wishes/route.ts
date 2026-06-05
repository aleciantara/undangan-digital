import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { wishSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = wishSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const wish = await prisma.wish.create({ data: parsed.data });
  return NextResponse.json(wish, { status: 201 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const invitationId = searchParams.get("invitationId");
  if (!invitationId) return NextResponse.json({ error: "Missing invitationId" }, { status: 400 });

  const wishes = await prisma.wish.findMany({
    where: { invitationId, isApproved: true, isHidden: false },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(wishes);
}
