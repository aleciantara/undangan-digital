"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ClassifiedOperaPhotos, OperaPhotoSlotDef } from "@/lib/opera-media-core";
import { orientedCaption, type PhotoOrientation } from "@/lib/media-orientation";
import { ImagePlus, Monitor, Smartphone, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Photo = {
  id: string;
  url: string;
  caption: string | null;
};

type SlotId = Exclude<OperaPhotoSlotDef["id"], never>;

const MAX_PHOTOS = 32;

type Props = {
  invitationId: string;
  photos: Photo[];
  coverPhotoUrl: string | null;
  landscapeBackdropFill: boolean;
  slots: OperaPhotoSlotDef[];
  classifyPhotos: (photos: Photo[], coverPhotoUrl: string | null) => ClassifiedOperaPhotos;
  heroPortraitEmptyLabel?: string;
};

function UploadZone({
  inputName,
  label,
  icon: Icon,
  variant,
  imageUrl,
  uploading,
  removing,
  emptyLabel,
  onUpload,
  onRemove,
}: {
  inputName: string;
  label: string;
  icon: typeof Smartphone;
  variant: "portrait" | "landscape";
  imageUrl: string | null;
  uploading: boolean;
  removing: boolean;
  emptyLabel?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
}) {
  const isPortrait = variant === "portrait";
  const disabled = uploading || removing;

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-stone-600">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        {label}
      </div>

      <div
        className={`group relative overflow-hidden rounded-lg border border-dashed border-stone-300 bg-white transition hover:border-brand-amaranth/40 hover:bg-brand-chalk/30 ${
          isPortrait ? "aspect-[3/4] max-h-44 w-full max-w-[132px]" : "aspect-video max-h-28 w-full max-w-[200px]"
        } ${disabled ? "opacity-60" : ""}`}
      >
        <input
          name={inputName}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label={label}
          disabled={disabled}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.target.value = "";
          }}
        />

        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={label} className="pointer-events-none h-full w-full object-cover" />
        ) : (
          <div className="pointer-events-none flex h-full flex-col items-center justify-center gap-1.5 px-2 text-center">
            <ImagePlus className="h-5 w-5 text-stone-400 group-hover:text-brand-amaranth" />
            <span className="text-[11px] leading-snug text-stone-400 group-hover:text-stone-600">
              {emptyLabel ?? "Klik untuk unggah"}
            </span>
          </div>
        )}

        {imageUrl && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 z-0 bg-black/50 py-1 text-center text-[10px] text-white opacity-0 transition group-hover:opacity-100">
            {uploading ? "Mengunggah..." : "Ganti foto"}
          </span>
        )}
      </div>

      {imageUrl && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="mt-2 h-7 w-fit px-2 text-xs text-stone-500"
          disabled={uploading || removing}
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
          {removing ? "Menghapus..." : "Hapus"}
        </Button>
      )}
    </div>
  );
}

