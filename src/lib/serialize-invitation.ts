import type { SerializedGuest, SerializedInvitation } from "@/lib/invitation-types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeInvitation(invitation: any): SerializedInvitation {
  return {
    id: invitation.id,
    slug: invitation.slug,
    groomName: invitation.groomName,
    brideName: invitation.brideName,
    groomFullName: invitation.groomFullName,
    brideFullName: invitation.brideFullName,
    groomParents: invitation.groomParents,
    brideParents: invitation.brideParents,
    templateId: invitation.templateId,
    primaryColor: invitation.primaryColor,
    accentColor: invitation.accentColor,
    fontFamily: invitation.fontFamily,
    coverPhotoUrl: invitation.coverPhotoUrl,
    loveStory: invitation.loveStory,
    musicUrl: invitation.musicUrl,
    musicTitle: invitation.musicTitle ?? null,
    musicAutoplay: invitation.musicAutoplay ?? true,
    musicStartSec: invitation.musicStartSec ?? 0,
    opensAt: invitation.opensAt ? new Date(invitation.opensAt).toISOString() : null,
    seatQuota: invitation.seatQuota ?? null,
    inviteVerseTitle: invitation.inviteVerseTitle ?? null,
    inviteVersePreset: invitation.inviteVersePreset ?? "islam",
    inviteVerseText: invitation.inviteVerseText ?? null,
    prewedVideoUrl: invitation.prewedVideoUrl ?? null,
    prewedVideoTitle: invitation.prewedVideoTitle ?? null,
    liveStreamUrl: invitation.liveStreamUrl ?? null,
    liveStreamTitle: invitation.liveStreamTitle ?? null,
    giftEnabled: invitation.giftEnabled ?? false,
    giftTitle: invitation.giftTitle ?? null,
    giftMessage: invitation.giftMessage ?? null,
    giftGroomAccountName: invitation.giftGroomAccountName ?? null,
    giftGroomBank: invitation.giftGroomBank ?? null,
    giftGroomAccountNumber: invitation.giftGroomAccountNumber ?? null,
    giftBrideAccountName: invitation.giftBrideAccountName ?? null,
    giftBrideBank: invitation.giftBrideBank ?? null,
    giftBrideAccountNumber: invitation.giftBrideAccountNumber ?? null,
    giftGroomAddressTitle: invitation.giftGroomAddressTitle ?? null,
    giftGroomAddressFull: invitation.giftGroomAddressFull ?? null,
    giftBrideAddressTitle: invitation.giftBrideAddressTitle ?? null,
    giftBrideAddressFull: invitation.giftBrideAddressFull ?? null,
    events: invitation.events.map((e: { date: Date; endTime: Date | null; [k: string]: unknown }) => ({
      ...e,
      date: new Date(e.date).toISOString(),
      endTime: e.endTime ? new Date(e.endTime).toISOString() : null,
    })),
    wishes: invitation.wishes.map((w: { createdAt: Date; [k: string]: unknown }) => ({
      ...w,
      createdAt: new Date(w.createdAt).toISOString(),
    })),
    photos: invitation.photos,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeGuest(guest: any): SerializedGuest {
  return {
    id: guest.id,
    name: guest.name,
    token: guest.token,
    phone: guest.phone ?? null,
    reservedSeats: guest.reservedSeats ?? 1,
    rsvps: guest.rsvps.map(
      (r: {
        eventId: string;
        status: string;
        pax: number;
        mealPref: string | null;
        respondedAt: Date | null;
      }) => ({
        eventId: r.eventId,
        status: r.status,
        pax: r.pax,
        mealPref: r.mealPref,
        respondedAt: r.respondedAt?.toISOString() ?? null,
      })
    ),
  };
}
