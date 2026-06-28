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

const GROOM_CAPTION_KEYS = ["mempelai pria", "groom", "pria", "himmel"];
const BRIDE_CAPTION_KEYS = ["mempelai wanita", "bride", "wanita", "frieren"];
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
const ACCENT_BG_KEYS = ["latar rsvp", "latar acara", "meadow", "flower field", "bunga"];
const FOOTER_BG_KEYS = ["latar penutup", "latar footer", "footer", "penutup"];
const HERO_CAPTION_KEYS = ["latar hero", "hero", "sampul", "cover"];

function matchesCaption(caption: string | null | undefined, keys: string[]) {
  if (!caption) return false;
  const c = caption.toLowerCase();
  return keys.some((k) => c.includes(k));
}

function pickPortrait(
  photos: HimmelMediaPhoto[],
  keys: string[],
  fallback: string,
  exclude: Set<string>
) {
  const match = photos.find((p) => !exclude.has(p.url) && matchesCaption(p.caption, keys));
  if (match) return match.url;
  return fallback;
}

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

export const HIMMEL_PHOTO_SLOTS = [
  {
    id: "hero" as const,
    label: "Latar hero",
    hint: "Kosongkan slot untuk animasi bunga. Unggah foto untuk latar hero kustom di bagian pembuka.",
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
    hint: "Foto latar di balik kutipan, ayat undangan, dan countdown.",
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

export type HimmelHeroMode = "flowers" | "photo";

export function resolveHimmelHero(invitation: {
  coverPhotoUrl?: string | null;
  photos: HimmelMediaPhoto[];
}): { mode: HimmelHeroMode; heroBg: string | null } {
  const { heroUrl } = classifyHimmelDashboardPhotos(
    invitation.photos,
    invitation.coverPhotoUrl ?? null
  );

  if (heroUrl) {
    return { mode: "photo", heroBg: heroUrl };
  }

  return { mode: "flowers", heroBg: null };
}

export function classifyHimmelDashboardPhotos(
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

export function resolveHimmelMedia(invitation: {
  coverPhotoUrl?: string | null;
  photos: HimmelMediaPhoto[];
}) {
  const hasCustomPhotos = invitation.photos.length > 0;
  const photos = hasCustomPhotos ? invitation.photos : himmelDefaultPhotos;
  const { mode: heroMode, heroBg } = resolveHimmelHero(invitation);

  let groomPhoto = pickPortrait(photos, GROOM_CAPTION_KEYS, himmelAssets.groomPortrait, new Set());
  let bridePhoto = pickPortrait(
    photos,
    BRIDE_CAPTION_KEYS,
    himmelAssets.bridePortrait,
    new Set([groomPhoto])
  );

  let coupleBg = pickPortrait(
    photos,
    COUPLE_BG_KEYS,
    himmelAssets.coupleBg,
    new Set([groomPhoto, bridePhoto, ...(heroBg ? [heroBg] : [])])
  );

  let accentBg = pickPortrait(
    photos,
    ACCENT_BG_KEYS,
    himmelAssets.accentBgs[0],
    new Set([groomPhoto, bridePhoto, coupleBg, ...(heroBg ? [heroBg] : [])])
  );

  let footerBg = pickPortrait(
    photos,
    FOOTER_BG_KEYS,
    himmelAssets.footerBg,
    new Set([groomPhoto, bridePhoto, coupleBg, accentBg, ...(heroBg ? [heroBg] : [])])
  );

  if (hasCustomPhotos) {
    const used = new Set([groomPhoto, bridePhoto, coupleBg, ...(heroBg ? [heroBg] : [])]);
    if (groomPhoto === himmelAssets.groomPortrait) {
      const next = photos.find((p) => !used.has(p.url));
      if (next) {
        groomPhoto = next.url;
        used.add(groomPhoto);
      }
    }
    if (bridePhoto === himmelAssets.bridePortrait) {
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
    ...(heroBg ? [heroBg] : []),
    ...himmelAssets.accentBgs,
    himmelAssets.footerBg,
  ]);
  const galleryPhotos = photos.filter((p) => !reservedUrls.has(p.url));

  return {
    heroMode,
    heroBg,
    coupleBg,
    accentBg,
    footerBg,
    groomPhoto,
    bridePhoto,
    galleryPhotos:
      galleryPhotos.length > 0
        ? galleryPhotos
        : [{ id: "himmel-bg-2", url: himmelAssets.accentBgs[1], caption: "Meadow" }],
    isPlaceholderMedia: heroMode === "flowers" && !hasCustomPhotos,
  };
}
