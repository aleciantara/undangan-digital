"use client";

import { DresscodeEventCard } from "@/components/invitation/dresscode-event-card";
import { eventsWithDresscode } from "@/lib/dresscode-colors";
import type { SerializedEvent } from "@/lib/invitation-types";
import { HimmelReveal } from "./himmel-reveal";
import { HimmelSectionHeading } from "./himmel-section-heading";

type Props = {
  events: SerializedEvent[];
  accentColor: string;
  primaryColor: string;
};

export function HimmelDresscodeSection({ events, accentColor, primaryColor }: Props) {
  const dressed = eventsWithDresscode(events);
  if (dressed.length === 0) return null;

  return (
    <div className="himmel-dresscode-section px-4 py-16 sm:py-20">
      <HimmelSectionHeading index="02" accentColor={accentColor} primaryColor={primaryColor}>
        Dress Code
      </HimmelSectionHeading>
      <p className="himmel-dresscode-section__intro mx-auto mt-4 max-w-2xl text-center font-invitation">
        Kami mengundang Anda untuk hadir dengan busana yang sesuai tema berikut.
      </p>
      <div className="himmel-dresscode-grid mx-auto mt-10 max-w-4xl">
        {dressed.map((event, i) => (
          <HimmelReveal key={event.id} variant="up" delay={i * 80}>
            <DresscodeEventCard
              theme="himmel"
              event={event}
              accentColor={accentColor}
              primaryColor={primaryColor}
              index={i}
            />
          </HimmelReveal>
        ))}
      </div>
    </div>
  );
}
