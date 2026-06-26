const PHANTOM_QUOTES = [
  {
    text: "Anywhere you go, let me go too. Love me — that's all I ask of you.",
    author: "Andrew Lloyd Webber",
  },
  {
    text: "Softly, deftly, secrets shall be told. Music shall caress you, hear it, feel it.",
    author: "The Phantom of the Opera",
  },
  {
    text: "In dreams he came to me, and he spoke to me of music. And in this labyrinth where night is blind, love can only grow.",
    author: "Christine Daaé",
  },
  {
    text: "Past the point of no return — no turning back now. On this strange and endless night.",
    author: "The Phantom of the Opera",
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

export function pickPhantomQuote(seed: string) {
  return PHANTOM_QUOTES[hashSeed(seed) % PHANTOM_QUOTES.length];
}
