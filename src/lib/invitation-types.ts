/** Serializable shapes passed from server components to client */

export type SerializedEvent = {
  id: string;
  name: string;
  nameEn: string | null;
  date: string;
  endTime: string | null;
  venue: string;
  address: string;
  mapsUrl: string | null;
  wazeUrl: string | null;
  dresscode: string | null;
  dresscodeColor: string | null;
  dresscodeAttire: string | null;
  notes: string | null;
  order: number;
};

export type SerializedWish = {
  id: string;
  guestName: string;
  message: string;
  emoji: string | null;
  createdAt: string;
};

export type SerializedPhoto = {
  id: string;
  url: string;
  caption: string | null;
};

export type SerializedGuestRsvp = {
  eventId: string;
  status: string;
  pax: number;
  mealPref: string | null;
  respondedAt?: string | null;
};

export type SerializedGuest = {
  id: string;
  name: string;
  token: string;
  phone: string | null;
  reservedSeats: number;
  rsvps: SerializedGuestRsvp[];
};

export type SerializedInvitation = {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  groomFullName: string | null;
  brideFullName: string | null;
  groomParents: string | null;
  brideParents: string | null;
  templateId: string;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  coverPhotoUrl: string | null;
  landscapeBackdropFill: boolean;
  loveStory: string | null;
  musicUrl: string | null;
  musicTitle: string | null;
  musicAutoplay: boolean;
  musicStartSec: number;
  opensAt: string | null;
  seatQuota: number | null;
  inviteVerseTitle: string | null;
  inviteVersePreset: string | null;
  inviteVerseText: string | null;
  prewedVideoUrl: string | null;
  prewedVideoTitle: string | null;
  liveStreamUrl: string | null;
  liveStreamTitle: string | null;
  giftEnabled: boolean;
  giftTitle: string | null;
  giftMessage: string | null;
  giftGroomAccountName: string | null;
  giftGroomBank: string | null;
  giftGroomAccountNumber: string | null;
  giftBrideAccountName: string | null;
  giftBrideBank: string | null;
  giftBrideAccountNumber: string | null;
  giftGroomAddressTitle: string | null;
  giftGroomAddressFull: string | null;
  giftBrideAddressTitle: string | null;
  giftBrideAddressFull: string | null;
  events: SerializedEvent[];
  wishes: SerializedWish[];
  photos: SerializedPhoto[];
};
