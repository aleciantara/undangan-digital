"use client";

import { DresscodeEventCard } from "@/components/invitation/dresscode-event-card";
import { eventsWithDresscode } from "@/lib/dresscode-colors";
import type { SerializedEvent } from "@/lib/invitation-types";
import { GardenReveal } from "@/components/templates/garden/garden-reveal";
import { PhantomSectionHeading } from "./phantom-section-heading";

type Props = {
  events: SerializedEvent[];
  accentColor: string;
  primaryColor: string;
};

export function PhantomDresscodeSection({ events, accentColor, primaryColor }: Props) {
  const dressed = eventsWithDresscode(events);
  if (dressed.length === 0) return null;

  return (
    <div className="phantom-dresscode-section px-4 py-16 sm:py-20">
      <PhantomSectionHeading index="02" accentColor={accentColor} primaryColor={primaryColor}>
        Dress Code
      </PhantomSectionHeading>
      <p className="phantom-dresscode-section__intro mx-auto mt-4 max-w-2xl text-center font-invitation">
        Kami mengundang Anda untuk hadir dengan busana yang sesuai tema berikut.
      </p>
      <div className="phantom-dresscode-grid mx-auto mt-10 max-w-4xl">
        {dressed.map((event, i) => (
          <GardenReveal key={event.id} variant="up" delay={i * 80}>
            <DresscodeEventCard
              theme="phantom"
              event={event}
              accentColor={accentColor}
              primaryColor={primaryColor}
              index={i}
            />
          </GardenReveal>
        ))}
      </div>
    </div>
  );
}
