import {
  classifyOperaDashboardPhotos,
  resolveOperaMedia,
  type OperaPhotoSlotDef,
} from "@/lib/opera-media-core";

export type RaoulMediaPhoto = {
  id: string;
  url: string;
  caption: string | null;
};

const BASE = "/raoul-christine";

function asset(filename: string) {
  return `${BASE}/${encodeURIComponent(filename)}`;
}

export const raoulAssets = {
  heroBg: asset("head-bg.jpg"),
  coupleBg: asset("raoul-christine.jpg"),
  accentBgs: [asset("bg-1.jpg"), asset("bg-2.jpg")] as const,
  footerBg: asset("bg-3.jpg"),
  groomPortrait: asset("raoul-solo.jpg"),
  bridePortrait: asset("christine-solo.jpg"),
};

export const raoulDefaultCover = raoulAssets.heroBg;

const RAOUL_KEYS = {
  groom: ["mempelai pria", "groom", "pria", "raoul"],
  bride: ["mempelai wanita", "bride", "wanita", "christine"],
  coupleBg: [
    "latar kutipan",
    "latar isi",
    "pasangan",
    "couple",
    "berdua",
    "pre-wedding",
    "prewedding",
    "together",
  ],
  accentBg: ["latar rsvp", "latar acara", "opéra garnier", "opera garnier", "masquerade"],
  footerBg: ["latar penutup", "latar footer", "footer", "penutup"],
  hero: ["latar hero", "hero", "sampul", "cover"],
};

export const raoulDefaultPhotos: RaoulMediaPhoto[] = [
  { id: "raoul-groom", url: raoulAssets.groomPortrait, caption: "Mempelai pria" },
  { id: "raoul-bride", url: raoulAssets.bridePortrait, caption: "Mempelai wanita" },
  { id: "raoul-couple-bg", url: raoulAssets.coupleBg, caption: "Pasangan" },
  { id: "raoul-bg-1", url: raoulAssets.accentBgs[0], caption: "Opéra Garnier" },
  { id: "raoul-bg-2", url: raoulAssets.accentBgs[1], caption: "Morning light" },
  { id: "raoul-footer-bg", url: raoulAssets.footerBg, caption: "Latar penutup" },
];

export type RaoulPhotoSlotId =
  | "hero"
  | "groom"
  | "bride"
  | "coupleBg"
  | "accentBg"
  | "footerBg"
  | "extra";

export const RAOUL_PHOTO_SLOTS: OperaPhotoSlotDef[] = [
  {
    id: "hero",
    label: "Latar hero",
    hint: "Bagian pembuka undangan. Unggah portrait untuk HP dan landscape untuk layar lebar desktop.",
    caption: "Latar hero",
    setCover: true,
  },
  {
    id: "groom",
    label: "Mempelai pria",
    hint: "Foto mempelai pria di bagian mempelai.",
    caption: "Mempelai pria",
  },
  {
    id: "bride",
    label: "Mempelai wanita",
    hint: "Foto mempelai wanita di bagian mempelai.",
    caption: "Mempelai wanita",
  },
  {
    id: "coupleBg",
    label: "Latar kutipan & countdown",
    hint: "Foto latar di balik kutipan, ayat undangan, dan countdown.",
    caption: "Latar kutipan",
  },
  {
    id: "accentBg",
    label: "Latar konfirmasi kehadiran",
    hint: "Foto latar di balik bagian RSVP / konfirmasi kehadiran.",
    caption: "Latar RSVP",
  },
  {
    id: "footerBg",
    label: "Latar penutup",
    hint: "Foto latar di bagian penutup — nama mempelai & ucapan terima kasih.",
    caption: "Latar penutup",
  },
];

export function classifyRaoulDashboardPhotos(
  photos: RaoulMediaPhoto[],
  coverPhotoUrl: string | null
) {
  return classifyOperaDashboardPhotos(photos, coverPhotoUrl, RAOUL_KEYS);
}

export function resolveRaoulMedia(invitation: {
  coverPhotoUrl?: string | null;
  photos: RaoulMediaPhoto[];
  landscapeBackdropFill?: boolean;
}) {
  return resolveOperaMedia({
    coverPhotoUrl: invitation.coverPhotoUrl,
    photos: invitation.photos,
    keys: RAOUL_KEYS,
    assets: raoulAssets,
    defaultPhotos: raoulDefaultPhotos,
    landscapeBackdropFill: invitation.landscapeBackdropFill,
  });
}

export type { ResponsiveSlotMedia } from "@/lib/responsive-media";
