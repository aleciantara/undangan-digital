export type MusicEmbedKind = "youtube" | "spotify" | "audio";

export type ParsedMusicEmbed = {
  kind: MusicEmbedKind;
  embedUrl: string;
  label: string;
  videoId?: string;
};

const YOUTUBE_ID =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/|music\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/;

const SPOTIFY =
  /open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|playlist|episode)\/([a-zA-Z0-9]+)/;

/** Parse YouTube `t=` / `start=` from share URLs (seconds). */
export function parseYoutubeStartFromUrl(url: string): number {
  try {
    const u = new URL(url);
    const t = u.searchParams.get("t") ?? u.searchParams.get("start");
    if (!t) return 0;
    if (/^\d+$/.test(t)) return parseInt(t, 10);
    const m = t.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?/);
    if (!m) return 0;
    const h = parseInt(m[1] ?? "0", 10);
    const min = parseInt(m[2] ?? "0", 10);
    const sec = parseInt(m[3] ?? "0", 10);
    return h * 3600 + min * 60 + sec;
  } catch {
    return 0;
  }
}

export function parseMusicUrl(url: string): ParsedMusicEmbed | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const yt = trimmed.match(YOUTUBE_ID);
  if (yt) {
    const id = yt[1];
    return {
      kind: "youtube",
      videoId: id,
      embedUrl: `https://www.youtube.com/embed/${id}?enablejsapi=1`,
      label: "YouTube",
    };
  }

  const sp = trimmed.match(SPOTIFY);
  if (sp) {
    const [, type, id] = sp;
    return {
      kind: "spotify",
      embedUrl: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`,
      label: "Spotify",
    };
  }

  if (/^https?:\/\/.+/i.test(trimmed)) {
    return { kind: "audio", embedUrl: trimmed, label: "Audio" };
  }

  return null;
}

export function isSupportedMusicUrl(url: string): boolean {
  return parseMusicUrl(url) !== null;
}

export function secondsToMmSs(total: number): { minutes: number; seconds: number } {
  const safe = Math.max(0, Math.floor(total));
  return { minutes: Math.floor(safe / 60), seconds: safe % 60 };
}

export function mmSsToSeconds(minutes: number, seconds: number): number {
  return Math.max(0, Math.floor(minutes) * 60 + Math.floor(seconds));
}

export function formatMmSs(total: number): string {
  const { minutes, seconds } = secondsToMmSs(total);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
