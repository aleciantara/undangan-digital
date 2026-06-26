"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { GardenReveal } from "./garden-reveal";
import { GardenSectionHeading } from "./garden-section-heading";

type Photo = { id: string; url: string; caption?: string | null };

type Props = {
  photos: Photo[];
  coverPhotoUrl?: string | null;
  accentColor: string;
  primaryColor: string;
  groomName: string;
  brideName: string;
};

function uniquePhotos(coverPhotoUrl: string | null | undefined, photos: Photo[]) {
  const seen = new Set<string>();
  const items: { id: string; url: string; caption?: string | null }[] = [];

  if (coverPhotoUrl && !seen.has(coverPhotoUrl)) {
    seen.add(coverPhotoUrl);
    items.push({ id: "cover", url: coverPhotoUrl, caption: "Foto sampul" });
  }

  for (const photo of photos) {
    if (!seen.has(photo.url)) {
      seen.add(photo.url);
      items.push(photo);
    }
  }

  return items;
}

export function GardenPhotoShowcase({
  photos,
  coverPhotoUrl,
  accentColor,
  primaryColor,
  groomName,
  brideName,
}: Props) {
  const all = uniquePhotos(coverPhotoUrl, photos);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, closeLightbox]);

  if (all.length === 0) return null;

  return (
    <section
      className="garden-moments-zone relative px-4 pb-20 sm:pb-28"
      style={{ "--moments-accent": accentColor, "--moments-primary": primaryColor } as React.CSSProperties}
    >
      <GardenSectionHeading index="✦" accentColor={accentColor} primaryColor={primaryColor} align="center">
        Momen Kami
      </GardenSectionHeading>

      <div className="garden-moments relative z-10 mx-auto max-w-5xl">
        {all.map((photo, i) => (
          <GardenReveal key={photo.id} variant="up" delay={i * 55} className="w-full">
            <button
              type="button"
              className={`garden-moments__item ${i === 0 ? "garden-moments__item--lead" : ""}`}
              onClick={() => setLightbox(i)}
              aria-label={photo.caption ?? `Foto ${i + 1}`}
            >
              <span className="garden-moments__frame garden-photo-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption ?? `Foto ${groomName} & ${brideName}`}
                  loading={i < 2 ? "eager" : "lazy"}
                />
              </span>
              {photo.caption && <span className="garden-moments__caption">{photo.caption}</span>}
            </button>
          </GardenReveal>
        ))}
      </div>

      <p className="garden-moments__hint relative z-10">Ketuk foto untuk memperbesar</p>

      {lightbox !== null && (
        <div className="garden-lightbox" role="dialog" aria-modal="true" aria-label="Pratinjau foto">
          <button type="button" className="garden-lightbox__close" onClick={closeLightbox} aria-label="Tutup">
            <X className="h-6 w-6" aria-hidden />
          </button>
          <figure className="garden-lightbox__figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={all[lightbox].url} alt={all[lightbox].caption ?? ""} className="garden-lightbox__img" />
            {all[lightbox].caption && (
              <figcaption className="garden-lightbox__caption">{all[lightbox].caption}</figcaption>
            )}
          </figure>
        </div>
      )}
    </section>
  );
}
