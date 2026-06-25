import Image from "next/image";
import { LandingOrb } from "@/components/landing/landing-decor";
import { LandingSectionHeading } from "@/components/landing/landing-section-heading";
import { landingCopy } from "@/lib/landing-copy";
import { landingImages } from "@/lib/landing-images";

const layout = [
  { key: "couple" as const, className: "left-[2%] top-8 z-20 w-[58%] rotate-[-5deg] sm:left-[5%] sm:w-[42%]" },
  { key: "rings" as const, className: "right-[4%] top-0 z-30 w-[44%] rotate-[4deg] sm:right-[8%] sm:w-[28%]" },
  { key: "bouquet" as const, className: "bottom-[12%] left-[8%] z-10 w-[48%] rotate-[3deg] sm:left-[18%] sm:w-[32%]" },
  { key: "table" as const, className: "bottom-4 right-[2%] z-20 w-[52%] rotate-[-3deg] sm:right-[12%] sm:w-[36%]" },
];

export function LandingGallery() {
  const { gallery } = landingCopy;

  return (
    <section className="landing-diagonal-cut relative overflow-hidden bg-background py-24 sm:py-32">
      <LandingOrb className="right-0 top-0 h-72 w-72" color="rose" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative z-10 max-w-xl">
          <LandingSectionHeading eyebrow={gallery.eyebrow} title={gallery.title} />
        </div>

        <div className="relative mx-auto mt-16 h-[min(70vh,680px)] max-w-5xl sm:mt-20">
          {/* Giant watermark */}
          <p
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-full -translate-x-1/2 -translate-y-1/2 text-center font-invitation text-[clamp(4rem,18vw,11rem)] font-semibold leading-none text-brand-brook/15"
            aria-hidden
          >
            cinta
          </p>

          {layout.map(({ key, className }, i) => {
            const img = landingImages.gallery[key];
            return (
              <div
                key={key}
                className={`absolute transition duration-500 hover:z-40 hover:scale-[1.03] ${className}`}
              >
                <div className="group relative aspect-[3/4] overflow-hidden bg-white p-2 shadow-2xl shadow-brand-ink/10 ring-1 ring-brand-brook/20">
                  <div className="relative h-full w-full overflow-hidden">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 55vw, 30vw"
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-brand-amaranth/0 transition group-hover:bg-brand-amaranth/10" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-amaranth font-mono text-xs text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
