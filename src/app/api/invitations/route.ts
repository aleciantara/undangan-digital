import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createInvitationSchema } from "@/lib/validations";
import { canCreateInvitation, canUsePremiumTemplates } from "@/lib/plans";
import { TEMPLATES } from "@/types";
import slugify from "slugify";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invitations = await prisma.invitation.findMany({
    where: { userId: session.user.id },
    include: { events: { orderBy: { order: "asc" } }, _count: { select: { guests: true, wishes: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invitations);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createInvitationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  const plan = session.user.plan ?? "FREE";

  const invitationCount = await prisma.invitation.count({
    where: { userId: session.user.id },
  });
  if (!canCreateInvitation(plan, invitationCount)) {
    return NextResponse.json(
      {
        error: "Batas undangan untuk paket Anda sudah tercapai. Upgrade paket di halaman Billing.",
      },
      { status: 403 }
    );
  }

  const template = TEMPLATES.find((t) => t.id === data.templateId);
  if (template?.isPremium && !canUsePremiumTemplates(plan)) {
    return NextResponse.json(
      { error: "Template premium memerlukan paket Pro atau Premium." },
      { status: 403 }
    );
  }

  const baseSlug = slugify(`${data.groomName}-${data.brideName}`, { lower: true, strict: true });

  // Ensure unique slug
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.invitation.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const invitation = await prisma.invitation.create({
    data: { ...data, slug, userId: session.user.id },
  });

  return NextResponse.json(invitation, { status: 201 });
}
