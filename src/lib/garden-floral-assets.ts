/** Floral PNG paths under `public/garden/` */
export const GARDEN_FLORAL_ASSETS = {
  petals: [
    "/garden/petals/cherry-blossom-1.png",
    "/garden/petals/rose-1.png",
  ] as const,
  corners: {
    cherryBlossom: "/garden/corners/cherry-blossom.png",
    jasmine: "/garden/corners/jasmine.png",
  } as const,
} as const;

export type GardenPetalAsset = (typeof GARDEN_FLORAL_ASSETS.petals)[number];
