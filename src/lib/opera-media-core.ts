import {
  captionMatchesKeys,
  photoOrientation,
  type PhotoOrientation,
} from "@/lib/media-orientation";
import {
  buildResponsiveSlotMedia,
  pickLandscapeBackdropUrl,
  type MediaPhoto,
  type ResponsiveSlotMedia,
} from "@/lib/responsive-media";

export type OperaPhotoSlotDef = {
  id: "hero" | "groom" | "bride" | "coupleBg" | "accentBg" | "footerBg";
  label: string;
  hint: string;
  caption: string;
  setCover?: boolean;
};

export type OperaMediaKeys = {
  hero: string[];
  groom: string[];
  bride: string[];
  coupleBg: string[];
  accentBg: string[];
  footerBg: string[];
};

export type OrientedPhotoPair = {
  portrait: MediaPhoto | null;
  landscape: MediaPhoto | null;
};

export type ClassifiedOperaPhotos = {
  hero: OrientedPhotoPair & { coverUrl: string | null };
  groom: OrientedPhotoPair;
  bride: OrientedPhotoPair;
  coupleBg: OrientedPhotoPair;
  accentBg: OrientedPhotoPair;
  footerBg: OrientedPhotoPair;
  extras: MediaPhoto[];
};

function pickOrientedPhoto(
  photos: MediaPhoto[],
  keys: string[],
  orientation: PhotoOrientation,
  exclude: Set<string>
): MediaPhoto | null {
  return (
    photos.find((p) => {
      if (exclude.has(p.url)) return false;
      return captionMatchesKeys(p.caption, keys, orientation);
    }) ?? null
  );
}

function pickLegacyPortrait(
  photos: MediaPhoto[],
  keys: string[],
  exclude: Set<string>
): MediaPhoto | null {
  return (
    photos.find((p) => {
      if (exclude.has(p.url)) return false;
      if (photoOrientation(p.caption) === "landscape") return false;
      return captionMatchesKeys(p.caption, keys);
    }) ?? null
  );
}

function orientedPair(
  photos: MediaPhoto[],
  keys: string[],
  exclude: Set<string>
): OrientedPhotoPair {
  const portrait =
    pickOrientedPhoto(photos, keys, "portrait", exclude) ??
    pickLegacyPortrait(photos, keys, exclude);
  const landscape = pickOrientedPhoto(photos, keys, "landscape", exclude);
  return { portrait, landscape };
}

export function classifyOperaDashboardPhotos(
  photos: MediaPhoto[],
  coverPhotoUrl: string | null,
  keys: OperaMediaKeys
): ClassifiedOperaPhotos {
  const groom = orientedPair(photos, keys.groom, new Set());
  const bride = orientedPair(photos, keys.bride, new Set());
  const coupleBg = orientedPair(photos, keys.coupleBg, new Set());
  const accentBg = orientedPair(photos, keys.accentBg, new Set());
  const footerBg = orientedPair(photos, keys.footerBg, new Set());

  const heroPortrait =
    pickOrientedPhoto(photos, keys.hero, "portrait", new Set()) ??
    pickLegacyPortrait(photos, keys.hero, new Set()) ??
    photos.find((p) => {
      if (!coverPhotoUrl || p.url !== coverPhotoUrl) return false;
      if (photoOrientation(p.caption) === "landscape") return false;
      return (
        !captionMatchesKeys(p.caption, keys.coupleBg) &&
        !captionMatchesKeys(p.caption, keys.accentBg) &&
        !captionMatchesKeys(p.caption, keys.footerBg) &&
        !captionMatchesKeys(p.caption, keys.groom) &&
        !captionMatchesKeys(p.caption, keys.bride)
      );
    }) ??
    null;

  const heroLandscape = pickOrientedPhoto(photos, keys.hero, "landscape", new Set());
  const heroCoverUrl =
    coverPhotoUrl ??
    heroPortrait?.url ??
    (heroLandscape && !heroPortrait ? heroLandscape.url : null);

  const slottedIds = new Set<string>();
  for (const pair of [groom, bride, coupleBg, accentBg, footerBg, { portrait: heroPortrait, landscape: heroLandscape }]) {
    if (pair.portrait) slottedIds.add(pair.portrait.id);
    if (pair.landscape) slottedIds.add(pair.landscape.id);
  }

  const extras = photos.filter(
    (p) =>
      !slottedIds.has(p.id) &&
      !captionMatchesKeys(p.caption, keys.accentBg) &&
      !captionMatchesKeys(p.caption, keys.footerBg)
  );

  return {
    hero: { portrait: heroPortrait, landscape: heroLandscape, coverUrl: heroCoverUrl },
    groom,
    bride,
    coupleBg,
    accentBg,
    footerBg,
    extras,
  };
}

export type OperaThemeAssets = {
  heroBg: string;
  coupleBg: string;
  accentBgs: readonly [string, string];
  footerBg: string;
  groomPortrait: string;
  bridePortrait: string;
};

