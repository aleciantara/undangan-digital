import { HimmelSectionMeadow } from "./himmel-section-meadow";

type BlendTone = "ivory" | "pearl" | "navy";

type Props = {
  children: React.ReactNode;
  className?: string;
  tone?: "ivory" | "dark" | "pearl";
  bgImage?: string | null;
  bgPosition?: string;
  scrim?: "light" | "medium" | "heavy";
  blendTop?: boolean;
  blendBottom?: boolean;
  /** Surface color of the section above — feathers the top edge */
  blendFrom?: BlendTone;
  /** Surface color of the section below — feathers the bottom edge */
  blendTo?: BlendTone;
  lazyBg?: boolean;
  stickyBg?: boolean;
  /** Seed for per-section flower placement */
  meadowSeed?: number;
};

const BLEND_VARS: Record<BlendTone, string> = {
  ivory: "var(--himmel-ivory)",
  pearl: "var(--himmel-pearl)",
  navy: "var(--himmel-navy)",
};

const MEADOW_SEED: Record<NonNullable<Props["tone"]>, number> = {
  ivory: 110,
  pearl: 220,
  dark: 330,
};

function HimmelSectionBlends({ top, bottom }: { top: boolean; bottom: boolean }) {
  return (
    <>
      {top && <div className="himmel-section__blend himmel-section__blend--top" aria-hidden />}
      {bottom && <div className="himmel-section__blend himmel-section__blend--bottom" aria-hidden />}
    </>
  );
}

export function HimmelSection({
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
  meadowSeed,
}: Props) {
  const hasBg = Boolean(bgImage);
  const hasBlend = blendTop || blendBottom;
  const flowerSeed = meadowSeed ?? MEADOW_SEED[tone];

  const blendStyle = hasBlend
    ? ({
        ...(blendTop ? { "--himmel-blend-top": BLEND_VARS[blendFrom] } : {}),
        ...(blendBottom ? { "--himmel-blend-bottom": BLEND_VARS[blendTo] } : {}),
      } as React.CSSProperties)
    : undefined;

  const bgImg = hasBg ? (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bgImage!}
        alt=""
        className="himmel-section__bg-img h-full w-full object-cover"
        style={{ objectPosition: bgPosition }}
        loading={lazyBg ? "lazy" : "eager"}
        decoding="async"
      />
      <div className="himmel-section__scrim absolute inset-0" />
    </>
  ) : null;

  return (
    <section
      className={`himmel-section ${hasBg ? "himmel-section--has-bg" : "himmel-section--solid"} ${!hasBg ? `himmel-section--${tone}` : ""} ${hasBlend ? "himmel-section--feathered" : ""} ${stickyBg && hasBg ? "himmel-section--sticky-bg" : ""} himmel-section--scrim-${scrim} relative ${className}`}
      style={blendStyle}
    >
      {hasBg &&
        (stickyBg ? (
          <div className="himmel-section__sticky-stack">
            <div className="himmel-section__bg-sticky" aria-hidden>
              <div className="himmel-section__bg-inner">{bgImg}</div>
              <HimmelSectionBlends top={blendTop} bottom={blendBottom} />
            </div>
            <div className="himmel-section__content">{children}</div>
          </div>
        ) : (
          <>
            <div className="himmel-section__bg absolute inset-0 overflow-hidden" aria-hidden>
              {bgImg}
              <HimmelSectionBlends top={blendTop} bottom={blendBottom} />
            </div>
            <div className="himmel-section__content relative z-[1]">{children}</div>
          </>
        ))}

      {!hasBg && (
        <>
          <div className={`himmel-section__solid-bg himmel-section__solid-bg--${tone}`} aria-hidden />
          <HimmelSectionMeadow seed={flowerSeed} />
          <HimmelSectionBlends top={blendTop} bottom={blendBottom} />
          <div className="himmel-section__content">{children}</div>
        </>
      )}
    </section>
  );
}
