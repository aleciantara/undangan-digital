import Image from "next/image";
import { CalendarHeart, MessageCircleHeart, Palette, Share2 } from "lucide-react";
import { LandingMarquee } from "@/components/landing/landing-marquee";
import { LandingSectionHeading } from "@/components/landing/landing-section-heading";
import { landingCopy } from "@/lib/landing-copy";
import { landingImages } from "@/lib/landing-images";

const icons = {
  theme: Palette,
  events: CalendarHeart,
  rsvp: MessageCircleHeart,
  share: Share2,
} as const;

export function LandingFeatures() {
  const { features } = landingCopy;

  return (
    <section className="relative overflow-hidden bg-brand-ink py-24 text-white sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(155,64,98,0.35),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(143,181,160,0.2),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <LandingSectionHeading eyebrow={features.eyebrow} title={features.title} light />

        <div className="mt-16 flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-2 lg:gap-8 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {features.items.map((item, index) => {
            const Icon = icons[item.key];
            const image =
              "imageKey" in item && item.imageKey ? landingImages.features[item.imageKey] : null;
            const isPink = item.accent === "pink";

            return (
              <article
                key={item.key}
                className="group relative min-w-[min(88vw,400px)] shrink-0 snap-center overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/10 lg:min-w-0"
              >
                <span
                  className="pointer-events-none absolute -right-4 -top-6 font-invitation text-[8rem] font-semibold leading-none text-white/[0.04]"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex gap-5">
                  {image && (
                    <div className="relative hidden h-28 w-24 shrink-0 overflow-hidden rounded-2xl sm:block">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="96px"
                        className="object-cover opacity-90 transition group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-brand-amaranth/20 mix-blend-multiply" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div
                      className={`inline-flex rounded-2xl p-3 ${
                        isPink ? "bg-brand-amaranth/30 text-brand-rose" : "bg-brand-brook/25 text-brand-brook-light"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 font-invitation text-2xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-brand-chalk/75">{item.desc}</p>
                  </div>
                </div>

                <div
                  className={`mt-6 h-0.5 w-full origin-left scale-x-0 transition duration-500 group-hover:scale-x-100 ${
                    isPink ? "bg-brand-rose" : "bg-brand-brook"
                  }`}
                />
              </article>
            );
          })}
        </div>
      </div>

      <div className="relative mt-20">
        <LandingMarquee variant="rose" />
      </div>
    </section>
  );
}
