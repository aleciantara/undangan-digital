export type PhantomMediaPhoto = {
  id: string;
  url: string;
  caption: string | null;
};

const BASE = "/erik-christine";

function asset(filename: string) {
  return `${BASE}/${encodeURIComponent(filename)}`;
}

/** Theme defaults — Erik & Christine Phantom Opera set */
export const phantomAssets = {
  heroBg: asset("head-bg.jpg"),
  /** Together scene — ambient bg only, not shown as a portrait card */
  coupleBg: asset("erik-christine.jpg"),
  accentBgs: [asset("bg-1.jpg"), asset("bg-2.jpg")] as const,
  footerBg: asset("bg-3.jpg"),
  groomPortrait: asset("erik-solo.jpg"),
  bridePortrait: asset("christine-solo.jpg"),
};

export const phantomDefaultCover = phantomAssets.heroBg;

const GROOM_CAPTION_KEYS = ["mempelai pria", "groom", "pria", "erik"];
const BRIDE_CAPTION_KEYS = ["mempelai wanita", "bride", "wanita", "christine"];
const COUPLE_BG_KEYS = [
  "latar kutipan",
  "latar isi",
  "pasangan",
  "couple",
  "berdua",
  "pre-wedding",
  "prewedding",
  "together",
];
const ACCENT_BG_KEYS = ["latar rsvp", "latar acara", "opéra garnier", "opera garnier", "masquerade"];
const FOOTER_BG_KEYS = ["latar penutup", "latar footer", "footer", "penutup"];
const HERO_CAPTION_KEYS = ["latar hero", "hero", "sampul", "cover"];

function matchesCaption(caption: string | null | undefined, keys: string[]) {
  if (!caption) return false;
  const c = caption.toLowerCase();
  return keys.some((k) => c.includes(k));
}

function pickPortrait(
  photos: PhantomMediaPhoto[],
  keys: string[],
  fallback: string,
  exclude: Set<string>
) {
  const match = photos.find((p) => !exclude.has(p.url) && matchesCaption(p.caption, keys));
  if (match) return match.url;
  return fallback;
}

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

export const PHANTOM_PHOTO_SLOTS = [
  {
    id: "hero" as const,
    label: "Latar hero",
    hint: "Bagian pembuka undangan — nama mempelai di atas foto ini.",
    caption: "Latar hero",
    setCover: true,
  },
  {
    id: "groom" as const,
    label: "Mempelai pria",
    hint: "Foto portrait mempelai pria di bagian mempelai.",
    caption: "Mempelai pria",
    setCover: false,
  },
  {
    id: "bride" as const,
    label: "Mempelai wanita",
    hint: "Foto portrait mempelai wanita di bagian mempelai.",
    caption: "Mempelai wanita",
    setCover: false,
  },
  {
    id: "coupleBg" as const,
    label: "Latar kutipan & countdown",
    hint: "Foto latar di balik kutipan, ayat undangan, orang tua, dan countdown.",
    caption: "Latar kutipan",
    setCover: false,
  },
  {
    id: "accentBg" as const,
    label: "Latar konfirmasi kehadiran",
    hint: "Foto latar di balik bagian RSVP / konfirmasi kehadiran.",
    caption: "Latar RSVP",
    setCover: false,
  },
  {
    id: "footerBg" as const,
    label: "Latar penutup",
    hint: "Foto latar di bagian penutup — nama mempelai & ucapan terima kasih.",
    caption: "Latar penutup",
    setCover: false,
  },
] as const;

type DashboardPhoto = { id: string; url: string; caption: string | null };

