"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HIMMEL_PHOTO_SLOTS,
  classifyHimmelDashboardPhotos,
  type HimmelPhotoSlotId,
} from "@/lib/himmel-media";
import { ImagePlus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

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

function SlotCard({
  label,
  hint,
  imageUrl,
  uploading,
  onUpload,
  onRemove,
  removing,
  emptyLabel,
}: {
  label: string;
  hint: string;
  imageUrl: string | null;
  uploading: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
  removing: boolean;
  emptyLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100 sm:w-36">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={label} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 px-3 text-center text-xs text-stone-400">
              <span>{emptyLabel ?? "Belum diunggah"}</span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-medium text-brand-ink">{label}</p>
          <p className="mt-1 text-xs leading-relaxed text-stone-500">{hint}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file);
                e.target.value = "";
              }}
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={uploading || removing}
              onClick={() => inputRef.current?.click()}
            >
              <ImagePlus className="h-3.5 w-3.5" />
              {uploading ? "Mengunggah..." : imageUrl ? "Ganti foto" : "Unggah foto"}
            </Button>
            {imageUrl && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={uploading || removing}
                onClick={onRemove}
              >
                <Trash2 className="h-3.5 w-3.5" />
                {removing ? "Menghapus..." : "Hapus"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HimmelPhotoUploader({ invitationId, photos, coverPhotoUrl }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busySlot, setBusySlot] = useState<HimmelPhotoSlotId | "extra" | null>(null);
  const [extraUploadLabel, setExtraUploadLabel] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const extraInputRef = useRef<HTMLInputElement>(null);

  const classified = useMemo(
    () => classifyHimmelDashboardPhotos(photos, coverPhotoUrl),
    [photos, coverPhotoUrl]
  );

  const slotPhoto: Record<Exclude<HimmelPhotoSlotId, "extra">, Photo | null> = {
    hero: classified.heroPhoto,
    groom: classified.groom,
    bride: classified.bride,
    coupleBg: classified.coupleBg,
    accentBg: classified.accentBg,
    footerBg: classified.footerBg,
  };

  const slotUrl: Record<Exclude<HimmelPhotoSlotId, "extra">, string | null> = {
    hero: classified.heroUrl,
    groom: classified.groom?.url ?? null,
    bride: classified.bride?.url ?? null,
    coupleBg: classified.coupleBg?.url ?? null,
    accentBg: classified.accentBg?.url ?? null,
    footerBg: classified.footerBg?.url ?? null,
  };

  async function deletePhoto(photoId: string) {
    const res = await fetch(`/api/invitations/${invitationId}/photos/${photoId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Gagal menghapus foto.");
  }

  async function clearCover() {
    const res = await fetch(`/api/invitations/${invitationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coverPhotoUrl: null }),
    });
    if (!res.ok) throw new Error("Gagal menghapus latar hero.");
  }

  async function uploadToSlot(
    slotId: Exclude<HimmelPhotoSlotId, "extra">,
    file: File
  ) {
    const slot = HIMMEL_PHOTO_SLOTS.find((s) => s.id === slotId)!;
    const existing = slotPhoto[slotId];

    setError(null);
    setBusySlot(slotId);

    try {
      if (existing) await deletePhoto(existing.id);
      if (slotId === "hero" && !existing && coverPhotoUrl) {
        await clearCover();
      }

      const form = new FormData();
      form.append("file", file);
      form.append("caption", slot.caption);
      if (slot.setCover) form.append("setCover", "true");

      const res = await fetch(`/api/invitations/${invitationId}/photos`, {
        method: "POST",
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Gagal mengunggah foto.");
      }

      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setBusySlot(null);
    }
  }

  async function removeSlot(slotId: Exclude<HimmelPhotoSlotId, "extra">) {
    const existing = slotPhoto[slotId];
    if (!existing && slotId === "hero" && coverPhotoUrl) {
      setBusySlot(slotId);
      try {
        await clearCover();
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Gagal menghapus.");
      } finally {
        setBusySlot(null);
      }
      return;
    }
    if (!existing) return;
    if (!confirm(`Hapus foto ${HIMMEL_PHOTO_SLOTS.find((s) => s.id === slotId)?.label}?`)) return;

    setRemovingId(existing.id);
    setError(null);
    try {
      await deletePhoto(existing.id);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus foto.");
    } finally {
      setRemovingId(null);
    }
  }

  async function uploadSingleExtra(file: File) {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`/api/invitations/${invitationId}/photos`, {
      method: "POST",
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(typeof data.error === "string" ? data.error : "Gagal mengunggah foto.");
    }
  }

  async function uploadExtras(files: File[]) {
    const remaining = Math.max(0, 20 - photos.length);
    if (remaining === 0) {
      setError("Maksimal 20 foto per undangan.");
      return;
    }

    const batch = files.slice(0, remaining);
    if (files.length > remaining) {
      setError(`Hanya ${remaining} slot tersisa — mengunggah ${remaining} foto pertama.`);
    } else {
      setError(null);
    }

    setBusySlot("extra");

    let uploaded = 0;
    try {
      for (const file of batch) {
        uploaded += 1;
        setExtraUploadLabel(`Mengunggah ${uploaded}/${batch.length}...`);
        await uploadSingleExtra(file);
      }
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Terjadi kesalahan.";
      if (uploaded > 1) {
        setError(`${uploaded - 1} foto berhasil. ${message}`);
        router.refresh();
      } else if (uploaded === 1) {
        setError(message);
      } else {
        setError(message);
      }
    } finally {
      setBusySlot(null);
      setExtraUploadLabel(null);
    }
  }

  async function removeExtra(photoId: string) {
    if (!confirm("Hapus foto dari galeri tambahan?")) return;
    setRemovingId(photoId);
    setError(null);
    try {
      await deletePhoto(photoId);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus foto.");
    } finally {
      setRemovingId(null);
    }
  }

  const totalCount = photos.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Foto undangan ({totalCount}/20)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-stone-600">
          Unggah foto per bagian undangan. Slot latar hero kosong memakai animasi bunga; slot
          lainnya kosong memakai gambar tema default di pratinjau.
        </p>

        <div className="space-y-4">
          {HIMMEL_PHOTO_SLOTS.map((slot) => (
            <SlotCard
              key={slot.id}
              label={slot.label}
              hint={slot.hint}
              imageUrl={slotUrl[slot.id]}
              emptyLabel={slot.id === "hero" && !slotUrl.hero ? "Animasi bunga" : undefined}
              uploading={busySlot === slot.id}
              removing={removingId === slotPhoto[slot.id]?.id}
              onUpload={(file) => uploadToSlot(slot.id, file)}
              onRemove={() => removeSlot(slot.id)}
            />
          ))}
        </div>

        <div className="border-t border-stone-100 pt-6">
          <p className="font-medium text-brand-ink">Galeri tambahan</p>
          <p className="mt-1 text-xs text-stone-500">
            Foto ekstra untuk carousel galeri di undangan (opsional). Bisa pilih beberapa foto
            sekaligus.
          </p>

          {classified.extras.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {classified.extras.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-stone-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    className="absolute inset-x-0 bottom-0 bg-black/55 py-1.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
                    onClick={() => removeExtra(photo.id)}
                    disabled={removingId === photo.id}
                  >
                    {removingId === photo.id ? "Menghapus..." : "Hapus"}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3">
            <input
              ref={extraInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length > 0) uploadExtras(files);
                e.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busySlot === "extra" || totalCount >= 20}
              onClick={() => extraInputRef.current?.click()}
            >
              <ImagePlus className="h-4 w-4" />
              {busySlot === "extra"
                ? (extraUploadLabel ?? "Mengunggah...")
                : "Tambah ke galeri"}
            </Button>
          </div>
        </div>

        <p className="text-xs text-stone-500">JPEG, PNG, atau WebP — maks. 5 MB per foto</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </CardContent>
    </Card>
  );
}
