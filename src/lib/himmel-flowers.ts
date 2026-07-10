const BASE = "/himmel/flowers";

/** Wind-sway field sprites — transparent PNGs (black matte removed via CSS blend) */
export const HIMMEL_FLOWER_SPRITES = [
  `${BASE}/forget-me-not-01.png`,
  `${BASE}/moonweed-01.png`,
  `${BASE}/nemophila-01.png`,
  `${BASE}/blue-bloom-01.png`,
  `${BASE}/blue-bloom-02.png`,
  `${BASE}/blue-bloom-03.png`,
] as const;

export const HIMMEL_PETAL_DRIFT = "/himmel/petals/petal-sheet.webp";

export type HimmelFlowerLayer = "back" | "mid" | "front";
export type HimmelFlowerAnchor = "bottom" | "top";
export type HimmelFlowerDensity = "full" | "lite";

export type HimmelFlowerInstance = {
  id: number;
  src: string;
  left: string;
  bottom?: string;
  top?: string;
  anchor: HimmelFlowerAnchor;
  scale: number;
  z: number;
  delay: string;
  duration: string;
  sway: "left" | "right";
  bloomDelay: string;
  layer: HimmelFlowerLayer;
  opacity: number;
};

function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function buildLayer(
  layer: HimmelFlowerLayer,
  count: number,
  seedOffset: number,
  config: {
    scaleMin: number;
    scaleMax: number;
    spreadMin: number;
    spreadMax: number;
    opacity: number;
    anchor?: HimmelFlowerAnchor;
    bloomDelayMax?: number;
  }
): HimmelFlowerInstance[] {
  const sprites = HIMMEL_FLOWER_SPRITES;
  const anchor = config.anchor ?? "bottom";
  const bloomMax = config.bloomDelayMax ?? 3.5;

  return Array.from({ length: count }, (_, i) => {
    const seed = i + seedOffset;
    const r1 = seededRandom(seed + 1);
    const r2 = seededRandom(seed + 17);
    const r3 = seededRandom(seed + 41);
    const r4 = seededRandom(seed + 73);
    const r5 = seededRandom(seed + 99);
    const scale = config.scaleMin + r1 * (config.scaleMax - config.scaleMin);
    const spread = config.spreadMin + r3 * (config.spreadMax - config.spreadMin);

    return {
      id: seedOffset + i,
      src: sprites[(seed + i) % sprites.length],
      left: `${0.5 + r2 * 98.5}%`,
      ...(anchor === "top"
        ? { top: `${spread}%`, anchor: "top" as const }
        : { bottom: `${spread}%`, anchor: "bottom" as const }),
      scale,
      z: Math.floor(scale * 10) + (layer === "front" ? 20 : layer === "mid" ? 10 : 0),
      delay: `${(r4 * 5).toFixed(2)}s`,
      duration: `${(4.5 + r5 * 5).toFixed(2)}s`,
      sway: r4 > 0.5 ? "right" : "left",
      bloomDelay: `${(r2 * bloomMax).toFixed(2)}s`,
      layer,
      opacity: config.opacity,
    };
  });
}

type LayerSpec = {
  layer: HimmelFlowerLayer;
  count: number;
  seed: number;
  config: Parameters<typeof buildLayer>[3];
};

const LAYER_SPECS: Record<HimmelFlowerDensity, LayerSpec[]> = {
  full: [
    { layer: "back", count: 36, seed: 0, config: { scaleMin: 0.32, scaleMax: 0.8, spreadMin: 0, spreadMax: 92, opacity: 0.65 } },
    { layer: "mid", count: 34, seed: 200, config: { scaleMin: 0.5, scaleMax: 1.15, spreadMin: 0, spreadMax: 88, opacity: 0.82 } },
    { layer: "front", count: 22, seed: 400, config: { scaleMin: 0.65, scaleMax: 1.4, spreadMin: 0, spreadMax: 78, opacity: 0.96 } },
    { layer: "back", count: 15, seed: 600, config: { scaleMin: 0.28, scaleMax: 0.62, spreadMin: 0, spreadMax: 42, opacity: 0.55, anchor: "top" } },
    { layer: "mid", count: 13, seed: 700, config: { scaleMin: 0.4, scaleMax: 0.9, spreadMin: 0, spreadMax: 38, opacity: 0.7, anchor: "top" } },
  ],
  lite: [
    { layer: "back", count: 28, seed: 0, config: { scaleMin: 0.32, scaleMax: 0.75, spreadMin: 0, spreadMax: 90, opacity: 0.62 } },
    { layer: "mid", count: 24, seed: 200, config: { scaleMin: 0.5, scaleMax: 1.05, spreadMin: 0, spreadMax: 82, opacity: 0.8 } },
    { layer: "front", count: 16, seed: 400, config: { scaleMin: 0.68, scaleMax: 1.25, spreadMin: 0, spreadMax: 72, opacity: 0.94 } },
    { layer: "back", count: 10, seed: 600, config: { scaleMin: 0.28, scaleMax: 0.58, spreadMin: 0, spreadMax: 38, opacity: 0.5, anchor: "top" } },
  ],
};

/** Fixed full-screen meadow — tuned for scroll performance */
export function buildHimmelFlowerField(density: HimmelFlowerDensity = "full") {
  return LAYER_SPECS[density].flatMap(({ layer, count, seed, config }) =>
    buildLayer(layer, count, seed, config)
  );
}