function SlotRow({
  slot,
  portraitUrl,
  landscapeUrl,
  portraitPhotoId,
  landscapePhotoId,
  busyKey,
  removingId,
  heroPortraitEmptyLabel,
  defaultOpen,
  onUpload,
  onRemove,
}: {
  slot: OperaPhotoSlotDef;
  portraitUrl: string | null;
  landscapeUrl: string | null;
  portraitPhotoId: string | null;
  landscapePhotoId: string | null;
  busyKey: string | null;
  removingId: string | null;
  heroPortraitEmptyLabel?: string;
  defaultOpen?: boolean;
  onUpload: (orientation: PhotoOrientation, file: File) => void;
  onRemove: (orientation: PhotoOrientation) => void;
}) {
  const portraitFilled = Boolean(portraitUrl);
  const landscapeFilled = Boolean(landscapeUrl);
  const filledCount = (portraitFilled ? 1 : 0) + (landscapeFilled ? 1 : 0);

  return (
    <details
      open={defaultOpen}
      className="group rounded-xl border border-stone-200 bg-stone-50/40 open:bg-stone-50/70"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 marker:content-none [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <p className="font-medium text-brand-ink">{slot.label}</p>
          <p className="mt-0.5 truncate text-xs text-stone-500">{slot.hint}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
            filledCount === 2
              ? "bg-green-100 text-green-800"
              : filledCount === 1
                ? "bg-amber-100 text-amber-800"
                : "bg-stone-200 text-stone-600"
          }`}
        >
          {filledCount === 2 ? "Lengkap" : filledCount === 1 ? "1/2" : "Kosong"}
        </span>
      </summary>

      <div className="border-t border-stone-200/80 px-4 pb-4 pt-3">
        <div className="flex flex-wrap items-start gap-4 sm:gap-6">
          <UploadZone
            inputName={`photo-${slot.id}-portrait`}
            label="Portrait (HP)"
            icon={Smartphone}
            variant="portrait"
            imageUrl={portraitUrl}
            uploading={busyKey === `${slot.id}:portrait`}
            removing={portraitPhotoId != null && removingId === portraitPhotoId}
            emptyLabel={slot.id === "hero" ? heroPortraitEmptyLabel : undefined}
            onUpload={(file) => onUpload("portrait", file)}
            onRemove={() => onRemove("portrait")}
          />
          <UploadZone
            inputName={`photo-${slot.id}-landscape`}
            label="Landscape (Desktop)"
            icon={Monitor}
            variant="landscape"
            imageUrl={landscapeUrl}
            uploading={busyKey === `${slot.id}:landscape`}
            removing={landscapePhotoId != null && removingId === landscapePhotoId}
            onUpload={(file) => onUpload("landscape", file)}
            onRemove={() => onRemove("landscape")}
          />
        </div>
      </div>
    </details>
  );
}

export function OrientedPhotoUploader({
  invitationId,
  photos,
  coverPhotoUrl,
  landscapeBackdropFill,
  slots,
  classifyPhotos,
  heroPortraitEmptyLabel,
}: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [extraUploadLabel, setExtraUploadLabel] = useState<string | null>(null);
  const [backdropFill, setBackdropFill] = useState(landscapeBackdropFill);
  const [savingBackdrop, setSavingBackdrop] = useState(false);

  const classified = useMemo(
    () => classifyPhotos(photos, coverPhotoUrl),
    [photos, coverPhotoUrl, classifyPhotos]
  );

  const slotData = (slotId: SlotId) => {
    const pair = classified[slotId];
    const portraitUrl =
      slotId === "hero" ? pair.portrait?.url ?? coverPhotoUrl : pair.portrait?.url ?? null;
    return {
      portraitUrl,
      landscapeUrl: pair.landscape?.url ?? null,
      portraitPhotoId: pair.portrait?.id ?? null,
      landscapePhotoId: pair.landscape?.id ?? null,
    };
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

  async function uploadToSlot(slotId: SlotId, orientation: PhotoOrientation, file: File) {
    const slot = slots.find((s) => s.id === slotId)!;
    const data = slotData(slotId);
    const existingId =
      orientation === "portrait" ? data.portraitPhotoId : data.landscapePhotoId;

    setError(null);
    setBusyKey(`${slotId}:${orientation}`);

    try {
      if (existingId) await deletePhoto(existingId);
      if (
        slotId === "hero" &&
        orientation === "portrait" &&
        !existingId &&
        coverPhotoUrl &&
        !data.landscapePhotoId
      ) {
        await clearCover();
      }

      const form = new FormData();
      form.append("file", file);
      form.append("caption", orientedCaption(slot.caption, orientation));
      if (slot.setCover && orientation === "portrait") {
        form.append("setCover", "true");
      }

      const res = await fetch(`/api/invitations/${invitationId}/photos`, {
        method: "POST",
        body: form,
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof body.error === "string" ? body.error : "Gagal mengunggah foto.");
      }

      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setBusyKey(null);
    }
  }

  async function removeSlot(slotId: SlotId, orientation: PhotoOrientation) {
    const data = slotData(slotId);
    const existingId =
      orientation === "portrait" ? data.portraitPhotoId : data.landscapePhotoId;

    if (slotId === "hero" && orientation === "portrait" && !existingId && coverPhotoUrl) {
      setBusyKey(`${slotId}:portrait`);
      try {
        await clearCover();
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Gagal menghapus.");
      } finally {
        setBusyKey(null);
      }
      return;
    }

    if (!existingId) return;
    if (!confirm(`Hapus foto ${orientation} untuk slot ini?`)) return;

    setRemovingId(existingId);
    setError(null);
    try {
      await deletePhoto(existingId);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus foto.");
    } finally {
      setRemovingId(null);
    }
  }

  async function saveBackdropFill(checked: boolean) {
    setBackdropFill(checked);
    setSavingBackdrop(true);
    setError(null);
    try {
      const res = await fetch(`/api/invitations/${invitationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ landscapeBackdropFill: checked }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof body.error === "string" ? body.error : "Gagal menyimpan pengaturan."
        );
      }
      router.refresh();
    } catch (e) {
      setBackdropFill(!checked);
      setError(e instanceof Error ? e.message : "Gagal menyimpan pengaturan.");
    } finally {
      setSavingBackdrop(false);
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
    const remaining = Math.max(0, MAX_PHOTOS - photos.length);
    if (remaining === 0) {
      setError(`Maksimal ${MAX_PHOTOS} foto per undangan.`);
      return;
    }

    const batch = files.slice(0, remaining);
    setBusyKey("extra");
    let uploaded = 0;
    try {
      for (const file of batch) {
        uploaded += 1;
        setExtraUploadLabel(`Mengunggah ${uploaded}/${batch.length}...`);
        await uploadSingleExtra(file);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setBusyKey(null);
      setExtraUploadLabel(null);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Foto undangan ({photos.length}/{MAX_PHOTOS})</CardTitle>
        <p className="text-sm text-stone-600">
          Klik kotak foto untuk memilih gambar. Portrait untuk HP, landscape untuk browser lebar.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {slots.map((slot, index) => {
            const data = slotData(slot.id);
            return (
              <SlotRow
                key={slot.id}
                slot={slot}
                portraitUrl={data.portraitUrl}
                landscapeUrl={data.landscapeUrl}
                portraitPhotoId={data.portraitPhotoId}
                landscapePhotoId={data.landscapePhotoId}
                busyKey={busyKey}
                removingId={removingId}
                heroPortraitEmptyLabel={slot.id === "hero" ? heroPortraitEmptyLabel : undefined}
                defaultOpen={index === 0}
                onUpload={(orientation, file) => uploadToSlot(slot.id, orientation, file)}
                onRemove={(orientation) => removeSlot(slot.id, orientation)}
              />
            );
          })}
        </div>

        <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="mt-1"
              checked={backdropFill}
              disabled={savingBackdrop}
              onChange={(e) => saveBackdropFill(e.target.checked)}
            />
            <span className="text-sm text-stone-700">
              <span className="font-medium text-brand-ink">Mode portrait di desktop</span>
              <span className="mt-1 block text-xs leading-relaxed text-stone-500">
                Aktifkan jika hanya ada foto landscape — undangan tampil kolom portrait di kanan
                (desktop), foto landscape mengisi penuh panel kiri (tidak tertutup undangan).
              </span>
            </span>
          </label>
        </div>

        <div className="rounded-xl border border-stone-200 p-4">
          <p className="font-medium text-brand-ink">Galeri tambahan</p>
          <p className="mt-1 text-xs text-stone-500">Opsional — untuk carousel di undangan.</p>

          {classified.extras.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {classified.extras.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-stone-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    className="absolute inset-x-0 bottom-0 bg-black/55 py-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100"
                    onClick={async () => {
                      if (!confirm("Hapus foto dari galeri tambahan?")) return;
                      setRemovingId(photo.id);
                      try {
                        await deletePhoto(photo.id);
                        router.refresh();
                      } catch (e) {
                        setError(e instanceof Error ? e.message : "Gagal menghapus.");
                      } finally {
                        setRemovingId(null);
                      }
                    }}
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative mt-3 inline-flex">
            <input
              name={`gallery-extra-${invitationId}`}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              aria-label="Tambah ke galeri"
              disabled={busyKey === "extra" || photos.length >= MAX_PHOTOS}
              className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length > 0) uploadExtras(files);
                e.target.value = "";
              }}
            />
            <span
              className={`pointer-events-none inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 transition hover:border-brand-amaranth/40 hover:bg-brand-chalk/30 ${
                busyKey === "extra" || photos.length >= MAX_PHOTOS ? "opacity-50" : ""
              }`}
            >
              <ImagePlus className="h-4 w-4" />
              {busyKey === "extra"
                ? (extraUploadLabel ?? "Mengunggah...")
                : "Tambah ke galeri"}
            </span>
          </div>
        </div>

        <p className="text-xs text-stone-500">JPEG, PNG, atau WebP — maks. 5 MB per foto</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </CardContent>
    </Card>
  );
}
