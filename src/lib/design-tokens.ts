/** Platform design tokens — single source of truth for /guide and documentation */

export const brandColors = [
  {
    token: "background",
    name: "Background",
    hex: "#FAF8F5",
    cssVar: "--background",
    usage: "Default page background",
  },
  {
    token: "brand-ink",
    name: "Ink",
    hex: "#2E2430",
    cssVar: "--brand-ink",
    usage: "Headings and primary text",
  },
  {
    token: "brand-muted",
    name: "Muted",
    hex: "#746F6A",
    cssVar: "--brand-muted",
    usage: "Secondary text, captions, helper copy",
  },
  {
    token: "brand-amaranth",
    name: "Amaranth",
    hex: "#9B4062",
    cssVar: "--brand-amaranth",
    usage: "Primary actions, links, emphasis",
  },
  {
    token: "brand-amaranth-dark",
    name: "Amaranth Dark",
    hex: "#7F3450",
    cssVar: "--brand-amaranth-dark",
    usage: "Primary button hover, pressed states",
  },
  {
    token: "brand-rose",
    name: "Rose",
    hex: "#C992A8",
    cssVar: "--brand-rose",
    usage: "Soft pink accents, icons, decorative highlights",
  },
  {
    token: "brand-brook",
    name: "Brook",
    hex: "#8FB5A0",
    cssVar: "--brand-brook",
    usage: "Sage green — borders, badges, secondary button border",
  },
  {
    token: "brand-brook-light",
    name: "Brook Light",
    hex: "#D2E9D8",
    cssVar: "--brand-brook-light",
    usage: "Secondary button fill, green-tinted surfaces",
  },
  {
    token: "brand-brook-dark",
    name: "Brook Dark",
    hex: "#3D6B56",
    cssVar: "--brand-brook-dark",
    usage: "Green text on light backgrounds, secondary button label",
  },
  {
    token: "brand-chalk",
    name: "Chalk",
    hex: "#FAF6F0",
    cssVar: "--brand-chalk",
    usage: "Light cream panels, header tint, hover fills",
  },
] as const;
