import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingOrb } from "@/components/landing/landing-decor";
import { LandingRingsAnimation } from "@/components/landing/landing-rings-animation";
import { landingCopy } from "@/lib/landing-copy";
import { landingImages } from "@/lib/landing-images";

export function LandingCta() {
  const { cta } = landingCopy;
  const img = landingImages.cta;

  return (
    <section className="landing-grain relative overflow-hidden py-28 sm:py-36">
      <Image src={img.src} alt={img.alt} fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-brand-ink/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-amaranth/80 via-brand-amaranth/50 to-brand-brook-dark/60" />

      <LandingOrb className="left-1/4 top-0 h-64 w-64" color="rose" />
      <LandingOrb className="bottom-0 right-1/4 h-80 w-80" color="brook" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="font-invitation landing-text-stroke-light text-[clamp(2.5rem,10vw,7rem)] font-semibold leading-[0.9]">
              mulai
            </p>
            <h2 className="font-invitation -mt-2 text-[clamp(2.5rem,10vw,7rem)] font-semibold leading-[0.9] text-white">
              {cta.title}
            </h2>
            <p className="mt-8 max-w-lg text-lg text-brand-chalk/85">{cta.body}</p>
          </div>

          <div className="flex w-full flex-col items-center gap-2 lg:w-auto lg:items-end">
            <LandingRingsAnimation />
            <Link href="/daftar" className="shrink-0">
              <Button
                size="lg"
                className="group h-16 rounded-full bg-white px-10 text-lg text-brand-amaranth shadow-2xl hover:bg-brand-chalk hover:text-brand-amaranth-dark"
              >
                {cta.button}
                <ArrowUpRight className="h-5 w-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
