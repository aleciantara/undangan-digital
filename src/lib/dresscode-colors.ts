const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function isHexColor(value: string): boolean {
  return HEX_COLOR.test(value.trim());
}

function normalizeHex(value: string): string {
  const v = value.trim();
  if (!HEX_COLOR.test(v)) return v;
  if (v.length === 4) {
    const [, r, g, b] = v;
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return v.toUpperCase();
}

/** Parse comma-separated hex colors; legacy single text returns empty array. */
export function parseDresscodeColors(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];
  const parts = value.split(",").map((p) => p.trim()).filter(Boolean);
  const hexes = parts.filter(isHexColor).map(normalizeHex);
  if (hexes.length > 0) return [...new Set(hexes)];
  if (isHexColor(value)) return [normalizeHex(value)];
  return [];
}

/** Non-hex label when dresscodeColor is plain text (legacy). */
export function parseDresscodeColorLabel(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  if (parseDresscodeColors(value).length > 0) return null;
  return value.trim();
}

export function serializeDresscodeColors(colors: string[]): string {
  return colors
    .map((c) => normalizeHex(c))
    .filter(isHexColor)
    .filter((c, i, arr) => arr.indexOf(c) === i)
    .join(",");
}

export function hasEventDresscode(event: {
  dresscode?: string | null;
  dresscodeColor?: string | null;
  dresscodeAttire?: string | null;
}): boolean {
  const attire = event.dresscodeAttire?.trim() || event.dresscode?.trim();
  const colors = parseDresscodeColors(event.dresscodeColor);
  const label = parseDresscodeColorLabel(event.dresscodeColor);
  return Boolean(attire || colors.length > 0 || label);
}

export function eventsWithDresscode<T extends {
  dresscode?: string | null;
  dresscodeColor?: string | null;
  dresscodeAttire?: string | null;
}>(events: T[]): T[] {
  return events.filter(hasEventDresscode);
}

export function eventDresscodeAttire(event: {
  dresscode?: string | null;
  dresscodeAttire?: string | null;
}): string | null {
  return event.dresscodeAttire?.trim() || event.dresscode?.trim() || null;
}