export function resolveOperaMedia(input: {
  coverPhotoUrl?: string | null;
  photos: MediaPhoto[];
  keys: OperaMediaKeys;
  assets: OperaThemeAssets;
  defaultPhotos: MediaPhoto[];
  landscapeBackdropFill?: boolean;
}) {
  const hasCustomPhotos = input.photos.length > 0;
  const photos = hasCustomPhotos ? input.photos : input.defaultPhotos;
  const { assets, keys } = input;

  const hero = buildResponsiveSlotMedia(
    pickOrientedPhoto(photos, keys.hero, "portrait", new Set()) ??
      pickLegacyPortrait(photos, keys.hero, new Set()),
    pickOrientedPhoto(photos, keys.hero, "landscape", new Set()),
    input.coverPhotoUrl ?? null,
    assets.heroBg
  );

  let groom = buildResponsiveSlotMedia(
    pickOrientedPhoto(photos, keys.groom, "portrait", new Set()) ??
      pickLegacyPortrait(photos, keys.groom, new Set()),
    pickOrientedPhoto(photos, keys.groom, "landscape", new Set()),
    null,
    assets.groomPortrait
  );

  let bride = buildResponsiveSlotMedia(
    pickOrientedPhoto(photos, keys.bride, "portrait", new Set()) ??
      pickLegacyPortrait(photos, keys.bride, new Set()),
    pickOrientedPhoto(photos, keys.bride, "landscape", new Set()),
    null,
    assets.bridePortrait
  );

  const excludeCouple = new Set([groom.portrait, bride.portrait, hero.portrait]);
  let coupleBg = buildResponsiveSlotMedia(
    pickOrientedPhoto(photos, keys.coupleBg, "portrait", excludeCouple) ??
      pickLegacyPortrait(photos, keys.coupleBg, excludeCouple),
    pickOrientedPhoto(photos, keys.coupleBg, "landscape", excludeCouple),
    null,
    assets.coupleBg
  );

  const excludeAccent = new Set([...excludeCouple, coupleBg.portrait]);
  let accentBg = buildResponsiveSlotMedia(
    pickOrientedPhoto(photos, keys.accentBg, "portrait", excludeAccent) ??
      pickLegacyPortrait(photos, keys.accentBg, excludeAccent),
    pickOrientedPhoto(photos, keys.accentBg, "landscape", excludeAccent),
    null,
    assets.accentBgs[0]
  );

  const excludeFooter = new Set([...excludeAccent, accentBg.portrait, hero.portrait]);
  let footerBg = buildResponsiveSlotMedia(
    pickOrientedPhoto(photos, keys.footerBg, "portrait", excludeFooter) ??
      pickLegacyPortrait(photos, keys.footerBg, excludeFooter),
    pickOrientedPhoto(photos, keys.footerBg, "landscape", excludeFooter),
    null,
    assets.footerBg
  );

  if (hasCustomPhotos) {
    const used = new Set([groom.portrait, bride.portrait, coupleBg.portrait, hero.portrait]);
    if (groom.portrait === assets.groomPortrait) {
      const next = photos.find((p) => !used.has(p.url) && photoOrientation(p.caption) !== "landscape");
      if (next) {
        groom = buildResponsiveSlotMedia(next, null, null, assets.groomPortrait);
        used.add(groom.portrait);
      }
    }
    if (bride.portrait === assets.bridePortrait) {
      const next = photos.find((p) => !used.has(p.url) && photoOrientation(p.caption) !== "landscape");
      if (next) {
        bride = buildResponsiveSlotMedia(next, null, null, assets.bridePortrait);
      }
    }
  }

  const reservedUrls = new Set([
    groom.portrait,
    groom.landscape,
    bride.portrait,
    bride.landscape,
    coupleBg.portrait,
    coupleBg.landscape,
    accentBg.portrait,
    accentBg.landscape,
    footerBg.portrait,
    footerBg.landscape,
    hero.portrait,
    hero.landscape,
    ...assets.accentBgs,
    assets.footerBg,
  ]);

  const galleryPhotos = photos.filter((p) => !reservedUrls.has(p.url));

  const landscapeBackdropUrl = pickLandscapeBackdropUrl([
    hero,
    coupleBg,
    accentBg,
    footerBg,
  ]);

  const useLandscapeBackdrop =
    Boolean(input.landscapeBackdropFill) && Boolean(landscapeBackdropUrl);

  return {
    heroBg: hero,
    groomPhoto: groom,
    bridePhoto: bride,
    coupleBg,
    accentBg,
    footerBg,
    galleryPhotos:
      galleryPhotos.length > 0
        ? galleryPhotos
        : [{ id: "opera-gallery-fallback", url: assets.accentBgs[1], caption: null }],
    isPlaceholderMedia: !input.coverPhotoUrl || !hasCustomPhotos,
    landscapeBackdropUrl,
    useLandscapeBackdrop,
  };
}

export type ResolvedOperaMedia = ReturnType<typeof resolveOperaMedia>;
