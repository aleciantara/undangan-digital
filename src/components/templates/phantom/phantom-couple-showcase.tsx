"use client";

import { ResponsiveMediaImage } from "@/components/invitation/responsive-media-image";
import type { ResponsiveSlotMedia } from "@/lib/responsive-media";
import { PhantomReveal } from "@/components/templates/phantom/phantom-reveal";

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
      {parents?.trim() && (
        <p className="phantom-portrait__parents">
          <span className="phantom-portrait__parents-label">
            {variant === "groom" ? "Putra dari" : "Putri dari"}
          </span>
          {parents}
        </p>
      )}
    </figure>
  );
}

export function PhantomCoupleShowcase({
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
      className="phantom-couple-showcase px-4 py-16 sm:py-20"
      style={{ "--cs-accent": accentColor, "--cs-primary": primaryColor } as React.CSSProperties}
    >
      <PhantomReveal variant="clip">
        <p className="phantom-couple-showcase__eyebrow text-center">The Bride & Groom</p>
        <p className="phantom-couple-showcase__sub text-center">Mempelai</p>
      </PhantomReveal>

      <div className="phantom-couple-showcase__grid phantom-couple-showcase__grid--duo mx-auto mt-12 max-w-3xl">
        <PhantomReveal variant="up" delay={80}>
          <PortraitCard
            media={groomPhoto}
            alt={groomName}
            name={groomName}
            role="Mempelai Pria"
            parents={groomParents}
            variant="groom"
          />
        </PhantomReveal>
        <PhantomReveal variant="up" delay={180}>
          <PortraitCard
            media={bridePhoto}
            alt={brideName}
            name={brideName}
            role="Mempelai Wanita"
            parents={brideParents}
            variant="bride"
          />
        </PhantomReveal>
      </div>
    </div>
  );
}
