import {
  classifyOperaDashboardPhotos,
  resolveOperaMedia,
  type OperaPhotoSlotDef,
} from "@/lib/opera-media-core";

export type HimmelMediaPhoto = {
  id: string;
  url: string;
  caption: string | null;
};

const BASE = "/himmel";

function asset(filename: string) {
  return `${BASE}/${encodeURIComponent(filename)}`;
}

export const himmelAssets = {
  heroBg: asset("head-bg.jpg"),
  coupleBg: asset("bg-3.jpg"),
  accentBgs: [asset("bg-1.jpg"), asset("bg-2.jpg")] as const,
  footerBg: asset("bg-3.jpg"),
  groomPortrait: asset("himmel-solo.jpg"),
  bridePortrait: asset("frieren-solo.jpg"),
};

export const himmelDefaultCover = himmelAssets.heroBg;

const HIMMEL_KEYS = {
  groom: ["mempelai pria", "groom", "pria", "himmel"],
  bride: ["mempelai wanita", "bride", "wanita", "frieren"],
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
  accentBg: ["latar rsvp", "latar acara", "meadow", "flower field", "bunga"],
  footerBg: ["latar penutup", "latar footer", "footer", "penutup"],
  hero: ["latar hero", "hero", "sampul", "cover"],
};

export const himmelDefaultPhotos: HimmelMediaPhoto[] = [
  { id: "himmel-groom", url: himmelAssets.groomPortrait, caption: "Mempelai pria" },
  { id: "himmel-bride", url: himmelAssets.bridePortrait, caption: "Mempelai wanita" },
  { id: "himmel-couple-bg", url: himmelAssets.coupleBg, caption: "Pasangan" },
  { id: "himmel-bg-1", url: himmelAssets.accentBgs[0], caption: "Flower field" },
  { id: "himmel-bg-2", url: himmelAssets.accentBgs[1], caption: "Meadow" },
  { id: "himmel-footer-bg", url: himmelAssets.footerBg, caption: "Latar penutup" },
];

export type HimmelPhotoSlotId =
  | "hero"
  | "groom"
  | "bride"
  | "coupleBg"
  | "accentBg"
  | "footerBg"
  | "extra";

export const HIMMEL_PHOTO_SLOTS: OperaPhotoSlotDef[] = [
  {
    id: "hero",
    label: "Latar hero",
    hint: "Kosongkan untuk animasi bunga. Unggah portrait (HP) dan/atau landscape (desktop).",
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

export function classifyHimmelDashboardPhotos(
  photos: HimmelMediaPhoto[],
  coverPhotoUrl: string | null
) {
  return classifyOperaDashboardPhotos(photos, coverPhotoUrl, HIMMEL_KEYS);
}

export type HimmelHeroMode = "flowers" | "photo";

export function resolveHimmelMedia(invitation: {
  coverPhotoUrl?: string | null;
  photos: HimmelMediaPhoto[];
  landscapeBackdropFill?: boolean;
}) {
  const hasCustomPhotos = invitation.photos.length > 0;
  const resolved = resolveOperaMedia({
    coverPhotoUrl: invitation.coverPhotoUrl,
    photos: invitation.photos,
    keys: HIMMEL_KEYS,
    assets: himmelAssets,
    defaultPhotos: himmelDefaultPhotos,
    landscapeBackdropFill: invitation.landscapeBackdropFill,
  });

  const hasHeroPhoto =
    resolved.heroBg.hasPortrait ||
    resolved.heroBg.hasLandscape ||
    Boolean(invitation.coverPhotoUrl);

  return {
    ...resolved,
    heroMode: hasHeroPhoto ? ("photo" as const) : ("flowers" as const),
    heroBg: hasHeroPhoto ? resolved.heroBg : null,
    isPlaceholderMedia: !hasHeroPhoto && !hasCustomPhotos,
  };
}

export type { ResponsiveSlotMedia } from "@/lib/responsive-media";
