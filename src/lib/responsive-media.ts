export type ResponsiveSlotMedia = {
  portrait: string;
  landscape: string | null;
  hasPortrait: boolean;
  hasLandscape: boolean;
};

export type MediaPhoto = {
  id: string;
  url: string;
  caption: string | null;
};

export function buildResponsiveSlotMedia(
  portraitPhoto: MediaPhoto | null,
  landscapePhoto: MediaPhoto | null,
  coverUrl: string | null,
  fallbackPortrait: string
): ResponsiveSlotMedia {
  const hasPortrait = Boolean(portraitPhoto || coverUrl);
  const hasLandscape = Boolean(landscapePhoto);
  const landscape = landscapePhoto?.url ?? null;

  let portrait = portraitPhoto?.url ?? coverUrl ?? fallbackPortrait;
  if (!hasPortrait && landscape) {
    portrait = landscape;
  }

  return { portrait, landscape, hasPortrait, hasLandscape };
}

export function pickLandscapeBackdropUrl(
  slots: ResponsiveSlotMedia[]
): string | null {
  for (const slot of slots) {
    if (slot.landscape) return slot.landscape;
    if (slot.hasLandscape && !slot.hasPortrait) return slot.portrait;
  }
  return null;
}
