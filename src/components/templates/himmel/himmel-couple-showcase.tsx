"use client";

import { ResponsiveMediaImage } from "@/components/invitation/responsive-media-image";
import type { ResponsiveSlotMedia } from "@/lib/responsive-media";
import { HimmelReveal } from "./himmel-reveal";

type Props = {
  groomName: string;
  brideName: string;
  groomPhoto: ResponsiveSlotMedia;
  bridePhoto: ResponsiveSlotMedia;
  groomParents?: string | null;
  brideParents?: string | null;
  accentColor: string;
  primaryColor: string;
};

function PortraitCard({
  media,
  alt,
  name,
  role,
  parents,
  variant,
}: {
  media: ResponsiveSlotMedia;
  alt: string;
  name: string;
  role: string;
  parents?: string | null;
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
          <ResponsiveMediaImage media={media} alt={alt} className="himmel-portrait__img" />
          <div className="himmel-portrait__sheen" aria-hidden />
        </div>
      </div>

      <figcaption className="himmel-portrait__name font-invitation">{name}</figcaption>
      <span className="himmel-portrait__role">{role}</span>
      {parents?.trim() && (
        <p className="himmel-portrait__parents">
          <span className="himmel-portrait__parents-label">
            {variant === "groom" ? "Putra dari" : "Putri dari"}
          </span>
          {parents}
        </p>
      )}
    </figure>
  );
}

export function HimmelCoupleShowcase({
  groomName,
  brideName,
  groomPhoto,
  bridePhoto,
  groomParents,
  brideParents,
  accentColor,
  primaryColor,
}: Props) {
  return (
    <div
      className="himmel-couple-showcase px-4 py-16 sm:py-20"
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
            media={groomPhoto}
            alt={groomName}
            name={groomName}
            role="Mempelai Pria"
            parents={groomParents}
            variant="groom"
          />
        </HimmelReveal>
        <HimmelReveal variant="up" delay={180}>
          <PortraitCard
            media={bridePhoto}
            alt={brideName}
            name={brideName}
            role="Mempelai Wanita"
            parents={brideParents}
            variant="bride"
          />
        </HimmelReveal>
      </div>
    </div>
  );
}
