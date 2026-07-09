import {
  classifyOperaDashboardPhotos,
  resolveOperaMedia,
  type OperaPhotoSlotDef,
} from "@/lib/opera-media-core";

export type PhantomMediaPhoto = {
  id: string;
  url: string;
  caption: string | null;
};

const BASE = "/erik-christine";

function asset(filename: string) {
  return `${BASE}/${encodeURIComponent(filename)}`;
}

export const phantomAssets = {
  heroBg: asset("head-bg.jpg"),
  coupleBg: asset("erik-christine.jpg"),
  accentBgs: [asset("bg-1.jpg"), asset("bg-2.jpg")] as const,
  footerBg: asset("bg-3.jpg"),
  groomPortrait: asset("erik-solo.jpg"),
  bridePortrait: asset("christine-solo.jpg"),
};

export const phantomDefaultCover = phantomAssets.heroBg;

const PHANTOM_KEYS = {
  groom: ["mempelai pria", "groom", "pria", "erik"],
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

export const phantomDefaultPhotos: PhantomMediaPhoto[] = [
  { id: "phantom-groom", url: phantomAssets.groomPortrait, caption: "Mempelai pria" },
  { id: "phantom-bride", url: phantomAssets.bridePortrait, caption: "Mempelai wanita" },
  { id: "phantom-couple-bg", url: phantomAssets.coupleBg, caption: "Pasangan" },
  { id: "phantom-bg-1", url: phantomAssets.accentBgs[0], caption: "Opéra Garnier" },
  { id: "phantom-bg-2", url: phantomAssets.accentBgs[1], caption: "Masquerade" },
  { id: "phantom-footer-bg", url: phantomAssets.footerBg, caption: "Latar penutup" },
];

export type PhantomPhotoSlotId =
  | "hero"
  | "groom"
  | "bride"
  | "coupleBg"
  | "accentBg"
  | "footerBg"
  | "extra";

export const PHANTOM_PHOTO_SLOTS: OperaPhotoSlotDef[] = [
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

export function classifyPhantomDashboardPhotos(
  photos: PhantomMediaPhoto[],
  coverPhotoUrl: string | null
) {
  return classifyOperaDashboardPhotos(photos, coverPhotoUrl, PHANTOM_KEYS);
}

export function resolvePhantomMedia(invitation: {
  coverPhotoUrl?: string | null;
  photos: PhantomMediaPhoto[];
  landscapeBackdropFill?: boolean;
}) {
  return resolveOperaMedia({
    coverPhotoUrl: invitation.coverPhotoUrl,
    photos: invitation.photos,
    keys: PHANTOM_KEYS,
    assets: phantomAssets,
    defaultPhotos: phantomDefaultPhotos,
    landscapeBackdropFill: invitation.landscapeBackdropFill,
  });
}

export type { ResponsiveSlotMedia } from "@/lib/responsive-media";
