"use client";

import { useEffect, useState } from "react";
import type { HimmelHeroMode } from "@/lib/himmel-media";
import { HimmelHeroMeadow } from "./himmel-hero-meadow";

type Props = {
  groomName: string;
  brideName: string;
  displayGroom: string;
  displayBride: string;
  accentColor: string;
  primaryColor: string;
  heroMode: HimmelHeroMode;
  heroBg?: string | null;
};

export function HimmelHero({
  groomName,
  brideName,
  displayGroom,
  displayBride,
  accentColor,
  primaryColor,
  heroMode,
  heroBg,
}: Props) {
  const [ready, setReady] = useState(false);
  const useFlowers = heroMode === "flowers";

  useEffect(() => {
    setReady(true);
  }, []);

  const initials = `${groomName.charAt(0)}${brideName.charAt(0)}`.toUpperCase();

  return (
    <header
      className={`himmel-hero relative z-10 min-h-[100svh] overflow-hidden ${useFlowers ? "himmel-hero--flowers" : "himmel-hero--photo"}`}
      style={{ "--hero-accent": accentColor, "--hero-primary": primaryColor } as React.CSSProperties}
    >
      {useFlowers ? (
        <HimmelHeroMeadow />
      ) : (
        <div className="himmel-hero__parallax absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroBg!}
            alt=""
            className="h-[115%] w-full object-cover object-center"
            fetchPriority="high"
          />
        </div>
      )}
      <div className="himmel-hero__veil absolute inset-0" aria-hidden />
      <div className="himmel-hero__sun-glow absolute inset-0" aria-hidden />

      <div className="himmel-hero__content relative z-[2] flex min-h-[100svh] flex-col items-center justify-end px-4 pb-16 pt-24 sm:justify-center sm:pb-24 sm:pt-20">
        <div className={`himmel-hero__card himmel-surface ${ready ? "himmel-hero__card--in" : ""}`}>
          <div className="himmel-hero__card-glow" aria-hidden />
          <div className="himmel-hero__card-frame" aria-hidden>
            <span className="himmel-hero__card-petal himmel-hero__card-petal--tl" />
            <span className="himmel-hero__card-petal himmel-hero__card-petal--tr" />
            <span className="himmel-hero__card-petal himmel-hero__card-petal--bl" />
            <span className="himmel-hero__card-petal himmel-hero__card-petal--br" />
          </div>
          <div className="himmel-hero__card-inner text-center">
            <p className="himmel-hero__eyebrow">Himmel & Frieren</p>

            <div className="himmel-hero__crest" aria-hidden>
              <span className="himmel-hero__crest-petal">✿</span>
              <span className="himmel-hero__crest-monogram font-invitation">{initials}</span>
              <span className="himmel-hero__crest-petal">✿</span>
            </div>

            <p className={`himmel-hero__pretitle ${ready ? "himmel-hero__pretitle--in" : ""}`}>
              The Wedding of
            </p>

            <h1 className="himmel-hero__title font-invitation mt-4 font-semibold leading-[0.95]">
              <span className={`himmel-hero__name block ${ready ? "himmel-hero__name--in" : ""}`}>
                {groomName}
              </span>
              <span
                className={`himmel-hero__amp my-2 block font-invitation font-normal sm:my-3 ${ready ? "himmel-hero__name--in himmel-hero__name--delay-1" : ""}`}
              >
                &
              </span>
              <span
                className={`himmel-hero__name block ${ready ? "himmel-hero__name--in himmel-hero__name--delay-2" : ""}`}
              >
                {brideName}
              </span>
            </h1>

            <div className="himmel-hero__rule" aria-hidden />

            <p
              className={`himmel-hero__subtitle mt-5 text-[0.65rem] font-medium uppercase tracking-[0.4em] sm:text-xs ${ready ? "himmel-hero__subtitle--in" : ""}`}
            >
              {displayGroom}
              <span className="himmel-hero__dot" aria-hidden>
                ◆
              </span>
              {displayBride}
            </p>

            <p className={`himmel-hero__tagline mt-4 font-invitation italic ${ready ? "himmel-hero__tagline--in" : ""}`}>
              Will you come with me to see the flowers?
            </p>
          </div>
        </div>
      </div>

      <div className="himmel-hero__scroll-hint absolute bottom-8 left-1/2 z-[2] -translate-x-1/2" aria-hidden>
        <span className="himmel-hero__scroll-line" />
      </div>
    </header>
  );
}
