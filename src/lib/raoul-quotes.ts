const RAOUL_QUOTES = [
  {
    text: "Think of me, think of me fondly, when we've said goodbye. Remember me once in a while, please promise me you'll try.",
    author: "Christine Daaé",
  },
  {
    text: "Anywhere you go, let me go too. Love me — that's all I ask of you.",
    author: "Raoul de Chagny",
  },
  {
    text: "No more talk of darkness, forget these wide-eyed fears. I'm here, nothing can harm you.",
    author: "Raoul de Chagny",
  },
  {
    text: "Let me be your shelter, let me be your light. You're safe, no one will find you.",
    author: "Raoul de Chagny",
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

export function pickRaoulQuote(seed: string) {
  return RAOUL_QUOTES[hashSeed(seed) % RAOUL_QUOTES.length];
}
