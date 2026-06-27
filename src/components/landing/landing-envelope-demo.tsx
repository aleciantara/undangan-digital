"use client";

import { EnvelopeCover } from "@/components/invitation/envelope-cover";
import { landingCopy } from "@/lib/landing-copy";

/** Burgundy velvet + gold wax seal accent on Phantom envelope */
const PHANTOM_ACCENT = "#a4163a";

export function LandingEnvelopeDemo() {
  const demo = landingCopy.envelopeDemo;

  return (
    <EnvelopeCover
      variant="embedded"
      embedTheme="phantom"
      loop
      activateOn="hover"
      groomName={demo.groomName}
      brideName={demo.brideName}
      recipientName={demo.recipientName}
      accentColor={PHANTOM_ACCENT}
      headerText={demo.headerText}
      hintText={demo.hintText}
    />
  );
}
