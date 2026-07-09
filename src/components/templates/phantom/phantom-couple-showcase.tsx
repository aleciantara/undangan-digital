"use client";

import { ResponsiveMediaImage } from "@/components/invitation/responsive-media-image";
import type { ResponsiveSlotMedia } from "@/lib/responsive-media";
import { GardenReveal } from "@/components/templates/garden/garden-reveal";

type Props = {
  groomName: string;
  brideName: string;
  groomPhoto: ResponsiveSlotMedia;
  bridePhoto: ResponsiveSlotMedia;
  accentColor: string;
  primaryColor: string;
};

function PortraitCard({
  media,
  alt,
  name,
  role,
  variant,
}: {
  media: ResponsiveSlotMedia;
  alt: string;
  name: string;
  role: string;
  variant: "groom" | "bride";
}) {
  return (
    <figure className={`phantom-portrait phantom-portrait--${variant}`}>
      <div className="phantom-portrait__outer">
        <span className="phantom-portrait__corner phantom-portrait__corner--tl" aria-hidden>
          ❧
        </span>
        <span className="phantom-portrait__corner phantom-portrait__corner--tr" aria-hidden>
          ❧
        </span>
        <span className="phantom-portrait__corner phantom-portrait__corner--bl" aria-hidden>
          ❧
        </span>
        <span className="phantom-portrait__corner phantom-portrait__corner--br" aria-hidden>
          ❧
        </span>

        <div className="phantom-portrait__frame">
          <div className="phantom-portrait__mat">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <ResponsiveMediaImage media={media} alt={alt} className="phantom-portrait__img" />
            <div className="phantom-portrait__vignette" aria-hidden />
            <div className="phantom-portrait__sheen" aria-hidden />
          </div>
        </div>

        <div className="phantom-portrait__pedestal" aria-hidden />
      </div>

      <figcaption className="phantom-portrait__name font-invitation">{name}</figcaption>
      <span className="phantom-portrait__role">{role}</span>
    </figure>
  );
}

export function PhantomCoupleShowcase({
  groomName,
  brideName,
  groomPhoto,
  bridePhoto,
  accentColor,
  primaryColor,
}: Props) {
  return (
    <div
      className="phantom-couple-showcase px-4 py-16 sm:py-24"
      style={{ "--cs-accent": accentColor, "--cs-primary": primaryColor } as React.CSSProperties}
    >
      <GardenReveal variant="clip">
        <p className="phantom-couple-showcase__eyebrow text-center">The Bride & Groom</p>
        <p className="phantom-couple-showcase__sub text-center">Mempelai</p>
      </GardenReveal>

      <div className="phantom-couple-showcase__grid phantom-couple-showcase__grid--duo mx-auto mt-12 max-w-3xl">
        <GardenReveal variant="up" delay={80}>
          <PortraitCard
            media={groomPhoto}
            alt={groomName}
            name={groomName}
            role="Mempelai Pria"
            variant="groom"
          />
        </GardenReveal>
        <GardenReveal variant="up" delay={180}>
          <PortraitCard
            media={bridePhoto}
            alt={brideName}
            name={brideName}
            role="Mempelai Wanita"
            variant="bride"
          />
        </GardenReveal>
      </div>
    </div>
  );
}
