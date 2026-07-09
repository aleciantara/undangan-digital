export type PhotoOrientation = "portrait" | "landscape";

export function orientedCaption(base: string, orientation: PhotoOrientation): string {
  return `${base} ${orientation}`;
}

export function photoOrientation(caption: string | null | undefined): PhotoOrientation | null {
  if (!caption) return null;
  const c = caption.toLowerCase();
  if (/\blandscape\b/.test(c)) return "landscape";
  if (/\bportrait\b/.test(c)) return "portrait";
  return null;
}

export function normalizeCaptionForMatch(caption: string): string {
  return caption
    .toLowerCase()
    .replace(/\b(portrait|landscape)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function captionMatchesKeys(
  caption: string | null | undefined,
  keys: string[],
  orientation?: PhotoOrientation
): boolean {
  if (!caption) return false;
  const detected = photoOrientation(caption);
  if (orientation === "portrait" && detected === "landscape") return false;
  if (orientation === "landscape" && detected !== "landscape") return false;

  const normalized = normalizeCaptionForMatch(caption);
  return keys.some((k) => normalized.includes(k.toLowerCase()));
}
