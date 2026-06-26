"use client";

import { EnvelopeCover } from "@/components/invitation/envelope-cover";
import { landingCopy } from "@/lib/landing-copy";

/** Pink wax seal / stamp accent on bold green envelope */
const GARDEN_ACCENT = "#c9617f";

export function LandingEnvelopeDemo() {
  const demo = landingCopy.envelopeDemo;

  return (
    <EnvelopeCover
      variant="embedded"
      embedTheme="garden"
      loop
      activateOn="hover"
      groomName={demo.groomName}
      brideName={demo.brideName}
      recipientName={demo.recipientName}
      accentColor={GARDEN_ACCENT}
      headerText={demo.headerText}
      hintText={demo.hintText}
    />
  );
}