const SECTION_LAYER_SPECS: Record<HimmelFlowerDensity, LayerSpec[]> = {
  full: [
    { layer: "back", count: 10, seed: 0, config: { scaleMin: 0.3, scaleMax: 0.72, spreadMin: 0, spreadMax: 88, opacity: 0.58 } },
    { layer: "mid", count: 8, seed: 40, config: { scaleMin: 0.48, scaleMax: 1.05, spreadMin: 0, spreadMax: 82, opacity: 0.76 } },
    { layer: "front", count: 5, seed: 80, config: { scaleMin: 0.62, scaleMax: 1.2, spreadMin: 0, spreadMax: 68, opacity: 0.9 } },
    { layer: "back", count: 4, seed: 120, config: { scaleMin: 0.26, scaleMax: 0.55, spreadMin: 0, spreadMax: 36, opacity: 0.48, anchor: "top" } },
  ],
  lite: [
    { layer: "back", count: 6, seed: 0, config: { scaleMin: 0.3, scaleMax: 0.68, spreadMin: 0, spreadMax: 85, opacity: 0.55 } },
    { layer: "mid", count: 5, seed: 40, config: { scaleMin: 0.48, scaleMax: 0.95, spreadMin: 0, spreadMax: 78, opacity: 0.72 } },
    { layer: "front", count: 3, seed: 80, config: { scaleMin: 0.62, scaleMax: 1.1, spreadMin: 0, spreadMax: 62, opacity: 0.88 } },
  ],
};

/** Decorative blooms for solid-color section backgrounds */
export function buildHimmelSectionFlowerField(seed: number, density: HimmelFlowerDensity = "full") {
  return SECTION_LAYER_SPECS[density].flatMap(({ layer, count, seed: layerSeed, config }) =>
    buildLayer(layer, count, seed + layerSeed, config)
  );
}

const HERO_LAYER_SPECS: Record<HimmelFlowerDensity, LayerSpec[]> = {
  full: [
    { layer: "back", count: 28, seed: 900, config: { scaleMin: 0.35, scaleMax: 0.82, spreadMin: 0, spreadMax: 94, opacity: 0.68, bloomDelayMax: 2.4 } },
    { layer: "mid", count: 24, seed: 1000, config: { scaleMin: 0.52, scaleMax: 1.18, spreadMin: 0, spreadMax: 88, opacity: 0.85, bloomDelayMax: 2.8 } },
    { layer: "front", count: 16, seed: 1100, config: { scaleMin: 0.7, scaleMax: 1.42, spreadMin: 0, spreadMax: 80, opacity: 0.98, bloomDelayMax: 3.2 } },
    { layer: "back", count: 10, seed: 1200, config: { scaleMin: 0.28, scaleMax: 0.6, spreadMin: 0, spreadMax: 40, opacity: 0.55, anchor: "top", bloomDelayMax: 1.8 } },
  ],
  lite: [
    { layer: "back", count: 16, seed: 900, config: { scaleMin: 0.35, scaleMax: 0.78, spreadMin: 0, spreadMax: 90, opacity: 0.65, bloomDelayMax: 2.2 } },
    { layer: "mid", count: 14, seed: 1000, config: { scaleMin: 0.5, scaleMax: 1.1, spreadMin: 0, spreadMax: 84, opacity: 0.82, bloomDelayMax: 2.6 } },
    { layer: "front", count: 10, seed: 1100, config: { scaleMin: 0.68, scaleMax: 1.3, spreadMin: 0, spreadMax: 74, opacity: 0.95, bloomDelayMax: 3 } },
    { layer: "back", count: 6, seed: 1200, config: { scaleMin: 0.26, scaleMax: 0.55, spreadMin: 0, spreadMax: 38, opacity: 0.5, anchor: "top", bloomDelayMax: 1.6 } },
  ],
};

/** Dense blooming field for the flower-animation hero header */
export function buildHimmelHeroFlowerField(density: HimmelFlowerDensity = "full") {
  return HERO_LAYER_SPECS[density].flatMap(({ layer, count, seed, config }) =>
    buildLayer(layer, count, seed, config)
  );
}

export function buildHimmelPetalDriftItems(density: HimmelFlowerDensity = "full") {
  const count = density === "lite" ? 10 : 16;
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${1 + ((i * 3.2) % 96)}%`,
    delay: `${(i * 0.55) % 7}s`,
    duration: `${11 + (i % 6) * 2.2}s`,
    size: `${22 + (i % 5) * 14}px`,
    rot: `${(i * 37) % 360}deg`,
  }));
}

/** @deprecated Use buildHimmelPetalDriftItems */
export const HIMMEL_PETAL_DRIFT_ITEMS = buildHimmelPetalDriftItems("full");

export function splitFlowerLayers(flowers: HimmelFlowerInstance[]) {
  return {
    backMid: flowers.filter((f) => f.layer !== "front"),
    front: flowers.filter((f) => f.layer === "front"),
  };
}

export function resolveHimmelFlowerDensity(): HimmelFlowerDensity {
  if (typeof window === "undefined") return "lite";
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const lowMemory =
    "deviceMemory" in navigator &&
    ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4;
  const lowCpu = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4;
  return mobile || coarse || lowMemory || lowCpu ? "lite" : "full";
}
