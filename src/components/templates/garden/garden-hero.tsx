"use client";

import { useEffect, useRef, useState } from "react";

type Photo = { url: string };

type Props = {
  groomName: string;
  brideName: string;
  displayGroom: string;
  displayBride: string;
  accentColor: string;
  primaryColor: string;
  coverPhotoUrl?: string | null;
  galleryPhotos?: Photo[];
};

export function GardenHero({
  groomName,
  brideName,
  displayGroom,
  displayBride,
  accentColor,
  primaryColor,
  coverPhotoUrl,
  galleryPhotos = [],
}: Props) {
  const [ready, setReady] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  const previewPhotos = galleryPhotos
    .filter((p) => p.url !== coverPhotoUrl)
    .slice(0, 3);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!coverPhotoUrl) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const hero = heroRef.current;
    const layer = parallaxRef.current;
    if (!hero || !layer) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, -rect.top / (rect.height * 0.9)));
        layer.style.transform = `translate3d(0, ${progress * 100}px, 0) scale(${1.06 + progress * 0.06})`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [coverPhotoUrl]);

  if (coverPhotoUrl) {
    return (
      <header
        ref={heroRef}
        className="garden-hero garden-hero--photo relative z-10 min-h-[100svh] overflow-hidden"
        style={{ "--hero-accent": accentColor, "--hero-primary": primaryColor } as React.CSSProperties}
      >
        <div ref={parallaxRef} className="garden-hero__parallax absolute inset-0 will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverPhotoUrl} alt="" className="h-[110%] w-full object-cover object-center" />
        </div>
        <div className="garden-hero__photo-fade absolute inset-0" />

        <div className="garden-hero__content relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 py-20 text-center sm:py-24">
          <div className="garden-hero__name-scrim" aria-hidden />
          <HeroBlock
            groomName={groomName}
            brideName={brideName}
            displayGroom={displayGroom}
            displayBride={displayBride}
            accentColor={accentColor}
            primaryColor={primaryColor}
            ready={ready}
            onPhoto
          />
        </div>
      </header>
    );
  }

  return (
    <header
      ref={heroRef}
      className="garden-hero garden-hero--bold relative z-10 overflow-hidden px-4 pb-16 pt-28 text-center sm:pb-20 sm:pt-36"
      style={{ "--hero-accent": accentColor, "--hero-primary": primaryColor } as React.CSSProperties}
    >
      <div className="garden-hero__accent-bar pointer-events-none absolute left-0 top-0 h-1.5 w-full" aria-hidden />

      <p
        className={`garden-hero__eyebrow text-[0.65rem] font-bold uppercase tracking-[0.6em] ${ready ? "garden-hero__eyebrow--in" : ""}`}
        style={{ color: accentColor }}
      >
        Undangan Pernikahan
      </p>

      <HeroBlock
        groomName={groomName}
        brideName={brideName}
        displayGroom={displayGroom}
        displayBride={displayBride}
        accentColor={accentColor}
        primaryColor={primaryColor}
        ready={ready}
      />

      {previewPhotos.length > 0 && (
        <div
          className={`garden-hero__strip relative z-10 mx-auto mt-12 grid max-w-lg gap-2 sm:mt-16 ${
            previewPhotos.length === 1 ? "grid-cols-1" : previewPhotos.length === 2 ? "grid-cols-2" : "grid-cols-3"
          }`}
        >
          {previewPhotos.map((photo, i) => (
            <div
              key={photo.url}
              className={`garden-hero__strip-photo overflow-hidden ${ready ? "garden-hero__strip-photo--in" : ""}`}
              style={{ "--strip-delay": `${i * 100}ms` } as React.CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt="" className="aspect-[4/5] w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </header>
  );
}

function HeroBlock({
  groomName,
  brideName,
  displayGroom,
  displayBride,
  accentColor,
  primaryColor,
  ready,
  onPhoto = false,
}: {
  groomName: string;
  brideName: string;
  displayGroom: string;
  displayBride: string;
  accentColor: string;
  primaryColor: string;
  ready: boolean;
  onPhoto?: boolean;
}) {
  return (
    <div className={`relative z-10 mx-auto w-full max-w-5xl ${onPhoto ? "" : "mt-10 sm:mt-14"}`}>
      <h1 className="garden-hero__title font-invitation text-center font-semibold leading-[0.9]">
        <span
          className={`garden-hero__name block ${onPhoto ? "garden-hero__name--light" : "garden-hero__name--groom"} ${ready ? "garden-hero__name--in" : ""}`}
          style={onPhoto ? undefined : ({ "--name-color": primaryColor } as React.CSSProperties)}
        >
          {groomName}
        </span>

        <span
          className={`garden-hero__amp my-2 block font-invitation font-normal sm:my-3 ${ready ? "garden-hero__name--in garden-hero__name--delay-1" : ""} ${onPhoto ? "garden-hero__amp--light" : ""}`}
          style={{ color: accentColor }}
        >
          &
        </span>

        <span
          className={`garden-hero__name block ${onPhoto ? "garden-hero__name--light" : "garden-hero__name--bride"} ${ready ? "garden-hero__name--in garden-hero__name--delay-2" : ""}`}
          style={onPhoto ? undefined : ({ "--name-color": accentColor } as React.CSSProperties)}
        >
          {brideName}
        </span>
      </h1>

      <div
        className={`garden-hero__rule mx-auto mt-8 h-px w-24 ${ready ? "garden-hero__rule--in" : ""}`}
        style={{ backgroundColor: accentColor }}
        aria-hidden
      />

      <p
        className={`mt-6 text-xs font-semibold uppercase tracking-[0.35em] sm:text-sm ${
          onPhoto ? "text-white/90" : "text-inv-muted"
        } ${ready ? "garden-hero__sub--in" : "opacity-0"}`}
      >
        {displayGroom}
        <span className="mx-2 opacity-40">·</span>
        {displayBride}
      </p>
    </div>
  );
}
