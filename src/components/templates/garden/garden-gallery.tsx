"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { GardenSectionHeading } from "./garden-section-heading";

type Photo = { id: string; url: string; caption?: string | null };

type Props = {
  photos: Photo[];
  coverPhotoUrl?: string | null;
  accentColor: string;
  primaryColor: string;
};

function galleryOnly(coverPhotoUrl: string | null | undefined, photos: Photo[]) {
  if (!coverPhotoUrl) return photos;
  return photos.filter((p) => p.url !== coverPhotoUrl);
}

export function GardenGallery({ photos, coverPhotoUrl, accentColor, primaryColor }: Props) {
  const items = galleryOnly(coverPhotoUrl, photos);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    if (!slide) return;
    const offset = slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2;
    track.scrollTo({ left: offset, behavior: "smooth" });
    setActive(index);
  }, []);

  const onTrackScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const slideCenter = el.offsetLeft + el.clientWidth / 2;
      const dist = Math.abs(center - slideCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActive(closest);
  }, []);

  const openLightbox = useCallback((index: number) => {
    setLightbox(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const stepLightbox = useCallback(
    (delta: number) => {
      setLightbox((current) => {
        if (current === null) return null;
        return (current + delta + items.length) % items.length;
      });
    },
    [items.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") stepLightbox(-1);
      if (e.key === "ArrowRight") stepLightbox(1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, closeLightbox, stepLightbox]);

  if (items.length === 0) return null;

  return (
    <section
      className="garden-gallery-zone relative px-4 pb-24 pt-4"
      style={{ "--gallery-accent": accentColor, "--gallery-primary": primaryColor } as React.CSSProperties}
    >
      <GardenSectionHeading index="04" accentColor={accentColor} primaryColor={primaryColor} align="center">
        Galeri Lengkap
      </GardenSectionHeading>

      <div className="garden-gallery-carousel mx-auto max-w-5xl">
        <div
          ref={trackRef}
          className="garden-gallery-carousel__track"
          onScroll={onTrackScroll}
          aria-label="Galeri foto — geser untuk melihat"
        >
          {items.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              className={`garden-gallery-carousel__slide ${i === active ? "garden-gallery-carousel__slide--active" : ""}`}
              onClick={() => openLightbox(i)}
              aria-label={photo.caption ?? `Foto ${i + 1}`}
            >
              <span className="garden-gallery-carousel__frame garden-photo-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.caption ?? ""} loading={i < 2 ? "eager" : "lazy"} />
              </span>
              {photo.caption && <span className="garden-gallery-carousel__caption">{photo.caption}</span>}
            </button>
          ))}
        </div>

        <div className="garden-gallery-carousel__controls">
          <button
            type="button"
            className="garden-gallery-carousel__arrow"
            onClick={() => scrollToIndex(Math.max(0, active - 1))}
            disabled={active === 0}
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>

          <div className="garden-gallery-carousel__meta">
            <span className="garden-gallery-carousel__counter font-mono">
              {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
            <div className="garden-gallery-carousel__dots" role="tablist" aria-label="Indikator foto">
              {items.map((photo, i) => (
                <button
                  key={photo.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Foto ${i + 1}`}
                  className={`garden-gallery-carousel__dot ${i === active ? "garden-gallery-carousel__dot--active" : ""}`}
                  onClick={() => scrollToIndex(i)}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            className="garden-gallery-carousel__arrow"
            onClick={() => scrollToIndex(Math.min(items.length - 1, active + 1))}
            disabled={active === items.length - 1}
            aria-label="Foto berikutnya"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <p className="garden-gallery-carousel__hint">Geser atau ketuk foto untuk memperbesar</p>
      </div>

      {lightbox !== null && (
        <div className="garden-lightbox" role="dialog" aria-modal="true" aria-label="Pratinjau foto">
          <button type="button" className="garden-lightbox__close" onClick={closeLightbox} aria-label="Tutup">
            <X className="h-6 w-6" aria-hidden />
          </button>

          <button
            type="button"
            className="garden-lightbox__nav garden-lightbox__nav--prev"
            onClick={() => stepLightbox(-1)}
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft className="h-7 w-7" aria-hidden />
          </button>

          <figure className="garden-lightbox__figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={items[lightbox].url} alt={items[lightbox].caption ?? ""} className="garden-lightbox__img" />
            {items[lightbox].caption && (
              <figcaption className="garden-lightbox__caption">{items[lightbox].caption}</figcaption>
            )}
          </figure>

          <button
            type="button"
            className="garden-lightbox__nav garden-lightbox__nav--next"
            onClick={() => stepLightbox(1)}
            aria-label="Foto berikutnya"
          >
            <ChevronRight className="h-7 w-7" aria-hidden />
          </button>

          <p className="garden-lightbox__counter font-mono">
            {lightbox + 1} / {items.length}
          </p>
        </div>
      )}
    </section>
  );
}
