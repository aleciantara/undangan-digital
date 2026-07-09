import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ManageInvitation } from "@/components/dashboard/manage-invitation";

type Props = { params: Promise<{ id: string }> };

export default async function ManageInvitationPage({ params }: Props) {
  const session = await auth();
  const { id } = await params;

  const invitation = await prisma.invitation.findFirst({
    where: { id, userId: session!.user!.id },
    include: {
      events: { orderBy: { order: "asc" } },
      guests: { orderBy: { createdAt: "desc" } },
      photos: { orderBy: { order: "asc" } },
      _count: { select: { wishes: true } },
    },
  });

  if (!invitation) notFound();

  const rsvps = await prisma.rSVP.findMany({
    where: { guest: { invitationId: id } },
    select: { status: true },
  });

  const rsvpStats = {
    confirmed: rsvps.filter((r) => r.status === "CONFIRMED").length,
    declined: rsvps.filter((r) => r.status === "DECLINED").length,
    maybe: rsvps.filter((r) => r.status === "MAYBE").length,
    pending: rsvps.filter((r) => r.status === "PENDING").length,
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <ManageInvitation
      invitation={{
        id: invitation.id,
        slug: invitation.slug,
        groomName: invitation.groomName,
        brideName: invitation.brideName,
        groomFullName: invitation.groomFullName,
        brideFullName: invitation.brideFullName,
        groomParents: invitation.groomParents,
        brideParents: invitation.brideParents,
        loveStory: invitation.loveStory,
        isPublished: invitation.isPublished,
        opensAt: invitation.opensAt?.toISOString() ?? null,
        seatQuota: invitation.seatQuota,
        templateId: invitation.templateId,
        coverPhotoUrl: invitation.coverPhotoUrl,
        landscapeBackdropFill: invitation.landscapeBackdropFill ?? true,
        musicUrl: invitation.musicUrl,
        musicTitle: invitation.musicTitle,
        musicAutoplay: invitation.musicAutoplay,
        musicStartSec: invitation.musicStartSec,
        inviteVerseTitle: invitation.inviteVerseTitle,
        inviteVersePreset: invitation.inviteVersePreset,
        inviteVerseText: invitation.inviteVerseText,
        prewedVideoUrl: invitation.prewedVideoUrl,
        prewedVideoTitle: invitation.prewedVideoTitle,
        liveStreamUrl: invitation.liveStreamUrl,
        liveStreamTitle: invitation.liveStreamTitle,
        giftEnabled: invitation.giftEnabled,
        giftTitle: invitation.giftTitle,
        giftMessage: invitation.giftMessage,
        giftGroomAccountName: invitation.giftGroomAccountName,
        giftGroomBank: invitation.giftGroomBank,
        giftGroomAccountNumber: invitation.giftGroomAccountNumber,
        giftBrideAccountName: invitation.giftBrideAccountName,
        giftBrideBank: invitation.giftBrideBank,
        giftBrideAccountNumber: invitation.giftBrideAccountNumber,
        giftGroomAddressTitle: invitation.giftGroomAddressTitle,
        giftGroomAddressFull: invitation.giftGroomAddressFull,
        giftBrideAddressTitle: invitation.giftBrideAddressTitle,
        giftBrideAddressFull: invitation.giftBrideAddressFull,
        photos: invitation.photos.map((p) => ({
          id: p.id,
          url: p.url,
          caption: p.caption,
        })),
        events: invitation.events.map((e) => ({
          id: e.id,
          name: e.name,
          date: e.date.toISOString(),
          venue: e.venue,
          address: e.address,
          mapsUrl: e.mapsUrl,
          wazeUrl: e.wazeUrl,
          dresscodeColor: e.dresscodeColor,
          dresscodeAttire: e.dresscodeAttire,
          notes: e.notes,
        })),
        guests: invitation.guests.map((g) => ({
          id: g.id,
          name: g.name,
          token: g.token,
          phone: g.phone,
          reservedSeats: g.reservedSeats,
        })),
        _count: invitation._count,
      }}
      rsvpStats={rsvpStats}
      appUrl={appUrl}
      userPlan={session!.user!.plan ?? "FREE"}
    />
  );
}
