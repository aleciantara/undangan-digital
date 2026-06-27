"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseYoutubeVideoId } from "@/lib/music-embed";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Props = {
  invitationId: string;
  prewedVideoUrl: string | null;
  prewedVideoTitle: string | null;
  liveStreamUrl: string | null;
  liveStreamTitle: string | null;
};

import { parseApiError } from "@/lib/api-errors";
export function InvitationVideos({
  invitationId,
  prewedVideoUrl,
  prewedVideoTitle,
  liveStreamUrl,
  liveStreamTitle,
}: Props) {
  const router = useRouter();
  const [prewedUrl, setPrewedUrl] = useState(prewedVideoUrl ?? "");
  const [prewedTitle, setPrewedTitle] = useState(prewedVideoTitle ?? "Pre-Wedding Film");
  const [liveUrl, setLiveUrl] = useState(liveStreamUrl ?? "");
  const [liveTitle, setLiveTitle] = useState(liveStreamTitle ?? "Siaran Langsung");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const prewedOk = useMemo(() => !prewedUrl.trim() || Boolean(parseYoutubeVideoId(prewedUrl)), [prewedUrl]);
  const liveOk = useMemo(() => !liveUrl.trim() || Boolean(parseYoutubeVideoId(liveUrl)), [liveUrl]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prewedOk || !liveOk) {
      setError("URL YouTube tidak valid. Gunakan link youtube.com atau youtu.be.");
      return;
    }

    setError(null);
    setMessage(null);
    setSaving(true);

    const res = await fetch(`/api/invitations/${invitationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prewedVideoUrl: prewedUrl,
        prewedVideoTitle: prewedTitle,
        liveStreamUrl: liveUrl,
        liveStreamTitle: liveTitle,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(parseApiError(data));
      return;
    }

    setMessage("Video disimpan.");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video YouTube</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-stone-600">
          Tambahkan cinematic pre-wedding dan/atau siaran langsung (live stream). Kosongkan jika tidak
          digunakan.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3 rounded-lg border border-stone-200 p-4">
            <p className="text-sm font-medium text-stone-800">Pre-wedding / cinematic</p>
            <div>
              <Label htmlFor="prewed-title">Judul</Label>
              <Input
                id="prewed-title"
                value={prewedTitle}
                onChange={(e) => setPrewedTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="prewed-url">URL YouTube</Label>
              <Input
                id="prewed-url"
                type="url"
                value={prewedUrl}
                onChange={(e) => setPrewedUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="mt-1"
              />
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-stone-200 p-4">
            <p className="text-sm font-medium text-stone-800">Live stream pernikahan</p>
            <div>
              <Label htmlFor="live-title">Judul</Label>
              <Input
                id="live-title"
                value={liveTitle}
                onChange={(e) => setLiveTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="live-url">URL YouTube</Label>
              <Input
                id="live-url"
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://youtube.com/live/..."
                className="mt-1"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-700">{message}</p>}

          <Button type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan video"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
