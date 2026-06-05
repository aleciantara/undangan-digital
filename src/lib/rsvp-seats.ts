import type { PrismaClient } from "@/generated/prisma/client";

/** Sum confirmed pax for an invitation, optionally excluding one RSVP row being updated. */
export async function getConfirmedPaxTotal(
  prisma: PrismaClient,
  invitationId: string,
  excludeRsvpId?: string
): Promise<number> {
  const rsvps = await prisma.rSVP.findMany({
    where: {
      status: "CONFIRMED",
      guest: { invitationId },
      ...(excludeRsvpId ? { id: { not: excludeRsvpId } } : {}),
    },
    select: { pax: true },
  });
  return rsvps.reduce((sum, r) => sum + r.pax, 0);
}
