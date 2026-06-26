type Props = {
  children: React.ReactNode;
  className?: string;
  bgImage?: string | null;
  bgPosition?: string;
  scrim?: "light" | "medium" | "heavy";
  /** Feather gradient into velvet when meeting another section */
  blendTop?: boolean;
  blendBottom?: boolean;
  /** lazy-load section bg (default true; hero sections pass false via first section) */
  lazyBg?: boolean;
  /** Pin bg while section content scrolls over it (best for tall multi-card sections) */
  stickyBg?: boolean;
};

export function PhantomSection({
  children,
  className = "",
  bgImage,
  bgPosition = "center",
  scrim = "medium",
  blendTop = false,
  blendBottom = false,
  lazyBg = true,
  stickyBg = false,
}: Props) {
  const hasBg = Boolean(bgImage);

  const bgImg = hasBg ? (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bgImage!}
        alt=""
        className="phantom-section__bg-img h-full w-full object-cover"
        style={{ objectPosition: bgPosition }}
        loading={lazyBg ? "lazy" : "eager"}
        decoding="async"
      />
      <div className="phantom-section__scrim absolute inset-0" />
    </>
  ) : null;

  return (
    <section
      className={`phantom-section ${hasBg ? "phantom-section--has-bg" : "phantom-section--solid"} ${stickyBg && hasBg ? "phantom-section--sticky-bg" : ""} phantom-section--scrim-${scrim} relative ${className}`}
    >
      {hasBg &&
        (stickyBg ? (
          <>
            {blendTop && <div className="phantom-section__blend phantom-section__blend--top" aria-hidden />}
            {blendBottom && (
              <div className="phantom-section__blend phantom-section__blend--bottom" aria-hidden />
            )}
            <div className="phantom-section__sticky-stack">
              <div className="phantom-section__bg-sticky" aria-hidden>
                <div className="phantom-section__bg-inner">{bgImg}</div>
              </div>
              <div className="phantom-section__content">{children}</div>
            </div>
          </>
        ) : (
          <>
            <div className="phantom-section__bg absolute inset-0 overflow-hidden" aria-hidden>
              {bgImg}
            </div>
            {blendTop && <div className="phantom-section__blend phantom-section__blend--top" aria-hidden />}
            {blendBottom && (
              <div className="phantom-section__blend phantom-section__blend--bottom" aria-hidden />
            )}
          </>
        ))}
      {!stickyBg && <div className="phantom-section__content relative z-[1]">{children}</div>}
    </section>
  );
}
