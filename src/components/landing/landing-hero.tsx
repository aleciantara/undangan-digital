import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingClipDefs, LandingOrb } from "@/components/landing/landing-decor";
import { LandingMarquee } from "@/components/landing/landing-marquee";
import { landingCopy } from "@/lib/landing-copy";
import { landingImages } from "@/lib/landing-images";

export function LandingHero() {
  const { hero } = landingCopy;
  const mainImg = landingImages.hero;
  const accentImg = landingImages.gallery.bouquet;

  return (
    <section className="landing-grain relative min-h-[100svh] overflow-hidden bg-brand-ink">
      <LandingClipDefs />

      <LandingOrb className="animate-landing-gradient-drift -left-32 top-10 h-[28rem] w-[28rem]" color="amaranth" />
      <LandingOrb className="animate-landing-float-slow -right-20 bottom-32 h-80 w-80" color="brook" />
      <LandingOrb className="animate-landing-float right-1/4 top-1/3 h-56 w-56" color="rose" />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-center gap-10 px-4 pb-8 pt-24 lg:grid-cols-12 lg:gap-6 lg:px-8 lg:pb-0 lg:pt-28">
        {/* Typography column */}
        <div className="lg:col-span-7">
          <p className="animate-landing-fade-up text-[0.65rem] font-semibold uppercase tracking-[0.5em] text-brand-rose">
            {hero.eyebrow}
          </p>

          <div className="animate-landing-fade-up landing-delay-1 mt-6 select-none">
            <p className="font-invitation landing-text-stroke-light text-[clamp(3.5rem,14vw,10rem)] font-semibold leading-[0.85]">
              undangan
            </p>
            <h1 className="font-invitation -mt-2 text-[clamp(3.5rem,14vw,10rem)] font-semibold leading-[0.85] text-white">
              digital
            </h1>
          </div>

          <p className="animate-landing-fade-up landing-delay-2 mt-8 max-w-md text-lg leading-relaxed text-brand-chalk/85">
            Yang <span className="font-invitation text-2xl text-brand-rose">{hero.titleAccentIndah}</span> &{" "}
            <span className="font-invitation text-2xl text-brand-brook-light">{hero.titleAccentMakna}</span>
            {" — "}
            {hero.subtitle}
          </p>

          <div className="animate-landing-fade-up landing-delay-3 mt-10 flex flex-wrap items-center gap-4">
            <Link href="/daftar">
              <Button
                size="lg"
                className="group h-14 rounded-full px-8 text-base shadow-lg shadow-brand-amaranth/30"
              >
                {hero.ctaPrimary}
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </Link>
            <Link href="/masuk">
              <Button
                size="lg"
                variant="outline"
                className="h-14 rounded-full border-white/25 bg-transparent px-8 text-base text-white hover:border-white/50 hover:bg-white/10 hover:text-white"
              >
                {hero.ctaSecondary}
              </Button>
            </Link>
          </div>
        </div>

        {/* Photo collage */}
        <div className="relative mx-auto h-[min(52vh,520px)] w-full max-w-md lg:col-span-5 lg:mx-0 lg:h-[min(72vh,640px)] lg:max-w-none">
          <div
            className="animate-landing-fade-up landing-delay-2 absolute inset-4 overflow-hidden shadow-2xl shadow-black/40"
            style={{ clipPath: "url(#landing-blob-hero)" }}
          >
            <Image
              src={mainImg.src}
              alt={mainImg.alt}
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/50 via-transparent to-brand-amaranth/20 mix-blend-multiply" />
          </div>

          <div
            className="animate-landing-float absolute -bottom-2 -left-2 z-20 h-36 w-28 overflow-hidden border-4 border-brand-chalk/90 shadow-xl sm:h-44 sm:w-36 lg:-left-10"
            style={{ clipPath: "url(#landing-blob-accent)" }}
          >
            <Image
              src={accentImg.src}
              alt={accentImg.alt}
              fill
              sizes="150px"
              className="object-cover"
            />
          </div>

          <div
            className="animate-landing-spin-slow absolute -right-4 top-8 z-10 hidden h-24 w-24 rounded-full border border-dashed border-brand-rose/40 lg:block"
            aria-hidden
          />
          <div className="absolute -right-2 top-1/2 z-30 hidden font-invitation text-6xl text-brand-rose/25 lg:block">
            ✦
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-4 lg:mt-0">
        <LandingMarquee variant="dark" />
      </div>
    </section>
  );
}
