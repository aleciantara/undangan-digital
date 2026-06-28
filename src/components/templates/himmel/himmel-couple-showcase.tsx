"use client";

import { HimmelReveal } from "./himmel-reveal";

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
    <figure className={`himmel-portrait himmel-portrait--wreath himmel-portrait--${variant}`}>
      <div className="himmel-portrait__wreath-wrap">
        <div className="himmel-portrait__ring" aria-hidden />
        <div className="himmel-portrait__bloom-ring" aria-hidden>
          <span /><span /><span /><span /><span /><span />
        </div>
        <div className="himmel-portrait__frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="himmel-portrait__img" />
          <div className="himmel-portrait__sheen" aria-hidden />
        </div>
      </div>

      <figcaption className="himmel-portrait__name font-invitation">{name}</figcaption>
      <span className="himmel-portrait__role">{role}</span>
    </figure>
  );
}

export function HimmelCoupleShowcase({
  groomName,
  brideName,
  groomPhoto,
  bridePhoto,
  accentColor,
  primaryColor,
}: Props) {
  return (
    <div
      className="himmel-couple-showcase px-4 py-20 sm:py-28"
      style={{ "--cs-accent": accentColor, "--cs-primary": primaryColor } as React.CSSProperties}
    >
      <HimmelReveal variant="clip">
        <div className="himmel-couple-showcase__intro mx-auto max-w-lg text-center">
          <p className="himmel-couple-showcase__eyebrow">Mempelai</p>
          <div className="himmel-couple-showcase__rule" aria-hidden />
          <p className="himmel-couple-showcase__sub font-invitation italic">
            Seperti bunga di padang rumput biru — tumbuh bersama dalam perjalanan
          </p>
        </div>
      </HimmelReveal>

      <div className="himmel-couple-showcase__grid himmel-couple-showcase__grid--duo mx-auto mt-14 max-w-4xl">
        <HimmelReveal variant="up" delay={80}>
          <PortraitCard
            src={groomPhoto}
            alt={groomName}
            name={groomName}
            role="Mempelai Pria"
            variant="groom"
          />
        </HimmelReveal>
        <HimmelReveal variant="up" delay={180}>
          <PortraitCard
            src={bridePhoto}
            alt={brideName}
            name={brideName}
            role="Mempelai Wanita"
            variant="bride"
          />
        </HimmelReveal>
      </div>
    </div>
  );
}
