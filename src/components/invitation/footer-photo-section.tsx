"use client";

type Scrim = "light" | "medium" | "heavy";

type Props = {
  theme: "raoul" | "phantom" | "himmel";
  bgImage: string;
  scrim?: Scrim;
  blendTop?: boolean;
  children: React.ReactNode;
};

export function FooterPhotoSection({
  theme,
  bgImage,
  scrim = "heavy",
  blendTop = false,
  children,
}: Props) {
  return (
    <section className={`${theme}-footer-photo`} aria-label="Penutup undangan">
      <div className={`${theme}-footer-photo__frame`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgImage}
          alt=""
          className={`${theme}-footer-photo__img`}
          loading="lazy"
          decoding="async"
        />
        <div
          className={`${theme}-footer-photo__scrim ${theme}-footer-photo__scrim--${scrim}`}
          aria-hidden
        />
        {blendTop && <div className={`${theme}-footer-photo__blend-top`} aria-hidden />}
        <div className={`${theme}-footer-photo__content`}>{children}</div>
      </div>
    </section>
  );
}
