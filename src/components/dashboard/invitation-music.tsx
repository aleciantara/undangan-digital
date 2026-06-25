"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  formatMmSs,
  isSupportedMusicUrl,
  mmSsToSeconds,
  parseMusicUrl,
  parseYoutubeStartFromUrl,
  secondsToMmSs,
} from "@/lib/music-embed";
import { Music, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Props = {
  invitationId: string;
  musicUrl: string | null;
  musicTitle: string | null;
  musicAutoplay: boolean;
  musicStartSec: number;
};

export function InvitationMusic({
  invitationId,
  musicUrl,
  musicTitle,
  musicAutoplay,
  musicStartSec,
}: Props) {
  const router = useRouter();
  const initialStart = secondsToMmSs(musicStartSec);
  const [title, setTitle] = useState(musicTitle ?? "");
  const [autoplay, setAutoplay] = useState(musicAutoplay);
  const [startMin, setStartMin] = useState(String(initialStart.minutes));
  const [startSec, setStartSecInput] = useState(String(initialStart.seconds));
  const [urlInput, setUrlInput] = useState(musicUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const preview = useMemo(() => parseMusicUrl(urlInput), [urlInput]);
  const current = useMemo(() => (musicUrl ? parseMusicUrl(musicUrl) : null), [musicUrl]);

  // Auto-fill start time from YouTube link (?t=1m30s)
  useEffect(() => {
    if (preview?.kind !== "youtube" || !urlInput.trim()) return;
    const fromUrl = parseYoutubeStartFromUrl(urlInput);
    if (fromUrl > 0) {
      const { minutes, seconds } = secondsToMmSs(fromUrl);
      setStartMin(String(minutes));
      setStartSecInput(String(seconds));
    }
  }, [urlInput, preview?.kind]);

  function buildStartSeconds(): number {
    return mmSsToSeconds(Number(startMin) || 0, Number(startSec) || 0);
  }

  async function saveSettings(payload: Record<string, unknown>) {
    setError(null);
    setMessage(null);
    setSaving(true);
    // #region agent log
    fetch('http://127.0.0.1:7898/ingest/c2970705-d47a-41d5-aaca-8306ff1b62cd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e1895a'},body:JSON.stringify({sessionId:'e1895a',location:'invitation-music.tsx:saveSettings:pre',message:'Client sending PATCH',data:{invitationId,payload},timestamp:Date.now(),hypothesisId:'C-E'})}).catch(()=>{});
    // #endregion
    const res = await fetch(`/api/invitations/${invitationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    // #region agent log
    fetch('http://127.0.0.1:7898/ingest/c2970705-d47a-41d5-aaca-8306ff1b62cd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e1895a'},body:JSON.stringify({sessionId:'e1895a',location:'invitation-music.tsx:saveSettings:post',message:'Client PATCH response',data:{status:res.status,ok:res.ok,error:data?.error,fields:data?.fields},timestamp:Date.now(),hypothesisId:'A-B-C'})}).catch(()=>{});
    // #endregion
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Gagal menyimpan.");
      return false;
    }
    setMessage("Pengaturan musik disimpan.");
    router.refresh();
    return true;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (trimmed && !isSupportedMusicUrl(trimmed)) {
      setError("URL tidak dikenali. Gunakan link YouTube, YouTube Music, atau Spotify.");
      return;
    }
    const sec = Number(startSec);
    if (sec < 0 || sec > 59) {
      setError("Detik mulai harus antara 0–59.");
      return;
    }
    await saveSettings({
      musicUrl: trimmed || null,
      musicTitle: title.trim() || null,
      musicAutoplay: autoplay,
      musicStartSec: buildStartSeconds(),
    });
  }

  async function removeMusic() {
    if (!confirm("Hapus musik latar?")) return;
    await saveSettings({ musicUrl: null, musicTitle: null, musicStartSec: 0 });
    setTitle("");
    setUrlInput("");
    setStartMin("0");
    setStartSecInput("0");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Musik latar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-stone-600">
          Tempel link <strong>YouTube</strong> / <strong>YouTube Music</strong> (disarankan — hanya
          kartu musik, tanpa video) atau <strong>Spotify</strong>. Musik mulai otomatis saat tamu
          mengetuk amplop untuk membuka undangan.
        </p>

        {musicUrl && current && (
          <div className="flex items-center justify-between rounded-lg border border-stone-200 px-4 py-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-medium">{musicTitle || "Musik latar"}</p>
                <Badge className="bg-stone-100 text-stone-600">{current.label}</Badge>
                {musicStartSec > 0 && (
                  <Badge className="bg-brand-chalk text-brand-amaranth">
                    Mulai {formatMmSs(musicStartSec)}
                  </Badge>
                )}
              </div>
              <p className="truncate text-xs text-stone-500">{musicUrl}</p>
            </div>
            <Button type="button" size="sm" variant="ghost" onClick={removeMusic} disabled={saving}>
              <Trash2 className="h-4 w-4 text-stone-400" />
            </Button>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label htmlFor="music-url">Link lagu (YouTube / Spotify)</Label>
            <Input
              id="music-url"
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://youtu.be/... atau https://open.spotify.com/track/..."
              className="mt-1"
            />
            {preview && urlInput.trim() && (
              <p className="mt-1.5 text-xs text-green-700">
                Terdeteksi: {preview.label} — siap disimpan
              </p>
            )}
            {urlInput.trim() && !preview && (
              <p className="mt-1.5 text-xs text-amber-700">
                URL belum dikenali. Pastikan link dari YouTube atau Spotify.
              </p>
            )}
          </div>

          <div>
            <Label>Mulai dari (untuk reff/chorus)</Label>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Input
                type="number"
                min={0}
                max={999}
                value={startMin}
                onChange={(e) => setStartMin(e.target.value)}
                className="w-24"
                aria-label="Menit mulai"
              />
              <span className="text-sm text-stone-500">menit</span>
              <Input
                type="number"
                min={0}
                max={59}
                value={startSec}
                onChange={(e) => setStartSecInput(e.target.value)}
                className="w-24"
                aria-label="Detik mulai"
              />
              <span className="text-sm text-stone-500">detik</span>
              {buildStartSeconds() > 0 && (
                <span className="text-xs text-stone-500">
                  = mulai di {formatMmSs(buildStartSeconds())}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-xs text-stone-500">
              Tip: buka video di YouTube, geser ke chorus, lihat waktu di progress bar (mis. 1:23 →
              isi menit 1, detik 23). Link dengan{" "}
              <code className="rounded bg-stone-100 px-1">?t=1m23s</code> terisi otomatis.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="music-title">Judul di kartu musik (opsional)</Label>
              <Input
                id="music-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Perfect — Ed Sheeran"
                className="mt-1"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={autoplay}
                  onChange={(e) => setAutoplay(e.target.checked)}
                  className="rounded border-stone-300"
                />
                Putar otomatis saat undangan dibuka
              </label>
            </div>
          </div>

          <Button type="submit" disabled={saving || (!!urlInput.trim() && !preview)}>
            {saving ? "Menyimpan..." : "Simpan musik"}
          </Button>
        </form>

        <div className="rounded-lg bg-stone-50 px-4 py-3 text-xs text-stone-600">
          <p className="font-medium text-stone-700">Musik & amplop</p>
          <p className="mt-1">
            Tamu melihat animasi amplop terlebih dahulu. Satu ketukan membuka undangan sekaligus
            memulai musik — cara paling andal di iPhone dan Android.
          </p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}
      </CardContent>
    </Card>
  );
}
