"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type Photo = {
  id: string;
  url: string;
  caption: string | null;
};

type Props = {
  invitationId: string;
  photos: Photo[];
  coverPhotoUrl: string | null;
};

export function InvitationGallery({ invitationId, photos, coverPhotoUrl }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function uploadPhoto(file: File) {
    setError(null);
    setUploading(true);

    const form = new FormData();
    form.append("file", file);
    form.append("setCover", photos.length === 0 ? "true" : "false");

    const res = await fetch(`/api/invitations/${invitationId}/photos`, {
      method: "POST",
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    setUploading(false);

    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Gagal mengunggah foto.");
      return;
    }

    router.refresh();
  }

  async function deletePhoto(photoId: string) {
    if (!confirm("Hapus foto ini?")) return;
    setDeletingId(photoId);
    const res = await fetch(`/api/invitations/${invitationId}/photos/${photoId}`, {
      method: "DELETE",
    });
    setDeletingId(null);
    if (!res.ok) {
      setError("Gagal menghapus foto.");
      return;
    }
    router.refresh();
  }

  async function setCover(url: string) {
    const res = await fetch(`/api/invitations/${invitationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coverPhotoUrl: url }),
    });
    if (!res.ok) {
      setError("Gagal mengatur foto sampul.");
      return;
    }
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Galeri foto ({photos.length}/20)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-stone-600">
          Unggah foto pre-wedding untuk ditampilkan di undangan. Foto sampul dipakai untuk pratinjau
          link (WhatsApp / media sosial).
        </p>

        {photos.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg border border-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.caption ?? ""} className="h-full w-full object-cover" />
                {coverPhotoUrl === photo.url && (
                  <span className="absolute left-2 top-2 rounded bg-brand-amaranth px-2 py-0.5 text-xs text-white">
                    Sampul
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-black/50 p-1.5 opacity-0 transition group-hover:opacity-100">
                  {coverPhotoUrl !== photo.url && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 flex-1 text-white hover:bg-white/20"
                      onClick={() => setCover(photo.url)}
                      title="Jadikan foto sampul"
                    >
                      <Star className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 flex-1 text-white hover:bg-white/20"
                    onClick={() => deletePhoto(photo.id)}
                    disabled={deletingId === photo.id}
                    title="Hapus foto"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadPhoto(file);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploading || photos.length >= 20}
            onClick={() => fileRef.current?.click()}
          >
            <ImagePlus className="h-4 w-4" />
            {uploading ? "Mengunggah..." : "Tambah foto"}
          </Button>
          <p className="mt-2 text-xs text-stone-500">JPEG, PNG, atau WebP — maks. 5 MB per foto</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </CardContent>
    </Card>
  );
}