export function classifyPhantomDashboardPhotos(
  photos: DashboardPhoto[],
  coverPhotoUrl: string | null
) {
  const groom =
    photos.find((p) => matchesCaption(p.caption, GROOM_CAPTION_KEYS)) ?? null;
  const bride =
    photos.find((p) => matchesCaption(p.caption, BRIDE_CAPTION_KEYS)) ?? null;
  const coupleBg =
    photos.find((p) => matchesCaption(p.caption, COUPLE_BG_KEYS)) ?? null;
  const accentBg =
    photos.find((p) => matchesCaption(p.caption, ACCENT_BG_KEYS)) ?? null;
  const footerBg =
    photos.find((p) => matchesCaption(p.caption, FOOTER_BG_KEYS)) ?? null;

  const heroPhoto =
    photos.find((p) => {
      if (matchesCaption(p.caption, HERO_CAPTION_KEYS)) return true;
      if (!coverPhotoUrl || p.url !== coverPhotoUrl) return false;
      return (
        !matchesCaption(p.caption, COUPLE_BG_KEYS) &&
        !matchesCaption(p.caption, ACCENT_BG_KEYS) &&
        !matchesCaption(p.caption, FOOTER_BG_KEYS) &&
        !matchesCaption(p.caption, GROOM_CAPTION_KEYS) &&
        !matchesCaption(p.caption, BRIDE_CAPTION_KEYS)
      );
    }) ?? null;

  const heroUrl = coverPhotoUrl ?? heroPhoto?.url ?? null;

  const slottedIds = new Set(
    [groom, bride, coupleBg, accentBg, footerBg, heroPhoto].filter(Boolean).map((p) => p!.id)
  );

  const extras = photos.filter(
    (p) =>
      !slottedIds.has(p.id) &&
      !matchesCaption(p.caption, ACCENT_BG_KEYS) &&
      !matchesCaption(p.caption, FOOTER_BG_KEYS)
  );

  return { heroUrl, heroPhoto, groom, bride, coupleBg, accentBg, footerBg, extras };
}

export function resolvePhantomMedia(invitation: {
  coverPhotoUrl?: string | null;
  photos: PhantomMediaPhoto[];
}) {
  const hasCustomPhotos = invitation.photos.length > 0;
  const photos = hasCustomPhotos ? invitation.photos : phantomDefaultPhotos;

  const heroBg = invitation.coverPhotoUrl ?? phantomAssets.heroBg;

  let groomPhoto = pickPortrait(photos, GROOM_CAPTION_KEYS, phantomAssets.groomPortrait, new Set());
  let bridePhoto = pickPortrait(
    photos,
    BRIDE_CAPTION_KEYS,
    phantomAssets.bridePortrait,
    new Set([groomPhoto])
  );

  let coupleBg = pickPortrait(
    photos,
    COUPLE_BG_KEYS,
    phantomAssets.coupleBg,
    new Set([groomPhoto, bridePhoto, heroBg])
  );

  let accentBg = pickPortrait(
    photos,
    ACCENT_BG_KEYS,
    phantomAssets.accentBgs[0],
    new Set([groomPhoto, bridePhoto, coupleBg, heroBg])
  );

  let footerBg = pickPortrait(
    photos,
    FOOTER_BG_KEYS,
    phantomAssets.footerBg,
    new Set([groomPhoto, bridePhoto, coupleBg, accentBg, heroBg])
  );

  if (hasCustomPhotos) {
    const used = new Set([groomPhoto, bridePhoto, coupleBg, heroBg]);
    if (groomPhoto === phantomAssets.groomPortrait) {
      const next = photos.find((p) => !used.has(p.url));
      if (next) {
        groomPhoto = next.url;
        used.add(groomPhoto);
      }
    }
    if (bridePhoto === phantomAssets.bridePortrait) {
      const next = photos.find((p) => !used.has(p.url));
      if (next) {
        bridePhoto = next.url;
        used.add(bridePhoto);
      }
    }
  }

  const reservedUrls = new Set([
    groomPhoto,
    bridePhoto,
    coupleBg,
    accentBg,
    footerBg,
    heroBg,
    ...phantomAssets.accentBgs,
    phantomAssets.footerBg,
  ]);
  const galleryPhotos = photos.filter((p) => !reservedUrls.has(p.url));

  return {
    heroBg,
    coupleBg,
    accentBg,
    footerBg,
    groomPhoto,
    bridePhoto,
    galleryPhotos:
      galleryPhotos.length > 0
        ? galleryPhotos
        : [{ id: "phantom-bg-2", url: phantomAssets.accentBgs[1], caption: "Masquerade" }],
    isPlaceholderMedia: !invitation.coverPhotoUrl || !hasCustomPhotos,
  };
}
