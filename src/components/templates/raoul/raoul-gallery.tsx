"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { RaoulSectionHeading } from "./raoul-section-heading";
import { RaoulReveal } from "./raoul-reveal";

type Photo = { id: string; url: string; caption?: string | null };

function invitationCaption(caption?: string | null): string | null {
  if (!caption?.trim()) return null;
  const normalized = caption.trim().toLowerCase();
  if (normalized === "galeri") return null;
  return caption.trim();
}

type Props = {
  photos: Photo[];
  accentColor: string;
  primaryColor: string;
  sectionIndex?: string;
};

export function RaoulGallery({ photos, accentColor, primaryColor, sectionIndex }: Props) {
  const items = photos;
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

  const closeLightbox = useCallback(() => setLightbox(null), []);

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
    <div className="raoul-gallery-section relative px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <RaoulSectionHeading index={sectionIndex} accentColor={accentColor} primaryColor={primaryColor}>
          Galeri di Bawah Sinar Matahari
        </RaoulSectionHeading>

        <RaoulReveal variant="up">
          <div
            className="raoul-gallery"
            style={{ "--gal-accent": accentColor, "--gal-primary": primaryColor } as React.CSSProperties}
          >
            <div ref={trackRef} className="raoul-gallery__track" onScroll={onTrackScroll}>
              {items.map((photo, i) => {
                const label = invitationCaption(photo.caption);
                return (
                  <button
                    key={photo.id}
                    type="button"
                    className="raoul-gallery__slide"
                    onClick={() => setLightbox(i)}
                    aria-label={label ?? `Foto ${i + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt={label ?? ""} className="raoul-gallery__img" loading="lazy" decoding="async" />
                    {label && <span className="raoul-gallery__caption">{label}</span>}
                  </button>
                );
              })}
            </div>

            <div className="raoul-gallery__nav">
              <button
                type="button"
                className="raoul-gallery__arrow"
                onClick={() => scrollToIndex(Math.max(0, active - 1))}
                disabled={active === 0}
                aria-label="Foto sebelumnya"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="raoul-gallery__dots">
                {items.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`raoul-gallery__dot ${i === active ? "raoul-gallery__dot--active" : ""}`}
                    onClick={() => scrollToIndex(i)}
                    aria-label={`Foto ${i + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className="raoul-gallery__arrow"
                onClick={() => scrollToIndex(Math.min(items.length - 1, active + 1))}
                disabled={active === items.length - 1}
                aria-label="Foto berikutnya"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </RaoulReveal>
      </div>

      {lightbox !== null && (() => {
        const current = items[lightbox];
        const label = invitationCaption(current.caption);
        return (
          <div className="raoul-lightbox" role="dialog" aria-modal="true" onClick={closeLightbox}>
            <button
              type="button"
              className="raoul-lightbox__close"
              onClick={closeLightbox}
              aria-label="Tutup"
            >
              <X className="h-6 w-6" />
            </button>
            <button
              type="button"
              className="raoul-lightbox__prev"
              onClick={(e) => {
                e.stopPropagation();
                stepLightbox(-1);
              }}
              aria-label="Foto sebelumnya"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.url}
              alt={label ?? ""}
              className="raoul-lightbox__img"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              className="raoul-lightbox__next"
              onClick={(e) => {
                e.stopPropagation();
                stepLightbox(1);
              }}
              aria-label="Foto berikutnya"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
            {label && <p className="raoul-lightbox__caption">{label}</p>}
          </div>
        );
      })()}
    </div>
  );
}
