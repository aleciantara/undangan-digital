"use client";

import dynamic from "next/dynamic";

// Himmel's flower field is the heaviest decorative layer. It's purely ambient
// (and hidden behind the envelope on first paint), so defer it out of the
// initial bundle and skip SSR — it fades in after hydration with no visual loss.
const HimmelAtmosphereInner = dynamic(
  () => import("./himmel-atmosphere").then((m) => m.HimmelAtmosphere),
  { ssr: false },
);

export function HimmelAtmosphere() {
  return <HimmelAtmosphereInner />;
}
