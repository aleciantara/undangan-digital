"use client";

import { GARDEN_FLORAL_ASSETS } from "@/lib/garden-floral-assets";

export function GardenFloralCorners() {
  const { cherryBlossom, jasmine } = GARDEN_FLORAL_ASSETS.corners;

  return (
    <div className="garden-floral-corners pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cherryBlossom}
        alt=""
        className="garden-floral-corners__img garden-floral-corners__cherry garden-floral-corners__cherry--left"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cherryBlossom}
        alt=""
        className="garden-floral-corners__img garden-floral-corners__cherry garden-floral-corners__cherry--right"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={jasmine} alt="" className="garden-floral-corners__img garden-floral-corners__jasmine" />
    </div>
  );
}
