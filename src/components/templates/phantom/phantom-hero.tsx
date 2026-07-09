"use client";

import { ResponsiveMediaImage } from "@/components/invitation/responsive-media-image";
import type { ResponsiveSlotMedia } from "@/lib/responsive-media";
import { useEffect, useState } from "react";

type Props = {
  groomName: string;
  brideName: string;
  displayGroom: string;
  displayBride: string;
  accentColor: string;
  primaryColor: string;
  heroBg: ResponsiveSlotMedia;
};

export function PhantomHero({
  groomName,
  brideName,
  displayGroom,
  displayBride,
  accentColor,
  primaryColor,
  heroBg,
}: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <header
      className="phantom-hero relative z-10 min-h-[100svh] overflow-hidden"
      style={{ "--hero-accent": accentColor, "--hero-primary": primaryColor } as React.CSSProperties}
    >
      <div className="phantom-hero__parallax absolute inset-0">
        <ResponsiveMediaImage
          media={heroBg}
          alt=""
          className="h-[115%] w-full object-cover object-center"
          fetchPriority="high"
        />
      </div>
      <div className="phantom-hero__veil absolute inset-0" aria-hidden />
      <div className="phantom-hero__rose-glow absolute inset-0" aria-hidden />

      <div className="phantom-hero__content relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 py-20 text-center sm:py-24">
        <p
          className={`phantom-hero__eyebrow text-[0.6rem] font-semibold uppercase tracking-[0.65em] sm:text-[0.65rem] ${ready ? "phantom-hero__eyebrow--in" : ""}`}
        >
          The Wedding of
        </p>

        <h1 className="phantom-hero__title font-invitation mt-10 font-semibold leading-[0.92] sm:mt-14">
          <span className={`phantom-hero__name block ${ready ? "phantom-hero__name--in" : ""}`}>
            {groomName}
          </span>
          <span
            className={`phantom-hero__amp my-3 block font-invitation font-normal sm:my-4 ${ready ? "phantom-hero__name--in phantom-hero__name--delay-1" : ""}`}
            style={{ color: accentColor }}
          >
            &
          </span>
          <span
            className={`phantom-hero__name block ${ready ? "phantom-hero__name--in phantom-hero__name--delay-2" : ""}`}
          >
            {brideName}
          </span>
        </h1>

        <div
          className={`phantom-hero__ornament mx-auto mt-8 ${ready ? "phantom-hero__ornament--in" : ""}`}
          aria-hidden
        >
          <span className="phantom-hero__rose">✦</span>
        </div>

        <p
          className={`phantom-hero__subtitle mt-6 text-xs font-medium uppercase tracking-[0.35em] sm:text-sm ${ready ? "phantom-hero__subtitle--in" : ""}`}
        >
          {displayGroom}
          <span className="mx-2 opacity-50">·</span>
          {displayBride}
        </p>

        <p className={`phantom-hero__tagline mt-4 font-invitation italic ${ready ? "phantom-hero__tagline--in" : ""}`}>
          Angel of Music, guide us to this night
        </p>
      </div>

      <div className="phantom-hero__scroll-hint absolute bottom-8 left-1/2 z-10 -translate-x-1/2" aria-hidden>
        <span className="phantom-hero__scroll-line" />
      </div>
    </header>
  );
}
