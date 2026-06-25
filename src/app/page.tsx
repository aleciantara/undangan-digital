import { SiteHeader } from "@/components/layout/site-header";
import { LandingCta } from "@/components/landing/landing-cta";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingGallery } from "@/components/landing/landing-gallery";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingSteps } from "@/components/landing/landing-steps";
import { LandingThemeCallout } from "@/components/landing/landing-theme-callout";

export default function HomePage() {
  return (
    <div className="landing-page min-h-screen bg-background">
      <SiteHeader overlay />
      <main>
        <LandingHero />
        <LandingGallery />
        <LandingFeatures />
        <LandingThemeCallout />
        <LandingSteps />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
