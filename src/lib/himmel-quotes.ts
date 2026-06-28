const HIMMEL_QUOTES = [
  {
    text: "Will you come with me? I want to show you the flowers in my hometown.",
    author: "Himmel",
  },
  {
    text: "Anywhere you go, let me go too. That's all I ask of you.",
    author: "Himmel",
  },
  {
    text: "The time we spent together was like a flower in full bloom.",
    author: "Frieren",
  },
  {
    text: "Even if I forget everything else, I will never forget the journey we shared.",
    author: "Frieren",
  },
] as const;

function hashSeed(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function pickHimmelQuote(seed: string) {
  return HIMMEL_QUOTES[hashSeed(seed) % HIMMEL_QUOTES.length];
}
