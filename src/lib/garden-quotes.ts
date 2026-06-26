export type GardenQuote = {
  text: string;
  author: string;
};

export const GARDEN_ROMANTIC_QUOTES: GardenQuote[] = [
  {
    text: "Cinta sejati adalah ketika dua jiwa memilih menulis satu cerita indah — berbabak demi babak, tawa demi tawa.",
    author: "Anonim",
  },
  {
    text: "Bukan seberapa sering kita bertemu, melainkan seberapa dalam cinta itu tumbuh setiap kita bersama.",
    author: "Anonim",
  },
  {
    text: "Dalam hatimu aku menemukan rumah; dalam genggamanmu, seluruh dunia terasa tenang.",
    author: "Anonim",
  },
  {
    text: "Dua hati yang saling memilih adalah awal dari segala keajaiban yang akan kita lalui bersama.",
    author: "Anonim",
  },
];

export function pickGardenQuote(seed: string): GardenQuote {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % GARDEN_ROMANTIC_QUOTES.length;
  }
  return GARDEN_ROMANTIC_QUOTES[hash]!;
}
