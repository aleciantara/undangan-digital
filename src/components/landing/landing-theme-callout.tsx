import { LandingEnvelopeDemo } from "@/components/landing/landing-envelope-demo";
import { LandingOrb } from "@/components/landing/landing-decor";
import { landingCopy } from "@/lib/landing-copy";

export function LandingThemeCallout() {
  const { theme } = landingCopy;

  return (
    <section className="relative overflow-hidden bg-brand-chalk py-24 sm:py-32">
      <LandingOrb className="left-0 top-1/2 h-96 w-96 -translate-y-1/2" color="brook" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="relative order-2 lg:order-1 lg:col-span-5">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-brand-amaranth">
            {theme.badge}
          </p>
          <h2 className="font-invitation mt-4 text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.02] text-brand-ink">
            <span>Undanganmu,</span>{" "}
            <span className="text-brand-amaranth">warnamu</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-muted">{theme.body}</p>

          <ul className="mt-10 space-y-4">
            {theme.bullets.map((bullet, i) => (
              <li
                key={bullet}
                className="flex items-start gap-4 border-l-2 border-brand-amaranth/30 pl-4 text-brand-ink"
              >
                <span className="font-mono text-xs font-semibold text-brand-amaranth">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-relaxed sm:text-base">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
          <LandingEnvelopeDemo />
        </div>
      </div>
    </section>
  );
}
