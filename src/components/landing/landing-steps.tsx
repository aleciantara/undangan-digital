import Image from "next/image";
import { LandingSectionHeading } from "@/components/landing/landing-section-heading";
import { landingCopy } from "@/lib/landing-copy";
import { landingImages } from "@/lib/landing-images";

export function LandingSteps() {
  const { steps } = landingCopy;

  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <LandingSectionHeading eyebrow={steps.eyebrow} title={steps.title} align="center" />

        <div className="relative mt-20">
          {/* Timeline line */}
          <div
            className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-brand-rose via-brand-amaranth to-brand-brook md:left-1/2 md:block md:-translate-x-px"
            aria-hidden
          />

          <div className="space-y-16 md:space-y-24">
            {steps.items.map((step, index) => {
              const img = landingImages.steps[step.key];
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.key}
                  className={`relative flex flex-col gap-8 md:flex-row md:items-center ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${isEven ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                    <span className="font-invitation text-7xl font-light text-brand-rose/25 sm:text-8xl">
                      {step.num}
                    </span>
                    <h3 className="font-invitation -mt-4 text-3xl font-semibold text-brand-ink">{step.title}</h3>
                    <p className="mt-4 max-w-sm text-brand-muted md:ml-auto md:max-w-md">{step.desc}</p>
                  </div>

                  <div className="relative flex shrink-0 justify-center md:w-48">
                    <div className="absolute left-8 top-1/2 hidden h-4 w-4 -translate-y-1/2 rounded-full border-4 border-background bg-brand-amaranth md:left-1/2 md:block md:-translate-x-1/2" />
                    <div className="relative h-40 w-40 overflow-hidden rounded-full ring-4 ring-brand-chalk ring-offset-4 ring-offset-background shadow-xl sm:h-48 sm:w-48">
                      <Image src={img.src} alt={img.alt} fill sizes="200px" className="object-cover" />
                    </div>
                  </div>

                  <div className="hidden flex-1 md:block" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
