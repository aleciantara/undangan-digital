import { ResponsiveMediaImage } from "@/components/invitation/responsive-media-image";
import type { ResponsiveSlotMedia } from "@/lib/responsive-media";

type BlendTone = "ivory" | "pearl" | "navy";

type Props = {
  children: React.ReactNode;
  className?: string;
  tone?: "ivory" | "dark" | "pearl";
  bgImage?: ResponsiveSlotMedia | null;
  bgPosition?: string;
  scrim?: "light" | "medium" | "heavy";
  blendTop?: boolean;
  blendBottom?: boolean;
  blendFrom?: BlendTone;
  blendTo?: BlendTone;
  lazyBg?: boolean;
  stickyBg?: boolean;
};

const BLEND_VARS: Record<BlendTone, string> = {
  ivory: "var(--raoul-ivory)",
  pearl: "var(--raoul-pearl)",
  navy: "var(--raoul-navy)",
};

function RaoulSectionBlends({ top, bottom }: { top: boolean; bottom: boolean }) {
  return (
    <>
      {top && <div className="raoul-section__blend raoul-section__blend--top" aria-hidden />}
      {bottom && <div className="raoul-section__blend raoul-section__blend--bottom" aria-hidden />}
    </>
  );
}

export function RaoulSection({
  children,
  className = "",
  tone = "ivory",
  bgImage,
  bgPosition = "center",
  scrim = "medium",
  blendTop = false,
  blendBottom = false,
  blendFrom = "ivory",
  blendTo = "pearl",
  lazyBg = true,
  stickyBg = false,
}: Props) {
  const hasBg = Boolean(bgImage);
  const hasBlend = blendTop || blendBottom;

  const blendStyle = hasBlend
    ? ({
        ...(blendTop ? { "--raoul-blend-top": BLEND_VARS[blendFrom] } : {}),
        ...(blendBottom ? { "--raoul-blend-bottom": BLEND_VARS[blendTo] } : {}),
      } as React.CSSProperties)
    : undefined;

  const bgImg = hasBg ? (
    <>
      <ResponsiveMediaImage
        media={bgImage!}
        alt=""
        className="raoul-section__bg-img h-full w-full object-cover"
        style={{ objectPosition: bgPosition }}
        loading={lazyBg ? "lazy" : "eager"}
        decoding="async"
      />
      <div className="raoul-section__scrim absolute inset-0" />
    </>
  ) : null;

  return (
    <section
      className={`raoul-section ${hasBg ? "raoul-section--has-bg" : "raoul-section--solid"} ${!hasBg ? `raoul-section--${tone}` : ""} ${hasBlend ? "raoul-section--feathered" : ""} ${stickyBg && hasBg ? "raoul-section--sticky-bg" : ""} raoul-section--scrim-${scrim} relative ${className}`}
      style={blendStyle}
    >
      {hasBg &&
        (stickyBg ? (
          <div className="raoul-section__sticky-stack">
            <div className="raoul-section__bg-sticky" aria-hidden>
              <div className="raoul-section__bg-inner">{bgImg}</div>
              <RaoulSectionBlends top={blendTop} bottom={blendBottom} />
            </div>
            <div className="raoul-section__content">{children}</div>
          </div>
        ) : (
          <>
            <div className="raoul-section__bg absolute inset-0 overflow-hidden" aria-hidden>
              {bgImg}
              <RaoulSectionBlends top={blendTop} bottom={blendBottom} />
            </div>
            <div className="raoul-section__content relative z-[1]">{children}</div>
          </>
        ))}

      {!hasBg && (
        <>
          <RaoulSectionBlends top={blendTop} bottom={blendBottom} />
          <div className="raoul-section__content relative z-[1]">{children}</div>
        </>
      )}
    </section>
  );
}
