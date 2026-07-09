// Template definitions
export interface TemplateConfig {
  id: string;
  name: string;
  nameId: string;
  motif: "modern";
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  previewUrl: string;
  isPremium: boolean;
  region?: string;
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: "phantom-opera",
    name: "Erik & Christine — Night",
    nameId: "Erik & Christine",
    motif: "modern",
    primaryColor: "#1A0F14",
    accentColor: "#A4163A",
    fontFamily: "cormorant",
    previewUrl: "/erik-christine/head-bg.jpg",
    isPremium: false,
    region: "Phantom of the Opera",
  },
  {
    id: "phantom-opera-daylight",
    name: "Raoul & Christine — Daylight",
    nameId: "Raoul & Christine",
    motif: "modern",
    primaryColor: "#F5F0E8",
    accentColor: "#B8860B",
    fontFamily: "cormorant",
    previewUrl: "/raoul-christine/head-bg.jpg",
    isPremium: false,
    region: "Phantom of the Opera",
  },
  {
    id: "himmel-frieren",
    name: "Himmel & Frieren",
    nameId: "Himmel & Frieren",
    motif: "modern",
    primaryColor: "#1A2F4A",
    accentColor: "#4A7FD4",
    fontFamily: "cormorant",
    previewUrl: "/himmel/head-bg.jpg",
    isPremium: false,
    region: "Frieren: Beyond Journey's End",
  },
  {
    id: "golden-javanese",
    name: "Golden Javanese",
    nameId: "Golden Javanese",
    motif: "modern",
    primaryColor: "#5C4033",
    accentColor: "#D4AF37",
    fontFamily: "playfair",
    previewUrl: "/erik-christine/head-bg.jpg",
    isPremium: true,
    region: "Premium",
  },
];

export const EVENT_TYPES = [
  { value: "akad_nikah",  label: "Akad Nikah",   labelEn: "Wedding Ceremony" },
  { value: "resepsi",     label: "Resepsi",       labelEn: "Wedding Reception" },
  { value: "siraman",     label: "Siraman",       labelEn: "Siraman Ceremony" },
  { value: "midodareni",  label: "Midodareni",    labelEn: "Midodareni Night" },
  { value: "pengajian",   label: "Pengajian",     labelEn: "Pengajian" },
  { value: "lamaran",     label: "Lamaran",       labelEn: "Engagement" },
  { value: "other",       label: "Lainnya",       labelEn: "Other" },
] as const;

// DB entity types (mirrors Prisma schema)
export type RSVPStatus = "PENDING" | "CONFIRMED" | "DECLINED" | "MAYBE";

export interface DbUser {
  id: string; name: string | null; email: string; image: string | null; createdAt: Date;
}
export interface DbInvitation {
  id: string; slug: string; userId: string;
  groomName: string; brideName: string; groomFullName?: string | null; brideFullName?: string | null;
  groomParents?: string | null; brideParents?: string | null;
  templateId: string; primaryColor: string; accentColor: string; fontFamily: string;
  coverPhotoUrl?: string | null; musicUrl?: string | null; musicTitle?: string | null;
  musicAutoplay: boolean; loveStory?: string | null;
  isPublished: boolean; publishedAt?: Date | null; opensAt?: Date | null;
  createdAt: Date; updatedAt: Date;
}
export interface DbWeddingEvent {
  id: string; invitationId: string; name: string; nameEn?: string | null;
  date: Date; endTime?: Date | null; venue: string; address: string;
  mapsUrl?: string | null; wazeUrl?: string | null;
  dresscode?: string | null; notes?: string | null; order: number;
}
export interface DbGuest {
  id: string; invitationId: string; name: string;
  phone?: string | null; email?: string | null; token: string;
  isVip: boolean; tableNumber?: string | null; notes?: string | null; createdAt: Date;
}
export interface DbRSVP {
  id: string; guestId: string; eventId: string;
  status: RSVPStatus; pax: number; mealPref?: string | null;
  message?: string | null; respondedAt?: Date | null; createdAt: Date; updatedAt: Date;
}
export interface DbWish {
  id: string; invitationId: string; guestName: string;
  message: string; isApproved: boolean; isHidden: boolean;
  emoji?: string | null; createdAt: Date;
}
export interface DbPhoto {
  id: string; invitationId: string; url: string;
  caption?: string | null; order: number; uploadedBy?: string | null; createdAt: Date;
}

export type InvitationWithRelations = DbInvitation & {
  events: DbWeddingEvent[];
  wishes: DbWish[];
  photos: DbPhoto[];
  guests: DbGuest[];
};
