/** Curated Unsplash photos — stable photo IDs, free license */

export type LandingImage = {
  src: string;
  alt: string;
  credit: { name: string; username: string };
};

function unsplashUrl(photoId: string, width: number) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=80`;
}

export const landingImages = {
  hero: {
    src: unsplashUrl("photo-1519741497674-611481863552", 1920),
    alt: "Buket bunga pernikahan blush dengan cahaya lembut",
    credit: { name: "Annie Spratt", username: "anniespratt" },
  },
  gallery: {
    rings: {
      src: unsplashUrl("photo-1511285560929-80b456fea0bc", 800),
      alt: "Cincin pernikahan di atas buket bunga",
      credit: { name: "Nick Karvounis", username: "nickkarvounis" },
    },
    bouquet: {
      src: unsplashUrl("photo-1492681290082-eaba32ef188c", 800),
      alt: "Buket mawar putih untuk pernikahan",
      credit: { name: "Amy Shamblen", username: "amyshamblen" },
    },
    couple: {
      src: unsplashUrl("photo-1606216794074-735e91aa2c92", 800),
      alt: "Pasangan berpegangan tangan saat pernikahan",
      credit: { name: "Scott Webb", username: "scottwebb" },
    },
    table: {
      src: unsplashUrl("photo-1478147427282-58a87a153769", 800),
      alt: "Dekorasi meja pernikahan dengan bunga dan lilin",
      credit: { name: "Benjamin Wong", username: "bentheman" },
    },
  },
  theme: {
    src: unsplashUrl("photo-1522057385930-fca7c9b1f435", 900),
    alt: "Bunga dan dedaunan dekorasi pernikahan flatlay",
    credit: { name: "Kelly Sikkema", username: "kellysikkema" },
  },
  steps: {
    create: {
      src: unsplashUrl("photo-1469371670803-035ccf25f6b8", 400),
      alt: "Pasangan bahagia di hari pernikahan",
      credit: { name: "Sweet Ice Cream Photography", username: "sweeticecreamlove" },
    },
    customize: {
      src: unsplashUrl("photo-1522673607210-8c0c02420ecb", 400),
      alt: "Detail dekorasi bunga pernikahan",
      credit: { name: "Jon Tyson", username: "jontyson" },
    },
    share: {
      src: unsplashUrl("photo-1511795409834-ef04bbd61622", 400),
      alt: "Suasana resepsi pernikahan yang hangat",
      credit: { name: "Al Elmes", username: "alelmes" },
    },
  },
  cta: {
    src: unsplashUrl("photo-1470229722913-7c0e4dbbafd3", 1920),
    alt: "Latar bunga lembut untuk perayaan pernikahan",
    credit: { name: "Jayson Hinrichsen", username: "jayson_hinrichsen" },
  },
  features: {
    theme: {
      src: unsplashUrl("photo-1606800053565-afa017cc7be2", 600),
      alt: "Buket bunga pernikahan warna pastel",
      credit: { name: "Photos by Lanty", username: "lanty" },
    },
    rsvp: {
      src: unsplashUrl("photo-1519225421980-715cb0215aed", 600),
      alt: "Tamu merayakan di acara pernikahan",
      credit: { name: "Leonard von Bibra", username: "vonbibra" },
    },
  },
} as const;

export function getLandingPhotoCredits() {
  const seen = new Map<string, { name: string; username: string }>();

  function add(img: LandingImage) {
    if (!seen.has(img.credit.username)) {
      seen.set(img.credit.username, img.credit);
    }
  }

  add(landingImages.hero);
  add(landingImages.theme);
  add(landingImages.cta);
  Object.values(landingImages.gallery).forEach(add);
  Object.values(landingImages.steps).forEach(add);
  Object.values(landingImages.features).forEach(add);

  return Array.from(seen.values());
}
