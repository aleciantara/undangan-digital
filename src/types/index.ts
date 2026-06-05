// Template definitions
export interface TemplateConfig {
  id: string;
  name: string;
  nameId: string;
  motif: "javanese" | "sundanese" | "batak" | "minang" | "betawi" | "modern" | "floral";
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  previewUrl: string;
  isPremium: boolean;
  region?: string;
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: "javanese-classic",
    name: "Javanese Classic",
    nameId: "Jawa Klasik",
    motif: "javanese",
    primaryColor: "#8B5E3C",
    accentColor: "#D4AF37",
    fontFamily: "playfair",
    previewUrl: "/templates/previews/javanese-classic.jpg",
    isPremium: false,
    region: "Jawa",
  },
  {
    id: "sundanese-floral",
    name: "Sundanese Floral",
    nameId: "Sunda Floral",
    motif: "sundanese",
    primaryColor: "#4A7C59",
    accentColor: "#F0C040",
    fontFamily: "cormorant",
    previewUrl: "/templates/previews/sundanese-floral.jpg",
    isPremium: false,
    region: "Sunda",
  },
  {
    id: "batak-ulos",
    name: "Batak Ulos",
    nameId: "Batak Ulos",
    motif: "batak",
    primaryColor: "#8B0000",
    accentColor: "#FFD700",
    fontFamily: "playfair",
    previewUrl: "/templates/previews/batak-ulos.jpg",
    isPremium: true,
    region: "Batak",
  },
  {
    id: "minang-songket",
    name: "Minang Songket",
    nameId: "Minang Songket",
    motif: "minang",
    primaryColor: "#722F37",
    accentColor: "#C5A028",
    fontFamily: "cormorant",
    previewUrl: "/templates/previews/minang-songket.jpg",
    isPremium: true,
    region: "Minang",
  },
  {
    id: "modern-elegant",
    name: "Modern Elegant",
    nameId: "Modern Elegan",
    motif: "modern",
    primaryColor: "#2C2C2C",
    accentColor: "#C9A96E",
    fontFamily: "inter",
    previewUrl: "/templates/previews/modern-elegant.jpg",
    isPremium: false,
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
