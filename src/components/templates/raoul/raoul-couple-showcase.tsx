"use client";

import { RaoulReveal } from "./raoul-reveal";

type Props = {
  groomName: string;
  brideName: string;
  groomPhoto: string;
  bridePhoto: string;
  accentColor: string;
  primaryColor: string;
};

function PortraitCard({
  src,
  alt,
  name,
  role,
  variant,
}: {
  src: string;
  alt: string;
  name: string;
  role: string;
  variant: "groom" | "bride";
}) {
  return (
    <figure className={`raoul-portrait raoul-portrait--gilded raoul-portrait--${variant}`}>
      <div className="raoul-portrait__pedestal-wrap">
        <div className="raoul-portrait__arch">
          <div className="raoul-portrait__gilt">
            <div className="raoul-portrait__mat">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} className="raoul-portrait__img" />
              <div className="raoul-portrait__sheen" aria-hidden />
            </div>
          </div>
        </div>
        <div className="raoul-portrait__plinth" aria-hidden />
      </div>

      <figcaption className="raoul-portrait__name font-invitation">{name}</figcaption>
      <span className="raoul-portrait__role">{role}</span>
    </figure>
  );
}

export function RaoulCoupleShowcase({
  groomName,
  brideName,
  groomPhoto,
  bridePhoto,
  accentColor,
  primaryColor,
}: Props) {
  return (
    <div
      className="raoul-couple-showcase px-4 py-20 sm:py-28"
      style={{ "--cs-accent": accentColor, "--cs-primary": primaryColor } as React.CSSProperties}
    >
      <RaoulReveal variant="clip">
        <div className="raoul-couple-showcase__intro mx-auto max-w-lg text-center">
          <p className="raoul-couple-showcase__eyebrow">Les Mempelai</p>
          <div className="raoul-couple-showcase__rule" aria-hidden />
          <p className="raoul-couple-showcase__sub font-invitation italic">
            With joy, we present the celebrated couple
          </p>
        </div>
      </RaoulReveal>

      <div className="raoul-couple-showcase__grid raoul-couple-showcase__grid--duo mx-auto mt-14 max-w-4xl">
        <RaoulReveal variant="up" delay={80}>
          <PortraitCard
            src={groomPhoto}
            alt={groomName}
            name={groomName}
            role="Mempelai Pria"
            variant="groom"
          />
        </RaoulReveal>
        <RaoulReveal variant="up" delay={180}>
          <PortraitCard
            src={bridePhoto}
            alt={brideName}
            name={brideName}
            role="Mempelai Wanita"
            variant="bride"
          />
        </RaoulReveal>
      </div>
    </div>
  );
}
