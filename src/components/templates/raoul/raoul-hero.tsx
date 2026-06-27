"use client";

import { useEffect, useState } from "react";

type Props = {
  groomName: string;
  brideName: string;
  displayGroom: string;
  displayBride: string;
  accentColor: string;
  primaryColor: string;
  heroBg: string;
};

export function RaoulHero({
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

  const initials = `${groomName.charAt(0)}${brideName.charAt(0)}`.toUpperCase();

  return (
    <header
      className="raoul-hero relative z-10 min-h-[100svh] overflow-hidden"
      style={{ "--hero-accent": accentColor, "--hero-primary": primaryColor } as React.CSSProperties}
    >
      <div className="raoul-hero__parallax absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroBg} alt="" className="h-[115%] w-full object-cover object-center" fetchPriority="high" />
      </div>
      <div className="raoul-hero__veil absolute inset-0" aria-hidden />
      <div className="raoul-hero__sun-glow absolute inset-0" aria-hidden />

      <div className="raoul-hero__content relative z-10 flex min-h-[100svh] flex-col items-center justify-end px-4 pb-16 pt-24 sm:justify-center sm:pb-24 sm:pt-20">
        <div className={`raoul-hero__card ${ready ? "raoul-hero__card--in" : ""}`}>
          <div className="raoul-hero__card-frame" aria-hidden />
          <div className="raoul-hero__card-inner text-center">
            <p className="raoul-hero__eyebrow">A Morning at the Opera</p>

            <div className="raoul-hero__crest" aria-hidden>
              <span className="raoul-hero__crest-line" />
              <span className="raoul-hero__crest-monogram font-invitation">{initials}</span>
              <span className="raoul-hero__crest-line" />
            </div>

            <p
              className={`raoul-hero__pretitle ${ready ? "raoul-hero__pretitle--in" : ""}`}
            >
              The Wedding of
            </p>

            <h1 className="raoul-hero__title font-invitation mt-4 font-semibold leading-[0.95]">
              <span className={`raoul-hero__name block ${ready ? "raoul-hero__name--in" : ""}`}>
                {groomName}
              </span>
              <span
                className={`raoul-hero__amp my-2 block font-invitation font-normal sm:my-3 ${ready ? "raoul-hero__name--in raoul-hero__name--delay-1" : ""}`}
              >
                &
              </span>
              <span
                className={`raoul-hero__name block ${ready ? "raoul-hero__name--in raoul-hero__name--delay-2" : ""}`}
              >
                {brideName}
              </span>
            </h1>

            <div className="raoul-hero__rule" aria-hidden />

            <p
              className={`raoul-hero__subtitle mt-5 text-[0.65rem] font-medium uppercase tracking-[0.4em] sm:text-xs ${ready ? "raoul-hero__subtitle--in" : ""}`}
            >
              {displayGroom}
              <span className="raoul-hero__dot" aria-hidden>
                ◆
              </span>
              {displayBride}
            </p>

            <p className={`raoul-hero__tagline mt-4 font-invitation italic ${ready ? "raoul-hero__tagline--in" : ""}`}>
              Anywhere you go, let me go too
            </p>
          </div>
        </div>
      </div>

      <div className="raoul-hero__scroll-hint absolute bottom-8 left-1/2 z-10 -translate-x-1/2" aria-hidden>
        <span className="raoul-hero__scroll-line" />
      </div>
    </header>
  );
}
